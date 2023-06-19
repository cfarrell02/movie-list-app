import React, { useRef, useState , useEffect} from 'react';
import MovieTableRow from '../movieTableRow';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Paper,
  CircularProgress,
  TablePagination,
  TextField,
  Rating,
  Slider,
  Chip,
  Stack,
  Select,
  Switch,
  Grid,
  Alert,
  InputAdornment
} from '@mui/material';
import { ArrowUpward, ArrowDownward, Filter, Label } from '@mui/icons-material';
import { orderBy } from 'lodash';

const MovieTable = ({ movies, deleteMovie, editMovie, loading, accessType}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [field, setField] = useState('release_date');
  const [operator, setOperator] = useState('=');
  const [value, setValue] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filters, setFilters] = useState([]);
  const [alertInfo, setAlertInfo] = useState({ type: '', body: '' });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  
    const handleSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };
  
    const sortedMovies = orderBy(movies, [sortConfig.key], [sortConfig.direction]);
  
    const getSortIcon = (key) => {
      if (sortConfig.key === key) {
        return sortConfig.direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />;
      }
      return null;
    };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (filters && filters.length > 0) {
      let filteredMovies = [...sortedMovies];
      filters.forEach((filter) => {
        filteredMovies = filteredMovies.filter((movie) => {
          let value = filter.field === 'release_date' ? movie[filter.field].substring(0,4) :  movie[filter.field];
          if (filter.operator === '=') {
            return  value == filter.value;
          } else if (filter.operator === '<') {
            return value < filter.value;
          } else if (filter.operator === '>') {
            return value > filter.value;
          }
          return true;
        });
      });
      setFilteredMovies(filteredMovies);
    } else {
      setFilteredMovies([]);
    }
  }, [filters]);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    console.log(searchTerm);
    if(term === '') {
      setSearchResults([]);
      return;
    }
    const filteredMovies = movies.filter((movie) => {
      return movie.title.toLowerCase().includes(term.toLowerCase());
    });

    setSearchResults(filteredMovies);
  }
    

  const startRowIndex = page * rowsPerPage;
  const endRowIndex = startRowIndex + rowsPerPage;
  const paginatedMovies = sortedMovies.slice(startRowIndex, endRowIndex);

  useEffect(() => {
    if(field === 'watched'){
    setOperator('=');
    }
  }, [field]);

  const renderOperatorOptions = () => {
    if (field === 'watched') {
      return (
        <>
          <option value="=">=</option>
        </>
      );
    } else {
      return (
        <>
          <option value="=">=</option>
          <option value="<">&lt;</option>
          <option value=">">&gt;</option>
        </>
      );
    }
  };

  const renderFilterValueInput = () => {
    console.log(field);
    if (field === 'watched') {
        return (
          <Switch onChange={(e) => setValue(e.target.checked)}
          size='large'/>
        );
        }else if(field === 'release_date'){
          return (
            <TextField onChange={(e) => setValue(e.target.value)}
            label='Year'
            />
          );
        }else if(field === 'runtime'){
      
          return (
            <div style={{ marginTop: '16px' }}>
              <Slider
                onChange={(e, newValue) => setValue(newValue)}
                min={1}
                max={240}
                valueLabelDisplay="on"
              />
            </div>
          );
        }else {
          return (
            <TextField onChange={(e) => setValue(e.target.value)}
            label='Rating'
            InputProps={{
              endAdornment: <InputAdornment position="start">/10</InputAdornment>,
            }}
            />
          );
        }
  };
        
  
  
  
  const handleFilter = () => {
    if(filters.length >=6){
      setAlertInfo({ type: 'error', body: 'You can only have 6 filters at a time' });
      return;
    }
      const newFilter = {field: field, operator: operator, value: value, label: `${field} ${operator} ${value}`};
      
      setFilters([...filters, newFilter]);
  };

  const handleDelete = (index) => {
    setAlertInfo({ type: '', body: '' });
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  }
  
  

  return (
    <TableContainer component={Paper}>
    <Grid container spacing={2} sx={{ p: 2 }} alignItems="center">
      <Grid item xs={6} align="left">
        <TextField
          variant="outlined"
          margin="normal"
          label="Search Title"
          fullWidth
          onChange={handleSearch}
        />
      </Grid>
      <Grid item xs={2}>
        <Select
          native
          label="Field"
          sx={{ marginTop: '8px' }}
          onChange={(e) => setField(e.target.value)}
          fullWidth
          inputProps={{
            name: 'field',
            id: 'field-select',
          }}
        >
          <option value="release_date">Release Date</option>
          <option value="vote_average">Rating</option>
          <option value="runtime">Runtime</option>
          <option value="watched">Watched</option>
        </Select>
      </Grid>
      <Grid item xs={1}>
        <Select
          native
          sx={{ marginTop: '8px' }}
          label="Operator"
          onChange={(e) => setOperator(e.target.value)}
          fullWidth
        >
          {renderOperatorOptions()}
        </Select>
      </Grid>
      <Grid item xs={2} sx={{ marginTop: '8px' }}>
        {renderFilterValueInput()}
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained" color="primary" onClick={handleFilter}>
          Filter
        </Button>
      </Grid>
    </Grid>
      <Stack direction="row" spacing={1} justifyContent="center">
        {filters.map((filter, index) => (
          <Chip label={filter.label} variant="outlined" onDelete={() => handleDelete(index)} key={index}/>
        ))}
    </Stack>
    {alertInfo.body !== '' ?
    <Alert severity={alertInfo.type} sx={{ margin: '4px', }}>
      {alertInfo.body}
    </Alert>
    : null}
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
          <TableRow align="left">
          <TableCell >
              <Typography variant="subtitle2" component="div">
                Poster
              </Typography>
            </TableCell>
            <TableCell onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Title {getSortIcon('title')}
              </Typography>
            </TableCell>
            <TableCell align="center" >
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Tagline 
              </Typography>
            </TableCell>
            <TableCell align="right" onClick={() => handleSort('release_date')} style={{ cursor: 'pointer'}} >
            <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
            Release{"\u00A0"}Date {getSortIcon('release_date')}
          </Typography>

            </TableCell>
            <TableCell align="right" onClick={() => handleSort('vote_average')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Rating {getSortIcon('vote_average')}
              </Typography>
            </TableCell>
            <TableCell align="right" onClick={() => handleSort('runtime')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Runtime {getSortIcon('runtime')}
              </Typography>
            </TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell align="center" colSpan={6}>
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : (
            filters.length!== 0 && filteredMovies ?
            filteredMovies.map((movie) => (
              <MovieTableRow
                handleDelete={deleteMovie}
                handleEdit={editMovie}        //Filtered Movies
                key={movie.id}
                movie={movie}
                accessType={accessType}
              />
            ))
            
            :(
            searchTerm.length===0 ?

            paginatedMovies.map((movie) => (
              <MovieTableRow
                handleDelete={deleteMovie}
                handleEdit={editMovie}   // Non Filtered Movies
                key={movie.id}
                movie={movie}
                accessType={accessType}
              />
            ))
            : searchResults.length!==0 ? 
            (
            searchResults.map((movie) => (
              <MovieTableRow
              handleDelete={(movie) => {      // Search Results
                deleteMovie(movie);
                if(searchResults.includes(movie)) {
                  setSearchResults(searchResults.filter((item) => item.id !== movie.id));
                }
              }}
              handleEdit={editMovie}
              key={movie.id}
              movie={movie}
              accessType={accessType}
            />
            
            )) 
            ) : 
            <TableCell align="center" colSpan={6}>
            <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}> 
            No results found
          </Typography>
          </TableCell>
            )

          )}
        </TableBody>
      </Table>
     {searchTerm.length===0 && filters.length === 0 ? (
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={movies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
     ): null
     }
    </TableContainer>
  );
};

export default MovieTable;

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
import { AlertContext } from '../../../contexts/alertContext';
import Checkbox from '@mui/material/Checkbox';

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
  const {addAlert} = React.useContext(AlertContext);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    sortConfig.direction = 'asc';
    sortConfig.key = 'addedDate';
    handleSort('addedDate');
  }, []);

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
        return sortConfig.direction === 'asc' ? <ArrowUpward style={{ fontSize: 'inherit' }}/> : <ArrowDownward style={{ fontSize: 'inherit' }}/>;
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
          let value = filter.field === 'release_date' || field === 'addedDate' ? movie[filter.field].substring(0,4) :  movie[filter.field];
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
        }else if(field === 'release_date' || field === 'addedDate'){
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
      addAlert('error', 'You can only have 6 filters at a time.');
      return;
    }
      const newFilter = {field: field, operator: operator, value: value, label: `${field} ${operator} ${value}`};
      
      setFilters([...filters, newFilter]);
  };

  const handleDelete = (index) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  }
  
  

  return (
    <TableContainer component={Paper}>
    <Grid container spacing={2} sx={{ p: 2 }} alignItems="center">
      <Grid item xs={8} align="left">
        <TextField
          variant="outlined"
          margin="normal"
          label="Search Title"
          fullWidth
          onChange={handleSearch}
        />
      </Grid>
      <Grid item xs={4} align="centre">
        <Typography variant="subtitle2" component="div">
          Show watched movies</Typography>
        <Checkbox defaultChecked={true}
        value={!filters.some((filter) => filter.label === 'watched = true')}
          onChange={(e) => {
            if(!e.target.checked){
              setFilters([...filters, {field: 'watched', operator: '=', value: false, label: 'watched = true'}]);
            }else{
              setFilters(filters.filter((filter) => filter.label !== 'watched = true'));
            }
          }}
        />


          
      </Grid>


  

    </Grid>
      {/* <Stack direction="row" spacing={1} justifyContent="center">
        {filters.map((filter, index) => (
          <Chip label={filter.label} variant="outlined" onDelete={() => handleDelete(index)} key={index}/>
        ))}
    </Stack> */}
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
          <TableRow align="left">
          <TableCell >
              <Typography align="center" variant="subtitle2" component="div">
                Poster
              </Typography>
            </TableCell>
            <TableCell align="center" onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Title {getSortIcon('title')}
              </Typography>
            </TableCell>
            <TableCell align="center" onClick={() => handleSort('release_date')} style={{ cursor: 'pointer'}} >
            <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
            Released {getSortIcon('release_date')}
          </Typography>
          </TableCell>
            <TableCell align="center" onClick={() => handleSort('vote_average')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Rating {getSortIcon('vote_average')}
              </Typography>
            </TableCell>
            <TableCell align="center" onClick={() => handleSort('runtime')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Runtime {getSortIcon('runtime')}
              </Typography>
            </TableCell>
            <TableCell align="center" onClick={() => handleSort('addedDate')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Added {getSortIcon('addedDate')}
              </Typography>
            </TableCell>
            <TableCell align="center"></TableCell>
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
        rowsPerPageOptions={[10, 25, 50, movies.length]}
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

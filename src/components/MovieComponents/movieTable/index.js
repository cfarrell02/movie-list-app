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
  useMediaQuery,
  InputAdornment
} from '@mui/material';
import { ArrowUpward, ArrowDownward, Filter, Label, Refresh } from '@mui/icons-material';
import { orderBy } from 'lodash';
import { AlertContext } from '../../../contexts/alertContext';
import Checkbox from '@mui/material/Checkbox';

const MovieTable = ({ movies, deleteMovie, editMovie, loading, accessType}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [field, setField] = useState('release_date');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filters, setFilters] = useState([]);
  const {addAlert} = React.useContext(AlertContext);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [rows, setRows] = useState([]);

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

  useEffect(() => {
    setRows(movies.map((movie) => {
      return {id: movie.id , isSelected: false};
    }));
  }, [movies]);


 const handleRowSelection = (isSelected, movieId) => {
    rows.find((row) => row.id === movieId).isSelected = isSelected;	
  };


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




  return (
    <TableContainer component={Paper}>
    <Grid container spacing={2} sx={{ p: 2 }} alignItems="center">
      <Grid item sm={9} xs={12} align="left">
        <TextField
          variant="outlined"
          margin="normal"
          label="Search Title"
          fullWidth
          onChange={handleSearch}
        />
      </Grid>



      <Grid item sm={3} xs={12} align="centre">
        <Typography variant="subtitle2" component="div">
          Show watched movies</Typography>
        <Checkbox defaultChecked={true}
        value={!filters.some((filter) => filter.label === 'watched = false')}
          onChange={(e) => {
            if(!e.target.checked){
              setFilters([...filters, {field: 'watched', operator: '=', value: false, label: 'watched = false'}]);
            }else{
              setFilters(filters.filter((filter) => filter.label !== 'watched = false'));
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
      <Table sx={{ minWidth: isMobile ? 0 : 650 }} aria-label="simple table">
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
            {isMobile ? null : ( <>
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
            </>)}
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
            filteredMovies.map((movie, index) => (
              <MovieTableRow
                handleDelete={deleteMovie}
                handleEdit={editMovie}        //Filtered Movies
                key={movie.id}
                movie={movie}
                accessType={accessType}
                isSelected = {rows[index] && rows[index].isSelected}
                handleSelectedChange={handleRowSelection}
              />
            ))
            
            :(
            searchTerm.length===0 ?

            paginatedMovies.map((movie, index) => (
              <MovieTableRow
                handleDelete={deleteMovie}
                handleEdit={editMovie}   // Non Filtered Movies
                key={movie.id}
                movie={movie}
                accessType={accessType}
                isSelected = {rows[index] && rows[index].isSelected}
                handleSelectedChange={handleRowSelection}
              />
            ))
            : searchResults.length!==0 ? 
            (
            searchResults.map((movie, index) => (
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
              isSelected = {rows[index] && rows[index].isSelected}
              handleSelectedChange={handleRowSelection}
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
        rowsPerPageOptions={[10, 25, 50, { label: 'All', value: movies.length }]}
        component="div"
        count={movies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={isMobile ? 'Movies' : 'Movies per page'}
      />
     ): null
     }
    </TableContainer>
  );
};

export default MovieTable;

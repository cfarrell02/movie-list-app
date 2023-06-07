import React, { useState } from 'react';
import MovieTableRow from '../movieTableRow';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  CircularProgress,
  TablePagination,
  TextField,
  Select,
  Grid
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { orderBy } from 'lodash';

const MovieTable = ({ movies, deleteMovie, editMovie, loading }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchResults, setSearchResults] = useState([]);

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

  const handleSearch = (event) => {
    const term = event.target.value;
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
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={6} align="left">
      <TextField
        variant="outlined"
        margin="normal"
        label="Search Title"
        fullWidth
        onChange={handleSearch}
        />
        </Grid>
        <Grid item xs={6} align="center" alignItems="flex-end">
<Grid container justifyContent="center" alignItems="flex-end" spacing={2}>
  <Grid item xs={4}  sx={{marginBottom:"8px"}}>
    <Select
      disabled
      native
      label="Field"
      fullWidth
      inputProps={{
        name: "field",
        id: "field-select",
      }}
    >
      <option value="title">Title</option>
      <option value="releaseDate">Release Date</option>
      <option value="rating">Rating</option>
      <option value="runtime">Runtime</option>
      <option value="watched">Watched</option>
    </Select>
  </Grid>
  <Grid item xs={2} sx={{marginBottom:"8px"}}>
    <Select
      disabled
      native
      label="Operator"
      fullWidth
      inputProps={{
        name: "operator",
        id: "operator-select",
      }}
    >
      <option value="=">=</option>
      <option value=">"></option>
      <option value="<">&lt;</option>
    </Select>
  </Grid>
  <Grid item xs={4}>
    <TextField disabled variant="outlined" margin="normal" label="Value" fullWidth />
  </Grid>
</Grid>





        </Grid>
      </Grid>
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
            searchResults.length != 0 ?
            searchResults.map((movie) => (
              <MovieTableRow
              handleDelete={deleteMovie}
              handleEdit={editMovie}
              key={movie.id}
              movie={movie}
            />
            )) :
            paginatedMovies.map((movie) => (
              <MovieTableRow
                handleDelete={deleteMovie}
                handleEdit={editMovie}
                key={movie.id}
                movie={movie}
              />
            ))
          )}
        </TableBody>
      </Table>
     {searchResults.length != 0 ? null : (
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={movies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
     )
     }
    </TableContainer>
  );
};

export default MovieTable;

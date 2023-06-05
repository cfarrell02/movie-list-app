import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton} from '@mui/material';
import MovieTableRow from '../movieTableRow';


const MovieTable = ({ movies, deleteMovie, editMovie}) => {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="center">Tagline</TableCell>
            <TableCell align="right">Release Date</TableCell>
            <TableCell align="right">Rating</TableCell>
            <TableCell align="right">Runtime</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movies.map((movie) => (
            <MovieTableRow 
            handleDelete={deleteMovie}
            handleEdit={editMovie}
            key={movie.id} movie={movie} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MovieTable;

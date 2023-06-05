import React from 'react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton} from '@mui/material';
import { dateFormatter } from '../../../utils';
import DeleteIcon from '@mui/icons-material/Delete';

const MovieTableRow = ({movie, handleDelete, handleEdit}) => {

    const [watched, setWatched] = useState(movie.watched);

    const handleCheckboxChange = (event) => {
      setWatched(event.target.checked); 
      let newMovie = {...movie};
      newMovie.watched = event.target.checked;
        handleEdit(newMovie);
    };

    return (
        <TableRow key={movie.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {movie.title}
              </TableCell>
              <TableCell align="center">
                {movie.tagline}
              </TableCell>
              <TableCell align="right">{dateFormatter(movie.release_date)} </TableCell>
              <TableCell align="right">{movie.vote_average}</TableCell>
              <TableCell align="right">{movie.runtime}</TableCell>
              <TableCell align="right"><Checkbox checked={watched} onChange={handleCheckboxChange} title='Watched?' /> 
              <IconButton aria-label="delete" onClick={() => handleDelete(movie)} >
                <DeleteIcon/>
                </IconButton>
              </TableCell>
            </TableRow>
    )
};

export default MovieTableRow;
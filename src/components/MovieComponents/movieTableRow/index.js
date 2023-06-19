import React from 'react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton} from '@mui/material';
import { dateFormatter } from '../../../utils';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const MovieTableRow = ({movie, handleDelete, handleEdit, accessType}) => {

    const [watched, setWatched] = useState(movie.watched);

    const handleCheckboxChange = (event) => {
      setWatched(event.target.checked); 
      let newMovie = {...movie};
      newMovie.watched = event.target.checked;
        handleEdit(newMovie);
    };

    return (
        <TableRow key={movie.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{maxHeight:"100px" }}/>
              </TableCell>
              <TableCell component="th" scope="row" >
                {movie.title}
              </TableCell>
              <TableCell align="center">
                {movie.tagline}
              </TableCell>
              <TableCell align="right">{dateFormatter(movie.release_date)} </TableCell>
              <TableCell align="right">{movie.vote_average}</TableCell>
              <TableCell align="right">{movie.runtime}</TableCell>
              <TableCell align="right">
                {accessType === 0 ? null : (
                  <>
              <Checkbox checked={watched} 
              icon={<VisibilityOutlinedIcon />}
              checkedIcon={<VisibilityIcon />}
              onChange={handleCheckboxChange} title='Watched?' /> 
              <IconButton aria-label="delete" onClick={() => handleDelete(movie)} >
                <DeleteIcon/>
                </IconButton>
                </>
                )}
              </TableCell>
            </TableRow>
    )
};

export default MovieTableRow;
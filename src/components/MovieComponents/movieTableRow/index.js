import React from 'react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton, Rating, Tooltip, Button, ButtonGroup, Link} from '@mui/material';
import { dateFormatter, timeFormatter, dateReadableFormatter} from '../../../utils';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { getUserById } from '../../../api/userDataStorage';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


const MovieTableRow = ({movie, handleDelete, handleEdit, accessType}) => {

    const [watched, setWatched] = useState(movie.watched);
    const [addedByUser, setAddedByUser] = useState({});

    useState(() => {
      const fetchUser = async () => {
        try {
          const user = await getUserById(movie.addedBy);
          setAddedByUser(user);
        } catch (error) {
          console.error('Error getting user:', error);
        }
      };
      fetchUser();
    }, []);

    const handleCheckboxChange = (event) => {
      setWatched(event.target.checked); 
      let newMovie = {...movie};
      newMovie.watched = event.target.checked;
        handleEdit(newMovie);
    };

    return (
        <TableRow key={movie.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{maxHeight:"120px" }}/>
              </TableCell>
              <TableCell align='center' component="th" scope="row" >
                <a href={`/movie/${movie.id}`} style={{textDecoration:"none", color:"black"}}>{movie.title}</a><br/>
              </TableCell>
              <TableCell align="right">{new Date(movie.release_date).getFullYear()} </TableCell>
              <Tooltip title={movie.vote_average+'/10'} placement="top"><TableCell align="right"><Rating precision={0.25} name="read-only" value={movie.vote_average/2} readOnly /></TableCell></Tooltip>
              <TableCell align="right" >
                {movie.runtime} <AccessTimeIcon style={{ fontSize: 'inherit' }} />
              </TableCell>
              <TableCell align="center">{addedByUser.firstName}<br/>{dateReadableFormatter(movie.addedDate)}</TableCell>
              <TableCell align="right">
                {accessType === 0 ? null : (
                  <>
              <Checkbox checked={watched} 
              icon={<VisibilityOutlinedIcon />}
              checkedIcon={<VisibilityIcon />}
              onChange={handleCheckboxChange} title='Watched?' /> 
              <IconButton aria-label="delete" onClick={() => handleDelete(movie)} title='Delete?' >
                <DeleteIcon/>
                </IconButton>
                </>
                )}
              </TableCell>
            </TableRow>
    )
};

export default MovieTableRow;
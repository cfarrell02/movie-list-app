import React, { useEffect } from 'react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton, Rating, Tooltip, Button, useMediaQuery, Link} from '@mui/material';
import { dateFormatter, timeFormatter, dateReadableFormatter} from '../../../utils';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { getUserById } from '../../../api/userDataStorage';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../../../images/default.jpg';



const TVTableRow = ({tv, handleDelete, handleEdit, accessType}) => {

    const [watched, setWatched] = useState(tv.watched);
    const [addedByUser, setAddedByUser] = useState({});
    const [imageSrc, setImageSrc] = useState('');
    const [runtime, setRuntime] = useState('');
    const isMobile = useMediaQuery('(max-width:600px)');
    const navigate = useNavigate();

    useEffect(() => {
      const imageSrc = tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : defaultImage;
      setImageSrc(imageSrc);

      const runtime = (tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : '') +  (tv.last_air_date ? ` - ${new Date(tv.last_air_date).getFullYear()}` : '');
      setRuntime(runtime);
    }, []);

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const user = await getUserById(tv.addedBy);
          setAddedByUser(user);
        } catch (error) {
          console.error('Error getting user:', error);
        }
      };
      fetchUser();
    }, []);

    const handleCheckboxChange = (event) => {
      setWatched(event.target.checked); 
      let newTV = {...tv};
      newTV.watched = event.target.checked;
        handleEdit(newTV);
    };

    return (
      <TableRow key={tv.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell>
          <img src={imageSrc} alt={tv.name} style={{maxHeight:"120px" }}/>
          </TableCell>
          <TableCell align='center' component="th" scope="row" >
          <Link href={`/tvshow/${tv.id}`} onClick={(e) => {e.preventDefault(); navigate(`/tvshow/${tv.id}`);}}>{tv.name}</Link>
          </TableCell>
          {isMobile ? null : (<>
          <TableCell align="center">{runtime ? runtime : '-'}</TableCell>
          {tv.vote_average ?
          <Tooltip title={tv.vote_average+'/10'} placement="top"><TableCell align="center"><Rating precision={0.25} name="read-only" value={tv.vote_average/2} readOnly /></TableCell></Tooltip>
          : <TableCell align="center">-</TableCell>}

          <TableCell align="center" >
          {tv.seasons ? tv.seasons.length : '-'}  
          </TableCell>
          <TableCell align="center">{addedByUser.firstName}<br/>{dateReadableFormatter(tv.addedDate)}</TableCell>
          </>)}
          <TableCell align="right">
          {accessType === 0 ? null : (
            <>
          <Checkbox checked={watched} 
          icon={<VisibilityOutlinedIcon />}
          checkedIcon={<VisibilityIcon />}
          onChange={handleCheckboxChange} title='Watched?' /> 
          <IconButton aria-label="delete" onClick={() => handleDelete(tv)} title='Delete?' >
          <DeleteIcon/>
          </IconButton>
          </>
          )}
          </TableCell>
        </TableRow>
    )
};

export default TVTableRow;

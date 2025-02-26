import React, { useEffect } from 'react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton, Rating, Tooltip, Button, useMediaQuery, Link, Select, MenuItem, Container} from '@mui/material';
import { dateFormatter, timeFormatter, dateReadableFormatter} from '../../../utils';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getUserById } from '../../../api/userDataStorage';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../../../images/default.jpg';
import { Margin } from '@mui/icons-material';



const TVTableRow = ({tv, handleDelete, handleEdit, accessType}) => {

    const [watched, setWatched] = useState(tv.watched);
    const [addedByUser, setAddedByUser] = useState({});
    const [imageSrc, setImageSrc] = useState('');
    const [runtime, setRuntime] = useState('');
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(min-width:601px) and (max-width:900px)');
    const navigate = useNavigate();

    useEffect(() => {
      const imageSrc = tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : defaultImage;
      setImageSrc(imageSrc);

      const first_air_year = tv.first_air_date && new Date(tv.first_air_date).getFullYear();
      const last_air_year = tv.in_production ? 'Present' : tv.last_air_date && new Date(tv.last_air_date).getFullYear();
      
      const runtime = first_air_year !== last_air_year ? `${first_air_year} - ${last_air_year}` : first_air_year;
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


    const handleWatchedSelectChange = (event) => {
      setWatched(event.target.value);
      let newTV = {...tv};
      newTV.watched = event.target.value;
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
          {!isTablet && 
          <TableCell align="center" >
          {tv.seasons ? tv.seasons.length : '-'}  
          </TableCell>
          }
          <TableCell align="center">{addedByUser.firstName}<br/>{dateReadableFormatter(tv.addedDate)}</TableCell>
          </>)}
          <TableCell align="right">
          {accessType === 0 ? null : (
            <Container
  sx={{
    display: 'flex',
    alignItems: 'end',
    gap: 1, // Adds a small space between buttons
  }}
>
  <Select
    value={watched}
    onChange={handleWatchedSelectChange}
    variant="standard"
    disableUnderline
    IconComponent={() => null}
    displayEmpty
    title='Watched?'
    sx={{
      width: 'auto',
      height: 'auto',
      minWidth: 'unset',
      border: 'none',
      p: 0,
      m: 0,
      pr: 0,
      '& .MuiSelect-select': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 0,
        m: 0,
        pr: '0 !important',
      },
    }}
  >
    <MenuItem value={0} sx={{ p: 0, m: '.5em' }} title="Not watched">
      <VisibilityOffIcon sx={{ color: 'error.main' }} />
    </MenuItem>
    <MenuItem value={1} sx={{ p: 0, m: '.5em' }} title="Watching">
      <PlayCircleIcon sx={{ color: 'primary.main' }} />
    </MenuItem>
    <MenuItem value={2} sx={{ p: 0, m: '.5em' }} title="Watched">
      <VisibilityIcon sx={{ color: 'primary.main' }} />
    </MenuItem>
  </Select>

  <IconButton
    aria-label="delete"
    onClick={() => handleDelete(tv)}
    title="Delete?"
    sx={{
      p: 0, // Remove padding to match icon-only select
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <DeleteIcon />
  </IconButton>
</Container>

          )}
          </TableCell>
        </TableRow>
    )
};

export default TVTableRow;

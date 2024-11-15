// MovieAdd.js

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  CircularProgress,
  ListItemText,
  IconButton,
  ButtonGroup,
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUserById, getAllUsers } from '../../../api/userDataStorage';
import { updateMovieList } from '../../../api/movieStorage';
import { getUserRoles } from '../../../utils';
import { auth } from '../../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import {convertArrayOfObjectsToCSV} from '../../../utils';
import { AlertContext } from '../../../contexts/alertContext';

const MovieListSettings = ({ movieList, setMovieList }) => {
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState({});
  const [searchedUser, setSearchedUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [movieListTitle, setMovieListTitle] = useState(movieList.title);
  const [accessType, setAccessType] = useState(0);
  const { addAlert } = React.useContext(AlertContext);
  const navigate = useNavigate();

  useEffect(() => {
    try{
      setUsers(movieList.users);
    } catch (error) {
        console.log('Error setting users:', error);
        }
        
  }, [movieList]);

  useEffect(() => {
    try{
    if(user && movieList.users){
      const userAccess = movieList.users.find((u) => u.uid === user.uid);
      if(userAccess){
      setAccessType(userAccess.accessType);
      }
    }
  } catch (error) {
    console.error('Error getting watch lists:', error);
  }
  }, [user, movieList.users]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdateListTitle = async (title) => {
    try {
      if (!title) {
        throw new Error('Invalid title.');
      }
      const updatedMovieList = { ...movieList, title };
      await updateMovieList(updatedMovieList.id, updatedMovieList);
      setMovieList(updatedMovieList);
      addAlert('success', 'Watch List title updated.');
    } catch (error) {
      console.error('Error updating watch list title:', error);
      addAlert('error', 'Error updating watch list title.');
    }
  };



  const handleSearchUsers = async (searchedName) => {
    try {
      setIsLoading(true);
      const users = await getAllUsers();
      const results = users.filter(
        (user) =>
          user.email.includes(searchedName) ||
          user.firstName.includes(searchedName) ||
          user.lastName.includes(searchedName)
      );
      setSearchResults(results);
      setIsLoading(false);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleAddUserToMovieList = async (userID) => {
    try {
      if (!userID) {
        throw new Error('Invalid user ID.');
      }
  
      if (movieList.userIds.includes(userID)) {
        throw new Error('User already added to watch list.');
      }
  
      const user = await getUserById(userID);
  
      const updatedUsers = [
        ...movieList.users,
        { uid: userID, accessType: 0, email: user.email },
      ];
      const updatedUserIds = [...movieList.userIds, userID];
      const updatedMovieList = { ...movieList, users: updatedUsers, userIds: updatedUserIds };
  
      setUsers(updatedUsers);
      await updateMovieList(updatedMovieList.id, updatedMovieList);
      setMovieList(updatedMovieList);
      addAlert('success', `User ${user.email} added to watch list.`);
    } catch (error) {
      addAlert('error', error.message);
    }
  };
  
  
  const handleUpdateUserAccessType = async (userID, accessType) => {
    try {
      if (accessType < 0 || accessType >= 3) {
        throw new Error('Invalid access type.');
      }
      const user = users.find((u) => u.uid === userID);
      const userIndex = movieList.userIds.indexOf(userID);
      const updatedUsers = users.map((user, index) => {
        if (index === userIndex) {
          return { ...user, accessType: accessType };
        }
        return user;
      });
      setUsers(updatedUsers);
      const updatedMovieList = { ...movieList, users: updatedUsers, userIds: movieList.userIds };
      setMovieList(updatedMovieList);
        
      await updateMovieList(movieList.id, updatedMovieList);
      addAlert('success', `User ${user.email} access type updated to ${getUserRoles(accessType)}.`);
    } catch (error) {
      addAlert('error', error.message);
    }
  };
  

  const handleRemoveUserFromMovieList = async (userID) => {
    try {
      // const user = users.find((u) => u.uid === userID);
      const userIndex = movieList.userIds.indexOf(userID);
      const updatedUsers = [...users];
      updatedUsers.splice(userIndex, 1);
      const updatedUserIds = movieList.userIds.filter((id) => id != userID);
      const updatedMovieList = { ...movieList, users: updatedUsers, userIds: updatedUserIds };
      setUsers(updatedUsers);
      await updateMovieList(updatedMovieList.id, updatedMovieList);
      setMovieList(updatedMovieList);
      addAlert('info', `User ${user.email} removed from watch list.`);
      if(user.uid === userID){
        navigate('/movielist');
      }
      // Update the logic for navigating to '/movielist' based on your requirements
    } catch (error) {
      addAlert('error', error.message);
    }
  };
  
  const handleExportMovieList = async () => {
    try {
      const keys = ["poster_path", "title", "tagline", "release_date", "vote_average", "runtime", "watched", "addedDate", "addedBy", 'id']
      const movieListCSV = convertArrayOfObjectsToCSV(movieList.movies, keys);
      const blob = new Blob([movieListCSV], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${movieList.title}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting watch list:', error);
    }
  };
  

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Watch List Settings
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography variant="h5" component="h3" gutterBottom>
            Export/Import Watch List
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
    <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
              <Button variant="contained" color="primary" onClick={() => handleExportMovieList(movieList)}>
                Export Watch List
              </Button>

              <Button variant="contained" color="primary" disabled>
                Import Watch List
              </Button>
            </ButtonGroup>
 
            </AccordionDetails>
              
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography variant="h5" component="h3" gutterBottom>
            Watch List Name
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ margin: '1em', borderRadius: '5px' }}>
          <TextField
            id="outlined-basic"
            label="New Watch List Title"
            value={movieListTitle}
            disabled={accessType === 0}
            variant="outlined"
            onChange={(event) => setMovieListTitle(event.target.value)}
            onSubmit={() => handleUpdateListTitle(movieListTitle)}
          />
          </Grid>
          <Grid item xs={12} sx={{ margin: '1em', borderRadius: '5px'}}>
          <Button
            variant="contained"
            color="primary"
            disabled={accessType === 0}
            onClick={() => handleUpdateListTitle(movieListTitle)}
          >
            Update Title
          </Button>
          </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography variant="h5" component="h3" gutterBottom>
            Manage Users
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={6} sx={{ margin: '1em', borderRadius: '5px', border: '1px solid lightgrey' }}>
              <List>
                {!users ? <CircularProgress />  : 
                users.map((user1) => (
                  <ListItem key={user1.uid}>
                    <ListItemText primary={user1.email} />
                    <ListItemText primary={getUserRoles(user1.accessType)} />
                    {user1.accessType === 3||
                    accessType < 2 ||
                    (accessType === 2 && user1.accessType === 2 && user.uid !== user1.uid) ? null : (
                      <>
                        
                        <IconButton
                          edge="end"
                          aria-label="upgrade"
                          disabled={user1.accessType === 2}
                          onClick={() => handleUpdateUserAccessType(user1.uid, parseInt(user1.accessType) + 1)}
                        >
                          <ArrowDropUpIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="downgrade"
                          disabled={user1.accessType === 0}
                          onClick={() => handleUpdateUserAccessType(user1.uid, parseInt(user1.accessType) - 1)}
                        >
                          <ArrowDropDownIcon />
                        </IconButton>
                        </>
                    )}
                    {user1.accessType === 3 ||
                    accessType < 2 ||
                    (accessType === 2 && user1.accessType === 2 && user.uid !== user1.uid)  ? null : (
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveUserFromMovieList(user1.uid)}
                        >
                          <DeleteIcon />
                        </IconButton>
                    )}
                 
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid
              item
              xs={5}
              alignContent="center"
              alignItems="center"
              sx={{
                margin: '1em',
                borderRadius: '5px',
                border: '1px solid lightgrey',
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Autocomplete
                    id="search-results"
                    options={searchResults}
                    getOptionLabel={(user) => user.email}
                    loading={isLoading}
                    onChange={(event, value) => setSearchedUser(value)}
                    disabled={accessType < 2}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={(event) => handleSearchUsers(event.target.value)}
                        label="Search Users"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={() => handleAddUserToMovieList(searchedUser.id)}
                    sx={{ marginTop: '1em', marginBottom: '2em' }}
                    disabled={accessType < 2}
                  >
                    Add User
                  </Button>
                </Grid>
              </Grid>
            </Grid>

          
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default MovieListSettings;

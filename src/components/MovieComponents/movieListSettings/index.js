// MovieAdd.js

import React, { useState, useEffect } from 'react';
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
  Select,
  ListItemText,
  IconButton,
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUserById, getAllUsers } from '../../../api/userDataStorage';
import { updateMovieList } from '../../../api/movieStorage';
import { getUserRoles } from '../../../utils';
import { auth } from '../../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const MovieListSettings = ({ movieList }) => {
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', body: '' });
  const navigate = useNavigate();
  const [accessLevel, setAccessLevel] = useState(0);

  useEffect(() => {
    // Only update the state if the movieList.users is defined
    try{
    
      setUsers(movieList.users);
      const accessLevel = movieList.users.find((u) => u.id === user.id).accessType
      console.log(accessLevel)
        setAccessLevel(accessLevel);
    
    } catch (error) {
        console.log('Error setting users:', error);
        }
        
  }, [movieList]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);



  const handleSearchUsers = async (searchedName) => {
    try {
      setMessage({ type: '', body: '' });
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
      if (movieList.userIds.includes(userID)) {
        throw new Error('User already added to movie list.');
      }
      const user = await getUserById(userID);
      const updatedUsers = [
        ...users,
        { uid: userID, accessType: 0, email: user.email },
      ];
      const updatedUserIds = [...movieList.userIds, userID];
      const updatedMovieList = { ...movieList, users: updatedUsers, userIds: updatedUserIds };
      setUsers(updatedUsers);
      await updateMovieList(updatedMovieList.id, updatedMovieList);
      setMessage({ type: 'success', body: `User ${user.email} added to movie list.` });
    } catch (error) {
      setMessage({ type: 'error', body: error.message });
    }
  };

  const handleUpdateUserAccessType = async (userID, accessType) => {
    try {
      if (accessType < 0 || accessType >= 3) {
        throw new Error('Invalid access type.');
      }
      console.log(accessType)
      const userIndex = movieList.userIds.indexOf(userID);
      const updatedUsers = users.map((user, index) => {
        if (index === userIndex) {
          return { ...user, accessType: accessType };
        }
        return user;
      });
      setUsers(updatedUsers);
      
     await updateMovieList(movieList.id, movieList);
      setMessage({ type: 'info', body: `User access type updated.` });
    } catch (error) {
      setMessage({ type: 'error', body: error.message });
    }
  };

  const handleRemoveUserFromMovieList = async (userID) => {
    try {
      const userIndex = movieList.userIds.indexOf(userID);
      const id = movieList.users[userIndex].uid;
      const updatedUsers = [...users];
      updatedUsers.splice(userIndex, 1);
      const updatedUserIds = [...movieList.userIds];
      updatedUserIds.splice(userIndex, 1);
      const updatedMovieList = { ...movieList, users: updatedUsers, userIds: updatedUserIds };
      setUsers(updatedUsers);
      await updateMovieList(updatedMovieList.id, updatedMovieList);
      setMessage({ type: 'info', body: `User removed from movie list.` });
      if (user.uid === id) navigate('/movielist');
    } catch (error) {
      setMessage({ type: 'error', body: error.message });
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Movie List Settings
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography variant="h5" component="h3" gutterBottom>
            Movie List Name
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            // onChange={(event) => setTitle(event.target.value)}
          />
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
                {users.map((user1) => (
                  <ListItem key={user1.uid}>
                    <ListItemText primary={user1.email} />
                    <ListItemText primary={getUserRoles(user1.accessType)} />
                    {user1.accessType === 3 ||
                    user.accessType > 1 ||
                    (user.accessType === 2 && user1.accessType === 2 && user.uid !== user1.id) ? null : (
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
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveUserFromMovieList(user1.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
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
                    onChange={(event, value) => setUser(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={(event) => handleSearchUsers(event.target.value)}
                        label="Search Results"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={() => handleAddUserToMovieList(user.uid)}
                    sx={{ marginTop: '1em', marginBottom: '2em' }}
                    disabled={accessLevel <= 1}
                  >
                    Add User
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {message.type !== '' ? (
              <Grid item xs={12}>
                <Alert severity={message.type}>{message.body}</Alert>
              </Grid>
            ) : null}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default MovieListSettings;

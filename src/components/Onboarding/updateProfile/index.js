import React, { useEffect, useNav } from 'react';
import { Container, Typography, TextField, Button, Box, Input } from '@mui/material';
import { getUserById, updateUser, deleteUser } from '../../../api/userDataStorage';
import { getMovieListsByUserId, updateMovieList, deleteMovieList } from '../../../api/movieStorage';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { auth } from '../../../firebase-config';
import ConfirmationModal from '../../Modals/confirmationModal';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from '../../../contexts/alertContext';
import { DateRange } from '@mui/icons-material';


const UpdateProfile = ({updateEmail, deleteUserAuth, reAuthenticate}) => {
    const [user, setUser] = React.useState(null);
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [dob , setDob] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const { addAlert } = React.useContext(AlertContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userData = await getUserById(user.uid);
            if(!userData) return;
            user = {...user, ...userData};
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setDob(parseDate(user.dateOfBirth));
            setUser(user);
          } else {
            setUser(null);
          }
        });
    
      }, []);

      const parseDate = (date) => {
        if(date.seconds){
            return new Date(date.seconds * 1000).toISOString().split('T')[0];
        }
        return new Date(date).toISOString().split('T')[0];
    }

      const handleUpdateProfile = async () => {
        try{
            if(firstName === user.firstName && lastName === user.lastName && email === user.email && dob === user.dateOfBirth){
                addAlert('info', 'Please make some changes before attempting to update your profile');
                return;
            }


            if(!password) throw new Error('Please enter your password to update your profile');


            const auth = getAuth();
            const authUser = auth.currentUser;


            //Reauthenticate the user
            await reAuthenticate(authUser.email, password);


            //Update the firebase user
            if(email !== authUser.email){
                await updateEmail(authUser, email);
            }

            //Update the user object in movie lists
            const movieLists = await getMovieListsByUserId(user.id);
            movieLists.forEach(async (list) => {
                list.users = list.users.map(user1 => {
                    if(user1.uid === user.id){
                        return {
                            ...user1,
                            firstName: firstName,
                            lastName: lastName,
                            email: email
                        };
                    }
                    return user1;
                });
                await updateMovieList(list.id, list);
            });

            //Update the user object in db
            const newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                dateOfBirth: new Date(dob),
                id: user.id
            };
            await updateUser(user.id, newUser);

            addAlert('success', 'Profile updated successfully');
        }catch(error){
            addAlert('error', error.message);
        }
      }


        const handleDeleteAccount = async () => {
            const auth = getAuth();
            const authUser = auth.currentUser;
            //Clean up any movie lists that may be orphaned by the deletion of this user
            const movieLists = await getMovieListsByUserId(user.id);
            movieLists.forEach(async (list) => {
                list.userIds = list.userIds.filter(id => id !== user.id);
                list.users = list.users.filter(user => user.id !== user.id);
                const hasOwner = list.users.find(user => user.accessType == '3');
                if(list.userIds.length === 0 || !hasOwner){
                    await deleteMovieList(list.id);
                }else{
                    await updateMovieList(list.id, list);
                }
            });

            //Delete the firebase user
            await deleteUserAuth(authUser);
            //Delete the user object in db
            await deleteUser(user.id);
            //Redirect to login page
            navigate('/login');

        }

        const handleDateChange = (event) => {
            const selectedDate = new Date(event.target.value);
            const currentDate = new Date();
            currentDate.setFullYear(currentDate.getFullYear() - 10);
        
            if (selectedDate <= currentDate) {
              setDob(event.target.value);
            } else {
              addAlert('error', 'You must be at least 10 years old to register');
            }
          };
        
            
    return (
        <Container maxWidth="sm">
            <ConfirmationModal header='Delete Account?' subHeader = 'Are you sure you want to delete your account? ' body='This will also delete any lists you own and cannot be undone.' open={open} onClose={() => setOpen(false)} onConfirm = {handleDeleteAccount}/>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Manage Account
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                    <Typography variant="body1" component="label" htmlFor="firstName">
                        First Name
                    </Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="firstName"
                        variant="outlined"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                    />
                    <Typography variant="body1" component="label" htmlFor="lastName">
                        Last Name
                    </Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="lastName"
                        variant="outlined"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                    />
                    <Typography variant="body1" component="label" htmlFor="email">
                        Date of Birth
                    </Typography>
                    <Input
                        fullWidth
                        margin='normal'
                        type="date"
                        value={dob}
                        onChange={handleDateChange}
                        sx={{mb: '.5em', mt:'1em'}}
                        />
                    <Typography variant="body1" component="label" htmlFor="email">
                        Email
                    </Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="email"
                        variant="outlined"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <Typography variant="body1" component="label" htmlFor="password">
                        Current Password
                    </Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="password"
                        variant="outlined"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        onClick={handleUpdateProfile}
                    >
                        Update Profile
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        sx={{ mt: 3 }}
                        onClick={() => setOpen(true)}
                    >
                        Delete Account
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default UpdateProfile;
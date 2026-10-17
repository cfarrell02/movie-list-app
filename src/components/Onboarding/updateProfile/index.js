import React, { useEffect } from 'react';
import { Typography, TextField, Button, Box, Divider } from '@mui/material';
import { getUserById, updateUser, deleteUser } from '../../../api/userDataStorage';
import { getMovieListsByUserId, updateMovieList, deleteMovieList, memberFields, roleOf } from '../../../api/movieStorage';
import { onAuthStateChanged, getAuth , } from 'firebase/auth';
import { auth } from '../../../firebase-config';
import ConfirmationModal from '../../Modals/confirmationModal';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from '../../../contexts/alertContext';


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
            if(firstName === user.firstName && lastName === user.lastName && email === user.email && new Date(dob).toISOString().split('T')[0] === parseDate(user.dateOfBirth)){
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
            await Promise.all(movieLists.map(async (list) => {
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
                await updateMovieList(list.id, { users: list.users });
            }));

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
            setOpen(false);
            const auth = getAuth();
            const authUser = auth.currentUser;

            if (!password) {
                addAlert('error', 'Please enter your current password to delete your account');
                return;
            }

            try {
                //Reauthenticate the user
                await reAuthenticate(authUser.email, password);

                // Delete lists this user owns (or would leave empty) and leave the rest.
                // This must all finish before the sign-in is deleted, as security rules need an authenticated user.
                const movieLists = await getMovieListsByUserId(user.id);
                await Promise.all(movieLists.map(async (list) => {
                    const isOwnedByUser = roleOf(list, user.id) === 3;
                    const remaining = (list.users || []).filter(us => us.uid !== user.id);
                    if (isOwnedByUser || remaining.length === 0) {
                        await deleteMovieList(list.id);
                    } else {
                        await updateMovieList(list.id, memberFields(remaining));
                    }
                }));

                //Delete the user object in db, then the firebase sign-in
                await deleteUser(user.id);
                await deleteUserAuth(authUser);
                addAlert('info', 'Your account has been deleted');
                navigate('/usermgmt');
            } catch (error) {
                console.error(error);
                addAlert('error', 'Could not delete your account: ' + error.message);
            }
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
        <Box sx={{ width: '100%' }}>
            <ConfirmationModal header='Delete Account?' subHeader = 'Are you sure you want to delete your account? ' body='This will also delete any lists you own and cannot be undone.' open={open} onClose={() => setOpen(false)} onConfirm = {handleDeleteAccount}/>
            <Typography variant="h5" component="h2">Profile</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Update your details. Your current password is required to save changes.</Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField fullWidth id="firstName" label="First name" onChange={(e) => setFirstName(e.target.value)} value={firstName} />
                    <TextField fullWidth id="lastName" label="Last name" onChange={(e) => setLastName(e.target.value)} value={lastName} />
                </Box>
                <TextField id="dob" label="Date of birth" type="date" value={dob} onChange={handleDateChange} InputLabelProps={{ shrink: true }} />
                <TextField id="email" label="Email" type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                <TextField id="password" label="Current password" type="password" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} value={password} />
                <Button variant="contained" size="large" onClick={handleUpdateProfile}>
                    Save changes
                </Button>
            </Box>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" component="h3" color="error">Danger zone</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                <Typography color="text.secondary" variant="body2">Permanently delete your account and any lists you own.</Typography>
                <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
                    Delete account
                </Button>
            </Box>
        </Box>
    );
};

export default UpdateProfile;

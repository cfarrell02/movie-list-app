import React, { useRef, useState , useEffect} from 'react';
import {
  TableContainer,
  List,
  ListItem,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Paper,
  CircularProgress,
  TablePagination,
  TextField,
  Rating,
  Slider,
  Chip,
  Stack,
  Select,
  Switch,
  Grid,
  Alert,
  useMediaQuery,
  InputAdornment,
  Card,
  Divider
} from '@mui/material';
import { ArrowUpward, ArrowDownward, Filter, Label, Refresh } from '@mui/icons-material';
import { orderBy } from 'lodash';
import { AlertContext } from '../../../contexts/alertContext';
import Checkbox from '@mui/material/Checkbox';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase-config';
import { getUserById } from '../../../api/userDataStorage';
import ConfirmationModal from '../../Modals/confirmationModal';

const UserManagementList = ({ users, handleDelete, handleUpdate }) => {
    const [currentUser, setUser] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            getUserById(currentUser.uid).then((userData) => {
              setUser(userData);
            });
          } else {
            setUser({});
          }
        });
    
        return () => {
          unsubscribe();
        };
      }, []);
    
    const handleAdminChange = (event) => {
        const userId = event.target.value;
        const user = users.find((user) => user.id === userId);
        const updatedUser = { ...user, admin: event.target.checked };
        handleUpdate(updatedUser, userId);
    }

    return (
        <Card sx={{ p: 2, maxWidth: '50em', margin: 'auto', mt: 2 }}>
        <ConfirmationModal header='Delete User?' subHeader = 'Are you sure you want to delete this user? ' body='This will also delete any lists owned by this user.' 
        open = {confirmationOpen} onClose = {() => setConfirmationOpen(false)} onConfirm = {() => {
            handleDelete(selectedUser.id);
            setConfirmationOpen(false);
        }
        }/>
            <Typography variant="h5" sx={{ mb: 2 }}>Manage Users</Typography>
            <Divider />
            <List>
                {users.map((user, index) => (
                    <>
                    {index !== 0 && <Divider />}

                    <ListItem key={user.id} sx={{ p: 1, my: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ flex: 1 }}>{user.firstName} {user.lastName}</Typography>
                        <Typography sx={{ flex: 1 }}>{user.email}</Typography>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                            <Typography sx={{ mr: 1 }}>Admin</Typography>
                            <Checkbox
                                checked={user.admin}
                                onChange={handleAdminChange}
                                value={user.id}
                                disabled = {user.id === currentUser.id}
                            />
                            <Button onClick={() => {
                                setSelectedUser(user);
                                setConfirmationOpen(true);
                            }}
                             disabled = {user.id === currentUser.id}>Delete</Button>
                        </div>
                    </ListItem>
                    </>

                ))}
            </List>
        </Card>
    );
};

export default UserManagementList;
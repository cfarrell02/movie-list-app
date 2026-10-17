import React, { useRef, useState , useEffect} from 'react';
import {
  Avatar,
  Box,
  Container,
  FormControlLabel,
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

const UserManagementList = ({ users, handleUpdate }) => {
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
    const handleActiveChange = (event) => {
        const userId = event.target.value;
        const user = users.find((user) => user.id === userId);
        const updatedUser = { ...user, active: event.target.checked };
        handleUpdate(updatedUser, userId);
    }

    return (
        <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
            <Typography variant="h3" component="h1">Users</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Manage admin rights and account access.</Typography>
            <Card>
                <List disablePadding>
                    {users.map((user, index) => (
                        <React.Fragment key={user.id}>
                            {index !== 0 && <Divider component="li" />}
                            <ListItem sx={{ py: 1.5, px: { xs: 2, sm: 3 }, gap: 2, flexWrap: 'wrap' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 14, fontWeight: 700 }}>
                                    {`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()}
                                </Avatar>
                                <Box sx={{ flex: 1, minWidth: 180 }}>
                                    <Typography fontWeight={600}>
                                        {user.firstName} {user.lastName} {user.id === currentUser.id && <Chip size="small" label="You" sx={{ ml: 0.5 }} />}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>{user.email}</Typography>
                                </Box>
                                <FormControlLabel
                                    control={<Switch size="small" checked={!!user.admin} onChange={handleAdminChange} value={user.id} disabled={user.id === currentUser.id} />}
                                    label="Admin"
                                />
                                <FormControlLabel
                                    control={<Switch size="small" checked={!!user.active} onChange={handleActiveChange} value={user.id} disabled={user.id === currentUser.id} />}
                                    label="Active"
                                    sx={{ mr: 0 }}
                                />
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
            </Card>
        </Container>
    );
};

export default UserManagementList;
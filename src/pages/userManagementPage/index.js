import React, { useEffect, useState, useContext } from 'react';
import { Card, Typography, Button, TextField, Box, Divider } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { getUserById, updateUser, getAllUsers, deleteUser } from '../../api/userDataStorage';
import { getMovieListsByUserId, updateMovieList, deleteMovieList } from '../../api/movieStorage';

import UserManagementList from '../../components/Admin/userManagementList';
import { onAuthStateChanged, deleteUser as deleteUserAuth , getAuth, getUserById as getAuthUser} from 'firebase/auth';
import { auth } from '../../firebase-config';
import { AlertContext } from '../../contexts/alertContext';

const UserManagementPage = () => {
    const [currentUser, setUser] = useState({});
    const { addAlert } = useContext(AlertContext);

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
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers().then((userData) => {

            userData.sort((a, b) => {
                if (a.id === currentUser.id) {
                    return -1;
                }

                const nameComp = getFullName(a).localeCompare(getFullName(b));
                if (nameComp === 0) {
                    return a.email.localeCompare(b.email);
                }
                return nameComp;
            });


            setUsers(userData);
        });
    }
    , []);

    const getFullName = (user) => {
        return `${user.firstName} ${user.lastName}`;
    };


    const handleUpdate = (updatedUser, userId) => {
        updateUser(userId, updatedUser).then(() => {
            const updatedUsers = users.map((user) => {
                if (user.id === userId) {
                    return updatedUser;
                }
                return user;
            });

            setUsers(updatedUsers);
            updateUser(userId, updatedUser).then(() => {
                addAlert('success', 'User updated successfully');
            });
        });
    } 

    const handleDelete = async (userId) => {
        const updatedUsers = users.filter((user) => user.id !== userId);
        const auth = getAuth();
        //get auth user object matching userId
        const authUser = await getAuthUser(auth, userId);
        setUsers(updatedUsers);
        //Clean up any movie lists that may be orphaned by the deletion of this user
        const movieLists = await getMovieListsByUserId(userId);
        movieLists.forEach(async (list) => {
            list.userIds = list.userIds.filter(id => id !== userId);
            list.users = list.users.filter(user => user.id !== userId);
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
        await deleteUser(userId);
        addAlert('info', 'User deleted successfully');

    }


    return (
        <UserManagementList users={users} handleDelete={handleDelete} handleUpdate={handleUpdate} />
    );
};

export default UserManagementPage;

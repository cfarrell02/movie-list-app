import React, { useEffect, useState, useContext } from 'react';

import { getUserById, updateUser, getAllUsers } from '../../api/userDataStorage';

import UserManagementList from '../../components/Admin/userManagementList';
import { onAuthStateChanged } from 'firebase/auth';
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
    , [currentUser.id]);

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
      

    }


    return (
        <UserManagementList users={users} handleDelete={handleDelete} handleUpdate={handleUpdate} />
    );
};

export default UserManagementPage;

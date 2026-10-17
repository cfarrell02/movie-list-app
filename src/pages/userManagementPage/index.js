import React, { useEffect, useState, useContext } from 'react';

import { getUserById, updateUser, getAllUsers } from '../../api/userDataStorage';
import { syncDirectoryEntry } from '../../api/userDirectory';

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
            // Site admins can (re)build everyone's public directory entries
            if (currentUser.admin) {
                let synced = false;
                try { synced = sessionStorage.getItem('directorySyncedAll') === '1'; } catch { /* ignore */ }
                if (!synced) {
                    Promise.all(userData.map(syncDirectoryEntry)).then(() => {
                        try { sessionStorage.setItem('directorySyncedAll', '1'); } catch { /* ignore */ }
                    });
                }
            }
        });
    }
    , [currentUser.id, currentUser.admin]);

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

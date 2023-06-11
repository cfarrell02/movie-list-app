import { collection, addDoc, getDoc, setDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';

export const addUser = async (user) => {
    try {
        await setDoc(doc(db, 'users', user.id), user);
        return user.id;
    } catch (error) {
        throw new Error('Error adding user to Firestore: ' + error.message);
    }
    }

export const getAllUsers = async () => {
    try {
        const userQuery = query(collection(db, 'users'));
        const querySnapshot = await getDocs(userQuery);
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
    } catch (error) {
        throw new Error('Error getting users from Firestore: ' + error.message);
    }
}

export const getUserById = async (userId) => {
    try {
        const docRef = doc(db, 'users', userId.toString());
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            return { id: docSnapshot.id, ...docSnapshot.data() };
        } else {
            throw new Error('User not found.');
        }
    } catch (error) {
        throw new Error('Error getting user from Firestore: ' + error.message);
    }
}

export const getUserByEmail = async (email) => {
    try {
        const userQuery = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(userQuery);
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
    } catch (error) {
        throw new Error('Error getting user by email from Firestore: ' + error.message);
    }
}

export const updateUser = async (userId, updatedUser) => {
    try {
        const docRef = doc(db, 'users', userId.toString());
        await updateDoc(docRef, updatedUser);
    } catch (error) {
        throw new Error('Error updating user in Firestore: ' + error.message);
    }
}

export const deleteUser = async (userId) => {
    try {
        const docRef = doc(db, 'users', userId.toString());
        await deleteDoc(docRef);
    } catch (error) {
        throw new Error('Error deleting user from Firestore: ' + error.message);
    }
}

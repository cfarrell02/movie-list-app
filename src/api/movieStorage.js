import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';

// Function to add a movie
export const addMovie = async (movie) => {
  try {
    const docRef = await addDoc(collection(db, 'movies'), movie);
    return docRef.id;
  } catch (error) {
    throw new Error('Error adding movie to Firestore.');
  }
};

// Function to get all movies
export const getAllMovies = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'movies'));
    const movies = [];
    querySnapshot.forEach((doc) => {
      movies.push({ id: doc.id, ...doc.data() });
    });
    return movies;
  } catch (error) {
    throw new Error('Error getting movies from Firestore.');
  }
};

// Function to update a movie
export const updateMovie = async (id, updatedMovie) => {
  try {
    const movieRef = doc(db, 'movies', id);
    await updateDoc(movieRef, updatedMovie);
  } catch (error) {
    throw new Error('Error updating movie in Firestore.');
  }
};

// Function to delete a movie
export const deleteMovie = async (id) => {
  try {
    const movieRef = doc(db, 'movies', id);
    await deleteDoc(movieRef);
  } catch (error) {
    throw new Error('Error deleting movie from Firestore.');
  }
};

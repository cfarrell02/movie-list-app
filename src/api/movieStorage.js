import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';

// Local cache to store movies data
let moviesCache = [];

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
    // Check if movies data exists in the cache
    if (moviesCache.length > 0) {
      return moviesCache;
    }

    const querySnapshot = await getDocs(collection(db, 'movies'));
    const movies = [];
    querySnapshot.forEach((doc) => {
      movies.push({ id: doc.id, ...doc.data() });
    });

    // Update the cache with the new movies data
    moviesCache = movies;

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

    // Update the movie in the cache
    moviesCache = moviesCache.map((movie) => {
      if (movie.id === id) {
        return { id, ...updatedMovie };
      }
      return movie;
    });
  } catch (error) {
    throw new Error('Error updating movie in Firestore.');
  }
};

// Function to delete a movie
export const deleteMovie = async (id) => {
  try {
    const movieRef = doc(db, 'movies', id);
    await deleteDoc(movieRef);

    // Remove the movie from the cache
    moviesCache = moviesCache.filter((movie) => movie.id !== id);
  } catch (error) {
    throw new Error('Error deleting movie from Firestore.');
  }
};

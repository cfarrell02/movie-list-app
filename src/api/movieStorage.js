import { collection, addDoc, getDoc, setDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';

// Function to add a movie list
export const addMovieList = async (movieList) => {
  try {
    const docRef = doc(db, 'movieLists', movieList.id);
    await setDoc(docRef, movieList);
    return movieList.id;
  } catch (error) {
    throw new Error('Error adding movie list to Firestore: ' + error.message);
  }
};

// Function to get all movie lists
export const getAllMovieLists = async () => {
  try {
    const movieListQuery = query(collection(db, 'movieLists'));
    const querySnapshot = await getDocs(movieListQuery);
    const movieLists = [];
    querySnapshot.forEach((doc) => {
      movieLists.push({ id: doc.id, ...doc.data() });
    });
    return movieLists;
  } catch (error) {
    throw new Error('Error getting movie lists from Firestore: ' + error.message);
  }
};

// Function to get a movie list by its ID
export const getMovieListById = async (listID) => {
  try {
    const docRef = doc(db, 'movieLists', listID);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      throw new Error('Movie list not found.');
    }
  } catch (error) {
    throw new Error('Error getting movie list from Firestore: ' + error.message);
  }
};

// Function to get movie lists by user ID
export const getMovieListsByUserId = async (userId) => {
  try {
    const movieListQuery = query(collection(db, 'movieLists'), where('userIds', 'array-contains', userId));
    const querySnapshot = await getDocs(movieListQuery);
    const movieLists = [];
    querySnapshot.forEach((doc) => {
      movieLists.push({ id: doc.id, ...doc.data() });
    });
    return movieLists;
  } catch (error) {
    throw new Error('Error getting movie lists by userId from Firestore: ' + error.message);
  }
};

// Function to update a movie list
export const updateMovieList = async (listID, updatedMovieList) => {
  try {
    const movieListRef = doc(db, 'movieLists', listID);
    await updateDoc(movieListRef, updatedMovieList);
  } catch (error) {
    throw new Error('Error updating movie list in Firestore: ' + error.message);
  }
};

// Function to add a movie to a movie list
export const addMovieToList = async (listID, movie) => {
  try {
    const movieListRef = doc(db, 'movieLists', listID);
    const movieListSnapshot = await getDoc(movieListRef);

    if (movieListSnapshot.exists()) {
      const updatedMovieList = {
        movies: [...movieListSnapshot.data().movies, movie]
      };

      await updateDoc(movieListRef, updatedMovieList);
    } else {
      throw new Error('Movie list not found.');
    }
  } catch (error) {
    throw new Error('Error adding movie to list in Firestore: ' + error.message);
  }
};

// Function to update a movie in a movie list
export const updateMovieInList = async (listID, movieID, updatedMovie) => {
  try {
    const movieListRef = doc(db, 'movieLists', listID);
    const movieListSnapshot = await getDoc(movieListRef);

    if (movieListSnapshot.exists()) {
      const movies = movieListSnapshot.data().movies;
      const updatedMovies = movies.map((movie) => {
        if (movie.id === movieID) {
          return { ...movie, ...updatedMovie };
        }
        return movie;
      });

      const updatedMovieList = {
        movies: updatedMovies
      };

      await updateDoc(movieListRef, updatedMovieList);
    } else {
      throw new Error('Movie list not found.');
    }
  } catch (error) {
    throw new Error('Error updating movie in list in Firestore: ' + error.message);
  }
};

// Function to delete a movie from a movie list
export const deleteMovieFromList = async (listID, movieID) => {
  try {
    const movieListRef = doc(db, 'movieLists', listID);
    const movieListSnapshot = await getDoc(movieListRef);

    if (movieListSnapshot.exists()) {
      const movies = movieListSnapshot.data().movies;
      const updatedMovies = movies.filter((movie) => movie.id !== movieID);

      const updatedMovieList = {
        movies: updatedMovies
      };

      await updateDoc(movieListRef, updatedMovieList);
    } else {
      throw new Error('Movie list not found.');
    }
  } catch (error) {
    throw new Error('Error deleting movie from list in Firestore: ' + error.message);
  }
};

// Function to delete a movie list
export const deleteMovieList = async (listID) => {
  try {
    const movieListRef = doc(db, 'movieLists', listID);
    await deleteDoc(movieListRef);
  } catch (error) {
    throw new Error('Error deleting movie list from Firestore: ' + error.message);
  }
};

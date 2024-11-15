import { collection, addDoc, getDoc, setDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';

// Function to add a watch list
export const addMovieList = async (movieList) => {
  try {
    const docRef = doc(db, 'movieLists', movieList.id);
    await setDoc(docRef, movieList);
    return movieList.id;
  } catch (error) {
    throw new Error('Error adding watch list to Firestore: ' + error.message);
  }
};

// Function to get all watch lists
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
    throw new Error('Error getting watch lists from Firestore: ' + error.message);
  }
};

// Function to get a watch list by its ID
export const getMovieListById = async (listID) => {
  try {
    const docRef = doc(db, 'movieLists', listID);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      throw new Error('Watch List not found.');
    }
  } catch (error) {
    throw new Error('Error getting watch list from Firestore: ' + error.message);
  }
};

// Function to get watch lists by user ID
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
    throw new Error('Error getting watch lists by userId from Firestore: ' + error.message);
  }
};

// Function to update a watch list
export const updateMovieList = async (listID, updatedMovieList) => {
  try {
    const movieListRef = doc(db, 'movieLists', listID);
    await updateDoc(movieListRef, updatedMovieList);
  } catch (error) {
    throw new Error('Error updating watch list in Firestore: ' + error.message);
  }
};

// Function to add a movie to a watch list
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
      throw new Error('Watch List not found.');
    }
  } catch (error) {
    throw new Error('Error adding movie to list in Firestore: ' + error.message);
  }
};

// Function to add a movie to a watch list
export const addTVShowToList = async (listID, show) => {
  try {
    const movieListRef = doc(db, 'movieLists', listID);
    const movieListSnapshot = await getDoc(movieListRef);

    if (movieListSnapshot.exists()) {
      const updatedMovieList = {
        tvShows : [...movieListSnapshot.data().tvShows, show]
      };

      await updateDoc(movieListRef, updatedMovieList);
    } else {
      throw new Error('Watch List not found.');
    }
  } catch (error) {
    throw new Error('Error adding movie to list in Firestore: ' + error.message);
  }
};

export const updateTVShowInList = async (listID, showID, updatedShow) => {
  try {
    const movieListRef = doc(db, 'movieLists', listID);
    const movieListSnapshot = await getDoc(movieListRef);

    if (movieListSnapshot.exists()) {
      const shows = movieListSnapshot.data().tvShows;
      const updatedShows = shows.map((show) => {
        if (show.id === showID) {
          return { ...show, ...updatedShow };
        }
        return show;
      });

      const updatedMovieList = {
        tvShows: updatedShows
      };

      await updateDoc(movieListRef, updatedMovieList);
    } else {
      throw new Error('Watch List not found.');
    }
  } catch (error) {
    throw new Error('Error updating movie in list in Firestore: ' + error.message);
  }
}

// Function to update a movie in a watch list
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
      throw new Error('Watch List not found.');
    }
  } catch (error) {
    throw new Error('Error updating movie in list in Firestore: ' + error.message);
  }
};

// Function to delete a movie from a watch list
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
      throw new Error('Watch List not found.');
    }
  } catch (error) {
    throw new Error('Error deleting movie from list in Firestore: ' + error.message);
  }
};

// Function to delete a tv show from a watch list
export const deleteTVShowFromList = async (listID, showID) => {
  try {
    const movieListRef = doc(db, 'movieLists', listID);
    const movieListSnapshot = await getDoc(movieListRef);

    if (movieListSnapshot.exists()) {
      const shows = movieListSnapshot.data().tvShows;
      const updatedShows = shows.filter((show) => show.id !== showID);

      const updatedMovieList = {
        tvShows: updatedShows
      };

      await updateDoc(movieListRef, updatedMovieList);
    } else {
      throw new Error('Watch List not found.');
    }
  } catch (error) {
    throw new Error('Error deleting tv show from list in Firestore: ' + error.message);
  }
};

// Function to delete a watch list
export const deleteMovieList = async (listID) => {
  try {
    const movieListRef = doc(db, 'movieLists', listID);
    await deleteDoc(movieListRef);
  } catch (error) {
    throw new Error('Error deleting watch list from Firestore: ' + error.message);
  }
};

import React from 'react';
import { getMovie, getMovieSearchResults } from '../../../api/TMDBAPI';
import { addMovieToList } from '../../../api/movieStorage';
import MediaAddBar from '../../mediaAddBar';

const MovieAdd = ({ movies, listId, setMovies, disabled, currentUserID }) => (
  <MediaAddBar
    items={movies}
    setItems={setMovies}
    disabled={disabled}
    currentUserID={currentUserID}
    search={(query) => getMovieSearchResults(1, query)}
    fetchDetails={getMovie}
    persist={(movie) => addMovieToList(listId, movie)}
    getTitle={(m) => m.title || ''}
    getDate={(m) => m.release_date}
    initialWatched={false}
    noun={{ singular: 'movie', plural: 'movies' }}
  />
);

export default MovieAdd;

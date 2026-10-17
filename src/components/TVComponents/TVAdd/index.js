import React from 'react';
import { getTVShow, getTVShowSearchResults } from '../../../api/TMDBAPI';
import { addTVShowToList } from '../../../api/movieStorage';
import MediaAddBar from '../../mediaAddBar';

const TVAdd = ({ tvshows, listId, setTvShows, disabled, currentUserID }) => (
  <MediaAddBar
    type="tv"
    items={tvshows}
    setItems={setTvShows}
    disabled={disabled}
    currentUserID={currentUserID}
    search={(query) => getTVShowSearchResults(1, query)}
    fetchDetails={getTVShow}
    persist={(show) => addTVShowToList(listId, show)}
    getTitle={(t) => t.name || ''}
    getDate={(t) => t.first_air_date}
    initialWatched={0}
    noun={{ singular: 'show', plural: 'shows' }}
  />
);

export default TVAdd;

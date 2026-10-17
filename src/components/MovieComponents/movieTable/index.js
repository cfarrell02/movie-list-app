import React, { useCallback } from 'react';
import { Checkbox, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import MediaListTable, { RatingCell } from '../../mediaListTable';
import { genreNames, yearNumber } from '../../mediaListTable/filters';

const yearOf = (date) => (date ? new Date(date).getFullYear() : null);

const formatRuntime = (minutes) => {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

const columns = [
  { id: 'release_date', label: 'Year', sortValue: (m) => m.release_date, render: (m) => yearOf(m.release_date) || '—', hideBelow: 'sm' },
  { id: 'vote_average', label: 'Rating', align: 'center', sortValue: (m) => m.vote_average, render: (m) => <RatingCell value={m.vote_average} />, hideBelow: 'sm' },
  { id: 'runtime', label: 'Runtime', sortValue: (m) => m.runtime, render: (m) => formatRuntime(m.runtime), hideBelow: 'md' },
  { id: 'watched', label: 'Watched', sortValue: (m) => (m.watched ? 1 : 0), render: (m) => (m.watched ? 'Yes' : 'No'), hideBelow: 'md' },
];

const filterConfig = {
  statuses: [
    { value: 'unwatched', label: 'Not watched' },
    { value: 'watched', label: 'Watched' },
  ],
  getStatus: (m) => (m.watched ? 'watched' : 'unwatched'),
  getGenres: genreNames,
  getYearNumber: (m) => yearNumber(m.release_date),
  length: { label: 'Runtime', getValue: (m) => m.runtime || null, format: formatRuntime, step: 5 },
};

const MovieTable = ({ movies, deleteMovie, editMovie, loading, accessType, listId }) => {
  const getTitle = useCallback((m) => m.title || '', []);
  const isWatched = useCallback((m) => !!m.watched, []);

  return (
    <MediaListTable
      items={movies}
      loading={loading}
      accessType={accessType}
      columns={columns}
      getTitle={getTitle}
      getYear={(m) => yearOf(m.release_date)}
      getPath={(m) => `/movie/${m.id}`}
      isWatched={isWatched}
      onDelete={deleteMovie}
      noun={{ singular: 'movie', plural: 'movies' }}
      filterConfig={filterConfig}
      storageKey={listId && `${listId}-movies`}
      renderStatus={(movie) => (
        <Tooltip title={movie.watched ? 'Mark as not watched' : 'Mark as watched'}>
          <Checkbox
            size="small"
            checked={!!movie.watched}
            icon={<VisibilityOutlinedIcon fontSize="small" />}
            checkedIcon={<VisibilityIcon fontSize="small" />}
            onChange={(e) => editMovie({ ...movie, watched: e.target.checked })}
            inputProps={{ 'aria-label': 'Watched' }}
          />
        </Tooltip>
      )}
    />
  );
};

export default MovieTable;

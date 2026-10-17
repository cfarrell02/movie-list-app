import React, { useCallback } from 'react';
import { MenuItem, Select } from '@mui/material';
import MediaListTable, { RatingCell } from '../../mediaListTable';
import { genreNames, yearNumber } from '../../mediaListTable/filters';

const yearOf = (date) => (date ? new Date(date).getFullYear() : null);

const airedRange = (tv) => {
  const start = yearOf(tv.first_air_date);
  if (!start) return '—';
  const end = tv.in_production ? 'Present' : yearOf(tv.last_air_date);
  return end && end !== start ? `${start} – ${end}` : `${start}`;
};

// Older entries stored watched as a boolean; newer ones use 0 = not watched, 1 = watching, 2 = watched
const statusOf = (tv) => (tv.watched === true ? 2 : tv.watched === false || tv.watched == null ? 0 : Number(tv.watched));

const STATUSES = [
  { value: 0, label: 'Not watched', color: 'text.secondary' },
  { value: 1, label: 'Watching', color: 'primary.main' },
  { value: 2, label: 'Watched', color: 'success.main' },
];

const columns = [
  { id: 'first_air_date', label: 'Aired', sortValue: (t) => t.first_air_date, render: airedRange, hideBelow: 'sm' },
  { id: 'vote_average', label: 'Rating', align: 'center', sortValue: (t) => t.vote_average, render: (t) => <RatingCell value={t.vote_average} />, hideBelow: 'sm' },
  { id: 'seasons', label: 'Seasons', align: 'center', sortValue: (t) => t.seasons?.length, render: (t) => t.seasons?.length || '—', hideBelow: 'md' },
];

const seasonCount = (t) => (t.seasons || []).filter((s) => s.name !== 'Specials').length || null;

const filterConfig = {
  statuses: STATUSES.map((s) => ({ value: s.value, label: s.label })),
  getStatus: statusOf,
  getGenres: genreNames,
  getYearNumber: (t) => yearNumber(t.first_air_date),
  length: { label: 'Seasons', getValue: seasonCount, format: (v) => v },
};

const TVTable = ({ tvShows, deleteTVShow, editTVShow, loading, accessType, listId }) => {
  const getTitle = useCallback((t) => t.name || '', []);
  const isWatched = useCallback((t) => statusOf(t) === 2, []);

  return (
    <MediaListTable
      items={tvShows}
      loading={loading}
      accessType={accessType}
      columns={columns}
      getTitle={getTitle}
      getYear={airedRange}
      getPath={(t) => `/tvshow/${t.id}`}
      isWatched={isWatched}
      onDelete={deleteTVShow}
      noun={{ singular: 'show', plural: 'shows' }}
      filterConfig={filterConfig}
      storageKey={listId && `${listId}-tv`}
      renderStatus={(tv) => {
        const status = statusOf(tv);
        return (
          <Select
            size="small"
            value={status}
            onChange={(e) => editTVShow({ ...tv, watched: e.target.value })}
            sx={{
              minWidth: { xs: 0, sm: 130 },
              fontSize: { xs: 13, sm: 14 },
              fontWeight: 600,
              color: STATUSES[status]?.color,
              '& .MuiSelect-select': { py: 0.5, pl: { xs: 1, sm: 1.75 } },
            }}
            inputProps={{ 'aria-label': 'Watch status' }}
          >
            {STATUSES.map((s) => (
              <MenuItem key={s.value} value={s.value} sx={{ color: s.color, fontWeight: 600 }}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        );
      }}
    />
  );
};

export default TVTable;

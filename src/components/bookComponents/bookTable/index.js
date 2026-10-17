import React, { useCallback } from 'react';
import { MenuItem, Select, Typography } from '@mui/material';
import MediaListTable, { RatingCell } from '../../mediaListTable';
import { coverUrl } from '../../../api/bookAPI';

const STATUSES = [
  { value: 0, label: 'Not read', color: 'text.secondary' },
  { value: 1, label: 'Reading', color: 'primary.main' },
  { value: 2, label: 'Read', color: 'success.main' },
];

const statusOf = (b) => Number(b.watched) || 0;

const columns = [
  {
    id: 'author',
    label: 'Author',
    sortValue: (b) => (b.authors?.[0] || '').toLowerCase(),
    render: (b) => (
      <Typography variant="body2" noWrap sx={{ maxWidth: 220 }}>{b.authors?.join(', ') || '—'}</Typography>
    ),
    hideBelow: 'sm',
  },
  { id: 'first_publish_year', label: 'Year', sortValue: (b) => b.first_publish_year, render: (b) => b.first_publish_year || '—', hideBelow: 'sm' },
  { id: 'ratings_average', label: 'Rating', align: 'center', sortValue: (b) => b.ratings_average, render: (b) => <RatingCell value={b.ratings_average} />, hideBelow: 'md' },
  { id: 'number_of_pages_median', label: 'Pages', align: 'center', sortValue: (b) => b.number_of_pages_median, render: (b) => b.number_of_pages_median || '—', hideBelow: 'md' },
];

const filterConfig = {
  statuses: STATUSES.map((s) => ({ value: s.value, label: s.label })),
  getStatus: statusOf,
  getGenres: () => [],
  getYearNumber: (b) => b.first_publish_year || null,
  length: { label: 'Pages', getValue: (b) => b.number_of_pages_median || null, format: (v) => v, step: 10 },
  rating: { getValue: (b) => b.ratings_average, max: 5 },
};

const BookTable = ({ books, deleteBook, editBook, loading, accessType, listId }) => {
  const getTitle = useCallback((b) => b.title || '', []);
  const isWatched = useCallback((b) => statusOf(b) === 2, []);

  return (
    <MediaListTable
      items={books}
      loading={loading}
      accessType={accessType}
      columns={columns}
      getTitle={getTitle}
      getYear={(b) => [b.authors?.[0], b.first_publish_year].filter(Boolean).join(' · ')}
      getPath={(b) => `/book/${b.id}`}
      getThumb={(b) => coverUrl(b.cover_i, 'S')}
      isWatched={isWatched}
      onDelete={deleteBook}
      noun={{ singular: 'book', plural: 'books' }}
      filterConfig={filterConfig}
      storageKey={listId && `${listId}-books`}
      renderStatus={(book) => {
        const status = statusOf(book);
        return (
          <Select
            size="small"
            value={status}
            onChange={(e) => editBook({ ...book, watched: e.target.value })}
            sx={{
              minWidth: { xs: 0, sm: 120 },
              fontSize: { xs: 13, sm: 14 },
              fontWeight: 600,
              color: STATUSES[status]?.color,
              '& .MuiSelect-select': { py: 0.5, pl: { xs: 1, sm: 1.75 } },
            }}
            inputProps={{ 'aria-label': 'Reading status' }}
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

export default BookTable;

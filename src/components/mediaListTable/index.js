import React, { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getUserById } from '../../api/userDataStorage';
import { dateReadableFormatter } from '../../utils';
import defaultImage from '../../images/default.jpg';
import ConfirmationModal from '../Modals/confirmationModal';

// Cache "added by" lookups so each user is fetched once, not once per row
const userCache = new Map();
const fetchUserName = (uid) => {
  if (!uid) return Promise.resolve('');
  if (!userCache.has(uid)) {
    userCache.set(
      uid,
      getUserById(uid)
        .then((u) => u.firstName || '')
        .catch(() => '')
    );
  }
  return userCache.get(uid);
};

const AddedBy = ({ item }) => {
  const [name, setName] = useState('');
  useEffect(() => {
    let active = true;
    fetchUserName(item.addedBy).then((n) => active && setName(n));
    return () => {
      active = false;
    };
  }, [item.addedBy]);
  return (
    <Box>
      <Typography variant="body2">{name || '—'}</Typography>
      <Typography variant="caption" color="text.secondary">{dateReadableFormatter(item.addedDate)}</Typography>
    </Box>
  );
};

export const RatingCell = ({ value }) =>
  value ? (
    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
      <StarRoundedIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
      <Typography variant="body2" fontWeight={600}>{(Math.round(value * 10) / 10).toFixed(1)}</Typography>
    </Stack>
  ) : (
    '—'
  );

const compare = (a, b) => {
  if (a === b) return 0;
  if (a === undefined || a === null || a === '') return 1;
  if (b === undefined || b === null || b === '') return -1;
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b);
  return a < b ? -1 : 1;
};

/**
 * Shared table for list items (movies or TV shows).
 * columns: [{ id, label, sortValue(item), render(item), align, hideBelow: 'sm' | 'md' }]
 */
const MediaListTable = ({
  items,
  loading,
  accessType,
  columns,
  getTitle,
  getYear,
  getPath,
  isWatched,
  renderStatus,
  onDelete,
  noun,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const [search, setSearch] = useState('');
  const [showWatched, setShowWatched] = useState(true);
  const [sort, setSort] = useState({ key: 'addedDate', direction: 'asc' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [pendingDelete, setPendingDelete] = useState(null);

  const allColumns = useMemo(
    () => [
      { id: 'title', label: 'Title', sortValue: (item) => getTitle(item).toLowerCase() },
      ...columns,
      { id: 'addedDate', label: 'Added', sortValue: (item) => item.addedDate, render: (item) => <AddedBy item={item} />, hideBelow: 'sm' },
    ],
    [columns, getTitle]
  );

  const visibleColumns = allColumns.filter(
    (c) => !(c.hideBelow === 'sm' && isSmall) && !(c.hideBelow === 'md' && isMedium)
  );

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const column = allColumns.find((c) => c.id === sort.key);
    const filtered = items.filter(
      (item) => (!term || getTitle(item).toLowerCase().includes(term)) && (showWatched || !isWatched(item))
    );
    if (!column) return filtered;
    const sorted = [...filtered].sort((a, b) => compare(column.sortValue(a), column.sortValue(b)));
    return sort.direction === 'desc' ? sorted.reverse() : sorted;
  }, [items, search, showWatched, sort, allColumns, getTitle, isWatched]);

  // Keep the current page valid when filtering shrinks the result set
  useEffect(() => {
    setPage(0);
  }, [search, showWatched]);

  const pageRows = rowsPerPage === -1 ? rows : rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const canEdit = accessType > 0;
  const colSpan = visibleColumns.length + 2;

  const handleSort = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: '16px', overflow: 'hidden' }}>
      <ConfirmationModal
        open={!!pendingDelete}
        header={`Remove ${noun.singular}?`}
        body={pendingDelete ? `“${getTitle(pendingDelete)}” will be removed from this list.` : ''}
        confirmLabel="Remove"
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          onDelete(pendingDelete);
          setPendingDelete(null);
        }}
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        sx={{ p: 2 }}
      >
        <TextField
          size="small"
          placeholder={`Filter ${noun.plural}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { sm: 320 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {rows.length} of {items.length}
          </Typography>
          <FormControlLabel
            control={<Switch size="small" checked={showWatched} onChange={(e) => setShowWatched(e.target.checked)} />}
            label={<Typography variant="body2">Show watched</Typography>}
            sx={{ mr: 0 }}
          />
        </Stack>
      </Stack>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 64 }} />
              {visibleColumns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'} sortDirection={sort.key === column.id ? sort.direction : false}>
                  <TableSortLabel
                    active={sort.key === column.id}
                    direction={sort.key === column.id ? sort.direction : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right">{canEdit ? 'Status' : ''}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton variant="rounded" width={46} height={69} /></TableCell>
                  <TableCell colSpan={colSpan - 1}><Skeleton width="50%" /></TableCell>
                </TableRow>
              ))
            ) : pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {items.length === 0 ? `No ${noun.plural} yet – add one above.` : `No ${noun.plural} match your filters.`}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((item) => (
                <TableRow key={item.id} hover sx={{ '&:last-child td': { border: 0 }, opacity: isWatched(item) ? 0.75 : 1 }}>
                  <TableCell sx={{ py: 1, pr: { xs: 0, sm: 2 } }}>
                    <Box
                      component="img"
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : defaultImage}
                      alt=""
                      loading="lazy"
                      sx={{ width: 46, height: 69, objectFit: 'cover', borderRadius: '6px', display: 'block', bgcolor: 'action.hover' }}
                    />
                  </TableCell>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.id === 'title' ? (
                        <Box>
                          <Link component={RouterLink} to={getPath(item)} color="text.primary" fontWeight={600}>
                            {getTitle(item)}
                          </Link>
                          {isSmall && getYear(item) && (
                            <Typography variant="caption" color="text.secondary" display="block">{getYear(item)}</Typography>
                          )}
                        </Box>
                      ) : (
                        column.render(item)
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap', pl: 0, pr: { xs: 1, sm: 2 } }}>
                    {canEdit && (
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
                        {renderStatus(item)}
                        <Tooltip title="Remove from list">
                          <IconButton size="small" onClick={() => setPendingDelete(item)} aria-label={`Remove ${getTitle(item)}`}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {rows.length > 25 && (
        <TablePagination
          component="div"
          rowsPerPageOptions={[25, 50, 100, { label: 'All', value: -1 }]}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage={isSmall ? 'Rows' : 'Rows per page'}
        />
      )}
    </Paper>
  );
};

export default MediaListTable;

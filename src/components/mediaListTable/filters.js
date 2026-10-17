import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  Slider,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TuneIcon from '@mui/icons-material/Tune';
import { getUserById } from '../../api/userDataStorage';

// Cache "added by" lookups so each user is fetched once, not once per row
const userCache = new Map();
export const fetchUserName = (uid) => {
  if (!uid) return Promise.resolve('');
  if (!userCache.has(uid)) {
    userCache.set(
      uid,
      getUserById(uid)
        .then((u) => u.firstName || u.email || '')
        .catch(() => '')
    );
  }
  return userCache.get(uid);
};

export const emptyFilters = {
  search: '',
  status: 'all',
  genres: [],
  years: null, // [min, max] or null for any
  minRating: 0,
  length: null, // [min, max] or null for any
  addedBy: [],
};

const readStored = (key) => {
  if (!key) return null;
  try {
    const value = sessionStorage.getItem(`listFilters:${key}`);
    return value ? { ...emptyFilters, ...JSON.parse(value) } : null;
  } catch {
    return null;
  }
};

/** Filter state persisted per list for the browser session */
export const useListFilters = (storageKey) => {
  const [filters, setFilters] = useState(() => readStored(storageKey) || emptyFilters);
  useEffect(() => {
    if (!storageKey) return;
    try {
      sessionStorage.setItem(`listFilters:${storageKey}`, JSON.stringify(filters));
    } catch {
      // Not persisted – filters still work for this view
    }
  }, [filters, storageKey]);
  return [filters, setFilters];
};

const inRange = (value, range) => range === null || (value !== null && value !== undefined && value >= range[0] && value <= range[1]);

export const applyFilters = (items, filters, cfg) => {
  const term = filters.search.trim().toLowerCase();
  return items.filter((item) => {
    if (term && !cfg.getTitle(item).toLowerCase().includes(term)) return false;
    if (filters.status !== 'all' && cfg.getStatus(item) !== filters.status) return false;
    if (filters.genres.length) {
      const names = cfg.getGenres(item);
      if (!filters.genres.some((g) => names.includes(g))) return false;
    }
    if (!inRange(cfg.getYearNumber(item), filters.years)) return false;
    if (filters.minRating > 0 && !((item.vote_average || 0) >= filters.minRating)) return false;
    if (cfg.length && !inRange(cfg.length.getValue(item), filters.length)) return false;
    if (filters.addedBy.length && !filters.addedBy.includes(item.addedBy)) return false;
    return true;
  });
};

/** Filters behind the "Filters" button (everything except search and status) */
export const countPanelFilters = (f) =>
  (f.genres.length ? 1 : 0) + (f.years ? 1 : 0) + (f.minRating > 0 ? 1 : 0) + (f.length ? 1 : 0) + (f.addedBy.length ? 1 : 0);

const bounds = (values) => {
  const nums = values.filter((v) => typeof v === 'number' && !isNaN(v));
  return nums.length ? [Math.min(...nums), Math.max(...nums)] : null;
};

/** Options available for this set of items (genres, ranges, people) */
export const useFilterOptions = (items, cfg) => {
  const [names, setNames] = useState({});
  const options = useMemo(() => {
    const genreCounts = new Map();
    items.forEach((item) => cfg.getGenres(item).forEach((g) => genreCounts.set(g, (genreCounts.get(g) || 0) + 1)));
    return {
      genres: [...genreCounts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([name, count]) => ({ name, count })),
      years: bounds(items.map(cfg.getYearNumber)),
      length: cfg.length ? bounds(items.map(cfg.length.getValue)) : null,
      addedBy: [...new Set(items.map((i) => i.addedBy).filter(Boolean))],
    };
  }, [items, cfg]);

  useEffect(() => {
    let active = true;
    Promise.all(options.addedBy.map(async (uid) => [uid, await fetchUserName(uid)])).then((pairs) => {
      if (active) setNames(Object.fromEntries(pairs));
    });
    return () => {
      active = false;
    };
  }, [options.addedBy]);

  return { ...options, names };
};

const RangeField = ({ label, range, value, onChange, format = (v) => v, step = 1 }) => {
  if (!range || range[0] === range[1]) return null;
  const current = value || range;
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" fontWeight={600}>{label}</Typography>
        <Typography variant="body2" color="text.secondary">
          {value ? `${format(current[0])} – ${format(current[1])}` : 'Any'}
        </Typography>
      </Stack>
      <Slider
        size="small"
        value={current}
        min={range[0]}
        max={range[1]}
        step={step}
        onChange={(e, v) => onChange(v[0] === range[0] && v[1] === range[1] ? null : v)}
        valueLabelDisplay="auto"
        valueLabelFormat={format}
        disableSwap
        sx={{ mx: 1, width: 'calc(100% - 16px)' }}
      />
    </Box>
  );
};

const PanelContent = ({ filters, setFilters, options, cfg }) => {
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));
  return (
    <Stack spacing={3}>
      {options.genres.length > 0 && (
        <FormControl size="small" fullWidth>
          <InputLabel id="genre-filter-label">Genres</InputLabel>
          <Select
            labelId="genre-filter-label"
            multiple
            value={filters.genres}
            onChange={(e) => update({ genres: e.target.value })}
            input={<OutlinedInput label="Genres" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
          >
            {options.genres.map((g) => (
              <MenuItem key={g.name} value={g.name} dense>
                <Checkbox size="small" checked={filters.genres.includes(g.name)} />
                <ListItemText primary={g.name} secondary={`${g.count}`} secondaryTypographyProps={{ component: 'span', sx: { ml: 1 } }} sx={{ display: 'flex', alignItems: 'baseline' }} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <RangeField label="Year" range={options.years} value={filters.years} onChange={(years) => update({ years })} />

      <Box>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" fontWeight={600}>Minimum rating</Typography>
          <Typography variant="body2" color="text.secondary">{filters.minRating > 0 ? `${filters.minRating}+` : 'Any'}</Typography>
        </Stack>
        <Slider
          size="small"
          value={filters.minRating}
          min={0}
          max={9}
          step={0.5}
          marks={[{ value: 0 }, { value: 5 }, { value: 7 }, { value: 8 }, { value: 9 }]}
          onChange={(e, v) => update({ minRating: v })}
          valueLabelDisplay="auto"
          sx={{ mx: 1, width: 'calc(100% - 16px)' }}
        />
      </Box>

      {cfg.length && (
        <RangeField
          label={cfg.length.label}
          range={options.length}
          value={filters.length}
          onChange={(length) => update({ length })}
          format={cfg.length.format}
          step={cfg.length.step || 1}
        />
      )}

      {options.addedBy.length > 1 && (
        <FormControl size="small" fullWidth>
          <InputLabel id="added-by-filter-label">Added by</InputLabel>
          <Select
            labelId="added-by-filter-label"
            multiple
            value={filters.addedBy}
            onChange={(e) => update({ addedBy: e.target.value })}
            input={<OutlinedInput label="Added by" />}
            renderValue={(selected) => selected.map((uid) => options.names[uid] || 'Unknown').join(', ')}
          >
            {options.addedBy.map((uid) => (
              <MenuItem key={uid} value={uid} dense>
                <Checkbox size="small" checked={filters.addedBy.includes(uid)} />
                <ListItemText primary={options.names[uid] || 'Unknown'} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Stack>
  );
};

/** "Filters" button that opens a popover (desktop) or full-screen dialog (phone) */
export const FilterButton = ({ filters, setFilters, options, cfg, resultCount, noun }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchor, setAnchor] = useState(null);
  const active = countPanelFilters(filters);
  const clearPanel = () => setFilters((f) => ({ ...emptyFilters, search: f.search, status: f.status }));
  const close = () => setAnchor(null);
  const doneLabel = resultCount === undefined ? 'Done' : `Show ${resultCount} ${resultCount === 1 ? noun.singular : noun.plural}`;

  const content = <PanelContent filters={filters} setFilters={setFilters} options={options} cfg={cfg} />;

  return (
    <>
      <Badge color="primary" badgeContent={active} invisible={!active}>
        <Button variant="outlined" color="inherit" startIcon={<TuneIcon fontSize="small" />} onClick={(e) => setAnchor(e.currentTarget)} sx={{ borderColor: 'divider' }}>
          Filters
        </Button>
      </Badge>
      {isSmall ? (
        <Dialog open={!!anchor} onClose={close} fullScreen PaperProps={{ sx: { borderRadius: 0 } }}>
          <DialogTitle>Filters</DialogTitle>
          <DialogContent dividers>{content}</DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button color="inherit" onClick={clearPanel} disabled={!active}>Clear</Button>
            <Button variant="contained" onClick={close}>{doneLabel}</Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Popover
          open={!!anchor}
          anchorEl={anchor}
          onClose={close}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { mt: 1, p: 2.5, width: 360, borderRadius: '16px' } }}
        >
          {content}
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
            <Button color="inherit" onClick={clearPanel} disabled={!active}>Clear</Button>
            <Button variant="contained" onClick={close}>{doneLabel}</Button>
          </Stack>
        </Popover>
      )}
    </>
  );
};

/** Removable chips summarising every active filter */
export const ActiveFilterChips = ({ filters, setFilters, options, cfg }) => {
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const chips = [];
  if (filters.search.trim()) chips.push({ key: 'search', label: `“${filters.search.trim()}”`, onDelete: () => update({ search: '' }) });
  if (filters.status !== 'all') {
    const label = cfg.statuses.find((s) => s.value === filters.status)?.label;
    chips.push({ key: 'status', label, onDelete: () => update({ status: 'all' }) });
  }
  filters.genres.forEach((g) => chips.push({ key: `genre-${g}`, label: g, onDelete: () => update({ genres: filters.genres.filter((x) => x !== g) }) }));
  if (filters.years) chips.push({ key: 'years', label: `${filters.years[0]} – ${filters.years[1]}`, onDelete: () => update({ years: null }) });
  if (filters.minRating > 0) chips.push({ key: 'rating', label: `Rated ${filters.minRating}+`, onDelete: () => update({ minRating: 0 }) });
  if (filters.length && cfg.length) {
    const f = cfg.length.format || ((v) => v);
    chips.push({ key: 'length', label: `${cfg.length.label}: ${f(filters.length[0])} – ${f(filters.length[1])}`, onDelete: () => update({ length: null }) });
  }
  filters.addedBy.forEach((uid) =>
    chips.push({ key: `by-${uid}`, label: `Added by ${options.names[uid] || 'Unknown'}`, onDelete: () => update({ addedBy: filters.addedBy.filter((x) => x !== uid) }) })
  );

  if (chips.length === 0) return null;
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center" sx={{ px: 2, pb: 2 }}>
      {chips.map((c) => (
        <Chip key={c.key} size="small" label={c.label} onDelete={c.onDelete} />
      ))}
      {chips.length > 1 && (
        <Button size="small" onClick={() => setFilters(emptyFilters)}>Clear all</Button>
      )}
    </Stack>
  );
};

// TMDB genre ids (movie + TV) for older list entries that only stored genre_ids
const GENRE_NAMES = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama',
  10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance',
  878: 'Science Fiction', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western', 10759: 'Action & Adventure',
  10762: 'Kids', 10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics',
};

export const genreNames = (item) => {
  if (Array.isArray(item.genres) && item.genres.length) return item.genres.map((g) => g.name).filter(Boolean);
  return (item.genre_ids || []).map((id) => GENRE_NAMES[id]).filter(Boolean);
};

export const yearNumber = (date) => {
  if (!date) return null;
  const year = new Date(date).getFullYear();
  return isNaN(year) ? null : year;
};

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Pagination,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  getTrendingMovies,
  getMovieSearchResults,
  getTrendingTVShows,
  getTVShowSearchResults,
} from '../../api/TMDBAPI';
import { getBooks, getBookSearchResults } from '../../api/bookAPI';
import MovieCard from '../../components/MovieComponents/movieCard';
import BookCard from '../../components/bookComponents/bookCard';
import TVCard from '../../components/TVComponents/TVCard';
import { FeatureFlagContext } from '../../contexts/featureFlagContext';

const PAGE_SIZE = 18;
const MAX_PAGES = 500; // TMDB caps paging at 500
const TAB_LABELS = ['Movies', 'TV Shows', 'Books'];

// Session-scoped cache so trending data doesn't go stale or fill localStorage
const cacheGet = (key) => {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};
const cacheSet = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota/availability errors – caching is best effort
  }
};

const fetchResults = async (tab, page, query) => {
  if (tab === 0) {
    return query ? getMovieSearchResults(page, query) : (await getTrendingMovies(page)).results;
  }
  if (tab === 1) {
    return query ? getTVShowSearchResults(page, query) : (await getTrendingTVShows(page)).results;
  }
  const data = query ? await getBookSearchResults(page, query, PAGE_SIZE) : await getBooks(page, PAGE_SIZE);
  return (query ? data?.docs : data?.works) || [];
};

const Homepage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getFeatureFlag } = useContext(FeatureFlagContext);
  const booksEnabled = getFeatureFlag('Books')?.enabled;
  const maxTab = booksEnabled ? 2 : 1;

  const tab = Math.min(Math.max(parseInt(searchParams.get('tab'), 10) || 0, 0), maxTab);
  const page = Math.min(Math.max(parseInt(searchParams.get('page'), 10) || 1, 1), MAX_PAGES);
  const query = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => setSearchInput(query), [query]);

  const load = useCallback(async () => {
    const cacheKey = `browse-${tab}-${page}-${query}`;
    const cached = cacheGet(cacheKey);
    if (cached) {
      setItems(cached);
      setLoading(false);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const results = (await fetchResults(tab, page, query)).slice(0, PAGE_SIZE);
      setItems(results);
      cacheSet(cacheKey, results);
    } catch (err) {
      console.error('Error fetching data:', err);
      setItems([]);
      setError('Something went wrong loading results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [tab, page, query]);

  useEffect(() => {
    load();
  }, [load]);

  const updateParams = (next) => {
    const params = { tab: String(tab), page: String(page), q: query, ...next };
    if (!params.q) delete params.q;
    setSearchParams(params, { replace: true });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateParams({ q: searchInput.trim(), page: '1' });
  };

  const handlePageChange = (event, value) => {
    updateParams({ page: String(value) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const label = TAB_LABELS[tab];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" component="h1">
            {query ? `Results for “${query}”` : `Trending ${label}`}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {query ? `Searching ${label.toLowerCase()}` : `What everyone is watching today`}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ md: 'center' }}
          justifyContent="space-between"
          sx={{ borderBottom: 1, borderColor: 'divider', pb: { xs: 2, md: 0 } }}
        >
          <Tabs
            value={tab}
            onChange={(e, value) => setSearchParams({ tab: String(value), page: '1' }, { replace: true })}
          >
            <Tab label="Movies" />
            <Tab label="TV Shows" />
            {booksEnabled && <Tab label="Books" />}
          </Tabs>
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1, width: { md: 420 }, pb: { md: 1 } }}>
            <TextField
              size="small"
              fullWidth
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained">Search</Button>
            {query && (
              <Button onClick={() => updateParams({ q: '', page: '1' })} color="inherit">
                Clear
              </Button>
            )}
          </Box>
        </Stack>

        {error && (
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={load}>Retry</Button>}>
            {error}
          </Alert>
        )}

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={i}>
                  <Skeleton variant="rounded" sx={{ aspectRatio: '2 / 3', height: 'auto', borderRadius: '12px' }} />
                  <Skeleton width="80%" sx={{ mt: 1 }} />
                  <Skeleton width="30%" />
                </Grid>
              ))
            : items.map((item, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={item.id || item.key || index}>
                  {tab === 0 && <MovieCard movie={item} />}
                  {tab === 1 && <TVCard tv={item} />}
                  {tab === 2 && <BookCard book={item} />}
                </Grid>
              ))}
        </Grid>

        {!loading && !error && items.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6">No results found</Typography>
            <Typography color="text.secondary">Try a different search term.</Typography>
          </Box>
        )}

        {!query && !error && (
          <Pagination
            count={MAX_PAGES}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            siblingCount={1}
            sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}
          />
        )}
      </Stack>
    </Container>
  );
};

export default Homepage;

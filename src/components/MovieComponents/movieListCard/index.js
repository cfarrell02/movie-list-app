import React, { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardActionArea, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MovieIcon from '@mui/icons-material/MovieOutlined';
import TvIcon from '@mui/icons-material/TvOutlined';
import { auth } from '../../../firebase-config';
import defaultImage from '../../../images/default.jpg';
import MenuBookIcon from '@mui/icons-material/MenuBookOutlined';
import { coverUrl } from '../../../api/bookAPI';
import { roleOf } from '../../../api/movieStorage';

const ACCESS_LABELS = ['Viewer', 'Contributor', 'Admin', 'Owner'];

const MovieListCard = ({ movieList, onDelete }) => {
  const movies = movieList.movies || [];
  const tvShows = movieList.tvShows || [];
  const books = movieList.books || [];
  const uid = auth.currentUser?.uid;
  const accessType = Math.max(roleOf(movieList, uid), 0);

  // Most recently added posters first, so the collage reflects recent activity (and doesn't reshuffle on every render)
  const posters = useMemo(() => {
    const withImage = [
      ...[...(movieList.movies || []), ...(movieList.tvShows || [])]
        .filter((item) => item.poster_path)
        .map((item) => ({ addedDate: item.addedDate, src: `https://image.tmdb.org/t/p/w342${item.poster_path}` })),
      ...(movieList.books || []).filter((b) => b.cover_i).map((b) => ({ addedDate: b.addedDate, src: coverUrl(b.cover_i, 'M') })),
    ];
    return withImage
      .sort((a, b) => new Date(b.addedDate || 0) - new Date(a.addedDate || 0))
      .slice(0, 4)
      .map((item) => item.src);
  }, [movieList.movies, movieList.tvShows, movieList.books]);

  const collage = posters.length >= 4 ? posters : posters.slice(0, 1);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow .2s', '&:hover': { boxShadow: 6 } }}>
      <CardActionArea component={RouterLink} to={`/movielist/${movieList.id}`} sx={{ flex: 1 }}>
        <Box
          sx={{
            aspectRatio: '16 / 10',
            display: 'grid',
            gridTemplateColumns: collage.length === 4 ? '1fr 1fr' : '1fr',
            gridTemplateRows: collage.length === 4 ? '1fr 1fr' : '1fr',
            gap: '2px',
            bgcolor: 'action.hover',
            overflow: 'hidden',
          }}
        >
          {collage.length === 0 ? (
            <Box component="img" src={defaultImage} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
          ) : (
            collage.map((src, i) => (
              <Box key={src + i} component="img" src={src} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 0 }} />
            ))
          )}
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" noWrap title={movieList.title}>{movieList.title}</Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 0.5, color: 'text.secondary' }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <MovieIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">{movies.length} {movies.length === 1 ? 'movie' : 'movies'}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <TvIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">{tvShows.length} {tvShows.length === 1 ? 'show' : 'shows'}</Typography>
            </Stack>
            {books.length > 0 && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <MenuBookIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">{books.length} {books.length === 1 ? 'book' : 'books'}</Typography>
              </Stack>
            )}
          </Stack>
        </Box>
      </CardActionArea>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pb: 1.5 }}>
        <Chip size="small" label={ACCESS_LABELS[accessType] || 'Viewer'} color={accessType === 3 ? 'primary' : 'default'} variant="outlined" />
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Chip size="small" label="TV shows" component={RouterLink} to={`/movielist/${movieList.id}?tab=tv`} clickable />
          {accessType >= 2 && (
            <Tooltip title="Delete list">
              <IconButton size="small" onClick={() => onDelete(movieList.id)} aria-label="Delete list">
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

export default MovieListCard;

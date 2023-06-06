import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Checkbox, Typography } from '@mui/material';
import MovieTableRow from '../movieTableRow';
import CircularProgress from '@mui/material/CircularProgress';
import { orderBy } from 'lodash';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const MovieTable = ({ movies, deleteMovie, editMovie, loading }) => {
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedMovies = orderBy(movies, [sortConfig.key], [sortConfig.direction]);

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />;
    }
    return null;
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow align="left">
          <TableCell >
              <Typography variant="subtitle2" component="div">
                Poster
              </Typography>
            </TableCell>
            <TableCell onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Title {getSortIcon('title')}
              </Typography>
            </TableCell>
            <TableCell align="center" >
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Tagline 
              </Typography>
            </TableCell>
            <TableCell align="right" onClick={() => handleSort('release_date')} style={{ cursor: 'pointer'}} >
            <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
            Release{"\u00A0"}Date {getSortIcon('release_date')}
          </Typography>

            </TableCell>
            <TableCell align="right" onClick={() => handleSort('vote_average')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Rating {getSortIcon('vote_average')}
              </Typography>
            </TableCell>
            <TableCell align="right" onClick={() => handleSort('runtime')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Runtime {getSortIcon('runtime')}
              </Typography>
            </TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell align="center" colSpan={6}>
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : (
            sortedMovies.map((movie) => (
              <MovieTableRow
                handleDelete={deleteMovie}
                handleEdit={editMovie}
                key={movie.id}
                movie={movie}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MovieTable;

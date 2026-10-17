import React, { useContext, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { AlertContext } from '../../../contexts/alertContext';
import { getMovie, getTVShow } from '../../../api/TMDBAPI';
import { bookFromDoc, getBookSummary } from '../../../api/bookAPI';
import { getMovieListById, updateMovieList } from '../../../api/movieStorage';
import {
  buildExportRows,
  downloadFile,
  mapWithConcurrency,
  parseImportFile,
  safeFileName,
  toCSV,
  toJSON,
  toListEntry,
} from '../../../listTransfer';

const MAX_IMPORT = 500;
const MAX_FILE_BYTES = 2 * 1024 * 1024;

const countLabel = (n, noun) => `${n} ${noun}${n === 1 ? '' : 's'}`;

/** Export a list as CSV/JSON, or import one of those files into it */
const ListTransfer = ({ movieList, accessType, currentUserID, onImported }) => {
  const { addAlert } = useContext(AlertContext);
  const fileInput = useRef(null);
  const [pending, setPending] = useState(null); // { fileName, toAdd, existing, invalid, truncated }
  const [progress, setProgress] = useState(null); // { done, total }
  const [error, setError] = useState('');
  const canImport = accessType > 0;

  const handleExport = (format) => {
    try {
      const rows = buildExportRows(movieList);
      const base = safeFileName(movieList.title);
      if (format === 'csv') {
        // BOM so Excel opens accented titles correctly
        downloadFile(`﻿${toCSV(rows)}`, `${base}.csv`, 'text/csv;charset=utf-8');
      } else {
        downloadFile(toJSON(movieList, rows), `${base}.json`, 'application/json');
      }
      addAlert('success', `Exported ${rows.length} ${rows.length === 1 ? 'title' : 'titles'}.`);
    } catch (err) {
      console.error('Error exporting watch list:', err);
      addAlert('error', 'Could not export this list.');
    }
  };

  const handleFileChosen = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow choosing the same file again
    if (!file) return;
    setError('');
    try {
      if (file.size > MAX_FILE_BYTES) throw new Error('That file is too large (max 2 MB).');
      const { items, invalid } = parseImportFile(file.name, await file.text());
      if (items.length === 0) throw new Error('No titles with a TMDB or Open Library id were found in that file.');
      const existingKeys = new Set([
        ...(movieList.movies || []).map((m) => `movie-${m.id}`),
        ...(movieList.tvShows || []).map((t) => `tv-${t.id}`),
        ...(movieList.books || []).map((b) => `book-${b.id}`),
      ]);
      const fresh = items.filter((item) => !existingKeys.has(`${item.type}-${item.id}`));
      setPending({
        fileName: file.name,
        toAdd: fresh.slice(0, MAX_IMPORT),
        existing: items.length - fresh.length,
        invalid,
        truncated: Math.max(fresh.length - MAX_IMPORT, 0),
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImport = async () => {
    const { toAdd } = pending;
    setProgress({ done: 0, total: toAdd.length });
    const memberByEmail = new Map((movieList.users || []).map((u) => [String(u.email || '').toLowerCase(), u.uid]));
    try {
      const fetched = await mapWithConcurrency(
        toAdd,
        6,
        async (item) => {
          let details;
          if (item.type === 'book') {
            const doc = await getBookSummary(item.id);
            if (!doc) throw new Error('Book not found');
            details = bookFromDoc(doc);
          } else {
            details = item.type === 'movie' ? await getMovie(item.id) : await getTVShow(item.id);
          }
          return {
            type: item.type,
            entry: {
              ...toListEntry(details, item.type),
              watched: item.watched,
              addedDate: item.addedDate || new Date().toISOString(),
              // Keep the original adder if they're a member of this list, otherwise credit the importer
              addedBy: memberByEmail.get(item.addedByEmail) || currentUserID,
            },
          };
        },
        (done, total) => setProgress({ done, total })
      );

      const ok = fetched.filter((r) => r && !r.error);
      const failed = fetched.length - ok.length;

      // Merge into the latest saved list so changes made since the page loaded aren't lost
      const latest = await getMovieListById(movieList.id);
      const movieIds = new Set((latest.movies || []).map((m) => m.id));
      const tvIds = new Set((latest.tvShows || []).map((t) => t.id));
      const bookIds = new Set((latest.books || []).map((b) => b.id));
      const newMovies = ok.filter((r) => r.type === 'movie' && !movieIds.has(r.entry.id)).map((r) => r.entry);
      const newShows = ok.filter((r) => r.type === 'tv' && !tvIds.has(r.entry.id)).map((r) => r.entry);
      const newBooks = ok.filter((r) => r.type === 'book' && !bookIds.has(r.entry.id)).map((r) => r.entry);

      if (newMovies.length || newShows.length || newBooks.length) {
        await updateMovieList(movieList.id, {
          movies: [...(latest.movies || []), ...newMovies],
          tvShows: [...(latest.tvShows || []), ...newShows],
          books: [...(latest.books || []), ...newBooks],
        });
      }

      const parts = [
        newMovies.length && countLabel(newMovies.length, 'movie'),
        newShows.length && countLabel(newShows.length, 'show'),
        newBooks.length && countLabel(newBooks.length, 'book'),
      ].filter(Boolean);
      addAlert(failed ? 'warning' : 'success', `Imported ${parts.length ? parts.join(', ') : 'nothing new'}${failed ? ` – ${failed} couldn't be found` : ''}.`);
      setPending(null);
      if (onImported) onImported();
    } catch (err) {
      console.error('Error importing watch list:', err);
      const tooBig = /exceeds the maximum|too large|longer than/i.test(err.message || '');
      setError(tooBig ? 'This list would be too large to save. Try importing fewer titles.' : 'Import failed. Nothing was added.');
      setPending(null);
    } finally {
      setProgress(null);
    }
  };

  const importing = progress !== null;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Download this list as a spreadsheet (CSV) or a backup file (JSON). Either can be imported into any list –
        titles already in the list are skipped.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={() => handleExport('csv')}>
          Export CSV
        </Button>
        <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={() => handleExport('json')}>
          Export JSON
        </Button>
        <Button
          variant="contained"
          startIcon={<FileUploadOutlinedIcon />}
          onClick={() => fileInput.current?.click()}
          disabled={!canImport}
        >
          Import file
        </Button>
        <input ref={fileInput} type="file" accept=".csv,.json,text/csv,application/json" hidden onChange={handleFileChosen} />
      </Stack>
      {!canImport && (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          You need contributor access to import into this list.
        </Typography>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Dialog open={!!pending} onClose={importing ? undefined : () => setPending(null)} fullWidth maxWidth="xs">
        <DialogTitle>Import into “{movieList.title}”?</DialogTitle>
        <DialogContent>
          {pending && (
            <>
              <DialogContentText>
                {pending.toAdd.length === 0
                  ? 'Everything in this file is already in the list.'
                  : `${[
                      ['movie', 'movie'],
                      ['tv', 'show'],
                      ['book', 'book'],
                    ]
                      .map(([type, noun]) => [pending.toAdd.filter((i) => i.type === type).length, noun])
                      .filter(([n]) => n > 0)
                      .map(([n, noun]) => countLabel(n, noun))
                      .join(', ')} will be added from ${pending.fileName}.`}
              </DialogContentText>
              <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                {pending.existing > 0 && (
                  <Typography variant="body2" color="text.secondary">{pending.existing} already in this list will be skipped.</Typography>
                )}
                {pending.invalid > 0 && (
                  <Typography variant="body2" color="text.secondary">{pending.invalid} {pending.invalid === 1 ? 'row' : 'rows'} without a valid id will be ignored.</Typography>
                )}
                {pending.truncated > 0 && (
                  <Typography variant="body2" color="warning.main">Only the first {MAX_IMPORT} new titles will be imported.</Typography>
                )}
              </Stack>
              {importing && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={(progress.done / Math.max(progress.total, 1)) * 100} />
                  <Typography variant="caption" color="text.secondary">
                    Fetching details… {progress.done} of {progress.total}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="inherit" onClick={() => setPending(null)} disabled={importing}>Cancel</Button>
          <Button variant="contained" onClick={handleImport} disabled={importing || !pending || pending.toAdd.length === 0}>
            {importing ? 'Importing…' : 'Import'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListTransfer;

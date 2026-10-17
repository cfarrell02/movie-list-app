import React, { useContext, useEffect, useRef, useState } from 'react';
import { Autocomplete, Avatar, Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AlertContext } from '../../contexts/alertContext';
import { SiteDataContext } from '../../contexts/siteDataContext';
import { filterAdult } from '../../utils';
import { toListEntry } from '../../listTransfer';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Search TMDB and add the chosen title to a list.
 * search(query) -> results, fetchDetails(option) -> full item, persist(item) -> saves it.
 * getThumb(option) -> image URL (defaults to the TMDB poster).
 */
const tmdbThumb = (option) => (option.poster_path ? `https://image.tmdb.org/t/p/w92${option.poster_path}` : undefined);

const MediaAddBar = ({ type, items, setItems, disabled, currentUserID, search, fetchDetails, persist, getTitle, getDate, initialWatched, noun, getThumb = tmdbThumb, getSubtitle }) => {
  const { addAlert } = useContext(AlertContext);
  const { adultContent } = useContext(SiteDataContext);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    const query = input.trim();
    if (!query || (selected && getTitle(selected) === input)) {
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      try {
        const results = await search(query);
        if (id === requestId.current) setOptions(filterAdult(results, adultContent).sort((a, b) => (b.popularity || 0) - (a.popularity || 0)));
      } catch (error) {
        if (id === requestId.current) addAlert('error', error.message);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = async () => {
    if (!selected) return;
    if (items.find((i) => i.id === selected.id)) {
      addAlert('warning', `${getTitle(selected)} is already in this list.`);
      return;
    }
    setAdding(true);
    try {
      const details = await fetchDetails(selected);
      const entry = { ...toListEntry(details, type), watched: initialWatched, addedDate: new Date().toISOString(), addedBy: currentUserID };
      await persist(entry);
      setItems([...items, entry]);
      addAlert('success', `${getTitle(entry)} added to list.`);
      setSelected(null);
      setInput('');
      setOptions([]);
    } catch (error) {
      console.error(error);
      addAlert('error', error.message);
    } finally {
      setAdding(false);
    }
  };

  const yearOf = (option) => {
    const date = getDate(option);
    return date ? new Date(date).getFullYear() : null;
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
      <Autocomplete
        fullWidth
        disabled={disabled}
        options={options}
        value={selected}
        inputValue={input}
        onInputChange={(e, value) => setInput(value)}
        onChange={(e, value) => setSelected(value)}
        filterOptions={(x) => x}
        loading={loading}
        autoHighlight
        forcePopupIcon={false}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        getOptionLabel={getTitle}
        noOptionsText={input.trim() ? 'No results' : `Start typing to search ${noun.plural}`}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id} sx={{ gap: 1.5 }}>
            <Avatar
              variant="rounded"
              src={getThumb(option)}
              sx={{ width: 32, height: 48, bgcolor: 'action.hover' }}
            >
              {getTitle(option).charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>{getTitle(option)}</Typography>
              <Typography variant="caption" color="text.secondary">{getSubtitle ? getSubtitle(option) : yearOf(option) || 'Unreleased'}</Typography>
            </Box>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            placeholder={disabled ? `You have view-only access to this list` : `Search for a ${noun.singular} to add…`}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={16} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <Button
        variant="contained"
        startIcon={adding ? <CircularProgress color="inherit" size={16} /> : <AddIcon />}
        onClick={handleAdd}
        disabled={disabled || !selected || adding}
        sx={{ flexShrink: 0, minWidth: 140 }}
      >
        Add {noun.singular}
      </Button>
    </Stack>
  );
};

export default MediaAddBar;

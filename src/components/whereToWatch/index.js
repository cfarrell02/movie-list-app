import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Button, Card, Link, MenuItem, Select, Stack, Tooltip, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Section } from '../detail';

const COUNTRY_KEY = 'watchCountry';

const GROUPS = [
  { key: 'flatrate', label: 'Stream' },
  { key: 'free', label: 'Free' },
  { key: 'ads', label: 'Free with ads' },
  { key: 'rent', label: 'Rent' },
  { key: 'buy', label: 'Buy' },
];

const regionNames = typeof Intl !== 'undefined' && Intl.DisplayNames ? new Intl.DisplayNames(['en'], { type: 'region' }) : null;
const countryName = (code) => {
  try {
    return regionNames?.of(code) || code;
  } catch {
    return code;
  }
};

// Remembered choice first, then the browser locale's region (e.g. en-IE -> IE)
const preferredCountry = () => {
  try {
    const saved = localStorage.getItem(COUNTRY_KEY);
    if (saved) return saved;
  } catch {
    // Storage unavailable – fall back to the locale
  }
  const locale = (navigator.languages && navigator.languages[0]) || navigator.language || '';
  const region = locale.split('-')[1];
  return region ? region.toUpperCase() : 'US';
};

/**
 * Lists where a title can be streamed, rented or bought, plus an "Open in Stremio" link.
 * fetchProviders(id) resolves to TMDB's per-country provider map.
 * The whole section is hidden when no country has any providers; onAvailability(bool) reports which.
 */
const WhereToWatch = ({ id, fetchProviders, stremioUrl, title = 'Where to watch', onAvailability }) => {
  const [providers, setProviders] = useState(null);
  const [country, setCountry] = useState(preferredCountry);

  useEffect(() => {
    let active = true;
    setProviders(null);
    fetchProviders(id)
      .then((data) => active && setProviders(data || {}))
      .catch(() => active && setProviders({}));
    return () => {
      active = false;
    };
  }, [id, fetchProviders]);

  const countries = useMemo(
    () => Object.keys(providers || {}).sort((a, b) => countryName(a).localeCompare(countryName(b))),
    [providers]
  );

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
    try {
      localStorage.setItem(COUNTRY_KEY, event.target.value);
    } catch {
      // Not persisted – fine for this session
    }
  };

  const available = providers !== null && countries.length > 0;
  // Report after render so the page can surface the Stremio link elsewhere when this is hidden
  useEffect(() => {
    if (providers !== null && onAvailability) onAvailability(available);
  }, [providers, available]); // eslint-disable-line react-hooks/exhaustive-deps

  if (providers === null || !available) return null;

  const current = providers[country];
  const groups = current ? GROUPS.filter((g) => current[g.key]?.length) : [];

  return (
    <Section title={title}>
    <Card sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 2.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
          <Typography color="text.secondary" variant="body2" sx={{ whiteSpace: 'nowrap' }}>Showing availability in</Typography>
          <Select size="small" value={country} onChange={handleCountryChange} sx={{ minWidth: { sm: 180 } }} inputProps={{ 'aria-label': 'Country' }}>
            {!countries.includes(country) && <MenuItem value={country}>{countryName(country)}</MenuItem>}
            {countries.map((code) => (
              <MenuItem key={code} value={code}>{countryName(code)}</MenuItem>
            ))}
          </Select>
        </Stack>
        {stremioUrl && (
          <Button variant="outlined" color="inherit" endIcon={<OpenInNewIcon fontSize="small" />} href={stremioUrl} target="_blank" rel="noopener noreferrer" sx={{ borderColor: 'divider', alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
            Open in Stremio
          </Button>
        )}
      </Stack>

      {groups.length === 0 ? (
        <Typography color="text.secondary">
          Not available to stream, rent or buy in {countryName(country)}
          {countries.length > 0 ? ' – try another country.' : '.'}
        </Typography>
      ) : (
        <Stack spacing={2.5}>
          {groups.map((group) => (
            <Box key={group.key}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>
                {group.label}
              </Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                {current[group.key].map((provider) => (
                  <Tooltip key={provider.provider_id} title={provider.provider_name}>
                    {/* TMDB only supplies one link per title and country; it lists every provider with deep links */}
                    <Box component="a" href={current.link} target="_blank" rel="noopener noreferrer" aria-label={`${group.label} on ${provider.provider_name}`} sx={{ display: 'block', borderRadius: '12px', transition: 'transform .15s', '&:hover': { transform: 'translateY(-2px)' } }}>
                      <Avatar
                        variant="rounded"
                        src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                        alt={provider.provider_name}
                        sx={{ width: 48, height: 48, borderRadius: '12px', boxShadow: 1 }}
                      />
                    </Box>
                  </Tooltip>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2.5 }}>
        Availability data from{' '}
        <Link href="https://www.justwatch.com/" target="_blank" rel="noopener noreferrer" color="inherit">JustWatch</Link>.
      </Typography>
    </Card>
    </Section>
  );
};

export default WhereToWatch;

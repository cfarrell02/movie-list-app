import React, { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Button, Card, CardActionArea, Grid, Tab, Tabs, Typography } from '@mui/material';
import { mergeCrew } from '../../detail';

const INITIAL_COUNT = 24;

const dateValue = (date) => (date ? new Date(date).getTime() : 0);

// Newest to oldest, with undated (unannounced) credits last
const byNewest = (getDate) => (a, b) => {
  const da = dateValue(getDate(a));
  const db = dateValue(getDate(b));
  if (!da || !db) return !da && !db ? 0 : !da ? 1 : -1;
  return db - da;
};

const CreditGrid = ({ credits, getTitle, getDate, getRole, getPath }) => {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? credits : credits.slice(0, INITIAL_COUNT);
  return (
    <>
      <Grid container spacing={1.5}>
        {shown.map((credit, index) => {
          const date = getDate(credit);
          return (
            <Grid item xs={12} sm={6} md={4} key={`${credit.id}-${getRole(credit)}-${index}`}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea component={RouterLink} to={getPath(credit)} sx={{ p: 1.25, display: 'flex', justifyContent: 'flex-start', gap: 1.5, height: '100%' }}>
                  <Avatar
                    variant="rounded"
                    src={credit.poster_path ? `https://image.tmdb.org/t/p/w92${credit.poster_path}` : undefined}
                    alt={getTitle(credit)}
                    sx={{ width: 40, height: 60, bgcolor: 'action.hover' }}
                  >
                    {getTitle(credit)?.charAt(0)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{getTitle(credit)}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap component="div">
                      {[date ? new Date(date).getFullYear() : 'Upcoming', getRole(credit)].filter(Boolean).join(' · ')}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      {credits.length > INITIAL_COUNT && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button onClick={() => setExpanded(!expanded)}>{expanded ? 'Show less' : `Show all ${credits.length}`}</Button>
        </Box>
      )}
    </>
  );
};

const PersonCreditsSection = ({ person }) => {
  const movieCast = useMemo(() => [...(person.credits?.cast || [])].sort(byNewest((c) => c.release_date)), [person]);
  const tvCast = useMemo(() => [...(person.tvCredits?.cast || [])].sort(byNewest((c) => c.first_air_date)), [person]);
  const crew = useMemo(() => mergeCrew(person.credits?.crew).sort(byNewest((c) => c.release_date)), [person]);

  const tabs = [
    movieCast.length > 0 && {
      label: `Movies (${movieCast.length})`,
      content: <CreditGrid credits={movieCast} getTitle={(c) => c.title} getDate={(c) => c.release_date} getRole={(c) => c.character} getPath={(c) => `/movie/${c.id}`} />,
    },
    tvCast.length > 0 && {
      label: `TV (${tvCast.length})`,
      content: <CreditGrid credits={tvCast} getTitle={(c) => c.name} getDate={(c) => c.first_air_date} getRole={(c) => c.character} getPath={(c) => `/tvshow/${c.id}`} />,
    },
    crew.length > 0 && {
      label: `Crew (${crew.length})`,
      content: <CreditGrid credits={crew} getTitle={(c) => c.title} getDate={(c) => c.release_date} getRole={(c) => c.job} getPath={(c) => `/movie/${c.id}`} />,
    },
  ].filter(Boolean);

  const [tab, setTab] = useState(0);

  if (tabs.length === 0) return <Typography color="text.secondary">No credits available.</Typography>;
  const current = tabs[Math.min(tab, tabs.length - 1)];

  return (
    <Box>
      <Tabs value={Math.min(tab, tabs.length - 1)} onChange={(e, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        {tabs.map((t) => (
          <Tab key={t.label} label={t.label} />
        ))}
      </Tabs>
      {current.content}
    </Box>
  );
};

export default PersonCreditsSection;

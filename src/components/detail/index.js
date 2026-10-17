import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Link,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { dateReadableFormatter } from '../../utils';
import defaultImage from '../../images/default.jpg';

const tmdbImage = (path, size = 'w500') => (path ? `https://image.tmdb.org/t/p/${size}${path}` : null);

export const SectionHeading = ({ children, action }) => (
  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
    <Typography variant="h4" component="h2">{children}</Typography>
    {action}
  </Stack>
);

export const Section = ({ title, action, children }) => (
  <Box component="section" sx={{ mt: { xs: 5, md: 6 } }}>
    <SectionHeading action={action}>{title}</SectionHeading>
    {children}
  </Box>
);

/** Full-bleed banner with backdrop, poster and headline info used on every detail page */
export const DetailHero = ({ backdropPath, posterPath, posterSrc, posterAlt, round, title, subtitle, meta = [], chips = [], rating, ratingScale = 10, voteCount, overview, actions }) => {
  const metaItems = meta.filter(Boolean);
  return (
  <Box sx={{ position: 'relative', overflow: 'hidden', borderBottom: 1, borderColor: 'divider' }}>
    {backdropPath && (
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${tmdbImage(backdropPath, 'w1280')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: (theme) => (theme.palette.mode === 'dark' ? 0.28 : 0.18),
          filter: 'blur(2px)',
          transform: 'scale(1.05)',
        }}
      />
    )}
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        background: (theme) =>
          `linear-gradient(to bottom, transparent 0%, ${theme.palette.background.default} 100%)`,
      }}
    />
    <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 4, md: 6 } }}>
      <Grid container spacing={{ xs: 3, md: 5 }} alignItems={{ md: 'flex-end' }}>
        <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
          <Box
            component="img"
            src={posterSrc || tmdbImage(posterPath) || defaultImage}
            alt={posterAlt || title}
            sx={{
              width: { xs: round ? 180 : 200, sm: '100%' },
              aspectRatio: round ? '1 / 1' : '2 / 3',
              objectFit: 'cover',
              borderRadius: round ? '50%' : '12px',
              boxShadow: 8,
              bgcolor: 'action.hover',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="h6" color="text.secondary" sx={{ fontStyle: 'italic', fontWeight: 400, mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            {(metaItems.length > 0 || rating) && (
              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
                {rating ? (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <StarRoundedIcon sx={{ color: 'secondary.main' }} />
                    <Typography fontWeight={700}>{(Math.round(rating * 10) / 10).toFixed(1)}{ratingScale !== 10 ? <Typography component="span" color="text.secondary" fontWeight={400}> / {ratingScale}</Typography> : null}</Typography>
                    {voteCount ? <Typography color="text.secondary" variant="body2">({voteCount.toLocaleString()})</Typography> : null}
                  </Stack>
                ) : null}
                {/* Separators live inside the text so a wrapped line never ends on a dangling dot */}
                {metaItems.length > 0 && <Typography color="text.secondary">{metaItems.join('\u00A0· ')}</Typography>}
              </Stack>
            )}
            {chips.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {chips.map((chip) => (
                  <Chip key={chip} label={chip} size="small" variant="outlined" />
                ))}
              </Stack>
            )}
            {overview &&
              (typeof overview === 'string' ? (
                <Typography sx={{ maxWidth: 820, lineHeight: 1.7 }}>{overview}</Typography>
              ) : (
                overview
              ))}
            {actions && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }} flexWrap="wrap" useFlexGap>
                {actions}
              </Stack>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  </Box>
);
};

export const DetailHeroSkeleton = () => (
  <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={4} md={3}>
        <Skeleton variant="rounded" sx={{ aspectRatio: '2 / 3', height: 'auto', borderRadius: '12px' }} />
      </Grid>
      <Grid item xs={12} sm={8} md={9}>
        <Skeleton width="60%" height={64} />
        <Skeleton width="30%" />
        <Skeleton width="90%" sx={{ mt: 3 }} />
        <Skeleton width="85%" />
        <Skeleton width="70%" />
      </Grid>
    </Grid>
  </Container>
);

/** Labelled facts in a responsive grid */
export const hasValue = (value) => value !== undefined && value !== null && value !== '' && !(typeof value === 'number' && isNaN(value));

export const FactGrid = ({ facts }) => {
  const visible = facts.filter((f) => hasValue(f.value));
  if (visible.length === 0) return null;
  return (
    <Card sx={{ p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={3}>
        {visible.map((fact) => (
          <Grid item xs={6} sm={4} md={3} key={fact.label}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>
              {fact.label}
            </Typography>
            <Typography fontWeight={500} sx={{ mt: 0.25 }}>{fact.value}</Typography>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

/** Grid of people (cast or crew) with a show more toggle */
export const PeopleGrid = ({ people, getRole, initialCount = 12 }) => {
  const [expanded, setExpanded] = useState(false);
  if (!people || people.length === 0) return <Typography color="text.secondary">No information available.</Typography>;
  const shown = expanded ? people : people.slice(0, initialCount);
  return (
    <>
      <Grid container spacing={1.5}>
        {shown.map((person) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`${person.id}-${getRole(person)}`}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea component={RouterLink} to={`/person/${person.id}`} sx={{ p: 1.25, display: 'flex', justifyContent: 'flex-start', gap: 1.5, height: '100%' }}>
                <Avatar src={tmdbImage(person.profile_path, 'w185') || undefined} alt={person.name} sx={{ width: 48, height: 48 }}>
                  {person.name?.charAt(0)}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>{person.name}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap component="div">{getRole(person) || '—'}</Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      {people.length > initialCount && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show less' : `Show all ${people.length}`}
          </Button>
        </Box>
      )}
    </>
  );
};

/** Merge crew entries for the same person into one card with combined jobs */
export const mergeCrew = (crew = []) => {
  const byId = new Map();
  crew.forEach((member) => {
    const existing = byId.get(member.id);
    if (existing) existing.job = `${existing.job}, ${member.job}`;
    else byId.set(member.id, { ...member });
  });
  return [...byId.values()];
};

const Review = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const avatar = review.author_details?.avatar_path;
  const long = review.content.length > 600;
  return (
    <Box sx={{ py: 2.5 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
        <Avatar src={avatar && !avatar.startsWith('/http') ? tmdbImage(avatar, 'w185') : undefined} alt={review.author}>
          {review.author?.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Link href={`https://www.themoviedb.org/u/${review.author_details?.username}`} target="_blank" rel="noopener noreferrer" color="text.primary" fontWeight={600}>
            {review.author}
          </Link>
          <Typography variant="caption" color="text.secondary" display="block">{dateReadableFormatter(review.created_at)}</Typography>
        </Box>
        {review.author_details?.rating ? (
          <Chip size="small" icon={<StarRoundedIcon />} label={`${review.author_details.rating}/10`} />
        ) : null}
      </Stack>
      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'pre-line',
          lineHeight: 1.7,
          color: 'text.secondary',
          ...(!expanded && long ? { display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}),
        }}
      >
        {review.content}
      </Typography>
      {long && (
        <Button size="small" onClick={() => setExpanded(!expanded)} sx={{ mt: 0.5, px: 0 }}>
          {expanded ? 'Show less' : 'Read more'}
        </Button>
      )}
    </Box>
  );
};

/** Loads and displays reviews via the supplied fetcher */
export const ReviewList = ({ id, fetchReviews, title }) => {
  const [reviews, setReviews] = useState(null);
  useEffect(() => {
    if (!id) return undefined;
    let active = true;
    setReviews(null);
    fetchReviews(id, 1)
      .then((r) => active && setReviews(r || []))
      .catch(() => active && setReviews([]));
    return () => {
      active = false;
    };
  }, [id, fetchReviews]);

  // With a title, the list renders its own section and disappears entirely when there are no reviews
  if (title && (reviews === null || reviews.length === 0)) return null;
  if (reviews === null) return <Skeleton variant="rounded" height={120} />;
  if (reviews.length === 0) return <Typography color="text.secondary">No reviews yet.</Typography>;
  const list = (
    <Card sx={{ px: { xs: 2, sm: 3 } }}>
      <Stack divider={<Divider flexItem />}>
        {reviews.map((review) => (
          <Review key={review.id} review={review} />
        ))}
      </Stack>
    </Card>
  );
  return title ? <Section title={title}>{list}</Section> : list;
};

/** "Add to list" dropdown; resets after each pick so the same list can be chosen again */
export const AddToListSelect = ({ lists, onSelect }) => {
  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel id="add-to-list-label">Add to list</InputLabel>
      <Select labelId="add-to-list-label" label="Add to list" value="" onChange={onSelect}>
        {lists.length === 0 && <MenuItem disabled value="">No editable lists</MenuItem>}
        {lists.map((list) => (
          <MenuItem key={list.id} value={list.id}>{list.title}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const ExternalLinks = ({ links }) => (
  <Stack direction="row" spacing={1}>
    {links.filter((l) => l.href).map((link) => (
      <Button key={link.label} variant="outlined" color="inherit" size="small" href={link.href} target="_blank" rel="noopener noreferrer" sx={{ borderColor: 'divider' }}>
        {link.label}
      </Button>
    ))}
  </Stack>
);

/** Shown instead of a detail page whose subject is flagged adult while adult content is off */
export const AdultContentNotice = ({ kind = 'title' }) => (
  <Container maxWidth="sm" sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}>
    <VisibilityOffOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
    <Typography variant="h4" component="h1" sx={{ mt: 2 }}>This {kind} is hidden</Typography>
    <Typography color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
      {kind === 'list' ? 'It contains adult titles' : "It's marked as adult content"}, which is turned off for your account.
    </Typography>
    <Button component={RouterLink} to="/home" variant="contained">Back to browsing</Button>
  </Container>
);

/** Long text clamped to a few lines with a Read more toggle */
export const ExpandableText = ({ text, lines = 6, threshold = 700 }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const long = text.length > threshold;
  return (
    <Box>
      <Typography
        sx={{
          whiteSpace: 'pre-line',
          lineHeight: 1.7,
          maxWidth: 820,
          ...(!expanded && long ? { display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}),
        }}
      >
        {text}
      </Typography>
      {long && (
        <Button size="small" onClick={() => setExpanded(!expanded)} sx={{ px: 0, mt: 0.5 }}>
          {expanded ? 'Show less' : 'Read more'}
        </Button>
      )}
    </Box>
  );
};

/** Section with a fact grid; hidden when none of the facts have a value */
export const FactSection = ({ title, facts }) =>
  facts.some((f) => hasValue(f.value)) ? (
    <Section title={title}>
      <FactGrid facts={facts} />
    </Section>
  ) : null;

/**
 * How many grid items fit on one row at the current breakpoint.
 * `columns` mirrors the Grid item sizes, e.g. { xs: 2, sm: 3, md: 4, lg: 6 } for xs=6 sm=4 md=3 lg=2.
 */
export const useItemsPerRow = (columns) => {
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up('lg'));
  const md = useMediaQuery(theme.breakpoints.up('md'));
  const sm = useMediaQuery(theme.breakpoints.up('sm'));
  if (lg && columns.lg) return columns.lg;
  if (md && columns.md) return columns.md;
  if (sm && columns.sm) return columns.sm;
  return columns.xs;
};

export const ShowMoreButton = ({ expanded, total, noun = '', onClick }) => (
  <Box sx={{ textAlign: 'center', mt: 1.5 }}>
    <Button onClick={onClick}>{expanded ? 'Show less' : `Show more${total ? ` (${total}${noun ? ` ${noun}` : ''})` : ''}`}</Button>
  </Box>
);

const POSTER_COLUMNS = { xs: 2, sm: 3, md: 4, lg: 6 };

/** Grid of poster cards: one row by default with a Show more toggle; hidden when empty */
export const TitleGridSection = ({ title, items, renderItem }) => {
  const [expanded, setExpanded] = useState(false);
  const perRow = useItemsPerRow(POSTER_COLUMNS);
  if (!items || items.length === 0) return null;
  const shown = expanded ? items : items.slice(0, perRow);
  return (
    <Section title={title}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {shown.map((item) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
            {renderItem(item)}
          </Grid>
        ))}
      </Grid>
      {items.length > perRow && (
        <ShowMoreButton expanded={expanded} total={items.length} onClick={() => setExpanded(!expanded)} />
      )}
    </Section>
  );
};

/**
 * One "More from <studio/network>" row for every listed company that has other titles.
 * fetchTitles(companyId) -> { results }; companies with nothing to show are skipped.
 */
export const MoreFromCompany = ({ companies, currentId, fetchTitles, renderItem, filterItems = (x) => x }) => {
  const [rows, setRows] = useState([]);
  const key = (companies || []).map((c) => c.id).join(',');

  useEffect(() => {
    let active = true;
    setRows([]);
    Promise.all(
      (companies || []).map((company) =>
        fetchTitles(company.id)
          .then(({ results }) => ({ company, titles: filterItems(results).filter((t) => t.id !== currentId) }))
          .catch(() => null)
      )
    ).then((responses) => {
      // Keep the order the studios are listed in
      if (active) setRows(responses.filter((r) => r && r.titles.length > 0));
    });
    return () => {
      active = false;
    };
  }, [key, currentId]); // eslint-disable-line react-hooks/exhaustive-deps

  return rows.map(({ company, titles }) => (
    <TitleGridSection key={company.id} title={`More from ${company.name}`} items={titles} renderItem={renderItem} />
  ));
};

/** True when MediaDisplay would have something to show (embeddable video or at least one image) */
export const hasPlayableMedia = (videos, images) =>
  (videos || []).some((v) => v.site === 'YouTube' || v.site === 'Vimeo') || (images || []).length > 0;

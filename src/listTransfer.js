// Export/import helpers for watch lists.
// Files only carry what's needed to rebuild a list (TMDB id, type, status, dates); details are re-fetched from TMDB on import.

export const EXPORT_VERSION = 1;

const MOVIE_STATUS = ['Not watched', 'Watched'];
const TV_STATUS = ['Not watched', 'Watching', 'Watched'];

// Older TV entries stored watched as a boolean; newer ones use 0 / 1 / 2
const tvStatus = (watched) => (watched === true ? 2 : !watched ? 0 : Number(watched));

/** Fields the app actually reads from list entries – keeps list documents well under Firestore's 1MB limit */
export const toListEntry = (details, type) => {
  const common = {
    id: details.id,
    adult: !!details.adult,
    poster_path: details.poster_path || null,
    backdrop_path: details.backdrop_path || null,
    overview: details.overview || '',
    tagline: details.tagline || '',
    vote_average: details.vote_average || 0,
    genres: details.genres || [],
  };
  if (type === 'movie') {
    return {
      ...common,
      title: details.title,
      release_date: details.release_date || '',
      runtime: details.runtime || null,
      imdb_id: details.imdb_id || null,
    };
  }
  return {
    ...common,
    name: details.name,
    first_air_date: details.first_air_date || '',
    last_air_date: details.last_air_date || '',
    in_production: !!details.in_production,
    seasons: (details.seasons || []).map((s) => ({ season_number: s.season_number, name: s.name, episode_count: s.episode_count })),
  };
};

const yearOf = (date) => (date ? String(new Date(date).getFullYear()) : '');

/** Flatten a list into export rows (movies first, then TV) */
export const buildExportRows = (movieList) => {
  const emailFor = (uid) => (movieList.users || []).find((u) => u.uid === uid)?.email || '';
  const movies = (movieList.movies || []).map((m) => ({
    type: 'movie',
    tmdb_id: m.id,
    title: m.title || '',
    year: yearOf(m.release_date),
    status: MOVIE_STATUS[m.watched ? 1 : 0],
    added_date: m.addedDate || '',
    added_by: emailFor(m.addedBy),
    rating: m.vote_average ? Math.round(m.vote_average * 10) / 10 : '',
    runtime_minutes: m.runtime || '',
    seasons: '',
    tmdb_url: `https://www.themoviedb.org/movie/${m.id}`,
  }));
  const shows = (movieList.tvShows || []).map((t) => ({
    type: 'tv',
    tmdb_id: t.id,
    title: t.name || '',
    year: yearOf(t.first_air_date),
    status: TV_STATUS[tvStatus(t.watched)] || TV_STATUS[0],
    added_date: t.addedDate || '',
    added_by: emailFor(t.addedBy),
    rating: t.vote_average ? Math.round(t.vote_average * 10) / 10 : '',
    runtime_minutes: '',
    seasons: (t.seasons || []).filter((s) => s.name !== 'Specials').length || '',
    tmdb_url: `https://www.themoviedb.org/tv/${t.id}`,
  }));
  return [...movies, ...shows];
};

const CSV_COLUMNS = ['type', 'tmdb_id', 'title', 'year', 'status', 'added_date', 'added_by', 'rating', 'runtime_minutes', 'seasons', 'tmdb_url'];

// RFC 4180: quote fields containing commas, quotes or line breaks, doubling inner quotes
const csvField = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const toCSV = (rows) =>
  [CSV_COLUMNS.join(','), ...rows.map((row) => CSV_COLUMNS.map((c) => csvField(row[c])).join(','))].join('\r\n');

export const toJSON = (movieList, rows) =>
  JSON.stringify(
    {
      app: 'watchlist',
      version: EXPORT_VERSION,
      title: movieList.title,
      exportedAt: new Date().toISOString(),
      items: rows,
    },
    null,
    2
  );

/** Minimal RFC 4180 parser (handles quoted fields, escaped quotes and newlines inside quotes) */
export const parseCSV = (text) => {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const input = text.replace(/^﻿/, '');
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (inQuotes) {
      if (char === '"' && input[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  const nonEmpty = rows.filter((r) => r.some((cell) => cell.trim() !== ''));
  if (nonEmpty.length === 0) return [];
  const header = nonEmpty[0].map((h) => h.trim().toLowerCase());
  return nonEmpty.slice(1).map((cells) => Object.fromEntries(header.map((h, i) => [h, (cells[i] || '').trim()])));
};

const parseStatus = (type, status) => {
  const value = String(status || '').trim().toLowerCase();
  if (type === 'movie') return value === 'watched' || value === 'yes' || value === 'true';
  if (value === 'watched' || value === 'true' || value === '2') return 2;
  if (value === 'watching' || value === '1') return 1;
  return 0;
};

/**
 * Turn an uploaded file's text into import items: [{ type, id, watched, addedDate, addedByEmail, title }].
 * Accepts this app's JSON or CSV exports (or any CSV with type + tmdb_id columns).
 */
export const parseImportFile = (fileName, text) => {
  let rows;
  if (/\.json$/i.test(fileName) || text.trim().startsWith('{')) {
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("This file isn't valid JSON.");
    }
    if (!Array.isArray(data.items)) throw new Error("This JSON file isn't a Watchlist export.");
    rows = data.items;
  } else {
    rows = parseCSV(text);
    if (rows.length && !('tmdb_id' in rows[0])) {
      throw new Error('The CSV needs a "tmdb_id" column. Export a list first to see the expected format.');
    }
  }

  const seen = new Set();
  const items = [];
  let invalid = 0;
  rows.forEach((row) => {
    const type = String(row.type || '').trim().toLowerCase() === 'tv' ? 'tv' : 'movie';
    const id = parseInt(row.tmdb_id, 10);
    if (!id) {
      invalid += 1;
      return;
    }
    const key = `${type}-${id}`;
    if (seen.has(key)) return;
    seen.add(key);
    const added = row.added_date ? new Date(row.added_date) : null;
    items.push({
      type,
      id,
      title: row.title || '',
      watched: parseStatus(type, row.status),
      addedDate: added && !isNaN(added.getTime()) ? added.toISOString() : null,
      addedByEmail: String(row.added_by || '').trim().toLowerCase(),
    });
  });
  return { items, invalid };
};

/** Run async work over items with limited concurrency (keeps TMDB requests polite) */
export const mapWithConcurrency = async (items, limit, worker, onProgress) => {
  const results = new Array(items.length);
  let next = 0;
  let done = 0;
  const run = async () => {
    while (next < items.length) {
      const index = next++;
      try {
        results[index] = await worker(items[index]);
      } catch (error) {
        results[index] = { error };
      }
      done += 1;
      if (onProgress) onProgress(done, items.length);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
};

export const safeFileName = (name) => (name || 'watch-list').replace(/[\\/:*?"<>|]+/g, '').trim() || 'watch-list';

export const downloadFile = (content, fileName, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

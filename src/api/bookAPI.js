// Open Library (https://openlibrary.org/developers/api) – no API key needed
const BASE_URL = 'https://openlibrary.org';

// Fields requested from the search API; these are also what list entries are built from
export const SEARCH_FIELDS = [
  'key',
  'title',
  'author_name',
  'author_key',
  'cover_i',
  'first_publish_year',
  'number_of_pages_median',
  'ratings_average',
  'ratings_count',
  'subject',
  'edition_count',
  'ebook_access',
].join(',');

const getJSON = async (path) => {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) throw new Error(`Open Library request failed (${response.status})`);
  return response.json();
};

/** "/works/OL45804W" or "OL45804W" -> "OL45804W" */
export const workId = (key) => String(key || '').split('/').pop();

export const coverUrl = (coverId, size = 'M') => (coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : null);
export const authorPhotoUrl = (photoId, size = 'M') => (photoId && photoId > 0 ? `https://covers.openlibrary.org/a/id/${photoId}-${size}.jpg` : null);

export const getBooks = async (page, limit = 18) => getJSON(`/trending/weekly.json?limit=${limit}&page=${page}`);

// Open Library rejects very short queries (e.g. "du") with a 422
const MIN_QUERY_LENGTH = 3;

/** General search (title, author, subject…) – returns { docs, numFound } */
export const getBookSearchResults = async (page, query, limit = 18) => {
  if (String(query || '').trim().length < MIN_QUERY_LENGTH) return { docs: [], numFound: 0 };
  return getJSON(`/search.json?q=${encodeURIComponent(query.trim())}&page=${page}&limit=${limit}&fields=${SEARCH_FIELDS}`);
};

/** Search-index summary for one work (page count, year, ratings, availability) */
export const getBookSummary = async (id) => {
  const data = await getJSON(`/search.json?q=${encodeURIComponent(`key:/works/${workId(id)}`)}&limit=1&fields=${SEARCH_FIELDS}`);
  return data.docs?.[0] || null;
};

/** Work record, following Open Library's merge redirects */
export const getBook = async (id, depth = 0) => {
  const data = await getJSON(`/works/${workId(id)}.json`);
  if (data.type?.key === '/type/redirect' && data.location && depth < 3) {
    return getBook(data.location, depth + 1);
  }
  return data;
};

export const getBookRatings = async (id) => getJSON(`/works/${workId(id)}/ratings.json`);

export const getAuthor = async (id) => getJSON(`/authors/${workId(id)}.json`);

/** Open Library text fields are either strings or { type, value } objects */
export const textValue = (field) => (typeof field === 'string' ? field : field?.value || '');

/** Normalise a search/trending doc into the fields the app uses for a book */
export const bookFromDoc = (doc) => ({
  id: workId(doc.key),
  title: doc.title,
  authors: doc.author_name || [],
  author_keys: doc.author_key || [],
  cover_i: doc.cover_i || null,
  first_publish_year: doc.first_publish_year || null,
  number_of_pages_median: doc.number_of_pages_median || null,
  ratings_average: doc.ratings_average || null,
  subjects: doc.subject || [],
});

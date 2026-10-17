import React from 'react';
import { bookFromDoc, coverUrl, getBookSearchResults } from '../../../api/bookAPI';
import { addBookToList } from '../../../api/movieStorage';
import MediaAddBar from '../../mediaAddBar';

const BookAdd = ({ books, listId, setBooks, disabled, currentUserID }) => (
  <MediaAddBar
    type="book"
    items={books}
    setItems={setBooks}
    disabled={disabled}
    currentUserID={currentUserID}
    search={async (query) => ((await getBookSearchResults(1, query, 12)).docs || []).map(bookFromDoc)}
    // Search results already carry everything a list entry needs
    fetchDetails={async (option) => option}
    persist={(book) => addBookToList(listId, book)}
    getTitle={(b) => b.title || ''}
    getDate={(b) => (b.first_publish_year ? String(b.first_publish_year) : null)}
    getThumb={(b) => coverUrl(b.cover_i, 'S') || undefined}
    getSubtitle={(b) => [b.authors?.[0], b.first_publish_year].filter(Boolean).join(' · ') || 'Unknown author'}
    initialWatched={0}
    noun={{ singular: 'book', plural: 'books' }}
  />
);

export default BookAdd;

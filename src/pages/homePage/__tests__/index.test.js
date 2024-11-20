import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Homepage from './index';
import { getMovies, getMovieSearchResults, getTVShows, getTVShowSearchResults } from '../../api/TMDBAPI';

jest.mock('../../api/TMDBAPI');

describe('Homepage', () => {
  beforeEach(() => {
    getMovies.mockResolvedValue({ results: Array(18).fill({ title: 'Movie' }) });
    getTVShows.mockResolvedValue({ results: Array(18).fill({ name: 'TV Show' }) });
    getMovieSearchResults.mockResolvedValue(Array(18).fill({ title: 'Searched Movie' }));
    getTVShowSearchResults.mockResolvedValue(Array(18).fill({ name: 'Searched TV Show' }));
  });

  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Browse Movies/i)).toBeInTheDocument();
  });

  test('fetches and displays movies on initial render', async () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );
    await waitFor(() => expect(getMovies).toHaveBeenCalled());
    expect(screen.getAllByText(/Movie/i)).toHaveLength(18);
  });

  test('fetches and displays TV shows when TV Shows tab is clicked', async () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText(/TV Shows/i));
    await waitFor(() => expect(getTVShows).toHaveBeenCalled());
    expect(screen.getAllByText(/TV Show/i)).toHaveLength(18);
  });

  test('searches for movies when search term is entered', async () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/Search for movies/i), { target: { value: 'test' } });
    await waitFor(() => expect(getMovieSearchResults).toHaveBeenCalledWith(1, 'test'));
    expect(screen.getAllByText(/Searched Movie/i)).toHaveLength(18);
  });

  test('searches for TV shows when search term is entered', async () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText(/TV Shows/i));
    fireEvent.change(screen.getByPlaceholderText(/Search for TV shows/i), { target: { value: 'test' } });
    await waitFor(() => expect(getTVShowSearchResults).toHaveBeenCalledWith(1, 'test'));
    expect(screen.getAllByText(/Searched TV Show/i)).toHaveLength(18);
  });

  test('changes page when pagination is clicked', async () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByLabelText('Go to page 2'));
    await waitFor(() => expect(getMovies).toHaveBeenCalledWith(2));
    expect(screen.getAllByText(/Movie/i)).toHaveLength(18);
  });
});
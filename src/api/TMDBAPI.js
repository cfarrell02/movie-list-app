export const getMovies = async (pageNum) => {
  const allowAdult = localStorage.getItem('adultContent') === 'true' ? 'true' : 'false';
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&include_adult=${allowAdult}&include_video=false&page=${pageNum}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getTVShows = async (pageNum) => {
  const allowAdult = localStorage.getItem('adultContent') === 'true' ? 'true' : 'false';
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&include_adult=${allowAdult}&include_video=false&page=${pageNum}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getTVShow = async (id) => {

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getPerson = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getPersonMovies = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getPersonTV = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getMovie = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getUpcomingMovies = async (args) => {
  const [, pageNumPart] = args.queryKey;
  const { pageNum } = pageNumPart;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${pageNum}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getTopRatedMovies = async (args) => {
  const [, pageNumPart] = args.queryKey;
  const { pageNum } = pageNumPart;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${pageNum}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getTopRatedTVShows = async (args) => {
  const [, pageNumPart] = args.queryKey;
  const { pageNum } = pageNumPart;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${pageNum}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getGenres = async () => {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=" +
        process.env.REACT_APP_TMDB_KEY +
        "&language=en-US"
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getMovieImages = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/images?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getMovieVideos = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export const getTVImages = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/images?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getTVSeason = async (id, seasonNumber) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getTVVideos = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export const getPersonImages = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${id}/images?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export const getPersonTaggedImages = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${id}/tagged_images?api_key=${process.env.REACT_APP_TMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export const getMovieReviews = async (id, pageNum) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.REACT_APP_TMDB_KEY}&page=${pageNum}`
  );
  const json = await response.json();
  return json.results;
};

export const getTVReviews = async (id, pageNum) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${process.env.REACT_APP_TMDB_KEY}&page=${pageNum}`
  );
  const json = await response.json();
  return json.results;
};

export const getSimilarMovies = async (id) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
  );
  const json = await response.json();
  return json.results;
};

export const getSimilarTVShows = async (id) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
  );
  const json = await response.json();
  return json.results;
};

export const getMovieRecommendations = async (id) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
  );
  const json = await response.json();
  return json.results;
};

export const getTVRecommendations = async (id) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
  );
  const json = await response.json();
  return json.results;
}

export const getSearchResults = async (pageNum, searchTerm) => {
  const allowAdult = localStorage.getItem('adultContent') === 'true' ? 'true' : 'false';
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${pageNum}&include_adult=${allowAdult}&query=${searchTerm}`
  );
  const json = await response.json();
  return json.results;
};

export const getMovieSearchResults = async (pageNum, searchTerm) => {
  const allowAdult = localStorage.getItem('adultContent') === 'true' ? 'true' : 'false';
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${pageNum}&include_adult=${allowAdult}&query=${searchTerm}`
  );
  const json = await response.json();
  return json.results;
};
export const getTVShowSearchResults = async (pageNum, searchTerm) => {
  const allowAdult = localStorage.getItem('adultContent') === 'true' ? 'true' : 'false';
  const response = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${pageNum}&include_adult=${allowAdult}&query=${searchTerm}`
  );
  const json = await response.json();
  return json.results;
};



export const getMovieCredits = async (id) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_KEY}`
  );
  const json = await response.json();
  return json;
};

export const getTVCredits = async (id) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
  );
  const json = await response.json();
  return json.cast;
};


export const getMovies = (args) => {
    const [, pageNumPart] = args.queryKey;
    const {pageNum} = pageNumPart;
    return fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&include_adult=false&include_video=false&page=${pageNum}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error(response.json().message);
      }
      return response.json();
    })
    .catch((error) => {
       throw error
    });
  };
  
  export const getTVShows = (args) => {
    const [, pageNumPart] = args.queryKey;
    const {pageNum} = pageNumPart;
    return fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&include_adult=false&include_video=false&page=${pageNum}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error(response.json().message);
      }
      return response.json();
    })
    .catch((error) => {
       throw error
    });
  };
  export const getTVShow = (args) => {
    const [, idPart] = args.queryKey;
    const {id} = idPart;
    return fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}`
    ).then((response) => {
      if(!response.ok){
      throw new Error(response.json().message);
      }
      return response.json();
    }).catch((error) => {
      throw error;
    })
  }
  export const getPerson= (args) => {
    const [, idPart] = args.queryKey;
    const {id} = idPart;
    return fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}`
    ).then((response) => {
      if(!response.ok){
      throw new Error(response.json().message);
      }
      return response.json();
    }).catch((error) => {
      throw error;
    })
  }
  export const getPersonMovies= (id) => {
    return fetch(
      `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.REACT_APP_TMDB_KEY}`
    ).then((response) => {
      if(!response.ok){
      throw new Error(response.json().message);
      }
      return response.json();
    }).catch((error) => {
      throw error;
    })
  }
  export const getPersonTV= (id) => {
    return fetch(
      `https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${process.env.REACT_APP_TMDB_KEY}`
    ).then((response) => {
      if(!response.ok){
      throw new Error(response.json().message);
      }
      return response.json();
    }).catch((error) => {
      throw error;
    })
  }
  export const getMovie = (id) => {
    // console.log(args)

    return fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error(response.json().message);
      }
      return response.json();
    })
    .catch((error) => {
      throw error
   });
  };
    export const getUpcomingMovies = (args) => {
      const [, pageNumPart] = args.queryKey;
      const {pageNum} = pageNumPart;
      return fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${pageNum}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
      })
      .catch((error) => {
         throw error
      });
    };
    export const getTopRatedMovies = (args) => {
      const [, pageNumPart] = args.queryKey;
      const {pageNum} = pageNumPart;
      return fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${pageNum}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
      })
      .catch((error) => {
         throw error
      });
    };
    export const getTopRatedTVShows = (args) => {
      const [, pageNumPart] = args.queryKey;
      const {pageNum} = pageNumPart;
      return fetch(
        `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${pageNum}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
      })
      .catch((error) => {
         throw error
      });
    };
    
    export const getGenres = async () => {
      return fetch(
        "https://api.themoviedb.org/3/genre/movie/list?api_key=" +
          process.env.REACT_APP_TMDB_KEY +
          "&language=en-US"
      ).then( (response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
      })
      .catch((error) => {
        throw error
     });
    };
    export const getMovieImages = ({ queryKey }) => {
      const [, idPart] = queryKey;
      const { id } = idPart;
      return fetch(
        `https://api.themoviedb.org/3/movie/${id}/images?api_key=${process.env.REACT_APP_TMDB_KEY}`
      ).then( (response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
    
      })
      .catch((error) => {
        throw error
     });
    };
    export const getTVImages = ({ queryKey }) => {
      const [, idPart] = queryKey;
      const { id } = idPart;
      return fetch(
        `https://api.themoviedb.org/3/tv/${id}/images?api_key=${process.env.REACT_APP_TMDB_KEY}`
      ).then( (response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
    
      })
      .catch((error) => {
        throw error
     });
    };
    export const getMovieReviews = (id) => {
      return fetch(
        `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.REACT_APP_TMDB_KEY}`
      )
        .then((res) => res.json())
        .then((json) => {
          return json.results;
        });
    };
    export const getTVReviews = (id) => {
      return fetch(
        `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${process.env.REACT_APP_TMDB_KEY}`
      )
        .then((res) => res.json())
        .then((json) => {
          // console.log(json.results);
          return json.results;
        });
    };
    export const getSimilarMovies = (id) => {
      return fetch(
        `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
      )
        .then((res) => res.json())
        .then((json) => {
          // console.log(json.results);
          return json.results;
        });
    };
  
    export const getSimilarTVShows = (id) => {
      return fetch(
        `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
      )
        .then((res) => res.json())
        .then((json) => {
          // console.log(json.results);
          return json.results;
        });
    }
    export const getSearchResults = (pageNum,searchTerm) => {
      return fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${pageNum}&include_adult=false&query=${searchTerm}`
      ).then((response) => { 
         return response.json() 
      }).then((json) => {
        return json.results;
        
     })
    };

    export const getMovieSearchResults = (pageNum,searchTerm) => {
      return fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${pageNum}&include_adult=false&query=${searchTerm}`
      ).then((response) => {
        return response.json()
      }).then((json) => {
        return json.results;
      })
    };
  
    export const getMovieCredits = (id) => {
      return fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_KEY}`
      )
        .then((res) => res.json())
        .then((json) => {
          return json.cast;
        });
    };
  
    export const getTVCredits = (id) => {
      return fetch(
        `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
      )
        .then((res) => res.json())
        .then((json) => {
          return json.cast;
        });
    };
  
  
  
  
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid, Autocomplete, CircularProgress} from '@mui/material';
import { getMovie, getMovieSearchResults} from '../../api/TMDBAPI';
import MovieTable from '../../components/MovieComponents/movieTable';
import { getMovieListById, addMovieToList, addMovieList, updateMovie, deleteMovie} from '../../api/movieStorage';
import MovieAdd from '../../components/MovieComponents/movieAdd';
import {useParams} from 'react-router-dom';

const MovieTrackingPage = (props) => {
  const [movies, setMovies] = useState([]);
  const [changesToBeMade, setChangesToBeMade] = useState([]);
  const [loading, setLoading] = useState(false);
  const {listId} = useParams();
  const [listName, setListName] = useState("");


  const cachedMovies = useMemo(() => {
    return getMovieListById(listId);
  },[]);

  useEffect(() => {

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const movies = await cachedMovies;
        setMovies(movies.movies);
        setListName(movies.title);
      } catch (error) {
        console.error('Error getting movies:', error);
      } finally {
        setLoading(false);
      }
    };

    
    fetchMovies();
  }, [cachedMovies]);



  const removeMovie = (movie) => {
    const newMovies = movies.filter((m) => m.id !== movie.id);
    if(changesToBeMade.find((m) => m.movie.id === movie.id)) {
      setChangesToBeMade([...changesToBeMade.filter((m) => m.movie.id !== movie.id)]);
    }else{
    setChangesToBeMade([...changesToBeMade, {action: "delete", movie}]);
    }
    setMovies(newMovies);
  };

  const editMovie = (movie) => {
    const editedMovieIndex = movies.findIndex((m) => m.id === movie.id);
    if (editedMovieIndex !== -1) {
      let newMovies = [...movies];
      newMovies[editedMovieIndex] = movie;
      if(changesToBeMade.find((m) => m.movie.id === movie.id && m.action === "add")) {
        setChangesToBeMade([...changesToBeMade.filter((m) => m.movie.id !== movie.id), {action: "add", movie}]);
      } else {
      setChangesToBeMade([...changesToBeMade, {action: "edit", movie}]);
      }
      setMovies(newMovies);
    }
  };




  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }} align="center">
      <MovieAdd 
      title={listName} 
      movies={movies} 
      changesToBeMade={changesToBeMade}
      setChangesToBeMade={setChangesToBeMade}
      setMovies={setMovies}
      />
      <MovieTable 
      movies={movies}
      deleteMovie={removeMovie}
      editMovie={editMovie}
      loading={loading}
      />
      </Paper>
    </Container>
  );
};

export default MovieTrackingPage;

const tempData = [
  {
    "id": 109443,
    "spoken_languages": [
      {
        "name": "English",
        "english_name": "English",
        "iso_639_1": "en"
      }
    ],
    "release_date": "2013-12-18",
    "original_language": "en",
    "poster_path": "/55volAzeebtFzyrx7DJkegvw8Ta.jpg",
    "watched": false,
    "vote_average": 6.136,
    "imdb_id": "tt1229340",
    "homepage": "",
    "vote_count": 2285,
    "backdrop_path": "/1TMTDprwy1qMmjlDbmb6HTJ76dH.jpg",
    "adult": false,
    "runtime": 119,
    "status": "Released",
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "belongs_to_collection": {
      "id": 93791,
      "poster_path": "/xjnbrB93Vj5yGYwU0uuW8Tu2qoc.jpg",
      "backdrop_path": "/eUU6edsZcr7I0AO8rHcB3vQwcOH.jpg",
      "name": "Anchorman Collection"
    },
    "video": false,
    "production_companies": [
      {
        "id": 4740,
        "name": "Gary Sanchez Productions",
        "logo_path": "/20IuOPEwlHRXnn0MTOsEmw0wcql.png",
        "origin_country": "US"
      },
      {
        "id": 4,
        "logo_path": "/gz66EfNoYPqHTYI4q9UEN4CbHRc.png",
        "name": "Paramount",
        "origin_country": "US"
      },
      {
        "origin_country": "US",
        "name": "Apatow Productions",
        "id": 10105,
        "logo_path": "/bN4tiAS8oNlHhIqq66KBPQ1Ekqh.png"
      }
    ],
    "title": "Anchorman 2: The Legend Continues",
    "popularity": 18.39,
    "original_title": "Anchorman 2: The Legend Continues",
    "budget": 50000000,
    "revenue": 173649015,
    "genres": [
      {
        "name": "Comedy",
        "id": 35
      }
    ],
    "overview": "With the 70s behind him, San Diego's top rated newsman, Ron Burgundy, returns to take New York's first 24-hour news channel by storm.",
    "tagline": "It's kind of a big deal"
  },
  {
    "id": 111,
    "original_language": "en",
    "imdb_id": "tt0086250",
    "tagline": "The world is yours...",
    "vote_average": 8.164,
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "name": "Crime",
        "id": 80
      },
      {
        "name": "Drama",
        "id": 18
      }
    ],
    "title": "Scarface",
    "spoken_languages": [
      {
        "english_name": "English",
        "iso_639_1": "en",
        "name": "English"
      },
      {
        "iso_639_1": "es",
        "name": "Español",
        "english_name": "Spanish"
      }
    ],
    "budget": 25000000,
    "status": "Released",
    "watched": false,
    "runtime": 169,
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "homepage": "",
    "original_title": "Scarface",
    "poster_path": "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
    "production_companies": [
      {
        "id": 33,
        "name": "Universal Pictures",
        "logo_path": "/8lvHyhjr8oUKOOy2dKXoALWKdp0.png",
        "origin_country": "US"
      }
    ],
    "adult": false,
    "popularity": 54.158,
    "release_date": "1983-12-09",
    "belongs_to_collection": null,
    "video": false,
    "overview": "After getting a green card in exchange for assassinating a Cuban government official, Tony Montana stakes a claim on the drug trade in Miami. Viciously murdering anyone who stands in his way, Tony eventually becomes the biggest drug lord in the state, controlling nearly all the cocaine that comes through Miami. But increased pressure from the police, wars with Colombian drug cartels and his own drug-fueled paranoia serve to fuel the flames of his eventual downfall.",
    "vote_count": 10396,
    "revenue": 66023329,
    "backdrop_path": "/cCvp5Sni75agCtyJkNOMapORUQV.jpg"
  },
  {
    "id": 120467,
    "adult": false,
    "overview": "The Grand Budapest Hotel tells of a legendary concierge at a famous European hotel between the wars and his friendship with a young employee who becomes his trusted protégé. The story involves the theft and recovery of a priceless Renaissance painting, the battle for an enormous family fortune and the slow and then sudden upheavals that transformed Europe during the first half of the 20th century.",
    "production_companies": [
      {
        "logo_path": "/4RgIPr55kBakgupWkzdDxqXJEqr.png",
        "name": "Fox Searchlight Pictures",
        "origin_country": "US",
        "id": 43
      },
      {
        "name": "Scott Rudin Productions",
        "origin_country": "US",
        "logo_path": null,
        "id": 258
      },
      {
        "origin_country": "DE",
        "logo_path": "/fA90qwUKgPhMONqtwY60GaHRyrW.png",
        "id": 264,
        "name": "Studio Babelsberg"
      },
      {
        "origin_country": "US",
        "name": "Indian Paintbrush",
        "logo_path": "/anrLUwQPXl9W2CzA6Z8tYGx46e5.png",
        "id": 9350
      },
      {
        "name": "TSG Entertainment",
        "id": 22213,
        "origin_country": "US",
        "logo_path": "/qx9K6bFWJupwde0xQDwOvXkOaL8.png"
      },
      {
        "id": 23449,
        "logo_path": null,
        "name": "American Empirical Pictures",
        "origin_country": "US"
      }
    ],
    "imdb_id": "tt2278388",
    "vote_count": 13434,
    "watched": true,
    "title": "The Grand Budapest Hotel",
    "status": "Released",
    "belongs_to_collection": null,
    "production_countries": [
      {
        "iso_3166_1": "DE",
        "name": "Germany"
      },
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "release_date": "2014-02-26",
    "genres": [
      {
        "id": 35,
        "name": "Comedy"
      },
      {
        "name": "Drama",
        "id": 18
      }
    ],
    "popularity": 32.012,
    "vote_average": 8.053,
    "original_language": "en",
    "video": false,
    "original_title": "The Grand Budapest Hotel",
    "homepage": "",
    "poster_path": "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    "spoken_languages": [
      {
        "english_name": "English",
        "name": "English",
        "iso_639_1": "en"
      },
      {
        "iso_639_1": "fr",
        "english_name": "French",
        "name": "Français"
      }
    ],
    "budget": 30000000,
    "backdrop_path": "/xHDynIimfsgj0ZOs0j5ma8v1vmM.jpg",
    "tagline": "A murder case of Madam D. With enormous wealth and the most outrageous events surrounding her sudden death!",
    "revenue": 174600318,
    "runtime": 100
  },
  {
    "id": 13223,
    "original_title": "Gran Torino",
    "video": false,
    "homepage": "http://www.thegrantorino.com/",
    "title": "Gran Torino",
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      }
    ],
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      },
      {
        "iso_3166_1": "DE",
        "name": "Germany"
      }
    ],
    "backdrop_path": "/wmsePXV2z1b6ecXuKKrFbG0Q92P.jpg",
    "belongs_to_collection": null,
    "production_companies": [
      {
        "origin_country": "",
        "logo_path": null,
        "name": "Matten Productions",
        "id": 27351
      },
      {
        "id": 10138,
        "origin_country": "US",
        "logo_path": "/r67HWrAbCShfwWREWo2MlXsSK3B.png",
        "name": "Double Nickel Entertainment"
      },
      {
        "name": "Gerber Pictures",
        "id": 975,
        "origin_country": "US",
        "logo_path": null
      },
      {
        "origin_country": "US",
        "name": "Malpaso Productions",
        "logo_path": null,
        "id": 171
      },
      {
        "id": 79,
        "logo_path": "/tpFpsqbleCzEE2p5EgvUq6ozfCA.png",
        "origin_country": "US",
        "name": "Village Roadshow Pictures"
      },
      {
        "id": 27352,
        "name": "WV Films IV",
        "origin_country": "",
        "logo_path": null
      },
      {
        "logo_path": "/IuAlhI9eVC9Z8UQWOIDdWRKSEJ.png",
        "name": "Warner Bros. Pictures",
        "origin_country": "US",
        "id": 174
      }
    ],
    "popularity": 21.157,
    "watched": false,
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      }
    ],
    "runtime": 116,
    "vote_count": 9770,
    "poster_path": "/zUybYvxWdAJy5hhYovsXtHSWI1l.jpg",
    "budget": 33000000,
    "revenue": 269958228,
    "release_date": "2008-12-09",
    "overview": "Disgruntled Korean War veteran Walt Kowalski sets out to reform his neighbor, Thao Lor, a Hmong teenager who tried to steal Kowalski's prized possession: a 1972 Gran Torino.",
    "vote_average": 8,
    "adult": false,
    "imdb_id": "tt1205489",
    "status": "Released",
    "tagline": "Ever come across somebody you shouldn't have f#cked with?",
    "original_language": "en"
  },
  {
    "id": 1359,
    "backdrop_path": "/bneUTWFAcVCdsb0O5UwZbJd8xqZ.jpg",
    "popularity": 40.578,
    "title": "American Psycho",
    "production_companies": [
      {
        "id": 15231,
        "logo_path": "/iFbzMtXFBv2ekA9Ldrw6LqjLrvX.png",
        "origin_country": "US",
        "name": "Muse Productions"
      },
      {
        "name": "Pressman Film",
        "id": 6455,
        "origin_country": "US",
        "logo_path": null
      },
      {
        "id": 1632,
        "logo_path": "/cisLn1YAUuptXVBa0xjq7ST9cH0.png",
        "origin_country": "US",
        "name": "Lionsgate"
      }
    ],
    "original_title": "American Psycho",
    "belongs_to_collection": {
      "poster_path": "/ko4O9lcRGYOZAF5Hh79Mfsgjpun.jpg",
      "backdrop_path": "/z5cYtp6jrS23RrQPBiJMJpIMwjc.jpg",
      "name": "American Psycho Collection",
      "id": 86105
    },
    "homepage": "",
    "status": "Released",
    "budget": 7000000,
    "watched": true,
    "tagline": "I think my mask of sanity is about to slip.",
    "release_date": "2000-04-13",
    "original_language": "en",
    "adult": false,
    "runtime": 102,
    "overview": "A wealthy New York investment banking executive hides his alternate psychopathic ego from his co-workers and friends as he escalates deeper into his illogical, gratuitous fantasies.",
    "revenue": 34266564,
    "genres": [
      {
        "name": "Thriller",
        "id": 53
      },
      {
        "name": "Drama",
        "id": 18
      },
      {
        "id": 80,
        "name": "Crime"
      }
    ],
    "vote_count": 9426,
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      },
      {
        "english_name": "Spanish",
        "iso_639_1": "es",
        "name": "Español"
      },
      {
        "iso_639_1": "cn",
        "name": "广州话 / 廣州話",
        "english_name": "Cantonese"
      }
    ],
    "poster_path": "/9uGHEgsiUXjCNq8wdq4r49YL8A1.jpg",
    "imdb_id": "tt0144084",
    "vote_average": 7.397,
    "production_countries": [
      {
        "iso_3166_1": "CA",
        "name": "Canada"
      },
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "video": false
  },
  {
    "id": 137,
    "budget": 14600000,
    "revenue": 71074049,
    "production_companies": [
      {
        "origin_country": "US",
        "id": 5,
        "name": "Columbia Pictures",
        "logo_path": "/71BqEFAF4V3qjjMPCpLuyJFB9A.png"
      }
    ],
    "imdb_id": "tt0107048",
    "status": "Released",
    "watched": true,
    "title": "Groundhog Day",
    "vote_count": 7016,
    "runtime": 101,
    "popularity": 26.01,
    "homepage": "",
    "genres": [
      {
        "id": 10749,
        "name": "Romance"
      },
      {
        "id": 14,
        "name": "Fantasy"
      },
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "name": "Comedy",
        "id": 35
      }
    ],
    "original_language": "en",
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      },
      {
        "name": "Français",
        "iso_639_1": "fr",
        "english_name": "French"
      },
      {
        "iso_639_1": "it",
        "english_name": "Italian",
        "name": "Italiano"
      }
    ],
    "video": false,
    "release_date": "1993-02-11",
    "adult": false,
    "vote_average": 7.6,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "original_title": "Groundhog Day",
    "overview": "A narcissistic TV weatherman, along with his attractive-but-distant producer, and his mawkish cameraman, is sent to report on Groundhog Day in the small town of Punxsutawney, where he finds himself repeating the same day over and over.",
    "backdrop_path": "/oT9diLGD1cgPdvkxqHIJcuSXKUT.jpg",
    "tagline": "He’s having the worst day of his life… Over and over again.",
    "poster_path": "/qIwyDf5k0eNsrfQjd0HCkeraNGD.jpg",
    "belongs_to_collection": null
  },
  {
    "id": 138843,
    "vote_average": 7.54,
    "title": "The Conjuring",
    "genres": [
      {
        "id": 27,
        "name": "Horror"
      },
      {
        "name": "Thriller",
        "id": 53
      }
    ],
    "release_date": "2013-07-18",
    "watched": true,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "adult": false,
    "production_companies": [
      {
        "logo_path": null,
        "origin_country": "",
        "name": "Evergreen Media Group",
        "id": 31375
      },
      {
        "logo_path": "/5ThIuO93vsk47oexKTSdfKEr7EC.png",
        "origin_country": "US",
        "id": 12,
        "name": "New Line Cinema"
      },
      {
        "origin_country": "US",
        "id": 11565,
        "name": "The Safran Company",
        "logo_path": null
      }
    ],
    "belongs_to_collection": {
      "id": 313086,
      "name": "The Conjuring Collection",
      "poster_path": "/z5VKhNSQKQyxm0co68HAkCqHnmX.jpg",
      "backdrop_path": "/kHZaX0vuhZdbuq0WKU3BpA9WIQ0.jpg"
    },
    "video": false,
    "vote_count": 10391,
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      }
    ],
    "original_language": "en",
    "runtime": 112,
    "status": "Released",
    "original_title": "The Conjuring",
    "poster_path": "/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    "tagline": "Based on the true case files of the Warrens",
    "revenue": 320406242,
    "budget": 13000000,
    "overview": "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse. Forced to confront a powerful entity, the Warrens find themselves caught in the most terrifying case of their lives.",
    "homepage": "http://theconjuring.warnerbros.com",
    "imdb_id": "tt1457767",
    "backdrop_path": "/ecKQlAEG95k62SMGhvX83oEqANK.jpg",
    "popularity": 83.159
  },
  {
    "id": 157336,
    "poster_path": "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    "backdrop_path": "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    "revenue": 701729206,
    "production_countries": [
      {
        "iso_3166_1": "GB",
        "name": "United Kingdom"
      },
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "belongs_to_collection": null,
    "original_title": "Interstellar",
    "original_language": "en",
    "video": false,
    "tagline": "Mankind was born on Earth. It was never meant to die here.",
    "spoken_languages": [
      {
        "english_name": "English",
        "iso_639_1": "en",
        "name": "English"
      }
    ],
    "imdb_id": "tt0816692",
    "budget": 165000000,
    "production_companies": [
      {
        "name": "Legendary Pictures",
        "id": 923,
        "logo_path": "/5UQsZrfbfG2dYJbx8DxfoTr2Bvu.png",
        "origin_country": "US"
      },
      {
        "origin_country": "GB",
        "logo_path": "/3tvBqYsBhxWeHlu62SIJ1el93O7.png",
        "name": "Syncopy",
        "id": 9996
      },
      {
        "name": "Lynda Obst Productions",
        "logo_path": null,
        "id": 13769,
        "origin_country": ""
      }
    ],
    "watched": true,
    "title": "Interstellar",
    "genres": [
      {
        "name": "Adventure",
        "id": 12
      },
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 878,
        "name": "Science Fiction"
      }
    ],
    "vote_average": 8.403,
    "status": "Released",
    "adult": false,
    "homepage": "http://www.interstellarmovie.net/",
    "overview": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    "runtime": 169,
    "release_date": "2014-11-05",
    "vote_count": 31529,
    "popularity": 139.397
  },
  {
    "id": 161,
    "title": "Ocean's Eleven",
    "release_date": "2001-12-07",
    "vote_count": 10512,
    "homepage": "http://www.warnerbros.co.uk/movies/oceans-eleven",
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "popularity": 35.045,
    "tagline": "Are you in or out?",
    "budget": 85000000,
    "belongs_to_collection": {
      "name": "Ocean's Collection",
      "poster_path": "/oHUHccvraYF8lYp6BxRoujRtH8Q.jpg",
      "backdrop_path": "/7WUSrq8DqSkVgv1vmhBvav5bPoB.jpg",
      "id": 304
    },
    "status": "Released",
    "poster_path": "/hQQCdZrsHtZyR6NbKH2YyCqd2fR.jpg",
    "original_language": "en",
    "spoken_languages": [
      {
        "iso_639_1": "it",
        "name": "Italiano",
        "english_name": "Italian"
      },
      {
        "english_name": "English",
        "iso_639_1": "en",
        "name": "English"
      }
    ],
    "watched": true,
    "vote_average": 7.423,
    "imdb_id": "tt0240772",
    "video": false,
    "runtime": 116,
    "original_title": "Ocean's Eleven",
    "overview": "Less than 24 hours into his parole, charismatic thief Danny Ocean is already rolling out his next plan: In one night, Danny's hand-picked crew of specialists will attempt to steal more than $150 million from three Las Vegas casinos. But to score the cash, Danny risks his chances of reconciling with ex-wife, Tess.",
    "genres": [
      {
        "name": "Thriller",
        "id": 53
      },
      {
        "name": "Crime",
        "id": 80
      }
    ],
    "adult": false,
    "backdrop_path": "/ncoqdHs1poUaBqyKic9YI8ai7MP.jpg",
    "production_companies": [
      {
        "id": 79,
        "logo_path": "/tpFpsqbleCzEE2p5EgvUq6ozfCA.png",
        "origin_country": "US",
        "name": "Village Roadshow Pictures"
      },
      {
        "logo_path": null,
        "id": 172,
        "origin_country": "US",
        "name": "NPV Entertainment"
      },
      {
        "name": "Jerry Weintraub Productions",
        "logo_path": null,
        "origin_country": "US",
        "id": 2596
      },
      {
        "logo_path": null,
        "origin_country": "US",
        "name": "Section Eight",
        "id": 129
      },
      {
        "id": 174,
        "logo_path": "/IuAlhI9eVC9Z8UQWOIDdWRKSEJ.png",
        "name": "Warner Bros. Pictures",
        "origin_country": "US"
      }
    ],
    "revenue": 450717150
  },
  {
    "id": 16869,
    "vote_average": 8.214,
    "backdrop_path": "/8pEnePgGyfUqj8Qa6d91OZQ6Aih.jpg",
    "tagline": "Once upon a time in Nazi occupied France...",
    "original_title": "Inglourious Basterds",
    "popularity": 63.928,
    "spoken_languages": [
      {
        "english_name": "German",
        "name": "Deutsch",
        "iso_639_1": "de"
      },
      {
        "english_name": "English",
        "iso_639_1": "en",
        "name": "English"
      },
      {
        "english_name": "French",
        "name": "Français",
        "iso_639_1": "fr"
      },
      {
        "english_name": "Italian",
        "name": "Italiano",
        "iso_639_1": "it"
      }
    ],
    "watched": true,
    "production_countries": [
      {
        "iso_3166_1": "FR",
        "name": "France"
      },
      {
        "iso_3166_1": "DE",
        "name": "Germany"
      },
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "title": "Inglourious Basterds",
    "adult": false,
    "original_language": "en",
    "homepage": "",
    "runtime": 153,
    "overview": "In Nazi-occupied France during World War II, a group of Jewish-American soldiers known as \"The Basterds\" are chosen specifically to spread fear throughout the Third Reich by scalping and brutally killing Nazis. The Basterds, lead by Lt. Aldo Raine soon cross paths with a French-Jewish teenage girl who runs a movie theater in Paris which is targeted by the soldiers.",
    "budget": 70000000,
    "belongs_to_collection": null,
    "imdb_id": "tt0361748",
    "poster_path": "/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg",
    "video": false,
    "release_date": "2009-08-19",
    "vote_count": 20269,
    "production_companies": [
      {
        "origin_country": "US",
        "name": "The Weinstein Company",
        "logo_path": "/e8F3mQM7DkJ5SfYYDp8FYzPBOGX.png",
        "id": 308
      },
      {
        "id": 33,
        "logo_path": "/8lvHyhjr8oUKOOy2dKXoALWKdp0.png",
        "name": "Universal Pictures",
        "origin_country": "US"
      },
      {
        "logo_path": "/yH7OMeSxhfP0AVM6iT0rsF3F4ZC.png",
        "id": 59,
        "origin_country": "US",
        "name": "A Band Apart"
      },
      {
        "logo_path": null,
        "origin_country": "DE",
        "id": 6817,
        "name": "Zehnte Babelsberg Film"
      },
      {
        "name": "Visiona Romantica",
        "logo_path": null,
        "id": 6818,
        "origin_country": "US"
      },
      {
        "name": "Peninsula Films",
        "logo_path": null,
        "origin_country": "FR",
        "id": 682
      }
    ],
    "status": "Released",
    "revenue": 321457747,
    "genres": [
      {
        "name": "Drama",
        "id": 18
      },
      {
        "name": "Thriller",
        "id": 53
      },
      {
        "name": "War",
        "id": 10752
      }
    ]
  },
  {
    "id": 180,
    "title": "Minority Report",
    "tagline": "The system is perfect until it comes after you.",
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "runtime": 145,
    "genres": [
      {
        "name": "Action",
        "id": 28
      },
      {
        "name": "Thriller",
        "id": 53
      },
      {
        "name": "Science Fiction",
        "id": 878
      },
      {
        "name": "Mystery",
        "id": 9648
      }
    ],
    "homepage": "",
    "revenue": 358372926,
    "release_date": "2002-06-20",
    "overview": "John Anderton is a top 'Precrime' cop in the late-21st century, when technology can predict crimes before they're committed. But Anderton becomes the quarry when another investigator targets him for a murder charge.",
    "backdrop_path": "/qq4H9JfBKQ5DarMLI6lhUQjn9D7.jpg",
    "belongs_to_collection": null,
    "poster_path": "/ccqpHq5tk5W4ymbSbuoy4uYOxFI.jpg",
    "vote_average": 7.338,
    "status": "Released",
    "popularity": 26.808,
    "original_title": "Minority Report",
    "production_companies": [
      {
        "id": 76068,
        "logo_path": null,
        "origin_country": "",
        "name": "Digital Image Associates"
      },
      {
        "origin_country": "US",
        "name": "Cruise/Wagner Productions",
        "logo_path": null,
        "id": 44
      },
      {
        "logo_path": null,
        "origin_country": "",
        "name": "Blue Tulip Productions",
        "id": 766
      },
      {
        "name": "Ronald Shusett/Gary Goldman",
        "origin_country": "",
        "id": 26265,
        "logo_path": null
      },
      {
        "id": 56,
        "origin_country": "US",
        "name": "Amblin Entertainment",
        "logo_path": "/cEaxANEisCqeEoRvODv2dO1I0iI.png"
      },
      {
        "id": 25,
        "name": "20th Century Fox",
        "origin_country": "US",
        "logo_path": "/qZCc1lty5FzX30aOCVRBLzaVmcp.png"
      },
      {
        "name": "DreamWorks Pictures",
        "logo_path": "/vru2SssLX3FPhnKZGtYw00pVIS9.png",
        "id": 7,
        "origin_country": "US"
      }
    ],
    "watched": true,
    "spoken_languages": [
      {
        "name": "English",
        "iso_639_1": "en",
        "english_name": "English"
      },
      {
        "name": "svenska",
        "english_name": "Swedish",
        "iso_639_1": "sv"
      }
    ],
    "vote_count": 7790,
    "adult": false,
    "budget": 102000000,
    "imdb_id": "tt0181689",
    "video": false,
    "original_language": "en"
  },
  {
    "id": 198663,
    "title": "The Maze Runner",
    "vote_average": 7.172,
    "imdb_id": "tt1790864",
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 9648,
        "name": "Mystery"
      },
      {
        "name": "Science Fiction",
        "id": 878
      },
      {
        "id": 53,
        "name": "Thriller"
      }
    ],
    "revenue": 348319861,
    "production_companies": [
      {
        "logo_path": "/Q8mw2AOQQc8Qg0uNwLWq86DVZv.png",
        "id": 290,
        "name": "Ingenious Media",
        "origin_country": "GB"
      },
      {
        "id": 3672,
        "origin_country": "US",
        "name": "Gotham Group",
        "logo_path": "/5VWXJgYYrJZUE0hixvBdVfGSfmo.png"
      },
      {
        "id": 8569,
        "name": "Dayday Films",
        "origin_country": "GB",
        "logo_path": null
      },
      {
        "id": 12292,
        "logo_path": "/4GQTeqos2luopEtp3OgMQYusQ5c.png",
        "origin_country": "US",
        "name": "Temple Hill Entertainment"
      },
      {
        "logo_path": "/qx9K6bFWJupwde0xQDwOvXkOaL8.png",
        "name": "TSG Entertainment",
        "origin_country": "US",
        "id": 22213
      },
      {
        "id": 25,
        "logo_path": "/qZCc1lty5FzX30aOCVRBLzaVmcp.png",
        "origin_country": "US",
        "name": "20th Century Fox"
      }
    ],
    "poster_path": "/ode14q7WtDugFDp78fo9lCsmay9.jpg",
    "spoken_languages": [
      {
        "name": "English",
        "english_name": "English",
        "iso_639_1": "en"
      }
    ],
    "runtime": 113,
    "status": "Released",
    "watched": true,
    "adult": false,
    "release_date": "2014-09-10",
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      },
      {
        "name": "United Kingdom",
        "iso_3166_1": "GB"
      }
    ],
    "belongs_to_collection": {
      "backdrop_path": "/te8ibHFhjwWXZTCtQIPRUFjxWX2.jpg",
      "id": 295130,
      "name": "The Maze Runner Collection",
      "poster_path": "/wQ0l9sq0Bm6OAeqY4w6NWjP9jwS.jpg"
    },
    "backdrop_path": "/vHJlbhsXrZ5yrO2KqCbGSIU6fRX.jpg",
    "homepage": "https://www.20thcenturystudios.com/movies/the-maze-runner",
    "overview": "Set in a post-apocalyptic world, young Thomas is deposited in a community of boys after his memory is erased, soon learning they're all trapped in a maze that will require him to join forces with fellow “runners” for a shot at escape.",
    "popularity": 102.815,
    "tagline": "Remember. Survive. Run.",
    "original_title": "The Maze Runner",
    "video": false,
    "vote_count": 15617,
    "original_language": "en",
    "budget": 34000000
  },
  {
    "id": 2080,
    "imdb_id": "tt0458525",
    "adult": false,
    "budget": 150000000,
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "release_date": "2009-04-28",
    "popularity": 4.57,
    "video": false,
    "production_companies": [
      {
        "id": 431,
        "origin_country": "US",
        "name": "The Donners' Company",
        "logo_path": "/6dcR1MbRqYgt3jUVYxkHe68GFnZ.png"
      },
      {
        "logo_path": null,
        "id": 9076,
        "name": "Seed Productions",
        "origin_country": "US"
      },
      {
        "origin_country": "US",
        "id": 25,
        "logo_path": "/qZCc1lty5FzX30aOCVRBLzaVmcp.png",
        "name": "20th Century Fox"
      }
    ],
    "original_title": "X-Men Origins: Wolverine",
    "backdrop_path": "/wvqdJLVh0mSblly7UnYFPEk04Wd.jpg",
    "tagline": "Witness the origin.",
    "overview": "After seeking to live a normal life, Logan sets out to avenge the death of his girlfriend by undergoing the mutant Weapon X program and becoming Wolverine.",
    "runtime": 107,
    "title": "X-Men Origins: Wolverine",
    "belongs_to_collection": {
      "backdrop_path": "/hbNMx7sxxqvkX8rLOsTryiSrCPY.jpg",
      "name": "The Wolverine Collection",
      "id": 453993,
      "poster_path": "/c18HVnKTybcAUYVQd8rOcdbqwY.jpg"
    },
    "revenue": 373062864,
    "vote_count": 9585,
    "homepage": "https://www.20thcenturystudios.com/movies/x-men-origins-wolverine",
    "watched": true,
    "original_language": "en",
    "status": "Released",
    "spoken_languages": [
      {
        "name": "English",
        "english_name": "English",
        "iso_639_1": "en"
      }
    ],
    "vote_average": 6.249,
    "genres": [
      {
        "name": "Adventure",
        "id": 12
      },
      {
        "name": "Action",
        "id": 28
      },
      {
        "name": "Thriller",
        "id": 53
      },
      {
        "id": 878,
        "name": "Science Fiction"
      }
    ],
    "poster_path": "/yj8LbTju1p7CUJg7US2unSBk33s.jpg"
  },
  {
    "id": 238,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "vote_count": 18038,
    "vote_average": 8.711,
    "belongs_to_collection": {
      "id": 230,
      "poster_path": "/9Baumh5J9N1nJUYzNkm0xsgjpwY.jpg",
      "name": "The Godfather Collection",
      "backdrop_path": "/3WZTxpgscsmoUk81TuECXdFOD0R.jpg"
    },
    "watched": false,
    "title": "The Godfather",
    "homepage": "http://www.thegodfather.com/",
    "poster_path": "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    "tagline": "An offer you can't refuse.",
    "overview": "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
    "adult": false,
    "backdrop_path": "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    "video": false,
    "spoken_languages": [
      {
        "name": "English",
        "english_name": "English",
        "iso_639_1": "en"
      },
      {
        "iso_639_1": "it",
        "name": "Italiano",
        "english_name": "Italian"
      },
      {
        "iso_639_1": "la",
        "english_name": "Latin",
        "name": "Latin"
      }
    ],
    "budget": 6000000,
    "runtime": 175,
    "release_date": "1972-03-14",
    "original_title": "The Godfather",
    "imdb_id": "tt0068646",
    "original_language": "en",
    "revenue": 245066411,
    "genres": [
      {
        "name": "Drama",
        "id": 18
      },
      {
        "id": 80,
        "name": "Crime"
      }
    ],
    "popularity": 114.391,
    "production_companies": [
      {
        "origin_country": "US",
        "name": "Paramount",
        "logo_path": "/gz66EfNoYPqHTYI4q9UEN4CbHRc.png",
        "id": 4
      },
      {
        "id": 10211,
        "name": "Alfran Productions",
        "origin_country": "US",
        "logo_path": null
      }
    ],
    "status": "Released"
  },
  {
    "id": 240,
    "revenue": 102600000,
    "original_title": "The Godfather Part II",
    "spoken_languages": [
      {
        "english_name": "English",
        "iso_639_1": "en",
        "name": "English"
      },
      {
        "iso_639_1": "it",
        "english_name": "Italian",
        "name": "Italiano"
      },
      {
        "english_name": "Latin",
        "name": "Latin",
        "iso_639_1": "la"
      },
      {
        "english_name": "Spanish",
        "iso_639_1": "es",
        "name": "Español"
      }
    ],
    "imdb_id": "tt0071562",
    "production_companies": [
      {
        "origin_country": "US",
        "name": "Paramount",
        "id": 4,
        "logo_path": "/gz66EfNoYPqHTYI4q9UEN4CbHRc.png"
      },
      {
        "origin_country": "US",
        "name": "The Coppola Company",
        "logo_path": null,
        "id": 536
      }
    ],
    "vote_average": 8.596,
    "original_language": "en",
    "adult": false,
    "watched": false,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "runtime": 202,
    "video": false,
    "poster_path": "/bMadFzhjy9T7R8J48QGq1ngWNAK.jpg",
    "vote_count": 10893,
    "homepage": "",
    "release_date": "1974-12-20",
    "tagline": "I don't feel I have to wipe everybody out, Tom. Just my enemies.",
    "popularity": 55.084,
    "backdrop_path": "/oo4PVK6AyLZN49BokxDFGyclN86.jpg",
    "status": "Released",
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 80,
        "name": "Crime"
      }
    ],
    "overview": "In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York. In the 1950s, Michael Corleone attempts to expand the family business into Las Vegas, Hollywood and Cuba.",
    "budget": 13000000,
    "title": "The Godfather Part II",
    "belongs_to_collection": {
      "name": "The Godfather Collection",
      "poster_path": "/9Baumh5J9N1nJUYzNkm0xsgjpwY.jpg",
      "id": 230,
      "backdrop_path": "/3WZTxpgscsmoUk81TuECXdFOD0R.jpg"
    }
  },
  {
    "id": 244786,
    "status": "Released",
    "backdrop_path": "/5h8VtV4oh2qkO8Iqz7gypIYJPAr.jpg",
    "imdb_id": "tt2582802",
    "genres": [
      {
        "name": "Drama",
        "id": 18
      },
      {
        "name": "Music",
        "id": 10402
      }
    ],
    "release_date": "2014-10-10",
    "homepage": "http://sonyclassics.com/whiplash/",
    "adult": false,
    "original_language": "en",
    "popularity": 62.905,
    "overview": "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",
    "runtime": 107,
    "revenue": 13092000,
    "original_title": "Whiplash",
    "video": false,
    "vote_average": 8.379,
    "poster_path": "/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    "vote_count": 13516,
    "watched": true,
    "tagline": "The road to greatness can take you to the edge.",
    "budget": 3300000,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "belongs_to_collection": null,
    "title": "Whiplash",
    "spoken_languages": [
      {
        "name": "English",
        "iso_639_1": "en",
        "english_name": "English"
      }
    ],
    "production_companies": [
      {
        "id": 2266,
        "origin_country": "US",
        "name": "Bold Films",
        "logo_path": "/owzVs2mguyyJ3vIn7EbgowpUPnk.png"
      },
      {
        "origin_country": "US",
        "name": "Blumhouse Productions",
        "logo_path": "/kDedjRZwO8uyFhuHamomOhN6fzG.png",
        "id": 3172
      },
      {
        "name": "Right of Way Films",
        "logo_path": "/4hOCk25Ce8s242NItnwtV7aKRWY.png",
        "origin_country": "US",
        "id": 32157
      },
      {
        "id": 24049,
        "logo_path": "/zOHQ0A3PpNoLLeAxRZwSqNV3nPr.png",
        "name": "Sierra/Affinity",
        "origin_country": "US"
      },
      {
        "logo_path": "/xytTBODEy3p20ksHL4Ftxr483Iv.png",
        "origin_country": "US",
        "id": 11341,
        "name": "Stage 6 Films"
      },
      {
        "name": "Sony Pictures Classics",
        "id": 58,
        "logo_path": "/voYCwlBHJQANtjvm5MNIkCF1dDH.png",
        "origin_country": "US"
      }
    ]
  },
  {
    "id": 245891,
    "imdb_id": "tt2911666",
    "overview": "Ex-hitman John Wick comes out of retirement to track down the gangsters that took everything from him.",
    "release_date": "2014-10-22",
    "popularity": 110.088,
    "belongs_to_collection": {
      "backdrop_path": "/fSwYa5q2xRkBoOOjueLpkLf3N1m.jpg",
      "id": 404609,
      "name": "John Wick Collection",
      "poster_path": "/xUidyvYFsbbuExifLkslpcd8SMc.jpg"
    },
    "genres": [
      {
        "name": "Action",
        "id": 28
      },
      {
        "id": 53,
        "name": "Thriller"
      }
    ],
    "tagline": "Don't set him off.",
    "homepage": "https://www.lionsgate.com/movies/john-wick",
    "vote_count": 17459,
    "watched": true,
    "video": false,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "poster_path": "/wXqWR7dHncNRbxoEGybEy7QTe9h.jpg",
    "original_title": "John Wick",
    "original_language": "en",
    "vote_average": 7.41,
    "runtime": 101,
    "status": "Released",
    "production_companies": [
      {
        "origin_country": "US",
        "id": 23008,
        "logo_path": "/5SarYupipdiejsEqUkwu1SpYfru.png",
        "name": "87Eleven"
      },
      {
        "logo_path": null,
        "id": 36259,
        "origin_country": "US",
        "name": "DefyNite Films"
      },
      {
        "name": "MJW Films",
        "origin_country": "US",
        "id": 36433,
        "logo_path": null
      },
      {
        "origin_country": "US",
        "logo_path": "/cCzCClIzIh81Fa79hpW5nXoUsHK.png",
        "name": "Thunder Road",
        "id": 3528
      }
    ],
    "title": "John Wick",
    "backdrop_path": "/7dzngS8pLkGJpyeskCFcjPO9qLF.jpg",
    "spoken_languages": [
      {
        "name": "Magyar",
        "iso_639_1": "hu",
        "english_name": "Hungarian"
      },
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      },
      {
        "english_name": "Russian",
        "name": "Pусский",
        "iso_639_1": "ru"
      }
    ],
    "budget": 20000000,
    "adult": false,
    "revenue": 88761661
  },
  {
    "id": 259693,
    "poster_path": "/zEqyD0SBt6HL7W9JQoWwtd5Do1T.jpg",
    "popularity": 72.297,
    "budget": 40000000,
    "vote_count": 7534,
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      }
    ],
    "status": "Released",
    "backdrop_path": "/4mfFtlGeInPrQVm1hpv7th02yjx.jpg",
    "genres": [
      {
        "id": 27,
        "name": "Horror"
      },
      {
        "name": "Thriller",
        "id": 53
      }
    ],
    "overview": "Lorraine and Ed Warren travel to north London to help a single mother raising four children alone in a house plagued by malicious spirits.",
    "revenue": 321834351,
    "video": false,
    "belongs_to_collection": {
      "id": 313086,
      "poster_path": "/z5VKhNSQKQyxm0co68HAkCqHnmX.jpg",
      "name": "The Conjuring Collection",
      "backdrop_path": "/kHZaX0vuhZdbuq0WKU3BpA9WIQ0.jpg"
    },
    "homepage": "http://www.warnerbros.com/conjuring-2",
    "original_language": "en",
    "watched": true,
    "adult": false,
    "runtime": 134,
    "vote_average": 7.288,
    "title": "The Conjuring 2",
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "tagline": "The next true story from the case files of Ed and Lorraine Warren.",
    "imdb_id": "tt3065204",
    "production_companies": [
      {
        "name": "New Line Cinema",
        "logo_path": "/5ThIuO93vsk47oexKTSdfKEr7EC.png",
        "id": 12,
        "origin_country": "US"
      },
      {
        "name": "Dune Entertainment",
        "id": 444,
        "origin_country": "US",
        "logo_path": null
      },
      {
        "name": "The Safran Company",
        "logo_path": null,
        "id": 11565,
        "origin_country": "US"
      },
      {
        "origin_country": "",
        "logo_path": null,
        "id": 31375,
        "name": "Evergreen Media Group"
      },
      {
        "name": "Atomic Monster",
        "id": 76907,
        "logo_path": "/ygMQtjsKX7BZkCQhQZY82lgnCUO.png",
        "origin_country": "US"
      }
    ],
    "original_title": "The Conjuring 2",
    "release_date": "2016-06-08"
  },
  {
    "id": 263115,
    "imdb_id": "tt3315342",
    "release_date": "2017-02-28",
    "spoken_languages": [
      {
        "name": "English",
        "iso_639_1": "en",
        "english_name": "English"
      },
      {
        "iso_639_1": "es",
        "name": "Español",
        "english_name": "Spanish"
      }
    ],
    "title": "Logan",
    "genres": [
      {
        "name": "Action",
        "id": 28
      },
      {
        "name": "Drama",
        "id": 18
      },
      {
        "id": 878,
        "name": "Science Fiction"
      }
    ],
    "tagline": "His time has come.",
    "homepage": "https://www.20thcenturystudios.com/movies/logan",
    "vote_count": 17789,
    "belongs_to_collection": {
      "poster_path": "/c18HVnKTybcAUYVQd8rOcdbqwY.jpg",
      "name": "The Wolverine Collection",
      "backdrop_path": "/hbNMx7sxxqvkX8rLOsTryiSrCPY.jpg",
      "id": 453993
    },
    "adult": false,
    "poster_path": "/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg",
    "status": "Released",
    "video": false,
    "production_companies": [
      {
        "id": 91797,
        "logo_path": null,
        "name": "Hutch Parker Entertainment",
        "origin_country": "US"
      },
      {
        "id": 431,
        "name": "The Donners' Company",
        "origin_country": "US",
        "logo_path": "/6dcR1MbRqYgt3jUVYxkHe68GFnZ.png"
      },
      {
        "id": 28788,
        "logo_path": null,
        "name": "Genre Films",
        "origin_country": "US"
      },
      {
        "origin_country": "US",
        "logo_path": "/qZCc1lty5FzX30aOCVRBLzaVmcp.png",
        "id": 25,
        "name": "20th Century Fox"
      }
    ],
    "runtime": 137,
    "watched": true,
    "vote_average": 7.814,
    "revenue": 619021436,
    "original_language": "en",
    "popularity": 49.297,
    "budget": 97000000,
    "original_title": "Logan",
    "backdrop_path": "/9X7YweCJw3q8Mcf6GadxReFEksM.jpg",
    "overview": "In the near future, a weary Logan cares for an ailing Professor X in a hideout on the Mexican border. But Logan's attempts to hide from the world and his legacy are upended when a young mutant arrives, pursued by dark forces.",
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ]
  },
  {
    "id": 26610,
    "revenue": 227569,
    "spoken_languages": [
      {
        "english_name": "Norwegian",
        "name": "Norsk",
        "iso_639_1": "no"
      },
      {
        "iso_639_1": "sv",
        "english_name": "Swedish",
        "name": "svenska"
      }
    ],
    "genres": [
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "name": "Crime",
        "id": 80
      },
      {
        "name": "Mystery",
        "id": 9648
      }
    ],
    "title": "Insomnia",
    "tagline": "No peace for the wicked",
    "belongs_to_collection": null,
    "popularity": 10.157,
    "production_countries": [
      {
        "name": "Norway",
        "iso_3166_1": "NO"
      }
    ],
    "homepage": "",
    "overview": "Detectives Jonas and Erik are called to the midnight sun country of northern Norway to investigate a recent homicide, but their plan to arrest the killer goes awry, and Jonas mistakenly shoots Erik. The suspect escapes, and a frightened Jonas pins Erik's death on the fugitive. Jonas continues to pursue the killer as he seeks to protect himself; however, his mounting guilt and the omnipresent sun plague him with an insomnia that affects his sanity.",
    "original_title": "Insomnia",
    "vote_count": 217,
    "backdrop_path": "/o6hJ8xcL9rB6jdXnTp5zIn6XqhA.jpg",
    "poster_path": "/k0inzQmt7kATmAGns0wdfjiFxSu.jpg",
    "status": "Released",
    "budget": 0,
    "imdb_id": "tt0119375",
    "watched": false,
    "runtime": 96,
    "adult": false,
    "video": false,
    "production_companies": [
      {
        "id": 12984,
        "name": "Norsk Film",
        "origin_country": "NO",
        "logo_path": null
      },
      {
        "id": 16550,
        "name": "Nordic Screen Production AS",
        "logo_path": null,
        "origin_country": ""
      },
      {
        "logo_path": "/8VlPbyw3BoflxIDGkyUiQnEaair.png",
        "name": "Norsk Filminstitutt",
        "origin_country": "NO",
        "id": 16551
      }
    ],
    "original_language": "no",
    "vote_average": 7.046,
    "release_date": "1997-03-14"
  },
  {
    "id": 27205,
    "popularity": 80.046,
    "production_companies": [
      {
        "logo_path": "/5UQsZrfbfG2dYJbx8DxfoTr2Bvu.png",
        "id": 923,
        "name": "Legendary Pictures",
        "origin_country": "US"
      },
      {
        "origin_country": "GB",
        "name": "Syncopy",
        "logo_path": "/3tvBqYsBhxWeHlu62SIJ1el93O7.png",
        "id": 9996
      },
      {
        "name": "Warner Bros. Pictures",
        "logo_path": "/IuAlhI9eVC9Z8UQWOIDdWRKSEJ.png",
        "origin_country": "US",
        "id": 174
      }
    ],
    "overview": "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
    "watched": true,
    "budget": 160000000,
    "runtime": 148,
    "backdrop_path": "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    "poster_path": "/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    "original_language": "en",
    "revenue": 825532764,
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      },
      {
        "iso_639_1": "fr",
        "name": "Français",
        "english_name": "French"
      },
      {
        "english_name": "Japanese",
        "name": "日本語",
        "iso_639_1": "ja"
      },
      {
        "english_name": "Swahili",
        "name": "Kiswahili",
        "iso_639_1": "sw"
      }
    ],
    "title": "Inception",
    "belongs_to_collection": null,
    "adult": false,
    "tagline": "Your mind is the scene of the crime.",
    "imdb_id": "tt1375666",
    "genres": [
      {
        "name": "Action",
        "id": 28
      },
      {
        "id": 878,
        "name": "Science Fiction"
      },
      {
        "id": 12,
        "name": "Adventure"
      }
    ],
    "homepage": "https://www.warnerbros.com/movies/inception",
    "vote_average": 8.363,
    "video": false,
    "release_date": "2010-07-15",
    "production_countries": [
      {
        "name": "United Kingdom",
        "iso_3166_1": "GB"
      },
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "original_title": "Inception",
    "status": "Released",
    "vote_count": 33785
  },
  {
    "id": 274,
    "vote_average": 8.344,
    "original_title": "The Silence of the Lambs",
    "status": "Released",
    "poster_path": "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
    "adult": false,
    "title": "The Silence of the Lambs",
    "video": false,
    "backdrop_path": "/aYcnDyLMnpKce1FOYUpZrXtgUye.jpg",
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      }
    ],
    "runtime": 119,
    "production_companies": [
      {
        "name": "Orion Pictures",
        "id": 41,
        "logo_path": "/xAot4SSOIHiWQ2WEnVXYGR1lce9.png",
        "origin_country": "US"
      },
      {
        "logo_path": null,
        "name": "Strong Heart/Demme Production",
        "id": 55072,
        "origin_country": "US"
      }
    ],
    "homepage": "",
    "imdb_id": "tt0102926",
    "genres": [
      {
        "name": "Crime",
        "id": 80
      },
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "name": "Thriller",
        "id": 53
      }
    ],
    "budget": 19000000,
    "original_language": "en",
    "watched": true,
    "tagline": "To enter the mind of a killer she must challenge the mind of a madman.",
    "popularity": 11.427,
    "revenue": 272742922,
    "overview": "Clarice Starling is a top student at the FBI's training academy.  Jack Crawford wants Clarice to interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath, serving life behind bars for various acts of murder and cannibalism.  Crawford believes that Lecter may have insight into a case and that Starling, as an attractive young woman, may be just the bait to draw him out.",
    "belongs_to_collection": {
      "poster_path": "/p6MezjrHnrgP1li5YxomRBFdKnp.jpg",
      "name": "The Hannibal Lecter Collection",
      "backdrop_path": "/npCbvak9UhjPsZB9Oa2k2jsqI7E.jpg",
      "id": 9743
    },
    "vote_count": 14595,
    "release_date": "1991-02-14"
  },
  {
    "id": 278,
    "title": "The Shawshank Redemption",
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "name": "Crime",
        "id": 80
      }
    ],
    "runtime": 142,
    "adult": false,
    "release_date": "1994-09-23",
    "imdb_id": "tt0111161",
    "popularity": 83.724,
    "video": false,
    "overview": "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.",
    "revenue": 28341469,
    "status": "Released",
    "homepage": "",
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      }
    ],
    "backdrop_path": "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    "vote_average": 8.703,
    "vote_count": 23896,
    "original_language": "en",
    "budget": 25000000,
    "original_title": "The Shawshank Redemption",
    "tagline": "Fear can hold you prisoner. Hope can set you free.",
    "watched": true,
    "belongs_to_collection": null,
    "poster_path": "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    "production_companies": [
      {
        "logo_path": "/7znWcbDd4PcJzJUlJxYqAlPPykp.png",
        "origin_country": "US",
        "id": 97,
        "name": "Castle Rock Entertainment"
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ]
  },
  {
    "id": 286217,
    "vote_count": 18179,
    "imdb_id": "tt3659388",
    "production_countries": [
      {
        "name": "United Kingdom",
        "iso_3166_1": "GB"
      },
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "title": "The Martian",
    "revenue": 630600000,
    "production_companies": [
      {
        "logo_path": "/6Ry6uNBaa0IbbSs1XYIgX5DkA9r.png",
        "id": 1645,
        "name": "Scott Free Productions",
        "origin_country": "GB"
      },
      {
        "origin_country": "US",
        "logo_path": null,
        "id": 28788,
        "name": "Genre Films"
      }
    ],
    "status": "Released",
    "genres": [
      {
        "name": "Drama",
        "id": 18
      },
      {
        "name": "Adventure",
        "id": 12
      },
      {
        "id": 878,
        "name": "Science Fiction"
      }
    ],
    "belongs_to_collection": null,
    "budget": 108000000,
    "runtime": 141,
    "watched": true,
    "overview": "During a manned mission to Mars, Astronaut Mark Watney is presumed dead after a fierce storm and left behind by his crew. But Watney has survived and finds himself stranded and alone on the hostile planet. With only meager supplies, he must draw upon his ingenuity, wit and spirit to subsist and find a way to signal to Earth that he is alive.",
    "homepage": "https://www.20thcenturystudios.com/movies/the-martian",
    "poster_path": "/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg",
    "video": false,
    "original_title": "The Martian",
    "adult": false,
    "vote_average": 7.7,
    "release_date": "2015-09-30",
    "spoken_languages": [
      {
        "english_name": "English",
        "iso_639_1": "en",
        "name": "English"
      },
      {
        "iso_639_1": "zh",
        "english_name": "Mandarin",
        "name": "普通话"
      }
    ],
    "popularity": 39.01,
    "original_language": "en",
    "tagline": "Bring Him Home",
    "backdrop_path": "/3dPhs7hUnQLphDFzdkD407VZDYo.jpg"
  },
  {
    "id": 294254,
    "overview": "Thomas and his fellow Gladers face their greatest challenge yet: searching for clues about the mysterious and powerful organization known as WCKD. Their journey takes them to the Scorch, a desolate landscape filled with unimaginable obstacles. Teaming up with resistance fighters, the Gladers take on WCKD’s vastly superior forces and uncover its shocking plans for them all.",
    "vote_count": 9499,
    "original_title": "Maze Runner: The Scorch Trials",
    "genres": [
      {
        "name": "Science Fiction",
        "id": 878
      },
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "name": "Adventure",
        "id": 12
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "poster_path": "/lq9n07JSzdhK5l1TKxQ9SHawNYn.jpg",
    "vote_average": 6.726,
    "homepage": "https://www.20thcenturystudios.com/movies/maze-runner-the-scorch-trials",
    "production_companies": [
      {
        "origin_country": "US",
        "name": "Temple Hill Entertainment",
        "id": 12292,
        "logo_path": "/4GQTeqos2luopEtp3OgMQYusQ5c.png"
      },
      {
        "id": 3672,
        "name": "Gotham Group",
        "logo_path": "/5VWXJgYYrJZUE0hixvBdVfGSfmo.png",
        "origin_country": "US"
      },
      {
        "id": 22213,
        "name": "TSG Entertainment",
        "origin_country": "US",
        "logo_path": "/qx9K6bFWJupwde0xQDwOvXkOaL8.png"
      },
      {
        "logo_path": "/qZCc1lty5FzX30aOCVRBLzaVmcp.png",
        "origin_country": "US",
        "name": "20th Century Fox",
        "id": 25
      }
    ],
    "release_date": "2015-09-09",
    "backdrop_path": "/4mcOCiR06dqQ5eoEJcG3zvonjOa.jpg",
    "belongs_to_collection": {
      "backdrop_path": "/te8ibHFhjwWXZTCtQIPRUFjxWX2.jpg",
      "id": 295130,
      "poster_path": "/wQ0l9sq0Bm6OAeqY4w6NWjP9jwS.jpg",
      "name": "The Maze Runner Collection"
    },
    "budget": 61000000,
    "revenue": 312296056,
    "video": false,
    "runtime": 131,
    "status": "Released",
    "tagline": "The Maze Was Just the Beginning.",
    "imdb_id": "tt4046784",
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      }
    ],
    "adult": false,
    "title": "Maze Runner: The Scorch Trials",
    "popularity": 54.482,
    "original_language": "en",
    "watched": true
  },
  {
    "id": 318846,
    "tagline": "This is a true story.",
    "runtime": 131,
    "original_language": "en",
    "backdrop_path": "/i7UCf0ysjbYYaqcSKUox9BJz4Kp.jpg",
    "original_title": "The Big Short",
    "homepage": "http://www.thebigshortmovie.com",
    "adult": false,
    "vote_count": 8093,
    "vote_average": 7.337,
    "watched": false,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "release_date": "2015-12-11",
    "revenue": 133346506,
    "title": "The Big Short",
    "imdb_id": "tt1596363",
    "genres": [
      {
        "name": "Comedy",
        "id": 35
      },
      {
        "name": "Drama",
        "id": 18
      }
    ],
    "poster_path": "/isuQWbJPbjybBEWdcCaBUPmU0XO.jpg",
    "status": "Released",
    "belongs_to_collection": null,
    "video": false,
    "popularity": 25.34,
    "overview": "The men who made millions from a global economic meltdown.",
    "budget": 28000000,
    "spoken_languages": [
      {
        "english_name": "English",
        "iso_639_1": "en",
        "name": "English"
      }
    ],
    "production_companies": [
      {
        "logo_path": "/8wOfUhA7vwU2gbPjQy7Vv3EiF0o.png",
        "id": 81,
        "origin_country": "US",
        "name": "Plan B Entertainment"
      },
      {
        "name": "Paramount",
        "origin_country": "US",
        "id": 4,
        "logo_path": "/gz66EfNoYPqHTYI4q9UEN4CbHRc.png"
      },
      {
        "id": 508,
        "logo_path": "/7cxRWzi4LsVm4Utfpr1hfARNurT.png",
        "name": "Regency Enterprises",
        "origin_country": "US"
      }
    ]
  },
  {
    "id": 324552,
    "adult": false,
    "title": "John Wick: Chapter 2",
    "production_companies": [
      {
        "origin_country": "US",
        "logo_path": "/cCzCClIzIh81Fa79hpW5nXoUsHK.png",
        "name": "Thunder Road",
        "id": 3528
      },
      {
        "id": 23008,
        "name": "87Eleven",
        "origin_country": "US",
        "logo_path": "/5SarYupipdiejsEqUkwu1SpYfru.png"
      },
      {
        "origin_country": "US",
        "logo_path": "/5LvDUt3KmvRnXQ4NrdWJYHeuA8J.png",
        "id": 491,
        "name": "Summit Entertainment"
      }
    ],
    "status": "Released",
    "poster_path": "/hXWBc0ioZP3cN4zCu6SN3YHXZVO.jpg",
    "imdb_id": "tt4425200",
    "belongs_to_collection": {
      "backdrop_path": "/fSwYa5q2xRkBoOOjueLpkLf3N1m.jpg",
      "name": "John Wick Collection",
      "poster_path": "/xUidyvYFsbbuExifLkslpcd8SMc.jpg",
      "id": 404609
    },
    "video": false,
    "budget": 40000000,
    "backdrop_path": "/r17jFHAemzcWPPtoO0UxjIX0xas.jpg",
    "watched": true,
    "original_language": "en",
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "id": 80,
        "name": "Crime"
      }
    ],
    "release_date": "2017-02-08",
    "tagline": "Never stab the devil in the back.",
    "runtime": 122,
    "spoken_languages": [
      {
        "english_name": "English",
        "name": "English",
        "iso_639_1": "en"
      },
      {
        "iso_639_1": "he",
        "name": "עִבְרִית",
        "english_name": "Hebrew"
      },
      {
        "iso_639_1": "it",
        "name": "Italiano",
        "english_name": "Italian"
      },
      {
        "english_name": "Russian",
        "iso_639_1": "ru",
        "name": "Pусский"
      }
    ],
    "popularity": 184.833,
    "vote_count": 11613,
    "vote_average": 7.3,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "homepage": "https://www.lionsgate.com/movies/john-wick-chapter-2",
    "revenue": 171539887,
    "overview": "John Wick is forced out of retirement by a former associate looking to seize control of a shadowy international assassins’ guild. Bound by a blood oath to aid him, Wick travels to Rome and does battle against some of the world’s most dangerous killers.",
    "original_title": "John Wick: Chapter 2"
  },
  {
    "id": 324786,
    "genres": [
      {
        "name": "Drama",
        "id": 18
      },
      {
        "id": 36,
        "name": "History"
      },
      {
        "id": 10752,
        "name": "War"
      }
    ],
    "backdrop_path": "/rshlQ6LfPRSWFhpGL4s5ZkIPR51.jpg",
    "homepage": "https://www.lionsgate.com/movies/hacksaw-ridge",
    "runtime": 139,
    "original_title": "Hacksaw Ridge",
    "budget": 40000000,
    "title": "Hacksaw Ridge",
    "imdb_id": "tt2119532",
    "video": false,
    "release_date": "2016-10-07",
    "original_language": "en",
    "popularity": 113.387,
    "overview": "WWII American Army Medic Desmond T. Doss, who served during the Battle of Okinawa, refuses to kill people and becomes the first Conscientious Objector in American history to receive the Congressional Medal of Honor.",
    "production_countries": [
      {
        "name": "Australia",
        "iso_3166_1": "AU"
      },
      {
        "iso_3166_1": "CN",
        "name": "China"
      },
      {
        "iso_3166_1": "GB",
        "name": "United Kingdom"
      },
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "adult": false,
    "vote_count": 12296,
    "vote_average": 8.191,
    "production_companies": [
      {
        "logo_path": "/mBgGtJJQ9aOpKBnuKXM75kHYT6D.png",
        "name": "Vendian Entertainment",
        "id": 50481,
        "origin_country": "US"
      },
      {
        "origin_country": "US",
        "id": 491,
        "name": "Summit Entertainment",
        "logo_path": "/5LvDUt3KmvRnXQ4NrdWJYHeuA8J.png"
      },
      {
        "origin_country": "US",
        "name": "Cross Creek Pictures",
        "id": 10246,
        "logo_path": "/rREvQNWAxkDfY9CDn2c5YxEMPdP.png"
      },
      {
        "origin_country": "US",
        "id": 7437,
        "logo_path": "/e5CcgFrdlxMUwlsS72si8q1yHBr.png",
        "name": "IM Global"
      },
      {
        "name": "Screen Australia",
        "id": 7584,
        "origin_country": "AU",
        "logo_path": "/eGkfvvyf4fJTvBUR1xt1669IPA3.png"
      },
      {
        "id": 10951,
        "logo_path": "/48iBaAPgtoirf3C25HNkL9MhWfj.png",
        "name": "Screen NSW",
        "origin_country": "AU"
      },
      {
        "id": 455,
        "logo_path": null,
        "origin_country": "US",
        "name": "Permut Presentations"
      },
      {
        "logo_path": null,
        "id": 8915,
        "origin_country": "",
        "name": "Pandemonium"
      },
      {
        "origin_country": "",
        "logo_path": null,
        "id": 13241,
        "name": "Demarest Films"
      },
      {
        "id": 1632,
        "origin_country": "US",
        "logo_path": "/cisLn1YAUuptXVBa0xjq7ST9cH0.png",
        "name": "Lionsgate"
      },
      {
        "name": "Bliss Media",
        "id": 8186,
        "logo_path": null,
        "origin_country": "CN"
      },
      {
        "id": 94431,
        "logo_path": null,
        "name": "Kylin Pictures",
        "origin_country": "CN"
      },
      {
        "logo_path": null,
        "origin_country": "GB",
        "id": 51860,
        "name": "AI Film"
      }
    ],
    "tagline": "One of the greatest heroes in American history never fired a bullet.",
    "revenue": 175302354,
    "belongs_to_collection": null,
    "spoken_languages": [
      {
        "iso_639_1": "ja",
        "name": "日本語",
        "english_name": "Japanese"
      },
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      }
    ],
    "poster_path": "/jhWbYeUNOA5zAb6ufK6pXQFXqTX.jpg",
    "status": "Released",
    "watched": false
  },
  {
    "id": 324857,
    "vote_count": 12940,
    "tagline": "More than one wears the mask.",
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      },
      {
        "english_name": "Japanese",
        "iso_639_1": "ja",
        "name": "日本語"
      },
      {
        "iso_639_1": "es",
        "name": "Español",
        "english_name": "Spanish"
      }
    ],
    "original_language": "en",
    "title": "Spider-Man: Into the Spider-Verse",
    "imdb_id": "tt4633694",
    "popularity": 997.05,
    "genres": [
      {
        "name": "Action",
        "id": 28
      },
      {
        "name": "Adventure",
        "id": 12
      },
      {
        "name": "Animation",
        "id": 16
      },
      {
        "id": 878,
        "name": "Science Fiction"
      }
    ],
    "video": false,
    "watched": true,
    "homepage": "https://www.sonypictures.com/movies/spidermanintothespiderverse",
    "production_companies": [
      {
        "origin_country": "US",
        "name": "Columbia Pictures",
        "logo_path": "/71BqEFAF4V3qjjMPCpLuyJFB9A.png",
        "id": 5
      },
      {
        "id": 77973,
        "name": "Lord Miller",
        "origin_country": "US",
        "logo_path": null
      },
      {
        "id": 84041,
        "logo_path": "/nw4kyc29QRpNtFbdsBHkRSFavvt.png",
        "name": "Pascal Pictures",
        "origin_country": "US"
      },
      {
        "id": 2251,
        "name": "Sony Pictures Animation",
        "logo_path": "/5ilV5mH3gxTEU7p5wjxptHvXkyr.png",
        "origin_country": "US"
      },
      {
        "name": "Avi Arad Productions",
        "id": 166230,
        "logo_path": null,
        "origin_country": "US"
      },
      {
        "id": 7505,
        "origin_country": "US",
        "logo_path": "/837VMM4wOkODc1idNxGT0KQJlej.png",
        "name": "Marvel Entertainment"
      }
    ],
    "budget": 90000000,
    "adult": false,
    "runtime": 117,
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "release_date": "2018-12-06",
    "status": "Released",
    "original_title": "Spider-Man: Into the Spider-Verse",
    "vote_average": 8.404,
    "belongs_to_collection": {
      "name": "Spider-Man: Spider-Verse Collection",
      "id": 573436,
      "poster_path": "/eD4bGQNfmqExIAzKdvX5gDHhI2.jpg",
      "backdrop_path": "/14F6gMaRjzgsN6EEpiwH87R1I00.jpg"
    },
    "backdrop_path": "/jqwM0nhOLEFI1HHBabwr80Od3TC.jpg",
    "poster_path": "/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    "overview": "Miles Morales is juggling his life between being a high school student and being a spider-man. When Wilson \"Kingpin\" Fisk uses a super collider, others from across the Spider-Verse are transported to this dimension.",
    "revenue": 375464627
  },
  {
    "id": 336843,
    "release_date": "2018-01-10",
    "genres": [
      {
        "id": 878,
        "name": "Science Fiction"
      },
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 53,
        "name": "Thriller"
      }
    ],
    "imdb_id": "tt4500922",
    "original_title": "Maze Runner: The Death Cure",
    "runtime": 143,
    "adult": false,
    "poster_path": "/2zYfzA3TBwrMC8tfFbpiTLODde0.jpg",
    "tagline": "The end will be WCKD",
    "backdrop_path": "/zgcL0xaHxXVvrV1Fu1ZSKoTk0MH.jpg",
    "spoken_languages": [
      {
        "name": "English",
        "english_name": "English",
        "iso_639_1": "en"
      }
    ],
    "vote_average": 7.114,
    "budget": 62000000,
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "revenue": 288175335,
    "original_language": "en",
    "popularity": 48.195,
    "belongs_to_collection": {
      "id": 295130,
      "name": "The Maze Runner Collection",
      "backdrop_path": "/te8ibHFhjwWXZTCtQIPRUFjxWX2.jpg",
      "poster_path": "/wQ0l9sq0Bm6OAeqY4w6NWjP9jwS.jpg"
    },
    "video": false,
    "status": "Released",
    "overview": "Thomas leads his group of escaped Gladers on their final and most dangerous mission yet. To save their friends, they must break into the legendary Last City, a WCKD-controlled labyrinth that may turn out to be the deadliest maze of all. Anyone who makes it out alive will get answers to the questions the Gladers have been asking since they first arrived in the maze.",
    "homepage": "https://www.20thcenturystudios.com/movies/maze-runner-the-death-cure",
    "watched": true,
    "production_companies": [
      {
        "origin_country": "US",
        "id": 3672,
        "logo_path": "/5VWXJgYYrJZUE0hixvBdVfGSfmo.png",
        "name": "Gotham Group"
      },
      {
        "name": "Temple Hill Entertainment",
        "logo_path": "/4GQTeqos2luopEtp3OgMQYusQ5c.png",
        "origin_country": "US",
        "id": 12292
      },
      {
        "name": "20th Century Fox",
        "logo_path": "/qZCc1lty5FzX30aOCVRBLzaVmcp.png",
        "id": 25,
        "origin_country": "US"
      }
    ],
    "title": "Maze Runner: The Death Cure",
    "vote_count": 6975
  },
  {
    "id": 339403,
    "title": "Baby Driver",
    "original_language": "en",
    "vote_average": 7.453,
    "video": false,
    "spoken_languages": [
      {
        "english_name": "English",
        "name": "English",
        "iso_639_1": "en"
      }
    ],
    "watched": false,
    "revenue": 226945087,
    "overview": "After being coerced into working for a crime boss, a young getaway driver finds himself taking part in a heist doomed to fail.",
    "release_date": "2017-06-28",
    "vote_count": 14341,
    "popularity": 47.024,
    "status": "Released",
    "production_companies": [
      {
        "origin_country": "GB",
        "logo_path": "/deewJi8ncCh6Sc2STL91wvZ4O5X.png",
        "name": "Big Talk Productions",
        "id": 443
      },
      {
        "logo_path": "/16KWBMmfPX0aJzDExDrPxSLj0Pg.png",
        "id": 10163,
        "name": "Working Title Films",
        "origin_country": "GB"
      }
    ],
    "homepage": "http://www.babydriver-movie.com",
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 80,
        "name": "Crime"
      }
    ],
    "original_title": "Baby Driver",
    "adult": false,
    "poster_path": "/rmnQ9jKW72bHu8uKlMjPIb2VLMI.jpg",
    "backdrop_path": "/oVD3ClJBoomSQHtnJPAlMfes8YD.jpg",
    "tagline": "All you need is one killer track.",
    "belongs_to_collection": {
      "poster_path": "/iT2MoPGJ3arMUPEjTyTmi6C5ZFO.jpg",
      "name": "Baby Driver Collection",
      "id": 726865,
      "backdrop_path": "/5YdNKuMXZhoIEalATwealQS69WC.jpg"
    },
    "production_countries": [
      {
        "iso_3166_1": "GB",
        "name": "United Kingdom"
      }
    ],
    "runtime": 113,
    "budget": 34000000,
    "imdb_id": "tt3890160"
  },
  {
    "id": 346364,
    "budget": 35000000,
    "original_language": "en",
    "adult": false,
    "popularity": 46.954,
    "vote_count": 17638,
    "imdb_id": "tt1396484",
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      }
    ],
    "video": false,
    "title": "It",
    "runtime": 135,
    "genres": [
      {
        "id": 27,
        "name": "Horror"
      },
      {
        "name": "Fantasy",
        "id": 14
      }
    ],
    "belongs_to_collection": {
      "poster_path": "/tZ55C7gPExwzvBLCsZMqFZMbB2I.jpg",
      "name": "It Collection",
      "id": 477962,
      "backdrop_path": "/ayvH5IW5eDOa28WfSjnkYMii73d.jpg"
    },
    "tagline": "Your fears are unleashed",
    "vote_average": 7.236,
    "status": "Released",
    "homepage": "http://itthemovie.com/",
    "watched": true,
    "overview": "In a small town in Maine, seven children known as The Losers Club come face to face with life problems, bullies and a monster that takes the shape of a clown called Pennywise.",
    "release_date": "2017-09-06",
    "poster_path": "/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg",
    "original_title": "It",
    "backdrop_path": "/tcheoA2nPATCm2vvXw2hVQoaEFD.jpg",
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "revenue": 701842551,
    "production_companies": [
      {
        "id": 12,
        "origin_country": "US",
        "name": "New Line Cinema",
        "logo_path": "/5ThIuO93vsk47oexKTSdfKEr7EC.png"
      },
      {
        "name": "Vertigo Entertainment",
        "id": 829,
        "logo_path": "/mzpAmEQ5P1gFvdRoNyCk9q8ngiv.png",
        "origin_country": "US"
      },
      {
        "name": "Lin Pictures",
        "logo_path": "/rB0dyszYRRR3SAG1tfNRzXoYDYq.png",
        "origin_country": "US",
        "id": 2723
      },
      {
        "origin_country": "US",
        "name": "KatzSmith Productions",
        "logo_path": "/kEEGB5Z2XLYeR3AMt3Qds7vMnvM.png",
        "id": 87671
      }
    ]
  },
  {
    "id": 348,
    "budget": 11000000,
    "original_title": "Alien",
    "vote_count": 12858,
    "adult": false,
    "title": "Alien",
    "belongs_to_collection": {
      "name": "Alien Collection",
      "backdrop_path": "/kB0Y3uGe9ohJa59Lk8UO9cUOxGM.jpg",
      "id": 8091,
      "poster_path": "/iVzIeC3PbG9BtDAudpwSNdKAgh6.jpg"
    },
    "tagline": "In space no one can hear you scream.",
    "release_date": "1979-05-25",
    "homepage": "https://www.20thcenturystudios.com/movies/alien",
    "backdrop_path": "/AmR3JG1VQVxU8TfAvljUhfSFUOx.jpg",
    "imdb_id": "tt0078748",
    "vote_average": 8.143,
    "popularity": 52.027,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      },
      {
        "iso_3166_1": "GB",
        "name": "United Kingdom"
      }
    ],
    "original_language": "en",
    "spoken_languages": [
      {
        "english_name": "English",
        "name": "English",
        "iso_639_1": "en"
      },
      {
        "name": "Español",
        "english_name": "Spanish",
        "iso_639_1": "es"
      }
    ],
    "watched": true,
    "genres": [
      {
        "name": "Horror",
        "id": 27
      },
      {
        "name": "Science Fiction",
        "id": 878
      }
    ],
    "revenue": 104931801,
    "runtime": 117,
    "poster_path": "/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg",
    "overview": "During its return to the earth, commercial spaceship Nostromo intercepts a distress signal from a distant planet. When a three-member team of the crew discovers a chamber containing thousands of eggs on the planet, a creature inside one of the eggs attacks an explorer. The entire crew is unaware of the impending nightmare set to descend upon them when the alien parasite planted inside its unfortunate host is birthed.",
    "production_companies": [
      {
        "logo_path": null,
        "name": "Brandywine Productions",
        "id": 19747,
        "origin_country": "US"
      },
      {
        "logo_path": "/qZCc1lty5FzX30aOCVRBLzaVmcp.png",
        "origin_country": "US",
        "id": 25,
        "name": "20th Century Fox"
      }
    ],
    "video": false,
    "status": "Released"
  },
  {
    "id": 37165,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      }
    ],
    "backdrop_path": "/bxY7ve1LP8atCIuvr4jeeJMmU4w.jpg",
    "status": "Released",
    "poster_path": "/vuza0WqY239yBXOadKlGwJsZJFE.jpg",
    "vote_count": 16312,
    "production_companies": [
      {
        "origin_country": "US",
        "name": "Paramount",
        "id": 4,
        "logo_path": "/gz66EfNoYPqHTYI4q9UEN4CbHRc.png"
      },
      {
        "logo_path": null,
        "id": 258,
        "name": "Scott Rudin Productions",
        "origin_country": "US"
      }
    ],
    "homepage": "",
    "budget": 60000000,
    "overview": "Truman Burbank is the star of The Truman Show, a 24-hour-a-day reality TV show that broadcasts every aspect of his life without his knowledge. His entire life has been an unending soap opera for consumption by the rest of the world. And everyone he knows, including his wife and his best friend is really an actor, paid to be part of his life.",
    "belongs_to_collection": null,
    "original_title": "The Truman Show",
    "original_language": "en",
    "popularity": 52.053,
    "watched": true,
    "runtime": 103,
    "release_date": "1998-06-04",
    "vote_average": 8.129,
    "genres": [
      {
        "id": 35,
        "name": "Comedy"
      },
      {
        "id": 18,
        "name": "Drama"
      }
    ],
    "adult": false,
    "tagline": "On the air. Unaware.",
    "imdb_id": "tt0120382",
    "video": false,
    "title": "The Truman Show",
    "revenue": 264118201
  },
  {
    "id": 37799,
    "release_date": "2010-10-01",
    "watched": true,
    "original_language": "en",
    "runtime": 121,
    "revenue": 224920315,
    "tagline": "You don't get to 500 million friends without making a few enemies.",
    "backdrop_path": "/65D7t8wgZFpjOTvIp1HQvHFY0fC.jpg",
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "belongs_to_collection": null,
    "budget": 40000000,
    "original_title": "The Social Network",
    "poster_path": "/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
    "popularity": 26.41,
    "video": false,
    "adult": false,
    "overview": "The tale of a new breed of cultural insurgent: a punk genius who sparked a revolution and changed the face of human interaction for a generation, and perhaps forever.",
    "vote_count": 10892,
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      }
    ],
    "title": "The Social Network",
    "homepage": "https://www.sonypictures.com/movies/thesocialnetwork",
    "imdb_id": "tt1285016",
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      }
    ],
    "vote_average": 7.4,
    "production_companies": [
      {
        "origin_country": "US",
        "id": 5,
        "name": "Columbia Pictures",
        "logo_path": "/71BqEFAF4V3qjjMPCpLuyJFB9A.png"
      },
      {
        "logo_path": "/62E1B91PxZw8q4KNkge5Qemo7EM.png",
        "id": 7295,
        "name": "Relativity Media",
        "origin_country": "US"
      },
      {
        "origin_country": "US",
        "id": 258,
        "name": "Scott Rudin Productions",
        "logo_path": null
      },
      {
        "id": 11370,
        "origin_country": "US",
        "name": "Michael De Luca Productions",
        "logo_path": null
      },
      {
        "logo_path": "/4839MGss4pPAalhqqYH1AD1CnEj.png",
        "id": 7626,
        "origin_country": "US",
        "name": "Trigger Street Productions"
      }
    ],
    "status": "Released"
  },
  {
    "id": 39513,
    "backdrop_path": "/oUvmiw8ow04fnkQMmxNZGj9PzM7.jpg",
    "homepage": "",
    "original_language": "en",
    "production_companies": [
      {
        "name": "Universal Pictures",
        "id": 33,
        "origin_country": "US",
        "logo_path": "/8lvHyhjr8oUKOOy2dKXoALWKdp0.png"
      },
      {
        "name": "Relativity Media",
        "origin_country": "US",
        "logo_path": "/62E1B91PxZw8q4KNkge5Qemo7EM.png",
        "id": 7295
      },
      {
        "logo_path": "/16KWBMmfPX0aJzDExDrPxSLj0Pg.png",
        "name": "Working Title Films",
        "id": 10163,
        "origin_country": "GB"
      },
      {
        "logo_path": "/deewJi8ncCh6Sc2STL91wvZ4O5X.png",
        "name": "Big Talk Productions",
        "origin_country": "GB",
        "id": 443
      }
    ],
    "tagline": "Who's up for a close encounter?",
    "runtime": 104,
    "vote_average": 6.71,
    "genres": [
      {
        "name": "Adventure",
        "id": 12
      },
      {
        "id": 35,
        "name": "Comedy"
      },
      {
        "id": 878,
        "name": "Science Fiction"
      }
    ],
    "video": false,
    "release_date": "2011-02-14",
    "watched": false,
    "revenue": 97984015,
    "budget": 40000000,
    "belongs_to_collection": null,
    "title": "Paul",
    "imdb_id": "tt1092026",
    "status": "Released",
    "poster_path": "/ijTJf6evpPF0DgGMgiUFxbDgnJh.jpg",
    "adult": false,
    "production_countries": [
      {
        "iso_3166_1": "GB",
        "name": "United Kingdom"
      },
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "popularity": 33.807,
    "vote_count": 5173,
    "original_title": "Paul",
    "overview": "For the past 60 years, a space-traveling smart-ass named Paul has been locked up in a top-secret military base, advising world leaders about his kind. But when he worries he’s outlived his usefulness and the dissection table is drawing uncomfortably close, Paul escapes on the first RV that passes by his compound in Area 51. Fortunately, it contains the two earthlings who are most likely to rescue and harbor an alien on the run.",
    "spoken_languages": [
      {
        "english_name": "English",
        "iso_639_1": "en",
        "name": "English"
      }
    ]
  },
  {
    "id": 414906,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "popularity": 191.885,
    "original_title": "The Batman",
    "poster_path": "/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    "revenue": 770945583,
    "budget": 185000000,
    "overview": "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
    "adult": false,
    "tagline": "Unmask the truth.",
    "watched": true,
    "belongs_to_collection": {
      "id": 948485,
      "poster_path": "/tuzKA9K5Ae9IzaA0R9oAgbyhAI3.jpg",
      "name": "The Batman Collection",
      "backdrop_path": "/qS2ViQwlWUECiAdkIuEaJZoq0QW.jpg"
    },
    "release_date": "2022-03-01",
    "vote_count": 8028,
    "production_companies": [
      {
        "origin_country": "US",
        "logo_path": null,
        "id": 101405,
        "name": "6th & Idaho"
      },
      {
        "logo_path": "/6F45uVsKpNYANcWvplyhgIFezFU.png",
        "origin_country": "US",
        "id": 119245,
        "name": "Dylan Clark Productions"
      },
      {
        "name": "DC Films",
        "origin_country": "US",
        "logo_path": "/13F3Jf7EFAcREU0xzZqJnVnyGXu.png",
        "id": 128064
      },
      {
        "id": 174,
        "logo_path": "/IuAlhI9eVC9Z8UQWOIDdWRKSEJ.png",
        "name": "Warner Bros. Pictures",
        "origin_country": "US"
      }
    ],
    "title": "The Batman",
    "video": false,
    "genres": [
      {
        "name": "Crime",
        "id": 80
      },
      {
        "name": "Mystery",
        "id": 9648
      },
      {
        "name": "Thriller",
        "id": 53
      }
    ],
    "original_language": "en",
    "status": "Released",
    "homepage": "https://www.thebatman.com",
    "imdb_id": "tt1877830",
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      }
    ],
    "runtime": 177,
    "vote_average": 7.71,
    "backdrop_path": "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg"
  },
  {
    "id": 438631,
    "popularity": 85.868,
    "vote_count": 8923,
    "runtime": 155,
    "title": "Dune",
    "original_language": "en",
    "vote_average": 7.799,
    "genres": [
      {
        "name": "Science Fiction",
        "id": 878
      },
      {
        "id": 12,
        "name": "Adventure"
      }
    ],
    "backdrop_path": "/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg",
    "tagline": "It begins.",
    "revenue": 402027830,
    "adult": false,
    "original_title": "Dune",
    "imdb_id": "tt1160419",
    "overview": "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people. As malevolent forces explode into conflict over the planet's exclusive supply of the most precious resource in existence-a commodity capable of unlocking humanity's greatest potential-only those who can conquer their fear will survive.",
    "watched": true,
    "video": false,
    "status": "Released",
    "belongs_to_collection": {
      "name": "Dune Collection",
      "id": 726871,
      "poster_path": "/c1AiZTXyyzmPOlTLSubp7CEeYj.jpg",
      "backdrop_path": "/iCFFmXkK5FdIzqZyyQQEdpkTo8C.jpg"
    },
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "production_companies": [
      {
        "origin_country": "US",
        "logo_path": "/5UQsZrfbfG2dYJbx8DxfoTr2Bvu.png",
        "name": "Legendary Pictures",
        "id": 923
      }
    ],
    "homepage": "https://www.dunemovie.com/",
    "spoken_languages": [
      {
        "iso_639_1": "zh",
        "name": "普通话",
        "english_name": "Mandarin"
      },
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      }
    ],
    "release_date": "2021-09-15",
    "budget": 165000000,
    "poster_path": "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"
  },
  {
    "id": 447365,
    "title": "Guardians of the Galaxy Vol. 3",
    "overview": "Peter Quill, still reeling from the loss of Gamora, must rally his team around him to defend the universe along with protecting one of their own. A mission that, if not completed successfully, could quite possibly lead to the end of the Guardians as we know them.",
    "release_date": "2023-05-03",
    "vote_count": 1833,
    "genres": [
      {
        "name": "Science Fiction",
        "id": 878
      },
      {
        "name": "Adventure",
        "id": 12
      },
      {
        "id": 28,
        "name": "Action"
      }
    ],
    "vote_average": 8.126,
    "watched": true,
    "status": "Released",
    "revenue": 780801000,
    "production_companies": [
      {
        "name": "Marvel Studios",
        "id": 420,
        "logo_path": "/hUzeosd33nzE5MCNsZxCGEKTXaQ.png",
        "origin_country": "US"
      },
      {
        "logo_path": null,
        "id": 176762,
        "origin_country": "US",
        "name": "Kevin Feige Productions"
      }
    ],
    "poster_path": "/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
    "adult": false,
    "belongs_to_collection": {
      "poster_path": "/iL8mukexAqEg0xK783rG561tdd8.jpg",
      "id": 284433,
      "backdrop_path": "/jdyyjulTBU8YUYAUvQFj6U1g2Pj.jpg",
      "name": "Guardians of the Galaxy Collection"
    },
    "tagline": "Once more with feeling.",
    "runtime": 150,
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      }
    ],
    "original_language": "en",
    "video": false,
    "backdrop_path": "/51vreLbrGwzAg4WRCHgitWz6Naw.jpg",
    "budget": 250000000,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "original_title": "Guardians of the Galaxy Vol. 3",
    "imdb_id": "tt6791350",
    "homepage": "https://www.marvel.com/movies/guardians-of-the-galaxy-volume-3",
    "popularity": 1252.941
  },
  {
    "id": 458156,
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      },
      {
        "name": "Pусский",
        "english_name": "Russian",
        "iso_639_1": "ru"
      }
    ],
    "release_date": "2019-05-15",
    "vote_average": 7.446,
    "belongs_to_collection": {
      "poster_path": "/xUidyvYFsbbuExifLkslpcd8SMc.jpg",
      "id": 404609,
      "name": "John Wick Collection",
      "backdrop_path": "/fSwYa5q2xRkBoOOjueLpkLf3N1m.jpg"
    },
    "homepage": "https://www.lionsgate.com/movies/john-wick-chapter-3-parabellum",
    "production_companies": [
      {
        "origin_country": "US",
        "id": 3528,
        "name": "Thunder Road",
        "logo_path": "/cCzCClIzIh81Fa79hpW5nXoUsHK.png"
      },
      {
        "id": 1632,
        "logo_path": "/cisLn1YAUuptXVBa0xjq7ST9cH0.png",
        "origin_country": "US",
        "name": "Lionsgate"
      },
      {
        "logo_path": "/5SarYupipdiejsEqUkwu1SpYfru.png",
        "id": 23008,
        "origin_country": "US",
        "name": "87Eleven"
      }
    ],
    "backdrop_path": "/vVpEOvdxVBP2aV166j5Xlvb5Cdc.jpg",
    "status": "Released",
    "poster_path": "/ziEuG1essDuWuC5lpWUaw1uXY2O.jpg",
    "runtime": 131,
    "video": false,
    "revenue": 326709727,
    "budget": 55000000,
    "vote_count": 9315,
    "tagline": "Every action has consequences.",
    "original_language": "en",
    "adult": false,
    "original_title": "John Wick: Chapter 3 - Parabellum",
    "watched": true,
    "overview": "Super-assassin John Wick returns with a $14 million price tag on his head and an army of bounty-hunting killers on his trail. After killing a member of the shadowy international assassin’s guild, the High Table, John Wick is excommunicado, but the world’s most ruthless hit men and women await his every turn.",
    "genres": [
      {
        "name": "Action",
        "id": 28
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "id": 80,
        "name": "Crime"
      }
    ],
    "imdb_id": "tt6146586",
    "popularity": 188.812,
    "title": "John Wick: Chapter 3 - Parabellum"
  },
  {
    "id": 466272,
    "status": "Released",
    "release_date": "2019-07-24",
    "poster_path": "/wQKeS2JrsRF8XSfd9zqflrc5gad.jpg",
    "vote_count": 11861,
    "backdrop_path": "/oRiUKwDpcqDdoLwPoA4FIRh3hqY.jpg",
    "overview": "Los Angeles, 1969. TV star Rick Dalton, a struggling actor specializing in westerns, and stuntman Cliff Booth, his best friend, try to survive in a constantly changing movie industry. Dalton is the neighbor of the young and promising actress and model Sharon Tate, who has just married the prestigious Polish director Roman Polanski…",
    "production_companies": [
      {
        "id": 437,
        "name": "Heyday Films",
        "logo_path": "/nu20mtwbEIhUNnQ5NXVhHsNknZj.png",
        "origin_country": "GB"
      },
      {
        "origin_country": "US",
        "name": "Columbia Pictures",
        "id": 5,
        "logo_path": "/71BqEFAF4V3qjjMPCpLuyJFB9A.png"
      },
      {
        "id": 30148,
        "origin_country": "CN",
        "name": "Bona Film Group",
        "logo_path": "/zerhOenUD6CkH8SMgZUhrDkOs4w.png"
      }
    ],
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      },
      {
        "name": "Italiano",
        "iso_639_1": "it",
        "english_name": "Italian"
      },
      {
        "iso_639_1": "es",
        "name": "Español",
        "english_name": "Spanish"
      }
    ],
    "belongs_to_collection": null,
    "video": false,
    "vote_average": 7.435,
    "imdb_id": "tt7131622",
    "runtime": 162,
    "title": "Once Upon a Time… in Hollywood",
    "watched": true,
    "production_countries": [
      {
        "name": "China",
        "iso_3166_1": "CN"
      },
      {
        "iso_3166_1": "GB",
        "name": "United Kingdom"
      },
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "budget": 95000000,
    "original_language": "en",
    "adult": false,
    "revenue": 374251247,
    "tagline": "In this town, it can all change… like that",
    "homepage": "https://www.sonypictures.com/movies/onceuponatimeinhollywood",
    "original_title": "Once Upon a Time… in Hollywood",
    "popularity": 49.407,
    "genres": [
      {
        "name": "Comedy",
        "id": 35
      },
      {
        "name": "Drama",
        "id": 18
      },
      {
        "name": "Thriller",
        "id": 53
      }
    ]
  },
  {
    "id": 489,
    "video": false,
    "adult": false,
    "homepage": "http://www.miramax.com/movie/good-will-hunting",
    "imdb_id": "tt0119217",
    "tagline": "For the first 20 years of his life, Will Hunting has called the shots. Now he's about to meet his match.",
    "poster_path": "/bABCBKYBK7A5G1x0FzoeoNfuj2.jpg",
    "runtime": 127,
    "release_date": "1997-12-05",
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "genres": [
      {
        "name": "Drama",
        "id": 18
      }
    ],
    "vote_count": 10790,
    "belongs_to_collection": null,
    "original_language": "en",
    "overview": "Will Hunting has a genius-level IQ but chooses to work as a janitor at MIT. When he solves a difficult graduate-level math problem, his talents are discovered by Professor Gerald Lambeau, who decides to help the misguided youth reach his potential. When Will is arrested for attacking a police officer, Professor Lambeau makes a deal to get leniency for him if he will get treatment from therapist Sean Maguire.",
    "title": "Good Will Hunting",
    "spoken_languages": [
      {
        "name": "English",
        "english_name": "English",
        "iso_639_1": "en"
      }
    ],
    "revenue": 225933435,
    "vote_average": 8.146,
    "budget": 10000000,
    "production_companies": [
      {
        "id": 14,
        "logo_path": "/m6AHu84oZQxvq7n1rsvMNJIAsMu.png",
        "name": "Miramax",
        "origin_country": "US"
      },
      {
        "origin_country": "US",
        "name": "Lawrence Bender Productions",
        "id": 2253,
        "logo_path": null
      },
      {
        "name": "Be Gentlemen Limited Partnership",
        "logo_path": null,
        "origin_country": "",
        "id": 23201
      }
    ],
    "original_title": "Good Will Hunting",
    "popularity": 42.824,
    "status": "Released",
    "backdrop_path": "/4ywKTlsIllvQYRiZJPwYACJIHY8.jpg",
    "watched": true
  },
  {
    "id": 49018,
    "overview": "A family discovers that dark spirits have invaded their home after their son inexplicably falls into an endless sleep. When they reach out to a professional for help, they learn things are a lot more personal than they thought.",
    "tagline": "It's not the House that's Haunted.",
    "title": "Insidious",
    "budget": 1500000,
    "vote_average": 6.941,
    "homepage": "http://www.insidious-movie.com/",
    "vote_count": 6037,
    "imdb_id": "tt1591095",
    "original_language": "en",
    "release_date": "2010-09-13",
    "poster_path": "/tmlDFIUpGRKiuWm9Ixc6CYDk4y0.jpg",
    "adult": false,
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      }
    ],
    "status": "Released",
    "watched": true,
    "production_countries": [
      {
        "name": "Canada",
        "iso_3166_1": "CA"
      },
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "runtime": 103,
    "genres": [
      {
        "id": 27,
        "name": "Horror"
      },
      {
        "name": "Thriller",
        "id": 53
      }
    ],
    "original_title": "Insidious",
    "video": false,
    "belongs_to_collection": {
      "backdrop_path": "/5FrPZHgbbmTIq0oxpwSGqu5HyXC.jpg",
      "name": "Insidious Collection",
      "id": 228446,
      "poster_path": "/w1213HKk1XKSwHiBgjkWghn9biC.jpg"
    },
    "popularity": 49.983,
    "backdrop_path": "/bylGn5OC2h3BWfGLYFtIcxlYxLy.jpg",
    "revenue": 99870886,
    "production_companies": [
      {
        "logo_path": "/auaadhBBcvvTDtmW2iJzOrEjfgO.png",
        "id": 7263,
        "name": "FilmDistrict",
        "origin_country": "US"
      },
      {
        "logo_path": "/xytTBODEy3p20ksHL4Ftxr483Iv.png",
        "name": "Stage 6 Films",
        "origin_country": "US",
        "id": 11341
      },
      {
        "origin_country": "CA",
        "logo_path": "/zEyrFF8Nn325PXG0Q9j7my0JqIJ.png",
        "name": "Alliance Films",
        "id": 2514
      },
      {
        "origin_country": "US",
        "logo_path": "/e5CcgFrdlxMUwlsS72si8q1yHBr.png",
        "id": 7437,
        "name": "IM Global"
      },
      {
        "origin_country": "",
        "logo_path": null,
        "name": "Haunted Movies",
        "id": 21742
      },
      {
        "id": 3172,
        "name": "Blumhouse Productions",
        "logo_path": "/kDedjRZwO8uyFhuHamomOhN6fzG.png",
        "origin_country": "US"
      }
    ]
  },
  {
    "id": 497,
    "original_language": "en",
    "imdb_id": "tt0120689",
    "homepage": "http://thegreenmile.warnerbros.com/",
    "title": "The Green Mile",
    "adult": false,
    "original_title": "The Green Mile",
    "vote_average": 8.509,
    "video": false,
    "revenue": 286801374,
    "production_companies": [
      {
        "logo_path": "/7znWcbDd4PcJzJUlJxYqAlPPykp.png",
        "name": "Castle Rock Entertainment",
        "id": 97,
        "origin_country": "US"
      },
      {
        "origin_country": "US",
        "logo_path": "/bli7HkPOXOEWsDwDK0W7XXfeUU2.png",
        "name": "Darkwoods Productions",
        "id": 3982
      },
      {
        "origin_country": "US",
        "id": 174,
        "name": "Warner Bros. Pictures",
        "logo_path": "/IuAlhI9eVC9Z8UQWOIDdWRKSEJ.png"
      }
    ],
    "backdrop_path": "/l6hQWH9eDksNJNiXWYRkWqikOdu.jpg",
    "status": "Released",
    "tagline": "Miracles do happen.",
    "release_date": "1999-12-10",
    "runtime": 189,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "poster_path": "/o0lO84GI7qrG6XFvtsPOSV7CTNa.jpg",
    "overview": "A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people's ailments. When the cell block's head guard, Paul Edgecomb, recognizes Coffey's miraculous gift, he tries desperately to help stave off the condemned man's execution.",
    "genres": [
      {
        "name": "Fantasy",
        "id": 14
      },
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "name": "Crime",
        "id": 80
      }
    ],
    "budget": 60000000,
    "belongs_to_collection": null,
    "vote_count": 15466,
    "watched": false,
    "spoken_languages": [
      {
        "iso_639_1": "fr",
        "english_name": "French",
        "name": "Français"
      },
      {
        "name": "English",
        "english_name": "English",
        "iso_639_1": "en"
      }
    ],
    "popularity": 96.31
  },
  {
    "id": 502356,
    "production_companies": [
      {
        "logo_path": "/8lvHyhjr8oUKOOy2dKXoALWKdp0.png",
        "id": 33,
        "origin_country": "US",
        "name": "Universal Pictures"
      },
      {
        "name": "Illumination",
        "origin_country": "US",
        "id": 6704,
        "logo_path": "/fOG2oY4m1YuYTQh4bMqqZkmgOAI.png"
      },
      {
        "id": 12288,
        "logo_path": "/e4dQAqZD374H5EuM0W1ljEBWTKy.png",
        "origin_country": "JP",
        "name": "Nintendo"
      }
    ],
    "spoken_languages": [
      {
        "name": "English",
        "english_name": "English",
        "iso_639_1": "en"
      }
    ],
    "imdb_id": "tt6718170",
    "budget": 100000000,
    "title": "The Super Mario Bros. Movie",
    "video": false,
    "runtime": 92,
    "overview": "While working underground to fix a water main, Brooklyn plumbers—and brothers—Mario and Luigi are transported down a mysterious pipe and wander into a magical new world. But when the brothers are separated, Mario embarks on an epic quest to find Luigi.",
    "poster_path": "/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
    "tagline": "",
    "watched": true,
    "status": "Released",
    "backdrop_path": "/2klQ1z1fcHGgQPevbEQdkCnzyuS.jpg",
    "genres": [
      {
        "id": 16,
        "name": "Animation"
      },
      {
        "id": 10751,
        "name": "Family"
      },
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 14,
        "name": "Fantasy"
      },
      {
        "name": "Comedy",
        "id": 35
      }
    ],
    "vote_average": 7.791,
    "vote_count": 4254,
    "production_countries": [
      {
        "iso_3166_1": "JP",
        "name": "Japan"
      },
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "original_title": "The Super Mario Bros. Movie",
    "original_language": "en",
    "belongs_to_collection": null,
    "adult": false,
    "popularity": 4014.944,
    "homepage": "https://www.thesupermariobros.movie",
    "release_date": "2023-04-05",
    "revenue": 1308766975
  },
  {
    "id": 546554,
    "belongs_to_collection": {
      "poster_path": "/q8qrqIOwfx0Usp9xMRRB2g4dwYw.jpg",
      "backdrop_path": "/G7qYINSq5xyDd0I0zn3DpAssA0.jpg",
      "id": 722971,
      "name": "Knives Out Collection"
    },
    "runtime": 131,
    "overview": "When renowned crime novelist Harlan Thrombey is found dead at his estate just after his 85th birthday, the inquisitive and debonair Detective Benoit Blanc is mysteriously enlisted to investigate. From Harlan's dysfunctional family to his devoted staff, Blanc sifts through a web of red herrings and self-serving lies to uncover the truth behind Harlan's untimely death.",
    "original_title": "Knives Out",
    "revenue": 312897920,
    "vote_average": 7.9,
    "backdrop_path": "/4HWAQu28e2yaWrtupFPGFkdNU7V.jpg",
    "status": "Released",
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "release_date": "2019-11-27",
    "popularity": 46.415,
    "original_language": "en",
    "vote_count": 10770,
    "homepage": "https://www.lionsgate.com/movies/knives-out",
    "video": false,
    "imdb_id": "tt8946378",
    "title": "Knives Out",
    "poster_path": "/pThyQovXQrw2m0s9x82twj48Jq4.jpg",
    "tagline": "Hell, any of them could have done it.",
    "adult": false,
    "genres": [
      {
        "name": "Comedy",
        "id": 35
      },
      {
        "name": "Crime",
        "id": 80
      },
      {
        "id": 9648,
        "name": "Mystery"
      }
    ],
    "spoken_languages": [
      {
        "name": "Español",
        "english_name": "Spanish",
        "iso_639_1": "es"
      },
      {
        "name": "English",
        "iso_639_1": "en",
        "english_name": "English"
      }
    ],
    "production_companies": [
      {
        "logo_path": "/cisLn1YAUuptXVBa0xjq7ST9cH0.png",
        "id": 1632,
        "origin_country": "US",
        "name": "Lionsgate"
      },
      {
        "logo_path": "/9MfCJ2G6Nrf9yyRj4tAgPmMiDcn.png",
        "name": "MRC",
        "id": 2531,
        "origin_country": "US"
      },
      {
        "logo_path": "/lZW4kQSSLFldUpjjtfcECutV8Pr.png",
        "id": 37871,
        "origin_country": "US",
        "name": "T-Street Productions"
      }
    ],
    "watched": true,
    "budget": 40000000
  },
  {
    "id": 550,
    "original_title": "Fight Club",
    "backdrop_path": "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    "original_language": "en",
    "status": "Released",
    "belongs_to_collection": null,
    "budget": 63000000,
    "imdb_id": "tt0137523",
    "watched": true,
    "homepage": "http://www.foxmovies.com/movies/fight-club",
    "release_date": "1999-10-15",
    "popularity": 67.857,
    "production_companies": [
      {
        "name": "Regency Enterprises",
        "logo_path": "/7cxRWzi4LsVm4Utfpr1hfARNurT.png",
        "id": 508,
        "origin_country": "US"
      },
      {
        "logo_path": "/tEiIH5QesdheJmDAqQwvtN60727.png",
        "origin_country": "US",
        "id": 711,
        "name": "Fox 2000 Pictures"
      },
      {
        "origin_country": "DE",
        "logo_path": "/hD8yEGUBlHOcfHYbujp71vD8gZp.png",
        "id": 20555,
        "name": "Taurus Film"
      },
      {
        "origin_country": "",
        "name": "Atman Entertainment",
        "logo_path": null,
        "id": 54051
      },
      {
        "origin_country": "US",
        "name": "Knickerbocker Films",
        "logo_path": null,
        "id": 54052
      },
      {
        "name": "The Linson Company",
        "id": 4700,
        "logo_path": "/A32wmjrs9Psf4zw0uaixF0GXfxq.png",
        "origin_country": "US"
      },
      {
        "logo_path": "/qZCc1lty5FzX30aOCVRBLzaVmcp.png",
        "origin_country": "US",
        "name": "20th Century Fox",
        "id": 25
      }
    ],
    "genres": [
      {
        "name": "Drama",
        "id": 18
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "name": "Comedy",
        "id": 35
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "tagline": "Mischief. Mayhem. Soap.",
    "spoken_languages": [
      {
        "english_name": "English",
        "name": "English",
        "iso_639_1": "en"
      }
    ],
    "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "title": "Fight Club",
    "video": false,
    "vote_average": 8.434,
    "revenue": 100853753,
    "adult": false,
    "overview": "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.",
    "runtime": 139,
    "vote_count": 26529
  },
  {
    "id": 569094,
    "popularity": 2974.157,
    "adult": false,
    "tagline": "It's how you wear the mask that matters",
    "homepage": "https://www.acrossthespiderverse.movie",
    "watched": true,
    "poster_path": "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    "original_language": "en",
    "release_date": "2023-05-31",
    "status": "Released",
    "overview": "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence. But when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders and must set out on his own to save those he loves most.",
    "vote_average": 8.744,
    "original_title": "Spider-Man: Across the Spider-Verse",
    "video": false,
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "name": "Adventure",
        "id": 12
      },
      {
        "name": "Animation",
        "id": 16
      },
      {
        "id": 878,
        "name": "Science Fiction"
      }
    ],
    "title": "Spider-Man: Across the Spider-Verse",
    "imdb_id": "tt9362722",
    "revenue": 208600000,
    "backdrop_path": "/2I5eBh98Q4aPq8WdQrHdTC8ARhY.jpg",
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      },
      {
        "english_name": "Hindi",
        "name": "हिन्दी",
        "iso_639_1": "hi"
      },
      {
        "iso_639_1": "it",
        "english_name": "Italian",
        "name": "Italiano"
      },
      {
        "english_name": "Spanish",
        "iso_639_1": "es",
        "name": "Español"
      }
    ],
    "vote_count": 651,
    "belongs_to_collection": {
      "id": 573436,
      "name": "Spider-Man: Spider-Verse Collection",
      "backdrop_path": "/14F6gMaRjzgsN6EEpiwH87R1I00.jpg",
      "poster_path": "/eD4bGQNfmqExIAzKdvX5gDHhI2.jpg"
    },
    "runtime": 140,
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "production_companies": [
      {
        "name": "Columbia Pictures",
        "id": 5,
        "origin_country": "US",
        "logo_path": "/71BqEFAF4V3qjjMPCpLuyJFB9A.png"
      },
      {
        "logo_path": "/5ilV5mH3gxTEU7p5wjxptHvXkyr.png",
        "id": 2251,
        "name": "Sony Pictures Animation",
        "origin_country": "US"
      },
      {
        "id": 7505,
        "logo_path": "/837VMM4wOkODc1idNxGT0KQJlej.png",
        "origin_country": "US",
        "name": "Marvel Entertainment"
      },
      {
        "origin_country": "US",
        "id": 77973,
        "name": "Lord Miller",
        "logo_path": null
      },
      {
        "id": 84041,
        "logo_path": "/nw4kyc29QRpNtFbdsBHkRSFavvt.png",
        "name": "Pascal Pictures",
        "origin_country": "US"
      },
      {
        "id": 166230,
        "name": "Avi Arad Productions",
        "origin_country": "US",
        "logo_path": null
      }
    ],
    "budget": 100000000
  },
  {
    "id": 594,
    "overview": "Viktor Navorski is a man without a country; his plane took off just as a coup d'etat exploded in his homeland, leaving it in shambles, and now he's stranded at Kennedy Airport, where he's holding a passport that nobody recognizes. While quarantined in the transit lounge until authorities can figure out what to do with him, Viktor simply goes on living – and courts romance with a beautiful flight attendant.",
    "adult": false,
    "release_date": "2004-06-17",
    "runtime": 128,
    "original_title": "The Terminal",
    "title": "The Terminal",
    "poster_path": "/pXNomqKcKXAQbuWxehb2N3XFKfn.jpg",
    "status": "Released",
    "revenue": 219417255,
    "watched": true,
    "homepage": "https://www.paramountmovies.com/movies/the-terminal",
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "vote_count": 7049,
    "belongs_to_collection": null,
    "original_language": "en",
    "video": false,
    "vote_average": 7.333,
    "budget": 60000000,
    "spoken_languages": [
      {
        "name": "български език",
        "english_name": "Bulgarian",
        "iso_639_1": "bg"
      },
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      },
      {
        "english_name": "French",
        "name": "Français",
        "iso_639_1": "fr"
      },
      {
        "name": "Pусский",
        "english_name": "Russian",
        "iso_639_1": "ru"
      },
      {
        "iso_639_1": "es",
        "name": "Español",
        "english_name": "Spanish"
      }
    ],
    "popularity": 21.237,
    "tagline": "Life is waiting.",
    "genres": [
      {
        "name": "Comedy",
        "id": 35
      },
      {
        "id": 18,
        "name": "Drama"
      }
    ],
    "imdb_id": "tt0362227",
    "production_companies": [
      {
        "id": 56,
        "logo_path": "/cEaxANEisCqeEoRvODv2dO1I0iI.png",
        "name": "Amblin Entertainment",
        "origin_country": "US"
      },
      {
        "logo_path": null,
        "id": 11084,
        "name": "Parkes/MacDonald Productions",
        "origin_country": ""
      },
      {
        "origin_country": "US",
        "logo_path": "/vru2SssLX3FPhnKZGtYw00pVIS9.png",
        "id": 7,
        "name": "DreamWorks Pictures"
      }
    ],
    "backdrop_path": "/zywtNiaZ9r7azrcNdl2j0jOgrkw.jpg"
  },
  {
    "id": 603692,
    "homepage": "https://johnwick.movie",
    "production_companies": [
      {
        "id": 3528,
        "origin_country": "US",
        "logo_path": "/cCzCClIzIh81Fa79hpW5nXoUsHK.png",
        "name": "Thunder Road"
      },
      {
        "name": "87Eleven",
        "origin_country": "US",
        "id": 23008,
        "logo_path": "/5SarYupipdiejsEqUkwu1SpYfru.png"
      },
      {
        "name": "Summit Entertainment",
        "logo_path": "/5LvDUt3KmvRnXQ4NrdWJYHeuA8J.png",
        "origin_country": "US",
        "id": 491
      },
      {
        "origin_country": "DE",
        "name": "Studio Babelsberg",
        "logo_path": "/fA90qwUKgPhMONqtwY60GaHRyrW.png",
        "id": 264
      }
    ],
    "overview": "With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
    "poster_path": "/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    "revenue": 431769198,
    "adult": false,
    "spoken_languages": [
      {
        "english_name": "Arabic",
        "name": "العربية",
        "iso_639_1": "ar"
      },
      {
        "iso_639_1": "cn",
        "name": "广州话 / 廣州話",
        "english_name": "Cantonese"
      },
      {
        "english_name": "English",
        "iso_639_1": "en",
        "name": "English"
      },
      {
        "iso_639_1": "fr",
        "english_name": "French",
        "name": "Français"
      },
      {
        "iso_639_1": "de",
        "english_name": "German",
        "name": "Deutsch"
      },
      {
        "iso_639_1": "ja",
        "name": "日本語",
        "english_name": "Japanese"
      },
      {
        "name": "Latin",
        "english_name": "Latin",
        "iso_639_1": "la"
      },
      {
        "name": "Pусский",
        "iso_639_1": "ru",
        "english_name": "Russian"
      },
      {
        "name": "Español",
        "english_name": "Spanish",
        "iso_639_1": "es"
      }
    ],
    "budget": 90000000,
    "status": "Released",
    "vote_count": 2669,
    "original_title": "John Wick: Chapter 4",
    "backdrop_path": "/fgw4rFs4XMWdJTWp1eMacHKQqbZ.jpg",
    "tagline": "No way back, one way out.",
    "watched": true,
    "popularity": 5459.368,
    "imdb_id": "tt10366206",
    "genres": [
      {
        "name": "Action",
        "id": 28
      },
      {
        "name": "Thriller",
        "id": 53
      },
      {
        "name": "Crime",
        "id": 80
      }
    ],
    "original_language": "en",
    "release_date": "2023-03-22",
    "production_countries": [
      {
        "iso_3166_1": "DE",
        "name": "Germany"
      },
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "belongs_to_collection": {
      "poster_path": "/xUidyvYFsbbuExifLkslpcd8SMc.jpg",
      "backdrop_path": "/fSwYa5q2xRkBoOOjueLpkLf3N1m.jpg",
      "name": "John Wick Collection",
      "id": 404609
    },
    "title": "John Wick: Chapter 4",
    "video": false,
    "runtime": 170,
    "vote_average": 7.943
  },
  {
    "id": 616037,
    "popularity": 206.439,
    "video": false,
    "overview": "After his retirement is interrupted by Gorr the God Butcher, a galactic killer who seeks the extinction of the gods, Thor Odinson enlists the help of King Valkyrie, Korg, and ex-girlfriend Jane Foster, who now wields Mjolnir as the Mighty Thor. Together they embark upon a harrowing cosmic adventure to uncover the mystery of the God Butcher’s vengeance and stop him before it’s too late.",
    "title": "Thor: Love and Thunder",
    "watched": true,
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "backdrop_path": "/jsoz1HlxczSuTx0mDl2h0lxy36l.jpg",
    "status": "Released",
    "tagline": "The one is not the only.",
    "adult": false,
    "release_date": "2022-07-06",
    "spoken_languages": [
      {
        "english_name": "English",
        "name": "English",
        "iso_639_1": "en"
      }
    ],
    "runtime": 119,
    "original_language": "en",
    "revenue": 760928081,
    "genres": [
      {
        "name": "Fantasy",
        "id": 14
      },
      {
        "id": 28,
        "name": "Action"
      },
      {
        "name": "Comedy",
        "id": 35
      }
    ],
    "belongs_to_collection": {
      "poster_path": "/yw7gr7DhHHVTLlO8Se8uH17TDMA.jpg",
      "name": "Thor Collection",
      "id": 131296,
      "backdrop_path": "/3KL8UNKFWgIKXzLHjwY0uwgjzYl.jpg"
    },
    "poster_path": "/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg",
    "homepage": "https://www.marvel.com/movies/thor-love-and-thunder",
    "imdb_id": "tt10648342",
    "budget": 250000000,
    "vote_average": 6.565,
    "production_companies": [
      {
        "logo_path": "/hUzeosd33nzE5MCNsZxCGEKTXaQ.png",
        "id": 420,
        "origin_country": "US",
        "name": "Marvel Studios"
      },
      {
        "id": 176762,
        "name": "Kevin Feige Productions",
        "logo_path": null,
        "origin_country": "US"
      }
    ],
    "vote_count": 6042,
    "original_title": "Thor: Love and Thunder"
  },
  {
    "id": 634649,
    "tagline": "The Multiverse unleashed.",
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "name": "Adventure",
        "id": 12
      },
      {
        "id": 878,
        "name": "Science Fiction"
      }
    ],
    "imdb_id": "tt10872600",
    "budget": 200000000,
    "watched": true,
    "runtime": 148,
    "popularity": 442.382,
    "production_companies": [
      {
        "logo_path": "/hUzeosd33nzE5MCNsZxCGEKTXaQ.png",
        "name": "Marvel Studios",
        "origin_country": "US",
        "id": 420
      },
      {
        "logo_path": "/nw4kyc29QRpNtFbdsBHkRSFavvt.png",
        "id": 84041,
        "name": "Pascal Pictures",
        "origin_country": "US"
      },
      {
        "name": "Columbia Pictures",
        "id": 5,
        "logo_path": "/71BqEFAF4V3qjjMPCpLuyJFB9A.png",
        "origin_country": "US"
      }
    ],
    "status": "Released",
    "backdrop_path": "/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    "overview": "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
    "original_language": "en",
    "poster_path": "/uJYYizSuA9Y3DCs0qS4qWvHfZg4.jpg",
    "vote_average": 8.003,
    "original_title": "Spider-Man: No Way Home",
    "title": "Spider-Man: No Way Home",
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "belongs_to_collection": {
      "poster_path": "/nogV4th2P5QWYvQIMiWHj4CFLU9.jpg",
      "id": 531241,
      "name": "Spider-Man (Avengers) Collection",
      "backdrop_path": "/AvnqpRwlEaYNVL6wzC4RN94EdSd.jpg"
    },
    "homepage": "https://www.spidermannowayhome.movie",
    "video": false,
    "vote_count": 17490,
    "revenue": 1921847111,
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      },
      {
        "name": "",
        "english_name": "Tagalog",
        "iso_639_1": "tl"
      }
    ],
    "release_date": "2021-12-15",
    "adult": false
  },
  {
    "id": 640,
    "watched": true,
    "popularity": 39.561,
    "revenue": 352114312,
    "homepage": "",
    "tagline": "The true story of a real fake.",
    "runtime": 141,
    "status": "Released",
    "poster_path": "/sdYgEkKCDPWNU6KnoL4qd8xZ4w7.jpg",
    "genres": [
      {
        "name": "Drama",
        "id": 18
      },
      {
        "name": "Crime",
        "id": 80
      }
    ],
    "vote_average": 7.967,
    "production_companies": [
      {
        "id": 11084,
        "name": "Parkes/MacDonald Productions",
        "logo_path": null,
        "origin_country": ""
      },
      {
        "origin_country": "",
        "name": "Kemp Company",
        "logo_path": null,
        "id": 367
      },
      {
        "origin_country": "",
        "name": "Splendid Pictures",
        "logo_path": null,
        "id": 368
      }
    ],
    "backdrop_path": "/Ag6qhzsJd3k1NKuNrG9RmhZDMh7.jpg",
    "video": false,
    "imdb_id": "tt0264464",
    "original_title": "Catch Me If You Can",
    "adult": false,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "title": "Catch Me If You Can",
    "vote_count": 13969,
    "release_date": "2002-12-16",
    "overview": "A true story about Frank Abagnale Jr. who, before his 19th birthday, successfully conned millions of dollars worth of checks as a Pan Am pilot, doctor, and legal prosecutor. An FBI agent makes it his mission to put him behind bars. But Frank not only eludes capture, he revels in the pursuit.",
    "original_language": "en",
    "budget": 52000000,
    "belongs_to_collection": null,
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      },
      {
        "english_name": "French",
        "name": "Français",
        "iso_639_1": "fr"
      }
    ]
  },
  {
    "id": 65754,
    "status": "Released",
    "vote_average": 7.357,
    "backdrop_path": "/hffS9IjEmP3ab1N7WHWNG8zBu2t.jpg",
    "original_title": "The Girl with the Dragon Tattoo",
    "tagline": "Evil shall with evil be expelled.",
    "production_companies": [
      {
        "name": "Ground Control",
        "id": 47479,
        "origin_country": "NO",
        "logo_path": null
      },
      {
        "logo_path": "/71BqEFAF4V3qjjMPCpLuyJFB9A.png",
        "name": "Columbia Pictures",
        "origin_country": "US",
        "id": 5
      },
      {
        "origin_country": "US",
        "id": 258,
        "logo_path": null,
        "name": "Scott Rudin Productions"
      },
      {
        "name": "Film Rites",
        "logo_path": null,
        "id": 8083,
        "origin_country": "US"
      },
      {
        "origin_country": "US",
        "id": 21,
        "logo_path": "/5Va1Ie5c4sjfEYqixQ3L8qg7fKu.png",
        "name": "Metro-Goldwyn-Mayer"
      },
      {
        "id": 5746,
        "origin_country": "SE",
        "logo_path": "/sWgSj9muRStENKBoIoaDK6OZmDu.png",
        "name": "Yellow Bird"
      }
    ],
    "revenue": 232617430,
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      },
      {
        "english_name": "French",
        "name": "Français",
        "iso_639_1": "fr"
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      },
      {
        "iso_3166_1": "NO",
        "name": "Norway"
      },
      {
        "name": "Sweden",
        "iso_3166_1": "SE"
      }
    ],
    "imdb_id": "tt1568346",
    "belongs_to_collection": {
      "backdrop_path": "/oCInm8wwTCIk6ElzHiXuhL2K7om.jpg",
      "id": 575987,
      "poster_path": "/eZEAiTIF3DrnWdDLz25ibINs5iJ.jpg",
      "name": "The Girl - Millennium Collection"
    },
    "overview": "This English-language adaptation of the Swedish novel by Stieg Larsson follows a disgraced journalist, Mikael Blomkvist, as he investigates the disappearance of a weary patriarch's niece from 40 years ago. He is aided by the pierced, tattooed, punk computer hacker named Lisbeth Salander. As they work together in the investigation, Blomkvist and Salander uncover immense corruption beyond anything they have ever imagined.",
    "runtime": 158,
    "original_language": "en",
    "poster_path": "/zqDopwg7XQ4IfFX2dRlQCT1SwMG.jpg",
    "genres": [
      {
        "name": "Thriller",
        "id": 53
      },
      {
        "name": "Crime",
        "id": 80
      },
      {
        "id": 9648,
        "name": "Mystery"
      }
    ],
    "release_date": "2011-12-14",
    "homepage": "http://dragontattoo.com/",
    "video": false,
    "budget": 90000000,
    "adult": false,
    "popularity": 30.843,
    "watched": true,
    "vote_count": 6333,
    "title": "The Girl with the Dragon Tattoo"
  },
  {
    "id": 661374,
    "overview": "World-famous detective Benoit Blanc heads to Greece to peel back the layers of a mystery surrounding a tech billionaire and his eclectic crew of friends.",
    "belongs_to_collection": {
      "name": "Knives Out Collection",
      "backdrop_path": "/G7qYINSq5xyDd0I0zn3DpAssA0.jpg",
      "poster_path": "/q8qrqIOwfx0Usp9xMRRB2g4dwYw.jpg",
      "id": 722971
    },
    "revenue": 13280000,
    "watched": true,
    "homepage": "https://glassonionmovie.com",
    "production_companies": [
      {
        "name": "T-Street Productions",
        "logo_path": "/lZW4kQSSLFldUpjjtfcECutV8Pr.png",
        "origin_country": "US",
        "id": 37871
      }
    ],
    "genres": [
      {
        "id": 35,
        "name": "Comedy"
      },
      {
        "name": "Crime",
        "id": 80
      },
      {
        "name": "Mystery",
        "id": 9648
      }
    ],
    "title": "Glass Onion: A Knives Out Mystery",
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      }
    ],
    "release_date": "2022-11-23",
    "original_language": "en",
    "runtime": 140,
    "tagline": "When the game ends, the mystery begins.",
    "video": false,
    "vote_count": 4151,
    "budget": 40000000,
    "status": "Released",
    "poster_path": "/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg",
    "backdrop_path": "/dKqa850uvbNSCaQCV4Im1XlzEtQ.jpg",
    "vote_average": 7.073,
    "popularity": 93.478,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "original_title": "Glass Onion: A Knives Out Mystery",
    "imdb_id": "tt11564570",
    "adult": false
  },
  {
    "id": 680,
    "watched": false,
    "backdrop_path": "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    "original_language": "en",
    "budget": 8000000,
    "vote_average": 8.49,
    "tagline": "Just because you are a character doesn't mean you have character.",
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      },
      {
        "english_name": "Spanish",
        "name": "Español",
        "iso_639_1": "es"
      },
      {
        "english_name": "French",
        "iso_639_1": "fr",
        "name": "Français"
      }
    ],
    "revenue": 214179088,
    "vote_count": 25259,
    "homepage": "https://www.miramax.com/movie/pulp-fiction/",
    "overview": "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
    "runtime": 154,
    "video": false,
    "genres": [
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "name": "Crime",
        "id": 80
      }
    ],
    "release_date": "1994-09-10",
    "status": "Released",
    "poster_path": "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    "production_companies": [
      {
        "logo_path": "/m6AHu84oZQxvq7n1rsvMNJIAsMu.png",
        "origin_country": "US",
        "id": 14,
        "name": "Miramax"
      },
      {
        "id": 59,
        "logo_path": "/yH7OMeSxhfP0AVM6iT0rsF3F4ZC.png",
        "origin_country": "US",
        "name": "A Band Apart"
      },
      {
        "origin_country": "US",
        "logo_path": null,
        "name": "Jersey Films",
        "id": 216
      }
    ],
    "title": "Pulp Fiction",
    "adult": false,
    "imdb_id": "tt0110912",
    "belongs_to_collection": null,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "popularity": 76.056,
    "original_title": "Pulp Fiction"
  },
  {
    "id": 68718,
    "tagline": "Life, liberty and the pursuit of vengeance.",
    "status": "Released",
    "original_title": "Django Unchained",
    "video": false,
    "poster_path": "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg",
    "title": "Django Unchained",
    "imdb_id": "tt1853728",
    "belongs_to_collection": null,
    "genres": [
      {
        "name": "Drama",
        "id": 18
      },
      {
        "name": "Western",
        "id": 37
      }
    ],
    "revenue": 425368238,
    "production_companies": [
      {
        "origin_country": "US",
        "name": "The Weinstein Company",
        "id": 308,
        "logo_path": "/e8F3mQM7DkJ5SfYYDp8FYzPBOGX.png"
      },
      {
        "logo_path": "/71BqEFAF4V3qjjMPCpLuyJFB9A.png",
        "origin_country": "US",
        "name": "Columbia Pictures",
        "id": 5
      }
    ],
    "homepage": "http://www.unchainedmovie.com",
    "vote_average": 8.165,
    "original_language": "en",
    "vote_count": 24141,
    "overview": "With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.",
    "popularity": 45.899,
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      },
      {
        "english_name": "French",
        "name": "Français",
        "iso_639_1": "fr"
      },
      {
        "iso_639_1": "de",
        "name": "Deutsch",
        "english_name": "German"
      }
    ],
    "release_date": "2012-12-25",
    "budget": 100000000,
    "backdrop_path": "/2oZklIzUbvZXXzIFzv7Hi68d6xf.jpg",
    "adult": false,
    "watched": true,
    "runtime": 165,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ]
  },
  {
    "id": 694,
    "video": false,
    "revenue": 44781695,
    "budget": 19000000,
    "runtime": 144,
    "backdrop_path": "/mmd1HnuvAzFc4iuVJcnBrhDNEKr.jpg",
    "watched": false,
    "poster_path": "/nRj5511mZdTl4saWEPoj9QroTIu.jpg",
    "tagline": "He came as the caretaker, but this hotel had its own guardians - who'd been there a long time",
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "production_companies": [
      {
        "logo_path": null,
        "origin_country": "",
        "id": 88,
        "name": "Hawk Films"
      },
      {
        "name": "Peregrine",
        "logo_path": null,
        "id": 11272,
        "origin_country": ""
      },
      {
        "origin_country": "",
        "name": "Producers Circle",
        "id": 734,
        "logo_path": null
      }
    ],
    "vote_average": 8.22,
    "belongs_to_collection": {
      "name": "The Shining Collection",
      "id": 530064,
      "backdrop_path": "/8L2bt7OWxrVhZPrFPkyZW4rEXzq.jpg",
      "poster_path": "/oeuzvbyE1bCsNUndKv1acHbmtmg.jpg"
    },
    "title": "The Shining",
    "spoken_languages": [
      {
        "english_name": "English",
        "name": "English",
        "iso_639_1": "en"
      }
    ],
    "original_title": "The Shining",
    "overview": "Jack Torrance accepts a caretaker job at the Overlook Hotel, where he, along with his wife Wendy and their son Danny, must live isolated from the rest of the world for the winter. But they aren't prepared for the madness that lurks within.",
    "homepage": "",
    "vote_count": 15767,
    "genres": [
      {
        "name": "Horror",
        "id": 27
      },
      {
        "id": 53,
        "name": "Thriller"
      }
    ],
    "original_language": "en",
    "imdb_id": "tt0081505",
    "popularity": 40.657,
    "release_date": "1980-05-23",
    "status": "Released",
    "adult": false
  },
  {
    "id": 73,
    "backdrop_path": "/9LSsSPbP715XT9B7acIZzantPyX.jpg",
    "belongs_to_collection": null,
    "runtime": 119,
    "poster_path": "/c2gsmSQ2Cqv8zosqKOCwRS0GFBS.jpg",
    "watched": true,
    "adult": false,
    "vote_count": 10427,
    "tagline": "Some Legacies Must End.",
    "production_companies": [
      {
        "logo_path": "/5ThIuO93vsk47oexKTSdfKEr7EC.png",
        "name": "New Line Cinema",
        "id": 12,
        "origin_country": "US"
      },
      {
        "logo_path": null,
        "origin_country": "",
        "id": 11308,
        "name": "Savoy Pictures"
      },
      {
        "name": "The Turman-Morrissey Company",
        "origin_country": "",
        "id": 924,
        "logo_path": null
      }
    ],
    "spoken_languages": [
      {
        "english_name": "English",
        "iso_639_1": "en",
        "name": "English"
      }
    ],
    "popularity": 28.24,
    "overview": "Derek Vineyard is paroled after serving 3 years in prison for killing two African-American men. Through his brother, Danny Vineyard's narration, we learn that before going to prison, Derek was a skinhead and the leader of a violent white supremacist gang that committed acts of racial crime throughout L.A. and his actions greatly influenced Danny. Reformed and fresh out of prison, Derek severs contact with the gang and becomes determined to keep Danny from going down the same violent path as he did.",
    "revenue": 23875127,
    "vote_average": 8.354,
    "original_language": "en",
    "status": "Released",
    "homepage": "",
    "original_title": "American History X",
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "title": "American History X",
    "release_date": "1998-07-01",
    "imdb_id": "tt0120586",
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      }
    ],
    "video": false,
    "budget": 20000000
  },
  {
    "id": 76341,
    "runtime": 121,
    "budget": 150000000,
    "backdrop_path": "/8yACFuo4OaIiKr9hHFlmPcGalKx.jpg",
    "video": false,
    "vote_average": 7.6,
    "popularity": 61.687,
    "status": "Released",
    "imdb_id": "tt1392190",
    "overview": "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken, and most everyone is crazed fighting for the necessities of life. Within this world exist two rebels on the run who just might be able to restore order.",
    "revenue": 378858340,
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      }
    ],
    "title": "Mad Max: Fury Road",
    "adult": false,
    "belongs_to_collection": {
      "backdrop_path": "/gwYe803SFwKlCF5y71OicWHUnVD.jpg",
      "poster_path": "/cNzCJnG4wstosen59BhydnUkaZJ.jpg",
      "name": "Mad Max Collection",
      "id": 8945
    },
    "watched": false,
    "original_language": "en",
    "production_countries": [
      {
        "name": "Australia",
        "iso_3166_1": "AU"
      },
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      },
      {
        "iso_3166_1": "ZA",
        "name": "South Africa"
      }
    ],
    "production_companies": [
      {
        "logo_path": null,
        "name": "Kennedy Miller Productions",
        "id": 2537,
        "origin_country": "AU"
      },
      {
        "origin_country": "US",
        "logo_path": "/IuAlhI9eVC9Z8UQWOIDdWRKSEJ.png",
        "name": "Warner Bros. Pictures",
        "id": 174
      },
      {
        "name": "RatPac Entertainment",
        "id": 41624,
        "origin_country": "US",
        "logo_path": "/wzKxIeQKlMP0y5CaAw25MD6EQmf.png"
      },
      {
        "origin_country": "US",
        "name": "Village Roadshow Pictures",
        "logo_path": "/tpFpsqbleCzEE2p5EgvUq6ozfCA.png",
        "id": 79
      }
    ],
    "homepage": "https://www.warnerbros.com/movies/mad-max-fury-road",
    "genres": [
      {
        "name": "Action",
        "id": 28
      },
      {
        "name": "Adventure",
        "id": 12
      },
      {
        "name": "Science Fiction",
        "id": 878
      }
    ],
    "vote_count": 20575,
    "original_title": "Mad Max: Fury Road",
    "tagline": "What a Lovely Day.",
    "release_date": "2015-05-13",
    "poster_path": "/hA2ple9q4qnwxp3hKVNhroipsir.jpg"
  },
  {
    "id": 76600,
    "popularity": 1176.751,
    "video": false,
    "tagline": "Return to Pandora.",
    "overview": "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
    "vote_count": 8330,
    "release_date": "2022-12-14",
    "original_title": "Avatar: The Way of Water",
    "homepage": "https://www.avatar.com/movies/avatar-the-way-of-water",
    "spoken_languages": [
      {
        "english_name": "English",
        "name": "English",
        "iso_639_1": "en"
      }
    ],
    "backdrop_path": "/suw8eyL3YwE4wfzPQ0cLR02k0Gh.jpg",
    "genres": [
      {
        "name": "Science Fiction",
        "id": 878
      },
      {
        "name": "Adventure",
        "id": 12
      },
      {
        "id": 28,
        "name": "Action"
      }
    ],
    "revenue": 2319794231,
    "vote_average": 7.704,
    "poster_path": "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    "runtime": 192,
    "status": "Released",
    "adult": false,
    "imdb_id": "tt1630029",
    "belongs_to_collection": {
      "backdrop_path": "/iaEsDbQPE45hQU2EGiNjXD2KWuF.jpg",
      "name": "Avatar Collection",
      "id": 87096,
      "poster_path": "/gC3tW9a45RGOzzSh6wv91pFnmFr.jpg"
    },
    "title": "Avatar: The Way of Water",
    "watched": true,
    "budget": 460000000,
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "production_companies": [
      {
        "name": "20th Century Studios",
        "id": 127928,
        "origin_country": "US",
        "logo_path": "/h0rjX5vjW5r8yEnUBStFarjcLT4.png"
      },
      {
        "id": 574,
        "name": "Lightstorm Entertainment",
        "origin_country": "US",
        "logo_path": "/iB6GjNVHs5hOqcEYt2rcjBqIjki.png"
      }
    ],
    "original_language": "en"
  },
  {
    "id": 855,
    "production_companies": [
      {
        "name": "Jerry Bruckheimer Films",
        "origin_country": "US",
        "logo_path": "/c9dVHPOL3cqCr2593Ahk0nEKTEM.png",
        "id": 130
      },
      {
        "id": 497,
        "name": "Revolution Studios",
        "logo_path": "/pMyhOBd3sCiLzBlmIopdJkcUFtn.png",
        "origin_country": "US"
      },
      {
        "name": "Scott Free Productions",
        "id": 1645,
        "origin_country": "GB",
        "logo_path": "/6Ry6uNBaa0IbbSs1XYIgX5DkA9r.png"
      }
    ],
    "runtime": 145,
    "homepage": "",
    "budget": 92000000,
    "watched": false,
    "vote_average": 7.368,
    "vote_count": 5062,
    "popularity": 32.241,
    "title": "Black Hawk Down",
    "tagline": "Leave No Man Behind.",
    "genres": [
      {
        "name": "Action",
        "id": 28
      },
      {
        "name": "History",
        "id": 36
      },
      {
        "id": 10752,
        "name": "War"
      }
    ],
    "production_countries": [
      {
        "name": "United Kingdom",
        "iso_3166_1": "GB"
      },
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "original_language": "en",
    "video": false,
    "belongs_to_collection": null,
    "adult": false,
    "revenue": 172989651,
    "backdrop_path": "/dd11uT1rtjQfEwEAvWiNfXgzXtD.jpg",
    "status": "Released",
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      },
      {
        "name": "Somali",
        "iso_639_1": "so",
        "english_name": "Somali"
      }
    ],
    "overview": "When U.S. Rangers and an elite Delta Force team attempt to kidnap two underlings of a Somali warlord, their Black Hawk helicopters are shot down, and the Americans suffer heavy casualties, facing intense fighting from the militia on the ground.",
    "original_title": "Black Hawk Down",
    "poster_path": "/7fU5dSqKRL4XHeEUz62rCKBfYok.jpg",
    "imdb_id": "tt0265086",
    "release_date": "2001-12-28"
  },
  {
    "id": 8699,
    "original_title": "Anchorman: The Legend of Ron Burgundy",
    "tagline": "They bring you the news so you don't have to get it yourself.",
    "status": "Released",
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "original_language": "en",
    "imdb_id": "tt0357413",
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      }
    ],
    "popularity": 16.638,
    "release_date": "2004-06-28",
    "production_companies": [
      {
        "id": 10105,
        "origin_country": "US",
        "name": "Apatow Productions",
        "logo_path": "/bN4tiAS8oNlHhIqq66KBPQ1Ekqh.png"
      },
      {
        "origin_country": "US",
        "id": 7,
        "name": "DreamWorks Pictures",
        "logo_path": "/vru2SssLX3FPhnKZGtYw00pVIS9.png"
      }
    ],
    "budget": 26000000,
    "vote_count": 3713,
    "adult": false,
    "genres": [
      {
        "id": 35,
        "name": "Comedy"
      }
    ],
    "overview": "It's the 1970s and San Diego anchorman Ron Burgundy is the top dog in local TV, but that's all about to change when ambitious reporter Veronica Corningstone arrives as a new employee at his station.",
    "homepage": "",
    "revenue": 90574188,
    "video": false,
    "watched": true,
    "poster_path": "/Rdzsh3s6waplhSD7PUaBJovB7v.jpg",
    "backdrop_path": "/5iHPV6M6aPKxXv3w8LTxsD6Zeot.jpg",
    "runtime": 95,
    "title": "Anchorman: The Legend of Ron Burgundy",
    "belongs_to_collection": {
      "name": "Anchorman Collection",
      "poster_path": "/xjnbrB93Vj5yGYwU0uuW8Tu2qoc.jpg",
      "id": 93791,
      "backdrop_path": "/eUU6edsZcr7I0AO8rHcB3vQwcOH.jpg"
    },
    "vote_average": 6.712
  },
  {
    "id": 881,
    "imdb_id": "tt0104257",
    "production_companies": [
      {
        "name": "David Brown Productions",
        "origin_country": "",
        "logo_path": null,
        "id": 903
      }
    ],
    "belongs_to_collection": null,
    "original_title": "A Few Good Men",
    "genres": [
      {
        "name": "Drama",
        "id": 18
      }
    ],
    "title": "A Few Good Men",
    "watched": true,
    "overview": "When cocky military lawyer Lt. Daniel Kaffee and his co-counsel, Lt. Cmdr. JoAnne Galloway, are assigned to a murder case, they uncover a hazing ritual that could implicate high-ranking officials such as shady Col. Nathan Jessep.",
    "budget": 40000000,
    "backdrop_path": "/H40nWdJngUc6gtytMAbElm9HOu.jpg",
    "revenue": 243240178,
    "poster_path": "/rLOk4z9zL1tTukIYV56P94aZXKk.jpg",
    "popularity": 24.499,
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "tagline": "In the heart of the nation's capital, in a courthouse of the U.S. government, one man will stop at nothing to keep his honor, and one will stop at nothing to find the truth.",
    "vote_average": 7.514,
    "status": "Released",
    "release_date": "1992-12-11",
    "runtime": 138,
    "vote_count": 3081,
    "adult": false,
    "original_language": "en",
    "spoken_languages": [
      {
        "english_name": "English",
        "name": "English",
        "iso_639_1": "en"
      },
      {
        "english_name": "French",
        "name": "Français",
        "iso_639_1": "fr"
      }
    ],
    "video": false,
    "homepage": "http://www.sonypictures.com/movies/afewgoodmen/"
  },
  {
    "id": 91586,
    "watched": true,
    "original_title": "Insidious: Chapter 2",
    "imdb_id": "tt2226417",
    "vote_average": 6.667,
    "tagline": "It will take what you love most.",
    "revenue": 161000000,
    "homepage": "http://www.insidiousch2.com/",
    "belongs_to_collection": {
      "id": 228446,
      "name": "Insidious Collection",
      "backdrop_path": "/5FrPZHgbbmTIq0oxpwSGqu5HyXC.jpg",
      "poster_path": "/w1213HKk1XKSwHiBgjkWghn9biC.jpg"
    },
    "overview": "The haunted Lambert family seeks to uncover the mysterious childhood secret that has left them dangerously connected to the spirit world.",
    "title": "Insidious: Chapter 2",
    "spoken_languages": [
      {
        "name": "English",
        "english_name": "English",
        "iso_639_1": "en"
      }
    ],
    "runtime": 106,
    "adult": false,
    "release_date": "2013-09-12",
    "production_companies": [
      {
        "logo_path": "/auaadhBBcvvTDtmW2iJzOrEjfgO.png",
        "name": "FilmDistrict",
        "origin_country": "US",
        "id": 7263
      },
      {
        "origin_country": "US",
        "name": "Blumhouse Productions",
        "id": 3172,
        "logo_path": "/kDedjRZwO8uyFhuHamomOhN6fzG.png"
      },
      {
        "origin_country": "US",
        "id": 11341,
        "logo_path": "/xytTBODEy3p20ksHL4Ftxr483Iv.png",
        "name": "Stage 6 Films"
      },
      {
        "id": 8147,
        "logo_path": "/q6HOAdSNgCbeOqwoMVRc6REgbXF.png",
        "origin_country": "CA",
        "name": "Entertainment One"
      },
      {
        "id": 2514,
        "origin_country": "CA",
        "name": "Alliance Films",
        "logo_path": "/zEyrFF8Nn325PXG0Q9j7my0JqIJ.png"
      }
    ],
    "video": false,
    "status": "Released",
    "original_language": "en",
    "backdrop_path": "/fgQAPS9LwdW7zIdHZpgIvbV64Yu.jpg",
    "vote_count": 3743,
    "budget": 5000000,
    "poster_path": "/w5JjiB3O1CLDXbTJe1QpU5RHmlU.jpg",
    "popularity": 39.405,
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "genres": [
      {
        "name": "Horror",
        "id": 27
      },
      {
        "name": "Thriller",
        "id": 53
      }
    ]
  },
  {
    "id": 9398,
    "vote_average": 6.199,
    "revenue": 60780981,
    "tagline": "3% Body Fat. 1% Brain Activity.",
    "original_language": "en",
    "release_date": "2001-09-28",
    "production_countries": [
      {
        "name": "Germany",
        "iso_3166_1": "DE"
      },
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "original_title": "Zoolander",
    "belongs_to_collection": {
      "id": 352789,
      "name": "Zoolander Collection",
      "backdrop_path": "/xNTvMy84w8wnrEEzWBiTWL08fVo.jpg",
      "poster_path": "/a53tBdjpma78xibq2OGJpMxhrNE.jpg"
    },
    "watched": true,
    "genres": [
      {
        "id": 35,
        "name": "Comedy"
      }
    ],
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
      }
    ],
    "budget": 28000000,
    "poster_path": "/qdrbSneHZjJG2Dj0hhBxzzAo4HB.jpg",
    "backdrop_path": "/n7EH9nyYzQfAD4j6599fFWuQxDG.jpg",
    "vote_count": 3980,
    "overview": "Clear the runway for Derek Zoolander, VH1's three-time male model of the year. His face falls when hippie-chic Hansel scooters in to steal this year's award. The evil fashion guru Mugatu seizes the opportunity to turn Derek into a killing machine. It's a well-designed conspiracy and only with the help of Hansel and a few well-chosen accessories like Matilda can Derek make the world safe for male models everywhere.",
    "popularity": 18.326,
    "video": false,
    "runtime": 90,
    "status": "Released",
    "imdb_id": "tt0196229",
    "title": "Zoolander",
    "production_companies": [
      {
        "id": 2933,
        "name": "Tenth Planet Productions",
        "origin_country": "",
        "logo_path": null
      },
      {
        "logo_path": "/gz66EfNoYPqHTYI4q9UEN4CbHRc.png",
        "id": 4,
        "name": "Paramount",
        "origin_country": "US"
      },
      {
        "name": "Village Roadshow Pictures",
        "id": 79,
        "logo_path": "/tpFpsqbleCzEE2p5EgvUq6ozfCA.png",
        "origin_country": "US"
      },
      {
        "origin_country": "",
        "name": "VH1 Television",
        "id": 10692,
        "logo_path": null
      },
      {
        "origin_country": "US",
        "id": 172,
        "logo_path": null,
        "name": "NPV Entertainment"
      },
      {
        "name": "Scott Rudin Productions",
        "id": 258,
        "logo_path": null,
        "origin_country": "US"
      },
      {
        "id": 21409,
        "origin_country": "DE",
        "name": "MFP Munich Film Partners GmbH & Company I. Produktions KG",
        "logo_path": null
      },
      {
        "name": "Red Hour",
        "logo_path": "/4uLKLjGivVg2YnAIhAn8k7ZuVFj.png",
        "origin_country": "US",
        "id": 2932
      }
    ],
    "homepage": "",
    "adult": false
  },
  {
    "id": 95,
    "original_title": "Armageddon",
    "runtime": 151,
    "status": "Released",
    "popularity": 33.765,
    "belongs_to_collection": null,
    "backdrop_path": "/sODk4VuMTt8S56zYFOr1Kx8BFqu.jpg",
    "production_companies": [
      {
        "id": 9195,
        "origin_country": "US",
        "name": "Touchstone Pictures",
        "logo_path": "/ou5BUbtulr6tIt699q6xJiEQTR9.png"
      },
      {
        "name": "Jerry Bruckheimer Films",
        "id": 130,
        "logo_path": "/c9dVHPOL3cqCr2593Ahk0nEKTEM.png",
        "origin_country": "US"
      },
      {
        "id": 11533,
        "logo_path": "/tWM9pmzVYxok4GbQIttxdcml1yT.png",
        "name": "Valhalla Motion Pictures",
        "origin_country": "US"
      }
    ],
    "vote_average": 6.824,
    "watched": false,
    "homepage": "",
    "vote_count": 7144,
    "release_date": "1998-07-01",
    "imdb_id": "tt0120591",
    "revenue": 553799566,
    "original_language": "en",
    "spoken_languages": [
      {
        "name": "English",
        "iso_639_1": "en",
        "english_name": "English"
      },
      {
        "english_name": "Russian",
        "iso_639_1": "ru",
        "name": "Pусский"
      }
    ],
    "overview": "When an asteroid threatens to collide with Earth, NASA honcho Dan Truman determines the only way to stop it is to drill into its surface and detonate a nuclear bomb. This leads him to renowned driller Harry Stamper, who agrees to helm the dangerous space mission provided he can bring along his own hotshot crew. Among them is the cocksure A.J. who Harry thinks isn't good enough for his daughter, until the mission proves otherwise.",
    "budget": 140000000,
    "title": "Armageddon",
    "adult": false,
    "tagline": "The Earth's Darkest Day Will Be Man's Finest Hour",
    "production_countries": [
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "name": "Science Fiction",
        "id": 878
      },
      {
        "id": 12,
        "name": "Adventure"
      }
    ],
    "video": false,
    "poster_path": "/eTM3qtGhDU8cvjpoa6KEt5E2auU.jpg"
  },
  {
    "id": 96721,
    "poster_path": "/5akKFgS7eeXUw9rKTEujryKrH17.jpg",
    "imdb_id": "tt1979320",
    "title": "Rush",
    "runtime": 123,
    "genres": [
      {
        "name": "Drama",
        "id": 18
      },
      {
        "id": 28,
        "name": "Action"
      }
    ],
    "watched": false,
    "video": false,
    "vote_count": 6433,
    "popularity": 25.408,
    "budget": 38000000,
    "belongs_to_collection": null,
    "backdrop_path": "/caKZWDGmv5iW2U99skHs75MmOmU.jpg",
    "vote_average": 7.709,
    "homepage": "",
    "production_companies": [
      {
        "id": 31922,
        "origin_country": "",
        "name": "Double Negative",
        "logo_path": null
      },
      {
        "origin_country": "US",
        "id": 11448,
        "logo_path": "/twhX9HMUuGW4Mhb45AyWDhRqkvR.png",
        "name": "Exclusive Media"
      },
      {
        "logo_path": "/rREvQNWAxkDfY9CDn2c5YxEMPdP.png",
        "name": "Cross Creek Pictures",
        "id": 10246,
        "origin_country": "US"
      },
      {
        "logo_path": null,
        "origin_country": "GB",
        "id": 163,
        "name": "Revolution Films"
      },
      {
        "origin_country": "GB",
        "name": "Working Title Films",
        "logo_path": "/16KWBMmfPX0aJzDExDrPxSLj0Pg.png",
        "id": 10163
      },
      {
        "name": "Imagine Entertainment",
        "id": 23,
        "logo_path": "/bJOFo2ufq7iFC1F4qZm8aLxF5aS.png",
        "origin_country": "US"
      },
      {
        "logo_path": "/8lvHyhjr8oUKOOy2dKXoALWKdp0.png",
        "id": 33,
        "origin_country": "US",
        "name": "Universal Pictures"
      }
    ],
    "overview": "A biographical drama centered on the rivalry between Formula 1 drivers James Hunt and Niki Lauda during the 1976 Formula One motor-racing season.",
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English",
        "english_name": "English"
      },
      {
        "iso_639_1": "de",
        "name": "Deutsch",
        "english_name": "German"
      },
      {
        "english_name": "Italian",
        "name": "Italiano",
        "iso_639_1": "it"
      },
      {
        "english_name": "French",
        "name": "Français",
        "iso_639_1": "fr"
      }
    ],
    "tagline": "Everyone's driven by something.",
    "original_language": "en",
    "original_title": "Rush",
    "adult": false,
    "revenue": 90247624,
    "status": "Released",
    "production_countries": [
      {
        "name": "Germany",
        "iso_3166_1": "DE"
      },
      {
        "name": "United Kingdom",
        "iso_3166_1": "GB"
      },
      {
        "name": "United States of America",
        "iso_3166_1": "US"
      }
    ],
    "release_date": "2013-09-02"
  }
]
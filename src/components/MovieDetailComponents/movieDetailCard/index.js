import React, { useState, useEffect } from 'react';  // Grouped import statements
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const MovieDetailCard = ({ movie }) => {  // Destructuring the movie prop
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState({}); 

  useEffect(() => {
    // You might want to check if 'movie' exists before accessing its properties
    if (movie && movie.credits) {
      setCast(movie.credits.filter((credit) => credit.character));
      setDirector(movie.credits.find((credit) => credit.job === 'Director'));
      console.log(movie.credits);
    }
  }, []);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CardMedia component="img" height="300" src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {movie.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {/* Director: {movie.credits ? movie.credits.find((credit) => credit.job === 'Director').name : null} */}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {cast.map((castMember) => castMember.name + ' as ' +castMember.character) .join(', ')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieDetailCard;

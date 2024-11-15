import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Card, Link, Grid, Divider, Avatar} from '@mui/material';
import { getTVReviews } from '../../../api/TMDBAPI';
import { dateReadableFormatter } from '../../../utils';


const TVReviewSection = ({ tvId }) => {
  const [reviewPage, setReviewPage] = useState(1);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!tvId) return;
    getTVReviews(tvId, reviewPage).then((reviews) => {
      setReviews(reviews || []);
    });
  }, [tvId, reviewPage]);
  

  if(reviews && reviews.length === 0) return (
    <Container>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        No Reviews
      </Typography>
    </Container>
  );

  return (

    <Container>
      {reviews.map((review) => (
        <div key={review.id}>
          <Grid container spacing={2} sx={{marginTop:'.5em', marginBottom:'.5em'}}>

                    <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={review.author} src={`https://image.tmdb.org/t/p/w200/${review.author_details.avatar_path}`} sx={{marginRight:'1em'}}/>
            <Link href={`https://www.themoviedb.org/u/${review.author_details.username}`}>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {review.author}
            </Typography>
            </Link>
            </Grid>

            <Grid item xs={3} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <Typography variant="subtitle2" color="text.secondary" component="div">
                {dateReadableFormatter(review.created_at)}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            {review.content}
          </Typography>
          <Divider sx={{marginTop:'1em'}}/>
        </div>
      ))}
    </Container>
  );
};

export default TVReviewSection;

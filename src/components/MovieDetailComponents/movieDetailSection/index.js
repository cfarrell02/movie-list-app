import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Stack, Chip, Divider, List, ListItem, ListItemText, Paper, Rating} from '@mui/material';

const MovieDetailSection = ({ movie }) => {
    const [genres, setGenres] = useState([]);
    const [cast, setCast] = useState([]);

    useEffect(() => {
        if(!movie || !movie.genres ) return;
        setGenres(movie.genres);
        setCast(movie.credits.cast);
    }, [movie]);

    console.log(movie);
    return (
        <Container>
            <Stack direction="row" spacing={2} sx={{ marginTop: '1em', marginBottom: '2em' }} justifyContent="center">
                {genres.map((genre) => (
                        <Chip key={genre.id} label={genre.name} />
                ))}    
            </Stack>
            <Typography variant="body1" sx={{ marginTop: '1em' }}>
                {movie.overview}
            </Typography>
            <Typography variant="h4" sx={{ marginTop: '1em' }}>
                Details
            </Typography>
            <Divider sx={{ marginBottom: '1em' }} />
            <List sx={{ width: '100%'}}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                <ListItem>
                    <ListItemText primary="Release Date" secondary={new Date(movie.release_date).toLocaleDateString()} />
                </ListItem> </Grid>
                <Grid item xs={3}>
                <ListItem>
                    <ListItemText primary="Runtime" secondary={movie.runtime + " minutes"} />
                </ListItem> </Grid>
                <Grid item xs={3}>
                <ListItem>
                    <ListItemText primary="Budget" secondary={"$" + new Intl.NumberFormat('en-US').format(movie.budget)} />
                </ListItem> </Grid>
                <Grid item xs={3}>
                <ListItem>
                    <ListItemText primary="Revenue" secondary={"$" + new Intl.NumberFormat('en-US').format(movie.revenue)} />
                </ListItem> </Grid>

                                    <Grid container justifyContent="center">
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="subtitle1" sx={{ marginTop: '2em' }}>
                                Vote Average
                            </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="subtitle2" color='text.secondary' >
                                {movie.vote_count} votes
                            </Typography>
                            </Grid>
                    <Grid item xs={12} title = {movie.vote_average + "/10"}>
                        <ListItem sx={{ display: 'flex', justifyContent: 'center' }}  >
      
                        <Rating
                            name="Vote Average"
                            value={movie.vote_average / 2}
                            precision={0.1}
                            readOnly
                        />
                        </ListItem>
                    </Grid>
                    </Grid>

                </Grid>
            </List>
            <Typography variant="h4" sx={{ marginTop: '1em' }}>
                Cast
            </Typography>
            <Divider sx={{ marginBottom: '1em' }} />
            <Paper elevation={3} sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: '65em', overflowY: 'scroll' }}>
            <List sx={{ width: '100%', overflowY: 'scroll' }}>
            <Grid container spacing={2}>
                {cast.map((castMember) => (
                    <Grid item xs={6} md={4} key={castMember.id}>
                    <ListItem key={castMember.id}>
                        <ListItemText primary={castMember.name} secondary={castMember.character} />
                    </ListItem>
                    </Grid>	
                ))}
            </Grid>
            </List>
            </Paper>

            
                    </Container>
    );
};

export default MovieDetailSection;
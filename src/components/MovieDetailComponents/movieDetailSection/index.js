import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Stack, Chip, Divider, List, ListItem, ListItemText, Paper, Rating, ListItemButton, Avatar, ListItemAvatar} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MovieDetailSection = ({ movie }) => {
    const [genres, setGenres] = useState([]);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(!movie || !movie.genres ) return;
        setGenres(movie.genres);
        setCast(movie.credits.cast);
        const newCrew = []
        movie.credits.crew.forEach(element => {
            const corresondingCrew = newCrew.find((crew) => crew.id === element.id);
            const clonedElement = JSON.parse(JSON.stringify(element)); // Deep copy
            if(!corresondingCrew){ newCrew.push(clonedElement);}
            else{
                newCrew[newCrew.indexOf(corresondingCrew)].job += ", " + element.job;
            }
        });
        setCrew(newCrew);

    }, [movie]);


    return (
        <Container>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '1em', marginBottom: '2em' }} justifyContent="center">
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
                <Grid container spacing={2} sx = {{ display: 'flex', justifyContent: 'center'}}>
                    {movie.release_date ? (
                    <Grid item sm={6} md={3}>
                        <ListItem>
                            <ListItemText primary="Release Date" secondary={new Date(movie.release_date).toLocaleDateString()} />
                        </ListItem> 
                    </Grid> ): ''}
                    {movie.runtime ? (
                    <Grid item sm={6} md={3}>
                        <ListItem>
                            <ListItemText primary="Runtime" secondary={movie.runtime + " minutes"} />
                        </ListItem> 
                    </Grid> ): ''}
                    {movie.budget ? (
                    <Grid item  sm={6} md={3}>
                        <ListItem>
                            <ListItemText primary="Budget" secondary={"$" + new Intl.NumberFormat('en-US').format(movie.budget)} />
                        </ListItem> 
                    </Grid> ):''}
                    {movie.revenue ? (
                    <Grid item sm={6} md={3}>
                        <ListItem>
                            <ListItemText primary="Revenue" secondary={"$" + new Intl.NumberFormat('en-US').format(movie.revenue)} />
                        </ListItem> 
                    </Grid> ):''}

                    <Grid container justifyContent="center">
                        {movie.vote_count ? ( <>
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
                        </> ):''}
                    </Grid>
                    
                </Grid>
            </List>
            <Typography variant="h4" sx={{ marginTop: '1em' }}>
                Cast
            </Typography>
            <Divider sx={{ marginBottom: '1em' }} />
            <Paper elevation={1} sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: '30em', overflowY: 'scroll' }}>
                <List sx={{ width: '100%', overflowY: 'scroll' }}>
                    <Grid container spacing={2}>
                        {cast.map((castMember) => (
                            <Grid item xs={12} sm={6} md={4} key={castMember.id}>
                                <ListItemButton onClick={() => navigate("/person/" + castMember.id)}>
                                    <ListItem key={castMember.id}>
                                        <ListItemAvatar>
                                            <Avatar alt={castMember.name} src={"https://image.tmdb.org/t/p/w200" + castMember.profile_path} />
                                        </ListItemAvatar>
                                        <ListItemText primary={castMember.name} secondary={castMember.character} />
                                    </ListItem>
                                </ListItemButton>
                            </Grid>	
                        ))}
                    </Grid>
                </List>
            </Paper>
            <Typography variant="h4" sx={{ marginTop: '1em' }}>
                Crew
            </Typography>
            <Divider sx={{ marginBottom: '1em' }} />
            <Paper elevation={1} sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: '30em', overflowY: 'scroll' }}>
                <List sx={{ width: '100%', overflowY: 'scroll' }}>
                    <Grid container spacing={2}>
                        {crew.map((crewMember) => (
                            <Grid item xs={12} sm={6} md={4} key={crewMember.id}>
                                <ListItemButton onClick={() => navigate("/person/" + crewMember.id)}>
                                    <ListItem key={crewMember.id}>
                                        <ListItemAvatar>
                                            <Avatar alt={crewMember.name} src={"https://image.tmdb.org/t/p/w200" + crewMember.profile_path} />
                                        </ListItemAvatar>
                                        <ListItemText primary={crewMember.name} secondary={crewMember.job} />
                                    </ListItem>
                                </ListItemButton>
                            </Grid>	
                        ))}
                    </Grid>
                </List>
            </Paper>
        </Container>
    );
};

export default MovieDetailSection;
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Stack, Chip, Divider, List, ListItem, ListItemText, Paper, Rating, ListItemButton, Avatar, ListItemAvatar} from '@mui/material';

const TVDetailSection = ({ tvShow }) => {
    const [genres, setGenres] = useState([]);
    const [cast, setCast] = useState([]);
    const [episodeCount, setEpisodeCount] = useState(0);


    useEffect(() => {
        if(!tvShow || !tvShow.genres ) return;
        setGenres(tvShow.genres);
        setCast(tvShow.credits);
        const episodeCount = tvShow.seasons.reduce((acc, season) => acc + (season.name !== 'Specials' ? season.episode_count : 0), 0);
        setEpisodeCount(episodeCount);

    }, [tvShow]);


    return (
        <Container>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '1em', marginBottom: '2em' }} justifyContent="center">
            {genres.map((genre) => (
                        <Chip key={genre.id} label={genre.name} />
                ))}    
            </Stack>
            <Typography variant="body1" sx={{ marginTop: '1em' }}>
                {tvShow.overview}
            </Typography>
            <Typography variant="h4" sx={{ marginTop: '1em' }}>
                Details
            </Typography>
            <Divider sx={{ marginBottom: '1em' }} />
            <List sx={{ width: '100%'}}>
            <Grid container spacing={2} sx = {{ display: 'flex', justifyContent: 'center'}}>
            {tvShow.first_air_date ? (
                    <Grid item sm={6} md={3}>
                        <ListItem>
                            <ListItemText primary="First aired on" secondary={new Date(tvShow.first_air_date).toLocaleDateString()} />
                        </ListItem> 
                    </Grid> ): ''}
                    {tvShow.last_air_date ? (
                    <Grid item sm={6} md={3}>
                        <ListItem>
                        <ListItemText primary="Last aired on" secondary={new Date(tvShow.last_air_date).toLocaleDateString()} />
                        </ListItem> 
                    </Grid> ): 
                    <Grid item sm={6} md={3}>
                        <ListItem>
                        <ListItemText primary="Status" secondary={tvShow.status} />
                        </ListItem>
                    </Grid>}
                    
                    {tvShow.seasons ? (
                    <Grid item sm={6} md={3}>
                        <ListItem>
                            <ListItemText primary="Seasons" secondary={tvShow.seasons.length} />
                        </ListItem> 
                    </Grid> ):''}
                    {episodeCount ? (
                    <Grid item sm={6} md={3}>
                        <ListItem>
                            <ListItemText primary="Episodes" secondary={episodeCount} />
                        </ListItem> 
                    </Grid> ):''}

                    <Grid container justifyContent="center">
                        {tvShow.vote_count ? ( <>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="subtitle1" sx={{ marginTop: '2em' }}>
                                Vote Average
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="subtitle2" color='text.secondary' >
                                {tvShow.vote_count} votes
                            </Typography>
                        </Grid>
                                                <Grid item xs={12} title = {tvShow.vote_average + "/10"}>
                            <ListItem sx={{ display: 'flex', justifyContent: 'center' }}  >
                                <Rating
                                    name="Vote Average"
                                    value={tvShow.vote_average / 2}
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
                                <ListItemButton to={"/person/" + castMember.id} component="a">
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
        </Container>
    );
};

export default TVDetailSection;
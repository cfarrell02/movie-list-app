import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Card, Alert, Grid, Divider, List, ListItem, ListItemText, ListItemButton, ListItemAvatar, Avatar} from '@mui/material';
import { getMovieReviews } from '../../../api/TMDBAPI';
import { dateReadableFormatter } from '../../../utils';


const PersonCreditsSection = ({ person }) => {
  const [credits, setCredits] = useState([]);
  const [tvCredits, setTVCredits] = useState([]);
  const [crew ,setCrew] = useState([]);

  useEffect(() => {
    if (!person || !person.credits) return;

    setCredits(person.credits);
    setTVCredits(person.tvCredits);

    const newCrew = [];

    person.credits.crew.forEach(element => {
        const correspondingCrew = newCrew.find(crew => crew.id === element.id);

        const clonedElement = JSON.parse(JSON.stringify(element)); // Deep copy

        if (!correspondingCrew) {
            newCrew.push(clonedElement);
        } else {
            newCrew[newCrew.indexOf(correspondingCrew)].job += ", " + clonedElement.job;
        }
    });

    setCrew(newCrew);
}, [person]);



return (
    <Container>
        {credits.cast && credits.cast.length > 0 ? (
            <>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Movie Credits
                </Typography>
                <Divider />
                <List sx={{ maxHeight: '30em', overflowY: 'scroll' }}>
                    <Grid container spacing={2} sx={{ marginTop: '.5em', marginBottom: '.5em' }}>
                        {credits.cast
                            .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                            .map((credit) => (
                                <Grid item xs={12} sm={6} md={3} key={credit.id}>
                                    <ListItemButton to={`/movie/${credit.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                                        <ListItem key={credit.id}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={credit.title}
                                                    src={`https://image.tmdb.org/t/p/w200/${credit.poster_path}`}
                                                    variant="rounded"
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={credit.title + (credit.release_date ? (' (' + new Date(credit.release_date).getFullYear() + ')'):'')}
                                                secondary={credit.character}
                                            />
                                        </ListItem>
                                    </ListItemButton>
                                </Grid>
                            ))}
                    </Grid>
                </List>
            </>
        ) : null}

        {tvCredits.cast && tvCredits.cast.length > 0 ? (
            <>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    TV Credits
                </Typography>
                <Divider />
                <List sx={{ maxHeight: '30em', overflowY: 'scroll' }}>
                    <Grid container spacing={2} sx={{ marginTop: '.5em', marginBottom: '.5em' }}>
                        {tvCredits.cast
                            .sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date))
                            .map((credit) => (
                                <Grid item xs={12} sm={6} md={3} key={credit.id}>
                                    <ListItemButton to={`/tvshow/${credit.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                                        <ListItem key={credit.id}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={credit.name}
                                                    src={`https://image.tmdb.org/t/p/w200/${credit.poster_path}`}
                                                    variant="rounded"
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={credit.name + (credit.first_air_date ? (' (' + new Date(credit.first_air_date).getFullYear() + ')'):'')}
                                                secondary={credit.character}
                                            />
                                        </ListItem>
                                    </ListItemButton>
                                </Grid>
                            ))}
                    </Grid>
                </List>
            </>
        ) : null}

        {crew && crew.length > 0 ? (
            <>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Film Crew Credits
                </Typography>
                <Divider />
                <List sx={{ maxHeight: '30em', overflowY: 'scroll' }}>
                    <Grid container spacing={2} sx={{ marginTop: '.5em', marginBottom: '.5em' }}>
                        {crew
                            .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                            .map((credit) => (
                                <Grid item xs={12} sm={6} md={3} key={credit.id}>
                                    <ListItemButton to={`/movie/${credit.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                                        <ListItem key={credit.id}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={credit.title}
                                                    src={`https://image.tmdb.org/t/p/w200/${credit.poster_path}`}
                                                    variant="rounded"
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={credit.title + (credit.release_date?(' (' + new Date(credit.release_date).getFullYear() + ')'):'')}
                                                secondary={credit.job}
                                            />
                                        </ListItem>
                                    </ListItemButton>
                                </Grid>
                            ))}
                    </Grid>
                </List>
            </>
        ) : null}

        {tvCredits.crew && tvCredits.crew.length > 0 ? (
            <>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    TV Crew Credits
                </Typography>
                <Divider />
                <List sx={{ maxHeight: '30em', overflowY: 'scroll' }}>
                    <Grid container spacing={2} sx={{ marginTop: '.5em', marginBottom: '.5em' }}>
                        {tvCredits.crew
                            .sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date))
                            .map((credit) => (
                                <Grid item xs={12} sm={6} md={3} key={credit.id}>
                                    <ListItemButton to={`/movie/${credit.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                                        <ListItem key={credit.id}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={credit.name}
                                                    src={`https://image.tmdb.org/t/p/w200/${credit.poster_path}`}
                                                    variant="rounded"
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={credit.name + (credit.first_air_date?(' (' + new Date(credit.first_air_date).getFullYear() + ')'):'')}
                                                secondary={credit.job}
                                            />
                                        </ListItem>
                                    </ListItemButton>
                                </Grid>
                            ))}
                    </Grid>
                </List>
            </>
        ) : null}
    </Container>
);};

export default PersonCreditsSection;

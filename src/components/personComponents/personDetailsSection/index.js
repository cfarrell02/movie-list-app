import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Stack, Chip, Divider, List, ListItem, ListItemText, Paper, Rating} from '@mui/material';

const PersonDetailsSection = ({ person }) => {
    const [alternateNames, setAlternateNames] = useState([]);
    const fillerText = `It appears we don't have a biography for ${person.name}. Please contact the TMDB team to add one.`;

    useEffect(() => {
        const fetchData = async () => {
            if(!person || !person.also_known_as) return;
            setAlternateNames(person.also_known_as);
        }
        fetchData();
    }, [person]);


    return (
        <Container>
            {alternateNames.length > 0 ? (
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    marginTop: '2em',
                    marginBottom: '3em',
                    justifyContent: 'center',
                    width: '100%',
                    overflowX: 'scroll',
                }}
            >
                {alternateNames.map((name, index) => (
                    <Chip key={index} label={name} />
                ))}
            </Stack>
            ) : ''}
            <Typography variant="body1" sx={{ marginTop: '1em' }}>
                {person.biography ? person.biography : <em>{fillerText}</em>}
            </Typography>
        </Container>
    );
};

export default PersonDetailsSection;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { getPerson, getPersonMovies, getPersonTV, getPersonImages, getPersonTaggedImages } from '../../api/TMDBAPI';
import PersonCreditsSection from '../../components/personComponents/personCreditsSection';
import { SiteDataContext } from '../../contexts/siteDataContext';
import MediaDisplay from '../../components/mediaDisplay';
import { AdultContentNotice, DetailHero, DetailHeroSkeleton, ExternalLinks, FactGrid, Section, hasValue } from '../../components/detail';
import { ageFormatter, filterAdult } from '../../utils';

const Biography = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    if (!text) return null;
    const long = text.length > 700;
    return (
        <Box>
            <Typography
                sx={{
                    whiteSpace: 'pre-line',
                    lineHeight: 1.7,
                    maxWidth: 820,
                    ...(!expanded && long ? { display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}),
                }}
            >
                {text}
            </Typography>
            {long && (
                <Button size="small" onClick={() => setExpanded(!expanded)} sx={{ px: 0, mt: 0.5 }}>
                    {expanded ? 'Show less' : 'Read more'}
                </Button>
            )}
        </Box>
    );
};

const PersonPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [person, setPerson] = useState(null);
    const [blocked, setBlocked] = useState(false);
    const { adultContent } = React.useContext(SiteDataContext);
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        const fetchData = async () => {
            setLoading(true);
            setBlocked(false);
            try {
                const [details, movieCredits, tvCredits, images, taggedImages] = await Promise.all([
                    getPerson(id),
                    getPersonMovies(id),
                    getPersonTV(id),
                    getPersonImages(id),
                    getPersonTaggedImages(id),
                ]);
                if (!active) return;
                // If the person is adult only and the user has adult content disabled, redirect to home
                if (!adultContent && details.adult) {
                    setBlocked(true);
                    return;
                }
                setPerson({
                    ...details,
                    credits: movieCredits,
                    tvCredits,
                    images: { profiles: [...(images.profiles || []), ...(taggedImages.results || [])].filter((img, i, all) => all.findIndex((o) => o.file_path === img.file_path) === i) },
                });
                window.scrollTo(0, 0);
            } catch (error) {
                console.error(error);
                if (active) navigate('/404', { replace: true });
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchData();
        return () => {
            active = false;
        };
    }, [id, adultContent, navigate]);

    if (blocked) return <AdultContentNotice kind="person" />;
    if (loading || !person) return <DetailHeroSkeleton />;

    const age = person.birthday ? ageFormatter(person.birthday) : null;
    const tmdbSlug = `${person.id}-${person.name.replace(/\s/g, '-')}`;
    const facts = [
        { label: 'Born', value: person.birthday && new Date(person.birthday).toLocaleDateString() },
        { label: person.deathday ? 'Died' : 'Age', value: person.deathday ? new Date(person.deathday).toLocaleDateString() : age },
        { label: 'Birthplace', value: person.place_of_birth },
        { label: 'Known for', value: person.known_for_department },
    ];
    const hasCredits = [person.credits?.cast, person.credits?.crew, person.tvCredits?.cast].some((list) => filterAdult(list, adultContent).length > 0);

    return (
        <>
            <DetailHero
                posterPath={person.profile_path}
                round
                title={person.name}
                meta={[person.known_for_department, person.place_of_birth]}
                chips={(person.also_known_as || []).slice(0, 4)}
                actions={
                    <ExternalLinks
                        links={[
                            { label: 'IMDb', href: person.imdb_id && `https://www.imdb.com/name/${person.imdb_id}` },
                            { label: 'TMDB', href: `https://www.themoviedb.org/person/${tmdbSlug}` },
                        ]}
                    />
                }
            />
            <Container maxWidth="lg" sx={{ pb: 4 }}>
                <Stack>
                    {(facts.some((f) => hasValue(f.value)) || person.biography) && (
                        <Section title="About">
                            <Stack spacing={3}>
                                <FactGrid facts={facts} />
                                {person.biography && <Biography text={person.biography} />}
                            </Stack>
                        </Section>
                    )}
                    {hasCredits && (
                        <Section title="Credits">
                            <PersonCreditsSection person={person} />
                        </Section>
                    )}
                    {person.images.profiles.length > 0 && (
                        <Section title="Photos">
                            <MediaDisplay images={person.images.profiles} imageAspect="2 / 3" title={person.name} />
                        </Section>
                    )}
                </Stack>
            </Container>
        </>
    );
};

export default PersonPage;

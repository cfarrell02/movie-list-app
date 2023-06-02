import React, { useState } from 'react';
import { Container} from '@mui/material';
import LocationSearch from '../../components/locationSearch';


function HomePage() {



  return (
    <Container maxWidth="xl" sx={{ marginTop: '2rem' }}>
      <LocationSearch title="Search for a location" />
    </Container>
  );
}

export default HomePage;

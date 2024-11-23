import React, { useState } from 'react';
import { Button, Box } from '@mui/material';

const ShowMoreWrapper = ({ children, initialHeight = 100 }) => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <Box>
            <Box
                sx={{
                    height: showMore ? 'auto' : typeof initialHeight === 'number' ? `${initialHeight}px` : initialHeight,
                    overflow: 'hidden',
                }}
            >
                {children}
            </Box>
            <Button onClick={toggleShowMore}>
                {showMore ? 'Show Less' : 'Show More'}
            </Button>
        </Box>
    );
};

export default ShowMoreWrapper;
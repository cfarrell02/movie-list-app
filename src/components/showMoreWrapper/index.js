import React, { useState } from 'react';
import { Button, Box } from '@mui/material';

const ShowMoreWrapper = ({ children, initialCount = 3, parentComponent: ParentComponent = Box, parentComponentProps = {} }) => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    const hasMoreToShow = children.length > initialCount;

    const displayedChildren = hasMoreToShow ? showMore ? children : children.slice(0, initialCount) : children;

    return (
        <Box>
            <ParentComponent {...parentComponentProps}>
                {displayedChildren}
            </ParentComponent>
            {hasMoreToShow && (
                <Button onClick={toggleShowMore}>
                    {showMore ? 'Show Less' : 'Show More'}
                </Button>
            )}
        </Box>
    );
};

export default ShowMoreWrapper;

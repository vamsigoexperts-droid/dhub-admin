import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const BookingsIndex = () => {
    return (
        <Box>
            <Outlet />
        </Box>
    );
};

export default BookingsIndex;

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const ProfessionalOrders = () => {
    return (
        <Box>
            <Outlet />
        </Box>
    );
};

export default ProfessionalOrders;

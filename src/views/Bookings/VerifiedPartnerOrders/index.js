import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const VerifiedPartnerOrders = () => {
    return (
        <Box>
            <Outlet />
        </Box>
    );
};

export default VerifiedPartnerOrders;

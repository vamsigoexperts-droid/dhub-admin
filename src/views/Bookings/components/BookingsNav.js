import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Card, CardContent, Typography, styled } from '@mui/material';

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none',
    color: 'inherit',
    '&.active': {
        '& .status-card': {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light + '10',
            boxShadow: theme.shadows[4],
        },
    },
}));

const StatusCard = styled(Card)(({ theme }) => ({
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: `2px solid ${theme.palette.divider}`,
    '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: theme.shadows[6],
        transform: 'translateY(-4px)',
    },
}));

const BookingsNav = ({ statuses, counts = {} }) => {
    return (
        <Box sx={{ mb: 3 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: 1.5,
                    overflowX: 'auto',
                    pb: 1.5,
                    // Visible scroll track
                    '&::-webkit-scrollbar': { height: '6px' },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#e0f2f1',
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#009688',
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#00796b',
                    },
                    // Firefox
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#009688 #e0f2f1',
                }}
            >
                {statuses.map((status) => (
                    <Box key={status.key} sx={{ flex: 1, minWidth: '140px' }}>
                        <StyledNavLink to={status.route}>
                            <StatusCard className="status-card" elevation={2}>
                                <CardContent sx={{ textAlign: 'center', py: 2.5, px: 2, '&:last-child': { pb: 2.5 } }}>
                                    <Typography
                                        variant="h3"
                                        color={`${status.color}.main`}
                                        sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }}
                                    >
                                        {counts[status.key] || 0}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        color="textSecondary"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            lineHeight: 1.3,
                                            display: 'block',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {status.label}
                                    </Typography>
                                </CardContent>
                            </StatusCard>
                        </StyledNavLink>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default BookingsNav;


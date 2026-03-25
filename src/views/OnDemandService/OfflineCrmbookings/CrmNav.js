import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography, CardContent, Grid, styled, Card, CardActionArea } from '@mui/material';

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  '&.active': {
    '& .status-card': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light + '10',
    },
    '& .status-label': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
}));

const StatusCard = styled(Card)(({ theme }) => ({
  height: '50px',
  border: `2px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
}));

// Order status configurations
const orderStatusConfig = [
  // {
  //   key: 'pending',
  //   label: 'Pending',
  //   color: 'warning',
  //   route: '/ondemandservice/verified-partners-crm/pending',
  // },
  {
    key: 'accepted',
    label: 'Accepted',
    color: 'primary',
    route: '/ondemandservice/verified-partners-crm/accepted',
  },
  {
    key: 'AppointmentConfirmedByProvider',
    label: 'ConfirmedAppointments',
    color: 'info',
    route: '/ondemandservice/verified-partners-crm/appointmentconfirmed',
  },

  {
    key: 'work-in-progress',
    label: 'Work In Progress',
    color: 'info',
    route: '/ondemandservice/verified-partners-crm/work-in-progress',
  },
  {
    key: 'completed',
    label: 'Completed',
    color: 'success',
    route: '/ondemandservice/verified-partners-crm/completed',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    color: 'error',
    route: '/ondemandservice/verified-partners-crm/cancelled',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    color: 'error',
    route: '/ondemandservice/verified-partners-crm/rejected',
  },
  {
    key: 'missed',
    label: 'Missed',
    color: 'secondary',
    route: '/ondemandservice/verified-partners-crm/missed',
  },
    {
    key: 'Resheduled',
    label: 'Resheduled',
    color: 'secondary',
    route: '/ondemandservice/verified-partners-crm/appointmentrescheduled',
  },
];
const CrmNav = () => {
  return (
    <div>
      {/* Status Navigation Cards */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Order Status Navigation
        </Typography>
        <Grid container spacing={2}>
          {orderStatusConfig.map((status) => (
            <Grid item xs={12} sm={6} md={4} lg={12 / 7} key={status.key}>
              <StyledNavLink to={status.route} end>
                <StatusCard className="status-card">
                  <CardActionArea
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <CardContent
                      sx={{
                        textAlign: 'center',
                        py: 2,
                        px: 1.5,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        className="status-label"
                        sx={{
                          mb: 1,
                          fontSize: '0.875rem',
                          lineHeight: 1.2,
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          hyphens: 'auto',
                        }}
                      >
                        {status.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: '0.75rem',
                          lineHeight: 1.2,
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {status.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </StatusCard>
              </StyledNavLink>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default CrmNav;

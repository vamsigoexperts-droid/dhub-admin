import React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/logo.gif';
import AuthLogin from '../authForms/AuthLogin';

const Login = () => (
  <PageContainer title="Login" description="this is Login page">
    <Grid container spacing={0} sx={{ overflowX: 'hidden' }}>
      <Grid
        size={{ xs: 12, sm: 12, lg: 7, xl: 8 }}
        sx={{
          position: 'relative',
          height: '100vh',
        
        }}
      >
        <Box
          position="relative"
          sx={{
            height: '100%',
          }}
        >
          <Box
            sx={{
              display: {
                xs: 'none',
                lg: 'flex',
              },
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              backgroundImage: `url(${img1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '100%',
            }}
          />
        </Box>
      </Grid>
      <Grid
        size={{ xs: 12, sm: 12, lg: 5, xl: 4 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box p={4}>
          <AuthLogin
            title="Welcome to D-Hub"
            subtext={
              <Typography variant="subtitle1" color="textSecondary" mb={1}>
                Your Admin Dashboard
              </Typography>
            }
          />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

export default Login;

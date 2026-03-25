import React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/logo.gif';
import AuthChangePassword from '../authForms/AuthChangePassword';

const ChangePassword = () => (
  <PageContainer title="Forgot Password" description="this is Forgot Password page">
    <Grid container justifyContent="center" spacing={0} sx={{ overflowX: 'hidden' }}>
      <Grid
        size={{ xs: 12, sm: 12, lg: 8, xl: 8 }}
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
          <Typography variant="h4" fontWeight="700">
            Change Your Password
          </Typography>

          <Typography color="textSecondary" variant="subtitle2" fontWeight="400" mt={2}>
            Enter your new password below and confirm it to update your credentials.
          </Typography>

          <AuthChangePassword />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

export default ChangePassword;

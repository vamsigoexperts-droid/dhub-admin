import React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/logo.gif';
import AuthTwoSteps from '../authForms/AuthTwoSteps';

const TwoSteps = () => (
  <PageContainer title="Two Steps" description="this is Two Steps page">
    <Grid container spacing={0} justifyContent="center" sx={{ overflowX: 'hidden' }}>
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
            Two Step Verification
          </Typography>

          <Typography variant="subtitle1" color="textSecondary" mt={2} mb={1}>
            We sent a verification code to your mobile. Enter the code from the mobile in the field
            below.
          </Typography>
          <Typography variant="subtitle1" fontWeight="700" mb={1}>
            ******1234
          </Typography>
          <AuthTwoSteps />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

export default TwoSteps;

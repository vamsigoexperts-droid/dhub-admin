import React from 'react';
import { Grid2 as Grid, Box, Typography, Avatar, CardMedia, styled } from '@mui/material';
import profilecover from '../../../assets/images/elc1.gif';
import ProfileTab from './ProfileTab';
import BlankCard from '../../../components/shared/BlankCard';
import { URLS } from '../../../Url';

const ProfileBanner = ({ data }) => {
  const ProfileImage = styled(Box)(() => ({
    backgroundImage: 'linear-gradient(#50b2fc,#f44c66)',
    borderRadius: '50%',
    width: '110px',
    height: '110px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  }));

  return (
    <>
      <BlankCard>
        <CardMedia
          component="img"
          src={profilecover}
          sx={{
            borderRadius: 2,
            width: '100%',
            height: '290px',
            objectFit: 'cover',
          }}
        />
        <Grid container spacing={0}>
          <Grid
            sx={{
              order: {
                xs: '1',
                sm: '1',
                lg: '2',
              },
            }}
            size={{
              lg: 4,
              sm: 12,
              xs: 12,
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              textAlign="center"
              justifyContent="center"
              sx={{
                mt: '-85px',
                mb: 2,
              }}
            >
              <Box>
                <ProfileImage>
                  <Avatar
                    src={`${URLS.FileBase}${data.image}`}
                    alt={`${URLS.FileBase}${data.image}`}
                    sx={{
                      borderRadius: '50%',
                      width: '100px',
                      height: '100px',
                      border: '4px solid #fff',
                    }}
                  />
                </ProfileImage>
                <Box mt={1}>
                  <Typography fontWeight={600} variant="h5">
                    {data.name}
                  </Typography>
                  <Typography color="textSecondary" variant="h6" fontWeight={400}>
                    {data.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid
            sx={{
              order: {
                xs: '7',
                sm: '7',
                lg: '7',
              },
            }}
            size={{
              lg: 5,
              sm: 12,
              xs: 12,
            }}
          >
            <ProfileTab />
          </Grid>
        </Grid>
      </BlankCard>
    </>
  );
};

export default ProfileBanner;

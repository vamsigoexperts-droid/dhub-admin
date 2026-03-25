import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Typography,
  Stack,
  Grid,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import { IconArrowBackUp } from '@tabler/icons-react';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URLS } from '../../../Url';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'View Home Screen' }];

const ViewHomeScreenManagement = () => {
  const navigate = useNavigate();
  const [homeScreenData, setHomeScreenData] = useState(null);
  const [loading, setLoading] = useState(true);

  const homeScreenId = localStorage.getItem('homeScreenId');
  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const fetchHomeScreen = async () => {
    if (!homeScreenId) {
      toast.error('No Home Screen ID found');
      navigate(-1);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${URLS.GetSingleHomeScreen}/${homeScreenId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const base = res.data.baseUrl || URLS.FileBase;
        const d = res.data.data;
        setHomeScreenData({
          ...d,
          curvedImage1: d.curvedImage1 ? `${base}${d.curvedImage1}` : '',
          curvedImage2: d.curvedImage2 ? `${base}${d.curvedImage2}` : '',
          bannerImage: d.bannerImage ? `${base}${d.bannerImage}` : '',
        });
      } else {
        toast.warn('Home Screen not found');
      }
    } catch (error) {
      console.error('Error fetching home screen:', error);
      toast.error('Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeScreen();
  }, []);

  if (loading) {
    return (
      <PageContainer title="View Home Screen">
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (!homeScreenData) {
    return (
      <PageContainer title="View Home Screen">
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <Typography variant="h6">No Home Screen data found</Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="View Home Screen" description="View detailed information of a home screen">
      <Breadcrumb title="View Home Screen" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Back Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          startIcon={<IconArrowBackUp />}
        >
          Back
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Banner Image */}
        <Grid item xs={12} md={6}>
          <ParentCard title="Banner Image">
            {homeScreenData.bannerImage ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 300,
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: '1px solid #eee',
                }}
              >
                <img
                  src={homeScreenData.bannerImage}
                  alt="Banner"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            ) : (
              <Typography variant="body1" color="textSecondary" textAlign="center" py={6}>
                No banner image available
              </Typography>
            )}
          </ParentCard>
        </Grid>

        {/* Curved Images */}
        <Grid item xs={12} md={6}>
          <ParentCard title="Curved Images">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: '1px solid #eee',
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Curved Image 1
                  </Typography>
                  {homeScreenData.curvedImage1 ? (
                    <Avatar
                      src={homeScreenData.curvedImage1}
                      variant="rounded"
                      sx={{ width: '100%', height: 160 }}
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Not available
                    </Typography>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: '1px solid #eee',
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Curved Image 2
                  </Typography>
                  {homeScreenData.curvedImage2 ? (
                    <Avatar
                      src={homeScreenData.curvedImage2}
                      variant="rounded"
                      sx={{ width: '100%', height: 160 }}
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Not available
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </ParentCard>
        </Grid>

        {/* Title and Description */}
        {/* <Grid item xs={12}>
          <ParentCard title="Home Screen Details">
            <Stack spacing={2}>
              <Paper
                elevation={0}
                sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  Title
                </Typography>
                <Typography variant="body1">{homeScreenData.title || '-'}</Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {homeScreenData.description || '-'}
                </Typography>
              </Paper>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}
                  >
                    <Typography variant="subtitle2" color="textSecondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {new Date(homeScreenData.createdAt).toLocaleString() || '-'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}
                  >
                    <Typography variant="subtitle2" color="textSecondary">
                      Updated At
                    </Typography>
                    <Typography variant="body1">
                      {new Date(homeScreenData.updatedAt).toLocaleString() || '-'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Stack>
          </ParentCard>
        </Grid> */}
      </Grid>
    </PageContainer>
  );
};

export default ViewHomeScreenManagement;

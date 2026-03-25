import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Alert,
  Card,
  Skeleton,
} from '@mui/material';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';

import {
  IconArrowBackUp,
  IconInfoCircle,
  IconImageInPicture,
  IconCalendarEvent,
} from '@tabler/icons-react';

import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { URLS } from '../../Url';

const ViewBanner = () => {
  const { id } = useParams();
  const bannerId = id;

  const navigate = useNavigate();

  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch {
      return '';
    }
  };

  const token = getToken();

  // Fetch Banner
  const fetchBannerData = useCallback(async () => {
    if (!bannerId || !token) {
      toast.error('Invalid Banner ID or Authentication');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${URLS.GetOneCategoryBanner.replace(':id', bannerId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const d = res.data.data;

        setBannerData({
          ...d,
          serviceName: d.serviceId?.name || 'N/A',
          cityName: d.cityId?.name || 'N/A',
          zoneName: d.zoneId?.name || 'N/A',
          categoryName: d.categoryId?.name || 'N/A',
          bannerImage: d.bannerImage ? `${URLS.FileBase}${d.bannerImage}` : null,
        });
      } else {
        throw new Error(res.data.message || 'Failed to load banner');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [bannerId, token]);

  useEffect(() => {
    fetchBannerData();
  }, [fetchBannerData]);

  if (loading)
    return (
      <PageContainer title="View Banner">
        <Breadcrumb title="View Banner" />
        {[1, 2].map((i) => (
          <ParentCard key={i} title={<Skeleton width={200} />} sx={{ mb: 3 }}>
            <Skeleton variant="rounded" height={150} />
          </ParentCard>
        ))}
      </PageContainer>
    );

  if (error || !bannerData) {
    return (
      <PageContainer title="View Banner">
        <Breadcrumb title="View Banner" />
        <Alert
          severity="error"
          sx={{ mt: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchBannerData}>
              Retry
            </Button>
          }
        >
          {error || 'Unable to load banner'}
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="View Banner">
      <Breadcrumb title="View Banner" />
      <ToastContainer />

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h3">Banner Details</Typography>

        <Button
          variant="contained"
          startIcon={<IconArrowBackUp />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>

      {/* Basic Info */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconInfoCircle />
            <Typography variant="h5">Basic Information</Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>Service</Typography>
            <Typography color="text.secondary">
              {bannerData.serviceName}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>City</Typography>
            <Typography color="text.secondary">
              {bannerData.cityName}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>Zone</Typography>
            <Typography color="text.secondary">
              {bannerData.zoneName}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>Category</Typography>
            <Typography color="text.secondary">
              {bannerData.categoryName}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>Status</Typography>
            <Chip
              label={bannerData.status ? 'Active' : 'Inactive'}
              color={bannerData.status ? 'success' : 'error'}
            />
          </Grid>
        </Grid>
      </ParentCard>

      {/* Banner Image */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconImageInPicture />
            <Typography variant="h5">Banner Image</Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        {bannerData.bannerImage ? (
          <Box
            sx={{
              width: '300px',
              border: '2px solid',
              borderColor: 'primary.main',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <img
              src={bannerData.bannerImage}
              alt="Banner"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
          </Box>
        ) : (
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography>No Image Available</Typography>
          </Card>
        )}
      </ParentCard>

      {/* Dates */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconCalendarEvent />
            <Typography variant="h5">Timestamps</Typography>
          </Box>
        }
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>Created At</Typography>
            <Typography color="text.secondary">
              {new Date(bannerData.createdAt).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600}>Updated At</Typography>
            <Typography color="text.secondary">
              {bannerData.updatedAt
                ? new Date(bannerData.updatedAt).toLocaleString()
                : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewBanner;

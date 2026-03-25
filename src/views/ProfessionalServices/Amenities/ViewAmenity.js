import React, { useState, useEffect, useCallback } from 'react';
import { URLS } from 'src/Url';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Typography,
  Avatar,
  Chip,
  useTheme,
  CircularProgress,
  Divider,
  Card,
  CardMedia,
} from '@mui/material';
import { IconArrowBackUp, IconPhoto } from '@tabler/icons-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/amenities', title: 'Amenities' },
  { title: 'View Amenity' },
];

const ViewAmenity = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const [amenity, setAmenity] = useState({});
  const [loading, setLoading] = useState(true);

  const getToken = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.token || '' : '';
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token || !id) return;

    const fetchAmenity = async () => {
      try {
        const res = await axios.get(
          `${URLS.GetAmenityById}${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAmenity(res.data.amenity || res.data.data || {});
      } catch (error) {
        console.error('Failed to fetch amenity:', error);
        toast.error('Failed to load amenity details');
        navigate('/amenities');
      } finally {
        setLoading(false);
      }
    };

    fetchAmenity();
  }, [id, getToken, navigate]);

  if (loading) {
    return (
      <PageContainer title="View Amenity" description="Loading...">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    const normalizedPath = imagePath.replace(/\\/g, '/');
    return `${URLS.FileBase}${normalizedPath}`;
  };

  // Get category icon
  const categoryIcon =
    typeof amenity.categoryId === 'object' && amenity.categoryId?.icon
      ? getImageUrl(amenity.categoryId.icon)
      : null;

  return (
    <PageContainer title="View Amenity" description="View amenity details">
      <Breadcrumb title="View Amenity" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ py: 1 }}>
        <ParentCard
          title="Amenity Details"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={3} sx={{ p: 2 }}>
            {/* Category Icon Preview */}
            {/* <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Category Icon
                </Typography>
                {categoryIcon ? (
                  <Avatar
                    src={categoryIcon}
                    alt={
                      typeof amenity.categoryId === 'object'
                        ? amenity.categoryId.name
                        : 'Category'
                    }
                    sx={{ width: 100, height: 100, margin: '0 auto' }}
                    variant="rounded"
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      margin: '0 auto',
                      fontSize: '2rem',
                      bgcolor: theme.palette.secondary.main,
                    }}
                    variant="rounded"
                  >
                    {typeof amenity.categoryId === 'object' && amenity.categoryId?.name
                      ? amenity.categoryId.name.charAt(0).toUpperCase()
                      : 'C'}
                  </Avatar>
                )}
              </Box>
              <Divider sx={{ my: 3 }} />
            </Grid> */}

            {/* Amenity Title */}
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Amenity Title</CustomFormLabel>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
                {amenity.title || 'N/A'}
              </Typography>
            </Grid>

            {/* Service */}
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Service</CustomFormLabel>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
                {typeof amenity.serviceId === 'object' && amenity.serviceId?.name
                  ? amenity.serviceId.name
                  : amenity.serviceName || amenity.serviceId || 'N/A'}
              </Typography>
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Category</CustomFormLabel>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
                {typeof amenity.categoryId === 'object' && amenity.categoryId?.name
                  ? amenity.categoryId.name
                  : amenity.categoryName || amenity.categoryId || 'N/A'}
              </Typography>
            </Grid>

            {/* Subcategory */}
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Subcategory</CustomFormLabel>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
                {typeof amenity.subcategoryId === 'object' && amenity.subcategoryId?.name
                  ? amenity.subcategoryId.name
                  : amenity.subcategoryName || amenity.subcategoryId || 'N/A'}
              </Typography>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Status</CustomFormLabel>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={amenity.status === 'active' ? 'Active' : 'Inactive'}
                  color={amenity.status === 'active' ? 'success' : 'error'}
                  size="medium"
                />
              </Box>
            </Grid>

            {/* Created Date */}
            {amenity.createdAt && (
              <Grid item xs={12} sm={6} md={4}>
                <CustomFormLabel>Created Date</CustomFormLabel>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
                  {new Date(amenity.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Grid>
            )}

            {/* Description */}
            {amenity.description && (
              <Grid item xs={12}>
                <CustomFormLabel>Description</CustomFormLabel>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
                  {amenity.description}
                </Typography>
              </Grid>
            )}

            {/* Amenity Image Section */}
            {amenity.image && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <CustomFormLabel>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconPhoto size={20} />
                    Amenity Image
                  </Box>
                </CustomFormLabel>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Card
                    sx={{
                      maxWidth: 600,
                      margin: '0 auto',
                      boxShadow: theme.shadows[3],
                      borderRadius: 2,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={getImageUrl(amenity.image)}
                      alt={amenity.title}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: 400,
                        objectFit: 'contain',
                        bgcolor: theme.palette.grey[100],
                      }}
                    />
                  </Card>
                </Box>
              </Grid>
            )}

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => navigate("/amenities")}
                >
                  Close
                </Button>

              </Box>
            </Grid>
          </Grid>
        </ParentCard>
      </Box>
    </PageContainer>
  );
};

export default ViewAmenity;

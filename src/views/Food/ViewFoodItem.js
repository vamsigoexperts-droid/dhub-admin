import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { IconArrowBackUp } from '@tabler/icons-react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URLS } from '../../Url';

const ViewDish = () => {
  const navigate = useNavigate();
  const foodId = localStorage.getItem('foodId');
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  // Get token from localStorage
  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      console.error('Error retrieving token:', error);
      return '';
    }
  };

  // Fetch dish data
  useEffect(() => {
    const fetchDish = async () => {
      if (!foodId) {
        setError('Invalid dish ID');
        setLoading(false);
        return;
      }

      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token missing. Please log in.');
          navigate('/login');
          return;
        }

        const response = await axios.post(
          URLS.GetOneFoodItem,
          { productId: foodId },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data?.success) {
          setDish(response.data.data);
        } else {
          throw new Error(response.data?.message || 'Failed to fetch dish data');
        }
      } catch (error) {
        console.error('Error fetching dish:', error);
        setError(error.response?.data?.message || 'Failed to fetch dish data');
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [foodId, navigate]);

  // Handle image click
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Handle video play
  const handleVideoPlay = () => {
    setVideoDialogOpen(true);
  };

  // Close dialogs
  const handleCloseDialog = () => {
    setSelectedImage(null);
    setVideoDialogOpen(false);
  };

  // Breadcrumb configuration
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/food-item', title: 'Dish Management' },
    { title: 'View Dish' },
  ];

  if (loading) {
    return (
      <PageContainer title="View Dish">
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="View Dish">
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/food-item')}
            startIcon={<ArrowBackIcon />}
            sx={{ px: 4, py: 1.5, '&:hover': { bgcolor: 'primary.dark' } }}
          >
            Back to Dish Management
          </Button>
        </Box>
      </PageContainer>
    );
  }

  if (!dish) {
    return (
      <PageContainer title="View Dish">
        <Alert severity="warning" sx={{ mt: 3 }}>
          Dish not found
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/food-item')}
            startIcon={<ArrowBackIcon />}
            sx={{ px: 4, py: 1.5, '&:hover': { bgcolor: 'primary.dark' } }}
          >
            Back to Dish Management
          </Button>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="View Dish">
      <Breadcrumb title="View Dish" items={BCrumb} />

      {/* Header with Back Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Product Details
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          startIcon={<IconArrowBackUp />}
          aria-label="Back to previous page"
          sx={{ px: 4, py: 1.5, '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Back
        </Button>
      </Box>

      {/* Basic Dish Information */}
      <ParentCard title="Basic Dish Information">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Dish Name
            </Typography>
            <Typography variant="body1">{dish.dishName || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Item Code / SKU
            </Typography>
            <Typography variant="body1">{dish.itemCodeSku || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Cuisine Type
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {Array.isArray(dish.cuisinetypeName) && dish.cuisinetypeName.length > 0 ? (
                dish.cuisinetypeName.map((cuisine, index) => (
                  <Chip key={index} label={cuisine} size="small" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  N/A
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Category
            </Typography>
            <Typography variant="body1">
              {dish.categoryName || dish.categoryName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Subcategory
            </Typography>
            <Typography variant="body1">
              {dish.subcategoryName || dish.subcategoryName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Item Type
            </Typography>
            <Chip
              label={dish.itemType || 'N/A'}
              color={
                dish.itemType === 'Veg'
                  ? 'success'
                  : dish.itemType === 'Non-Veg'
                  ? 'error'
                  : 'default'
              }
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Short Description
            </Typography>
            <Typography variant="body1">{dish.shortDescription || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Full Description
            </Typography>
            <Typography variant="body1">{dish.fullDescription || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Popular / Recommended
            </Typography>
            <Chip
              label={dish.isPopularRecommended ? 'Yes' : 'No'}
              color={dish.isPopularRecommended ? 'success' : 'default'}
              size="small"
            />
          </Grid>
        </Grid>
      </ParentCard>

      {/* Media Section */}
      <ParentCard title="Images" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {dish.dishImages && dish.dishImages.length > 0 ? (
              <Grid container spacing={2}>
                {dish.dishImages.map((image, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Box
                      sx={{
                        position: 'relative',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        aspectRatio: '4/3',
                        '&:hover': {
                          boxShadow: 3,
                        },
                      }}
                      onClick={() => handleImageClick(`${URLS.FileBase}${image}`)}
                    >
                      <img
                        src={`${URLS.FileBase}${image}`}
                        alt={`Dish ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No images available
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            {dish.thumbnailImage ? (
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  maxWidth: 200,
                  aspectRatio: '4/3',
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
                onClick={() => handleImageClick(`${URLS.FileBase}${dish.thumbnailImage}`)}
              >
                <img
                  src={`${URLS.FileBase}${dish.thumbnailImage}`}
                  alt="Thumbnail"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No thumbnail available
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            {dish.video ? (
              <Box
                sx={{
                  position: 'relative',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                  maxWidth: 400,
                  aspectRatio: '16/9',
                  cursor: 'pointer',
                }}
                onClick={handleVideoPlay}
              >
                <video
                  src={`${URLS.FileBase}${dish.video}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '50%',
                    p: 1,
                  }}
                >
                  <PlayArrowIcon sx={{ color: 'white', fontSize: 40 }} />
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No video available
              </Typography>
            )}
          </Grid>
        </Grid>
      </ParentCard>

      {/* Pricing & Variants */}
      <ParentCard title="Pricing & Variants" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Base Price (â‚¹)
            </Typography>
            <Typography variant="body1">
              {dish.basePrice ? `â‚¹${parseFloat(dish.basePrice).toFixed(2)}` : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Offer Price (â‚¹)
            </Typography>
            <Typography variant="body1">
              {dish.offerPriceDiscount
                ? `â‚¹${parseFloat(dish.offerPriceDiscount).toFixed(2)}`
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Discount Value
            </Typography>
            <Typography variant="body1">
              {dish.discountValue ? `${parseFloat(dish.discountValue)}%` : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tax Rate (%)
            </Typography>
            <Typography variant="body1">
              {dish.taxRate ? `${parseFloat(dish.taxRate).toFixed(2)}%` : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Pricing Based on Size/Weight
            </Typography>
            <Chip
              label={dish.pricingBasedOnSizeWeight ? 'Yes' : 'No'}
              color={dish.pricingBasedOnSizeWeight ? 'primary' : 'default'}
              size="small"
            />
          </Grid>

          {/* Variants Table */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Variants / Customizations
            </Typography>
            {dish.variantsCustomizations &&
            Array.isArray(dish.variantsCustomizations) &&
            dish.variantsCustomizations.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Variant Name</TableCell>
                      <TableCell align="right">Price (â‚¹)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dish.variantsCustomizations.map((variant, index) => (
                      <TableRow key={index}>
                        <TableCell>{variant.name || 'N/A'}</TableCell>
                        <TableCell align="right">
                          {variant.price ? `â‚¹${parseFloat(variant.price).toFixed(2)}` : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No variants available
              </Typography>
            )}
          </Grid>

          {/* Add-ons Table */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Add-on Groups
            </Typography>
            {dish.addOnGroups && Array.isArray(dish.addOnGroups) && dish.addOnGroups.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Add-on Name</TableCell>
                      <TableCell align="right">Price (â‚¹)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dish.addOnGroups.map((addOn, index) => (
                      <TableRow key={index}>
                        <TableCell>{addOn.name || 'N/A'}</TableCell>
                        <TableCell align="right">
                          {addOn.price ? `â‚¹${parseFloat(addOn.price).toFixed(2)}` : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No add-ons available
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Combo Available
            </Typography>
            <Chip
              label={dish.comboAvailable ? 'Yes' : 'No'}
              color={dish.comboAvailable ? 'primary' : 'default'}
              size="small"
            />
          </Grid>
        </Grid>
      </ParentCard>

      {/* Tags, Dietary & Allergen Info */}
      <ParentCard title="Tags, Dietary & Allergen Info" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tags / Keywords
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {dish.tags ? (
                dish.tags
                  .split(',')
                  .filter((tag) => tag.trim())
                  .map((tag, index) => <Chip key={index} label={tag.trim()} size="small" />)
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No tags available
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Dietary Labels
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {dish.dietaryLabels && dish.dietaryLabels.length > 0 ? (
                dish.dietaryLabels.map((label, index) => (
                  <Chip key={index} label={label} color="primary" variant="outlined" size="small" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No dietary labels
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Allergen Info
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {dish.allergenInfo && dish.allergenInfo.length > 0 ? (
                dish.allergenInfo.map((allergen, index) => (
                  <Chip
                    key={index}
                    label={allergen}
                    color="secondary"
                    variant="outlined"
                    size="small"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No allergen information
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Calories / Nutrition Info
            </Typography>
            <Typography variant="body1">{dish.caloriesNutritionInfo || 'N/A'}</Typography>
          </Grid>
        </Grid>
      </ParentCard>

      {/* Inventory & Availability */}
      <ParentCard title="Inventory & Availability" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Stock Status
            </Typography>
            <Chip
              label={dish.stockStatus === 'inStock' ? 'In Stock' : 'Out of Stock'}
              color={dish.stockStatus === 'inStock' ? 'success' : 'error'}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Preparation Time (mins)
            </Typography>
            <Typography variant="body1">
              {dish.preparationTimeMins ? `${dish.preparationTimeMins} minutes` : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Maximum Serving Quantity
            </Typography>
            <Typography variant="body1">{dish.maximumServingQuantity || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Pre-Order Allowed
            </Typography>
            <Chip
              label={dish.preOrderAllowed ? 'Yes' : 'No'}
              color={dish.preOrderAllowed ? 'primary' : 'default'}
              size="small"
            />
          </Grid>

          {/* Availability Schedule */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Availability Schedule
            </Typography>
            {dish.availabilitySchedule &&
            Array.isArray(dish.availabilitySchedule) &&
            dish.availabilitySchedule.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dish.availabilitySchedule.map((slot, index) => (
                      <TableRow key={index}>
                        <TableCell>{slot.day || 'N/A'}</TableCell>
                        <TableCell>{slot.fromTime || 'N/A'}</TableCell>
                        <TableCell>{slot.toTime || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No availability schedule set
              </Typography>
            )}
          </Grid>
        </Grid>
      </ParentCard>

      {/* Location, Delivery & Packaging */}
      <ParentCard title="Location, Delivery & Packaging" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Packaging Charge (â‚¹)
            </Typography>
            <Typography variant="body1">
              {dish.packagingCharge ? `â‚¹${parseFloat(dish.packagingCharge).toFixed(2)}` : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Delivery Eligibility
            </Typography>
            <Chip
              label={dish.deliveryEligibility ? 'Yes' : 'No'}
              color={dish.deliveryEligibility ? 'primary' : 'default'}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Delivery Time Estimate (mins)
            </Typography>
            <Typography variant="body1">
              {dish.deliveryTimeEstimate ? `${dish.deliveryTimeEstimate} minutes` : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Pickup Option Available
            </Typography>
            <Chip
              label={dish.pickupOptionAvailable ? 'Yes' : 'No'}
              color={dish.pickupOptionAvailable ? 'primary' : 'default'}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Available in Zones / Areas
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {dish.zoneName && dish.zoneName.length > 0 ? (
                dish.zoneName.map((zone, index) => (
                  <Chip key={index} label={zone} color="primary" variant="outlined" size="small" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No zones specified
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Featured on Homepage
            </Typography>
            <Chip
              label={dish.isFeaturedOnHomepage ? 'Yes' : 'No'}
              color={dish.isFeaturedOnHomepage ? 'primary' : 'default'}
              size="small"
            />
          </Grid>
        </Grid>
      </ParentCard>

      {/* Advanced Features */}
      <ParentCard title="Advanced Features" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Enable Reviews / Ratings
            </Typography>
            <Chip
              label={dish.enableReviewsRatings ? 'Yes' : 'No'}
              color={dish.enableReviewsRatings ? 'primary' : 'default'}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Live Tracking Compatible
            </Typography>
            <Chip
              label={dish.liveTrackingCompatible ? 'Yes' : 'No'}
              color={dish.liveTrackingCompatible ? 'primary' : 'default'}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Kitchen Display Code
            </Typography>
            <Typography variant="body1">{dish.kitchenDisplayCode || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Out-of-Stock Alert Threshold
            </Typography>
            <Typography variant="body1">{dish.outOfStockAlertThreshold || 'N/A'}</Typography>
          </Grid>
        </Grid>
      </ParentCard>

      {/* SEO Information */}
      <ParentCard title="SEO Information" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Meta Title
            </Typography>
            <Typography variant="body1">{dish.metaTitle || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Meta Description
            </Typography>
            <Typography variant="body1">{dish.metaDescription || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Meta Keywords
            </Typography>
            <Typography variant="body1">{dish.metaKeywords || 'N/A'}</Typography>
          </Grid>
        </Grid>
      </ParentCard>

      {/* Image Dialog */}
      <Dialog open={!!selectedImage} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Dish Image
          <IconButton onClick={handleCloseDialog} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <img
            src={selectedImage}
            alt="Selected Dish"
            style={{ width: '100%', height: 'auto', borderRadius: 4 }}
          />
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Dish Video
          <IconButton onClick={handleCloseDialog} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <video
            src={dish.video ? `${URLS.FileBase}${dish.video}` : ''}
            controls
            style={{ width: '100%', height: 'auto', borderRadius: 4 }}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default memo(ViewDish);

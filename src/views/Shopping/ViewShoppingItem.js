import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Alert,
  Card,
  CardContent,
  Divider,
  Skeleton,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import {
  IconArrowBackUp,
  IconInfoCircle,
  IconCurrencyRupee,
  IconPackage,
  IconCalendarEvent,
  IconTag,
  IconSeo,
  IconWeight,
  IconRuler,
  IconClock,
  IconLeaf,
  IconStar,
  IconBox,
} from '@tabler/icons-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../Url';
import axios from 'axios';

// ViewProduct Component
const ViewProduct = () => {
  const navigate = useNavigate();
  const shoppingId = localStorage.getItem('shoppingId');
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Token Retrieval
  const getToken = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  }, []);

  const token = getToken();

  // Parse JSON string fields
  const parseJsonField = (field) => {
    try {
      if (typeof field === 'string') {
        return JSON.parse(field.replace(/\\"/g, '"'));
      }
      return field || [];
    } catch (error) {
      console.error('Error parsing JSON field:', error);
      return [];
    }
  };

  // Fetch Product Data
  const fetchServicedata = useCallback(async () => {
    if (!shoppingId || !token) {
      toast.error('Invalid product ID or authentication');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        URLS.GetOneShoppingItem,
        { productId: shoppingId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = res.data?.data || {};
      // Parse JSON string fields
      data.tagsKeywords = parseJsonField(data.tagsKeywords);
      data.metaKeywords = parseJsonField(data.metaKeywords);
      // Ensure colorSpecificImages is an array
      data.colorSpecificImages = Array.isArray(data.colorSpecificImages)
        ? data.colorSpecificImages
        : data.colorSpecificImages
        ? [data.colorSpecificImages]
        : [];
      setProductData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product data:', error);
      setError(error.response?.data?.message || 'Failed to fetch product data.');
      setLoading(false);
    }
  }, [shoppingId, token]);

  useEffect(() => {
    fetchServicedata();
  }, [fetchServicedata]);

  // Breadcrumb Configuration
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/product-list', title: 'Product List' },
    { title: 'View Product' },
  ];

  // Skeleton Loader
  const renderSkeleton = () => (
    <PageContainer title="View Product">
      <Breadcrumb title="View Product" items={BCrumb} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Skeleton variant="rounded" width={100} height={40} />
      </Box>

      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <ParentCard key={item} title={<Skeleton width={200} />} sx={{ mb: 3 }}>
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((field) => (
              <Grid item xs={12} sm={6} md={3} key={field}>
                <Skeleton variant="text" height={30} width="60%" />
                <Skeleton variant="text" height={25} width="80%" />
              </Grid>
            ))}
          </Grid>
        </ParentCard>
      ))}
    </PageContainer>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (error || !productData) {
    return (
      <PageContainer title="View Product">
        <Breadcrumb title="View Product" items={BCrumb} />
        <Alert
          severity="error"
          sx={{ mt: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchServicedata}>
              RETRY
            </Button>
          }
        >
          {error || 'No product data available.'}
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="View Product">
      <Breadcrumb title="View Product" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header with Back Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: 600 }}>
          Product Details
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          startIcon={<IconArrowBackUp />}
          aria-label="Back to previous page"
          sx={{ px: 4, py: 1.5 }}
        >
          Back
        </Button>
      </Box>

      {/* Basic Product Details */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconInfoCircle size={24} />
            <Typography variant="h5" component="h2">
              Basic Product Details
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Product Name
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
              {productData.productName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Type Of Product
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.productTypeName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Product Code / SKU
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.productCodeSku || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Category Name
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.categoryName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Sub Category Name
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.subcategoryName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Child Category Name
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.childcategoryName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Brand
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.brandName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Tags / Keywords
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.tagsKeywords?.length > 0 ? (
                productData.tagsKeywords.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  N/A
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Short Description
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {productData.shortDescription || 'N/A'}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Full Description
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {productData.fullDescription || 'N/A'}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Is Featured / Trending
            </Typography>
            <Chip
              label={productData.isFeaturedTrending === 'true' ? 'Yes' : 'No'}
              color={productData.isFeaturedTrending === 'true' ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Product Condition
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.productCondition || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </ParentCard>

      {/* Media Visuals */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconBox size={24} />
            <Typography variant="h5" component="h2">
              Media Visuals
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Main Product Image
            </Typography>
            {productData.mainProductImage ? (
              <Box
                sx={{
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  overflow: 'hidden',
                  width: '200px',
                  mx: 'auto',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 3,
                  },
                }}
              >
                <img
                  src={URLS.FileBase + productData.mainProductImage}
                  alt="Main Product Image"
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>
            ) : (
              <Card variant="outlined" sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50' }}>
                <Typography color="text.secondary">No main image available</Typography>
              </Card>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Additional Images
            </Typography>
            {productData.additionalImages?.length > 0 ? (
              <Grid container spacing={2}>
                {productData.additionalImages.map((src, idx) => (
                  <Grid item xs={6} sm={4} key={idx}>
                    <Box
                      sx={{
                        border: '2px solid',
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <img
                        src={URLS.FileBase + src}
                        alt={`Additional image ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card variant="outlined" sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50' }}>
                <Typography color="text.secondary">No additional images available</Typography>
              </Card>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Video / 360 View
            </Typography>
            {productData.video360View ? (
              <Box
                sx={{
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  overflow: 'hidden',
                  width: '200px',
                  mx: 'auto',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 3,
                  },
                }}
              >
                <video
                  src={URLS.FileBase + productData.video360View}
                  controls
                  style={{
                    width: '100%',
                    height: '150px',
                    display: 'block',
                  }}
                />
              </Box>
            ) : (
              <Card variant="outlined" sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50' }}>
                <Typography color="text.secondary">No video available</Typography>
              </Card>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Color-Specific Images
            </Typography>
            {productData.colorSpecificImages?.length > 0 ? (
              <Grid container spacing={2}>
                {productData.colorSpecificImages.map((src, idx) => (
                  <Grid item xs={6} sm={4} key={idx}>
                    <Box
                      sx={{
                        border: '2px solid',
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <img
                        src={URLS.FileBase + src}
                        alt={`Color-specific image ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card variant="outlined" sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50' }}>
                <Typography color="text.secondary">No color-specific images available</Typography>
              </Card>
            )}
          </Grid>
        </Grid>
      </ParentCard>

      {/* Pricing & Discounts */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconCurrencyRupee size={24} />
            <Typography variant="h5" component="h2">
              Pricing & Discounts
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Base Price (MRP)
            </Typography>
            <Typography variant="h6" color="primary.main">
              {productData.basePriceMrp && !isNaN(productData.basePriceMrp)
                ? `â‚¹${parseFloat(productData.basePriceMrp).toFixed(2)}`
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Selling Price
            </Typography>
            <Typography variant="h6" color="secondary.main">
              {productData.sellingPrice && !isNaN(productData.sellingPrice)
                ? `â‚¹${parseFloat(productData.sellingPrice).toFixed(2)}`
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Discount Type
            </Typography>
            <Chip label={productData.discountType || 'N/A'} color="info" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Discount Value
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {productData.discountValue || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Tax Rate (%)
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {productData.taxRate ? `${productData.taxRate}%` : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Is On Sale
            </Typography>
            <Chip
              label={productData.isOnSale === 'true' ? 'Yes' : 'No'}
              color={productData.isOnSale === 'true' ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Price Visibility
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.priceVisibility || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </ParentCard>

      {/* Specifications */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconTag size={24} />
            <Typography variant="h5" component="h2">
              Specifications
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          {/* Clothing Specs */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Type Of Material
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.materialTypeName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Sleeve Type
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.sleeveTypeName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Fit Type
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.fitTypeName || productData.fitTyName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Neck Type
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.neckTypeName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Gender
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.gender || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Size Guide
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.sizeGuide || 'N/A'}
            </Typography>
          </Grid>
          {/* Electronics Specs */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Processor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.processor || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              RAM
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.ramName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Storage
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.storageName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Battery Capacity
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.batteryCapacity || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Display Size
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.displaySize || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              OS
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.os || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Warranty
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.warranty || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </ParentCard>

      {/* Inventory & Stock Management */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconPackage size={24} />
            <Typography variant="h5" component="h2">
              Inventory & Stock Management
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Total Stock Quantity
            </Typography>
            <Typography variant="h6" color="text.primary">
              {productData.totalStockQuantity || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Low Stock Alert Threshold
            </Typography>
            <Typography variant="h6" color="text.primary">
              {productData.lowStockAlertThreshold || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </ParentCard>

      {/* Shipping & Delivery */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconPackage size={24} />
            <Typography variant="h5" component="h2">
              Shipping & Delivery
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Weight
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.weightName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Dimensions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.dimensions || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Shipping Charges
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.shippingCharges && !isNaN(productData.shippingCharges)
                ? `â‚¹${parseFloat(productData.shippingCharges).toFixed(2)}`
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Free Shipping Eligible
            </Typography>
            <Chip
              label={productData.freeShippingEligible === 'true' ? 'Yes' : 'No'}
              color={productData.freeShippingEligible === 'true' ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              COD Available
            </Typography>
            <Chip
              label={productData.codAvailable === 'true' ? 'Yes' : 'No'}
              color={productData.codAvailable === 'true' ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Delivery Time Estimate
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.deliveryTimeEstimate || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Return Policy
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.returnPolicy || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Return Reason Options
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.returnReasonOptions?.length > 0 ? (
                productData.returnReasonOptions.map((reason, index) => (
                  <Chip key={index} label={reason} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  N/A
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </ParentCard>

      {/* Advanced Attributes & Filters */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconTag size={24} />
            <Typography variant="h5" component="h2">
              Advanced Attributes & Filters
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Size Options
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.sizeOptionNames?.length > 0 ? (
                productData.sizeOptionNames.map((size, index) => (
                  <Chip key={index} label={size} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  N/A
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Colour Options
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.colourOptionNames?.length > 0 ? (
                productData.colourOptionNames.map((colour, index) => (
                  <Chip key={index} label={colour} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  N/A
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Custom Filters
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.customFilters?.length > 0 ? (
                productData.customFilters.map((filter, index) => (
                  <Chip key={index} label={filter} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  N/A
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Battery Included
            </Typography>
            <Chip
              label={productData.batteryIncluded === 'true' ? 'Yes' : 'No'}
              color={productData.batteryIncluded === 'true' ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Power Source
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.powerSource || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Is Eco-Friendly
            </Typography>
            <Chip
              label={productData.isEcoFriendly === 'true' ? 'Yes' : 'No'}
              color={productData.isEcoFriendly === 'true' ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Country of Origin
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.countryOfOriginName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              HSN Code / Tax Category
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.hsnCodeTaxCategory || 'N/A'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Product Priority
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.productPriority || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </ParentCard>

      {/* SEO Settings */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconSeo size={24} />
            <Typography variant="h5" component="h2">
              SEO Settings
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              SEO Title
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.metaTitle || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              SEO Description
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {productData.metaDescription || 'N/A'}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              SEO Keywords
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.metaKeywords?.length > 0 ? (
                productData.metaKeywords.map((keyword, index) => (
                  <Chip key={index} label={keyword} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  N/A
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </ParentCard>

      {/* Scheduling & Lifecycle */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconCalendarEvent size={24} />
            <Typography variant="h5" component="h2">
              Scheduling & Lifecycle
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Available From
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.availableFrom && !isNaN(new Date(productData.availableFrom))
                ? new Date(productData.availableFrom).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Expire / Unpublish On
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.expireUnpublishOn && !isNaN(new Date(productData.expireUnpublishOn))
                ? new Date(productData.expireUnpublishOn).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Is Pre-Launch Product
            </Typography>
            <Chip
              label={productData.isPreLaunchProduct === 'true' ? 'Yes' : 'No'}
              color={productData.isPreLaunchProduct === 'true' ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Zones
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.zoneName?.length > 0 ? (
                productData.zoneName.map((zone, index) => (
                  <Chip key={index} label={zone} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  N/A
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </ParentCard>

      {/* Analytics & Feedback (Optional) */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconStar size={24} />
            <Typography variant="h5" component="h2">
              Analytics & Feedback (Optional)
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Enable Product Reviews
            </Typography>
            <Chip
              label={productData.enableProductReviews === 'true' ? 'Yes' : 'No'}
              color={productData.enableProductReviews === 'true' ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Enable Star Ratings
            </Typography>
            <Chip
              label={productData.enableStarRatings === 'true' ? 'Yes' : 'No'}
              color={productData.enableStarRatings === 'true' ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Collect Usage Feedback
            </Typography>
            <Chip
              label={productData.collectUsageFeedback === 'true' ? 'Yes' : 'No'}
              color={productData.collectUsageFeedback === 'true' ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Frequently Bought With (Cross-Sell)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.frequentlyBoughtWithCrossSell?.length > 0 ? (
                productData.frequentlyBoughtWithCrossSell.map((item, index) => (
                  <Chip key={index} label={item} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  N/A
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Related Products (Upsell)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.relatedProductsUpsell?.length > 0 ? (
                productData.relatedProductsUpsell.map((item, index) => (
                  <Chip key={index} label={item} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  N/A
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewProduct;

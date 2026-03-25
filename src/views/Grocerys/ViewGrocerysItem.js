import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Typography, Button, Chip, Alert, Card, Skeleton } from '@mui/material';
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
  IconAdjustments,
} from '@tabler/icons-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../Url';
import axios from 'axios';

// ViewProduct Component
const ViewProduct = () => {
  const navigate = useNavigate();
  const groceryId = localStorage.getItem('groceryId');
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add states for variations
  const [variations, setVariations] = useState([]);
  const [subVariations, setSubVariations] = useState([]);

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

  // Fetch variations
  const getAllShoppingVariation = useCallback(async () => {
    try {
      const res = await axios.post(
        URLS.getAllShoppingVariation,
        { flagType: 'grocery' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setVariations(res.data.variations || []);
    } catch (err) {
      console.error('Failed to fetch variations:', err);
    }
  }, [token]);

  // Fetch sub variations
  const getSubShoppingVariation = useCallback(async () => {
    try {
      const res = await axios.post(
        URLS.getSubShoppingVariation,
        { flagType: 'grocery' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSubVariations(res.data.subVariations || []);
    } catch (err) {
      console.error('Failed to fetch sub variations:', err);
    }
  }, [token]);

  // Fetch Product Data
  const fetchProductData = useCallback(async () => {
    if (!groceryId || !token) {
      toast.error('Invalid product ID or authentication');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        URLS.GetOneGrocerysItem,
        { productId: groceryId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data?.success) {
        const data = res.data.data;
        
        // Format variations data - Handle different structures
        let formattedVariations = [];
        
        if (Array.isArray(data.variations) && data.variations.length > 0) {
          formattedVariations = data.variations.map(v => {
            // Structure 1: References are already populated with objects
            if (typeof v.variationId === 'object' && v.variationId !== null) {
              return {
                variationId: v.variationId._id,
                variationName: v.variationId.name,
                subVariationId: v.subVariationId?._id || v.subVariationId,
                subVariationName: v.subVariationId?.name || ''
              };
            }
            // Structure 2: Only IDs are provided (most common)
            else {
              return {
                variationId: v.variationId,
                variationName: '',
                subVariationId: v.subVariationId,
                subVariationName: ''
              };
            }
          });
        }

        setProductData({
          ...data,
          metaKeywords: data.metaKeywords?.split(',').filter(Boolean) || [],
          tags: data.tags?.split(',').filter(Boolean) || [],
          productImage: Array.isArray(data.productImage)
            ? data.productImage.map((img) => `${URLS.FileBase}${img}`)
            : data.productImage
            ? [`${URLS.FileBase}${data.productImage}`]
            : [],
          thumbnailImage: data.thumbnailImage
            ? `${URLS.FileBase}${data.thumbnailImage}`
            : null,
          variations: formattedVariations
        });
      } else {
        throw new Error(res.data?.message || 'Failed to fetch product data');
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch product data. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [groceryId, token]);

  useEffect(() => {
    const loadData = async () => {
      if (token) {
        await Promise.all([
          getAllShoppingVariation(),
          getSubShoppingVariation()
        ]);
        await fetchProductData();
      }
    };
    
    loadData();
  }, [token]);

  // Breadcrumb Configuration
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/grocery-list', title: 'Grocery List' },
    { title: 'View Grocery' },
  ];

  // Skeleton Loader
  const renderSkeleton = () => (
    <PageContainer title="View Grocery">
      <Breadcrumb title="View Grocery" items={BCrumb} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Skeleton variant="rounded" width={100} height={40} />
      </Box>

      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
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
      <PageContainer title="View Grocery">
        <Breadcrumb title="View Grocery" items={BCrumb} />
        <Alert
          severity="error"
          sx={{ mt: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchProductData}>
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
    <PageContainer title="View Grocery">
      <Breadcrumb title="View Grocery" items={BCrumb} />
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

      {/* Basic Product Information */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconInfoCircle size={24} />
            <Typography variant="h5" component="h2">
              Basic Product Information
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
              Product Code / SKU
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.productCode || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Category
            </Typography>
            <Chip label={productData.categoryName || 'N/A'} color="primary" variant="outlined" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Subcategory
            </Typography>
            <Chip
              label={productData.subcategoryName || 'N/A'}
              color="secondary"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Brand
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.brandName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Tags / Keywords
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.tags?.length > 0 ? (
                productData.tags.map((keyword, index) => (
                  <Chip key={index} label={keyword} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  N/A
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Status
            </Typography>
            <Chip
              label={productData.status === 'active' ? 'Active' : 'Inactive'}
              color={productData.status === 'active' ? 'success' : 'error'}
              size="medium"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Description
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {productData.description || 'No description available'}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </ParentCard>

      {/* Media Section */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconBox size={24} />
            <Typography variant="h5" component="h2">
              Media
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Product Images
            </Typography>
            {productData.productImage.length > 0 ? (
              <Grid container spacing={2}>
                {productData.productImage.map((src, idx) => (
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
                        src={src}
                        alt={`Product image ${idx + 1}`}
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
                <Typography color="text.secondary">No images available</Typography>
              </Card>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Thumbnail Image
            </Typography>
            {productData.thumbnailImage ? (
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
                  src={productData.thumbnailImage}
                  alt="Thumbnail"
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
                <Typography color="text.secondary">No thumbnail available</Typography>
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
              MRP (â‚¹)
            </Typography>
            <Typography variant="h6" color="primary.main">
              {productData.price ? `â‚¹${parseFloat(productData.price).toFixed(2)}` : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Sale Price (â‚¹)
            </Typography>
            <Typography variant="h6" color="secondary.main">
              {productData.discountPrice
                ? `â‚¹${parseFloat(productData.discountPrice).toFixed(2)}`
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Discount Type
            </Typography>
            <Chip
              label={
                productData.discountType
                  ? productData.discountType === 'percentage'
                    ? 'Percentage'
                    : 'Fixed Amount'
                  : 'N/A'
              }
              color="info"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Tax (%)
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {productData.tax ? `${productData.tax}%` : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Discount Value
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {productData.discountValue ? `${productData.discountValue}` : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </ParentCard>

      {/* Inventory & Stock */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconPackage size={24} />
            <Typography variant="h5" component="h2">
              Inventory & Stock
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Stock Quantity
            </Typography>
            <Typography variant="h6" color="text.primary">
              {productData.stockQuantity || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Stock Status
            </Typography>
            <Chip
              label={productData.stockStatus || 'N/A'}
              color={
                productData.stockStatus === 'InStock'
                  ? 'success'
                  : productData.stockStatus === 'OutOfStock'
                  ? 'error'
                  : 'warning'
              }
              size="medium"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Minimum Order Quantity
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.minimumOrderQuantity || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Maximum Order Quantity
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.maximumOrderQuantity || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </ParentCard>

      {/* Availability */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconCalendarEvent size={24} />
            <Typography variant="h5" component="h2">
              Availability
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Availability Start Date
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.availabilityStartDate
                ? new Date(productData.availabilityStartDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Availability End Date
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.availabilityEndDate
                ? new Date(productData.availabilityEndDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Zones
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.zoneId?.length > 0 ? (
                productData.zoneName.map((zoneName, idx) => (
                  <Chip key={idx} label={zoneName} size="small" variant="outlined" />
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

      {/* Product Variations */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconAdjustments size={24} />
            <Typography variant="h5" component="h2">
              Product Variations
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        {productData?.variations && productData.variations.length > 0 ? (
          <Grid container spacing={3}>
            {productData.variations.map((variation, index) => {
              // Find variation name from variations array (parent)
              const variationData = variations.find(v => v._id === variation.variationId);
              const variationName = variation.variationName || variationData?.name || 'N/A';
              
              // Find sub-variation name from subVariations array (child)
              const subVariationData = subVariations.find(sv => sv._id === variation.subVariationId);
              const subVariationName = variation.subVariationName || subVariationData?.name || 'N/A';

              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {variationName.charAt(0).toUpperCase() + variationName.slice(1)}
                  </Typography>
                  <Chip
                    label={subVariationName}
                    color="primary"
                    variant="outlined"
                    size="medium"
                  />
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Variations
              </Typography>
              <Typography variant="body1" color="text.secondary">
                N/A
              </Typography>
            </Grid>
          </Grid>
        )}
      </ParentCard>

      {/* Additional Attributes */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconTag size={24} />
            <Typography variant="h5" component="h2">
              Additional Attributes
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <IconWeight size={20} />
              <Typography variant="subtitle1" fontWeight={600}>
                Weight
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {productData.weightName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <IconRuler size={20} />
              <Typography variant="subtitle1" fontWeight={600}>
                Unit
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {productData.unitName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <IconRuler size={20} />
              <Typography variant="subtitle1" fontWeight={600}>
                Size / Volume
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {productData.size || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <IconClock size={20} />
              <Typography variant="subtitle1" fontWeight={600}>
                Shelf Life
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {productData.shelfLife || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <IconLeaf size={20} />
              <Typography variant="subtitle1" fontWeight={600}>
                Organic
              </Typography>
            </Box>
            <Chip
              label={productData.organicNonGmo ? 'Yes' : 'No'}
              color={productData.organicNonGmo ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <IconStar size={20} />
              <Typography variant="subtitle1" fontWeight={600}>
                Featured Product
              </Typography>
            </Box>
            <Chip
              label={productData.isFeaturedProduct ? 'Yes' : 'No'}
              color={productData.isFeaturedProduct ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
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
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewProduct;

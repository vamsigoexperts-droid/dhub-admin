import React, { useState, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { Box, Grid, Typography, Button, Chip, Alert, Card, Skeleton } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import {
  IconArrowBackUp,
  IconCurrencyRupee,
  IconCalendarEvent,
  IconSeo,
  IconBox,
  IconMedicineSyrup,
  IconShield,
  IconTruck,
  IconFilter,
  IconSettings,
  IconEye,
  IconFlask,
} from '@tabler/icons-react';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../Url';
import axios from 'axios';

// ViewMedicineProduct Component
const ViewMedicineProduct = () => {
  const navigate = useNavigate();
  const medicineId = localStorage.getItem('medicineId');
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

  // Fetch Product Data
  const fetchProductData = useCallback(async () => {
    if (!medicineId || !token) {
      toast.error('Invalid product ID or authentication');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        URLS.GetOneMedicalItem,
        { productId: medicineId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data?.success) {
        const data = res.data.data;

        // Format dates
        const formatDate = (dateString) => {
          if (!dateString) return null;
          return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        };

        setProductData({
          ...data,
          // Format dates
          availableFromFormatted: formatDate(data.availableFrom),
          expiryDiscontinueDateFormatted: formatDate(data.expiryDiscontinueDate),
          expiryDatePerBatchFormatted: formatDate(data.expiryDatePerBatch),
          logCreatedDateFormatted: formatDate(data.logCreatedDate),
          logModifiedDateFormatted: formatDate(data.logModifiedDate),
          // Format arrays
          metaKeywords: data.metaKeywords?.split(',').filter(Boolean) || [],
          tagsKeywords: data.tagsKeywords?.split(',').filter(Boolean) || [],
          activeIngredients: data.activeIngredients || [],
          // Handle images with full URLs
          productImage: data.productImage ? `${URLS.FileBase}${data.productImage}` : null,
          additionalImages: data.additionalImages?.map((img) => `${URLS.FileBase}${img}`) || [],
          instructionLeaflet: data.instructionLeaflet
            ? `${URLS.FileBase}${data.instructionLeaflet}`
            : null,
          prescriptionSample: data.prescriptionSample
            ? `${URLS.FileBase}${data.prescriptionSample}`
            : null,
          // Format zone names
          zoneNames: data.zoneName || [],
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
  }, [medicineId, token]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  // Helper function to format boolean values
  const formatBoolean = (value) => (value ? 'Yes' : 'No');

  // Helper function to format currency
  const formatCurrency = (value) => (value ? `â‚¹${parseFloat(value).toFixed(2)}` : 'N/A');

  // Helper function to display value or N/A
  const displayValue = (value) => value || 'N/A';

  // Breadcrumb Configuration
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/medicine-products', title: 'Medicine Products' },
    { title: 'View Medicine Product' },
  ];

  // Skeleton Loader
  const renderSkeleton = () => (
    <PageContainer title="View Medicine Product">
      <Breadcrumb title="View Medicine Product" items={BCrumb} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Skeleton variant="rounded" width={100} height={40} />
      </Box>

      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
        <ParentCard key={item} title={<Skeleton width={250} />} sx={{ mb: 3 }}>
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
      <PageContainer title="View Medicine Product">
        <Breadcrumb title="View Medicine Product" items={BCrumb} />
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
    <PageContainer title="View Medicine Product">
      <Breadcrumb title="View Medicine Product" items={BCrumb} />
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
          Medicine Product Details
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

      {/* Basic Medicine Information */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconMedicineSyrup size={24} />
            <Typography variant="h5" component="h2">
              Basic Medicine Information
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Medicine Name
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
              {displayValue(productData.medicineName)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Generic Name
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.genericName)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Product Code / SKU
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.productCodeSku)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Slug URL
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.slugUrl)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Type of Medicine
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.typeOfMedicine)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Category
            </Typography>
            <Chip
              label={displayValue(productData.categoryName)}
              color="primary"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Subcategory
            </Typography>
            <Chip
              label={displayValue(productData.subcategoryName)}
              color="secondary"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Childcategory
            </Typography>
            <Chip
              label={displayValue(productData.childcategoryName)}
              color="secondary"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Brand
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.brandName)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Therapeutic Class
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.drugtypeName)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Prescription Required
            </Typography>
            <Chip
              label={formatBoolean(productData.prescriptionRequired)}
              color={productData.prescriptionRequired ? 'warning' : 'success'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Short Description
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {displayValue(productData.shortDescription)}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Full Description
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
              {productData.fullDescription ? (
                <div
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productData.fullDescription) }}
                />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No description available
                </Typography>
              )}
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Tags / Keywords
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.tagsKeywords?.length > 0 ? (
                productData.tagsKeywords.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" color="primary" />
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

      {/* Regulatory Information */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconShield size={24} />
            <Typography variant="h5" component="h2">
              Regulatory Information
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Schedule Drug Category
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.drugtypeName)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              HSN Code
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.hsnCode)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Drug License Required for Seller
            </Typography>
            <Chip
              label={formatBoolean(productData.drugLicenseRequiredForSeller)}
              color={productData.drugLicenseRequiredForSeller ? 'warning' : 'success'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          {productData.drugLicenseRequiredForSeller && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                License Number
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {displayValue(productData.licenseNumber)}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Expiry Date (Per Batch)
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.expiryDatePerBatchFormatted || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Batch Tracking Enabled
            </Typography>
            <Chip
              label={formatBoolean(productData.batchTrackingEnabled)}
              color={productData.batchTrackingEnabled ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          {productData.batchTrackingEnabled && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Stock Per Batch
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {displayValue(productData.stockPerBatch)}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Storage Instructions
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
              {productData.storageInstructions ? (
                <div
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productData.storageInstructions) }}
                />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No instructions available
                </Typography>
              )}
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Usage Instructions
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
              {productData.usageInstructions ? (
                <div
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productData.usageInstructions) }}
                />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No instructions available
                </Typography>
              )}
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Side Effects
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
              {productData.sideEffects ? (
                <div
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productData.sideEffects) }}
                />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No side effects listed
                </Typography>
              )}
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Precautions / Warnings
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
              {productData.precautionsWarnings ? (
                <div
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productData.precautionsWarnings) }}
                />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No precautions listed
                </Typography>
              )}
            </Card>
          </Grid>
        </Grid>
      </ParentCard>

      {/* Composition & Ingredients */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconFlask size={24} />
            <Typography variant="h5" component="h2">
              Composition & Ingredients
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Active Ingredients
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.activeIngredients?.length > 0 ? (
                productData.activeIngredients.map((ingredient, index) => (
                  <Chip
                    key={index}
                    label={ingredient}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
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
              Composition Table
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
              {productData.compositionTable ? (
                <div
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productData.compositionTable) }}
                />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No composition table available
                </Typography>
              )}
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Salt / Chemical Combination
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.saltChemicalCombination)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Controlled Substance
            </Typography>
            <Chip
              label={formatBoolean(productData.isControlledSubstance)}
              color={productData.isControlledSubstance ? 'error' : 'success'}
              size="medium"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </ParentCard>

      {/* Media & Documents */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconBox size={24} />
            <Typography variant="h5" component="h2">
              Media & Documents
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Product Image
            </Typography>
            {productData.productImage ? (
              <Box
                sx={{
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  overflow: 'hidden',
                  width: '200px',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 3,
                  },
                }}
              >
                <img
                  src={productData.productImage}
                  alt="Product image"
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
                <Typography color="text.secondary">No product image available</Typography>
              </Card>
            )}
          </Grid>

          {/* Additional Images */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Additional Images ({productData.additionalImages.length}/5)
            </Typography>
            {productData.additionalImages.length > 0 ? (
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
                        src={src}
                        alt={`Additional image ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '100px',
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

          {/* Instruction Leaflet */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Instruction Leaflet
            </Typography>
            {productData.instructionLeaflet ? (
              <Box
                sx={{
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  bgcolor: 'grey.50',
                }}
              >
                <PdfIcon sx={{ color: 'error.main' }} />
                <Typography variant="body2">Instruction Leaflet Document</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<IconEye />}
                  onClick={() => window.open(productData.instructionLeaflet, '_blank')}
                >
                  View
                </Button>
              </Box>
            ) : (
              <Card variant="outlined" sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50' }}>
                <Typography color="text.secondary">No instruction leaflet available</Typography>
              </Card>
            )}
          </Grid>

          {/* Prescription Sample */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Prescription Sample
            </Typography>
            {productData.prescriptionSample ? (
              <Box
                sx={{
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  overflow: 'hidden',
                  width: '200px',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 3,
                  },
                }}
              >
                <img
                  src={productData.prescriptionSample}
                  alt="Prescription sample"
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
                <Typography color="text.secondary">No prescription sample available</Typography>
              </Card>
            )}
          </Grid>
        </Grid>
      </ParentCard>

      {/* Pricing & Stock Details */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconCurrencyRupee size={24} />
            <Typography variant="h5" component="h2">
              Pricing & Stock Details
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
              {formatCurrency(productData.mrp)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Selling Price (â‚¹)
            </Typography>
            <Typography variant="h6" color="secondary.main">
              {formatCurrency(productData.sellingPrice)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Discount (%)
            </Typography>
            <Typography variant="h6" color="success.main">
              {productData.discountPercentAmount ? `${productData.discountPercentAmount}` : 'N/A'}
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
              Stock Quantity
            </Typography>
            <Typography variant="h6" color="text.primary">
              {displayValue(productData.stockQuantity)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Stock Unit
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.unitName)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Minimum Order Quantity
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.minimumOrderQuantity)}
            </Typography>
          </Grid>
          {productData.batchTrackingEnabled && (
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Stock Per Batch
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {displayValue(productData.stockPerBatch)}
              </Typography>
            </Grid>
          )}
        </Grid>
      </ParentCard>

      {/* Packaging & Delivery */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconTruck size={24} />
            <Typography variant="h5" component="h2">
              Packaging & Delivery
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Pack Size / Quantity
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.packSizeQuantity)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Packaging Type
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.packingtTypeName)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Weight
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.weightName)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Dimensions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.dimensions)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
             Product Form
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.formName)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Flavor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.flavor)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Free Shipping Eligible
            </Typography>
            <Chip
              label={formatBoolean(productData.freeShippingEligible)}
              color={productData.freeShippingEligible ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              COD Available
            </Typography>
            <Chip
              label={formatBoolean(productData.codAvailable)}
              color={productData.codAvailable ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Delivery Time Estimate
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayValue(productData.deliveryTimeEstimate)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Returnable
            </Typography>
            <Chip
              label={formatBoolean(productData.returnable)}
              color={productData.returnable ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          {productData.returnable && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Return Policy Note
              </Typography>
              <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {displayValue(productData.returnPolicyNote)}
                </Typography>
              </Card>
            </Grid>
          )}
        </Grid>
      </ParentCard>

      {/* Filters & Attributes */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconFilter size={24} />
            <Typography variant="h5" component="h2">
              Filters & Attributes
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Age Group
            </Typography>
            <Chip
              label={displayValue(productData.ageGroup)}
              color="info"
              variant="outlined"
              sx={{ textTransform: 'capitalize' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Gender
            </Typography>
            <Chip
              label={displayValue(productData.gender)}
              color="info"
              variant="outlined"
              sx={{ textTransform: 'capitalize' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Sugar-Free
            </Typography>
            <Chip
              label={formatBoolean(productData.isSugarFree)}
              color={productData.isSugarFree ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Herbal / Organic
            </Typography>
            <Chip
              label={formatBoolean(productData.isHerbalOrganic)}
              color={productData.isHerbalOrganic ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Auto Sync with ERP
            </Typography>
            <Chip
              label={formatBoolean(productData.inventoryAutoSyncWithErp)}
              color={productData.inventoryAutoSyncWithErp ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </ParentCard>

      {/* Advanced Features */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconSettings size={24} />
            <Typography variant="h5" component="h2">
              Advanced Features
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Interaction Checker Enabled
            </Typography>
            <Chip
              label={formatBoolean(productData.interactionCheckerEnabled)}
              color={productData.interactionCheckerEnabled ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Review / Rating Enabled
            </Typography>
            <Chip
              label={formatBoolean(productData.reviewRatingEnabled)}
              color={productData.reviewRatingEnabled ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Notify When Back in Stock
            </Typography>
            <Chip
              label={formatBoolean(productData.notifyWhenBackInStock)}
              color={productData.notifyWhenBackInStock ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </ParentCard>

      {/* Lifecycle & Availability */}
      <ParentCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconCalendarEvent size={24} />
            <Typography variant="h5" component="h2">
              Lifecycle & Availability
            </Typography>
          </Box>
        }
        sx={{ mb: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Available From
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.availableFromFormatted || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Expiry / Discontinue Date
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {productData.expiryDiscontinueDateFormatted || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Enable Pre-Orders
            </Typography>
            <Chip
              label={formatBoolean(productData.enablePreOrders)}
              color={productData.enablePreOrders ? 'success' : 'default'}
              size="medium"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Product Visibility
            </Typography>
            <Chip
              label={displayValue(productData.productVisibility)}
              color={productData.productVisibility === 'public' ? 'success' : 'warning'}
              size="medium"
              variant="outlined"
              sx={{ textTransform: 'capitalize' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Product Lifecycle Status
            </Typography>
            <Chip
              label={displayValue(productData.productLifecycleStatus)}
              color={productData.productLifecycleStatus === 'active' ? 'success' : 'error'}
              size="medium"
              variant="outlined"
              sx={{ textTransform: 'capitalize' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Zones
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.zoneNames?.length > 0 ? (
                productData.zoneNames.map((zoneName, idx) => (
                  <Chip key={idx} label={zoneName} size="small" variant="outlined" color="info" />
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
              {displayValue(productData.metaTitle)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              SEO Keywords
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productData.metaKeywords?.length > 0 ? (
                productData.metaKeywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    size="small"
                    variant="outlined"
                    color="warning"
                  />
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
                {displayValue(productData.metaDescription)}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewMedicineProduct;

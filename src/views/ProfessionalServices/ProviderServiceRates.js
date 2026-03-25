import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { IconPlus, IconEdit, IconTrash, IconArrowBackUp, IconEye, IconTablePlus, IconX } from '@tabler/icons-react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Avatar,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  CardContent,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton
} from '@mui/material';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Provider Service Rates' }];

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ IMAGE URL HELPER FUNCTION
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `http://192.168.0.5:5013/${cleanPath}`;
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ COMPLETE API CONFIGURATION
const API_URLS = {
  CREATE: 'http://192.168.0.5:5013/v1/dhubApi/admin/professional-service-request/create',
  GET_ALL: 'http://192.168.0.5:5013/v1/dhubApi/admin/professional-service-request/getall',
  GET_SINGLE: 'http://192.168.0.5:5013/v1/dhubApi/admin/professional-service-request',
  UPDATE: 'http://192.168.0.5:5013/v1/dhubApi/admin/professional-service-request/update',
  DELETE: 'http://192.168.0.5:5013/v1/dhubApi/admin/professional-service-request/delete',
  GET_CATEGORIES: 'http://192.168.0.5:5013/v1/dhubApi/admin/professional-providers/get-provider-categories',
  GET_SUBCATEGORIES: 'http://192.168.0.5:5013/v1/dhubApi/admin/professional-providers/get-provider-subcategories',
};

const getProfessionalProviderId = () => {
  return localStorage.getItem('ProfessionalProviderId') ||
    new URLSearchParams(window.location.search).get('providerId');
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ CATEGORIES & SUBCATEGORIES HOOK
const useProviderCategories = (providerId, token) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchCategories = useCallback(async () => {
    if (!providerId || !token) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('providerId', providerId);
      const res = await axios.post(API_URLS.GET_CATEGORIES, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load categories');
      console.error('Categories error:', error);
    } finally {
      setLoading(false);
    }
  }, [providerId, token]);

  const fetchSubcategories = useCallback(async (categoryId) => {
    if (!categoryId || !token) {
      setSubcategories([]);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('providerId', providerId);
      formData.append('categoryId', categoryId);
      const res = await axios.post(API_URLS.GET_SUBCATEGORIES, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubcategories(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load subcategories');
      console.error('Subcategories error:', error);
    }
  }, [providerId, token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, fetchSubcategories]);

  return { categories, subcategories, loading, setSelectedCategory };
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ VIEW DIALOG COMPONENT
const ServiceViewDialog = ({ open, onClose, serviceData }) => {
  if (!serviceData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.lighter' }}>
        <Typography variant="h5" fontWeight={700} color="primary.main">Service Details</Typography>
        <IconButton onClick={onClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Service Images Gallery */}
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Avatar
                src={getImageUrl(Array.isArray(serviceData.image) ? serviceData.image[0] : serviceData.image)}
                sx={{ width: 120, height: 120, boxShadow: 3 }}
                variant="rounded"
              >
                {serviceData.name?.charAt(0)}
              </Avatar>

              {Array.isArray(serviceData.image) && serviceData.image.length > 1 && (
                <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                  {serviceData.image.slice(1).map((img, idx) => (
                    <Avatar
                      key={idx}
                      src={getImageUrl(img)}
                      sx={{ width: 40, height: 40, border: '1px solid #ddd' }}
                      variant="rounded"
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Basic Info */}
          <Grid item xs={12} md={8}>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Service Name</Typography>
              <Typography variant="h6" fontWeight={600}>{serviceData.name}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Provider</Typography>
              <Typography variant="body1">{serviceData.providerName}</Typography>
            </Box>
          </Grid>

          {/* Category Info */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Category</Typography>
              <Typography variant="body1" fontWeight={500}>{serviceData.categoryName}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Subcategory</Typography>
              <Typography variant="body1" fontWeight={500}>{serviceData.subcategoryName}</Typography>
            </Paper>
          </Grid>

          {/* Pricing Details Info */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Pricing Details</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.lighter', borderRadius: 2 }}>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹{serviceData.offerPrice || serviceData.price}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h5" fontWeight={700}>
                ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹{serviceData.defaultPrice || serviceData.purchasePrice || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h5" fontWeight={700}>
                {serviceData.duration || serviceData.warrantyDays || 0} mins
              </Typography>
            </Paper>
          </Grid>




          {/* Service Info */}
          {(serviceData.serviceInfo || serviceData.reason) && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'warning.lighter', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Service Info</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {serviceData.serviceInfo || serviceData.reason}
                </Typography>
              </Paper>
            </Grid>
          )}

          {/* Banner Images */}
          {serviceData.banner_images?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Banner Images</Typography>
              <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                {serviceData.banner_images.map((img, idx) => (
                  <Avatar
                    key={idx}
                    src={getImageUrl(img)}
                    sx={{ width: 120, height: 120, boxShadow: 2 }}
                    variant="rounded"
                  />
                ))}
              </Box>
            </Grid>
          )}

          {/* Timestamps */}
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>Created At</Typography>
            <Typography variant="body2">
              {new Date(serviceData.createdAt).toLocaleString('en-IN')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>Last Modified</Typography>
            <Typography variant="body2">
              {new Date(serviceData.updatedAt).toLocaleString('en-IN')}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" onClick={onClose} size="large">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ SHARED FORM COMPONENT (Add/Edit)


// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ SHARED FORM COMPONENT (Add/Edit) - WITH IMAGE UPLOAD/REMOVE ON IMAGE
const ServiceRateForm = ({
  onClose,
  onSubmit,
  professionalProviderId,
  categoriesData,
  initialData = null,
  isEdit = false,
  loading = false
}) => {
  const theme = useTheme();
  const { categories, subcategories, setSelectedCategory } = categoriesData;

  const [form, setForm] = useState({
    professionalProviderId,
    categoryId: initialData?.categoryId || '',
    subcategoryId: initialData?.subcategoryId?._id || initialData?.subcategoryId || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    defaultPrice: initialData?.defaultPrice || initialData?.purchasePrice || '',
    offerPrice: initialData?.offerPrice || initialData?.salePrice || initialData?.price || '',
    duration: initialData?.duration || initialData?.warrantyDays || '',
    serviceInfo: initialData?.serviceInfo || initialData?.reason || '',
  });

  const [errors, setErrors] = useState({});

  const [images, setImages] = useState({
    image: [],
    banner_images: [],
  });
  const [previews, setPreviews] = useState({
    image: initialData?.image ? (Array.isArray(initialData.image) ? initialData.image.map(img => getImageUrl(img)) : [getImageUrl(initialData.image)]) : [],
    banner_images: initialData?.banner_images?.map(img => getImageUrl(img)) || [],
  });

  useEffect(() => {
    if (initialData?.categoryId) {
      setSelectedCategory(initialData.categoryId);
    }
  }, [initialData?.categoryId, setSelectedCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, categoryId: value, subcategoryId: '' });
    setSelectedCategory(value);
    if (errors.categoryId) setErrors(prev => ({ ...prev, categoryId: false }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
      const isDocument = ['pdf', 'jpg', 'jpeg', 'png'].includes(ext);

      if (type === 'image' && isImage) {
        if (previews.image.length >= 5) {
          toast.error('Maximum 5 service images allowed');
          return;
        }
        const newImages = [...images.image, file];
        setImages(prev => ({ ...prev, image: newImages }));
        setPreviews(prev => ({ ...prev, image: [...previews.image, URL.createObjectURL(file)] }));
      } else if (type === 'banner' && isImage) {
        const newBanners = [...images.banner_images, file];
        setImages(prev => ({ ...prev, banner_images: newBanners }));
        setPreviews(prev => ({ ...prev, banner_images: [...previews.banner_images, URL.createObjectURL(file)] }));
      } else if (type === 'purchaseBill' && isDocument) {
        setImages(prev => ({ ...prev, purchasePriceBillDocument: file }));
        if (isImage) {
          setPreviews(prev => ({ ...prev, purchasePriceBillDocument: URL.createObjectURL(file) }));
        } else {
          setPreviews(prev => ({ ...prev, purchasePriceBillDocument: 'document' }));
        }
      } else {
        toast.error('Invalid file type');
        e.target.value = '';
      }
    }
  };

  const removeBannerImage = (index) => {
    const newBanners = images.banner_images.filter((_, i) => i !== index);
    const newPreviews = previews.banner_images.filter((_, i) => i !== index);
    setImages(prev => ({ ...prev, banner_images: newBanners }));
    setPreviews(prev => ({ ...prev, banner_images: newPreviews }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate fields
    const newErrors = {};
    if (!form.categoryId) newErrors.categoryId = true;
    if (!form.subcategoryId) newErrors.subcategoryId = true;
    if (!form.name?.trim()) newErrors.name = true;
    if (!form.offerPrice || parseFloat(form.offerPrice) <= 0) newErrors.offerPrice = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill all required fields marked with *');
      return;
    }

    const formData = new FormData();
    // Use offerPrice for both price and offerPrice for backend compatibility
    const submissionForm = { ...form, price: form.offerPrice };

    Object.keys(submissionForm).forEach(key => {
      if (submissionForm[key] !== undefined && submissionForm[key] !== null && submissionForm[key] !== '') {
        formData.append(key, submissionForm[key]);
      }
    });

    images.image.forEach(img => formData.append('image', img));
    images.banner_images.forEach(img => formData.append('banner_images', img));

    onSubmit(formData, initialData?._id);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title={isEdit ? "Edit Service Rate" : "Create Service Rate"}
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={1} sx={{ p: 1.5 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel required>Category*</CustomFormLabel>
              <Select
                name="categoryId"
                value={form.categoryId}
                onChange={handleCategoryChange}
                fullWidth
                size="small"
                required
                disabled={categories.length === 0}
                error={errors.categoryId}
              >
                <MenuItem value="" disabled>Select Category</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                ))}
              </Select>
              {errors.categoryId && <Typography color="error" variant="caption">Category is required</Typography>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel required>Subcategory*</CustomFormLabel>
              <Select
                name="subcategoryId"
                value={form.subcategoryId}
                onChange={handleChange}
                fullWidth
                size="small"
                required
                disabled={subcategories.length === 0}
                error={errors.subcategoryId}
              >
                <MenuItem value="" disabled>Select Subcategory</MenuItem>
                {subcategories.map(sub => (
                  <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
                ))}
              </Select>
              {errors.subcategoryId && <Typography color="error" variant="caption">Subcategory is required</Typography>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel required>Service Name*</CustomFormLabel>
              <CustomTextField
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                size="small"
                required
                placeholder="Enter service name"
                error={errors.name}
                helperText={errors.name ? 'Service name is required' : ''}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 1, mb: 0.5 }}>Pricing Details</Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel>Default Price (ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹)</CustomFormLabel>
              <CustomTextField
                type="number"
                name="defaultPrice"
                value={form.defaultPrice}
                onChange={handleChange}
                fullWidth
                size="small"
                placeholder="0.00"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel required>Offer Price (ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹)*</CustomFormLabel>
              <CustomTextField
                type="number"
                name="offerPrice"
                value={form.offerPrice}
                onChange={handleChange}
                fullWidth
                size="small"
                required
                placeholder="0.00"
                error={errors.offerPrice}
                helperText={errors.offerPrice ? 'Valid offer price is required' : ''}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel>Duration (mins)</CustomFormLabel>
              <CustomTextField
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                fullWidth
                size="small"
                placeholder="e.g. 45"
              />
            </Grid>



            <Grid item xs={12} sm={6}>
              <CustomFormLabel>Service Info (Optional)</CustomFormLabel>
              <CustomTextField
                name="serviceInfo"
                value={form.serviceInfo}
                onChange={handleChange}
                fullWidth
                size="small"
                placeholder="Any specific information or note"
              />
            </Grid>


            {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ SERVICE IMAGE SECTION WITH UPLOAD/REMOVE BUTTONS ON IMAGE */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel>Service Image</CustomFormLabel>

              {previews.image.length > 0 ? (
                <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                  {previews.image.map((preview, idx) => (
                    <Box key={idx} sx={{ position: 'relative', display: 'inline-block' }}>
                      <Avatar
                        src={preview}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          border: '2px solid',
                          borderColor: 'divider'
                        }}
                        variant="rounded"
                      />
                      <IconButton
                        onClick={() => {
                          const newImages = images.image.filter((_, i) => i !== idx);
                          const newPreviews = previews.image.filter((_, i) => i !== idx);
                          setImages(prev => ({ ...prev, image: newImages }));
                          setPreviews(prev => ({ ...prev, image: newPreviews }));
                        }}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'error.main',
                          color: 'white',
                          width: 24,
                          height: 24,
                          '&:hover': { bgcolor: 'error.dark' },
                          boxShadow: 2
                        }}
                      >
                        <IconX size={14} />
                      </IconButton>
                    </Box>
                  ))}
                  {previews.image.length < 5 && (
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        border: '2px dashed',
                        borderColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        bgcolor: 'primary.lighter'
                      }}
                      component="label"
                    >
                      <IconPlus size={24} style={{ color: theme.palette.primary.main }} />
                      <input
                        type="file"
                        hidden
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={(e) => handleImageChange(e, 'image')}
                      />
                    </Box>
                  )}
                </Box>
              ) : (
                // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Show file input when no image
                <Box mt={2}>
                  <CustomTextField
                    type="file"
                    fullWidth
                    size="small"
                    onChange={(e) => handleImageChange(e, 'image')}
                    inputProps={{ accept: 'image/jpeg,image/png,image/jpg' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Upload JPG, JPEG or PNG (Max 5MB) | Indicator: upto 5 - 512*512
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ BANNER IMAGES SECTION */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel>Banner Images (Optional)</CustomFormLabel>

              {previews.banner_images.length > 0 ? (
                <Box mt={2}>

                  <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
                    {previews.banner_images.map((preview, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          position: 'relative',
                          display: 'inline-block'
                        }}
                      >
                        {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Banner Image */}
                        <Avatar
                          src={preview}
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: 'divider'
                          }}
                          variant="rounded"
                        />

                        {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ UPLOAD/REPLACE BUTTON (Bottom Left) */}
                        <IconButton
                          component="label"
                          sx={{
                            position: 'absolute',
                            bottom: 4,
                            left: 4,
                            bgcolor: 'primary.main',
                            color: 'white',
                            width: 28,
                            height: 28,
                            '&:hover': {
                              bgcolor: 'primary.dark',
                              transform: 'scale(1.1)'
                            },
                            boxShadow: 2,
                            transition: 'all 0.2s'
                          }}
                          title="Replace image"
                        >
                          <IconPlus size={16} />
                          <input
                            type="file"
                            hidden
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file && ['jpg', 'jpeg', 'png'].includes(file.name.split('.').pop().toLowerCase())) {
                                const newBanners = [...images.banner_images];
                                const newPreviews = [...previews.banner_images];
                                newBanners[idx] = file;
                                newPreviews[idx] = URL.createObjectURL(file);
                                setImages(prev => ({ ...prev, banner_images: newBanners }));
                                setPreviews(prev => ({ ...prev, banner_images: newPreviews }));
                              } else {
                                toast.error('Only JPG, JPEG, PNG allowed');
                                e.target.value = '';
                              }
                            }}
                          />
                        </IconButton>

                        {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ REMOVE BUTTON (Top Right) */}
                        <IconButton
                          onClick={() => removeBannerImage(idx)}
                          sx={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            bgcolor: 'error.main',
                            color: 'white',
                            width: 24,
                            height: 24,
                            '&:hover': {
                              bgcolor: 'error.dark',
                              transform: 'scale(1.1)'
                            },
                            boxShadow: 2,
                            transition: 'all 0.2s'
                          }}
                          title="Remove image"
                        >
                          <IconX size={14} />
                        </IconButton>

                        {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Image Number Badge */}

                      </Box>
                    ))}

                    {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ ADD MORE BANNER BUTTON */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        border: '2px dashed',
                        borderColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        bgcolor: 'primary.lighter',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'primary.light',
                          transform: 'scale(1.05)'
                        }
                      }}
                      component="label"
                    >
                      <Box textAlign="center">
                        <IconPlus size={24} style={{ color: theme.palette.primary.main }} />
                        <Typography variant="caption" color="primary" sx={{ display: 'block', fontSize: '10px' }} fontWeight={600}>
                          Add More
                        </Typography>
                      </Box>
                      <input
                        type="file"
                        hidden
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={(e) => handleImageChange(e, 'banner')}
                      />
                    </Box>
                  </Box>
                </Box>
              ) : (
                // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Show upload when no banners
                <Box mt={2}>
                  <CustomTextField
                    type="file"
                    fullWidth
                    size="small"
                    onChange={(e) => handleImageChange(e, 'banner')}
                    inputProps={{ accept: 'image/jpeg,image/png,image/jpg', multiple: true }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Upload banner images (JPG, JPEG, PNG) | Indicator: 920*375 - note
                  </Typography>
                </Box>
              )}
            </Grid>

          </Grid>

          <Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="flex-end" gap={2} sx={{ p: 1.5, pt: 0 }}>
            <Button color="error" variant="outlined" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box >
  );
};


// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ MAIN COMPONENT
const ProviderServiceRates = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const professionalProviderId = getProfessionalProviderId();
  const token = localStorage.getItem('token');
  const categoriesData = useProviderCategories(professionalProviderId, token);

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ GET ALL SERVICES
  const getData = useCallback(async () => {
    if (!professionalProviderId || !token) {
      if (!professionalProviderId) toast.error('No provider selected');
      if (!token) toast.error('Please login again');
      return;
    }

    setLoading(true);
    try {
      const payload = { professionalProviderId };
      const res = await axios.post(API_URLS.GET_ALL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setData(res.data.data || []);
      console.log('ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Loaded services:', res.data.data?.length || 0);
    } catch (error) {
      console.error('ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€¦Ã¢â‚¬â„¢ Error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [professionalProviderId, token]);

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ GET SINGLE SERVICE (for Edit)
  const getSingleService = async (serviceId) => {
    setLoading(true);
    try {
      console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â¡ Fetching service:', serviceId);
      const res = await axios.get(`${API_URLS.GET_SINGLE}/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Service data:', res.data.data);
      setEditData(res.data.data);
      setIsEditMode(true);
      setShowForm(true);
    } catch (error) {
      console.error('ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€¦Ã¢â‚¬â„¢ Fetch error:', error.response?.data);
      toast.error('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ CRUD Operations
  const handleSubmit = async (formData, id = null) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (id) {
        // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ UPDATE
        console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â Updating service:', id);
        res = await axios.put(`${API_URLS.UPDATE}/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ CREATE
        console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â¤ Creating service...');
        res = await axios.post(API_URLS.CREATE, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      console.log('ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Success:', res.data);
      toast.success(res.data.message);
      setShowForm(false);
      setIsEditMode(false);
      setEditData(null);
      getData();
    } catch (error) {
      console.error('ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€¦Ã¢â‚¬â„¢ Submit error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    setLoading(true);
    try {
      await axios.delete(`${API_URLS.DELETE}/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Service deleted successfully');
      getData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };


  const handleView = (row) => {
    setViewData(row);
    setViewDialogOpen(true);
  };

  const handleEdit = (row) => {
    getSingleService(row._id);
  };

  // Effects
  useEffect(() => {
    if (professionalProviderId && token) {
      getData();
    }
  }, [professionalProviderId, token, getData]);

  useEffect(() => {
    const filtered = data.filter(item =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.providerName?.toLowerCase().includes(search.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
      item.subcategoryName?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, search]);

  // DataGrid Columns
  const columns = useMemo(() => [
    {
      field: 'sno',
      headerName: 'S.No',
      width: 60,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          {params.api.getSortedRowIds().indexOf(params.id) + 1}
        </Typography>
      )
    },
    {
      field: 'name',
      headerName: 'Service',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar
            src={getImageUrl(Array.isArray(params.row.image) ? params.row.image[0] : params.row.image)}
            sx={{ width: 40, height: 40, borderRadius: 1 }}
            variant="rounded"
          >
            {params.row.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600} noWrap>
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {params.row.categoryName}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'subcategoryName',
      headerName: 'Subcategory',
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'defaultPrice',
      headerName: 'Default Price',
      width: 110,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
          ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹{params.row.defaultPrice || params.row.purchasePrice || 0}
        </Typography>
      )
    },
    {
      field: 'offerPrice',
      headerName: 'Offer Price',
      width: 110,
      renderCell: (params) => (
        <Typography variant="subtitle2" fontWeight={700} color="primary.main">
          ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹{params.row.offerPrice || params.row.price}
        </Typography>
      )
    },
    {
      field: 'duration',
      headerName: 'Duration (mins)',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.duration || params.row.warrantyDays || 0} mins
        </Typography>
      )
    },
    {
      field: 'serviceInfo',
      headerName: 'Service Info',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {params.row.serviceInfo || params.row.reason || '-'}
        </Typography>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 320,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box display="flex" gap={0.5} justifyContent="center">
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleEdit(params.row)}
            disabled={loading}
            startIcon={<IconEdit size={14} />}
            sx={{
              minWidth: 70,
              px: 1,
              py: 0.5,
              textTransform: 'none',
              fontSize: '0.7rem',
              borderRadius: '20px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderRadius: '4px',
                bgcolor: 'primary.main',
                color: 'white',
                transform: 'scale(1.08)',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)'
              }
            }}
          >
            Edit
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row._id)}
            disabled={loading}
            startIcon={<IconTrash size={14} />}
            sx={{
              minWidth: 75,
              px: 1,
              py: 0.5,
              textTransform: 'none',
              fontSize: '0.7rem',
              borderRadius: '20px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderRadius: '4px',
                bgcolor: 'error.main',
                color: 'white',
                transform: 'scale(1.08)',
                boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)'
              }
            }}
          >
            Delete
          </Button>


          <Button
            size="small"
            variant="outlined"
            color="info"
            onClick={() => handleView(params.row)}
            disabled={loading}
            startIcon={<IconEye size={14} />}
            sx={{
              minWidth: 65,
              px: 1,
              py: 0.5,
              textTransform: 'none',
              fontSize: '0.7rem',
              borderRadius: '20px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderRadius: '4px',
                bgcolor: 'info.main',
                color: 'white',
                transform: 'scale(1.08)'
              }
            }}
          >
            View
          </Button>
        </Box>
      )
    }
  ], [loading]);


  const rows = useMemo(() =>
    filteredData.map(item => ({ id: item._id, ...item }))
    , [filteredData]);

  if (!professionalProviderId) {
    return (
      <PageContainer title="Provider Service Rates">
        <Breadcrumb title="Provider Service Rates" items={BCrumb} />
        <Alert severity="warning" sx={{ mt: 3 }}>
          No Provider selected. Please select a professional provider first.
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Provider Service Rates" description="Manage service rates for professional service providers">
      <Breadcrumb title="Provider Service Rates" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* VIEW DIALOG */}
      <ServiceViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        serviceData={viewData}
      />

      {/* ADD/EDIT FORM */}
      {showForm && (
        <ServiceRateForm
          onClose={() => {
            setShowForm(false);
            setIsEditMode(false);
            setEditData(null);
          }}
          onSubmit={handleSubmit}
          professionalProviderId={professionalProviderId}
          categoriesData={categoriesData}
          initialData={editData}
          isEdit={isEditMode}
          loading={loading}
        />
      )}

      {/* MAIN TABLE */}
      <Paper sx={{ mt: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: '12px', boxShadow: theme.shadows[3] }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={3} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h5" fontWeight={700} color="primary">
              Service Rates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all service rates and pricing
            </Typography>
          </Box>

          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <CustomTextField
              size="small"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 200, md: 300 }, bgcolor: 'background.paper' }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setShowForm(true);
                setIsEditMode(false);
                setEditData(null);
              }}
              disabled={loading || !categoriesData.categories.length}
              startIcon={<IconPlus size={20} />}
            >
              Add Service
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(-1)}
              startIcon={<IconArrowBackUp />}
            >
              Back
            </Button>
          </Box>
        </Box>

        <Divider />
        <CardContent sx={{ p: [2, 3] }}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              disableRowSelectionOnClick
              autoHeight={false}
              sx={{
                '& .MuiDataGrid-cell': { whiteSpace: 'normal', lineHeight: '1.4' },
                '& .MuiDataGrid-columnHeaders': { bgcolor: 'primary.50', fontWeight: 600 }
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default ProviderServiceRates;


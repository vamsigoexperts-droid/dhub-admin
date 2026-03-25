import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import {
  IconPlus, IconEdit, IconTrash, IconEye, IconAnalyze,
  IconX, IconArrowBackUp, IconRefresh, IconCurrencyDollar, IconDotsVertical
} from '@tabler/icons-react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme, styled } from '@mui/material/styles';
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
  IconButton,
  TextField,
  Tabs,
  Tab,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Service Rates' }];

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ IMAGE URL HELPER
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `http://192.168.0.5:5013/${cleanPath}`;
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ API CONFIGURATION
const API_URLS = {
  CREATE: 'http://192.168.0.5:5013/v1/dhubApi/admin/service-requests/create',
  GET_ALL: 'http://192.168.0.5:5013/v1/dhubApi/admin/service-requests/all',
  GET_SINGLE: 'http://192.168.0.5:5013/v1/dhubApi/admin/service-requests',
  UPDATE: 'http://192.168.0.5:5013/v1/dhubApi/admin/service-requests/update',
  DELETE: 'http://192.168.0.5:5013/v1/dhubApi/admin/service-requests/delete',
  GET_CATEGORIES: 'http://192.168.0.5:5013/v1/dhubApi/admin/provider/get-provider-categories',
  GET_SUBCATEGORIES: 'http://192.168.0.5:5013/v1/dhubApi/admin/provider/get-provider-subcategories',
};

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    minWidth: 180,
    boxShadow: theme.shadows[8],
    borderRadius: '8px',
    '& .MuiMenuItem-root': {
      padding: '10px 16px',
      gap: '12px',
      fontSize: '0.875rem',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  },
}));

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ GET PROVIDER ID FROM STORAGE/URL
const getProviderId = () => {
  return localStorage.getItem('ProfessionalProviderId') ||
    new URLSearchParams(window.location.search).get('providerId');
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ GET TOKEN
const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.token || localStorage.getItem('token') || null;
  } catch (error) {
    console.error('Token extraction error:', error);
    return null;
  }
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
      const res = await axios.post(API_URLS.GET_CATEGORIES,
        { providerId },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setCategories(res.data.data || []);
      console.log('ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Categories loaded:', res.data.data?.length);
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
      const res = await axios.post(API_URLS.GET_SUBCATEGORIES,
        { providerId, categoryId },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setSubcategories(res.data.data || []);
      console.log('ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Subcategories loaded:', res.data.data?.length);
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
const ServiceRequestViewDialog = ({ open, onClose, serviceData }) => {
  if (!serviceData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.lighter' }}>
        <Typography variant="h5" fontWeight={700} color="primary.main">Service Request Details</Typography>
        <IconButton onClick={onClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Service Image */}
          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent="center">
              <Avatar
                src={getImageUrl(serviceData.image)}
                sx={{ width: 120, height: 120, boxShadow: 3 }}
                variant="rounded"
              >
                {serviceData.name?.charAt(0)}
              </Avatar>
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
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Status</Typography>
              <Box mt={0.5}>
                <Chip
                  label={serviceData.status}
                  color={
                    serviceData.status === 'approved' ? 'success' :
                      serviceData.status === 'rejected' ? 'error' :
                        'warning'
                  }
                  size="small"
                />
              </Box>
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
              <Typography variant="body1" fontWeight={500}>
                {serviceData.subcategoryId?.name || serviceData.subcategoryName}
              </Typography>
            </Paper>
          </Grid>

          {/* Pricing Info */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.lighter', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Purchase Price</Typography>
                  <Typography variant="h6" fontWeight={700}>ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹{serviceData.purchasePrice || 0}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Sale Price</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary.main">ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹{serviceData.salePrice || serviceData.price}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Warranty</Typography>
                  <Typography variant="h6" fontWeight={700}>{serviceData.warrantyDays || 0} Days</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Banner Images */}
          {serviceData.banner_images?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} mb={1}>Banner Images</Typography>
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                {serviceData.banner_images.map((img, i) => (
                  <Box key={i} component="img" src={getImageUrl(img)} sx={{ height: 100, borderRadius: 1, border: '1px solid #eee' }} />
                ))}
              </Box>
            </Grid>
          )}

          {/* Bill Document */}
          {serviceData.purchasePriceBillDocument && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Purchase Bill Document</Typography>
                  <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.open(getImageUrl(serviceData.purchasePriceBillDocument), '_blank')}>
                    View Document
                  </Typography>
                </Box>
                <IconX size={24} style={{ opacity: 0.1 }} />
              </Paper>
            </Grid>
          )}

          {/* Description */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Description</Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {serviceData.description || '-'}
              </Typography>
              {serviceData.reason && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Reason/Note</Typography>
                  <Typography variant="body2">{serviceData.reason}</Typography>
                </>
              )}
            </Paper>
          </Grid>

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

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ SERVICE REQUEST FORM (Add/Edit)
const ServiceRequestForm = ({
  onClose,
  onSubmit,
  providerId,
  categoriesData,
  initialData = null,
  isEdit = false,
  loading = false
}) => {
  const theme = useTheme();
  const { categories, subcategories, setSelectedCategory } = categoriesData;

  const [form, setForm] = useState({
    providerId,
    categoryId: initialData?.categoryId || '',
    subcategoryId: initialData?.subcategoryId?._id || initialData?.subcategoryId || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    purchasePrice: initialData?.purchasePrice || '',
    salePrice: initialData?.salePrice || initialData?.price || '',
    warrantyDays: initialData?.warrantyDays || '',
    reason: initialData?.reason || '',
  });

  const [images, setImages] = useState({
    service_images: [],
    banner_images: [],
    purchasePriceBillDocument: null,
  });
  const [previews, setPreviews] = useState({
    service_images: initialData?.image ? [getImageUrl(initialData.image)] :
      (initialData?.service_images?.map(getImageUrl) || []),
    banner_images: initialData?.banner_images?.map(getImageUrl) || [],
    purchasePriceBillDocument: initialData?.purchasePriceBillDocument ? getImageUrl(initialData.purchasePriceBillDocument) : null,
  });

  useEffect(() => {
    if (initialData?.categoryId) {
      setSelectedCategory(initialData.categoryId);
    }
  }, [initialData?.categoryId, setSelectedCategory]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, categoryId: value, subcategoryId: '' });
    setSelectedCategory(value);
  };

  const handleImageChange = (e, type) => {
    if (type === 'service') {
      const selectedFiles = Array.from(e.target.files);
      const currentCount = previews.service_images.length;
      const allowedCount = 5 - currentCount;

      if (allowedCount <= 0) {
        toast.error('Maximum 5 service images allowed');
        e.target.value = '';
        return;
      }

      const filesToProcess = selectedFiles.slice(0, allowedCount);
      const newFiles = [];
      const newPreviews = [];

      filesToProcess.forEach(file => {
        if (['jpg', 'jpeg', 'png', 'webp'].includes(file.name.split('.').pop().toLowerCase())) {
          newFiles.push(file);
          newPreviews.push(URL.createObjectURL(file));
        } else {
          toast.error(`"${file.name}" is not a valid image format`);
        }
      });

      if (newFiles.length > 0) {
        setImages(prev => ({ ...prev, service_images: [...prev.service_images, ...newFiles] }));
        setPreviews(prev => ({ ...prev, service_images: [...prev.service_images, ...newPreviews] }));
      }

      if (selectedFiles.length > allowedCount) {
        toast.warning(`Only ${allowedCount} image(s) added. Maximum 5 allowed.`);
      }
    } else if (type === 'bill') {
      const file = e.target.files[0];
      if (!file) return;
      const ext = file.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'].includes(ext)) {
        setImages(prev => ({ ...prev, purchasePriceBillDocument: file }));
        setPreviews(prev => ({ ...prev, purchasePriceBillDocument: ['jpg', 'jpeg', 'png'].includes(ext) ? URL.createObjectURL(file) : 'document' }));
      } else {
        toast.error('Invalid document format');
      }
    } else if (type === 'banner') {
      const selectedFiles = Array.from(e.target.files);
      const currentBannerCount = previews.banner_images.length;
      const allowedCount = 5 - currentBannerCount;

      if (allowedCount <= 0) {
        toast.error('Maximum 5 banner images allowed');
        e.target.value = '';
        return;
      }

      const filesToProcess = selectedFiles.slice(0, allowedCount);
      const newFiles = [];
      const newPreviews = [];

      filesToProcess.forEach(file => {
        if (['jpg', 'jpeg', 'png'].includes(file.name.split('.').pop().toLowerCase())) {
          newFiles.push(file);
          newPreviews.push(URL.createObjectURL(file));
        } else {
          toast.error(`"${file.name}" is not a valid image format`);
        }
      });

      if (newFiles.length > 0) {
        setImages(prev => ({ ...prev, banner_images: [...prev.banner_images, ...newFiles] }));
        setPreviews(prev => ({ ...prev, banner_images: [...prev.banner_images, ...newPreviews] }));
      }
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };


  const removeServiceImage = (index) => {
    const previewToRemove = previews.service_images[index];
    const isNewBlob = previewToRemove.startsWith('blob:');

    if (isNewBlob) {
      const newFileIndicesBefore = previews.service_images
        .slice(0, index)
        .filter(p => p.startsWith('blob:')).length;

      setImages(prev => ({
        ...prev,
        service_images: prev.service_images.filter((_, i) => i !== newFileIndicesBefore)
      }));
    }

    setPreviews(prev => ({
      ...prev,
      service_images: prev.service_images.filter((_, i) => i !== index)
    }));
  };

  const removeBannerImage = (index) => {
    const previewToRemove = previews.banner_images[index];
    const isNewBlob = previewToRemove.startsWith('blob:');

    if (isNewBlob) {
      const newFileIndicesBefore = previews.banner_images
        .slice(0, index)
        .filter(p => p.startsWith('blob:')).length;

      setImages(prev => ({
        ...prev,
        banner_images: prev.banner_images.filter((_, i) => i !== newFileIndicesBefore)
      }));
    }

    setPreviews(prev => ({
      ...prev,
      banner_images: prev.banner_images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.salePrice ||
      !form.categoryId || !form.subcategoryId || parseFloat(form.salePrice) <= 0) {
      toast.error('Please fill all required fields correctly (Sale Price is required)');
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key !== 'price' && form[key] !== null && form[key] !== '') {
        formData.append(key, form[key]);
      }
    });
    formData.append('price', form.salePrice);

    // Append service images (up to 5)
    if (images.service_images && images.service_images.length > 0) {
      images.service_images.forEach(file => {
        formData.append('image', file);
      });
    }
    if (images.purchasePriceBillDocument) formData.append('purchasePriceBillDocument', images.purchasePriceBillDocument);

    // Append multiple banner images
    if (images.banner_images && images.banner_images.length > 0) {
      images.banner_images.forEach(file => {
        formData.append('banner_images', file);
      });
    }

    onSubmit(formData, initialData?._id);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title={isEdit ? "Edit Service Request" : "Create Service Request"}
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={3} sx={{ p: 2 }}>
            {/* --- SECTION 1: BASIC INFO --- */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" fontWeight={700} color="primary">Basic Information</Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <CustomFormLabel required>Category*</CustomFormLabel>
                  <Select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleCategoryChange}
                    fullWidth
                    size="small"
                    required
                    disabled={categories.length === 0}
                  >
                    <MenuItem value="" disabled>Select Category</MenuItem>
                    {categories.map(cat => (
                      <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFormLabel required>Subcategory*</CustomFormLabel>
                  <Select
                    name="subcategoryId"
                    value={form.subcategoryId}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    disabled={subcategories.length === 0}
                  >
                    <MenuItem value="" disabled>Select Subcategory</MenuItem>
                    {subcategories.map(sub => (
                      <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFormLabel required>Service Name*</CustomFormLabel>
                  <CustomTextField
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    placeholder="Enter service name"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* --- SECTION 2: PRICING & WARRANTY --- */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.lighter', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6" fontWeight={700} color="primary">Pricing & Warranty</Typography>
                  <Divider sx={{ flex: 1 }} />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel required>Purchase Price (ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹)</CustomFormLabel>
                    <CustomTextField
                      type="number"
                      name="purchasePrice"
                      value={form.purchasePrice}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      required
                      inputProps={{ min: 0, step: "0.01" }}
                      placeholder="0.00"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel required>Sale Price (ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹)*</CustomFormLabel>
                    <CustomTextField
                      type="number"
                      name="salePrice"
                      value={form.salePrice}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      required
                      inputProps={{ min: 0, step: "0.01" }}
                      placeholder="0.00"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Warranty Days</CustomFormLabel>
                    <CustomTextField
                      type="number"
                      name="warrantyDays"
                      value={form.warrantyDays}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      placeholder="e.g. 90"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Purchase Bill (Optional)</CustomFormLabel>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        size="small"
                        sx={{ py: 0.8, borderStyle: 'dashed', bgcolor: 'white' }}
                      >
                        {images.purchasePriceBillDocument ?
                          (images.purchasePriceBillDocument.name.length > 15 ? images.purchasePriceBillDocument.name.substring(0, 12) + '...' : images.purchasePriceBillDocument.name) :
                          previews.purchasePriceBillDocument ? 'Change Bill' : '+ Upload Bill'}
                        <input type="file" hidden accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setImages(prev => ({ ...prev, purchasePriceBillDocument: file }));
                            const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(file.name.split('.').pop().toLowerCase());
                            setPreviews(prev => ({ ...prev, purchasePriceBillDocument: isImage ? URL.createObjectURL(file) : 'document' }));
                          }
                        }} />
                      </Button>
                      {previews.purchasePriceBillDocument && (
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => {
                            setImages(prev => ({ ...prev, purchasePriceBillDocument: null }));
                            setPreviews(prev => ({ ...prev, purchasePriceBillDocument: null }));
                          }}
                        >
                          <IconX size={18} />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* --- SECTION 3: MEDIA & NOTES --- */}
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" fontWeight={700} color="primary">Service Description</Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomFormLabel>Reason/Note (Optional)</CustomFormLabel>
                  <CustomTextField
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    placeholder="Any specific reason or note"
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomFormLabel>Detailed Description</CustomFormLabel>
                  <CustomTextField
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    multiline
                    rows={4.5}
                    fullWidth
                    placeholder="Full service description..."
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" fontWeight={700} color="primary">Service Image</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  ({previews.service_images.length}/5)
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, height: 'calc(100% - 40px)' }}>
                <Grid container spacing={1.5}>
                  {previews.service_images.map((url, index) => (
                    <Grid item key={index}>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar
                          src={url}
                          sx={{ width: 100, height: 100, borderRadius: 2, border: '1px solid #ddd' }}
                          variant="rounded"
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeServiceImage(index)}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            bgcolor: 'error.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'error.dark' },
                            boxShadow: 2,
                            width: 22,
                            height: 22,
                            minWidth: 'unset',
                          }}
                        >
                          <IconX size={13} />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                  {previews.service_images.length < 5 && (
                    <Grid item>
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          width: 100,
                          height: 100,
                          borderStyle: 'dashed',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          bgcolor: 'white',
                        }}
                      >
                        <IconPlus size={28} />
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', textAlign: 'center', lineHeight: 1.2 }}>
                          Add Image
                        </Typography>
                        <input
                          type="file"
                          multiple
                          hidden
                          accept="image/jpg,image/jpeg,image/png,image/webp"
                          onChange={(e) => handleImageChange(e, 'service')}
                        />
                      </Button>
                    </Grid>
                  )}
                </Grid>
                {previews.service_images.length === 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                    Upload up to 5 images. Click + to add individually or select multiple at once.
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* --- SECTION 4: BANNERS --- */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" fontWeight={700} color="primary">Working Images (Max 5)</Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Grid container spacing={2}>
                  {previews.banner_images.map((url, index) => (
                    <Grid item key={index}>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar
                          src={url}
                          sx={{ width: 120, height: 120, borderRadius: 2, border: '1px solid #ddd' }}
                          variant="rounded"
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeBannerImage(index)}
                          sx={{
                            position: 'absolute',
                            top: -10,
                            right: -10,
                            bgcolor: 'error.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'error.dark' },
                            boxShadow: 2
                          }}
                        >
                          <IconX size={16} />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                  {previews.banner_images.length < 5 && (
                    <Grid item>
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          width: 120,
                          height: 120,
                          borderStyle: 'dashed',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          bgcolor: 'white'
                        }}
                      >
                        <IconPlus size={32} />
                        <Typography variant="caption">Add Banner</Typography>
                        <input
                          type="file"
                          multiple
                          hidden
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'banner')}
                        />
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="flex-end" gap={2} sx={{ p: 2, bgcolor: 'grey.50', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
            <Button color="inherit" variant="outlined" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit" disabled={loading} sx={{ minWidth: 150 }}>
              {loading ? 'Processing...' : isEdit ? 'Update Request' : 'Create Request'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ MAIN COMPONENT
const ServiceRequests = () => {
  const theme = useTheme();

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, inactive: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const providerId = getProviderId();
  const token = getToken();
  const categoriesData = useProviderCategories(providerId, token);

  const navigate = useNavigate();

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ GET ALL SERVICE REQUESTS
  const getData = useCallback(async () => {
    if (!providerId || !token) {
      if (!providerId) toast.error('No provider selected');
      if (!token) toast.error('Please login again');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({ providerId });
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await axios.get(`${API_URLS.GET_ALL}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setData(res.data.data || []);
      setStats(res.data.stats || { total: 0, pending: 0, approved: 0, rejected: 0, inactive: 0 });
      console.log('ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Loaded requests:', res.data.data?.length || 0);
    } catch (error) {
      console.error('ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€¦Ã¢â‚¬â„¢ Error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [providerId, token, statusFilter, search]);

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ GET SINGLE SERVICE REQUEST (for Edit)
  const getSingleRequest = async (requestId) => {
    setLoading(true);
    try {
      console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â¡ Fetching request:', requestId);
      const res = await axios.get(`${API_URLS.GET_SINGLE}/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Request data:', res.data.data);
      setEditData(res.data.data);
      setIsEditMode(true);
      setShowForm(true);
    } catch (error) {
      console.error('ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€¦Ã¢â‚¬â„¢ Fetch error:', error.response?.data);
      toast.error('Failed to load request details');
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
        console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â Updating request:', id);
        res = await axios.put(`${API_URLS.UPDATE}/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ CREATE
        console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â¤ Creating request...');
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

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete "${row.name}"?`)) return;

    setLoading(true);
    try {
      await axios.delete(`${API_URLS.DELETE}/${row._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Request deleted successfully');
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
    handleActionMenuClose();
  };

  const handleActionMenuOpen = (event, row) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRow(null);
  };

  const handleEdit = (row) => {
    getSingleRequest(row._id);
    handleActionMenuClose();
  };

  const handleUpdatePopUp = (row) => {
    // Implement status update logic here
    toast.info('Status update feature - coming soon');
    handleActionMenuClose();
  };

  // Effects
  useEffect(() => {
    if (providerId && token) {
      getData();
    }
  }, [providerId, token, statusFilter, getData]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);


  const handleAddons = (row) => {
    localStorage.setItem('ProfessionalProviderId', providerId);
    localStorage.setItem('SelectedServiceId', row._id);
    localStorage.setItem('SelectedServiceName', row.name);
    navigate('/service-addons');
    handleActionMenuClose();
  };


  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ DATAGRID COLUMNS
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
      field: 'serviceInfo',
      headerName: 'Service Info',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar
            src={getImageUrl(params.row.image)}
            sx={{ width: 40, height: 40 }}
          >
            {params.row.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600} noWrap>
              {params.row.name}
            </Typography>

          </Box>
        </Box>
      )
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.row.categoryName}
        </Typography>
      )
    },
    {
      field: 'subcategory',
      headerName: 'Subcategory',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.row.subcategoryId?.name || params.row.subcategoryName}
        </Typography>
      )
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 110,
      renderCell: (params) => (
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ lineHeight: 1.2 }}>
            ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹{params.row.price}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
            {params.row.priceUnit}
          </Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const statusConfig = {
          approved: { label: 'Approved', color: 'success' },
          pending: { label: 'Pending', color: 'warning' },
          rejected: { label: 'Rejected', color: 'error' },
          inactive: { label: 'Inactive', color: 'default' }
        };
        const config = statusConfig[params.row.status] || { label: params.row.status, color: 'default' };
        return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 320,
      minWidth: 180,
      headerAlign: 'left',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <IconButton size="small" onClick={(e) => handleActionMenuOpen(e, params.row)} sx={{ p: 0 }}>
            <IconDotsVertical size={20} />
          </IconButton>
        </Box>
      ),
    },
  ], [loading, theme.palette]);

  const rows = useMemo(() =>
    filteredData.map(item => ({ id: item._id, ...item }))
    , [filteredData]);

  if (!providerId) {
    return (
      <PageContainer title="Service Requests">
        <Breadcrumb title="Service Requests" items={BCrumb} />
        <Alert severity="warning" sx={{ mt: 3 }}>
          No Provider selected. Please select a professional provider first.
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Service Requests" description="Manage service requests for professional providers">
      <Breadcrumb title="Service Requests" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* VIEW DIALOG */}
      <ServiceRequestViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        serviceData={viewData}
      />

      {/* ADD/EDIT FORM */}
      {showForm && (
        <ServiceRequestForm
          onClose={() => {
            setShowForm(false);
            setIsEditMode(false);
            setEditData(null);
          }}
          onSubmit={handleSubmit}
          providerId={providerId}
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
              Manage all service requests and approvals
            </Typography>
          </Box>

          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" sx={{ pr: 2 }}>
            <TextField
              size="small"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 150, md: 250 }, bgcolor: 'background.paper' }}
            />
            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>

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
              sx={{ mr: 1 }}
            >
              Add Request
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
                border: 'none',
                '& .MuiDataGrid-main': { border: 'none' },
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: 'grey.50',
                  fontWeight: 600,
                  borderBottom: `2px solid ${theme.palette.divider}`
                },
                '& .MuiDataGrid-cell': {
                  padding: '6px 8px',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center'
                },
                '& .MuiDataGrid-row:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Styled Action Menu */}
      <StyledMenu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleEdit(selectedRow)}>
          <ListItemIcon>
            <IconEdit size={18} color={theme.palette.primary.main} />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleAddons(selectedRow)}>
          <ListItemIcon>
            <IconCurrencyDollar size={18} color={theme.palette.secondary.main} />
          </ListItemIcon>
          <ListItemText>Addons</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleView(selectedRow)}>
          <ListItemIcon>
            <IconEye size={18} color={theme.palette.info.main} />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleDelete(selectedRow)}>
          <ListItemIcon>
            <IconTrash size={18} color={theme.palette.error.main} />
          </ListItemIcon>
          <ListItemText>Delete Request</ListItemText>
        </MenuItem>
      </StyledMenu>
    </PageContainer>
  );
};

export default ServiceRequests;


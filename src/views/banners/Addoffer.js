import React, { useState, useEffect } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Paper,
  Box,
  Typography,
  Grid,
  styled,
  Select,
  MenuItem,
  Card,
  CardMedia,
  FormHelperText,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { IconArrowLeft, IconUpload, IconX, IconPercentage, IconCurrencyRupee } from '@tabler/icons-react';
import { URLS } from '../../Url';
import axios from 'axios';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/offers-management', title: 'Offers' },
  { title: 'Add Offer' },
];

// Styled Components
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const ImageUploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: '8px',
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

// Main AddOffer Component
const AddOffer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    serviceId: '',
    categoryId: '',
    couponCode: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscountAmount: '',
    minOrderAmount: '',
    startDate: null,
    endDate: null,
    status: 'active',
    usageLimit: '',
  });

  const [errors, setErrors] = useState({});

  const token = localStorage.getItem('token');

  console.log("token",token)

  // Fetch Services
const getServices = async () => {
  if (!token) return;

  try {
    const res = await axios.post(
      URLS.GetService,{},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (res.data.success) {
      setServices(res.data.services || []);
    }
  } catch (error) {
    console.error('Failed to fetch services:', error);
    toast.error('Failed to fetch services');
  }
};

  // Fetch Categories by Service ID
  const getCategoriesByServiceId = async (serviceId) => {
    if (!token || !serviceId) return;

    setLoadingCategories(true);
    try {
      const res = await axios.post(
        URLS.GetCategoriesByServiceId,
        { serviceId: serviceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        setCategories(res.data.category  || []);
      } else {
        setCategories([]);
        toast.warning('No categories found for this service');
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
      toast.error('Failed to fetch categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      navigate('/advertisments/offers');
      return;
    }
    getServices();
  }, []);

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If service is changed, reset category and fetch new categories
    if (name === 'serviceId') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        categoryId: '', // Reset category when service changes
      }));
      
      // Fetch categories for selected service
      if (value) {
        getCategoriesByServiceId(value);
      } else {
        setCategories([]);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Date Change
  const handleDateChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Image Upload
// Handle Image Upload - Simplified version
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Check if it starts with 'image/'
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  }
};

  // Remove Image
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  // Validate Form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.image) {
      newErrors.image = 'Image is required';
    }

    if (!formData.serviceId) {
      newErrors.serviceId = 'Service is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.couponCode.trim()) {
      newErrors.couponCode = 'Coupon code is required';
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = 'Discount value must be greater than 0';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'Percentage cannot exceed 100%';
    }

    if (!formData.maxDiscountAmount || formData.maxDiscountAmount <= 0) {
      newErrors.maxDiscountAmount = 'Max discount amount is required';
    }

    if (!formData.minOrderAmount || formData.minOrderAmount <= 0) {
      newErrors.minOrderAmount = 'Min order amount is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('image', formData.image);
      submitData.append('serviceId', formData.serviceId);
      submitData.append('categoryId', formData.categoryId);
      submitData.append('couponCode', formData.couponCode.toUpperCase());
      submitData.append('discountType', formData.discountType);
      submitData.append('discountValue', formData.discountValue);
      submitData.append('maxDiscountAmount', formData.maxDiscountAmount);
      submitData.append('minOrderAmount', formData.minOrderAmount);
      
      // Format dates to YYYY-MM-DD
      const startDateStr = formData.startDate.toISOString().split('T')[0];
      const endDateStr = formData.endDate.toISOString().split('T')[0];
      
      submitData.append('startDate', startDateStr);
      submitData.append('endDate', endDateStr);
      submitData.append('status', formData.status);

      if (formData.usageLimit) {
        submitData.append('usageLimit', formData.usageLimit);
      }

      const res = await axios.post(
        'http://192.168.0.5:5013/v1/dhubApi/admin/offers/addoffer',
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || 'Offer added successfully');
        setTimeout(() => {
          navigate('/offers-management');
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add offer';
      toast.error(errorMessage);
      console.error('Failed to add offer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Add Offer" description="Create a new offer">
      <Breadcrumb title="Add New Offer" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Back Button */}
      <Box mb={3}>
        <Button
          variant="outlined"
          startIcon={<IconArrowLeft />}
          onClick={() => navigate('/advertisments/offers')}
        >
          Back to Offers
        </Button>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
          p: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={3}>
          Offer Information
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="title">Title*</CustomFormLabel>
              <CustomTextField
                id="title"
                name="title"
                placeholder="Enter offer title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>

            {/* Coupon Code */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="couponCode">Coupon Code*</CustomFormLabel>
              <CustomTextField
                id="couponCode"
                name="couponCode"
                placeholder="Enter coupon code (e.g., SUMMER50)"
                value={formData.couponCode}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.couponCode}
                helperText={errors.couponCode}
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="description">Description*</CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                placeholder="Enter offer description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <CustomFormLabel>Offer Image*</CustomFormLabel>
              {!imagePreview ? (
                <ImageUploadBox onClick={() => document.getElementById('image-upload').click()}>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                  <IconUpload size={48} color={theme.palette.primary.main} />
                  <Typography variant="h6" mt={2}>
                    Click to upload image
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Supported formats: JPEG, PNG, GIF (Max 5MB)
                  </Typography>
                </ImageUploadBox>
              ) : (
                <Card sx={{ position: 'relative', maxWidth: 400 }}>
                  <CardMedia
                    component="img"
                    image={imagePreview}
                    alt="Offer preview"
                    sx={{ height: 250, objectFit: 'cover' }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'error.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'error.dark' },
                    }}
                    size="small"
                  >
                    <IconX size={20} />
                  </IconButton>
                </Card>
              )}
              {errors.image && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errors.image}
                </FormHelperText>
              )}
            </Grid>

            {/* Service Selection */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="serviceId">Service*</CustomFormLabel>
              <CustomSelect
                id="serviceId"
                name="serviceId"
                value={formData.serviceId}
                onChange={handleInputChange}
                fullWidth
                displayEmpty
                error={!!errors.serviceId}
              >
                <MenuItem value="" disabled>
                  Select Service
                </MenuItem>
                {services.map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    {service.name}
                  </MenuItem>
                ))}
              </CustomSelect>
              {errors.serviceId && (
                <FormHelperText error>{errors.serviceId}</FormHelperText>
              )}
            </Grid>

            {/* Category Selection - Dynamically loaded based on service */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="categoryId">Category*</CustomFormLabel>
              <CustomSelect
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                fullWidth
                displayEmpty
                error={!!errors.categoryId}
                disabled={!formData.serviceId || loadingCategories}
              >
                <MenuItem value="" disabled>
                  {!formData.serviceId
                    ? 'Select Service First'
                    : loadingCategories
                    ? 'Loading Categories...'
                    : 'Select Category'}
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </CustomSelect>
              {errors.categoryId && (
                <FormHelperText error>{errors.categoryId}</FormHelperText>
              )}
              {!formData.serviceId && (
                <FormHelperText>Please select a service first to load categories</FormHelperText>
              )}
            </Grid>

            {/* Discount Type */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="discountType">Discount Type*</CustomFormLabel>
              <CustomSelect
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleInputChange}
                fullWidth
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </CustomSelect>
            </Grid>

            {/* Discount Value */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="discountValue">Discount Value*</CustomFormLabel>
              <CustomTextField
                id="discountValue"
                name="discountValue"
                type="number"
                placeholder="Enter discount value"
                value={formData.discountValue}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.discountValue}
                helperText={errors.discountValue}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {formData.discountType === 'percentage' ? (
                        <IconPercentage size={20} />
                      ) : (
                        <IconCurrencyRupee size={20} />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Max Discount Amount */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="maxDiscountAmount">
                Max Discount Amount*
              </CustomFormLabel>
              <CustomTextField
                id="maxDiscountAmount"
                name="maxDiscountAmount"
                type="number"
                placeholder="Enter max discount amount"
                value={formData.maxDiscountAmount}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.maxDiscountAmount}
                helperText={errors.maxDiscountAmount}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconCurrencyRupee size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Min Order Amount */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="minOrderAmount">Min Order Amount*</CustomFormLabel>
              <CustomTextField
                id="minOrderAmount"
                name="minOrderAmount"
                type="number"
                placeholder="Enter minimum order amount"
                value={formData.minOrderAmount}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.minOrderAmount}
                helperText={errors.minOrderAmount}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconCurrencyRupee size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Start Date */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="startDate">Start Date*</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.startDate}
                  onChange={(value) => handleDateChange('startDate', value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDate,
                      helperText: errors.startDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* End Date */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="endDate">End Date*</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.endDate}
                  onChange={(value) => handleDateChange('endDate', value)}
                  minDate={formData.startDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Usage Limit */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="usageLimit">
                Usage Limit (Optional)
              </CustomFormLabel>
              <CustomTextField
                id="usageLimit"
                name="usageLimit"
                type="number"
                placeholder="Leave empty for unlimited"
                value={formData.usageLimit}
                onChange={handleInputChange}
                fullWidth
                helperText="Number of times this offer can be used"
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="status">Status*</CustomFormLabel>
              <CustomSelect
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                fullWidth
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </CustomSelect>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/advertisments/offers')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Adding Offer...' : 'Add Offer'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </PageContainer>
  );
};

export default AddOffer;


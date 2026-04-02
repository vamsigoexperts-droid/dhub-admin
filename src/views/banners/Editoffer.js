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
  TextField,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { IconArrowLeft, IconUpload, IconX, IconPercentage, IconCurrencyRupee } from '@tabler/icons-react';
import { URLS } from '../../Url';
import axios from 'axios';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/offers-management', title: 'Offers' },
  { title: 'Edit Offer' },
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

// Main EditOffer Component
const EditOffer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
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
        setCategories(res.data.category || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch Offer Data by ID
  const getOfferData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      navigate('/advertisments/offers');
      return;
    }

    setPageLoading(true);
    try {
      const res = await axios.get(
        `https://api.doorstephub.com/v1/dhubApi/admin/offers/getoffer/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const offer = res.data.data;

        // Set form data with existing values
        setFormData({
          title: offer.title || '',
          description: offer.description || '',
          image: null,
          serviceId: offer.serviceId || '',
          categoryId: offer.categoryId || '',
          couponCode: offer.couponCode || '',
          discountType: offer.discountType || 'percentage',
          discountValue: offer.discountValue || '',
          maxDiscountAmount: offer.maxDiscountAmount || '',
          minOrderAmount: offer.minOrderAmount || '',
          startDate: offer.startDate ? new Date(offer.startDate) : null,
          endDate: offer.endDate ? new Date(offer.endDate) : null,
          status: offer.status || 'active',
          usageLimit: offer.usageLimit || '',
        });

        // Set existing image
        if (offer.image) {
          setExistingImage(offer.image);
          setImagePreview(`${URLS.FileBase}${offer.image}`);
        }

        // Fetch categories for the selected service
        if (offer.serviceId) {
          getCategoriesByServiceId(offer.serviceId);
        }
      } else {
        toast.error(res.data.message || 'Failed to fetch offer details');
        navigate('/offers/editoffer');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch offer details';
      toast.error(errorMessage);
      console.error('Failed to fetch offer:', error);
      navigate('/offers/editoffer');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      navigate('/offers-management');
      return;
    }
    getServices();
    getOfferData();
  }, [id]);

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

    // Restore existing image if available
    if (existingImage) {
      setImagePreview(`${URLS.FileBase}${existingImage}`);
    } else {
      setImagePreview(null);
    }
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
      // Prepare update data
      const updateData = {
        title: formData.title,
        description: formData.description,
        serviceId: formData.serviceId,
        categoryId: formData.categoryId,
        couponCode: formData.couponCode.toUpperCase(),
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        maxDiscountAmount: formData.maxDiscountAmount,
        minOrderAmount: formData.minOrderAmount,
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate.toISOString().split('T')[0],
        status: formData.status,
      };

      if (formData.usageLimit) {
        updateData.usageLimit = formData.usageLimit;
      }

      // If new image is uploaded, use FormData
      if (formData.image) {
        const formDataToSend = new FormData();
        Object.keys(updateData).forEach((key) => {
          formDataToSend.append(key, updateData[key]);
        });
        formDataToSend.append('image', formData.image);

        const res = await axios.put(
          `https://api.doorstephub.com/v1/dhubApi/admin/offers/updateoffer/${id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (res.data.success) {
          toast.success(res.data.message || 'Offer updated successfully');
          setTimeout(() => {
            navigate('/offers-management');
          }, 1500);
        }
      } else {
        // If no new image, send JSON data
        const res = await axios.put(
          `https://api.doorstephub.com/v1/dhubApi/admin/offers/updateoffer/${id}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (res.data.success) {
          toast.success(res.data.message || 'Offer updated successfully');
          setTimeout(() => {
            navigate('/offers-management');
          }, 1500);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update offer';
      toast.error(errorMessage);
      console.error('Failed to update offer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <PageContainer title="Loading..." description="Loading offer details">
        <Breadcrumb title="Edit Offer" items={BCrumb} />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Offer" description="Update offer details">
      <Breadcrumb title="Edit Offer" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Back Button */}
      <Box mb={3}>
        <Button
          variant="outlined"
          startIcon={<IconArrowLeft />}
          onClick={() => navigate('/advertisments/addoffer')}
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
          Edit Offer Information
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
              <CustomFormLabel>Offer Image</CustomFormLabel>
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
                    Click to upload new image
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Supported formats: All image types (Max 5MB)
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
                  {formData.image && (
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
                  )}
                  <Box mt={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => document.getElementById('image-upload').click()}
                    >
                      Change Image
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </Box>
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
              {errors.serviceId && <FormHelperText error>{errors.serviceId}</FormHelperText>}
            </Grid>

            {/* Category Selection - Dynamic based on service */}
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
                    : categories.length === 0
                    ? 'No Categories Available'
                    : 'Select Category'}
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </CustomSelect>
              {errors.categoryId && <FormHelperText error>{errors.categoryId}</FormHelperText>}
              {formData.serviceId && !loadingCategories && categories.length > 0 && (
                <FormHelperText>{categories.length} categories available</FormHelperText>
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
              <CustomFormLabel htmlFor="maxDiscountAmount">Max Discount Amount*</CustomFormLabel>
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
              <CustomFormLabel htmlFor="usageLimit">Usage Limit (Optional)</CustomFormLabel>
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
                <MenuItem value="expired">Expired</MenuItem>
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
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? 'Updating Offer...' : 'Update Offer'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </PageContainer>
  );
};

export default EditOffer;


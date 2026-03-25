import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { IconArrowBackUp } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingButton } from '@mui/lab';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Button,
  IconButton,
  Stack,
  Switch,
  FormControlLabel,
  styled,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';

// Styled Components
const CustomSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: '16px',
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.grey[100],
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
    borderColor: theme.palette.primary.dark,
  },
}));

const AddDish = () => {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // State Management
  const [formData, setFormData] = useState({
    dishName: '',
    itemCodeSku: '',
    cuisinetypeId: [],
    categoryId: '',
    subcategoryId: '',
    shortDescription: '',
    fullDescription: '',
    isPopularRecommended: false,
    itemType: '',
    basePrice: '',
    offerPriceDiscount: '',
    taxRate: '',
    variantsCustomizations: [{ name: '', basePrice: '', offerPriceDiscount: '', taxRate: '' }],
    addOnGroups: [{ name: '', price: '' }],
    comboAvailable: false,
    pricingBasedOnSizeWeight: false,
    tags: [],
    dietaryLabels: [],
    allergenInfo: [],
    caloriesNutritionInfo: '',
    stockStatus: 'inStock',
    preparationTimeMins: '',
    maximumServingQuantity: '',
    availabilitySchedule: [{ day: '', fromTime: '', toTime: '' }],
    preOrderAllowed: false,
    packagingCharge: '',
    deliveryEligibility: true,
    deliveryTimeEstimate: '',
    pickupOptionAvailable: true,
    zoneId: [],
    isFeaturedOnHomepage: false,
    enableReviewsRatings: false,
    liveTrackingCompatible: false,
    kitchenDisplayCode: '',
    outOfStockAlertThreshold: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    discountValue: '',
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [zones, setZones] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    cuisineTypes: false,
    categories: false,
    subcategories: false,
    zones: false,
  });

  // Constants
  const MAX_IMAGES = 5;
  const MAX_TIME_SLOTS = 5;
  const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
  const VIDEO_MAX_SIZE = 10 * 1024 * 1024;
  const allowedExtensions = [
    '.JPG',
    '.JPEG',
    '.PNG',
    '.GIF',
    '.WEBP',
    '.AVIF',
    '.HEIF',
    '.HEIC',
    '.CR2',
    '.CR3',
    '.NEF',
    '.ARW',
    '.ORF',
    '.RW2',
    '.PEF',
    '.RAF',
    '.DNG',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.avif',
    '.heif',
    '.heic',
    '.cr2',
    '.cr3',
    '.nef',
    '.arw',
    '.orf',
    '.rw2',
    '.pef',
    '.raf',
    '.dng',
  ];

  // Token Retrieval
  const getToken = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      console.error('Error retrieving token:', error);
      return '';
    }
  }, []);

  const token = getToken();

  // API Calls
  const fetchData = useCallback(
    async (url, key, setData, loadingKey, body = {}) => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        navigate('/login');
        return;
      }
      try {
        setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));
        const response = await axios.post(url, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.success) {
          setData(response.data[key] || []);
        } else {
          throw new Error(`Failed to fetch ${key}`);
        }
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        toast.error(`Failed to fetch ${key}`);
        setData([]);
      } finally {
        setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
      }
    },
    [token, navigate],
  );

  useEffect(() => {
    if (token) {
      fetchData(URLS.GetCuisineTypes, 'cuisinetype', setCuisineTypes, 'cuisineTypes', {
        flagType: 'food',
      });
      fetchData(URLS.GetCategories, 'category', setCategories, 'categories', {
        flagType: 'food',
      });
      fetchData(URLS.GetZones, 'zones', setZones, 'zones');
    } else {
      toast.error('Please log in to continue.');
      navigate('/login');
    }
  }, [token, fetchData, navigate]);

  useEffect(() => {
    if (formData.categoryId) {
      fetchData(URLS.GetCategorieIdbySubCategory, 'data', setSubcategories, 'subcategories', {
        categoryId: formData.categoryId,
      });
    } else {
      setSubcategories([]);
      setFormData((prev) => ({ ...prev, subcategoryId: '' }));
    }
  }, [formData.categoryId, fetchData]);

  // Event Handlers
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      const basePrice = parseFloat(newData.basePrice) || 0;
      const offerPriceDiscount = parseFloat(newData.offerPriceDiscount) || 0;

      let formatted = '';
      if (basePrice > 0 && offerPriceDiscount > 0 && offerPriceDiscount < basePrice) {
        const percentage = ((basePrice - offerPriceDiscount) / basePrice) * 100;
        const p = Number(percentage.toFixed(1));
        formatted = Number.isInteger(p) ? `${Math.trunc(p)}%` : `${p.toFixed(1)}%`;
      }

      newData.discountValue = formatted;
      return newData;
    });
  }, []);

  const handleMultiSelectChange = useCallback((e, name) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
  }, []);

  const handleVariantChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variantsCustomizations];
      newVariants[index][field] = value;
      return { ...prev, variantsCustomizations: newVariants };
    });
  }, []);

  const handleImageUpload = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      if (images.length + files.length > MAX_IMAGES) {
        toast.error(`Maximum ${MAX_IMAGES} images allowed`);
        return;
      }

      const validFiles = files.filter((file) => {
        const extension = '.' + file.name.split('.').pop();
        if (!allowedExtensions.includes(extension)) {
          toast.error(
            `Invalid file format: ${file.name}. Allowed formats: ${allowedExtensions.join(', ')}`,
          );
          return false;
        }
        if (file.size > IMAGE_MAX_SIZE) {
          toast.error('Image size must be less than 5MB');
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      setImages((prev) => [...prev, ...validFiles]);
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    },
    [images.length, allowedExtensions],
  );

  const handleThumbnailUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const extension = '.' + file.name.split('.').pop();
      if (!allowedExtensions.includes(extension)) {
        toast.error(
          `Invalid file format: ${file.name}. Allowed formats: ${allowedExtensions.join(', ')}`,
        );
        return;
      }
      if (file.size > IMAGE_MAX_SIZE) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    },
    [allowedExtensions],
  );

  const handleVideoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Only video files are allowed');
      return;
    }
    if (file.size > VIDEO_MAX_SIZE) {
      toast.error('Video size must be less than 10MB');
      return;
    }

    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  }, []);

  const removeImage = useCallback((idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => {
      const previewToRemove = prev[idx];
      URL.revokeObjectURL(previewToRemove);
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const removeThumbnail = useCallback(() => {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnail(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
  }, [thumbnailPreview]);

  const removeVideo = useCallback(() => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideo(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  }, [videoPreview]);

const handleTagChange = useCallback((e) => {
  const value = e.target.value;
  if (value.includes(',')) {
    const newTags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== ''); // Removed length limit
    if (newTags.length > 0) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, ...newTags], // No slice limit
      }));
      e.target.value = '';
    }
  }
}, []);

const handleTagKeyDown = useCallback((e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const value = e.target.value.trim();
    if (value) { // Removed length limit
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, value], // No slice limit
      }));
      e.target.value = '';
    }
  }
}, []);


  const removeTag = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  }, []);

const handleKeywordChange = useCallback((e) => {
  const value = e.target.value;
  if (value.includes(',')) {
    const newKeywords = value
      .split(',')
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword !== ''); // Removed length limit
    if (newKeywords.length > 0) {
      setFormData((prev) => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, ...newKeywords], // No slice limit
      }));
      e.target.value = '';
    }
  }
}, []);
const handleKeywordKeyDown = useCallback((e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const value = e.target.value.trim();
    if (value) { // Removed length limit
      setFormData((prev) => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, value], // No slice limit
      }));
      e.target.value = '';
    }
  }
}, []);


  const removeKeyword = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter((_, i) => i !== index),
    }));
  }, []);

  const addVariant = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      variantsCustomizations: [
        ...prev.variantsCustomizations,
        { name: '', basePrice: '', offerPriceDiscount: '', taxRate: '' },
      ],
    }));
  }, []);

  const removeVariant = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      variantsCustomizations: prev.variantsCustomizations.filter((_, i) => i !== index),
    }));
  }, []);

  const handleAddOnChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const newAddOns = [...prev.addOnGroups];
      newAddOns[index][field] = value;
      return { ...prev, addOnGroups: newAddOns };
    });
  }, []);

  const addAddOn = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      addOnGroups: [...prev.addOnGroups, { name: '', price: '' }],
    }));
  }, []);

  const removeAddOn = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      addOnGroups: prev.addOnGroups.filter((_, i) => i !== index),
    }));
  }, []);

  const handleTimeSlotChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const newTimeSlots = [...prev.availabilitySchedule];
      newTimeSlots[index][field] = value;
      return { ...prev, availabilitySchedule: newTimeSlots };
    });
  }, []);

  const addTimeSlot = useCallback(() => {
    if (formData.availabilitySchedule.length >= MAX_TIME_SLOTS) {
      toast.error(`Maximum ${MAX_TIME_SLOTS} time slots allowed`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      availabilitySchedule: [...prev.availabilitySchedule, { day: '', fromTime: '', toTime: '' }],
    }));
  }, [formData.availabilitySchedule.length]);

  const removeTimeSlot = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      availabilitySchedule: prev.availabilitySchedule.filter((_, i) => i !== index),
    }));
  }, []);

  // Form Submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validation for required fields
      if (!formData.dishName.trim()) {
        toast.error('Dish Name is required');
        return;
      }
      if (!formData.cuisinetypeId.length) {
        toast.error('Cuisine Type is required');
        return;
      }
      if (!formData.categoryId) {
        toast.error('Category is required');
        return;
      }
      if (!formData.subcategoryId) {
        toast.error('Subcategory is required');
        return;
      }
      if (!formData.shortDescription.trim()) {
        toast.error('Short Description is required');
        return;
      }
      if (!formData.fullDescription.trim()) {
        toast.error('Full Description is required');
        return;
      }
      if (!formData.itemType) {
        toast.error('Item Type is required');
        return;
      }
      if (images.length === 0) {
        toast.error('Dish Image(s) is required');
        return;
      }
      if (!thumbnail) {
        toast.error('Thumbnail Image is required');
        return;
      }
      if (!formData.stockStatus) {
        toast.error('Stock Status is required');
        return;
      }
      if (!formData.packagingCharge || formData.packagingCharge.trim() === '') {
        toast.error('Packaging Charge is required');
        return;
      }
      if (formData.deliveryEligibility === undefined || formData.deliveryEligibility === null) {
        toast.error('Delivery Eligibility is required');
        return;
      }
      if (!formData.outOfStockAlertThreshold || formData.outOfStockAlertThreshold.trim() === '') {
        toast.error('Out-of-Stock Alert Threshold is required');
        return;
      }

      setLoading(true);
      try {
        const fd = new FormData();
        const submitData = {
          ...formData,
        };
        Object.entries(submitData).forEach(([key, value]) => {
          if (key === 'metaKeywords' || key === 'tags') {
            fd.append(key, value.join(','));
          } else if (
            key === 'cuisinetypeId' ||
            key === 'dietaryLabels' ||
            key === 'allergenInfo' ||
            key === 'zoneId' ||
            key === 'variantsCustomizations' ||
            key === 'addOnGroups' ||
            key === 'availabilitySchedule'
          ) {
            fd.append(key, JSON.stringify(value));
          } else {
            fd.append(key, value);
          }
        });
        images.forEach((img) => fd.append('dishImages', img));
        if (thumbnail) fd.append('thumbnailImage', thumbnail);
        if (video) fd.append('video', video);

        const response = await axios.post(URLS.AddFoodItem, fd, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });

        if (response.data?.success) {
          toast.success('Dish added successfully!');
          handleReset();
          navigate('/food-item');
        } else {
          throw new Error(response.data?.message || 'Failed to add dish');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        let errorMessage = 'Failed to add dish. Please try again.';
        if (error.response?.status === 401) {
          errorMessage = 'Unauthorized: Please log in again.';
          navigate('/login');
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [formData, images, thumbnail, video, token, navigate],
  );

  // Reset Form
  const handleReset = useCallback(() => {
    setFormData({
      dishName: '',
      itemCodeSku: '',
      cuisinetypeId: [],
      categoryId: '',
      subcategoryId: '',
      shortDescription: '',
      fullDescription: '',
      isPopularRecommended: false,
      itemType: '',
      basePrice: '',
      offerPriceDiscount: '',
      taxRate: '',
      variantsCustomizations: [{ name: '', basePrice: '', offerPriceDiscount: '', taxRate: '' }],
      addOnGroups: [{ name: '', price: '' }],
      comboAvailable: false,
      pricingBasedOnSizeWeight: false,
      tags: [],
      dietaryLabels: [],
      allergenInfo: [],
      caloriesNutritionInfo: '',
      stockStatus: 'inStock',
      preparationTimeMins: '',
      maximumServingQuantity: '',
      availabilitySchedule: [{ day: '', fromTime: '', toTime: '' }],
      preOrderAllowed: false,
      packagingCharge: '',
      deliveryEligibility: true,
      deliveryTimeEstimate: '',
      pickupOptionAvailable: true,
      zoneId: [],
      isFeaturedOnHomepage: false,
      enableReviewsRatings: false,
      liveTrackingCompatible: false,
      kitchenDisplayCode: '',
      outOfStockAlertThreshold: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      discountValue: '',
    });
    setImages([]);
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
    setThumbnail(null);
    setThumbnailPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setVideo(null);
    setVideoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  }, []);

  // Breadcrumb Configuration
  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Add Dish' }];

  const generateSku = () => {
    const sku = `SKU${Date.now().toString().slice(-8)}`;
    setFormData((prev) => ({ ...prev, itemCodeSku: sku }));
  };

  return (
    <PageContainer title="Add Dish">
      <Breadcrumb title="Add Dish" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          startIcon={<IconArrowBackUp />}
          disabled={loading}
          aria-label="Back to previous page"
        >
          Back
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Basic Dish Information */}
        <ParentCard title="Basic Dish Information" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="dishName">
                Dish Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                id="dishName"
                name="dishName"
                value={formData.dishName}
                onChange={handleChange}
                placeholder="E.g., Margherita Pizza"
                inputProps={{ 'aria-label': 'Dish Name', required: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="itemCodeSku">Item Code / SKU</CustomFormLabel>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <CustomTextField
                  fullWidth
                  id="itemCodeSku"
                  name="itemCodeSku"
                  value={formData.itemCodeSku}
                  onChange={handleChange}
                  placeholder="E.g., DISH123456"
                  inputProps={{ 'aria-label': 'Item Code' }}
                />
                <Button variant="outlined" onClick={generateSku} sx={{ minWidth: 'auto', px: 2 }}>
                  Generate
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="cuisinetypeId">
                Cuisine Type <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <TextField
                select
                SelectProps={{
                  multiple: true,
                  value: formData.cuisinetypeId,
                  onChange: (e) => handleMultiSelectChange(e, 'cuisinetypeId'),
                  renderValue: (selected) =>
                    selected
                      .map((id) => cuisineTypes.find((c) => c._id === id)?.name || '')
                      .join(', '),
                }}
                id="cuisinetypeId"
                name="cuisinetypeId"
                fullWidth
                disabled={loadingStates.cuisineTypes}
                required
              >
                {loadingStates.cuisineTypes ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : cuisineTypes.length === 0 ? (
                  <MenuItem disabled>No cuisine types available</MenuItem>
                ) : (
                  cuisineTypes.map((cuisine) => (
                    <MenuItem key={cuisine._id} value={cuisine._id}>
                      {cuisine.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="categoryId">
                Category <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                fullWidth
                disabled={loadingStates.categories}
                required
              >
                <MenuItem value="">Select Category</MenuItem>
                {loadingStates.categories ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : categories.length === 0 ? (
                  <MenuItem disabled>No categories available</MenuItem>
                ) : (
                  categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))
                )}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="subcategoryId">
                Subcategory <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                id="subcategoryId"
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleChange}
                fullWidth
                disabled={!formData.categoryId || loadingStates.subcategories}
                required
              >
                <MenuItem value="">Select Subcategory</MenuItem>
                {loadingStates.subcategories ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : subcategories.length === 0 ? (
                  <MenuItem disabled>No subcategories available</MenuItem>
                ) : (
                  subcategories.map((subcategory) => (
                    <MenuItem key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </MenuItem>
                  ))
                )}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="shortDescription">
                Short Description <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Brief overview (100–200 characters)"
                inputProps={{ maxLength: 200, 'aria-label': 'Short Description', required: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="fullDescription">
                Full Description <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                multiline
                rows={4}
                id="fullDescription"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                placeholder="Detailed information about the dish"
                inputProps={{ 'aria-label': 'Full Description', required: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPopularRecommended}
                    onChange={handleChange}
                    name="isPopularRecommended"
                    color="primary"
                  />
                }
                label="Popular / Recommended"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="itemType">
                Item Type <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                id="itemType"
                name="itemType"
                value={formData.itemType}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="Veg">Veg</MenuItem>
                <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                <MenuItem value="Vegan">Vegan</MenuItem>
                <MenuItem value="Jain">Jain</MenuItem>
                <MenuItem value="Eggetarian">Eggetarian</MenuItem>
              </CustomSelect>
            </Grid>
          </Grid>
        </ParentCard>

        {/* Media & Presentation */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardHeader title={`Dish Images (${images.length}/${MAX_IMAGES}) *`} />
              <Divider />
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <UploadBox onClick={() => imageInputRef.current?.click()}>
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                      Upload Images
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Choose up to {MAX_IMAGES} images
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Supported: JPG, PNG, etc. (Max: 5MB each)
                    </Typography>
                  </UploadBox>
                  <input
                    ref={imageInputRef}
                    type="file"
                    hidden
                    accept={allowedExtensions.join(',')}
                    multiple
                    onChange={handleImageUpload}
                    disabled={images.length >= MAX_IMAGES}
                    aria-label="Upload dish images"
                  />
                  {imagePreviews.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Preview Images
                      </Typography>
                      <Grid container spacing={1}>
                        {imagePreviews.map((src, idx) => (
                          <Grid item xs={6} sm={4} key={idx}>
                            <Box
                              sx={{
                                position: 'relative',
                                border: '2px solid',
                                borderColor: 'primary.main',
                                borderRadius: 2,
                                overflow: 'hidden',
                                '&:hover .delete-btn': {
                                  opacity: 1,
                                },
                              }}
                            >
                              <img
                                src={src}
                                alt={`Preview ${idx + 1}`}
                                style={{
                                  width: '100%',
                                  height: '100px',
                                  objectFit: 'cover',
                                  display: 'block',
                                }}
                              />
                              <IconButton
                                className="delete-btn"
                                size="small"
                                onClick={() => removeImage(idx)}
                                sx={{
                                  position: 'absolute',
                                  top: 4,
                                  right: 4,
                                  bgcolor: 'error.main',
                                  color: 'white',
                                  opacity: 0,
                                  transition: 'opacity 0.3s',
                                  '&:hover': {
                                    bgcolor: 'error.dark',
                                    opacity: 1,
                                  },
                                }}
                                aria-label={`Remove image ${idx + 1}`}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Thumbnail Image *" />
              <Divider />
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <UploadBox onClick={() => thumbnailInputRef.current?.click()}>
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                      Upload Thumbnail
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Display image in listings
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Supported: JPG, PNG, etc. (Max: 5MB)
                    </Typography>
                  </UploadBox>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    hidden
                    accept={allowedExtensions.join(',')}
                    onChange={handleThumbnailUpload}
                    aria-label="Upload thumbnail image"
                  />
                  {thumbnailPreview && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Thumbnail Preview
                      </Typography>
                      <Box
                        sx={{
                          position: 'relative',
                          border: '2px solid',
                          borderColor: 'primary.main',
                          borderRadius: 2,
                          overflow: 'hidden',
                          width: '200px',
                          mx: 'auto',
                          '&:hover .delete-btn': {
                            opacity: 1,
                          },
                        }}
                      >
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                        <IconButton
                          className="delete-btn"
                          size="small"
                          onClick={removeThumbnail}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'error.main',
                            color: 'white',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                            '&:hover': {
                              bgcolor: 'error.dark',
                              opacity: 1,
                            },
                          }}
                          aria-label="Remove thumbnail"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Video / Promo Clip" />
              <Divider />
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <UploadBox onClick={() => videoInputRef.current?.click()}>
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                      Upload Video
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Optional promotional video
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Supported: MP4, MOV (Max: 10MB)
                    </Typography>
                  </UploadBox>
                  <input
                    ref={videoInputRef}
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={handleVideoUpload}
                    aria-label="Upload video"
                  />
                  {videoPreview && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Video Preview
                      </Typography>
                      <Box
                        sx={{
                          position: 'relative',
                          border: '2px solid',
                          borderColor: 'primary.main',
                          borderRadius: 2,
                          overflow: 'hidden',
                          width: '200px',
                          mx: 'auto',
                          '&:hover .delete-btn': {
                            opacity: 1,
                          },
                        }}
                      >
                        <video
                          src={videoPreview}
                          controls
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                        <IconButton
                          className="delete-btn"
                          size="small"
                          onClick={removeVideo}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'error.main',
                            color: 'white',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                            '&:hover': {
                              bgcolor: 'error.dark',
                              opacity: 1,
                            },
                          }}
                          aria-label="Remove video"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pricing & Variants */}
        <ParentCard title="Pricing & Variants" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="basePrice">
                Base Price (₹) <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                type="number"
                id="basePrice"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01, 'aria-label': 'Base Price' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="offerPriceDiscount">
                Offer Price (₹) <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                type="number"
                id="offerPriceDiscount"
                name="offerPriceDiscount"
                value={formData.offerPriceDiscount}
                onChange={handleChange}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01, 'aria-label': 'Offer Price' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel>Discount Value</CustomFormLabel>
              <CustomTextField
                disabled
                fullWidth
                value={formData.discountValue}
                placeholder="Discount Value"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="taxRate">Tax Rate (%)</CustomFormLabel>
              <CustomTextField
                fullWidth
                type="number"
                id="taxRate"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01, 'aria-label': 'Tax Rate' }}
                helperText="GST or local food tax"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.pricingBasedOnSizeWeight}
                    onChange={handleChange}
                    name="pricingBasedOnSizeWeight"
                    color="primary"
                  />
                }
                label="Pricing Based on Size/Weight"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel>Variants / Customizations</CustomFormLabel>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Variant Name</TableCell>
                      <TableCell>Base Price (₹)</TableCell>
                      <TableCell>Offer Price (₹)</TableCell>
                      <TableCell>Tax Rate (%)</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.variantsCustomizations.map((variant, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <CustomTextField
                            fullWidth
                            value={variant.name}
                            onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                            placeholder="E.g., Small"
                            inputProps={{ 'aria-label': `Variant Name ${index + 1}` }}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            fullWidth
                            type="number"
                            value={variant.basePrice}
                            onChange={(e) =>
                              handleVariantChange(index, 'basePrice', e.target.value)
                            }
                            placeholder="0.00"
                            inputProps={{
                              min: 0,
                              step: 0.01,
                              'aria-label': `Variant Base Price ${index + 1}`,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            fullWidth
                            type="number"
                            value={variant.offerPriceDiscount}
                            onChange={(e) =>
                              handleVariantChange(index, 'offerPriceDiscount', e.target.value)
                            }
                            placeholder="0.00"
                            inputProps={{
                              min: 0,
                              step: 0.01,
                              'aria-label': `Variant Offer Price ${index + 1}`,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            fullWidth
                            type="number"
                            value={variant.taxRate}
                            onChange={(e) => handleVariantChange(index, 'taxRate', e.target.value)}
                            placeholder="0.00"
                            inputProps={{
                              min: 0,
                              step: 0.01,
                              'aria-label': `Variant Tax Rate ${index + 1}`,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => removeVariant(index)}
                            disabled={formData.variantsCustomizations.length === 1}
                            aria-label={`Remove variant ${index + 1}`}
                          >
                            <CloseIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button onClick={addVariant} sx={{ mt: 2 }} aria-label="Add variant">
                Add Variant
              </Button>
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel>Add-on Groups</CustomFormLabel>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Add-on Name</TableCell>
                      <TableCell>Price (₹)</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.addOnGroups.map((addOn, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <CustomTextField
                            fullWidth
                            value={addOn.name}
                            onChange={(e) => handleAddOnChange(index, 'name', e.target.value)}
                            placeholder="E.g., Extra Cheese"
                            inputProps={{ 'aria-label': `Add-on Name ${index + 1}` }}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            fullWidth
                            type="number"
                            value={addOn.price}
                            onChange={(e) => handleAddOnChange(index, 'price', e.target.value)}
                            placeholder="0.00"
                            inputProps={{
                              min: 0,
                              step: 0.01,
                              'aria-label': `Add-on Price ${index + 1}`,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => removeAddOn(index)}
                            disabled={formData.addOnGroups.length === 1}
                            aria-label={`Remove add-on ${index + 1}`}
                          >
                            <CloseIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button onClick={addAddOn} sx={{ mt: 2 }} aria-label="Add add-on">
                Add Add-on
              </Button>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.comboAvailable}
                    onChange={handleChange}
                    name="comboAvailable"
                    color="primary"
                  />
                }
                label="Combo Available"
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Tags, Dietary & Allergen Info */}
        <ParentCard title="Tags, Dietary & Allergen Info" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="tags">Tags / Keywords</CustomFormLabel>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1,
                  '&:hover': {
                    borderColor: 'text.primary',
                  },
                  '&:focus-within': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                }}
              >
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeTag(index)}
                    sx={{ mr: 0.5 }}
                    aria-label={`Remove tag ${tag}`}
                  />
                ))}
                <CustomTextField
                  variant="standard"
                  onChange={handleTagChange}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type tags, press Enter or comma to add"
                  InputProps={{ disableUnderline: true }}
                  sx={{ flexGrow: 1 }}
                  inputProps={{  'aria-label': 'Tags' }}
                />
              </Box>
              <FormHelperText>Type comma or press Enter to add tags</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="dietaryLabels">Dietary Labels</CustomFormLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {[
                  'Vegan',
                  'Gluten-Free',
                  'Keto',
                  'Halal',
                  'Egg-Free',
                  'Dairy-Free',
                  'Vegetarian',
                  'Sugar-Free',
                  'Low-Fat',
                ].map((label) => (
                  <FormControlLabel
                    key={label}
                    control={
                      <Checkbox
                        checked={formData.dietaryLabels.includes(label)}
                        onChange={(e) => {
                          const newLabels = e.target.checked
                            ? [...formData.dietaryLabels, label]
                            : formData.dietaryLabels.filter((l) => l !== label);
                          handleMultiSelectChange(
                            { target: { value: newLabels } },
                            'dietaryLabels',
                          );
                        }}
                      />
                    }
                    label={label}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="allergenInfo">Allergen Info</CustomFormLabel>
              <TextField
                select
                SelectProps={{
                  multiple: true,
                  value: formData.allergenInfo,
                  onChange: (e) => handleMultiSelectChange(e, 'allergenInfo'),
                  renderValue: (selected) => selected.join(', '),
                }}
                id="allergenInfo"
                name="allergenInfo"
                fullWidth
              >
                {['Nuts', 'Dairy', 'Shellfish', 'Soy', 'Eggs'].map((allergen) => (
                  <MenuItem key={allergen} value={allergen}>
                    {allergen}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="caloriesNutritionInfo">
                Calories / Nutrition Info
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                multiline
                rows={4}
                id="caloriesNutritionInfo"
                name="caloriesNutritionInfo"
                value={formData.caloriesNutritionInfo}
                onChange={handleChange}
                placeholder="E.g., 500 kcal, Protein: 20g, Carbs: 50g"
                inputProps={{ 'aria-label': 'Nutrition Info' }}
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Inventory & Availability */}
        <ParentCard title="Inventory & Availability" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="stockStatus">
                Stock Status <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                id="stockStatus"
                name="stockStatus"
                value={formData.stockStatus}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="inStock">In Stock</MenuItem>
                <MenuItem value="outOfStock">Out of Stock</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="preparationTimeMins">
                Preparation Time (mins) <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                required
                type="number"
                id="preparationTimeMins"
                name="preparationTimeMins"
                value={formData.preparationTimeMins}
                onChange={handleChange}
                placeholder="E.g., 15"
                inputProps={{ min: 0, 'aria-label': 'Preparation Time' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="maximumServingQuantity">
                Maximum Serving Quantity <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                required
                type="number"
                id="maximumServingQuantity"
                name="maximumServingQuantity"
                value={formData.maximumServingQuantity}
                onChange={handleChange}
                placeholder="E.g., 100"
                inputProps={{ min: 0, 'aria-label': 'Maximum Serving Quantity' }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="availabilitySchedule">
                Availability Schedule
              </CustomFormLabel>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.availabilitySchedule.map((slot, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <CustomSelect
                            value={slot.day}
                            onChange={(e) => handleTimeSlotChange(index, 'day', e.target.value)}
                            fullWidth
                            inputProps={{ 'aria-label': `Time Slot Day ${index + 1}` }}
                          >
                            <MenuItem value="">Select Day</MenuItem>
                            {[
                              'Monday',
                              'Tuesday',
                              'Wednesday',
                              'Thursday',
                              'Friday',
                              'Saturday',
                              'Sunday',
                            ].map((day) => (
                              <MenuItem key={day} value={day}>
                                {day}
                              </MenuItem>
                            ))}
                          </CustomSelect>
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            fullWidth
                            type="time"
                            value={slot.fromTime}
                            onChange={(e) =>
                              handleTimeSlotChange(index, 'fromTime', e.target.value)
                            }
                            placeholder="HH:MM"
                            inputProps={{ 'aria-label': `Time Slot Start ${index + 1}` }}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            fullWidth
                            type="time"
                            value={slot.toTime}
                            onChange={(e) => handleTimeSlotChange(index, 'toTime', e.target.value)}
                            placeholder="HH:MM"
                            inputProps={{ 'aria-label': `Time Slot End ${index + 1}` }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => removeTimeSlot(index)}
                            disabled={formData.availabilitySchedule.length === 1}
                            aria-label={`Remove time slot ${index + 1}`}
                          >
                            <CloseIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                onClick={addTimeSlot}
                sx={{ mt: 2 }}
                aria-label="Add time slot"
                disabled={formData.availabilitySchedule.length >= MAX_TIME_SLOTS}
              >
                Add Time Slot
              </Button>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.preOrderAllowed}
                    onChange={handleChange}
                    name="preOrderAllowed"
                    color="primary"
                  />
                }
                label="Pre-Order Allowed"
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Location, Delivery & Packaging */}
        <ParentCard title="Location, Delivery & Packaging" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="packagingCharge">
                Packaging Charge (₹) <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                type="number"
                id="packagingCharge"
                name="packagingCharge"
                value={formData.packagingCharge}
                onChange={handleChange}
                placeholder="0.00"
                inputProps={{
                  min: 0,
                  step: 0.01,
                  'aria-label': 'Packaging Charge',
                  required: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.deliveryEligibility}
                    onChange={handleChange}
                    name="deliveryEligibility"
                    color="primary"
                  />
                }
                label="Delivery Eligibility"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="deliveryTimeEstimate">
                Delivery Time Estimate (mins)
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                type="number"
                id="deliveryTimeEstimate"
                name="deliveryTimeEstimate"
                value={formData.deliveryTimeEstimate}
                onChange={handleChange}
                placeholder="E.g., 30"
                inputProps={{ min: 0, 'aria-label': 'Delivery Time Estimate' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.pickupOptionAvailable}
                    onChange={handleChange}
                    name="pickupOptionAvailable"
                    color="primary"
                  />
                }
                label="Pickup Option Available"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="zoneId">Available in Zones / Areas</CustomFormLabel>
              <TextField
                select
                SelectProps={{
                  multiple: true,
                  value: formData.zoneId,
                  onChange: (e) => handleMultiSelectChange(e, 'zoneId'),
                  renderValue: (selected) =>
                    selected.map((id) => zones.find((z) => z._id === id)?.name || '').join(', '),
                }}
                id="zoneId"
                name="zoneId"
                fullWidth
                disabled={loadingStates.zones}
              >
                {loadingStates.zones ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : zones.length === 0 ? (
                  <MenuItem disabled>No zones available</MenuItem>
                ) : (
                  zones.map((zone) => (
                    <MenuItem key={zone._id} value={zone._id}>
                      {zone.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFeaturedOnHomepage}
                    onChange={handleChange}
                    name="isFeaturedOnHomepage"
                    color="primary"
                  />
                }
                label="Featured on Homepage"
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Advanced Features */}
        <ParentCard title="Advanced Features (Optional)" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enableReviewsRatings}
                    onChange={handleChange}
                    name="enableReviewsRatings"
                    color="primary"
                  />
                }
                label="Enable Reviews / Ratings"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.liveTrackingCompatible}
                    onChange={handleChange}
                    name="liveTrackingCompatible"
                    color="primary"
                  />
                }
                label="Live Tracking Compatible"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomFormLabel htmlFor="kitchenDisplayCode">Kitchen Display Code</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="kitchenDisplayCode"
                name="kitchenDisplayCode"
                value={formData.kitchenDisplayCode}
                onChange={handleChange}
                placeholder="E.g., KDS123"
                inputProps={{ 'aria-label': 'Kitchen Display Code' }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="outOfStockAlertThreshold">
                Out-of-Stock Alert Threshold <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                type="number"
                id="outOfStockAlertThreshold"
                name="outOfStockAlertThreshold"
                value={formData.outOfStockAlertThreshold}
                onChange={handleChange}
                placeholder="E.g., 10"
                inputProps={{
                  min: 0,
                  'aria-label': 'Out-of-Stock Alert Threshold',
                  required: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaTitle">Meta Title</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="E.g., Delicious Margherita Pizza"
                inputProps={{ 'aria-label': 'Meta Title' }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaDescription">Meta Description</CustomFormLabel>
              <CustomTextField
                fullWidth
                multiline
                rows={4}
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="E.g., Freshly baked pizza with premium ingredients"
                inputProps={{ 'aria-label': 'Meta Description' }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaKeywords">SEO Keywords</CustomFormLabel>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1,
                  '&:hover': {
                    borderColor: 'text.primary',
                  },
                  '&:focus-within': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                }}
              >
                {formData.metaKeywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    onDelete={() => removeKeyword(index)}
                    sx={{ mr: 0.5 }}
                    aria-label={`Remove keyword ${keyword}`}
                  />
                ))}
                <CustomTextField
                  variant="standard"
                  onChange={handleKeywordChange}
                  onKeyDown={handleKeywordKeyDown}
                  placeholder="Type keywords, press Enter or comma to add"
                  InputProps={{ disableUnderline: true }}
                  sx={{ flexGrow: 1 }}
                  inputProps={{ 'aria-label': 'SEO Keywords' }}
                />
              </Box>
              <FormHelperText>Type comma or press Enter to add keywords</FormHelperText>
            </Grid>
          </Grid>
        </ParentCard>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
            mt: 3,
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            disabled={loading}
            sx={{ px: 4, py: 1.5 }}
            aria-label="Reset form"
          >
            Reset
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            color="primary"
            sx={{ px: 4, py: 1.5 }}
            aria-label="Add dish"
            type="submit"
          >
            Add Dish
          </LoadingButton>
        </Box>
      </form>
    </PageContainer>
  );
};

export default AddDish;

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Typography,
  Button,
  IconButton,
  Stack,
  Chip,
  Checkbox,
  ListItemText,
  LinearProgress,
  Alert,
  Switch,
  FormControlLabel,
  styled,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import {
  Close as CloseIcon,
  VideoFile as VideoIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { IconArrowBackUp } from '@tabler/icons-react';
import { URLS } from '../../../Url';
import axios from 'axios';

// Styled components for better design
const CustomSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: '16px',
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.primary.main + '08',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '12',
    borderColor: theme.palette.primary.dark,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}));

const AddProduct = () => {
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    serviceId: '',
    categoryId: '',
    subcategoryId: '',
    productSku: '',
    hsnCode: '',
    status: 'active',
    attributes: {},
  });

  const [pricingData, setPricingData] = useState({
    buyingPrice: '',
    sellingPrice: '',
    discountPrice: '',
    currentStockQuantity: '',
    varAndTax: '',
    minimumOrderQuantity: '1',
  });

  const [specificationData, setSpecificationData] = useState([
    {
      id: Date.now(),
      specificationId: '',
      specificationvalueIds: [],
    },
  ]);

  const [seoData, setSeoData] = useState({
    metaTitle: '',
    metaDescription: '',
    metakeywords: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Cache to store fetched data
  const [categoryCache, setCategoryCache] = useState({});
  const [subcategoryCache, setSubcategoryCache] = useState({});

  // Dynamic data states
  const [attributes, setAttributes] = useState([]);
  const [attributesValues, setAttributesValues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [specificationValues, setSpecificationValues] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);

  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    categories: false,
    subcategories: false,
    specifications: false,
    specificationValues: false,
    services: false,
    attributes: false,
  });

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Helper functions
  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  };

  const token = getToken();

  // API call helper
  const apiCall = async (url, data, setter, loadingKey, responseKey = 'data') => {
    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));
      const response = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const responseData = response.data[responseKey] || [];
      setter(Array.isArray(responseData) ? responseData : []);
    } catch (error) {
      console.error(`Error fetching ${loadingKey}:`, error);
      toast.error(`Failed to load ${loadingKey}`);
      setter([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Fetch all initial data
  const fetchInitialData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    try {
      await Promise.all([
        apiCall(URLS.GetActiveServices, { searchQuery: '', serviceType: '' }, setServiceTypes, 'services', 'data'),
        apiCall(URLS.GetAttribute, {}, setAttributes, 'attributes', 'attribute'),
        apiCall(URLS.GetAttributeValues, {}, setAttributesValues, 'attributes', 'attributevalues'),
        apiCall(URLS.GetSpecifications, {}, setSpecifications, 'specifications', 'specifications'),
        apiCall(
          URLS.GetSpecificationValues,
          {},
          setSpecificationValues,
          'specificationValues',
          'specificationvalues',
        ),
      ]);
    } catch (error) {
      toast.error('Failed to fetch initial data');
      console.error('Failed to fetch initial data:', error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [token]);

  // Fetch categories by service
  const fetchCategoriesByService = useCallback(
    async (serviceId) => {
      if (!token || !serviceId) return;

      if (categoryCache[serviceId]) {
        setCategories(categoryCache[serviceId]);
        setSubcategories([]);
        return;
      }

      try {
        setLoadingStates((prev) => ({ ...prev, categories: true }));
        const response = await axios.post(
          URLS.GetServiceIdbyCategory,
          { serviceId },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data?.success) {
          const fetchedCategories = response.data.data || [];
          setCategories(fetchedCategories);
          setCategoryCache((prev) => ({ ...prev, [serviceId]: fetchedCategories }));
        } else {
          setCategories([]);
        }
        setSubcategories([]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
        setCategories([]);
      } finally {
        setLoadingStates((prev) => ({ ...prev, categories: false }));
      }
    },
    [token, categoryCache],
  );

  // Fetch subcategories by category
  const fetchSubcategoriesByCategory = useCallback(
    async (categoryId) => {
      if (!token || !categoryId) return;

      if (subcategoryCache[categoryId]) {
        setSubcategories(subcategoryCache[categoryId]);
        return;
      }

      try {
        setLoadingStates((prev) => ({ ...prev, subcategories: true }));
        const response = await axios.post(
          URLS.GetCategorieIdbySubCategory,
          { categoryId },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data?.success) {
          const fetchedSubcategories = response.data.data || [];
          setSubcategories(fetchedSubcategories);
          setSubcategoryCache((prev) => ({ ...prev, [categoryId]: fetchedSubcategories }));
        } else {
          setSubcategories([]);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        toast.error('Failed to fetch subcategories');
        setSubcategories([]);
      } finally {
        setLoadingStates((prev) => ({ ...prev, subcategories: false }));
      }
    },
    [token, subcategoryCache],
  );

  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'serviceId') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        categoryId: '',
        subcategoryId: '',
      }));
      fetchCategoriesByService(value);
    } else if (name === 'categoryId') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        subcategoryId: '',
      }));
      fetchSubcategoriesByCategory(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const setForm = (section, field, value) => {
    setErrors((prev) => ({ ...prev, [`${section}.${field}`]: '' }));
    if (section === 'form') setFormData((prev) => ({ ...prev, [field]: value }));
    if (section === 'pricing') setPricingData((prev) => ({ ...prev, [field]: value }));
    if (section === 'seo') setSeoData((prev) => ({ ...prev, [field]: value }));
  };

  // Attribute handlers
  const handleAttributeChange = (attributeId, value) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attributeId]: value,
      },
    }));
  };

  // Specification handlers
  const updateSpecification = (index, field, value) => {
    setSpecificationData((prev) =>
      prev.map((spec, i) => {
        if (i === index) {
          const updatedSpec = { ...spec, [field]: value };
          if (field === 'specificationId') {
            updatedSpec.specificationvalueIds = [];
          }
          return updatedSpec;
        }
        return spec;
      }),
    );
    setErrors((prev) => ({ ...prev, [`spec.${index}.${field}`]: '' }));
  };

  const addSpecification = () => {
    setSpecificationData((prev) => [
      ...prev,
      {
        id: Date.now(),
        specificationId: '',
        specificationvalueIds: [],
      },
    ]);
  };

  const removeSpecification = (index) => {
    if (specificationData.length > 1) {
      setSpecificationData((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Image handling with 5 image limit
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Check if adding new images would exceed the limit
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter((f) => {
      if (!f.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setImages((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImagePreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });

    setErrors((prev) => ({ ...prev, images: '' }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Only video files are allowed');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video size must be less than 100MB');
      return;
    }

    setVideo(file);
    const reader = new FileReader();
    reader.onload = () => setVideoPreview(reader.result);
    reader.readAsDataURL(file);
    setErrors((prev) => ({ ...prev, video: '' }));
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  // Generate codes
  const generateSku = () => {
    const sku = `SKU${Date.now().toString().slice(-8)}`;
    setForm('form', 'productSku', sku);
  };

  const generateHsn = () => {
    const hsn = `${Math.floor(10000000 + Math.random() * 90000000)}`;
    setForm('form', 'hsnCode', hsn);
  };

  // Validation
  const validate = () => {
    const er = {};

    // Required field validations
    if (!formData.name.trim()) er['form.name'] = 'Product name is required';
    if (!formData.shortDescription.trim())
      er['form.shortDescription'] = 'Short description is required';
    if (!formData.description.trim()) er['form.description'] = 'Description is required';
    if (!formData.serviceId) er['form.serviceId'] = 'Service selection is required';
    if (!formData.categoryId) er['form.categoryId'] = 'Category selection is required';
    if (!formData.subcategoryId) er['form.subcategoryId'] = 'Subcategory selection is required';
    if (!formData.productSku.trim()) er['form.productSku'] = 'Product SKU is required';
    if (!formData.hsnCode.trim()) er['form.hsnCode'] = 'HSN Code is required';

    // Pricing validations
    if (!pricingData.buyingPrice) er['pricing.buyingPrice'] = 'Buying price is required';
    if (!pricingData.sellingPrice) er['pricing.sellingPrice'] = 'Selling price is required';

    if (pricingData.sellingPrice && pricingData.buyingPrice) {
      if (parseFloat(pricingData.sellingPrice) <= parseFloat(pricingData.buyingPrice)) {
        er['pricing.sellingPrice'] = 'Selling price must be greater than buying price';
      }
    }

    if (pricingData.discountPrice && pricingData.sellingPrice) {
      if (parseFloat(pricingData.discountPrice) >= parseFloat(pricingData.sellingPrice)) {
        er['pricing.discountPrice'] = 'Discount price must be less than selling price';
      }
    }

    // Image validation
    if (images.length === 0) er['images'] = 'At least one product image is required';

    // Specification validation
    specificationData.forEach((spec, index) => {
      if (spec.specificationId && spec.specificationvalueIds.length === 0) {
        er[`spec.${index}.specificationvalueIds`] = 'Select at least one specification value';
      }
    });

    setErrors(er);
    return Object.keys(er).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix all validation errors');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();

      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'attributes' && typeof value === 'object') {
          fd.append(key, JSON.stringify(value));
        } else {
          fd.append(key, value);
        }
      });

      // Append pricing data
      Object.entries(pricingData).forEach(([key, value]) => {
        if (value) fd.append(key, value);
      });

      // Append SEO data
      Object.entries(seoData).forEach(([key, value]) => {
        if (value?.trim()) fd.append(key, value);
      });

      // Append images
      images.forEach((img) => fd.append('image', img));

      // Append video
      if (video) fd.append('video', video);

      // Append specifications
      const validSpecs = specificationData.filter(
        (spec) => spec.specificationId && spec.specificationvalueIds.length > 0,
      );

      if (validSpecs.length > 0) {
        fd.append('specifications', JSON.stringify(validSpecs));
      }

      const response = await axios.post(URLS.AddProduct, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success) {
        toast.success('Product added successfully!');
        handleReset();
        navigate('/products'); // Navigate to products list
      } else {
        toast.error(response.data?.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      let errorMessage = 'Failed to add product. Please try again.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
      } else if (error.response?.status === 413) {
        errorMessage = 'File size too large. Please reduce image/video sizes.';
      }

      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: '',
      shortDescription: '',
      description: '',
      serviceId: '',
      categoryId: '',
      subcategoryId: '',
      productSku: '',
      hsnCode: '',
      status: 'active',
      attributes: {},
    });

    setPricingData({
      buyingPrice: '',
      sellingPrice: '',
      discountPrice: '',
      currentStockQuantity: '',
      varAndTax: '',
      minimumOrderQuantity: '1',
    });

    setSpecificationData([
      {
        id: Date.now(),
        specificationId: '',
        specificationvalueIds: [],
      },
    ]);

    setSeoData({
      metaTitle: '',
      metaDescription: '',
      metakeywords: '',
    });

    setImages([]);
    setImagePreviews([]);
    setVideo(null);
    setVideoPreview(null);
    setErrors({});

    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 1,
        }}
      >
        <Typography variant="h4" fontWeight="700" color="primary">
          Add New Product
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          startIcon={<IconArrowBackUp />}
          sx={{ borderRadius: 2 }}
        >
          Back
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Product Information */}
          <StyledCard sx={{ mb: 3 }}>
            <CardHeader title="Product Information" />
            <Divider></Divider>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="serviceId" required>
                    Service Type
                  </CustomFormLabel>
                  <CustomSelect
                    id="serviceId"
                    value={formData.serviceId}
                    name="serviceId"
                    onChange={handleChange}
                    fullWidth
                    disabled={loadingStates.services}
                    error={!!errors['form.serviceId']}
                  >
                    <MenuItem value="">
                      <em>Select Service Type</em>
                    </MenuItem>
                    {serviceTypes.map((service) => (
                      <MenuItem key={service._id} value={service._id}>
                        {service.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {errors['form.serviceId'] && (
                    <FormHelperText error>{errors['form.serviceId']}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomFormLabel htmlFor="categoryId" required>
                    Category
                  </CustomFormLabel>
                  <CustomSelect
                    id="categoryId"
                    value={formData.categoryId}
                    name="categoryId"
                    onChange={handleChange}
                    fullWidth
                    disabled={!formData.serviceId || loadingStates.categories}
                    error={!!errors['form.categoryId']}
                  >
                    <MenuItem value="">
                      <em>Select Category</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {errors['form.categoryId'] && (
                    <FormHelperText error>{errors['form.categoryId']}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomFormLabel htmlFor="subcategoryId" required>
                    Subcategory
                  </CustomFormLabel>
                  <CustomSelect
                    id="subcategoryId"
                    value={formData.subcategoryId}
                    name="subcategoryId"
                    onChange={handleChange}
                    fullWidth
                    disabled={!formData.categoryId || loadingStates.subcategories}
                    error={!!errors['form.subcategoryId']}
                  >
                    <MenuItem value="">
                      <em>Select Subcategory</em>
                    </MenuItem>
                    {subcategories.map((subcategory) => (
                      <MenuItem key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {errors['form.subcategoryId'] && (
                    <FormHelperText error>{errors['form.subcategoryId']}</FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="name" required>
                    Product Name
                  </CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    value={formData.name}
                    onChange={(e) => setForm('form', 'name', e.target.value)}
                    error={!!errors['form.name']}
                    helperText={errors['form.name']}
                    placeholder="Enter product name"
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="shortDescription" required>
                    Short Description
                  </CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    value={formData.shortDescription}
                    onChange={(e) => setForm('form', 'shortDescription', e.target.value)}
                    error={!!errors['form.shortDescription']}
                    helperText={errors['form.shortDescription']}
                    placeholder="Brief product description"
                    inputProps={{ maxLength: 160 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="description" required>
                    Detailed Description
                  </CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    multiline
                    minRows={4}
                    value={formData.description}
                    onChange={(e) => setForm('form', 'description', e.target.value)}
                    error={!!errors['form.description']}
                    helperText={errors['form.description']}
                    placeholder="Detailed product description"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>

          {/* Pricing Information */}
        </Grid>

        {/* Right Column - Media & Additional Info */}
        <Grid item xs={12} lg={4}>
          {/* Product Images */}
          <StyledCard sx={{ mb: 3 }}>
            <CardHeader title={`Product Images (${images.length}/5)`} />
            <Divider></Divider>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <UploadBox onClick={() => imageInputRef.current?.click()}>
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    Upload Images
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Choose up to 5 images
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supported: JPG, PNG (Max: 5MB each)
                  </Typography>
                </UploadBox>

                <input
                  ref={imageInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={images.length >= 5}
                />

                {errors['images'] && <Alert severity="error">{errors['images']}</Alert>}

                {imagePreviews.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Preview Images
                    </Typography>
                    <Grid container spacing={1}>
                      {imagePreviews.map((src, idx) => (
                        <Grid item xs={6} key={idx}>
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
          </StyledCard>

          {/* Product Video */}
          <StyledCard sx={{ mb: 3 }}>
            <CardHeader title="Product Video" />
            <Divider />
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <UploadBox onClick={() => videoInputRef.current?.click()}>
                  {videoPreview ? (
                    <Box sx={{ width: '100%' }}>
                      <video
                        controls
                        style={{
                          width: '100%',
                          maxHeight: 200,
                          borderRadius: 8,
                          marginBottom: 16,
                        }}
                      >
                        <source src={videoPreview} type={video?.type || 'video/mp4'} />
                        Your browser does not support video playback.
                      </video>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {video?.name}
                        </Typography>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeVideo();
                          }}
                          startIcon={<DeleteIcon />}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <VideoIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                      <Typography variant="h6" color="warning.main" sx={{ mb: 1 }}>
                        Upload Video
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Optional product video
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supported: MP4, AVI, MOV (Max: 100MB)
                      </Typography>
                    </>
                  )}
                </UploadBox>

                <input
                  ref={videoInputRef}
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={handleVideoUpload}
                />

                {errors['video'] && <Alert severity="error">{errors['video']}</Alert>}
              </Stack>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard sx={{ mb: 3 }}>
            <CardHeader title="Pricing Information" />
            <Divider></Divider>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="buyingPrice" required>
                    Buying Price (₹)
                  </CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    type="number"
                    value={pricingData.buyingPrice}
                    onChange={(e) => setForm('pricing', 'buyingPrice', e.target.value)}
                    error={!!errors['pricing.buyingPrice']}
                    helperText={errors['pricing.buyingPrice']}
                    placeholder="0.00"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="sellingPrice" required>
                    Selling Price (₹)
                  </CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    type="number"
                    value={pricingData.sellingPrice}
                    onChange={(e) => setForm('pricing', 'sellingPrice', e.target.value)}
                    error={!!errors['pricing.sellingPrice']}
                    helperText={errors['pricing.sellingPrice']}
                    placeholder="0.00"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="discountPrice">Discount Price (₹)</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    type="number"
                    value={pricingData.discountPrice}
                    onChange={(e) => setForm('pricing', 'discountPrice', e.target.value)}
                    error={!!errors['pricing.discountPrice']}
                    helperText={errors['pricing.discountPrice']}
                    placeholder="0.00"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="currentStockQuantity">Stock Quantity</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    type="number"
                    value={pricingData.currentStockQuantity}
                    onChange={(e) => setForm('pricing', 'currentStockQuantity', e.target.value)}
                    placeholder="0"
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="varAndTax">VAT & Tax (%)</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    value={pricingData.varAndTax}
                    onChange={(e) => setForm('pricing', 'varAndTax', e.target.value)}
                    placeholder="18"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFormLabel htmlFor="minimumOrderQuantity">
                    Minimum Order Quantity
                  </CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    type="number"
                    value={pricingData.minimumOrderQuantity}
                    onChange={(e) => setForm('pricing', 'minimumOrderQuantity', e.target.value)}
                    placeholder="1"
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
      {/* General Information */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledCard sx={{ mb: 3 }}>
            <CardHeader title="General Information" />
            <Divider></Divider>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Attributes */}
                {attributes.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Product Attributes
                    </Typography>
                    <Grid container spacing={2}>
                      {attributes.map((attribute) => (
                        <Grid item xs={12} md={6} key={attribute._id}>
                          <CustomFormLabel htmlFor={`attribute-${attribute._id}`}>
                            {attribute.name}
                          </CustomFormLabel>
                          <CustomSelect
                            fullWidth
                            value={formData.attributes[attribute._id] || ''}
                            onChange={(e) => handleAttributeChange(attribute._id, e.target.value)}
                          >
                            <MenuItem value="">
                              <em>Select {attribute.name}</em>
                            </MenuItem>
                            {attributesValues
                              .filter((val) => val.attributeId === attribute._id)
                              .map((value) => (
                                <MenuItem key={value._id} value={value._id}>
                                  {value.value}
                                </MenuItem>
                              ))}
                          </CustomSelect>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}

                {/* SKU and HSN */}
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="productSku" required>
                        Product SKU
                      </CustomFormLabel>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <CustomTextField
                          fullWidth
                          value={formData.productSku}
                          onChange={(e) => setForm('form', 'productSku', e.target.value)}
                          error={!!errors['form.productSku']}
                          helperText={errors['form.productSku']}
                          placeholder="SKU123456"
                        />
                        <Button
                          variant="outlined"
                          onClick={generateSku}
                          sx={{ minWidth: 'auto', px: 2 }}
                        >
                          Generate
                        </Button>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="hsnCode" required>
                        HSN Code
                      </CustomFormLabel>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <CustomTextField
                          fullWidth
                          value={formData.hsnCode}
                          onChange={(e) => setForm('form', 'hsnCode', e.target.value)}
                          error={!!errors['form.hsnCode']}
                          helperText={errors['form.hsnCode']}
                          placeholder="61012000"
                        />
                        <Button
                          variant="outlined"
                          onClick={generateHsn}
                          sx={{ minWidth: 'auto', px: 2 }}
                        >
                          Generate
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Status */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.status === 'active'}
                        onChange={(e) =>
                          setForm('form', 'status', e.target.checked ? 'active' : 'inactive')
                        }
                        color="success"
                      />
                    }
                    label={
                      <Typography variant="body1" fontWeight={500}>
                        Product Status: {formData.status === 'active' ? 'Active' : 'Inactive'}
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Specifications */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledCard sx={{ mb: 3 }}>
            <CardHeader
              title="Product Specifications"
              action={
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={addSpecification}
                  sx={{ borderRadius: 2 }}
                >
                  Add Specification
                </Button>
              }
            />
            <Divider></Divider>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                {specificationData.map((spec, index) => (
                  <Box key={spec.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ mr: 2 }}>
                        Specification {index + 1}
                      </Typography>
                      {specificationData.length > 1 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeSpecification(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CustomFormLabel required>Specification Type</CustomFormLabel>
                        <CustomSelect
                          fullWidth
                          value={spec.specificationId}
                          onChange={(e) =>
                            updateSpecification(index, 'specificationId', e.target.value)
                          }
                          disabled={loadingStates.specifications}
                        >
                          <MenuItem value="">
                            <em>Select Specification</em>
                          </MenuItem>
                          {specifications.map((s) => (
                            <MenuItem key={s._id} value={s._id}>
                              {s.name}
                            </MenuItem>
                          ))}
                        </CustomSelect>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomFormLabel required>Specification Values</CustomFormLabel>
                        <CustomSelect
                          fullWidth
                          multiple
                          value={spec.specificationvalueIds}
                          onChange={(e) =>
                            updateSpecification(index, 'specificationvalueIds', e.target.value)
                          }
                          disabled={!spec.specificationId}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((valueId) => {
                                const value = specificationValues.find((v) => v._id === valueId);
                                return (
                                  <Chip
                                    key={valueId}
                                    label={value?.name || valueId}
                                    size="small"
                                    color="primary"
                                  />
                                );
                              })}
                            </Box>
                          )}
                        >
                          {specificationValues
                            .filter((v) => v.specificationId === spec.specificationId)
                            .map((value) => (
                              <MenuItem key={value._id} value={value._id}>
                                <Checkbox
                                  checked={spec.specificationvalueIds.includes(value._id)}
                                />
                                <ListItemText primary={value.name} />
                              </MenuItem>
                            ))}
                        </CustomSelect>
                        {errors[`spec.${index}.specificationvalueIds`] && (
                          <FormHelperText error>
                            {errors[`spec.${index}.specificationvalueIds`]}
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>

                    {index < specificationData.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* SEO Information */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledCard sx={{ mb: 3 }}>
            <CardHeader
              title="SEO Information (Optional)"
              sx={{
                bgcolor: 'purple',
                color: 'white',
                '& .MuiCardHeader-title': { fontWeight: 600 },
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="metaTitle">Meta Title</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    value={seoData.metaTitle}
                    onChange={(e) => setForm('seo', 'metaTitle', e.target.value)}
                    placeholder="SEO optimized title"
                    inputProps={{ maxLength: 60 }}
                    helperText={`${seoData.metaTitle.length}/60 characters`}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="metaDescription">Meta Description</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    multiline
                    minRows={3}
                    value={seoData.metaDescription}
                    onChange={(e) => setForm('seo', 'metaDescription', e.target.value)}
                    placeholder="SEO meta description"
                    inputProps={{ maxLength: 160 }}
                    helperText={`${seoData.metaDescription.length}/160 characters`}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="metakeywords">Meta Keywords</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    value={seoData.metakeywords}
                    onChange={(e) => setForm('seo', 'metakeywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                    helperText="Separate keywords with commas"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Error Alert */}
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
        </Alert>
      )}

      {/* Loading Progress */}
      {loading && <LinearProgress sx={{ mb: 3 }} />}

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
        }}
      >
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={loading}
          sx={{ px: 4, py: 1.5, borderRadius: 2 }}
        >
          Reset Form
        </Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          type="submit"
          color="primary"
          size="large"
          sx={{ px: 4, py: 1.5, borderRadius: 2 }}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default AddProduct;

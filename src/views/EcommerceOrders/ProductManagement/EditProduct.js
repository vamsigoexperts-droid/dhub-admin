import React, { useRef, useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Close as CloseIcon,
  VideoFile as VideoIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { URLS } from '../../../Url';
import axios from 'axios';
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
} from '@mui/material';

const EditProduct = () => {
  // form states
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    brandId: '',
    unitId: '',
    productSku: '',
    hsnCode: '',
    status: 'active',
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

  // Media states
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [existingVideo, setExistingVideo] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Dynamic data states
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [specificationValues, setSpecificationValues] = useState([]);

  // Loading states for dropdowns
  const [loadingStates, setLoadingStates] = useState({
    categories: false,
    subcategories: false,
    brands: false,
    units: false,
    specifications: false,
    specificationValues: false,
  });

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Get auth token helper
  const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || '';
  };

  // API call helper with error handling
  const apiCall = async (url, data, setter, loadingKey, responseKey = 'data') => {
    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));
      const token = getAuthToken();
      const response = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Extract data based on response key
      const responseData = response.data[responseKey] || [];
      setter(Array.isArray(responseData) ? responseData : []);
    } catch (error) {
      console.error(`Error fetching ${loadingKey}:`, error);
      setErrors((prev) => ({ ...prev, [loadingKey]: `Failed to load ${loadingKey}` }));
      setter([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Fetch product details by ID
  const fetchProductById = async (productId) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        URLS.GetProductById,
        { id: productId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data && response.data.success) {
        const productData = response.data.data || response.data.product;
        populateFormWithProductData(productData);
      } else {
        setErrors({ fetch: 'Failed to load product details' });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setErrors({ fetch: error.response?.data?.message || 'Failed to load product details' });
    } finally {
      setInitialLoading(false);
    }
  };

  // Populate form with existing product data
  const populateFormWithProductData = (productData) => {
    // Basic form data
    setFormData({
      name: productData.name || '',
      shortDescription: productData.shortDescription || '',
      description: productData.description || '',
      categoryId: productData.categoryId || productData.category?._id || '',
      subcategoryId: productData.subcategoryId || productData.subcategory?._id || '',
      brandId: productData.brandId || productData.brand?._id || '',
      unitId: productData.unitId || productData.unit?._id || '',
      productSku: productData.productSku || '',
      hsnCode: productData.hsnCode || '',
      status: productData.status || 'active',
    });

    // Pricing data
    setPricingData({
      buyingPrice: productData.buyingPrice || '',
      sellingPrice: productData.sellingPrice || '',
      discountPrice: productData.discountPrice || '',
      currentStockQuantity: productData.currentStockQuantity || '',
      varAndTax: productData.varAndTax || '',
      minimumOrderQuantity: productData.minimumOrderQuantity || '1',
    });

    // SEO data
    setSeoData({
      metaTitle: productData.metaTitle || '',
      metaDescription: productData.metaDescription || '',
      metakeywords: productData.metakeywords || '',
    });

    // Specifications
    if (productData.specifications && productData.specifications.length > 0) {
      const specs = productData.specifications.map((spec) => ({
        id: spec._id || Date.now() + Math.random(),
        specificationId: spec.specificationId || spec.specification?._id || '',
        specificationvalueIds:
          spec.specificationvalueIds ||
          spec.specificationValues?.map((val) => val._id || val.id) ||
          [],
      }));
      setSpecificationData(specs);
    }

    // Existing images
    if (productData.image && productData.image.length > 0) {
      setExistingImages(productData.image);
    }

    // Existing video
    if (productData.video) {
      setExistingVideo(productData.video);
    }
  };

  // Fetch all dropdown data and product details on component mount
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        apiCall(URLS.GetCategories, {}, setCategories, 'categories', 'category'),
        apiCall(URLS.GetBrands, {}, setBrands, 'brands', 'brands'),
        apiCall(URLS.GetUnits, {}, setUnits, 'units', 'units'),
        apiCall(URLS.GetSpecifications, {}, setSpecifications, 'specifications', 'specifications'),
        apiCall(
          URLS.GetSpecificationValues,
          {},
          setSpecificationValues,
          'specificationValues',
          'specificationvalues',
        ),
      ]);

      // Fetch product details if productToEdit has ID
      if (productToEdit?._id) {
        await fetchProductById(productToEdit._id);
      } else {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [productToEdit]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.categoryId) {
      const fetchSubcategories = async () => {
        try {
          setLoadingStates((prev) => ({ ...prev, subcategories: true }));
          const token = getAuthToken();
          const response = await axios.post(
            URLS.GetSubCategories,
            { categoryId: formData.categoryId },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          // Handle the different response structure for subcategories
          if (response.data && response.data.success) {
            setSubcategories(response.data.subcategory || []);
          } else {
            setSubcategories([]);
          }
        } catch (error) {
          console.error('Error fetching subcategories:', error);
          setErrors((prev) => ({ ...prev, subcategories: 'Failed to load subcategories' }));
          setSubcategories([]);
        } finally {
          setLoadingStates((prev) => ({ ...prev, subcategories: false }));
        }
      };

      fetchSubcategories();
    } else {
      setSubcategories([]);
      setFormData((prev) => ({ ...prev, subcategoryId: '' }));
    }
  }, [formData.categoryId]);

  // handlers
  const setForm = (section, field, value) => {
    setErrors((e) => ({ ...e, [`${section}.${field}`]: '' }));
    if (section === 'form') setFormData((p) => ({ ...p, [field]: value }));
    if (section === 'pricing') setPricingData((p) => ({ ...p, [field]: value }));
    if (section === 'seo') setSeoData((p) => ({ ...p, [field]: value }));
  };

  // Specification handlers
  const updateSpecification = (index, field, value) => {
    setSpecificationData((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)),
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const valid = files.filter((f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    if (valid.length !== files.length) {
      setErrors((er) => ({ ...er, images: 'Only images up to 5MB are allowed' }));
      return;
    }

    setImages((p) => [...p, ...valid]);

    // Create previews
    valid.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImagePreviews((p) => [...p, reader.result]);
      reader.readAsDataURL(file);
    });

    setErrors((er) => ({ ...er, images: '' }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/') || file.size > 100 * 1024 * 1024) {
      setErrors((er) => ({ ...er, video: 'Video must be under 100MB and in video format' }));
      return;
    }

    setVideo(file);
    const reader = new FileReader();
    reader.onload = () => setVideoPreview(reader.result);
    reader.readAsDataURL(file);
    setErrors((er) => ({ ...er, video: '' }));
  };

  const removeImage = (idx) => {
    setImages((p) => p.filter((_, i) => i !== idx));
    setImagePreviews((p) => p.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (idx) => {
    setExistingImages((p) => p.filter((_, i) => i !== idx));
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const removeExistingVideo = () => {
    setExistingVideo('');
  };

  const generateSku = () => {
    const sku = `SKU${Date.now().toString().slice(-8)}`;
    setForm('form', 'productSku', sku);
  };

  const generateHsn = () => {
    const hsn = `${Math.floor(10000000 + Math.random() * 90000000)}`;
    setForm('form', 'hsnCode', hsn);
  };

  const validate = () => {
    const er = {};

    // Basic form validation
    if (!formData.name.trim()) er['form.name'] = 'Required';
    if (!formData.shortDescription.trim()) er['form.shortDescription'] = 'Required';
    if (!formData.description.trim()) er['form.description'] = 'Required';
    if (!formData.categoryId) er['form.categoryId'] = 'Required';
    if (!formData.productSku.trim()) er['form.productSku'] = 'Required';
    if (!formData.hsnCode.trim()) er['form.hsnCode'] = 'Required';

    // Pricing validation
    if (!pricingData.buyingPrice) er['pricing.buyingPrice'] = 'Required';
    if (!pricingData.sellingPrice) er['pricing.sellingPrice'] = 'Required';

    if (
      pricingData.sellingPrice &&
      pricingData.buyingPrice &&
      parseFloat(pricingData.sellingPrice) <= parseFloat(pricingData.buyingPrice)
    ) {
      er['pricing.sellingPrice'] = 'Must be greater than buying price';
    }

    if (
      pricingData.discountPrice &&
      pricingData.sellingPrice &&
      parseFloat(pricingData.discountPrice) >= parseFloat(pricingData.sellingPrice)
    ) {
      er['pricing.discountPrice'] = 'Must be less than selling price';
    }

    // Image validation - allow existing images or new images
    if (images.length === 0 && existingImages.length === 0) {
      er['images'] = 'At least one image is required';
    }

    // Specification validation
    specificationData.forEach((spec, index) => {
      if (spec.specificationId && spec.specificationvalueIds.length === 0) {
        er[`spec.${index}.specificationvalueIds`] =
          'Select at least one value for this specification';
      }
    });

    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!productToEdit?._id) {
      setErrors({ submit: 'Product ID is missing' });
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();

      // Add basic form data
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      Object.entries(pricingData).forEach(([k, v]) => fd.append(k, v));
      Object.entries(seoData).forEach(([k, v]) => v && fd.append(k, v));

      // Handle specifications - only send the first specification as per API requirements
      const validSpecifications = specificationData.filter(
        (spec) => spec.specificationId && spec.specificationvalueIds.length > 0,
      );

      if (validSpecifications.length > 0) {
        const firstSpec = validSpecifications[0];
        fd.append('specificationId', firstSpec.specificationId);
        fd.append('specificationvalueIds', JSON.stringify(firstSpec.specificationvalueIds));
      }

      // Add new media files
      images.forEach((img) => fd.append('image', img));
      if (video) fd.append('video', video);

      if (existingImages.length > 0) {
        fd.append('existingImages', JSON.stringify(existingImages));
      }

      if (existingVideo) {
        fd.append('existingVideo', existingVideo);
      }

      const token = getAuthToken();

      // FIXED: Include product ID in the URL path
      const url = `${URLS.EditProduct}/${productToEdit._id}`;

      const response = await axios.put(url, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Product updated successfully:', response.data);
      alert('Product updated successfully!');

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating product:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to update product. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (productToEdit?._id) {
      // Re-populate with original data
      fetchProductById(productToEdit._id);
    } else {
      // Clear all data
      setFormData({
        name: '',
        shortDescription: '',
        description: '',
        categoryId: '',
        subcategoryId: '',
        brandId: '',
        unitId: '',
        productSku: '',
        hsnCode: '',
        status: 'active',
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
      setSeoData({ metaTitle: '', metaDescription: '', metakeywords: '' });
    }

    setImages([]);
    setImagePreviews([]);
    setVideo(null);
    setVideoPreview(null);
    setErrors({});

    // Clear file inputs
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  if (initialLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Loading Product Details...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (errors.fetch) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{errors.fetch}</Alert>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      {/* Title */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Edit Product
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Update the information below to edit the product
      </Typography>

      {/* Display API loading errors if any */}
      {Object.keys(errors).some((key) =>
        ['categories', 'brands', 'units', 'specifications', 'specificationValues'].includes(key),
      ) && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Some dropdown data failed to load. Please refresh the page or contact support.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column - 8/12 width */}
        <Grid item xs={12} lg={8}>
          {/* Product Info */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader title="Product Info" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    required
                    value={formData.name}
                    onChange={(e) => setForm('form', 'name', e.target.value)}
                    error={!!errors['form.name']}
                    helperText={errors['form.name']}
                    placeholder="Enter Product Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Short Description"
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setForm('form', 'shortDescription', e.target.value)}
                    error={!!errors['form.shortDescription']}
                    helperText={errors['form.shortDescription']}
                    placeholder="Enter short description"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Description"
                    required
                    value={formData.description}
                    onChange={(e) => setForm('form', 'description', e.target.value)}
                    error={!!errors['form.description']}
                    helperText={errors['form.description']}
                    placeholder="Detailed description of the product"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* General Information */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader title="General Information" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors['form.categoryId']}>
                    <InputLabel>Select Category *</InputLabel>
                    <Select
                      label="Select Category *"
                      value={formData.categoryId}
                      onChange={(e) => setForm('form', 'categoryId', e.target.value)}
                      disabled={loadingStates.categories}
                    >
                      {loadingStates.categories ? (
                        <MenuItem disabled>Loading categories...</MenuItem>
                      ) : categories.length === 0 ? (
                        <MenuItem disabled>No categories available</MenuItem>
                      ) : (
                        categories.map((c) => (
                          <MenuItem key={c._id || c.id} value={c._id || c.id}>
                            {c.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>{errors['form.categoryId']}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Sub Category</InputLabel>
                    <Select
                      label="Select Sub Category"
                      value={formData.subcategoryId}
                      onChange={(e) => setForm('form', 'subcategoryId', e.target.value)}
                      disabled={loadingStates.subcategories || !formData.categoryId}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {loadingStates.subcategories ? (
                        <MenuItem disabled>Loading subcategories...</MenuItem>
                      ) : subcategories.length === 0 ? (
                        <MenuItem disabled>No subcategories available</MenuItem>
                      ) : (
                        subcategories.map((s) => (
                          <MenuItem key={s._id || s.id} value={s._id || s.id}>
                            {s.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Brand</InputLabel>
                    <Select
                      label="Select Brand"
                      value={formData.brandId}
                      onChange={(e) => setForm('form', 'brandId', e.target.value)}
                      disabled={loadingStates.brands}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {loadingStates.brands ? (
                        <MenuItem disabled>Loading brands...</MenuItem>
                      ) : brands.length === 0 ? (
                        <MenuItem disabled>No brands available</MenuItem>
                      ) : (
                        brands.map((b) => (
                          <MenuItem key={b._id || b.id} value={b._id || b.id}>
                            {b.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Unit</InputLabel>
                    <Select
                      label="Select Unit"
                      value={formData.unitId}
                      onChange={(e) => setForm('form', 'unitId', e.target.value)}
                      disabled={loadingStates.units}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {loadingStates.units ? (
                        <MenuItem disabled>Loading units...</MenuItem>
                      ) : units.length === 0 ? (
                        <MenuItem disabled>No units available</MenuItem>
                      ) : (
                        units.map((u) => (
                          <MenuItem key={u._id || u.id} value={u._id || u.id}>
                            {u.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <TextField
                      fullWidth
                      label="Product SKU"
                      required
                      value={formData.productSku}
                      onChange={(e) => setForm('form', 'productSku', e.target.value)}
                      error={!!errors['form.productSku']}
                      helperText={errors['form.productSku']}
                      placeholder="Ex: SKU123456"
                    />
                    <Button
                      variant="outlined"
                      onClick={generateSku}
                      sx={{ minWidth: 120, height: 56 }}
                    >
                      Generate Code
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <TextField
                      fullWidth
                      label="HSN CODE"
                      required
                      value={formData.hsnCode}
                      onChange={(e) => setForm('form', 'hsnCode', e.target.value)}
                      error={!!errors['form.hsnCode']}
                      helperText={errors['form.hsnCode']}
                      placeholder="Ex: 61012000"
                    />
                    <Button
                      variant="outlined"
                      onClick={generateHsn}
                      sx={{ minWidth: 120, height: 56 }}
                    >
                      Generate Code
                    </Button>
                  </Stack>
                </Grid>
                {/* Status Toggle */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.status === 'active'}
                        onChange={(e) =>
                          setForm('form', 'status', e.target.checked ? 'active' : 'inactive')
                        }
                        color="primary"
                      />
                    }
                    label={`Status: ${formData.status === 'active' ? 'Active' : 'Inactive'}`}
                    labelPlacement="start"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Price Information */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader title="Price Information" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Buying Price"
                    type="number"
                    required
                    value={pricingData.buyingPrice}
                    onChange={(e) => setForm('pricing', 'buyingPrice', e.target.value)}
                    error={!!errors['pricing.buyingPrice']}
                    helperText={errors['pricing.buyingPrice']}
                    placeholder="Buying Price"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Selling Price"
                    type="number"
                    required
                    value={pricingData.sellingPrice}
                    onChange={(e) => setForm('pricing', 'sellingPrice', e.target.value)}
                    error={!!errors['pricing.sellingPrice']}
                    helperText={errors['pricing.sellingPrice']}
                    placeholder="10"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Discount Price"
                    type="number"
                    value={pricingData.discountPrice}
                    onChange={(e) => setForm('pricing', 'discountPrice', e.target.value)}
                    error={!!errors['pricing.discountPrice']}
                    helperText={errors['pricing.discountPrice']}
                    placeholder="0"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Current Stock Quantity"
                    type="number"
                    value={pricingData.currentStockQuantity}
                    onChange={(e) => setForm('pricing', 'currentStockQuantity', e.target.value)}
                    placeholder="Current Stock Quantity"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Vat & Tax"
                    value={pricingData.varAndTax}
                    onChange={(e) => setForm('pricing', 'varAndTax', e.target.value)}
                    placeholder="Ex: 18%"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Minimum Order Quantity"
                    type="number"
                    value={pricingData.minimumOrderQuantity}
                    onChange={(e) => setForm('pricing', 'minimumOrderQuantity', e.target.value)}
                    placeholder="1"
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Dynamic Specification */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader
              title="Specification Information"
              action={
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={addSpecification}
                >
                  Add
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Stack spacing={3}>
                {specificationData.map((spec, index) => (
                  <Box key={spec.id}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Specification {index + 1}</Typography>
                      {specificationData.length > 1 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeSpecification(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Select Specification</InputLabel>
                          <Select
                            label="Select Specification"
                            value={spec.specificationId}
                            onChange={(e) =>
                              updateSpecification(index, 'specificationId', e.target.value)
                            }
                            disabled={loadingStates.specifications}
                          >
                            <MenuItem value="">
                              <em>Select Specification</em>
                            </MenuItem>
                            {loadingStates.specifications ? (
                              <MenuItem disabled>Loading specifications...</MenuItem>
                            ) : specifications.length === 0 ? (
                              <MenuItem disabled>No specifications available</MenuItem>
                            ) : (
                              specifications.map((s) => (
                                <MenuItem key={s._id || s.id} value={s._id || s.id}>
                                  {s.name}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl
                          fullWidth
                          error={!!errors[`spec.${index}.specificationvalueIds`]}
                        >
                          <InputLabel>Select Specification Values</InputLabel>
                          <Select
                            multiple
                            label="Select Specification Values"
                            value={spec.specificationvalueIds}
                            onChange={(e) =>
                              updateSpecification(index, 'specificationvalueIds', e.target.value)
                            }
                            disabled={!spec.specificationId || loadingStates.specificationValues}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((val) => {
                                  const v = specificationValues.find(
                                    (x) => (x._id || x.id) === val,
                                  );
                                  return <Chip key={val} size="small" label={v?.name || val} />;
                                })}
                              </Box>
                            )}
                          >
                            {!spec.specificationId ? (
                              <MenuItem disabled>Please select a specification first</MenuItem>
                            ) : loadingStates.specificationValues ? (
                              <MenuItem disabled>Loading specification values...</MenuItem>
                            ) : specificationValues.length === 0 ? (
                              <MenuItem disabled>
                                No values available for this specification
                              </MenuItem>
                            ) : (
                              specificationValues
                                .filter((v) => v.specificationId === spec.specificationId)
                                .map((v) => (
                                  <MenuItem key={v._id || v.id} value={v._id || v.id}>
                                    <Checkbox
                                      checked={spec.specificationvalueIds.includes(v._id || v.id)}
                                    />
                                    <ListItemText primary={v.name} />
                                  </MenuItem>
                                ))
                            )}
                          </Select>
                          <FormHelperText>
                            {errors[`spec.${index}.specificationvalueIds`]}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {index < specificationData.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - 4/12 width */}
        <Grid item xs={12} lg={4}>
          {/* Images */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader title="Images" />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={{
                    border: '2px dashed #00695c',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    bgcolor: '#e0f2f1',
                    cursor: 'pointer',
                  }}
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 2, display: 'block' }}
                  >
                    Supported formats: jpg, jpeg, png (Max: 5MB each)
                  </Typography>
                  <Button variant="contained" color="primary">
                    Choose Files
                  </Button>
                </Box>

                <input
                  ref={imageInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />

                {errors['images'] && (
                  <Typography color="error" variant="caption">
                    {errors['images']}
                  </Typography>
                )}

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Current Images
                    </Typography>
                    <Grid container spacing={1}>
                      {existingImages.map((imagePath, idx) => (
                        <Grid item xs={6} key={`existing-${idx}`}>
                          <Box
                            sx={{
                              position: 'relative',
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              overflow: 'hidden',
                            }}
                          >
                            <img
                              src={`${URLS.FileBase}${imagePath}`}
                              alt={`existing-${idx}`}
                              style={{
                                width: '100%',
                                height: 80,
                                objectFit: 'cover',
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeExistingImage(idx)}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'error.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'error.dark' },
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

                {/* New Images */}
                {imagePreviews.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      New Images (Will be uploaded)
                    </Typography>
                    <Grid container spacing={1}>
                      {imagePreviews.map((src, idx) => (
                        <Grid item xs={6} key={`new-${idx}`}>
                          <Box
                            sx={{
                              position: 'relative',
                              border: '2px solid',
                              borderColor: 'success.main',
                              borderRadius: 1,
                              overflow: 'hidden',
                            }}
                          >
                            <img
                              src={src}
                              alt={`new-preview-${idx}`}
                              style={{
                                width: '100%',
                                height: 80,
                                objectFit: 'cover',
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeImage(idx)}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'error.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'error.dark' },
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
          </Card>

          {/* Video Upload */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader title="Upload Product Video" />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => videoInputRef.current?.click()}
                >
                  {videoPreview || existingVideo ? (
                    <Box sx={{ position: 'relative' }}>
                      <video
                        controls
                        style={{
                          width: '100%',
                          maxHeight: 200,
                          borderRadius: 8,
                        }}
                      >
                        <source
                          src={videoPreview || `${URLS.FileBase}${existingVideo}`}
                          type={video?.type || 'video/mp4'}
                        />
                        Your browser does not support the video tag.
                      </video>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mt: 1 }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {videoPreview ? 'New Video (Will be uploaded)' : 'Current Video'}
                        </Typography>
                        <Button
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (videoPreview) {
                              removeVideo();
                            } else {
                              removeExistingVideo();
                            }
                          }}
                          startIcon={<CloseIcon />}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Box>
                  ) : (
                    <>
                      <VideoIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                      <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                        Choose Video File
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        No file chosen
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supported formats: MP4, AVI, MOV, WMV (Max: 100MB)
                      </Typography>
                    </>
                  )}
                </Box>

                <input
                  ref={videoInputRef}
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={handleVideoUpload}
                />

                {errors['video'] && (
                  <Typography color="error" variant="caption">
                    {errors['video']}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card variant="outlined">
            <CardHeader title="âš  SEO Information" />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="Meta Title"
                  fullWidth
                  value={seoData.metaTitle}
                  onChange={(e) => setForm('seo', 'metaTitle', e.target.value)}
                  placeholder="Meta Title"
                />
                <TextField
                  label="Meta Description"
                  fullWidth
                  multiline
                  minRows={3}
                  value={seoData.metaDescription}
                  onChange={(e) => setForm('seo', 'metaDescription', e.target.value)}
                  placeholder="Meta Description"
                />
                <TextField
                  label="Meta Keywords"
                  fullWidth
                  value={seoData.metakeywords}
                  onChange={(e) => setForm('seo', 'metakeywords', e.target.value)}
                  placeholder="Write keywords separated by commas"
                  helperText="Write keywords separated by commas"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error Display */}
      {errors.submit && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.submit}
        </Alert>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Action Buttons */}
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button variant="outlined" onClick={handleReset} disabled={loading}>
          Reset
        </Button>
        <LoadingButton loading={loading} variant="contained" type="submit" color="success">
          Update Product
        </LoadingButton>
      </Stack>

      {loading && <LinearProgress sx={{ mt: 2 }} />}
    </Box>
  );
};

export default EditProduct;

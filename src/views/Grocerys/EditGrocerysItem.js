





import { FormControl } from '@mui/material';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { IconArrowBackUp } from '@tabler/icons-react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
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
  Alert,
  Switch,
  FormControlLabel,
  styled,
  TextField,
  Chip,
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
  backgroundColor: theme.palette.primary.main + '08',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '12',
    borderColor: theme.palette.primary.dark,
  },
}));

const EditProduct = () => {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const groceryId = localStorage.getItem('groceryId');
  const [variations, setVariations] = useState([]);
  const [subVariations, setSubVariations] = useState([]);

  // State Management
  const [formData, setFormData] = useState({
    productName: '',
    productCode: '',
    categoryId: '',
    subcategoryId: '',
    tags: [],
    brandId: '',
    description: '',
    status: 'active',
    price: '',
    discountPrice: '',
    discountType: 'percentage',
    tax: '',
    stockQuantity: '',
    stockStatus: 'InStock',
    minimumOrderQuantity: '1',
    maximumOrderQuantity: '',
    availabilityStartDate: '',
    availabilityEndDate: '',
    weightId: '',
    unitId: '',
    size: '',
    shelfLife: '',
    organicNonGmo: false,
    isFeaturedProduct: false,
    zoneId: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    discountValue: '',
    variations: [],

  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]); 
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [weights, setWeights] = useState([]);
  const [zones, setZones] = useState([]);
  const [subcategoryCache, setSubcategoryCache] = useState({});
  const [loadingStates, setLoadingStates] = useState({
    categories: false,
    subcategories: false,
    brands: false,
    units: false,
    weights: false,
    zones: false,
  });

  const handleVariationChange = (variationId) => (e) => {
  const subVariationId = e.target.value;
  setFormData((prev) => {
    const existingVariationIndex = prev.variations.findIndex(
      (v) => v.variationId === variationId
    );
    let updatedVariations;

    if (subVariationId) {
      const newVariation = { variationId, subVariationId };
      if (existingVariationIndex >= 0) {
        updatedVariations = [...prev.variations];
        updatedVariations[existingVariationIndex] = newVariation;
      } else {
        updatedVariations = [...prev.variations, newVariation];
      }
    } else {
      updatedVariations = prev.variations.filter((v) => v.variationId !== variationId);
    }

    return { ...prev, variations: updatedVariations };
  });
};
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

  // Fetch Existing Product Data
const fetchServicedata = useCallback(async () => {
  try {
    const res = await axios.post(
      URLS.GetOneGrocerysItem,
      { productId: groceryId },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const data = res.data?.data || {};

    const formattedVariations = Array.isArray(data.variations)
      ? data.variations.map(v => ({
          variationId: v.variationId?._id || v.variationId, 
          subVariationId: v.subVariationId?._id || v.subVariationId
        }))
      : [];

    setFormData({
      ...data,
      tags: data.tags?.split(',').filter(Boolean) || [],
      zoneId: data.zoneId || [],
      metaKeywords: data.metaKeywords?.split(',').filter(Boolean) || [],
      variations: formattedVariations
    });

    // Handle existing images
    if (data.productImage) {
      const imageArray = Array.isArray(data.productImage) 
        ? data.productImage 
        : [data.productImage];
      
      // Store original image paths
      setExistingImages(imageArray);
      
      // Create preview URLs
      const previews = imageArray.map((img) => `${URLS.FileBase}${img}`);
      setImagePreviews(previews);
    }

    if (data.thumbnailImage) {
      setThumbnailPreview(`${URLS.FileBase}${data.thumbnailImage}`);
    }

    if (data.categoryId) {
      fetchSubcategoriesByCategory(data.categoryId);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch product data.');
  }
}, [groceryId, token]);

  const getAllShoppingVariation = () => {
    setLoading(true);
    axios
      .post(
        URLS.getAllShoppingVariation,
        { flagType: 'grocery' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        setVariations(res.data.variations || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to fetch variations');
      })
      .finally(() => setLoading(false));
  };

  // Fetch sub variations
  const getSubShoppingVariation = () => {
    setLoading(true);
    axios
      .post(
        URLS.getSubShoppingVariation,
        { flagType: 'grocery' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        setSubVariations(res.data.subVariations || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to fetch sub variations');
      })
      .finally(() => setLoading(false));
  };


  useEffect(() => {
    fetchServicedata();
     getAllShoppingVariation();
    getSubShoppingVariation();
  }, [fetchServicedata]);

  // API Calls
  const fetchData = useCallback(
    async (url, key, setData, loadingKey, body = {}) => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
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
    [token],
  );

  const fetchCategories = useCallback(() => {
    fetchData(URLS.GetCategories, 'category', setCategories, 'categories', { flagType: 'grocery' });
  }, [fetchData]);

  const fetchSubcategoriesByCategory = useCallback(
    async (categoryId) => {
      if (!categoryId || !token) return;
      if (subcategoryCache[categoryId]) {
        setSubcategories(subcategoryCache[categoryId]);
        return;
      }
      fetchData(
        URLS.GetCategorieIdbySubCategory,
        'data',
        (data) => {
          setSubcategories(data);
          setSubcategoryCache((prev) => ({ ...prev, [categoryId]: data }));
        },
        'subcategories',
        { categoryId },
      );
    },
    [token, subcategoryCache, fetchData],
  );

  const fetchBrands = useCallback(() => {
    fetchData(URLS.GetBrands, 'brands', setBrands, 'brands', { flagType: 'grocery' });
  }, [fetchData]);

  const fetchUnits = useCallback(() => {
    fetchData(URLS.GetUnits, 'units', setUnits, 'units', { flagType: 'grocery' });
  }, [fetchData]);

  const fetchWeights = useCallback(() => {
    fetchData(URLS.GetWeights, 'weights', setWeights, 'weights', { flagType: 'grocery' });
  }, [fetchData]);

  const fetchZones = useCallback(() => {
    fetchData(URLS.GetZones, 'zones', setZones, 'zones');
  }, [fetchData]);

  useEffect(() => {
    if (token) {
      Promise.all([
        fetchCategories(),
        fetchBrands(),
        fetchUnits(),
        fetchWeights(),
        fetchZones(),
      ]).catch((error) => {
        console.error('Error during initial data fetch:', error);
        toast.error('Failed to load initial data');
      });
    } else {
      toast.error('Please log in to continue.');
      navigate('/login');
    }
  }, [token, fetchCategories, fetchBrands, fetchUnits, fetchWeights, fetchZones, navigate]);

  // Validation Function
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required Fields Validation
    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    } else if (formData.productName.length > 100) {
      newErrors.productName = 'Product name cannot exceed 100 characters';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.subcategoryId) {
      newErrors.subcategoryId = 'Subcategory is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (images.length === 0 && imagePreviews.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    } else if (Number(formData.price) > 1000000) {
      newErrors.price = 'Price cannot exceed â‚¹1,000,000';
    }

  if (!formData.discountPrice || isNaN(formData.discountPrice) || Number(formData.discountPrice) < 0) {
  newErrors.discountPrice = "Discount price must be a non-negative number";
} else if (Number(formData.discountPrice) > Number(formData.price)) {
  newErrors.discountPrice = "Discount price must be less than or equal to the original price";
}


    if (
      !formData.stockQuantity ||
      isNaN(formData.stockQuantity) ||
      Number(formData.stockQuantity) < 0
    ) {
      newErrors.stockQuantity = 'Stock quantity must be a non-negative number';
    } else if (Number(formData.stockQuantity) > 100000) {
      newErrors.stockQuantity = 'Stock quantity cannot exceed 100,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, images, imagePreviews]);

  // Event Handlers
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;

      setFormData((prev) => {
        const newData = { ...prev };

        const numericFields = [
          'price',
          'discountPrice',
          'tax',
          'stockQuantity',
          'minimumOrderQuantity',
          'maximumOrderQuantity',
        ];

        if (name === 'categoryId') {
          newData.categoryId = value;
          newData.subcategoryId = '';
          if (value) fetchSubcategoriesByCategory(value);
        } else if (type === 'checkbox') {
          newData[name] = checked;
        } else if (numericFields.includes(name)) {
          if (value === '' || value === null || value === undefined) {
            newData[name] = '';
          } else {
            const n = Number(value);
            if (Number.isNaN(n) || n < 0) return prev;
            newData[name] = value;
          }
        } else {
          newData[name] = value;
        }

        const price = parseFloat(newData.price) || 0;
        const discountPrice = parseFloat(newData.discountPrice) || 0;
        const discountType = newData.discountType;

        let formatted = '';
        if (price > 0 && discountPrice > 0 && discountPrice < price) {
          if (discountType === 'percentage') {
            const percentage = ((price - discountPrice) / price) * 100;
            const p = Number(percentage.toFixed(1));
            formatted = Number.isInteger(p) ? `${Math.trunc(p)}%` : `${p.toFixed(1)}%`;
          } else if (discountType === 'fixed') {
            const amount = price - discountPrice;
            const a = Number(amount.toFixed(1));
            formatted = Number.isInteger(a) ? `${Math.trunc(a)}/-` : `${a.toFixed(1)}/-`;
          }
        }
        newData.discountValue = formatted;
        return newData;
      });

      setErrors((prev) => ({ ...prev, [name]: '' }));
    },
    [fetchSubcategoriesByCategory],
  );

  const handleZoneChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, zoneId: e.target.value }));
    setErrors((prev) => ({ ...prev, zoneId: '' }));
  }, []);

  // const handleTagChange = useCallback((e) => {
  //   const value = e.target.value;
  //   if (value.includes(',')) {
  //     const newTags = value
  //       .split(',')
  //       .map((tag) => tag.trim())
  //       .filter((tag) => tag !== '');
  //     if (newTags.length > 0) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         tags: [...prev.tags, ...newTags],
  //       }));
  //       e.target.value = '';
  //     }
  //   }
  // }, []);


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
        tags: [...prev.tags, ...newTags], // Removed .slice(0, 10)
      }));
      e.target.value = '';
    }
  }
}, []);

  // const handleTagKeyDown = useCallback((e) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     const value = e.target.value.trim();
  //     if (value) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         tags: [...prev.tags, value],
  //       }));
  //       e.target.value = '';
  //     }
  //   }
  // }, []);


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

  const allowedExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.heif', '.heic',
    '.cr2', '.cr3', '.nef', '.arw', '.orf', '.rw2', '.pef', '.raf', '.dng'
  ];

  const handleThumbnailUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      toast.error(`Invalid file type: ${file.name}`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }, []);

const handleImageUpload = useCallback((e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  const currentTotal = imagePreviews.length;
  const totalImages = currentTotal + files.length;
  
  if (totalImages > 5) {
    toast.error('Maximum 5 images allowed');
    return;
  }

  const validFiles = files.filter(file => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      toast.error(`Invalid file type: ${file.name}`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`Image size must be less than 5MB`);
      return false;
    }
    return true;
  });

  if (validFiles.length === 0) return;

  // Add to new images state
  setImages(prev => [...prev, ...validFiles]);
  
  // Create blob URLs for preview
  const newPreviews = validFiles.map(file => URL.createObjectURL(file));
  setImagePreviews(prev => [...prev, ...newPreviews]);
}, [imagePreviews]);

const removeImage = useCallback((index) => {
  const removedPreview = imagePreviews[index];
  
  // Check if it's an existing image (from server) or new image (blob URL)
  if (removedPreview.startsWith(URLS.FileBase)) {
    // It's an existing image - remove from existingImages
    const imagePathToRemove = removedPreview.replace(URLS.FileBase, '');
    setExistingImages(prev => prev.filter(img => img !== imagePathToRemove));
  } else {
    // It's a new image (blob URL) - remove from images array
    // Find the corresponding file in images array by matching preview order
    const newImageIndex = imagePreviews
      .slice(0, index)
      .filter(preview => !preview.startsWith(URLS.FileBase))
      .length;
    
    setImages(prev => prev.filter((_, i) => i !== newImageIndex));
  }
  
  // Remove from previews
  setImagePreviews(prev => prev.filter((_, i) => i !== index));
}, [imagePreviews, existingImages]);

  const removeThumbnail = useCallback(() => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
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
        metaKeywords: [...prev.metaKeywords, ...newKeywords], // Removed .slice(0, 10)
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
        metaKeywords: [...prev.metaKeywords, value], // Removed .slice(0, 10)
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

  // Form Submission
  // const handleSubmit = useCallback(
  //   async (e) => {
  //     e.preventDefault();

  //     if (!validateForm()) {
  //       toast.error('Please fix the validation errors before submitting.');
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       const fd = new FormData();

  //       fd.append("variations", JSON.stringify(formData.variations));

  //       // Append all form data
  //      Object.entries(formData).forEach(([key, value]) => {
  //       if (key === "variations") return; 

  //       if (key === "metaKeywords" || key === "tags") {
  //         fd.append(key, value.join(","));
  //       } else if (key === "zoneId") {
  //         fd.append(key, JSON.stringify(value));
  //       } else {
  //         fd.append(key, value);
  //       }
  //     });


  //       // Append new images
  //       images.forEach((img) => fd.append('productImage', img));
        
  //       // Append thumbnail if new one is uploaded
  //       if (thumbnail) {
  //         fd.append('thumbnailImage', thumbnail);
  //       }

  //       const response = await axios.put(URLS.EditGrocerysItem + groceryId, fd, {
  //         headers: { 
  //           Authorization: `Bearer ${token}`, 
  //           'Content-Type': 'multipart/form-data' 
  //         },
  //       });

  //       if (response.data?.success) {
  //         toast.success('Product updated successfully!');
  //         navigate('/grocerys-item');
  //       } else {
  //         throw new Error(response.data?.message || 'Failed to update product');
  //       }
  //     } catch (error) {
  //       console.error('Error submitting form:', error);
  //       let errorMessage = 'Failed to update product. Please try again.';
  //       if (error.response?.status === 401) {
  //         errorMessage = 'Unauthorized: Please log in again.';
  //         navigate('/login');
  //       } else if (error.response?.data?.message) {
  //         errorMessage = error.response.data.message;
  //       }
  //       toast.error(errorMessage);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [formData, images, thumbnail, token, navigate, validateForm, groceryId],
  // );

const handleSubmit = useCallback(
  async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();

      fd.append("variations", JSON.stringify(formData.variations));

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "variations" || key === "productImage") return;

        if (key === "metaKeywords" || key === "tags") {
          fd.append(key, value.join(","));
        } else if (key === "zoneId") {
          fd.append(key, JSON.stringify(value));
        } else {
          fd.append(key, value);
        }
      });

      // Send existing images that weren't removed
      if (existingImages.length > 0) {
        fd.append('existingImages', JSON.stringify(existingImages));
      }

      // Send new images
      images.forEach((img) => {
        fd.append('productImage', img);
      });
      
      // Append thumbnail if new one is uploaded
      if (thumbnail) {
        fd.append('thumbnailImage', thumbnail);
      } else if (thumbnailPreview && thumbnailPreview.startsWith(URLS.FileBase)) {
        // Keep existing thumbnail
        fd.append('existingThumbnail', thumbnailPreview.replace(URLS.FileBase, ''));
      }

      const response = await axios.put(URLS.EditGrocerysItem + groceryId, fd, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data' 
        },
      });

      if (response.data?.success) {
        toast.success('Product updated successfully!');
        navigate('/grocerys-item');
      } else {
        throw new Error(response.data?.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      let errorMessage = 'Failed to update product. Please try again.';
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
  [formData, images, existingImages, thumbnail, thumbnailPreview, token, navigate, validateForm, groceryId],
);


  // Reset Form
  const handleReset = useCallback(() => {
    setFormData({
      productName: '',
      productCode: '',
      categoryId: '',
      subcategoryId: '',
      tags: [],
      brandId: '',
      description: '',
      status: 'active',
      price: '',
      discountPrice: '',
      discountType: 'percentage',
      tax: '',
      stockQuantity: '',
      stockStatus: 'InStock',
      minimumOrderQuantity: '1',
      maximumOrderQuantity: '',
      availabilityStartDate: '',
      availabilityEndDate: '',
      weightId: '',
      unitId: '',
      size: '',
      shelfLife: '',
      organicNonGmo: false,
      isFeaturedProduct: false,
      zoneId: [],
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      discountValue: '',
      variations: [],
    });
  setImages([]);
  setImagePreviews([]);
  setExistingImages([]);
  setThumbnail(null);
  setThumbnailPreview(null);
  setErrors({});
  if (imageInputRef.current) imageInputRef.current.value = '';
  if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
}, []);

  // Breadcrumb Configuration
  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Edit Grocery' }];

  const generateSku = () => {
    const sku = `SKU${Date.now().toString().slice(-8)}`;
    setFormData((prev) => ({ ...prev, productCode: sku }));
  };

  return (
    <PageContainer title="Edit Grocery">
      <Breadcrumb title="Edit Grocery" items={BCrumb} />
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
        {/* Basic Product Information */}
        <ParentCard title="Basic Product Information" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="productName">
                Product Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                error={!!errors.productName}
                helperText={errors.productName}
                placeholder="Enter product name"
                inputProps={{ 'aria-label': 'Product Name', maxLength: 100 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="productCode">Product Code / SKU</CustomFormLabel>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <CustomTextField
                  fullWidth
                  id="productCode"
                  name="productCode"
                  value={formData.productCode}
                  onChange={handleChange}
                  error={!!errors.productCode}
                  helperText={errors.productCode}
                  placeholder="SKU123456"
                  inputProps={{ maxLength: 50, 'aria-label': 'Product SKU' }}
                />
                <Button variant="outlined" onClick={generateSku} sx={{ minWidth: 'auto', px: 2 }}>
                  Generate
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="categoryId">
                Category <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                required
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                fullWidth
                disabled={loadingStates.categories}
                error={!!errors.categoryId}
                aria-describedby={errors.categoryId ? 'categoryId-error' : undefined}
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </CustomSelect>
              {errors.categoryId && (
                <FormHelperText error id="categoryId-error">
                  {errors.categoryId}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="subcategoryId">
                Subcategory <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                required
                id="subcategoryId"
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleChange}
                fullWidth
                disabled={!formData.categoryId || loadingStates.subcategories}
                error={!!errors.subcategoryId}
                aria-describedby={errors.subcategoryId ? 'subcategoryId-error' : undefined}
              >
                <MenuItem value="">Select Subcategory</MenuItem>
                {subcategories.map((subcategory) => (
                  <MenuItem key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </MenuItem>
                ))}
              </CustomSelect>
              {errors.subcategoryId && (
                <FormHelperText error id="subcategoryId-error">
                  {errors.subcategoryId}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="tags">
                Tags / Keywords <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
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
                  inputProps={{ 'aria-label': 'Tags' }}
                />
              </Box>
              <FormHelperText>Type comma or press Enter to add tags</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="brandId">Brand</CustomFormLabel>
              <CustomSelect
                id="brandId"
                name="brandId"
                value={formData.brandId}
                onChange={handleChange}
                fullWidth
                disabled={loadingStates.brands}
              >
                <MenuItem value="">Select Brand</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="status">
                Status <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                error={!!errors.status}
                aria-describedby={errors.status ? 'status-error' : undefined}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </CustomSelect>
              {errors.status && (
                <FormHelperText error id="status-error">
                  {errors.status}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="description">
                Description <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                multiline
                minRows={4}
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                placeholder="Detailed product description"
                inputProps={{ maxLength: 1000, 'aria-label': 'Description' }}
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Media */}
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardHeader title={`Product Images (${images.length + imagePreviews.length}/5) *`} />
              <Divider />
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
                    disabled={images.length + imagePreviews.length >= 5}
                    aria-label="Upload product images"
                  />
                  {errors.images && <Alert severity="error">{errors.images}</Alert>}
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
          </Grid> */}


          <Grid item xs={12} md={6}>
  <Card sx={{ mb: 3 }}>
    <CardHeader title={`Product Images (${imagePreviews.length}/5)`} />
    <Divider />
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
          disabled={imagePreviews.length >= 5}
          aria-label="Upload product images"
        />
        {errors.images && <Alert severity="error">{errors.images}</Alert>}
        {imagePreviews.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Preview Images ({imagePreviews.length}/5)
            </Typography>
            <Grid container spacing={2}>
              {imagePreviews.map((src, idx) => (
                <Grid item xs={6} sm={4} key={idx}>
                  <Box
                    sx={{
                      position: 'relative',
                      border: '2px solid',
                      borderColor: 'primary.main',
                      borderRadius: 2,
                      overflow: 'hidden',
                      aspectRatio: '1/1',
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
                        height: '100%',
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

          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Thumbnail Image" />
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
                      Supported: JPG, PNG (Max: 5MB)
                    </Typography>
                  </UploadBox>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    aria-label="Upload thumbnail image"
                  />
                  {(thumbnailPreview || formData.thumbnailImage) && (
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
                          src={thumbnailPreview || formData.thumbnailImage}
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
        </Grid>

        {/* Pricing & Discounts */}
        <ParentCard title="Pricing & Discounts" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="price">
                MRP (â‚¹) <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                required
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01, 'aria-label': 'MRP' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="discountPrice">
                Sale Price (â‚¹) <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                required
                type="number"
                id="discountPrice"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                error={!!errors.discountPrice}
                helperText={errors.discountPrice}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01, 'aria-label': 'Sale Price (â‚¹)' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="discountType">Discount Type</CustomFormLabel>
              <CustomSelect
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">Select Discount Type</MenuItem>
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </CustomSelect>
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
              <CustomFormLabel htmlFor="tax">Tax (%)</CustomFormLabel>
              <CustomTextField
                fullWidth
                type="number"
                id="tax"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01, 'aria-label': 'Tax' }}
                helperText="GST/VAT applicable on product"
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Inventory & Stock */}
        <ParentCard title="Inventory & Stock" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="stockQuantity">
                Stock Quantity <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                required
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                error={!!errors.stockQuantity}
                helperText={errors.stockQuantity}
                placeholder="0"
                inputProps={{ min: 0, 'aria-label': 'Stock Quantity' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                <MenuItem value="InStock">In Stock</MenuItem>
                <MenuItem value="OutOfStock">Out of Stock</MenuItem>
                <MenuItem value="Preorder">Preorder</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="minimumOrderQuantity">
                Minimum Order Quantity <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                type="number"
                id="minimumOrderQuantity"
                name="minimumOrderQuantity"
                value={formData.minimumOrderQuantity}
                onChange={handleChange}
                placeholder="1"
                inputProps={{ min: 1, 'aria-label': 'Minimum Order Quantity' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="maximumOrderQuantity">
                Maximum Order Quantity
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                type="number"
                id="maximumOrderQuantity"
                name="maximumOrderQuantity"
                value={formData.maximumOrderQuantity}
                onChange={handleChange}
                error={!!errors.maximumOrderQuantity}
                helperText={errors.maximumOrderQuantity}
                placeholder="0"
                inputProps={{ min: 0, 'aria-label': 'Maximum Order Quantity' }}
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Availability */}
        <ParentCard title="Availability" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="availabilityStartDate">
                Availability Start Date
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                type="date"
                id="availabilityStartDate"
                name="availabilityStartDate"
                value={formData.availabilityStartDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ 'aria-label': 'Availability Start Date' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="availabilityEndDate">Availability End Date</CustomFormLabel>
              <CustomTextField
                fullWidth
                type="date"
                id="availabilityEndDate"
                name="availabilityEndDate"
                value={formData.availabilityEndDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                helperText="Optional expiry or offer end date"
                inputProps={{ 'aria-label': 'Availability End Date' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="zoneId">Select Zone</CustomFormLabel>
              <TextField
                select
                SelectProps={{
                  multiple: true,
                  value: formData.zoneId,
                  onChange: handleZoneChange,
                  renderValue: (selected) =>
                    selected
                      .map((id) => zones.find((zone) => zone._id === id)?.name || '')
                      .join(', '),
                }}
                id="zoneId"
                name="zoneId"
                fullWidth
                error={!!errors.zoneId}
                helperText={errors.zoneId}
                aria-describedby={errors.zoneId ? 'zoneId-error' : undefined}
              >
                {zones.map((zone) => (
                  <MenuItem key={zone._id} value={zone._id}>
                    {zone.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </ParentCard>

        {/* Additional Attributes */}
        <ParentCard title="Additional Attributes (Optional)" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="weightId">Weight</CustomFormLabel>
              <CustomSelect
                id="weightId"
                name="weightId"
                value={formData.weightId}
                onChange={handleChange}
                fullWidth
                disabled={loadingStates.weights}
              >
                <MenuItem value="">Select Weight</MenuItem>
                {weights.map((weight) => (
                  <MenuItem key={weight._id} value={weight._id}>
                    {weight.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="unitId">Unit</CustomFormLabel>
              <CustomSelect
                id="unitId"
                name="unitId"
                value={formData.unitId}
                onChange={handleChange}
                fullWidth
                disabled={loadingStates.units}
              >
                <MenuItem value="">Select Unit</MenuItem>
                {units.map((unit) => (
                  <MenuItem key={unit._id} value={unit._id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="size">Size / Volume</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="E.g., 2L bottle"
                inputProps={{ 'aria-label': 'Size/Volume' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="shelfLife">Shelf Life</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="shelfLife"
                name="shelfLife"
                value={formData.shelfLife}
                onChange={handleChange}
                placeholder="E.g., 6 months from packaging"
                inputProps={{ 'aria-label': 'Shelf Life' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.organicNonGmo}
                    onChange={handleChange}
                    name="organicNonGmo"
                    color="primary"
                    inputProps={{ 'aria-label': 'Organic' }}
                  />
                }
                label="Organic"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFeaturedProduct}
                    onChange={handleChange}
                    name="isFeaturedProduct"
                    color="primary"
                    inputProps={{ 'aria-label': 'Featured Product' }}
                  />
                }
                label="Featured Product"
              />
            </Grid>
          </Grid>
        </ParentCard>
        {/* common variations */}
          <ParentCard title="Product Variations" sx={{ mt: 3 }}>
    <Grid container spacing={3}>
      {variations.map((variation) => {
        const relatedSubVariations = subVariations.filter(
          (sub) => sub.shopVariationId === variation._id
        );
        const selectedSubVariation = formData.variations.find(
          (v) => v.variationId === variation._id
        )?.subVariationId || '';

        return (
          <Grid key={variation._id} item xs={12} sm={6} md={3}>
            <CustomFormLabel htmlFor={variation._id}>
              {variation.name.charAt(0).toUpperCase() + variation.name.slice(1)}
            </CustomFormLabel>
            <FormControl fullWidth>
              <CustomSelect
                id={variation._id}
                name={variation._id}
                value={selectedSubVariation}
                onChange={handleVariationChange(variation._id)}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected)
                    return `Select ${variation.name.charAt(0).toUpperCase() + variation.name.slice(1)}`;
                  const selectedOption = subVariations.find((sub) => sub._id === selected);
                  return selectedOption
                    ? selectedOption.name
                    : `Select ${variation.name.charAt(0).toUpperCase() + variation.name.slice(1)}`;
                }}
              >
                <MenuItem value="">Select {variation.name.charAt(0).toUpperCase() + variation.name.slice(1)}</MenuItem>
                {relatedSubVariations.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </FormControl>
          </Grid>
        );
      })}
    </Grid>
  </ParentCard>
        {/* SEO Settings */}
        <ParentCard title="SEO Settings" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaTitle">SEO Title</CustomFormLabel>
              <CustomTextField
                id="metaTitle"
                name="metaTitle"
                inputProps={{ maxLength: 90, 'aria-label': 'SEO Title' }}
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="Optimized title for search engines"
                fullWidth
                error={!!errors.metaTitle}
                helperText={errors.metaTitle}
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
              {errors.metaKeywords && <FormHelperText error>{errors.metaKeywords}</FormHelperText>}
              <FormHelperText>Type comma or press Enter to add keywords</FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaDescription">SEO Description</CustomFormLabel>
              <CustomTextField
                id="metaDescription"
                name="metaDescription"
                inputProps={{ maxLength: 200, 'aria-label': 'SEO Description' }}
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="Meta description for search results"
                multiline
                rows={4}
                fullWidth
                error={!!errors.metaDescription}
                helperText={errors.metaDescription}
              />
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
            aria-label="Update product"
            type="submit"
          >
            Update Product
          </LoadingButton>
        </Box>
      </form>
    </PageContainer>
  );
};

export default EditProduct;

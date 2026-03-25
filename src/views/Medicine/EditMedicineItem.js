import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  LinearProgress,
  Alert,
  Switch,
  FormControlLabel,
  styled,
  TextField,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { IconArrowBackUp } from '@tabler/icons-react';
import { URLS } from '../../Url';

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

const EditMedicineProduct = () => {
  const navigate = useNavigate();
  const productImageRef = useRef(null);
  const additionalImagesRef = useRef(null);
  const instructionLeafletRef = useRef(null);
  const prescriptionSampleRef = useRef(null);

  const medicineId = localStorage.getItem('medicineId');

  // State Management - Including ALL fields from the provided data
  const [formData, setFormData] = useState({
    // Basic Information
    medicineName: '',
    genericName: '',
    productCodeSku: '',
    typeOfMedicine: '',
    slugUrl: '',

    // Category & Classification
    categoryId: '',
    subcategoryId: '',
    childcategoryId: '',
    manufacturerBrandId: '',
    therapeuticClassId: '',

    // Descriptions
    shortDescription: '',
    fullDescription: '',
    tagsKeywords: [],

    // Regulatory & Prescription
    prescriptionRequired: false,
    scheduleDrugCategoryId: '',
    hsnCode: '',
    drugLicenseRequiredForSeller: false,
    licenseNumber: '',

    // Composition & Ingredients
    activeIngredients: [],
    compositionTable: '',
    saltChemicalCombination: '',
    isControlledSubstance: false,

    // Physical Properties
    packSizeQuantity: '',
    packagingTypeId: '',
    weightId: '',
    dimensions: '',
    formId: '',
    flavor: '',

    // Batch & Expiry
    expiryDatePerBatch: '',
    batchTrackingEnabled: false,
    stockPerBatch: '',

    // Instructions & Safety
    storageInstructions: '',
    usageInstructions: '',
    sideEffects: '',
    precautionsWarnings: '',

    // Pricing
    mrp: '',
    sellingPrice: '',
    discountPercentAmount: '',
    taxRate: '',

    // Stock Management
    stockQuantity: '',
    stockUnitId: '',
    minimumOrderQuantity: '1',

    // Shipping & Delivery
    freeShippingEligible: false,
    codAvailable: true,
    deliveryTimeEstimate: '',
    returnable: false,
    returnPolicyNote: '',

    // Attributes & Filters
    ageGroup: '',
    gender: '',
    isSugarFree: false,
    isHerbalOrganic: false,

    // Advanced Features
    interactionCheckerEnabled: false,
    reviewRatingEnabled: true,
    notifyWhenBackInStock: true,
    inventoryAutoSyncWithErp: false,

    // SEO & Meta
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],

    // Lifecycle & Availability
    productVisibility: 'public',
    productLifecycleStatus: 'active',
    availableFrom: '',
    expiryDiscontinueDate: '',
    enablePreOrders: false,
    zoneId: [],
  });

  const [productImage, setProductImage] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([]);
  const [instructionLeaflet, setInstructionLeaflet] = useState(null);
  const [instructionLeafletPreview, setInstructionLeafletPreview] = useState(null);
  const [prescriptionSample, setPrescriptionSample] = useState(null);
  const [prescriptionSamplePreview, setPrescriptionSamplePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Dropdown Data States
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [weights, setWeights] = useState([]);
  const [zones, setZones] = useState([]);
  const [scheduleDrugCategories, setScheduleDrugCategories] = useState([]);
  const [packagingTypes, setPackagingTypes] = useState([]);
  const [forms, setForms] = useState([]);
  const [therapeuticClasses, setTherapeuticClasses] = useState([]);
  const [subcategoryCache, setSubcategoryCache] = useState({});
  const [childcategories, setChildcategories] = useState([]);
  const [childcategoriesCache, setChildcategoriesCache] = useState({});

  const [loadingStates, setLoadingStates] = useState({
    categories: false,
    subcategories: false,
    childcategories: false,
    brands: false,
    units: false,
    weights: false,
    zones: false,
    scheduleDrugCategories: false,
    packagingTypes: false,
    forms: false,
    therapeuticClasses: false,
  });

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
    if (!medicineId || !token) {
      toast.error('Invalid product ID or authentication');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetOneMedicalItem,
        { productId: medicineId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = res.data?.data || {};

      // Format dates for input fields
      const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
      };

      // Set form data with all fields from the provided JSON structure
      setFormData({
        medicineName: data.medicineName || '',
        genericName: data.genericName || '',
        productCodeSku: data.productCodeSku || '',
        typeOfMedicine: data.typeOfMedicine || '',
        slugUrl: data.slugUrl || '',
        categoryId: data.categoryId || '',
        subcategoryId: data.subcategoryId || '',
        manufacturerBrandId: data.manufacturerBrandId || '',
        therapeuticClassId: data.therapeuticClassId || '',
        shortDescription: data.shortDescription || '',
        fullDescription: data.fullDescription || '',
        tagsKeywords: data.tagsKeywords || [],
        prescriptionRequired: data.prescriptionRequired || false,
        scheduleDrugCategoryId: data.scheduleDrugCategoryId || '',
        hsnCode: data.hsnCode || '',
        drugLicenseRequiredForSeller: data.drugLicenseRequiredForSeller || false,
        licenseNumber: data.licenseNumber || '',
        activeIngredients: data.activeIngredients || [],
        compositionTable: data.compositionTable || '',
        saltChemicalCombination: data.saltChemicalCombination || '',
        isControlledSubstance: data.isControlledSubstance || false,
        packSizeQuantity: data.packSizeQuantity || '',
        packagingTypeId: data.packagingTypeId || '',
        weightId: data.weightId || '',
        dimensions: data.dimensions || '',
        formId: data.formId || '',
        flavor: data.flavor || '',
        expiryDatePerBatch: formatDate(data.expiryDatePerBatch),
        batchTrackingEnabled: data.batchTrackingEnabled || false,
        stockPerBatch: data.stockPerBatch || '',
        storageInstructions: data.storageInstructions || '',
        usageInstructions: data.usageInstructions || '',
        sideEffects: data.sideEffects || '',
        precautionsWarnings: data.precautionsWarnings || '',
        mrp: data.mrp || '',
        sellingPrice: data.sellingPrice || '',
        discountPercentAmount: data.discountPercentAmount || '',
        taxRate: data.taxRate || '',
        stockQuantity: data.stockQuantity || '',
        stockUnitId: data.stockUnitId || '',
        minimumOrderQuantity: data.minimumOrderQuantity || '1',
        freeShippingEligible: data.freeShippingEligible || false,
        codAvailable: data.codAvailable || true,
        deliveryTimeEstimate: data.deliveryTimeEstimate || '',
        returnable: data.returnable || false,
        returnPolicyNote: data.returnPolicyNote || '',
        ageGroup: data.ageGroup || '',
        gender: data.gender || '',
        isSugarFree: data.isSugarFree || false,
        isHerbalOrganic: data.isHerbalOrganic || false,
        interactionCheckerEnabled: data.interactionCheckerEnabled || false,
        reviewRatingEnabled: data.reviewRatingEnabled || true,
        notifyWhenBackInStock: data.notifyWhenBackInStock || true,
        inventoryAutoSyncWithErp: data.inventoryAutoSyncWithErp || false,
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        metaKeywords: data.metaKeywords?.split(',').filter(Boolean) || [],
        productVisibility: data.productVisibility || 'public',
        productLifecycleStatus: data.productLifecycleStatus || 'active',
        availableFrom: formatDate(data.availableFrom),
        expiryDiscontinueDate: formatDate(data.expiryDiscontinueDate),
        enablePreOrders: data.enablePreOrders || false,
        zoneId: data.zoneId || [],
      });

      // Handle existing images and files
      if (data.productImage) {
        setProductImagePreview(`${URLS.FileBase}${data.productImage}`);
      }

      if (data.additionalImages && data.additionalImages.length > 0) {
        const additionalPreviews = data.additionalImages.map((img) => `${URLS.FileBase}${img}`);
        setAdditionalImagesPreviews(additionalPreviews);
      }

      if (data.instructionLeaflet) {
        setInstructionLeafletPreview(`${URLS.FileBase}${data.instructionLeaflet}`);
      }

      if (data.prescriptionSample) {
        setPrescriptionSamplePreview(`${URLS.FileBase}${data.prescriptionSample}`);
      }

      // Load subcategories if category is set
      if (data.categoryId) {
        await fetchSubcategoriesByCategory(data.categoryId);
      }

      if (data.subcategoryId) {
        await fetchChildcategoriesBySubCategory(data.subcategoryId);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch product data.');
    } finally {
      setLoading(false);
    }
  }, [medicineId, token]);

  useEffect(() => {
    if (medicineId && token) {
      fetchServicedata();
    }
  }, [fetchServicedata]);

  // API Calls for dropdown data
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
    fetchData(URLS.GetCategories, 'category', setCategories, 'categories', {
      flagType: 'medicine',
    });
  }, [fetchData]);

  const fetchSubcategoriesByCategory = useCallback(
    async (categoryId) => {
      if (!categoryId || !token) return;

      if (subcategoryCache[categoryId]) {
        setSubcategories(subcategoryCache[categoryId]);
        return;
      }

      try {
        setLoadingStates((prev) => ({ ...prev, subcategories: true }));
        const response = await axios.post(
          URLS.GetCategorieIdbySubCategory,
          { categoryId, flagType: 'medicine' },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data?.success) {
          const subcategoryData = response.data.data || [];
          setSubcategories(subcategoryData);
          setSubcategoryCache((prev) => ({ ...prev, [categoryId]: subcategoryData }));
        } else {
          setSubcategories([]);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setSubcategories([]);
        toast.error('Failed to fetch subcategories');
      } finally {
        setLoadingStates((prev) => ({ ...prev, subcategories: false }));
      }
    },
    [token, subcategoryCache],
  );

  const fetchChildcategoriesBySubCategory = useCallback(
    async (subcategoryId) => {
      if (!subcategoryId || !token) return;

      if (childcategoriesCache[subcategoryId]) {
        setChildcategories(childcategoriesCache[subcategoryId]);
        return;
      }

      try {
        setLoadingStates((prev) => ({ ...prev, subcategories: true }));
        const response = await axios.post(
          URLS.GetSubCategoriesIdByChildCategories,
          { subcategoryId, flagType: 'medicine' },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data?.success) {
          const subcategoryData = response.data.childcategorys || [];
          setChildcategories(subcategoryData);
          setChildcategoriesCache((prev) => ({ ...prev, [subcategoryId]: subcategoryData }));
        } else {
          setChildcategories([]);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setSubcategories([]);
        toast.error('Failed to fetch subcategories');
      } finally {
        setLoadingStates((prev) => ({ ...prev, subcategories: false }));
      }
    },
    [token, subcategoryCache],
  );

  const fetchBrands = useCallback(() => {
    fetchData(URLS.GetBrands, 'brands', setBrands, 'brands', { flagType: 'medicine' });
  }, [fetchData]);

  const fetchUnits = useCallback(() => {
    fetchData(URLS.GetUnits, 'units', setUnits, 'units', { flagType: 'medicine' });
  }, [fetchData]);

  const fetchWeights = useCallback(() => {
    fetchData(URLS.GetWeights, 'weights', setWeights, 'weights', { flagType: 'medicine' });
  }, [fetchData]);

  const fetchZones = useCallback(() => {
    fetchData(URLS.GetZones, 'zones', setZones, 'zones');
  }, [fetchData]);

  const fetchScheduleDrugCategories = useCallback(() => {
    fetchData(
      URLS.GetDrugCategories,
      'drugcategory',
      setScheduleDrugCategories,
      'scheduleDrugCategories',
      {
        flagType: 'medicine',
      },
    );
  }, [fetchData]);

  const fetchPackagingTypes = useCallback(() => {
    fetchData(URLS.GetPackingTypes, 'packingtype', setPackagingTypes, 'packagingTypes', {
      flagType: 'medicine',
    });
  }, [fetchData]);

  const fetchForms = useCallback(() => {
    fetchData(URLS.GetMedicineForms, 'medicineform', setForms, 'forms', {
      flagType: 'medicine',
    });
  }, [fetchData]);

  const fetchTherapeuticClasses = useCallback(() => {
    fetchData(
      URLS.GetTherapeuticClasss,
      'therapeutic_class',
      setTherapeuticClasses,
      'therapeuticClasses',
      { flagType: 'medicine' },
    );
  }, [fetchData]);

  useEffect(() => {
    if (token) {
      fetchCategories();
      fetchBrands();
      fetchUnits();
      fetchWeights();
      fetchZones();
      fetchScheduleDrugCategories();
      fetchPackagingTypes();
      fetchForms();
      fetchTherapeuticClasses();
    } else {
      toast.error('Please log in to continue.');
      navigate('/login');
    }
  }, [
    token,
    fetchCategories,
    fetchBrands,
    fetchUnits,
    fetchWeights,
    fetchZones,
    fetchScheduleDrugCategories,
    fetchPackagingTypes,
    fetchForms,
    fetchTherapeuticClasses,
    navigate,
  ]);

  // Event Handlers
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => {
        const newData = { ...prev };
        if (name === 'categoryId') {
          newData.categoryId = value;
          newData.subcategoryId = '';
          if (value) {
            fetchSubcategoriesByCategory(value);
          } else {
            setSubcategories([]);
          }
        } else if (name === 'subcategoryId') {
          newData.subcategoryId = value;
          newData.childcategoryId = '';
          if (value) fetchChildcategoriesBySubCategory(value);
        } else if (type === 'checkbox') {
          newData[name] = checked;
        } else {
          if (
            [
              'mrp',
              'sellingPrice',
              'discountPercentAmount',
              'taxRate',
              'stockQuantity',
              'minimumOrderQuantity',
              'stockPerBatch',
            ].includes(name) &&
            value < 0
          ) {
            return prev;
          }
          newData[name] = value;
        }

        const mrp = parseFloat(newData.mrp) || 0;
        const sellingPrice = parseFloat(newData.sellingPrice) || 0;

        let formatted = '';
        if (mrp > 0 && sellingPrice > 0 && sellingPrice < mrp) {
          const percentage = ((mrp - sellingPrice) / mrp) * 100;
          const p = Number(percentage.toFixed(1));
          formatted = Number.isInteger(p) ? `${Math.trunc(p)}%` : `${p.toFixed(1)}%`;
        }

        newData.discountPercentAmount = formatted;

        return newData;
      });
      setErrors((prev) => ({ ...prev, [name]: '' }));
    },
    [fetchSubcategoriesByCategory, fetchChildcategoriesBySubCategory],
  );

  const handleZoneChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, zoneId: e.target.value }));
  }, []);

const handleKeywordChange = useCallback((e, field) => {
  const value = e.target.value;
  if (value.includes(',')) {
    const newKeywords = value
      .split(',')
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword !== ''); // Removed length limit
    if (newKeywords.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], ...newKeywords], // No slice limit
      }));
      e.target.value = '';
    }
  }
}, []);
const handleKeywordKeyDown = useCallback((e, field) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const value = e.target.value.trim();
    if (value) { // Removed length limit
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value], // No slice limit
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

  const handleFileUpload = useCallback(
    (e, type) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      if (type === 'additionalImages') {
        const newFiles = Array.from(files);
        const currentCount = additionalImages.length;
        const availableSlots = 5 - currentCount;

        if (newFiles.length > availableSlots) {
          toast.error(`You can only add ${availableSlots} more images (maximum 5 total)`);
          return;
        }

        const validFiles = [];
        const validPreviews = [];

        for (const file of newFiles) {
          if (!file.type.startsWith('image/')) {
            toast.error(`${file.name} is not a valid image file`);
            continue;
          }

          if (file.size > 5 * 1024 * 1024) {
            toast.error(`${file.name} is too large. Maximum size is 5MB`);
            continue;
          }

          validFiles.push(file);
          validPreviews.push(URL.createObjectURL(file));
        }

        if (validFiles.length > 0) {
          setAdditionalImages((prev) => [...prev, ...validFiles]);
          setAdditionalImagesPreviews((prev) => [...prev, ...validPreviews]);
        }

        e.target.value = '';
        return;
      }

      const file = files[0];

      if (type === 'productImage' || type === 'prescriptionSample') {
        if (!file.type.startsWith('image/')) {
          toast.error('Only image files are allowed');
          return;
        }
      } else if (type === 'instructionLeaflet') {
        if (file.type !== 'application/pdf') {
          toast.error('Only PDF files are allowed for instruction leaflet');
          return;
        }
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      if (type === 'productImage') {
        setProductImage(file);
        setProductImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, productImage: '' }));
      } else if (type === 'instructionLeaflet') {
        setInstructionLeaflet(file);
        setInstructionLeafletPreview(file.name);
      } else if (type === 'prescriptionSample') {
        setPrescriptionSample(file);
        setPrescriptionSamplePreview(URL.createObjectURL(file));
      }
    },
    [additionalImages.length],
  );

  const removeFile = useCallback((type, idx = null) => {
    if (type === 'productImage') {
      setProductImage(null);
      setProductImagePreview(null);
      if (productImageRef.current) productImageRef.current.value = '';
    } else if (type === 'additionalImages' && idx !== null) {
      setAdditionalImages((prev) => prev.filter((_, i) => i !== idx));
      setAdditionalImagesPreviews((prev) => {
        if (prev[idx] && prev[idx].startsWith('blob:')) {
          URL.revokeObjectURL(prev[idx]);
        }
        return prev.filter((_, i) => i !== idx);
      });
    } else if (type === 'instructionLeaflet') {
      setInstructionLeaflet(null);
      setInstructionLeafletPreview(null);
      if (instructionLeafletRef.current) instructionLeafletRef.current.value = '';
    } else if (type === 'prescriptionSample') {
      setPrescriptionSample(null);
      setPrescriptionSamplePreview(null);
      if (prescriptionSampleRef.current) prescriptionSampleRef.current.value = '';
    }
  }, []);

  // Validation Function
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!productImage) {
      newErrors.productImage = 'At least one mainImage is required';
    }
    if (additionalImages.length === 0) {
      newErrors.additionalImages = 'At least one Additional Images is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, additionalImages, productImage]);

  // Validation
  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.medicineName.trim()) newErrors.medicineName = 'Medicine name is required';
    if (!formData.productCodeSku.trim()) newErrors.productCodeSku = 'Product SKU is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category selection is required';
    if (!formData.subcategoryId) newErrors.subcategoryId = 'Subcategory selection is required';
    if (!formData.shortDescription.trim())
      newErrors.shortDescription = 'Short description is required';
    if (!formData.fullDescription.trim())
      newErrors.fullDescription = 'Full description is required';
    if (!formData.mrp) newErrors.mrp = 'MRP is required';
    if (!formData.sellingPrice) newErrors.sellingPrice = 'Selling price is required';
    if (!formData.stockQuantity) newErrors.stockQuantity = 'Stock quantity is required';
    if (!formData.stockUnitId) newErrors.stockUnitId = 'Stock unit is required';

    if (!productImage && !productImagePreview) {
      newErrors.productImage = 'Product image is required';
    }

    if (
      formData.discountPercentAmount &&
      parseFloat(formData.discountPercentAmount) >= parseFloat(formData.mrp)
    ) {
      newErrors.discountPercentAmount = 'Discount must be less than MRP';
    }
    if (formData.prescriptionRequired && !formData.scheduleDrugCategoryId) {
      newErrors.scheduleDrugCategoryId =
        'Schedule drug category is required for prescription medicines';
    }
    if (formData.batchTrackingEnabled && !formData.expiryDatePerBatch) {
      newErrors.expiryDatePerBatch = 'Expiry date is required when batch tracking is enabled';
    }
    if (formData.drugLicenseRequiredForSeller && !formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required when drug license is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, productImage, productImagePreview]);

  // Form Submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setLoading(true);
      try {
        const fd = new FormData();

        // Add all form data
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'metaKeywords' || key === 'tagsKeywords') {
            fd.append(key, Array.isArray(value) ? value.join(',') : value);
          } else if (key === 'zoneId' || key === 'activeIngredients') {
            fd.append(key, JSON.stringify(value));
          } else {
            fd.append(key, value);
          }
        });

        // Add files
        if (productImage) fd.append('productImage', productImage);
        additionalImages.forEach((img) => fd.append('additionalImages', img));
        if (instructionLeaflet) fd.append('instructionLeaflet', instructionLeaflet);
        if (prescriptionSample) fd.append('prescriptionSample', prescriptionSample);

        const response = await axios.put(`${URLS.EditMedicalItem}${medicineId}`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data?.success) {
          toast.success('Medicine product updated successfully!');
          navigate('/medicine-item');
        } else {
          throw new Error(response.data?.message || 'Failed to update medicine product');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        let errorMessage = 'Failed to update medicine product. Please try again.';
        if (error.response?.status === 401) {
          errorMessage = 'Unauthorized: Please log in again.';
          navigate('/login');
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        toast.error(errorMessage);
        setErrors({ submit: errorMessage });
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      productImage,
      additionalImages,
      instructionLeaflet,
      prescriptionSample,
      token,
      validateForm,
      navigate,
      medicineId,
    ],
  );

  // Reset Form
  const handleReset = useCallback(() => {
    setFormData({
      medicineName: '',
      genericName: '',
      productCodeSku: '',
      typeOfMedicine: '',
      slugUrl: '',
      categoryId: '',
      subcategoryId: '',
      manufacturerBrandId: '',
      therapeuticClassId: '',
      shortDescription: '',
      fullDescription: '',
      tagsKeywords: [],
      prescriptionRequired: false,
      scheduleDrugCategoryId: '',
      hsnCode: '',
      drugLicenseRequiredForSeller: false,
      licenseNumber: '',
      activeIngredients: [],
      compositionTable: '',
      saltChemicalCombination: '',
      isControlledSubstance: false,
      packSizeQuantity: '',
      packagingTypeId: '',
      weightId: '',
      dimensions: '',
      formId: '',
      flavor: '',
      expiryDatePerBatch: '',
      batchTrackingEnabled: false,
      stockPerBatch: '',
      storageInstructions: '',
      usageInstructions: '',
      sideEffects: '',
      precautionsWarnings: '',
      mrp: '',
      sellingPrice: '',
      discountPercentAmount: '',
      taxRate: '',
      stockQuantity: '',
      stockUnitId: '',
      minimumOrderQuantity: '1',
      freeShippingEligible: false,
      codAvailable: true,
      deliveryTimeEstimate: '',
      returnable: false,
      returnPolicyNote: '',
      ageGroup: '',
      gender: '',
      isSugarFree: false,
      isHerbalOrganic: false,
      interactionCheckerEnabled: false,
      reviewRatingEnabled: true,
      notifyWhenBackInStock: true,
      inventoryAutoSyncWithErp: false,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      productVisibility: 'public',
      productLifecycleStatus: 'active',
      availableFrom: '',
      expiryDiscontinueDate: '',
      enablePreOrders: false,
      zoneId: [],
    });
    setProductImage(null);
    setProductImagePreview(null);
    setAdditionalImages([]);
    setAdditionalImagesPreviews([]);
    setInstructionLeaflet(null);
    setInstructionLeafletPreview(null);
    setPrescriptionSample(null);
    setPrescriptionSamplePreview(null);
    setSubcategories([]);
    setErrors({});

    // Clear file inputs
    if (productImageRef.current) productImageRef.current.value = '';
    if (additionalImagesRef.current) additionalImagesRef.current.value = '';
    if (instructionLeafletRef.current) instructionLeafletRef.current.value = '';
    if (prescriptionSampleRef.current) prescriptionSampleRef.current.value = '';
  }, []);

  // Breadcrumb Configuration
  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Edit Medicine Product' }];

  const generateSku = () => {
    const sku = `SKU${Date.now().toString().slice(-8)}`;
    setFormData((prev) => ({ ...prev, productCodeSku: sku }));
  };

  return (
    <PageContainer title="Edit Medicine Product">
      <Breadcrumb title="Edit Medicine Product" items={BCrumb} />
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
        {/* Basic Medicine Information */}
        <ParentCard title="Basic Medicine Information" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="medicineName" required>
                Medicine Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                id="medicineName"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleChange}
                error={!!errors.medicineName}
                helperText={errors.medicineName}
                placeholder="Enter medicine name (e.g., Paracetamol 500mg)"
                inputProps={{ 'aria-label': 'Medicine Name' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="genericName">
                Generic Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                id="genericName"
                name="genericName"
                value={formData.genericName}
                onChange={handleChange}
                placeholder="E.g., Paracetamol"
                inputProps={{ 'aria-label': 'Generic Name' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="productCodeSku" required>
                Product Code / SKU
              </CustomFormLabel>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <CustomTextField
                  fullWidth
                  id="productCodeSku"
                  name="productCodeSku"
                  value={formData.productCodeSku}
                  onChange={handleChange}
                  error={!!errors.productCodeSku}
                  helperText={errors.productCodeSku}
                  placeholder="MED123456"
                  inputProps={{ 'aria-label': 'Product SKU' }}
                />
                <Button variant="outlined" onClick={generateSku} sx={{ minWidth: 'auto', px: 2 }}>
                  Generate
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="slugUrl">Slug URL</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="slugUrl"
                name="slugUrl"
                value={formData.slugUrl}
                onChange={handleChange}
                placeholder="medicine-name-slug"
                inputProps={{ 'aria-label': 'Slug URL' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="typeOfMedicine">Type of Medicine</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="typeOfMedicine"
                name="typeOfMedicine"
                value={formData.typeOfMedicine}
                onChange={handleChange}
                placeholder="E.g., Tablet"
                inputProps={{ 'aria-label': 'Type of Medicine' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="categoryId" required>
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
              <CustomFormLabel htmlFor="subcategoryId" required>
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
                <MenuItem value="">
                  {loadingStates.subcategories ? 'Loading...' : 'Select Subcategory'}
                </MenuItem>
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
              <CustomFormLabel htmlFor="childcategoryId">Child Category</CustomFormLabel>
              <CustomSelect
                id="childcategoryId"
                name="childcategoryId"
                value={formData.childcategoryId}
                onChange={handleChange}
                fullWidth
                disabled={!formData.subcategoryId || loadingStates.childcategories}
              >
                <MenuItem value="">Select Child Category</MenuItem>
                {childcategories.map((childcategory) => (
                  <MenuItem key={childcategory._id} value={childcategory._id}>
                    {childcategory.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="manufacturerBrandId">Manufacturer / Brand</CustomFormLabel>
              <CustomSelect
                id="manufacturerBrandId"
                name="manufacturerBrandId"
                value={formData.manufacturerBrandId}
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
              <CustomFormLabel htmlFor="therapeuticClassId">Therapeutic Class</CustomFormLabel>
              <CustomSelect
                id="therapeuticClassId"
                name="therapeuticClassId"
                value={formData.therapeuticClassId}
                onChange={handleChange}
                fullWidth
                disabled={loadingStates.therapeuticClasses}
              >
                <MenuItem value="">Select Therapeutic Class</MenuItem>
                {therapeuticClasses.map((cls) => (
                  <MenuItem key={cls._id} value={cls._id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.prescriptionRequired}
                    onChange={handleChange}
                    name="prescriptionRequired"
                    color="primary"
                  />
                }
                label="Prescription Required"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="shortDescription">
                Short Description <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                multiline
                minRows={2}
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                error={!!errors.shortDescription}
                helperText={errors.shortDescription}
                placeholder="Brief description of the medicine"
                inputProps={{ 'aria-label': 'Short Description' }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="fullDescription">
                <span style={{ color: 'red' }}>*</span>
                Full Description
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                multiline
                minRows={4}
                id="fullDescription"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                error={!!errors.fullDescription}
                helperText={errors.fullDescription}
                placeholder="Detailed description of the medicine"
                inputProps={{ 'aria-label': 'Full Description' }}
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Regulatory Information */}
        <ParentCard title="Regulatory Information" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="scheduleDrugCategoryId">
                Schedule Drug Category
              </CustomFormLabel>
              <CustomSelect
                id="scheduleDrugCategoryId"
                name="scheduleDrugCategoryId"
                value={formData.scheduleDrugCategoryId}
                onChange={handleChange}
                fullWidth
                disabled={loadingStates.scheduleDrugCategories || !formData.prescriptionRequired}
                error={!!errors.scheduleDrugCategoryId}
                aria-describedby={
                  errors.scheduleDrugCategoryId ? 'scheduleDrugCategoryId-error' : undefined
                }
              >
                <MenuItem value="">Select Schedule</MenuItem>
                {scheduleDrugCategories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </CustomSelect>
              {errors.scheduleDrugCategoryId && (
                <FormHelperText error id="scheduleDrugCategoryId-error">
                  {errors.scheduleDrugCategoryId}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="hsnCode">HSN Code</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="hsnCode"
                name="hsnCode"
                value={formData.hsnCode}
                onChange={handleChange}
                placeholder="E.g., 30045010"
                inputProps={{ 'aria-label': 'HSN Code' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.drugLicenseRequiredForSeller}
                    onChange={handleChange}
                    name="drugLicenseRequiredForSeller"
                    color="primary"
                  />
                }
                label="Drug License Required for Seller *"
              />
            </Grid>
            {formData.drugLicenseRequiredForSeller && (
              <Grid item xs={12} md={6}>
                <CustomFormLabel htmlFor="licenseNumber">License Number</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  error={!!errors.licenseNumber}
                  helperText={errors.licenseNumber}
                  placeholder="E.g., LIC-9876543210"
                  inputProps={{ 'aria-label': 'License Number' }}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="expiryDatePerBatch">
                Expiry Date (Per Batch) <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                type="date"
                id="expiryDatePerBatch"
                name="expiryDatePerBatch"
                value={formData.expiryDatePerBatch}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.expiryDatePerBatch}
                helperText={errors.expiryDatePerBatch}
                inputProps={{ 'aria-label': 'Expiry Date Per Batch' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.batchTrackingEnabled}
                    onChange={handleChange}
                    name="batchTrackingEnabled"
                    color="primary"
                  />
                }
                label="Batch Tracking Enabled"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="storageInstructions">Storage Instructions</CustomFormLabel>
              <CustomTextField
                fullWidth
                multiline
                minRows={2}
                id="storageInstructions"
                name="storageInstructions"
                value={formData.storageInstructions}
                onChange={handleChange}
                placeholder="E.g., Store in a cool and dry place"
                inputProps={{ 'aria-label': 'Storage Instructions' }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="usageInstructions">Usage Instructions</CustomFormLabel>
              <CustomTextField
                fullWidth
                multiline
                minRows={2}
                id="usageInstructions"
                name="usageInstructions"
                value={formData.usageInstructions}
                onChange={handleChange}
                placeholder="E.g., Take 1 tablet every 6 hours"
                inputProps={{ 'aria-label': 'Usage Instructions' }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="sideEffects">Side Effects</CustomFormLabel>
              <CustomTextField
                fullWidth
                multiline
                minRows={2}
                id="sideEffects"
                name="sideEffects"
                value={formData.sideEffects}
                onChange={handleChange}
                placeholder="E.g., Nausea, rash"
                inputProps={{ 'aria-label': 'Side Effects' }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="precautionsWarnings">
                Precautions / Warnings
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                multiline
                minRows={2}
                id="precautionsWarnings"
                name="precautionsWarnings"
                value={formData.precautionsWarnings}
                onChange={handleChange}
                placeholder="E.g., Do not exceed 4g per day"
                inputProps={{ 'aria-label': 'Precautions/Warnings' }}
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Media & Documents */}
        <ParentCard title="Media & Documents" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {/* Product Image */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Product Image *" />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <UploadBox onClick={() => productImageRef.current?.click()}>
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                        Upload Product Image
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        High-quality image of packaging
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supported: JPG, PNG (Max: 5MB)
                      </Typography>
                    </UploadBox>
                    <input
                      ref={productImageRef}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'productImage')}
                      aria-label="Upload product image"
                    />
                    {errors.productImage && <Alert severity="error">{errors.productImage}</Alert>}
                    {productImagePreview && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Product Image Preview
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
                            src={productImagePreview}
                            alt="Product image preview"
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
                            onClick={() => removeFile('productImage')}
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
                            aria-label="Remove product image"
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

            {/* Additional Images */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title={`Additional Images (${additionalImagesPreviews.length}/5) *`} />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <UploadBox
                      onClick={() => additionalImagesRef.current?.click()}
                      sx={{
                        opacity: additionalImagesPreviews.length >= 5 ? 0.5 : 1,
                        cursor: additionalImagesPreviews.length >= 5 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                        Upload Additional Images
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Side views, dosage info, etc.
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {additionalImagesPreviews.length >= 5
                          ? 'Maximum 5 images reached'
                          : 'Supported: JPG, PNG (Max: 5MB each)'}
                      </Typography>
                    </UploadBox>
                    <input
                      ref={additionalImagesRef}
                      type="file"
                      hidden
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'additionalImages')}
                      disabled={additionalImagesPreviews.length >= 5}
                      aria-label="Upload additional images"
                    />
                    {errors.additionalImages && (
                      <Alert severity="error">{errors.additionalImages}</Alert>
                    )}
                    {additionalImagesPreviews.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Additional Images Preview
                        </Typography>
                        <Grid container spacing={1}>
                          {additionalImagesPreviews.map((src, idx) => (
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
                                  alt={`Additional image ${idx + 1}`}
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
                                  onClick={() => removeFile('additionalImages', idx)}
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
                                  aria-label={`Remove additional image ${idx + 1}`}
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

            {/* Instruction Leaflet */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Instruction Leaflet" />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <UploadBox onClick={() => instructionLeafletRef.current?.click()}>
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                        Upload Instruction Leaflet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Official usage and side effects
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supported: PDF (Max: 5MB)
                      </Typography>
                    </UploadBox>
                    <input
                      ref={instructionLeafletRef}
                      type="file"
                      hidden
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload(e, 'instructionLeaflet')}
                      aria-label="Upload instruction leaflet"
                    />
                    {(instructionLeaflet || instructionLeafletPreview) && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Instruction Leaflet
                        </Typography>
                        <Box
                          sx={{
                            position: 'relative',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            borderRadius: 2,
                            p: 2,
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                          }}
                        >
                          <PdfIcon sx={{ color: 'error.main' }} />
                          <Typography variant="body2">
                            {instructionLeaflet?.name || 'Existing instruction leaflet'}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => removeFile('instructionLeaflet')}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'error.main',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'error.dark',
                              },
                            }}
                            aria-label="Remove instruction leaflet"
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

            {/* Prescription Sample */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Prescription Sample" />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <UploadBox onClick={() => prescriptionSampleRef.current?.click()}>
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                        Upload Prescription Sample
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Visual reference of Rx format
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supported: JPG, PNG (Max: 5MB)
                      </Typography>
                    </UploadBox>
                    <input
                      ref={prescriptionSampleRef}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'prescriptionSample')}
                      aria-label="Upload prescription sample"
                    />
                    {prescriptionSamplePreview && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Prescription Sample Preview
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
                            src={prescriptionSamplePreview}
                            alt="Prescription sample preview"
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
                            onClick={() => removeFile('prescriptionSample')}
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
                            aria-label="Remove prescription sample"
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
        </ParentCard>

        {/* Pricing & Stock Details */}
        <ParentCard title="Pricing & Stock Details" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="mrp" required>
                MRP (â‚¹) <span style={{ color: 'red' }}>*</span>;
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                type="number"
                id="mrp"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                error={!!errors.mrp}
                helperText={errors.mrp}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01, 'aria-label': 'MRP' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="sellingPrice">
                Selling Price (â‚¹) <span style={{ color: 'red' }}>*</span>;
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                required
                type="number"
                id="sellingPrice"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                error={!!errors.sellingPrice}
                helperText={errors.sellingPrice}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01, 'aria-label': 'Selling Price' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="discountPercentAmount">Discount (%)</CustomFormLabel>
              <CustomTextField
                fullWidth
                type="text"
                id="discountPercentAmount"
                name="discountPercentAmount"
                value={formData.discountPercentAmount}
                disabled
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
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="stockQuantity">
                Stock Quantity <span style={{ color: 'red' }}>*</span>;
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
              <CustomFormLabel htmlFor="stockUnitId" required>
                Stock Unit <span style={{ color: 'red' }}>*</span>;
              </CustomFormLabel>
              <CustomSelect
                required
                id="stockUnitId"
                name="stockUnitId"
                value={formData.stockUnitId}
                onChange={handleChange}
                fullWidth
                disabled={loadingStates.units}
                error={!!errors.stockUnitId}
                aria-describedby={errors.stockUnitId ? 'stockUnitId-error' : undefined}
              >
                <MenuItem value="">Select Unit</MenuItem>
                {units.map((unit) => (
                  <MenuItem key={unit._id} value={unit._id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </CustomSelect>
              {errors.stockUnitId && (
                <FormHelperText error id="stockUnitId-error">
                  {errors.stockUnitId}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="minimumOrderQuantity">
                Minimum Order Quantity
              </CustomFormLabel>
              <CustomTextField
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
            {formData.batchTrackingEnabled && (
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="stockPerBatch">Stock Per Batch</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  type="number"
                  id="stockPerBatch"
                  name="stockPerBatch"
                  value={formData.stockPerBatch}
                  onChange={handleChange}
                  placeholder="0"
                  inputProps={{ min: 0, 'aria-label': 'Stock Per Batch' }}
                />
              </Grid>
            )}
          </Grid>
        </ParentCard>

        {/* Composition & Ingredients */}
        <ParentCard title="Composition & Ingredients" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="activeIngredients">Active Ingredients</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="activeIngredients"
                name="activeIngredients"
                value={formData.activeIngredients.join(', ')}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    activeIngredients: value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  }));
                }}
                placeholder="E.g., Paracetamol 500mg, Caffeine 50mg"
                inputProps={{ 'aria-label': 'Active Ingredients' }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="compositionTable">Composition Table</CustomFormLabel>
              <CustomTextField
                fullWidth
                multiline
                minRows={2}
                id="compositionTable"
                name="compositionTable"
                value={formData.compositionTable}
                onChange={handleChange}
                placeholder="E.g., Each tablet contains 500mg Paracetamol"
                inputProps={{ 'aria-label': 'Composition Table' }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="saltChemicalCombination">
                Salt / Chemical Combination
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                id="saltChemicalCombination"
                name="saltChemicalCombination"
                value={formData.saltChemicalCombination}
                onChange={handleChange}
                placeholder="E.g., Paracetamol + Ibuprofen"
                inputProps={{ 'aria-label': 'Salt/Chemical Combination' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isControlledSubstance}
                    onChange={handleChange}
                    name="isControlledSubstance"
                    color="primary"
                  />
                }
                label="Controlled Substance"
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Packaging & Delivery */}
        <ParentCard title="Packaging & Delivery" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="packSizeQuantity">Pack Size / Quantity</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="packSizeQuantity"
                name="packSizeQuantity"
                value={formData.packSizeQuantity}
                onChange={handleChange}
                placeholder="E.g., Strip of 10 tablets"
                inputProps={{ 'aria-label': 'Pack Size/Quantity' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="packagingTypeId">Packaging Type</CustomFormLabel>
              <CustomSelect
                id="packagingTypeId"
                name="packagingTypeId"
                value={formData.packagingTypeId}
                onChange={handleChange}
                fullWidth
                disabled={loadingStates.packagingTypes}
              >
                <MenuItem value="">Select Packaging Type</MenuItem>
                {packagingTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
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
              <CustomFormLabel htmlFor="dimensions">Dimensions (L x W x H)</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="E.g., 10x5x2 cm"
                inputProps={{ 'aria-label': 'Dimensions' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.freeShippingEligible}
                    onChange={handleChange}
                    name="freeShippingEligible"
                    color="primary"
                  />
                }
                label="Free Shipping Eligible"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.codAvailable}
                    onChange={handleChange}
                    name="codAvailable"
                    color="primary"
                  />
                }
                label="COD Available "
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="deliveryTimeEstimate">
                Delivery Time Estimate
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                id="deliveryTimeEstimate"
                name="deliveryTimeEstimate"
                value={formData.deliveryTimeEstimate}
                onChange={handleChange}
                placeholder="E.g., 2-4 business days"
                inputProps={{ 'aria-label': 'Delivery Time Estimate' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.returnable}
                    onChange={handleChange}
                    name="returnable"
                    color="primary"
                  />
                }
                label="Returnable"
              />
            </Grid>
            {formData.returnable && (
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="returnPolicyNote">Return Policy Note</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  multiline
                  minRows={2}
                  id="returnPolicyNote"
                  name="returnPolicyNote"
                  value={formData.returnPolicyNote}
                  onChange={handleChange}
                  placeholder="E.g., Return only if damaged/expired on arrival"
                  inputProps={{ 'aria-label': 'Return Policy Note' }}
                />
              </Grid>
            )}
          </Grid>
        </ParentCard>

        {/* Filters & Attributes */}
        <ParentCard title="Filters & Attributes" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="ageGroup">Age Group</CustomFormLabel>
              <CustomSelect
                id="ageGroup"
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">Select Age Group</MenuItem>
                <MenuItem value="infant">Infant</MenuItem>
                <MenuItem value="child">Child</MenuItem>
                <MenuItem value="adult">Adult</MenuItem>
                <MenuItem value="senior">Senior</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="gender">Gender</CustomFormLabel>
              <CustomSelect
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="unisex">Unisex</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="formId">Product Form</CustomFormLabel>
              <CustomSelect
                id="formId"
                name="formId"
                value={formData.formId}
                onChange={handleChange}
                fullWidth
                disabled={loadingStates.forms}
              >
                <MenuItem value="">Select Product Form</MenuItem>
                {forms.map((form) => (
                  <MenuItem key={form._id} value={form._id}>
                    {form.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="flavor">Flavor</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="flavor"
                name="flavor"
                value={formData.flavor}
                onChange={handleChange}
                placeholder="E.g., Mint"
                inputProps={{ 'aria-label': 'Flavor' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isSugarFree}
                    onChange={handleChange}
                    name="isSugarFree"
                    color="primary"
                  />
                }
                label="Sugar-Free"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isHerbalOrganic}
                    onChange={handleChange}
                    name="isHerbalOrganic"
                    color="primary"
                  />
                }
                label="Herbal / Organic"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.inventoryAutoSyncWithErp}
                    onChange={handleChange}
                    name="inventoryAutoSyncWithErp"
                    color="primary"
                  />
                }
                label="Auto Sync with ERP"
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Advanced Features */}
        <ParentCard title="Advanced Features" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.interactionCheckerEnabled}
                    onChange={handleChange}
                    name="interactionCheckerEnabled"
                    color="primary"
                  />
                }
                label="Interaction Checker Enabled"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.reviewRatingEnabled}
                    onChange={handleChange}
                    name="reviewRatingEnabled"
                    color="primary"
                  />
                }
                label="Review / Rating Enabled"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifyWhenBackInStock}
                    onChange={handleChange}
                    name="notifyWhenBackInStock"
                    color="primary"
                  />
                }
                label="Notify When Back in Stock"
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Lifecycle & Availability */}
        <ParentCard title="Lifecycle & Availability" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="availableFrom">Available From</CustomFormLabel>
              <CustomTextField
                fullWidth
                type="date"
                id="availableFrom"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ 'aria-label': 'Available From' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="expiryDiscontinueDate">
                Expiry / Discontinue Date
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                type="date"
                id="expiryDiscontinueDate"
                name="expiryDiscontinueDate"
                value={formData.expiryDiscontinueDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ 'aria-label': 'Expiry/Discontinue Date' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enablePreOrders}
                    onChange={handleChange}
                    name="enablePreOrders"
                    color="primary"
                  />
                }
                label="Enable Pre-Orders"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                disabled={loadingStates.zones}
              >
                {zones.map((zone) => (
                  <MenuItem key={zone._id} value={zone._id}>
                    {zone.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="productVisibility">Product Visibility</CustomFormLabel>
              <CustomSelect
                id="productVisibility"
                name="productVisibility"
                value={formData.productVisibility}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="productLifecycleStatus">
                Product Lifecycle Status
              </CustomFormLabel>
              <CustomSelect
                id="productLifecycleStatus"
                name="productLifecycleStatus"
                value={formData.productLifecycleStatus}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="discontinued">Discontinued</MenuItem>
              </CustomSelect>
            </Grid>
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
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Error Alert */}
        {errors.submit && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {errors.submit}
          </Alert>
        )}

        {/* Loading Progress */}
        {loading && <LinearProgress sx={{ mt: 3 }} />}

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
            aria-label="Update medicine product"
            type="submit"
          >
            Update Medicine Product
          </LoadingButton>
        </Box>
      </form>
    </PageContainer>
  );
};

export default EditMedicineProduct;

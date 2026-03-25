import React, { useRef, useState, useEffect, useCallback } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ParentCard from '../../components/shared/ParentCard';
import { IconArrowBackUp } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
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
  LinearProgress,
  Switch,
  FormControlLabel,
  styled,
  Chip,
  FormControl,
} from '@mui/material';

// Styled Components
const CustomSelect = styled(Select)(({ theme }) => ({
  '.MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
  '.MuiSelect-select': {
    padding: '14px',
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
  const mainImageInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const colorImagesInputRef = useRef(null);

  const shoppingId = localStorage.getItem('shoppingId');

  // State Management
  const [formData, setFormData] = useState({
    productName: '',
    productTypeId: '',
    productCodeSku: '',
    categoryId: '',
    subcategoryId: '',
    childcategoryId: '',
    brandId: '',
    tagsKeywords: [],
    shortDescription: '',
    fullDescription: '',
    isFeaturedTrending: false,
    productCondition: 'new',
    basePriceMrp: '',
    sellingPrice: '',
    discountType: 'percent',
    discountValue: '',
    taxRate: '',
    isOnSale: false,
    priceVisibility: 'public',
    materialTypeId: '',
    sleeveTypeId: '',
    fitTypeId: '',
    neckTypeId: '',
    gender: '',
    sizeGuide: '',
    processor: '',
    ramId: '',
    storageId: '',
    batteryCapacity: '',
    displaySize: '',
    os: '',
    warranty: '',
    totalStockQuantity: '',
    lowStockAlertThreshold: '',
    weightId: '',
    dimensions: '',
    shippingCharges: '',
    freeShippingEligible: false,
    codAvailable: false,
    deliveryTimeEstimate: '',
    returnPolicy: '',
    returnReasonOptions: [],
    sizeOptionsId: [],
    colourOptionsId: [],
    customFilters: [],
    batteryIncluded: false,
    powerSource: '',
    isEcoFriendly: false,
    countryOfOriginId: '',
    hsnCodeTaxCategory: '',
    visibleOnFrontend: true,
    productPriority: 1,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    availableFrom: '',
    expireUnpublishOn: '',
    isPreLaunchProduct: false,
    enableProductReviews: true,
    enableStarRatings: true,
    collectUsageFeedback: true,
    frequentlyBoughtWithCrossSell: [],
    relatedProductsUpsell: [],
    zoneId: [],
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [colorImages, setColorImages] = useState([]);
  const [colorImagesPreviews, setColorImagesPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ProductType, setProductType] = useState([]);
  const [brands, setBrands] = useState([]);
  const [weights, setWeights] = useState([]);
  const [zones, setZones] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [sleeveTypes, setSleeveTypes] = useState([]);
  const [fitTypes, setFitTypes] = useState([]);
  const [neckTypes, setNeckTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [storageType, setStorageType] = useState([]);
  const [ramType, setRamType] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryCache, setSubcategoryCache] = useState({});
  const [childcategories, setChildcategories] = useState([]);
  const [childcategoriesCache, setChildcategoriesCache] = useState({});

  const [loadingStates, setLoadingStates] = useState({
    categories: false,
    subcategories: false,
    childcategories: false,
    brands: false,
    weights: false,
    zones: false,
    sizes: false,
    colors: false,
    materialTypes: false,
    sleeveTypes: false,
    fitTypes: false,
    neckTypes: false,
    countries: false,
    productType: false,
    ram: false,
    storage: false,
  });

  // Token Retrieval
  const getToken = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token;
    } catch (error) {
      console.error('Error parsing user token', error);
      return '';
    }
  }, []);

  const token = getToken();

  const fetchServicedata = useCallback(async () => {
    if (!shoppingId || !token) {
      toast.error('Invalid product ID or authentication');
      setInitialLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        URLS.GetOneShoppingItem,
        { productId: shoppingId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = res.data?.data || {};

      setFormData({
        productName: data.productName || '',
        productTypeId: data.productTypeId || '',
        productCodeSku: data.productCodeSku || '',
        categoryId: data.categoryId || '',
        subcategoryId: data.subcategoryId || '',
        childcategoryId: data.childcategoryId || '',
        brandId: data.brandId || '',
        shortDescription: data.shortDescription || '',
        fullDescription: data.fullDescription || '',
        isFeaturedTrending: data.isFeaturedTrending === 'true' || data.isFeaturedTrending || false,
        productCondition: data.productCondition || 'new',
        basePriceMrp: data.basePriceMrp || '',
        sellingPrice: data.sellingPrice || '',
        discountType: data.discountType || '',
        discountValue: data.discountValue || '',
        taxRate: data.taxRate || '',
        isOnSale: data.isOnSale === 'true' || data.isOnSale || false,
        priceVisibility: data.priceVisibility || 'public',
        materialTypeId: data.materialTypeId || '',
        sleeveTypeId: data.sleeveTypeId || '',
        fitTypeId: data.fitTypeId || '',
        neckTypeId: data.neckTypeId || '',
        gender: data.gender || '',
        sizeGuide: data.sizeGuide || '',
        processor: data.processor || '',
        ramId: data.ramId || '',
        storageId: data.storageId || '',
        batteryCapacity: data.batteryCapacity || '',
        displaySize: data.displaySize || '',
        os: data.os || '',
        warranty: data.warranty || '',
        totalStockQuantity: data.totalStockQuantity || '',
        lowStockAlertThreshold: data.lowStockAlertThreshold || '',
        weightId: data.weightId || '',
        dimensions: data.dimensions || '',
        shippingCharges: data.shippingCharges || '',
        freeShippingEligible:
          data.freeShippingEligible === 'true' || data.freeShippingEligible || false,
        codAvailable: data.codAvailable === 'true' || data.codAvailable || false,
        deliveryTimeEstimate: data.deliveryTimeEstimate || '',
        returnPolicy: data.returnPolicy || '',
        returnReasonOptions: data.returnReasonOptions || [],
        sizeOptionsId: data.sizeOptionsId || [],
        colourOptionsId: data.colourOptionsId || [],
        customFilters: data.customFilters || [],
        batteryIncluded: data.batteryIncluded === 'true' || data.batteryIncluded || false,
        powerSource: data.powerSource || '',
        isEcoFriendly: data.isEcoFriendly === 'true' || data.isEcoFriendly || false,
        countryOfOriginId: data.countryOfOriginId || '',
        hsnCodeTaxCategory: data.hsnCodeTaxCategory || '',
        visibleOnFrontend:
          data.visibleOnFrontend !== undefined
            ? data.visibleOnFrontend === 'true' || data.visibleOnFrontend
            : true,
        productPriority: data.productPriority || 1,
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        metaKeywords: data.metaKeywords?.split(',').filter(Boolean) || [],
        tagsKeywords: data.tagsKeywords?.split(',').filter(Boolean) || [],
        availableFrom: data.availableFrom || '',
        expireUnpublishOn: data.expireUnpublishOn || '',
        isPreLaunchProduct: data.isPreLaunchProduct === 'true' || data.isPreLaunchProduct || false,
        enableProductReviews:
          data.enableProductReviews !== undefined
            ? data.enableProductReviews === 'true' || data.enableProductReviews
            : true,
        enableStarRatings:
          data.enableStarRatings !== undefined
            ? data.enableStarRatings === 'true' || data.enableStarRatings
            : true,
        collectUsageFeedback:
          data.collectUsageFeedback !== undefined
            ? data.collectUsageFeedback === 'true' || data.collectUsageFeedback
            : true,
        frequentlyBoughtWithCrossSell: data.frequentlyBoughtWithCrossSell || [],
        relatedProductsUpsell: data.relatedProductsUpsell || [],
        zoneId: data.zoneId || [],
        zoneName: data.zoneName || [],
      });

      // Handle image and video previews
      if (data.mainProductImage) {
        setMainImagePreview(`${URLS.FileBase}${data.mainProductImage}`);
      }

      if (data.additionalImages && Array.isArray(data.additionalImages)) {
        const additionalPreviews = data.additionalImages.map((img) => `${URLS.FileBase}${img}`);
        setAdditionalImagesPreviews(additionalPreviews);
        if (additionalPreviews.length > 0) {
          setAdditionalImagesPreviews(additionalPreviews);
        }
      } else {
        setAdditionalImagesPreviews([]);
      }

      if (data.colorSpecificImages) {
        const colorImagePreviews = Array.isArray(data.colorSpecificImages)
          ? data.colorSpecificImages.map((img) => `${URLS.FileBase}${img}`)
          : [`${URLS.FileBase}${data.colorSpecificImages}`];
        setColorImagesPreviews(colorImagePreviews);
      }

      if (data.video360View) {
        setVideoPreview(`${URLS.FileBase}${data.video360View}`);
      }

      if (data.categoryId) {
        fetchSubcategoriesByCategory(data.categoryId);
      }

      if (data.subcategoryId) {
        fetchChildcategoriesBySubCategory(data.subcategoryId);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch product data.');
    } finally {
      setInitialLoading(false);
    }
  }, [shoppingId, token]);

  useEffect(() => {
    fetchServicedata();
  }, [fetchServicedata]);

  const fetchData = useCallback(
    async (url, body, setData, loadingKey) => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));
      try {
        const response = await axios.post(url, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.success) {
          const data =
            response.data.ecommercedropdown ||
            response.data.category ||
            response.data.childcategorys ||
            response.data.data ||
            response.data.brands ||
            response.data.weights ||
            response.data.zones;
          setData(data);
        } else {
          console.error(`Failed to fetch ${loadingKey}`, response.data);
          setData([]);
        }
      } catch (error) {
        console.error(`Error fetching ${loadingKey}`, error);
        toast.error(`Failed to fetch ${loadingKey}`);
        setData([]);
      } finally {
        setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
      }
    },
    [token],
  );

  const fetchCategories = useCallback(() => {
    fetchData(URLS.GetCategories, { flagType: 'shopping' }, setCategories, 'categories');
  }, [fetchData]);

  const fetchChildcategoriesBySubCategory = useCallback(
    async (subcategoryId) => {
      if (!subcategoryId || !token) return;
      if (childcategoriesCache[subcategoryId]) {
        setSubcategories(childcategoriesCache[subcategoryId]);
        return;
      }
      await fetchData(
        URLS.GetSubCategoriesIdByChildCategories,
        { subcategoryId, flagType: 'shopping' },
        (data) => {
          setChildcategories(data);
          setChildcategoriesCache((prev) => ({ ...prev, [subcategoryId]: data }));
        },
        'childcategories',
      );
    },
    [token, childcategoriesCache, fetchData],
  );

  const fetchSubcategoriesByCategory = useCallback(
    async (categoryId) => {
      if (!categoryId || !token) return;
      if (subcategoryCache[categoryId]) {
        setSubcategories(subcategoryCache[categoryId]);
        return;
      }
      await fetchData(
        URLS.GetCategorieIdbySubCategory,
        { categoryId },
        (data) => {
          setSubcategories(data);
          setSubcategoryCache((prev) => ({ ...prev, [categoryId]: data }));
        },
        'subcategories',
      );
    },
    [token, subcategoryCache, fetchData],
  );

  const fetchBrands = useCallback(
    () => fetchData(URLS.GetBrands, { flagType: 'shopping' }, setBrands, 'brands'),
    [fetchData],
  );
  const fetchWeights = useCallback(
    () => fetchData(URLS.GetWeights, { flagType: 'shopping' }, setWeights, 'weights'),
    [fetchData],
  );
  const fetchZones = useCallback(
    () => fetchData(URLS.GetZones, {}, setZones, 'zones'),
    [fetchData],
  );

  // Shopping dropdown fetchers
  const fetchSizes = useCallback(() => {
    setLoadingStates((prev) => ({ ...prev, sizes: true }));
    axios
      .post(
        URLS.GetShoppingDropDowns,
        { flagType: 'shopping', dropDownType: 'sizeType' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setSizes(res.data.ecommercedropdown))
      .catch((err) => {
        console.error('Failed to fetch Sizes', err);
        setSizes([]);
      })
      .finally(() => setLoadingStates((prev) => ({ ...prev, sizes: false })));
  }, [token]);

  // Shopping dropdown fetchers
  const fetchProductType = useCallback(() => {
    setLoadingStates((prev) => ({ ...prev, productType: true }));
    axios
      .post(
        URLS.GetShoppingDropDowns,
        { flagType: 'shopping', dropDownType: 'productType' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setProductType(res.data.ecommercedropdown))
      .catch((err) => {
        console.error('Failed to fetch Product Type', err);
        setProductType([]);
      })
      .finally(() => setLoadingStates((prev) => ({ ...prev, productType: false })));
  }, [token]);

  const fetchColors = useCallback(() => {
    setLoadingStates((prev) => ({ ...prev, colors: true }));
    axios
      .post(
        URLS.GetShoppingDropDowns,
        { flagType: 'shopping', dropDownType: 'colorType' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setColors(res.data.ecommercedropdown))
      .catch((err) => {
        console.error('Failed to fetch Colors', err);
        setColors([]);
      })
      .finally(() => setLoadingStates((prev) => ({ ...prev, colors: false })));
  }, [token]);

  const fetchMaterialTypes = useCallback(() => {
    setLoadingStates((prev) => ({ ...prev, materialTypes: true }));
    axios
      .post(
        URLS.GetShoppingDropDowns,
        { flagType: 'shopping', dropDownType: 'materialType' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setMaterialTypes(res.data.ecommercedropdown))
      .catch((err) => {
        console.error('Failed to fetch Material Types', err);
        setMaterialTypes([]);
      })
      .finally(() => setLoadingStates((prev) => ({ ...prev, materialTypes: false })));
  }, [token]);

  const fetchSleeveTypes = useCallback(() => {
    setLoadingStates((prev) => ({ ...prev, sleeveTypes: true }));
    axios
      .post(
        URLS.GetShoppingDropDowns,
        { flagType: 'shopping', dropDownType: 'sleeveType' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setSleeveTypes(res.data.ecommercedropdown))
      .catch((err) => {
        console.error('Failed to fetch Sleeve Types', err);
        setSleeveTypes([]);
      })
      .finally(() => setLoadingStates((prev) => ({ ...prev, sleeveTypes: false })));
  }, [token]);

  const fetchFitTypes = useCallback(() => {
    setLoadingStates((prev) => ({ ...prev, fitTypes: true }));
    axios
      .post(
        URLS.GetShoppingDropDowns,
        { flagType: 'shopping', dropDownType: 'fitType' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setFitTypes(res.data.ecommercedropdown))
      .catch((err) => {
        console.error('Failed to fetch Fit Types', err);
        setFitTypes([]);
      })
      .finally(() => setLoadingStates((prev) => ({ ...prev, fitTypes: false })));
  }, [token]);

  const fetchNeckTypes = useCallback(() => {
    setLoadingStates((prev) => ({ ...prev, neckTypes: true }));
    axios
      .post(
        URLS.GetShoppingDropDowns,
        { flagType: 'shopping', dropDownType: 'neckType' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setNeckTypes(res.data.ecommercedropdown))
      .catch((err) => {
        console.error('Failed to fetch Neck Types', err);
        setNeckTypes([]);
      })
      .finally(() => setLoadingStates((prev) => ({ ...prev, neckTypes: false })));
  }, [token]);

  const fetchCountries = useCallback(() => {
    setLoadingStates((prev) => ({ ...prev, countries: true }));
    axios
      .post(
        URLS.GetShoppingDropDowns,
        { flagType: 'shopping', dropDownType: 'countryOriginType' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setCountries(res.data.ecommercedropdown))
      .catch((err) => {
        console.error('Failed to fetch Countries', err);
        setCountries([]);
      })
      .finally(() => setLoadingStates((prev) => ({ ...prev, countries: false })));
  }, [token]);

  const fetchStorage = useCallback(() => {
    setLoadingStates((prev) => ({ ...prev, storage: true }));
    axios
      .post(
        URLS.GetShoppingDropDowns,
        { flagType: 'shopping', dropDownType: 'storageType' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setStorageType(res.data.ecommercedropdown))
      .catch((err) => {
        console.error('Failed to fetch storage Type', err);
        setStorageType([]);
      })
      .finally(() => setLoadingStates((prev) => ({ ...prev, storage: false })));
  }, [token]);

  const fetchRam = useCallback(() => {
    setLoadingStates((prev) => ({ ...prev, ram: true }));
    axios
      .post(
        URLS.GetShoppingDropDowns,
        { flagType: 'shopping', dropDownType: 'ramType' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setRamType(res.data.ecommercedropdown))
      .catch((err) => {
        console.error('Failed to fetch Ram Type', err);
        setRamType([]);
      })
      .finally(() => setLoadingStates((prev) => ({ ...prev, ram: false })));
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCategories();
      fetchBrands();
      fetchWeights();
      fetchZones();
      fetchSizes();
      fetchColors();
      fetchMaterialTypes();
      fetchSleeveTypes();
      fetchFitTypes();
      fetchNeckTypes();
      fetchCountries();
      fetchProductType();
      fetchStorage();
      fetchRam();
    } else {
      toast.error('Please log in to continue.');
      navigate('/login');
    }
  }, [
    token,
    fetchCategories,
    fetchBrands,
    fetchWeights,
    fetchZones,
    fetchSizes,
    fetchColors,
    fetchMaterialTypes,
    fetchSleeveTypes,
    fetchFitTypes,
    fetchNeckTypes,
    fetchCountries,
    fetchStorage,
    fetchRam,
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
          newData.childcategoryId = '';
          if (value) fetchSubcategoriesByCategory(value);
        } else if (name === 'subcategoryId') {
          newData.subcategoryId = value;
          newData.childcategoryId = '';
          if (value) fetchChildcategoriesBySubCategory(value);
        } else if (type === 'checkbox') {
          newData[name] = checked;
          if (name === 'freeShippingEligible') {
            newData.shippingCharges = checked ? 0 : prev.shippingCharges || '';
          }
        } else {
          newData[name] = value;
        }
        const basePriceMrp = parseFloat(newData.basePriceMrp) || 0;
        const sellingPrice = parseFloat(newData.sellingPrice) || 0;
        const discountType = newData.discountType;

        let formatted = '';
        if (basePriceMrp > 0 && sellingPrice > 0 && sellingPrice < basePriceMrp) {
          if (discountType === 'percent') {
            const percentage = ((basePriceMrp - sellingPrice) / basePriceMrp) * 100;
            const p = Number(percentage.toFixed(1));
            formatted = Number.isInteger(p) ? `${Math.trunc(p)}%` : `${p.toFixed(1)}%`;
          } else if (discountType === 'fixed') {
            const amount = basePriceMrp - sellingPrice;
            const a = Number(amount.toFixed(1));
            formatted = Number.isInteger(a) ? `${Math.trunc(a)}/-` : `${a.toFixed(1)}/-`;
          }
        }

        newData.discountValue = formatted;

        return newData;
      });
    },
    [fetchSubcategoriesByCategory, fetchChildcategoriesBySubCategory],
  );

  const handleMultiSelectChange = useCallback(
    (name) => (e) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [name]: typeof value === 'string' ? value.split(',') : value,
      }));
    },
    [],
  );

  const handleTagsChange = useCallback((e) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const newTags = value
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');
      if (newTags.length > 0) {
        setFormData((prev) => ({ ...prev, tagsKeywords: [...prev.tagsKeywords, ...newTags] }));
      }
      e.target.value = '';
    }
  }, []);

  const handleTagsKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value) {
        setFormData((prev) => ({ ...prev, tagsKeywords: [...prev.tagsKeywords, value] }));
        e.target.value = '';
      }
    }
  }, []);

  const removeTag = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      tagsKeywords: prev.tagsKeywords.filter((_, i) => i !== index),
    }));
  }, []);

  const handleMetaKeywordsChange = useCallback((e) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const newKeywords = value
        .split(',')
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword !== '');
      if (newKeywords.length > 0) {
        setFormData((prev) => ({ ...prev, metaKeywords: [...prev.metaKeywords, ...newKeywords] }));
      }
      e.target.value = '';
    }
  }, []);

  const handleMetaKeywordsKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value) {
        setFormData((prev) => ({ ...prev, metaKeywords: [...prev.metaKeywords, value] }));
        e.target.value = '';
      }
    }
  }, []);

  const removeMetaKeyword = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter((_, i) => i !== index),
    }));
  }, []);

  // File upload handlers
  const handleMainImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
  }, []);

  const handleAdditionalImagesUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setAdditionalImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setAdditionalImagesPreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const handleVideoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  }, []);

  const handleColorImagesUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setColorImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setColorImagesPreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const removeMainImage = useCallback(() => {
    setMainImage(null);
    setMainImagePreview(null);
    if (mainImageInputRef.current) mainImageInputRef.current.value = '';
  }, []);

  const removeAdditionalImage = useCallback((idx) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== idx));
    setAdditionalImagesPreviews((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const removeVideo = useCallback(() => {
    setVideo(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  }, []);

  const removeColorImage = useCallback((idx) => {
    setColorImages((prev) => prev.filter((_, i) => i !== idx));
    setColorImagesPreviews((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  // Form Submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'metaKeywords' || key === 'tagsKeywords') {
            fd.append(key, value.join(','));
          } else if (
            [
              'sizeOptionsId',
              'colourOptionsId',
              'zoneId',
              'returnReasonOptions',
              'customFilters',
              'frequentlyBoughtWithCrossSell',
              'relatedProductsUpsell',
            ].includes(key)
          ) {
            fd.append(key, JSON.stringify(value));
          } else {
            fd.append(key, value);
          }
        });

        if (mainImage) fd.append('mainProductImage', mainImage);
        additionalImages.forEach((img) => fd.append('additionalImages', img));
        if (video) fd.append('video360View', video);
        colorImages.forEach((img) => fd.append('colorSpecificImages', img));

        const response = await axios.put(URLS.EditShoppingItem + shoppingId, fd, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        if (response.data?.success) {
          toast.success('Product added successfully!');
          handleReset();
          navigate('/shopping-item');
        } else {
          throw new Error(response.data?.message || 'Failed to Edit Product');
        }
      } catch (error) {
        console.error('Error submitting form', error);
        let errorMessage = 'Failed to Edit Product. Please try again.';
        if (error.response?.status === 401) {
          errorMessage = 'Unauthorized. Please log in again.';
          navigate('/login');
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [formData, mainImage, additionalImages, video, colorImages, token, navigate],
  );

  // Reset Form
  const handleReset = useCallback(() => {
    setFormData({
      productName: '',
      productTypeId: '',
      productCodeSku: '',
      categoryId: '',
      subcategoryId: '',
      childcategoryId: '',
      brandId: '',
      tagsKeywords: [],
      shortDescription: '',
      fullDescription: '',
      isFeaturedTrending: false,
      productCondition: 'new',
      basePriceMrp: '',
      sellingPrice: '',
      discountType: 'percent',
      discountValue: '',
      taxRate: '',
      isOnSale: false,
      priceVisibility: 'public',
      materialTypeId: '',
      sleeveTypeId: '',
      fitTypeId: '',
      neckTypeId: '',
      gender: '',
      sizeGuide: '',
      processor: '',
      ramId: '',
      storageId: '',
      batteryCapacity: '',
      displaySize: '',
      os: '',
      warranty: '',
      totalStockQuantity: '',
      lowStockAlertThreshold: '',
      weightId: '',
      dimensions: '',
      shippingCharges: '',
      freeShippingEligible: false,
      codAvailable: false,
      deliveryTimeEstimate: '',
      returnPolicy: '',
      returnReasonOptions: [],
      sizeOptionsId: [],
      colourOptionsId: [],
      customFilters: [],
      batteryIncluded: false,
      powerSource: '',
      isEcoFriendly: false,
      countryOfOriginId: '',
      hsnCodeTaxCategory: '',
      visibleOnFrontend: true,
      productPriority: 1,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      availableFrom: '',
      expireUnpublishOn: '',
      isPreLaunchProduct: false,
      enableProductReviews: true,
      enableStarRatings: true,
      collectUsageFeedback: true,
      frequentlyBoughtWithCrossSell: [],
      relatedProductsUpsell: [],
      zoneId: [],
    });
    setMainImage(null);
    setMainImagePreview(null);
    setAdditionalImages([]);
    setAdditionalImagesPreviews([]);
    setVideo(null);
    setVideoPreview(null);
    setColorImages([]);
    setColorImagesPreviews([]);
    if (mainImageInputRef.current) mainImageInputRef.current.value = '';
    if (additionalImagesInputRef.current) additionalImagesInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (colorImagesInputRef.current) colorImagesInputRef.current.value = '';
  }, []);

  // Breadcrumb Configuration
  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Edit Product' }];

  const generateSku = () => {
    const sku = `SKU${Date.now().toString().slice(-8)}`;
    setFormData((prev) => ({ ...prev, productCodeSku: sku }));
  };

  return (
    <PageContainer title="Edit Product">
      <Breadcrumb title="Edit Product" items={BCrumb} />
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
      {/* Basic Product Details */}
      <Box>
        <ParentCard title="Basic Product Details" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="productName">
                Product Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter product name (e.g., iPhone 15, Men's Cotton Shirt)"
                inputProps={{ 'aria-label': 'Product Name' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="productTypeId">
                Type Of Product <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <FormControl fullWidth>
                <CustomSelect
                  id="productTypeId"
                  name="productTypeId"
                  value={formData.productTypeId}
                  onChange={handleChange}
                  displayEmpty
                  required
                  disabled={loadingStates.productType}
                >
                  <MenuItem value="">Select Product Type</MenuItem>
                  {ProductType.map((producttype) => (
                    <MenuItem key={producttype._id} value={producttype._id}>
                      {producttype.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="productCodeSku">Product Code / SKU</CustomFormLabel>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <CustomTextField
                  fullWidth
                  id="productCodeSku"
                  name="productCodeSku"
                  value={formData.productCodeSku}
                  onChange={handleChange}
                  placeholder="Unique identifier for inventory tracking (e.g., SKU123456)"
                  inputProps={{ 'aria-label': 'Product SKU' }}
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
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                fullWidth
                required
                disabled={loadingStates.categories}
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
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
                required
                disabled={!formData.categoryId || loadingStates.subcategories}
              >
                <MenuItem value="">Select Subcategory</MenuItem>
                {subcategories.map((subcategory) => (
                  <MenuItem key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </MenuItem>
                ))}
              </CustomSelect>
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
              <CustomFormLabel htmlFor="brandId">Brand</CustomFormLabel>
              <FormControl fullWidth>
                <CustomSelect
                  id="brandId"
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  displayEmpty
                  disabled={loadingStates.brands}
                >
                  <MenuItem value="">Select Brand (Add new if not in list)</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand._id} value={brand._id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="tagsKeywords">
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
                  '&:hover': { borderColor: 'text.primary' },
                  '&:focus-within': { borderColor: 'primary.main', borderWidth: 2 },
                }}
              >
                {formData.tagsKeywords.map((tag, index) => (
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
                  onChange={handleTagsChange}
                  onKeyDown={handleTagsKeyDown}
                  placeholder="Used for SEO and filtering - Type tags, press Enter or comma to add"
                  InputProps={{ disableUnderline: true }}
                  sx={{ flexGrow: 1 }}
                  inputProps={{ 'aria-label': 'Tags/Keywords' }}
                />
              </Box>
              <FormHelperText>Type comma or press Enter to add tags</FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="shortDescription">
                Short Description <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                multiline
                rows={2}
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Summary visible in listing cards"
                inputProps={{ 'aria-label': 'Short Description' }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="fullDescription">
                Full Description <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                multiline
                rows={4}
                id="fullDescription"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                placeholder="Detailed specs, features, and information"
                inputProps={{ 'aria-label': 'Full Description' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFeaturedTrending}
                    onChange={handleChange}
                    name="isFeaturedTrending"
                    color="primary"
                  />
                }
                label="Is Featured / Trending - Promote in homepage or special section"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="productCondition">
                Product Condition <span style={{ color: 'red' }}>*</span>;
              </CustomFormLabel>
              <FormControl fullWidth>
                <CustomSelect
                  id="productCondition"
                  name="productCondition"
                  value={formData.productCondition}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="refurbished">Refurbished</MenuItem>
                  <MenuItem value="used">Used</MenuItem>
                </CustomSelect>
              </FormControl>
            </Grid>
          </Grid>
        </ParentCard>
      </Box>
      {/* Media / Visuals */}
      <Box>
        <ParentCard title="Media / Visuals" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardHeader title="Main Product Image - Primary image" />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <UploadBox onClick={() => mainImageInputRef.current?.click()}>
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                        Upload Main Image
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supported: JPG, PNG (Max 5MB)
                      </Typography>
                    </UploadBox>
                    <input
                      ref={mainImageInputRef}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      aria-label="Upload main product image"
                    />
                    {mainImagePreview && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Preview
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
                            '&:hover .delete-btn': { opacity: 1 },
                          }}
                        >
                          <img
                            src={mainImagePreview}
                            alt="Main image preview"
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
                            onClick={removeMainImage}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'error.main',
                              color: 'white',
                              opacity: 0,
                              transition: 'opacity 0.3s',
                              '&:hover': { bgcolor: 'error.dark', opacity: 1 },
                            }}
                            aria-label="Remove main image"
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
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardHeader
                  title={`Additional Images - Product gallery (${additionalImages.length}/5)`}
                />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <UploadBox onClick={() => additionalImagesInputRef.current?.click()}>
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                        Upload Additional Images
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supported: JPG, PNG (Max 5MB each)
                      </Typography>
                    </UploadBox>
                    <input
                      ref={additionalImagesInputRef}
                      type="file"
                      hidden
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesUpload}
                      aria-label="Upload additional images"
                    />
                    {additionalImagesPreviews.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Preview Images
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
                                  '&:hover .delete-btn': { opacity: 1 },
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
                                  onClick={() => removeAdditionalImage(idx)}
                                  sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    bgcolor: 'error.main',
                                    color: 'white',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                    '&:hover': { bgcolor: 'error.dark', opacity: 1 },
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
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardHeader title="Video / 360 View - Demo or unboxing video" />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <UploadBox onClick={() => videoInputRef.current?.click()}>
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                        Upload Video
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supported: MP4, AVI (Max 50MB)
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
                            '&:hover .delete-btn': { opacity: 1 },
                          }}
                        >
                          <video
                            src={videoPreview}
                            controls
                            style={{ width: '100%', height: '150px', display: 'block' }}
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
                              '&:hover': { bgcolor: 'error.dark', opacity: 1 },
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
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardHeader
                  title={`Color-Specific Images - Map images to specific colors/variants (${colorImages.length}/5)`}
                />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <UploadBox onClick={() => colorImagesInputRef.current?.click()}>
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                        Upload Color-Specific Images
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supported: JPG, PNG (Max 5MB each)
                      </Typography>
                    </UploadBox>
                    <input
                      ref={colorImagesInputRef}
                      type="file"
                      hidden
                      accept="image/*"
                      multiple
                      onChange={handleColorImagesUpload}
                      aria-label="Upload color-specific images"
                    />
                    {colorImagesPreviews.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Preview Images
                        </Typography>
                        <Grid container spacing={1}>
                          {colorImagesPreviews.map((src, idx) => (
                            <Grid item xs={6} sm={4} key={idx}>
                              <Box
                                sx={{
                                  position: 'relative',
                                  border: '2px solid',
                                  borderColor: 'primary.main',
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                  '&:hover .delete-btn': { opacity: 1 },
                                }}
                              >
                                <img
                                  src={src}
                                  alt={`Color-specific image ${idx + 1}`}
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
                                  onClick={() => removeColorImage(idx)}
                                  sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    bgcolor: 'error.main',
                                    color: 'white',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                    '&:hover': { bgcolor: 'error.dark', opacity: 1 },
                                  }}
                                  aria-label={`Remove color-specific image ${idx + 1}`}
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
          </Grid>
        </ParentCard>
      </Box>

      {/* Pricing & Discounts */}
      <Box>
        <ParentCard title="Pricing & Discounts" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="basePriceMrp">
                Base Price / MRP <span style={{ color: 'red' }}>*</span>;
              </CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Original price before discount
              </Typography>
              <CustomTextField
                fullWidth
                required
                type="number"
                id="basePriceMrp"
                name="basePriceMrp"
                value={formData.basePriceMrp}
                onChange={handleChange}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01, 'aria-label': 'Base Price / MRP' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="sellingPrice">
                Selling Price <span style={{ color: 'red' }}>*</span>;
              </CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Final price shown to customers
              </Typography>
              <CustomTextField
                required
                fullWidth
                type="number"
                id="sellingPrice"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01, 'aria-label': 'Selling Price' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="discountType">Discount Type</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Percentage / Fixed amount
              </Typography>
              <FormControl fullWidth>
                <CustomSelect
                  id="discountType"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">Select Discount Type</MenuItem>
                  <MenuItem value="percent">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="discountValue">Discount Value</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Amount or % off
              </Typography>
              <CustomTextField
                disabled
                fullWidth
                value={formData.discountValue}
                placeholder="Discount Value"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="taxRate">Tax Rate (%)</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                GST/VAT applicable
              </Typography>
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
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isOnSale}
                    onChange={handleChange}
                    name="isOnSale"
                    color="primary"
                  />
                }
                label="Is On Sale? - Mark as on sale"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="priceVisibility">Price Visibility</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Hide price until login (optional B2B use case)
              </Typography>
              <FormControl fullWidth>
                <CustomSelect
                  id="priceVisibility"
                  name="priceVisibility"
                  value={formData.priceVisibility}
                  onChange={handleChange}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private (Login Required)</MenuItem>
                </CustomSelect>
              </FormControl>
            </Grid>
          </Grid>
        </ParentCard>
      </Box>
      {/* Specifications (Clothing & Electronics) */}
      <Box>
        <ParentCard title="Specifications" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {/* For Clothing */}
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="materialTypeId">Type Of Material</CustomFormLabel>
              <FormControl fullWidth>
                <CustomSelect
                  id="materialTypeId"
                  name="materialTypeId"
                  value={formData.materialTypeId}
                  onChange={handleChange}
                  displayEmpty
                  disabled={loadingStates.materialTypes}
                >
                  <MenuItem value="">Select Material</MenuItem>
                  {materialTypes.map((material) => (
                    <MenuItem key={material._id} value={material._id}>
                      {material.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="sleeveTypeId">Sleeve Type</CustomFormLabel>
              <FormControl fullWidth>
                <CustomSelect
                  id="sleeveTypeId"
                  name="sleeveTypeId"
                  value={formData.sleeveTypeId}
                  onChange={handleChange}
                  displayEmpty
                  disabled={loadingStates.sleeveTypes}
                >
                  <MenuItem value="">Select Sleeve Type</MenuItem>
                  {sleeveTypes.map((sleeve) => (
                    <MenuItem key={sleeve._id} value={sleeve._id}>
                      {sleeve.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="fitTypeId">Fit Type</CustomFormLabel>
              <FormControl fullWidth>
                <CustomSelect
                  id="fitTypeId"
                  name="fitTypeId"
                  value={formData.fitTypeId}
                  onChange={handleChange}
                  displayEmpty
                  disabled={loadingStates.fitTypes}
                >
                  <MenuItem value="">Select Fit Type</MenuItem>
                  {fitTypes.map((fit) => (
                    <MenuItem key={fit._id} value={fit._id}>
                      {fit.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="neckTypeId">Neck Type</CustomFormLabel>
              <FormControl fullWidth>
                <CustomSelect
                  id="neckTypeId"
                  name="neckTypeId"
                  value={formData.neckTypeId}
                  onChange={handleChange}
                  displayEmpty
                  disabled={loadingStates.neckTypes}
                >
                  <MenuItem value="">Select Neck Type</MenuItem>
                  {neckTypes.map((neck) => (
                    <MenuItem key={neck._id} value={neck._id}>
                      {neck.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="gender">Gender</CustomFormLabel>
              <FormControl fullWidth>
                <CustomSelect
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="unisex">Unisex</MenuItem>
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="sizeGuide">Size Guide</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="sizeGuide"
                name="sizeGuide"
                value={formData.sizeGuide}
                onChange={handleChange}
                placeholder="Refer to the size chart"
                inputProps={{ 'aria-label': 'Size Guide' }}
              />
            </Grid>
            {/* For Electronics / Mobiles */}
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="processor">Processor</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="processor"
                name="processor"
                value={formData.processor}
                onChange={handleChange}
                placeholder="E.g., Intel Core i7 12th Gen"
                inputProps={{ 'aria-label': 'Processor' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="ramId">RAM</CustomFormLabel>
              <FormControl fullWidth>
                <CustomSelect
                  id="ramId"
                  name="ramId"
                  value={formData.ramId}
                  onChange={handleChange}
                  displayEmpty
                  disabled={loadingStates.ram}
                >
                  <MenuItem value="">Select RAM</MenuItem>
                  {ramType.map((size) => (
                    <MenuItem key={size._id} value={size._id}>
                      {size.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="storageId">Storage</CustomFormLabel>
              <FormControl fullWidth>
                <CustomSelect
                  id="storageId"
                  name="storageId"
                  value={formData.storageId}
                  onChange={handleChange}
                  displayEmpty
                  disabled={loadingStates.storage}
                >
                  <MenuItem value="">Select Storage</MenuItem>
                  {storageType.map((size) => (
                    <MenuItem key={size._id} value={size._id}>
                      {size.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="batteryCapacity">Battery Capacity</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="batteryCapacity"
                name="batteryCapacity"
                value={formData.batteryCapacity}
                onChange={handleChange}
                placeholder="E.g., 5000mAh"
                inputProps={{ 'aria-label': 'Battery Capacity' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="displaySize">Display Size</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="displaySize"
                name="displaySize"
                value={formData.displaySize}
                onChange={handleChange}
                placeholder="E.g., 15.6 inch"
                inputProps={{ 'aria-label': 'Display Size' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="os">OS</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="os"
                name="os"
                value={formData.os}
                onChange={handleChange}
                placeholder="E.g., Windows 11"
                inputProps={{ 'aria-label': 'Operating System' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="warranty">Warranty</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="warranty"
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                placeholder="E.g., 1 Year Manufacturer Warranty"
                inputProps={{ 'aria-label': 'Warranty' }}
              />
            </Grid>
          </Grid>
        </ParentCard>
      </Box>
      {/* Inventory & Stock Management */}
      <Box>
        <ParentCard title="Inventory & Stock Management" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="totalStockQuantity">
                Total Stock Quantity <span style={{ color: 'red' }}>*</span>;
              </CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Total units available
              </Typography>
              <CustomTextField
                fullWidth
                required
                type="number"
                id="totalStockQuantity"
                name="totalStockQuantity"
                value={formData.totalStockQuantity}
                onChange={handleChange}
                placeholder="0"
                inputProps={{ min: 0, 'aria-label': 'Total Stock Quantity' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="lowStockAlertThreshold">
                Low Stock Alert Threshold <span style={{ color: 'red' }}>*</span>;
              </CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Send alert to vendor/admin
              </Typography>
              <CustomTextField
                fullWidth
                required
                type="number"
                id="lowStockAlertThreshold"
                name="lowStockAlertThreshold"
                value={formData.lowStockAlertThreshold}
                onChange={handleChange}
                placeholder="10"
                inputProps={{ min: 0, 'aria-label': 'Low Stock Alert Threshold' }}
              />
            </Grid>
          </Grid>
        </ParentCard>
      </Box>
      {/* Shipping & Delivery */}
      <Box>
        <ParentCard title="Shipping & Delivery" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="weightId">Weight</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                For shipping calculations
              </Typography>
              <FormControl fullWidth>
                <CustomSelect
                  id="weightId"
                  name="weightId"
                  value={formData.weightId}
                  onChange={handleChange}
                  displayEmpty
                  disabled={loadingStates.weights}
                >
                  <MenuItem value="">Select Weight</MenuItem>
                  {weights.map((weight) => (
                    <MenuItem key={weight._id} value={weight._id}>
                      {weight.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="dimensions">Dimensions</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                L x W x H fields - Optional for courier APIs
              </Typography>
              <CustomTextField
                fullWidth
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="E.g., 25 x 15 x 2 cm"
                inputProps={{ 'aria-label': 'Dimensions' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="shippingCharges">Shipping Charges</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Flat rate or dynamic
              </Typography>
              <CustomTextField
                fullWidth
                type="number"
                id="shippingCharges"
                name="shippingCharges"
                value={formData.shippingCharges}
                onChange={handleChange}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01, 'aria-label': 'Shipping Charges' }}
                disabled={formData.freeShippingEligible}
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
                label="Free Shipping Eligible?"
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
                label="COD Available? - Allow Cash on Delivery"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="deliveryTimeEstimate">
                Delivery Time Estimate
              </CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                E.g., Same day / Delivery 3-5 Business Days
              </Typography>
              <CustomTextField
                fullWidth
                id="deliveryTimeEstimate"
                name="deliveryTimeEstimate"
                value={formData.deliveryTimeEstimate}
                onChange={handleChange}
                placeholder="E.g., 3-5 business days"
                inputProps={{ 'aria-label': 'Delivery Time Estimate' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="returnPolicy">Return Policy</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                7 Days / 10 Days / Non-returnable
              </Typography>
              <FormControl fullWidth>
                <CustomSelect
                  id="returnPolicy"
                  name="returnPolicy"
                  value={formData.returnPolicy}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">Select Return Policy</MenuItem>
                  <MenuItem value="7 Days">7 Days</MenuItem>
                  <MenuItem value="10 Days">10 Days</MenuItem>
                  <MenuItem value="Non-returnable">Non-returnable</MenuItem>
                </CustomSelect>
              </FormControl>
            </Grid>
            {formData.returnPolicy != 'Non-returnable' ? (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel htmlFor="returnReasonOptions">
                    Return Reason Options
                  </CustomFormLabel>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 1 }}
                  >
                    E.g., Damaged, Wrong Item, Size Issue
                  </Typography>
                  <FormControl fullWidth>
                    <CustomSelect
                      multiple
                      id="returnReasonOptions"
                      name="returnReasonOptions"
                      value={formData.returnReasonOptions}
                      onChange={handleMultiSelectChange('returnReasonOptions')}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      <MenuItem value="Damaged">Damaged</MenuItem>
                      <MenuItem value="Wrong Item">Wrong Item</MenuItem>
                      <MenuItem value="Size Issue">Size Issue</MenuItem>
                    </CustomSelect>
                  </FormControl>
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </ParentCard>
      </Box>
      {/* Advanced Attributes & Filters */}
      <Box>
        <ParentCard title="Advanced Attributes & Filters" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="sizeOptionsId">Size Options</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                XS, S, M, L, XL, etc. (Map images if needed)
              </Typography>
              <FormControl fullWidth>
                <CustomSelect
                  multiple
                  id="sizeOptionsId"
                  name="sizeOptionsId"
                  value={formData.sizeOptionsId}
                  onChange={handleMultiSelectChange('sizeOptionsId')}
                  renderValue={(selected) =>
                    selected.map((id) => sizes.find((size) => size._id === id)?.name).join(', ')
                  }
                  disabled={loadingStates.sizes}
                >
                  {sizes.map((size) => (
                    <MenuItem key={size._id} value={size._id}>
                      {size.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="colourOptionsId">Colour Options</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Map images if needed
              </Typography>
              <FormControl fullWidth>
                <CustomSelect
                  multiple
                  id="colourOptionsId"
                  name="colourOptionsId"
                  value={formData.colourOptionsId}
                  onChange={handleMultiSelectChange('colourOptionsId')}
                  renderValue={(selected) =>
                    selected.map((id) => colors.find((color) => color._id === id)?.name).join(', ')
                  }
                  disabled={loadingStates.colors}
                >
                  {colors.map((color) => (
                    <MenuItem key={color._id} value={color._id}>
                      {color.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="customFilters">Custom Filters</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                E.g., Best for Winter, Gaming Laptop
              </Typography>
              <FormControl fullWidth>
                <CustomSelect
                  multiple
                  id="customFilters"
                  name="customFilters"
                  value={formData.customFilters}
                  onChange={handleMultiSelectChange('customFilters')}
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="Best for Winter">Best for Winter</MenuItem>
                  <MenuItem value="Gaming Laptop">Gaming Laptop</MenuItem>
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.batteryIncluded}
                    onChange={handleChange}
                    name="batteryIncluded"
                    color="primary"
                  />
                }
                label="Battery Included? - For electronics"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="powerSource">Power Source</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                E.g., Rechargeable, Wired
              </Typography>
              <CustomTextField
                fullWidth
                id="powerSource"
                name="powerSource"
                value={formData.powerSource}
                onChange={handleChange}
                placeholder="E.g., Rechargeable Lithium Battery"
                inputProps={{ 'aria-label': 'Power Source' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isEcoFriendly}
                    onChange={handleChange}
                    name="isEcoFriendly"
                    color="primary"
                  />
                }
                label="Is Eco-Friendly? - Tag for sustainability filter"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="countryOfOriginId">Country of Origin</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                For compliance (e.g., Made in India)
              </Typography>
              <FormControl fullWidth>
                <CustomSelect
                  id="countryOfOriginId"
                  name="countryOfOriginId"
                  value={formData.countryOfOriginId}
                  onChange={handleChange}
                  displayEmpty
                  disabled={loadingStates.countries}
                >
                  <MenuItem value="">Select Country</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country._id} value={country._id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="hsnCodeTaxCategory">
                HSN Code / Tax Category
              </CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                For tax compliance
              </Typography>
              <CustomTextField
                fullWidth
                id="hsnCodeTaxCategory"
                name="hsnCodeTaxCategory"
                value={formData.hsnCodeTaxCategory}
                onChange={handleChange}
                placeholder="E.g., 85044090"
                inputProps={{ 'aria-label': 'HSN Code / Tax Category' }}
              />
            </Grid>
          </Grid>
        </ParentCard>
      </Box>
      {/* SEO Settings */}
      <Box>
        <ParentCard title="SEO Settings" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaTitle">SEO Title</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Optimized title for search engines (max 90 characters)
              </Typography>
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
              <CustomFormLabel htmlFor="metaDescription">SEO Description</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Meta description for search results (max 200 characters)
              </Typography>
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
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaKeywords">SEO Keywords</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Keywords for search engine optimization
              </Typography>
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
                  '&:hover': { borderColor: 'text.primary' },
                  '&:focus-within': { borderColor: 'primary.main', borderWidth: 2 },
                }}
              >
                {formData.metaKeywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    onDelete={() => removeMetaKeyword(index)}
                    sx={{ mr: 0.5 }}
                    aria-label={`Remove keyword ${keyword}`}
                  />
                ))}
                <CustomTextField
                  variant="standard"
                  onChange={handleMetaKeywordsChange}
                  onKeyDown={handleMetaKeywordsKeyDown}
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
      </Box>
      {/* Scheduling & Lifecycle */}
      <Box>
        <ParentCard title="Scheduling & Lifecycle" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="availableFrom">Available From</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Start publishing date
              </Typography>
              <CustomTextField
                fullWidth
                type="datetime-local"
                id="availableFrom"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ 'aria-label': 'Available From' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="expireUnpublishOn">Expire / Unpublish On</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Auto-hide after this date
              </Typography>
              <CustomTextField
                fullWidth
                type="datetime-local"
                id="expireUnpublishOn"
                name="expireUnpublishOn"
                value={formData.expireUnpublishOn}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ 'aria-label': 'Expire / Unpublish On' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPreLaunchProduct}
                    onChange={handleChange}
                    name="isPreLaunchProduct"
                    color="primary"
                  />
                }
                label="Is Pre-Launch Product? - Show as 'coming soon'"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="zoneId">Select Zone</CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                At least one zone is required
              </Typography>
              <FormControl fullWidth>
                <CustomSelect
                  multiple
                  id="zoneId"
                  name="zoneId"
                  value={formData.zoneId}
                  onChange={handleMultiSelectChange('zoneId')}
                  renderValue={(selected) =>
                    selected
                      .map((id) => zones.find((zone) => zone._id === id)?.name || '')
                      .join(', ')
                  }
                  disabled={loadingStates.zones}
                >
                  {zones.map((zone) => (
                    <MenuItem key={zone._id} value={zone._id}>
                      {zone.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid>
          </Grid>
        </ParentCard>
      </Box>
      {/* Analytics & Feedback (Optional) */}
      <Box>
        <ParentCard title="Analytics & Feedback (Optional)" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enableProductReviews}
                    onChange={handleChange}
                    name="enableProductReviews"
                    color="primary"
                  />
                }
                label="Enable Product Reviews? - Allow customers to review"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enableStarRatings}
                    onChange={handleChange}
                    name="enableStarRatings"
                    color="primary"
                  />
                }
                label="Enable Star Ratings? - 1 to 5-star system"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.collectUsageFeedback}
                    onChange={handleChange}
                    name="collectUsageFeedback"
                    color="primary"
                  />
                }
                label="Collect Usage Feedback? - Prompt after delivery"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="frequentlyBoughtWithCrossSell">
                Frequently Bought With (Cross-sell)
              </CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Suggest related items
              </Typography>
              <FormControl fullWidth>
                <CustomSelect
                  multiple
                  id="frequentlyBoughtWithCrossSell"
                  name="frequentlyBoughtWithCrossSell"
                  value={formData.frequentlyBoughtWithCrossSell}
                  onChange={handleMultiSelectChange('frequentlyBoughtWithCrossSell')}
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="Product A">Product A</MenuItem>
                  <MenuItem value="Product B">Product B</MenuItem>
                </CustomSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="relatedProductsUpsell">
                Related Products (Upsell)
              </CustomFormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Show alternatives/upgrades
              </Typography>
              <FormControl fullWidth>
                <CustomSelect
                  multiple
                  id="relatedProductsUpsell"
                  name="relatedProductsUpsell"
                  value={formData.relatedProductsUpsell}
                  onChange={handleMultiSelectChange('relatedProductsUpsell')}
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="Product X">Product X</MenuItem>
                  <MenuItem value="Product Y">Product Y</MenuItem>
                </CustomSelect>
              </FormControl>
            </Grid>
          </Grid>
        </ParentCard>
      </Box>
      {loading && <LinearProgress sx={{ mt: 3 }} />}
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
          sx={{ px: 4, py: 1.5 }}
          disabled={loading}
          aria-label="Reset form"
        >
          Reset
        </Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ px: 4, py: 1.5 }}
          aria-label="Edit Product"
        >
          Edit Product
        </LoadingButton>
      </Box>
    </PageContainer>
  );
};

export default EditProduct;

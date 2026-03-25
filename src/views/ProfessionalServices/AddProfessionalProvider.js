import React, { useState, useEffect, useCallback } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import { IconArrowBackUp, IconX, IconUpload, IconFileText, IconCurrentLocation } from '@tabler/icons-react';

import { Button, styled, Chip, IconButton, Card, CardMedia, InputAdornment, CircularProgress } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { Select, MenuItem, Box, Typography, Grid, FormHelperText, Checkbox } from '@mui/material';
import { GoogleMap, LoadScript, Marker, Circle, Autocomplete } from '@react-google-maps/api';

import { URLS } from "../../Url"

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Add Professional Provider' }];

const GOOGLE_MAPS_API_KEY = 'AIzaSyBNVn5j-M6F4VHkaOluoOcVY3K5r2-NlPk';
const GOOGLE_MAPS_LIBRARIES = ['places'];

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// const ImagePreviewContainer = styled(Box)(({ theme }) => ({
//   display: 'flex',

//   gap: theme.spacing(1),
//   marginTop: theme.spacing(1),

//   flexDirection: 'row',
//   gap: '28px',
//   marginTop: '8px',
//   overflowX: 'auto',        // horizontal scroll if many images
//   paddingBottom: '15px',
// }));


const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',          // Ã¢Ââ€” prevent wrapping
  gap: theme.spacing(1.5),     // consistent gap
  marginTop: theme.spacing(1),
  overflowX: 'auto',
  paddingBottom: theme.spacing(1),

  // smooth scrolling
  scrollBehavior: 'smooth',

  // clean scrollbar
  '&::-webkit-scrollbar': {
    height: 6,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[400],
    borderRadius: 4,
  },
}));

const PreviewCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  flexShrink: 0,                        // Ã¢Ââ€” important
  width: 70,
  height: 90,
  borderRadius: 8,
  overflow: 'hidden',
  backgroundColor: theme.palette.grey[100],
  boxShadow: theme.shadows[1],
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '2px',
  minWidth: 'auto',
  width: 24,
  height: 24,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
}));

const CompactFileInputContainer = styled(Box)(({ theme }) => ({
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(0.75),
  padding: theme.spacing(1),
  textAlign: 'center',
  cursor: 'pointer',
  minHeight: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const AddProfessionalProvider = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 });

  const [detectingLocation, setDetectingLocation] = useState(false);


  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    business_name: '',
    phone: '',
    email: '',
    password: '',
    whatsappNumber: '',
    professionalServiceCategoryId: [],
    professionalServiceSubcategoryId: [],
    amenities: [],
    otherAmenities: '',
    serviceId: '',
    serviceName: '',
    countryId: '',
    stateId: '',
    cityId: '',
    address: '',
    latitude: '',
    longitude: '',
    deliveryRadiusKm: '',
    bankName: '',
    branchName: '',
    holderName: '',
    accountNumber: '',
    ifsc_code: '',
    upi: '',
    bio: '',
    metaTitle: '',
    metaDescription: '',
    altphone: '',
    experiance: '',
    dob: '',
    pincode: '',
    aadhar_number: '',
    pan_number: '',
    gas_bill_number: '',
    business_number: '',
    gst_number: '',
    passport_number: '',
    address_proof_type: '',
    address_proof_number: '',
    business_proof_type: '',
    slug: '',
  });

  const [files, setFiles] = useState({
    image: null,
    logo: null,
    pan_card_front: null,
    pan_card_back: null,
    business_card: null,
    aadhar_card_front: null,
    aadhar_card_back: null,
    gst_bill: null,
    business_proof: null,
    passport_front: null,
    passport_back: null,
    gas_bill: null,
    banner_image: null,
    customer_bill_copy: null,
    labour_licence: null,
    udyam_certificate: null,
    rental_aggrement: null,
    power_bill: null,
    address_proof: null,
    business_images: [],
  });

  const [previews, setPreviews] = useState({
    image: null,
    logo: null,
    pan_card_front: null,
    pan_card_back: null,
    business_card: null,
    aadhar_card_front: null,
    aadhar_card_back: null,
    gst_bill: null,
    business_proof: null,
    passport_front: null,
    passport_back: null,
    gas_bill: null,
    banner_image: null,
    customer_bill_copy: null,
    labour_licence: null,
    udyam_certificate: null,
    rental_aggrement: null,
    power_bill: null,
    address_proof: null,
    business_images: [],
  });


  // Get current location using Geolocation API
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use Google Maps Geocoding API to get address from coordinates
          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat: latitude, lng: longitude };

          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK') {
              if (results[0]) {
                // Update form with detected location
                setForm({
                  ...form,
                  latitude: latitude.toString(),
                  longitude: longitude.toString(),
                  address: results[0].formatted_address,
                });

                // Update map center
                setMapCenter({ lat: latitude, lng: longitude });

                toast.success('Location detected successfully!');
              } else {
                toast.error('No address found for this location');
              }
            } else {
              toast.error('Failed to get address from coordinates');
            }
            setDetectingLocation(false);
          });
        } catch (error) {
          console.error('Error getting address:', error);
          toast.error('Failed to get address');
          setDetectingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Failed to get your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
        }

        toast.error(errorMessage);
        setDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };


  const getToken = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.token || '' : '';
  }, []);

  // Fetch Professional Services
  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }

    const fetchServices = async () => {
      try {
        const res = await axios.post(
          URLS.GetActiveServices,
          {
            searchQuery: '',
            serviceType: '',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setServices(res.data.services || res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        toast.error('Failed to fetch services');
      }
    };

    fetchServices();
  }, [getToken]);

  // Fetch Professional Categories
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const res = await axios.post(
          'http://192.168.0.5:5013/v1/dhubApi/admin/professional-services-category/categoryForDropdown',
          {
            serviceId: form.serviceId, // Ã¢Å“â€¦ PASS SELECTED SERVICE ID
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setCategories(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, [form.serviceId, getToken]);

  // Fetch Subcategories when categories change
  useEffect(() => {
    const token = getToken();
    if (form.professionalServiceCategoryId.length === 0 || !token) {
      setSubcategories([]);
      setForm((prev) => ({ ...prev, professionalServiceSubcategoryId: [] }));
      return;
    }

    const fetchSubcategories = async () => {
      try {
        const allSubcategories = [];

        // Ã¢Å“â€¦ Loop works for both single and multiple categories
        for (const categoryId of form.professionalServiceCategoryId) {
          const res = await axios.post(
            'http://192.168.0.5:5013/v1/dhubApi/admin/professional-services-subcategory/subcategories-for-dropdown',
            { categoryId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (res.data.data) {
            allSubcategories.push(...res.data.data);
          }
        }

        const uniqueSubcategories = allSubcategories.filter(
          (subcategory, index, self) => index === self.findIndex((s) => s._id === subcategory._id)
        );

        setSubcategories(uniqueSubcategories);
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
        toast.error('Failed to fetch subcategories');
      }
    };

    fetchSubcategories();
  }, [form.professionalServiceCategoryId, getToken]);

  useEffect(() => {
    const token = getToken();

    // Reset amenities if no subcategories are selected
    if (form.professionalServiceSubcategoryId.length === 0 || !token) {
      setAmenities([]);
      setForm((prev) => ({ ...prev, amenities: [], otherAmenities: '' }));
      return;
    }

    const fetchAmenities = async () => {
      try {
        const allAmenities = [];

        // Fetch amenities for each selected subcategory
        for (const subcategoryId of form.professionalServiceSubcategoryId) {
          const res = await axios.post(
            'http://192.168.0.5:5013/v1/dhubApi/admin/professional-services-amenities/dropdown',
            { subcategoryId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (res.data.data) {
            allAmenities.push(...res.data.data);
          }
        }

        // Remove duplicate amenities based on _id
        const uniqueAmenities = allAmenities.filter(
          (amenity, index, self) =>
            index === self.findIndex((a) => a._id === amenity._id)
        );

        // Ã¢Å“â€¦ Always add "Other" option at the end
        const amenitiesWithOther = [
          ...uniqueAmenities,
          { _id: 'other', title: 'Other' }
        ];

        setAmenities(amenitiesWithOther);
      } catch (error) {
        console.error('Failed to fetch amenities:', error);
        toast.error('Failed to fetch amenities');
        // Ã¢Å“â€¦ Even on error, show "Other" option
        setAmenities([{ _id: 'other', title: 'Other' }]);
      }
    };

    fetchAmenities();
  }, [form.professionalServiceSubcategoryId, getToken]);


  // Fetch Countries
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchCountries = async () => {
      try {
        const res = await axios.post(
          URLS.GetCountry,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setCountries(res.data.country || []);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        toast.error('Failed to fetch countries');
      }
    };

    fetchCountries();
  }, [getToken]);

  // Fetch States when country changes
  useEffect(() => {
    const token = getToken();
    if (!selectedCountry || !token) {
      setStates([]);
      setCities([]);
      return;
    }

    const fetchStates = async () => {
      try {
        const res = await axios.post(
          'http://192.168.0.5:5013/v1/dhubApi/admin/state/getstatesbycountryid',
          { country_id: selectedCountry },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setStates(res.data.states || []);
      } catch (error) {
        console.error('Failed to fetch states:', error);
        toast.error('Failed to fetch states');
      }
    };

    fetchStates();
  }, [selectedCountry, getToken]);

  // Update map center when latitude/longitude change
  useEffect(() => {
    if (form.latitude && form.longitude) {
      setMapCenter({
        lat: parseFloat(form.latitude),
        lng: parseFloat(form.longitude),
      });
    }
  }, [form.latitude, form.longitude]);

  // Fetch Cities when state changes
  useEffect(() => {
    const token = getToken();
    if (!selectedState || !token) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const res = await axios.post(
          'http://192.168.0.5:5013/v1/dhubApi/admin/city/get-cities',
          { state_id: selectedState },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setCities(res.data.cities || []);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
        toast.error('Failed to fetch cities');
      }
    };

    fetchCities();
  }, [selectedState, getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;

    setForm((prev) => ({
      ...prev,
      professionalServiceCategoryId: [selectedCategoryId], // Single value wrapped in array
      professionalServiceSubcategoryId: [], // Reset subcategories when category changes
    }));

    // Clear subcategories list
    setSubcategories([]);
  };

  const handleFileChange = (e, fieldName) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'pdf'].includes(ext)) {
        setFiles((prev) => ({ ...prev, [fieldName]: selectedFile }));
        setPreviews((prev) => ({ ...prev, [fieldName]: URL.createObjectURL(selectedFile) }));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, PNG, or PDF.');
      }
    }
  };

  const handleRemoveFile = (fieldName) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
    setPreviews((prev) => ({ ...prev, [fieldName]: null }));
    const fileInput = document.getElementById(fieldName);
    if (fileInput) fileInput.value = '';
  };

  const handleBusinessImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const currentFiles = files.businessimages || []; // Ã¢Å“â€¦ Safe default
    const currentPreviews = previews.businessimages || []; // Ã¢Å“â€¦ Add this line

    if (currentFiles.length + selectedFiles.length > 20) {
      toast.error(`You can upload a maximum of 20 business images. Currently ${currentFiles.length} images uploaded.`);
      e.target.value = null;
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png'].includes(ext);
    });

    if (validFiles.length !== selectedFiles.length) {
      toast.error('Please choose only JPG, JPEG, or PNG files.');
      e.target.value = null;
      return;
    }

    const newFiles = [...currentFiles, ...validFiles];
    setFiles((prev) => ({ ...prev, businessimages: newFiles }));

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => ({
      ...prev,
      businessimages: [...currentPreviews, ...newPreviews] // Ã¢Å“â€¦ Fixed
    }));

    e.target.value = null; // Ã¢Å“â€¦ Add this line
  };



  const replaceBusinessImage = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      toast.error('Please choose only JPG, JPEG, or PNG files.');
      e.target.value = null;
      return;
    }

    const currentFiles = files.businessimages || [];
    const currentPreviews = previews.businessimages || [];

    // Revoke old preview URL to prevent memory leaks
    if (currentPreviews[index]) {
      URL.revokeObjectURL(currentPreviews[index]);
    }

    // Create new preview URL
    const newPreviewUrl = URL.createObjectURL(file);

    // Update files array
    const newFiles = [...currentFiles];
    newFiles[index] = file;
    setFiles(prev => ({ ...prev, businessimages: newFiles }));

    // Update previews array
    const newPreviews = [...currentPreviews];
    newPreviews[index] = newPreviewUrl;
    setPreviews(prev => ({ ...prev, businessimages: newPreviews }));

    // Clear input
    e.target.value = null;
  };



  const removeBusinessImage = (index) => {
    const newFiles = [...files.business_images];
    const newPreviews = [...previews.business_images];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles((prev) => ({ ...prev, business_images: newFiles }));
    setPreviews((prev) => ({ ...prev, business_images: newPreviews }));
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // Google Maps Autocomplete handlers
  const onLoadAutocomplete = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setForm({
          ...form,
          latitude: lat.toString(),
          longitude: lng.toString(),
          address: place.formatted_address || '',
        });
        setMapCenter({ lat, lng });
      }
    }
  };

  useEffect(() => {
    const generateSlug = (text) => {
      if (!text) return '';
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    };

    const city = cities.find(c => c._id === form.cityId);
    const cityName = city ? city.name : '';
    const newSlug = generateSlug(`${form.business_name} ${cityName}`);

    setForm(prev => ({ ...prev, slug: newSlug }));
  }, [form.business_name, form.cityId, cities]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = getToken();

    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      setLoading(false);
      return;
    }

    // Ã¢Å“â€¦ Validate: If "other" is selected, otherAmenities must be filled
    if (form.amenities.includes('other') && !form.otherAmenities.trim()) {
      toast.error('Please specify custom amenities when "Other" is selected.');
      setLoading(false);
      return;
    }

    const formData = new FormData();

    // Append all form fields EXCEPT serviceName
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'serviceName') return;

      // Ã¢Å“â€¦ Handle amenities - filter out "other" and only send actual amenity IDs
      if (key === 'amenities') {
        const actualAmenities = Array.isArray(value)
          ? value.filter(id => id !== 'other')
          : [];

        if (actualAmenities.length > 0) {
          formData.append(key, JSON.stringify(actualAmenities));
        }
        return;
      }

      // Ã¢Å“â€¦ Append otherAmenities only if "other" is selected
      if (key === 'otherAmenities') {
        if (form.amenities.includes('other') && value.trim()) {
          formData.append(key, value.trim());
        }
        return;
      }

      if (value !== '' && value !== null && value !== undefined) {
        if (Array.isArray(value) && value.length > 0) {
          formData.append(key, JSON.stringify(value));
        } else if (!Array.isArray(value)) {
          formData.append(key, value);
        }
      }
    });

    // Append keywords
    if (tags.length > 0) {
      formData.append('metakeywords', tags.join(', '));
    }

    // Append files
    Object.entries(files).forEach(([key, file]) => {
      if (!file) return;

      if (key === 'businessimages' || key === 'business_images') {
        if (Array.isArray(file) && file.length > 0) {
          file.forEach((businessImg) => {
            formData.append('business_images', businessImg);
          });
        }
      } else if (key === 'address_proof') {
        if (form.address_proof_type === 'GAS BILL') formData.append('gas_bill', file);
        else if (form.address_proof_type === 'RENTAL AGREEMENT') formData.append('rental_aggrement', file);
        else if (form.address_proof_type === 'POWER BILL') formData.append('power_bill', file);
      } else if (key === 'business_proof') {
        if (form.business_proof_type === 'LABOUR LICENCE') formData.append('labour_licence', file);
        else if (form.business_proof_type === 'UDYAM CERTIFICATE') formData.append('udyam_certificate', file);
        else if (form.business_proof_type === 'GST') formData.append('gst_bill', file);
      } else {
        formData.append(key, file);
      }
    });

    // Ã¢Å“â€¦ Debug: Log what's being sent
    console.log('Selected Amenities:', form.amenities);
    console.log('Other Amenities:', form.otherAmenities);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const res = await axios.post(
        'http://192.168.0.5:5013/v1/dhubApi/admin/professional-providers/add-professional-provider',
        formData,
        config,
      );

      if (res.status === 200) {
        toast.success(res.data.message || 'Professional Provider added successfully!');
        navigate('/AllprofessionalProviders');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred.';
      toast.error(message);
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const CompactFileInput = ({ id, label, accept, onChange, required = false }) => (
    <Box>
      <CustomFormLabel htmlFor={id} required={required} sx={{ fontSize: '0.85rem' }}>
        {label}
      </CustomFormLabel>
      <CompactFileInputContainer>
        <input accept={accept} style={{ display: 'none' }} id={id} type="file" onChange={onChange} />
        <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '6px' }}>
          <IconUpload size={16} />
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            Choose File
          </Typography>
        </label>
      </CompactFileInputContainer>
    </Box>
  );

  const ImagePreview = ({ src, onRemove, alt = 'Preview' }) => {
    const isPdf = src?.toLowerCase().endsWith('.pdf');
    return (
      <PreviewCard>
        {isPdf ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', p: 0.5 }}>
            <IconFileText size={24} style={{ color: 'red' }} />
          </Box>
        ) : (
          <CardMedia component="img" height="80" image={src} alt={alt} sx={{ objectFit: 'cover' }} />
        )}
        <RemoveButton size="small" onClick={onRemove}>
          <IconX size={14} />
        </RemoveButton>
      </PreviewCard>
    );
  };

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={GOOGLE_MAPS_LIBRARIES}>
      <PageContainer title="Add Professional Provider" description="Add a new professional service provider">
        <Breadcrumb title="Add Professional Provider" items={BCrumb} />
        <ToastContainer position="top-right" autoClose={3000} />

        <Box sx={{ float: 'right', mb: 2 }}>
          <Button variant="contained" color="primary" onClick={() => navigate(-1)} startIcon={<IconArrowBackUp />}>
            Back
          </Button>
        </Box>

        <Box>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <ParentCard title="Basic Information">
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="firstName" required>
                    First Name
                  </CustomFormLabel>
                  <CustomTextField
                    id="firstName"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter First Name"
                    name="firstName"
                    value={form.firstName}

                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="lastName" required>
                    Last Name
                  </CustomFormLabel>
                  <CustomTextField
                    id="lastName"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Last Name"
                    name="lastName"
                    value={form.lastName}

                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="business_name" required>
                    Business Name
                  </CustomFormLabel>
                  <CustomTextField
                    id="business_name"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Business Name"
                    name="business_name"
                    value={form.business_name}

                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="slug">
                    Slug
                  </CustomFormLabel>
                  <CustomTextField
                    id="slug"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="dob" required>
                    Date of Birth
                  </CustomFormLabel>
                  <CustomTextField
                    id="dob"
                    type="date"
                    variant="outlined"
                    fullWidth
                    name="dob"
                    value={form.dob}

                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="experiance" required>
                    Establishment Date/Experience
                  </CustomFormLabel>
                  <CustomTextField
                    id="experiance"
                    type="number"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Experience"
                    name="experiance"
                    value={form.experiance}

                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="phone" required>
                    Phone Number
                  </CustomFormLabel>
                  <CustomTextField
                    id="phone"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Phone Number"
                    name="phone"
                    value={form.phone}

                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                    inputProps={{ maxLength: 10, minLength: 10, pattern: '[0-9]{10}', inputMode: 'numeric' }}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="whatsappNumber">WhatsApp Number</CustomFormLabel>
                  <CustomTextField
                    id="whatsappNumber"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter WhatsApp Number"
                    name="whatsappNumber"
                    value={form.whatsappNumber}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                    inputProps={{ maxLength: 10, minLength: 10, pattern: '[0-9]{10}', inputMode: 'numeric' }}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="email" required>
                    Email
                  </CustomFormLabel>
                  <CustomTextField
                    id="email"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Email"
                    name="email"
                    type="email"
                    value={form.email}

                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="password" required>
                    Password
                  </CustomFormLabel>
                  <CustomTextField
                    id="password"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Password"
                    name="password"
                    type="password"
                    value={form.password}

                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="serviceId" required>
                    Business Vertical
                  </CustomFormLabel>
                  <CustomSelect
                    id="serviceId"
                    name="serviceId"
                    value={form.serviceId}
                    onChange={(e) => {
                      const selectedServiceId = e.target.value;
                      const selectedService = services.find((service) => service._id === selectedServiceId);
                      setForm({
                        ...form,
                        serviceId: selectedServiceId,
                        serviceName: selectedService ? selectedService.name : '',
                      });
                      setCategories([]);
                    }}
                    fullWidth

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
                  {form.serviceName && (
                    <FormHelperText sx={{ color: 'primary.main', mt: 0.5 }}>
                      Selected: {form.serviceName}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="professionalServiceCategoryId" required>
                    Category
                  </CustomFormLabel>
                  <CustomSelect
                    id="professionalServiceCategoryId"
                    name="professionalServiceCategoryId"
                    value={form.professionalServiceCategoryId[0] || ''} // Ã¢Å“â€¦ Get first value from array
                    onChange={handleCategoryChange} // Ã¢Å“â€¦ Use new handler
                    fullWidth
                    required
                  >
                    <MenuItem value="" disabled>
                      Select Category
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>

                  {/* Ã¢Å“â€¦ Optional: Show selected category name */}
                  {form.professionalServiceCategoryId.length > 0 && (
                    <FormHelperText sx={{ color: 'primary.main' }}>

                    </FormHelperText>
                  )}
                </Grid>


                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="professionalServiceSubcategoryId" required>
                    Subcategory
                  </CustomFormLabel>
                  <CustomSelect
                    id="professionalServiceSubcategoryId"
                    name="professionalServiceSubcategoryId"
                    multiple
                    value={form.professionalServiceSubcategoryId}
                    onChange={handleMultiSelectChange}
                    fullWidth

                    disabled={form.professionalServiceCategoryId.length === 0}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const subcategory = subcategories.find((sub) => sub._id === value);
                          return subcategory ? <Chip key={value} label={subcategory.name} /> : null;
                        })}
                      </Box>
                    )}
                  >
                    {subcategories.map((sub) => (
                      <MenuItem key={sub._id} value={sub._id}>
                        <Checkbox checked={form.professionalServiceSubcategoryId.indexOf(sub._id) > -1} />
                        {sub.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>


                {/* Amenities Multi-Select Dropdown */}
                {/* Amenities Multi-Select Dropdown */}
                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="amenities">
                    Amenities
                  </CustomFormLabel>
                  <CustomSelect
                    id="amenities"
                    name="amenities"
                    multiple
                    value={form.amenities}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm((prev) => ({ ...prev, amenities: value }));

                      // Ã¢Å“â€¦ Clear otherAmenities if "other" is deselected
                      if (!value.includes('other')) {
                        setForm((prev) => ({ ...prev, otherAmenities: '' }));
                      }
                    }}
                    fullWidth
                    disabled={amenities.length === 0}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            Select Amenities
                          </Typography>
                        ) : (
                          selected.map((value) => {
                            const amenity = amenities.find((a) => a._id === value);
                            return amenity ? (
                              <Chip
                                key={value}
                                label={amenity.title}
                                size="small"
                                onDelete={(e) => {
                                  e.stopPropagation();
                                  setForm((prev) => ({
                                    ...prev,
                                    amenities: prev.amenities.filter((id) => id !== value),
                                    // Clear otherAmenities if "other" is removed
                                    otherAmenities: value === 'other' ? '' : prev.otherAmenities
                                  }));
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                              />
                            ) : null;
                          })
                        )}
                      </Box>
                    )}
                    displayEmpty
                  >
                    {amenities.length === 0 ? (
                      <MenuItem value="" disabled>
                        <Typography variant="body2" color="text.secondary">
                          Select subcategories first to load amenities
                        </Typography>
                      </MenuItem>
                    ) : (
                      amenities.map((amenity) => (
                        <MenuItem key={amenity._id} value={amenity._id}>
                          <Checkbox checked={form.amenities.indexOf(amenity._id) > -1} />
                          <Typography variant="body2">{amenity.title}</Typography>
                        </MenuItem>
                      ))
                    )}
                  </CustomSelect>
                  {form.amenities.length > 0 && (
                    <FormHelperText sx={{ color: 'success.main' }}>
                      {form.amenities.length}
                    </FormHelperText>
                  )}
                </Grid>

                {/* Ã¢Å“â€¦ Other Amenities Text Field - Shows only when "Other" is selected */}
                {form.amenities.includes('other') && (
                  <Grid item xs={12} sm={4} md={3}>
                    <CustomFormLabel htmlFor="otherAmenities" required>
                      Specify Other Amenities
                    </CustomFormLabel>
                    <CustomTextField
                      id="otherAmenities"
                      name="otherAmenities"
                      value={form.otherAmenities}
                      onChange={handleChange}
                      placeholder="Enter custom amenities (comma-separated)"
                      fullWidth

                      multiline
                      rows={2}
                      helperText="Example: Free Parking, 24/7 Support, etc."
                    />
                  </Grid>
                )}




                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="image" required>Profile Image</CustomFormLabel>
                  {!previews.image ? (
                    <CompactFileInput
                      id="image"
                      label=""
                      accept="image/jpeg,image/png"
                      onChange={(e) => handleFileChange(e, 'image')}
                      required
                    />
                  ) : (
                    <Box sx={{ position: 'relative', mt: 1 }}>
                      <ImagePreview
                        src={previews.image}
                        onRemove={() => handleRemoveFile('image')}
                        alt="Profile Preview"
                      />
                      <input
                        accept="image/jpeg,image/png"
                        style={{ display: 'none' }}
                        id="replace-image"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'image')}
                      />
                      <label htmlFor="replace-image">
                        <IconButton
                          component="span"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                            },
                            boxShadow: 1,
                            zIndex: 2
                          }}
                        >
                          <IconUpload size={16} />
                        </IconButton>
                      </label>
                    </Box>
                  )}
                </Grid>

              </Grid>
            </ParentCard>

            {/* Identity Documents */}
            <ParentCard title="Identity Documents">
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel htmlFor="pan_number">PAN Number</CustomFormLabel>
                    <CustomTextField
                      id="pan_number"
                      variant="outlined"
                      fullWidth
                      placeholder="Enter PAN Number"
                      name="pan_number"
                      value={form.pan_number}
                      onChange={handleChange}
                      inputProps={{ maxLength: 20 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>PAN Card Front</CustomFormLabel>
                    {!previews.pan_card_front ? (
                      <CompactFileInput
                        id="pan_card_front"
                        label=""
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(e) => handleFileChange(e, 'pan_card_front')}
                      />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview
                          src={previews.pan_card_front}
                          onRemove={() => handleRemoveFile('pan_card_front')}
                          alt="PAN Front"
                        />
                        <input
                          accept="image/jpeg,image/png,application/pdf"
                          style={{ display: 'none' }}
                          id="replace-pan_card_front"
                          type="file"
                          onChange={(e) => handleFileChange(e, 'pan_card_front')}
                        />
                        <label htmlFor="replace-pan_card_front">
                          <IconButton
                            component="span"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                              },
                              boxShadow: 1,
                              zIndex: 2
                            }}
                          >
                            <IconUpload size={16} />
                          </IconButton>
                        </label>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>PAN Card Back</CustomFormLabel>
                    {!previews.pan_card_back ? (
                      <CompactFileInput
                        id="pan_card_back"
                        label=""
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(e) => handleFileChange(e, 'pan_card_back')}
                      />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview
                          src={previews.pan_card_back}
                          onRemove={() => handleRemoveFile('pan_card_back')}
                          alt="PAN Back"
                        />
                        <input
                          accept="image/jpeg,image/png,application/pdf"
                          style={{ display: 'none' }}
                          id="replace-pan_card_back"
                          type="file"
                          onChange={(e) => handleFileChange(e, 'pan_card_back')}
                        />
                        <label htmlFor="replace-pan_card_back">
                          <IconButton
                            component="span"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                              },
                              boxShadow: 1,
                              zIndex: 2
                            }}
                          >
                            <IconUpload size={16} />
                          </IconButton>
                        </label>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} md={3}>
                    {/* Empty or future use */}
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel htmlFor="aadhar_number">Aadhar Number</CustomFormLabel>
                    <CustomTextField
                      id="aadhar_number"
                      variant="outlined"
                      fullWidth
                      placeholder="Enter Aadhar Number"
                      name="aadhar_number"
                      value={form.aadhar_number}
                      onChange={handleChange}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) e.preventDefault();
                      }}
                      inputProps={{ maxLength: 12, pattern: '[0-9]{12}', inputMode: 'numeric' }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Aadhar Card Front</CustomFormLabel>
                    {!previews.aadhar_card_front ? (
                      <CompactFileInput
                        id="aadhar_card_front"
                        label=""
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(e) => handleFileChange(e, 'aadhar_card_front')}
                      />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview
                          src={previews.aadhar_card_front}
                          onRemove={() => handleRemoveFile('aadhar_card_front')}
                          alt="Aadhar Front"
                        />
                        <input
                          accept="image/jpeg,image/png,application/pdf"
                          style={{ display: 'none' }}
                          id="replace-aadhar_card_front"
                          type="file"
                          onChange={(e) => handleFileChange(e, 'aadhar_card_front')}
                        />
                        <label htmlFor="replace-aadhar_card_front">
                          <IconButton
                            component="span"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                              },
                              boxShadow: 1,
                              zIndex: 2
                            }}
                          >
                            <IconUpload size={16} />
                          </IconButton>
                        </label>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Aadhar Card Back</CustomFormLabel>
                    {!previews.aadhar_card_back ? (
                      <CompactFileInput
                        id="aadhar_card_back"
                        label=""
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(e) => handleFileChange(e, 'aadhar_card_back')}
                      />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview
                          src={previews.aadhar_card_back}
                          onRemove={() => handleRemoveFile('aadhar_card_back')}
                          alt="Aadhar Back"
                        />
                        <input
                          accept="image/jpeg,image/png,application/pdf"
                          style={{ display: 'none' }}
                          id="replace-aadhar_card_back"
                          type="file"
                          onChange={(e) => handleFileChange(e, 'aadhar_card_back')}
                        />
                        <label htmlFor="replace-aadhar_card_back">
                          <IconButton
                            component="span"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                              },
                              boxShadow: 1,
                              zIndex: 2
                            }}
                          >
                            <IconUpload size={16} />
                          </IconButton>
                        </label>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} md={3}>
                    {/* Empty or future use */}
                  </Grid>
                </Grid>



                <Grid container spacing={2} sx={{ p: 2 }}>
                  {/* Address Proof Section */}
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Address Proof Type</CustomFormLabel>
                    <CustomSelect name="address_proof_type" value={form.address_proof_type} onChange={handleChange} fullWidth displayEmpty>
                      <MenuItem value="" disabled>Select Type</MenuItem>
                      <MenuItem value="GAS BILL">Gas Bill</MenuItem>
                      <MenuItem value="RENTAL AGREEMENT">Rental Agreement</MenuItem>
                      <MenuItem value="POWER BILL">Power Bill</MenuItem>
                    </CustomSelect>
                  </Grid>

                  {form.address_proof_type && (
                    <>
                      <Grid item xs={12} sm={6} md={3}>
                        <CustomFormLabel>Proof Number</CustomFormLabel>
                        <CustomTextField name="address_proof_number" value={form.address_proof_number} onChange={handleChange} fullWidth placeholder="Enter Proof Number" />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <CustomFormLabel>Proof Image</CustomFormLabel>
                        {!previews.address_proof ? (
                          <CompactFileInput id="addr_proof" label="" accept="image/jpeg,image/png,application/pdf" onChange={e => handleFileChange(e, 'address_proof')} />
                        ) : (
                          <Box sx={{ position: 'relative', mt: 1 }}>
                            <ImagePreview src={previews.address_proof} onRemove={() => handleRemoveFile('address_proof')} alt="Address Proof" />
                          </Box>
                        )}
                      </Grid>
                    </>
                  )}

                  {/* Spacer if needed */}
                  <Grid item xs={12} md={12} sx={{ my: 1 }} />

                  {/* Business Proof Section */}
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Business Proof Type</CustomFormLabel>
                    <CustomSelect name="business_proof_type" value={form.business_proof_type} onChange={handleChange} fullWidth displayEmpty>
                      <MenuItem value="" disabled>Select Type</MenuItem>
                      <MenuItem value="LABOUR LICENCE">Labour Licence</MenuItem>
                      <MenuItem value="UDYAM CERTIFICATE">Udyam Certificate</MenuItem>
                      <MenuItem value="GST">GST</MenuItem>
                    </CustomSelect>
                  </Grid>

                  {form.business_proof_type && (
                    <>
                      <Grid item xs={12} sm={6} md={3}>
                        <CustomFormLabel>Business/GST Number</CustomFormLabel>
                        <CustomTextField name="business_number" value={form.business_number} onChange={handleChange} fullWidth placeholder="Enter Number" />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <CustomFormLabel>Proof Image</CustomFormLabel>
                        {!previews.business_proof ? (
                          <CompactFileInput id="biz_proof" label="" accept="image/jpeg,image/png,application/pdf" onChange={e => handleFileChange(e, 'business_proof')} />
                        ) : (
                          <Box sx={{ position: 'relative', mt: 1 }}>
                            <ImagePreview src={previews.business_proof} onRemove={() => handleRemoveFile('business_proof')} alt="Business Proof" />
                          </Box>
                        )}
                      </Grid>
                    </>
                  )}
                </Grid>

                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Logo</CustomFormLabel>
                    {!previews.logo ? (
                      <CompactFileInput
                        id="logo"
                        label=""
                        accept="image/jpeg,image/png"
                        onChange={(e) => handleFileChange(e, 'logo')}
                      />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview
                          src={previews.logo}
                          onRemove={() => handleRemoveFile('logo')}
                          alt="Logo"
                        />
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: 'none' }}
                          id="replace-logo"
                          type="file"
                          onChange={(e) => handleFileChange(e, 'logo')}
                        />
                        <label htmlFor="replace-logo">
                          <IconButton
                            component="span"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                              },
                              boxShadow: 1,
                              zIndex: 2
                            }}
                          >
                            <IconUpload size={16} />
                          </IconButton>
                        </label>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Banner Image</CustomFormLabel>
                    {!previews.banner_image ? (
                      <CompactFileInput
                        id="banner_image"
                        label=""
                        accept="image/jpeg,image/png"
                        onChange={(e) => handleFileChange(e, 'banner_image')}
                      />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview
                          src={previews.banner_image}
                          onRemove={() => handleRemoveFile('banner_image')}
                          alt="Banner"
                        />
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: 'none' }}
                          id="replace-banner_image"
                          type="file"
                          onChange={(e) => handleFileChange(e, 'banner_image')}
                        />
                        <label htmlFor="replace-banner_image">
                          <IconButton
                            component="span"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                              },
                              boxShadow: 1,
                              zIndex: 2
                            }}
                          >
                            <IconUpload size={16} />
                          </IconButton>
                        </label>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Customer Bill Copy</CustomFormLabel>
                    {!previews.customer_bill_copy ? (
                      <CompactFileInput
                        id="customer_bill_copy"
                        label=""
                        accept="image/jpeg,image/png"
                        onChange={(e) => handleFileChange(e, 'customer_bill_copy')}
                      />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview
                          src={previews.customer_bill_copy}
                          onRemove={() => handleRemoveFile('customer_bill_copy')}
                          alt="Customer Bill Copy"
                        />
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Business Card</CustomFormLabel>
                    {!previews.business_card ? (
                      <CompactFileInput
                        id="business_card"
                        label=""
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(e) => handleFileChange(e, 'business_card')}
                      />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview
                          src={previews.business_card}
                          onRemove={() => handleRemoveFile('business_card')}
                          alt="Business Card"
                        />
                        <input
                          accept="image/jpeg,image/png,application/pdf"
                          style={{ display: 'none' }}
                          id="replace-business_card"
                          type="file"
                          onChange={(e) => handleFileChange(e, 'business_card')}
                        />
                        <label htmlFor="replace-business_card">
                          <IconButton
                            component="span"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                              },
                              boxShadow: 1,
                              zIndex: 2
                            }}
                          >
                            <IconUpload size={16} />
                          </IconButton>
                        </label>
                      </Box>
                    )}
                  </Grid>

                  {/* Business Images - Multiple Upload */}
                  {/* Business Images - Multiple Upload */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <CustomFormLabel>
                        Business Images ({(previews.businessimages || []).length}/20)
                      </CustomFormLabel>

                      {/* Show upload button only if less than 20 images */}
                      {(previews.businessimages || []).length < 20 && (
                        <>
                          <CompactFileInputContainer>
                            <input
                              accept="image/jpeg,image/png"
                              hidden
                              id="businessimages"
                              multiple
                              type="file"
                              onChange={handleBusinessImagesChange}
                            />
                            <label htmlFor="businessimages" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <IconUpload size={16} />
                              <Typography variant="body2">Choose Files</Typography>
                            </label>
                          </CompactFileInputContainer>
                          <FormHelperText>Max 20 images (JPG, JPEG, PNG only)</FormHelperText>
                        </>
                      )}

                      {/* Preview Section */}
                      {(previews.businessimages || []).length > 0 && (
                        <Box mt={1.5}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {(previews.businessimages || []).length} image{(previews.businessimages || []).length !== 1 ? 's' : ''} selected
                          </Typography>

                          <ImagePreviewContainer>
                            {(previews.businessimages || []).map((preview, index) => (
                              <PreviewCard key={index} sx={{ position: 'relative' }}>
                                <CardMedia
                                  component="img"
                                  image={preview}
                                  alt={`Business image ${index + 1}`}
                                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />

                                {/* Upload/Replace button overlay on each image */}
                                <input
                                  accept="image/jpeg,image/png"
                                  style={{ display: 'none' }}
                                  id={`replace-business-image-${index}`}
                                  type="file"
                                  onChange={(e) => replaceBusinessImage(e, index)}
                                />
                                <label htmlFor={`replace-business-image-${index}`}>
                                  <IconButton
                                    component="span"
                                    size="small"
                                    sx={{
                                      position: 'absolute',
                                      top: 4,
                                      left: 4,
                                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                      '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 1)',
                                      },
                                      boxShadow: 1,
                                      zIndex: 2,
                                      padding: '4px'
                                    }}
                                  >
                                    <IconUpload size={14} />
                                  </IconButton>
                                </label>

                                {/* Remove button */}
                                <RemoveButton size="small" onClick={() => removeBusinessImage(index)}>
                                  <IconX size={14} />
                                </RemoveButton>
                              </PreviewCard>
                            ))}
                          </ImagePreviewContainer>
                        </Box>
                      )}
                    </Box>
                  </Grid>

                </Grid>
              </Grid>
            </ParentCard>


            {/* Address Information with Google Maps */}
            <ParentCard title="Address Information">
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} md={3}>
                  <CustomFormLabel htmlFor="countryId">Country</CustomFormLabel>
                  <CustomSelect
                    id="countryId"
                    name="countryId"
                    value={form.countryId}
                    onChange={(e) => {
                      const countryId = e.target.value;
                      setSelectedCountry(countryId);
                      setForm({ ...form, countryId, stateId: '', cityId: '' });
                    }}
                    fullWidth

                  >
                    <MenuItem value="" disabled>
                      Select Country
                    </MenuItem>
                    {countries.map((country) => (
                      <MenuItem key={country._id} value={country._id}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>

                <Grid item xs={12} md={3}>
                  <CustomFormLabel htmlFor="stateId">State</CustomFormLabel>
                  <CustomSelect
                    id="stateId"
                    name="stateId"
                    value={form.stateId}
                    onChange={(e) => {
                      const stateId = e.target.value;
                      setSelectedState(stateId);
                      setForm({ ...form, stateId, cityId: '' });
                    }}
                    fullWidth

                    disabled={!form.countryId}
                  >
                    <MenuItem value="" disabled>
                      Select State
                    </MenuItem>
                    {states.map((state) => (
                      <MenuItem key={state._id} value={state._id}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>

                <Grid item xs={12} md={3}>
                  <CustomFormLabel htmlFor="cityId">City</CustomFormLabel>
                  <CustomSelect id="cityId" name="cityId" value={form.cityId} onChange={handleChange} fullWidth disabled={!form.stateId}>
                    <MenuItem value="" disabled>
                      Select City
                    </MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city._id} value={city._id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>

                <Grid item xs={12} md={3}>
                  <CustomFormLabel htmlFor="pincode" >
                    Pincode
                  </CustomFormLabel>
                  <CustomTextField
                    id="pincode"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Pincode"
                    name="pincode"
                    value={form.pincode}

                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="address">Search Address</CustomFormLabel>
                  <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                    <CustomTextField
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Search for a location or use current location"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={getCurrentLocation}
                              disabled={detectingLocation}
                              edge="end"
                              title="Use current location"
                              sx={{
                                color: 'primary.main',
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                  opacity: 0.8,
                                },
                              }}
                            >
                              {detectingLocation ? (
                                <CircularProgress size={20} />
                              ) : (
                                <IconCurrentLocation size={20} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Autocomplete>
                  <FormHelperText>
                    Click the location icon to auto-detect your current location
                  </FormHelperText>
                </Grid>


                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="latitude">Latitude</CustomFormLabel>
                  <CustomTextField
                    id="latitude"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Latitude"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="longitude">Longitude</CustomFormLabel>
                  <CustomTextField
                    id="longitude"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Longitude"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                  />
                </Grid>

                {/* <Grid item xs={12} sm={4}>
                  <CustomFormLabel htmlFor="deliveryRadiusKm">Delivery Radius (KM)</CustomFormLabel>
                  <CustomTextField
                    id="deliveryRadiusKm"
                    type="number"
                    variant="outlined"
                    fullWidth
                    placeholder="e.g., 10"
                    name="deliveryRadiusKm"
                    value={form.deliveryRadiusKm}
                    onChange={handleChange}
                  />
                </Grid> */}

                {/* Google Map Preview */}

              </Grid>
            </ParentCard>

            {/* Banking Details */}
            <ParentCard title="Banking Details">
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="bankName" >
                    Bank Name
                  </CustomFormLabel>
                  <CustomTextField
                    id="bankName"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Bank Name"
                    name="bankName"
                    value={form.bankName}

                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="branchName" >
                    Branch Name
                  </CustomFormLabel>
                  <CustomTextField
                    id="branchName"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Branch Name"
                    name="branchName"
                    value={form.branchName}

                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="holderName" >
                    Account Holder Name
                  </CustomFormLabel>
                  <CustomTextField
                    id="holderName"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Holder Name"
                    name="holderName"
                    value={form.holderName}

                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="accountNumber" >
                    Account Number
                  </CustomFormLabel>
                  <CustomTextField
                    id="accountNumber"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Account Number"
                    name="accountNumber"
                    type="number"
                    value={form.accountNumber}

                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="ifsc_code">
                    IFSC Code
                  </CustomFormLabel>
                  <CustomTextField
                    id="ifsc_code"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter IFSC Code"
                    name="ifsc_code"
                    value={form.ifsc_code}

                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="upi">
                    UPI ID
                  </CustomFormLabel>
                  <CustomTextField id="upi" variant="outlined" fullWidth placeholder="Enter UPI ID" name="upi" value={form.upi} onChange={handleChange} />
                </Grid>
              </Grid>
            </ParentCard>

            {/* SEO Settings */}
            <ParentCard title="SEO Settings">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="bio">Bio</CustomFormLabel>
                  <CustomTextField
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Professional bio"
                    multiline
                    rows={3}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="metaTitle">
                    Meta Title
                  </CustomFormLabel>
                  <CustomTextField
                    id="metaTitle"
                    name="metaTitle"
                    inputProps={{ maxLength: 90 }}
                    value={form.metaTitle}
                    onChange={handleChange}
                    placeholder="Optimized title for search engines (max 90 chars)"
                    fullWidth
                  />
                  <FormHelperText>{form.metaTitle?.length || 0}/90 characters</FormHelperText>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <CustomFormLabel htmlFor="metakeywords" >
                    Meta Keywords
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
                    {tags.map((tag, index) => (
                      <Chip key={index} label={tag} onDelete={() => removeTag(index)} sx={{ mr: 0.5 }} />
                    ))}
                    <CustomTextField
                      variant="standard"
                      value={inputValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.includes(',')) {
                          const newTags = value
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter((tag) => tag !== '');
                          if (newTags.length > 0) {
                            setTags([...tags, ...newTags]);
                            setInputValue('');
                          }
                        } else {
                          setInputValue(value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (inputValue.trim() !== '') {
                            setTags([...tags, inputValue.trim()]);
                            setInputValue('');
                          }
                        }
                      }}
                      placeholder="Type keywords separated by commas or press Enter"
                      InputProps={{
                        disableUnderline: true,
                        style: { minWidth: '150px' },
                      }}
                      sx={{ flexGrow: 1 }}
                    />
                  </Box>
                  <FormHelperText>Type comma to separate or press Enter to add keywords</FormHelperText>
                </Grid>

                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="metaDescription">Meta Description</CustomFormLabel>
                  <CustomTextField
                    id="metaDescription"
                    name="metaDescription"
                    inputProps={{ maxLength: 250 }}
                    value={form.metaDescription}
                    onChange={handleChange}
                    placeholder="Meta description for search results (max 250 chars)"
                    multiline
                    rows={4}
                    fullWidth
                  />
                  <FormHelperText>{form.metaDescription?.length || 0}/250 characters</FormHelperText>
                </Grid>
              </Grid>
            </ParentCard>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <LoadingButton color="primary" variant="contained" type="submit" loading={loading} sx={{ minWidth: 120 }}>
                Submit
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </PageContainer>
    </LoadScript>
  );
};

export default AddProfessionalProvider;


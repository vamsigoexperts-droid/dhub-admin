import React, { useState, useEffect, useCallback } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import { IconArrowBackUp, IconX, IconUpload, IconFileText, IconCurrentLocation } from '@tabler/icons-react';
import { Button, styled, Chip, IconButton, Card, CardMedia, InputAdornment } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { Select, MenuItem, Box, Typography, Grid, FormHelperText, Checkbox } from '@mui/material';
import { GoogleMap, LoadScript, Marker, Circle, Autocomplete } from '@react-google-maps/api';
import { URLS } from '../../Url';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/AllprofessionalProviders', title: 'Professional Providers' },
  { title: 'Edit Professional Provider' },
];

const GOOGLE_MAPS_API_KEY = 'AIzaSyBNVn5j-M6F4VHkaOluoOcVY3K5r2-NlPk';
const GOOGLE_MAPS_LIBRARIES = ['places'];

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(1),
  overflowX: 'auto',
  paddingBottom: theme.spacing(1),
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[400],
    borderRadius: '4px',
  },
}));

const PreviewCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  flexShrink: 0,
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

const EditProfessionalProvider = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [amenities, setAmenities] = useState([]);

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
    bill_sample: null,
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
    bill_sample: null,
    business_images: [],
  });

  const [existingFiles, setExistingFiles] = useState({
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
    bill_sample: null,
    business_images: [],
  });

  const getToken = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.token || '' : '';
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setDetectingLocation(true);
    toast.info('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat, lng };

          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setForm({
                ...form,
                latitude: lat.toString(),
                longitude: lng.toString(),
                address: results[0].formatted_address,
              });
              setMapCenter({ lat, lng });
              toast.success('Location detected successfully!');
            } else {
              setForm({
                ...form,
                latitude: lat.toString(),
                longitude: lng.toString(),
              });
              setMapCenter({ lat, lng });
              toast.warning('Location detected, but address not found');
            }
            setDetectingLocation(false);
          });
        } catch (error) {
          console.error('Geocoding error:', error);
          setForm({
            ...form,
            latitude: lat.toString(),
            longitude: lng.toString(),
          });
          setMapCenter({ lat, lng });
          toast.warning('Location detected, but address lookup failed');
          setDetectingLocation(false);
        }
      },
      (error) => {
        setDetectingLocation(false);
        let errorMessage = 'Unable to retrieve your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred.';
        }

        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Fetch existing provider data
  useEffect(() => {
    const token = getToken();
    if (!token || !id) {
      toast.error('Authentication required');
      navigate('/AllprofessionalProviders');
      return;
    }

    console.log("this is my id", id);

    const fetchProviderData = async () => {
      try {
        setFetchLoading(true);
        const res = await axios.get(
          `http://192.168.0.5:5013/v1/dhubApi/admin/professional-providers/get-professional-provider/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data.provider;
        const documentnumber = res.data.documents;
        const providerdetails = res.data.providerFields;

        // Extract category and subcategory IDs properly
        const categoryIds = Array.isArray(data.professionalServiceCategoryId)
          ? data.professionalServiceCategoryId.length > 0
            ? [typeof data.professionalServiceCategoryId[0] === 'object'
              ? data.professionalServiceCategoryId[0]._id
              : data.professionalServiceCategoryId[0]]
            : []
          : data.professionalServiceCategoryId
            ? [typeof data.professionalServiceCategoryId === 'object'
              ? data.professionalServiceCategoryId._id
              : data.professionalServiceCategoryId]
            : [];

        const subcategoryIds = Array.isArray(data.professionalServiceSubcategoryId)
          ? data.professionalServiceSubcategoryId.map(sub =>
            typeof sub === 'object' && sub._id ? sub._id : sub
          )
          : [];

        const amenityIds = Array.isArray(data.amenities)
          ? data.amenities.map(amenity =>
            typeof amenity === 'object' && amenity._id ? amenity._id : amenity
          )
          : [];

        if (data.otherAmenities && data.otherAmenities.trim() !== '' && !amenityIds.includes('other')) {
          amenityIds.push('other');
        }

        console.log('Category IDs:', categoryIds);
        console.log('Subcategory IDs:', subcategoryIds);

        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          business_name: data.business_name || '',
          phone: data.phone || '',
          email: data.email || '',
          password: '',
          whatsappNumber: data.whatsappNumber || '',
          professionalServiceCategoryId: categoryIds,
          professionalServiceSubcategoryId: subcategoryIds,
          serviceId: data.serviceId?._id || data.serviceId || '',
          amenities: amenityIds, // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Add this
          otherAmenities: data.otherAmenities || '',
          serviceName: data.serviceId?.name || '',
          countryId: data.countryId?._id || data.countryId || '',
          stateId: data.stateId?._id || data.stateId || '',
          cityId: data.cityId?._id || data.cityId || '',
          address: data.address || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          deliveryRadiusKm: data.deliveryRadiusKm || '',
          bankName: data.bankName || '',
          branchName: data.branchName || '',
          holderName: data.holderName || '',
          accountNumber: data.accountNumber || '',
          ifsc_code: data.ifsc_code || '',
          upi: data.upi || '',
          bio: data.bio || '',
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          altphone: data.altphone || '',
          experiance: providerdetails.experiance || '',
          dob: providerdetails.dob ? providerdetails.dob.split('T')[0] : '',
          pincode: providerdetails.pincode || '',
          aadhar_number: documentnumber.aadhar_number || '',
          pan_number: documentnumber.pan_number || '',
          gas_bill_number: documentnumber.gas_bill_number || '',
          business_number: documentnumber.business_number || '',
          gst_number: documentnumber.gst_number || '',
          passport_number: documentnumber.passport_number || '',
          slug: data.slug || '',
        });

        if (data.countryId?._id || data.countryId) {
          setSelectedCountry(data.countryId?._id || data.countryId);
        }
        if (data.stateId?._id || data.stateId) {
          setSelectedState(data.stateId?._id || data.stateId);
        }

        if (data.metakeywords) {
          const keywords = data.metakeywords.split(',').map((k) => k.trim());
          setTags(keywords);
        }

        const documents = res.data.documents;

        const existingFilesData = {
          image: data.image ? `http://192.168.0.5:5013/${data.image}` : null,
          logo: data.logo ? `http://192.168.0.5:5013/${data.logo}` : null,
          banner_image: documents?.banner_image
            ? `http://192.168.0.5:5013/${documents.banner_image}`
            : data.banner_image
              ? `http://192.168.0.5:5013/${data.banner_image}`
              : null,
          pan_card_front: documents?.pan_card_front ? `http://192.168.0.5:5013/${documents.pan_card_front}` : null,
          pan_card_back: documents?.pan_card_back ? `http://192.168.0.5:5013/${documents.pan_card_back}` : null,
          aadhar_card_front: documents?.aadhar_card_front ? `http://192.168.0.5:5013/${documents.aadhar_card_front}` : null,
          aadhar_card_back: documents?.aadhar_card_back ? `http://192.168.0.5:5013/${documents.aadhar_card_back}` : null,
          gst_bill: Array.isArray(documents?.gst_bill) && documents.gst_bill.length > 0 ? `http://192.168.0.5:5013/${documents.gst_bill[0]}` : null,
          business_proof: documents?.business_proof ? `http://192.168.0.5:5013/${documents.business_proof}` : null,
          gas_bill: documents?.gas_bill ? `http://192.168.0.5:5013/${documents.gas_bill}` : null,
          business_card: documents?.business_card ? `http://192.168.0.5:5013/${documents.business_card}` : null,
          bill_sample: documents?.bill_sample ? `http://192.168.0.5:5013/${documents.bill_sample}` : null,
          passport_front: documents?.passport_front ? `http://192.168.0.5:5013/${documents.passport_front}` : null,
          passport_back: documents?.passport_back ? `http://192.168.0.5:5013/${documents.passport_back}` : null,
          business_images: Array.isArray(documents?.business_images) ? documents.business_images.map((img) => `http://192.168.0.5:5013/${img}`) : [],
        };

        setExistingFiles(existingFilesData);
        setPreviews(existingFilesData);

        if (data.latitude && data.longitude) {
          setMapCenter({
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude),
          });
        }
      } catch (error) {
        console.error('Failed to fetch provider data:', error);
        toast.error(error.response?.data?.message || 'Failed to load provider data');
        navigate('/');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProviderData();
  }, [id, getToken, navigate]);

  // Fetch Professional Services
  useEffect(() => {
    const token = getToken();
    if (!token) return;

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
          }
        );
        setServices(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, [getToken]);

  // Fetch Professional Categories based on selected service
  useEffect(() => {
    const token = getToken();
    if (!token || !form.serviceId) return;

    const fetchCategories = async () => {
      try {
        const res = await axios.post(
          'http://192.168.0.5:5013/v1/dhubApi/admin/professional-services-category/categoryForDropdown',
          { serviceId: form.serviceId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setCategories(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, [form.serviceId, getToken]);



  // Fetch Amenities when subcategories change
  useEffect(() => {
    const token = getToken();

    if (form.professionalServiceSubcategoryId.length === 0 || !token) {
      if (!fetchLoading) {
        setAmenities([]);
        setForm((prev) => ({ ...prev, amenities: [], otherAmenities: '' }));
      }
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

        // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Always add "Other" option at the end
        const amenitiesWithOther = [
          ...uniqueAmenities,
          { _id: 'other', title: 'Other' }
        ];

        setAmenities(amenitiesWithOther);
      } catch (error) {
        console.error('Failed to fetch amenities:', error);
        // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Even on error, show "Other" option
        setAmenities([{ _id: 'other', title: 'Other' }]);
      }
    };

    fetchAmenities();
  }, [form.professionalServiceSubcategoryId, getToken, fetchLoading]);


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

        // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Loop works for both single and multiple categories
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
          }
        );
        setCountries(res.data.country || []);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };

    fetchCountries();
  }, [getToken]);

  // Fetch States when country changes
  useEffect(() => {
    const token = getToken();
    if (!selectedCountry || !token) {
      if (!fetchLoading) {
        setStates([]);
        setCities([]);
      }
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
          }
        );
        setStates(res.data.states || []);
      } catch (error) {
        console.error('Failed to fetch states:', error);
      }
    };

    fetchStates();
  }, [selectedCountry, getToken, fetchLoading]);

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
      if (!fetchLoading) {
        setCities([]);
      }
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
          }
        );
        setCities(res.data.cities || []);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      }
    };

    fetchCities();
  }, [selectedState, getToken, fetchLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Keep the existing handleMultiSelectChange for subcategories
  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Add new handler for single category selection
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
        setExistingFiles((prev) => ({ ...prev, [fieldName]: null }));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, PNG, or PDF.');
      }
    }
  };

  const handleRemoveFile = (fieldName) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
    setPreviews((prev) => ({ ...prev, [fieldName]: null }));
    setExistingFiles((prev) => ({ ...prev, [fieldName]: null }));
    const fileInput = document.getElementById(fieldName);
    if (fileInput) fileInput.value = '';
  };

  const handleBusinessImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const currentFiles = files.business_images || [];
    const currentPreviews = previews.business_images || [];

    if (currentPreviews.length + selectedFiles.length > 20) {
      toast.error(`You can upload a maximum of 20 business images. Currently ${currentPreviews.length} images uploaded.`);
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
    setFiles((prev) => ({ ...prev, business_images: newFiles }));

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => ({ ...prev, business_images: [...currentPreviews, ...newPreviews] }));

    e.target.value = null;
  };

  const replaceBusinessImage = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      toast.error('Please choose only JPG, JPEG, or PNG files.');
      e.target.value = null;
      return;
    }

    const currentFiles = files.business_images || [];
    const currentPreviews = previews.business_images || [];
    const currentExisting = existingFiles.business_images || [];

    if (currentPreviews[index]) {
      URL.revokeObjectURL(currentPreviews[index]);
    }

    const newPreviewUrl = URL.createObjectURL(file);
    const newFiles = [...currentFiles];
    newFiles[index] = file;

    const newPreviews = [...currentPreviews];
    newPreviews[index] = newPreviewUrl;

    const newExisting = [...currentExisting];
    newExisting[index] = null;

    setFiles((prev) => ({ ...prev, business_images: newFiles }));
    setPreviews((prev) => ({ ...prev, business_images: newPreviews }));
    setExistingFiles((prev) => ({ ...prev, business_images: newExisting }));

    e.target.value = null;
  };

  const removeBusinessImage = (index) => {
    const newFiles = [...files.business_images];
    const newPreviews = [...previews.business_images];
    const newExisting = [...existingFiles.business_images];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    newExisting.splice(index, 1);

    setFiles((prev) => ({ ...prev, business_images: newFiles }));
    setPreviews((prev) => ({ ...prev, business_images: newPreviews }));
    setExistingFiles((prev) => ({ ...prev, business_images: newExisting }));
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

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


  const validateCategoriesAndSubcategories = () => {
    // Validate categories - keep only those that exist in the fetched categories list
    const validCategoryIds = form.professionalServiceCategoryId.filter(catId =>
      categories.some(cat => cat._id === catId)
    );

    // Validate subcategories - keep only those that exist in the fetched subcategories list
    const validSubcategoryIds = form.professionalServiceSubcategoryId.filter(subId =>
      subcategories.some(sub => sub._id === subId)
    );

    // Check if any invalid IDs were found
    const invalidCategories = form.professionalServiceCategoryId.filter(catId =>
      !categories.some(cat => cat._id === catId)
    );

    const invalidSubcategories = form.professionalServiceSubcategoryId.filter(subId =>
      !subcategories.some(sub => sub._id === subId)
    );

    if (invalidCategories.length > 0) {
      console.warn('Invalid category IDs removed:', invalidCategories);
      toast.warning(`${invalidCategories.length} invalid categories were removed`);
    }

    if (invalidSubcategories.length > 0) {
      console.warn('Invalid subcategory IDs removed:', invalidSubcategories);
      toast.warning(`${invalidSubcategories.length} invalid subcategories were removed`);
    }

    return {
      validCategoryIds,
      validSubcategoryIds,
    };
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = getToken();

    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      setLoading(false);
      return;
    }

    // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Validate: If "other" is selected, otherAmenities must be filled
    if (form.amenities.includes('other') && !form.otherAmenities.trim()) {
      toast.error('Please specify custom amenities when "Other" is selected.');
      setLoading(false);
      return;
    }

    // Validate categories and subcategories
    const { validCategoryIds, validSubcategoryIds } = validateCategoriesAndSubcategories();

    if (validCategoryIds.length === 0) {
      toast.error('Please select at least one valid category');
      setLoading(false);
      return;
    }

    if (validSubcategoryIds.length === 0) {
      toast.error('Please select at least one valid subcategory');
      setLoading(false);
      return;
    }

    const formData = new FormData();

    // Add form fields
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'serviceName') return;

      // Use validated IDs for categories and subcategories
      if (key === 'professionalServiceCategoryId') {
        if (validCategoryIds.length > 0) {
          formData.append(key, JSON.stringify(validCategoryIds));
        }
        return;
      }

      if (key === 'professionalServiceSubcategoryId') {
        if (validSubcategoryIds.length > 0) {
          formData.append(key, JSON.stringify(validSubcategoryIds));
        }
        return;
      }

      // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Handle amenities - filter out "other" and only send actual amenity IDs
      if (key === 'amenities') {
        const actualAmenities = Array.isArray(value)
          ? value.filter(id => id !== 'other')
          : [];

        if (actualAmenities.length > 0) {
          formData.append(key, JSON.stringify(actualAmenities));
        }
        return;
      }

      // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Append otherAmenities only if "other" is selected
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

    if (tags.length > 0) {
      formData.append('metakeywords', tags.join(', '));
    }

    // Add files
    Object.entries(files).forEach(([key, file]) => {
      if (key === 'business_images') {
        if (Array.isArray(file) && file.length > 0) {
          file.forEach((businessImg) => formData.append('business_images', businessImg));
        }
      } else if (file) {
        formData.append(key, file);
      }
    });

    // Debug: Log formData
    console.log('Selected Amenities:', form.amenities);
    console.log('Other Amenities:', form.otherAmenities);
    console.log('FormData contents:');
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

      const res = await axios.put(
        `http://192.168.0.5:5013/v1/dhubApi/admin/professional-providers/update-professional-provider/${id}`,
        formData,
        config
      );

      if (res.status === 200) {
        toast.success(res.data.message || 'Professional Provider updated successfully!');
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

  if (fetchLoading) {
    return (
      <PageContainer title="Edit Professional Provider" description="Loading provider data...">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h4">Loading...</Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={GOOGLE_MAPS_LIBRARIES}>
      <PageContainer title="Edit Professional Provider" description="Edit professional service provider details">
        <Breadcrumb title="Edit Professional Provider" items={BCrumb} />
        <ToastContainer position="top-right" autoClose={3000} />

        <Box sx={{ float: 'right', mb: 2 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/AllprofessionalProviders')} startIcon={<IconArrowBackUp />}>
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
                  <CustomTextField id="firstName" variant="outlined" fullWidth placeholder="Enter First Name" name="firstName" value={form.firstName} required onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="lastName" required>
                    Last Name
                  </CustomFormLabel>
                  <CustomTextField id="lastName" variant="outlined" fullWidth placeholder="Enter Last Name" name="lastName" value={form.lastName} required onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="business_name" required>
                    Business Name
                  </CustomFormLabel>
                  <CustomTextField id="business_name" variant="outlined" fullWidth placeholder="Enter Business Name" name="business_name" value={form.business_name} required onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="slug">
                    Slug
                  </CustomFormLabel>
                  <CustomTextField id="slug" variant="outlined" fullWidth placeholder="Enter Slug" name="slug" value={form.slug} onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="dob" required>
                    Date of Birth
                  </CustomFormLabel>
                  <CustomTextField id="dob" type="date" variant="outlined" fullWidth name="dob" value={form.dob} required onChange={handleChange} InputLabelProps={{ shrink: true }} />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="experiance" required>
                    Establishment Date/ Experience
                  </CustomFormLabel>
                  <CustomTextField id="experiance" type="number" variant="outlined" fullWidth placeholder="Enter Experience" name="experiance" value={form.experiance} required onChange={handleChange} />
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
                    required
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
                  <CustomTextField id="email" variant="outlined" fullWidth placeholder="Enter Email" name="email" type="email" value={form.email} required onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="password">Password (Leave blank to keep current)</CustomFormLabel>
                  <CustomTextField id="password" variant="outlined" fullWidth placeholder="Enter New Password" name="password" type="password" value={form.password} onChange={handleChange} />
                  <FormHelperText>Only fill if you want to change the password</FormHelperText>
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
                        // Clear categories and subcategories when service changes
                        professionalServiceCategoryId: [],
                        professionalServiceSubcategoryId: [],
                      });
                      // Clear the lists
                      setCategories([]);
                      setSubcategories([]);
                    }}
                    fullWidth
                    required
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

                  {form.serviceName && <FormHelperText sx={{ color: 'primary.main', mt: 0.5 }}>Selected: {form.serviceName}</FormHelperText>}
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="professionalServiceCategoryId" required>
                    Category
                  </CustomFormLabel>
                  <CustomSelect
                    id="professionalServiceCategoryId"
                    name="professionalServiceCategoryId"
                    value={form.professionalServiceCategoryId[0] || ''} // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Get first value from array
                    onChange={handleCategoryChange} // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Use new handler
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

                  {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Optional: Show selected category name */}
                  {form.professionalServiceCategoryId.length > 0 && (
                    <FormHelperText sx={{ color: 'primary.main' }}>
                      Selected: {categories.find(cat => cat._id === form.professionalServiceCategoryId[0])?.name}
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
                    required
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

                      // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Clear otherAmenities if "other" is deselected
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

                    </FormHelperText>
                  )}
                </Grid>

                {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Other Amenities Text Field - Shows only when "Other" is selected */}
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
                      required
                      multiline
                      rows={2}
                      helperText="Example: Free Parking, 24/7 Support, etc."
                    />
                  </Grid>
                )}


                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="image" required>
                    Profile Image
                  </CustomFormLabel>
                  {!previews.image ? (
                    <CompactFileInput id="image" label="Profile Image" accept="image/jpeg,image/png" onChange={(e) => handleFileChange(e, 'image')} required />
                  ) : (
                    <Box sx={{ position: 'relative', mt: 1 }}>
                      <ImagePreview src={previews.image} onRemove={() => handleRemoveFile('image')} alt="Profile Preview" />
                      <input accept="image/jpeg,image/png" style={{ display: 'none' }} id="replace-image" type="file" onChange={(e) => handleFileChange(e, 'image')} />
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
                            zIndex: 2,
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
                {/* PAN Card Section - Row 1 */}
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel htmlFor="pan_number">PAN Number</CustomFormLabel>
                    <CustomTextField id="pan_number" variant="outlined" fullWidth placeholder="Enter PAN Number" name="pan_number" value={form.pan_number} onChange={handleChange} inputProps={{ maxLength: 20 }} />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>PAN Card Front</CustomFormLabel>
                    {!previews.pan_card_front ? (
                      <CompactFileInput id="pan_card_front" label="PAN Card Front" accept="image/jpeg,image/png,application/pdf" onChange={(e) => handleFileChange(e, 'pan_card_front')} />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview src={previews.pan_card_front} onRemove={() => handleRemoveFile('pan_card_front')} alt="PAN Front" />
                        <input accept="image/jpeg,image/png,application/pdf" style={{ display: 'none' }} id="replace-pan_card_front" type="file" onChange={(e) => handleFileChange(e, 'pan_card_front')} />
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
                              zIndex: 2,
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
                      <CompactFileInput id="pan_card_back" label="PAN Card Back" accept="image/jpeg,image/png,application/pdf" onChange={(e) => handleFileChange(e, 'pan_card_back')} />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview src={previews.pan_card_back} onRemove={() => handleRemoveFile('pan_card_back')} alt="PAN Back" />
                        <input accept="image/jpeg,image/png,application/pdf" style={{ display: 'none' }} id="replace-pan_card_back" type="file" onChange={(e) => handleFileChange(e, 'pan_card_back')} />
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
                              zIndex: 2,
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

                {/* Aadhar Card Section - Row 2 */}
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
                      <CompactFileInput id="aadhar_card_front" label="Aadhar Card Front" accept="image/jpeg,image/png,application/pdf" onChange={(e) => handleFileChange(e, 'aadhar_card_front')} />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview src={previews.aadhar_card_front} onRemove={() => handleRemoveFile('aadhar_card_front')} alt="Aadhar Front" />
                        <input accept="image/jpeg,image/png,application/pdf" style={{ display: 'none' }} id="replace-aadhar_card_front" type="file" onChange={(e) => handleFileChange(e, 'aadhar_card_front')} />
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
                              zIndex: 2,
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
                      <CompactFileInput id="aadhar_card_back" label="Aadhar Card Back" accept="image/jpeg,image/png,application/pdf" onChange={(e) => handleFileChange(e, 'aadhar_card_back')} />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview src={previews.aadhar_card_back} onRemove={() => handleRemoveFile('aadhar_card_back')} alt="Aadhar Back" />
                        <input accept="image/jpeg,image/png,application/pdf" style={{ display: 'none' }} id="replace-aadhar_card_back" type="file" onChange={(e) => handleFileChange(e, 'aadhar_card_back')} />
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
                              zIndex: 2,
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



                {/* Gas Bill Section - Row 4 */}
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel htmlFor="gas_bill_number">Gas Bill Number</CustomFormLabel>
                    <CustomTextField id="gas_bill_number" variant="outlined" fullWidth placeholder="Enter Gas Bill Number" name="gas_bill_number" value={form.gas_bill_number} onChange={handleChange} inputProps={{ maxLength: 30 }} />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Gas Bill</CustomFormLabel>
                    {!previews.gas_bill ? (
                      <CompactFileInput id="gas_bill" label="Gas Bill" accept="image/jpeg,image/png" onChange={(e) => handleFileChange(e, 'gas_bill')} />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview src={previews.gas_bill} onRemove={() => handleRemoveFile('gas_bill')} alt="Gas Bill" />
                        <input accept="image/jpeg,image/png" style={{ display: 'none' }} id="replace-gas_bill" type="file" onChange={(e) => handleFileChange(e, 'gas_bill')} />
                        <label htmlFor="replace-gas_bill">
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
                              zIndex: 2,
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
                  <Grid item xs={12} md={3}>
                    {/* Empty or future use */}
                  </Grid>
                </Grid>

                {/* Business Proof Section - Row 5 */}
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel htmlFor="business_number">Business Number</CustomFormLabel>
                    <CustomTextField id="business_number" variant="outlined" fullWidth placeholder="Enter Business Number" name="business_number" value={form.business_number} onChange={handleChange} inputProps={{ maxLength: 30 }} />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Business Proof</CustomFormLabel>
                    {!previews.business_proof ? (
                      <CompactFileInput id="business_proof" label="Business Proof" accept="image/jpeg,image/png,application/pdf" onChange={(e) => handleFileChange(e, 'business_proof')} />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview src={previews.business_proof} onRemove={() => handleRemoveFile('business_proof')} alt="Business Proof" />
                        <input accept="image/jpeg,image/png,application/pdf" style={{ display: 'none' }} id="replace-business_proof" type="file" onChange={(e) => handleFileChange(e, 'business_proof')} />
                        <label htmlFor="replace-business_proof">
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
                              zIndex: 2,
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
                  <Grid item xs={12} md={3}>
                    {/* Empty or future use */}
                  </Grid>
                </Grid>

                {/* GST Section - Row 6 */}
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel htmlFor="gst_number">GST Number</CustomFormLabel>
                    <CustomTextField id="gst_number" variant="outlined" fullWidth placeholder="Enter GST Number" name="gst_number" value={form.gst_number} onChange={handleChange} inputProps={{ maxLength: 30 }} />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>GST Bill</CustomFormLabel>
                    {!previews.gst_bill ? (
                      <CompactFileInput id="gst_bill" label="GST Bill" accept="image/jpeg,image/png,application/pdf" onChange={(e) => handleFileChange(e, 'gst_bill')} />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview src={previews.gst_bill} onRemove={() => handleRemoveFile('gst_bill')} alt="GST Bill" />
                        <input accept="image/jpeg,image/png,application/pdf" style={{ display: 'none' }} id="replace-gst_bill" type="file" onChange={(e) => handleFileChange(e, 'gst_bill')} />
                        <label htmlFor="replace-gst_bill">
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
                              zIndex: 2,
                            }}
                          >
                            <IconUpload size={16} />
                          </IconButton>
                        </label>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} md={3}>
                    {/* Reserved */}
                  </Grid>
                  <Grid item xs={12} md={3}>
                    {/* Reserved */}
                  </Grid>
                </Grid>

                {/* Logo, Banner, Bill Sample, Business Card - Row 7 */}
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Logo</CustomFormLabel>
                    {!previews.logo ? (
                      <CompactFileInput id="logo" label="Logo" accept="image/jpeg,image/png" onChange={(e) => handleFileChange(e, 'logo')} />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview src={previews.logo} onRemove={() => handleRemoveFile('logo')} alt="Logo" />
                        <input accept="image/jpeg,image/png" style={{ display: 'none' }} id="replace-logo" type="file" onChange={(e) => handleFileChange(e, 'logo')} />
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
                              zIndex: 2,
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
                      <CompactFileInput id="banner_image" label="Banner Image" accept="image/jpeg,image/png" onChange={(e) => handleFileChange(e, 'banner_image')} />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview src={previews.banner_image} onRemove={() => handleRemoveFile('banner_image')} alt="Banner" />
                        <input accept="image/jpeg,image/png" style={{ display: 'none' }} id="replace-banner_image" type="file" onChange={(e) => handleFileChange(e, 'banner_image')} />
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
                              zIndex: 2,
                            }}
                          >
                            <IconUpload size={16} />
                          </IconButton>
                        </label>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Bill Sample</CustomFormLabel>
                    {!previews.bill_sample ? (
                      <CompactFileInput id="bill_sample" label="Bill Sample" accept="image/jpeg,image/png" onChange={(e) => handleFileChange(e, 'bill_sample')} />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview src={previews.bill_sample} onRemove={() => handleRemoveFile('bill_sample')} alt="Bill Sample" />
                        <input accept="image/jpeg,image/png" style={{ display: 'none' }} id="replace-bill_sample" type="file" onChange={(e) => handleFileChange(e, 'bill_sample')} />
                        <label htmlFor="replace-bill_sample">
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
                              zIndex: 2,
                            }}
                          >
                            <IconUpload size={16} />
                          </IconButton>
                        </label>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Business Card</CustomFormLabel>
                    {!previews.business_card ? (
                      <CompactFileInput id="business_card" label="Business Card" accept="image/jpeg,image/png,application/pdf" onChange={(e) => handleFileChange(e, 'business_card')} />
                    ) : (
                      <Box sx={{ position: 'relative', mt: 1 }}>
                        <ImagePreview src={previews.business_card} onRemove={() => handleRemoveFile('business_card')} alt="Business Card" />
                        <input accept="image/jpeg,image/png,application/pdf" style={{ display: 'none' }} id="replace-business_card" type="file" onChange={(e) => handleFileChange(e, 'business_card')} />
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
                              zIndex: 2,
                            }}
                          >
                            <IconUpload size={16} />
                          </IconButton>
                        </label>
                      </Box>
                    )}
                  </Grid>

                  {/* Business Images - Multiple Upload */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <CustomFormLabel>Business Images ({(previews.business_images || []).length}/20)</CustomFormLabel>

                      {(previews.business_images || []).length < 20 && (
                        <>
                          <CompactFileInputContainer>
                            <input accept="image/jpeg,image/png" hidden id="business_images" multiple type="file" onChange={handleBusinessImagesChange} />
                            <label htmlFor="business_images" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <IconUpload size={16} />
                              <Typography variant="body2">Choose Files</Typography>
                            </label>
                          </CompactFileInputContainer>
                          <FormHelperText>Max 20 images (JPG, JPEG, PNG only)</FormHelperText>
                        </>
                      )}

                      {(previews.business_images || []).length > 0 && (
                        <Box mt={1.5}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {(previews.business_images || []).length} image{(previews.business_images || []).length !== 1 ? 's' : ''} selected
                          </Typography>

                          <ImagePreviewContainer>
                            {(previews.business_images || []).map((preview, index) => (
                              <PreviewCard key={index} sx={{ position: 'relative' }}>
                                <CardMedia component="img" image={preview} alt={`Business image ${index + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                                <input accept="image/jpeg,image/png" style={{ display: 'none' }} id={`replace-business-image-${index}`} type="file" onChange={(e) => replaceBusinessImage(e, index)} />
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
                                      padding: '4px',
                                    }}
                                  >
                                    <IconUpload size={14} />
                                  </IconButton>
                                </label>

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
                <Grid item xs={12} sm={4} md={3}>
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
                    required
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
                    required
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
                  <CustomSelect id="cityId" name="cityId" value={form.cityId} onChange={handleChange} fullWidth required disabled={!form.stateId}>
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
                  <CustomFormLabel htmlFor="pincode" required>
                    Pincode
                  </CustomFormLabel>
                  <CustomTextField id="pincode" variant="outlined" fullWidth placeholder="Enter Pincode" name="pincode" value={form.pincode} required onChange={handleChange} />
                </Grid>

                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="address">Search Address</CustomFormLabel>
                  <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                    <CustomTextField
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Search for a location"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleGetCurrentLocation}
                              edge="end"
                              color="primary"
                              title="Use my current location"
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                  color: 'white',
                                },
                              }}
                            >
                              <IconCurrentLocation size={20} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Autocomplete>
                </Grid>


                <Grid item xs={12} sm={4}>
                  <CustomFormLabel htmlFor="latitude">Latitude</CustomFormLabel>
                  <CustomTextField id="latitude" variant="outlined" fullWidth placeholder="Enter Latitude" name="latitude" value={form.latitude} onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomFormLabel htmlFor="longitude">Longitude</CustomFormLabel>
                  <CustomTextField id="longitude" variant="outlined" fullWidth placeholder="Enter Longitude" name="longitude" value={form.longitude} onChange={handleChange} />
                </Grid>

                {/* <Grid item xs={12} sm={4}>
                  <CustomFormLabel htmlFor="deliveryRadiusKm">Delivery Radius (KM)</CustomFormLabel>
                  <CustomTextField id="deliveryRadiusKm" type="number" variant="outlined" fullWidth placeholder="e.g., 10" name="deliveryRadiusKm" value={form.deliveryRadiusKm} onChange={handleChange} />
                </Grid> */}
                {/* 
                {form.latitude && form.longitude && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 2 }}>
                      Delivery Area Preview
                    </Typography>
                    <Box
                      sx={{
                        height: 450,
                        width: '100%',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={{
                          lat: parseFloat(form.latitude),
                          lng: parseFloat(form.longitude),
                        }}
                        zoom={14}
                        options={{
                          streetViewControl: false,
                          mapTypeControl: false,
                          zoomControl: true,
                          fullscreenControl: true,
                        }}
                      >
                        <Marker
                          position={{
                            lat: parseFloat(form.latitude),
                            lng: parseFloat(form.longitude),
                          }}
                        />
                        {form.deliveryRadiusKm && parseFloat(form.deliveryRadiusKm) > 0 && (
                          <Circle
                            center={{
                              lat: parseFloat(form.latitude),
                              lng: parseFloat(form.longitude),
                            }}
                            radius={parseFloat(form.deliveryRadiusKm) * 1000}
                            options={{
                              strokeColor: '#FF0000',
                              strokeOpacity: 0.8,
                              strokeWeight: 3,
                              fillColor: '#FF0000',
                              fillOpacity: 0.35,
                              clickable: false,
                              draggable: false,
                            }}
                          />
                        )}
                      </GoogleMap>
                    </Box>
                    <FormHelperText sx={{ mt: 1, fontSize: '0.85rem' }}>{form.deliveryRadiusKm ? `Red circle shows ${form.deliveryRadiusKm} KM delivery radius` : 'Enter delivery radius to see coverage area'}</FormHelperText>
                  </Grid>
                )} */}
              </Grid>
            </ParentCard>

            {/* Banking Details */}
            <ParentCard title="Banking Details">
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="bankName" required>
                    Bank Name
                  </CustomFormLabel>
                  <CustomTextField id="bankName" variant="outlined" fullWidth placeholder="Enter Bank Name" name="bankName" value={form.bankName} required onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="branchName" required>
                    Branch Name
                  </CustomFormLabel>
                  <CustomTextField id="branchName" variant="outlined" fullWidth placeholder="Enter Branch Name" name="branchName" value={form.branchName} required onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="holderName" required>
                    Account Holder Name
                  </CustomFormLabel>
                  <CustomTextField id="holderName" variant="outlined" fullWidth placeholder="Enter Holder Name" name="holderName" value={form.holderName} required onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="accountNumber" required>
                    Account Number
                  </CustomFormLabel>
                  <CustomTextField id="accountNumber" variant="outlined" fullWidth placeholder="Enter Account Number" name="accountNumber" type="number" value={form.accountNumber} required onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="ifsc_code" required>
                    IFSC Code
                  </CustomFormLabel>
                  <CustomTextField id="ifsc_code" variant="outlined" fullWidth placeholder="Enter IFSC Code" name="ifsc_code" value={form.ifsc_code} required onChange={handleChange} />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                  <CustomFormLabel htmlFor="upi" required>
                    UPI ID
                  </CustomFormLabel>
                  <CustomTextField id="upi" variant="outlined" fullWidth placeholder="Enter UPI ID" name="upi" value={form.upi} required onChange={handleChange} />
                </Grid>
              </Grid>
            </ParentCard>

            {/* SEO Settings */}
            <ParentCard title="SEO Settings">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="bio">Bio</CustomFormLabel>
                  <CustomTextField id="bio" name="bio" value={form.bio} onChange={handleChange} placeholder="Professional bio" multiline rows={3} fullWidth />
                </Grid>

                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="metaTitle" required>
                    Meta Title
                  </CustomFormLabel>
                  <CustomTextField id="metaTitle" name="metaTitle" inputProps={{ maxLength: 90 }} value={form.metaTitle} onChange={handleChange} placeholder="Optimized title for search engines (max 90 chars)" fullWidth />
                  <FormHelperText>{form.metaTitle?.length || 0}/90 characters</FormHelperText>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <CustomFormLabel htmlFor="metakeywords" required>
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
                  <CustomTextField id="metaDescription" name="metaDescription" inputProps={{ maxLength: 250 }} value={form.metaDescription} onChange={handleChange} placeholder="Meta description for search results (max 250 chars)" multiline rows={4} fullWidth />
                  <FormHelperText>{form.metaDescription?.length || 0}/250 characters</FormHelperText>
                </Grid>
              </Grid>
            </ParentCard>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button variant="outlined" onClick={() => navigate('/AllprofessionalProviders')}>
                Cancel
              </Button>
              <LoadingButton color="primary" variant="contained" type="submit" loading={loading} sx={{ minWidth: 120 }}>
                Update
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </PageContainer>
    </LoadScript>
  );
};

export default EditProfessionalProvider;


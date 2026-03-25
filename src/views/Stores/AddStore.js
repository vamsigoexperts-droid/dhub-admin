import React, { useState, useEffect, useRef } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { GoogleMap, LoadScript, Marker, Circle, Autocomplete } from '@react-google-maps/api'
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import { IconArrowBackUp, IconX, } from '@tabler/icons-react';

import CloseIcon from '@mui/icons-material/Close';

import { styled } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../Url';
import axios from 'axios';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { CircularProgress, } from '@mui/material';


import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { IconButton } from '@mui/material';

import {
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Divider,
  FormHelperText,
  Chip,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Alert,
  Switch,
  TextField,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Add Store' }];

const toSlug = (text) => {
  return (text || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};


const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const FileInputContainer = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',

}));

const steps = ['Basic Details', 'Business Details', 'Update KYC', 'Bank Details', 'Meta Data'];


const GOOGLE_MAPS_LIBRARIES = ['places'];
const AddStore = () => {
  const [loading, setLoading] = useState(false);


  const [serviceTypes, setServiceTypes] = useState([]);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  // const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);



  const [radiusKm, setRadiusKm] = useState('');
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);
  // const [scriptLoaded, setScriptLoaded] = useState(false);
  const autocompleteRef = useRef(null);
  // Add these 2 lines (~line 80, after useState declarations)
  const mapContainerStyle = { width: '100%', height: '100%' };
  const mapOptions = { zoom: 14, streetViewControl: false, mapTypeControl: false };







  const [form, setForm] = useState({
    serviceId: '',
    name: '',
    slug: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',

    deliveryRadiusKm: '',
    description: '',
    email: '',
    password: '',
    countryId: '',
    stateId: '',
    cityId: '',
    zoneId: '',
    pincode: '',

    city: '',
    state: '',
    country: '',
    area: '',
    street: '',
    streetNumber: '',
    placeId: '',
    placeName: '',
    formattedAddress: '',
    shopOpenOrClose: true,
    personalName: '',
    personalEmail: '',
    personalPhone: '',
    bankName: '',
    branchName: '',
    accountHolderName: '',
    accountNumber: '',
    ifsCode: '',
    upiId: '',
    metaTitle: '',
    metaDescription: '',
    deliveryCharge: '',
    altphone: '',
    pan_number: '',
    aadhar_number: '',
    business_number: '',
    gas_bill_number: '',
    experiance: '',
    dob: '',
    otherrDocumentTitle: '',
    deliveryPincode: [],
    gst_number: '',
  });

  const [workingHours, setWorkingHours] = useState({
    monday: { fromTime: '', toTime: '', isOpen: false },
    tuesday: { fromTime: '', toTime: '', isOpen: false },
    wednesday: { fromTime: '', toTime: '', isOpen: false },
    thursday: { fromTime: '', toTime: '', isOpen: false },
    friday: { fromTime: '', toTime: '', isOpen: false },
    saturday: { fromTime: '', toTime: '', isOpen: false },
    sunday: { fromTime: '', toTime: '', isOpen: false },
  });

  const [files, setFiles] = useState({
    pan_card_front: null,
    pan_card_back: null,
    aadhar_card_front: null,
    aadhar_card_back: null,
    gst_bill: null,
    business_proof: null,
    gas_bill: null,
    business_images: [],
    logo: null,
    banner_image: null,
    bill_sample: null,
    image: null,
    otherrDocumentImage: null,
  });

  const [previews, setPreviews] = useState({
    pan_card_front: null,
    pan_card_back: null,
    aadhar_card_front: null,
    aadhar_card_back: null,
    gst_bill: null,
    business_proof: null,
    gas_bill: null,
    business_images: [],
    logo: null,
    banner_image: null,
    bill_sample: null,
    image: null,
    otherrDocumentImage: null,
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zone, setZone] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [pincodeInput, setPincodeInput] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);



  // Auto-generate slug: storename-city
  useEffect(() => {

    //  console.log('🔍 Slug useEffect triggered');
    // console.log('   slugManuallyEdited:', slugManuallyEdited);
    // console.log('   form.name:', form.name);
    // console.log('   form.cityId:', form.cityId);
    // console.log('   cities length:', cities.length);
    // console.log('   cities:', cities);
    if (!slugManuallyEdited && form.name && form.cityId && cities.length > 0) {

      const cityObj = cities.find(city => city._id === form.cityId);



      const citySlug = cityObj?.name ? toSlug(cityObj.name) : '';
      const storeSlug = toSlug(form.name);

      const generatedSlug = storeSlug && citySlug
        ? `${storeSlug}-${citySlug}`
        : storeSlug;

      setForm(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [form.name, form.cityId, cities, slugManuallyEdited]);


  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setForm(prev => ({
          ...prev,
          address: place.formatted_address,
          latitude: lat.toString(),
          longitude: lng.toString()
        }));
        toast.success('Location selected successfully!');
      } else {
        toast.error('Please select from dropdown');
      }
    }
  };

  // const handleCurrentLocation = () => {
  //   if (!navigator.geolocation) {
  //     toast.error('Geolocation is not supported by your browser');
  //     return;
  //   }

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    setLoadingCurrentLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setForm(prev => ({
              ...prev,
              address: results[0].formatted_address,
              latitude: lat.toString(),
              longitude: lng.toString()
            }));
            toast.success('Current location detected!');
          }
          setLoadingCurrentLocation(false);
        });
      },
      (error) => {
        toast.error('Error getting location');
        setLoadingCurrentLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    setLoadingCurrentLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat, lng };

          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const place = results[0];
              const addressComponents = place.address_components;

              // Extract address components
              let postalCode = '';
              let city = '';
              let state = '';
              let country = '';
              let area = '';
              let streetNumber = '';
              let route = '';

              addressComponents.forEach((component) => {
                const types = component.types;
                if (types.includes('postal_code')) postalCode = component.long_name;
                if (types.includes('locality')) city = component.long_name;
                if (types.includes('administrative_area_level_1')) state = component.long_name;
                if (types.includes('country')) country = component.long_name;
                if (types.includes('sublocality_level_1') || types.includes('sublocality')) area = component.long_name;
                if (types.includes('street_number')) streetNumber = component.long_name;
                if (types.includes('route')) route = component.long_name;
              });

              // Build full address
              let fullAddress;
              if (streetNumber || route || area) {
                fullAddress = `${streetNumber ? streetNumber + ', ' : ''}${route ? route + ', ' : ''}${area}`;
              } else {
                fullAddress = place.formatted_address;
              }

              setForm((prev) => ({
                ...prev,
                address: fullAddress,
                pincode: postalCode,
                latitude: lat.toString(),
                longitude: lng.toString(),
                city: city,
                state: state,
                country: country,
                area: area,
                street: route,
                streetNumber: streetNumber,
                placeId: place.place_id || '',
                placeName: place.name || '',
                formattedAddress: place.formatted_address || fullAddress,
              }));

              toast.success('Current location detected successfully!');
            } else {
              toast.error('Unable to retrieve address for your location');
            }
            setLoadingCurrentLocation(false);
          });
        } catch (error) {
          toast.error('Error fetching location details');
          setLoadingCurrentLocation(false);
        }
      },
      (error) => {
        setLoadingCurrentLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('📍 Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('An unknown error occurred');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };



  useEffect(() => {
    if (window.google) {
      setScriptLoaded(true);
    }
  }, []);

  const onLoad = (autoC) => {
    setAutocomplete(autoC);
    autocompleteRef.current = autoC;
  };

  useEffect(() => {
    if (window.google) {
      setScriptLoaded(true);
    }
  }, []);

  const getToken = () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return '';
      return JSON.parse(user)?.token || '';
    } catch (error) {
      return '';
    }
  };



  const token = getToken();

  // const fetchData = async () => {
  //   if (!token) {
  //     toast.error('Please log in to continue.');
  //     return;
  //   }
  //   try {
  //     const [serviceRes, countriesRes] = await Promise.all([
  //       axios.post(URLS.GetService, {}, { headers: { Authorization: `Bearer ${token}` } }),
  //       axios.post(URLS.GetCountry, {}, { headers: { Authorization: `Bearer ${token}` } }),
  //     ]);
  //     setServiceTypes(serviceRes.data.services || []);
  //     setCountries(countriesRes.data.country || []);
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Failed to fetch data.');
  //   }
  // };




  const fetchData = async () => {
    const token = getToken();
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }
    try {
      const [serviceRes, countriesRes] = await Promise.all([
        axios.post(URLS.GetActiveServices, { searchQuery: '', serviceType: '' }, { headers: { Authorization: `Bearer ${token}` } }),
        axios.post(URLS.GetCountry, {}, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setServiceTypes(serviceRes.data.data || []);
      setCountries(countriesRes.data.country);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch data');
    }
  };


  useEffect(() => {
    fetchData();
  }, [token]);

  const getStates = async (countryId) => {
    try {
      const res = await axios.post(
        URLS.GetCountryByState,
        { country_id: countryId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setStates(res.data.states || []);
    } catch (error) {
      toast.error('Failed to fetch states');
    }
  };

  const getCities = async (stateId) => {
    try {
      const res = await axios.post(
        URLS.GetStateByCitys,
        { state_id: stateId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCities(res.data.cities || []);
    } catch (error) {
      toast.error('Failed to fetch cities');
    }
  };

  const getZones = (cityId) => {
    axios
      .post(
        URLS.GetCityOneByZone,
        { cityId: cityId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setZone(res.data.zones || []))
      .catch(() => toast.error('Failed to fetch zones'));
  };

  useEffect(() => {
    if (selectedCountry) {
      getStates(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      getCities(selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity) {
      getZones(selectedCity);
    }
  }, [selectedCity]);

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  //   const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   // ✅ Real-time validation feedback
  //   switch (name) {
  //     case 'personalEmail':
  //     case 'email':
  //       if (value && !validateEmail(value)) {
  //         e.target.setCustomValidity('Please enter a valid email address');
  //       } else {
  //         e.target.setCustomValidity('');
  //       }
  //       break;

  //     case 'personalPhone':
  //     case 'altphone':
  //     case 'phone':
  //       if (value && !validatePhone(value)) {
  //         e.target.setCustomValidity('Phone must be 10 digits');
  //       } else {
  //         e.target.setCustomValidity('');
  //       }
  //       break;

  //     case 'pannumber':
  //       if (value && !validatePAN(value)) {
  //         e.target.setCustomValidity('Invalid PAN format: ABCDE1234F');
  //       } else {
  //         e.target.setCustomValidity('');
  //       }
  //       break;

  //     case 'aadharnumber':
  //       // Auto-format: remove non-digits and limit to 12
  //       const aadhaar = value.replace(/\D/g, '').slice(0, 12);
  //       setForm({ ...form, [name]: aadhaar });
  //       return;

  //     case 'gstnumber':
  //       if (value && !validateGST(value.toUpperCase())) {
  //         e.target.setCustomValidity('Invalid GST format');
  //       } else {
  //         e.target.setCustomValidity('');
  //       }
  //       break;

  //     case 'ifsCode':
  //       // Auto-uppercase IFSC code
  //       setForm({ ...form, [name]: value.toUpperCase() });
  //       return;

  //     case 'upiId':
  //       if (value && !validateUPI(value)) {
  //         e.target.setCustomValidity('Invalid UPI ID format');
  //       } else {
  //         e.target.setCustomValidity('');
  //       }
  //       break;
  //   }

  //   setForm({ ...form, [name]: value });
  // };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };


  const handleWorkingHoursChange = (day, field, value) => {
    setWorkingHours({
      ...workingHours,
      [day]: {
        ...workingHours[day],
        [field]: value,
      },
    });
  };

  const toggleDayStatus = (day) => {
    setWorkingHours({
      ...workingHours,
      [day]: {
        ...workingHours[day],
        isOpen: !workingHours[day].isOpen,
        fromTime: !workingHours[day].isOpen
          ? (workingHours[day].fromTime || '06:00')
          : '',
        toTime: !workingHours[day].isOpen
          ? (workingHours[day].toTime || '20:00')
          : '',
      },
    });
  };

  const handleRemoveFile = (fieldName) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
    setPreviews((prev) => ({ ...prev, [fieldName]: null }));
    const fileInput = document.getElementById(fieldName);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleBusinessImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const currentFiles = files.business_images || [];

    if (currentFiles.length + selectedFiles.length > 5) {
      toast.error('You can upload a maximum of 5 business images.');
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
    setPreviews((prev) => ({
      ...prev,
      business_images: [...prev.business_images, ...newPreviews],
    }));
  };

  const removeBusinessImage = (index) => {
    const newFiles = [...files.business_images];
    const newPreviews = [...previews.business_images];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setFiles((prev) => ({ ...prev, business_images: newFiles }));
    setPreviews((prev) => ({ ...prev, business_images: newPreviews }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'pdf'].includes(ext)) {
      setFiles({
        ...files,
        [fileType]: file,
      });
      setPreviews({
        ...previews,
        [fileType]: URL.createObjectURL(file),
      });
    } else {
      toast.error('Please upload a JPG, JPEG, PNG, or PDF file.');
      e.target.value = null;
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addDeliveryPincode = () => {
    if (pincodeInput.trim() !== '' && !form.deliveryPincode.includes(pincodeInput.trim())) {
      setForm({
        ...form,
        deliveryPincode: [...form.deliveryPincode, pincodeInput.trim()],
      });
      setPincodeInput('');
    } else if (form.deliveryPincode.includes(pincodeInput.trim())) {
      toast.error('This pincode is already added.');
    }
  };

  const removeDeliveryPincode = (index) => {
    const newPincodes = [...form.deliveryPincode];
    newPincodes.splice(index, 1);
    setForm({ ...form, deliveryPincode: newPincodes });
  };

  const isStepSkipped = (step) => skipped.has(step);

  // const validateCurrentStep = (step) => {
  //   switch (step) {
  //     case 0:
  //       return (
  //         form.personalName &&
  //         form.personalEmail &&
  //         form.personalPhone &&
  //         form.email &&
  //         form.password &&
  //         form.altphone &&
  //         form.experiance &&
  //         form.dob
  //       );
  //     case 1:
  //       return (
  //         form.serviceId &&
  //         form.name &&
  //          form.slug &&
  //         form.phone &&
  //         form.address &&
  //         form.latitude &&
  //         form.longitude &&
  //         form.countryId &&
  //         form.stateId &&
  //         form.cityId &&
  //         form.zoneId
  //       );
  //     case 2:
  //       return true;
  //     case 3:
  //       return (
  //         form.bankName &&
  //         form.branchName &&
  //         form.accountHolderName &&
  //         form.accountNumber &&
  //         form.ifsCode &&
  //         form.upiId
  //       );
  //     case 4:
  //       return form.metaTitle && form.metaDescription;
  //     default:
  //       return true;
  //   }
  // };




  //   const validateCurrentStep = (step) => {
  //   switch (step) {
  //     case 0: // Basic Details
  //       //  fields check
  //       if (!form.personalName || !form.personalEmail || !form.personalPhone || 
  //           !form.email || !form.password || !form.altphone || 
  //           !form.experiance || !form.dob) {
  //         toast.error('Please fill all  fields.');
  //         return false;
  //       }

  //       // ✅ Personal Email validation
  //       if (!validateEmail(form.personalEmail)) {
  //         toast.error('Please enter a valid personal email address.');
  //         return false;
  //       }

  //       // ✅ Account Email validation
  //       if (!validateEmail(form.email)) {
  //         toast.error('Please enter a valid account email address.');
  //         return false;
  //       }

  //       // ✅ Personal Phone validation
  //       if (!validatePhone(form.personalPhone)) {
  //         toast.error('Personal phone must be 10 digits.');
  //         return false;
  //       }

  //       // ✅ Alternate Phone validation
  //       if (!validatePhone(form.altphone)) {
  //         toast.error('Alternate phone must be 10 digits.');
  //         return false;
  //       }

  //       // ✅ Password strength validation
  //       if (form.password.length < 8) {
  //         toast.error('Password must be at least 8 characters long.');
  //         return false;
  //       }

  //       return true;

  //     case 1: // Business Details
  //       if (!form.serviceId || !form.name || !form.slug || !form.phone || 
  //           !form.address || !form.latitude || !form.longitude || 
  //           !form.countryId || !form.stateId || !form.cityId || !form.zoneId) {
  //         toast.error('Please fill all  business details.');
  //         return false;
  //       }

  //       // ✅ Store Phone validation
  //       if (!validatePhone(form.phone)) {
  //         toast.error('Store phone must be 10 digits.');
  //         return false;
  //       }

  //       return true;

  //     case 2: // KYC Details
  //       //  files check
  //       if (!files.logo || !files.bannerimage || !files.pancardfront || 
  //           !files.pancardback || !files.aadharcardfront || !files.aadharcardback || 
  //           !files.gasbill || !files.businessproof || !files.gstbill || !files.billsample) {
  //         toast.error('Please upload all  KYC documents.');
  //         return false;
  //       }

  //       // ✅ Business Images validation
  //       if (!files.businessimages || files.businessimages.length === 0) {
  //         toast.error('Please upload at least one business image.');
  //         return false;
  //       }

  //       // ✅ PAN Number validation (if provided)
  //       if (form.pannumber && !validatePAN(form.pannumber)) {
  //         toast.error('Invalid PAN number format. Format: ABCDE1234F');
  //         return false;
  //       }

  //       // ✅ Aadhaar Number validation (if provided)
  //       if (form.aadharnumber && !validateAadhaar(form.aadharnumber)) {
  //         toast.error('Invalid Aadhaar number. Must be 12 digits.');
  //         return false;
  //       }

  //       // ✅ GST Number validation (if provided)
  //       if (form.gstnumber && !validateGST(form.gstnumber)) {
  //         toast.error('Invalid GST number format. Format: 22AAAAA0000A1Z5');
  //         return false;
  //       }

  //       return true;

  //     case 3: // Bank Details
  //       if (!form.bankName || !form.branchName || !form.accountHolderName || 
  //           !form.accountNumber || !form.ifsCode || !form.upiId) {
  //         toast.error('Please fill all  bank details.');
  //         return false;
  //       }

  //       // ✅ IFSC Code validation
  //       if (!validateIFSC(form.ifsCode)) {
  //         toast.error('Invalid IFSC code format. Format: ABCD0123456');
  //         return false;
  //       }

  //       // ✅ UPI ID validation
  //       if (!validateUPI(form.upiId)) {
  //         toast.error('Invalid UPI ID format. Format: username@bank');
  //         return false;
  //       }

  //       // ✅ Account Number validation (min 9 digits)
  //       if (form.accountNumber.length < 9 || form.accountNumber.length > 18) {
  //         toast.error('Account number must be between 9-18 digits.');
  //         return false;
  //       }

  //       return true;

  //     case 4: // Meta Data
  //       if (!form.metaTitle || !form.metaDescription) {
  //         toast.error('Please fill all  meta fields.');
  //         return false;
  //       }

  //       // ✅ Meta title length check
  //       if (form.metaTitle.length > 90) {
  //         toast.error('Meta title must not exceed 90 characters.');
  //         return false;
  //       }

  //       // ✅ Meta description length check
  //       if (form.metaDescription.length > 250) {
  //         toast.error('Meta description must not exceed 250 characters.');
  //         return false;
  //       }

  //       return true;

  //     default:
  //       return true;
  //   }
  // };



  const validateCurrentStep = (step) => {
    return true; // Always allow progression
  };

  // ✅ Helper function to display time in AM/PM format
  const formatTimeDisplay = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };




  // ✅ Email validation
  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  // ✅ PAN Card validation (Format: ABCDE1234F)
  // const validatePAN = (pan) => {
  //   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  //   return panRegex.test(pan);
  // };

  // ✅ Aadhaar validation (12 digits)
  // const validateAadhaar = (aadhaar) => {
  //   const aadhaarRegex = /^\d{12}$/;
  //   return aadhaarRegex.test(aadhaar);
  // };

  // ✅ GST validation (Format: 22AAAAA0000A1Z5)
  // const validateGST = (gst) => {
  //   const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  //   return gstRegex.test(gst);
  // };

  // ✅ Phone validation (10 digits)
  // const validatePhone = (phone) => {
  //   const phoneRegex = /^\d{10}$/;
  //   return phoneRegex.test(phone);
  // };

  // // ✅ IFSC Code validation (Format: ABCD0123456)
  // const validateIFSC = (ifsc) => {
  //   const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  //   return ifscRegex.test(ifsc);
  // };

  // ✅ UPI ID validation
  // const validateUPI = (upi) => {
  //   const upiRegex = /^[\w.-]+@[\w.-]+$/;
  //   return upiRegex.test(upi);
  // };

  const handleNext = () => {
    if (!validateCurrentStep(activeStep)) {
      toast.error('Please fill all  fields in this step.');
      return;
    }
    if (activeStep === steps.length - 1) {
      handleSubmit();
      return;
    }
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      serviceId: '',
      name: '',
      slug: '',
      phone: '',
      address: '',
      latitude: '',
      longitude: '',

      city: '',
      state: '',
      country: '',
      area: '',
      street: '',
      streetNumber: '',
      placeId: '',
      placeName: '',
      formattedAddress: '',
      description: '',
      email: '',
      password: '',
      countryId: '',
      stateId: '',
      cityId: '',
      zoneId: '',
      pincode: '',
      shopOpenOrClose: true,
      personalName: '',
      personalEmail: '',
      personalPhone: '',
      bankName: '',
      branchName: '',
      accountHolderName: '',
      accountNumber: '',
      ifsCode: '',
      upiId: '',
      metaTitle: '',
      metaDescription: '',
      deliveryCharge: '',
      altphone: '',
      pan_number: '',
      aadhar_number: '',
      business_number: '',
      gas_bill_number: '',
      experiance: '',
      dob: '',
      otherrDocumentTitle: '',
      deliveryPincode: [],
      gst_number: '',
    });
    setWorkingHours({
      monday: { fromTime: '', toTime: '', isOpen: false },
      tuesday: { fromTime: '', toTime: '', isOpen: false },
      wednesday: { fromTime: '', toTime: '', isOpen: false },
      thursday: { fromTime: '', toTime: '', isOpen: false },
      friday: { fromTime: '', toTime: '', isOpen: false },
      saturday: { fromTime: '', toTime: '', isOpen: false },
      sunday: { fromTime: '', toTime: '', isOpen: false },
    });
    setFiles({
      pan_card_front: null,
      pan_card_back: null,
      aadhar_card_front: null,
      aadhar_card_back: null,
      gst_bill: null,
      business_proof: null,
      gas_bill: null,
      business_images: [],
      logo: null,
      banner_image: null,
      bill_sample: null,
      image: null,
      otherrDocumentImage: null,
    });
    setPreviews({
      pan_card_front: null,
      pan_card_back: null,
      aadhar_card_front: null,
      aadhar_card_back: null,
      gst_bill: null,
      business_proof: null,
      gas_bill: null,
      business_images: [],
      logo: null,
      banner_image: null,
      bill_sample: null,
      image: null,
      otherrDocumentImage: null,
    });
    setTags([]);
    setSelectedCountry('');
    setSelectedState('');
    setPincodeInput('');
    setSlugManuallyEdited(false);
  };

  // const handleSubmit = async () => {


  //   const formData = new FormData();

  //   Object.keys(form).forEach((key) => {
  //     if (key === 'deliveryPincode') {
  //       formData.append(key, JSON.stringify(form[key]));
  //     } else {
  //       formData.append(key, form[key]);
  //     }
  //   });

  //   Object.keys(files).forEach((key) => {
  //     if (Array.isArray(files[key])) {
  //       files[key].forEach((file) => formData.append(key, file));
  //     } else if (files[key]) {
  //       formData.append(key, files[key]);
  //     }
  //   });

  //   const workingHoursArray = Object.entries(workingHours)
  //     .filter(([_, hours]) => hours.isOpen && hours.fromTime && hours.toTime)
  //     .map(([day, hours]) => ({
  //       day: day,
  //       fromTime: hours.fromTime,
  //       toTime: hours.toTime,
  //       isOpen: true,
  //     }));
  //   formData.append('workingHours', JSON.stringify(workingHoursArray));

  //   formData.append('metakeywords', tags.join(','));

  //   setLoading(true);
  //   try {
  //     const response = await axios.post(URLS.AddStore, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     toast.success(response.data.message || 'Store added successfully!');
  //     setActiveStep(steps.length);
  //     navigate('/stores');
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Failed to add store.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = async () => {
    // REMOVE THESE LINES (around line 600)



    const formData = new FormData();

    // ✅ This automatically includes ALL location fields
    Object.keys(form).forEach((key) => {
      if (key === 'deliveryPincode') {
        formData.append(key, JSON.stringify(form[key]));
      } else {
        formData.append(key, form[key]);
      }
    });

    // Append files
    Object.keys(files).forEach((key) => {
      if (Array.isArray(files[key])) {
        files[key].forEach((file) => {
          formData.append(key, file);
        });
      } else if (files[key]) {
        formData.append(key, files[key]);
      }
    });


    // Append working hours
    const workingHoursArray = Object.entries(workingHours)
      .filter(([, hours]) => hours.isOpen && hours.fromTime && hours.toTime)
      .map(([day, hours]) => ({
        day: day,
        fromTime: hours.fromTime,
        toTime: hours.toTime,
        isOpen: true,
      }));
    formData.append('workingHours', JSON.stringify(workingHoursArray));

    // Append meta keywords
    formData.append('metakeywords', tags.join(','));

    setLoading(true);
    try {
      const response = await axios.post(URLS.AddStore, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message || 'Store added successfully!');
      setActiveStep(steps.length);
      navigate('/stores');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add store.');
    } finally {
      setLoading(false);
    }
  };


  // const renderWorkingHours = (day) => (
  //   <Box
  //     key={day}
  //     sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
  //   >
  //     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
  //       <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
  //         {day}
  //       </Typography>
  //       <Switch
  //         checked={workingHours[day].isOpen}
  //         onChange={() => toggleDayStatus(day)}
  //         size="small"
  //       />
  //     </Box>
  //     {workingHours[day].isOpen && (
  //       <Grid container spacing={2}>
  //         <Grid item xs={6}>
  //           <CustomTextField
  //             fullWidth
  //             type="time"
  //             label="From"
  //             size="small"
  //             value={workingHours[day].fromTime}
  //             onChange={(e) => handleWorkingHoursChange(day, 'fromTime', e.target.value)}
  //             InputLabelProps={{ shrink: true }}
  //           />
  //         </Grid>
  //         <Grid item xs={6}>
  //           <CustomTextField
  //             fullWidth
  //             type="time"
  //             label="To"
  //             size="small"
  //             value={workingHours[day].toTime}
  //             onChange={(e) => handleWorkingHoursChange(day, 'toTime', e.target.value)}
  //             InputLabelProps={{ shrink: true }}
  //           />
  //         </Grid>
  //       </Grid>
  //     )}
  //   </Box>
  // );


  const renderWorkingHours = (day) => (
    <Box key={day} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
          {day}
        </Typography>
        <Switch
          checked={workingHours[day].isOpen}
          onChange={() => toggleDayStatus(day)}
          size="small"
        />
      </Box>
      {workingHours[day].isOpen && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomTextField
              fullWidth
              type="time"
              label="From"
              size="small"
              value={workingHours[day].fromTime}
              onChange={(e) => handleWorkingHoursChange(day, 'fromTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
            {/* ✅ Display AM/PM below input */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {formatTimeDisplay(workingHours[day].fromTime)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <CustomTextField
              fullWidth
              type="time"
              label="To"
              size="small"
              value={workingHours[day].toTime}
              onChange={(e) => handleWorkingHoursChange(day, 'toTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
            {/* ✅ Display AM/PM below input */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {formatTimeDisplay(workingHours[day].toTime)}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  const handleSteps = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="personalName" >
                  Personal Name
                </CustomFormLabel>
                <CustomTextField
                  id="personalName"
                  name="personalName"
                  value={form.personalName}
                  onChange={handleChange}
                  placeholder="Enter personal name"
                  fullWidth

                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="personalEmail" >
                  Personal Email
                </CustomFormLabel>
                <CustomTextField
                  id="personalEmail"
                  name="personalEmail"
                  type="email"
                  value={form.personalEmail}
                  onChange={handleChange}
                  placeholder="Enter personal email"
                  fullWidth

                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="personalPhone" >
                  Personal Phone
                </CustomFormLabel>
                <CustomTextField
                  id="personalPhone"
                  name="personalPhone"
                  value={form.personalPhone}
                  onChange={handleChange}
                  placeholder="Enter personal phone"
                  fullWidth

                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="altphone" >
                  Alternate Phone
                </CustomFormLabel>
                <CustomTextField
                  id="altphone"
                  name="altphone"
                  value={form.altphone}
                  onChange={handleChange}
                  placeholder="Enter alternate phone"
                  fullWidth

                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="experiance" >
                  Experience (Years)
                </CustomFormLabel>
                <CustomTextField
                  id="experiance"
                  name="experiance"
                  type="number"
                  value={form.experiance}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                  fullWidth

                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="dob" >
                  Date of Birth
                </CustomFormLabel>
                <CustomTextField
                  id="dob"
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth

                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="image">Profile Image</CustomFormLabel>

                {!previews.image ? (
                  // ✅ ORIGINAL STYLING - UNCHANGED
                  <FileInputContainer>
                    <input
                      accept="image/jpeg,image/png"
                      style={{ display: 'none' }}
                      id="image"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'image')}
                    />
                    <label htmlFor="image">
                      <Button variant="outlined" component="span">
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" mt={1}>
                      Upload JPG or PNG
                    </Typography>
                  </FileInputContainer>
                ) : (
                  // ✅ IMAGE PREVIEW with REMOVE ICON OVERLAY
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 100,
                      mt: 2
                    }}
                  >
                    <img
                      src={previews.image}
                      alt="Profile Preview"
                      style={{ height: 100, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    {/* ✅ REMOVE ICON ON IMAGE */}
                    <IconButton
                      onClick={() => handleRemoveFile('image')}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: 'error.dark'
                        }
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Account Credentials
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="email" >
                  Account Email
                </CustomFormLabel>
                <CustomTextField
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter account email"
                  fullWidth

                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="password" >
                  Account Password
                </CustomFormLabel>
                <CustomTextField
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter account password"
                  fullWidth

                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>

              {/* ========== ROW 1: SERVICE, NAME, PHONE, SLUG (4 per row) ========== */}
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="serviceId">Service *</CustomFormLabel>
                <CustomSelect
                  id="serviceId"
                  value={form.serviceId}
                  name="serviceId"
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="" disabled>Select Service</MenuItem>
                  {serviceTypes.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="name">Store Name *</CustomFormLabel>
                <CustomTextField
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter store name"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="phone">Store Phone *</CustomFormLabel>
                <CustomTextField
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter store phone"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="slug">Permalink *</CustomFormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {isEditingSlug ? (
                    <CustomTextField
                      id="slug"
                      name="slug"
                      value={`https://doorstephub.com/${form.slug || ""}`}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/^https?:\/\/(www\.)?doorstephub\.com\/?/i, '');
                        setForm(prev => ({ ...prev, slug: value }));
                      }}
                      placeholder="https://doorstephub.com/storename-city"
                      fullWidth
                      autoFocus
                      inputProps={{ maxLength: 90 }}
                    />
                  ) : (
                    <Box sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1.5,
                      backgroundColor: 'action.hover',
                      minHeight: '40px'
                    }}>
                      <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500, wordBreak: 'break-all' }}>
                        https://doorstephub.com/{form.slug || 'storename-city'}
                      </Typography>
                    </Box>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (isEditingSlug) setSlugManuallyEdited(true);
                      setIsEditingSlug(!isEditingSlug);
                    }}
                    color={isEditingSlug ? "success" : "primary"}
                  >
                    {isEditingSlug ? <CheckIcon /> : <EditIcon />}
                  </IconButton>
                </Box>
                <FormHelperText sx={{ fontSize: '0.75rem' }}>
                  {isEditingSlug ? "Edit URL - click ✓ to save" : "Auto-generated. Click edit to customize."}
                </FormHelperText>
              </Grid>

              {/* ========== ROW 2: DESCRIPTION (Full width) ========== */}
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="description">Description</CustomFormLabel>
                <CustomTextField
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter store description"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>




              {/* ========== ROW 4: LOCATION SEARCH, LAT, LNG, RADIUS (4 per row) ========== */}
              <Grid item xs={12} md={3}>
                <CustomFormLabel htmlFor="address-search">Search Location *</CustomFormLabel>
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                  <TextField
                    id="address-search"
                    fullWidth
                    placeholder="Search address"

                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={handleCurrentLocation}
                          disabled={loadingCurrentLocation}
                          color="primary"
                          title="Use my current location"
                          size="small"
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 1
                          }}
                        >
                          {loadingCurrentLocation ? (
                            <CircularProgress size={18} />
                          ) : (
                            <MyLocationIcon fontSize="small" />
                          )}
                        </IconButton>
                      )
                    }}
                  />
                </Autocomplete>

              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <CustomFormLabel htmlFor="latitude">Latitude</CustomFormLabel>
                <CustomTextField
                  id="latitude"
                  name="latitude"
                  type="number"
                  value={form.latitude}
                  placeholder="Auto-filled"
                  fullWidth

                  inputProps={{ step: 'any' }}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <CustomFormLabel htmlFor="longitude">Longitude</CustomFormLabel>
                <CustomTextField
                  id="longitude"
                  name="longitude"
                  type="number"
                  value={form.longitude}
                  placeholder="Auto-filled"
                  fullWidth

                  inputProps={{ step: 'any' }}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <CustomFormLabel>Delivery Radius (KM) *</CustomFormLabel>
                <CustomTextField
                  type="number"
                  value={radiusKm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRadiusKm(value);
                    setForm(prev => ({ ...prev, deliveryRadiusKm: value }));
                  }}
                  placeholder="e.g., 5"
                  fullWidth

                  inputProps={{ min: 0.1, max: 50, step: 0.1 }}
                />
                <FormHelperText sx={{ fontSize: '0.7rem' }}>Select the Area preview </FormHelperText>
              </Grid>

              {/* ========== ROW 5: FULL WIDTH MAP VIEW ========== */}
              {form.latitude && form.longitude && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 2 }}>
                    Delivery Area Preview
                  </Typography>
                  <Box sx={{
                    height: 450,
                    width: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 3,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={{
                        lat: parseFloat(form.latitude),
                        lng: parseFloat(form.longitude)
                      }}
                      zoom={14}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        zoomControl: true,
                        fullscreenControl: true
                      }}
                    >
                      <Marker
                        position={{
                          lat: parseFloat(form.latitude),
                          lng: parseFloat(form.longitude)
                        }}
                      />
                      {radiusKm && parseFloat(radiusKm) > 0 && (
                        <Circle
                          center={{
                            lat: parseFloat(form.latitude),
                            lng: parseFloat(form.longitude)
                          }}
                          radius={parseFloat(radiusKm) * 1000}
                          options={{
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 3,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35,
                            clickable: false,
                            draggable: false
                          }}
                        />
                      )}
                    </GoogleMap>
                  </Box>
                </Grid>
              )}

              {/* ========== ROW 6: FULL ADDRESS (Full width) ========== */}
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="address">Full Address *</CustomFormLabel>
                <CustomTextField
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Full store address"
                  multiline
                  rows={2}
                  fullWidth
                />
              </Grid>

              {/* ========== ROW 7: COUNTRY, STATE, CITY, PINCODE (4 per row) ========== */}
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="countryId">Country *</CustomFormLabel>
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
                  <MenuItem value="" disabled>Select Country</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country._id} value={country._id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="stateId">State *</CustomFormLabel>
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
                  <MenuItem value="" disabled>Select State</MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state._id} value={state._id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="cityId">City *</CustomFormLabel>
                <CustomSelect
                  id="cityId"
                  name="cityId"
                  value={form.cityId}
                  onChange={(e) => {
                    const cityId = e.target.value;
                    setSelectedCity(cityId);
                    setForm({ ...form, cityId, zoneId: '' });
                  }}
                  fullWidth
                  disabled={!form.stateId}
                >
                  <MenuItem value="" disabled>Select City</MenuItem>
                  {cities.map((city) => (
                    <MenuItem key={city._id} value={city._id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="pincode">Pincode *</CustomFormLabel>
                <CustomTextField
                  id="pincode"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  fullWidth
                  inputProps={{ minLength: 4, maxLength: 8 }}
                />
              </Grid>

              {/* ========== ROW 8: DELIVERY CHARGE, PINCODES (flexible) ========== */}
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="deliveryCharge">Delivery Charge *</CustomFormLabel>
                <CustomTextField
                  id="deliveryCharge"
                  name="deliveryCharge"
                  type="number"
                  value={form.deliveryCharge}
                  onChange={handleChange}
                  placeholder="Enter charge"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={9}>
                <CustomFormLabel>Delivery Pincodes</CustomFormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                  <TextField
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value)}
                    placeholder="Enter delivery pincode"
                    size="small"
                    sx={{ flexGrow: 1, maxWidth: 300 }}
                  />
                  <Button variant="outlined" onClick={addDeliveryPincode} size="small">
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {form.deliveryPincode.map((pincode, index) => (
                    <Chip
                      key={index}
                      label={pincode}
                      onDelete={() => removeDeliveryPincode(index)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>

              {/* ========== ROW 9: SHOP OPEN/CLOSE TOGGLE ========== */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.shopOpenOrClose}
                      onChange={(e) => {
                        const isOpen = e.target.checked;
                        setForm({ ...form, shopOpenOrClose: isOpen });
                        if (isOpen) {
                          const defaultTimes = { fromTime: '06:00', toTime: '21:00', isOpen: true };
                          setWorkingHours({
                            monday: { ...defaultTimes },
                            tuesday: { ...defaultTimes },
                            wednesday: { ...defaultTimes },
                            thursday: { ...defaultTimes },
                            friday: { ...defaultTimes },
                            saturday: { ...defaultTimes },
                            sunday: { ...defaultTimes }
                          });
                        } else {
                          setWorkingHours({
                            monday: { fromTime: '', toTime: '', isOpen: false },
                            tuesday: { fromTime: '', toTime: '', isOpen: false },
                            wednesday: { fromTime: '', toTime: '', isOpen: false },
                            thursday: { fromTime: '', toTime: '', isOpen: false },
                            friday: { fromTime: '', toTime: '', isOpen: false },
                            saturday: { fromTime: '', toTime: '', isOpen: false },
                            sunday: { fromTime: '', toTime: '', isOpen: false }
                          });
                        }
                      }}
                    />
                  }
                  label="Shop Open/Close Status"
                />
              </Grid>

              {/* ========== ROW 10: WORKING HOURS ========== */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Working Hours
                </Typography>
                <Grid container spacing={2}>
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <Grid item xs={12} md={6} lg={4} key={day}>
                      {renderWorkingHours(day)}
                    </Grid>
                  ))}
                </Grid>
              </Grid>

            </Grid>
          </Box>
        );

      case 2:
        // return (
        //   <Box sx={{ p: 2 }}>
        //     <Grid container spacing={3}>
        //       <Grid item xs={12} sm={6}>
        //         <CustomFormLabel htmlFor="logo" >
        //           Logo
        //         </CustomFormLabel>
        //         <FileInputContainer>
        //           <input
        //             accept="image/jpeg,image/png"
        //             style={{ display: 'none' }}
        //             id="logo"
        //             type="file"
        //             onChange={(e) => handleFileChange(e, 'logo')}
        //           />
        //           <label htmlFor="logo">
        //             <Button variant="outlined" component="span">
        //               Choose File
        //             </Button>
        //           </label>
        //           <Typography variant="caption" display="block" mt={1}>
        //             Upload JPG or PNG
        //           </Typography>
        //         </FileInputContainer>
        //         {previews.logo && (
        //           <Box mt={2}>
        //             <img src={previews.logo} alt="Logo Preview" style={{ height: 100 }} />
        //             <Button onClick={() => handleRemoveFile('logo')}>Remove</Button>
        //           </Box>
        //         )}
        //       </Grid>
        //       <Grid item xs={12} sm={6}>
        //         <CustomFormLabel htmlFor="banner_image" >
        //           Banner Image
        //         </CustomFormLabel>
        //         <FileInputContainer>
        //           <input
        //             accept="image/jpeg,image/png"
        //             style={{ display: 'none' }}
        //             id="banner_image"
        //             type="file"
        //             onChange={(e) => handleFileChange(e, 'banner_image')}
        //           />
        //           <label htmlFor="banner_image">
        //             <Button variant="outlined" component="span">
        //               Choose File
        //             </Button>
        //           </label>
        //           <Typography variant="caption" display="block" mt={1}>
        //             Upload JPG or PNG
        //           </Typography>
        //         </FileInputContainer>
        //         {previews.banner_image && (
        //           <Box mt={2}>
        //             <img src={previews.banner_image} alt="Banner Preview" style={{ height: 100 }} />
        //             <Button onClick={() => handleRemoveFile('banner_image')}>Remove</Button>
        //           </Box>
        //         )}
        //       </Grid>
        //       <Grid item xs={12} sm={4}>
        //         <CustomFormLabel htmlFor="pan_number">
        //           PAN Number / Driving License Number
        //         </CustomFormLabel>
        //         <CustomTextField
        //           id="pan_number"
        //           name="pan_number"
        //           value={form.pan_number}
        //           onChange={handleChange}
        //           placeholder="Enter PAN Number or Driving License Number"
        //           fullWidth
        //           inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 10 }}
        //         />
        //       </Grid>
        //       <Grid item xs={12} sm={4}>
        //         <CustomFormLabel htmlFor="pan_card_front" >
        //           PAN Card / Driving Licence Front
        //         </CustomFormLabel>
        //         <FileInputContainer>
        //           <input
        //             accept="image/jpeg,image/png,application/pdf"
        //             style={{ display: 'none' }}
        //             id="pan_card_front"
        //             type="file"
        //             onChange={(e) => handleFileChange(e, 'pan_card_front')}
        //           />
        //           <label htmlFor="pan_card_front">
        //             <Button variant="outlined" component="span">
        //               Choose File
        //             </Button>
        //           </label>
        //           <Typography variant="caption" display="block" mt={1}>
        //             Upload JPG, PNG, or PDF
        //           </Typography>
        //         </FileInputContainer>
        //         {previews.pan_card_front && (
        //           <Box mt={2}>
        //             <img
        //               src={previews.pan_card_front}
        //               alt="PAN Front Preview"
        //               style={{ height: 100 }}
        //             />
        //             <Button onClick={() => handleRemoveFile('pan_card_front')}>Remove</Button>
        //           </Box>
        //         )}
        //       </Grid>
        //       <Grid item xs={12} sm={4}>
        //         <CustomFormLabel htmlFor="pan_card_back" >
        //           PAN Card / Driving Licence Back
        //         </CustomFormLabel>
        //         <FileInputContainer>
        //           <input
        //             accept="image/jpeg,image/png,application/pdf"
        //             style={{ display: 'none' }}
        //             id="pan_card_back"
        //             type="file"
        //             onChange={(e) => handleFileChange(e, 'pan_card_back')}
        //           />
        //           <label htmlFor="pan_card_back">
        //             <Button variant="outlined" component="span">
        //               Choose File
        //             </Button>
        //           </label>
        //           <Typography variant="caption" display="block" mt={1}>
        //             Upload JPG, PNG, or PDF
        //           </Typography>
        //         </FileInputContainer>
        //         {previews.pan_card_back && (
        //           <Box mt={2}>
        //             <img
        //               src={previews.pan_card_back}
        //               alt="PAN Back Preview"
        //               style={{ height: 100 }}
        //             />
        //             <Button onClick={() => handleRemoveFile('pan_card_back')}>Remove</Button>
        //           </Box>
        //         )}
        //       </Grid>
        //       <Grid item xs={12} sm={4}>
        //         <CustomFormLabel htmlFor="aadhar_number">Aadhaar Number</CustomFormLabel>
        //         <CustomTextField
        //           id="aadhar_number"
        //           name="aadhar_number"
        //           value={form.aadhar_number}
        //           onChange={handleChange}
        //           placeholder="Enter Aadhaar Number"
        //           fullWidth
        //           inputProps={{ maxLength: 12 }}
        //         />
        //       </Grid>
        //       <Grid item xs={12} sm={4}>
        //         <CustomFormLabel htmlFor="aadhar_card_front" >
        //           Aadhar Card Image Front
        //         </CustomFormLabel>
        //         <FileInputContainer>
        //           <input
        //             accept="image/jpeg,image/png,application/pdf"
        //             style={{ display: 'none' }}
        //             id="aadhar_card_front"
        //             type="file"
        //             onChange={(e) => handleFileChange(e, 'aadhar_card_front')}
        //           />
        //           <label htmlFor="aadhar_card_front">
        //             <Button variant="outlined" component="span">
        //               Choose File
        //             </Button>
        //           </label>
        //           <Typography variant="caption" display="block" mt={1}>
        //             Upload JPG, PNG, or PDF
        //           </Typography>
        //         </FileInputContainer>
        //         {previews.aadhar_card_front && (
        //           <Box mt={2}>
        //             <img
        //               src={previews.aadhar_card_front}
        //               alt="Aadhar Front Preview"
        //               style={{ height: 100 }}
        //             />
        //             <Button onClick={() => handleRemoveFile('aadhar_card_front')}>Remove</Button>
        //           </Box>
        //         )}
        //       </Grid>
        //       <Grid item xs={12} sm={4}>
        //         <CustomFormLabel htmlFor="aadhar_card_back" >
        //           Aadhar Card Image Back
        //         </CustomFormLabel>
        //         <FileInputContainer>
        //           <input
        //             accept="image/jpeg,image/png,application/pdf"
        //             style={{ display: 'none' }}
        //             id="aadhar_card_back"
        //             type="file"
        //             onChange={(e) => handleFileChange(e, 'aadhar_card_back')}
        //           />
        //           <label htmlFor="aadhar_card_back">
        //             <Button variant="outlined" component="span">
        //               Choose File
        //             </Button>
        //           </label>
        //           <Typography variant="caption" display="block" mt={1}>
        //             Upload JPG, PNG, or PDF
        //           </Typography>
        //         </FileInputContainer>
        //         {previews.aadhar_card_back && (
        //           <Box mt={2}>
        //             <img
        //               src={previews.aadhar_card_back}
        //               alt="Aadhar Back Preview"
        //               style={{ height: 100 }}
        //             />
        //             <Button onClick={() => handleRemoveFile('aadhar_card_back')}>Remove</Button>
        //           </Box>
        //         )}
        //       </Grid>
        //       <Grid item xs={12} sm={6}>
        //         <CustomFormLabel htmlFor="gas_bill_number">
        //           Gas Bill Number / Passport Number
        //         </CustomFormLabel>
        //         <CustomTextField
        //           id="gas_bill_number"
        //           name="gas_bill_number"
        //           value={form.gas_bill_number}
        //           onChange={handleChange}
        //           placeholder="Enter Gas Bill Number or Passport Number"
        //           fullWidth
        //         />
        //       </Grid>
        //       <Grid item xs={12} sm={6}>
        //         <CustomFormLabel htmlFor="gas_bill" >
        //           Gas Bill / Passport
        //         </CustomFormLabel>
        //         <FileInputContainer>
        //           <input
        //             accept="image/jpeg,image/png,application/pdf"
        //             style={{ display: 'none' }}
        //             id="gas_bill"
        //             type="file"
        //             onChange={(e) => handleFileChange(e, 'gas_bill')}
        //           />
        //           <label htmlFor="gas_bill">
        //             <Button variant="outlined" component="span">
        //               Choose File
        //             </Button>
        //           </label>
        //           <Typography variant="caption" display="block" mt={1}>
        //             Upload JPG, PNG, or PDF
        //           </Typography>
        //         </FileInputContainer>
        //         {previews.gas_bill && (
        //           <Box mt={2}>
        //             <img src={previews.gas_bill} alt="Gas Bill Preview" style={{ height: 100 }} />
        //             <Button onClick={() => handleRemoveFile('gas_bill')}>Remove</Button>
        //           </Box>
        //         )}
        //       </Grid>
        //       <Grid item xs={12} sm={6}>
        //         <CustomFormLabel htmlFor="business_number">
        //           Business Id Proof / Labour Licence Number
        //         </CustomFormLabel>
        //         <CustomTextField
        //           id="business_number"
        //           name="business_number"
        //           value={form.business_number}
        //           onChange={handleChange}
        //           placeholder="Enter Business Id Proof / Labour Licence Number"
        //           fullWidth
        //         />
        //       </Grid>
        //       <Grid item xs={12} sm={6}>
        //         <CustomFormLabel htmlFor="business_proof" >
        //           Business Id Proof / Labour Licence
        //         </CustomFormLabel>
        //         <FileInputContainer>
        //           <input
        //             accept="image/jpeg,image/png,application/pdf"
        //             style={{ display: 'none' }}
        //             id="business_proof"
        //             type="file"
        //             onChange={(e) => handleFileChange(e, 'business_proof')}
        //           />
        //           <label htmlFor="business_proof">
        //             <Button variant="outlined" component="span">
        //               Choose File
        //             </Button>
        //           </label>
        //           <Typography variant="caption" display="block" mt={1}>
        //             Upload JPG, PNG, or PDF
        //           </Typography>
        //         </FileInputContainer>
        //         {previews.business_proof && (
        //           <Box mt={2}>
        //             <img
        //               src={previews.business_proof}
        //               alt="Business Proof Preview"
        //               style={{ height: 100 }}
        //             />
        //             <Button onClick={() => handleRemoveFile('business_proof')}>Remove</Button>
        //           </Box>
        //         )}
        //       </Grid>
        //       <Grid item xs={12} sm={6}>
        //         <CustomFormLabel htmlFor="gst_number">GST Number</CustomFormLabel>
        //         <CustomTextField
        //           id="gst_number"
        //           name="gst_number"
        //           value={form.gst_number}
        //           onChange={handleChange}
        //           placeholder="Enter GST Number"
        //           fullWidth
        //            inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 15 }}
        //         />
        //       </Grid>
        //       <Grid item xs={12} sm={6}>
        //         <CustomFormLabel htmlFor="gst_bill" >
        //           GST Proof
        //         </CustomFormLabel>
        //         <FileInputContainer>
        //           <input
        //             accept="image/jpeg,image/png,application/pdf"
        //             style={{ display: 'none' }}
        //             id="gst_bill"
        //             type="file"
        //             onChange={(e) => handleFileChange(e, 'gst_bill')}
        //           />
        //           <label htmlFor="gst_bill">
        //             <Button variant="outlined" component="span">
        //               Choose File
        //             </Button>
        //           </label>
        //           <Typography variant="caption" display="block" mt={1}>
        //             Upload JPG, PNG, or PDF
        //           </Typography>
        //         </FileInputContainer>
        //         {previews.gst_bill && (
        //           <Box mt={2}>
        //             <img src={previews.gst_bill} alt="GST Bill Preview" style={{ height: 100 }} />
        //             <Button onClick={() => handleRemoveFile('gst_bill')}>Remove</Button>
        //           </Box>
        //         )}
        //       </Grid>
        //       <Grid item xs={12} sm={6}>
        //         <CustomFormLabel htmlFor="bill_sample" >
        //           Customer Bill Copy (Sample)
        //         </CustomFormLabel>
        //         <FileInputContainer>
        //           <input
        //             accept="image/jpeg,image/png"
        //             style={{ display: 'none' }}
        //             id="bill_sample"
        //             type="file"
        //             onChange={(e) => handleFileChange(e, 'bill_sample')}
        //           />
        //           <label htmlFor="bill_sample">
        //             <Button variant="outlined" component="span">
        //               Choose File
        //             </Button>
        //           </label>
        //           <Typography variant="caption" display="block" mt={1}>
        //             Upload JPG or PNG
        //           </Typography>
        //         </FileInputContainer>
        //         {previews.bill_sample && (
        //           <Box mt={2}>
        //             <img
        //               src={previews.bill_sample}
        //               alt="Bill Sample Preview"
        //               style={{ height: 100 }}
        //             />
        //             <Button onClick={() => handleRemoveFile('bill_sample')}>Remove</Button>
        //           </Box>
        //         )}
        //       </Grid>
        //       <Grid item xs={12} sm={6}>
        //         <CustomFormLabel htmlFor="business_images" >
        //           Business Images (Max 5)
        //         </CustomFormLabel>
        //         <FileInputContainer>
        //           <input
        //             accept="image/jpeg,image/png"
        //             style={{ display: 'none' }}
        //             id="business_images"
        //             multiple
        //             type="file"
        //             onChange={handleBusinessImagesChange}
        //           />
        //           <label htmlFor="business_images">
        //             <Button variant="outlined" component="span">
        //               Choose Files
        //             </Button>
        //           </label>
        //           <Typography variant="caption" display="block" mt={1}>
        //             Upload JPG or PNG (Max 5)
        //           </Typography>
        //         </FileInputContainer>
        //         <FormHelperText>
        //           You can upload up to 5 business images (JPG, JPEG, PNG only)
        //         </FormHelperText>
        //         {previews.business_images.length > 0 && (
        //           <Box mt={2}>
        //             {previews.business_images.map((preview, index) => (
        //               <Box key={index}>
        //                 <img src={preview} alt={`Business ${index + 1}`} style={{ height: 100 }} />
        //                 <Button onClick={() => removeBusinessImage(index)}>Remove</Button>
        //               </Box>
        //             ))}
        //           </Box>
        //         )}
        //       </Grid>
        //       <Grid item xs={12} sm={6}>
        //         <CustomFormLabel htmlFor="otherrDocumentTitle">
        //           Other Document Title
        //         </CustomFormLabel>
        //         <CustomTextField
        //           id="otherrDocumentTitle"
        //           name="otherrDocumentTitle"
        //           value={form.otherrDocumentTitle}
        //           onChange={handleChange}
        //           placeholder="Enter other document title"
        //           fullWidth
        //         />
        //       </Grid>
        //       <Grid item xs={12} sm={6}>
        //         <CustomFormLabel htmlFor="otherrDocumentImage">
        //           Other Document Image
        //         </CustomFormLabel>
        //         <FileInputContainer>
        //           <input
        //             accept="image/jpeg,image/png,application/pdf"
        //             style={{ display: 'none' }}
        //             id="otherrDocumentImage"
        //             type="file"
        //             onChange={(e) => handleFileChange(e, 'otherrDocumentImage')}
        //           />
        //           <label htmlFor="otherrDocumentImage">
        //             <Button variant="outlined" component="span">
        //               Choose File
        //             </Button>
        //           </label>
        //           <Typography variant="caption" display="block" mt={1}>
        //             Upload JPG, PNG, or PDF
        //           </Typography>
        //         </FileInputContainer>
        //         {previews.otherrDocumentImage && (
        //           <Box mt={2}>
        //             <img
        //               src={previews.otherrDocumentImage}
        //               alt="Other Document Preview"
        //               style={{ height: 100 }}
        //             />
        //             <Button onClick={() => handleRemoveFile('otherrDocumentImage')}>Remove</Button>
        //           </Box>
        //         )}
        //       </Grid>
        //     </Grid>
        //   </Box>
        // );
        return (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              {/* Logo -  */}
              <Grid item xs={12} sm={6} md={6}>
                <CustomFormLabel htmlFor="logo">Logo</CustomFormLabel>

                {!previews.logo ? (
                  <FileInputContainer>
                    <input
                      accept="image/jpeg,image/png"
                      style={{ display: 'none' }}
                      id="logo"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'logo')}
                    />
                    <label htmlFor="logo">
                      <Button variant="outlined" component="span">
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" mt={1}>
                      Upload JPG or PNG
                    </Typography>
                  </FileInputContainer>
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: 100, mt: 2 }}>
                    <img
                      src={previews.logo}
                      alt="Logo Preview"
                      style={{ height: 100, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <IconButton
                      onClick={() => handleRemoveFile('logo')}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        padding: '4px',

                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>


              {/* Banner Image -  */}
              <Grid item xs={12} sm={6} md={6}>
                <CustomFormLabel>Banner Image</CustomFormLabel>

                {!previews.banner_image ? (
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="banner_image"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'banner_image')}
                    />

                    <label htmlFor="banner_image">
                      <Button variant="outlined" component="span">
                        Choose Image
                      </Button>
                    </label>

                    <Typography variant="caption" display="block" mt={1}>
                      Upload any image format
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: 120, mt: 2 }}>
                    <img
                      src={previews.banner_image}
                      alt="Banner Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 6,
                      }}
                    />

                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile('banner_image')}
                      sx={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              {/* PAN Number -  */}
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="pan_number" >
                  PAN Number / Driving License Number
                </CustomFormLabel>
                <CustomTextField
                  id="pan_number"
                  name="pan_number"
                  value={form.pan_number}
                  onChange={handleChange}
                  placeholder="Enter PAN Number (e.g., ABCDE1234F)"
                  fullWidth

                  inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 10 }}
                />
              </Grid>

              {/* PAN Card Front -  */}
              <Grid item xs={12} sm={4}>
                <CustomFormLabel htmlFor="pan_card_front">
                  PAN Card / Driving Licence Front
                </CustomFormLabel>

                {!previews.pan_card_front ? (
                  <FileInputContainer>
                    <input
                      accept="image/jpeg,image/png,application/pdf"
                      style={{ display: 'none' }}
                      id="pan_card_front"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'pan_card_front')}
                    />
                    <label htmlFor="pan_card_front">
                      <Button variant="outlined" component="span">
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" mt={1}>
                      Upload JPG, PNG, or PDF
                    </Typography>
                  </FileInputContainer>
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: 100, mt: 2 }}>
                    <img
                      src={previews.pan_card_front}
                      alt="PAN Front Preview"
                      style={{ height: 100, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <IconButton
                      onClick={() => handleRemoveFile('pan_card_front')}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        padding: '4px',

                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>


              {/* PAN Card Back */}
              <Grid item xs={12} sm={4}>
                <CustomFormLabel htmlFor="pan_card_back">
                  PAN Card / Driving Licence Back
                </CustomFormLabel>

                {!previews.pan_card_back ? (
                  <FileInputContainer>
                    <input
                      accept="image/jpeg,image/png,application/pdf"
                      style={{ display: 'none' }}
                      id="pan_card_back"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'pan_card_back')}
                    />
                    <label htmlFor="pan_card_back">
                      <Button variant="outlined" component="span">
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" mt={1}>
                      Upload JPG, PNG, or PDF
                    </Typography>
                  </FileInputContainer>
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: 100, mt: 2 }}>
                    <img
                      src={previews.pan_card_back}
                      alt="PAN Back Preview"
                      style={{ height: 100, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <IconButton
                      onClick={() => handleRemoveFile('pan_card_back')}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: 'error.dark'
                        }
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>


              {/* Aadhaar Number - Text Field (No Change) */}
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="aadhar_number">
                  Aadhaar Number
                </CustomFormLabel>
                <CustomTextField
                  id="aadhar_number"
                  name="aadhar_number"
                  value={form.aadhar_number}
                  onChange={handleChange}
                  placeholder="Enter Aadhaar Number (12 digits)"
                  fullWidth
                  inputProps={{ maxLength: 12 }}
                />
              </Grid>


              {/* Aadhaar Card Front */}
              <Grid item xs={12} sm={4}>
                <CustomFormLabel htmlFor="aadhar_card_front">
                  Aadhar Card Image Front
                </CustomFormLabel>

                {!previews.aadhar_card_front ? (
                  <FileInputContainer>
                    <input
                      accept="image/jpeg,image/png,application/pdf"
                      style={{ display: 'none' }}
                      id="aadhar_card_front"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'aadhar_card_front')}
                    />
                    <label htmlFor="aadhar_card_front">
                      <Button variant="outlined" component="span">
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" mt={1}>
                      Upload JPG, PNG, or PDF
                    </Typography>
                  </FileInputContainer>
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: 100, mt: 2 }}>
                    <img
                      src={previews.aadhar_card_front}
                      alt="Aadhar Front Preview"
                      style={{ height: 100, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <IconButton
                      onClick={() => handleRemoveFile('aadhar_card_front')}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: 'error.dark'
                        }
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>


              {/* Aadhaar Card Back */}
              <Grid item xs={12} sm={4}>
                <CustomFormLabel htmlFor="aadhar_card_back">
                  Aadhar Card Image Back
                </CustomFormLabel>

                {!previews.aadhar_card_back ? (
                  <FileInputContainer>
                    <input
                      accept="image/jpeg,image/png,application/pdf"
                      style={{ display: 'none' }}
                      id="aadhar_card_back"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'aadhar_card_back')}
                    />
                    <label htmlFor="aadhar_card_back">
                      <Button variant="outlined" component="span">
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" mt={1}>
                      Upload JPG, PNG, or PDF
                    </Typography>
                  </FileInputContainer>
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: 100, mt: 2 }}>
                    <img
                      src={previews.aadhar_card_back}
                      alt="Aadhar Back Preview"
                      style={{ height: 100, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <IconButton
                      onClick={() => handleRemoveFile('aadhar_card_back')}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: 'error.dark'
                        }
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>


              {/* Gas Bill Number -  */}
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="gas_bill_number" >
                  Gas Bill Number / Passport Number
                </CustomFormLabel>
                <CustomTextField
                  id="gas_bill_number"
                  name="gas_bill_number"
                  value={form.gas_bill_number}
                  onChange={handleChange}
                  placeholder="Enter Gas Bill Number or Passport Number"
                  fullWidth

                />
              </Grid>

              {/* Gas Bill Upload -  */}
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="gas_bill">
                  Gas Bill / Passport
                </CustomFormLabel>

                {!previews.gas_bill ? (
                  <FileInputContainer>
                    <input
                      accept="image/jpeg,image/png,application/pdf"
                      style={{ display: 'none' }}
                      id="gas_bill"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'gas_bill')}
                    />
                    <label htmlFor="gas_bill">
                      <Button variant="outlined" component="span">
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" mt={1}>
                      Upload JPG, PNG, or PDF
                    </Typography>
                  </FileInputContainer>
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: 100, mt: 2 }}>
                    <img
                      src={previews.gas_bill}
                      alt="Gas Bill Preview"
                      style={{ height: 100, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <IconButton
                      onClick={() => handleRemoveFile('gas_bill')}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: 'error.dark'
                        }
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>


              {/* Business Number -  */}
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="business_number" >
                  Business Id Proof / Labour Licence Number
                </CustomFormLabel>
                <CustomTextField
                  id="business_number"
                  name="business_number"
                  value={form.business_number}
                  onChange={handleChange}
                  placeholder="Enter Business Id Proof / Labour Licence Number"
                  fullWidth

                />
              </Grid>

              {/* Business Proof Upload -  */}
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="business_proof">
                  Business Id Proof / Labour Licence
                </CustomFormLabel>

                {!previews.business_proof ? (
                  <FileInputContainer>
                    <input
                      accept="image/jpeg,image/png,application/pdf"
                      style={{ display: 'none' }}
                      id="business_proof"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'business_proof')}
                    />
                    <label htmlFor="business_proof">
                      <Button variant="outlined" component="span">
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" mt={1}>
                      Upload JPG, PNG, or PDF
                    </Typography>
                  </FileInputContainer>
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: 100, mt: 2 }}>
                    <img
                      src={previews.business_proof}
                      alt="Business Proof Preview"
                      style={{ height: 100, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <IconButton
                      onClick={() => handleRemoveFile('business_proof')}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: 'error.dark'
                        }
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>


              {/* GST Number -  */}
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="gst_number" >
                  GST Number
                </CustomFormLabel>
                <CustomTextField
                  id="gst_number"
                  name="gst_number"
                  value={form.gst_number}
                  onChange={handleChange}
                  placeholder="Enter GST Number (15 characters)"
                  fullWidth

                  inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 15 }}
                />
              </Grid>

              {/* GST Proof -  */}
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="gst_bill">
                  GST Proof
                </CustomFormLabel>

                {!previews.gst_bill ? (
                  <FileInputContainer>
                    <input
                      accept="image/jpeg,image/png,application/pdf"
                      style={{ display: 'none' }}
                      id="gst_bill"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'gst_bill')}
                    />
                    <label htmlFor="gst_bill">
                      <Button variant="outlined" component="span">
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" mt={1}>
                      Upload JPG, PNG, or PDF
                    </Typography>
                  </FileInputContainer>
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: 100, mt: 2 }}>
                    <img
                      src={previews.gst_bill}
                      alt="GST Bill Preview"
                      style={{ height: 100, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <IconButton
                      onClick={() => handleRemoveFile('gst_bill')}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: 'error.dark'
                        }
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              {/* Bill Sample -  */}
              {/* Bill Sample */}
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="bill_sample">
                  Customer Bill Copy (Sample)
                </CustomFormLabel>

                {!previews.bill_sample ? (
                  <FileInputContainer>
                    <input
                      accept="image/jpeg,image/png"
                      style={{ display: 'none' }}
                      id="bill_sample"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'bill_sample')}
                    />
                    <label htmlFor="bill_sample">
                      <Button variant="outlined" component="span">
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" mt={1}>
                      Upload JPG or PNG
                    </Typography>
                  </FileInputContainer>
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: 100, mt: 2 }}>
                    <img
                      src={previews.bill_sample}
                      alt="Bill Sample Preview"
                      style={{ height: 100, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <IconButton
                      onClick={() => handleRemoveFile('bill_sample')}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: 'error.dark'
                        }
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>


              {/* Business Images - Multiple (Max 5) */}
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="business_images">
                  Business Images (Max 5)
                </CustomFormLabel>

                {previews.business_images.length < 5 && (
                  <FileInputContainer>
                    <input
                      accept="image/jpeg,image/png"
                      style={{ display: 'none' }}
                      id="business_images"
                      multiple
                      type="file"
                      onChange={handleBusinessImagesChange}
                    />
                    <label htmlFor="business_images">
                      <Button variant="outlined" component="span">
                        Choose Files ({previews.business_images.length}/5)
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" mt={1}>
                      Upload JPG or PNG (Max 5)
                    </Typography>
                  </FileInputContainer>
                )}

                {previews.business_images.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                    {previews.business_images.map((preview, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative',
                          width: 100,
                          height: 100
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Business ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '2px solid',
                            borderColor: 'divider'
                          }}
                        />
                        <IconButton
                          onClick={() => removeBusinessImage(index)}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: 'error.main',
                            color: 'white',
                            padding: '4px',
                            '&:hover': {
                              backgroundColor: 'error.dark'
                            }
                          }}
                          size="small"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}

                <FormHelperText sx={{ mt: 1 }}>
                  {previews.business_images.length === 0
                    ? 'You can upload up to 5 business images (JPG, PNG only)'
                    : `${previews.business_images.length} of 5 images uploaded`
                  }
                </FormHelperText>
              </Grid>

              {/* Other Document Title - Optional (NO ) */}
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="otherrDocumentTitle">
                  Other Document Title
                </CustomFormLabel>
                <CustomTextField
                  id="otherrDocumentTitle"
                  name="otherrDocumentTitle"
                  value={form.otherrDocumentTitle}
                  onChange={handleChange}
                  placeholder="Enter other document title"
                  fullWidth
                />
              </Grid>

              {/* Other Document Image - Optional (NO ) */}
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="otherrDocumentImage">
                  Other Document Image
                </CustomFormLabel>
                <FileInputContainer>
                  <input
                    accept="image/jpeg,image/png,application/pdf"
                    style={{ display: 'none' }}
                    id="otherrDocumentImage"
                    type="file"
                    onChange={(e) => handleFileChange(e, 'otherrDocumentImage')}
                  />
                  <label htmlFor="otherrDocumentImage">
                    <Button variant="outlined" component="span">
                      Choose File
                    </Button>
                  </label>
                  <Typography variant="caption" display="block" mt={1}>
                    Upload JPG, PNG, or PDF
                  </Typography>
                </FileInputContainer>
                {previews.otherrDocumentImage && (
                  <Box mt={2}>
                    <img src={previews.otherrDocumentImage} alt="Other Document Preview" style={{ height: 100 }} />
                    <Button onClick={() => handleRemoveFile('otherrDocumentImage')}>Remove</Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="bankName" >
                  Bank Name
                </CustomFormLabel>
                <CustomTextField
                  id="bankName"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  fullWidth

                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="branchName" >
                  Branch Name
                </CustomFormLabel>
                <CustomTextField
                  id="branchName"
                  name="branchName"
                  value={form.branchName}
                  onChange={handleChange}
                  placeholder="Enter branch name"
                  fullWidth

                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="accountHolderName" >
                  Account Holder Name
                </CustomFormLabel>
                <CustomTextField
                  id="accountHolderName"
                  name="accountHolderName"
                  value={form.accountHolderName}
                  onChange={handleChange}
                  placeholder="Enter account holder name"
                  fullWidth

                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="accountNumber" >
                  Account Number
                </CustomFormLabel>
                <CustomTextField
                  id="accountNumber"
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                  placeholder="Enter account number"
                  fullWidth

                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="ifsCode" >
                  IFSC Code
                </CustomFormLabel>
                <CustomTextField
                  id="ifsCode"
                  name="ifsCode"
                  value={form.ifsCode}
                  onChange={handleChange}
                  placeholder="Enter IFSC code"
                  fullWidth

                  inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 11 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="upiId" >
                  UPI ID
                </CustomFormLabel>
                <CustomTextField
                  id="upiId"
                  name="upiId"
                  value={form.upiId}
                  onChange={handleChange}
                  placeholder="Enter UPI ID"
                  fullWidth

                />
              </Grid>
            </Grid>
          </Box>
        );
      case 4:
        return (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="metaTitle" >
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
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeTag(index)}
                      sx={{ mr: 0.5 }}
                    />
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
                    onPaste={(e) => {
                      setTimeout(() => {
                        const pastedText = e.clipboardData.getData('text');
                        if (pastedText.includes(',')) {
                          e.preventDefault();
                          const newTags = pastedText
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter((tag) => tag !== '');

                          if (newTags.length > 0) {
                            setTags([...tags, ...newTags]);
                            setInputValue('');
                          }
                        }
                      }, 0);
                    }}
                    placeholder="Type keywords separated by commas or press Enter"
                    InputProps={{
                      disableUnderline: true,
                      style: { minWidth: '150px' },
                    }}
                    sx={{ flexGrow: 1 }}
                  />
                </Box>
                <FormHelperText>
                  Type comma to separate or press Enter to add keywords
                </FormHelperText>
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
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBNVn5j-M6F4VHkaOluoOcVY3K5r2-NlPk"
      libraries={GOOGLE_MAPS_LIBRARIES}
      onLoad={() => setScriptLoaded(true)}
    >
      <PageContainer title="Add Store" description="Manage Add Store for your e-commerce platform">
        <Breadcrumb title="Add Store" items={BCrumb} />
        <ToastContainer position="top-right" autoClose={3000} />
        <Box sx={{ float: 'right', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
            startIcon={<IconArrowBackUp />}
          >
            Back
          </Button>
        </Box>
        <ParentCard title="Create Store">
          <Box width="100%" sx={{ p: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Store added successfully! All steps completed.
                </Alert>
                <Button
                  onClick={() => navigate('/stores')}
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  Go to Stores
                </Button>
                <Button onClick={handleReset} variant="outlined" color="secondary">
                  Add Another Store
                </Button>
              </Box>
            ) : (
              <>
                <Box sx={{ mt: 3 }}>{handleSteps(activeStep)}</Box>
                <Box display="flex" flexDirection="row" pt={2}>
                  <Button
                    color="inherit"
                    variant="outlined"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box flex="1 1 auto" />
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    color={activeStep === steps.length - 1 ? 'success' : 'primary'}
                    disabled={loading}
                  >
                    {loading
                      ? 'Submitting...'
                      : activeStep === steps.length - 1
                        ? 'Submit Store'
                        : 'Next'}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </ParentCard>
      </PageContainer>
    </LoadScript>
  );
};

export default AddStore;

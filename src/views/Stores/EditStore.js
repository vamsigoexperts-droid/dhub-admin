import React, { useState, useEffect, useRef } from 'react';
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
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';

import CloseIcon from '@mui/icons-material/Close';

import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { GoogleMap, LoadScript, Marker, Circle, Autocomplete } from '@react-google-maps/api';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import { IconArrowBackUp } from '@tabler/icons-react';
import { styled } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import { URLS } from '../../Url';
import axios from 'axios';

import MyLocationIcon from '@mui/icons-material/MyLocation';
import { CircularProgress } from '@mui/material';
import IconButton from '@mui/material/IconButton';


const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Edit Store' }];

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
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const steps = ['Basic Details', 'Business Details', 'Update KYC', 'Bank Details', 'Meta Data'];

const EditStore = () => {
  const [loading, setLoading] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const [searchLocation, setSearchLocation] = useState('');

  const [radiusKm, setRadiusKm] = useState('');

  const mapContainerStyle = { width: '100%', height: '100%' };



  const storeId = localStorage.getItem('storeId');

  const [form, setForm] = useState({
    serviceId: '',
    name: '',
    slug: '',
    phone: '',
    altphone: '',
    address: '',
    latitude: '',
    longitude: '',
    description: '',
    email: '',
    password: '',
    countryId: '',

    city: '',
    state: '',
    country: '',
    area: '',
    street: '',
    streetNumber: '',
    placeId: '',
    placeName: '',
    formattedAddress: '',

    stateId: '',
    cityId: '',
    // zoneId: '',
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
    metakeywords: '',
    deliveryCharge: '',
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
    business_card: null,
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
    business_card: null,
    image: null,
    otherrDocumentImage: null,
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  // const [zone, setZone] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [pincodeInput, setPincodeInput] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const autocompleteRef = useRef(null);
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);


  // const onPlaceChanged = () => {
  //   if (autocomplete !== null) {
  //     const place = autocomplete.getPlace();
  //     if (place && place.geometry && place.address_components) {
  //       const addressComponents = place.address_components;
  //       const geometry = place.geometry.location;

  //       let postalCode = '',
  //         area = '',
  //         streetNumber = '',
  //         route = '';

  //       addressComponents.forEach((component) => {
  //         const types = component.types;

  //         if (types.includes('postal_code')) {
  //           postalCode = component.long_name;
  //         }
  //         if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
  //           area = component.long_name;
  //         }
  //         if (types.includes('street_number')) {
  //           streetNumber = component.long_name;
  //         }
  //         if (types.includes('route')) {
  //           route = component.long_name;
  //         }
  //       });

  //       let fullAddress = '';
  //       if (streetNumber || route || area) {
  //         fullAddress = `${streetNumber ? streetNumber + ', ' : ''}${
  //           route ? route + ', ' : ''
  //         }${area}`;
  //       } else if (place.formatted_address) {
  //         fullAddress = place.formatted_address;
  //       }

  //       setForm((prev) => ({
  //         ...prev,
  //         address: fullAddress,
  //         pincode: postalCode,
  //         latitude: geometry.lat().toString(),
  //         longitude: geometry.lng().toString(),
  //       }));
  //     }
  //   }
  // };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.address_components) {
        const addressComponents = place.address_components;
        const geometry = place.geometry.location;

        // Extract all address components
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
          if (types.includes('sublocality_level_1') || types.includes('sublocality'))
            area = component.long_name;
          if (types.includes('street_number')) streetNumber = component.long_name;
          if (types.includes('route')) route = component.long_name;
        });

        const fullAddress = place.formatted_address;

        // Update search location display
        setSearchLocation(fullAddress);

        // Update form with all location data
        setForm(prev => ({
          ...prev,
          serviceId: data.serviceId,
          name: data.name,
          slug: data.slug,                 // set slug
          phone: data.phone,
          altphone: data.altphone,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          description: data.description,
          email: data.email,
          password: data.password,
          countryId: data.countryId,
          stateId: data.stateId,
          cityId: data.cityId,
          // zoneId: data.zoneId,             // set zoneId
          pincode: data.pincode,
          shopOpenOrClose: data.shopOpenOrClose !== undefined ? data.shopOpenOrClose : true, // set shopOpenOrClose
          personalName: data.personalName,
          personalEmail: data.personalEmail,
          personalPhone: data.personalPhone,
          bankName: data.bankName,
          branchName: data.branchName,
          accountHolderName: data.accountHolderName,
          accountNumber: data.accountNumber,
          ifsCode: data.ifsCode,
          upiId: data.upiId,
          metaTitle: data.metaTitle,
          metakeywords: data.metakeywords,
          metaDescription: data.metaDescription,
          deliveryCharge: data.deliveryCharge,
          pannumber: data.pannumber,
          aadharnumber: data.aadharnumber,
          businessnumber: data.businessnumber,
          gasbillnumber: data.gasbillnumber,
          experiance: data.experiance,
          dob: data.dob,
          otherrDocumentTitle: data.otherrDocumentTitle,
          deliveryPincode: Array.isArray(data.deliveryPincode) ? data.deliveryPincode : (data.deliveryPincode ? data.deliveryPincode.split(',') : []),  // set deliveryPincode as array
          gstnumber: data.gstnumber,
          // other fields
        }));
      } else {
        toast.error('Unable to retrieve location details. Please try again.');
      }
    }
  };


  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

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

              let postalCode = '', city = '', state = '', country = '';
              let area = '', streetNumber = '', route = '';

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

              const fullAddress = place.formatted_address;

              setSearchLocation(fullAddress);
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
                formattedAddress: fullAddress,
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
            toast.error('ðŸ“ Location permission denied. Please enable location access.');
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



  // âœ… PAN Card Validation
  const validatePAN = (pan) => {
    if (!pan) return false;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };

  // âœ… Aadhaar Number Validation
  const validateAadhaar = (aadhaar) => {
    if (!aadhaar) return false;
    // Remove spaces and validate 12 digits starting with 2-9
    const cleanAadhaar = aadhaar.replace(/\s/g, '');
    const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
    return aadhaarRegex.test(cleanAadhaar);
  };

  // âœ… GST Number Validation
  const validateGST = (gst) => {
    if (!gst) return false;
    // GST format: 2 digits (state code) + 10 chars (PAN) + 1 digit (entity) + Z + 1 alphanumeric
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst.toUpperCase());
  };




  // âœ… Reverse Geocoding: Convert Lat/Long to Address
  const reverseGeocode = async (lat, lng) => {
    if (!window.google || !window.google.maps) {
      console.warn('Google Maps not loaded yet');
      return;
    }

    try {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const place = results[0];
          const formattedAddress = place.formatted_address;

          // Update the search location state
          setSearchLocation(formattedAddress);

          // Also update the form address field
          setForm(prev => ({
            ...prev,
            address: formattedAddress
          }));

          console.log('Reverse geocoded address:', formattedAddress);
        } else {
          console.warn('Reverse geocoding failed:', status);
          toast.error('Unable to fetch location from coordinates');
        }
      });
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      toast.error('Error fetching location details');
    }
  };




  const onLoad = (autoC) => {
    setAutocomplete(autoC);
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


  const getFullImagePath = (imagePath) => {
    if (!imagePath) return null;

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    return `${URLS.FileBase}${imagePath}`;
  };

  // const fetchStoredata = async () => {
  //   if (!token || !storeId) {
  //     toast.error('Please log in and select a store to continue.');
  //     return;
  //   }
  //   try {
  //     const res = await axios.post(
  //       URLS.GetStoreone,
  //       { id: storeId },
  //       { headers: { Authorization: `Bearer ${token}` } },
  //     );
  //     const data = res.data?.store;

  //     setForm({
  //       serviceId: data.serviceId || '',
  //       name: data.name || '',
  //  


  //       phone: data.phone || '',
  //       altphone: data.altphone || '', 
  //       address: data.address || '',
  //       latitude: data.latitude || '',
  //       longitude: data.longitude || '',
  //       description: data.description || '',
  //       email: data.email || '',
  //       password: data.password || '',
  //       countryId: data.countryId || '',
  //       stateId: data.stateId || '',
  //       cityId: data.cityId || '',
  //       zoneId: data.zoneId || '',
  //       pincode: data.pincode || '',
  //       shopOpenOrClose: data.shopOpenOrClose !== undefined ? data.shopOpenOrClose : true,
  //       personalName: data.personalName || '',
  //       personalEmail: data.personalEmail || '',
  //       personalPhone: data.personalPhone || '',
  //       bankName: data.bankName || '',
  //       branchName: data.branchName || '',
  //       accountHolderName: data.accountHolderName || '',
  //       accountNumber: data.accountNumber || '',
  //       ifsCode: data.ifsCode || '',
  //       upiId: data.upiId || '',
  //       metaTitle: data.metaTitle || '',
  //       metaDescription: data.metaDescription || '',
  //       deliveryCharge: data.deliveryCharge || '',
  //       altphone: data.altphone || '',
  //       pan_number: data.pan_number || '',
  //       gst_number: data.gst_number || '',
  //       aadhar_number: data.aadhar_number || '',
  //       business_number: data.business_number || '',
  //       gas_bill_number: data.gas_bill_number || '',
  //       experiance: data.experiance || '',
  //       dob: data.dob || '',
  //       otherrDocumentTitle: data.otherrDocumentTitle || '',
  //       deliveryPincode: Array.isArray(data.deliveryPincode)
  //         ? data.deliveryPincode
  //         : data.deliveryPincode
  //         ? data.deliveryPincode.split(',')
  //         : [],
  //     });

  //     // Set existing images from API response
  //     const newExistingImages = {
  //       pan_card_front: data.pan_card_front ? URLS.FileBase + data.pan_card_front : null,
  //       pan_card_back: data.pan_card_back ? URLS.FileBase + data.pan_card_back : null,
  //       aadhar_card_front: data.aadhar_card_front ? URLS.FileBase + data.aadhar_card_front : null,
  //       aadhar_card_back: data.aadhar_card_back ? URLS.FileBase + data.aadhar_card_back : null,
  //       gst_bill: data.gst_bill ? URLS.FileBase + data.gst_bill : null,
  //       business_proof: data.business_proof ? URLS.FileBase + data.business_proof : null,
  //       gas_bill: data.gas_bill ? URLS.FileBase + data.gas_bill : null,
  //       business_images: Array.isArray(data.business_images)
  //         ? data.business_images.map((img) => URLS.FileBase + img)
  //         : [],
  //       logo: data.logo ? URLS.FileBase + data.logo : null,
  //       banner_image: data.banner_image ? URLS.FileBase + data.banner_image : null,
  //       bill_sample: data.bill_sample ? URLS.FileBase + data.bill_sample : null,
  //         business_card: data.business_card ? URLS.FileBase + data.business_card : null,
  //       image: data.image ? URLS.FileBase + data.image : null,
  //       otherrDocumentImage: data.otherrDocumentImage ? URLS.FileBase + data.otherrDocumentImage : null,
  //     };

  //     setPreviews(newExistingImages);

  //     // Set meta keywords
  //     setTags(
  //       Array.isArray(data.metakeywords)
  //         ? data.metakeywords
  //         : data.metakeywords
  //         ? data.metakeywords.split(',').filter((tag) => tag.trim() !== '')
  //         : [],
  //     );

  //     // Set country, state for cascading dropdowns
  //     if (data.countryId) {
  //       setSelectedCountry(data.countryId);
  //     }
  //     if (data.stateId) {
  //       setSelectedState(data.stateId);
  //     }
  //     if (data.cityId) {
  //       setSelectedCity(data.cityId);
  //     }

  //     // Handle working hours
  //     const validatedWorkingHours = { ...workingHours };
  //     if (data.workingHours) {
  //       const workingHoursArray = Array.isArray(data.workingHours)
  //         ? data.workingHours
  //         : [data.workingHours];

  //       workingHoursArray.forEach((wh) => {
  //         if (wh && typeof wh === 'object' && wh.day) {
  //           const day = wh.day.toLowerCase();
  //           validatedWorkingHours[day] = {
  //             fromTime: wh.fromTime || '',
  //             toTime: wh.toTime || '',
  //             isOpen: wh.isOpen || false,
  //           };
  //         }
  //       });
  //     }
  //     setWorkingHours(validatedWorkingHours);
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Failed to fetch store data.');
  //   }
  // };


  useEffect(() => {
    if (scriptLoaded && form.latitude && form.longitude) {
      reverseGeocode(form.latitude, form.longitude);
    }
  }, [scriptLoaded, form.latitude, form.longitude]);


  const fetchStoredata = async () => {
    if (!token || !storeId) {
      toast.error('Please log in and select a store to continue.');
      return;
    }
    try {
      const res = await axios.post(
        URLS.GetStoreone,
        { id: storeId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = res.data?.store;

      // console.log('ðŸ“¥ Store data fetched:', data);
      console.log('ðŸ“· Image paths:', {
        logo: data.logo,
        banner: data.banner_image,
        profile: data.image,
      });

      setForm({
        serviceId: data.serviceId || '',
        name: data.name || '',
        slug: data.slug || '',
        phone: data.phone || '',
        altphone: data.altphone || '',
        address: data.address || '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        description: data.description || '',
        email: data.email || '',
        password: data.password || '',
        countryId: data.countryId || '',
        stateId: data.stateId || '',
        cityId: data.cityId || '',
        pincode: data.pincode || '',
        // zoneId: data.zoneId || '',
        shopOpenOrClose: data.shopOpenOrClose !== undefined ? data.shopOpenOrClose : true,
        personalName: data.personalName || '',
        personalEmail: data.personalEmail || '',
        personalPhone: data.personalPhone || '',
        bankName: data.bankName || '',
        branchName: data.branchName || '',
        accountHolderName: data.accountHolderName || '',
        accountNumber: data.accountNumber || '',
        ifsCode: data.ifsCode || '',
        upiId: data.upiId || '',
        metaTitle: data.metaTitle || '',
        metakeywords: data.metakeywords || '',
        metaDescription: data.metaDescription || '',
        deliveryCharge: data.deliveryCharge || '',
        pan_number: data.pan_number || '',
        aadhar_number: data.aadhar_number || '',
        business_number: data.business_number || '',
        gas_bill_number: data.gas_bill_number || '',
        experiance: data.experiance || '',
        deliveryRadiusKm: data.deliveryRadiusKm || '',
        dob: data.dob || '',
        otherrDocumentTitle: data.otherrDocumentTitle || '',
        deliveryPincode: Array.isArray(data.deliveryPincode)
          ? data.deliveryPincode
          : data.deliveryPincode
            ? data.deliveryPincode.split(',')
            : [],
        gst_number: data.gst_number || '',
      });

      if (data.deliveryRadiusKm) {
        setRadiusKm(data.deliveryRadiusKm.toString());
      }


      // â­ UPDATED WITH HELPER FUNCTION
      const newExistingImages = {
        pan_card_front: getFullImagePath(data.pan_card_front),
        pan_card_back: getFullImagePath(data.pan_card_back),
        aadhar_card_front: getFullImagePath(data.aadhar_card_front),
        aadhar_card_back: getFullImagePath(data.aadhar_card_back),
        gst_bill: getFullImagePath(data.gst_bill),
        business_proof: getFullImagePath(data.business_proof),
        gas_bill: getFullImagePath(data.gas_bill),
        business_images: Array.isArray(data.business_images)
          ? data.business_images.map((img) => getFullImagePath(img))
          : [],
        logo: getFullImagePath(data.logo),
        banner_image: getFullImagePath(data.banner_image),
        bill_sample: getFullImagePath(data.bill_sample),
        business_card: getFullImagePath(data.business_card),
        image: getFullImagePath(data.image),
        otherrDocumentImage: getFullImagePath(data.otherrDocumentImage),
      };

      console.log('âœ… Full image paths:', newExistingImages);

      setPreviews(newExistingImages);

      setTags(
        Array.isArray(data.metakeywords)
          ? data.metakeywords
          : data.metakeywords
            ? data.metakeywords.split(',').filter((tag) => tag.trim() !== '')
            : [],
      );

      if (data.countryId) {
        setSelectedCountry(data.countryId);
      }
      if (data.stateId) {
        setSelectedState(data.stateId);
      }
      if (data.cityId) {
        setSelectedCity(data.cityId);
      }

      //  if (data.latitude && data.longitude) {
      //   if (scriptLoaded && window.google) {
      //     // Google Maps already loaded
      //     reverseGeocode(data.latitude, data.longitude);
      //   } else {
      //     // Wait for Google Maps to load
      //     const checkGoogleMaps = setInterval(() => {
      //       if (window.google && window.google.maps) {
      //         clearInterval(checkGoogleMaps);
      //         reverseGeocode(data.latitude, data.longitude);
      //       }
      //     }, 500);

      //     // Stop checking after 10 seconds
      //     setTimeout(() => clearInterval(checkGoogleMaps), 10000);
      //   }
      // }


      // After setting form data
      if (data.address) {
        setSearchLocation(data.address);
      }

      // Trigger reverse geocoding if coordinates exist but no address
      if (data.latitude && data.longitude && !data.address) {
        if (scriptLoaded && window.google) {
          reverseGeocode(data.latitude, data.longitude);
        } else {
          const checkGoogleMaps = setInterval(() => {
            if (window.google && window.google.maps) {
              clearInterval(checkGoogleMaps);
              reverseGeocode(data.latitude, data.longitude);
            }
          }, 500);

          setTimeout(() => clearInterval(checkGoogleMaps), 10000);
        }
      }

      // After setting form data
      if (data.latitude && data.longitude) {
        if (scriptLoaded && window.google) {
          // Google Maps already loaded
          reverseGeocode(data.latitude, data.longitude);
        } else {
          // Wait for Google Maps to load
          const checkGoogleMaps = setInterval(() => {
            if (window.google && window.google.maps) {
              clearInterval(checkGoogleMaps);
              reverseGeocode(data.latitude, data.longitude);
            }
          }, 500);

          // Stop checking after 10 seconds
          setTimeout(() => clearInterval(checkGoogleMaps), 10000);
        }
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch store data.');
      console.error('Fetch error:', error);
    }
  };
  useEffect(() => {
    fetchStoredata();
    fetchData();
  }, [token]);

  const fetchData = async () => {
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }
    try {
      const [serviceRes, countriesRes] = await Promise.all([
        axios.post(URLS.GetActiveServices, { searchQuery: '', serviceType: '' }, { headers: { Authorization: `Bearer ${token}` } }),
        axios.post(URLS.GetCountry, {}, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setServiceTypes(serviceRes.data.data || []);
      setCountries(countriesRes.data.country || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch data.');
    }
  };

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





  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //   const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   // Real-time validation for specific fields
  //   if (name === 'pan_number') {
  //     const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  //     if (cleanValue.length <= 10) {
  //       setForm({ ...form, [name]: cleanValue });
  //     }
  //   } else if (name === 'aadhar_number') {
  //     const cleanValue = value.replace(/[^0-9]/g, '');
  //     if (cleanValue.length <= 12) {
  //       setForm({ ...form, [name]: cleanValue });
  //     }
  //   } else if (name === 'gst_number') {
  //     const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  //     if (cleanValue.length <= 15) {
  //       setForm({ ...form, [name]: cleanValue });
  //     }
  //   } else {
  //     setForm({ ...form, [name]: value });
  //   }
  // };


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
        // âœ… Set default times when switching ON (6:00 AM - 8:00 PM)
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
  //          return (
  //       // Document images 
  //       (files.pan_card_front || previews.pan_card_front) &&
  //       (files.pan_card_back || previews.pan_card_back) &&
  //       (files.aadhar_card_front || previews.aadhar_card_front) &&
  //       (files.aadhar_card_back || previews.aadhar_card_back) &&
  //       (files.gas_bill || previews.gas_bill) &&
  //       (files.business_proof || previews.business_proof) &&
  //       (files.gst_bill || previews.gst_bill) &&
  //       (files.bill_sample || previews.bill_sample) &&
  //       (files.logo || previews.logo) &&
  //       (files.banner_image || previews.banner_image) &&
  //       (files.business_images?.length > 0 || previews.business_images?.length > 0) &&
  //       // KYC numbers 
  //       form.pan_number &&
  //       form.aadhar_number &&
  //       form.gst_number &&
  //       form.business_number &&
  //       form.gas_bill_number &&
  //       // Validate formats
  //       validatePAN(form.pan_number) &&
  //       validateAadhaar(form.aadhar_number) &&
  //       validateGST(form.gst_number)
  //     );

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

  // const handleNext = () => {
  //   if (!validateCurrentStep(activeStep)) {
  //     toast.error('Please fill all  fields in this step.');
  //     return;
  //   }
  //   if (activeStep === steps.length - 1) {
  //     handleSubmit();
  //     return;
  //   }
  //   let newSkipped = skipped;
  //   if (isStepSkipped(activeStep)) {
  //     newSkipped = new Set(newSkipped.values());
  //     newSkipped.delete(activeStep);
  //   }
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSkipped(newSkipped);
  // };


  const validateCurrentStep = (step) => {
    return true; // Always allow progression
  };



  //   const handleNext = () => {
  //   if (!validateCurrentStep(activeStep)) {
  //     if (activeStep === 2) {
  //       // Specific error messages for KYC step
  //       let errorMessage = 'Please complete all  KYC fields:\n';

  //       if (!form.pan_number) errorMessage += 'â€¢ PAN Number\n';
  //       else if (!validatePAN(form.pan_number)) errorMessage += 'â€¢ Valid PAN Number\n';

  //       if (!form.aadhar_number) errorMessage += 'â€¢ Aadhaar Number\n';
  //       else if (!validateAadhaar(form.aadhar_number)) errorMessage += 'â€¢ Valid Aadhaar Number\n';

  //       if (!form.gst_number) errorMessage += 'â€¢ GST Number\n';
  //       else if (!validateGST(form.gst_number)) errorMessage += 'â€¢ Valid GST Number\n';

  //       if (!form.business_number) errorMessage += 'â€¢ Business ID Proof Number\n';
  //       if (!form.gas_bill_number) errorMessage += 'â€¢ Gas Bill/Passport Number\n';

  //       if (!(files.pan_card_front || previews.pan_card_front)) errorMessage += 'â€¢ PAN Card Front\n';
  //       if (!(files.pan_card_back || previews.pan_card_back)) errorMessage += 'â€¢ PAN Card Back\n';
  //       if (!(files.aadhar_card_front || previews.aadhar_card_front)) errorMessage += 'â€¢ Aadhaar Front\n';
  //       if (!(files.aadhar_card_back || previews.aadhar_card_back)) errorMessage += 'â€¢ Aadhaar Back\n';
  //       if (!(files.gst_bill || previews.gst_bill)) errorMessage += 'â€¢ GST Proof\n';
  //       if (!(files.business_proof || previews.business_proof)) errorMessage += 'â€¢ Business Proof\n';
  //       if (!(files.gas_bill || previews.gas_bill)) errorMessage += 'â€¢ Gas Bill/Passport\n';
  //       if (!(files.bill_sample || previews.bill_sample)) errorMessage += 'â€¢ Bill Sample\n';
  //       if (!(files.logo || previews.logo)) errorMessage += 'â€¢ Logo\n';
  //       if (!(files.banner_image || previews.banner_image)) errorMessage += 'â€¢ Banner Image\n';
  //       if (!(files.business_images?.length > 0 || previews.business_images?.length > 0)) 
  //         errorMessage += 'â€¢ Business Images (at least 1)\n';

  //       toast.error("Please fill all  fields in this step.");
  //     } else {
  //       toast.error('Please fill all  fields in this step.');
  //     }
  //     return;
  //   }

  //   if (activeStep === steps.length - 1) {
  //     handleSubmit();
  //     return;
  //   }

  //   let newSkipped = skipped;
  //   if (isStepSkipped(activeStep)) {
  //     newSkipped = new Set(newSkipped.values());
  //     newSkipped.delete(activeStep);
  //   }
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSkipped(newSkipped);
  // };


  const handleNext = () => {
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
    setSearchLocation('');
    setForm({

      serviceId: '',
      name: '',
      slug: '',
      phone: '',
      altphone: '',
      address: '',
      latitude: '',
      longitude: '',
      description: '',
      email: '',
      password: '',
      countryId: '',
      stateId: '',
      cityId: '',
      pincode: '',
      // zoneId: '',
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
      metakeywords: '',
      metaDescription: '',
      deliveryCharge: '',

      pan_number: '',
      aadhar_number: '',
      business_number: '',
      gas_bill_number: '',
      experiance: '',
      dob: '',
      otherrDocumentTitle: '',
      deliveryPincode: [],
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
      business_card: null,
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
  };

  const libraries = ['places'];

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
  //     const response = await axios.put(`${URLS.EditStore}/${storeId}`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     toast.success(response.data.message || 'Store updated successfully!');
  //     setActiveStep(steps.length);
  //     navigate('/stores');
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Failed to update store.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  // âœ… Helper function to convert 24-hour time to 12-hour AM/PM format


  // âœ… Helper function to display time in AM/PM format
  const formatTimeDisplay = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatTimeToAMPM = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };



  const handleSubmit = async () => {
    const formData = new FormData();

    // âœ… Append ALL form fields
    Object.keys(form).forEach((key) => {
      if (key === 'deliveryPincode') {
        formData.append(key, JSON.stringify(form[key]));
      } else {
        formData.append(key, form[key] || '');
      }
    });

    // âœ… Append all file fields
    Object.keys(files).forEach(key => {
      if (Array.isArray(files[key])) {
        files[key].forEach(file => {
          formData.append(key, file);
        });
      } else if (files[key]) {
        formData.append(key, files[key]);
      }
    });

    // âœ… Append working hours
    const workingHoursArray = Object.entries(workingHours)
      .filter(([, hours]) => hours.isOpen && hours.fromTime && hours.toTime)
      .map(([day, hours]) => ({
        day: day,
        fromTime: hours.fromTime,
        toTime: hours.toTime,
        isOpen: true,
      }));
    formData.append('workingHours', JSON.stringify(workingHoursArray));

    // âœ… Append meta keywords
    formData.append('metakeywords', tags.join(','));

    setLoading(true);
    try {
      const response = await axios.put(`${URLS.EditStore}/${storeId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message || 'Store updated successfully!');
      setActiveStep(steps.length);
      navigate('/stores');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update store.');
    } finally {
      setLoading(false);
    }
  };
  6
  //   const renderWorkingHours = (day) => (
  //     <Box
  //       key={day}
  //       sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
  //     >
  //       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
  //         <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
  //           {day}
  //         </Typography>
  //         <Switch
  //           checked={workingHours[day].isOpen}
  //           onChange={() => toggleDayStatus(day)}
  //           size="small"
  //         />
  //       </Box>
  //       {workingHours[day].isOpen && (
  //         <Grid container spacing={2}>
  //           <Grid item xs={6}>
  //      <CustomTextField
  //   fullWidth
  //   type="time"
  //   label="From"
  //   size="small"
  //   value={workingHours[day].fromTime}
  //   onChange={(e) => handleWorkingHoursChange(day, 'fromTime', e.target.value)}
  //   InputLabelProps={{ shrink: true }}
  //   inputProps={{
  //     step: 300, // 5 min intervals
  //   }}
  //   // âœ… Show AM/PM helper text
  //   helperText={workingHours[day].fromTime && formatTimeToAMPM(workingHours[day].fromTime)}
  // />

  //           </Grid>
  //           <Grid item xs={6}>
  //      <CustomTextField
  //   fullWidth
  //   type="time"
  //   label="To"
  //   size="small"
  //   value={workingHours[day].toTime}
  //   onChange={(e) => handleWorkingHoursChange(day, 'toTime', e.target.value)}
  //   InputLabelProps={{ shrink: true }}
  //   inputProps={{
  //     step: 300, // 5 min intervals
  //   }}
  //   // âœ… Show AM/PM helper text
  //   helperText={workingHours[day].toTime && formatTimeToAMPM(workingHours[day].toTime)}
  // />
  //           </Grid>
  //         </Grid>
  //       )}
  //     </Box>
  //   );


  // const renderWorkingHours = (day) => (
  //   <Box key={day} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
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
  //             inputProps={{ step: 300 }}
  //             helperText={workingHours[day].fromTime && formatTimeToAMPM(workingHours[day].fromTime)}
  //             FormHelperTextProps={{ sx: { fontSize: '0.75rem', mt: 0.5 } }}
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
  //             inputProps={{ step: 300 }}
  //             helperText={workingHours[day].toTime && formatTimeToAMPM(workingHours[day].toTime)}
  //             FormHelperTextProps={{ sx: { fontSize: '0.75rem', mt: 0.5 } }}
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
            {/* âœ… Display AM/PM below input */}
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
            {/* âœ… Display AM/PM below input */}
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
                <CustomFormLabel htmlFor="altphone">Alternate Phone</CustomFormLabel>
                <CustomTextField
                  id="altphone"
                  name="altphone"
                  value={form.altphone}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Enter alternate phone"
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
                <CustomFormLabel htmlFor="image" >
                  Profile Image
                </CustomFormLabel>
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
                {previews.image && (
                  <Box mt={2}>
                    <img src={previews.image} alt="Profile Preview" style={{ height: 100 }} />
                    <Button onClick={() => handleRemoveFile('image')}>Remove</Button>
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
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="serviceId" >
                  Service
                </CustomFormLabel>
                <CustomSelect
                  id="serviceId"
                  value={form.serviceId}
                  name="serviceId"
                  onChange={handleChange}
                  fullWidth

                >
                  <MenuItem value="" disabled>
                    Select Service
                  </MenuItem>
                  {serviceTypes.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="name" >
                  Store Name
                </CustomFormLabel>
                <CustomTextField
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter store name"
                  fullWidth

                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="slug">Permalink (Slug)</CustomFormLabel>
                <CustomTextField
                  id="slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  fullWidth
                  placeholder={form.slug || "Auto-generated slug"}
                />
                <FormHelperText>Auto-generated from store name + city</FormHelperText>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="phone" >
                  Store Phone
                </CustomFormLabel>
                <CustomTextField
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter store phone"
                  fullWidth

                />
              </Grid>
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

              <Grid item xs={12}>

              </Grid>

              {/* ========== ROW: LOCATION SEARCH, LAT, LNG, RADIUS (4 per row) ========== */}

              {/* <Grid item xs={12} md={3}>
            <CustomFormLabel htmlFor="address-search">Search Location *</CustomFormLabel>
            {scriptLoaded ? (
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <TextField
                  id="address-search"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  fullWidth
                  placeholder="Search address"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={handleCurrentLocation}
                        disabled={loadingCurrentLocation}
                        color="primary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)'
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
            ) : (
              <TextField
                fullWidth
                placeholder="Loading..."
                disabled
                size="small"
                sx={{ opacity: 0.6 }}
              />
            )}
            <FormHelperText sx={{ fontSize: '0.7rem' }}>Type or click ðŸ“</FormHelperText>
          </Grid> */}
              {/* <Grid item xs={12}>
  <CustomFormLabel htmlFor="address-search" >
    Search Location
  </CustomFormLabel>
  {scriptLoaded && (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
    >
      <TextField
        id="address-search-input"
        fullWidth
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
        placeholder="Enter complete address to auto-fill location details"
        variant="outlined"
      />
    </Autocomplete>
  )}
  <Typography variant="caption" color="textSecondary">
    Start typing to search for your location
  </Typography>
</Grid> */}


              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="address-search">
                  Search Location
                </CustomFormLabel>
                {scriptLoaded ? (
                  <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <TextField
                      id="address-search-input"
                      fullWidth
                      value={searchLocation}
                      onChange={(e) => {
                        setSearchLocation(e.target.value);
                        setForm(prev => ({ ...prev, address: e.target.value }));
                      }}
                      placeholder="Enter complete address to auto-fill location details"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={handleCurrentLocation}
                            disabled={loadingCurrentLocation}
                            color="primary"
                            title="Use my current location"
                            sx={{
                              position: 'absolute',
                              right: 8,
                              padding: '8px',
                            }}
                          >
                            {loadingCurrentLocation ? (
                              <CircularProgress size={20} />
                            ) : (
                              <MyLocationIcon />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                  </Autocomplete>
                ) : (
                  <TextField
                    fullWidth
                    value="Loading Google Maps..."
                    placeholder="Loading..."
                    variant="outlined"
                    disabled
                  />
                )}
                <FormHelperText>
                  search or click
                </FormHelperText>
              </Grid>

              {/* <Grid item xs={12}>
                <CustomFormLabel htmlFor="address" >
                  Address
                </CustomFormLabel>
                <CustomTextField
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter store address"
                  fullWidth
                  
                />
              </Grid> */}



              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="latitude" >
                  Latitude
                </CustomFormLabel>
                <CustomTextField
                  id="latitude"
                  name="latitude"
                  type="number"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="Enter latitude"
                  fullWidth

                  disabled
                  inputProps={{ step: 'any' }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="longitude" >
                  Longitude
                </CustomFormLabel>
                <CustomTextField
                  id="longitude"
                  name="longitude"
                  type="number"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="Enter longitude"
                  fullWidth

                  disabled
                  inputProps={{ step: 'any' }}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <CustomFormLabel>Delivery Radius (KM) </CustomFormLabel>
                <CustomTextField
                  type="number"
                  value={form.deliveryRadiusKm || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRadiusKm(value);
                    setForm(prev => ({ ...prev, deliveryRadiusKm: value }));
                  }}
                  placeholder="e.g., 5"
                  fullWidth
                  size="small"
                  inputProps={{ min: 0.1, max: 50, step: 0.1 }}
                />
                <FormHelperText sx={{ fontSize: '0.7rem' }}>Red circle preview</FormHelperText>
              </Grid>




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
                      mapContainerStyle={mapContainerStyle}
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
                      {/* ðŸ“ MAIN MARKER */}
                      <Marker
                        position={{
                          lat: parseFloat(form.latitude),
                          lng: parseFloat(form.longitude)
                        }}
                      />

                      {/* ðŸ”´ RADIUS CIRCLE */}
                      {form.deliveryRadiusKm && parseFloat(form.deliveryRadiusKm) > 0 && (
                        <Circle
                          center={{
                            lat: parseFloat(form.latitude),
                            lng: parseFloat(form.longitude)
                          }}
                          radius={parseFloat(form.deliveryRadiusKm) * 1000}
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
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="countryId" >
                  Country
                </CustomFormLabel>
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
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="stateId" >
                  State
                </CustomFormLabel>
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
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="cityId">City</CustomFormLabel>
                <CustomSelect
                  id="cityId"
                  name="cityId"
                  value={form.cityId}
                  onChange={(e) => {
                    const cityId = e.target.value;
                    setSelectedCity(cityId);
                    setForm({ ...form, cityId });
                  }}
                  fullWidth

                  disabled={!form.stateId}
                >
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

              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="pincode">Pincode</CustomFormLabel>
                <CustomTextField
                  id="pincode"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="deliveryCharge">Delivery Charge</CustomFormLabel>
                <CustomTextField
                  id="deliveryCharge"
                  name="deliveryCharge"
                  type="number"
                  value={form.deliveryCharge}
                  onChange={handleChange}
                  placeholder="Enter delivery charge"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel>Delivery Pincodes</CustomFormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value)}
                    placeholder="Enter delivery pincode"
                    sx={{ mr: 1, flexGrow: 1 }}
                  />
                  <Button variant="outlined" onClick={addDeliveryPincode}>
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
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                {/* <FormControlLabel
                  control={
                    <Switch
                      checked={form.shopOpenOrClose}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shopOpenOrClose: e.target.checked,
                        })
                      }
                      name="shopOpenOrClose"
                    />
                  }
                  label="Shop Open/Close Status"
                /> */}


                <FormControlLabel
                  control={
                    <Switch
                      checked={form.shopOpenOrClose}
                      onChange={(e) => {
                        const isOpen = e.target.checked;
                        setForm({ ...form, shopOpenOrClose: isOpen });

                        // âœ… When switched ON, set all days to default times
                        if (isOpen) {
                          const defaultTimes = {
                            fromTime: '06:00',
                            toTime: '20:00',
                            isOpen: true,
                          };

                          setWorkingHours({
                            monday: { ...defaultTimes },
                            tuesday: { ...defaultTimes },
                            wednesday: { ...defaultTimes },
                            thursday: { ...defaultTimes },
                            friday: { ...defaultTimes },
                            saturday: { ...defaultTimes },
                            sunday: { ...defaultTimes },
                          });
                        } else {
                          // When switched OFF, close all days
                          setWorkingHours({
                            monday: { fromTime: '', toTime: '', isOpen: false },
                            tuesday: { fromTime: '', toTime: '', isOpen: false },
                            wednesday: { fromTime: '', toTime: '', isOpen: false },
                            thursday: { fromTime: '', toTime: '', isOpen: false },
                            friday: { fromTime: '', toTime: '', isOpen: false },
                            saturday: { fromTime: '', toTime: '', isOpen: false },
                            sunday: { fromTime: '', toTime: '', isOpen: false },
                          });
                        }
                      }}
                      name="shopOpenOrClose"
                    />
                  }
                  label="Shop Open/Close Status"
                />

              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Working Hours
                </Typography>
                <Grid container spacing={2}>
                  {[
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                    'saturday',
                    'sunday',
                  ].map((day) => (
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
        return (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
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
                  <Box sx={{ position: 'relative', width: '100%', height: 150, mt: 2 }}>
                    <img
                      src={previews.logo}
                      alt="Logo Preview"
                      style={{ height: 150, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    {/* OVERLAY BUTTONS */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: '4px',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* CHANGE/UPLOAD BUTTON */}
                      <input
                        accept="image/jpeg,image/png"
                        style={{ display: 'none' }}
                        id="logo-change"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'logo')}
                      />
                      <label htmlFor="logo-change">
                        <Button
                          variant="contained"
                          component="span"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ backgroundColor: 'primary.main' }}
                        >

                        </Button>
                      </label>

                      {/* REMOVE BUTTON */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile('logo')}
                        startIcon={<CloseIcon />}
                      >

                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>


              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="banner_image">Banner Image</CustomFormLabel>

                {!previews.banner_image ? (
                  <FileInputContainer>
                    <input
                      accept="image/jpeg,image/png"
                      style={{ display: 'none' }}
                      id="banner_image"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'banner_image')}
                    />
                    <label htmlFor="banner_image">
                      <Button variant="outlined" component="span">
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" mt={1}>
                      Upload JPG or PNG
                    </Typography>
                  </FileInputContainer>
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: 150, mt: 2 }}>
                    <img
                      src={previews.banner_image}
                      alt="Banner Preview"
                      style={{ height: 150, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    {/* OVERLAY BUTTONS (appear on hover) */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: '4px',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* CHANGE BUTTON */}
                      <input
                        accept="image/jpeg,image/png"
                        style={{ display: 'none' }}
                        id="banner_image-change"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'banner_image')}
                      />
                      <label htmlFor="banner_image-change">
                        <Button
                          variant="contained"
                          component="span"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ backgroundColor: 'primary.main' }}
                        >

                        </Button>
                      </label>

                      {/* REMOVE BUTTON */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile('banner_image')}
                        startIcon={<CloseIcon />}
                      >

                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} sm={4}>
                <CustomFormLabel htmlFor="pan_number">
                  PAN Number / Driving License Number
                </CustomFormLabel>
                <CustomTextField
                  id="pan_number"
                  name="pan_number"
                  value={form.pan_number}
                  onChange={handleChange}
                  placeholder="Enter PAN Number or Driving License Number"
                  fullWidth
                  // error={form.pan_number && !validatePAN(form.pan_number)}
                  helperText={
                    form.pan_number && !validatePAN(form.pan_number)
                      ? 'Invalid PAN format (e.g., ABCDE1234F)'
                      : 'Format: 5 letters + 4 digits + 1 letter'
                  }

                />
              </Grid>
              {/* PAN Card Front */}
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
                  <Box sx={{ position: 'relative', width: '100%', height: 150, mt: 2 }}>
                    <img
                      src={previews.pan_card_front}
                      alt="PAN Front Preview"
                      style={{ height: 150, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    {/* OVERLAY BUTTONS */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: '4px',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* CHANGE BUTTON */}
                      <input
                        accept="image/jpeg,image/png,application/pdf"
                        style={{ display: 'none' }}
                        id="pan_card_front-change"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'pan_card_front')}
                      />
                      <label htmlFor="pan_card_front-change">
                        <Button
                          variant="contained"
                          component="span"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ backgroundColor: 'primary.main' }}
                        >

                        </Button>
                      </label>

                      {/* REMOVE BUTTON */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile('pan_card_front')}
                        startIcon={<CloseIcon />}
                      >

                      </Button>
                    </Box>
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
                  <Box sx={{ position: 'relative', width: '100%', height: 150, mt: 2 }}>
                    <img
                      src={previews.pan_card_back}
                      alt="PAN Back Preview"
                      style={{ height: 150, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    {/* OVERLAY BUTTONS */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: '4px',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* CHANGE BUTTON */}
                      <input
                        accept="image/jpeg,image/png,application/pdf"
                        style={{ display: 'none' }}
                        id="pan_card_back-change"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'pan_card_back')}
                      />
                      <label htmlFor="pan_card_back-change">
                        <Button
                          variant="contained"
                          component="span"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ backgroundColor: 'primary.main' }}
                        >

                        </Button>
                      </label>

                      {/* REMOVE BUTTON */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile('pan_card_back')}
                        startIcon={<CloseIcon />}
                      >

                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} sm={4}>
                <CustomFormLabel htmlFor="aadhar_number">Aadhaar Number</CustomFormLabel>
                <CustomTextField
                  id="aadhar_number"
                  name="aadhar_number"
                  value={form.aadhar_number}
                  onChange={handleChange}
                  placeholder="Enter Aadhaar Number"
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
                  <Box sx={{ position: 'relative', width: '100%', height: 150, mt: 2 }}>
                    <img
                      src={previews.aadhar_card_front}
                      alt="Aadhar Front Preview"
                      style={{ height: 150, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    {/* OVERLAY BUTTONS */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: '4px',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* CHANGE BUTTON */}
                      <input
                        accept="image/jpeg,image/png,application/pdf"
                        style={{ display: 'none' }}
                        id="aadhar_card_front-change"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'aadhar_card_front')}
                      />
                      <label htmlFor="aadhar_card_front-change">
                        <Button
                          variant="contained"
                          component="span"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ backgroundColor: 'primary.main' }}
                        >

                        </Button>
                      </label>

                      {/* REMOVE BUTTON */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile('aadhar_card_front')}
                        startIcon={<CloseIcon />}
                      >

                      </Button>
                    </Box>
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
                  <Box sx={{ position: 'relative', width: '100%', height: 150, mt: 2 }}>
                    <img
                      src={previews.aadhar_card_back}
                      alt="Aadhar Back Preview"
                      style={{ height: 150, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    {/* OVERLAY BUTTONS */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: '4px',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* CHANGE BUTTON */}
                      <input
                        accept="image/jpeg,image/png,application/pdf"
                        style={{ display: 'none' }}
                        id="aadhar_card_back-change"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'aadhar_card_back')}
                      />
                      <label htmlFor="aadhar_card_back-change">
                        <Button
                          variant="contained"
                          component="span"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ backgroundColor: 'primary.main' }}
                        >

                        </Button>
                      </label>

                      {/* REMOVE BUTTON */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile('aadhar_card_back')}
                        startIcon={<CloseIcon />}
                      >

                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="gas_bill_number">
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
                  <Box sx={{ position: 'relative', width: '100%', height: 150, mt: 2 }}>
                    <img
                      src={previews.gas_bill}
                      alt="Gas Bill Preview"
                      style={{ height: 150, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    {/* OVERLAY BUTTONS */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: '4px',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* CHANGE BUTTON */}
                      <input
                        accept="image/jpeg,image/png,application/pdf"
                        style={{ display: 'none' }}
                        id="gas_bill-change"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'gas_bill')}
                      />
                      <label htmlFor="gas_bill-change">
                        <Button
                          variant="contained"
                          component="span"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ backgroundColor: 'primary.main' }}
                        >

                        </Button>
                      </label>

                      {/* REMOVE BUTTON */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile('gas_bill')}
                        startIcon={<CloseIcon />}
                      >
                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="business_number">
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
                  <Box sx={{ position: 'relative', width: '100%', height: 150, mt: 2 }}>
                    <img
                      src={previews.business_proof}
                      alt="Business Proof Preview"
                      style={{ height: 150, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    {/* OVERLAY BUTTONS */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: '4px',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* CHANGE BUTTON */}
                      <input
                        accept="image/jpeg,image/png,application/pdf"
                        style={{ display: 'none' }}
                        id="business_proof-change"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'business_proof')}
                      />
                      <label htmlFor="business_proof-change">
                        <Button
                          variant="contained"
                          component="span"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ backgroundColor: 'primary.main' }}
                        >

                        </Button>
                      </label>

                      {/* REMOVE BUTTON */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile('business_proof')}
                        startIcon={<CloseIcon />}
                      >

                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="gst_number">GST Number</CustomFormLabel>
                <CustomTextField
                  id="gst_number"
                  name="gst_number"
                  value={form.gst_number}
                  onChange={handleChange}
                  placeholder="Enter GST Number"
                  fullWidth

                  inputProps={{ maxLength: 15 }}
                  // error={form.gst_number && !validateGST(form.gst_number)}
                  helperText={
                    form.gst_number && !validateGST(form.gst_number)
                      ? 'Invalid GST format'
                      : `${form.gst_number.length}/15 characters`
                  }
                />
              </Grid>
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
                  <Box sx={{ position: 'relative', width: '100%', height: 150, mt: 2 }}>
                    <img
                      src={previews.gst_bill}
                      alt="GST Bill Preview"
                      style={{ height: 150, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    {/* OVERLAY BUTTONS */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: '4px',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* CHANGE BUTTON */}
                      <input
                        accept="image/jpeg,image/png,application/pdf"
                        style={{ display: 'none' }}
                        id="gst_bill-change"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'gst_bill')}
                      />
                      <label htmlFor="gst_bill-change">
                        <Button
                          variant="contained"
                          component="span"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ backgroundColor: 'primary.main' }}
                        >

                        </Button>
                      </label>

                      {/* REMOVE BUTTON */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile('gst_bill')}
                        startIcon={<CloseIcon />}
                      >

                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>

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
                  <Box sx={{ position: 'relative', width: '100%', height: 150, mt: 2 }}>
                    <img
                      src={previews.bill_sample}
                      alt="Bill Sample Preview"
                      style={{ height: 150, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    {/* OVERLAY BUTTONS */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: '4px',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* CHANGE BUTTON */}
                      <input
                        accept="image/jpeg,image/png"
                        style={{ display: 'none' }}
                        id="bill_sample-change"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'bill_sample')}
                      />
                      <label htmlFor="bill_sample-change">
                        <Button
                          variant="contained"
                          component="span"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ backgroundColor: 'primary.main' }}
                        >

                        </Button>
                      </label>

                      {/* REMOVE BUTTON */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile('bill_sample')}
                        startIcon={<CloseIcon />}
                      >

                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>


              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="business_card">
                  Business Card
                </CustomFormLabel>

                {!previews.business_card ? (
                  <FileInputContainer>
                    <input
                      accept="image/jpeg,image/png,application/pdf"
                      style={{ display: 'none' }}
                      id="business_card"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'business_card')}
                    />
                    <label htmlFor="business_card">
                      <Button variant="outlined" component="span">
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" mt={1}>
                      Upload JPG, PNG, or PDF
                    </Typography>
                  </FileInputContainer>
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: 150, mt: 2 }}>
                    <img
                      src={previews.business_card}
                      alt="Business Card Preview"
                      style={{ height: 150, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    {/* OVERLAY BUTTONS */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: '4px',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* CHANGE BUTTON */}
                      <input
                        accept="image/jpeg,image/png,application/pdf"
                        style={{ display: 'none' }}
                        id="business_card-change"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'business_card')}
                      />
                      <label htmlFor="business_card-change">
                        <Button
                          variant="contained"
                          component="span"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ backgroundColor: 'primary.main' }}
                        >

                        </Button>
                      </label>

                      {/* REMOVE BUTTON */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile('business_card')}
                        startIcon={<CloseIcon />}
                      >

                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>
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
                          width: 120,
                          height: 120
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

                        {/* OVERLAY BUTTONS FOR EACH IMAGE */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                            borderRadius: '4px',
                            '&:hover': {
                              opacity: 1
                            }
                          }}
                        >
                          {/* REMOVE BUTTON */}
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => removeBusinessImage(index)}
                            startIcon={<CloseIcon />}
                            sx={{ fontSize: '0.75rem' }}
                          >

                          </Button>
                        </Box>
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
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="otherrDocumentImage">
                  Other Document Image
                </CustomFormLabel>

                {!previews.otherrDocumentImage ? (
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
                ) : (
                  <Box sx={{ position: 'relative', width: '100%', height: 150, mt: 2 }}>
                    <img
                      src={previews.otherrDocumentImage}
                      alt="Other Document Preview"
                      style={{ height: 150, width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    {/* OVERLAY BUTTONS */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: '4px',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* CHANGE BUTTON */}
                      <input
                        accept="image/jpeg,image/png,application/pdf"
                        style={{ display: 'none' }}
                        id="otherrDocumentImage-change"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'otherrDocumentImage')}
                      />
                      <label htmlFor="otherrDocumentImage-change">
                        <Button
                          variant="contained"
                          component="span"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ backgroundColor: 'primary.main' }}
                        >

                        </Button>
                      </label>

                      {/* REMOVE BUTTON */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile('otherrDocumentImage')}
                        startIcon={<CloseIcon />}
                      >

                      </Button>
                    </Box>
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
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="metakeywords"

                  id="metakeywords"
                  name="metakeywords"
                >
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
      libraries={libraries}
      onLoad={() => setScriptLoaded(true)}
    >
      <PageContainer
        title="Edit Store"
        description="Manage Edit Store for your e-commerce platform"
      >
        <Breadcrumb title="Edit Store" items={BCrumb} />
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
        <ParentCard title="Edit Store">
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
                  Store updated successfully! All steps completed.
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
                  Edit Another Store
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
                        ? 'Update Store'
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

export default EditStore;

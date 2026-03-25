import React, { useState, useEffect, useCallback } from 'react';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import ParentCard from '../../../components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { IconArrowBackUp } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import { URLS } from '../../../Url';
import axios from 'axios';
import {
  Button,
  Select,
  MenuItem,
  Box,
  Grid,
  CircularProgress,
  Checkbox,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Add CRM Booking' }];

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const AddressCard = styled(Card)(({ theme, selected }) => ({
  border: selected
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
  },
}));

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`booking-tabpanel-${index}`}
    aria-labelledby={`booking-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const libraries = ['places'];

const AddCrmBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [autocomplete, setAutocomplete] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [showManualAddress, setShowManualAddress] = useState(false);

  // Customer Details
  const [customerForm, setCustomerForm] = useState({
    customerName: '',
    email: '',
    mobileNumber: '',
    alternateNumber: '',
    address: {
      countryName: '',
      stateName: '',
      cityName: '',
      area: '',
      flat: '',
      postalCode: '',
      addressLineOne: '',
      addressLineTwo: '',
      type: 'Home',
      latitude: '',
      longitude: '',
      _id: '',
      defaultAddress: false,
    },
  });

  // Service Details
  const [serviceForm, setServiceForm] = useState({
    categoryId: '',
    subcategoryId: '',
    serviceId: '',
    selectedRateCards: [],
    totalAmount: 0,
    sourceOfLead: '',
    bookedDate: '',
    bookedTime: '',
    additionalInfo: '',
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [services, setServices] = useState([]);
  const [rateCards, setRateCards] = useState([]);
  const [zones, setZones] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  const getToken = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.token || '' : '';
  }, []);

  useEffect(() => {
    if (window.google) {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (customerForm.mobileNumber.length === 10) {
        const token = getToken();
        if (!token) return;

        try {
          const response = await axios.post(
            URLS.GetUserDetailsByPhone,
            { phone: customerForm.mobileNumber },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          if (response.data && response.data.data) {
            const user = response.data.data;
            const addresses = response.data.addresses || [];

            setUserDetails(user);
            setUserAddresses(addresses);

            // Set customer form with user details
            setCustomerForm((prev) => ({
              ...prev,
              customerName: user.name || '',
              email: user.email || user.phone || '',
              alternateNumber: user.alternatePhone || '',
            }));

            // If there are addresses, select the default one or first one
            if (addresses.length > 0) {
              const defaultAddressIndex = addresses.findIndex(
                (addr) => addr.defaultAddress === true,
              );
              const addressToUse =
                defaultAddressIndex !== -1 ? addresses[defaultAddressIndex] : addresses[0];

              setSelectedAddressIndex(defaultAddressIndex !== -1 ? defaultAddressIndex : 0);
              setCustomerForm((prev) => ({
                ...prev,
                address: {
                  ...prev.address,
                  ...addressToUse,
                  countryName: addressToUse.countryName || 'India',
                },
              }));

              // Hide manual address section when existing address is selected
              setShowManualAddress(false);

              // Fetch zones for the selected address
              if (addressToUse.latitude && addressToUse.longitude) {
                fetchZones(addressToUse.latitude, addressToUse.longitude, addressToUse.cityName);
              }

              if (addresses.length > 1) {
                toast.info(
                  `${addresses.length} addresses found for this user. You can select different address.`,
                );
              } else {
                toast.success('User details and address loaded successfully!');
              }
            } else {
              setSelectedAddressIndex(-1);
              setShowManualAddress(true);
              toast.info('No existing addresses found. Please enter address manually.');
            }
          }
        } catch (error) {
          setUserDetails(null);
          setUserAddresses([]);
          setSelectedAddressIndex(-1);
          setShowManualAddress(true);
        }
      } else {
        // Reset if mobile number is not 10 digits
        setUserDetails(null);
        setUserAddresses([]);
        setSelectedAddressIndex(-1);
        setShowManualAddress(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      if (customerForm.mobileNumber.length === 10) {
        fetchUserDetails();
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [customerForm.mobileNumber, getToken]);

  // Fetch zones based on coordinates
  const fetchZones = async (lat, lng, cityName) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.post(
        URLS.GetZonesbylocation,
        {
          lat: lat,
          lng: lng,
          cityName: cityName,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setZones(response.data.zone || []);
    } catch (error) {
      console.error('Failed to fetch zones:', error);
      toast.error('Failed to fetch zones');
    }
  };

  // Fetch categories based on zone
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     if (zones && zones._id) {
  //       const token = getToken();
  //       if (!token) return;

  //       try {
  //         const response = await axios.post(
  //           URLS.GetDemandCategory,
  //           { zoneId: zones._id },
  //           { headers: { Authorization: `Bearer ${token}` } },
  //         );
  //         setCategories(response.data.categories || []);
  //       } catch (error) {
  //         toast.error('Failed to fetch categories');
  //       }
  //     }
  //   };

  //   fetchCategories();
  // }, [zones, getToken]);

  // Update the fetchCategories useEffect:

useEffect(() => {
  const fetchCategories = async () => {
    const token = getToken();
    if (!token) return;

    setCategoriesLoading(true);
    try {
      const response = await axios.post(
        URLS.GetDemandCategory,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Categories API Response:', response.data); // Debug log

      // CORRECTED: API returns data in 'ondemandcategorys' field, not 'subcategories'
      if (response.data.success && response.data.ondemandcategorys) {
        // Filter only active and published categories
        const activeCategories = response.data.ondemandcategorys.filter(
          cat => cat.isPublish === true && cat.status === 'active'
        );
        
        setCategories(activeCategories);
        console.log('Loaded categories:', activeCategories.length); // Debug log
      } else {
        setCategories([]);
        toast.error('No categories found');
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
      toast.error('Failed to fetch categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  fetchCategories();
}, [getToken]);


  // Fetch subcategories when category and zone change
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (serviceForm.categoryId && zones && zones._id) {
        const token = getToken();
        try {
          const response = await axios.post(
            URLS.GetOnDemandSubCategorybyZoneId,
            {
              zoneId: zones._id,
              categoryId: serviceForm.categoryId,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setSubcategories(response.data.subcategories || []);
        } catch (error) {
          toast.error('Failed to fetch subcategories');
        }
      } else {
        setSubcategories([]);
      }
    };

    fetchSubcategories();
  }, [serviceForm.categoryId, zones, getToken]);

  // Fetch services when subcategory and zone change
  useEffect(() => {
    const fetchServices = async () => {
      if (serviceForm.subcategoryId && zones && zones._id) {
        const token = getToken();
        try {
          const response = await axios.post(
            URLS.GetOnDemandServicesbyZoneId,
            {
              zoneId: zones._id,
              subcategoryId: serviceForm.subcategoryId,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setServices(response.data.data || []);
        } catch (error) {
          toast.error('Failed to fetch services');
        }
      } else {
        setServices([]);
      }
    };

    fetchServices();
  }, [serviceForm.subcategoryId, zones, getToken]);

  // Fetch rate cards when service changes
  useEffect(() => {
    const fetchRateCards = async () => {
      if (serviceForm.serviceId) {
        const token = getToken();
        try {
          const response = await axios.post(
            URLS.GetServiceRateCards,
            {
              serviceId: serviceForm.serviceId,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setRateCards(response.data.data || []);
        } catch (error) {
          toast.error('Failed to fetch rate cards');
        }
      } else {
        setRateCards([]);
        setServiceForm((prev) => ({ ...prev, selectedRateCards: [], totalAmount: 0 }));
      }
    };

    fetchRateCards();
  }, [serviceForm.serviceId, getToken]);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRateCardSelection = (rateCard) => {
    setServiceForm((prev) => {
      const exists = prev.selectedRateCards.some((rc) => rc._id === rateCard._id);

      return {
        ...prev,
        selectedRateCards: exists
          ? prev.selectedRateCards.filter((rc) => rc._id !== rateCard._id)
          : [
              ...prev.selectedRateCards,
              {
                _id: rateCard._id,
                rateCardTitle: rateCard.rateCardTitle,
                rateCardPrice: rateCard.rateCardPrice,
              },
            ],
      };
    });
  };

  useEffect(() => {
    const total = serviceForm.selectedRateCards.reduce(
      (sum, rc) => sum + (Number(rc.rateCardPrice) || 0),
      0,
    );
    setServiceForm((prev) => ({ ...prev, totalAmount: total }));
  }, [serviceForm.selectedRateCards]);

  const handleAddressSelect = (index) => {
    if (userAddresses[index]) {
      const selectedAddress = userAddresses[index];
      setSelectedAddressIndex(index);
      setCustomerForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          ...selectedAddress,
          countryName: selectedAddress.countryName || 'India',
        },
      }));

      // Hide manual address section when existing address is selected
      setShowManualAddress(false);

      // Fetch zones for the selected address
      if (selectedAddress.latitude && selectedAddress.longitude) {
        fetchZones(selectedAddress.latitude, selectedAddress.longitude, selectedAddress.cityName);
      }

      setAddressDialogOpen(false);
      toast.success('Address selected successfully!');
    }
  };

  const handleAddNewAddress = () => {
    // Reset address form and show manual address section
    setCustomerForm((prev) => ({
      ...prev,
      address: {
        countryName: '',
        stateName: '',
        cityName: '',
        area: '',
        flat: '',
        postalCode: '',
        addressLineOne: '',
        addressLineTwo: '',
        type: 'Home',
        latitude: '',
        longitude: '',
        _id: '',
        defaultAddress: false,
      },
    }));
    setSelectedAddressIndex(-1);
    setShowManualAddress(true);
    setAddressDialogOpen(false);
    toast.info('Please enter new address details manually.');
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.address_components) {
        const addressComponents = place.address_components;
        const geometry = place.geometry.location;

        let country = '',
          state = '',
          city = '',
          postalCode = '',
          area = '';

        addressComponents.forEach((component) => {
          const types = component.types;
          if (types.includes('country')) {
            country = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
          if (types.includes('locality')) {
            city = component.long_name;
          }
          if (types.includes('postal_code')) {
            postalCode = component.long_name;
          }
          if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
            area = component.long_name;
          }
        }); 

        setCustomerForm((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            countryName: country,
            stateName: state,
            cityName: city,
            area: area,
            postalCode: postalCode,
            addressLineOne: place.formatted_address || '',
            latitude: geometry.lat().toString(),
            longitude: geometry.lng().toString(),
            _id: '',
            defaultAddress: false,
          },
        }));

        // Reset selected address index when manually entering address
        setSelectedAddressIndex(-1);
        setShowManualAddress(true);

        // Fetch zones based on new coordinates
        fetchZones(geometry.lat(), geometry.lng(), city);
      }
    }
  };

  const onLoad = (autoC) => {
    setAutocomplete(autoC);
  };

  const validateCustomerTab = () => {
    const requiredFields = [
      !customerForm.customerName && 'Customer Name',
      !customerForm.email && 'Email',
      !customerForm.mobileNumber && 'Mobile Number',
      !customerForm.address.addressLineOne && 'Address',
    ].filter(Boolean);

    if (requiredFields.length) {
      toast.error(`Missing: ${requiredFields.join(', ')}`);
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerForm.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(customerForm.mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }

    return true;
  };

  const validateServiceTab = () => {
    const requiredFields = [
      !serviceForm.categoryId && 'Category',
      !serviceForm.subcategoryId && 'Subcategory',
      !serviceForm.serviceId && 'Service',
      serviceForm.selectedRateCards.length === 0 && 'At least one Rate Card',
      !serviceForm.sourceOfLead && 'Source of Lead',
    ].filter(Boolean);

    if (requiredFields.length) {
      toast.error(`Missing: ${requiredFields.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleTabChange = (event, newValue) => {
    if (newValue === 1 && !validateCustomerTab()) {
      return;
    }
    setActiveTab(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCustomerTab() || !validateServiceTab()) {
      return;
    }

    const token = getToken();

    const bookingData = {
      name: customerForm.customerName,
      email: customerForm.email,
      phone: customerForm.mobileNumber,
      altPhone: customerForm.alternateNumber,
      area: customerForm.address.area,
      flat: customerForm.address.flat,
      postalCode: customerForm.address.postalCode,
      addressLineOne: customerForm.address.addressLineOne,
      addressLineTwo: customerForm.address.addressLineTwo,
      latitude: customerForm.address.latitude,
      longitude: customerForm.address.longitude,
      type: customerForm.address.type,
      serviceAddressId: customerForm.address._id,
      zoneId: zones._id,
      defaultAddress: customerForm.address.defaultAddress,
      stateName: customerForm.address.stateName,
      cityName: customerForm.address.cityName,
      countryName: customerForm.address.countryName,
      categoryId: serviceForm.categoryId,
      subcategoryId: serviceForm.subcategoryId,
      serviceId: serviceForm.serviceId,
      ratecardDetails: serviceForm.selectedRateCards,
      amount: serviceForm.totalAmount,
      sourceOfLead: serviceForm.sourceOfLead,
      bookedDate: serviceForm.bookedDate,
      bookedTime: serviceForm.bookedTime,
      addMoreInfo: serviceForm.additionalInfo,
    };

    setLoading(true);
    try {
      const res = await axios.post(URLS.AddCrmBooking, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        toast.success('Booking created successfully!');
        navigate('/ondemandservice/verified-partners-crm/accepted');
      }
    } catch (error) {
      const message =
        error.response?.status === 400
          ? 'Unauthorized access. Please log in again.'
          : error.response?.data?.message || 'Failed to create booking.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBNVn5j-M6F4VHkaOluoOcVY3K5r2-NlPk"
      libraries={libraries}
      onLoad={() => setScriptLoaded(true)}
    >
      <PageContainer title="Add CRM Booking">
        <Breadcrumb title="Add CRM Booking" items={BCrumb} />
        <ToastContainer position="top-right" autoClose={3000} />
        <Box sx={{ float: 'right', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
            startIcon={<IconArrowBackUp />}
            disabled={loading}
          >
            Back
          </Button>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Customer Details" />
          <Tab label="Service Details" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          {/* Customer Details Tab */}
          <TabPanel value={activeTab} index={0}>
            <ParentCard title="Customer Information">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="mobileNumber" required>
                    Whats App Number *
                  </CustomFormLabel>
                  <CustomTextField
                    id="mobileNumber"
                    name="mobileNumber"
                    value={customerForm.mobileNumber}
                    onChange={handleCustomerChange}
                    placeholder="Enter your 10-digit mobile number"
                    inputProps={{ maxLength: 10 }}
                    fullWidth
                    required
                  />
                  {userDetails && (
                    <Typography variant="caption" color="success.main">
                      Ã¢Å“â€œ User details loaded from existing records
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="alternateNumber">Alternate Number</CustomFormLabel>
                  <CustomTextField
                    id="alternateNumber"
                    name="alternateNumber"
                    value={customerForm.alternateNumber}
                    onChange={handleCustomerChange}
                    placeholder="Alternate mobile number"
                    inputProps={{ maxLength: 10 }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="customerName" required>
                    Customer Name *
                  </CustomFormLabel>
                  <CustomTextField
                    id="customerName"
                    name="customerName"
                    value={customerForm.customerName}
                    onChange={handleCustomerChange}
                    placeholder="Enter customer name"
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="email" required>
                    Email Address *
                  </CustomFormLabel>
                  <CustomTextField
                    id="email"
                    name="email"
                    type="email"
                    value={customerForm.email}
                    onChange={handleCustomerChange}
                    placeholder="customer@example.com"
                    fullWidth
                    required
                  />
                </Grid>

                {/* Address Selection Section - Only show if user has addresses */}
                {userAddresses.length > 0 && !showManualAddress && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">
                          Select Existing Address ({userAddresses.length} available)
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setAddressDialogOpen(true)}
                          >
                            View All Addresses
                          </Button>
                          <Button
                            variant="text"
                            size="small"
                            color="primary"
                            onClick={handleAddNewAddress}
                          >
                            Add New Address
                          </Button>
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        {userAddresses.slice(0, 2).map((address, index) => (
                          <Grid item xs={12} md={6} key={address._id}>
                            <AddressCard
                              selected={selectedAddressIndex === index}
                              onClick={() => handleAddressSelect(index)}
                            >
                              <CardContent>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {address.name || customerForm.customerName}
                                  </Typography>
                                  {address.defaultAddress && (
                                    <Chip label="Default" color="primary" size="small" />
                                  )}
                                  {selectedAddressIndex === index && (
                                    <Chip label="Selected" color="success" size="small" />
                                  )}
                                </Box>
                                <Typography variant="body2" color="textSecondary">
                                  {address.flat}, {address.addressLineOne}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {address.area}, {address.cityName} - {address.postalCode}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {address.stateName}, {address.countryName || 'India'}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  Type: {address.type}
                                </Typography>
                              </CardContent>
                            </AddressCard>
                          </Grid>
                        ))}
                      </Grid>

                      {userAddresses.length > 2 && (
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => setAddressDialogOpen(true)}
                          >
                            + {userAddresses.length - 2} more addresses
                          </Button>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                )}

                {/* Manual Address Section - Show when adding new address or no existing addresses */}
                {showManualAddress && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Chip label="Enter New Address" color="primary" />
                      </Divider>
                    </Grid>

                    <Grid item xs={12}>
                      <CustomFormLabel htmlFor="address-search" required>
                        Search Location *
                      </CustomFormLabel>
                      {scriptLoaded && (
                        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                          <TextField
                            fullWidth
                            placeholder="Enter complete address to auto-fill location details"
                            variant="outlined"
                          />
                        </Autocomplete>
                      )}
                      <Typography variant="caption" color="textSecondary">
                        Start typing to search for your location
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="countryName" required>
                        Country *
                      </CustomFormLabel>
                      <CustomTextField
                        id="countryName"
                        name="countryName"
                        value={customerForm.address.countryName}
                        onChange={handleAddressChange}
                        placeholder="Country"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="stateName" required>
                        State *
                      </CustomFormLabel>
                      <CustomTextField
                        id="stateName"
                        name="stateName"
                        value={customerForm.address.stateName}
                        onChange={handleAddressChange}
                        placeholder="State"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="cityName" required>
                        City *
                      </CustomFormLabel>
                      <CustomTextField
                        id="cityName"
                        name="cityName"
                        value={customerForm.address.cityName}
                        onChange={handleAddressChange}
                        placeholder="City"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="area" required>
                        Area/Zone *
                      </CustomFormLabel>
                      <CustomTextField
                        id="area"
                        name="area"
                        value={customerForm.address.area}
                        onChange={handleAddressChange}
                        placeholder="Area or Zone"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="postalCode" required>
                        Postal Code *
                      </CustomFormLabel>
                      <CustomTextField
                        id="postalCode"
                        name="postalCode"
                        value={customerForm.address.postalCode}
                        onChange={handleAddressChange}
                        placeholder="Postal Code"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="flat">Flat/Building No.</CustomFormLabel>
                      <CustomTextField
                        id="flat"
                        name="flat"
                        value={customerForm.address.flat}
                        onChange={handleAddressChange}
                        placeholder="Flat/Building Number"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <CustomFormLabel htmlFor="addressLineOne" required>
                        Address Line 1 *
                      </CustomFormLabel>
                      <CustomTextField
                        id="addressLineOne"
                        name="addressLineOne"
                        value={customerForm.address.addressLineOne}
                        onChange={handleAddressChange}
                        placeholder="Street address, P.O. box, company name"
                        fullWidth
                        required
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <CustomFormLabel htmlFor="addressLineTwo">Address Line 2</CustomFormLabel>
                      <CustomTextField
                        id="addressLineTwo"
                        name="addressLineTwo"
                        value={customerForm.address.addressLineTwo}
                        onChange={handleAddressChange}
                        placeholder="Apartment, suite, unit, building, floor, etc."
                        fullWidth
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="addressType">Address Type</CustomFormLabel>
                      <CustomSelect
                        id="addressType"
                        name="type"
                        value={customerForm.address.type}
                        onChange={handleAddressChange}
                        fullWidth
                      >
                        <MenuItem value="Home">Home</MenuItem>
                        <MenuItem value="Office">Office</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </CustomSelect>
                    </Grid>
                  </>
                )}

                {customerForm.address.latitude && customerForm.address.longitude && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        {zones && zones._id && (
                          <Typography variant="body2" color="primary">
                            Zone: {zones.name || zones._id}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                  <Button variant="contained" color="primary" onClick={() => setActiveTab(1)}>
                    Next: Service Details
                  </Button>
                </Grid>
              </Grid>
            </ParentCard>
          </TabPanel>

          {/* Service Details Tab */}
          <TabPanel value={activeTab} index={1}>
            <ParentCard title="Service Selection">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="categoryId" required>
                    Category *
                  </CustomFormLabel>
                  <CustomSelect
                    id="categoryId"
                    name="categoryId"
                    value={serviceForm.categoryId}
                    onChange={handleServiceChange}
                    fullWidth
                    required
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="subcategoryId" required>
                    Subcategory *
                  </CustomFormLabel>
                  <CustomSelect
                    id="subcategoryId"
                    name="subcategoryId"
                    value={serviceForm.subcategoryId}
                    onChange={handleServiceChange}
                    fullWidth
                    required
                    disabled={!serviceForm.categoryId}
                  >
                    <MenuItem value="">Select Subcategory</MenuItem>
                    {subcategories.map((sub) => (
                      <MenuItem key={sub._id} value={sub._id}>
                        {sub.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="serviceId" required>
                    Service *
                  </CustomFormLabel>
                  <CustomSelect
                    id="serviceId"
                    name="serviceId"
                    value={serviceForm.serviceId}
                    onChange={handleServiceChange}
                    fullWidth
                    required
                    disabled={!serviceForm.subcategoryId}
                  >
                    <MenuItem value="">Select Service</MenuItem>
                    {services.map((service) => (
                      <MenuItem key={service._id} value={service._id}>
                        {service.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="sourceOfLead" required>
                    Source of Lead *
                  </CustomFormLabel>
                  <CustomSelect
                    id="sourceOfLead"
                    name="sourceOfLead"
                    value={serviceForm.sourceOfLead}
                    onChange={handleServiceChange}
                    fullWidth
                    required
                  >
                    <MenuItem value="">Select Source</MenuItem>
                    <MenuItem value="whatsapp">WhatsApp</MenuItem>
                    <MenuItem value="call">Phone Call</MenuItem>
                    <MenuItem value="website">Website</MenuItem>
                    <MenuItem value="walkin">Walk-in</MenuItem>
                    <MenuItem value="referral">Referral</MenuItem>
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="bookedDate" required>
                    Booked Date *
                  </CustomFormLabel>
                  <CustomTextField
                    id="bookedDate"
                    type="date"
                    name="bookedDate"
                    value={serviceForm.bookedDate}
                    onChange={handleServiceChange}
                    placeholder="bookedDate"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="bookedTime" required>
                    Booked Time *
                  </CustomFormLabel>
                  <CustomTextField
                    id="bookedTime"
                    type="time"
                    name="bookedTime"
                    value={serviceForm.bookedTime}
                    onChange={handleServiceChange}
                    placeholder="bookedTime"
                    fullWidth
                    required
                  />
                </Grid>
                {rateCards.length > 0 && (
                  <Grid item xs={12}>
                    <CustomFormLabel required>Select Rate Cards *</CustomFormLabel>
                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Select</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Price (Ã¢â€šÂ¹)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rateCards.map((rateCard) => (
                            <TableRow key={rateCard._id} hover>
                              <TableCell>
                                <Checkbox
                                  checked={serviceForm.selectedRateCards.some(
                                    (rc) => rc._id === rateCard._id,
                                  )}
                                  onChange={() => handleRateCardSelection(rateCard)}
                                />
                              </TableCell>
                              <TableCell>{rateCard.rateCardTitle}</TableCell>
                              <TableCell>
                                Ã¢â€šÂ¹{Number(rateCard.rateCardPrice).toLocaleString('en-IN')}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <CustomFormLabel>Total Amount</CustomFormLabel>
                  <TextField
                    value={`Ã¢â€šÂ¹${serviceForm.totalAmount.toLocaleString('en-IN')}`}
                    fullWidth
                    disabled
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="additionalInfo">Additional Information</CustomFormLabel>
                  <CustomTextField
                    id="additionalInfo"
                    name="additionalInfo"
                    value={serviceForm.additionalInfo}
                    onChange={handleServiceChange}
                    placeholder="Any additional information about the booking..."
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="outlined" onClick={() => setActiveTab(0)}>
                    Back to Customer Details
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Creating Booking...' : 'Create Booking'}
                  </Button>
                </Grid>
              </Grid>
            </ParentCard>
          </TabPanel>
        </form>

        {/* Address Selection Dialog */}
        <Dialog
          open={addressDialogOpen}
          onClose={() => setAddressDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Select Address
            <Typography variant="subtitle1" color="textSecondary">
              {userAddresses.length} addresses found for {customerForm.customerName}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {userAddresses.map((address, index) => (
                <Grid item xs={12} key={address._id}>
                  <AddressCard
                    selected={selectedAddressIndex === index}
                    onClick={() => handleAddressSelect(index)}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">
                          {address.name || customerForm.customerName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {address.defaultAddress && (
                            <Chip label="Default" color="primary" size="small" />
                          )}
                          {selectedAddressIndex === index && (
                            <Chip label="Currently Selected" color="success" size="small" />
                          )}
                        </Box>
                      </Box>
                      <Typography variant="body1" gutterBottom>
                        {address.flat}, {address.addressLineOne}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {address.addressLineTwo}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {address.area}, {address.cityName} - {address.postalCode}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {address.stateName}, {address.countryName || 'India'}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 1,
                        }}
                      >
                        <Typography variant="caption" color="textSecondary">
                          Type: {address.type}
                        </Typography>
                        <Button
                          variant={selectedAddressIndex === index ? 'contained' : 'outlined'}
                          size="small"
                        >
                          {selectedAddressIndex === index ? 'Selected' : 'Select This Address'}
                        </Button>
                      </Box>
                    </CardContent>
                  </AddressCard>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between' }}>
            <Button variant="outlined" color="primary" onClick={handleAddNewAddress}>
              Add New Address
            </Button>
            <Button onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </PageContainer>
    </LoadScript>
  );
};

export default AddCrmBooking;




// import React, { useState, useEffect, useCallback } from 'react';
// import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
// import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
// import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
// import PageContainer from 'src/components/container/PageContainer';
// import { LoadScript, Autocomplete } from '@react-google-maps/api';
// import ParentCard from '../../../components/shared/ParentCard';
// import { toast, ToastContainer } from 'react-toastify';
// import { IconArrowBackUp } from '@tabler/icons-react';
// import { useNavigate } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
// import { styled } from '@mui/material/styles';
// import { URLS } from '../../../Url';
// import axios from 'axios';
// import {
//   Button,
//   Select,
//   MenuItem,
//   Box,
//   Grid,
//   CircularProgress,
//   Checkbox,
//   Tabs,
//   Tab,
//   Card,
//   CardContent,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Chip,
//   Divider,
//   Avatar,
// } from '@mui/material';

// const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Add CRM Booking' }];

// const API_BASE = 'http://192.168.0.5:5013/v1/dhubApi/admin';

// const CustomSelect = styled(Select)({
//   '& .MuiOutlinedInput-root': {
//     borderRadius: '8px',
//   },
// });

// const AddressCard = styled(Card)(({ theme, selected }) => ({
//   border: selected
//     ? `2px solid ${theme.palette.primary.main}`
//     : `1px solid ${theme.palette.divider}`,
//   cursor: 'pointer',
//   transition: 'all 0.2s ease-in-out',
//   '&:hover': {
//     borderColor: theme.palette.primary.main,
//     boxShadow: theme.shadows[4],
//   },
// }));

// const TabPanel = ({ children, value, index, ...other }) => (
//   <div
//     role="tabpanel"
//     hidden={value !== index}
//     id={`booking-tabpanel-${index}`}
//     aria-labelledby={`booking-tab-${index}`}
//     {...other}
//   >
//     {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//   </div>
// );

// const libraries = ['places'];

// const AddCrmBooking = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);
//   const [autocomplete, setAutocomplete] = useState(null);
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const [showManualAddress, setShowManualAddress] = useState(false);

//   // Customer Details
//   const [customerForm, setCustomerForm] = useState({
//     customerName: '',
//     email: '',
//     mobileNumber: '',
//     alternateNumber: '',
//     address: {
//       countryName: '',
//       stateName: '',
//       cityName: '',
//       area: '',
//       flat: '',
//       postalCode: '',
//       addressLineOne: '',
//       addressLineTwo: '',
//       type: 'Home',
//       latitude: '',
//       longitude: '',
//       _id: '',
//       defaultAddress: false,
//     },
//   });

//   // Service Details
//   const [serviceForm, setServiceForm] = useState({
//     categoryId: '',
//     subcategoryId: '',
//     childCategoryId: '', // NEW: Child category (service)
//     serviceId: '', // This will be the rate card service ID
//     selectedRateCards: [],
//     totalAmount: 0,
//     sourceOfLead: '',
//     bookedDate: '',
//     bookedTime: '',
//     additionalInfo: '',
//   });

//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [childCategories, setChildCategories] = useState([]); // NEW: Child categories (services)
//   const [services, setServices] = useState([]); // Rate card services
//   const [rateCards, setRateCards] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [userDetails, setUserDetails] = useState(null);
//   const [userAddresses, setUserAddresses] = useState([]);
//   const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
//   const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  
//   // Loading states
//   const [categoriesLoading, setCategoriesLoading] = useState(false);
//   const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
//   const [childCategoriesLoading, setChildCategoriesLoading] = useState(false);
//   const [servicesLoading, setServicesLoading] = useState(false);

//   const getToken = useCallback(() => {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user)?.token || '' : '';
//   }, []);

//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return '';
//     if (imagePath.startsWith('http')) return imagePath;
//     if (imagePath.startsWith('/uploads')) return `${API_BASE.replace('/v1/dhubApi/admin', '')}${imagePath}`;
//     return `${API_BASE.replace('/v1/dhubApi/admin', '')}/${imagePath}`;
//   };

//   useEffect(() => {
//     if (window.google) {
//       setScriptLoaded(true);
//     }
//   }, []);

//   // Fetch user details when mobile number is entered
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       if (customerForm.mobileNumber.length === 10) {
//         const token = getToken();
//         if (!token) return;

//         try {
//           const response = await axios.post(
//             URLS.GetUserDetailsByPhone,
//             { phone: customerForm.mobileNumber },
//             { headers: { Authorization: `Bearer ${token}` } },
//           );

//           if (response.data && response.data.data) {
//             const user = response.data.data;
//             const addresses = response.data.addresses || [];

//             setUserDetails(user);
//             setUserAddresses(addresses);

//             setCustomerForm((prev) => ({
//               ...prev,
//               customerName: user.name || '',
//               email: user.email || user.phone || '',
//               alternateNumber: user.alternatePhone || '',
//             }));

//             if (addresses.length > 0) {
//               const defaultAddressIndex = addresses.findIndex(
//                 (addr) => addr.defaultAddress === true,
//               );
//               const addressToUse =
//                 defaultAddressIndex !== -1 ? addresses[defaultAddressIndex] : addresses[0];

//               setSelectedAddressIndex(defaultAddressIndex !== -1 ? defaultAddressIndex : 0);
//               setCustomerForm((prev) => ({
//                 ...prev,
//                 address: {
//                   ...prev.address,
//                   ...addressToUse,
//                   countryName: addressToUse.countryName || 'India',
//                 },
//               }));

//               setShowManualAddress(false);

//               if (addressToUse.latitude && addressToUse.longitude) {
//                 fetchZones(addressToUse.latitude, addressToUse.longitude, addressToUse.cityName);
//               }

//               if (addresses.length > 1) {
//                 toast.info(
//                   `${addresses.length} addresses found. You can select a different address.`,
//                 );
//               } else {
//                 toast.success('User details and address loaded successfully!');
//               }
//             } else {
//               setSelectedAddressIndex(-1);
//               setShowManualAddress(true);
//               toast.info('No existing addresses found. Please enter address manually.');
//             }
//           }
//         } catch (error) {
//           setUserDetails(null);
//           setUserAddresses([]);
//           setSelectedAddressIndex(-1);
//           setShowManualAddress(true);
//         }
//       } else {
//         setUserDetails(null);
//         setUserAddresses([]);
//         setSelectedAddressIndex(-1);
//         setShowManualAddress(false);
//       }
//     };

//     const delayDebounceFn = setTimeout(() => {
//       if (customerForm.mobileNumber.length === 10) {
//         fetchUserDetails();
//       }
//     }, 1000);

//     return () => clearTimeout(delayDebounceFn);
//   }, [customerForm.mobileNumber, getToken]);

//   // Fetch zones based on coordinates
//   const fetchZones = async (lat, lng, cityName) => {
//     const token = getToken();
//     if (!token) return;

//     try {
//       const response = await axios.post(
//         URLS.GetZonesbylocation,
//         {
//           lat: lat,
//           lng: lng,
//           cityName: cityName,
//         },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );

//       setZones(response.data.zone || []);
//     } catch (error) {
//       console.error('Failed to fetch zones:', error);
//       toast.error('Failed to fetch zones');
//     }
//   };

//   // Fetch all categories on component mount
// // Update the fetchCategories useEffect:

// useEffect(() => {
//   const fetchCategories = async () => {
//     const token = getToken();
//     if (!token) return;

//     setCategoriesLoading(true);
//     try {
//       const response = await axios.post(
//         `${API_BASE}/ondemandcategory/getallondemandcategorys`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log('Categories API Response:', response.data); // Debug log

//       // CORRECTED: API returns data in 'ondemandcategorys' field, not 'subcategories'
//       if (response.data.success && response.data.ondemandcategorys) {
//         // Filter only active and published categories
//         const activeCategories = response.data.ondemandcategorys.filter(
//           cat => cat.isPublish === true && cat.status === 'active'
//         );
        
//         setCategories(activeCategories);
//         console.log('Loaded categories:', activeCategories.length); // Debug log
//       } else {
//         setCategories([]);
//         toast.error('No categories found');
//       }
//     } catch (error) {
//       console.error('Failed to fetch categories:', error);
//       setCategories([]);
//       toast.error('Failed to fetch categories');
//     } finally {
//       setCategoriesLoading(false);
//     }
//   };

//   fetchCategories();
// }, [getToken]);

//   // Fetch subcategories when category changes
//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       if (!serviceForm.categoryId) {
//         setSubcategories([]);
//         setChildCategories([]);
//         setServiceForm((prev) => ({
//           ...prev,
//           subcategoryId: '',
//           childCategoryId: '',
//           serviceId: '',
//           selectedRateCards: [],
//           totalAmount: 0,
//         }));
//         return;
//       }

//       const token = getToken();
//       if (!token) return;

//       setSubcategoriesLoading(true);
//       try {
//         const response = await axios.post(
//           `${API_BASE}/ondemandsubcategory/getsubcategoriesunderondemandcategoryid`,
//           {
//             categoryId: [serviceForm.categoryId],
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (response.data.success && response.data.subcategories) {
//           setSubcategories(response.data.subcategories || []);
          
//           if (response.data.subcategories.length === 0) {
//             toast.info('No subcategories found for selected category');
//           }
//         } else {
//           setSubcategories([]);
//           toast.warning('No subcategories available for this category');
//         }
//       } catch (error) {
//         console.error('Failed to fetch subcategories:', error);
//         setSubcategories([]);
//         toast.error('Failed to fetch subcategories');
//       } finally {
//         setSubcategoriesLoading(false);
//       }

//       setServiceForm((prev) => ({
//         ...prev,
//         subcategoryId: '',
//         childCategoryId: '',
//         serviceId: '',
//         selectedRateCards: [],
//         totalAmount: 0,
//       }));
//       setChildCategories([]);
//       setServices([]);
//       setRateCards([]);
//     };

//     fetchSubcategories();
//   }, [serviceForm.categoryId, getToken]);

//   // NEW: Fetch child categories (services) when subcategory and zone change
//   useEffect(() => {
//     const fetchChildCategories = async () => {
//       if (!serviceForm.subcategoryId || !zones || !zones._id) {
//         setChildCategories([]);
//         setServiceForm((prev) => ({
//           ...prev,
//           childCategoryId: '',
//           serviceId: '',
//           selectedRateCards: [],
//           totalAmount: 0,
//         }));
//         return;
//       }

//       const token = getToken();
//       if (!token) return;

//       setChildCategoriesLoading(true);
//       try {
//         const response = await axios.post(
//           URLS.GetOnDemandServicesbyZoneId,
//           {
//             zoneId: zones._id,
//             subcategoryId: serviceForm.subcategoryId,
//           },
//           { headers: { Authorization: `Bearer ${token}` } },
//         );

//         if (response.data.data) {
//           setChildCategories(response.data.data || []);
          
//           if (response.data.data.length === 0) {
//             toast.info('No services found for selected subcategory in this zone');
//           }
//         } else {
//           setChildCategories([]);
//         }
//       } catch (error) {
//         console.error('Failed to fetch child categories:', error);
//         setChildCategories([]);
//         toast.error('Failed to fetch services');
//       } finally {
//         setChildCategoriesLoading(false);
//       }

//       setServiceForm((prev) => ({
//         ...prev,
//         childCategoryId: '',
//         serviceId: '',
//         selectedRateCards: [],
//         totalAmount: 0,
//       }));
//       setServices([]);
//       setRateCards([]);
//     };

//     fetchChildCategories();
//   }, [serviceForm.subcategoryId, zones, getToken]);

//   // Fetch rate cards when child category (service) changes
//   useEffect(() => {
//     const fetchRateCards = async () => {
//       if (!serviceForm.childCategoryId) {
//         setRateCards([]);
//         setServiceForm((prev) => ({ 
//           ...prev, 
//           serviceId: '',
//           selectedRateCards: [], 
//           totalAmount: 0 
//         }));
//         return;
//       }

//       const token = getToken();
//       if (!token) return;

//       setServicesLoading(true);
//       try {
//         const response = await axios.post(
//           URLS.GetServiceRateCards,
//           {
//             serviceId: serviceForm.childCategoryId,
//           },
//           { headers: { Authorization: `Bearer ${token}` } },
//         );

//         if (response.data.data) {
//           setRateCards(response.data.data || []);
          
//           if (response.data.data.length === 0) {
//             toast.info('No rate cards found for selected service');
//           }
//         } else {
//           setRateCards([]);
//         }
//       } catch (error) {
//         console.error('Failed to fetch rate cards:', error);
//         setRateCards([]);
//         toast.error('Failed to fetch rate cards');
//       } finally {
//         setServicesLoading(false);
//       }
//     };

//     fetchRateCards();
//   }, [serviceForm.childCategoryId, getToken]);

//   const handleCustomerChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerForm((prev) => ({
//       ...prev,
//       address: { ...prev.address, [name]: value },
//     }));
//   };

//   const handleServiceChange = (e) => {
//     const { name, value } = e.target;
//     setServiceForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleRateCardSelection = (rateCard) => {
//     setServiceForm((prev) => {
//       const exists = prev.selectedRateCards.some((rc) => rc._id === rateCard._id);

//       return {
//         ...prev,
//         selectedRateCards: exists
//           ? prev.selectedRateCards.filter((rc) => rc._id !== rateCard._id)
//           : [
//               ...prev.selectedRateCards,
//               {
//                 _id: rateCard._id,
//                 rateCardTitle: rateCard.rateCardTitle,
//                 rateCardPrice: rateCard.rateCardPrice,
//               },
//             ],
//       };
//     });
//   };

//   useEffect(() => {
//     const total = serviceForm.selectedRateCards.reduce(
//       (sum, rc) => sum + (Number(rc.rateCardPrice) || 0),
//       0,
//     );
//     setServiceForm((prev) => ({ ...prev, totalAmount: total }));
//   }, [serviceForm.selectedRateCards]);

//   const handleAddressSelect = (index) => {
//     if (userAddresses[index]) {
//       const selectedAddress = userAddresses[index];
//       setSelectedAddressIndex(index);
//       setCustomerForm((prev) => ({
//         ...prev,
//         address: {
//           ...prev.address,
//           ...selectedAddress,
//           countryName: selectedAddress.countryName || 'India',
//         },
//       }));

//       setShowManualAddress(false);

//       if (selectedAddress.latitude && selectedAddress.longitude) {
//         fetchZones(selectedAddress.latitude, selectedAddress.longitude, selectedAddress.cityName);
//       }

//       setAddressDialogOpen(false);
//       toast.success('Address selected successfully!');
//     }
//   };

//   const handleAddNewAddress = () => {
//     setCustomerForm((prev) => ({
//       ...prev,
//       address: {
//         countryName: '',
//         stateName: '',
//         cityName: '',
//         area: '',
//         flat: '',
//         postalCode: '',
//         addressLineOne: '',
//         addressLineTwo: '',
//         type: 'Home',
//         latitude: '',
//         longitude: '',
//         _id: '',
//         defaultAddress: false,
//       },
//     }));
//     setSelectedAddressIndex(-1);
//     setShowManualAddress(true);
//     setAddressDialogOpen(false);
//     toast.info('Please enter new address details manually.');
//   };

//   const onPlaceChanged = () => {
//     if (autocomplete !== null) {
//       const place = autocomplete.getPlace();
//       if (place && place.geometry && place.address_components) {
//         const addressComponents = place.address_components;
//         const geometry = place.geometry.location;

//         let country = '',
//           state = '',
//           city = '',
//           postalCode = '',
//           area = '';

//         addressComponents.forEach((component) => {
//           const types = component.types;
//           if (types.includes('country')) {
//             country = component.long_name;
//           }
//           if (types.includes('administrative_area_level_1')) {
//             state = component.long_name;
//           }
//           if (types.includes('locality')) {
//             city = component.long_name;
//           }
//           if (types.includes('postal_code')) {
//             postalCode = component.long_name;
//           }
//           if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
//             area = component.long_name;
//           }
//         });

//         setCustomerForm((prev) => ({
//           ...prev,
//           address: {
//             ...prev.address,
//             countryName: country,
//             stateName: state,
//             cityName: city,
//             area: area,
//             postalCode: postalCode,
//             addressLineOne: place.formatted_address || '',
//             latitude: geometry.lat().toString(),
//             longitude: geometry.lng().toString(),
//             _id: '',
//             defaultAddress: false,
//           },
//         }));

//         setSelectedAddressIndex(-1);
//         setShowManualAddress(true);

//         fetchZones(geometry.lat(), geometry.lng(), city);
//       }
//     }
//   };

//   const onLoad = (autoC) => {
//     setAutocomplete(autoC);
//   };

//   const validateCustomerTab = () => {
//     const requiredFields = [
//       !customerForm.customerName && 'Customer Name',
//       !customerForm.email && 'Email',
//       !customerForm.mobileNumber && 'Mobile Number',
//       !customerForm.address.addressLineOne && 'Address',
//       !customerForm.address.latitude && 'Complete Address (use search)',
//     ].filter(Boolean);

//     if (requiredFields.length) {
//       toast.error(`Missing: ${requiredFields.join(', ')}`);
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(customerForm.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }

//     const mobileRegex = /^[0-9]{10}$/;
//     if (!mobileRegex.test(customerForm.mobileNumber)) {
//       toast.error('Please enter a valid 10-digit mobile number');
//       return false;
//     }

//     if (!zones || !zones._id) {
//       toast.error('Please select a valid address to determine service zone');
//       return false;
//     }

//     return true;
//   };

//   const validateServiceTab = () => {
//     const requiredFields = [
//       !serviceForm.categoryId && 'Category',
//       !serviceForm.subcategoryId && 'Subcategory',
//       !serviceForm.childCategoryId && 'Service',
//       serviceForm.selectedRateCards.length === 0 && 'At least one Rate Card',
//       !serviceForm.sourceOfLead && 'Source of Lead',
//       !serviceForm.bookedDate && 'Booked Date',
//       !serviceForm.bookedTime && 'Booked Time',
//     ].filter(Boolean);

//     if (requiredFields.length) {
//       toast.error(`Missing: ${requiredFields.join(', ')}`);
//       return false;
//     }

//     return true;
//   };

//   const handleTabChange = (event, newValue) => {
//     if (newValue === 1 && !validateCustomerTab()) {
//       return;
//     }
//     setActiveTab(newValue);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateCustomerTab() || !validateServiceTab()) {
//       return;
//     }

//     const token = getToken();

//     const bookingData = {
//       name: customerForm.customerName,
//       email: customerForm.email,
//       phone: customerForm.mobileNumber,
//       altPhone: customerForm.alternateNumber,
//       area: customerForm.address.area,
//       flat: customerForm.address.flat,
//       postalCode: customerForm.address.postalCode,
//       addressLineOne: customerForm.address.addressLineOne,
//       addressLineTwo: customerForm.address.addressLineTwo,
//       latitude: customerForm.address.latitude,
//       longitude: customerForm.address.longitude,
//       type: customerForm.address.type,
//       serviceAddressId: customerForm.address._id,
//       zoneId: zones._id,
//       defaultAddress: customerForm.address.defaultAddress,
//       stateName: customerForm.address.stateName,
//       cityName: customerForm.address.cityName,
//       countryName: customerForm.address.countryName,
//       categoryId: serviceForm.categoryId,
//       subcategoryId: serviceForm.subcategoryId,
//       serviceId: serviceForm.childCategoryId, // Child category is the service
//       ratecardDetails: serviceForm.selectedRateCards,
//       amount: serviceForm.totalAmount,
//       sourceOfLead: serviceForm.sourceOfLead,
//       bookedDate: serviceForm.bookedDate,
//       bookedTime: serviceForm.bookedTime,
//       addMoreInfo: serviceForm.additionalInfo,
//     };

//     setLoading(true);
//     try {
//       const res = await axios.post(URLS.AddCrmBooking, bookingData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       if (res.status === 200 || res.data.success) {
//         toast.success('Booking created successfully!');
//         setTimeout(() => {
//           navigate('/ondemandservice/verified-partners-crm/accepted');
//         }, 1500);
//       }
//     } catch (error) {
//       console.error('Booking error:', error);
//       const message =
//         error.response?.status === 401
//           ? 'Unauthorized access. Please log in again.'
//           : error.response?.data?.message || 'Failed to create booking.';
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LoadScript
//       googleMapsApiKey="AIzaSyBNVn5j-M6F4VHkaOluoOcVY3K5r2-NlPk"
//       libraries={libraries}
//       onLoad={() => setScriptLoaded(true)}
//     >
//       <PageContainer title="Add CRM Booking">
//         <Breadcrumb title="Add CRM Booking" items={BCrumb} />
//         <ToastContainer position="top-right" autoClose={3000} />
        
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Typography variant="h4">Create New Booking</Typography>
//           <Button
//             variant="outlined"
//             color="primary"
//             onClick={() => navigate(-1)}
//             startIcon={<IconArrowBackUp />}
//             disabled={loading}
//           >
//             Back
//           </Button>
//         </Box>

//         <Tabs
//           value={activeTab}
//           onChange={handleTabChange}
//           sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
//         >
//           <Tab label="Customer Details" />
//           <Tab label="Service Details" />
//         </Tabs>

//         <form onSubmit={handleSubmit}>
//           {/* Customer Details Tab */}
//           <TabPanel value={activeTab} index={0}>
//             <ParentCard title="Customer Information">
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="mobileNumber" required>
//                     WhatsApp Number *
//                   </CustomFormLabel>
//                   <CustomTextField
//                     id="mobileNumber"
//                     name="mobileNumber"
//                     value={customerForm.mobileNumber}
//                     onChange={handleCustomerChange}
//                     placeholder="Enter 10-digit mobile number"
//                     inputProps={{ maxLength: 10 }}
//                     fullWidth
//                     required
//                   />
//                   {userDetails && (
//                     <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block' }}>
//                       Ã¢Å“â€œ User details loaded from existing records
//                     </Typography>
//                   )}
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="alternateNumber">Alternate Number</CustomFormLabel>
//                   <CustomTextField
//                     id="alternateNumber"
//                     name="alternateNumber"
//                     value={customerForm.alternateNumber}
//                     onChange={handleCustomerChange}
//                     placeholder="Alternate mobile number"
//                     inputProps={{ maxLength: 10 }}
//                     fullWidth
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="customerName" required>
//                     Customer Name *
//                   </CustomFormLabel>
//                   <CustomTextField
//                     id="customerName"
//                     name="customerName"
//                     value={customerForm.customerName}
//                     onChange={handleCustomerChange}
//                     placeholder="Enter customer name"
//                     fullWidth
//                     required
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="email" required>
//                     Email Address *
//                   </CustomFormLabel>
//                   <CustomTextField
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={customerForm.email}
//                     onChange={handleCustomerChange}
//                     placeholder="customer@example.com"
//                     fullWidth
//                     required
//                   />
//                 </Grid>

//                 {/* Address Selection Section */}
//                 {userAddresses.length > 0 && !showManualAddress && (
//                   <Grid item xs={12}>
//                     <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'center',
//                           mb: 2,
//                         }}
//                       >
//                         <Typography variant="h6">
//                           Select Existing Address ({userAddresses.length} available)
//                         </Typography>
//                         <Box sx={{ display: 'flex', gap: 1 }}>
//                           <Button
//                             variant="outlined"
//                             size="small"
//                             onClick={() => setAddressDialogOpen(true)}
//                           >
//                             View All Addresses
//                           </Button>
//                           <Button
//                             variant="text"
//                             size="small"
//                             color="primary"
//                             onClick={handleAddNewAddress}
//                           >
//                             Add New Address
//                           </Button>
//                         </Box>
//                       </Box>

//                       <Grid container spacing={2}>
//                         {userAddresses.slice(0, 2).map((address, index) => (
//                           <Grid item xs={12} md={6} key={address._id}>
//                             <AddressCard
//                               selected={selectedAddressIndex === index}
//                               onClick={() => handleAddressSelect(index)}
//                             >
//                               <CardContent>
//                                 <Box
//                                   sx={{
//                                     display: 'flex',
//                                     justifyContent: 'space-between',
//                                     alignItems: 'flex-start',
//                                     mb: 1,
//                                   }}
//                                 >
//                                   <Typography variant="subtitle1" fontWeight="bold">
//                                     {address.name || customerForm.customerName}
//                                   </Typography>
//                                   {address.defaultAddress && (
//                                     <Chip label="Default" color="primary" size="small" />
//                                   )}
//                                   {selectedAddressIndex === index && (
//                                     <Chip label="Selected" color="success" size="small" />
//                                   )}
//                                 </Box>
//                                 <Typography variant="body2" color="textSecondary">
//                                   {address.flat}, {address.addressLineOne}
//                                 </Typography>
//                                 <Typography variant="body2" color="textSecondary">
//                                   {address.area}, {address.cityName} - {address.postalCode}
//                                 </Typography>
//                                 <Typography variant="body2" color="textSecondary">
//                                   {address.stateName}, {address.countryName || 'India'}
//                                 </Typography>
//                                 <Typography variant="caption" color="textSecondary">
//                                   Type: {address.type}
//                                 </Typography>
//                               </CardContent>
//                             </AddressCard>
//                           </Grid>
//                         ))}
//                       </Grid>

//                       {userAddresses.length > 2 && (
//                         <Box sx={{ textAlign: 'center', mt: 2 }}>
//                           <Button
//                             variant="text"
//                             size="small"
//                             onClick={() => setAddressDialogOpen(true)}
//                           >
//                             + {userAddresses.length - 2} more addresses
//                           </Button>
//                         </Box>
//                       )}
//                     </Card>
//                   </Grid>
//                 )}

//                 {/* Manual Address Section */}
//                 {showManualAddress && (
//                   <>
//                     <Grid item xs={12}>
//                       <Divider sx={{ my: 2 }}>
//                         <Chip label="Enter New Address" color="primary" />
//                       </Divider>
//                     </Grid>

//                     <Grid item xs={12}>
//                       <CustomFormLabel htmlFor="address-search" required>
//                         Search Location *
//                       </CustomFormLabel>
//                       {scriptLoaded && (
//                         <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
//                           <TextField
//                             fullWidth
//                             placeholder="Enter complete address to auto-fill location details"
//                             variant="outlined"
//                           />
//                         </Autocomplete>
//                       )}
//                       <Typography variant="caption" color="textSecondary">
//                         Start typing to search for your location
//                       </Typography>
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="countryName" required>
//                         Country *
//                       </CustomFormLabel>
//                       <CustomTextField
//                         id="countryName"
//                         name="countryName"
//                         value={customerForm.address.countryName}
//                         onChange={handleAddressChange}
//                         placeholder="Country"
//                         fullWidth
//                         required
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="stateName" required>
//                         State *
//                       </CustomFormLabel>
//                       <CustomTextField
//                         id="stateName"
//                         name="stateName"
//                         value={customerForm.address.stateName}
//                         onChange={handleAddressChange}
//                         placeholder="State"
//                         fullWidth
//                         required
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="cityName" required>
//                         City *
//                       </CustomFormLabel>
//                       <CustomTextField
//                         id="cityName"
//                         name="cityName"
//                         value={customerForm.address.cityName}
//                         onChange={handleAddressChange}
//                         placeholder="City"
//                         fullWidth
//                         required
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="area" required>
//                         Area/Zone *
//                       </CustomFormLabel>
//                       <CustomTextField
//                         id="area"
//                         name="area"
//                         value={customerForm.address.area}
//                         onChange={handleAddressChange}
//                         placeholder="Area or Zone"
//                         fullWidth
//                         required
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="postalCode" required>
//                         Postal Code *
//                       </CustomFormLabel>
//                       <CustomTextField
//                         id="postalCode"
//                         name="postalCode"
//                         value={customerForm.address.postalCode}
//                         onChange={handleAddressChange}
//                         placeholder="Postal Code"
//                         fullWidth
//                         required
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="flat">Flat/Building No.</CustomFormLabel>
//                       <CustomTextField
//                         id="flat"
//                         name="flat"
//                         value={customerForm.address.flat}
//                         onChange={handleAddressChange}
//                         placeholder="Flat/Building Number"
//                         fullWidth
//                       />
//                     </Grid>

//                     <Grid item xs={12}>
//                       <CustomFormLabel htmlFor="addressLineOne" required>
//                         Address Line 1 *
//                       </CustomFormLabel>
//                       <CustomTextField
//                         id="addressLineOne"
//                         name="addressLineOne"
//                         value={customerForm.address.addressLineOne}
//                         onChange={handleAddressChange}
//                         placeholder="Street address, P.O. box, company name"
//                         fullWidth
//                         required
//                         multiline
//                         rows={2}
//                       />
//                     </Grid>

//                     <Grid item xs={12}>
//                       <CustomFormLabel htmlFor="addressLineTwo">Address Line 2</CustomFormLabel>
//                       <CustomTextField
//                         id="addressLineTwo"
//                         name="addressLineTwo"
//                         value={customerForm.address.addressLineTwo}
//                         onChange={handleAddressChange}
//                         placeholder="Apartment, suite, unit, building, floor, etc."
//                         fullWidth
//                         multiline
//                         rows={2}
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="addressType">Address Type</CustomFormLabel>
//                       <CustomSelect
//                         id="addressType"
//                         name="type"
//                         value={customerForm.address.type}
//                         onChange={handleAddressChange}
//                         fullWidth
//                       >
//                         <MenuItem value="Home">Home</MenuItem>
//                         <MenuItem value="Office">Office</MenuItem>
//                         <MenuItem value="Other">Other</MenuItem>
//                       </CustomSelect>
//                     </Grid>
//                   </>
//                 )}

//                 {customerForm.address.latitude && customerForm.address.longitude && zones && zones._id && (
//                   <Grid item xs={12}>
//                     <Card variant="outlined" sx={{ bgcolor: 'success.lighter', p: 2 }}>
//                       <Typography variant="body2" color="success.main" fontWeight="bold">
//                         Ã¢Å“â€œ Service Zone Detected: {zones.name || zones._id}
//                       </Typography>
//                       <Typography variant="caption" color="textSecondary">
//                         Services will be available based on this zone
//                       </Typography>
//                     </Card>
//                   </Grid>
//                 )}

//                 <Grid item xs={12} sx={{ textAlign: 'right' }}>
//                   <Button 
//                     variant="contained" 
//                     color="primary" 
//                     onClick={() => {
//                       if (validateCustomerTab()) {
//                         setActiveTab(1);
//                       }
//                     }}
//                     size="large"
//                   >
//                     Next: Service Details Ã¢â€ â€™
//                   </Button>
//                 </Grid>
//               </Grid>
//             </ParentCard>
//           </TabPanel>

//           {/* Service Details Tab */}
//           <TabPanel value={activeTab} index={1}>
//             <ParentCard title="Service Selection">
//               <Grid container spacing={3}>
//                 {/* Category */}
//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="categoryId" required>
//                     Category *
//                   </CustomFormLabel>
//                   <CustomSelect
//                     id="categoryId"
//                     name="categoryId"
//                     value={serviceForm.categoryId}
//                     onChange={handleServiceChange}
//                     fullWidth
//                     required
//                     disabled={categoriesLoading}
//                   >
//                     <MenuItem value="">
//                       {categoriesLoading ? 'Loading categories...' : 'Select Category'}
//                     </MenuItem>
//                     {categories.map((cat) => (
//                       <MenuItem key={cat._id} value={cat._id}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {cat.image && (
//                             <Avatar 
//                               src={getImageUrl(cat.image)} 
//                               sx={{ width: 24, height: 24 }}
//                               variant="rounded"
//                             />
//                           )}
//                           <span>{cat.name}</span>
//                           {cat.serviceName && (
//                             <Chip label={cat.serviceName} size="small" variant="outlined" />
//                           )}
//                         </Box>
//                       </MenuItem>
//                     ))}
//                   </CustomSelect>
//                   {categoriesLoading && (
//                     <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                       <CircularProgress size={16} sx={{ mr: 1 }} />
//                       <Typography variant="caption" color="textSecondary">
//                         Loading categories...
//                       </Typography>
//                     </Box>
//                   )}
//                 </Grid>

//                 {/* Subcategory */}
//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="subcategoryId" required>
//                     Subcategory *
//                   </CustomFormLabel>
//                   <CustomSelect
//                     id="subcategoryId"
//                     name="subcategoryId"
//                     value={serviceForm.subcategoryId}
//                     onChange={handleServiceChange}
//                     fullWidth
//                     required
//                     disabled={!serviceForm.categoryId || subcategoriesLoading}
//                   >
//                     <MenuItem value="">
//                       {subcategoriesLoading
//                         ? 'Loading subcategories...'
//                         : !serviceForm.categoryId
//                         ? 'Select category first'
//                         : 'Select Subcategory'}
//                     </MenuItem>
//                     {subcategories.map((sub) => (
//                       <MenuItem key={sub._id} value={sub._id}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {sub.image && (
//                             <Avatar 
//                               src={getImageUrl(sub.image)} 
//                               sx={{ width: 24, height: 24 }}
//                               variant="rounded"
//                             />
//                           )}
//                           <span>{sub.name}</span>
//                         </Box>
//                       </MenuItem>
//                     ))}
//                   </CustomSelect>
//                   {subcategoriesLoading && (
//                     <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                       <CircularProgress size={16} sx={{ mr: 1 }} />
//                       <Typography variant="caption" color="textSecondary">
//                         Loading subcategories...
//                       </Typography>
//                     </Box>
//                   )}
//                   {serviceForm.categoryId && subcategories.length === 0 && !subcategoriesLoading && (
//                     <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
//                       No subcategories available for selected category
//                     </Typography>
//                   )}
//                 </Grid>

//                 {/* Child Category (Service) */}
//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="childCategoryId" required>
//                     Service *
//                   </CustomFormLabel>
//                   <CustomSelect
//                     id="childCategoryId"
//                     name="childCategoryId"
//                     value={serviceForm.childCategoryId}
//                     onChange={handleServiceChange}
//                     fullWidth
//                     required
//                     disabled={!serviceForm.subcategoryId || !zones._id || childCategoriesLoading}
//                   >
//                     <MenuItem value="">
//                       {childCategoriesLoading
//                         ? 'Loading services...'
//                         : !serviceForm.subcategoryId
//                         ? 'Select subcategory first'
//                         : !zones._id
//                         ? 'Select address to determine zone'
//                         : 'Select Service'}
//                     </MenuItem>
//                     {childCategories.map((service) => (
//                       <MenuItem key={service._id} value={service._id}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {service.image && (
//                             <Avatar 
//                               src={getImageUrl(service.image)} 
//                               sx={{ width: 24, height: 24 }}
//                               variant="rounded"
//                             />
//                           )}
//                           <Box>
//                             <Typography variant="body2">{service.name}</Typography>
//                             {service.description && (
//                               <Typography variant="caption" color="textSecondary">
//                                 {service.description}
//                               </Typography>
//                             )}
//                           </Box>
//                         </Box>
//                       </MenuItem>
//                     ))}
//                   </CustomSelect>
//                   {childCategoriesLoading && (
//                     <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                       <CircularProgress size={16} sx={{ mr: 1 }} />
//                       <Typography variant="caption" color="textSecondary">
//                         Loading services...
//                       </Typography>
//                     </Box>
//                   )}
//                   {serviceForm.subcategoryId && zones._id && childCategories.length === 0 && !childCategoriesLoading && (
//                     <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
//                       No services available for selected subcategory in this zone
//                     </Typography>
//                   )}
//                 </Grid>

//                 {/* Source of Lead */}
//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="sourceOfLead" required>
//                     Source of Lead *
//                   </CustomFormLabel>
//                   <CustomSelect
//                     id="sourceOfLead"
//                     name="sourceOfLead"
//                     value={serviceForm.sourceOfLead}
//                     onChange={handleServiceChange}
//                     fullWidth
//                     required
//                   >
//                     <MenuItem value="">Select Source</MenuItem>
//                     <MenuItem value="whatsapp">WhatsApp</MenuItem>
//                     <MenuItem value="call">Phone Call</MenuItem>
//                     <MenuItem value="website">Website</MenuItem>
//                     <MenuItem value="walkin">Walk-in</MenuItem>
//                     <MenuItem value="referral">Referral</MenuItem>
//                     <MenuItem value="facebook">Facebook</MenuItem>
//                     <MenuItem value="instagram">Instagram</MenuItem>
//                     <MenuItem value="google">Google Ads</MenuItem>
//                   </CustomSelect>
//                 </Grid>

//                 {/* Booked Date */}
//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="bookedDate" required>
//                     Booked Date *
//                   </CustomFormLabel>
//                   <CustomTextField
//                     id="bookedDate"
//                     type="date"
//                     name="bookedDate"
//                     value={serviceForm.bookedDate}
//                     onChange={handleServiceChange}
//                     fullWidth
//                     required
//                     InputLabelProps={{ shrink: true }}
//                     inputProps={{
//                       min: new Date().toISOString().split('T')[0]
//                     }}
//                   />
//                 </Grid>

//                 {/* Booked Time */}
//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="bookedTime" required>
//                     Booked Time *
//                   </CustomFormLabel>
//                   <CustomTextField
//                     id="bookedTime"
//                     type="time"
//                     name="bookedTime"
//                     value={serviceForm.bookedTime}
//                     onChange={handleServiceChange}
//                     fullWidth
//                     required
//                     InputLabelProps={{ shrink: true }}
//                   />
//                 </Grid>

//                 {/* Rate Cards */}
//                 {rateCards.length > 0 && (
//                   <Grid item xs={12}>
//                     <CustomFormLabel required>Select Rate Cards *</CustomFormLabel>
//                     <TableContainer component={Paper} variant="outlined">
//                       <Table>
//                         <TableHead>
//                           <TableRow sx={{ bgcolor: 'grey.100' }}>
//                             <TableCell padding="checkbox">Select</TableCell>
//                             <TableCell><strong>Service</strong></TableCell>
//                             <TableCell align="right"><strong>Price</strong></TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {rateCards.map((rateCard) => (
//                             <TableRow 
//                               key={rateCard._id} 
//                               hover
//                               sx={{ 
//                                 cursor: 'pointer',
//                                 '&:hover': { bgcolor: 'action.hover' }
//                               }}
//                               onClick={() => handleRateCardSelection(rateCard)}
//                             >
//                               <TableCell padding="checkbox">
//                                 <Checkbox
//                                   checked={serviceForm.selectedRateCards.some(
//                                     (rc) => rc._id === rateCard._id,
//                                   )}
//                                   onChange={() => handleRateCardSelection(rateCard)}
//                                 />
//                               </TableCell>
//                               <TableCell>
//                                 <Typography variant="body2" fontWeight="medium">
//                                   {rateCard.rateCardTitle}
//                                 </Typography>
//                                 {rateCard.description && (
//                                   <Typography variant="caption" color="textSecondary">
//                                     {rateCard.description}
//                                   </Typography>
//                                 )}
//                               </TableCell>
//                               <TableCell align="right">
//                                 <Chip 
//                                   label={`Ã¢â€šÂ¹${Number(rateCard.rateCardPrice).toLocaleString('en-IN')}`}
//                                   color="primary"
//                                   variant="outlined"
//                                 />
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                     {servicesLoading && (
//                       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
//                         <CircularProgress size={24} />
//                       </Box>
//                     )}
//                   </Grid>
//                 )}

//                 {/* Total Amount */}
//                 {serviceForm.selectedRateCards.length > 0 && (
//                   <Grid item xs={12}>
//                     <Card variant="outlined" sx={{ bgcolor: 'primary.lighter', p: 2 }}>
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <Typography variant="h6">Total Amount:</Typography>
//                         <Typography variant="h5" color="primary" fontWeight="bold">
//                           Ã¢â€šÂ¹{serviceForm.totalAmount.toLocaleString('en-IN')}
//                         </Typography>
//                       </Box>
//                       <Typography variant="caption" color="textSecondary">
//                         {serviceForm.selectedRateCards.length} service(s) selected
//                       </Typography>
//                     </Card>
//                   </Grid>
//                 )}

//                 {/* Additional Information */}
//                 <Grid item xs={12}>
//                   <CustomFormLabel htmlFor="additionalInfo">Additional Information</CustomFormLabel>
//                   <CustomTextField
//                     id="additionalInfo"
//                     name="additionalInfo"
//                     value={serviceForm.additionalInfo}
//                     onChange={handleServiceChange}
//                     placeholder="Any additional information about the booking (optional)..."
//                     fullWidth
//                     multiline
//                     rows={4}
//                   />
//                 </Grid>

//                 {/* Action Buttons */}
//                 <Grid item xs={12}>
//                   <Divider sx={{ my: 2 }} />
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <Button 
//                       variant="outlined" 
//                       onClick={() => setActiveTab(0)}
//                       size="large"
//                     >
//                       Ã¢â€ Â Back to Customer Details
//                     </Button>

//                     <Button
//                       type="submit"
//                       variant="contained"
//                       color="primary"
//                       disabled={loading}
//                       startIcon={loading ? <CircularProgress size={20} /> : null}
//                       size="large"
//                     >
//                       {loading ? 'Creating Booking...' : 'Create Booking'}
//                     </Button>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </ParentCard>
//           </TabPanel>
//         </form>

//         {/* Address Selection Dialog */}
//         <Dialog
//           open={addressDialogOpen}
//           onClose={() => setAddressDialogOpen(false)}
//           maxWidth="md"
//           fullWidth
//         >
//           <DialogTitle>
//             Select Address
//             <Typography variant="body2" color="textSecondary">
//               Choose from {userAddresses.length} saved addresses
//             </Typography>
//           </DialogTitle>
//           <DialogContent dividers>
//             <Grid container spacing={2}>
//               {userAddresses.map((address, index) => (
//                 <Grid item xs={12} key={address._id}>
//                   <AddressCard
//                     selected={selectedAddressIndex === index}
//                     onClick={() => handleAddressSelect(index)}
//                   >
//                     <CardContent>
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'flex-start',
//                           mb: 1,
//                         }}
//                       >
//                         <Typography variant="subtitle1" fontWeight="bold">
//                           {address.name || customerForm.customerName}
//                         </Typography>
//                         <Box sx={{ display: 'flex', gap: 1 }}>
//                           {address.defaultAddress && (
//                             <Chip label="Default" color="primary" size="small" />
//                           )}
//                           {selectedAddressIndex === index && (
//                             <Chip label="Selected" color="success" size="small" />
//                           )}
//                         </Box>
//                       </Box>
//                       <Typography variant="body2" color="textSecondary">
//                         {address.flat}, {address.addressLineOne}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         {address.area}, {address.cityName} - {address.postalCode}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         {address.stateName}, {address.countryName || 'India'}
//                       </Typography>
//                       <Typography variant="caption" color="textSecondary">
//                         Type: {address.type}
//                       </Typography>
//                     </CardContent>
//                   </AddressCard>
//                 </Grid>
//               ))}
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setAddressDialogOpen(false)}>Close</Button>
//             <Button 
//               variant="contained" 
//               onClick={handleAddNewAddress}
//               color="primary"
//             >
//               Add New Address
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </PageContainer>
//     </LoadScript>
//   );
// };

// export default AddCrmBooking;


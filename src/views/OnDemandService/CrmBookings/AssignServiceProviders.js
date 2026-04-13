import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URLS } from '../../../Url';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  CircularProgress,
  Chip,
  Checkbox,
  Card,
  CardContent,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Send,
  CheckCircle,
  RadioButtonUnchecked,
  Star,
  Phone,
  Assignment,
} from '@mui/icons-material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/verified-partners-crm/accepted-orders', title: 'Accepted Orders' },
  { title: 'Send to Service Providers' },
];

/** API lists are sometimes null, missing, or a single object — never call .map on raw responses */
const asArray = (value) => {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  return [value];
};

/** Admin ondemandcategory / ondemandsubcategory APIs use these keys (not `data`). */
const pickOndemandCategoriesFromResponse = (res) =>
  asArray(res?.data?.ondemandcategorys ?? res?.data?.data);

const pickOndemandSubcategoriesFromResponse = (res) =>
  asArray(
    res?.data?.ondemandsubcategorys ?? res?.data?.subcategories ?? res?.data?.data
  );

/** Master catalog: only active rows (schema default is active; treat missing as active). */
const isActiveOndemandRow = (row) => {
  const s = row?.status;
  if (s == null || s === '') return true;
  return String(s).toLowerCase() === 'active';
};

const AssignServiceProviders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderIds, location: bookingLocation, addressDetails, bookingType, returnPath } = location.state || {};

  const authData = JSON.parse(localStorage.getItem('user'));
  const token = authData?.token;

  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [hoveredProvider, setHoveredProvider] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!orderIds || orderIds.length === 0) {
      toast.error('No orders selected');
      if (location.state?.returnPath) {
        navigate(location.state.returnPath);
      } else {
        navigate('/verified-partners-crm/accepted-orders');
      }
      return;
    }

    if (token) {
      fetchBookingDetails();
      fetchServiceProviders();
    }
  }, [orderIds, token]);

  const fetchBookingDetails = async () => {
    try {
      let response;
      if (bookingType === 'crm-website') {
        const url = `${URLS.GetCRMWebsiteBookingById}${orderIds[0]}`;
        response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Regular CRM / Verified Partner bookings use POST and expect { id } in body
        response = await axios.post(URLS.GetServiceCrmBookingsById,
          { id: orderIds[0] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      console.log('CRM FETCH RESPONSE:', response.data);

      if (response.data.success && response.data.data) {
        // Correctly handling both response formats:
        // 1. Verified Partner: { success: true, data: { orderType, order: { ... } } }
        // 2. CRM Website: { success: true, data: { ...booking... } }
        const booking = response.data.data.order || response.data.data;
        console.log('EXTRACTED BOOKING:', booking);
        setOrderDetails(booking);

        const newFilters = {
          ...filters,
          categoryId: booking.categoryId?._id || booking.categoryId || booking.category?._id || booking.category || '',
          subcategoryId: booking.subcategoryId?._id || booking.subcategoryId || booking.subcategory?._id || booking.subcategory || '',
          serviceId: booking.serviceId?._id || booking.serviceId || booking.service?._id || booking.service || '',
        };
        setFilters(newFilters);
        if (newFilters.categoryId) {
          await fetchSubcategories(newFilters.categoryId);
        } else {
          setSubcategories([]);
        }
        if (newFilters.subcategoryId) {
          await fetchServices(newFilters.subcategoryId);
        } else {
          setServices([]);
        }
        fetchServiceProviders(newFilters);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  // Filter States
  const [filters, setFilters] = useState({
    cityId: '',
    categoryId: '',
    subcategoryId: '',
    serviceId: '',
  });

  // Options States
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (token) {
      fetchInitialOptions();
    }
  }, [token]);

  const fetchInitialOptions = async () => {
    try {
      const [citiesRes, categoriesRes, websiteCitiesRes] = await Promise.all([
        axios.get(URLS.GetCity, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { success: false } })),
        // POST /admin/ondemandcategory/getallondemandcategorys — returns { ondemandcategorys }
        axios
          .post(URLS.GetDemandCategory, {}, { headers: { Authorization: `Bearer ${token}` } })
          .catch(() => ({ data: { success: false } })),
        axios.get(URLS.GetWebsiteCities, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { success: false } })),
      ]);

      let combinedCities = [];
      if (citiesRes.data.success) combinedCities = [...asArray(citiesRes.data.data)];
      if (websiteCitiesRes.data.success) {
        const websiteCities = asArray(websiteCitiesRes.data.data).map((c) => ({
          _id: c._id,
          cityName: c.cityName || c.name || c.city
        }));
        // Add only if not already present
        websiteCities.forEach(wc => {
          if (!combinedCities.find(cc => cc._id === wc._id)) {
            combinedCities.push(wc);
          }
        });
      }

      setCities(combinedCities);
      if (categoriesRes.data.success) {
        const allMaster = pickOndemandCategoriesFromResponse(categoriesRes);
        setCategories(allMaster.filter(isActiveOndemandRow));
      }
    } catch (error) {
      console.error('Error fetching filter options', error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    try {
      const response = await axios.post(
        URLS.GetOnDemandSubCategorybyCategory,
        { categoryId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const list = pickOndemandSubcategoriesFromResponse(response).filter(isActiveOndemandRow);
        setSubcategories(list);
      }
    } catch (error) {
      console.error('Error fetching subcategories', error);
      setSubcategories([]);
    }
  };

  const fetchServices = async (subcategoryId) => {
    if (!subcategoryId) {
      setServices([]);
      return;
    }
    try {
      const response = await axios.get(URLS.GetOnDemandSevice, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const allServices = asArray(response.data.data);
        const filtered = allServices.filter(
          (s) =>
            s.subCategoryId === subcategoryId ||
            s.subcategoryId === subcategoryId ||
            s.subCategory === subcategoryId
        );
        setServices(filtered.length > 0 ? filtered : allServices);
      }
    } catch (error) {
      console.error('Error fetching services', error);
      setServices([]);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [field]: value };

      if (field === 'cityId') {
        const selectedCity = cities.find(c => c._id === value);
        newFilters.cityName = selectedCity ? (selectedCity.cityName || selectedCity.name || selectedCity.city) : '';
      } else if (field === 'categoryId') {
        newFilters.subcategoryId = '';
        newFilters.serviceId = '';
        fetchSubcategories(value);
        setServices([]);
      } else if (field === 'subcategoryId') {
        newFilters.serviceId = '';
        fetchServices(value);
      }

      return newFilters;
    });
  };

  const handleClearFilters = () => {
    const cleared = { cityId: '', cityName: '', categoryId: '', subcategoryId: '', serviceId: '' };
    setFilters(cleared);
    setSubcategories([]);
    setServices([]);
    fetchServiceProviders(cleared);
  };

  const [isFallback, setIsFallback] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const fetchServiceProviders = async (currentFilters = filters) => {
    setLoading(true);
    setIsFallback(false);
    try {
      let response;

      if (bookingType === 'crm-website') {
        // For website bookings, pass filters like we do for regular CRM bookings
        const payload = {
          bookingId: orderIds[0],
          ...currentFilters,
        };

        Object.keys(payload).forEach((key) => {
          if (payload[key] === '' || payload[key] === null) {
            delete payload[key];
          }
        });

        response = await axios.post(`${URLS.GetPotentialProvidersForWebsite}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        // Original CRM bookings endpoint
        const payload = {
          bookingId: orderIds[0],
          ...currentFilters,
        };

        // Clean empty strings
        Object.keys(payload).forEach((key) => {
          if (payload[key] === '' || payload[key] === null) {
            delete payload[key];
          }
        });

        response = await axios.post(URLS.GetServiceProvidersBasedCrmOnId, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.data.success && response.data.data != null) {
        const list = asArray(response.data.data);
        setServiceProviders(list);

        if (response.data.message && response.data.message.toLowerCase().includes('all active')) {
          setIsFallback(true);
        }

        toast.success(`Found ${list.length} service providers`);
      } else {
        setServiceProviders([]);
        toast.warning('No service providers found');
      }
    } catch (error) {
      console.error('Error fetching service providers:', error);
      toast.error('Failed to load service providers');
      setServiceProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderToggle = (providerId) => {
    setSelectedProviders((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleSelectAll = () => {
    const list = asArray(serviceProviders);
    if (selectedProviders.length === list.length) {
      setSelectedProviders([]);
    } else {
      setSelectedProviders(list.map((p) => p._id));
    }
  };

  const handleSendOrders = async () => {
    if (selectedProviders.length === 0) {
      toast.warning('Please select at least one service provider');
      return;
    }

    setSending(true);
    try {
      if (bookingType === 'crm-website') {
        // CRM Website bookings use a different API â€” assign all providers at once
        const response = await axios.post(
          URLS.AssignWebsiteBookingToProvider,
          {
            bookingId: orderIds[0],
            providerIds: selectedProviders,
            statusTextMessage: 'Order sent to service provider',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.success) {
          toast.success(`Successfully assigned to ${selectedProviders.length} provider(s)`);
          setTimeout(() => {
            navigate(returnPath || location.state?.returnPath || '/bookings/crm-website/all');
          }, 2000);
        } else {
          toast.error(response.data.message || 'Assignment failed');
        }
      } else {
        // Original CRM bookings â€” send each order to each selected provider
        const promises = [];

        orderIds.forEach((orderId) => {
          promises.push(
            axios.put(
              `${URLS.AssignOrderCrmtoProvider}/${orderId}`,
              {
                providerIds: selectedProviders,
                statusTextMessage: 'Order sent to service provider',
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            )
          );
        });

        const results = await Promise.allSettled(promises);
        const successCount = results.filter((r) => r.status === 'fulfilled').length;
        const failCount = results.filter((r) => r.status === 'rejected').length;

        if (successCount > 0) {
          toast.success(
            `Successfully sent ${orderIds.length} order(s) to ${selectedProviders.length} provider(s)`
          );
          setTimeout(() => {
            if (location.state?.returnPath) {
              navigate(location.state.returnPath);
            } else {
              navigate('/verified-partners-crm/accepted-orders');
            }
          }, 2000);
        }

        if (failCount > 0) {
          toast.error(`${failCount} assignment(s) failed`);
        }
      }
    } catch (error) {
      console.error('Error sending orders:', error);
      toast.error('Failed to send orders');
    } finally {
      setSending(false);
    }
  };

  // ... Helper to display address ...
  const displayAddress = bookingLocation || (addressDetails ? `${addressDetails.addressArea}, ${addressDetails.addressCityName}` : '');

  const filteredProviders = asArray(serviceProviders).filter((provider) => {
    const fullName = `${provider.firstName || ''} ${provider.lastName || ''}`.toLowerCase();
    const phone = (provider.mobile || provider.phone || '').toString();

    // Search filter remains active
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);

    // If the backend returned these providers, we trust they are relevant for the selected city/filters.
    // Local filtering by city is often redundant and error-prone due to data format differences.
    return matchesSearch;
  });

  console.log('FILTERED PROVIDERS:', {
    total: asArray(serviceProviders).length,
    filtered: filteredProviders.length,
    searchTerm
  });

  return (
    <PageContainer
      title="Send to Service Providers"
      description="Select service providers to send orders"
    >
      <Breadcrumb title="Send to Service Providers" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton
          onClick={() => {
            if (location.state?.returnPath) {
              navigate(location.state.returnPath);
            } else {
              navigate('/verified-partners-crm/accepted-orders');
            }
          }}
          className="transition-all duration-300 hover:scale-110 hover:bg-gray-100"
        >
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="600">
            Send to Service Providers
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
            <Typography variant="body2" color="text.secondary">
              Selected Orders: {orderIds?.length || 0}
            </Typography>
            {displayAddress && (
              <>
                <Typography color="text.secondary">|</Typography>
                <Typography variant="body2" color="primary" fontWeight={600} display="flex" alignItems="center" gap={0.5}>
                  ðŸ“ {displayAddress}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Filters — ondemandcategories + ondemandsubcategories (verified partners) */}
      <Card elevation={0} sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: '16px' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>City</InputLabel>
                <Select
                  value={filters.cityId}
                  label="City"
                  onChange={(e) => {
                    const newCityId = e.target.value;
                    const selectedCity = cities.find(c => c._id === newCityId);
                    const newFilters = {
                      cityId: newCityId,
                      cityName: selectedCity ? (selectedCity.cityName || selectedCity.name || selectedCity.city) : '',
                      categoryId: '',
                      subcategoryId: '',
                      serviceId: ''
                    };
                    setFilters(newFilters);
                    setSubcategories([]);
                    setServices([]);
                    fetchServiceProviders(newFilters);
                  }}
                >
                  <MenuItem value=""><em>All Cities</em></MenuItem>
                  {asArray(cities).map((city) => (
                    <MenuItem key={city._id} value={city._id}>{city.cityName || city.name || city.city}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.categoryId}
                  label="Category"
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    const newFilters = {
                      ...filters,
                      categoryId,
                      subcategoryId: '',
                      serviceId: '',
                    };
                    setFilters(newFilters);
                    setServices([]);
                    fetchSubcategories(categoryId);
                    fetchServiceProviders(newFilters);
                  }}
                >
                  <MenuItem value=""><em>All Categories</em></MenuItem>
                  {asArray(categories).map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name || cat.categoryName || 'Category'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" disabled={!filters.categoryId}>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={filters.subcategoryId}
                  label="Subcategory"
                  onChange={(e) => {
                    const subcategoryId = e.target.value;
                    const newFilters = {
                      ...filters,
                      subcategoryId,
                      serviceId: '',
                    };
                    setFilters(newFilters);
                    fetchServices(subcategoryId);
                    fetchServiceProviders(newFilters);
                  }}
                >
                  <MenuItem value=""><em>All Subcategories</em></MenuItem>
                  {asArray(subcategories).map((sub) => (
                    <MenuItem key={sub._id} value={sub._id}>
                      {sub.name || sub.subcategoryName || 'Subcategory'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search Name or Mobile"
                placeholder="Ex: John, 99..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => {
                    handleClearFilters();
                    setSearchTerm('');
                  }}
                  sx={{ height: 40, borderColor: '#FA896B', color: '#FA896B', minWidth: 160 }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper
        elevation={3}
        sx={{ padding: '24px', borderRadius: '16px', minHeight: '500px' }}
        className="transition-all duration-500 hover:shadow-2xl"
      >
        {/* Fallback Warning */}
        {isFallback && (
          <Box mb={2} p={2} bgcolor="warning.light" borderRadius={2}>
            <Typography variant="body2" color="warning.dark" fontWeight={600}>
              âš ï¸ No local providers found. Showing all active providers.
            </Typography>
          </Box>
        )}

        {/* Header with Select All */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Available Service Providers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedProviders.length} of {asArray(filteredProviders).length} selected
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => {
              const fp = asArray(filteredProviders);
              if (selectedProviders.length === fp.length && fp.length > 0) {
                setSelectedProviders([]);
              } else {
                setSelectedProviders(fp.map((p) => p._id));
              }
            }}
            className="transition-all duration-300 hover:scale-105"
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
          >
            {selectedProviders.length === asArray(filteredProviders).length && asArray(filteredProviders).length > 0 ? 'Deselect All' : 'Select All'}
          </Button>
        </Box>

        {/* Service Providers Grid */}
        <Grid container spacing={2}>
          {asArray(filteredProviders).length === 0 ? (
            <Grid item xs={12}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="300px"
              >
                <Assignment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  {searchTerm || filters.cityId || filters.categoryId || filters.subcategoryId
                    ? 'No matching service providers found'
                    : 'No service providers available'}
                </Typography>
                <Button sx={{ mt: 2 }} onClick={() => { handleClearFilters(); setSearchTerm(''); }}>Clear Search</Button>
              </Box>
            </Grid>
          ) : (
            asArray(filteredProviders).map((provider) => {
              const isSelected = selectedProviders.includes(provider._id);
              const fullName = `${provider.firstName || ''} ${provider.lastName || ''}`.trim();
              const displayName = fullName || 'Unnamed Provider';

              return (
                <Grid item xs={12} sm={6} md={3} key={provider._id}>
                  <Card
                    onClick={() => handleProviderToggle(provider._id)}
                    onMouseEnter={() => setHoveredProvider(provider._id)}
                    onMouseLeave={() => setHoveredProvider(null)}
                    className="cursor-pointer transition-all duration-300 ease-in-out"
                    sx={{
                      border: isSelected ? '3px solid #007367' : '2px solid #e0e0e0',
                      borderRadius: '16px',
                      position: 'relative',
                      overflow: 'hidden',
                      background: isSelected
                        ? 'linear-gradient(135deg, #e0f2f1 0%, #ffffff 100%)'
                        : 'white',
                      transform:
                        hoveredProvider === provider._id ? 'translateY(-8px) scale(1.05)' : 'translateY(0)',
                      boxShadow:
                        hoveredProvider === provider._id
                          ? '0 20px 40px rgba(0,0,0,0.15)'
                          : '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* Animated Line on Hover */}
                    {hoveredProvider === provider._id && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '3px',
                          background: 'linear-gradient(90deg, transparent, #007367, transparent)',
                          animation: 'scrollLineHorizontal 1.5s ease-in-out infinite',
                          '@keyframes scrollLineHorizontal': {
                            '0%': { left: '-100%' },
                            '100%': { left: '100%' },
                          },
                        }}
                      />
                    )}

                    {/* Selection Checkbox + WhatsApp â€” top-right corner */}
                    <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                      <Checkbox
                        checked={isSelected}
                        icon={<RadioButtonUnchecked sx={{ fontSize: 28 }} />}
                        checkedIcon={
                          <CheckCircle
                            className="transition-all duration-300"
                            sx={{ fontSize: 28, color: '#007367' }}
                          />
                        }
                        sx={{ padding: 0 }}
                      />
                      {(provider.phone || provider.mobileNumber || provider.phoneNumber) && (
                        <Tooltip title={`Chat with ${provider.firstName || provider.name || 'Provider'} on WhatsApp`}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              const ph = provider.phone || provider.mobileNumber || provider.phoneNumber;
                              if (!ph) {
                                toast.error('Provider phone not available');
                                return;
                              }
                              const clean = String(ph).replace(/\D/g, '');
                              const waPhone = clean.startsWith('91') ? clean : `91${clean}`;

                              // Extract details from orderDetails (fetched from API) or location.state
                              const b = orderDetails || {};
                              const s = location.state || {};
                              console.log('WHATSAPP SHARING DATA:', { booking: b, state: s });

                              // Order ID handling: ensure professional format for both types
                              let orderId = b.orderId;
                              if (!orderId) {
                                const suffix = (orderIds?.[0]?.toString().slice(-8).toUpperCase()) || 'N/A';
                                orderId = bookingType === 'crm-website' ? `D-HUB-W-${suffix}` : (suffix !== 'N/A' ? `D-HUB-${suffix}` : 'N/A');
                              }

                              const serviceName = b.ondemandservicesDetails?.name || b.serviceId?.serviceName || b.serviceId?.name || b.serviceName || s.serviceName || 'N/A';
                              // Category extraction with even more fallbacks for different booking types
                              const categoryName = b.categoryDetails?.name || b.categoryDetails?.categoryName || b.categoryId?.categoryName || b.categoryId?.name || b.categoryName || b.category?.name || b.category || s.categoryName || 'N/A';
                              const subcategoryName = b.subcategoryDetails?.name || b.subcategoryDetails?.subcategoryName || b.subcategoryId?.subcategoryName || b.subcategoryId?.name || b.subcategoryName || b.subcategory?.name || b.subcategory || s.subcategoryName || '';
                              const clientName = b.userDetails?.name || b.userName || b.user?.name || b.userSnapshot?.name || (b.firstName ? `${b.firstName} ${b.lastName || ''}`.trim() : '') || s.customerName || 'N/A';

                              // Address calculation using populated city info
                              let fullAddress = '';
                              if (b.userAddress) {
                                const addr = b.userAddress;
                                const cityLabel = b.cityInfo?.name || addr.addressCityName || addr.cityName || '';
                                // Remove ID if cityLabel looks like a hex string and has no spaces
                                const cleanCity = (cityLabel && cityLabel.length > 20 && !cityLabel.includes(' ')) ? '' : cityLabel;

                                fullAddress = [
                                  addr.houseNo || addr.flat || '',
                                  addr.addressLine1 || addr.addressLineOne || '',
                                  addr.addressArea || addr.area || '',
                                  cleanCity
                                ].filter(part => part && String(part).trim().length > 0).join(' ').trim();
                              } else if (b.address) {
                                fullAddress = `${b.address.flat || ''} ${b.address.area || ''} ${b.address.addressLineOne || ''}, ${b.address.cityName || ''}`.trim();
                              } else if (b.addressId) {
                                fullAddress = b.addressId.address || `${b.addressId.addressArea || ''}, ${b.addressId.addressCityName || ''}`.trim();
                              } else if (b.cityName) {
                                const city = b.cityInfo?.name || b.cityName || '';
                                const cleanCity = (city && city.length > 20 && !city.includes(' ')) ? '' : city;
                                fullAddress = `${b.message && b.message !== 'N/A' ? b.message + ', ' : ''}${cleanCity}${b.stateName ? ', ' + b.stateName : ''}`.trim();
                              }
                              fullAddress = (fullAddress && fullAddress !== ',' && fullAddress !== ', ,') ? fullAddress : (displayAddress || 'N/A');

                              const bookingDate = b.date || b.bookedDate || b.bookingDate || s.bookingDate || (b.createdAt || b.logCreatedDate ? new Date(b.createdAt || b.logCreatedDate).toLocaleDateString() : 'N/A');
                              const bookingTime = b.time || b.bookedTime || b.bookingTime || (b.createdAt || b.logCreatedDate ? new Date(b.createdAt || b.logCreatedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

                              const bookingMsg = [
                                `--- NEW BOOKING OPPORTUNITY ---`,
                                `----------------------------------`,
                                `Doorstep Hub SERVICES`,
                                `Dear Service Partner,`,
                                `A new Bussiness lead is available.`,
                                `Details:`,
                                `Order ID: ${orderId}`,
                                `Service: ${serviceName}`,
                                `Location: ${fullAddress}`,
                                `Appointment : ${bookingDate} ${bookingTime}`,
                                ``,
                                `customer Details :`,
                                `Name : ${clientName}`,
                                `Mobile : ${b.userPhone || b.phone || s.customerPhone || 'N/A'}`,
                                ``,
                                `ACTION REQUIRED:`,
                                `Please confirm your availability ASAP.`,
                                `Thank you for choosing Doorstep Hub !`,
                                `----------------------------------`
                              ].filter(part => part !== undefined).join('\n');

                              window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(bookingMsg)}`, '_blank');
                            }}
                            sx={{
                              backgroundColor: '#25D366',
                              color: '#fff',
                              width: 26,
                              height: 26,
                              '&:hover': { backgroundColor: '#1da851', transform: 'scale(1.1)' },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    <CardContent sx={{ padding: '20px', textAlign: 'center' }}>
                      {/* Avatar */}
                      <Avatar
                        src={URLS.FileBase + provider.image}
                        alt={displayName}
                        className="transition-all duration-500 ease-out"
                        sx={{
                          width: isSelected ? 90 : 80,
                          height: isSelected ? 90 : 80,
                          margin: '0 auto 16px',
                          border: isSelected ? '4px solid #007367' : '3px solid #e0e0e0',
                          transform:
                            hoveredProvider === provider._id
                              ? 'rotate(5deg) scale(1.1)'
                              : 'rotate(0deg) scale(1)',
                        }}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </Avatar>

                      {/* Name */}
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        gutterBottom
                        sx={{ color: isSelected ? '#007367' : 'text.primary' }}
                      >
                        {displayName}
                      </Typography>

                      {/* Rating */}
                      {provider.rating && (
                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mb={1}>
                          <Star sx={{ fontSize: 18, color: '#ffc107' }} />
                          <Typography variant="body2" fontWeight="600">
                            {provider.rating.toFixed(1)}
                          </Typography>
                        </Box>
                      )}

                      {/* Phone */}
                      <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mb={1}>
                        <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.5px', fontWeight: 500 }}>
                          {provider.phone || 'No phone'}
                        </Typography>
                      </Box>

                      {/* Categories (New) */}
                      {asArray(provider.categories).length > 0 && (
                        <Box sx={{ mt: 1, mb: 1 }}>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="center"
                            flexWrap="wrap"
                            useFlexGap
                            sx={{ gap: 0.5 }}
                          >
                            {asArray(provider.categories).slice(0, 3).map((cat, idx) => (
                              <Chip
                                key={idx}
                                label={typeof cat === 'string' ? cat : (cat?.name || cat?.categoryName || String(cat))}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: '0.65rem',
                                  height: '20px',
                                  borderColor: isSelected ? '#007367' : 'rgba(0,0,0,0.1)',
                                  color: isSelected ? '#007367' : 'text.secondary',
                                  bgcolor: isSelected ? 'rgba(0, 115, 103, 0.05)' : 'transparent'
                                }}
                              />
                            ))}
                            {asArray(provider.categories).length > 3 && (
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', mt: 0.5 }}>
                                +{asArray(provider.categories).length - 3} more
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                      )}

                      {/* Verified Badge */}
                      {provider.isVerified && (
                        <Chip
                          label="Verified"
                          size="small"
                          color="success"
                          sx={{
                            mt: 1,
                            fontSize: '0.7rem',
                            height: '22px',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>

        {/* Action Buttons */}
        {serviceProviders.length > 0 && (
          <Box display="flex" justifyContent="flex-end" gap={2} mt={4} flexWrap="wrap">
            <Button
              variant="outlined"
              onClick={() => {
                if (location.state?.returnPath) {
                  navigate(location.state.returnPath);
                } else {
                  navigate('/verified-partners-crm/accepted-orders');
                }
              }}
              disabled={sending}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                padding: '10px 24px',
                color: '#007367',
                borderColor: '#007367',
                '&:hover': {
                  borderColor: '#006157',
                  backgroundColor: 'rgba(0, 115, 103, 0.04)',
                },
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSendOrders}
              disabled={selectedProviders.length === 0 || sending}
              startIcon={sending ? <CircularProgress size={20} /> : <Send />}
              className="transition-all duration-300 hover:scale-105"
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                padding: '10px 32px',
                background: '#007367',
                '&:hover': {
                  background: '#006157',
                },
              }}
            >
              {sending
                ? 'Sending...'
                : `Send to ${selectedProviders.length} Provider${selectedProviders.length !== 1 ? 's' : ''
                }`}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Custom CSS for Animations */}
      <style jsx global>{`
        .transition-all {
          transition: all 0.3s ease-in-out;
        }

        .hover\\:scale-110:hover {
          transform: scale(1.1);
        }

        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }

        .hover\\:bg-gray-100:hover {
          background-color: #f3f4f6;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .duration-300 {
          transition-duration: 300ms;
        }

        .duration-500 {
          transition-duration: 500ms;
        }

        .ease-in-out {
          transition-timing-function: ease-in-out;
        }

        .ease-out {
          transition-timing-function: ease-out;
        }
      `}</style>
    </PageContainer>
  );
};

export default AssignServiceProviders;

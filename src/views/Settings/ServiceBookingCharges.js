import React, { useState, useEffect } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import {
  Button,
  Box,
  Grid,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Divider,
  Typography,
  Paper,
  InputAdornment,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { IconTrash, IconPlus, IconDeviceFloppy, IconPercentage, IconCurrencyRupee } from '@tabler/icons';
import ParentCard from 'src/components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { URLS } from 'src/Url';
import axios from 'axios';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Service Booking Charges' },
];

const getAuthToken = () => JSON.parse(localStorage.getItem('user'))?.token || '';

const ServiceBookingCharges = () => {
  const [charges, setCharges] = useState({
    serviceBookingCost: '',
    inspectionCost: '',
  });

  const [professionalServiceCharges, setProfessionalServiceCharges] = useState([
    { serviceId: '', chargePercent: '', chargeType: 'percentage' },
  ]);

  const [onDemandServiceCharges, setOnDemandServiceCharges] = useState([
    { childCategoryId: '', chargePercent: '', chargeType: 'percentage' },
  ]);

  const [professionalServices, setProfessionalServices] = useState([]);
  const [onDemandChildCategories, setOnDemandChildCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingHandimanServices, setLoadingHandimanServices] = useState(false);

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  // Fetch Professional Services for Dropdown
  const fetchProfessionalServices = async () => {
    const token = getAuthToken();

    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    try {
      setLoadingServices(true);

      // POST request with query parameter
      const res = await axios.post(
        `${URLS.GetprofessionalServices}?serviceType=professional`,
        {}, // Empty body for POST request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // FIXED: Extract services from response.data.services (not response.data.data)
      const servicesData = res.data?.services || [];
      console.log('Fetched Professional Services:', servicesData);
      setProfessionalServices(servicesData);

      if (servicesData.length === 0) {
        toast.info('No professional services found');
      }

    } catch (error) {
      console.error('Error fetching professional services:', error);
      toast.error(
        error.response?.data?.message || 'Failed to fetch professional services'
      );
    } finally {
      setLoadingServices(false);
    }
  };

  // Fetch On-Demand Child Categories for Handiman Dropdown
  const fetchHandimanServices = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      setLoadingHandimanServices(true);
      const res = await axios.post(
        URLS.GetOnDemandChildCategory,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data?.ondemandcategorys || [];
      setOnDemandChildCategories(data);
    } catch (error) {
      console.error('Error fetching handiman services:', error);
    } finally {
      setLoadingHandimanServices(false);
    }
  };

  // Fetch Service Booking Charges (PREFILL FIELDS)
  const getData = async () => {
    const token = getAuthToken();

    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(URLS.GetServiceBookingCharges, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data?.data || {};
      console.log('Fetched Service Booking Charges:', data);

      setCharges({
        serviceBookingCost: data.serviceBookingCost || '',
        inspectionCost: data.inspectionCost || '',
      });

      // Set professional service charges
      if (data.professionalServiceCharges && data.professionalServiceCharges.length > 0) {
        setProfessionalServiceCharges(
          data.professionalServiceCharges.map((item) => ({
            serviceId: item.serviceId?._id || '',
            chargePercent: item.chargePercent || '',
            chargeType: item.chargeType || 'percentage',
          }))
        );
      } else {
        setProfessionalServiceCharges([{ serviceId: '', chargePercent: '', chargeType: 'percentage' }]);
      }

      // Set On-Demand service charges
      const onDemandCharges = data.onDemandServiceCharges || data.ondemandServiceCharges || [];
      if (onDemandCharges.length > 0) {
        setOnDemandServiceCharges(
          onDemandCharges.map((item) => ({
            childCategoryId: item.childCategoryId?._id || item.childCategoryId || '',
            name: item.childCategoryId?.name || 'Regular Service',
            chargePercent: item.chargePercent || '',
            chargeType: item.chargeType || 'percentage',
          }))
        );
      } else {
        setOnDemandServiceCharges([{ childCategoryId: '', chargePercent: '', chargeType: 'percentage' }]);
      }

    } catch (error) {
      console.error('Error fetching service booking charges:', error);
      toast.error(
        error.response?.data?.message || 'Failed to fetch Service Booking Charges'
      );
    } finally {
      setLoading(false);
    }
  };

  // Input handler for basic charges
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharges((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for professional service charges
  const handleProfessionalChargeChange = (index, field, value) => {
    const updatedCharges = [...professionalServiceCharges];
    updatedCharges[index][field] = value;
    setProfessionalServiceCharges(updatedCharges);
  };

  // Handler for on-demand service charges
  const handleOnDemandChargeChange = (index, field, value) => {
    const updatedCharges = [...onDemandServiceCharges];
    updatedCharges[index][field] = value;
    setOnDemandServiceCharges(updatedCharges);
  };

  // Add new on-demand service charge field
  const addOnDemandServiceCharge = () => {
    setOnDemandServiceCharges([
      ...onDemandServiceCharges,
      { childCategoryId: '', chargePercent: '', chargeType: 'percentage' },
    ]);
  };

  // Remove on-demand service charge field
  const removeOnDemandServiceCharge = (index) => {
    if (onDemandServiceCharges.length === 1) {
      toast.warning('At least one handiman service charge is required');
      return;
    }
    const updatedCharges = onDemandServiceCharges.filter((_, i) => i !== index);
    setOnDemandServiceCharges(updatedCharges);
  };
  const addProfessionalServiceCharge = () => {
    setProfessionalServiceCharges([
      ...professionalServiceCharges,
      { serviceId: '', chargePercent: '', chargeType: 'percentage' },
    ]);
  };

  // Remove professional service charge field
  const removeProfessionalServiceCharge = (index) => {
    if (professionalServiceCharges.length === 1) {
      toast.warning('At least one professional service charge is required');
      return;
    }
    const updatedCharges = professionalServiceCharges.filter((_, i) => i !== index);
    setProfessionalServiceCharges(updatedCharges);
  };

  // Validation for professional service charges
  const validateProfessionalCharges = () => {
    // Check for empty fields
    for (let i = 0; i < professionalServiceCharges.length; i++) {
      const charge = professionalServiceCharges[i];
      if (!charge.serviceId || charge.chargePercent === '') {
        toast.error(`Professional service charge ${i + 1}: All fields are required`);
        return false;
      }
      if (charge.chargeType === 'percentage') {
        if (charge.chargePercent < 0 || charge.chargePercent > 100) {
          toast.error(`Professional service charge ${i + 1}: Percentage must be between 0 and 100`);
          return false;
        }
      } else if (charge.chargeType === 'direct') {
        if (charge.chargePercent < 0) {
          toast.error(`Professional service charge ${i + 1}: Amount cannot be negative`);
          return false;
        }
      }
    }

    // Check for duplicate service IDs
    const serviceIds = professionalServiceCharges.map(c => c.serviceId);
    const uniqueServiceIds = new Set(serviceIds);
    if (serviceIds.length !== uniqueServiceIds.size) {
      toast.error('Duplicate services found. Each service can only be added once.');
      return false;
    }

    return true;
  };

  // Update Data
  const updateData = async () => {
    const token = getAuthToken();

    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    const { serviceBookingCost, inspectionCost } = charges;

    // Validate basic charges
    if (!serviceBookingCost || !inspectionCost) {
      toast.error('Service Booking Cost and Inspection Cost are required.');
      return;
    }

    // Validate professional service charges
    if (!validateProfessionalCharges()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        serviceBookingCost: parseFloat(serviceBookingCost),
        inspectionCost: parseFloat(inspectionCost),
        professionalServiceCharges: professionalServiceCharges.map((item) => ({
          serviceId: item.serviceId,
          chargePercent: parseFloat(item.chargePercent),
          chargeType: item.chargeType,
        })),
        onDemandServiceCharges: onDemandServiceCharges.map((item) => ({
          childCategoryId: item.childCategoryId,
          chargePercent: parseFloat(item.chargePercent),
          chargeType: item.chargeType,
        })),
        ondemandServiceCharges: onDemandServiceCharges.map((item) => ({
          childCategoryId: item.childCategoryId,
          chargePercent: parseFloat(item.chargePercent),
          chargeType: item.chargeType,
        })),
      };

      console.log('Submitting payload:', payload);

      await axios.put(URLS.EditServiceBookingCharges, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Service Booking Charges updated successfully!');
      getData(); // Refresh values

    } catch (error) {
      console.error('Error updating service booking charges:', error);
      toast.error(
        error.response?.data?.message || 'Failed to update Service Booking Charges'
      );
    } finally {
      setLoading(false);
    }
  };

  // Update Individual Row
  const handleSaveIndividualCharge = async (index) => {
    const charge = professionalServiceCharges[index];
    const token = getAuthToken();

    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (!charge.serviceId || charge.chargePercent === '') {
      toast.error('Service and Charge are required');
      return;
    }

    if (charge.chargeType === 'percentage' && (charge.chargePercent < 0 || charge.chargePercent > 100)) {
      toast.error('Percentage must be between 0 and 100');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        serviceId: charge.serviceId,
        chargePercent: parseFloat(charge.chargePercent),
        chargeType: charge.chargeType,
      };

      await axios.put(URLS.EditSingleServiceBookingCharge, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Service charge updated successfully!');
      getData(); // Sync data to get populated names
    } catch (error) {
      console.error('Error updating service charge:', error);
      toast.error(error.response?.data?.message || 'Failed to update Service Charge');
    } finally {
      setLoading(false);
    }
  };

  // Update Individual On-Demand Row
  const handleSaveIndividualOnDemandCharge = async (index) => {
    const charge = onDemandServiceCharges[index];
    const token = getAuthToken();

    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (!charge.childCategoryId || charge.chargePercent === '') {
      toast.error('Charge is required');
      return;
    }

    if (charge.chargeType === 'percentage' && (charge.chargePercent < 0 || charge.chargePercent > 100)) {
      toast.error('Percentage must be between 0 and 100');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        childCategoryId: charge.childCategoryId,
        chargePercent: parseFloat(charge.chargePercent),
        chargeType: charge.chargeType,
      };

      await axios.put(URLS.EditSingleOnDemandServiceBookingCharge, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`${charge.name || 'Handiman'} charge updated successfully!`);
      getData(); // Sync data to get populated names
    } catch (error) {
      console.error('Error updating on-demand charge:', error);
      toast.error(error.response?.data?.message || 'Failed to update Regular Service Charge');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionalServices();
    fetchHandimanServices();
    getData();
  }, []);

  // Get available handiman services
  const getAvailableHandimanServices = (currentIndex) => {
    const selectedIds = onDemandServiceCharges
      .map((charge, idx) => (idx !== currentIndex ? charge.childCategoryId : null))
      .filter(Boolean);

    return onDemandChildCategories.filter((service) => !selectedIds.includes(service._id));
  };

  // Get handiman service name
  const getHandimanServiceName = (id) => {
    const service = onDemandChildCategories.find((s) => s._id === id);
    return service?.name || 'Unknown Service';
  };

  // Get available services (exclude already selected ones)
  const getAvailableServices = (currentIndex) => {
    const selectedServiceIds = professionalServiceCharges
      .map((charge, idx) => (idx !== currentIndex ? charge.serviceId : null))
      .filter(Boolean);

    return professionalServices.filter((service) => !selectedServiceIds.includes(service._id));
  };

  // Get service name by ID
  const getServiceName = (serviceId) => {
    const service = professionalServices.find((s) => s._id === serviceId);
    return service?.name || service?.serviceName || service?.title || 'Unknown Service';
  };

  return (
    <PageContainer
      title="Service Booking Charges"
      description="This is the Service Booking Charges page"
    >
      <Breadcrumb title="Service Booking Charges" items={BCrumb} />

      <ParentCard title="Service Booking Charges">
        {/* Basic Charges Section */}
        <Grid container spacing={2} sx={{ p: 2 }}>
          {/* Service Booking Cost */}
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="serviceBookingCost" required>
              Online Consultation fee
            </CustomFormLabel>
            <CustomTextField
              id="serviceBookingCost"
              variant="outlined"
              fullWidth
              placeholder="Enter Booking Cost"
              name="serviceBookingCost"
              type="number"
              value={charges.serviceBookingCost}
              onChange={handleChange}
              inputProps={{ min: 0, step: '0.01' }}
            />
          </Grid>

          {/* Inspection Cost */}
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="inspectionCost" required>
              Doorstep Inspection Cost
            </CustomFormLabel>
            <CustomTextField
              id="inspectionCost"
              variant="outlined"
              fullWidth
              placeholder="Enter Inspection Cost"
              name="inspectionCost"
              type="number"
              value={charges.inspectionCost}
              onChange={handleChange}
              inputProps={{ min: 0, step: '0.01' }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Professional Service Charges Section */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h3">
              Professional Services - Commision Settings
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<IconPlus />}
              onClick={addProfessionalServiceCharge}
              size="small"
              disabled={loadingServices || professionalServices.length === 0}
            >
              Add Service
            </Button>
          </Box>

          {loadingServices ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="textSecondary">Loading professional services...</Typography>
            </Box>
          ) : professionalServices.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="error">No professional services available</Typography>
            </Box>
          ) : (
            professionalServiceCharges.map((charge, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  {/* Service Dropdown */}
                  <Grid item xs={12} sm={3}>
                    <CustomFormLabel htmlFor={`serviceId-${index}`} required sx={{ mt: 0, mb: 1 }}>
                      Service
                    </CustomFormLabel>
                    <FormControl fullWidth variant="outlined">
                      <Select
                        id={`serviceId-${index}`}
                        value={charge.serviceId}
                        onChange={(e) =>
                          handleProfessionalChargeChange(index, 'serviceId', e.target.value)
                        }
                        displayEmpty
                        disabled={loadingServices}
                        size="small"
                      >
                        <MenuItem value="" disabled>
                          Select Service
                        </MenuItem>
                        {getAvailableServices(index).map((service) => (
                          <MenuItem key={service._id} value={service._id}>
                            {service.name || service.serviceName || service.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Charge Type */}
                  <Grid item xs={12} sm={3}>
                    <CustomFormLabel htmlFor={`chargeType-${index}`} required sx={{ mt: 0, mb: 1 }}>
                      Commision Type
                    </CustomFormLabel>
                    <FormControl fullWidth variant="outlined">
                      <Select
                        id={`chargeType-${index}`}
                        value={charge.chargeType}
                        onChange={(e) =>
                          handleProfessionalChargeChange(index, 'chargeType', e.target.value)
                        }
                        size="small"
                      >
                        <MenuItem value="percentage">Percentage (%)</MenuItem>
                        <MenuItem value="direct">Fixed Amount (₹)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Charge Amount/Percentage */}
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CustomFormLabel htmlFor={`chargePercent-${index}`} required sx={{ mt: 0, mb: 1, flexGrow: 1 }}>
                        {charge.chargeType === 'percentage' ? 'Charge Percentage (%)' : 'Fixed Amount (₹)'}
                      </CustomFormLabel>
                      {charge.chargeType === 'percentage' ? (
                        <IconPercentage size={18} color="#5D87FF" />
                      ) : (
                        <IconCurrencyRupee size={18} color="#13DEB9" />
                      )}
                    </Box>
                    <CustomTextField
                      id={`chargePercent-${index}`}
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder={charge.chargeType === 'percentage' ? 'Enter %' : 'Enter ₹'}
                      type="number"
                      value={charge.chargePercent}
                      onChange={(e) =>
                        handleProfessionalChargeChange(index, 'chargePercent', e.target.value)
                      }
                      InputProps={{
                        startAdornment: charge.chargeType === 'direct' ? (
                          <InputAdornment position="start">₹</InputAdornment>
                        ) : null,
                        endAdornment: charge.chargeType === 'percentage' ? (
                          <InputAdornment position="end">%</InputAdornment>
                        ) : null,
                      }}
                      inputProps={{ min: 0, max: charge.chargeType === 'percentage' ? 100 : undefined, step: '0.01' }}
                    />
                  </Grid>

                  {/* Actions */}
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="Save Current Row Settings">
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleSaveIndividualCharge(index)}
                        disabled={loading || !charge.serviceId}
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <IconDeviceFloppy size={18} />}
                        sx={{
                          mt: 3,
                          textTransform: 'capitalize',
                          borderRadius: '8px',
                          background: 'linear-gradient(45deg, #017E6E 30%, #019587 90%)',
                          boxShadow: '0 3px 5px 2px rgba(1, 126, 110, .3)',
                          px: 2,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #019587 30%, #017E6E 90%)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 8px 3px rgba(1, 126, 110, .4)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                    </Tooltip>
                    <Tooltip title="Remove Service">
                      <IconButton
                        color="error"
                        onClick={() => removeProfessionalServiceCharge(index)}
                        disabled={professionalServiceCharges.length === 1}
                        sx={{ mt: 3 }}
                      >
                        <IconTrash />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Paper>
            ))
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Handiman Service Charges Section */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h3" sx={{ color: 'primary.main' }}>
              Handiman Services - Commision Settings
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<IconPlus />}
              onClick={addOnDemandServiceCharge}
              size="small"
              disabled={loadingHandimanServices || onDemandChildCategories.length === 0}
            >
              Add Service
            </Button>
          </Box>

          {loadingHandimanServices ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="textSecondary">Loading handiman services...</Typography>
            </Box>
          ) : onDemandChildCategories.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="error">No handiman services available</Typography>
            </Box>
          ) : (
            onDemandServiceCharges.map((charge, index) => (
              <Paper
                key={`ondemand-${index}`}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '12px',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  {/* Service Dropdown */}
                  <Grid item xs={12} sm={3}>
                    <CustomFormLabel htmlFor={`od-serviceId-${index}`} required sx={{ mt: 0, mb: 1 }}>
                      Service
                    </CustomFormLabel>
                    <FormControl fullWidth variant="outlined">
                      <Select
                        id={`od-serviceId-${index}`}
                        value={charge.childCategoryId}
                        onChange={(e) =>
                          handleOnDemandChargeChange(index, 'childCategoryId', e.target.value)
                        }
                        displayEmpty
                        disabled={loadingHandimanServices}
                        size="small"
                      >
                        <MenuItem value="" disabled>
                          Select Service
                        </MenuItem>
                        {getAvailableHandimanServices(index).map((service) => (
                          <MenuItem key={service._id} value={service._id}>
                            {service.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Charge Type */}
                  <Grid item xs={12} sm={3}>
                    <CustomFormLabel htmlFor={`od-chargeType-${index}`} required sx={{ mt: 0, mb: 1 }}>
                      Commision Type
                    </CustomFormLabel>
                    <FormControl fullWidth variant="outlined">
                      <Select
                        id={`od-chargeType-${index}`}
                        value={charge.chargeType}
                        onChange={(e) =>
                          handleOnDemandChargeChange(index, 'chargeType', e.target.value)
                        }
                        size="small"
                      >
                        <MenuItem value="percentage">Percentage (%)</MenuItem>
                        <MenuItem value="direct">Fixed Amount (₹)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Charge Amount/Percentage */}
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CustomFormLabel htmlFor={`od-chargePercent-${index}`} required sx={{ mt: 0, mb: 1, flexGrow: 1 }}>
                        {charge.chargeType === 'percentage' ? 'Charge Percentage (%)' : 'Fixed Amount (₹)'}
                      </CustomFormLabel>
                      {charge.chargeType === 'percentage' ? (
                        <IconPercentage size={18} color="#017E6E" />
                      ) : (
                        <IconCurrencyRupee size={18} color="#017E6E" />
                      )}
                    </Box>
                    <CustomTextField
                      id={`od-chargePercent-${index}`}
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder={charge.chargeType === 'percentage' ? 'Enter %' : 'Enter ₹'}
                      type="number"
                      value={charge.chargePercent}
                      onChange={(e) =>
                        handleOnDemandChargeChange(index, 'chargePercent', e.target.value)
                      }
                      InputProps={{
                        startAdornment: charge.chargeType === 'direct' ? (
                          <InputAdornment position="start">₹</InputAdornment>
                        ) : null,
                        endAdornment: charge.chargeType === 'percentage' ? (
                          <InputAdornment position="end">%</InputAdornment>
                        ) : null,
                      }}
                      inputProps={{ min: 0, max: charge.chargeType === 'percentage' ? 100 : undefined, step: '0.01' }}
                    />
                  </Grid>

                  {/* Actions */}
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="Save Current Row Settings">
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleSaveIndividualOnDemandCharge(index)}
                        disabled={loading || !charge.childCategoryId}
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <IconDeviceFloppy size={18} />}
                        sx={{
                          mt: 3,
                          textTransform: 'capitalize',
                          borderRadius: '8px',
                          background: 'linear-gradient(45deg, #017E6E 30%, #019587 90%)',
                          boxShadow: '0 3px 5px 2px rgba(1, 126, 110, .3)',
                          px: 2,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #019587 30%, #017E6E 90%)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 8px 3px rgba(1, 126, 110, .4)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                    </Tooltip>
                    <Tooltip title="Remove Service">
                      <IconButton
                        color="error"
                        onClick={() => removeOnDemandServiceCharge(index)}
                        disabled={onDemandServiceCharges.length === 1}
                        sx={{ mt: 3 }}
                      >
                        <IconTrash />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Paper>
            ))
          )}
        </Box>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 2, mt: 2 }}>
          {rolesAndPermission.global_settings_edit || rolesAndPermission.accessAll ? (
            <Button
              variant="contained"
              color="primary"
              onClick={updateData}
              disabled={loading || loadingServices || professionalServices.length === 0}
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <IconDeviceFloppy />}
              sx={{
                borderRadius: '10px',
                background: 'linear-gradient(45deg, #017E6E 30%, #019587 90%)',
                boxShadow: '0 3px 5px 2px rgba(1, 126, 110, .3)',
                px: 4,
                '&:hover': {
                  background: 'linear-gradient(45deg, #019587 30%, #017E6E 90%)',
                  transform: 'scale(1.02)',
                  boxShadow: '0 5px 10px 3px rgba(1, 126, 110, .4)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {loading ? 'Processing...' : 'Save All Changes'}
            </Button>
          ) : null}
        </Box>
      </ParentCard>

      <ToastContainer position="top-right" autoClose={3000} />
    </PageContainer>
  );
};

export default ServiceBookingCharges;

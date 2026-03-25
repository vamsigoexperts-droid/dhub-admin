import React, { useState, useEffect, useRef } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from '../../components/forms/theme-elements/CustomCheckbox';
import { IconArrowBackUp, IconUpload, IconX } from '@tabler/icons-react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { styled, useTheme } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Divider,
  FormControlLabel,
  Card,
  CardContent,
  IconButton,
  Chip,
  FormHelperText,
  InputAdornment,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Add Driver' }];

const CustomSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: theme.palette.background.paper,
  },
}));

const FileUploadCard = styled(Card)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}30`,
  backgroundColor: theme.palette.background.default,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '10',
  },
}));

const ALLOWED_FILE_TYPES = ['jpg', 'jpeg', 'png', 'pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGE_HEIGHT = 200;

const AddDriver = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const [files, setFiles] = useState({
    profileImage: null,
    vehicleImage: null,
    vehicleProof: null,
    driverProof: null,
    panCardImage: null,
    driving_license_front: null,
    driving_license_back: null,
    vechile_rc_front: null,
    vechile_rc_back: null,
    vechile_front_Image: null,
    vechile_front_back: null,
    adharcard_front: null,
    adharcard_back: null,
    insurance_image: null,
  });

  const [previews, setPreviews] = useState({
    profileImage: null,
    vehicleImage: null,
    vehicleProof: null,
    driverProof: null,
    panCardImage: null,
    driving_license_front: null,
    driving_license_back: null,
    vechile_rc_front: null,
    vechile_rc_back: null,
    vechile_front_Image: null,
    vechile_front_back: null,
    adharcard_front: null,
    adharcard_back: null,
    insurance_image: null,
  });

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    countryId: '',
    cityId: '',
    stateId: '',
    bankName: '',
    branchName: '',
    holderName: '',
    accountNumber: '',
    ifscCode: '',
    otherinformation: '',
    vehicleNumber: '',
    vehicleModel: '',
    driverOnlineOrOfline: false,
    serviceType: '',
    panCard: '',
    driving_license_number: '',
    adharcard_number: '',
    referenceName: '',
    alterNateNumber: '',
    referenceNumber2: '',
  });

  const fileInputRefs = {
    profileImage: useRef(null),
    vehicleImage: useRef(null),
    vehicleProof: useRef(null),
    driverProof: useRef(null),
    panCardImage: useRef(null),
    driving_license_front: useRef(null),
    driving_license_back: useRef(null),
    vechile_rc_front: useRef(null),
    vechile_rc_back: useRef(null),
    vechile_front_Image: useRef(null),
    vechile_front_back: useRef(null),
    adharcard_front: useRef(null),
    adharcard_back: useRef(null),
    insurance_image: useRef(null),
  };

  const getToken = () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user)?.token || '' : '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  };

  const token = getToken();

  const fetchData = async () => {
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }
    setLoading(true);
    try {
      const [countriesRes] = await Promise.all([
        axios.post(URLS.GetCountry, {}, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setCountries(countriesRes.data.country || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch data.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
      console.error('Error fetching states:', error);
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
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      Object.values(previews).forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      getStates(selectedCountry);
      setStates([]);
      setCities([]);
      setForm((prev) => ({ ...prev, stateId: '', cityId: '' }));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      getCities(selectedState);
      setCities([]);
      setForm((prev) => ({ ...prev, cityId: '' }));
    }
  }, [selectedState]);

  const handleFileChange = (field) => (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(ext)) {
      fileInputRefs[field].current.value = null;
      toast.error(`Please select a ${ALLOWED_FILE_TYPES.join(', ')} file.`);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      fileInputRefs[field].current.value = null;
      toast.error('File size exceeds 5MB.');
      return;
    }

    setFiles((prev) => ({ ...prev, [field]: selectedFile }));
    setPreviews((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(selectedFile),
    }));
  };

  const removeFile = (field) => (e) => {
    e.stopPropagation();
    setFiles((prev) => ({ ...prev, [field]: null }));
    setPreviews((prev) => ({ ...prev, [field]: null }));
    if (fileInputRefs[field].current) {
      fileInputRefs[field].current.value = null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const resetForm = () => {
    setForm({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      countryId: '',
      cityId: '',
      stateId: '',
      bankName: '',
      branchName: '',
      holderName: '',
      accountNumber: '',
      ifscCode: '',
      otherinformation: '',
      vehicleNumber: '',
      vehicleModel: '',
      driverOnlineOrOfline: false,
      serviceType: '',
      panCard: '',
      driving_license_number: '',
      adharcard_number: '',
      referenceName: '',
      alterNateNumber: '',
      referenceNumber2: '',
    });

    setFiles({
      profileImage: null,
      vehicleImage: null,
      vehicleProof: null,
      driverProof: null,
      panCardImage: null,
      driving_license_front: null,
      driving_license_back: null,
      vechile_rc_front: null,
      vechile_rc_back: null,
      vechile_front_Image: null,
      vechile_front_back: null,
      adharcard_front: null,
      adharcard_back: null,
      insurance_image: null,
    });

    setPreviews({
      profileImage: null,
      vehicleImage: null,
      vehicleProof: null,
      driverProof: null,
      panCardImage: null,
      driving_license_front: null,
      driving_license_back: null,
      vechile_rc_front: null,
      vechile_rc_back: null,
      vechile_front_Image: null,
      vechile_front_back: null,
      adharcard_front: null,
      adharcard_back: null,
      insurance_image: null,
    });

    setSelectedCountry('');
    setSelectedState('');
    setStates([]);
    setCities([]);

    Object.values(fileInputRefs).forEach((ref) => {
      if (ref.current) ref.current.value = null;
    });
  };

  const validateForm = () => {
    if (!form.firstName.trim()) return 'First name is required.';
    if (!form.lastName.trim()) return 'Last name is required.';
    if (!form.phone || !/^\d{10}$/.test(form.phone))
      return 'Valid 10-digit phone number is required.';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) return 'Valid email is required.';
    if (!form.password || form.password.length < 6)
      return 'Password must be at least 6 characters long.';
    if (!form.serviceType.trim()) return 'Service type name is required.';
    if (!form.vehicleNumber.trim()) return 'Vehicle number is required.';
    if (!form.vehicleModel.trim()) return 'Vehicle model is required.';
    if (!form.countryId) return 'Country is required.';
    if (!form.stateId) return 'State is required.';
    if (!form.cityId) return 'City is required.';

    const bankFields = [
      form.bankName,
      form.branchName,
      form.holderName,
      form.accountNumber,
      form.ifscCode,
    ];
    const filledBankFields = bankFields.filter((field) => field && field.trim());
    if (filledBankFields.length > 0 && filledBankFields.length < bankFields.length) {
      return 'Please fill all bank details or leave all bank fields empty.';
    }

    if (form.panCard && !files.panCardImage)
      return 'PAN card image is required when PAN number is provided.';
    if (files.panCardImage && !form.panCard.trim())
      return 'PAN card number is required when PAN image is provided.';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    setLoading(true);
    try {
      const res = await axios.post(URLS.AddDriver, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(res.data.message || 'Driver added successfully!');
      navigate('/drivers');
      resetForm();
    } catch (error) {
      const message =
        error.response?.status === 401
          ? 'Unauthorized access. Please log in again.'
          : error.response?.data?.message || 'Failed to add driver.';
      toast.error(message);
      console.error('Error adding driver:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFileUploadCard = (field, label, required = false) => (
    <Grid item xs={12} sm={6} md={4}>
      <input
        type="file"
        id={field}
        ref={fileInputRefs[field]}
        onChange={handleFileChange(field)}
        accept="image/jpeg,image/jpg,image/png,application/pdf"
        style={{ display: 'none' }}
      />
      <FileUploadCard onClick={() => fileInputRefs[field].current.click()}>
        <CardContent sx={{ textAlign: 'center', p: 2 }}>
          {previews[field] ? (
            <Box position="relative" display="inline-block">
              {files[field]?.type === 'application/pdf' ? (
                <Box>
                  <Typography variant="h6" color="primary">
                    PDF Document
                  </Typography>
                  <Typography variant="body2">{files[field]?.name}</Typography>
                </Box>
              ) : (
                <Box
                  component="img"
                  src={previews[field]}
                  alt={`${label} preview`}
                  sx={{
                    maxHeight: MAX_IMAGE_HEIGHT,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: 1,
                  }}
                />
              )}
              <IconButton
                size="small"
                onClick={removeFile(field)}
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  backgroundColor: 'error.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'error.dark' },
                }}
              >
                <IconX size={16} />
              </IconButton>
            </Box>
          ) : (
            <>
              <IconUpload size={40} color={theme.palette.primary.main} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {label} {required && '*'}
              </Typography>
              <FormHelperText>Click to upload (JPG, PNG, PDF)</FormHelperText>
            </>
          )}
        </CardContent>
      </FileUploadCard>
    </Grid>
  );

  return (
    <PageContainer title="Add Driver" description="Add a new driver to your platform">
      <Breadcrumb title="Add Driver" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ float: 'right', mb: 2, display: 'flex', gap: 1 }}>
        <Button variant="outlined" color="secondary" onClick={resetForm}>
          Reset Form
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          startIcon={<IconArrowBackUp />}
        >
          Back
        </Button>
      </Box>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Driver Personal Details">
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel required>First Name</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel required>Last Name</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel required>Mobile</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter 10-digit mobile number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                inputProps={{ pattern: '\\d{10}', title: 'Enter a 10-digit phone number' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Alternate Mobile</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter alternate mobile number"
                name="alterNateNumber"
                value={form.alterNateNumber}
                onChange={handleChange}
                inputProps={{ pattern: '\\d{10}', title: 'Enter a 10-digit phone number' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel required>Email</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel required>Password</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter Password (min 6 characters)"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                inputProps={{ minLength: 6 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel required>Country</CustomFormLabel>
              <CustomSelect
                name="countryId"
                value={form.countryId}
                onChange={(e) => {
                  const countryId = e.target.value;
                  setSelectedCountry(countryId);
                  setForm((prev) => ({ ...prev, countryId, stateId: '', cityId: '' }));
                }}
                fullWidth
                variant="outlined"
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
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel required>State</CustomFormLabel>
              <CustomSelect
                name="stateId"
                value={form.stateId}
                onChange={(e) => {
                  const stateId = e.target.value;
                  setSelectedState(stateId);
                  setForm((prev) => ({ ...prev, stateId, cityId: '' }));
                }}
                fullWidth
                variant="outlined"
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
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel required>City</CustomFormLabel>
              <CustomSelect
                name="cityId"
                value={form.cityId}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
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
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upload Documents
              </Typography>
              <Grid container spacing={2}>
                {renderFileUploadCard('profileImage', 'Profile Image', true)}
                {renderFileUploadCard('driverProof', 'Driving Licence Document', true)}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={form.driverOnlineOrOfline}
                    onChange={handleCheckboxChange}
                    name="driverOnlineOrOfline"
                    color="primary"
                  />
                }
                label="Set Driver Online"
              />
            </Grid>
          </Grid>
        </ParentCard>
        <ParentCard title="Vehicle Details">
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel required>Service Type</CustomFormLabel>
              <CustomSelect
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
              >
                <MenuItem value="" disabled>
                  Select Service Type
                </MenuItem>
                <MenuItem value="twowheeler">Two Wheeler</MenuItem>
                <MenuItem value="threewheeler">Three Wheeler</MenuItem>
                <MenuItem value="fourwheeler">Four Wheeler</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel required>Vehicle Model</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter Vehicle Model Year"
                name="vehicleModel"
                value={form.vehicleModel}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel required>Vehicle Number</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter Vehicle Registration Number"
                name="vehicleNumber"
                value={form.vehicleNumber}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Chip label="Required" size="small" color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel>Other Information</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter Additional Information"
                name="otherinformation"
                value={form.otherinformation}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Vehicle Documents
              </Typography>
              <Grid container spacing={2}>
                {renderFileUploadCard('vehicleImage', 'Vehicle Image', true)}
                {renderFileUploadCard('vehicleProof', 'Vehicle Registration Proof', true)}
                {renderFileUploadCard('vechile_rc_front', 'Vehicle RC Front', true)}
                {renderFileUploadCard('vechile_rc_back', 'Vehicle RC Back', true)}
                {renderFileUploadCard('vechile_front_Image', 'Vehicle Front Image', true)}
                {renderFileUploadCard('insurance_image', 'Insurance Document', true)}
              </Grid>
            </Grid>
          </Grid>
        </ParentCard>
        <ParentCard title="Bank Details (Optional)">
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Bank Name</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter Bank Name"
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Branch Name</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter Branch Name"
                name="branchName"
                value={form.branchName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Account Holder Name</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter Account Holder Name"
                name="holderName"
                value={form.holderName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Account Number</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter Account Number"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>IFSC Code</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter IFSC Code (e.g., SBIN0001234)"
                name="ifscCode"
                value={form.ifscCode}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </ParentCard>
        <ParentCard title="Identity Documents">
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>PAN Card Number</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter PAN Number (e.g., ABCDE1234F)"
                name="panCard"
                value={form.panCard}
                onChange={handleChange}
                inputProps={{
                  style: { textTransform: 'uppercase' },
                  maxLength: 10,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Aadhaar Card Number</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter 12-digit Aadhaar Number"
                name="adharcard_number"
                value={form.adharcard_number}
                onChange={handleChange}
                inputProps={{ maxLength: 12 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Driving License Number</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter Driving License Number"
                name="driving_license_number"
                value={form.driving_license_number}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upload Identity Documents
              </Typography>
              <Grid container spacing={2}>
                {renderFileUploadCard('panCardImage', 'PAN Card Image')}
                {renderFileUploadCard('adharcard_front', 'Aadhaar Card Front')}
                {renderFileUploadCard('adharcard_back', 'Aadhaar Card Back')}
                {renderFileUploadCard('driving_license_front', 'Driving License Front')}
                {renderFileUploadCard('driving_license_back', 'Driving License Back')}
              </Grid>
            </Grid>
          </Grid>
        </ParentCard>
        <ParentCard title="Reference Details (Optional)">
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Reference Name</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter Reference Person Name"
                name="referenceName"
                value={form.referenceName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel>Reference Contact 1</CustomFormLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="Enter Reference Contact Number"
                name="referenceNumber2"
                value={form.referenceNumber2}
                onChange={handleChange}
                inputProps={{ pattern: '\\d{10}', title: 'Enter a 10-digit phone number' }}
              />
            </Grid>
          </Grid>
        </ParentCard>
        <Divider sx={{ my: 4 }} />
        <Box
          display="flex"
          justifyContent="flex-end"
          gap={2}
          sx={{ p: 3, bgcolor: theme.palette.background.default, borderRadius: 2 }}
        >
          <Button variant="outlined" color="secondary" onClick={resetForm} disabled={loading}>
            Reset
          </Button>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Adding Driver...' : 'Add Driver'}
          </Button>
        </Box>
      </form>
    </PageContainer>
  );
};

export default AddDriver;

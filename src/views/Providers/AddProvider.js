import React, { useState, useEffect, useCallback } from 'react';
import { LoadScript, Autocomplete, GoogleMap, Marker, Circle } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button, styled, Chip, IconButton, Card, CardMedia, CircularProgress,
  Select, MenuItem, Box, Typography, Grid, FormHelperText, Checkbox, TextField
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  IconArrowBackUp, IconX, IconPlus, IconFileText, IconUpload
} from '@tabler/icons-react';
import MyLocationIcon from '@mui/icons-material/MyLocation';

import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { URLS } from '../../Url';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Service Provider' }];
const GOOGLE_MAPS_LIBRARIES = ['places'];

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const PreviewCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  width: 80,
  height: 80,
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '2px',
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

const Providers = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [documentType, setDocumentType] = useState('pan_card');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    slug: '',
    phone: '',
    email: '',
    password: '',
    bankName: '',
    branchName: '',
    holderName: '',
    accountNumber: '',
    serviceId: [],
    categoryId: [],
    subcategories: [],
    childcategoryId: '',
    ifsc_code: '',
    upid: '',
    countryId: '',
    stateId: '',
    cityId: '',
    address: '',
    latitude: '',
    longitude: '',
    deliveryRadiusKm: '',
    gst_number: '',
    business_number: '',
    altphone: '',
    pan_number: '',
    aadhar_number: '',
    experiance: '',
    dob: '',
    pincode: '',
    business_name: '',
    business_proof_type: '',
    address_proof_type: '',
    address_proof_number: '',
  });

  const [files, setFiles] = useState({
    image: null,
    logo: null,
    banner_image: null,
    pan_card_front: null,
    pan_card_back: null,
    aadhar_card_front: null,
    aadhar_card_back: null,
    customer_bill_copy: null,
    address_proof: null,
    business_proof: null,
    images: [],
    business_images: [],
  });

  const [previews, setPreviews] = useState({
    image: null,
    logo: null,
    banner_image: null,
    pan_card_front: null,
    pan_card_back: null,
    aadhar_card_front: null,
    aadhar_card_back: null,
    customer_bill_copy: null,
    address_proof: null,
    business_proof: null,
    images: [],
    business_images: [],
  });

  // State to handle browser autofill
  const [emailReadOnly, setEmailReadOnly] = useState(true);
  const [passwordReadOnly, setPasswordReadOnly] = useState(true);

  const getToken = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.token || '' : '';
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    axios.post(URLS.GetDemandCategory, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCategories(res.data.ondemandcategorys || []));

    axios.post(URLS.GetOnDemandChildCategory, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setChildCategories(res.data.ondemandcategorys || []));

    axios.post(URLS.GetCountry, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCountries(res.data.country || []));
  }, [getToken]);

  useEffect(() => {
    const token = getToken();
    if (form.categoryId.length > 0 && token) {
      axios.post(URLS.GetOnDemandSubCategorybyCategoryMulti, { categoryId: form.categoryId }, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setSubcategories(res.data.subcategories || []));
    } else {
      setSubcategories([]);
    }
  }, [form.categoryId, getToken]);

  useEffect(() => {
    const token = getToken();
    if (selectedCountry && token) {
      axios.post(URLS.GetCountryByState, { country_id: selectedCountry }, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setStates(res.data.states || []));
    }
  }, [selectedCountry, getToken]);

  useEffect(() => {
    const token = getToken();
    if (selectedState && token) {
      axios.post(URLS.GetStateByCitys, { state_id: selectedState }, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setCities(res.data.cities || []));
    }
  }, [selectedState, getToken]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      axios.post(URLS.GetOnDemandSevice, { subcategoryId: form.subcategories }, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setServices(res.data.ondemandservices || []));
    }
  }, [getToken, form.subcategories]);

  useEffect(() => {
    // Dynamically generate slug
    const generateSlug = (text) => {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    };

    let newSlug = '';
    if (form.childcategoryId === '683dbc04b62d2a241de0f7e8') {
      const city = cities.find(c => c._id === form.cityId);
      const cityName = city ? city.name : '';
      newSlug = generateSlug(`${form.business_name} ${cityName}`);
    } else {
      newSlug = generateSlug(`${form.firstName} ${form.lastName}`);
    }

    setForm(prev => ({ ...prev, slug: newSlug }));
  }, [form.firstName, form.lastName, form.business_name, form.cityId, form.childcategoryId, cities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    if (/^\d{0,10}$/.test(value)) {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [fieldName]: file }));
      setPreviews(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
    }
  };

  const handleRemoveFile = (fieldName) => {
    setFiles(prev => ({ ...prev, [fieldName]: null }));
    setPreviews(prev => ({ ...prev, [fieldName]: null }));
  };

  const handleBusinessImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if ((files.business_images?.length || 0) + selectedFiles.length > 5) {
      toast.error('Max 5 images allowed');
      return;
    }
    const validFiles = selectedFiles.filter(f => ['jpg', 'jpeg', 'png'].includes(f.name.split('.').pop().toLowerCase()));
    if (validFiles.length !== selectedFiles.length) toast.error('Only JPG/PNG allowed');

    setFiles(prev => ({ ...prev, business_images: [...(prev.business_images || []), ...validFiles] }));
    const newPreviews = validFiles.map(f => URL.createObjectURL(f));
    setPreviews(prev => ({ ...prev, business_images: [...(prev.business_images || []), ...newPreviews] }));
  };

  const removeBusinessImage = (index) => {
    const newFiles = [...(files.business_images || [])];
    const newPreviews = [...(previews.business_images || [])];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(prev => ({ ...prev, business_images: newFiles }));
    setPreviews(prev => ({ ...prev, business_images: newPreviews }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit clicked');
    try {
      setLoading(true);
      const token = getToken();
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        // Skip empty enum fields
        if (!value && (key === 'business_proof_type' || key === 'address_proof_type')) return;

        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      if (form.altphone) {
        formData.append('whatsappNumber', form.altphone);
      }

      Object.entries(files).forEach(([key, value]) => {
        if (!value) return;

        if (key === 'images') {
          value.forEach(img => formData.append('images', img));
        } else if (key === 'business_images') {
          if (Array.isArray(value)) value.forEach(img => formData.append('business_images', img));
        } else if (key === 'address_proof') {
          if (form.address_proof_type === 'GAS BILL') formData.append('gas_bill', value);
          else if (form.address_proof_type === 'RENTAL AGREEMENT') formData.append('rental_aggrement', value);
          else if (form.address_proof_type === 'POWER BILL') formData.append('power_bill', value);
        } else if (key === 'business_proof') {
          if (form.business_proof_type === 'LABOUR LICENCE') formData.append('labour_licence', value);
          else if (form.business_proof_type === 'UDYAM CERTIFICATE') formData.append('udyam_certificate', value);
          else if (form.business_proof_type === 'GST') formData.append('gst_bill', value);
        } else {
          formData.append(key, value);
        }
      });

      formData.append('metakeywords', tags.join(','));
      formData.append('documentType', 'pan_card');

      await axios.post(URLS.AddProvider, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Provider added successfully');
      navigate('/all-providers');
    } catch (error) {
      console.error('Submit Error:', error);
      toast.error(error.response?.data?.message || error.message || 'Error adding provider');
    } finally {
      setLoading(false);
    }
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setForm(prev => ({
          ...prev,
          address: place.formatted_address,
          latitude: place.geometry.location.lat().toString(),
          longitude: place.geometry.location.lng().toString()
        }));
      }
    }
  };

  const handleCurrentLocation = () => {
    setLoadingCurrentLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setForm(prev => ({ ...prev, latitude: latitude.toString(), longitude: longitude.toString() }));

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setForm(prev => ({ ...prev, address: results[0].formatted_address }));
          }
          setLoadingCurrentLocation(false);
        });
      },
      () => setLoadingCurrentLocation(false)
    );
  };

  const ImagePreview = ({ src, onRemove, onEdit }) => (
    <PreviewCard>
      {src?.toLowerCase().endsWith('.pdf') ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <IconFileText size={40} color="red" />
        </Box>
      ) : (
        <CardMedia component="img" height="80" image={src} sx={{ objectFit: 'cover' }} />
      )}
      <IconButton component="label" size="small" sx={{ position: 'absolute', top: 2, left: 2, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}>
        <IconUpload size={14} /><input type="file" hidden onChange={onEdit} />
      </IconButton>
      <RemoveButton onClick={onRemove}><IconX size={14} /></RemoveButton>
    </PreviewCard>
  );

  const CompactFileInput = ({ id, onChange, multiple = false }) => (
    <CompactFileInputContainer component="label">
      <input type="file" hidden id={id} onChange={onChange} multiple={multiple} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconUpload size={20} />
        <Typography variant="body2">{multiple ? 'Choose Files' : 'Choose File'}</Typography>
      </Box>
    </CompactFileInputContainer>
  );

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={GOOGLE_MAPS_LIBRARIES} onLoad={() => setScriptLoaded(true)}>
      <PageContainer title="Add Service Provider">
        <Breadcrumb title="Add Provider" items={BCrumb} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" startIcon={<IconArrowBackUp />} onClick={() => navigate(-1)}>Back</Button>
        </Box>
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Dummy inputs to trick browser's autofill */}
          <input type="text" style={{ display: 'none' }} />
          <input type="password" style={{ display: 'none' }} />
          <ParentCard title="Basic Information">
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>First Name</CustomFormLabel><CustomTextField name="firstName" value={form.firstName} onChange={handleChange} fullWidth placeholder="e.g. John" /></Grid>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Last Name</CustomFormLabel><CustomTextField name="lastName" value={form.lastName} onChange={handleChange} fullWidth placeholder="e.g. Doe" /></Grid>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>DOB</CustomFormLabel><CustomTextField type="date" name="dob" value={form.dob} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Experience</CustomFormLabel><CustomTextField type="number" name="experiance" value={form.experiance} onChange={handleChange} fullWidth placeholder="e.g. 5" /></Grid>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Primary Phone</CustomFormLabel><CustomTextField name="phone" value={form.phone} onChange={handlePhoneChange} fullWidth placeholder="e.g. 9876543210" inputProps={{ maxLength: 10 }} /></Grid>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>WhatsApp Phone</CustomFormLabel><CustomTextField name="altphone" value={form.altphone} onChange={handlePhoneChange} fullWidth placeholder="e.g. 9876543210" inputProps={{ maxLength: 10 }} /></Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel>Email</CustomFormLabel>
                <CustomTextField
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g. john@example.com"
                  onFocus={() => setEmailReadOnly(false)}
                  inputProps={{
                    readOnly: emailReadOnly,
                    autoComplete: 'off'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel>Password</CustomFormLabel>
                <CustomTextField
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g. Pass@123"
                  onFocus={() => setPasswordReadOnly(false)}
                  inputProps={{
                    readOnly: passwordReadOnly,
                    autoComplete: 'new-password'
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel>Category</CustomFormLabel>
                <CustomSelect name="categoryId" multiple value={form.categoryId} onChange={handleMultiSelectChange} fullWidth renderValue={s => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{s.map(v => <Chip key={v} label={categories.find(c => c._id === v)?.name} size="small" />)}</Box>
                )}>
                  {categories.map(c => <MenuItem key={c._id} value={c._id}><Checkbox checked={form.categoryId.includes(c._id)} />{c.name}</MenuItem>)}
                </CustomSelect>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel>Subcategory</CustomFormLabel>
                <CustomSelect name="subcategories" multiple value={form.subcategories} onChange={handleMultiSelectChange} fullWidth renderValue={s => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{s.map(v => <Chip key={v} label={subcategories.find(c => c._id === v)?.name} size="small" />)}</Box>
                )}>
                  {subcategories.map(c => <MenuItem key={c._id} value={c._id}><Checkbox checked={form.subcategories.includes(c._id)} />{c.name}</MenuItem>)}
                </CustomSelect>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel>Child Category</CustomFormLabel>
                <CustomSelect name="childcategoryId" value={form.childcategoryId} onChange={handleChange} fullWidth>
                  {childCategories.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                </CustomSelect>
              </Grid>

              {form.childcategoryId === '683dbbfbb62d2a241de0f7e3' && (
                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Service</CustomFormLabel>
                  <CustomSelect name="serviceId" multiple value={form.serviceId} onChange={handleMultiSelectChange} fullWidth renderValue={s => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{s.map(v => <Chip key={v} label={services.find(c => c._id === v)?.name} size="small" />)}</Box>
                  )}>
                    {services.map(s => <MenuItem key={s._id} value={s._id}><Checkbox checked={form.serviceId.includes(s._id)} />{s.name}</MenuItem>)}
                  </CustomSelect>
                </Grid>
              )}

              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel>Profile Photo</CustomFormLabel>
                {!previews.image ? <CompactFileInput id="image" onChange={e => handleFileChange(e, 'image')} /> : <ImagePreview src={previews.image} onRemove={() => handleRemoveFile('image')} onEdit={e => handleFileChange(e, 'image')} />}
              </Grid>

              {form.childcategoryId === '683dbc04b62d2a241de0f7e8' && (
                <>
                  <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Business Name</CustomFormLabel><CustomTextField name="business_name" value={form.business_name} onChange={handleChange} fullWidth placeholder="e.g. John's Services" /></Grid>
                  <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Logo</CustomFormLabel>{!previews.logo ? <CompactFileInput id="logo" onChange={e => handleFileChange(e, 'logo')} /> : <ImagePreview src={previews.logo} onRemove={() => handleRemoveFile('logo')} onEdit={e => handleFileChange(e, 'logo')} />}</Grid>
                  <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Banner</CustomFormLabel>{!previews.banner_image ? <CompactFileInput id="banner" onChange={e => handleFileChange(e, 'banner_image')} /> : <ImagePreview src={previews.banner_image} onRemove={() => handleRemoveFile('banner_image')} onEdit={e => handleFileChange(e, 'banner_image')} />}</Grid>
                </>
              )}
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Slug</CustomFormLabel><CustomTextField name="slug" value={form.slug} onChange={handleChange} fullWidth placeholder="e.g. unique-slug-identifier" /></Grid>
            </Grid>
          </ParentCard>

          <ParentCard title="Identity Documents">
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>PAN Number</CustomFormLabel><CustomTextField name="pan_number" value={form.pan_number} onChange={handleChange} fullWidth placeholder="e.g. ABCDE1234F" /></Grid>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>PAN Front</CustomFormLabel>{!previews.pan_card_front ? <CompactFileInput id="pan_f" onChange={e => handleFileChange(e, 'pan_card_front')} /> : <ImagePreview src={previews.pan_card_front} onRemove={() => handleRemoveFile('pan_card_front')} onEdit={e => handleFileChange(e, 'pan_card_front')} />}</Grid>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>PAN Back</CustomFormLabel>{!previews.pan_card_back ? <CompactFileInput id="pan_b" onChange={e => handleFileChange(e, 'pan_card_back')} /> : <ImagePreview src={previews.pan_card_back} onRemove={() => handleRemoveFile('pan_card_back')} onEdit={e => handleFileChange(e, 'pan_card_back')} />}</Grid>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Aadhaar Number</CustomFormLabel><CustomTextField name="aadhar_number" value={form.aadhar_number} onChange={handleChange} fullWidth inputProps={{ maxLength: 12 }} placeholder="e.g. 1234 5678 9101" /></Grid>
              <Grid item xs={12} sm={3} md={2.25}><CustomFormLabel>Aadhaar Front</CustomFormLabel>{!previews.aadhar_card_front ? <CompactFileInput id="aadhar_f" onChange={e => handleFileChange(e, 'aadhar_card_front')} /> : <ImagePreview src={previews.aadhar_card_front} onRemove={() => handleRemoveFile('aadhar_card_front')} onEdit={e => handleFileChange(e, 'aadhar_card_front')} />}</Grid>
              <Grid item xs={12} sm={3} md={2.25}><CustomFormLabel>Aadhaar Back</CustomFormLabel>{!previews.aadhar_card_back ? <CompactFileInput id="aadhar_b" onChange={e => handleFileChange(e, 'aadhar_card_back')} /> : <ImagePreview src={previews.aadhar_card_back} onRemove={() => handleRemoveFile('aadhar_card_back')} onEdit={e => handleFileChange(e, 'aadhar_card_back')} />}</Grid>

              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Customer Bill Copy</CustomFormLabel>{!previews.customer_bill_copy ? <CompactFileInput id="bill" onChange={e => handleFileChange(e, 'customer_bill_copy')} /> : <ImagePreview src={previews.customer_bill_copy} onRemove={() => handleRemoveFile('customer_bill_copy')} onEdit={e => handleFileChange(e, 'customer_bill_copy')} />}</Grid>

              {form.childcategoryId === '683dbbfbb62d2a241de0f7e3' && (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Address Proof Type</CustomFormLabel>
                    <CustomSelect name="address_proof_type" value={form.address_proof_type} onChange={handleChange} fullWidth>
                      <MenuItem value="GAS BILL">Gas Bill</MenuItem>
                      <MenuItem value="RENTAL AGREEMENT">Rental Agreement</MenuItem>
                      <MenuItem value="POWER BILL">Power Bill</MenuItem>
                    </CustomSelect>
                  </Grid>
                  {form.address_proof_type && (
                    <>
                      <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Address Proof Number</CustomFormLabel><CustomTextField name="address_proof_number" value={form.address_proof_number} onChange={handleChange} fullWidth placeholder="e.g. 1234567890" /></Grid>
                      <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Address Proof Image</CustomFormLabel>{!previews.address_proof ? <CompactFileInput id="addr_proof" onChange={e => handleFileChange(e, 'address_proof')} /> : <ImagePreview src={previews.address_proof} onRemove={() => handleRemoveFile('address_proof')} onEdit={e => handleFileChange(e, 'address_proof')} />}</Grid>
                    </>
                  )}
                </>
              )}

              {form.childcategoryId === '683dbc04b62d2a241de0f7e8' && (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Business Proof Type</CustomFormLabel>
                    <CustomSelect name="business_proof_type" value={form.business_proof_type} onChange={handleChange} fullWidth>
                      <MenuItem value="LABOUR LICENCE">Labour Licence</MenuItem>
                      <MenuItem value="UDYAM CERTIFICATE">Udyam Certificate</MenuItem>
                      {/* <MenuItem value="GST">GST</MenuItem> */}
                    </CustomSelect>
                  </Grid>

                  {form.business_proof_type && (
                    <>
                      <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Business/GST No.</CustomFormLabel><CustomTextField name="business_number" value={form.business_number} onChange={handleChange} fullWidth placeholder="e.g. 29ABCDE1234F1Z5" /></Grid>
                      <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Proof Image</CustomFormLabel>{!previews.business_proof ? <CompactFileInput id="biz_proof" onChange={e => handleFileChange(e, 'business_proof')} /> : <ImagePreview src={previews.business_proof} onRemove={() => handleRemoveFile('business_proof')} onEdit={e => handleFileChange(e, 'business_proof')} />}</Grid>
                    </>
                  )}

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Business Images (Max 5)</CustomFormLabel>
                    <CompactFileInput id="biz_imgs" onChange={handleBusinessImagesChange} multiple />
                    {previews.business_images && previews.business_images.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {previews.business_images.map((img, i) => (
                          <Box key={i} sx={{ position: 'relative', width: 60, height: 60 }}>
                            <CardMedia component="img" image={img} sx={{ width: '100%', height: '100%', borderRadius: 1 }} />
                            <IconButton size="small" onClick={() => removeBusinessImage(i)} sx={{ position: 'absolute', top: -5, right: -5, bgcolor: 'background.paper', p: 0.5 }}><IconX size={12} /></IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Grid>
                </>
              )}
            </Grid>
          </ParentCard>

          <ParentCard title="Service Area Information">
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={12} md={4}><CustomFormLabel>Country</CustomFormLabel><CustomSelect value={form.countryId} onChange={e => { setSelectedCountry(e.target.value); setForm(prev => ({ ...prev, countryId: e.target.value, stateId: '', cityId: '' })); }} fullWidth>{countries.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}</CustomSelect></Grid>
              <Grid item xs={12} md={4}><CustomFormLabel>State</CustomFormLabel><CustomSelect value={form.stateId} onChange={e => { setSelectedState(e.target.value); setForm(prev => ({ ...prev, stateId: e.target.value, cityId: '' })); }} fullWidth disabled={!form.countryId}>{states.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}</CustomSelect></Grid>
              <Grid item xs={12} md={4}><CustomFormLabel>City</CustomFormLabel><CustomSelect value={form.cityId} onChange={e => setForm(prev => ({ ...prev, cityId: e.target.value }))} fullWidth disabled={!form.stateId}>{cities.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}</CustomSelect></Grid>
              <Grid item xs={12} md={6}><CustomFormLabel>Search Location</CustomFormLabel>{scriptLoaded ? <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}><TextField fullWidth value={form.address} onChange={handleChange} name="address" placeholder="e.g. Whitefield, Bangalore" InputProps={{ endAdornment: <IconButton onClick={handleCurrentLocation} disabled={loadingCurrentLocation}>{loadingCurrentLocation ? <CircularProgress size={20} /> : <MyLocationIcon />}</IconButton> }} /></Autocomplete> : <TextField fullWidth disabled value="Loading Maps..." />}</Grid>
              <Grid item xs={12} sm={4} md={2}><CustomFormLabel>Lat</CustomFormLabel><CustomTextField value={form.latitude} fullWidth disabled placeholder="e.g. 17.3850" /></Grid>
              <Grid item xs={12} sm={4} md={2}><CustomFormLabel>Lng</CustomFormLabel><CustomTextField value={form.longitude} fullWidth disabled placeholder="e.g. 78.4867" /></Grid>
              <Grid item xs={12} sm={4} md={2}><CustomFormLabel>Radius (KM)</CustomFormLabel><CustomTextField name="deliveryRadiusKm" type="number" value={form.deliveryRadiusKm} onChange={handleChange} fullWidth placeholder="e.g. 10" /></Grid>

              {form.latitude && form.longitude && (
                <Grid item xs={12}>
                  <Box sx={{ height: 400, width: '100%', borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
                    <GoogleMap mapContainerStyle={{ height: '100%', width: '100%' }} center={{ lat: parseFloat(form.latitude), lng: parseFloat(form.longitude) }} zoom={13}>
                      <Marker position={{ lat: parseFloat(form.latitude), lng: parseFloat(form.longitude) }} />
                      {form.deliveryRadiusKm > 0 && <Circle center={{ lat: parseFloat(form.latitude), lng: parseFloat(form.longitude) }} radius={form.deliveryRadiusKm * 1000} options={{ fillColor: 'red', fillOpacity: 0.2, strokeColor: 'red', strokeWeight: 1 }} />}
                    </GoogleMap>
                  </Box>
                </Grid>
              )}
            </Grid>
          </ParentCard>

          <ParentCard title="Banking & SEO">
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Bank Name</CustomFormLabel><CustomTextField name="bankName" value={form.bankName} onChange={handleChange} fullWidth placeholder="e.g. SBI Bank" /></Grid>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Branch Name</CustomFormLabel><CustomTextField name="branchName" value={form.branchName} onChange={handleChange} fullWidth placeholder="e.g. Indiranagar" /></Grid>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Holder Name</CustomFormLabel><CustomTextField name="holderName" value={form.holderName} onChange={handleChange} fullWidth placeholder="e.g. John Doe" /></Grid>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>Account Number</CustomFormLabel><CustomTextField name="accountNumber" value={form.accountNumber} onChange={handleChange} fullWidth placeholder="e.g. 1234567890" /></Grid>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>IFSC Code</CustomFormLabel><CustomTextField name="ifsc_code" value={form.ifsc_code} onChange={handleChange} fullWidth placeholder="e.g. SBIN0001234" /></Grid>
              <Grid item xs={12} sm={6} md={3}><CustomFormLabel>UPI ID</CustomFormLabel><CustomTextField name="upid" value={form.upid} onChange={handleChange} fullWidth placeholder="e.g. john@ybl" /></Grid>
              <Grid item xs={12} sm={12} md={6}><CustomFormLabel>Meta Title</CustomFormLabel><CustomTextField name="metaTitle" value={form.metaTitle} onChange={handleChange} fullWidth placeholder="e.g. Best Plumbing Services" /></Grid>
              <Grid item xs={12}><CustomFormLabel>Meta Keywords</CustomFormLabel><Box sx={{ border: '1px solid #ddd', p: 1, borderRadius: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>{tags.map((t, i) => <Chip key={i} label={t} onDelete={() => setTags(tags.filter((_, idx) => idx !== i))} />)}<TextField variant="standard" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (inputValue) { setTags([...tags, inputValue]); setInputValue(''); } } }} placeholder="Type and press Enter, e.g. Plumbing" /></Box></Grid>
              <Grid item xs={12}><CustomFormLabel>Meta Description</CustomFormLabel><CustomTextField name="metaDescription" value={form.metaDescription} onChange={handleChange} fullWidth multiline rows={2} placeholder="e.g. Providing quality plumbing services in Bangalore..." /></Grid>
            </Grid>
          </ParentCard>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton loading={loading} variant="contained" type="submit" size="large">Save Service Provider</LoadingButton>
          </Box>
        </form>
        <ToastContainer />
      </PageContainer>
    </LoadScript>
  );
};

export default Providers;


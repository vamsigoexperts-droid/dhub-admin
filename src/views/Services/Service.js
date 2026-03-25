import React, { useState, useEffect, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import CustomOutlinedInput from '../../components/forms/theme-elements/CustomOutlinedInput';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from '../../components/forms/theme-elements/CustomCheckbox';
import ParentCard from '../../components/shared/ParentCard';
import { Button, InputAdornment, styled } from '@mui/material';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import {
  Select,
  MenuItem,
  FormControlLabel,
  TextField,
  Avatar,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  CardContent,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Service' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Add Service Form Component
const AddServiceForm = ({ onClose, onSubmit, Zone }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    referalAmount: '',
    commissionType: '',
    adminCommission: '',
    storeNearByRadius: '',
    zoneId: [],
    additionalText: '',
    flagType: '',
  });

  const handleZoneChange = (e) => {
    setForm((prev) => ({ ...prev, zoneId: e.target.value }));
  };

  const [state, setState] = useState({
    status: false,
    dineInfeature: false,
    productDetails: false,
    adminCommissiontype: false,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file1, setFile1] = useState(null);
  const [preview1, setPreview1] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeCheckBox = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const changeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, or PNG.');
      }
    }
  };

  const changeHandler1 = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        setFile1(selectedFile);
        setPreview1(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, or PNG.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name) {
      toast.error('Service Name is required.');
      return;
    }
    // if (!form.flagType) {
    //   toast.error('flag Type is required.');
    //   return;
    // }
    if (!file) {
      toast.error('Image is required for new services.');
      return;
    }
    if (!file1) {
      toast.error('Banner is required for new services.');
      return;
    }
    if (!form.referalAmount) {
      toast.error('Referral amount is required.');
      return;
    }
  
    if (state.adminCommissiontype && (!form.commissionType || !form.adminCommission)) {
      toast.error('Commission type and admin commission are required when enabled.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('zoneId', JSON.stringify(form.zoneId));
    formData.append('flagType', form.flagType);
    formData.append('additionalText', form.additionalText);
    formData.append('referalAmount', form.referalAmount);
    formData.append('commissionType', form.commissionType);
    formData.append('adminCommission', form.adminCommission);
    formData.append('storeNearByRadius', form.storeNearByRadius);
    formData.append('status', state.status);
    formData.append('dineInfeature', state.dineInfeature);
    formData.append('productDetails', state.productDetails);
    formData.append('adminCommissiontype', state.adminCommissiontype);
    formData.append('image', file);
    formData.append('bannerImage', file);
    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create Service"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
<Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="name" required>
                Service Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Service Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Service Name"
              />
            </Grid>
<Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="image" required>
                Image
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{ accept: 'image/jpeg,image/png', 'aria-label': 'Upload Image' }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
<Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="image" required>
                Banner Image
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler1}
                inputProps={{ accept: 'image/jpeg,image/png', 'aria-label': 'Upload Image' }}
              />
              {preview1 && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview1} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
<Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="referalAmount" required>
                Referral Amount
              </CustomFormLabel>
              <CustomTextField
                id="referalAmount"
                variant="outlined"
                fullWidth
                type="number"
                placeholder="Enter Referral Amount"
                name="referalAmount"
                value={form.referalAmount}
                required
                onChange={handleChange}
                aria-label="Referral Amount"
                inputProps={{ min: 0 }}
              />
            </Grid>
{/* <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="storeNearByRadius" required>
                Store Nearby Radius
              </CustomFormLabel>
              <CustomOutlinedInput
                endAdornment={<InputAdornment position="end">Miles</InputAdornment>}
                id="storeNearByRadius"
                placeholder="Enter Miles"
                fullWidth
                type="number"
                name="storeNearByRadius"
                value={form.storeNearByRadius}
                required
                onChange={handleChange}
                aria-label="Store Nearby Radius"
                inputProps={{ min: 0 }}
              />
            </Grid> */}
{/* <Grid item xs={12} sm={6} md={3}>

              <CustomFormLabel htmlFor="zoneId">Select Zone</CustomFormLabel>
              <TextField
                select
                SelectProps={{ multiple: true, value: form.zoneId, onChange: handleZoneChange }}
                id="zoneId"
                name="zoneId"
                fullWidth
                required
              >
                {Zone.map((zone) => (
                  <MenuItem key={zone._id} value={zone._id}>
                    {zone.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}
{/* <Grid item xs={12} sm={6} md={3}>

              <CustomFormLabel htmlFor="flagType" required>
                Flag Type
              </CustomFormLabel>
              <CustomSelect
                id="flagType"
                fullWidth
                variant="outlined"
                name="flagType"
                value={form.flagType}
                required
                onChange={handleChange}
                aria-label="Flag Type"
              >
                <MenuItem value="shopping">Shopping</MenuItem>
                <MenuItem value="services">Services</MenuItem>
                <MenuItem value="parcel">Parcel</MenuItem>
                <MenuItem value="ride">Ride</MenuItem>
                <MenuItem value="cab">Cab</MenuItem>
                <MenuItem value="medicine">Medicine</MenuItem>
                <MenuItem value="grocery">Grocery</MenuItem>
                <MenuItem value="food">Food</MenuItem>
              </CustomSelect>
            </Grid> */}
<Grid item xs={12} sm={6} md={3}>

              <CustomFormLabel htmlFor="additionalText">Admin Text</CustomFormLabel>
              <CustomTextField
                id="additionalText"
                variant="outlined"
                fullWidth
                type="text"
                placeholder="Enter Admin Text"
                name="additionalText"
                value={form.additionalText}
                onChange={handleChange}
                aria-label="Admin Text"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ p: 2 }}>
<Grid item xs={12} sm={6} md={3}>

              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.status}
                    onChange={handleChangeCheckBox}
                    name="status"
                    color="primary"
                    inputProps={{ 'aria-label': 'Active/Inactive Status' }}
                  />
                }
                label="Active / Inactive"
              />
            </Grid>
<Grid item xs={12} sm={6} md={3}>

              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.dineInfeature}
                    onChange={handleChangeCheckBox}
                    name="dineInfeature"
                    color="primary"
                    inputProps={{ 'aria-label': 'Enable Dine-In Feature' }}
                  />
                }
                label="Enable Dine-In Feature"
              />
            </Grid>
<Grid item xs={12} sm={6} md={3}>

              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.productDetails}
                    onChange={handleChangeCheckBox}
                    name="productDetails"
                    color="primary"
                    inputProps={{ 'aria-label': 'Enable Product Detail' }}
                  />
                }
                label="Enable Product Detail"
              />
            </Grid>
<Grid item xs={12} sm={6} md={3}>

              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.adminCommissiontype}
                    onChange={handleChangeCheckBox}
                    name="adminCommissiontype"
                    color="primary"
                    inputProps={{ 'aria-label': 'Enable Admin Commission' }}
                  />
                }
                label="Enable Admin Commission"
              />
            </Grid>
            {state.adminCommissiontype && (
              <>
                <Grid item xs={12} sm={4}>
                  <CustomFormLabel htmlFor="commissionType" required>
                    Commission Type
                  </CustomFormLabel>
                  <CustomSelect
                    id="commissionType"
                    fullWidth
                    variant="outlined"
                    name="commissionType"
                    value={form.commissionType}
                    required
                    onChange={handleChange}
                    aria-label="Commission Type"
                  >
                    <MenuItem value="Percentage">Percentage</MenuItem>
                    <MenuItem value="Fixed">Fixed</MenuItem>
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomFormLabel htmlFor="adminCommission" required>
                    Admin Commission
                  </CustomFormLabel>
                  <CustomTextField
                    id="adminCommission"
                    variant="outlined"
                    fullWidth
                    type="number"
                    placeholder="Enter Admin Commission"
                    name="adminCommission"
                    value={form.adminCommission}
                    required
                    onChange={handleChange}
                    aria-label="Admin Commission"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box
            display="flex"
            justifyContent="flex-end"
            gap={1}
            sx={{
              position: 'sticky',
              bottom: 0,
              bgcolor: theme.palette.background.paper,
              p: 2,
              zIndex: 1,
            }}
          >
            <Button color="error" variant="outlined" onClick={onClose} aria-label="Close Form">
              Close
            </Button>
            <Button color="primary" variant="contained" type="submit" aria-label="Create Service">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit Service Form Component
const EditServiceForm = ({ onClose, onSubmit, initialData, Zone }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    referalAmount: initialData?.referalAmount || '',
    commissionType: initialData?.commissionType || '',
    adminCommission: initialData?.adminCommission || '',
    storeNearByRadius: initialData?.storeNearByRadius || '',
    zoneId: initialData?.zoneId || [],

    additionalText: initialData?.additionalText || '',
    flagType: initialData?.flagType || '',
  });

  const [state, setState] = useState({
    status: initialData?.status || false,
    dineInfeature: initialData?.dineInfeature || false,
    productDetails: initialData?.productDetails || false,
    adminCommissiontype: initialData?.adminCommissiontype || false,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.image ? URLS.FileBase + initialData.image : null);

  const [file1, setFile1] = useState(null);
  const [preview1, setPreview1] = useState(
    initialData?.image ? URLS.FileBase + initialData.bannerImage : null,
  );

  const handleZoneChange = (e) => {
    setForm((prev) => ({ ...prev, zoneId: e.target.value }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeCheckBox = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const changeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, or PNG.');
      }
    }
  };

  const changeHandler1 = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        setFile1(selectedFile);
        setPreview1(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, or PNG.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Service Name is required.');
      return;
    }

    if (!form.referalAmount) {
      toast.error('Referral amount is required.');
      return;
    }


    if (state.adminCommissiontype && (!form.commissionType || !form.adminCommission)) {
      toast.error('Commission type and admin commission are required when enabled.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('zoneId', JSON.stringify(form.zoneId));
    formData.append('additionalText', form.additionalText);
    formData.append('flagType', form.flagType);
    formData.append('referalAmount', form.referalAmount);
    formData.append('commissionType', form.commissionType);
    formData.append('adminCommission', form.adminCommission);
    formData.append('storeNearByRadius', form.storeNearByRadius);
    formData.append('status', state.status);
    formData.append('dineInfeature', state.dineInfeature);
    formData.append('productDetails', state.productDetails);
    formData.append('adminCommissiontype', state.adminCommissiontype);
    if (file) {
      formData.append('image', file);
    }
    if (file1) {
      formData.append('bannerImage', file1);
    }
    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Edit Service" sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}>
          <Grid container spacing={2} sx={{ p: 2 }}>
<Grid item xs={12} sm={6} md={3}>

              <CustomFormLabel htmlFor="name" required>
                Service Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Service Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Service Name"
              />
            </Grid>
        <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="image">Image</CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{ accept: 'image/jpeg,image/png', 'aria-label': 'Upload Image' }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
         <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="image" required>
                Banner Image
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler1}
                inputProps={{ accept: 'image/jpeg,image/png', 'aria-label': 'Upload Image' }}
              />
              {preview1 && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview1} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
       <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="referalAmount" required>
                Referral Amount
              </CustomFormLabel>
              <CustomTextField
                id="referalAmount"
                variant="outlined"
                fullWidth
                type="number"
                placeholder="Enter Referral Amount"
                name="referalAmount"
                value={form.referalAmount}
                required
                onChange={handleChange}
                aria-label="Referral Amount"
                inputProps={{ min: 0 }}
              />
            </Grid>
    {/* <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="storeNearByRadius" required>
                Store Nearby Radius
              </CustomFormLabel>
              <CustomOutlinedInput
                endAdornment={<InputAdornment position="end">Miles</InputAdornment>}
                id="storeNearByRadius"
                placeholder="Enter Miles"
                fullWidth
                type="number"
                name="storeNearByRadius"
                value={form.storeNearByRadius}
                required
                onChange={handleChange}
                aria-label="Store Nearby Radius"
                inputProps={{ min: 0 }}
              />
            </Grid> */}
{/* <Grid item xs={12} sm={6} md={3}>

              <CustomFormLabel htmlFor="zoneId">Select Zone</CustomFormLabel>
              <TextField
                select
                SelectProps={{ multiple: true, value: form.zoneId, onChange: handleZoneChange }}
                id="zoneId"
                name="zoneId"
                fullWidth
                required
              >
                {Zone.map((zone) => (
                  <MenuItem key={zone._id} value={zone._id}>
                    {zone.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}
        {/* <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="flagType">Flag Type</CustomFormLabel>
              <CustomSelect
                id="flagType"
                fullWidth
                variant="outlined"
                name="flagType"
                value={form.flagType}
                readOnly
                onChange={handleChange}
                aria-label="Flag Type"
              >
                <MenuItem value="shopping">Shopping</MenuItem>
                <MenuItem value="services">Services</MenuItem>
                <MenuItem value="parcel">Parcel</MenuItem>
                <MenuItem value="ride">Ride</MenuItem>
                <MenuItem value="cab">Cab</MenuItem>
                <MenuItem value="medicine">Medicine</MenuItem>
                <MenuItem value="grocery">Grocery</MenuItem>
                <MenuItem value="food">Food</MenuItem>
              </CustomSelect>
            </Grid> */}
   <Grid item xs={6} sm={6} md={3}>
              <CustomFormLabel htmlFor="additionalText">Admin Text</CustomFormLabel>
              <CustomTextField
                id="additionalText"
                variant="outlined"
                fullWidth
                type="text"
                placeholder="Enter Admin Text"
                name="additionalText"
                value={form.additionalText}
                onChange={handleChange}
                aria-label="Admin Text"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ p: 2 }}>
   <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.status}
                    onChange={handleChangeCheckBox}
                    name="status"
                    color="primary"
                    inputProps={{ 'aria-label': 'Active/Inactive Status' }}
                  />
                }
                label="Active / Inactive"
              />
            </Grid>
            
          {/* <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.dineInfeature}
                    onChange={handleChangeCheckBox}
                    name="dineInfeature"
                    color="primary"
                    inputProps={{ 'aria-label': 'Enable Dine-In Feature' }}
                  />
                }
                label="Enable Dine-In Feature"
              />
            </Grid> */}
  {/* <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.productDetails}
                    onChange={handleChangeCheckBox}
                    name="productDetails"
                    color="primary"
                    inputProps={{ 'aria-label': 'Enable Product Detail' }}
                  />
                }
                label="Enable Product Detail"
              />
            </Grid> */}
       <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.adminCommissiontype}
                    onChange={handleChangeCheckBox}
                    name="adminCommissiontype"
                    color="primary"
                    inputProps={{ 'aria-label': 'Enable Admin Commission' }}
                  />
                }
                label="Enable Admin Commission"
              />
            </Grid>
            {state.adminCommissiontype && (
              <>
        <Grid item xs={12} sm={6} md={3}>

                  <CustomFormLabel htmlFor="commissionType" required>
                    Commission Type
                  </CustomFormLabel>
                  <CustomSelect
                    id="commissionType"
                    fullWidth
                    variant="outlined"
                    name="commissionType"
                    value={form.commissionType}
                    required
                    onChange={handleChange}
                    aria-label="Commission Type"
                  >
                    <MenuItem value="Percentage">Percentage</MenuItem>
                    <MenuItem value="Fixed">Fixed</MenuItem>
                  </CustomSelect>
                </Grid>
   <Grid item xs={12} sm={6} md={3}>

                  <CustomFormLabel htmlFor="adminCommission" required>
                    Admin Commission
                  </CustomFormLabel>
                  <CustomTextField
                    id="adminCommission"
                    variant="outlined"
                    fullWidth
                    type="number"
                    placeholder="Enter Admin Commission"
                    name="adminCommission"
                    value={form.adminCommission}
                    required
                    onChange={handleChange}
                    aria-label="Admin Commission"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box
            display="flex"
            justifyContent="flex-end"
            gap={1}
            sx={{
              position: 'sticky',
              bottom: 0,
              bgcolor: theme.palette.background.paper,
              p: 2,
              zIndex: 1,
            }}
          >
            <Button color="error" variant="outlined" onClick={onClose} aria-label="Close Form">
              Close
            </Button>
            <Button color="primary" variant="contained" type="submit" aria-label="Update Service">
              Update
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main Service Component
const Service = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);

  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [Zone, SetZone] = useState([]);

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0]

  const handleAddPopUp = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setEditData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getZone = () => {
    setLoading(true);
    axios
      .post(URLS.GetZones, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => SetZone(res.data.zones || []))
      .catch(() => toast.error('Failed to fetch Zones'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getZone();
  }, []);

  const handleEditPopUp = (data) => {
    setShowEditForm(true);
    setShowAddForm(false);
    setEditData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditData(null);
  };

  const handleSubmit = async (formData, id) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let res;
      if (id) {
        res = await axios.put(`${URLS.UpdateService}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddService, formData, config);
      }

      if (res.status === 200) {
        toast.success(res.data.message);
        handleCloseForm();
        getData();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm('Do you really want to delete this service?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteService}/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          getData();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetService,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.services || []);
    } catch (error) {
      toast.error('Failed to fetch services.');
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (search === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [data, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'sectionInfo',
        headerName: 'Service Info',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={URLS.FileBase + params.row.image}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">{params.row.name}</Typography>
          </Box>
        ),
      },
      {
        field: 'Banner Image',
        headerName: 'Banner Image',
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={URLS.FileBase + params.row.bannerImage}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
          </Box>
        ),
      },
      { field: 'additionalText', headerName: 'Additional Text', flex: 1 },
      // { field: 'flagType', headerName: 'flag Type', flex: 1 },
      // { field: 'zoneName', headerName: 'Zones', flex: 1 },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => (
          <Chip
            label={params.row.status ? 'Active' : 'Inactive'}
            size="small"
            color={params.row.status ? 'primary' : 'error'}
            variant="outlined"
          />
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        minWidth: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            {rolesAndPermission.services_view === true || rolesAndPermission.accessAll === true ? <>
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={() => handleEditPopUp(params.row)}
                disabled={loading}
                sx={{ minWidth: '32px', padding: '4px 6px' }}
                aria-label={`Edit ${params.row.name}`}
              >
                <IconEdit stroke={1.5} size={18} />
                Edit
              </Button>
            </> : <></>}

            {rolesAndPermission.services_delete === true || rolesAndPermission.accessAll === true ? <>
              {/* <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => handleDelete(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Delete ${params.row.name}`}
            >
              <IconTrash stroke={1.5} size={18} />
            </Button> */}

            </> : <></>}
          </Box>
        ),
      },
    ],
    [loading],
  );

  const rows = useMemo(
    () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
    [filteredData],
  );

  return (
    <PageContainer title="Service Page" description="Manage services for your e-commerce platform">
      <Breadcrumb title="Service Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      {showAddForm && (
        <AddServiceForm onClose={handleCloseForm} onSubmit={handleSubmit} Zone={Zone} />
      )}
      {showEditForm && (
        <EditServiceForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          Zone={Zone}
        />
      )}
      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h6">Service List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Services"
            />
            {rolesAndPermission.services_add === true || rolesAndPermission.accessAll === true ? <>
              {/* <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              disabled={loading}
              startIcon={<IconPlus size={20} />}
              aria-label="Create New Service"
            >
              Create Service
            </Button> */}</> : <></>}
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pageSize={5}
              rowHeight={38}
              rowsPerPageOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default Service;

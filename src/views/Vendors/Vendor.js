import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TextField,
  Avatar,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  CardContent,
  Button,
  Chip,
  Select,
  MenuItem,
} from '@mui/material';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from 'src/Url';
import axios from 'axios';
import debounce from 'lodash/debounce';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Vendors' }];

// Utility to get auth token
const getAuthToken = () => JSON.parse(localStorage.getItem('user'))?.token || '';

// Add Vendor Form Component
const AddVendorForm = ({ onClose, onSubmit, City }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    bankName: '',
    branchName: '',
    holderName: '',
    accountNumber: '',
    otherInformation: '',
    city_id: '',
    pincode: '',
    address: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = 'First Name is required';
    if (!form.lastName) newErrors.lastName = 'Last Name is required';
    if (!form.phone || !/^\d{10}$/.test(form.phone))
      newErrors.phone = 'Valid 10-digit Phone Number is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Valid Email is required';
    if (!form.password || form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!form.bankName) newErrors.bankName = 'Bank Name is required';
    if (!form.branchName) newErrors.branchName = 'Branch Name is required';
    if (!form.holderName) newErrors.holderName = 'Holder Name is required';
    if (!form.accountNumber) newErrors.accountNumber = 'Account Number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly.');
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (file) formData.append('image', file);

    onSubmit(formData);
    setForm({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      bankName: '',
      branchName: '',
      holderName: '',
      accountNumber: '',
      otherInformation: '',
      city_id: '',
      pincode: '',
      address: '',
    });
    setFile(null);
    setPreview(null);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <ParentCard title="Create Vendor">
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="firstName" required>
              First Name
            </CustomFormLabel>
            <CustomTextField
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter First Name"
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName}
              aria-label="Vendor First Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="lastName" required>
              Last Name
            </CustomFormLabel>
            <CustomTextField
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter Last Name"
              fullWidth
              required
              error={!!errors.lastName}
              helperText={errors.lastName}
              aria-label="Vendor Last Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="phone" required>
              Phone Number
            </CustomFormLabel>
            <CustomTextField
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              fullWidth
              required
              error={!!errors.phone}
              helperText={errors.phone}
              aria-label="Vendor Phone Number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="image">Image</CustomFormLabel>
            <CustomTextField
              id="image"
              type="file"
              onChange={changeHandler}
              fullWidth
              inputProps={{ accept: 'image/jpeg,image/png', 'aria-label': 'Upload Vendor Image' }}
            />
            {preview && (
              <Box mt={1}>
                <Typography variant="caption">Preview:</Typography>
                <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="email" required>
              Email
            </CustomFormLabel>
            <CustomTextField
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email"
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
              aria-label="Vendor Email"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="password" required>
              Password
            </CustomFormLabel>
            <CustomTextField
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Password"
              fullWidth
              required
              error={!!errors.password}
              helperText={errors.password}
              aria-label="Vendor Password"
            />
          </Grid>
        </Grid>
      </ParentCard>

      <ParentCard title="Address Details">
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="city_id" required>
              City
            </CustomFormLabel>
            <Select
              id="city_id"
              value={form.city_id}
              name="city_id"
              required
              onChange={handleChange}
              fullWidth
              variant="outlined"
              aria-label="Vendor City"
            >
              {City.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="address">Address</CustomFormLabel>
            <CustomTextField
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter Address"
              fullWidth
              aria-label="Vendor Address"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="pincode">Pincode</CustomFormLabel>
            <CustomTextField
              id="pincode"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Enter Pincode"
              fullWidth
              aria-label="Vendor Pincode"
            />
          </Grid>
        </Grid>
      </ParentCard>

      <ParentCard title="Bank Details">
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="bankName" required>
              Bank Name
            </CustomFormLabel>
            <CustomTextField
              id="bankName"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              placeholder="Enter Bank Name"
              fullWidth
              required
              error={!!errors.bankName}
              helperText={errors.bankName}
              aria-label="Vendor Bank Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="branchName" required>
              Branch Name
            </CustomFormLabel>
            <CustomTextField
              id="branchName"
              name="branchName"
              value={form.branchName}
              onChange={handleChange}
              placeholder="Enter Branch Name"
              fullWidth
              required
              error={!!errors.branchName}
              helperText={errors.branchName}
              aria-label="Vendor Branch Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="holderName" required>
              Holder Name
            </CustomFormLabel>
            <CustomTextField
              id="holderName"
              name="holderName"
              value={form.holderName}
              onChange={handleChange}
              placeholder="Enter Holder Name"
              fullWidth
              required
              error={!!errors.holderName}
              helperText={errors.holderName}
              aria-label="Vendor Holder Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="accountNumber" required>
              Account Number
            </CustomFormLabel>
            <CustomTextField
              id="accountNumber"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="Enter Account Number"
              fullWidth
              required
              error={!!errors.accountNumber}
              helperText={errors.accountNumber}
              aria-label="Vendor Account Number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="otherInformation">Other Information</CustomFormLabel>
            <CustomTextField
              id="otherInformation"
              name="otherInformation"
              value={form.otherInformation}
              onChange={handleChange}
              placeholder="Enter Other Information"
              fullWidth
              aria-label="Vendor Other Information"
            />
          </Grid>
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
          <Button
            color="error"
            variant="outlined"
            onClick={onClose}
            aria-label="Cancel Vendor Creation"
          >
            Cancel
          </Button>
          <Button color="primary" variant="contained" type="submit" aria-label="Create Vendor">
            Submit
          </Button>
        </Box>
      </ParentCard>
    </Box>
  );
};

// Edit Vendor Form Component
const EditVendorForm = ({ onClose, onSubmit, initialData, City }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    bankName: initialData?.bankName || '',
    branchName: initialData?.branchName || '',
    holderName: initialData?.holderName || '',
    accountNumber: initialData?.accountNumber || '',
    otherInformation: initialData?.otherInformation || '',
    city_id: initialData?.city_id || '',
    pincode: initialData?.pincode || '',
    address: initialData?.address || '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    initialData?.image ? `${URLS.FileBase}${initialData.image}` : null,
  );
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = 'First Name is required';
    if (!form.lastName) newErrors.lastName = 'Last Name is required';
    if (!form.phone || !/^\d{10}$/.test(form.phone))
      newErrors.phone = 'Valid 10-digit Phone Number is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Valid Email is required';
    if (form.password && form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!form.bankName) newErrors.bankName = 'Bank Name is required';
    if (!form.branchName) newErrors.branchName = 'Branch Name is required';
    if (!form.holderName) newErrors.holderName = 'Holder Name is required';
    if (!form.accountNumber) newErrors.accountNumber = 'Account Number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly.');
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === 'password' && !form[key]) return; // Skip empty password
      formData.append(key, form[key]);
    });
    if (file) formData.append('image', file);

    onSubmit(formData, initialData._id);
    setForm({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      bankName: '',
      branchName: '',
      holderName: '',
      accountNumber: '',
      otherInformation: '',
      city_id: '',
      pincode: '',
      address: '',
    });
    setFile(null);
    setPreview(null);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ py: 2 }}>
      <ParentCard title="Edit Vendor">
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="firstName" required>
              First Name
            </CustomFormLabel>
            <CustomTextField
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter First Name"
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName}
              aria-label="Vendor First Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="lastName" required>
              Last Name
            </CustomFormLabel>
            <CustomTextField
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter Last Name"
              fullWidth
              required
              error={!!errors.lastName}
              helperText={errors.lastName}
              aria-label="Vendor Last Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="phone" required>
              Phone Number
            </CustomFormLabel>
            <CustomTextField
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              fullWidth
              required
              error={!!errors.phone}
              helperText={errors.phone}
              aria-label="Vendor Phone Number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="image">Image</CustomFormLabel>
            <CustomTextField
              id="image"
              type="file"
              onChange={changeHandler}
              fullWidth
              inputProps={{ accept: 'image/jpeg,image/png', 'aria-label': 'Upload Vendor Image' }}
            />
            {preview && (
              <Box mt={1}>
                <Typography variant="caption">Preview:</Typography>
                <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="email" required>
              Email
            </CustomFormLabel>
            <CustomTextField
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email"
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
              aria-label="Vendor Email"
            />
          </Grid>
        </Grid>
      </ParentCard>

      <ParentCard title="Address Details">
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="city_id" required>
              City
            </CustomFormLabel>
            <Select
              id="city_id"
              value={form.city_id}
              name="city_id"
              required
              onChange={handleChange}
              fullWidth
              variant="outlined"
              aria-label="Vendor City"
            >
              {City.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="address">Address</CustomFormLabel>
            <CustomTextField
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter Address"
              fullWidth
              aria-label="Vendor Address"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="pincode">Pincode</CustomFormLabel>
            <CustomTextField
              id="pincode"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Enter Pincode"
              fullWidth
              aria-label="Vendor Pincode"
            />
          </Grid>
        </Grid>
      </ParentCard>

      <ParentCard title="Bank Details">
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="bankName" required>
              Bank Name
            </CustomFormLabel>
            <CustomTextField
              id="bankName"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              placeholder="Enter Bank Name"
              fullWidth
              required
              error={!!errors.bankName}
              helperText={errors.bankName}
              aria-label="Vendor Bank Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="branchName" required>
              Branch Name
            </CustomFormLabel>
            <CustomTextField
              id="branchName"
              name="branchName"
              value={form.branchName}
              onChange={handleChange}
              placeholder="Enter Branch Name"
              fullWidth
              required
              error={!!errors.branchName}
              helperText={errors.branchName}
              aria-label="Vendor Branch Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="holderName" required>
              Holder Name
            </CustomFormLabel>
            <CustomTextField
              id="holderName"
              name="holderName"
              value={form.holderName}
              onChange={handleChange}
              placeholder="Enter Holder Name"
              fullWidth
              required
              error={!!errors.holderName}
              helperText={errors.holderName}
              aria-label="Vendor Holder Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="accountNumber" required>
              Account Number
            </CustomFormLabel>
            <CustomTextField
              id="accountNumber"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="Enter Account Number"
              fullWidth
              required
              error={!!errors.accountNumber}
              helperText={errors.accountNumber}
              aria-label="Vendor Account Number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="otherInformation">Other Information</CustomFormLabel>
            <CustomTextField
              id="otherInformation"
              name="otherInformation"
              value={form.otherInformation}
              onChange={handleChange}
              placeholder="Enter Other Information"
              fullWidth
              aria-label="Vendor Other Information"
            />
          </Grid>
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
          <Button
            color="error"
            variant="outlined"
            onClick={onClose}
            aria-label="Cancel Vendor Editing"
          >
            Cancel
          </Button>
          <Button color="primary" variant="contained" type="submit" aria-label="Update Vendor">
            Submit
          </Button>
        </Box>
      </ParentCard>
    </Box>
  );
};

// Main Vendors Component
const Vendors = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState({ fetch: false, submit: false, delete: false });
  const [City, setCity] = useState([]);

  const token = getAuthToken();

  const handleAddPopUp = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setEditData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

    setIsLoading((prev) => ({ ...prev, submit: true }));
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      };
      const res = id
        ? await axios.put(`${URLS.UpdateVendor}/${id}`, formData, config)
        : await axios.post(URLS.AddVendor, formData, config);

      if (res.status === 200) {
        toast.success(res.data.message || 'Vendor saved successfully');
        handleCloseForm();
        await getData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save vendor');
    } finally {
      setIsLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const handleDelete = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (!window.confirm('Do you really want to delete this vendor?')) return;

    setIsLoading((prev) => ({ ...prev, delete: true }));
    try {
      const res = await axios.delete(`${URLS.DeleteVendor}/${data._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        toast.success(res.data.message || 'Vendor deleted successfully');
        await getData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete vendor');
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setIsLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const res = await axios.post(
        URLS.GetVendor,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.vendors || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch vendors');
    } finally {
      setIsLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

  const getCity = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    try {
      const res = await axios.post(
        URLS.GetCity,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCity(res.data.city || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch cities');
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      await Promise.all([getData(), getCity()]);
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 300),
    [],
  );

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      `${item.firstName} ${item.lastName}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

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
        headerName: 'Vendor Info',
        flex: 1,
        minWidth: 200,
        renderCell: ({ row }) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={`${URLS.FileBase}${row.image}`}
              alt={`${row.firstName} ${row.lastName}`}
              sx={{ width: 40, height: 40 }}
            />
            <Typography>{`${row.firstName} ${row.lastName}`}</Typography>
          </Box>
        ),
      },
      { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 150 },
      { field: 'email', headerName: 'Email', flex: 1, minWidth: 150 },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 100,
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
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleEditPopUp(params.row)}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Edit ${params.row.firstName} ${params.row.lastName}`}
            >
              <IconEdit stroke={1.5} size={18} />
            </Button>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => handleDelete(params.row)}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Delete ${params.row.firstName} ${params.row.lastName}`}
            >
              <IconTrash stroke={1.5} size={18} />
            </Button>
          </Box>
        ),
      },
    ],
    [],
  );

  const rows = useMemo(
    () => filteredData.map((item) => ({ id: item._id, ...item })),
    [filteredData],
  );

  return (
    <PageContainer title="Vendors" description="Manage vendors for your e-commerce platform">
      <Breadcrumb title="Vendors Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && (
        <AddVendorForm onClose={handleCloseForm} onSubmit={handleSubmit} City={City} />
      )}

      {showEditForm && (
        <EditVendorForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          City={City}
        />
      )}

      <Paper variant="outlined">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h6">Vendors List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              onChange={(e) => debouncedSearch(e.target.value)}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: theme.palette.background.paper }}
              aria-label="Search vendors by name"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              disabled={isLoading.submit}
              startIcon={<IconPlus size={20} />}
              aria-label="Create New Vendor"
            >
              Create Vendor
            </Button>
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              loading={isLoading.fetch}
              aria-label="Vendors Data Table"
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default Vendors;

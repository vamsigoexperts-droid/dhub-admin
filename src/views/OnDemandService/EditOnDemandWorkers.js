import React, { useState, useEffect } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from '../../components/forms/theme-elements/CustomCheckbox';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { styled, useTheme } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import { IconArrowBackUp } from '@tabler/icons-react';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Button,
  Select,
  MenuItem,
  Avatar,
  Box,
  Typography,
  Grid,
  Divider,
  FormControlLabel,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Edit On Demand Worker' }];

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const EditOnDemandWorkers = () => {
  const theme = useTheme();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    providerId: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    salary: '',
    address: '',
  });

  const [state, setState] = useState({
    onlineOrOffline: false,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const getToken = () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return '';
      return JSON.parse(user)?.token || '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  };

  const token = getToken();
  const OnDemandWorkerId = localStorage.getItem('OnDemandWorkerId');

  const fetchData = async () => {
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }
    try {
      const response = await axios.post(
        URLS.GetProvider,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setProviders(response.data.activeproviders || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch providers.');
    }
  };

  const fetchServicedata = async () => {
    if (!token || !OnDemandWorkerId) {
      toast.error('Please log in and select a store to continue.');
      return;
    }
    try {
      const res = await axios.post(
        URLS.GetOneOnDemandWorker,
        { id: OnDemandWorkerId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = res.data?.ondemandworkers || {};
      setForm(data);
      setPreview(URLS.FileBase + data.image || null);
      setState({
        onlineOrOffline: data.onlineOrOffline || false,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch store data.');
    }
  };

  useEffect(() => {
    fetchData();
    fetchServicedata();
  }, [token]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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
        toast.error('Please upload a JPG, JPEG, or PNG file.');
      }
    }
  };

  const resetForm = () => {
    setForm({
      providerId: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      salary: '',
      address: '',
    });
    setState({
      onlineOrOffline: false,
    });
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }

    const formData = new FormData();
    formData.append('providerId', form.providerId);
    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    formData.append('phone', form.phone);
    formData.append('email', form.email);
    formData.append('salary', form.salary);
    formData.append('address', form.address);
    formData.append('onlineOrOffline', state.onlineOrOffline);
    if (file) {
      formData.append('image', file);
    }

    setLoading(true);
    try {
      const response = await axios.put(URLS.EditOnDemandWorker + OnDemandWorkerId, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message || 'Worker added successfully!');
      navigate('/ondemandservice/ondemandworkers');
      resetForm();
    } catch (error) {
      const message =
        error.response?.status === 400
          ? 'Unauthorized access. Please log in again.'
          : error.response?.data?.message || 'Failed to add worker.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Edit On Demand Worker"
      description="Manage Edit On Demand Worker for your platform"
    >
      <Breadcrumb title="Edit On Demand Worker" items={BCrumb} />
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
      <form onSubmit={handleSubmit}>
        <ParentCard title="Edit On Demand Worker">
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="firstName" required>
                First Name
              </CustomFormLabel>
              <CustomTextField
                id="firstName"
                variant="outlined"
                fullWidth
                placeholder="Enter First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="lastName" required>
                Last Name
              </CustomFormLabel>
              <CustomTextField
                id="lastName"
                variant="outlined"
                fullWidth
                placeholder="Enter Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="email" required>
                Email
              </CustomFormLabel>
              <CustomTextField
                id="email"
                type="email"
                variant="outlined"
                fullWidth
                placeholder="Enter Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="phone" required>
                Mobile Number
              </CustomFormLabel>
              <CustomTextField
                id="phone"
                type="tel"
                variant="outlined"
                fullWidth
                placeholder="Enter Mobile Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="salary" required>
                Salary
              </CustomFormLabel>
              <CustomTextField
                placeholder="Enter Salary"
                onChange={handleChange}
                value={form.salary}
                variant="outlined"
                type="number"
                name="salary"
                id="salary"
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="address" required>
                Address
              </CustomFormLabel>
              <CustomTextField
                id="address"
                variant="outlined"
                fullWidth
                placeholder="Enter address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="providerId" required>
                Provider
              </CustomFormLabel>
              <CustomSelect
                id="providerId"
                value={form.providerId}
                name="providerId"
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
              >
                <MenuItem value="" disabled>
                  Select Provider
                </MenuItem>
                {providers.map((provider) => (
                  <MenuItem key={provider._id} value={provider._id}>
                    {provider.firstName} {provider.lastName}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="image">Image</CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{ accept: 'image/jpeg,image/png' }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar
                    src={preview}
                    sx={{ width: 60, height: 60, mt: 1 }}
                    alt="Worker image preview"
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.onlineOrOffline}
                    onChange={handleChangeCheckBox}
                    name="onlineOrOffline"
                    color="primary"
                  />
                }
                label="Online or Offline"
              />
            </Grid>
          </Grid>
        </ParentCard>
        <Divider sx={{ my: 2 }} />
        <Box
          display="flex"
          justifyContent="flex-end"
          gap={1}
          sx={{ p: 2, bgcolor: theme.palette.background.paper }}
        >
          <Button color="primary" variant="contained" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
      </form>
    </PageContainer>
  );
};

export default EditOnDemandWorkers;

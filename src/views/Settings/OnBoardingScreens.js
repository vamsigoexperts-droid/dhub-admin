import React, { useState, useEffect, useMemo } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, styled } from '@mui/material';
import {
  Select,
  MenuItem,
  TextField,
  Avatar,
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Onboarding Screens' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Add Onboarding Screens Form Component
const AddOnBoardingScreensForm = ({ onClose, onSubmit }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    type: '',
    description: '',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    if (!form.name) {
      toast.error('Onboarding screen name is required.');
      return;
    }

    if (!file) {
      toast.error('Image is required for new onboarding screens.');
      return;
    }

    if (!form.type) {
      toast.error('Type is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('type', form.type);
    formData.append('image', file);

    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create Onboarding Screen"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="name" required>
                Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Enter Name"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="image" required>
                Image
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                  'aria-label': 'Upload onboarding screen image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="type" required>
                Type
              </CustomFormLabel>
              <CustomSelect
                id="type"
                value={form.type}
                name="type"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select Type"
              >
                <MenuItem value="Worker App">Worker App</MenuItem>
                <MenuItem value="Driver App">Driver App</MenuItem>
                <MenuItem value="Store App">Store App</MenuItem>
                <MenuItem value="Provider App">Provider App</MenuItem>
                <MenuItem value="Customer App">Customer App</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="description">Description</CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
                fullWidth
                aria-label="Enter onboarding screen description"
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
            <Button color="error" variant="outlined" onClick={onClose} aria-label="Close form">
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              aria-label="Create onboarding screen"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit Onboarding Screens Form Component
const EditOnBoardingScreensForm = ({ onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    type: initialData?.type || '',
    description: initialData?.description || '',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.image ? URLS.FileBase + initialData.image : null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    if (!form.name) {
      toast.error('Onboarding screen name is required.');
      return;
    }

    if (!form.type) {
      toast.error('Type is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('type', form.type);
    if (file) {
      formData.append('image', file);
    }

    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit Onboarding Screen"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="name" required>
                Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Enter name"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="image">Image</CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                  'aria-label': 'Upload onboarding screen image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="type" required>
                Type
              </CustomFormLabel>
              <CustomSelect
                id="type"
                value={form.type}
                name="type"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select Type"
              >
                <MenuItem value="Worker App">Worker App</MenuItem>
                <MenuItem value="Driver App">Driver App</MenuItem>
                <MenuItem value="Store App">Store App</MenuItem>
                <MenuItem value="Provider App">Provider App</MenuItem>
                <MenuItem value="Customer App">Customer App</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="description">Description</CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
                fullWidth
                aria-label="Enter onboarding screen description"
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
            <Button color="error" variant="outlined" onClick={onClose} aria-label="Close form">
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              aria-label="Update onboarding screen"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main OnBoardingScreens Component
const OnBoardingScreens = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  };

  const token = getToken();

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

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      let res;
      if (id) {
        res = await axios.put(`${URLS.EditOnboardingscreens}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddOnboardingscreens, formData, config);
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

    if (window.confirm('Are you sure you want to delete this onboarding screen?')) {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.delete(`${URLS.DeletOnboardingscreens}/${data._id}`, config);
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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(URLS.GetOnboardingscreens, {}, config);
      setData(res.data.onboardingscreen || []);
    } catch (error) {
      toast.error('Failed to fetch onboarding screens.');
      console.error('Failed to fetch onboarding screens:', error);
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
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
          item.type.toLowerCase().includes(search.toLowerCase()),
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
        sortable: false,
        filterable: false,
        flex: 1,
        renderCell: (params) => {
          const rowIndex = filteredData.findIndex((row) => row._id === params.row._id);
          return rowIndex + 1;
        },
      },
      {
        field: 'onboardingScreenInfo',
        headerName: 'Onboarding Screen Info',
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={params.row.image ? `${URLS.FileBase}${params.row.image}` : ''}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="subtitle2">{params.row.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {params.row.type}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1,
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px',
            }}
          >
            {params.row.description}
          </Typography>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => (
          <Chip
            label={params.row.status ? 'Active' : 'Inactive'}
            size="small"
            color={params.row.status ? 'success' : 'error'}
            variant="outlined"
          />
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        filterable: false,
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
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
            </Button>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => handleDelete(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Delete ${params.row.name}`}
            >
              <IconTrash stroke={1.5} size={18} />
            </Button>
          </Box>
        ),
      },
    ],
    [loading],
  );

  return (
    <PageContainer
      title="Onboarding Screens"
      description="Manage onboarding screens for your application"
    >
      <Breadcrumb title="Onboarding Screens" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && (
        <AddOnBoardingScreensForm onClose={handleCloseForm} onSubmit={handleSubmit} />
      )}
      {showEditForm && (
        <EditOnBoardingScreensForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
        />
      )}

      <ParentCard
        title="Onboarding Screens Management"
        sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={2}
        >
          <TextField
            size="small"
            placeholder="Search by name, type or description"
            value={search}
            onChange={handleSearch}
            sx={{ minWidth: { xs: '100%', sm: 300 }, bgcolor: 'background.paper' }}
            aria-label="Search onboarding screens"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPopUp}
            disabled={loading}
            startIcon={<IconPlus size={20} />}
            aria-label="Create new onboarding screen"
          >
            Add New
          </Button>
        </Box>
        <Box sx={{ height: 'auto', width: '100%' }}>
          <DataGrid
            columns={columns}
            loading={loading}
            rows={filteredData}
            pageSizeOptions={[5, 10, 20]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick
            autoHeight
            getRowId={(row) => row._id}
          />
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default OnBoardingScreens;

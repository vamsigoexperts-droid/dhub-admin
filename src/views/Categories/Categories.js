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
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Select,
  MenuItem,
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

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Categories' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Add Category Form Component
const AddCategoryForm = ({ onClose, onSubmit, serviceTypes }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    serviceId: '',
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
      toast.error('Category name is required.');
      return;
    }
    if (!file) {
      toast.error('Image is required for new categories.');
      return;
    }
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('serviceId', form.serviceId);
    formData.append('image', file);
    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create Category"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="name" required>
                Category Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Category Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Enter category name"
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
                  'aria-label': 'Upload category image',
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
              <CustomFormLabel htmlFor="serviceId" required>
                Service
              </CustomFormLabel>
              <CustomSelect
                id="serviceId"
                value={form.serviceId}
                name="serviceId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select service"
              >
                {serviceTypes.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
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
            <Button color="primary" variant="contained" type="submit" aria-label="Create category">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit Category Form Component
const EditCategoryForm = ({ onClose, onSubmit, initialData, serviceTypes }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    serviceId: initialData?.serviceId || '',
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
      toast.error('Category name is required.');
      return;
    }
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('serviceId', form.serviceId);
    if (file) {
      formData.append('image', file);
    }
    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Edit Category" sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="name" required>
                Category Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Category Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Enter category name"
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
                  'aria-label': 'Upload category image',
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
              <CustomFormLabel htmlFor="serviceId" required>
                Service
              </CustomFormLabel>
              <CustomSelect
                id="serviceId"
                value={form.serviceId}
                name="serviceId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select service"
              >
                {serviceTypes.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
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
            <Button color="primary" variant="contained" type="submit" aria-label="Update category">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main Categories Component
const Categories = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let res;
      if (id) {
        res = await axios.put(`${URLS.EditCategorie}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddCategorie, formData, config);
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
    if (window.confirm('Do you really want to delete this category?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteCategorie}/${data._id}`, {
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
        URLS.GetCategories,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Filter only active categories
      const activeCategories = res.data.category?.filter(
        (item) => item.status === 'active'
      ) || [];
      setData(activeCategories);
    } catch (error) {
      toast.error('Failed to fetch categories.');
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }
      setLoading(true);
      try {
        const serviceRes = await axios.post(
          URLS.GetActiveServices,
          {
            searchQuery: '',
            serviceType: '',
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setServiceTypes(serviceRes.data.data || []);

        await getData();
      } catch (error) {
        toast.error('Failed to fetch data.');
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

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
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'categoryinfo',
        headerName: 'Category Info',
        flex: 1,
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
        field: 'serviceName',
        headerName: 'Service',
        flex: 1,
        renderCell: (params) => {
          const serviceName = params.row.serviceName ||
            serviceTypes.find((service) => service._id === params.row.serviceId)?.name || 'N/A';
          return <Typography variant="body2">{serviceName}</Typography>;
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => (
          <Chip
            label={params.row.status === 'active' ? 'Active' : 'Inactive'}
            size="small"
            color={params.row.status === 'active' ? 'primary' : 'error'}
            variant="outlined"
          />
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        sortable: false,
        filterable: false,
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
    [loading, serviceTypes],
  );

  const rows = useMemo(
    () =>
      filteredData?.map((item, index) => ({
        id: index,
        ...item,
      })) || [],
    [filteredData],
  );

  return (
    <PageContainer title="Categories" description="Manage Categories for your e-commerce platform">
      <Breadcrumb title="Categories" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      {showAddForm && (
        <AddCategoryForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          serviceTypes={serviceTypes}
        />
      )}
      {showEditForm && (
        <EditCategoryForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          serviceTypes={serviceTypes}
        />
      )}
      <Paper
        variant="outlined"
        sx={{
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
          <Typography variant="h6">Categories List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search categories"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              disabled={loading}
              startIcon={<IconPlus size={20} />}
              aria-label="Create new category"
            >
              Create Category
            </Button>
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
              rowsPerPageOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              autoHeight
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default Categories;

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Avatar,
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
  Paper,
  CardContent,
  Select,
  MenuItem,
  IconButton,
  Button,
  TextField as CustomTextField,
  FormLabel as CustomFormLabel,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'App Screens' }];

// Add App Screen Form Component
const AddAppScreenForm = ({ onClose, onSubmit }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    type: '',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [description, setDescription] = useState([{ title: '', description: '' }]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleDescriptionChange = (index, field, value) => {
    setDescription((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setFormErrors((prev) => ({ ...prev, [`description-${field}-${index}`]: '' }));
  };

  const handleAddDescription = () => {
    setDescription((prev) => [...prev, { title: '', description: '' }]);
  };

  const handleDeleteDescription = (index) => {
    if (description.length <= 1) return;
    setDescription((prev) => prev.filter((_, i) => i !== index));
  };

  const changeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setFormErrors((prev) => ({ ...prev, image: '' }));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, or PNG.');
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!form.name.trim()) {
      errors.name = 'Title is required';
      isValid = false;
    }

    if (!form.type) {
      errors.type = 'Type is required';
      isValid = false;
    }

    if (!file) {
      errors.image = 'Image is required';
      isValid = false;
    }

    description.forEach((desc, index) => {
      if (!desc.title.trim()) {
        errors[`description-title-${index}`] = 'Title is required';
        isValid = false;
      }
      if (!desc.description.trim()) {
        errors[`description-description-${index}`] = 'Description is required';
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('type', form.type);
    formData.append('description', JSON.stringify(description));
    formData.append('image', file);

    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create App Screen"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="name" required>
                Title
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Title"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                aria-label="Enter Title"
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
                error={!!formErrors.image}
                helperText={formErrors.image}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                  'aria-label': 'Upload App Screen image',
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
                App Type
              </CustomFormLabel>
              <Select
                id="type"
                value={form.type}
                name="type"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!!formErrors.type}
                aria-label="Type"
              >
                <MenuItem value="Customer">Customer</MenuItem>
                <MenuItem value="Vendor">Vendor</MenuItem>
                <MenuItem value="ServiceProvider">Service Provider</MenuItem>
                <MenuItem value="Delivery">Delivery</MenuItem>
              </Select>
              {formErrors.type && (
                <Typography color="error" variant="caption">
                  {formErrors.type}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              {description.map((desc, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                >
                  <Grid item xs={12} sm={5}>
                    <CustomFormLabel htmlFor={`title-${index}`} required>
                      Title
                    </CustomFormLabel>
                    <CustomTextField
                      id={`title-${index}`}
                      placeholder="Enter Title"
                      variant="outlined"
                      value={desc.title}
                      fullWidth
                      required
                      onChange={(e) => handleDescriptionChange(index, 'title', e.target.value)}
                      error={!!formErrors[`description-title-${index}`]}
                      helperText={formErrors[`description-title-${index}`]}
                      aria-label={`Description title ${index + 1}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <CustomFormLabel htmlFor={`description-${index}`} required>
                      Description
                    </CustomFormLabel>
                    <CustomTextField
                      id={`description-${index}`}
                      placeholder="Enter Description"
                      variant="outlined"
                      value={desc.description}
                      fullWidth
                      required
                      multiline
                    minRows={1}
                      onChange={(e) =>
                        handleDescriptionChange(index, 'description', e.target.value)
                      }
                      error={!!formErrors[`description-description-${index}`]}
                      helperText={formErrors[`description-description-${index}`]}
                      aria-label={`Description content ${index + 1}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteDescription(index)}
                      disabled={description.length === 1}
                      aria-label={`Delete description ${index + 1}`}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddDescription}
                sx={{ mt: 2 }}
                aria-label="Add another description"
              >
                Add More
              </Button>
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
              aria-label="Create App Screen"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit App Screen Form Component
const EditAppScreenForm = ({ onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    type: initialData?.type || '',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    initialData?.image ? `${URLS.FileBase}${initialData.image}` : null,
  );
  const [formErrors, setFormErrors] = useState({});
  const [description, setDescription] = useState(
    initialData?.description || [{ title: '', description: '' }],
  );

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        type: initialData.type || '',
      });
      setDescription(initialData.description || [{ title: '', description: '' }]);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleDescriptionChange = (index, field, value) => {
    setDescription((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setFormErrors((prev) => ({ ...prev, [`description-${field}-${index}`]: '' }));
  };

  const handleAddDescription = () => {
    setDescription((prev) => [...prev, { title: '', description: '' }]);
  };

  const handleDeleteDescription = (index) => {
    if (description.length <= 1) return;
    setDescription((prev) => prev.filter((_, i) => i !== index));
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

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!form.name.trim()) {
      errors.name = 'Title is required';
      isValid = false;
    }

    if (!form.type) {
      errors.type = 'Type is required';
      isValid = false;
    }

    description.forEach((desc, index) => {
      if (!desc.title.trim()) {
        errors[`description-title-${index}`] = 'Title is required';
        isValid = false;
      }
      if (!desc.description.trim()) {
        errors[`description-description-${index}`] = 'Description is required';
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('type', form.type);
    formData.append('description', JSON.stringify(description));
    if (file) {
      formData.append('image', file);
    }

    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit App Screen"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="name" required>
                Title
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Title"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                aria-label="Enter Title"
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
                  'aria-label': 'Upload App Screen image',
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
                App Type
              </CustomFormLabel>
              <Select
                id="type"
                value={form.type}
                name="type"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!!formErrors.type}
                aria-label="Type"
              >
                <MenuItem value="Customer">Customer</MenuItem>
                <MenuItem value="Vendor">Vendor</MenuItem>
                <MenuItem value="ServiceProvider">Service Provider</MenuItem>
                <MenuItem value="Delivery">Delivery</MenuItem>
              </Select>
              {formErrors.type && (
                <Typography color="error" variant="caption">
                  {formErrors.type}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              {description.map((desc, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                >
                  <Grid item xs={12} sm={5}>
                    <CustomFormLabel htmlFor={`title-${index}`} required>
                      Title
                    </CustomFormLabel>
                    <CustomTextField
                      id={`title-${index}`}
                      placeholder="Enter Title"
                      variant="outlined"
                      value={desc.title}
                      fullWidth
                      required
                      onChange={(e) => handleDescriptionChange(index, 'title', e.target.value)}
                      error={!!formErrors[`description-title-${index}`]}
                      helperText={formErrors[`description-title-${index}`]}
                      aria-label={`Description title ${index + 1}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <CustomFormLabel htmlFor={`description-${index}`} required>
                      Description
                    </CustomFormLabel>
                    <CustomTextField
                      id={`description-${index}`}
                      placeholder="Enter Description"
                      variant="outlined"
                      value={desc.description}
                      fullWidth
                      required
                      multiline
                    minRows={1}
                      onChange={(e) =>
                        handleDescriptionChange(index, 'description', e.target.value)
                      }
                      error={!!formErrors[`description-description-${index}`]}
                      helperText={formErrors[`description-description-${index}`]}
                      aria-label={`Description content ${index + 1}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteDescription(index)}
                      disabled={description.length === 1}
                      aria-label={`Delete description ${index + 1}`}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddDescription}
                sx={{ mt: 2 }}
                aria-label="Add another description"
              >
                Add More
              </Button>
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
              aria-label="Update App Screen"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main App Screens Component
const AppScreens = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

  const getToken = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  }, []);

  const fetchData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(URLS.GetAppscreen, {}, config);
      setData(res.data.apprelateddatas || []);
    } catch (error) {
      toast.error('Failed to fetch app screens data.');
      console.error('Failed to fetch app screens data', error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    const token = getToken();
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
        res = await axios.put(`${URLS.EditAppscreen}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddAppscreen, formData, config);
      }

      if (res.status === 200) {
        toast.success(res.data.message);
        handleCloseForm();
        fetchData();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (data) => {
    const token = getToken();
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this App Screen?')) {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.delete(`${URLS.DeletAppscreen}/${data._id}`, config);
        if (res.status === 200) {
          toast.success(res.data.message);
          fetchData();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

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
        field: 'name',
        headerName: 'App Screen',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={URLS.FileBase + params.row.image}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="subtitle2">{params.row.name}</Typography>
            </Box>
          </Box>
        ),
      },

      { field: 'type', headerName: 'Type', flex: 1 },
      {
        field: 'title',
        headerName: 'Title',
        flex: 1,
        renderCell: (params) => (
          <Box sx={{ maxHeight: 100, overflow: 'auto' }}>
            {params.row.description?.map((desc, index) => (
              <Box key={index} mb={1}>
                <Typography variant="subtitle2">{desc.title}</Typography>
              </Box>
            ))}
          </Box>
        ),
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1,
        renderCell: (params) => (
          <Box sx={{ maxHeight: 100, overflow: 'auto' }}>
            {params.row.description?.map((desc, index) => (
              <Box key={index} mb={1}>
                <Typography variant="body2" sx={{ whiteSpace: 'normal' }}>
                  {desc.description}
                </Typography>
              </Box>
            ))}
          </Box>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
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
        field: 'action',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            <IconButton
              color="primary"
              onClick={() => handleEditPopUp(params.row)}
              disabled={loading}
              aria-label={`Edit ${params.row.name}`}
            >
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row)}
              disabled={loading}
              aria-label={`Delete ${params.row.name}`}
            >
              <Delete />
            </IconButton>
          </Box>
        ),
      },
    ],
    [loading],
  );

  const rows = useMemo(
    () =>
      filteredData.map((item, index) => ({
        id: item._id || index,
        ...item,
      })),
    [filteredData],
  );

  return (
    <PageContainer title="App Screens" description="Manage App Screens for your application">
      <Breadcrumb title="App Screens" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && <AddAppScreenForm onClose={handleCloseForm} onSubmit={handleSubmit} />}
      {showEditForm && (
        <EditAppScreenForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
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
          <Typography variant="h6">App Screens List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <CustomTextField
              size="small"
              placeholder="Search by name or description"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'background.paper' }}
              aria-label="Search App Screens"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              disabled={loading}
              startIcon={<Add />}
              aria-label="Create App Screen"
            >
              Create App Screen
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
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              autoHeight
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default AppScreens;


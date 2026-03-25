import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, Box, Typography, Grid, Divider, Chip, Paper, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';
import { MenuItem } from '@mui/material';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Testimonials' }];

// Add Testimonials Form Component
const AddTestimonialsForm = ({ onClose, onSubmit }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://192.168.0.5:5013/v1/dhubApi/website/services');
        setServices(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        toast.error('Failed to load services list');
      }
    };
    fetchServices();
  }, []);

  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
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
      toast.error('Testimonials name is required');
      return;
    }

    if (!file) {
      toast.error('Image is required for new Testimonials');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('serviceId', form.serviceId || '');
    formData.append('star_rating', form.star_rating || '');
    formData.append('profile_image', file);

    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create Testimonials"
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
              <CustomFormLabel htmlFor="profile_image" required>
                Image
              </CustomFormLabel>
              <CustomTextField
                id="profile_image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                  'aria-label': 'Upload Testimonials image',
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
                Select Service
              </CustomFormLabel>
              <CustomTextField
                select
                id="serviceId"
                name="serviceId"
                value={form.serviceId}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Select a Service"
              >
                {services.map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    {service.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="star_rating">Star Rating</CustomFormLabel>
              <CustomTextField
                id="star_rating"
                name="star_rating"
                type="number"
                inputProps={{ min: 1, max: 5 }}
                placeholder="Enter Rating (1-5)"
                value={form.star_rating}
                onChange={handleChange}
                fullWidth
              />
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
                aria-label="Enter Testimonials description"
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
              aria-label="Close form"
            >
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              aria-label="Create Testimonials"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit Testimonials Form Component
const EditTestimonialsForm = ({ onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    serviceId: '',
    star_rating: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://192.168.0.5:5013/v1/dhubApi/website/services');
        setServices(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        toast.error('Failed to load services list');
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        serviceId: initialData.serviceId?._id || '',
        star_rating: initialData.star_rating || '',
      });

      if (initialData.profile_image) {
        const encodedPath = initialData.profile_image
          .split('/')
          .map(encodeURIComponent)
          .join('/');
        setPreview(`${URLS.FileBase}${encodedPath}`);
      }
    }
  }, [initialData]);

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
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('serviceId', form.serviceId);
    formData.append('star_rating', form.star_rating);
    if (file) formData.append('image', file);

    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Edit Testimonials" sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="name" required>Name</CustomFormLabel>
              <CustomTextField
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                placeholder="Enter Name"
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="image">Image</CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                onChange={changeHandler}
                fullWidth
                inputProps={{ accept: 'image/jpeg,image/png' }}
              />
              {preview && <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />}
            </Grid>

            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="serviceId" required>Select Service</CustomFormLabel>
              <CustomTextField
                select
                id="serviceId"
                name="serviceId"
                value={form.serviceId}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">-- Select Service --</MenuItem>
                {services.map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    {service.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="star_rating">Star Rating</CustomFormLabel>
              <CustomTextField
                id="star_rating"
                name="star_rating"
                type="number"
                inputProps={{ min: 1, max: 5 }}
                value={form.star_rating}
                onChange={handleChange}
                fullWidth
                placeholder="Enter Rating (1-5)"
              />
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
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="flex-end" gap={1} sx={{ position: 'sticky', bottom: 0, bgcolor: theme.palette.background.paper, p: 2, zIndex: 1 }}>
            <Button color="error" variant="outlined" onClick={onClose}>Close</Button>
            <Button color="primary" variant="contained" type="submit">Submit</Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main Testimonials Component
const Testimonials = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

  // ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ DELETE CONFIRMATION DIALOG STATE
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    data: null,
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
        res = await axios.put(`${URLS.EditLatestTestimonials}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddLatestTestimonials, formData, config);
      }

      if (res.status === 200 || 201) {
        toast.success(res.data.message);
        handleCloseForm();
        await getData();
        window.scrollTo({ top: 500, behavior: 'smooth' });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ OPEN DELETE DIALOG
  const handleDeleteClick = (data) => {
    setDeleteDialog({
      open: true,
      data: data,
    });
  };

  // ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ CLOSE DELETE DIALOG
  const handleDeleteDialogClose = () => {
    setDeleteDialog({
      open: false,
      data: null,
    });
  };

  // ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ CONFIRM DELETE ACTION
  const handleDeleteConfirm = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      handleDeleteDialogClose();
      return;
    }

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.delete(`${URLS.EditLatestTestimonials}/${deleteDialog.data._id}`, config);

      if (res.status === 200) {
        toast.success(res.data.message);
        getData();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
      handleDeleteDialogClose();
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
      const res = await axios.get(URLS.GetLatestTestimonials, {}, config);

      console.log('Testimonials API response:', res.data);

      setData(res.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch Testimonials.');
      console.error('Failed to fetch Testimonials:', error);
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
          (item.description && item.description.toLowerCase().includes(search.toLowerCase())),
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
        field: 'Testimonials',
        headerName: 'Testimonials Info',
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
        field: 'description',
        headerName: 'Description',
        flex: 1,
        renderCell: (params) => (
          <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
            {params.value}
          </Typography>
        ),
      },
      // ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ REMOVED STATUS COLUMN
      {
        field: 'action',
        headerName: 'Actions',
        width: 150,
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
              onClick={() => handleDeleteClick(params.row)}
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
    [loading, filteredData, theme],
  );

  const rows = useMemo(
    () =>
      filteredData.map((item) => ({
        id: item._id,
        ...item,
      })),
    [filteredData],
  );

  return (
    <PageContainer title="Testimonials" description="Manage Testimonials for your application">
      <Breadcrumb title="Testimonials" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && <AddTestimonialsForm onClose={handleCloseForm} onSubmit={handleSubmit} />}
      {showEditForm && (
        <EditTestimonialsForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
        />
      )}

      {/* ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: theme.shadows[10],
          },
        }}
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{
           bgcolor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            fontWeight: 600,
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText id="delete-dialog-description" sx={{ color: theme.palette.text.primary }}>
            Are you sure you want to delete{' '}
            <strong>{deleteDialog.data?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleDeleteDialogClose}
            variant="outlined"
            color="inherit"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={loading}
            autoFocus
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

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
          <Typography variant="h6">Testimonials List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <CustomTextField
              size="small"
              placeholder="Search by name, description, or URL"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Testimonials"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              disabled={loading}
              startIcon={<IconPlus size={20} />}
              aria-label="Create Testimonials"
            >
              Create Testimonials
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
              getRowId={(row) => row._id}
              sx={{
                '& .MuiDataGrid-cell': {
                  py: 1,
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default Testimonials;


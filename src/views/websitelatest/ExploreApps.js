import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, Box, Typography, Grid, Divider, Paper, CardContent, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, MenuItem } from '@mui/material';
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

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Explore Apps' }];

// âœ… App Names Enum
const APP_NAMES = [
  { value: 'customer-app', label: 'Customer App' },
  { value: 'service-app', label: 'Service App' },
  { value: 'seller-app', label: 'Seller App' },
  { value: 'delivery-partner-app', label: 'Delivery Partner App' },
];

// âœ… Helper function to properly encode image URLs
const getEncodedImageUrl = (imagePath) => {
  if (!imagePath) return null;
  try {
    const encodedPath = imagePath
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return `${URLS.FileBase}${encodedPath}`;
  } catch (error) {
    console.error('Error encoding image URL:', error);
    return null;
  }
};

// Add/Edit Explore Apps Form Component
const ExploreAppsForm = ({ onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    main_title: initialData?.main_title || '',
    app_names: initialData?.app_names || '',
    faqs_main_title: initialData?.faqs_main_title || '',
    faqs_sub_title1: initialData?.faqs_sub_title1 || '',
    faqs_desc1: initialData?.faqs_desc1 || '',
    faqs_sub_title2: initialData?.faqs_sub_title2 || '',
    faqs_desc2: initialData?.faqs_desc2 || '',
    faqs_sub_title3: initialData?.faqs_sub_title3 || '',
    faqs_desc3: initialData?.faqs_desc3 || '',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    initialData?.image ? getEncodedImageUrl(initialData.image) : null
  );

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

    if (!form.main_title) {
      toast.error('Main title is required');
      return;
    }

    if (!form.app_names) {
      toast.error('Please select an app name');
      return;
    }

    if (!initialData && !file) {
      toast.error('Image is required for new entry');
      return;
    }

    const formData = new FormData();
    formData.append('main_title', form.main_title);
    formData.append('app_names', form.app_names);
    formData.append('faqs_main_title', form.faqs_main_title);
    formData.append('faqs_sub_title1', form.faqs_sub_title1);
    formData.append('faqs_desc1', form.faqs_desc1);
    formData.append('faqs_sub_title2', form.faqs_sub_title2);
    formData.append('faqs_desc2', form.faqs_desc2);
    formData.append('faqs_sub_title3', form.faqs_sub_title3);
    formData.append('faqs_desc3', form.faqs_desc3);
    
    if (file) {
      formData.append('image', file);
    }

    onSubmit(formData, initialData?._id);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title={initialData ? "Edit Explore App Entry" : "Create Explore App Entry"}
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            {/* Main Title */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="main_title" required>
                Main Title
              </CustomFormLabel>
              <CustomTextField
                id="main_title"
                name="main_title"
                variant="outlined"
                fullWidth
                placeholder="Explore Our Apps"
                value={form.main_title}
                required
                onChange={handleChange}
              />
            </Grid>

            {/* App Names Dropdown - Enum */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="app_names" required>
                Select App
              </CustomFormLabel>
              <CustomTextField
                select
                id="app_names"
                name="app_names"
                value={form.app_names}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                SelectProps={{
                  native: false,
                }}
              >
                <MenuItem value="">-- Select App --</MenuItem>
                {APP_NAMES.map((app) => (
                  <MenuItem key={app.value} value={app.value}>
                    {app.label}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            {/* FAQs Main Title */}
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="faqs_main_title">
                FAQs Main Title
              </CustomFormLabel>
              <CustomTextField
                id="faqs_main_title"
                name="faqs_main_title"
                variant="outlined"
                fullWidth
                placeholder="Delivery Partner App"
                value={form.faqs_main_title}
                onChange={handleChange}
              />
            </Grid>

            {/* FAQ 1 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: theme.palette.primary.main }}>
                FAQ 1
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="faqs_sub_title1">
                FAQ 1 - Sub Title
              </CustomFormLabel>
              <CustomTextField
                id="faqs_sub_title1"
                name="faqs_sub_title1"
                variant="outlined"
                fullWidth
                placeholder="Schedule a Service"
                value={form.faqs_sub_title1}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="faqs_desc1">
                FAQ 1 - Description
              </CustomFormLabel>
              <CustomTextField
                id="faqs_desc1"
                name="faqs_desc1"
                multiline
                rows={2}
                value={form.faqs_desc1}
                onChange={handleChange}
                fullWidth
                placeholder="Easily book your preferred date and time..."
              />
            </Grid>

            {/* FAQ 2 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: theme.palette.primary.main }}>
                FAQ 2
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="faqs_sub_title2">
                FAQ 2 - Sub Title
              </CustomFormLabel>
              <CustomTextField
                id="faqs_sub_title2"
                name="faqs_sub_title2"
                variant="outlined"
                fullWidth
                placeholder="Flexible Rescheduling"
                value={form.faqs_sub_title2}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="faqs_desc2">
                FAQ 2 - Description
              </CustomFormLabel>
              <CustomTextField
                id="faqs_desc2"
                name="faqs_desc2"
                multiline
                rows={2}
                value={form.faqs_desc2}
                onChange={handleChange}
                fullWidth
                placeholder="Modify or cancel appointments instantly..."
              />
            </Grid>

            {/* FAQ 3 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: theme.palette.primary.main }}>
                FAQ 3
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="faqs_sub_title3">
                FAQ 3 - Sub Title
              </CustomFormLabel>
              <CustomTextField
                id="faqs_sub_title3"
                name="faqs_sub_title3"
                variant="outlined"
                fullWidth
                placeholder="Smart Notifications"
                value={form.faqs_sub_title3}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="faqs_desc3">
                FAQ 3 - Description
              </CustomFormLabel>
              <CustomTextField
                id="faqs_desc3"
                name="faqs_desc3"
                multiline
                rows={2}
                value={form.faqs_desc3}
                onChange={handleChange}
                fullWidth
                placeholder="Get real-time updates on technician arrival..."
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="image" required={!initialData}>
                App Image
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png,image/jpg',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar
                    src={preview}
                    alt="Preview"
                    sx={{ width: 80, height: 80, mt: 1 }}
                    variant="rounded"
                  />
                </Box>
              )}
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
            <Button color="error" variant="outlined" onClick={onClose}>
              Close
            </Button>
            <Button color="primary" variant="contained" type="submit">
              {initialData ? 'Update' : 'Create'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main Explore Apps Component
const ExploreApps = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

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
        res = await axios.put(`${URLS.ExploreApps}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.ExploreApps, formData, config);
      }

      if (res.status === 200 || res.status === 201) {
        handleCloseForm();
        toast.success(res.data.message || (id ? 'App entry updated successfully!' : 'App entry created successfully!'));
        await getData();
        setTimeout(() => {
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (data) => {
    setDeleteDialog({
      open: true,
      data: data,
    });
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog({
      open: false,
      data: null,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      handleDeleteDialogClose();
      return;
    }

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.delete(`${URLS.ExploreApps}/${deleteDialog.data._id}`, config);

      if (res.status === 200) {
        toast.success(res.data.message || 'App entry deleted successfully');
        getData();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
      console.error('Delete error:', error);
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
      const res = await axios.get(URLS.ExploreApps, config);
      console.log('Explore Apps API response:', res.data);
      setData(res.data.data || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch Explore Apps data.');
      }
      console.error('Failed to fetch Explore Apps:', error);
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
          item.main_title?.toLowerCase().includes(search.toLowerCase()) ||
          item.app_names?.toLowerCase().includes(search.toLowerCase()) ||
          item.faqs_main_title?.toLowerCase().includes(search.toLowerCase())
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
        field: 'image',
        headerName: 'Image',
        width: 100,
        renderCell: (params) => (
          <Avatar
            src={getEncodedImageUrl(params.row.image)}
            alt={params.row.main_title}
            sx={{ width: 40, height: 40 }}
            variant="rounded"
          />
        ),
      },
      {
        field: 'main_title',
        headerName: 'Main Title',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'app_names',
        headerName: 'App Name',
        width: 200,
        renderCell: (params) => {
          const appLabel = APP_NAMES.find(app => app.value === params.value)?.label || params.value;
          return (
            <Chip 
              label={appLabel} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          );
        },
      },
      {
        field: 'faqs_main_title',
        headerName: 'FAQs Title',
        flex: 1,
        minWidth: 150,
      },
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
              aria-label={`Edit ${params.row.main_title}`}
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
              aria-label={`Delete ${params.row.main_title}`}
            >
              <IconTrash stroke={1.5} size={18} />
            </Button>
          </Box>
        ),
      },
    ],
    [loading, theme],
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
    <PageContainer title="Explore Apps" description="Manage Explore Apps entries">
      <Breadcrumb title="Explore Apps Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && (
        <ExploreAppsForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
        />
      )}
      {showEditForm && (
        <ExploreAppsForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
        />
      )}

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteDialogClose}
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
          sx={{
            bgcolor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            fontWeight: 600,
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ color: theme.palette.text.primary }}>
            Are you sure you want to delete <strong>{deleteDialog.data?.main_title}</strong>? 
            This action cannot be undone.
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
          <Typography variant="h6">Explore Apps Entries List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <CustomTextField
              size="small"
              placeholder="Search by title or app name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
            />
            {/* <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              disabled={loading}
              startIcon={<IconPlus size={20} />}
            >
              Create Entry
            </Button> */}
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

export default ExploreApps;

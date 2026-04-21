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
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Join Us' }];

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

// Add/Edit Join Us Form Component
const JoinUsForm = ({ onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    main_title: initialData?.main_title || '',
    main_desc: initialData?.main_desc || '',
    sub_title: initialData?.sub_title || '',
    sub_desc: initialData?.sub_desc || '',
    service: initialData?.services || '',
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

    if (!form.service) {
      toast.error('Please select a service');
      return;
    }

    if (!initialData && !file) {
      toast.error('Image is required for new entry');
      return;
    }

    const formData = new FormData();
    formData.append('main_title', form.main_title);
    formData.append('main_desc', form.main_desc);
    formData.append('sub_title', form.sub_title);
    formData.append('sub_desc', form.sub_desc);
    formData.append('services', form.service);
    
    if (file) {
      formData.append('images', file);
    }

    onSubmit(formData, initialData?._id);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title={initialData ? "Edit Join Us Entry" : "Create Join Us Entry"}
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
                placeholder="Join Doorstep Hub and Grow Your Business"
                value={form.main_title}
                required
                onChange={handleChange}
                aria-label="Enter main title"
              />
            </Grid>

            {/* Sub Title */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="sub_title">
                Sub Title
              </CustomFormLabel>
              <CustomTextField
                id="sub_title"
                name="sub_title"
                variant="outlined"
                fullWidth
                placeholder="Become Vendor / Seller"
                value={form.sub_title}
                onChange={handleChange}
                aria-label="Enter sub title"
              />
            </Grid>

            {/* Main Description */}
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="main_desc">
                Main Description
              </CustomFormLabel>
              <CustomTextField
                id="main_desc"
                name="main_desc"
                multiline
                rows={2}
                value={form.main_desc}
                onChange={handleChange}
                fullWidth
                placeholder="Flexible opportunities for service providers and vendors"
                aria-label="Enter main description"
              />
            </Grid>

            {/* Sub Description */}
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="sub_desc">
                Sub Description
              </CustomFormLabel>
              <CustomTextField
                id="sub_desc"
                name="sub_desc"
                multiline
                rows={2}
                value={form.sub_desc}
                onChange={handleChange}
                fullWidth
                placeholder="Join Doorstep Hub as a reseller or vendor..."
                aria-label="Enter sub description"
              />
            </Grid>

            {/* Service Dropdown - Static Enum */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="service" required>
                Select Service
              </CustomFormLabel>
              <CustomTextField
                select
                id="service"
                name="service"
                value={form.service}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                SelectProps={{
                  native: false,
                }}
              >
                <MenuItem value="">-- Select Service --</MenuItem>
                <MenuItem value="service1">Service 1</MenuItem>
                <MenuItem value="service2">Service 2</MenuItem>
              </CustomTextField>
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="image" required={!initialData}>
                Image
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png,image/jpg',
                  'aria-label': 'Upload image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar
                    src={preview}
                    alt="Preview"
                    sx={{ width: 60, height: 60, mt: 1 }}
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
            <Button color="error" variant="outlined" onClick={onClose} aria-label="Close form">
              Close
            </Button>
            <Button color="primary" variant="contained" type="submit" aria-label="Submit form">
              {initialData ? 'Update' : 'Create'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main Join Us Component
const JoinUs = () => {
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
        res = await axios.put(`${URLS.JoinUs}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.JoinUs, formData, config);
      }

      if (res.status === 200 || res.status === 201) {
        handleCloseForm();
        toast.success(res.data.message || (id ? 'Entry updated successfully!' : 'Entry created successfully!'));
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
      const res = await axios.delete(`${URLS.JoinUs}/${deleteDialog.data._id}`, config);

      if (res.status === 200) {
        toast.success(res.data.message || 'Entry deleted successfully');
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
      const res = await axios.get(URLS.JoinUs, config);
      console.log('Join Us API response:', res.data);
      
      const fetchedData = res.data.data || [];
      setData(fetchedData);
      
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch Join Us data.');
      }
      console.error('Failed to fetch Join Us:', error);
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
          item.sub_title?.toLowerCase().includes(search.toLowerCase()) ||
          item.services?.toLowerCase().includes(search.toLowerCase())
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
        minWidth: 200,
      },
      {
        field: 'sub_title',
        headerName: 'Sub Title',
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
    <PageContainer title="Join Us" description="Manage Join Us entries">
      <Breadcrumb title="Join Us Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && (
        <JoinUsForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
        />
      )}
      {showEditForm && (
        <JoinUsForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
        />
      )}

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
          <DialogContentText
            id="delete-dialog-description"
            sx={{ color: theme.palette.text.primary }}
          >
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
          <Typography variant="h6">Join Us Entries List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <CustomTextField
              size="small"
              placeholder="Search by title or service"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'background.paper' }}
              aria-label="Search Join Us entries"
            />
            {/* Create Entry button commented out as per your requirement */}
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

export default JoinUs;


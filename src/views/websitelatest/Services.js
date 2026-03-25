import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, Box, Typography, Grid, Divider, Paper, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
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
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Services' }];

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

// Add/Edit Service Form Component
const ServiceForm = ({ onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    title: '',
    description: '',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
      });
      if (initialData.image) {
        setPreview(getEncodedImageUrl(initialData.image));
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

    if (!form.title) {
      toast.error('Title is required');
      return;
    }

    if (!initialData && !file) {
      toast.error('Image is required for new service');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    
    if (file) {
      formData.append('image', file);
    }

    onSubmit(formData, initialData?._id);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title={initialData ? "Edit Service" : "Create Service"}
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            {/* Title */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="title" required>
                Service Title
              </CustomFormLabel>
              <CustomTextField
                id="title"
                name="title"
                variant="outlined"
                fullWidth
                placeholder="Enter service title"
                value={form.title}
                required
                onChange={handleChange}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="description">
                Description
              </CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                variant="outlined"
                fullWidth
                placeholder="Enter service description"
                value={form.description}
                onChange={handleChange}
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="image" required={!initialData}>
                Service Image
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
                <Box mt={2} display="flex" justifyContent="center">
                  <Avatar
                    src={preview}
                    alt="Preview"
                    sx={{ width: 120, height: 120 }}
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

// Main Services Component
const Services = () => {
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
        res = await axios.put(`${URLS.Services}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.Services, formData, config);
      }

      if (res.status === 200 || res.status === 201) {
        handleCloseForm();
        toast.success(res.data.message || (id ? 'Service updated successfully!' : 'Service created successfully!'));
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
      const res = await axios.delete(`${URLS.Services}/${deleteDialog.data._id}`, config);

      if (res.status === 200) {
        toast.success(res.data.message || 'Service deleted successfully');
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
      const res = await axios.get(URLS.Services, config);
      console.log('Services API response:', res.data);
      setData(res.data.data || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch services.');
      }
      console.error('Failed to fetch services:', error);
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
          item.title?.toLowerCase().includes(search.toLowerCase()) ||
          item.description?.toLowerCase().includes(search.toLowerCase())
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
            alt={params.row.title}
            sx={{ width: 50, height: 50 }}
            variant="rounded"
          />
        ),
      },
      {
        field: 'title',
        headerName: 'Title',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1,
        minWidth: 250,
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
    <PageContainer title="Services" description="Manage services">
      <Breadcrumb title="Services Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && (
        <ServiceForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
        />
      )}
      {showEditForm && (
        <ServiceForm
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
            Are you sure you want to delete <strong>{deleteDialog.data?.title}</strong>? 
            This action cannot be undone.
          </DialogContentText>
          {deleteDialog.data?.image && (
            <Box mt={2} display="flex" justifyContent="center">
              <Avatar
                src={getEncodedImageUrl(deleteDialog.data.image)}
                alt="To delete"
                sx={{ width: 80, height: 80 }}
                variant="rounded"
              />
            </Box>
          )}
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
          <Typography variant="h6">Services List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <CustomTextField
              size="small"
              placeholder="Search by title or description"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 250 }, bgcolor: 'white' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              disabled={loading}
              startIcon={<IconPlus size={20} />}
            >
              Create Service
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

export default Services;

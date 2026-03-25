import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Grid, Divider, Paper, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Link } from '@mui/material';
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
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'App Links' }];

// Add App Link Form Component
const AddAppLinkForm = ({ onClose, onSubmit }) => {
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
    serviceId: '',
    android_link: '',  // Ã¢Å“â€¦ Added
    ios_link: '',      // Ã¢Å“â€¦ Added
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.serviceId) {
      toast.error('Service selection is required');
      return;
    }

    if (!form.android_link && !form.ios_link) {
      toast.error('At least one app link is required');
      return;
    }

    // Ã¢Å“â€¦ Validate Android URL format
    if (form.android_link) {
      try {
        new URL(form.android_link);
      } catch (error) {
        toast.error('Please enter a valid Android link URL');
        return;
      }
    }

    // Ã¢Å“â€¦ Validate iOS URL format
    if (form.ios_link) {
      try {
        new URL(form.ios_link);
      } catch (error) {
        toast.error('Please enter a valid iOS link URL');
        return;
      }
    }

    onSubmit(form);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create App Link"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            {/* Service Selection */}
            <Grid item xs={12} sm={12}>
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
                required
              >
                <MenuItem value="">-- Select Service --</MenuItem>
                {services.map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    {service.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            {/* Ã¢Å“â€¦ Android Link */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="android_link">
                Android Link
              </CustomFormLabel>
              <CustomTextField
                id="android_link"
                name="android_link"
                type="url"
                variant="outlined"
                fullWidth
                placeholder="https://play.google.com/store/apps/details?id=myapp"
                value={form.android_link}
                onChange={handleChange}
                aria-label="Enter Android Link URL"
              />
            </Grid>

            {/* Ã¢Å“â€¦ iOS Link */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="ios_link">
                iOS Link
              </CustomFormLabel>
              <CustomTextField
                id="ios_link"
                name="ios_link"
                type="url"
                variant="outlined"
                fullWidth
                placeholder="https://apps.apple.com/app/myapp"
                value={form.ios_link}
                onChange={handleChange}
                aria-label="Enter iOS Link URL"
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
              aria-label="Create App Link"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};


// Edit App Link Form Component
const EditAppLinkForm = ({ onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceId: '',
    android_link: '',  
    ios_link: '',      
  });

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
        serviceId: initialData.serviceId?._id || initialData.serviceId || '',
        android_link: initialData.android_link || '',  
        ios_link: initialData.ios_link || '',          
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.serviceId) {
      toast.error('Service selection is required');
      return;
    }

    if (!form.android_link && !form.ios_link) {
      toast.error('At least one app link is required');
      return;
    }

    // Ã¢Å“â€¦ Validate Android URL
    if (form.android_link) {
      try {
        new URL(form.android_link);
      } catch (error) {
        toast.error('Please enter a valid Android link URL');
        return;
      }
    }

    // Ã¢Å“â€¦ Validate iOS URL
    if (form.ios_link) {
      try {
        new URL(form.ios_link);
      } catch (error) {
        toast.error('Please enter a valid iOS link URL');
        return;
      }
    }

    onSubmit(form, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Edit App Link" sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            {/* Service */}
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="serviceId" required>Select Service</CustomFormLabel>
              <CustomTextField
                select
                id="serviceId"
                name="serviceId"
                value={form.serviceId}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="">-- Select Service --</MenuItem>
                {services.map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    {service.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            {/* Ã¢Å“â€¦ Android Link */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="android_link">Android Link</CustomFormLabel>
              <CustomTextField
                id="android_link"
                name="android_link"
                type="url"
                value={form.android_link}
                onChange={handleChange}
                fullWidth
                placeholder="https://play.google.com/store/apps/details?id=myapp"
              />
            </Grid>

            {/* Ã¢Å“â€¦ iOS Link */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="ios_link">iOS Link</CustomFormLabel>
              <CustomTextField
                id="ios_link"
                name="ios_link"
                type="url"
                value={form.ios_link}
                onChange={handleChange}
                fullWidth
                placeholder="https://apps.apple.com/app/myapp"
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


// Main App Links Component
const AppLinks = () => {
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
        'Content-Type': 'application/json',
      },
    };

    let res;
    if (id) {
      // Ã¢Å“â€¦ UPDATE: Using URLS.Editapplink
      res = await axios.put(
        `${URLS.Editapplink}/${id}`,
        formData,
        config
      );
    } else {
      // Ã¢Å“â€¦ CREATE: Using URLS.Addapplink
      res = await axios.post(
        URLS.Addapplink,
        formData,
        config
      );
    }

    if (res.status === 200 || res.status === 201) {
      toast.success(res.data.message || 'Operation successful');
      handleCloseForm();
      await getData();
      window.scrollTo({ top: 500, behavior: 'smooth' });
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
    const config = { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      } 
    };
    
    // Ã¢Å“â€¦ DELETE: Using URLS.Editapplink with ID
    const res = await axios.delete(
      `${URLS.Editapplink}/${deleteDialog.data._id}`,
      config
    );

    if (res.status === 200) {
      toast.success(res.data.message || 'Deleted successfully');
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
    const config = { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      } 
    };
    
    // Ã¢Å“â€¦ Using URLS.Getapplink
    const res = await axios.get(URLS.Getapplink, config);

    console.log('App Links API response:', res.data);
    setData(res.data.data || []);
  } catch (error) {
    toast.error('Failed to fetch App Links.');
    console.error('Failed to fetch App Links:', error);
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
        (item.android_link && item.android_link.toLowerCase().includes(search.toLowerCase())) ||
        (item.ios_link && item.ios_link.toLowerCase().includes(search.toLowerCase())) ||
        (item.serviceId?.name && item.serviceId.name.toLowerCase().includes(search.toLowerCase()))
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
      field: 'service',
      headerName: 'Service',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.serviceId?.name || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'android_link',  // Ã¢Å“â€¦ Added Android Column
      headerName: 'Android Link',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        params.value ? (
          <Link
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: theme.palette.primary.main,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {params.value}
          </Link>
        ) : (
          <Typography variant="body2" color="text.secondary">N/A</Typography>
        )
      ),
    },
    {
      field: 'ios_link',  // Ã¢Å“â€¦ Added iOS Column
      headerName: 'iOS Link',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        params.value ? (
          <Link
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: theme.palette.primary.main,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {params.value}
          </Link>
        ) : (
          <Typography variant="body2" color="text.secondary">N/A</Typography>
        )
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
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={() => handleEditPopUp(params.row)}
            disabled={loading}
            sx={{ minWidth: '32px', padding: '4px 6px' }}
            aria-label={`Edit app links`}
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
            aria-label={`Delete app links`}
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
    <PageContainer title="App Links" description="Manage App Links for your application">
      <Breadcrumb title="App Links" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && <AddAppLinkForm onClose={handleCloseForm} onSubmit={handleSubmit} />}
      {showEditForm && (
        <EditAppLinkForm
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
         <DialogContentText id="delete-dialog-description" sx={{ color: theme.palette.text.primary }}>
  Are you sure you want to delete the app links for{' '}
  <strong>{deleteDialog.data?.serviceId?.name || 'this service'}</strong>? This action cannot be undone.
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
          <Typography variant="h6">App Links List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <CustomTextField
              size="small"
              placeholder="Search by service or link"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search App Links"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              disabled={loading}
              startIcon={<IconPlus size={20} />}
              aria-label="Create App Link"
            >
              Create App links
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

export default AppLinks;


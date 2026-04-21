import React, { useState, useEffect, useMemo } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Box,
  Grid,
  Paper,
  Divider,
  TextField,
  Typography,
  CardContent,
  styled,
  Select,
  MenuItem,
} from '@mui/material';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Push Notification' }];

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Add Notification Form Component with Image Upload
const AddNotificationForm = ({ onClose, onSubmit }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    title: '',
    sendTo: '',
    description: '',
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }
    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) {
      toast.error(`Image must be ${maxMB}MB or less.`);
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImage(null);
    setPreview('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Notification Subject is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('sendTo', form.sendTo);
    formData.append('description', form.description);
    formData.append('users', 'All');
    if (image) formData.append('image', image);

    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <ParentCard
          title="Create Push Notification"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel required>Subject</CustomFormLabel>
              <CustomTextField
                placeholder="Enter Subject"
                onChange={handleChange}
                variant="outlined"
                value={form.title}
                type="text"
                name="title"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel>Send To</CustomFormLabel>
              <CustomSelect
                required
                fullWidth
                name="sendTo"
                variant="outlined"
                value={form.sendTo}
                onChange={handleChange}
                aria-label="Select service"
              >
                <MenuItem value="store">Store</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="driver">Driver</MenuItem>
                <MenuItem value="provider">Provider</MenuItem>
                <MenuItem value="worker">Worker</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel>Upload Image (optional)</CustomFormLabel>
              <Box display="flex" alignItems="center" gap={2}>
                <CustomTextField accept="image/*" type="file" onChange={handleImageChange} />
                {preview && (
                  <Button variant="text" color="error" onClick={clearImage}>
                    Remove
                  </Button>
                )}
              </Box>
              {preview && (
                <Box mt={2}>
                  <Typography variant="body2" color="textSecondary">
                    Preview:
                  </Typography>
                  <Box
                    component="img"
                    src={preview}
                    alt="Preview"
                    sx={{
                      mt: 1,
                      width: 120,
                      height: 120,
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid #ddd',
                    }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomFormLabel required>Message</CustomFormLabel>
              <CustomTextField
                onChange={handleChange}
                value={form.description}
                name="description"
                type="text"
                multiline
                rows={3}
                fullWidth
                required
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
              aria-label="Create Notification"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

const Notification = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleSubmit = async (formData) => {
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
      const res = await axios.post(URLS.AddNotification, formData, config);

      if (res.status === 200) {
        toast.success(res.data.message || 'Notification created');
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

  const handleDelete = async (row) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm('Do you really want to delete this Notification?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteNotification}/${row._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message || 'Deleted');
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
        URLS.GetNotification,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.notifications || []);
    } catch (error) {
      toast.error('Failed to fetch Notification.');
      console.error('Failed to fetch Notification:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredData(data);
    } else {
      const s = search.toLowerCase();
      const filtered = (data || []).filter((item) => (item?.title || '').toLowerCase().includes(s));
      setFilteredData(filtered);
    }
  }, [data, search]);

  const handleSearch = (e) => setSearch(e.target.value);

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'imageUrl',
        headerName: 'Image',
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const src = params.row?.imageUrl || params.row?.image || '';
          if (!src) return '-';
          return (
            <Box sx={{ p: 0.5 }}>
              <img
                src={src}
                alt={params.row?.title || 'img'}
                style={{
                  width: 56,
                  height: 56,
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '1px solid #eee',
                }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </Box>
          );
        },
      },
      { field: 'title', headerName: 'Subject', flex: 1, minWidth: 160 },
      { field: 'description', headerName: 'Message', flex: 1.2, minWidth: 220 },
      { field: 'logCreatedDate', headerName: 'Date Created', flex: 0.8, minWidth: 160 },
      {
        field: 'action',
        headerName: 'Action',
        flex: 0.6,
        minWidth: 140,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            {' '}
            {rolesAndPermission.app_notification_delete === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleDelete(params.row)}
                  disabled={loading}
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  aria-label={`Delete ${params.row?.title || ''}`}
                >
                  <IconTrash stroke={1.5} size={18} />
                </Button>{' '}
              </>
            ) : (
              <></>
            )}
          </Box>
        ),
      },
    ],
    [loading],
  );

  const rows = useMemo(
    () =>
      (filteredData || []).map((item, index) => ({
        id: item?._id || index,
        ...item,
      })),
    [filteredData],
  );

  return (
    <PageContainer
      title="Push Notification"
      description="Manage Push Notification for your e-commerce platform"
    >
      <Breadcrumb title="Push Notification" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      {showAddForm && <AddNotificationForm onClose={handleCloseForm} onSubmit={handleSubmit} />}
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
          <Typography variant="h6">Push Notification List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by subject"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 220 }, bgcolor: 'background.paper' }}
              aria-label="Search Push Notification"
            />{' '}
            {rolesAndPermission.app_notification_add === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create Push Notification"
                >
                  Create Push Notification
                </Button>{' '}
              </>
            ) : (
              <></>
            )}
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
              initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
              disableRowSelectionOnClick
              autoHeight
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default Notification;


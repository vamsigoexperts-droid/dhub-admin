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
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Notification' }];

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Add Notification Form Component
const AddNotificationForm = ({ onClose, onSubmit }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    title: '',
    sendTo: '',
    description: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Notification Subject is required.');
      return;
    }

    const formData = {
      title: form.title,
      sendTo: form.sendTo,
      description: form.description,
      users: 'All',
    };
    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create Notification"
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

  const handleSubmit = async (formData, id) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let res = await axios.post(URLS.AddNotification, formData, config);

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

    if (window.confirm('Do you really want to delete this Notification?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteNotification}/${data._id}`, {
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
    if (search === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()),
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
        field: 'title',
        headerName: 'Subject',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'description',
        headerName: 'Message',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'logCreatedDate',
        headerName: 'Date Created',
        flex: 1,
        minWidth: 150,
      },

      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        minWidth: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            {rolesAndPermission.send_notification_delete === true ||
            rolesAndPermission.accessAll === true ? (
              <>
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
      filteredData?.map((item, index) => ({
        id: index,
        ...item,
      })) || [],
    [filteredData],
  );

  return (
    <PageContainer
      title="Notification"
      description="Manage Notification for your e-commerce platform"
    >
      <Breadcrumb title="Notification" items={BCrumb} />
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
          <Typography variant="h6">Notification List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Notification"
            />

            {rolesAndPermission.send_notification_add === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create Notification"
                >
                  Create Notification
                </Button>
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

export default Notification;

import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Grid, Divider, Chip, Paper, CardContent, Tooltip } from '@mui/material';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { styled, useTheme } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import { IconEye } from '@tabler/icons-react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { URLS } from '../../Url';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Ecommerce Queries' }];

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const UpdateStatusForm = ({ onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    status: initialData?.status || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.status) {
      toast.error('Status is required.');
      return;
    }

    const formData = {
      status: form.status,
    };
    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title={`Update Query Status - ${initialData?.ticketId}`}
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel>Current Status</CustomFormLabel>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={initialData?.status?.toUpperCase() || 'N/A'}
                  color={getStatusColor(initialData?.status)}
                  variant="filled"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="status" required>
                Update Status
              </CustomFormLabel>
              <CustomSelect
                value={form.status}
                name="status"
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="solved">Solved</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
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
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit" aria-label="Update Status">
              Update Status
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'solved':
      return 'success';
    case 'in-progress':
      return 'info';
    case 'closed':
      return 'error';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

const EcommerceQueries = () => {
  const theme = useTheme();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [updateData, setUpdateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const navigate = useNavigate();

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

  const handleView = (data) => {
    localStorage.setItem('complaintId', data._id);
    navigate(`/view-complaints`);
  };

  const handleUpdatePopUp = (data) => {
    setShowUpdateForm(true);
    setUpdateData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseForm = () => {
    setShowUpdateForm(false);
    setUpdateData(null);
  };

  const handleUpdate = async (formData, id) => {
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

      const res = await axios.put(`${URLS.UPDATE_QUERY_URL}/${id}`, formData, config);

      if (res.status === 200) {
        toast.success('Query status updated successfully!');
        handleCloseForm();
        getAllEcommerceQueries();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update query status';
      toast.error(message);
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllEcommerceQueries = async () => {
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

      const res = await axios.post(URLS.GET_ALL_QUERIES_URL, {}, config);

      if (res.data && res.data.data) {
        setData(res.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Failed to fetch Ecommerce Queries:', error);
      const message = error.response?.data?.message || 'Failed to fetch queries';
      toast.error(message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllEcommerceQueries();
  }, []);

  useEffect(() => {
    let filtered = data;

    if (search !== '') {
      filtered = filtered.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(search.toLowerCase())) ||
          (item.subject && item.subject.toLowerCase().includes(search.toLowerCase())) ||
          (item.ticketId && item.ticketId.toLowerCase().includes(search.toLowerCase())) ||
          (item.storeName && item.storeName.toLowerCase().includes(search.toLowerCase())) ||
          (item.description && item.description.toLowerCase().includes(search.toLowerCase())),
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [data, search, statusFilter]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength = 50) => {
    if (!text) return 'N/A';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN');
    } catch {
      return dateString;
    }
  };

  const handleDelete = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    if (window.confirm('Do you really want to delete this data?')) {
      try {
        const res = await axios.delete(`${URLS.DeleteProviderComplaints}/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          getAllEcommerceQueries();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        sortable: false,
        filterable: false,
        flex: 0.5,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'ticketId',
        headerName: 'Ticket ID',
        flex: 1,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
            {params.row.ticketId || 'N/A'}
          </Typography>
        ),
      },
      {
        field: 'storeName',
        headerName: 'Store Name',
        flex: 1.2,
        renderCell: (params) => (
          <Tooltip title={params.row.storeName || 'N/A'} placement="top">
            <Typography variant="body2">{truncateText(params.row.storeName, 25)}</Typography>
          </Tooltip>
        ),
      },
      {
        field: 'title',
        headerName: 'Title',
        flex: 1.2,
        renderCell: (params) => (
          <Tooltip title={params.row.title || 'N/A'} placement="top">
            <Typography variant="body2">{truncateText(params.row.title, 30)}</Typography>
          </Tooltip>
        ),
      },
      {
        field: 'subject',
        headerName: 'Subject',
        flex: 1.2,
        renderCell: (params) => (
          <Tooltip title={params.row.subject || 'N/A'} placement="top">
            <Typography variant="body2">{truncateText(params.row.subject, 30)}</Typography>
          </Tooltip>
        ),
      },
      {
        field: 'priority',
        headerName: 'Priority',
        flex: 0.8,
        renderCell: (params) => (
          <Chip
            label={params.row.priority?.toUpperCase() || 'N/A'}
            size="small"
            color={getPriorityColor(params.row.priority)}
            variant="outlined"
          />
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.8,
        renderCell: (params) => (
          <Chip
            label={params.row.status?.toUpperCase() || 'N/A'}
            size="small"
            color={getStatusColor(params.row.status)}
            variant="filled"
          />
        ),
      },
      {
        field: 'date',
        headerName: 'Date',
        flex: 0.8,
        renderCell: (params) => (
          <Typography variant="body2">
            {params.row.date || formatDate(params.row.logCreatedDate)}
          </Typography>
        ),
      },
      {
        field: 'time',
        headerName: 'Time',
        flex: 0.8,
        renderCell: (params) => <Typography variant="body2">{params.row.time || 'N/A'}</Typography>,
      },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 0.8,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            {rolesAndPermission.ecommerce_complaints_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleUpdatePopUp(params.row)}
                  disabled={loading}
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  aria-label={`Update status for ${params.row.ticketId}`}
                >
                  <IconEdit stroke={1.5} size={18} />
                </Button>
              </>
            ) : (
              <></>
            )}
            {rolesAndPermission.ecommerce_complaints_delete === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleDelete(params.row)}
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
    <PageContainer
      title="Ecommerce Queries"
      description="Manage Ecommerce Queries and Support Requests"
    >
      <Breadcrumb title="Ecommerce Queries" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showUpdateForm && (
        <UpdateStatusForm
          onClose={handleCloseForm}
          onSubmit={handleUpdate}
          initialData={updateData}
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
          <Typography variant="h6">Ecommerce Queries List ({filteredData.length})</Typography>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={handleStatusFilter}
                sx={{
                  bgcolor: 'white',
                  borderRadius: '6px',
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="solved">Solved</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>

            <CustomTextField
              size="small"
              placeholder="Search by ticket ID, store, title, subject..."
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 200, sm: 300 }, bgcolor: 'white' }}
              aria-label="Search Ecommerce Queries"
            />

            <Button
              variant="outlined"
              color="primary"
              onClick={getAllEcommerceQueries}
              disabled={loading}
              aria-label="Refresh Queries"
            >
              Refresh
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
              pageSizeOptions={[5, 10, 20, 50]}
              disableRowSelectionOnClick
              autoHeight
              getRowId={(row) => row._id}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              sx={{
                '& .MuiDataGrid-cell': {
                  py: 1,
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default EcommerceQueries;

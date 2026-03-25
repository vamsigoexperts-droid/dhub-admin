import React, { useState, useEffect, useMemo } from 'react';
import {
  TextField,
  Avatar,
  Paper,
  Box,
  Typography,
  Divider,
  CardContent,
  Chip,
} from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { IconCheck, IconX, IconEye, IconTrash } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { URLS } from '../../Url';
import axios from 'axios';
import { useNavigate } from 'react-router';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Pending Stores' }];

// Main PendingStores Component
const PendingStores = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const [stores, setStores] = useState([]);
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

  const handleView = (data) => {
    localStorage.setItem('storeId', data.storeId);
    navigate(`/viewstore`);
  };

  const handleApprove = async (store) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm(`Are you sure you want to approve "${store.name}" store?`)) {
      setLoading(true);
      try {
        // Update store status to active
        const formData = new FormData();
        // formData.append('name', store.name);
        // formData.append('serviceId', store.serviceId);
        // formData.append('status', 'active');

        const res = await axios.put(`${URLS.ApproveStore}/${store.storeId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          toast.success(res.data.message || 'Store approved successfully!');
          getStores(); // Refresh the data
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to approve store';
        toast.error(message);
        console.error('Approve store error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReject = async (store) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to reject "${store.name}" store? This will delete it permanently.`,
      )
    ) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteStore}/${store.storeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          toast.success(res.data.message || 'Store rejected and deleted successfully!');
          getStores(); // Refresh the data
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to reject store';
        toast.error(message);
        console.error('Reject store error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Get inactive stores
  const getStores = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetStoresByStatus,
        { blockOrUnblock: 'pending' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Filter only inactive stores
      const inactiveStores = res.data.store?.filter((store) => store.status === 'inactive') || [];
      setStores(inactiveStores);
    } catch (error) {
      toast.error('Failed to fetch pending stores.');
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStores();
  }, [token]);

  // Filter data based on search
  useEffect(() => {
    const filtered = stores.filter((store) => {
      if (!search) return true;

      const searchLower = search.toLowerCase();
      return (
        store.name?.toLowerCase().includes(searchLower) ||
        store.serviceName?.toLowerCase().includes(searchLower) ||
        store.phone?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredData(filtered);
  }, [stores, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    if (window.confirm('Do you really want to delete this data?')) {
      try {
        const res = await axios.delete(`${URLS.DeleteStore}/${data.storeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          getStores();
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
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'sectionInfo',
        headerName: 'Store Info',
        flex: 1.5,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={params.row.logo ? `${URLS.FileBase}${params.row.logo}` : ''}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {params.row.name}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'serviceName',
        headerName: 'Service',
        flex: 1,
        renderCell: (params) => (
          <Chip label={params.row.serviceName || 'N/A'} size="small" variant="outlined" />
        ),
      },
      {
        field: 'contact',
        headerName: 'Contact',
        flex: 1,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2">{params.row.phone}</Typography>
          </Box>
        ),
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: 1,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2">{params.row.cityName || 'N/A'}</Typography>
          </Box>
        ),
      },
      {
        field: 'personalName',
        headerName: 'Owner',
        flex: 1,
        renderCell: (params) => (
          <Typography variant="body2">{params.row.personalName || 'N/A'}</Typography>
        ),
      },
      {
        field: 'logCreatedDate',
        headerName: 'Created Date',
        flex: 1,
        renderCell: (params) => {
          const date = new Date(params.row.logCreatedDate);
          return (
            <Typography variant="body2">
              {date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Typography>
          );
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.8,
        renderCell: (params) => (
          <Chip label="Pending" color="warning" size="small" variant="outlined" />
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1.2,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1} alignItems="center" sx={{ padding: '4px 6px' }}>
            {rolesAndPermission.pending_stores_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="success"
                  variant="contained"
                  onClick={() => handleApprove(params.row)}
                  disabled={loading}
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  aria-label={`Approve ${params.row.name}`}
                >
                  <IconCheck stroke={1.5} size={18} />
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleReject(params.row)}
                  disabled={loading}
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  aria-label={`Reject ${params.row.name}`}
                >
                  <IconX stroke={1.5} size={18} />
                </Button>{' '}
              </>
            ) : (
              <></>
            )}
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={() => handleView(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`View ${params.row.name}`}
            >
              <IconEye stroke={1.5} size={18} />
            </Button>

            {rolesAndPermission.pending_stores_delete === true ||
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
    () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
    [filteredData],
  );

  return (
    <PageContainer
      title="Pending Stores"
      description="Review and manage pending Stores for your e-commerce platform"
    >
      <Breadcrumb title="Pending Store Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper
        variant="outlined"
        sx={{
          mt: 3,
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
          <Typography variant="h6">Pending Stores ({stores.length})</Typography>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search pending stores..."
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Pending Stores"
            />
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%', minHeight: 400 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-row': {
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default PendingStores;

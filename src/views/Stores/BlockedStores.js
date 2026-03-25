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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { IconEdit, IconEye, IconAnalyze, IconTrash } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { URLS } from '../../Url';
import axios from 'axios';
import { useNavigate } from 'react-router';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Blocked Stores' }];

// Main Component for Blocked Stores
const BlockedStores = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [blockedStores, setBlockedStores] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const handleEditPopUp = (data) => {
    localStorage.setItem('storeId', data.storeId);
    navigate('/editstore');
  };

  const handleView = (data) => {
    localStorage.setItem('storeId', data.storeId);
    navigate(`/viewstore`);
  };

  // Open unblock confirmation modal
  const handleUnblockClick = (store) => {
    setSelectedStore(store);
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStore(null);
  };

  // Unblock store function
  const handleUnblockStore = async () => {
    if (!selectedStore || !token) {
      toast.error('Authentication token missing or store not selected');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${URLS.BlockorUnblockStore}/${selectedStore.storeId}`,
        { blockOrUnblock: 'unblock' },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 200) {
        toast.success('Store unblocked successfully');

        // Remove the unblocked store from the blocked stores list
        setBlockedStores((prevBlocked) =>
          prevBlocked.filter((store) => store._id !== selectedStore._id),
        );
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error unblocking store';
      toast.error(message);
      console.error('Unblock store error:', error);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  // Get blocked stores using the new API
  const getBlockedStores = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetStoresByStatus,
        { blockOrUnblock: 'block' },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log('API Response:', res.data); // Debug log

      // Handle different response structures
      if (res.data && res.data.store) {
        setBlockedStores(res.data.store);
      } else if (res.data && res.data.drivers) {
        // If the API returns drivers for stores (as shown in your response)
        setBlockedStores(res.data.drivers);
      } else if (res.data && res.data.stores) {
        // If the API returns stores array
        setBlockedStores(res.data.stores);
      } else {
        console.log('No stores found in response');
        setBlockedStores([]);
      }
    } catch (error) {
      toast.error('Failed to fetch blocked stores.');
      console.error('Failed to fetch blocked stores:', error);
      setBlockedStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlockedStores();
  }, []);

  // Filter blocked stores based on search
  useEffect(() => {
    const filtered = blockedStores.filter((store) => {
      if (!search) return true;

      const searchLower = search.toLowerCase();
      return (
        store.name?.toLowerCase().includes(searchLower) ||
        store.serviceName?.toLowerCase().includes(searchLower) ||
        store.phone?.toLowerCase().includes(searchLower) ||
        // Also search by firstName + lastName for driver data structure
        `${store.firstName} ${store.lastName}`.toLowerCase().includes(searchLower) ||
        store.email?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredData(filtered);
  }, [blockedStores, search]);

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
          getBlockedStores();
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
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={
                params.row.image
                  ? `${URLS.FileBase}${params.row.image}`
                  : params.row.image
                  ? `${URLS.FileBase}${params.row.image}`
                  : ''
              }
              alt={params.row.name || `${params.row.firstName} ${params.row.lastName}`}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2" noWrap>
              {params.row.name || `${params.row.firstName} ${params.row.lastName}`}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'serviceName',
        headerName: 'Section',
        flex: 1,
        renderCell: (params) => (
          <Typography variant="body2">
            {params.row.serviceName || params.row.serviceType || 'N/A'}
          </Typography>
        ),
      },
      {
        field: 'phone',
        headerName: 'Phone',
        flex: 1,
      },
      {
        field: 'logCreatedDate',
        headerName: 'Date',
        flex: 1,
        renderCell: (params) => {
          const date = new Date(params.row.logCreatedDate);
          return date.toLocaleDateString();
        },
      },
      {
        field: 'blockOrUnblock',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => {
          const status = params.row.blockOrUnblock || 'block';
          const statusText = status === 'block' ? 'Blocked' : 'Active';
          const statusColor = status === 'block' ? 'error' : 'success';

          return <Chip label={statusText} color={statusColor} size="small" variant="outlined" />;
        },
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1} alignItems="center" sx={{ padding: '4px 6px' }}>
            {rolesAndPermission.blocked_stores_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleEditPopUp(params.row)}
                  disabled={loading}
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  aria-label={`Edit ${
                    params.row.name || `${params.row.firstName} ${params.row.lastName}`
                  }`}
                >
                  <IconEdit stroke={1.5} size={18} />
                </Button>
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
              aria-label={`View ${
                params.row.name || `${params.row.firstName} ${params.row.lastName}`
              }`}
            >
              <IconEye stroke={1.5} size={18} />
            </Button>

            {rolesAndPermission.blocked_stores_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="success"
                  variant="contained"
                  onClick={() => handleUnblockClick(params.row)}
                  disabled={loading}
                  sx={{ minWidth: '60px', padding: '4px 8px', fontSize: '0.75rem' }}
                  aria-label={`Unblock ${
                    params.row.name || `${params.row.firstName} ${params.row.lastName}`
                  }`}
                >
                  <IconAnalyze stroke={1.5} size={18} />
                </Button>
              </>
            ) : (
              <></>
            )}

            {rolesAndPermission.blocked_stores_delete === true ||
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
    <PageContainer title="Blocked Stores" description="Manage blocked stores for your platform">
      <Breadcrumb title="Blocked Stores Management" items={BCrumb} />
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
          <Typography variant="h6">Blocked Store List ({blockedStores.length} stores)</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search stores..."
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Blocked Stores"
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
                '& .MuiDataGrid-cell': {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Unblock Confirmation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Unblock Store</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to unblock{' '}
            {selectedStore
              ? `"${selectedStore.name || `${selectedStore.firstName} ${selectedStore.lastName}`}"`
              : 'this store'}
            ?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Unblocked stores will become visible to customers again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleUnblockStore}
            variant="contained"
            color="success"
            disabled={loading}
          >
            {loading ? 'Unblocking...' : 'Confirm Unblock'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default BlockedStores;

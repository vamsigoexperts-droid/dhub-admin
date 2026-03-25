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
  Grid,
  DialogActions,
} from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { IconPlus, IconEdit, IconTrash, IconEye, IconUserCancel } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { URLS } from '../../Url';
import axios from 'axios';
import { useNavigate } from 'react-router';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Delivery Partners' }];

// Main Delivery Component
const Drivers = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const handleAddPopUp = () => {
    navigate('/add-driver');
  };

  const handleEditPopUp = (data) => {
    localStorage.setItem('driverId', data.driverId);
    navigate(`/edit-driver/${data.driverId}`);
  };

  const handleView = (data) => {
    localStorage.setItem('driverId', data.driverId);
    navigate(`/view-driver/${data.driverId}`);
  };

  // Open block confirmation modal
  const handleBlockClick = (driver) => {
    setSelectedDriver(driver);
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDriver(null);
  };

  // Block driver function
  const handleBlockDriver = async () => {
    if (!selectedDriver || !token) {
      toast.error('Authentication token missing or driver not selected');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${URLS.BlockorUnblockDriver}/${selectedDriver.driverId}`,
        { blockOrUnblock: 'block' },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 200) {
        toast.success('Driver blocked successfully');
        setData((prevData) =>
          prevData.map((driver) =>
            driver._id === selectedDriver._id ? { ...driver, blockOrUnblock: 'block' } : driver,
          ),
        );
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error blocking driver';
      toast.error(message);
    } finally {
      setLoading(false);
      handleCloseModal();
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
        URLS.GetDriversByStatus,
        { blockOrUnblock: 'unblock' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.drivers || []);
    } catch (error) {
      toast.error('Failed to fetch drivers.');
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((driver) => {
      // Only show unblocked drivers
      if (driver.blockOrUnblock !== 'unblock') return false;

      if (!search) return true;

      const searchLower = search.toLowerCase();
      return (
        `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchLower) ||
        driver.phone?.toLowerCase().includes(searchLower) ||
        driver.email?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredData(filtered);
  }, [data, search]);

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
        const res = await axios.delete(`${URLS.DeleteDriver}/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          getData();
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
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'sectionInfo',
        headerName: 'Driver Info',
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={URLS.FileBase + params.row.profileImage}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">
              {params.row.firstName} {params.row.lastName}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'servicetypeName',
        headerName: 'Service Type',
        flex: 1,
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
      },
      {
        field: 'blockOrUnblock',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => {
          const status = params.row.blockOrUnblock || 'unblock';
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
          <Box display="flex" gap={1}>
            {rolesAndPermission.delivery_partners_list_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  onClick={() => handleEditPopUp(params.row)}
                  disabled={loading}
                  aria-label={`Edit ${params.row.name}`}
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
              aria-label={`View ${params.row.name}`}
            >
              <IconEye stroke={1.5} size={18} />
            </Button>

            {rolesAndPermission.delivery_partners_list_delete === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleBlockClick(params.row)}
                  disabled={loading || params.row.blockOrUnblock === 'block'}
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  aria-label={`Block ${params.row.name}`}
                >
                  <IconUserCancel stroke={1.5} size={18} />
                </Button>
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
    [loading],
  );

  const rows = useMemo(
    () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
    [filteredData],
  );

  return (
    <PageContainer
      title="Delivery Partner"
      description="Manage Delivery Partner for your e-commerce platform"
    >
      <Breadcrumb title="Delivery Partner Management" items={BCrumb} />
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
          <Typography variant="h6">Delivery Partner List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Delivery"
            />

            {rolesAndPermission.delivery_partners_list_add === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create New Delivery Partner"
                >
                  Create Delivery Partner
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
              rowHeight={38}
              rowsPerPageOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Block Confirmation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Block Driver</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to block{' '}
            {selectedDriver
              ? `${selectedDriver.firstName} ${selectedDriver.lastName}`
              : 'this driver'}
            ?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Blocked drivers will no longer be able to access the system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={handleBlockDriver} variant="contained" color="error" disabled={loading}>
            {loading ? 'Blocking...' : 'Confirm Block'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Drivers;

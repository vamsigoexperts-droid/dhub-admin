import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  TextField,
  Paper,
  Box,
  Divider,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
} from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import CustomTextField from '../theme-elements/CustomTextField';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from 'src/Url';
import axios from 'axios';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Blocked Users' }];

// Utility to get auth token
const getAuthToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || '';
  } catch (error) {
    console.error('Error parsing user token:', error);
    return '';
  }
};

const BlockedUsers = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState({ fetch: false, submit: false });
  const [openUnblockModal, setOpenUnblockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unblockForm, setUnblockForm] = useState({
    reason: '',
  });
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const token = getAuthToken();

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0]


  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setIsLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const res = await axios.post(
        URLS.GetUsers,
        { status: 'blocked' },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Use the blocked users directly from API response
      const blockedUsers = res.data.user || [];
      setData(blockedUsers);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch blocked users');
    } finally {
      setIsLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

  useEffect(() => {
    getData();
  }, [token]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(
      (item) =>
        `${item.name || 'No Name'}`.toLowerCase().includes(search.toLowerCase()) ||
        `${item.email || ''}`.toLowerCase().includes(search.toLowerCase()) ||
        `${item.phone || ''}`.toLowerCase().includes(search.toLowerCase()) ||
        `${item.blockedReason || ''}`.toLowerCase().includes(search.toLowerCase()) ||
        `${item.userUniqueId || ''}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  // Handle unblock user modal
  const handleUnblockUser = (user) => {
    setSelectedUser(user);
    setUnblockForm({ reason: '' });
    setOpenUnblockModal(true);
  };

  const handleCloseUnblockModal = () => {
    setOpenUnblockModal(false);
    setSelectedUser(null);
    setUnblockForm({ reason: '' });
  };

  const handleUnblockFormChange = (e) => {
    setUnblockForm({ ...unblockForm, [e.target.name]: e.target.value });
  };

  const handleUnblockSubmit = async (e) => {
    e.preventDefault();

    if (!unblockForm.reason.trim()) {
      toast.error('Please provide a reason for unblocking this user');
      return;
    }

    if (!selectedUser) {
      toast.error('No user selected');
      return;
    }

    setIsLoading((prev) => ({ ...prev, submit: true }));

    try {
      const response = await axios.put(
        `${URLS.UpdateUserStatus}/${selectedUser._id}`,
        {
          status: 'active',
          blockedReason: unblockForm.reason.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        toast.success(
          `User ${selectedUser.name || selectedUser.userUniqueId} has been unblocked successfully`,
        );
        handleCloseUnblockModal();
        getData(); // Refresh the data
      } else {
        toast.error(response.data.message || 'Failed to unblock user');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);

      if (error.response?.status === 404) {
        toast.error('User not found');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to unblock this user');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Invalid request data');
      } else {
        toast.error(error.response?.data?.message || 'Failed to unblock user');
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, submit: false }));
    }
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
        field: 'UserInfo',
        headerName: 'User Info',
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={params.row.image ? `${URLS.FileBase}${params.row.image}` : ''}
              alt={`${params.row.name || 'User'}`}
              sx={{ width: 40, height: 40 }}
            >
              {(params.row.name || 'U').charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="500">
                {params.row.name || 'No Name'}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'phone',
        headerName: 'Phone',
        flex: 1,
        renderCell: (params) => (
          <Typography variant="body2">{params.row.phone || 'N/A'}</Typography>
        ),
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        renderCell: (params) => (
          <Typography variant="body2">{params.row.email || 'N/A'}</Typography>
        ),
      },
      {
        field: 'logCreatedDate',
        headerName: 'Joined Date',
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
        field: 'logModifiedDate',
        headerName: 'Blocked Date',
        flex: 1,
        renderCell: (params) => {
          const date = new Date(params.row.logModifiedDate);
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
        field: 'blockedReason',
        headerName: 'Blocked Reason',
        flex: 1,
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={params.row.blockedReason || 'No reason provided'}
          >
            {params.row.blockedReason || 'No reason provided'}
          </Typography>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => (
          <Chip label="Blocked" size="small" color="error" variant="outlined" />
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {rolesAndPermission.blocked_users_edit === true || rolesAndPermission.accessAll === true ? <>
              <Button
                size="small"
                color="success"
                variant="contained"
                onClick={() => handleUnblockUser(params.row)}
                disabled={isLoading.submit}
              >
                Un Block
              </Button>
            </> : <></>}
          </Box>
        ),
      },
    ],
    [isLoading.submit],
  );

  return (
    <PageContainer
      title="Blocked Users"
      description="Manage Blocked Users for your e-commerce platform"
    >
      <Breadcrumb title="Blocked Users" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
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
          <Typography variant="h6">Blocked Users ({data.length})</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search blocked users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Blocked Users"
            />
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={filteredData}
              columns={columns}
              loading={isLoading.fetch}
              pageSizeOptions={[5, 10, 20]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              disableRowSelectionOnClick
              autoHeight
              getRowId={(row) => row._id}
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

      {/* Unblock User Modal */}
      <Dialog open={openUnblockModal} onClose={handleCloseUnblockModal} maxWidth="sm" fullWidth>
        <DialogTitle>Unblock User</DialogTitle>
        <form onSubmit={handleUnblockSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  You are about to unblock{' '}
                  <strong>{selectedUser?.name || selectedUser?.userUniqueId}</strong>. This action
                  will restore their access to the platform.
                </Typography>
                {selectedUser?.blockedReason && (
                  <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" fontWeight="500" color="error.main">
                      Originally blocked for:
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      {selectedUser.blockedReason}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="reason">Reason for Unblocking*</CustomFormLabel>
                <CustomTextField
                  id="reason"
                  name="reason"
                  value={unblockForm.reason}
                  onChange={handleUnblockFormChange}
                  placeholder="Please provide a detailed reason for unblocking this user..."
                  multiline
                  rows={3}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseUnblockModal}
              variant="outlined"
              disabled={isLoading.submit}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={isLoading.submit || !unblockForm.reason.trim()}
              startIcon={isLoading.submit ? <CircularProgress size={16} /> : null}
            >
              {isLoading.submit ? 'Unblocking...' : 'Unblock User'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default BlockedUsers;

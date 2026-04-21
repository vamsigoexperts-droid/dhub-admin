import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { URLS } from 'src/Url';
import axios from 'axios';
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
  CircularProgress,
  InputAdornment,
  Toolbar,
  Stack,
} from '@mui/material';
import {
  IconUser,
  IconPhone,
  IconCalendar,
  IconSearch,
  IconEye,
  IconTrash,
  IconRefresh,
  IconRestore,
} from '@tabler/icons-react';



// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Delete Users List' }];

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

const DeletUsers = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isLoading, setIsLoading] = useState({
    fetch: false,
    submit: false,
    delete: false,
    restore: false,
    bulkDelete: false,
    bulkRestore: false,
  });

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openRestoreModal, setOpenRestoreModal] = useState(false);
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);
  const [openBulkRestoreModal, setOpenBulkRestoreModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const token = getAuthToken();

  // Handle view action
  const handleView = (user) => {
    if (!user || !user._id) {
      toast.error('Invalid user data');
      return;
    }
    localStorage.setItem('userId', user._id);
    navigate(`/view-user`);
  };

  // Handle single delete
  const handleDeleteClick = (user) => {
    if (!user || !user._id) {
      toast.error('Invalid user data');
      return;
    }
    setSelectedUser(user);
    setOpenDeleteModal(true);
  };

  // Handle single restore
  const handleRestoreClick = (user) => {
    if (!user || !user._id) {
      toast.error('Invalid user data');
      return;
    }
    setSelectedUser(user);
    setOpenRestoreModal(true);
  };

  // Handle bulk delete
  const handleBulkDeleteClick = () => {
    if (selectedRowIds.length === 0) {
      toast.warning('Please select at least one user');
      return;
    }
    setOpenBulkDeleteModal(true);
  };

  // Handle bulk restore
  const handleBulkRestoreClick = () => {
    if (selectedRowIds.length === 0) {
      toast.warning('Please select at least one user');
      return;
    }
    setOpenBulkRestoreModal(true);
  };

  // Fetch users data
  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setIsLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const res = await axios.post(
        URLS.IsDeleteUserList,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data && res.data.user) {
        setData(res.data.user);
      } else {
        setData([]);
        toast.error('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch users');
      setData([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

  useEffect(() => {
    getData();
  }, [token]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(
      (item) =>
        (item && `${item.name || ''}`.toLowerCase().includes(search.toLowerCase())) ||
        `${item.email || ''}`.toLowerCase().includes(search.toLowerCase()) ||
        `${item.phone || ''}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  // Single Delete User
  const handleDeleteSubmit = async () => {
    if (!selectedUser || !selectedUser._id) {
      toast.error('No valid user selected for deletion');
      setOpenDeleteModal(false);
      return;
    }

    setIsLoading((prev) => ({ ...prev, delete: true }));

    try {
      const response = await axios.delete(`${URLS.DeleteUser}/${selectedUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        toast.success(`User ${selectedUser.name} has been deleted successfully`);
        setOpenDeleteModal(false);
        setSelectedUser(null);
        getData();
      } else {
        toast.error(response.data?.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  // Single Restore User
  const handleRestoreSubmit = async () => {
    if (!selectedUser || !selectedUser._id) {
      toast.error('No valid user selected for restoration');
      setOpenRestoreModal(false);
      return;
    }

    setIsLoading((prev) => ({ ...prev, restore: true }));

    try {
      const response = await axios.post(
        URLS.RestoreDeletedUser,
        { userId: selectedUser._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data && response.data.success) {
        toast.success(
          response.data.message || `User ${selectedUser.name} has been restored successfully`,
        );
        setOpenRestoreModal(false);
        setSelectedUser(null);
        getData();
      } else {
        toast.error(response.data?.message || 'Failed to restore user');
      }
    } catch (error) {
      console.error('Error restoring user:', error);
      toast.error(error.response?.data?.message || 'Failed to restore user');
    } finally {
      setIsLoading((prev) => ({ ...prev, restore: false }));
    }
  };

  // Bulk Delete Users
  const handleBulkDeleteSubmit = async () => {
    if (selectedRowIds.length === 0) {
      toast.error('No users selected for deletion');
      setOpenBulkDeleteModal(false);
      return;
    }

    setIsLoading((prev) => ({ ...prev, bulkDelete: true }));

    try {
      const deletePromises = selectedRowIds.map((userId) =>
        axios.delete(`${URLS.DeleteUser}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      const responses = await Promise.allSettled(deletePromises);

      const successCount = responses.filter((res) => res.status === 'fulfilled').length;
      const failureCount = responses.filter((res) => res.status === 'rejected').length;

      if (successCount > 0) {
        toast.success(`${successCount} user(s) deleted successfully`);
      }
      if (failureCount > 0) {
        toast.error(`${failureCount} user(s) failed to delete`);
      }

      setOpenBulkDeleteModal(false);
      setSelectedRowIds([]);
      getData();
    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast.error('Failed to delete users');
    } finally {
      setIsLoading((prev) => ({ ...prev, bulkDelete: false }));
    }
  };

  // Bulk Restore Users
  const handleBulkRestoreSubmit = async () => {
    if (selectedRowIds.length === 0) {
      toast.error('No users selected for restoration');
      setOpenBulkRestoreModal(false);
      return;
    }

    setIsLoading((prev) => ({ ...prev, bulkRestore: true }));

    try {
      const restorePromises = selectedRowIds.map((userId) =>
        axios.post(
          URLS.RestoreDeletedUser,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const responses = await Promise.allSettled(restorePromises);

      const successCount = responses.filter((res) => res.status === 'fulfilled').length;
      const failureCount = responses.filter((res) => res.status === 'rejected').length;

      if (successCount > 0) {
        toast.success(`${successCount} user(s) restored successfully`);
      }
      if (failureCount > 0) {
        toast.error(`${failureCount} user(s) failed to restore`);
      }

      setOpenBulkRestoreModal(false);
      setSelectedRowIds([]);
      getData();
    } catch (error) {
      console.error('Error in bulk restore:', error);
      toast.error('Failed to restore users');
    } finally {
      setIsLoading((prev) => ({ ...prev, bulkRestore: false }));
    }
  };

  // Handle row selection
  const handleRowSelectionChange = (newSelection) => {
    setSelectedRowIds(newSelection);
  };

  // DataGrid columns
  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 50,
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
              <IconUser size={20} />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {params.row.name || 'N/A'}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'phone',
        headerName: 'Phone',
        flex: 0.5,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={1}>
            <IconPhone size={16} color={theme.palette.text.secondary} />
            <Typography variant="body2">{params.row.phone || 'N/A'}</Typography>
          </Box>
        ),
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">{params.row.email || 'N/A'}</Typography>
          </Box>
        ),
      },
      {
        field: 'logCreatedDate',
        headerName: 'Joined Date',
        flex: 1,
        renderCell: (params) => {
          if (!params.row.logCreatedDate) {
            return <Typography variant="body2">N/A</Typography>;
          }
          const date = new Date(params.row.logCreatedDate);
          return (
            <Box display="flex" alignItems="center" gap={1}>
              <IconCalendar size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2">
                {date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.5,
        renderCell: (params) => (
          <Chip
            label="Deleted"
            size="small"
            color="error"
            variant="outlined"
            icon={<IconTrash size={16} />}
          />
        ),
      },
  {
  field: 'actions',
  headerName: 'Actions',
  width: 280, // Increased width to accommodate all buttons
  minWidth: 200, // Minimum width to prevent button overlap
  sortable: false,
  filterable: false,
  headerAlign: 'center',
  align: 'center',
  disableColumnMenu: true, // Disable column menu for actions
  renderCell: (params) => (
    <Box 
      display="flex" 
      gap={0.5} 
      justifyContent="center" 
      alignItems="center"
      sx={{ width: '100%', py: 0.5 }}
    >
      {(rolesAndPermission.delete_users_edit === true ||
        rolesAndPermission.accessAll === true) && (
        <Button
          size="small"
          color="secondary"
          variant="contained"
          onClick={() => handleView(params.row)}
          aria-label={`View ${params.row.name}`}
          startIcon={<IconEye size={14} />}
          sx={{ 
            minWidth: '75px', 
            height: '28px',
            padding: '4px 8px', 
            fontSize: '0.7rem',
            textTransform: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          View
        </Button>
      )}
      {(rolesAndPermission.delete_users_delete === true ||
        rolesAndPermission.accessAll === true) && (
        <>
          <Button
            size="small"
            color="success"
            variant="contained"
            onClick={() => handleRestoreClick(params.row)}
            startIcon={<IconRestore size={14} />}
            sx={{ 
              minWidth: '85px', 
              height: '28px',
              padding: '4px 8px', 
              fontSize: '0.7rem',
              textTransform: 'none',
              whiteSpace: 'nowrap'
            }}
            aria-label={`Restore ${params.row.name}`}
          >
            Restore
          </Button>
          {/* <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => handleDeleteClick(params.row)}
            sx={{ 
              minWidth: '75px', 
              height: '28px',
              padding: '4px 8px', 
              fontSize: '0.7rem',
              textTransform: 'none',
              whiteSpace: 'nowrap'
            }}
            startIcon={<IconTrash size={14} />}
            aria-label={`Delete ${params.row.name}`}
          >
            Delete
          </Button> */}
        </>
      )}
    </Box>
  ),
}

    ],
    [theme, rolesAndPermission],
  );

  return (
    <PageContainer
      title="Delete Users"
      description="Manage Delete Users for your e-commerce platform"
    >
      <Breadcrumb title="Delete Users" items={BCrumb} />
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
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'background.paper' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={18} />
                  </InputAdornment>
                ),
              }}
              aria-label="Search Users"
            />
          </Box>
        </Box>

        {/* Bulk Action Toolbar */}
        {selectedRowIds.length > 0 && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Toolbar
              sx={{
                bgcolor: theme.palette.primary.light,
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 16px',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {selectedRowIds.length} user(s) selected
              </Typography>
              <Stack direction="row" spacing={1}>
                {(rolesAndPermission.delete_users_delete === true ||
                  rolesAndPermission.accessAll === true) && (
                  <>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<IconRestore size={18} />}
                      onClick={handleBulkRestoreClick}
                      disabled={isLoading.bulkRestore}
                    >
                      Restore Selected
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      startIcon={<IconTrash size={18} />}
                      onClick={handleBulkDeleteClick}
                      disabled={isLoading.bulkDelete}
                    >
                      Delete Selected
                    </Button>
                  </>
                )}
              </Stack>
            </Toolbar>
          </Box>
        )}

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
              checkboxSelection
              disableRowSelectionOnClick
              autoHeight
              getRowId={(row) => row._id || Math.random()}
              rowSelectionModel={selectedRowIds}
              onRowSelectionModelChange={handleRowSelectionChange}
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Single Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
          setSelectedUser(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <IconTrash color={theme.palette.error.main} />
            Delete User
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to delete <strong>{selectedUser?.name || 'this user'}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            This action cannot be undone. All user data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setOpenDeleteModal(false);
              setSelectedUser(null);
            }}
            variant="outlined"
            disabled={isLoading.delete}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSubmit}
            variant="contained"
            color="error"
            disabled={isLoading.delete}
            startIcon={isLoading.delete ? <CircularProgress size={16} /> : <IconTrash size={16} />}
          >
            {isLoading.delete ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Single Restore Confirmation Dialog */}
      <Dialog
        open={openRestoreModal}
        onClose={() => {
          setOpenRestoreModal(false);
          setSelectedUser(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <IconRestore color={theme.palette.success.main} />
            Restore User
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to restore <strong>{selectedUser?.name || 'this user'}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            The user account will be reactivated and they will regain access to the platform.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setOpenRestoreModal(false);
              setSelectedUser(null);
            }}
            variant="outlined"
            disabled={isLoading.restore}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRestoreSubmit}
            variant="contained"
            color="success"
            disabled={isLoading.restore}
            startIcon={
              isLoading.restore ? <CircularProgress size={16} /> : <IconRestore size={16} />
            }
          >
            {isLoading.restore ? 'Restoring...' : 'Restore User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={openBulkDeleteModal}
        onClose={() => setOpenBulkDeleteModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <IconTrash color={theme.palette.error.main} />
            Bulk Delete Users
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to delete <strong>{selectedRowIds.length} user(s)</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            This action cannot be undone. All selected user data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenBulkDeleteModal(false)}
            variant="outlined"
            disabled={isLoading.bulkDelete}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBulkDeleteSubmit}
            variant="contained"
            color="error"
            disabled={isLoading.bulkDelete}
            startIcon={
              isLoading.bulkDelete ? <CircularProgress size={16} /> : <IconTrash size={16} />
            }
          >
            {isLoading.bulkDelete ? 'Deleting...' : `Delete ${selectedRowIds.length} User(s)`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Restore Confirmation Dialog */}
      <Dialog
        open={openBulkRestoreModal}
        onClose={() => setOpenBulkRestoreModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <IconRestore color={theme.palette.success.main} />
            Bulk Restore Users
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to restore <strong>{selectedRowIds.length} user(s)</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            All selected user accounts will be reactivated and they will regain access to the
            platform.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenBulkRestoreModal(false)}
            variant="outlined"
            disabled={isLoading.bulkRestore}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBulkRestoreSubmit}
            variant="contained"
            color="success"
            disabled={isLoading.bulkRestore}
            startIcon={
              isLoading.bulkRestore ? <CircularProgress size={16} /> : <IconRestore size={16} />
            }
          >
            {isLoading.bulkRestore ? 'Restoring...' : `Restore ${selectedRowIds.length} User(s)`}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default DeletUsers;


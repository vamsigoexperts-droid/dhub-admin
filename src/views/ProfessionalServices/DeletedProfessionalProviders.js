import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconEye, IconTrash, IconRotate2, IconAlertCircle } from '@tabler/icons-react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Paper,
  Box,
  Typography,
  Divider,
  CardContent,
  Chip,
  Grid,
  styled,
  TextField,
  Pagination,
  Stack,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { URLS } from '../../Url';

// Styled Components
const CustomPagination = styled(Pagination)({
  '& .MuiPaginationItem-root': {
    borderRadius: '6px',
  },
});

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Deleted Professional Providers' },
];

const DeletedProfessionalProviders = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData?.rolesAndPermission?.[0] || {};

  // State management
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [restoreDialog, setRestoreDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [LIMIT] = useState(10);

  // âœ… Fetch deleted professional provider data with pagination
  const getData = useCallback(async (page = 1, searchQuery = '') => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const url = `${URLS.Base}/v1/dhubApi/admin/professional-providers/get-all-deleted-professional-providers`;
      const payload = {
        page,
        limit: LIMIT,
        ...(searchQuery.trim() && { searchQuery: searchQuery.trim() }),
      };

      const res = await axios.post(url, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setData(res.data.data || []);
      setTotalCount(res.data.count || 0);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.currentPage || 1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to fetch deleted providers.',
      );
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [token, LIMIT]);

  // âœ… Initial fetch
  useEffect(() => {
    getData(1);
  }, [getData]);

  // âœ… Debounced search and pagination
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getData(1, search);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, getData]);

  // âœ… Pagination change handler
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    getData(page, search);
  };

  // âœ… Search handler
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // âœ… View provider details
  const handleViewPopUp = (providerData) => {
    navigate(`/view-professional-provider/${providerData._id}`);
  };

  // âœ… Delete handlers (Permanent delete)
  const handleDeleteClick = (providerData) => {
    setSelectedProvider(providerData);
    setDeleteReason('');
    setDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
    setSelectedProvider(null);
    setDeleteReason('');
  };

  // âœ… Restore handlers
  const handleRestoreClick = (providerData) => {
    setSelectedProvider(providerData);
    setRestoreDialog(true);
  };

  const handleCloseRestoreDialog = () => {
    setRestoreDialog(false);
    setSelectedProvider(null);
  };

  // âœ… Permanent delete (PUT with reason)
  const handlePermanentDelete = async () => {
    if (!selectedProvider || !deleteReason.trim()) {
      toast.error('Please provide a deletion reason');
      return;
    }

    setLoading(true);
    try {
      const url = `${URLS.Base}/v1/dhubApi/admin/professional-providers/delete-professional-provider/${selectedProvider._id}`;
      const payload = {
        reason: deleteReason.trim(),
      };

      await axios.put(url, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success('Provider permanently deleted successfully');
      getData(currentPage, search);
      handleCloseDeleteDialog();
    } catch (error) {
      const message = error.response?.data?.message || 'Permanent deletion failed';
      toast.error(message);
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  // âœ… Restore provider
  const handleRestore = async () => {
    if (!selectedProvider) return;

    setLoading(true);
    try {
      // Note: Using the same endpoint as fetch for restore - adjust if different endpoint exists
      const url = `${URLS.Base}/v1/dhubApi/admin/professional-providers/restore-professional-provider/${selectedProvider._id}`;
      
      await axios.put(url, {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success('Provider restored successfully');
      getData(currentPage, search);
      handleCloseRestoreDialog();
    } catch (error) {
      const message = error.response?.data?.message || 'Restore failed';
      toast.error(message);
      console.error('Restore error:', error);
    } finally {
      setLoading(false);
    }
  };

  // âœ… DataGrid columns
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
        field: 'providerInfo',
        headerName: 'Provider Info',
        flex: 1,
        minWidth: 250,
        renderCell: (params) => {
          const firstName = params.row.firstName?.trim() || '';
          const lastName = params.row.lastName?.trim() || '';
          const businessName = params.row.business_name || '';
          const hasName = firstName || lastName;
          const displayName = hasName
            ? `${firstName} ${lastName}`.trim()
            : businessName || 'Incomplete Profile';

          return (
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={params.row.image ? `${URLS.FileBase}${params.row.image}` : ''}
                alt={displayName}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: theme.palette.error.light,
                  opacity: 0.7,
                }}
              >
                {hasName ? firstName.charAt(0).toUpperCase() : 'D'}
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  {displayName}
                </Typography>
           
              </Box>
            </Box>
          );
        },
      },
      {
        field: 'phone',
        headerName: 'Phone',
        flex: 1,
        minWidth: 140,
        renderCell: (params) => params.row.phone || 'N/A',
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => params.row.email || 'N/A',
      },
      {
        field: 'deleteReason',
        headerName: 'Delete Reason',
        flex: 1,
        minWidth: 180,
        renderCell: (params) => (
          params.row.deleteReason ? (
            <Chip
              label={params.row.deleteReason.length > 30 
                ? `${params.row.deleteReason.substring(0, 30)}...` 
                : params.row.deleteReason}
              size="small"
              color="error"
              variant="outlined"
            />
          ) : (
            <Chip label="No Reason" size="small" color="default" variant="outlined" />
          )
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.8,
        minWidth: 120,
        renderCell: (params) => (
          <Chip 
            label="Deleted" 
            size="small" 
            color="error" 
            variant="filled"
            icon={<IconAlertCircle size={16} />}
          />
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1.2,
        minWidth: 200,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={() => handleViewPopUp(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
            >
              <IconEye size={18} />
            </Button>

            {(rolesAndPermission.professional_providers_restore === true ||
              rolesAndPermission.accessAll === true) && (
              <Button
                size="small"
                color="success"
                variant="contained"
                onClick={() => handleRestoreClick(params.row)}
                disabled={loading}
                sx={{ minWidth: '32px', padding: '4px 6px' }}
              >
                <IconRotate2 stroke={1.5} size={18} />
              </Button>
            )}

            {/* {(rolesAndPermission.professional_providers_delete === true ||
              rolesAndPermission.accessAll === true) && (
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
            )} */}
          </Box>
        ),
      },
    ],
    [loading, rolesAndPermission],
  );

  // âœ… DataGrid rows
  const rows = useMemo(
    () => data?.map((item, index) => ({ id: index, ...item })) || [],
    [data],
  );

  return (
    <PageContainer
      title="Deleted Professional Providers"
      description="Manage permanently deleted professional providers"
    >
      <Breadcrumb title="Deleted Professional Providers" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main Content */}
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
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">
              Deleted Providers 
            </Typography>
           
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name, email or phone"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 250 }, bgcolor: 'background.paper' }}
            />
          </Box>
        </Box>
        <Divider />
        <CardContent>
          {data.length === 0 && !loading ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No deleted professional providers found.
            </Alert>
          ) : (
            <>
              <Box sx={{ height: 'auto', width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={LIMIT}
                  disableRowSelectionOnClick
                  loading={loading}
                  autoHeight
                  hideFooter
                  disableColumnMenu
                />
              </Box>
         <Box
  display="flex"
  justifyContent="flex-end"
  alignItems="center"
  p={3}
  gap={2}
>
  <Typography variant="body2" color="text.secondary">
    Page {currentPage} of {totalPages}
  </Typography>

  <Stack spacing={2}>
    <CustomPagination
      count={totalPages}
      page={currentPage}
      onChange={handlePageChange}
      color="primary"
      size="small"
    />
  </Stack>
</Box>

            </>
          )}
        </CardContent>
      </Paper>

      {/* Permanent Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={handleCloseDeleteDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Professional Provider Permanently</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            This action is irreversible. The provider will be permanently deleted.
          </Alert>
          {selectedProvider && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Name:</strong> {`${selectedProvider.firstName || ''} ${selectedProvider.lastName || ''}`.trim() || selectedProvider.business_name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {selectedProvider.email || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Phone:</strong> {selectedProvider.phone || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Previous Delete Reason:</strong> {selectedProvider.deleteReason || 'N/A'}
              </Typography>
            </Box>
          )}
          <CustomFormLabel htmlFor="deleteReason">Final Deletion Reason* (Required)</CustomFormLabel>
          <CustomTextField
            id="deleteReason"
            name="deleteReason"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            placeholder="Provide reason for permanent deletion"
            multiline
            rows={3}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDeleteDialog} variant="outlined" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handlePermanentDelete}
            variant="contained"
            color="error"
            disabled={loading || !deleteReason.trim()}
          >
            {loading ? 'Deleting...' : 'Permanent Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={restoreDialog} onClose={handleCloseRestoreDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Restore Professional Provider</DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
            This will restore the provider to their previous status.
          </Alert>
          {selectedProvider && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Name:</strong> {`${selectedProvider.firstName || ''} ${selectedProvider.lastName || ''}`.trim() || selectedProvider.business_name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Previous Status:</strong> {selectedProvider.status || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Delete Reason:</strong> {selectedProvider.deleteReason || 'N/A'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseRestoreDialog} variant="outlined" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleRestore}
            variant="contained"
            color="success"
            disabled={loading}
          >
            {loading ? 'Restoring...' : 'Restore Provider'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default DeletedProfessionalProviders;

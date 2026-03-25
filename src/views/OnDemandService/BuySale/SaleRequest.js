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
import { IconCheck, IconX, IconEye, IconTrash } from '@tabler/icons-react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../../Url';
import axios from 'axios';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Sell / Buy Request' }];

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

const SaleRequest = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState({ fetch: false, submit: false });
  const [openActionModal, setOpenActionModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(''); // 'accept', 'reject', 'view'
  const [rejectForm, setRejectForm] = useState({
    reason: '',
  });
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const token = getAuthToken();

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setIsLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const res = await axios.post(
        URLS.GetAllSellRequest,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const requests = res.data.buysellproducts || [];
      setData(requests);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch Sell / Buy Requests');
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
        `${item.name || ''}`.toLowerCase().includes(search.toLowerCase()) ||
        `${item.userName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
        `${item.categoryName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
        `${item.subcategoryName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
        `${item.location || ''}`.toLowerCase().includes(search.toLowerCase()) ||
        `${item.isRequested || ''}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  // Handle action modal
  const handleOpenActionModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setRejectForm({ reason: '' });
    setOpenActionModal(true);
  };

  const handleCloseActionModal = () => {
    setOpenActionModal(false);
    setSelectedRequest(null);
    setActionType('');
    setRejectForm({ reason: '' });
  };

  const handleRejectFormChange = (e) => {
    setRejectForm({ ...rejectForm, [e.target.name]: e.target.value });
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRequest) {
      toast.error('No request selected');
      return;
    }

    if (actionType === 'reject' && !rejectForm.reason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsLoading((prev) => ({ ...prev, submit: true }));

    try {
      const requestData = {
        isRequested: actionType === 'accept' ? 'accepted' : 'rejected',
      };

      if (actionType === 'reject') {
        requestData.rejectedReason = rejectForm.reason.trim();
      }

      const response = await axios.put(
        `${URLS.UpdateSellRequest}/${selectedRequest._id}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        const actionText = actionType === 'accept' ? 'accepted' : 'rejected';
        toast.success(`Request "${selectedRequest.name}" has been ${actionText} successfully`);
        handleCloseActionModal();
        getData(); // Refresh the data
      } else {
        toast.error(response.data.message || `Failed to ${actionType} request`);
      }
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error);

      if (error.response?.status === 404) {
        toast.error('Request not found');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to update this request');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Invalid request data');
      } else {
        toast.error(error.response?.data?.message || `Failed to ${actionType} request`);
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      requested: { label: 'Pending', color: 'warning' },
      accepted: { label: 'Accepted', color: 'success' },
      rejected: { label: 'Rejected', color: 'error' },
    };

    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} size="small" color={config.color} variant="outlined" />;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    if (window.confirm('Do you really want to delete this data?')) {
      try {
        const res = await axios.delete(`${URLS.DeleteSellRequest}/${data._id}`, {
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
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'productInfo',
        headerName: 'Product Info',
        flex: 1.5,
        minWidth: 250,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={params.row.images?.[0] ? `${URLS.FileBase}${params.row.images[0]}` : ''}
              alt={params.row.name}
              sx={{ width: 50, height: 50, borderRadius: 1 }}
              variant="rounded"
            >
              {params.row.name?.charAt(0)?.toUpperCase() || 'P'}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="500" noWrap>
                {params.row.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {params.row.categoryName} â€¢ {params.row.subcategoryName}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                {formatPrice(params.row.price)}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'userInfo',
        headerName: 'User Info',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" fontWeight="500">
              {params.row.userName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.userPhone}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Typography variant="body2">{params.row.location || 'N/A'}</Typography>
        ),
      },
      {
        field: 'createdDate',
        headerName: 'Request Date',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Typography variant="body2">{formatDate(params.row.logCreatedDate)}</Typography>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => getStatusChip(params.row.isRequested),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button
              size="small"
              color="warning"
              variant="contained"
              onClick={() => handleOpenActionModal(params.row, 'view')}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              title="View Details"
            >
              <IconEye stroke={1.5} size={16} />
            </Button>

            {params.row.isRequested === 'requested' && (
              <>
                {rolesAndPermission.sale_request_edit === true ||
                rolesAndPermission.accessAll === true ? (
                  <>
                    <Button
                      size="small"
                      color="success"
                      variant="contained"
                      onClick={() => handleOpenActionModal(params.row, 'accept')}
                      disabled={isLoading.submit}
                      sx={{ minWidth: '32px', padding: '4px 6px' }}
                      title="Accept Request"
                    >
                      <IconCheck stroke={1.5} size={16} />
                    </Button>{' '}
                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      onClick={() => handleOpenActionModal(params.row, 'reject')}
                      disabled={isLoading.submit}
                      sx={{ minWidth: '32px', padding: '4px 6px' }}
                      title="Reject Request"
                    >
                      <IconX stroke={1.5} size={16} />
                    </Button>
                  </>
                ) : (
                  <></>
                )}
                {rolesAndPermission.sale_request_delete === true ||
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
              </>
            )}
          </Box>
        ),
      },
    ],
    [isLoading.submit],
  );

  const getModalTitle = () => {
    switch (actionType) {
      case 'view':
        return 'Request Details';
      case 'accept':
        return 'Accept Request';
      case 'reject':
        return 'Reject Request';
      default:
        return 'Request Action';
    }
  };

  return (
    <PageContainer
      title="Sell / Buy Request"
      description="Manage Sell / Buy Requests for your platform"
    >
      <Breadcrumb title="Sell / Buy Request" items={BCrumb} />
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
          <Typography variant="h6">Sell / Buy Requests ({data.length})</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search requests"
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

      {/* Action Modal */}
      <Dialog open={openActionModal} onClose={handleCloseActionModal} maxWidth="sm" fullWidth>
        <DialogTitle>{getModalTitle()}</DialogTitle>
        <form onSubmit={handleActionSubmit}>
          <DialogContent>
            {selectedRequest && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {/* Product Details */}
                <Grid item xs={12}>
                  <Box display="flex" gap={2} alignItems="flex-start">
                    <Avatar
                      src={
                        selectedRequest.images?.[0]
                          ? `${URLS.FileBase}${selectedRequest.images[0]}`
                          : ''
                      }
                      alt={selectedRequest.name}
                      sx={{ width: 80, height: 80, borderRadius: 1 }}
                      variant="rounded"
                    />
                    <Box flex={1}>
                      <Typography variant="h6" gutterBottom>
                        {selectedRequest.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {selectedRequest.categoryName} â€¢ {selectedRequest.subcategoryName}
                      </Typography>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {formatPrice(selectedRequest.price)}
                      </Typography>
                      {getStatusChip(selectedRequest.isRequested)}
                    </Box>
                  </Box>
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Description:</strong> {selectedRequest.description}
                  </Typography>
                </Grid>

                {/* User Info */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Posted by:</strong> {selectedRequest.userName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {selectedRequest.userPhone}
                  </Typography>
                </Grid>

                {/* Location */}
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Location:</strong> {selectedRequest.location}
                  </Typography>
                </Grid>

                {/* Dates */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Request Date:</strong> {formatDate(selectedRequest.logCreatedDate)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Last Updated:</strong> {formatDate(selectedRequest.logModifiedDate)}
                  </Typography>
                </Grid>

                {/* Rejection Reason (if rejected) */}
                {selectedRequest.rejectedReason && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="500" color="error.main">
                        Rejection Reason:
                      </Typography>
                      <Typography variant="body2" color="error.main">
                        {selectedRequest.rejectedReason}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Rejection Reason Input */}
                {actionType === 'reject' && (
                  <Grid item xs={12}>
                    <CustomFormLabel htmlFor="reason">Reason for Rejection*</CustomFormLabel>
                    <CustomTextField
                      id="reason"
                      name="reason"
                      value={rejectForm.reason}
                      onChange={handleRejectFormChange}
                      placeholder="Please provide a detailed reason for rejecting this request..."
                      multiline
                      rows={3}
                      fullWidth
                      required
                    />
                  </Grid>
                )}

                {/* Confirmation Message */}
                {actionType === 'accept' && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="body2" color="success.main">
                        Are you sure you want to accept this request? This will approve the product
                        listing.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseActionModal} variant="outlined" disabled={isLoading.submit}>
              {actionType === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {(actionType === 'accept' || actionType === 'reject') && (
              <Button
                type="submit"
                variant="contained"
                color={actionType === 'accept' ? 'success' : 'error'}
                disabled={
                  isLoading.submit || (actionType === 'reject' && !rejectForm.reason.trim())
                }
                startIcon={isLoading.submit ? <CircularProgress size={16} /> : null}
              >
                {isLoading.submit
                  ? 'Processing...'
                  : actionType === 'accept'
                  ? 'Accept Request'
                  : 'Reject Request'}
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default SaleRequest;

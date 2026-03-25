import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconAnalyze, IconEye, IconCheck, IconX } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, styled, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Select,
  MenuItem,
  TextField,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  CardContent,
} from '@mui/material';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Payout Requests' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Request status options
const REQUEST_STATUS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
  { value: 'processing', label: 'Processing', color: 'info' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'default' },
];

// Request type options
const REQUEST_TYPES = [
  { value: 'store_payout', label: 'Store Payout' },
  { value: 'driver_payout', label: 'Driver Payout' },
  { value: 'provider_payout', label: 'Provider Payout' },
  { value: 'wallet_withdrawal', label: 'Wallet Withdrawal' },
  { value: 'commission_payout', label: 'Commission Payout' },
  { value: 'bonus_payout', label: 'Bonus Payout' },
  { value: 'refund_payout', label: 'Refund Payout' },
  { value: 'other', label: 'Other' },
];

// Priority levels
const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'default' },
  { value: 'medium', label: 'Medium', color: 'info' },
  { value: 'high', label: 'High', color: 'warning' },
  { value: 'urgent', label: 'Urgent', color: 'error' },
];

// Payment methods for payouts
const PAYOUT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'upi', label: 'UPI' },
  { value: 'digital_wallet', label: 'Digital Wallet' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'card_payment', label: 'Card Payment' },
  { value: 'cash', label: 'Cash' },
];



// Main PayoutsRequest Component
const PayoutsRequest = () => {
  const theme = useTheme();
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [userTypes, setUserTypes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [requestTypeFilter, setRequestTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const getToken = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  }, []);

  const token = useMemo(() => getToken(), [getToken]);

  const handleEditPopUp = useCallback((data) => {
    setShowEditForm(true);
    setEditData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowEditForm(false);
    setEditData(null);
  }, []);

  const getData = useCallback(async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        URLS.GetPayoutRequests || '/api/payout-requests',
        { headers: { Authorization: `Bearer ${token}` } },
      );
      
      // Handle different response structures
      const requests = res.data?.data || res.data?.payoutRequests || res.data?.requests || res.data || [];
      setData(Array.isArray(requests) ? requests : []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch payout requests.';
      toast.error(errorMessage);
      console.error('Failed to fetch payout requests:', error);
      setData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleSubmit = useCallback(async (formData, id) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let res;
      
      if (id) {
        res = await axios.put(`${URLS.EditPayoutRequest || '/api/payout-requests'}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddPayoutRequest || '/api/payout-requests', formData, config);
      }
      
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message || `Request ${id ? 'updated' : 'submitted'} successfully`);
        handleCloseForm();
        getData();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [token, handleCloseForm, getData]);

  const handleApprove = useCallback(async (requestData) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm('Do you want to approve this payout request?')) {
      setLoading(true);
      try {
        const res = await axios.put(
          `${URLS.ApprovePayoutRequest || '/api/payout-requests/approve'}/${requestData._id}`,
          { status: 'approved' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 200) {
          toast.success(res.data.message || 'Request approved successfully');
          getData();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  }, [token, getData]);

  const handleReject = useCallback(async (requestData) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    const rejectionReason = window.prompt('Please provide a reason for rejection:');
    if (rejectionReason) {
      setLoading(true);
      try {
        const res = await axios.put(
          `${URLS.RejectPayoutRequest || '/api/payout-requests/reject'}/${requestData._id}`,
          { status: 'rejected', rejectionReason },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 200) {
          toast.success(res.data.message || 'Request rejected successfully');
          getData();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  }, [token, getData]);

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleStatusFilter = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  const handleRequestTypeFilter = useCallback((e) => {
    setRequestTypeFilter(e.target.value);
  }, []);

  const handlePriorityFilter = useCallback((e) => {
    setPriorityFilter(e.target.value);
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }
      setLoading(true);
      try {
        // Try to fetch users/requesters data
        try {
          const userRes = await axios.get(
            URLS.GetUsers || '/api/users',
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const users = userRes.data?.data || userRes.data?.users || userRes.data || [];
          setUserTypes(Array.isArray(users) ? users : []);
        } catch (userError) {
          console.warn('Failed to fetch users:', userError);
          setUserTypes([]); // Continue without users
        }
        
        await getData();
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token, getData]);

  // Filter data based on search, status, request type, and priority
  const filteredData = useMemo(() => {
    let filtered = data;

    // Filter by search term
    if (search) {
      filtered = filtered.filter((item) =>
        (item.requesterName || item.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.requesterEmail || item.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.reason || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.bankAccount || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.upiId || '').toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Filter by request type
    if (requestTypeFilter) {
      filtered = filtered.filter((item) => item.requestType === requestTypeFilter);
    }

    // Filter by priority
    if (priorityFilter) {
      filtered = filtered.filter((item) => item.priority === priorityFilter);
    }

    return filtered;
  }, [data, search, statusFilter, requestTypeFilter, priorityFilter]);

  const getStatusChip = useCallback((status) => {
    const statusConfig = REQUEST_STATUS.find(s => s.value === status) || REQUEST_STATUS[0];
    return (
      <Chip
        label={statusConfig.label}
        color={statusConfig.color}
        size="small"
        variant="filled"
      />
    );
  }, []);

  const getPriorityChip = useCallback((priority) => {
    const priorityConfig = PRIORITY_LEVELS.find(p => p.value === priority);
    return (
      <Chip
        label={priorityConfig?.label || priority || 'Medium'}
        color={priorityConfig?.color || 'default'}
        size="small"
        variant="outlined"
      />
    );
  }, []);

  const getRequestTypeChip = useCallback((requestType) => {
    const typeConfig = REQUEST_TYPES.find(t => t.value === requestType);
    return (
      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
        {typeConfig?.label || requestType || 'Unknown'}
      </Typography>
    );
  }, []);

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
        field: 'requesterName',
        headerName: 'Requester',
        flex: 1,
        minWidth: 160,
        valueGetter: (params) => params.row.requesterName || params.row.name || 'N/A',
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.requesterEmail || params.row.email || 'No email'}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'amount',
        headerName: 'Amount',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="medium" color="primary">
            ₹{parseFloat(params.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Typography>
        ),
      },
      {
        field: 'requestType',
        headerName: 'Request Type',
        flex: 1,
        minWidth: 140,
        renderCell: (params) => getRequestTypeChip(params.value),
      },
      {
        field: 'priority',
        headerName: 'Priority',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => getPriorityChip(params.value),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => getStatusChip(params.value),
      },
      {
        field: 'payoutMethod',
        headerName: 'Payout Method',
        flex: 1,
        minWidth: 130,
        renderCell: (params) => {
          const method = PAYOUT_METHODS.find(m => m.value === params.value);
          return (
            <Typography variant="body2">
              {method?.label || params.value || 'N/A'}
            </Typography>
          );
        },
      },
      
      {
        field: 'logCreatedDate',
        headerName: 'Request Date',
        flex: 1,
        minWidth: 130,
        valueGetter: (params) => params.row.logCreatedDate || params.row.createdAt || params.row.created_date,
        renderCell: (params) => (
          <Typography variant="body2">
            {params.value ? new Date(params.value).toLocaleDateString('en-IN') : 'N/A'}
          </Typography>
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        minWidth: 180,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            <Button
              size="small"
              color="info"
              variant="outlined"
              onClick={() => console.log('View details:', params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`View request details`}
            >
              <IconEye stroke={1.5} size={16} />
            </Button>
            {params.row.status === 'pending' && (
              <>
                <Button
                  size="small"
                  color="success"
                  variant="contained"
                  onClick={() => handleApprove(params.row)}
                  disabled={loading}
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  aria-label={`Approve request`}
                >
                  <IconCheck stroke={1.5} size={16} />
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleReject(params.row)}
                  disabled={loading}
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  aria-label={`Reject request`}
                >
                  <IconX stroke={1.5} size={16} />
                </Button>
              </>
            )}
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleEditPopUp(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Edit request`}
            >
              <IconAnalyze stroke={1.5} size={16} />
            </Button>
          </Box>
        ),
      },
    ],
    [loading, handleEditPopUp, handleApprove, handleReject, getStatusChip, getPriorityChip, getRequestTypeChip],
  );

  const rows = useMemo(
    () =>
      filteredData?.map((item, index) => ({
        id: item._id || item.id || index,
        ...item,
      })) || [],
    [filteredData],
  );

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalRequests = filteredData.length;
    const pendingRequests = filteredData.filter(item => item.status === 'pending').length;
    const approvedRequests = filteredData.filter(item => item.status === 'approved').length;
    const totalAmount = filteredData
      .filter(item => item.status === 'pending' || item.status === 'approved')
      .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    return { totalRequests, pendingRequests, approvedRequests, totalAmount };
  }, [filteredData]);

  return (
    <PageContainer
      title="Payout Requests"
      description="Manage Payout Requests for your platform"
    >
      <Breadcrumb title="Payout Requests" items={BCrumb} />
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
          <Typography variant="h6">Payout Requests List</Typography>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <Select
              size="small"
              value={priorityFilter}
              onChange={handlePriorityFilter}
              displayEmpty
              sx={{ minWidth: 120 }}
              aria-label="Filter by priority"
            >
              <MenuItem value="">All Priority</MenuItem>
              {PRIORITY_LEVELS.map((priority) => (
                <MenuItem key={priority.value} value={priority.value}>
                  {priority.label}
                </MenuItem>
              ))}
            </Select>
            <Select
              size="small"
              value={requestTypeFilter}
              onChange={handleRequestTypeFilter}
              displayEmpty
              sx={{ minWidth: 140 }}
              aria-label="Filter by request type"
            >
              <MenuItem value="">All Types</MenuItem>
              {REQUEST_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            <Select
              size="small"
              value={statusFilter}
              onChange={handleStatusFilter}
              displayEmpty
              sx={{ minWidth: 120 }}
              aria-label="Filter by status"
            >
              <MenuItem value="">All Status</MenuItem>
              {REQUEST_STATUS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              placeholder="Search by name, reason, account"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 200, sm: 250 }, bgcolor: 'white' }}
              aria-label="Search Payout Requests"
            />
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 20, 50]}
              disableRowSelectionOnClick
              autoHeight
              sx={{
                '& .MuiDataGrid-root': {
                  border: 'none',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.grey[50],
                  borderBottom: `2px solid ${theme.palette.divider}`,
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default PayoutsRequest;

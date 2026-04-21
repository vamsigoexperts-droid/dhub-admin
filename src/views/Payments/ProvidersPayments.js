import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconAnalyze, IconTrash, IconEye } from '@tabler/icons-react';
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
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Provider Payments' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Payment status options
const PAYMENT_STATUS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'failed', label: 'Failed', color: 'error' },
  { value: 'cancelled', label: 'Cancelled', color: 'default' },
  { value: 'processing', label: 'Processing', color: 'info' },
  { value: 'on_hold', label: 'On Hold', color: 'secondary' },
];

// Payment method options
const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card Payment' },
  { value: 'wallet', label: 'Digital Wallet' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'wire_transfer', label: 'Wire Transfer' },
  { value: 'paypal', label: 'PayPal' },
];

// Payment type options for providers
const PAYMENT_TYPES = [
  { value: 'service_commission', label: 'Service Commission' },
  { value: 'platform_fee', label: 'Platform Fee' },
  { value: 'subscription_fee', label: 'Subscription Fee' },
  { value: 'setup_fee', label: 'Setup Fee' },
  { value: 'maintenance_fee', label: 'Maintenance Fee' },
  { value: 'penalty', label: 'Penalty' },
  { value: 'refund', label: 'Refund' },
  { value: 'bonus', label: 'Bonus Payment' },
  { value: 'adjustment', label: 'Adjustment' },
  { value: 'other', label: 'Other' },
];

// Main ProvidersPayments Component
const ProvidersPayments = () => {
  const theme = useTheme();
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [providerTypes, setProviderTypes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('');

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

  const handleAddPayment = useCallback(() => {
    setShowEditForm(true);
    setEditData(null);
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
      const res = await axios.get(URLS.GetProviderPayments || '/api/provider-payments', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle different response structures
      const payments =
        res.data?.data || res.data?.providerpayments || res.data?.payments || res.data || [];
      setData(Array.isArray(payments) ? payments : []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch provider payments.';
      toast.error(errorMessage);
      console.error('Failed to fetch provider payments:', error);
      setData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleSubmit = useCallback(
    async (formData, id) => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        let res;

        if (id) {
          res = await axios.put(
            `${URLS.EditProviderPayments || '/api/provider-payments'}/${id}`,
            formData,
            config,
          );
        } else {
          res = await axios.post(
            URLS.AddProviderPayments || '/api/provider-payments',
            formData,
            config,
          );
        }

        if (res.status === 200 || res.status === 201) {
          toast.success(res.data.message || `Payment ${id ? 'updated' : 'added'} successfully`);
          handleCloseForm();
          getData();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [token, handleCloseForm, getData],
  );

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleStatusFilter = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  const handlePaymentTypeFilter = useCallback((e) => {
    setPaymentTypeFilter(e.target.value);
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
        // Try to fetch providers data
        try {
          const providerRes = await axios.get(
            URLS.GetProviders || URLS.GetStore || '/api/providers',
            { headers: { Authorization: `Bearer ${token}` } },
          );
          const providers =
            providerRes.data?.data ||
            providerRes.data?.providers ||
            providerRes.data?.store ||
            providerRes.data ||
            [];
          setProviderTypes(Array.isArray(providers) ? providers : []);
        } catch (providerError) {
          console.warn('Failed to fetch providers:', providerError);
          setProviderTypes([]); // Continue without providers
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

  // Filter data based on search, status, and payment type
  const filteredData = useMemo(() => {
    let filtered = data;

    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (item) =>
          (item.providerName || item.name || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.providerEmail || item.email || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.invoiceNumber || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.transactionId || '').toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Filter by payment type
    if (paymentTypeFilter) {
      filtered = filtered.filter((item) => item.paymentType === paymentTypeFilter);
    }

    return filtered;
  }, [data, search, statusFilter, paymentTypeFilter]);

  const getStatusChip = useCallback((status) => {
    const statusConfig = PAYMENT_STATUS.find((s) => s.value === status) || PAYMENT_STATUS[0];
    return (
      <Chip label={statusConfig.label} color={statusConfig.color} size="small" variant="filled" />
    );
  }, []);

  const getPaymentTypeChip = useCallback((paymentType) => {
    const typeConfig = PAYMENT_TYPES.find((t) => t.value === paymentType);
    const colors = {
      service_commission: 'primary',
      platform_fee: 'secondary',
      subscription_fee: 'info',
      setup_fee: 'success',
      maintenance_fee: 'warning',
      penalty: 'error',
      refund: 'default',
      bonus: 'success',
      adjustment: 'warning',
      other: 'default',
    };

    return (
      <Chip
        label={typeConfig?.label || paymentType || 'Unknown'}
        color={colors[paymentType] || 'default'}
        size="small"
        variant="outlined"
      />
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
        field: 'providerName',
        headerName: 'Provider Name',
        flex: 1,
        valueGetter: (params) => params.row.providerName || params.row.name || 'N/A',
      },
      {
        field: 'providerEmail',
        headerName: 'Email',
        flex: 1,

        valueGetter: (params) => params.row.providerEmail || params.row.email || 'N/A',
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={params.value || 'No email'}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'amount',
        headerName: 'Amount',
        flex: 1,

        renderCell: (params) => (
          <Typography variant="body2" fontWeight="medium" color="primary">
            ₹{parseFloat(params.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </Typography>
        ),
      },
      {
        field: 'paymentType',
        headerName: 'Payment Type',
        flex: 1,

        renderCell: (params) => getPaymentTypeChip(params.value),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,

        renderCell: (params) => getStatusChip(params.value),
      },
      {
        field: 'dueDate',
        headerName: 'Due Date',
        flex: 1,
        renderCell: (params) => {
          if (!params.value) return <Typography variant="body2">N/A</Typography>;
          const dueDate = new Date(params.value);
          const today = new Date();
          const isOverdue = dueDate < today && params.row.status !== 'completed';
          return (
            <Typography
              variant="body2"
              color={isOverdue ? 'error' : 'inherit'}
              fontWeight={isOverdue ? 'bold' : 'normal'}
            >
              {dueDate.toLocaleDateString('en-IN')}
            </Typography>
          );
        },
      },
      {
        field: 'logCreatedDate',
        headerName: 'Created Date',
        flex: 1,
        valueGetter: (params) =>
          params.row.logCreatedDate || params.row.createdAt || params.row.created_date,
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
              aria-label={`View ${params.row.providerName || 'provider'} payment details`}
            >
              <IconEye stroke={1.5} size={16} />
            </Button>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleEditPopUp(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Edit ${params.row.providerName || 'provider'} payment`}
            >
              <IconAnalyze stroke={1.5} size={16} />
            </Button>
          </Box>
        ),
      },
    ],
    [loading, handleEditPopUp, , getStatusChip, getPaymentTypeChip],
  );

  const rows = useMemo(
    () =>
      filteredData?.map((item, index) => ({
        id: item._id || item.id || index,
        ...item,
      })) || [],
    [filteredData],
  );

  return (
    <PageContainer
      title="Provider Payments"
      description="Manage Provider Payments for your service platform"
    >
      <Breadcrumb title="Provider Payments" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper
        variant="outlined"
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={2}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <Typography variant="h6">Provider Payments List</Typography>
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            flexWrap="wrap"
            sx={{
              width: { xs: '100%', sm: 'auto' },
              '& > *': {
                flex: { xs: '1 1 100%', sm: '0 1 auto' },
                minWidth: { xs: '100%', sm: '130px' },
              },
            }}
          >
            <Select
              size="small"
              value={paymentTypeFilter}
              onChange={handlePaymentTypeFilter}
              displayEmpty
              sx={{ minWidth: 140 }}
              aria-label="Filter by payment type"
            >
              <MenuItem value="">All Types</MenuItem>
              {PAYMENT_TYPES.map((type) => (
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
              {PAYMENT_STATUS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              placeholder="Search by name, email, invoice"
              value={search}
              onChange={handleSearch}
              sx={{
                minWidth: { xs: '100%', sm: 250 },
                bgcolor: 'background.paper',
                flex: { xs: '1 1 100%', sm: '0 1 auto' },
              }}
              aria-label="Search Provider Payments"
            />
          </Box>
        </Box>
        <Divider />
        <CardContent sx={{ p: 0, width: '100%', overflow: 'auto' }}>
          <Box
            sx={{
              width: '100%',
              minWidth: 'fit-content',
              '& .MuiDataGrid-root': {
                border: 'none',
                minWidth: '100%',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.grey[50],
                borderBottom: `2px solid ${theme.palette.divider}`,
              },
            }}
          >
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
                width: '100%',
                '& .MuiDataGrid-virtualScroller': {
                  minWidth: '100%',
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default ProvidersPayments;


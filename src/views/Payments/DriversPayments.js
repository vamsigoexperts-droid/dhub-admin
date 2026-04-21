import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconAnalyze } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
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
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Driver Payments' }];

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
];

// Payment method options
const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card Payment' },
  { value: 'wallet', label: 'Digital Wallet' },
  { value: 'cash', label: 'Cash' },
  { value: 'cheque', label: 'Cheque' },
];

// Payment type options
const PAYMENT_TYPES = [
  { value: 'delivery_fee', label: 'Delivery Fee' },
  { value: 'incentive', label: 'Incentive Payment' },
  { value: 'bonus', label: 'Bonus Payment' },
  { value: 'penalty', label: 'Penalty Adjustment' },
  { value: 'fuel_allowance', label: 'Fuel Allowance' },
  { value: 'other', label: 'Other' },
];

// Main DriversPayments Component
const DriversPayments = () => {
  const theme = useTheme();
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [driverTypes, setDriverTypes] = useState([]);
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

  const handleCloseForm = useCallback(() => {
    setEditData(null);
  }, []);

  const getData = useCallback(async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetDriverPayments,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.driverpayments || []);
    } catch (error) {
      toast.error('Failed to fetch driver payments.');
      console.error('Failed to fetch driver payments:', error);
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
        const url = id ? `${URLS.EditDriverPayments}/${id}` : URLS.AddDriverPayments;
        const method = id ? 'put' : 'post';

        const res = await axios[method](url, formData, config);

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
        const [driverRes] = await Promise.all([
          axios.post(URLS.GetDriver, {}, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setDriverTypes(driverRes.data.drivers || []);
        await getData();
      } catch (error) {
        toast.error('Failed to fetch data.');
        console.error('Failed to fetch data:', error);
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
          item.driverName?.toLowerCase().includes(search.toLowerCase()) ||
          item.driverEmail?.toLowerCase().includes(search.toLowerCase()) ||
          item.driverPhone?.toLowerCase().includes(search.toLowerCase()) ||
          item.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
          item.paymentMethod?.toLowerCase().includes(search.toLowerCase()),
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
      delivery_fee: 'primary',
      incentive: 'success',
      bonus: 'info',
      penalty: 'error',
      fuel_allowance: 'warning',
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
        field: 'driverName',
        headerName: 'Driver Name',
        flex: 1,
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
        field: 'paymentType',
        headerName: 'Payment Type',
        flex: 1,
        renderCell: (params) => getPaymentTypeChip(params.value),
      },
      {
        field: 'paymentMethod',
        headerName: 'Payment Method',
        flex: 1,
        renderCell: (params) => {
          const method = PAYMENT_METHODS.find((m) => m.value === params.value);
          return <Typography variant="body2">{method?.label || params.value || 'N/A'}</Typography>;
        },
      },
      {
        field: 'transactionId',
        headerName: 'Transaction ID',
        flex: 1,
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={params.value || 'No transaction ID'}
          >
            {params.value || 'N/A'}
          </Typography>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => getStatusChip(params.value),
      },
      {
        field: 'logCreatedDate',
        headerName: 'Date',
        flex: 1,
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
              color="primary"
              variant="contained"
              onClick={() => handleEditPopUp(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Edit ${params.row.driverName || 'driver'} payment`}
            >
              <IconAnalyze stroke={1.5} size={16} />
            </Button>
          </Box>
        ),
      },
    ],
    [loading, getStatusChip, getPaymentTypeChip],
  );

  const rows = useMemo(
    () =>
      filteredData?.map((item, index) => ({
        id: index,
        ...item,
      })) || [],
    [filteredData],
  );

  return (
    <PageContainer
      title="Driver Payments"
      description="Manage Driver Payments for your delivery platform"
    >
      <Breadcrumb title="Driver Payments" items={BCrumb} />
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
          <Typography variant="h6">Driver Payments List</Typography>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <Select
              size="small"
              value={paymentTypeFilter}
              onChange={handlePaymentTypeFilter}
              displayEmpty
              sx={{ minWidth: 130 }}
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
              placeholder="Search by name, phone, transaction"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 200, sm: 250 }, bgcolor: 'background.paper' }}
              aria-label="Search Driver Payments"
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

export default DriversPayments;


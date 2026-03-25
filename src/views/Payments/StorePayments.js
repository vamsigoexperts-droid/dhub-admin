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
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Store Payments' }];

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
];

// Payment method options
const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card Payment' },
  { value: 'wallet', label: 'Digital Wallet' },
  { value: 'cash', label: 'Cash' },
];

// Edit Store Payment Form Component
const EditStorePaymentForm = ({ onClose, onSubmit, initialData, storeTypes }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    storeId: initialData?.storeId || '',
    amount: initialData?.amount || '',
    paymentMethod: initialData?.paymentMethod || '',
    transactionId: initialData?.transactionId || '',
    status: initialData?.status || 'pending',
    note: initialData?.note || '',
  });

  const handleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // Validation
      if (!form.storeId) {
        toast.error('Store Name is required.');
        return;
      }
      if (!form.amount || parseFloat(form.amount) <= 0) {
        toast.error('Valid amount is required.');
        return;
      }
      if (!form.paymentMethod) {
        toast.error('Payment Method is required.');
        return;
      }

      onSubmit(form, initialData?._id);
    },
    [form, initialData?._id, onSubmit],
  );

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title={initialData ? 'Edit Store Payment' : 'Add Store Payment'}
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="storeId" required>
                Store Name
              </CustomFormLabel>
              <CustomSelect
                aria-label="Select Store Name"
                onChange={handleChange}
                value={form.storeId}
                variant="outlined"
                name="storeId"
                id="storeId"
                required
                fullWidth
              >
                {storeTypes.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="amount" required>
                Amount
              </CustomFormLabel>
              <CustomTextField
                id="amount"
                type="number"
                variant="outlined"
                fullWidth
                placeholder="Enter Amount"
                name="amount"
                value={form.amount}
                required
                onChange={handleChange}
                aria-label="Enter Amount"
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="paymentMethod" required>
                Payment Method
              </CustomFormLabel>
              <CustomSelect
                aria-label="Select Payment Method"
                onChange={handleChange}
                value={form.paymentMethod}
                variant="outlined"
                name="paymentMethod"
                id="paymentMethod"
                required
                fullWidth
              >
                {PAYMENT_METHODS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="transactionId">Transaction ID</CustomFormLabel>
              <CustomTextField
                id="transactionId"
                variant="outlined"
                fullWidth
                placeholder="Enter Transaction ID"
                name="transactionId"
                value={form.transactionId}
                onChange={handleChange}
                aria-label="Enter Transaction ID"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="status" required>
                Payment Status
              </CustomFormLabel>
              <CustomSelect
                aria-label="Select Payment Status"
                onChange={handleChange}
                value={form.status}
                variant="outlined"
                name="status"
                id="status"
                required
                fullWidth
              >
                {PAYMENT_STATUS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Empty grid for alignment */}
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="note">Note</CustomFormLabel>
              <CustomTextField
                onChange={handleChange}
                aria-label="Enter Note"
                value={form.note}
                name="note"
                fullWidth
                id="note"
                multiline
                rows={3}
                placeholder="Enter additional notes (optional)"
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box
            display="flex"
            justifyContent="flex-end"
            gap={1}
            sx={{
              position: 'sticky',
              bottom: 0,
              bgcolor: theme.palette.background.paper,
              p: 2,
              zIndex: 1,
            }}
          >
            <Button color="error" variant="outlined" onClick={onClose} aria-label="Close form">
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              aria-label={initialData ? 'Update Store Payment' : 'Add Store Payment'}
            >
              {initialData ? 'Update' : 'Add'} Payment
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main StorePayments Component
const StorePayments = () => {
  const theme = useTheme();
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [storeTypes, setStoreTypes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

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
      const res = await axios.post(
        URLS.GetStorePayments,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.storepayments || []);
    } catch (error) {
      toast.error('Failed to fetch store payments.');
      console.error('Failed to fetch store payments:', error);
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
        const url = id ? `${URLS.EditStorePayments}/${id}` : URLS.AddStorePayments;
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

  const handleDelete = useCallback(
    async (paymentData) => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }

      if (window.confirm('Do you really want to delete this store payment?')) {
        setLoading(true);
        try {
          const res = await axios.delete(`${URLS.DeleteStorePayments}/${paymentData._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.status === 200) {
            toast.success(res.data.message || 'Payment deleted successfully');
            getData();
          }
        } catch (error) {
          const message = error.response?.data?.message || 'An error occurred';
          toast.error(message);
        } finally {
          setLoading(false);
        }
      }
    },
    [token, getData],
  );

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleStatusFilter = useCallback((e) => {
    setStatusFilter(e.target.value);
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
        const [storeRes] = await Promise.all([
          axios.post(URLS.GetStore, {}, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setStoreTypes(storeRes.data.store || []);
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

  // Filter data based on search and status
  const filteredData = useMemo(() => {
    let filtered = data;

    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.storeName?.toLowerCase().includes(search.toLowerCase()) ||
          item.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
          item.paymentMethod?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    return filtered;
  }, [data, search, statusFilter]);

  const getStatusChip = useCallback((status) => {
    const statusConfig = PAYMENT_STATUS.find((s) => s.value === status) || PAYMENT_STATUS[0];
    return (
      <Chip label={statusConfig.label} color={statusConfig.color} size="small" variant="filled" />
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
        field: 'storeName',
        headerName: 'Store Name',
        flex: 1,
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
        field: 'note',
        headerName: 'Note',
        flex: 1,
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={params.value || 'No note'}
          >
            {params.value || 'No note'}
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
              aria-label={`View ${params.row.storeName || 'store'} payment details`}
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
              aria-label={`Edit ${params.row.storeName || 'store'} payment`}
            >
              <IconAnalyze stroke={1.5} size={16} />
            </Button>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => handleDelete(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Delete ${params.row.storeName || 'store'} payment`}
            >
              <IconTrash stroke={1.5} size={16} />
            </Button>
          </Box>
        ),
      },
    ],
    [loading, handleEditPopUp, handleDelete, getStatusChip],
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
      title="Store Payments"
      description="Manage Store Payments for your e-commerce platform"
    >
      <Breadcrumb title="Store Payments" items={BCrumb} />
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
          <Typography variant="h6">Store Payments List</Typography>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
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
              placeholder="Search by store, transaction, method"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 200, sm: 250 }, bgcolor: 'white' }}
              aria-label="Search Store Payments"
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

export default StorePayments;

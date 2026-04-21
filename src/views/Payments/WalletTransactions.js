import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconAnalyze, IconRefresh } from '@tabler/icons-react';
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
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Wallet Transactions' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Transaction status options
const TRANSACTION_STATUS = [
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'failed', label: 'Failed', color: 'error' },
  { value: 'cancelled', label: 'Cancelled', color: 'default' },
  { value: 'processing', label: 'Processing', color: 'info' },
  { value: 'reversed', label: 'Reversed', color: 'secondary' },
];

// Transaction type options
const TRANSACTION_TYPES = [
  { value: 'credit', label: 'Credit', color: 'success' },
  { value: 'debit', label: 'Debit', color: 'error' },
  { value: 'transfer', label: 'Transfer', color: 'primary' },
  { value: 'refund', label: 'Refund', color: 'info' },
  { value: 'cashback', label: 'Cashback', color: 'success' },
  { value: 'reward', label: 'Reward', color: 'secondary' },
];

// Transaction category options
const TRANSACTION_CATEGORIES = [
  { value: 'order_payment', label: 'Order Payment' },
  { value: 'wallet_topup', label: 'Wallet Top-up' },
  { value: 'refund_credit', label: 'Refund Credit' },
  { value: 'cashback_reward', label: 'Cashback Reward' },
  { value: 'referral_bonus', label: 'Referral Bonus' },
  { value: 'penalty_deduction', label: 'Penalty Deduction' },
  { value: 'withdrawal', label: 'Withdrawal' },
  { value: 'transfer_in', label: 'Transfer In' },
  { value: 'transfer_out', label: 'Transfer Out' },
  { value: 'adjustment', label: 'Manual Adjustment' },
  { value: 'other', label: 'Other' },
];

// Transaction source options
const TRANSACTION_SOURCES = [
  { value: 'app', label: 'Mobile App' },
  { value: 'web', label: 'Website' },
  { value: 'admin', label: 'Admin Panel' },
  { value: 'api', label: 'API' },
  { value: 'system', label: 'System Auto' },
];

// Main WalletTransactions Component
const WalletTransactions = () => {
  const theme = useTheme();
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [userTypes, setUserTypes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

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
      const res = await axios.get(URLS.GetWalletTransactions || '/api/wallet-transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle different response structures
      const transactions =
        res.data?.data || res.data?.transactions || res.data?.wallettransactions || res.data || [];
      setData(Array.isArray(transactions) ? transactions : []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch wallet transactions.';
      toast.error(errorMessage);
      console.error('Failed to fetch wallet transactions:', error);
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
            `${URLS.EditWalletTransaction || '/api/wallet-transactions'}/${id}`,
            formData,
            config,
          );
        } else {
          res = await axios.post(
            URLS.AddWalletTransaction || '/api/wallet-transactions',
            formData,
            config,
          );
        }

        if (res.status === 200 || res.status === 201) {
          toast.success(res.data.message || `Transaction ${id ? 'updated' : 'added'} successfully`);
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

  const handleTransactionTypeFilter = useCallback((e) => {
    setTransactionTypeFilter(e.target.value);
  }, []);

  const handleCategoryFilter = useCallback((e) => {
    setCategoryFilter(e.target.value);
  }, []);

  const handleRefreshData = useCallback(() => {
    getData();
    toast.info('Data refreshed successfully');
  }, [getData]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }
      setLoading(true);
      try {
        // Try to fetch users data
        try {
          const userRes = await axios.get(URLS.GetUsers || '/api/users', {
            headers: { Authorization: `Bearer ${token}` },
          });
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

  // Filter data based on search, status, transaction type, and category
  const filteredData = useMemo(() => {
    let filtered = data;

    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (item) =>
          (item.userName || item.name || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.userEmail || item.email || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.referenceId || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.orderId || '').toLowerCase().includes(search.toLowerCase()) ||
          (item.description || '').toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Filter by transaction type
    if (transactionTypeFilter) {
      filtered = filtered.filter((item) => item.transactionType === transactionTypeFilter);
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    return filtered;
  }, [data, search, statusFilter, transactionTypeFilter, categoryFilter]);

  const getStatusChip = useCallback((status) => {
    const statusConfig =
      TRANSACTION_STATUS.find((s) => s.value === status) || TRANSACTION_STATUS[0];
    return (
      <Chip label={statusConfig.label} color={statusConfig.color} size="small" variant="filled" />
    );
  }, []);

  const getTransactionTypeChip = useCallback((transactionType) => {
    const typeConfig = TRANSACTION_TYPES.find((t) => t.value === transactionType);
    return (
      <Chip
        label={typeConfig?.label || transactionType || 'Unknown'}
        color={typeConfig?.color || 'default'}
        size="small"
        variant="outlined"
      />
    );
  }, []);

  const getCategoryChip = useCallback((category) => {
    const categoryConfig = TRANSACTION_CATEGORIES.find((c) => c.value === category);
    return (
      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
        {categoryConfig?.label || category || 'Unknown'}
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
        field: 'userName',
        headerName: 'User',
        flex: 1,
        valueGetter: (params) => params.row.userName || params.row.name || 'N/A',
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.userEmail || params.row.email || 'No email'}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'amount',
        headerName: 'Amount',
        flex: 1,
        renderCell: (params) => {
          const isCredit = params.row.transactionType === 'credit';
          return (
            <Typography
              variant="body2"
              fontWeight="medium"
              color={isCredit ? 'success.main' : 'error.main'}
            >
              {isCredit ? '+' : '-'}₹
              {parseFloat(params.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Typography>
          );
        },
      },
      {
        field: 'transactionType',
        headerName: 'Type',
        flex: 1,
        renderCell: (params) => getTransactionTypeChip(params.value),
      },
      {
        field: 'category',
        headerName: 'Category',
        flex: 1,
        renderCell: (params) => getCategoryChip(params.value),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,

        renderCell: (params) => getStatusChip(params.value),
      },
      {
        field: 'referenceId',
        headerName: 'Reference ID',
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
            title={params.value || 'No reference ID'}
          >
            {params.value || 'N/A'}
          </Typography>
        ),
      },
      {
        field: 'source',
        headerName: 'Source',
        flex: 1,
        renderCell: (params) => {
          const sourceConfig = TRANSACTION_SOURCES.find((s) => s.value === params.value);
          return (
            <Typography variant="body2">{sourceConfig?.label || params.value || 'N/A'}</Typography>
          );
        },
      },
      {
        field: 'logCreatedDate',
        headerName: 'Date',
        flex: 1,
        valueGetter: (params) =>
          params.row.logCreatedDate || params.row.createdAt || params.row.created_date,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2">
              {params.value ? new Date(params.value).toLocaleDateString('en-IN') : 'N/A'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.value
                ? new Date(params.value).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </Typography>
          </Box>
        ),
      },
      // {
      //   field: 'description',
      //   headerName: 'Description',
      //   flex: 1,
      //   minWidth: 180,
      //   renderCell: (params) => (
      //     <Typography
      //       variant="body2"
      //       sx={{
      //         overflow: 'hidden',
      //         textOverflow: 'ellipsis',
      //         whiteSpace: 'nowrap',
      //       }}
      //       title={params.value || 'No description'}
      //     >
      //       {params.value || 'No description'}
      //     </Typography>
      //   ),
      // },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        minWidth: 140,
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
              aria-label={`Edit transaction`}
            >
              <IconAnalyze stroke={1.5} size={16} />
            </Button>
          </Box>
        ),
      },
    ],
    [loading, handleEditPopUp, getStatusChip, getTransactionTypeChip, getCategoryChip],
  );

  const rows = useMemo(
    () =>
      filteredData?.map((item, index) => ({
        id: item._id || item.id || index,
        ...item,
      })) || [],
    [filteredData],
  );

  // Calculate totals
  const totals = useMemo(() => {
    const totalCredit = filteredData
      .filter((item) => item.transactionType === 'credit' && item.status === 'completed')
      .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    const totalDebit = filteredData
      .filter((item) => item.transactionType === 'debit' && item.status === 'completed')
      .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    return { totalCredit, totalDebit, netAmount: totalCredit - totalDebit };
  }, [filteredData]);

  return (
    <PageContainer
      title="Wallet Transactions"
      description="Manage Wallet Transactions for your platform"
    >
      <Breadcrumb title="Wallet Transactions" items={BCrumb} />
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
          <Typography variant="h6">Wallet Transactions List</Typography>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <Select
              size="small"
              value={categoryFilter}
              onChange={handleCategoryFilter}
              displayEmpty
              sx={{ minWidth: 140 }}
              aria-label="Filter by category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {TRANSACTION_CATEGORIES.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
            <Select
              size="small"
              value={transactionTypeFilter}
              onChange={handleTransactionTypeFilter}
              displayEmpty
              sx={{ minWidth: 120 }}
              aria-label="Filter by transaction type"
            >
              <MenuItem value="">All Types</MenuItem>
              {TRANSACTION_TYPES.map((type) => (
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
              {TRANSACTION_STATUS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              placeholder="Search by user, reference, order"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 200, sm: 250 }, bgcolor: 'background.paper' }}
              aria-label="Search Wallet Transactions"
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleRefreshData}
              disabled={loading}
              startIcon={<IconRefresh />}
              aria-label="Refresh data"
            >
              Refresh
            </Button>
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
                  paginationModel: { pageSize: 15 },
                },
              }}
              pageSizeOptions={[10, 15, 25, 50]}
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

export default WalletTransactions;


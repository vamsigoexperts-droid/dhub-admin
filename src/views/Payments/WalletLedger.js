import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import { URLS } from '../../Url';
import { formatCurrency, formatDateTime, getAuthHeaders } from './financeUtils';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Wallet' }];

const WalletLedger = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [event, setEvent] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchLedger = async () => {
      setLoading(true);
      try {
        const response = await axios.get(URLS.GetFinanceWalletLedger, {
          headers: getAuthHeaders(),
          params: {
            searchQuery: search,
            role,
            event,
            status,
            page: 1,
            limit: 200,
          },
        });
        setRows(response.data?.data || []);
        setSummary(response.data?.summary || null);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load wallet ledger');
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [event, role, search, status]);

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        minWidth: 170,
        renderCell: (params) => formatDateTime(params.value),
      },
      {
        field: 'ownerName',
        headerName: 'Wallet Owner',
        minWidth: 200,
        flex: 1,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {params.row.ownerName || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.ownerEmail || params.row.ownerPhone || params.row.wallet?.walletId}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'walletRole',
        headerName: 'Role',
        minWidth: 110,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.row.wallet?.userRole || 'N/A'}
            sx={{ textTransform: 'capitalize' }}
          />
        ),
      },
      {
        field: 'event',
        headerName: 'Event',
        minWidth: 170,
      },
      {
        field: 'transactionType',
        headerName: 'Type',
        minWidth: 110,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value}
            color={params.value === 'credit' ? 'success' : 'error'}
            variant="outlined"
          />
        ),
      },
      {
        field: 'amount',
        headerName: 'Amount',
        minWidth: 140,
        renderCell: (params) => (
          <Typography
            variant="body2"
            fontWeight={700}
            color={params.row.transactionType === 'credit' ? 'success.main' : 'error.main'}
          >
            {formatCurrency(params.value)}
          </Typography>
        ),
      },
      {
        field: 'balanceBefore',
        headerName: 'Before',
        minWidth: 130,
        renderCell: (params) => formatCurrency(params.value),
      },
      {
        field: 'balanceAfter',
        headerName: 'After',
        minWidth: 130,
        renderCell: (params) => formatCurrency(params.value),
      },
      {
        field: 'status',
        headerName: 'Status',
        minWidth: 120,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value}
            color={
              params.value === 'success'
                ? 'success'
                : params.value === 'pending'
                  ? 'warning'
                  : 'error'
            }
          />
        ),
      },
      {
        field: 'referenceId',
        headerName: 'Reference',
        minWidth: 180,
        flex: 1,
      },
      {
        field: 'remark',
        headerName: 'Remark',
        minWidth: 220,
        flex: 1,
      },
    ],
    [],
  );

  return (
    <PageContainer title="Wallet" description="Unified wallet transaction ledger">
      <Breadcrumb title="Wallet" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box p={3}>
          <Typography variant="h5" fontWeight={700}>
            Wallet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Credits, debits, top-ups, quotation payments, subscriptions, and wallet withdrawals.
          </Typography>
          {summary ? (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 2 }}>
              <Typography variant="body2">
                Total transactions: <strong>{summary.totalTransactions}</strong>
              </Typography>
              <Typography variant="body2">
                Credits: <strong>{formatCurrency(summary.totalCredits)}</strong>
              </Typography>
              <Typography variant="body2">
                Debits: <strong>{formatCurrency(summary.totalDebits)}</strong>
              </Typography>
            </Stack>
          ) : null}
        </Box>
        <Divider />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ p: 2, alignItems: { md: 'center' } }}
        >
          <TextField
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by owner, reference, remark"
            sx={{ minWidth: 300, bgcolor: 'white' }}
          />
          <Select size="small" value={role} onChange={(e) => setRole(e.target.value)} displayEmpty>
            <MenuItem value="">All roles</MenuItem>
            <MenuItem value="user">Customer</MenuItem>
            <MenuItem value="provider">Provider</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
          <Select size="small" value={event} onChange={(e) => setEvent(e.target.value)} displayEmpty>
            <MenuItem value="">All events</MenuItem>
            <MenuItem value="wallet_topup">Wallet Top-up</MenuItem>
            <MenuItem value="wallet_withdrawal">Wallet Withdrawal</MenuItem>
            <MenuItem value="order_payment">Order Payment</MenuItem>
            <MenuItem value="quotation_payment">Quotation Payment</MenuItem>
            <MenuItem value="subscription_purchase">Subscription Purchase</MenuItem>
            <MenuItem value="refund">Refund</MenuItem>
          </Select>
          <Select size="small" value={status} onChange={(e) => setStatus(e.target.value)} displayEmpty>
            <MenuItem value="">All states</MenuItem>
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="reversed">Reversed</MenuItem>
          </Select>
        </Stack>
        <Box sx={{ width: '100%', p: 2 }}>
          <DataGrid
            autoHeight
            disableRowSelectionOnClick
            rows={rows}
            getRowId={(row) =>
              row.id ||
              row._id ||
              `${row.wallet?._id || row.wallet?.walletId || 'wallet'}-${row.referenceId || row.createdAt || Math.random()}`
            }
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
          />
        </Box>
      </Paper>
    </PageContainer>
  );
};

export default WalletLedger;

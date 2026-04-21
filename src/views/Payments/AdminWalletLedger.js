import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
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

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Admin Wallet' }];

const TYPE_OPTIONS = [
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
  { value: 'deduct', label: 'Deduct' },
];

const getTypeLabel = (value) => {
  const normalized = String(value || '').toLowerCase();
  if (!normalized) return 'unknown';
  const matched = TYPE_OPTIONS.find((item) => item.value === normalized);
  return matched?.label || normalized;
};

const getPartyLabel = (row) => {
  const source = String(row?.source || '').toLowerCase();
  const metadata = row?.metadata || {};
  const customerName = metadata.customerName || metadata.customerEmail || metadata.customerPhone || '';
  const customerContact = metadata.customerPhone || metadata.customerEmail || 'No contact';

  if (source === 'booking_platform_fee' || source === 'service_cart_booking') {
    return {
      name: customerName || 'Customer Booking',
      role: row?.walletOwnerRole || 'Customer',
      contact: customerContact,
    };
  }

  if (row?.providerId) {
    return {
      name: row.providerName || 'Partner',
      role: row.walletOwnerRole || 'Partner',
      contact: row.providerContact || 'No contact',
    };
  }

  if (source.startsWith('manual_')) {
    return { name: 'Admin Adjustment', role: 'Admin', contact: 'Internal adjustment' };
  }

  return {
    name: row?.providerName || 'Admin Wallet',
    role: row?.walletOwnerRole || 'Admin',
    contact: row?.providerContact || 'No contact',
  };
};

const AdminWalletLedger = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [walletSummary, setWalletSummary] = useState(null);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchLedger = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(URLS.GetAdminWalletLedger, {
        headers: getAuthHeaders(),
        params: {
          searchQuery: search,
          type,
          page: 1,
          limit: 200,
        },
      });

      setRows(response.data?.data || []);
      setSummary(response.data?.summary || null);
      setWalletSummary(response.data?.walletSummary || null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load admin wallet ledger');
    } finally {
      setLoading(false);
    }
  }, [search, type]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

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
        field: 'providerName',
        headerName: 'Party',
        width: 250,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {(() => {
              const party = getPartyLabel(params.row);
              return (
                <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" fontWeight={700}>
                {party.name}
              </Typography>
              <Chip
                size="small"
                label={party.role}
                sx={{ height: 20, fontSize: '0.7rem' }}
                variant="outlined"
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
                  {party.contact || params.row.source || 'No contact'}
            </Typography>
                </>
              );
            })()}
          </Box>
        ),
      },
      {
        field: 'transactionType',
        headerName: 'Type',
        width: 120,
        renderCell: (params) => (
          <Chip
            size="small"
            label={getTypeLabel(params.row.transactionType || params.row.type)}
            color={(params.row.transactionType || params.row.type) === 'credit' ? 'success' : 'error'}
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
            color={(params.row.transactionType || params.row.type) === 'credit' ? 'success.main' : 'error.main'}
          >
            {formatCurrency(params.value)}
          </Typography>
        ),
      },
      {
        field: 'balanceBefore',
        headerName: 'Before',
        minWidth: 140,
        renderCell: (params) => formatCurrency(params.value),
      },
      {
        field: 'balanceAfter',
        headerName: 'After',
        minWidth: 140,
        renderCell: (params) => formatCurrency(params.value),
      },
      {
        field: 'orderId',
        headerName: 'Order / Booking',
        minWidth: 160,
        renderCell: (params) => params.value || params.row.bookingId || '-',
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 110,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button size="small" variant="outlined" onClick={() => setSelectedRow(params.row)}>
            View
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <PageContainer title="Admin Wallet" description="Platform wallet credits and debits">
      <Breadcrumb title="Admin Wallet" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box p={2.5}>
          <Typography variant="h5" fontWeight={700}>
            Admin Wallet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Credits and debits recorded against the platform wallet.
          </Typography>
          {summary ? (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 1.25, flexWrap: 'wrap' }}>
              <Typography variant="body2">
                Total transactions: <strong>{summary.totalTransactions || 0}</strong>
              </Typography>
              <Typography variant="body2">
                Total income: <strong>{formatCurrency(summary.totalIncome || 0)}</strong>
              </Typography>
              <Typography variant="body2">
                Total expense: <strong>{formatCurrency(summary.totalExpense || 0)}</strong>
              </Typography>
              <Typography variant="body2">
                Net balance: <strong>{formatCurrency(summary.netBalance || 0)}</strong>
              </Typography>
            </Stack>
          ) : null}
        </Box>

        <Divider />

        <Box sx={{ p: 1.5 }}>
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={12}>
              <Card variant="outlined" sx={{ height: '100%', borderColor: '#9bd3cb' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Available in Admin Wallet
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                    {formatCurrency(walletSummary?.currentBalance ?? summary?.netBalance ?? 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {walletSummary?.walletId ? `Wallet Ref: ${walletSummary.walletId}` : 'Platform wallet balance'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{ px: 1.5, pb: 1.5, pt: 0.5, alignItems: { md: 'center' } }}
        >
          <TextField
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search provider or order"
            sx={{ minWidth: 280, bgcolor: 'background.paper' }}
          />
          <Select size="small" value={type} onChange={(e) => setType(e.target.value)} displayEmpty>
            <MenuItem value="">All types</MenuItem>
            {TYPE_OPTIONS.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
          <Button variant="outlined" onClick={fetchLedger}>
            Refresh
          </Button>
        </Stack>

        <Box sx={{ width: '100%', px: 1.5, pb: 1.5 }}>
          {rows.length === 0 && !loading ? (
            <Alert severity="info">No admin wallet transactions found.</Alert>
          ) : (
            <DataGrid
              autoHeight
              disableRowSelectionOnClick
              rows={rows}
              getRowId={(row) => row.id || row._id || `${row.createdAt || Math.random()}`}
              columns={columns}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 20, 50]}
            />
          )}
        </Box>
      </Paper>

      <Dialog open={Boolean(selectedRow)} onClose={() => setSelectedRow(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Admin Wallet Transaction</DialogTitle>
        <DialogContent dividers>
          {selectedRow ? (
            <Stack spacing={1.5}>
              <Typography variant="body2">
                <strong>Party:</strong> {getPartyLabel(selectedRow).name || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Contact:</strong> {getPartyLabel(selectedRow).contact || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {getTypeLabel(selectedRow.transactionType || selectedRow.type)}
              </Typography>
              <Typography variant="body2">
                <strong>Amount:</strong> {formatCurrency(selectedRow.amount)}
              </Typography>
              <Typography variant="body2">
                <strong>Balance Before:</strong> {formatCurrency(selectedRow.balanceBefore)}
              </Typography>
              <Typography variant="body2">
                <strong>Balance After:</strong> {formatCurrency(selectedRow.balanceAfter)}
              </Typography>
              <Typography variant="body2">
                <strong>Order / Booking:</strong> {selectedRow.orderId || selectedRow.bookingId || '-'}
              </Typography>
              <Typography variant="body2">
                <strong>Created:</strong> {formatDateTime(selectedRow.createdAt)}
              </Typography>
              <Box>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                  Metadata
                </Typography>
                <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#fafafa' }}>
                  <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', m: 0 }}>
                    {JSON.stringify(selectedRow.metadata || {}, null, 2)}
                  </Typography>
                </Paper>
              </Box>
            </Stack>
          ) : null}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default AdminWalletLedger;


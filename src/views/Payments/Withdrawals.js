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

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Withdrawals' }];

const Withdrawals = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState('');
  const [sourceRole, setSourceRole] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchWithdrawals = async () => {
      setLoading(true);
      try {
        const response = await axios.get(URLS.GetFinanceWithdrawals, {
          headers: getAuthHeaders(),
          params: {
            searchQuery: search,
            sourceRole,
            status,
            page: 1,
            limit: 200,
          },
        });
        setRows(response.data?.data || []);
        setSummary(response.data?.summary || null);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load withdrawals');
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, [search, sourceRole, status]);

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
        headerName: 'Requested',
        minWidth: 170,
        renderCell: (params) => formatDateTime(params.value),
      },
      {
        field: 'beneficiaryName',
        headerName: 'Beneficiary',
        minWidth: 220,
        flex: 1,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {params.row.beneficiaryName || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.beneficiaryEmail || params.row.beneficiaryPhone || 'No contact'}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'sourceRole',
        headerName: 'Queue',
        minWidth: 120,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value === 'provider' ? 'Provider' : 'Customer'}
            color={params.value === 'provider' ? 'primary' : 'secondary'}
            variant="outlined"
          />
        ),
      },
      {
        field: 'walletId',
        headerName: 'Wallet Ref',
        minWidth: 150,
      },
      {
        field: 'amount',
        headerName: 'Amount',
        minWidth: 140,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={700}>
            {formatCurrency(params.value)}
          </Typography>
        ),
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
              params.value === 'success' || params.value === 'added'
                ? 'success'
                : params.value === 'pending' || params.value === 'withdrawn'
                  ? 'warning'
                  : 'default'
            }
          />
        ),
      },
      {
        field: 'accountLabel',
        headerName: 'Payout Detail',
        minWidth: 220,
        flex: 1,
      },
      {
        field: 'referenceId',
        headerName: 'Reference',
        minWidth: 170,
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
    <PageContainer title="Withdrawals" description="Customer and provider withdrawal tracking">
      <Breadcrumb title="Withdrawals" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box p={3}>
          <Typography variant="h5" fontWeight={700}>
            Withdrawals
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Combined view of customer wallet withdrawals and provider payout requests.
          </Typography>
          {summary ? (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 2 }}>
              <Typography variant="body2">
                Total amount: <strong>{formatCurrency(summary.totalAmount)}</strong>
              </Typography>
              <Typography variant="body2">
                Pending queue: <strong>{summary.pendingCount}</strong>
              </Typography>
              <Typography variant="body2">
                Provider requests: <strong>{summary.providerCount}</strong>
              </Typography>
              <Typography variant="body2">
                Customer requests: <strong>{summary.customerCount}</strong>
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
            placeholder="Search by person, account, reference"
            sx={{ minWidth: 300, bgcolor: 'white' }}
          />
          <Select
            size="small"
            value={sourceRole}
            onChange={(e) => setSourceRole(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All queues</MenuItem>
            <MenuItem value="provider">Provider</MenuItem>
            <MenuItem value="user">Customer</MenuItem>
          </Select>
          <Select size="small" value={status} onChange={(e) => setStatus(e.target.value)} displayEmpty>
            <MenuItem value="">All states</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="withdrawn">Withdrawn</MenuItem>
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="hold">Hold</MenuItem>
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
              `${row.sourceRole || 'withdrawal'}-${row.walletId || 'wallet'}-${row.referenceId || row.createdAt || Math.random()}`
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

export default Withdrawals;

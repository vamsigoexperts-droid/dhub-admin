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
import { formatDate, formatDateTime, getAuthHeaders } from './financeUtils';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Subscriptions' }];

const Subscriptions = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(URLS.GetFinanceSubscriptions, {
          headers: getAuthHeaders(),
          params: {
            searchQuery: search,
            status,
            paymentStatus,
            activeOnly: true,
            page: 1,
            limit: 200,
          },
        });
        setRows(response.data?.data || []);
        setSummary(response.data?.summary || null);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [paymentStatus, search, status]);

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
        field: 'providerName',
        headerName: 'Provider',
        minWidth: 220,
        flex: 1,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {params.row.providerName || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.providerBusinessName || params.row.providerEmail || params.row.providerPhone}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'plansName',
        headerName: 'Plan',
        minWidth: 180,
        flex: 1,
      },
      {
        field: 'serviceName',
        headerName: 'Service',
        minWidth: 170,
        flex: 1,
      },
      {
        field: 'status',
        headerName: 'Subscription',
        minWidth: 140,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value || 'unknown'}
            color={params.value === 'active' ? 'success' : 'default'}
          />
        ),
      },
      {
        field: 'payment_status',
        headerName: 'Payment',
        minWidth: 120,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value ? 'paid' : 'unpaid'}
            color={params.value ? 'success' : 'warning'}
            variant="outlined"
          />
        ),
      },
      {
        field: 'payment_gateway',
        headerName: 'Gateway',
        minWidth: 120,
      },
      {
        field: 'expire_date',
        headerName: 'Expiry',
        minWidth: 140,
        renderCell: (params) => formatDate(params.value),
      },
      {
        field: 'logCreatedDate',
        headerName: 'Created',
        minWidth: 170,
        renderCell: (params) => formatDateTime(params.value),
      },
    ],
    [],
  );

  return (
    <PageContainer title="Subscriptions" description="Subscription purchases for active service partners">
      <Breadcrumb title="Subscriptions" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box p={3}>
          <Typography variant="h5" fontWeight={700}>
            Subscriptions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Provider subscription payments and active plan coverage for active services.
          </Typography>
          {summary ? (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 2 }}>
              <Typography variant="body2">
                Total: <strong>{summary.total}</strong>
              </Typography>
              <Typography variant="body2">
                Active: <strong>{summary.active}</strong>
              </Typography>
              <Typography variant="body2">
                Paid: <strong>{summary.paid}</strong>
              </Typography>
              <Typography variant="body2">
                Unpaid: <strong>{summary.unpaid}</strong>
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
            placeholder="Search by provider, plan, service"
            sx={{ minWidth: 300, bgcolor: 'white' }}
          />
          <Select size="small" value={status} onChange={(e) => setStatus(e.target.value)} displayEmpty>
            <MenuItem value="">All subscription states</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
          <Select
            size="small"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All payment states</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="unpaid">Unpaid</MenuItem>
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
              `${row.providerEmail || row.providerPhone || 'subscription'}-${row.plansName || 'plan'}-${row.logCreatedDate || Math.random()}`
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

export default Subscriptions;

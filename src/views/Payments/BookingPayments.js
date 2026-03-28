import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Booking Payments' }];

const paymentChipColor = {
  paid: 'success',
  pending: 'warning',
  failed: 'error',
};

const statusChipColor = {
  workIsCompleted: 'success',
  payment_pending: 'warning',
  pending: 'warning',
  cancelledByUser: 'error',
  cancelledByProvider: 'error',
  quotationRejected: 'error',
};

const BookingPayments = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [flowType, setFlowType] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState(null);

  useEffect(() => {
    const fetchRows = async () => {
      setLoading(true);
      try {
        const [verifiedResponse, professionalResponse] = await Promise.all([
          axios.get(URLS.GetVerifiedPartnerOrders, {
            headers: getAuthHeaders(),
            params: { limit: 100, page: 1 },
          }),
          axios.get(URLS.GetProfessionalOrders, {
            headers: getAuthHeaders(),
            params: { limit: 100, page: 1 },
          }),
        ]);

        const verifiedRows = (verifiedResponse.data?.data || []).map((item) => ({
          id: `verified-${item._id}`,
          flowType: 'Verified Partner',
          orderId: item.orderId || item._id,
          serviceName: item.service?.serviceName || 'N/A',
          customerName: item.user?.name || 'N/A',
          providerName: item.provider?.businessName || item.provider?.name || 'Unassigned',
          amount: item.totalAmount || item.amount || 0,
          paymentStatus: item.paymentStatus || 'pending',
          paymentMethod: item.paymentMethod || 'N/A',
          bookingStatus: item.status || 'N/A',
          sourceOfLead: item.sourceOfLead || 'App',
          createdAt: item.createdAt,
        }));

        const professionalRows = (professionalResponse.data?.data || []).map((item) => ({
          id: `professional-${item._id}`,
          flowType: 'Professional',
          orderId: item.orderId || item._id,
          serviceName:
            item.provider?.providerType ||
            item.provider?.providerServiceName ||
            item.serviceName ||
            'N/A',
          customerName: item.userId?.name || item.userName || 'N/A',
          providerName:
            item.provider?.businessName || item.provider?.providerName || item.providerName || 'N/A',
          amount: item.totalAmount || item.amount || 0,
          paymentStatus: item.paymentStatus || 'pending',
          paymentMethod: item.paymentMethod || 'N/A',
          bookingStatus: item.orderStatus || 'N/A',
          sourceOfLead: item.sourceOfLead || 'App',
          createdAt: item.createdAt,
        }));

        setRows([...verifiedRows, ...professionalRows]);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load booking payments');
      } finally {
        setLoading(false);
      }
    };

    fetchRows();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const matchesSearch =
        !search ||
        [item.orderId, item.serviceName, item.customerName, item.providerName, item.sourceOfLead]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()));

      const matchesPaymentStatus = !paymentStatus || item.paymentStatus === paymentStatus;
      const matchesFlow = !flowType || item.flowType === flowType;

      return matchesSearch && matchesPaymentStatus && matchesFlow;
    });
  }, [flowType, paymentStatus, rows, search]);

  const columns = [
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
      field: 'orderId',
      headerName: 'Booking ID',
      minWidth: 170,
      flex: 1,
    },
    {
      field: 'flowType',
      headerName: 'Flow',
      minWidth: 150,
      renderCell: (params) => <Chip size="small" label={params.value} variant="outlined" />,
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      minWidth: 160,
      flex: 1,
    },
    {
      field: 'providerName',
      headerName: 'Provider',
      minWidth: 180,
      flex: 1,
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
      field: 'paymentStatus',
      headerName: 'Payment',
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value || 'pending'}
          color={paymentChipColor[params.value] || 'default'}
        />
      ),
    },
    {
      field: 'paymentMethod',
      headerName: 'Method',
      minWidth: 120,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setDetailRow(params.row);
            setDetailOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <PageContainer title="Booking Payments" description="Payment collection across active bookings">
      <Breadcrumb title="Booking Payments" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box p={3}>
          <Typography variant="h5" fontWeight={700}>
            Booking payments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unified view of verified partner and professional booking collections.
          </Typography>
        </Box>
        <Divider />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ p: 2, alignItems: { md: 'center' } }}
        >
          <TextField
            size="small"
            placeholder="Search by booking, service, customer, provider"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 320, bgcolor: 'white' }}
          />
          <Select size="small" value={flowType} onChange={(e) => setFlowType(e.target.value)} displayEmpty>
            <MenuItem value="">All flows</MenuItem>
            <MenuItem value="Verified Partner">Verified Partner</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
          </Select>
          <Select
            size="small"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All payment states</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </Stack>
        <Box sx={{ width: '100%', p: 2 }}>
          <DataGrid
            autoHeight
            disableRowSelectionOnClick
            rows={filteredRows}
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

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Booking Payment Details</DialogTitle>
        <DialogContent dividers>
          {detailRow && (
            <Stack spacing={1.2}>
              <Typography variant="body2">
                <strong>Booking ID:</strong> {detailRow.orderId || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Flow:</strong> {detailRow.flowType || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Service:</strong> {detailRow.serviceName || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Customer:</strong> {detailRow.customerName || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Provider:</strong> {detailRow.providerName || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Amount:</strong> {formatCurrency(detailRow.amount)}
              </Typography>
              <Typography variant="body2">
                <strong>Payment:</strong>{' '}
                <Chip
                  size="small"
                  label={detailRow.paymentStatus || 'pending'}
                  color={paymentChipColor[detailRow.paymentStatus] || 'default'}
                />
              </Typography>
              <Typography variant="body2">
                <strong>Method:</strong> {detailRow.paymentMethod || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Booking Status:</strong>{' '}
                <Chip
                  size="small"
                  label={detailRow.bookingStatus || 'N/A'}
                  color={statusChipColor[detailRow.bookingStatus] || 'default'}
                  variant="outlined"
                />
              </Typography>
              <Typography variant="body2">
                <strong>Source:</strong> {detailRow.sourceOfLead || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Created:</strong> {formatDateTime(detailRow.createdAt)}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default BookingPayments;

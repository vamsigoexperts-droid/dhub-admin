import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Withdrawals' }];

const mapLegacyStatus = (status) => {
  const raw = String(status || '').toLowerCase();
  if (raw === 'withdrawn') return 'pending';
  return raw || 'pending';
};

const defaultManualForm = {
  sourceRole: 'provider',
  identifier: '',
  adjustmentType: 'credit',
  amount: '',
  remark: '',
};

const Withdrawals = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState('');
  const [sourceRole, setSourceRole] = useState('');
  const [status, setStatus] = useState('pending');
  const [actionLoadingId, setActionLoadingId] = useState('');
  const [manualOpen, setManualOpen] = useState(false);
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualForm, setManualForm] = useState(defaultManualForm);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState(null);

  const fetchWithdrawals = useCallback(async () => {
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
      const isFinanceRouteMissing = error?.response?.status === 404;
      if (!isFinanceRouteMissing) {
        toast.error(error.response?.data?.message || 'Failed to load withdrawals');
      }

      if (isFinanceRouteMissing) {
        try {
          const legacyRes = await axios.post(
            URLS.GetLegacyProviderWithdrawals,
            {},
            {
              headers: getAuthHeaders(),
              params: {
                searchQuery: search,
              },
            },
          );

          const legacyRows = (legacyRes?.data?.walletWithdraws || []).map((item) => ({
            _id: item?._id,
            createdAt: item?.logCreatedDate || item?.createdAt || '',
            beneficiaryName:
              `${item?.providerfirstName || ''} ${item?.providerLastName || ''}`.trim() || 'Unknown',
            beneficiaryEmail: item?.providerEmail || '',
            beneficiaryPhone: item?.providerPhone || '',
            sourceRole: 'provider',
            recordType: item?.source === 'wallet_transaction' ? 'wallet_transaction' : 'legacy_provider_wallet',
            walletId: item?.generateId || item?.providerId || '-',
            amount: Number(item?.amount || 0),
            status: mapLegacyStatus(item?.status),
            accountLabel: item?.providerPhone ? `Phone: ${item.providerPhone}` : 'Provider withdrawal request',
            referenceId: item?.tranction_id || item?._id || '-',
            remark: item?.reason || '',
          }));

          const legacySummary = legacyRows.reduce(
            (acc, row) => {
              acc.totalAmount += Number(row.amount || 0);
              acc.providerCount += 1;
              if (row.status === 'pending') acc.pendingCount += 1;
              return acc;
            },
            { totalAmount: 0, pendingCount: 0, providerCount: 0, customerCount: 0 },
          );

          setRows(legacyRows);
          setSummary(legacySummary);
        } catch (legacyError) {
          toast.error(legacyError.response?.data?.message || 'Failed to load withdrawals');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [search, sourceRole, status]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const handleWithdrawalAction = async (row, action) => {
    setActionLoadingId(row._id);
    try {
      const response = await axios.post(
        URLS.UpdateFinanceWithdrawal,
        {
          recordId: row._id,
          sourceRole: row.sourceRole,
          recordType: row.recordType,
          action,
          referenceId: row.referenceId,
        },
        {
          headers: getAuthHeaders(),
        },
      );
      toast.success(response.data?.message || `Withdrawal ${action}d successfully`);
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} withdrawal`);
    } finally {
      setActionLoadingId('');
    }
  };

  const openManualDialog = (row = null) => {
    if (row) {
      setManualForm({
        sourceRole: row.sourceRole || 'provider',
        identifier: row.beneficiaryPhone || row.walletId || '',
        adjustmentType: 'credit',
        amount: '',
        remark: '',
      });
    } else {
      setManualForm(defaultManualForm);
    }
    setManualOpen(true);
  };

  const submitManualAdjustment = async () => {
    if (!manualForm.identifier || !manualForm.amount) {
      toast.error('Identifier and amount are required');
      return;
    }

    setManualSubmitting(true);
    try {
      const response = await axios.post(URLS.FinanceWalletAdjustment, manualForm, {
        headers: getAuthHeaders(),
      });
      toast.success(response.data?.message || 'Wallet adjusted successfully');
      setManualOpen(false);
      setManualForm(defaultManualForm);
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to adjust wallet');
    } finally {
      setManualSubmitting(false);
    }
  };

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
        renderCell: (params) => {
          const statusValue = String(params.value || '').toLowerCase();
          const color =
            statusValue === 'success' || statusValue === 'completed' || statusValue === 'approved'
              ? 'success'
              : statusValue === 'pending' || statusValue === 'withdrawn'
                ? 'warning'
                : statusValue === 'failed' || statusValue === 'rejected'
                  ? 'error'
                  : 'default';

          return <Chip size="small" label={params.value} color={color} />;
        },
      },
      {
        field: 'actions',
        headerName: 'Actions',
        minWidth: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const row = params.row;
          return (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setDetailRow(row);
                  setDetailOpen(true);
                }}
              >
                View
              </Button>
            </Stack>
          );
        },
      },
    ],
    [actionLoadingId],
  );

  return (
    <PageContainer title="Withdrawals" description="Customer and provider withdrawal tracking">
      <Breadcrumb title="Withdrawals" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box p={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Withdrawals
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Combined view of customer wallet withdrawals and provider payout requests.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={fetchWithdrawals}>
                Refresh
              </Button>
              <Button variant="contained" onClick={() => openManualDialog()}>
                Manual Wallet Entry
              </Button>
            </Stack>
          </Stack>
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
            <MenuItem value="success">Approved</MenuItem>
            <MenuItem value="reversed">Rejected / Reversed</MenuItem>
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

      {/* Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Withdrawal Details</DialogTitle>
        <DialogContent dividers>
          {detailRow && (
            <Stack spacing={1.2}>
              <Typography variant="body2">
                <strong>Requested:</strong> {formatDateTime(detailRow.createdAt)}
              </Typography>
              <Typography variant="body2">
                <strong>Beneficiary:</strong> {detailRow.beneficiaryName || 'Unknown'}
              </Typography>
              <Typography variant="body2">
                <strong>Email / Phone:</strong>{' '}
                {detailRow.beneficiaryEmail || detailRow.beneficiaryPhone || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Queue:</strong>{' '}
                {detailRow.sourceRole === 'provider' ? 'Provider' : 'Customer'}
              </Typography>
              <Typography variant="body2">
                <strong>Wallet Ref:</strong> {detailRow.walletId || '-'}
              </Typography>
              <Typography variant="body2">
                <strong>Amount:</strong> {formatCurrency(detailRow.amount)}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {detailRow.status}
              </Typography>
              <Typography variant="body2">
                <strong>Payout Detail:</strong> {detailRow.accountLabel || '-'}
              </Typography>
              <Typography variant="body2">
                <strong>Reference:</strong> {detailRow.referenceId || '-'}
              </Typography>
              <Typography variant="body2">
                <strong>Remark:</strong> {detailRow.remark || '-'}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          {detailRow && (() => {
            const rowStatus = String(detailRow.status || '').toLowerCase();
            const isPending = rowStatus === 'pending' || rowStatus === 'withdrawn';
            return (
              <>
                <Button
                  size="small"
                  onClick={() => {
                    openManualDialog(detailRow);
                  }}
                >
                  Adjust
                </Button>
                <Box sx={{ flex: 1 }} />
                <Button onClick={() => setDetailOpen(false)}>Close</Button>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={!isPending || actionLoadingId === detailRow._id}
                  onClick={() => handleWithdrawalAction(detailRow, 'reject')}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  disabled={!isPending || actionLoadingId === detailRow._id}
                  onClick={() => handleWithdrawalAction(detailRow, 'approve')}
                >
                  Approve
                </Button>
              </>
            );
          })()}
        </DialogActions>
      </Dialog>

      <Dialog open={manualOpen} onClose={() => !manualSubmitting && setManualOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Manual Wallet Adjustment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Select
              value={manualForm.sourceRole}
              onChange={(e) => setManualForm((prev) => ({ ...prev, sourceRole: e.target.value }))}
            >
              <MenuItem value="provider">Provider</MenuItem>
              <MenuItem value="user">Customer</MenuItem>
            </Select>
            <TextField
              label="Wallet Ref / Phone / Email"
              value={manualForm.identifier}
              onChange={(e) => setManualForm((prev) => ({ ...prev, identifier: e.target.value }))}
              fullWidth
            />
            <Select
              value={manualForm.adjustmentType}
              onChange={(e) => setManualForm((prev) => ({ ...prev, adjustmentType: e.target.value }))}
            >
              <MenuItem value="credit">Credit</MenuItem>
              <MenuItem value="debit">Debit</MenuItem>
            </Select>
            <TextField
              label="Amount"
              type="number"
              value={manualForm.amount}
              onChange={(e) => setManualForm((prev) => ({ ...prev, amount: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Remark"
              value={manualForm.remark}
              onChange={(e) => setManualForm((prev) => ({ ...prev, remark: e.target.value }))}
              multiline
              minRows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={manualSubmitting} onClick={() => setManualOpen(false)}>
            Cancel
          </Button>
          <Button disabled={manualSubmitting} variant="contained" onClick={submitManualAdjustment}>
            {manualSubmitting ? 'Saving...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Withdrawals;

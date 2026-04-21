import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import { URLS } from '../../Url';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Referral Tracking' }];

const ReferralTracking = () => {
  const [loading, setLoading] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [referrerRole, setReferrerRole] = useState('all');
  const [referredRole, setReferredRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [rewardCredited, setRewardCredited] = useState('all');

  const token = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch {
      return '';
    }
  })();

  const fetchReferrals = async (pageOverride = pagination.page) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.post(
        URLS.ReferralTracking,
        {
          searchQuery: search,
          referrerRole,
          referredRole,
          status,
          rewardCredited,
          page: pageOverride,
          limit: pagination.limit,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setReferrals(res.data?.data || []);
      setPagination(res.data?.pagination || pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load referrals');
      setReferrals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals(1);
  }, [referrerRole, referredRole, status, rewardCredited]);

  useEffect(() => {
    const timer = setTimeout(() => fetchReferrals(1), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const rows = useMemo(
    () =>
      referrals.map((item, index) => ({
        id: item._id,
        index: (pagination.page - 1) * pagination.limit + index + 1,
        ...item,
      })),
    [referrals, pagination],
  );

  const columns = [
    { field: 'index', headerName: 'S. No', width: 90 },
    { field: 'referrerName', headerName: 'Referrer', flex: 1.1 },
    { field: 'referrerRole', headerName: 'Program', flex: 0.8 },
    { field: 'referredName', headerName: 'Referred User', flex: 1.1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.9,
      renderCell: (params) => (
        <Chip
          size="small"
          color={params.value === 'rewardCredited' ? 'success' : params.value === 'completed' ? 'info' : 'warning'}
          label={params.value}
        />
      ),
    },
    {
      field: 'rewardAmount',
      headerName: 'Reward Amount',
      flex: 0.8,
      renderCell: (params) => `Rs ${Number(params.value || 0).toFixed(2)}`,
    },
    {
      field: 'rewardCredited',
      headerName: 'Wallet Credited',
      flex: 0.8,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
    },
    {
      field: 'firstQualifiedAt',
      headerName: 'Qualified At',
      flex: 1.1,
      renderCell: (params) => (params.value ? new Date(params.value).toLocaleString() : '-'),
    },
    {
      field: 'appliedAt',
      headerName: 'Applied At',
      flex: 1.1,
      renderCell: (params) => (params.value ? new Date(params.value).toLocaleString() : '-'),
    },
  ];

  return (
    <PageContainer title="Referral Tracking" description="Track customer and provider referrals">
      <Breadcrumb title="Referral Tracking" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2} gap={2} flexWrap="wrap">
          <Typography variant="h6">Referral History ({pagination.total || 0})</Typography>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Referrer</InputLabel>
              <Select value={referrerRole} label="Referrer" onChange={(e) => setReferrerRole(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="provider">Provider</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Referred User</InputLabel>
              <Select value={referredRole} label="Referred User" onChange={(e) => setReferredRole(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="provider">Provider</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="rewardCredited">Reward Credited</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Wallet Credit</InputLabel>
              <Select value={rewardCredited} label="Wallet Credit" onChange={(e) => setRewardCredited(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Credited</MenuItem>
                <MenuItem value="false">Not Credited</MenuItem>
              </Select>
            </FormControl>
            <CustomTextField
              size="small"
              placeholder="Search by name, code, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 220, sm: 320 }, bgcolor: 'background.paper' }}
            />
            <Button variant="contained" onClick={() => fetchReferrals(1)} disabled={loading}>
              Refresh
            </Button>
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[10, 20, 50]}
            paginationMode="server"
            rowCount={pagination.total}
            paginationModel={{ page: pagination.page - 1, pageSize: pagination.limit }}
            onPaginationModelChange={(model) => {
              const nextPage = model.page + 1;
              const nextLimit = model.pageSize;
              setPagination((prev) => ({ ...prev, page: nextPage, limit: nextLimit }));
              fetchReferrals(nextPage);
            }}
          />
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default ReferralTracking;


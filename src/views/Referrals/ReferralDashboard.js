import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { URLS } from '../../Url';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Referral Dashboard' }];

const MetricCard = ({ title, value, subtitle, color }) => (
  <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #E5EAEF' }}>
    <CardContent>
      <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h3" fontWeight={700} sx={{ color, mt: 1 }}>
        {value}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      ) : null}
    </CardContent>
  </Card>
);

const ReferralDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalReferrals: 0,
    pendingReferrals: 0,
    creditedReferrals: 0,
    conversionRate: 0,
    totalBonusPaid: 0,
    byProgram: {
      customer: { total: 0, pending: 0, credited: 0, totalRewardPaid: 0 },
      provider: { total: 0, pending: 0, credited: 0, totalRewardPaid: 0 },
    },
    topReferrers: [],
  });

  const token = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch {
      return '';
    }
  })();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) return;
      try {
        const res = await axios.get(URLS.ReferralDashboard, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data?.data || data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load referral dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const rows = (data.topReferrers || []).map((item, index) => ({
    id: `${item.referrerRole}-${item.referrerId || index}`,
    index: index + 1,
    ...item,
  }));

  const columns = [
    { field: 'index', headerName: 'Rank', width: 90 },
    { field: 'referrerName', headerName: 'Referrer Name', flex: 1.2 },
    { field: 'referrerRole', headerName: 'Program', flex: 0.8 },
    { field: 'referrerPhone', headerName: 'Phone', flex: 1 },
    { field: 'totalReferrals', headerName: 'Total Referrals', flex: 0.8 },
    { field: 'successfulReferrals', headerName: 'Successful', flex: 0.8 },
    {
      field: 'totalRewardPaid',
      headerName: 'Reward Paid',
      flex: 0.8,
      renderCell: (params) => `Rs ${Number(params.row.totalRewardPaid || 0).toFixed(2)}`,
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer title="Referral Dashboard" description="Refer and earn analytics">
      <Breadcrumb title="Referral Dashboard" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard title="Total Referrals" value={data.totalReferrals} color="#1565c0" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard title="Pending Referrals" value={data.pendingReferrals} color="#ed6c02" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard title="Rewards Credited" value={data.creditedReferrals} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Conversion Rate"
            value={`${data.conversionRate}%`}
            subtitle={`Bonus Paid: Rs ${Number(data.totalBonusPaid || 0).toFixed(2)}`}
            color="#7b1fa2"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={600} mb={2}>
              Customer Referral Program
            </Typography>
            <Typography variant="body1">Total: {data.byProgram.customer.total}</Typography>
            <Typography variant="body1">Pending: {data.byProgram.customer.pending}</Typography>
            <Typography variant="body1">Credited: {data.byProgram.customer.credited}</Typography>
            <Typography variant="body1">
              Reward Paid: Rs {Number(data.byProgram.customer.totalRewardPaid || 0).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={600} mb={2}>
              Provider Referral Program
            </Typography>
            <Typography variant="body1">Total: {data.byProgram.provider.total}</Typography>
            <Typography variant="body1">Pending: {data.byProgram.provider.pending}</Typography>
            <Typography variant="body1">Credited: {data.byProgram.provider.credited}</Typography>
            <Typography variant="body1">
              Reward Paid: Rs {Number(data.byProgram.provider.totalRewardPaid || 0).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={600} mb={2}>
              Top Referrers
            </Typography>
            <DataGrid
              autoHeight
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5, page: 0 },
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ReferralDashboard;

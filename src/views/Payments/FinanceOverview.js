import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { toast, ToastContainer } from 'react-toastify';
import { URLS } from '../../Url';
import { formatCurrency, getAuthHeaders } from './financeUtils';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Payments Overview' }];

const statCards = [
  { key: 'bookingCollections', label: 'Booking Collections' },
  { key: 'walletTopupAmount', label: 'Wallet Top-ups' },
  { key: 'activeSubscriptionCount', label: 'Active Subscriptions', isCount: true },
  { key: 'pendingProviderWithdrawals', label: 'Pending Provider Withdrawals', isCount: true },
];

const FinanceOverview = () => {
  const [range, setRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const response = await axios.get(URLS.GetFinanceOverview, {
          headers: getAuthHeaders(),
          params: { range, activeOnly: true },
        });
        setData(response.data?.data || null);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load payments overview');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [range]);

  const walletBalances = useMemo(() => data?.walletBalances || [], [data]);
  return (
    <PageContainer title="Payments Overview" description="Finance dashboard for active services">
      <Breadcrumb title="Payments Overview" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Finance overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Focused on the active service flows currently running in your apps.
            </Typography>
          </Box>
          <Select size="small" value={range} onChange={(e) => setRange(e.target.value)}>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </Stack>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {statCards.map((item) => (
            <Grid item xs={12} sm={6} lg={3} key={item.key}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {item.label}
                  </Typography>
                  {loading ? (
                    <Skeleton variant="text" width={120} height={42} />
                  ) : (
                    <Typography variant="h5" fontWeight={700}>
                      {item.isCount
                        ? data?.overview?.[item.key] ?? 0
                        : formatCurrency(data?.overview?.[item.key])}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} lg={7}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Collections split
                </Typography>
                {loading ? (
                  <Stack spacing={1}>
                    <Skeleton height={28} />
                    <Skeleton height={28} />
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Verified partner bookings
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {formatCurrency(data?.collections?.verifiedPartner?.totalAmount)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Paid bookings: {data?.collections?.verifiedPartner?.count || 0}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Professional bookings
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {formatCurrency(data?.collections?.professional?.totalAmount)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Paid bookings: {data?.collections?.professional?.count || 0}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Wallet balances
                </Typography>
                {loading ? (
                  <Stack spacing={1}>
                    <Skeleton height={28} />
                    <Skeleton height={28} />
                    <Skeleton height={28} />
                  </Stack>
                ) : walletBalances.length ? (
                  <Stack spacing={1.5}>
                    {walletBalances.map((item) => (
                      <Box
                        key={item._id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {item._id} wallets
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Accounts: {item.count} | Withdrawable:{' '}
                            {formatCurrency(item.withdrawableBalance)}
                          </Typography>
                        </Box>
                        <Typography variant="body1" fontWeight={700}>
                          {formatCurrency(item.totalBalance)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Alert severity="info">No wallet balances found.</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} lg={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Withdrawal queue
                </Typography>
                {loading ? (
                  <Stack spacing={1}>
                    <Skeleton height={28} />
                    <Skeleton height={28} />
                  </Stack>
                ) : (
                  <Stack spacing={1.5}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Customer withdrawals pending</Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {data?.withdrawals?.users?.pending?.count || 0}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Provider withdrawals pending</Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {(data?.withdrawals?.providers?.pending?.count || 0) +
                          (data?.withdrawals?.providers?.withdrawn?.count || 0)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Customer withdrawn amount</Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {formatCurrency(data?.withdrawals?.users?.success?.amount || 0)}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Paper>
    </PageContainer>
  );
};

export default FinanceOverview;

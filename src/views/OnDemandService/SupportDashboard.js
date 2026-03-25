import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CardContent, Divider, CircularProgress, Button } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { URLS } from '../../Url';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import {
    IconTicket,
    IconClock,
    IconCheck,
    IconFlame,
    IconArrowRight
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';


const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Support Dashboard' }];

const MetricCard = ({ title, count, icon, color, bg }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: bg || 'primary.light',
            color: color || 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}
    >
        <Box>
            <Typography variant="subtitle1" fontWeight="600" mb={1}>
                {title}
            </Typography>
            <Typography variant="h3" fontWeight="700">
                {count}
            </Typography>
        </Box>
        <Box sx={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)' }}>
            {icon}
        </Box>
    </Paper>
);

const SupportDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        inProgress: 0,
        highPriority: 0,
        todayPending: 0,
        todayResolved: 0,
        weekPending: 0,
        weekResolved: 0,
        monthPending: 0,
        monthResolved: 0,
    });
    const navigate = useNavigate();

    const getToken = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user?.token || '';
        } catch {
            return '';
        }
    };

    useEffect(() => {
        const fetchTickets = async () => {
            const token = getToken();
            if (!token) return;

            try {
                const res = await axios.post(
                    URLS.SupportTicketsSummary,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data?.data) {
                    setMetrics((prev) => ({ ...prev, ...res.data.data }));
                }
            } catch (error) {
                toast.error('Failed to load tickets');
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <PageContainer title="Support Dashboard" description="Overview of support queries">
            <Breadcrumb title="Support Dashboard" items={BCrumb} />
            <ToastContainer position="top-right" autoClose={3000} />

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="600">Overview</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<IconArrowRight />}
                    onClick={() => navigate('/ondemandservice/provider-complaints')}
                >
                    Manage Tickets
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Top Cards */}
                <Grid item xs={12} sm={6} lg={3}>
                    <MetricCard
                        title="Total Tickets"
                        count={metrics.total}
                        icon={<IconTicket size={24} />}
                        bg="#e3f2fd"
                        color="#1565c0"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <MetricCard
                        title="Pending Overall"
                        count={metrics.pending}
                        icon={<IconClock size={24} />}
                        bg="#fff3e0"
                        color="#e65100"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <MetricCard
                        title="Resolved Overall"
                        count={metrics.resolved}
                        icon={<IconCheck size={24} />}
                        bg="#e8f5e9"
                        color="#2e7d32"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <MetricCard
                        title="High / Urgent Priority"
                        count={metrics.highPriority}
                        icon={<IconFlame size={24} />}
                        bg="#ffebee"
                        color="#c62828"
                    />
                </Grid>

                {/* Time-Based Metrics */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, mt: 2, borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight="600" mb={3}>
                            Recent Activity
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <Box textAlign="center">
                                    <Typography variant="h6" color="textSecondary" mb={2}>Today</Typography>
                                    <Box display="flex" justifyContent="space-around">
                                        <Box>
                                            <Typography variant="h3" color="warning.main">{metrics.todayPending}</Typography>
                                            <Typography variant="body2" color="textSecondary">Pending</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="h3" color="success.main">{metrics.todayResolved}</Typography>
                                            <Typography variant="body2" color="textSecondary">Resolved</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Box textAlign="center">
                                    <Typography variant="h6" color="textSecondary" mb={2}>This Week</Typography>
                                    <Box display="flex" justifyContent="space-around">
                                        <Box>
                                            <Typography variant="h3" color="warning.main">{metrics.weekPending}</Typography>
                                            <Typography variant="body2" color="textSecondary">Pending</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="h3" color="success.main">{metrics.weekResolved}</Typography>
                                            <Typography variant="body2" color="textSecondary">Resolved</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Box textAlign="center">
                                    <Typography variant="h6" color="textSecondary" mb={2}>This Month</Typography>
                                    <Box display="flex" justifyContent="space-around">
                                        <Box>
                                            <Typography variant="h3" color="warning.main">{metrics.monthPending}</Typography>
                                            <Typography variant="body2" color="textSecondary">Pending</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="h3" color="success.main">{metrics.monthResolved}</Typography>
                                            <Typography variant="body2" color="textSecondary">Resolved</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default SupportDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    ButtonGroup,
    Paper,
    Chip,
    Avatar,
    Stack,
    LinearProgress,
} from '@mui/material';
import {
    IconTrendingUp,
    IconTrendingDown,
    IconUsers,
    IconClock,
    IconCheck,
    IconX,
    IconCalendar,
    IconArrowRight,
} from '@tabler/icons-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Chart from 'react-apexcharts';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import URLS from '../../URLS';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Bookings Dashboard' },
];

const BookingsDashboard = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('daily'); // daily, weekly, monthly
    const [loading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        overview: {
            totalBookings: 0,
            verifiedPartner: 0,
            professional: 0,
            todayBookings: 0,
            revenue: 0,
            growthRate: 0,
        },
        statusCounts: {
            pending: 0,
            payment_pending: 0,
            completed: 0,
            cancelled: 0,
            rescheduled: 0,
            inProgress: 0,
        },
        chartData: {
            bookingsTrend: [0, 0, 0, 0, 0, 0, 0],
            statusDistribution: [0, 0, 0, 0, 0],
            revenueData: [0, 0, 0, 0, 0, 0, 0],
        },
        topServices: [],
        recentBookings: [],
    });

    const getToken = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user)?.token || '' : '';
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const token = getToken();
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            // Fetch analytics data from the new API
            const response = await axios.get(URLS.GetBookingsAnalytics, {
                headers: { Authorization: `Bearer ${token}` },
                params: { range: timeRange },
            });

            if (response.data.success) {
                const apiChartData = response.data.data.chartData || {};

                setDashboardData({
                    overview: response.data.data.overview || {
                        totalBookings: 0,
                        verifiedPartner: 0,
                        professional: 0,
                        todayBookings: 0,
                        revenue: 0,
                        growthRate: 0
                    },
                    statusCounts: response.data.data.statusCounts || {
                        pending: 0,
                        payment_pending: 0,
                        completed: 0,
                        cancelled: 0,
                        rescheduled: 0,
                        inProgress: 0
                    },
                    chartData: {
                        bookingsTrend: Array.isArray(apiChartData.bookingsTrend)
                            ? apiChartData.bookingsTrend
                            : [0, 0, 0, 0, 0, 0, 0],
                        statusDistribution: Array.isArray(apiChartData.statusDistribution)
                            ? apiChartData.statusDistribution
                            : [0, 0, 0, 0, 0],
                        revenueData: Array.isArray(apiChartData.revenueData)
                            ? apiChartData.revenueData
                            : [0, 0, 0, 0, 0, 0, 0],
                    },
                    topServices: response.data.data.topServices || [],
                    recentBookings: [],
                });
            } else {
                toast.error('Failed to fetch analytics data');
                setDashboardData(getMockDashboardData());
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch analytics');
            // Set mock data for demonstration
            setDashboardData(getMockDashboardData());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [timeRange]);

    const calculateOverview = (allOrders, verifiedOrders, professionalOrders) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayBookings = allOrders.filter(
            (order) => new Date(order.createdAt) >= today
        ).length;

        const totalRevenue = allOrders.reduce(
            (sum, order) => sum + (order.totalAmount || order.amount || 0),
            0
        );

        return {
            totalBookings: allOrders.length,
            verifiedPartner: verifiedOrders.length,
            professional: professionalOrders.length,
            todayBookings,
            revenue: totalRevenue,
            growthRate: 12.5, // Calculate based on previous period
        };
    };

    const calculateStatusCounts = (orders) => {
        const counts = {
            pending: 0,
            payment_pending: 0,
            completed: 0,
            cancelled: 0,
            rescheduled: 0,
            inProgress: 0,
        };

        orders.forEach((order) => {
            const status = (order.status || order.orderStatus || '').toLowerCase();
            if (status.includes('payment_pending')) counts.payment_pending++;
            else if (status.includes('pending')) counts.pending++;
            else if (status.includes('complete')) counts.completed++;
            else if (status.includes('cancel')) counts.cancelled++;
            else if (status.includes('reschedule')) counts.rescheduled++;
            else if (status.includes('progress')) counts.inProgress++;
        });

        return counts;
    };

    const generateChartData = (orders, range) => {
        // Generate time-series data based on range
        // This is a simplified version - you'd calculate actual data
        return {
            bookingsTrend: [65, 59, 80, 81, 56, 55, 70],
            statusDistribution: [45, 25, 15, 10, 5],
            revenueData: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        };
    };

    const getTopServices = (orders) => {
        // Aggregate services and return top 5
        return [
            { name: 'AC Repair', count: 45, revenue: 22500 },
            { name: 'Plumbing', count: 38, revenue: 19000 },
            { name: 'Electrical', count: 32, revenue: 16000 },
            { name: 'Salon Services', count: 28, revenue: 14000 },
            { name: 'Cleaning', count: 25, revenue: 12500 },
        ];
    };

    const getMockDashboardData = () => ({
        overview: {
            totalBookings: 248,
            verifiedPartner: 142,
            professional: 106,
            todayBookings: 18,
            revenue: 124500,
            growthRate: 12.5,
        },
        statusCounts: {
            pending: 45,
            payment_pending: 12,
            completed: 156,
            cancelled: 18,
            rescheduled: 12,
            inProgress: 17,
        },
        chartData: {
            bookingsTrend: [65, 59, 80, 81, 56, 55, 70],
            statusDistribution: [45, 12, 156, 18, 12, 17],
            revenueData: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        },
        topServices: [
            { name: 'AC Repair', count: 45, revenue: 22500 },
            { name: 'Plumbing', count: 38, revenue: 19000 },
            { name: 'Electrical', count: 32, revenue: 16000 },
            { name: 'Salon Services', count: 28, revenue: 14000 },
            { name: 'Cleaning', count: 25, revenue: 12500 },
        ],
        recentBookings: [],
    });

    // Chart configurations
    const bookingsTrendOptions = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: { show: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: timeRange === 'daily'
                ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                : timeRange === 'weekly'
                    ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
                    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        colors: ['#5D87FF', '#49BEFF'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
            },
        },
        tooltip: {
            theme: 'dark',
        },
    };

    const statusDistributionOptions = {
        chart: {
            type: 'donut',
            height: 300,
        },
        labels: ['Pending', 'Booking Pending', 'Completed', 'Cancelled', 'Rescheduled', 'In Progress'],
        colors: ['#FFA726', '#1E88E5', '#66BB6A', '#EF5350', '#42A5F5', '#AB47BC'],
        legend: {
            position: 'bottom',
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val.toFixed(0)}%`,
        },
    };

    const revenueChartOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                borderRadius: 8,
                columnWidth: '50%',
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: timeRange === 'daily'
                ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                : timeRange === 'weekly'
                    ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
                    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        },
        colors: ['#13DEB9'],
        tooltip: {
            theme: 'dark',
            y: {
                formatter: (val) => `₹${val.toLocaleString()}`,
            },
        },
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    return (
        <PageContainer title="Bookings Dashboard" description="Overall bookings analytics">
            <Breadcrumb title="Bookings Dashboard" items={BCrumb} />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                }}
            >
                <Typography variant="h1" fontWeight={800} color="primary" sx={{ mb: 2 }}>
                    Coming Soon
                </Typography>
                <Typography variant="h6" color="textSecondary" textAlign="center">
                    We are working hard to bring you a comprehensive analytics dashboard. <br />
                    Stay tuned for updates!
                </Typography>
            </Box>

            {/* 
            <Box>
                ... (rest of the content commented out)
            </Box>
            */}
        </PageContainer>
    );
};

export default BookingsDashboard;

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Card } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import BookingsNav from '../components/BookingsNav';
import OrderFilters from '../components/OrderFilters';
import OrderTable from '../components/OrderTable';
import { verifiedPartnerStatuses } from '../config/statusConfig';
import URLS from '../../../URLS';

const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/bookings', title: 'Bookings' },
    { title: 'Verified Partner Orders' },
];

const AllOrders = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getInitialStatus = () => {
        const path = location.pathname;
        if (path.includes('payment-pending')) return 'payment_pending';
        if (path.includes('pending')) return 'pending';
        if (path.includes('ongoing')) return 'ongoing';
        if (path.includes('completed')) return 'completed';
        if (path.includes('cancelled')) return 'cancelled';
        if (path.includes('rescheduled')) return 'rescheduled';
        if (path.includes('missed')) return 'missed';
        return 'all';
    };

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState({
        searchTerm: '',
        status: getInitialStatus(),
        startDate: null,
        endDate: null,
        sourceOfLead: '',
        serviceId: '',
        slaOnly: false,
    });

    // Sync filter with URL changes
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            status: getInitialStatus()
        }));
        setPage(0);
    }, [location.pathname]);

    const getToken = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user)?.token || '' : '';
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = getToken();
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            const params = {
                page: page + 1,
                limit: rowsPerPage,
            };

            if (filters.status && filters.status !== 'all') {
                params.status = filters.status;
            }

            if (filters.startDate) {
                params.startDate = filters.startDate.toISOString();
            }

            if (filters.endDate) {
                params.endDate = filters.endDate.toISOString();
            }

            if (filters.sourceOfLead) {
                params.sourceOfLead = filters.sourceOfLead;
            }

            if (filters.serviceId) {
                params.serviceId = filters.serviceId;
            }

            if (filters.slaOnly) {
                params.slaOnly = true;
            }

            const response = await axios.get(URLS.GetVerifiedPartnerOrders, {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            if (response.data.success) {
                setOrders(response.data.data);
                setTotalCount(response.data.pagination.total);
            } else {
                toast.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, rowsPerPage, filters.status, filters.startDate, filters.endDate, filters.sourceOfLead, filters.serviceId, filters.slaOnly]);

    // Calculate status counts
    const [statusCounts, setStatusCounts] = useState({
        all: 0,
        pending: 0,
        payment_pending: 0,
        ongoing: 0,
        completed: 0,
        cancelled: 0,
        rescheduled: 0,
        missed: 0,
        slaCount: 0
    });

    const fetchStatusCounts = async () => {
        try {
            const token = getToken();
            if (!token) return;

            const params = {};
            if (filters.startDate) params.startDate = filters.startDate.toISOString();
            if (filters.endDate) params.endDate = filters.endDate.toISOString();
            if (filters.sourceOfLead) params.sourceOfLead = filters.sourceOfLead;
            if (filters.serviceId) params.serviceId = filters.serviceId;

            // Use the specific verified partner stats API
            const response = await axios.get(URLS.GetVerifiedPartnerStats, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });

            if (response.data.success) {
                const stats = response.data.data || {};

                // Handle different possible response structures
                let counts = {
                    all: 0,
                    pending: 0,
                    payment_pending: 0,
                    ongoing: 0,
                    completed: 0,
                    cancelled: 0,
                    rescheduled: 0,
                    missed: 0,
                    slaCount: 0
                };

                // Helper to normalize status key
                const mapStatus = (status, rawCount) => {
                    const s = (status || '').toLowerCase();
                    const count = parseInt(rawCount, 10) || 0;

                    if (s === 'all' || s === 'total') counts.all = count;
                    else if (s === 'ongoing') counts.ongoing = count;
                    else if (s === 'payment_pending' || s.includes('payment_pending')) counts.payment_pending = count;
                    else if (s.includes('pending')) counts.pending += count;
                    else if (s.includes('ongoing')) counts.ongoing += count; // extra safety
                    else if (s.includes('complet')) counts.completed += count;
                    else if (s.includes('cancel')) counts.cancelled += count;
                    else if (s.includes('reschedule')) counts.rescheduled += count;
                    else if (s.includes('missed')) counts.missed += count;
                };

                if (Array.isArray(stats)) {
                    stats.forEach(item => {
                        const status = item._id || item.status || item.orderStatus;
                        const count = item.count || item.total || 0;
                        mapStatus(status, count);
                    });
                } else {
                    Object.entries(stats).forEach(([key, value]) => {
                        mapStatus(key, value);
                    });

                    // Explicitly set ongoing if it's a top-level property as requested
                    if (stats.ongoing !== undefined) {
                        counts.ongoing = parseInt(stats.ongoing, 10) || 0;
                    }
                }

                if (stats.slaCount !== undefined) {
                    counts.slaCount = stats.slaCount;
                }

                // Ensure 'all' is accurate by aggregating if necessary
                const calculatedTotal = counts.pending + counts.payment_pending + counts.ongoing + counts.completed + counts.cancelled + counts.rescheduled + counts.missed;
                if (counts.all === 0 || calculatedTotal > counts.all) {
                    counts.all = calculatedTotal;
                }

                setStatusCounts(counts);
            }
        } catch (error) {
            console.error('Error fetching status counts:', error);
        }
    };

    useEffect(() => {
        fetchStatusCounts();
    }, [filters.startDate, filters.endDate, filters.sourceOfLead, filters.serviceId]);

    // Filter orders based on search term
    const filteredOrders = useMemo(() => {
        if (!filters.searchTerm) return orders;

        const searchLower = filters.searchTerm.toLowerCase();
        return orders.filter((order) => {
            const orderId = order._id?.toLowerCase() || '';
            const userName = order.userId?.name?.toLowerCase() || '';
            const userPhone = order.userId?.phone?.toLowerCase() || '';
            const serviceName = order.serviceId?.serviceName?.toLowerCase() || '';

            return (
                orderId.includes(searchLower) ||
                userName.includes(searchLower) ||
                userPhone.includes(searchLower) ||
                serviceName.includes(searchLower)
            );
        });
    }, [orders, filters.searchTerm]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(0); // Reset to first page when filters change
    };

    const handleViewOrder = (order) => {
        navigate(`/bookings/verified-partner/view/${order._id}`);
    };

    const handleAssignProvider = (order) => {
        // This will be implemented in the AssignProviderModal
        navigate(`/verified-partners-crm/assign-providers`, {
            state: {
                orderIds: [order._id],
                returnPath: location.pathname
            },
        });
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <PageContainer title="Verified Partner Orders" description="Manage verified partner bookings">
            <Breadcrumb title="Verified Partner Orders" items={BCrumb} />

            <Container maxWidth="xl">
                <Box sx={{ mb: 3 }}>
                    <BookingsNav statuses={verifiedPartnerStatuses} counts={statusCounts} />
                </Box>

                <OrderFilters
                    onFilterChange={handleFilterChange}
                    statuses={verifiedPartnerStatuses}
                    orderType="verified"
                    slaCount={statusCounts.slaCount}
                />

                <OrderTable
                    orders={filteredOrders}
                    loading={loading}
                    onViewOrder={handleViewOrder}
                    onAssignProvider={handleAssignProvider}
                    orderType="verified"
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalCount={totalCount}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </Container>
        </PageContainer>
    );
};

export default AllOrders;

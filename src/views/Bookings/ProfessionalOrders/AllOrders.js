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
import { professionalOrderStatuses } from '../config/statusConfig';
import URLS from '../../../URLS';

const AllOrders = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isServiceCenter = location.pathname.includes('service-center');
    const pageTitle = isServiceCenter ? 'Service Center Orders' : 'Professional Services';
    const providerTypeForApi = isServiceCenter ? 'Service Center' : 'Professional Service';

    const BCrumb = [
        { to: '/', title: 'Home' },
        { to: '/bookings', title: 'Bookings' },
        { title: pageTitle },
    ];

    const getInitialStatus = () => {
        const path = location.pathname;
        if (path.includes('payment-pending')) return 'payment_pending';
        if (path.includes('pending')) return 'pending';
        if (path.includes('in-progress')) return 'in-progress';
        if (path.includes('completed')) return 'completed';
        if (path.includes('cancelled')) return 'cancelled';
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
        serviceId: '',
        sourceOfLead: '',
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
                providerType: providerTypeForApi
            };

            if (filters.status && filters.status !== 'all') {
                params.orderStatus = filters.status;
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

            if (filters.serviceId === 'appliance_repair_dhub') {
                params.serviceType = 'dhub';
            } else if (filters.serviceId) {
                params.providerServiceId = filters.serviceId;
            }

            if (filters.slaOnly) {
                params.slaOnly = true;
            }

            const response = await axios.get(URLS.GetProfessionalOrders, {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            if (response.data.success) {
                setOrders(response.data.data);
                setTotalCount(response.data.pagination.total);
            } else {
                toast.error(`Failed to fetch ${pageTitle.toLowerCase()}`);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(error.response?.data?.message || `Failed to fetch ${pageTitle.toLowerCase()}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, rowsPerPage, filters.status, filters.startDate, filters.endDate, filters.serviceId, filters.sourceOfLead, filters.slaOnly]);

    const [statusCounts, setStatusCounts] = useState({
        all: 0,
        pending: 0,
        payment_pending: 0,
        'in-progress': 0,
        completed: 0,
        cancelled: 0,
        missed: 0,
        slaCount: 0
    });

    const fetchStatusCounts = async () => {
        try {
            const token = getToken();
            if (!token) return;

            const params = {
                providerType: providerTypeForApi
            };
            if (filters.startDate) params.startDate = filters.startDate.toISOString();
            if (filters.endDate) params.endDate = filters.endDate.toISOString();
            if (filters.sourceOfLead) params.sourceOfLead = filters.sourceOfLead;

            if (filters.serviceId === 'appliance_repair_dhub') {
                params.serviceType = 'dhub';
            } else if (filters.serviceId) {
                params.providerServiceId = filters.serviceId;
            }

            // Use the specific professional stats API
            const response = await axios.get(URLS.GetProfessionalStats, {
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
                    'in-progress': 0,
                    completed: 0,
                    cancelled: 0,
                    missed: 0
                };

                // Helper to normalize status key
                const mapStatus = (status, rawCount) => {
                    const s = (status || '').toLowerCase();
                    const count = parseInt(rawCount, 10) || 0;

                    if (s === 'all' || s === 'total') counts.all = count;
                    else if (s === 'payment_pending' || s.includes('payment_pending')) counts.payment_pending = count;
                    else if (s.includes('pending')) counts.pending += count;
                    else if (s.includes('progress') || s.includes('accepted') || s.includes('assign')) counts['in-progress'] += count;
                    else if (s.includes('complet')) counts.completed += count;
                    else if (s.includes('cancel')) counts.cancelled += count;
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
                }

                // Ensure 'all' is accurate by aggregating if necessary
                const calculatedTotal = counts.pending + counts.payment_pending + counts['in-progress'] + counts.completed + counts.cancelled + counts.missed;
                if (counts.all === 0 || calculatedTotal > counts.all) {
                    counts.all = calculatedTotal;
                }

                if (stats.slaCount !== undefined) {
                    counts.slaCount = stats.slaCount;
                }

                setStatusCounts(counts);
            }
        } catch (error) {
            console.error('Error fetching status counts:', error);
        }
    };

    useEffect(() => {
        fetchStatusCounts();
    }, [filters.startDate, filters.endDate, filters.serviceId, filters.sourceOfLead]);

    const filteredOrders = useMemo(() => {
        if (!filters.searchTerm) return orders;

        const searchLower = filters.searchTerm.toLowerCase();
        return orders.filter((order) => {
            const orderId = order._id?.toLowerCase() || '';
            const userName = order.userSnapshot?.name?.toLowerCase() || '';
            const userPhone = order.userSnapshot?.phone?.toLowerCase() || '';
            const serviceName = order.serviceSnapshot?.serviceName?.toLowerCase() || '';
            const providerName = order.providerSnapshot?.businessName?.toLowerCase() || '';

            return (
                orderId.includes(searchLower) ||
                userName.includes(searchLower) ||
                userPhone.includes(searchLower) ||
                serviceName.includes(searchLower) ||
                providerName.includes(searchLower)
            );
        });
    }, [orders, filters.searchTerm]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(0);
    };

    const handleViewOrder = (order) => {
        const viewRoute = isServiceCenter ? '/bookings/service-center/view' : '/bookings/professional/view';
        navigate(`${viewRoute}/${order._id}`);
    };

    const handleAssignProvider = (order) => {
        navigate(`/verified-partners-crm/assign-providers`, {
            state: {
                orderIds: [order.serviceBookingId || order._id],
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
        <PageContainer title={pageTitle} description={`Manage ${pageTitle.toLowerCase()}`}>
            <Breadcrumb title={pageTitle} items={BCrumb} />

            <Container maxWidth="xl">
                <Box sx={{ mb: 3 }}>
                    <BookingsNav
                        statuses={professionalOrderStatuses.map(s => ({
                            ...s,
                            route: s.route.replace('/bookings/professional', isServiceCenter ? '/bookings/service-center' : '/bookings/professional')
                        }))}
                        counts={statusCounts}
                    />
                </Box>

                <OrderFilters
                    onFilterChange={handleFilterChange}
                    statuses={professionalOrderStatuses.map(s => ({
                        ...s,
                        route: s.route.replace('/bookings/professional', isServiceCenter ? '/bookings/service-center' : '/bookings/professional')
                    }))}
                    orderType="professional"
                    providerType={providerTypeForApi}
                    slaCount={statusCounts.slaCount}
                />

                <OrderTable
                    orders={filteredOrders}
                    loading={loading}
                    onViewOrder={handleViewOrder}
                    onAssignProvider={isServiceCenter ? handleAssignProvider : undefined}
                    orderType="professional"
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

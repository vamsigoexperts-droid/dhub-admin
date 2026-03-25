import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
    { title: 'Completed Orders' },
];

const Completed = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState({
        searchTerm: '',
        status: 'completed',
        startDate: null,
        endDate: null,
    });

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
                status: 'completed',
            };

            if (filters.startDate) {
                params.startDate = filters.startDate.toISOString();
            }

            if (filters.endDate) {
                params.endDate = filters.endDate.toISOString();
            }

            const response = await axios.get(URLS.GetVerifiedPartnerOrders, {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            if (response.data.success) {
                setOrders(response.data.data);
                setTotalCount(response.data.pagination.total);
            } else {
                toast.error('Failed to fetch completed orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch completed orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, rowsPerPage, filters.startDate, filters.endDate]);

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
        setFilters({ ...newFilters, status: 'completed' });
        setPage(0);
    };

    const handleViewOrder = (order) => {
        navigate(`/bookings/verified-partner/view/${order._id}`);
    };

    const handleAssignProvider = (order) => {
        navigate(`/verified-partners-crm/assign-providers`, {
            state: { orderId: order._id },
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
        <PageContainer title="Completed Orders" description="Verified partner completed orders">
            <Breadcrumb title="Completed Orders" items={BCrumb} />

            <Container maxWidth="xl">
                <Card elevation={3} sx={{ p: 3 }}>
                    <BookingsNav statuses={verifiedPartnerStatuses} counts={{ completed: totalCount }} />

                    <OrderFilters
                        onFilterChange={handleFilterChange}
                        statuses={verifiedPartnerStatuses}
                        orderType="verified"
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
                </Card>
            </Container>
        </PageContainer>
    );
};

export default Completed;

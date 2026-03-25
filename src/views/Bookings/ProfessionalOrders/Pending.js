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
import { professionalOrderStatuses } from '../config/statusConfig';
import URLS from '../../../URLS';

const Pending = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isServiceCenter = location.pathname.includes('service-center');
    const pageTitle = isServiceCenter ? 'Service Center Orders' : 'Professional Services';
    const providerTypeForApi = isServiceCenter ? 'Service Center' : 'Professional Service';

    const BCrumb = [
        { to: '/', title: 'Home' },
        { to: '/bookings', title: 'Bookings' },
        { title: `Pending ${pageTitle}` },
    ];

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState({
        searchTerm: '',
        status: 'pending',
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
                orderStatus: 'pending',
                providerType: providerTypeForApi
            };

            if (filters.startDate) {
                params.startDate = filters.startDate.toISOString();
            }

            if (filters.endDate) {
                params.endDate = filters.endDate.toISOString();
            }

            if (filters.serviceId === 'appliance_repair_dhub') {
                params.serviceType = 'dhub';
            } else if (filters.serviceId) {
                params.providerServiceId = filters.serviceId;
            }

            const response = await axios.get(URLS.GetProfessionalOrders, {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            if (response.data.success) {
                setOrders(response.data.data);
                setTotalCount(response.data.pagination.total);
            } else {
                toast.error(`Failed to fetch pending ${pageTitle.toLowerCase()}`);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error(error.response?.data?.message || `Failed to fetch pending ${pageTitle.toLowerCase()}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, rowsPerPage, filters.startDate, filters.endDate, filters.serviceId]);

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
        setFilters({ ...newFilters, status: 'pending' });
        setPage(0);
    };

    const handleViewOrder = (order) => {
        const basePath = isServiceCenter ? '/bookings/service-center' : '/bookings/professional';
        navigate(`${basePath}/view/${order._id}`);
    };

    const handleAssignProvider = (order) => {
        navigate('/verified-partners-crm/assign-providers', {
            state: {
                orderIds: [order.serviceBookingId || order._id],
                addressDetails: order.addressDetails || order.address, // prioritizing addressDetails if available
                location: order.location || (order.address ? `${order.address.area}, ${order.address.city}` : ''),
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
        <PageContainer title={`Pending ${pageTitle}`} description={`Pending ${pageTitle.toLowerCase()}`}>
            <Breadcrumb title={`Pending ${pageTitle}`} items={BCrumb} />

            <Container maxWidth="xl">
                <Card elevation={3} sx={{ p: 3 }}>
                    <BookingsNav
                        statuses={professionalOrderStatuses.map(s => ({
                            ...s,
                            route: s.route.replace('/bookings/professional', isServiceCenter ? '/bookings/service-center' : '/bookings/professional')
                        }))}
                        counts={{ pending: totalCount }}
                    />

                    <OrderFilters
                        onFilterChange={handleFilterChange}
                        statuses={professionalOrderStatuses.map(s => ({
                            ...s,
                            route: s.route.replace('/bookings/professional', isServiceCenter ? '/bookings/service-center' : '/bookings/professional')
                        }))}
                        orderType="professional"
                        providerType={providerTypeForApi}
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
                </Card>
            </Container>
        </PageContainer>
    );
};

export default Pending;

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
    Container,
    TablePagination,
} from '@mui/material';
import { IconEye, IconTrash, IconCheck, IconX, IconUserPlus, IconBrandWhatsapp } from '@tabler/icons-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { URLS } from 'src/Url';
import BookingsNav from '../components/BookingsNav';
import OrderFilters from '../components/OrderFilters';
import { crmWebsiteStatuses } from '../config/statusConfig';
import StatusBadge from '../components/StatusBadge';

const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/bookings/dashboard', title: 'Bookings' },
    { title: 'Website Bookings' },
];

const CRMWebsiteBookings = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getInitialStatus = () => {
        const path = location.pathname;
        const status = path.split('/').pop();
        return crmWebsiteStatuses.some(s => s.key === status) ? status : 'all';
    };

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        searchTerm: '',
        status: getInitialStatus(),
        startDate: null,
        endDate: null,
    });

    // Assignment - navigate to provider selection page

    // Sync status from URL
    useEffect(() => {
        setFilters(prev => ({ ...prev, status: getInitialStatus() }));
    }, [location.pathname]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const userData = localStorage.getItem('user');
            const token = userData ? JSON.parse(userData)?.token : '';
            const response = await axios.get(URLS.GetCRMWebsiteBookings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setBookings(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // Filter logic
    const filteredBookings = useMemo(() => {
        return bookings.filter(item => {
            // Status filter
            if (filters.status !== 'all' && item.status !== filters.status) return false;

            // Search filter
            if (filters.searchTerm) {
                const search = filters.searchTerm.toLowerCase();
                const matchesSearch =
                    (item.firstName + ' ' + item.lastName).toLowerCase().includes(search) ||
                    (item.orderId || '').toLowerCase().includes(search) ||
                    (item._id || '').toLowerCase().includes(search) ||
                    (item.phone || '').includes(search) ||
                    (item.serviceName || '').toLowerCase().includes(search);
                if (!matchesSearch) return false;
            }

            // Date range filter
            if (filters.startDate || filters.endDate) {
                const itemDate = new Date(item.createdAt || item.bookingDate);
                if (filters.startDate && itemDate < filters.startDate) return false;
                if (filters.endDate) {
                    const end = new Date(filters.endDate);
                    end.setHours(23, 59, 59, 999);
                    if (itemDate > end) return false;
                }
            }

            return true;
        });
    }, [bookings, filters]);

    // Status counts
    const statusCounts = useMemo(() => {
        const counts = { all: bookings.length };
        crmWebsiteStatuses.forEach(s => {
            if (s.key !== 'all') {
                counts[s.key] = bookings.filter(b => b.status === s.key).length;
            }
        });
        return counts;
    }, [bookings]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(0);
    };

    const handleOpenAssignPage = (booking) => {
        navigate('/verified-partners-crm/assign-providers', {
            state: {
                orderIds: [booking._id],
                location: booking.cityName,
                bookingType: 'crm-website',
                returnPath: location.pathname,
            },
        });
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const userData = localStorage.getItem('user');
            const token = userData ? JSON.parse(userData)?.token : '';
            const response = await axios.post(URLS.UpdateCRMWebsiteBookingStatus, { id, status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success(`Status updated to ${status}`);
                fetchBookings();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                const userData = localStorage.getItem('user');
                const token = userData ? JSON.parse(userData)?.token : '';
                const response = await axios.delete(`${URLS.DeleteCRMWebsiteBooking}${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    toast.success('Booking deleted');
                    fetchBookings();
                }
            } catch (error) {
                toast.error('Failed to delete booking');
            }
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <PageContainer title="Website Bookings" description="Bookings from appliance repair website">
            <Breadcrumb title="Website Bookings" items={BCrumb} />

            <Container maxWidth="xl">
                <Box sx={{ mb: 3 }}>
                    <BookingsNav statuses={crmWebsiteStatuses} counts={statusCounts} />
                </Box>

                <OrderFilters
                    onFilterChange={handleFilterChange}
                    statuses={crmWebsiteStatuses}
                    orderType="crm-website"
                />

                <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <TableContainer sx={{
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': { height: '6px' },
                        '&::-webkit-scrollbar-track': { backgroundColor: '#e0f2f1', borderRadius: '10px' },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#009688', borderRadius: '10px' },
                        '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#00796b' },
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#009688 #e0f2f1',
                    }}>
                        <Table sx={{ minWidth: 900 }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                                    <TableCell sx={{ fontWeight: 700 }}>Sl No</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Service</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Lead Source / Date</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                                            <CircularProgress size={40} />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredBookings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                                            <Typography variant="h6" color="textSecondary">No bookings found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredBookings
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((booking, index) => (
                                            <TableRow key={booking._id} hover>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {page * rowsPerPage + index + 1}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600} color="primary">
                                                        {booking.orderId || `D-HUB-W-${booking._id?.slice(-8).toUpperCase()}`}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600}>{booking.serviceName}</Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {booking.categoryName} {">"} {booking.subcategoryName}
                                                    </Typography>
                                                    <Typography variant="caption" color="primary.main" sx={{ display: 'block', fontWeight: 600 }}>
                                                        Area: {booking.cityName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {booking.firstName} {booking.lastName}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                                                        {booking.phone}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {booking.email}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Website</Typography>
                                                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                                                        {booking.bookingDate} {booking.bookingTime}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge
                                                        status={booking.status}
                                                        variant="crm-website"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={700} color="success.main">
                                                        ₹{booking.amount || '0.00'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                        <Tooltip title="View Details">
                                                            <IconButton
                                                                size="small"
                                                                sx={{ backgroundColor: '#fa896b', color: '#fff', '&:hover': { backgroundColor: '#e9795d' } }}
                                                                onClick={() => navigate(`/bookings/crm-website/view/${booking._id}`)}
                                                            >
                                                                <IconEye size={18} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={
                                                            booking.status === 'missed' ? 'Cannot assign missed booking' :
                                                                ['assignToProvider', 'acceptedByProvider', 'completed', 'rejectedByProvider', 'confirmed'].includes(booking.status)
                                                                    ? 'Already Assigned'
                                                                    : 'Assign to Provider'
                                                        }>
                                                            <span>
                                                                <IconButton
                                                                    size="small"
                                                                    disabled={['assignToProvider', 'acceptedByProvider', 'completed', 'rejectedByProvider', 'confirmed', 'missed'].includes(booking.status)}
                                                                    sx={{
                                                                        backgroundColor: ['assignToProvider', 'acceptedByProvider', 'completed', 'rejectedByProvider', 'confirmed', 'missed'].includes(booking.status)
                                                                            ? '#e0e0e0' : '#009688',
                                                                        color: ['assignToProvider', 'acceptedByProvider', 'completed', 'rejectedByProvider', 'confirmed', 'missed'].includes(booking.status)
                                                                            ? '#9e9e9e' : '#fff',
                                                                        '&:hover': {
                                                                            backgroundColor: ['assignToProvider', 'acceptedByProvider', 'completed', 'rejectedByProvider', 'confirmed', 'missed'].includes(booking.status)
                                                                                ? '#e0e0e0' : '#00796b'
                                                                        },
                                                                        cursor: ['assignToProvider', 'acceptedByProvider', 'completed', 'rejectedByProvider', 'confirmed', 'missed'].includes(booking.status)
                                                                            ? 'not-allowed' : 'pointer',
                                                                        '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' }
                                                                    }}
                                                                    onClick={() => handleOpenAssignPage(booking)}
                                                                >
                                                                    <IconUserPlus size={18} />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                        <Tooltip title={booking.status === 'confirmed' || booking.status === 'assignToProvider' ? "Booking Already Confirmed" : "Confirm Booking"}>
                                                            <IconButton
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: (booking.status === 'confirmed' || booking.status === 'assignToProvider') ? '#e0e0e0' : '#4caf50',
                                                                    color: (booking.status === 'confirmed' || booking.status === 'assignToProvider') ? '#9e9e9e' : '#fff',
                                                                    '&:hover': {
                                                                        backgroundColor: (booking.status === 'confirmed' || booking.status === 'assignToProvider') ? '#e0e0e0' : '#388e3c'
                                                                    },
                                                                    cursor: (booking.status === 'confirmed' || booking.status === 'assignToProvider') ? 'not-allowed' : 'pointer'
                                                                }}
                                                                onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                                                                disabled={booking.status === 'confirmed' || booking.status === 'assignToProvider'}
                                                            >
                                                                <IconCheck size="18" />
                                                            </IconButton>
                                                        </Tooltip>

                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={filteredBookings.length}
                        page={page}
                        onPageChange={handlePageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </Paper>


            </Container>
        </PageContainer>
    );
};

export default CRMWebsiteBookings;

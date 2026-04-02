import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    TablePagination,
    TextField,
    InputAdornment,
} from '@mui/material';
import { IconPlus, IconTrash, IconSearch } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URLS } from 'src/Url';
import { toast, ToastContainer } from 'react-toastify';
import { format } from 'date-fns';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Notifications' },
    { title: 'History' },
];

const NotificationHistory = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalCount, setTotalCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const getToken = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user)?.token : '';
    };

    useEffect(() => {
        fetchNotifications();
    }, [page, rowsPerPage]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get(URLS.NotificationHistory, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: page + 1, // API uses 1-based indexing
                    limit: rowsPerPage,
                },
            });

            const responseData = response.data;

            // Handle nested structure: response.data.data.notifications
            const dataObj = responseData?.data || responseData;
            const notificationsList = Array.isArray(dataObj?.notifications)
                ? dataObj.notifications
                : (Array.isArray(dataObj?.data)
                    ? dataObj.data
                    : (Array.isArray(dataObj) ? dataObj : []));

            setNotifications(notificationsList);
            setTotalCount(dataObj?.totalCount || dataObj?.total || dataObj?.count || notificationsList.length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notification history');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notification?')) return;

        try {
            const token = getToken();
            await axios.delete(`${URLS.NotificationDelete}${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Notification deleted successfully');
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification');
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return dateString;
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'hh:mm a');
        } catch (error) {
            return dateString;
        }
    };

    const filteredNotifications = notifications.filter((notification) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            notification.title?.toLowerCase().includes(query) ||
            notification.target?.toLowerCase().includes(query) ||
            notification.description?.toLowerCase().includes(query)
        );
    });

    return (
        <PageContainer title="Notification History" description="View sent notifications">
            <Breadcrumb title="Notification History" items={BCrumb} />
            <ToastContainer />

            <ParentCard title="Notification History">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconSearch size={20} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ minWidth: 300 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<IconPlus />}
                        onClick={() => navigate('/notifications/send')}
                        sx={{
                            backgroundColor: '#0d5959',
                            '&:hover': { backgroundColor: '#084040' }
                        }}
                    >
                        Send New Notification
                    </Button>
                </Box>

                <Box sx={{ overflow: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>
                                    Date
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>
                                    Time
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>
                                    Title
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>
                                    Message
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>
                                    Image
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>
                                    Target
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : filteredNotifications.length > 0 ? (
                                filteredNotifications.map((notification) => (
                                    <TableRow key={notification._id || notification.id}>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {notification.date || formatDate(notification.createdAt || notification.sentAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {notification.time || formatTime(notification.createdAt || notification.sentAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {notification.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    maxWidth: 300,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {notification.description || notification.message}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {notification.image ? (
                                                <Box
                                                    component="img"
                                                    src={`https://api.doorstephub.com${notification.image}`}
                                                    alt="Notification"
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        objectFit: 'cover',
                                                        borderRadius: 1,
                                                        cursor: 'pointer',
                                                        border: '1px solid #eee'
                                                    }}
                                                    onClick={() => window.open(`https://api.doorstephub.com${notification.image}`, '_blank')}
                                                />
                                            ) : (
                                                <Typography variant="caption" color="textSecondary">No Image</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                                {notification.sendTo || notification.target || 'All'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => handleDelete(notification._id || notification.id)}
                                                color="error"
                                                size="small"
                                            >
                                                <IconTrash size={20} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography variant="body2" color="textSecondary">
                                            No notifications found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>

                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[10, 20, 50, 100]}
                />
            </ParentCard>
        </PageContainer>
    );
};

export default NotificationHistory;

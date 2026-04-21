import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Alert,
    CircularProgress,
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
    Stack,
    Avatar,
} from '@mui/material';
import { IconPlus, IconTrash, IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URLS } from 'src/Url';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';

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
    const [loadError, setLoadError] = useState('');

    const getToken = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user)?.token : '';
    };

    useEffect(() => {
        fetchNotifications();
    }, [page, rowsPerPage]);

    const fetchNotifications = async () => {
        setLoading(true);
        setLoadError('');
        try {
            const token = getToken();
            const response = await axios.get(URLS.NotificationHistory || '', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: page + 1,
                    limit: rowsPerPage,
                },
            });

            const responseData = response.data;
            const dataObj = responseData?.data || responseData;
            
            let notificationsList = [];
            if (Array.isArray(dataObj?.notifications)) {
                notificationsList = dataObj.notifications;
            } else if (Array.isArray(dataObj?.data)) {
                notificationsList = dataObj.data;
            } else if (Array.isArray(dataObj)) {
                notificationsList = dataObj;
            } else if (Array.isArray(responseData?.notifications)) {
                notificationsList = responseData.notifications;
            }

            // Sanitize list to remove any nulls
            const sanitizedList = notificationsList.filter(n => n && typeof n === 'object');
            
            setNotifications(sanitizedList);
            setTotalCount(dataObj?.totalCount || dataObj?.total || dataObj?.count || sanitizedList.length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoadError('Failed to load notification history');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!id) return;
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
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return format(date, 'MMM dd, yyyy');
        } catch (error) {
            return dateString;
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return format(date, 'hh:mm a');
        } catch (error) {
            return dateString;
        }
    };

    const filteredNotifications = (Array.isArray(notifications) ? notifications : [])
        .filter((notification) => {
            if (!notification) return false;
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                String(notification?.title || '').toLowerCase().includes(query) ||
                String(notification?.target || notification?.sendTo || '').toLowerCase().includes(query) ||
                String(notification?.description || notification?.message || '').toLowerCase().includes(query)
            );
        });

    return (
        <PageContainer title="Notification History" description="View sent notifications">
            <Breadcrumb title="Notification History" items={BCrumb} />
            <Box sx={{ mt: 3 }}>
                <Card
                    sx={{
                        background: 'linear-gradient(180deg, rgba(7, 27, 34, 0.95) 0%, rgba(10, 24, 31, 0.98) 100%)',
                        border: '1px solid rgba(24, 197, 188, 0.18)',
                        boxShadow: '0 18px 50px rgba(0,0,0,0.22)',
                        overflow: 'hidden',
                        color: '#d9f5f1',
                    }}
                >
                    <CardHeader
                        title="Sent Notifications"
                        subheader="View push notifications sent to apps and website."
                        titleTypographyProps={{ color: '#e8fffb', fontWeight: 700 }}
                        subheaderTypographyProps={{ color: 'rgba(233, 255, 251, 0.7)' }}
                        sx={{
                            borderBottom: '1px solid rgba(24, 197, 188, 0.12)',
                            '& .MuiCardHeader-content': { minWidth: 0 },
                        }}
                    />

                    <CardContent>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'stretch', md: 'center' }}
                            gap={2}
                            sx={{ mb: 3 }}
                        >
                            <TextField
                                size="small"
                                placeholder="Search notifications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconSearch size={20} color="#18c5bc" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ 
                                    minWidth: { xs: '100%', md: 350 },
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': { borderColor: 'rgba(24, 197, 188, 0.2)' },
                                        '&:hover fieldset': { borderColor: 'rgba(24, 197, 188, 0.4)' },
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<IconPlus />}
                                onClick={() => navigate('/notifications/send')}
                                sx={{
                                    backgroundColor: '#0d5959',
                                    '&:hover': { backgroundColor: '#084040' },
                                    minWidth: 220,
                                }}
                            >
                                Send New Notification
                            </Button>
                        </Stack>

                        {loadError && (
                            <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#ff8a80' }}>
                                {loadError}
                            </Alert>
                        )}

                        <Box sx={{ overflow: 'auto', borderRadius: 2, border: '1px solid rgba(24, 197, 188, 0.12)' }}>
                            <Table sx={{ minWidth: 900 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 700 }}>Date</TableCell>
                                        <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 700 }}>Time</TableCell>
                                        <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 700 }}>Title</TableCell>
                                        <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 700 }}>Message</TableCell>
                                        <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 700 }}>Image</TableCell>
                                        <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 700 }}>Target</TableCell>
                                        <TableCell align="right" sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 700 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                                <CircularProgress size={35} sx={{ color: '#18c5bc' }} />
                                                <Typography sx={{ mt: 2, color: 'rgba(233, 255, 251, 0.7)' }}>Loading history...</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredNotifications.length > 0 ? (
                                        filteredNotifications.map((notification) => (
                                            <TableRow 
                                                key={notification._id || notification.id || Math.random()}
                                                sx={{ '&:hover': { backgroundColor: 'rgba(24, 197, 188, 0.05)' } }}
                                            >
                                                <TableCell sx={{ color: 'rgba(233, 255, 251, 0.9)' }}>
                                                    {notification.date || formatDate(notification.createdAt || notification.sentAt)}
                                                </TableCell>
                                                <TableCell sx={{ color: 'rgba(233, 255, 251, 0.9)' }}>
                                                    {notification.time || formatTime(notification.createdAt || notification.sentAt)}
                                                </TableCell>
                                                <TableCell sx={{ color: '#e8fffb', fontWeight: 600 }}>
                                                    {notification.title || 'Untitled'}
                                                </TableCell>
                                                <TableCell sx={{ color: 'rgba(233, 255, 251, 0.8)' }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            maxWidth: 350,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {notification.description || notification.message || 'No description provided'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {notification.image ? (
                                                        <Avatar
                                                            src={notification.image.startsWith('http') ? notification.image : `https://api.doorstephub.com${notification.image}`}
                                                            variant="rounded"
                                                            sx={{ width: 45, height: 45, border: '1px solid rgba(24, 197, 188, 0.2)', cursor: 'pointer' }}
                                                            onClick={() => window.open(notification.image.startsWith('http') ? notification.image : `https://api.doorstephub.com${notification.image}`, '_blank')}
                                                        />
                                                    ) : (
                                                        <Typography variant="caption" color="textSecondary">None</Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell sx={{ color: 'rgba(233, 255, 251, 0.8)', textTransform: 'capitalize' }}>
                                                    {notification.sendTo || notification.target || 'All'}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        onClick={() => handleDelete(notification._id || notification.id)}
                                                        sx={{ color: '#ff4d4d', '&:hover': { backgroundColor: 'rgba(255, 77, 77, 0.1)' } }}
                                                        size="small"
                                                    >
                                                        <IconTrash size={20} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                                <Box sx={{ opacity: 0.6 }}>
                                                    <IconSearch size={48} color="rgba(24, 197, 188, 0.3)" />
                                                    <Typography variant="h6" sx={{ mt: 2, color: '#e8fffb' }}>
                                                        No results found
                                                    </Typography>
                                                    <Typography variant="body2" color="rgba(233, 255, 251, 0.6)">
                                                        Try adjusting your search query or send a new notification.
                                                    </Typography>
                                                </Box>
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
                            sx={{
                                color: 'rgba(233, 255, 251, 0.7)',
                                '& .MuiIconButton-root': { color: 'rgba(233, 255, 251, 0.7)' },
                                borderTop: '1px solid rgba(24, 197, 188, 0.12)'
                            }}
                        />
                    </CardContent>
                </Card>
            </Box>
        </PageContainer>
    );
};

export default NotificationHistory;

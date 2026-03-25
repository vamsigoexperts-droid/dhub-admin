import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Card,
    CardContent,
    Grid,
    Typography,
    Divider,
    Chip,
    Button,
    Tooltip,
    IconButton,
    Avatar,
    Stack,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Popover,
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
} from '@mui/lab';
import {
    IconArrowLeft,
    IconBrandWhatsapp,
    IconUser,
    IconBriefcase,
    IconMapPin,
    IconCreditCard,
    IconCalendar,
    IconClock,
    IconMessage,
    IconHistory,
    IconInfoCircle,
    IconEye,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { URLS } from 'src/Url';
import { granularPartnerStatuses } from '../config/statusConfig';



const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
};

const CRMWebsiteBookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [statusHistory, setStatusHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Dialog state
    const [pendingStatusChange, setPendingStatusChange] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');
    const [rescheduleDate, setRescheduleDate] = useState('');
    const [rescheduleTime, setRescheduleTime] = useState('');
    const [rescheduleReason, setRescheduleReason] = useState('');

    // Actor popover state
    const [actorAnchorEl, setActorAnchorEl] = useState(null);
    const [activeActorItem, setActiveActorItem] = useState(null);
    const handleActorPopoverOpen = (e, item) => { setActorAnchorEl(e.currentTarget); setActiveActorItem(item); };
    const handleActorPopoverClose = () => { setActorAnchorEl(null); setActiveActorItem(null); };
    const actorPopoverOpen = Boolean(actorAnchorEl);

    const BCrumb = [
        { to: '/', title: 'Home' },
        { to: '/bookings/dashboard', title: 'Bookings' },
        { to: '/bookings/crm-website/all', title: 'Website Bookings' },
        { title: 'Booking Details' },
    ];

    const fetchBookingDetails = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.get(`${URLS.GetCRMWebsiteBookingById}${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setBooking(response.data.data);
                setStatusHistory(response.data.data.statusHistory || []);
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
            toast.error('Failed to fetch booking details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (id) fetchBookingDetails(); }, [id]);

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        if (!newStatus) return;
        const isCancellation = ['cancelledByUser', 'cancelledByProvider'].includes(newStatus);
        const isReschedule = ['rescheduleByProvider'].includes(newStatus);
        if (isCancellation || isReschedule) {
            setPendingStatusChange(newStatus);
            setCancellationReason(''); setRescheduleDate(''); setRescheduleTime(''); setRescheduleReason('');
            setDialogOpen(true);
            return;
        }
        submitStatusChange(newStatus, {});
    };

    const submitStatusChange = async (status, extras = {}) => {
        setUpdatingStatus(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.post(
                URLS.UpdateCRMWebsiteBookingStatus,
                { id, status, ...extras },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success('Status updated successfully');
                fetchBookingDetails();
            } else {
                toast.error(response.data.message || 'Failed to update status');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDialogConfirm = async () => {
        const isCancellation = ['cancelledByUser', 'cancelledByProvider', 'cancelled'].includes(pendingStatusChange);
        const isReschedule = ['rescheduleByProvider'].includes(pendingStatusChange);
        if (isCancellation && !cancellationReason.trim()) { toast.error('Please provide a cancellation reason'); return; }
        if (isReschedule && (!rescheduleDate || !rescheduleTime)) { toast.error('Please provide both date and time'); return; }
        const extras = {};
        if (isCancellation) extras.cancellationReason = cancellationReason;
        if (isReschedule) { extras.rescheduleDate = rescheduleDate; extras.rescheduleTime = rescheduleTime; extras.rescheduleReason = rescheduleReason; }

        setDialogOpen(false);
        await submitStatusChange(pendingStatusChange, extras);
        setPendingStatusChange(null);
    };

    const handleDialogClose = () => { setDialogOpen(false); setPendingStatusChange(null); };

    if (loading) return <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box>;
    if (!booking) return <Box p={3}><Typography color="error">Booking not found</Typography></Box>;

    const customerName = `${booking.firstName || ''} ${booking.lastName || ''}`.trim() || 'N/A';
    const currentStatus = booking.status || 'pending';

    return (
        <PageContainer title="Website Booking Details" description="View website lead details">
            <Breadcrumb title="Website Booking Details" items={BCrumb} />
            <Container maxWidth="lg">
                <Button startIcon={<IconArrowLeft />} onClick={() => navigate(-1)} sx={{ mb: 3 }} variant="outlined" color="primary">
                    Back to Bookings
                </Button>

                <Grid container spacing={3}>
                    {/* Left Column */}
                    <Grid item xs={12} lg={8}>
                        <Card elevation={3} sx={{ mb: 3, borderRadius: '12px' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Typography variant="h4" fontWeight="700">
                                            Booking #{booking.orderId || `D-HUB-W-${booking._id?.slice(-8).toUpperCase()}`}
                                        </Typography>
                                        {/* Status Dropdown */}
                                        <FormControl size="small" sx={{ minWidth: 160 }}>
                                            <InputLabel id="status-label">Status</InputLabel>
                                            <Select
                                                labelId="status-label"
                                                value={currentStatus}
                                                label="Status"
                                                onChange={handleStatusChange}
                                                disabled={updatingStatus}
                                                endAdornment={updatingStatus && <CircularProgress size={18} sx={{ mr: 4 }} />}
                                                sx={{
                                                    fontWeight: '600', borderRadius: '8px',
                                                    '.MuiSelect-select': {
                                                        color: ['completed', 'confirmed'].includes(currentStatus) ? 'success.main' :
                                                            ['cancelled', 'cancelledByUser', 'cancelledByProvider', 'missed'].includes(currentStatus) ? 'error.main' :
                                                                ['payment_pending'].includes(currentStatus) ? 'secondary.main' :
                                                                    ['pending'].includes(currentStatus) ? 'warning.main' : 'primary.main'
                                                    }
                                                }}
                                            >
                                                {granularPartnerStatuses.map(s => (
                                                    <MenuItem key={s.key} value={s.key}>
                                                        <Typography variant="body2" fontWeight="600">{s.label}</Typography>
                                                    </MenuItem>
                                                ))}
                                                {/* Fallback: show current if not in list */}
                                                {!granularPartnerStatuses.some(s => s.key === currentStatus) && (
                                                    <MenuItem value={currentStatus} disabled>
                                                        <Typography variant="body2" fontWeight="600">{formatStatus(currentStatus)} (Current)</Typography>
                                                    </MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                    <Tooltip title="Chat on WhatsApp">
                                        <IconButton
                                            onClick={() => window.open(`https://wa.me/${booking.phone}`, '_blank')}
                                            sx={{ backgroundColor: '#25D366', color: '#fff', '&:hover': { backgroundColor: '#1da851' } }}
                                        >
                                            <IconBrandWhatsapp size={20} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Typography variant="caption" color="textSecondary">
                                    Lead Generated on: {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}
                                </Typography>

                                <Divider sx={{ my: 3 }} />

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                            <IconUser size={22} color="#5D87FF" />
                                            <Typography variant="h6" fontWeight="600">Customer Details</Typography>
                                        </Stack>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: 'grey.50' }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ width: 50, height: 50, bgcolor: 'primary.main' }}>{customerName.charAt(0)}</Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="700">{customerName}</Typography>
                                                    <Typography variant="body2" color="textSecondary">{booking.phone || 'N/A'}</Typography>
                                                    <Typography variant="body2" color="textSecondary">{booking.email || 'N/A'}</Typography>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                            <IconUser size={22} color="#13DEB9" />
                                            <Typography variant="h6" fontWeight="600">Assigned Provider</Typography>
                                        </Stack>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px' }}>
                                            {booking.providerId ? (
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar src={booking.providerId.image ? `http://192.168.0.5:5013/${booking.providerId.image}` : ''} sx={{ width: 56, height: 56 }}>
                                                        {booking.providerId.firstName?.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="700">{booking.providerId.businessName || `${booking.providerId.firstName} ${booking.providerId.lastName}`}</Typography>
                                                        <Typography variant="body2" color="textSecondary">{booking.providerId.phone}</Typography>
                                                        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold' }}>Assigned Partner</Typography>
                                                    </Box>
                                                </Stack>
                                            ) : (
                                                <Box textAlign="center" py={1}>
                                                    <Typography variant="body2" color="textSecondary">No provider assigned yet.</Typography>
                                                </Box>
                                            )}
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                            <IconBriefcase size={22} color="#FFAE1F" />
                                            <Typography variant="h6" fontWeight="600">Service Requested</Typography>
                                        </Stack>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px' }}>
                                            <Typography variant="caption" color="textSecondary">Category / Service</Typography>
                                            <Typography variant="h6" color="primary.main" fontWeight="700">{booking.categoryId?.name || booking.categoryName || 'N/A'}</Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                            <IconMapPin size={22} color="#FA896B" />
                                            <Typography variant="h6" fontWeight="600">Service Location</Typography>
                                        </Stack>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: 'grey.50' }}>
                                            <Typography variant="body1" fontWeight="600">
                                                {[booking.cityName, booking.stateName, booking.countryName].filter(Boolean).join(', ')}
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                            <IconMessage size={22} color="#5D87FF" />
                                            <Typography variant="h6" fontWeight="600">Customer Message / Note</Typography>
                                        </Stack>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: '#fffbed', border: '1px solid #ffd33d' }}>
                                            <Typography variant="body2" sx={{ fontStyle: booking.message ? 'normal' : 'italic' }}>
                                                {booking.message || 'No additional message provided by customer.'}
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                            <IconCalendar size={22} color="#009688" />
                                            <Typography variant="h6" fontWeight="600">Preferred Schedule</Typography>
                                        </Stack>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: 'grey.50' }}>
                                            <Stack spacing={1}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <IconCalendar size={18} />
                                                    <Typography variant="body2">Date: <b>{booking.bookingDate || 'Not Specified'}</b></Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <IconClock size={18} />
                                                    <Typography variant="body2">Time: <b>{booking.bookingTime || 'Not Specified'}</b></Typography>
                                                </Stack>
                                            </Stack>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                            <IconCreditCard size={22} color="#5D87FF" />
                                            <Typography variant="h6" fontWeight="600">Payment Information</Typography>
                                        </Stack>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px' }}>
                                            <Stack spacing={2}>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2">Estimated Amount:</Typography>
                                                    <Typography variant="subtitle2" fontWeight="700">ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹{booking.amount || '0.00'}</Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2">Payment Status:</Typography>
                                                    <Chip label={booking.paymentStatus?.toUpperCase() || 'PENDING'} size="small" color={booking.paymentStatus === 'paid' ? 'success' : 'warning'} />
                                                </Box>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2">Payment Method:</Typography>
                                                    <Typography variant="subtitle2" fontWeight="700">{booking.paymentMethod || 'COD / At Service'}</Typography>
                                                </Box>
                                                {booking.paymentTransactionId && (
                                                    <Box>
                                                        <Typography variant="caption" color="textSecondary">Transaction ID</Typography>
                                                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{booking.paymentTransactionId}</Typography>
                                                    </Box>
                                                )}
                                            </Stack>
                                        </Paper>
                                    </Grid>

                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} lg={4}>

                        {/* Lifecycle Tracking */}
                        <Card elevation={3} sx={{ borderRadius: '12px' }}>
                            <CardContent>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
                                    <IconHistory size={24} color="#5D87FF" />
                                    <Typography variant="h6" fontWeight="600">Lifecycle Tracking</Typography>
                                </Stack>
                                {statusHistory.length > 0 ? (
                                    <Timeline sx={{ [`& .MuiTimelineItem-root:before`]: { flex: 0, padding: 0 } }}>
                                        {statusHistory.slice().reverse().map((item, index) => (
                                            <TimelineItem key={index}>
                                                <TimelineSeparator>
                                                    <TimelineDot color={index === 0 ? 'primary' : 'success'} variant={index === 0 ? 'filled' : 'outlined'} />
                                                    {index !== statusHistory.length - 1 && <TimelineConnector />}
                                                </TimelineSeparator>
                                                <TimelineContent sx={{ py: '12px', px: 2 }}>
                                                    <Typography variant="subtitle2" fontWeight="700" color={index === 0 ? 'primary.main' : 'textPrimary'}>
                                                        {formatStatus(item.status)}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                                        {item.statusTextMessage}
                                                    </Typography>
                                                    {/* Time + Eye Button */}
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <IconInfoCircle size={14} color="#949db2" />
                                                        <Typography variant="caption" color="textSecondary">
                                                            {item.logCreatedDate ? format(new Date(item.logCreatedDate), 'MMM dd, hh:mm a') : 'N/A'}
                                                        </Typography>
                                                        {(item.changedByRole || item.changedByName || item.changedByEmail) && (
                                                            <Tooltip title="View actor details">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => handleActorPopoverOpen(e, item)}
                                                                    sx={{ p: 0.3, ml: 0.5, color: 'primary.main', '&:hover': { bgcolor: 'primary.light', color: '#fff' } }}
                                                                >
                                                                    <IconEye size={14} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Stack>
                                                </TimelineContent>
                                            </TimelineItem>
                                        ))}
                                    </Timeline>
                                ) : (
                                    <Box py={4} textAlign="center">
                                        <Typography color="textSecondary">No tracking history found</Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            {/* ===== Actor Details Popover ===== */}
            <Popover
                open={actorPopoverOpen}
                anchorEl={actorAnchorEl}
                onClose={handleActorPopoverClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{ sx: { borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', p: 2, minWidth: 220, maxWidth: 300 } }}
            >
                {activeActorItem && (() => {
                    const role = activeActorItem.changedByRole || 'system';
                    const roleColor = { admin: '#5D87FF', provider: '#13DEB9', user: '#FA896B', system: '#949db2' }[role] || '#949db2';
                    return (
                        <Box>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: `${roleColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconUser size={18} color={roleColor} />
                                </Box>
                                <Box>
                                    <Chip label={role.toUpperCase()} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: roleColor, color: '#fff', borderRadius: '4px' }} />
                                    <Typography variant="subtitle2" fontWeight="700" mt={0.3}>
                                        {activeActorItem.changedByName || 'Unknown'}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Divider sx={{ mb: 1.5 }} />
                            <Stack spacing={0.7}>
                                {activeActorItem.changedByEmail && (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="caption" color="textSecondary" sx={{ minWidth: 45 }}>Email</Typography>
                                        <Typography variant="caption" fontWeight="600">{activeActorItem.changedByEmail}</Typography>
                                    </Stack>
                                )}
                                {activeActorItem.changedByPhone && (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="caption" color="textSecondary" sx={{ minWidth: 45 }}>Phone</Typography>
                                        <Typography variant="caption" fontWeight="600">{activeActorItem.changedByPhone}</Typography>
                                    </Stack>
                                )}
                                {activeActorItem.logCreatedDate && (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="caption" color="textSecondary" sx={{ minWidth: 45 }}>At</Typography>
                                        <Typography variant="caption" fontWeight="600">
                                            {format(new Date(activeActorItem.logCreatedDate), 'MMM dd yyyy, hh:mm a')}
                                        </Typography>
                                    </Stack>
                                )}
                            </Stack>
                        </Box>
                    );
                })()}
            </Popover>

            {/* ===== Cancellation / Reschedule Dialog ===== */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
                    {['cancelledByUser', 'cancelledByProvider', 'cancelled'].includes(pendingStatusChange) ? 'Cancellation Details' : 'Reschedule Details'}
                </DialogTitle>
                <DialogContent>
                    {['cancelledByUser', 'cancelledByProvider', 'cancelled'].includes(pendingStatusChange) && (
                        <Box mt={1}>
                            <Typography variant="body2" color="textSecondary" mb={2}>
                                You are marking this booking as <strong>Cancelled</strong>. Please provide a reason.
                            </Typography>
                            <TextField
                                label="Cancellation Reason" multiline rows={3} fullWidth required
                                value={cancellationReason} onChange={(e) => setCancellationReason(e.target.value)}
                                placeholder="e.g. Customer not available..." sx={{ mt: 1 }}
                            />
                        </Box>
                    )}
                    {['rescheduleByProvider'].includes(pendingStatusChange) && (
                        <Box mt={1}>
                            <Typography variant="body2" color="textSecondary" mb={2}>
                                Please provide the new schedule details.
                            </Typography>
                            <Stack spacing={2} mt={1}>
                                <TextField label="New Date" type="date" fullWidth required InputLabelProps={{ shrink: true }} value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} />
                                <TextField label="New Time" type="time" fullWidth required InputLabelProps={{ shrink: true }} value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} />
                                <TextField label="Reason (Optional)" multiline rows={2} fullWidth value={rescheduleReason} onChange={(e) => setRescheduleReason(e.target.value)} />
                            </Stack>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button onClick={handleDialogClose} variant="outlined" color="inherit">Cancel</Button>
                    <Button
                        onClick={handleDialogConfirm}
                        variant="contained"
                        color={['cancelledByUser', 'cancelledByProvider', 'cancelled'].includes(pendingStatusChange) ? 'error' : 'primary'}
                        disabled={updatingStatus}
                        startIcon={updatingStatus && <CircularProgress size={16} color="inherit" />}
                    >
                        {updatingStatus ? 'Saving...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default CRMWebsiteBookingDetails;

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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
    TimelineDot
} from '@mui/lab';
import {
    IconArrowLeft,
    IconBrandWhatsapp,
    IconUserPlus,
    IconUser,
    IconBriefcase,
    IconHistory,
    IconTruckDelivery,
    IconReceipt2,
    IconInfoCircle,
    IconCreditCard,
    IconWallet,
    IconCoin,
    IconMapPin,
    IconEye,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import URLS from '../../URLS';
import { getMediaBaseUrl } from '../../config/apiEnv';
import { granularPartnerStatuses } from './config/statusConfig';

const OrderDetails = () => {
    const mediaBase = getMediaBaseUrl().replace(/\/$/, '');
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Dialog state for special statuses
    const [pendingStatusChange, setPendingStatusChange] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');
    const [rescheduleDate, setRescheduleDate] = useState('');
    const [rescheduleTime, setRescheduleTime] = useState('');
    const [rescheduleReason, setRescheduleReason] = useState('');

    // Actor popover state
    const [actorAnchorEl, setActorAnchorEl] = useState(null);
    const [activeActorItem, setActiveActorItem] = useState(null);

    const handleActorPopoverOpen = (event, item) => {
        setActorAnchorEl(event.currentTarget);
        setActiveActorItem(item);
    };
    const handleActorPopoverClose = () => {
        setActorAnchorEl(null);
        setActiveActorItem(null);
    };
    const actorPopoverOpen = Boolean(actorAnchorEl);

    const isProfessionalOrder = order?.typeProvider === 'provider' || !order?.typeProvider;
    const isServiceCenter = order?.providerSnapshot?.providerType === 'Service Center';
    const professionalBasePath = isServiceCenter ? '/bookings/service-center' : '/bookings/professional';

    const BCrumb = [
        { to: '/', title: 'Home' },
        {
            to: isProfessionalOrder ? `${professionalBasePath}/all` : '/bookings/verified-partner/all',
            title: 'Bookings'
        },
        { title: 'Order Details' },
    ];

    const formatStatus = (status) => {
        if (!status) return 'N/A';
        return status
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    };

    const getDropdownValue = (status) => {
        if (!status) return '';
        // If the status is already one of our keys, return it.
        if (granularPartnerStatuses.some(s => s.key === status)) return status;

        // Fallback mapping for older data or different formats
        const mapping = {
            'completed': 'workIsCompleted',
            'pending': 'orderAcceptedByAdmin',
            'ongoing': 'assignToProvider',
            'cancelled': 'cancelledByUser',
            'rescheduled': 'rescheduleByProvider',
            'missed': 'missed',
            'workCompleted': 'workIsCompleted',
            'quotationSent': 'sendQuotation',
            'rescheduledByProvider': 'rescheduleByProvider'
        };
        return mapping[status] || status;
    };

    const fetchOrderDetails = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.get(URLS.GetOrderById(id), {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setOrder(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error('Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;
        if (!newStatus) return;

        const isCancellation = ['cancelledByUser', 'cancelledByProvider'].includes(newStatus);
        const isReschedule = ['rescheduleByProvider'].includes(newStatus);

        if (isCancellation || isReschedule) {
            // Open the dialog to collect extra info
            setPendingStatusChange(newStatus);
            setCancellationReason('');
            setRescheduleDate('');
            setRescheduleTime('');
            setRescheduleReason('');
            setDialogOpen(true);
            return;
        }

        // No extra info needed ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â update directly
        await submitStatusChange(newStatus, {});
    };

    const submitStatusChange = async (status, extras = {}) => {
        setUpdatingStatus(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.put(
                URLS.UpdateOrderStatus(id),
                { status, ...extras },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Status updated successfully');
                fetchOrderDetails();
            } else {
                toast.error(response.data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDialogConfirm = async () => {
        const isCancellation = ['cancelledByUser', 'cancelledByProvider'].includes(pendingStatusChange);
        const isReschedule = ['rescheduleByProvider'].includes(pendingStatusChange);

        if (isCancellation && !cancellationReason.trim()) {
            toast.error('Please provide a cancellation reason');
            return;
        }
        if (isReschedule && (!rescheduleDate || !rescheduleTime)) {
            toast.error('Please provide both reschedule date and time');
            return;
        }

        const extras = {};
        if (isCancellation) extras.cancellationReason = cancellationReason;
        if (isReschedule) {
            extras.rescheduleDate = rescheduleDate;
            extras.rescheduleTime = rescheduleTime;
            extras.rescheduleReason = rescheduleReason;
        }

        setDialogOpen(false);
        await submitStatusChange(pendingStatusChange, extras);
        setPendingStatusChange(null);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setPendingStatusChange(null);
    };

    const handleClearSla = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.put(URLS.ClearOrderSla(id), {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success('SLA flag cleared');
                fetchOrderDetails();
            } else {
                toast.error('Failed to clear SLA flag');
            }
        } catch (error) {
            console.error('Error clearing SLA:', error);
            toast.error(error.response?.data?.message || 'Failed to clear SLA flag');
        }
    };


    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    if (loading) return <Box p={3} display="flex" justifyContent="center"><Typography>Loading order details...</Typography></Box>;
    if (!order) return <Box p={3}><Typography color="error">Order not found</Typography></Box>;

    const orderData = order.order || order;
    const buildInvoiceUrl = (rawPath, fallbackPath) => {
        const value = String(rawPath || '').trim();
        if (value) {
            if (/^https?:\/\//i.test(value)) return value;
            return `${mediaBase}/${value.replace(/^\//, '')}`;
        }
        return fallbackPath;
    };
    const customerInvoiceUrl = buildInvoiceUrl(
        orderData.invoice,
        `${mediaBase}/uploads/invoices/invoice-${orderData.serviceBookingId || orderData._id}.pdf`
    );
    const partnerInvoiceUrl = buildInvoiceUrl(
        orderData.providerInvoice,
        `${mediaBase}/uploads/provider-invoices/provider-invoice-${orderData.serviceBookingId || orderData._id}.pdf`
    );
    const customer = orderData.userId || {};
    const service = orderData.serviceId || orderData.service || {};
    const selectedRatecard = Array.isArray(orderData.selectedRatecards) && orderData.selectedRatecards.length
        ? orderData.selectedRatecards[0]
        : null;
    /** Snapshot from customer checkout (BookService) — multiple rate lines */
    const selectedServiceRatesList = Array.isArray(orderData.selectedServiceRates)
        ? orderData.selectedServiceRates.filter((r) => r && (r.name || r.title))
        : [];
    const snapshotService = Array.isArray(orderData.services) && orderData.services.length
        ? orderData.services[0]
        : null;
    const displayServiceName =
        service.serviceName ||
        service.name ||
        orderData.serviceName ||
        selectedRatecard?.name ||
        snapshotService?.serviceName ||
        orderData.subcategoryId?.subcategoryName ||
        orderData.subcategoryId?.name ||
        orderData.categoryId?.categoryName ||
        orderData.categoryId?.name ||
        'N/A';
    const displayServiceImage =
        service.mainImage ||
        orderData.serviceImage ||
        selectedRatecard?.image ||
        snapshotService?.serviceImage ||
        '';
    const displayServiceCategory =
        service.categoryName ||
        (snapshotService?.serviceCategory && snapshotService?.serviceSubcategory
            ? `${snapshotService.serviceCategory} › ${snapshotService.serviceSubcategory}`
            : snapshotService?.serviceCategory || snapshotService?.serviceSubcategory) ||
        orderData.services?.[0]?.serviceCategory ||
        orderData.categoryId?.categoryName ||
        orderData.categoryId?.name ||
        'General Service';
    const provider = orderData.provider || orderData.providerId || orderData.providerSnapshot || {};
    const statusHistory = orderData.statusHistory || [];
    const submittedReview = orderData.review || null;

    // Robust Estimation Detection (Support for latestEstimation and estimations array)
    const estimation = orderData.latestEstimation ||
        (orderData.estimations && orderData.estimations.length > 0 ? orderData.estimations[orderData.estimations.length - 1] : null) ||
        orderData.estimation ||
        null;

    const normalizedOrderStatus = (orderData.status || orderData.orderStatus || '').toLowerCase();
    const normalizedPaymentRequestStatus = (orderData.paymentRequest?.status || '').toLowerCase();
    const normalizedPaymentStatus = (orderData.paymentStatus || '').toLowerCase();
    const normalizedPaymentRequestType = String(orderData.paymentRequest?.type || '').toLowerCase();
    const hasQuotationPaymentContext =
        Number(orderData.paymentRequest?.amount || 0) > 0 ||
        ['partial', 'full'].includes(normalizedPaymentRequestType);
    const hasCompletedQuotationPayment =
        hasQuotationPaymentContext &&
        (
            ['paid', 'completed'].includes(normalizedPaymentRequestStatus) ||
            ['paymentreceived', 'workiscompleted', 'completed'].includes(normalizedOrderStatus) ||
            ['paid', 'success'].includes(normalizedPaymentStatus)
        );
    const estimationBaseAmount = Number(estimation?.baseAmount ?? estimation?.totalAmount ?? 0) || 0;
    const estimationGstAmount = Number(
        estimation?.gstAmount ??
        (
            Number(estimation?.grandTotal ?? 0) > estimationBaseAmount
                ? Number(estimation?.grandTotal ?? 0) - estimationBaseAmount
                : estimationBaseAmount * 0.18
        ) ??
        0
    ) || 0;
    const estimationGrandTotal = Number(estimation?.grandTotal ?? 0) || Number((estimationBaseAmount + estimationGstAmount).toFixed(2));
    const isFullQuotationPayment =
        normalizedPaymentRequestType === 'full' &&
        hasCompletedQuotationPayment;
    const isPartialQuotationPayment =
        normalizedPaymentRequestType === 'partial' &&
        hasCompletedQuotationPayment;
    const initialCollectedAmount = Number(orderData.amount || 0);
    const advancePaidAmount = Number(orderData.partialAmountPaid || 0);
    const rawFullAmountPaid = Number(orderData.fullAmountPaid || 0);
    const getQuotationGrandTotal = (quotation) => {
        const qBase = Number(quotation?.baseAmount ?? quotation?.totalAmount ?? 0) || 0;
        const qGst = Number(
            quotation?.gstAmount ??
            (
                Number(quotation?.grandTotal ?? 0) > qBase
                    ? Number(quotation?.grandTotal ?? 0) - qBase
                    : qBase * 0.18
            ) ??
            0
        ) || 0;
        return Number(quotation?.grandTotal ?? 0) || Number((qBase + qGst).toFixed(2));
    };
    const allEstimations = [...(orderData.estimations || [])];
    if (orderData.latestEstimation && !allEstimations.find(e => e._id === orderData.latestEstimation._id)) {
        allEstimations.push(orderData.latestEstimation);
    }
    if (orderData.estimation && !allEstimations.find(e => e._id === orderData.estimation._id)) {
        allEstimations.push(orderData.estimation);
    }
    const sortedEstimations = allEstimations.sort((a, b) => new Date(b.logCreatedDate) - new Date(a.logCreatedDate));
    const hasMultipleQuotations = sortedEstimations.length > 1;
    const isInitialServiceCenterPaymentFlow =
        isServiceCenter &&
        !hasMultipleQuotations &&
        !hasQuotationPaymentContext;
    const serviceCenterAdvancePaidAmount = isInitialServiceCenterPaymentFlow ? advancePaidAmount : 0;
    const serviceCenterFullPaidAmount = isInitialServiceCenterPaymentFlow ? rawFullAmountPaid : 0;
    const serviceCenterCurrentPaidAmount = isInitialServiceCenterPaymentFlow
        ? Number(
            orderData.amount ||
            orderData.partialAmountPaid ||
            orderData.fullAmountPaid ||
            0
        )
        : 0;
    const serviceCenterGrandTotalAmount = isInitialServiceCenterPaymentFlow
        ? Number(orderData.totalAmount || 0)
        : 0;
    const serviceCenterPendingAmount = isInitialServiceCenterPaymentFlow
        ? Math.max(
            Number(
                (
                    serviceCenterGrandTotalAmount -
                    (serviceCenterAdvancePaidAmount + serviceCenterFullPaidAmount || serviceCenterCurrentPaidAmount)
                ).toFixed(2)
            ),
            0
        )
        : 0;
    const earliestQuotation = hasMultipleQuotations ? sortedEstimations[sortedEstimations.length - 1] : null;
    const latestQuotation = sortedEstimations[0] || null;
    const earliestQuotationGrandTotal = getQuotationGrandTotal(earliestQuotation);
    const latestQuotationGrandTotal = getQuotationGrandTotal(latestQuotation);
    const earliestQuotationOriginalAdvance = Number((earliestQuotationGrandTotal * 0.25).toFixed(2));
    const earliestQuotationOriginalPending = Math.max(
        Number((earliestQuotationGrandTotal - earliestQuotationOriginalAdvance).toFixed(2)),
        0
    );
    const latestQuotationOriginalAdvance = Number((latestQuotationGrandTotal * 0.25).toFixed(2));
    const latestQuotationOriginalPending = Math.max(
        Number((latestQuotationGrandTotal - latestQuotationOriginalAdvance).toFixed(2)),
        0
    );
    const paymentStateTargetsLatestQuotation =
        hasCompletedQuotationPayment &&
        (
            !hasMultipleQuotations ||
            ['quotationaccepted', 'quotationrejected', 'paymentrequested', 'paymentreceived', 'workiscompleted'].includes(normalizedOrderStatus)
        );
    const hasRevisedAdvanceSettlement =
        hasMultipleQuotations &&
        isPartialQuotationPayment &&
        paymentStateTargetsLatestQuotation &&
        advancePaidAmount > 0;
    const revisedAdvanceOnlyPaid = hasRevisedAdvanceSettlement
        ? Math.max(Number((advancePaidAmount - earliestQuotationGrandTotal).toFixed(2)), 0)
        : 0;
    const revisedQuotationPendingAfterAdvance = hasRevisedAdvanceSettlement
        ? Math.max(Number((latestQuotationGrandTotal - revisedAdvanceOnlyPaid).toFixed(2)), 0)
        : 0;
    const pendingQuotationAmount = Math.max(Number((estimationGrandTotal - advancePaidAmount).toFixed(2)), 0);
    const singleQuotationRemainingAfterAdvance =
        !hasMultipleQuotations &&
        isFullQuotationPayment &&
        advancePaidAmount > 0 &&
        estimationGrandTotal > 0
            ? pendingQuotationAmount
            : 0;
    const effectiveFullQuotationPaidAmount =
        singleQuotationRemainingAfterAdvance > 0
            ? singleQuotationRemainingAfterAdvance
            : (
                isFullQuotationPayment && estimationGrandTotal > 0
                    ? estimationGrandTotal
                    : rawFullAmountPaid
            );
    const rawDisplayFullPaidAmount =
        isPartialQuotationPayment
            ? pendingQuotationAmount
            : effectiveFullQuotationPaidAmount;
    const rawDisplayTotalPaidAmount =
        isFullQuotationPayment && estimationGrandTotal > 0
            ? (initialCollectedAmount + advancePaidAmount + effectiveFullQuotationPaidAmount)
            : isPartialQuotationPayment
                ? (initialCollectedAmount + advancePaidAmount)
                : isInitialServiceCenterPaymentFlow
                    ? (serviceCenterAdvancePaidAmount + serviceCenterFullPaidAmount || serviceCenterCurrentPaidAmount)
                    : Number(orderData.amount || 0);
    const displayPaymentRequestAmount =
        isFullQuotationPayment && estimationGrandTotal > 0
            ? effectiveFullQuotationPaidAmount
            : isPartialQuotationPayment
                ? advancePaidAmount
                : Number(orderData.paymentRequest?.amount || 0);

    const paymentFlowRows = [];
    if (initialCollectedAmount > 0 && !isInitialServiceCenterPaymentFlow) {
        paymentFlowRows.push({ label: 'Initial Booking Payment', amount: initialCollectedAmount });
    }
    if (hasMultipleQuotations) {
        if (earliestQuotationOriginalAdvance > 0 && advancePaidAmount > 0) {
            paymentFlowRows.push({ label: 'First Quotation Advance Paid', amount: earliestQuotationOriginalAdvance });
        }
        if ((hasRevisedAdvanceSettlement || isFullQuotationPayment) && earliestQuotationOriginalPending > 0) {
            paymentFlowRows.push({ label: 'First Quotation Remaining Paid', amount: earliestQuotationOriginalPending });
        }
        if (isFullQuotationPayment && latestQuotationOriginalAdvance > 0) {
            paymentFlowRows.push({ label: 'Revised Quotation Advance Paid', amount: latestQuotationOriginalAdvance });
        }
        if (isFullQuotationPayment && latestQuotationOriginalPending > 0) {
            paymentFlowRows.push({ label: 'Amount received (revised quotation balance)', amount: latestQuotationOriginalPending });
        } else if (hasRevisedAdvanceSettlement && revisedAdvanceOnlyPaid > 0) {
            paymentFlowRows.push({ label: 'Revised Quotation Advance Paid', amount: revisedAdvanceOnlyPaid });
        }
    } else if (isInitialServiceCenterPaymentFlow) {
        if (serviceCenterAdvancePaidAmount > 0) {
            paymentFlowRows.push({ label: 'Initial Booking Advance Paid', amount: serviceCenterAdvancePaidAmount });
        }
        if (serviceCenterFullPaidAmount > 0) {
            paymentFlowRows.push({
                label:
                    serviceCenterAdvancePaidAmount > 0
                        ? 'Amount received (remaining booking payment)'
                        : 'Amount received (full booking payment)',
                amount: serviceCenterFullPaidAmount
            });
        } else if (serviceCenterCurrentPaidAmount > 0 && serviceCenterAdvancePaidAmount <= 0) {
            paymentFlowRows.push({ label: 'Initial Booking Payment', amount: serviceCenterCurrentPaidAmount });
        }
    } else {
        if (isPartialQuotationPayment && advancePaidAmount > 0) {
            paymentFlowRows.push({ label: 'Quotation Advance Paid', amount: advancePaidAmount });
        }
        if (isFullQuotationPayment && rawDisplayFullPaidAmount > 0) {
            paymentFlowRows.push({ label: 'Amount received (quotation balance)', amount: rawDisplayFullPaidAmount });
        } else if (!isPartialQuotationPayment && rawFullAmountPaid > 0) {
            paymentFlowRows.push({ label: 'Amount received (additional payment)', amount: rawFullAmountPaid });
        }
    }
    const uniquePaymentFlowRows = paymentFlowRows.filter((item, index, rows) =>
        rows.findIndex((row) =>
            row.label === item.label &&
            Number(row.amount || 0) === Number(item.amount || 0)
        ) === index
    );
    const paymentFlowTotal = Number(uniquePaymentFlowRows.reduce((sum, item) => sum + Number(item.amount || 0), 0).toFixed(2));
    const displayTotalPaidAmount = paymentFlowTotal > 0 ? paymentFlowTotal : rawDisplayTotalPaidAmount;
    const summaryPrimaryLabel =
        isInitialServiceCenterPaymentFlow && serviceCenterAdvancePaidAmount > 0
            ? 'Advance paid (initial booking)'
            : isInitialServiceCenterPaymentFlow && serviceCenterFullPaidAmount > 0
                ? 'Amount received (full booking payment)'
        : hasMultipleQuotations && isFullQuotationPayment
            ? 'Amount received (revised balance)'
            : hasMultipleQuotations && hasRevisedAdvanceSettlement
                ? 'Advance paid (revised quotation)'
                : Number(orderData.partialAmountPaid) > 0
                    ? 'Advance paid'
                    : 'Amount paid';
    const summaryPrimaryAmount =
        isInitialServiceCenterPaymentFlow && serviceCenterAdvancePaidAmount > 0
            ? serviceCenterAdvancePaidAmount
            : isInitialServiceCenterPaymentFlow && serviceCenterFullPaidAmount > 0
                ? serviceCenterFullPaidAmount
        : hasMultipleQuotations && isFullQuotationPayment
            ? latestQuotationOriginalPending
            : hasMultipleQuotations && hasRevisedAdvanceSettlement
                ? revisedAdvanceOnlyPaid
                : Number(orderData.partialAmountPaid || 0);
    const summarySecondaryLabel =
        isInitialServiceCenterPaymentFlow
            ? 'Remaining balance on booking'
        : hasMultipleQuotations && isFullQuotationPayment
            ? 'Advance on revised quotation'
            : isPartialQuotationPayment
                ? 'Balance still due'
                : 'Amount received recently';
    const summarySecondaryAmount =
        isInitialServiceCenterPaymentFlow
            ? serviceCenterPendingAmount
        : hasMultipleQuotations && isFullQuotationPayment
            ? latestQuotationOriginalAdvance
            : rawDisplayFullPaidAmount;

    // Robust Name Detection
    const providerDisplayName = provider.businessName ||
        provider.business_name ||
        (provider.firstName ? `${provider.firstName} ${provider.lastName || ''}`.trim() : null) ||
        provider.name;

    return (
        <PageContainer title="Order Details" description="View order tracking and details">
            <Breadcrumb title="Order Details" items={BCrumb} />
            <Container maxWidth="lg">
                <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
                    <Button
                        startIcon={<IconArrowLeft />}
                        onClick={() => navigate(-1)}
                        variant="outlined"
                        color="primary"
                    >
                        Back to Bookings
                    </Button>
                    {['workIsCompleted', 'completed', 'workCompleted'].includes(orderData.status || orderData.orderStatus) && (
                        <>
                            <Button
                                startIcon={<IconReceipt2 />}
                                onClick={() => window.open(customerInvoiceUrl, '_blank')}
                                variant="contained"
                                color="success"
                                sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                            >
                                Customer Invoice
                            </Button>
                            <Button
                                startIcon={<IconReceipt2 />}
                                onClick={() => window.open(partnerInvoiceUrl, '_blank')}
                                variant="contained"
                                color="secondary"
                                sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                            >
                                Partner Invoice
                            </Button>
                        </>
                    )}
                </Stack>

                <Grid container spacing={3}>
                    {/* Left Column: Details and Estimation */}
                    <Grid item xs={12} lg={8}>

                        {orderData.slaFlag && (
                            <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(244, 67, 54, 0.1)', border: '1px solid #f44336', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <IconInfoCircle color="#f44336" />
                                    <Box>
                                        <Typography variant="h6" color="error.main" fontWeight="600">SLA Breach Detected</Typography>
                                        <Typography variant="body2" color="error.main">{orderData.slaReason}</Typography>
                                    </Box>
                                </Stack>
                                <Button variant="contained" color="error" size="small" onClick={handleClearSla}>
                                    Resolve
                                </Button>
                            </Paper>
                        )}

                        {/* Order Header Card */}
                        <Card elevation={3} sx={{ mb: 3, borderRadius: '12px' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Typography variant="h4" fontWeight="700">
                                            Order #{orderData.orderId || orderData._id?.slice(-8).toUpperCase()}
                                        </Typography>
                                        {(orderData.status || orderData.orderStatus) !== 'sendQuotation' && (
                                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                                <InputLabel id="status-select-label">Status</InputLabel>
                                                <Select
                                                    labelId="status-select-label"
                                                    id="status-select"
                                                    value={getDropdownValue(orderData.status || orderData.orderStatus)}
                                                    label="Status"
                                                    onChange={handleStatusChange}
                                                    disabled={updatingStatus}
                                                    endAdornment={updatingStatus && <CircularProgress size={20} sx={{ mr: 4 }} />}
                                                    sx={{
                                                        fontWeight: '600',
                                                        borderRadius: '8px',
                                                        '.MuiSelect-select': {
                                                            color: ['workIsCompleted', 'completed', 'quotationAccepted', 'appointmentConfirmedByProvider'].includes(orderData.status || orderData.orderStatus) ? 'success.main' :
                                                                ['cancelledByUser', 'cancelledByProvider', 'cancelled', 'quotationRejected', 'missed'].includes(orderData.status || orderData.orderStatus) ? 'error.main' :
                                                                    ['payment_pending'].includes(orderData.status || orderData.orderStatus) ? 'secondary.main' :
                                                                        ['pending', 'orderAcceptedByAdmin'].includes(orderData.status || orderData.orderStatus) ? 'warning.main' :
                                                                            ['sendQuotation', 'assignToProvider', 'rescheduleByProvider'].includes(orderData.status || orderData.orderStatus) ? 'info.main' : 'primary.main'
                                                        }
                                                    }}
                                                >
                                                    {granularPartnerStatuses.map((status) => (
                                                        <MenuItem key={status.key} value={status.key}>
                                                            <Typography variant="body2" fontWeight="600">{status.label}</Typography>
                                                        </MenuItem>
                                                    ))}
                                                    {/* Show current status if it's not in the selectable list (e.g. handled by other flows) */}
                                                    {![...granularPartnerStatuses.map(s => s.key)].includes(getDropdownValue(orderData.status || orderData.orderStatus)) && (
                                                        <MenuItem value={getDropdownValue(orderData.status || orderData.orderStatus)} disabled>
                                                            <Typography variant="body2" fontWeight="600">
                                                                {formatStatus(orderData.status || orderData.orderStatus)} (Auto-tracked)
                                                            </Typography>
                                                        </MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>
                                        )}
                                    </Stack>
                                    <Box display="flex" gap={1}>
                                        <Tooltip title={customer.phone ? "Chat with Customer" : "No customer contact available"}>
                                            <span>
                                                <IconButton
                                                    onClick={() => window.open(`https://wa.me/${customer.phone}`, '_blank')}
                                                    sx={{
                                                        backgroundColor: '#25D366',
                                                        color: '#fff',
                                                        '&:hover': { backgroundColor: '#1da851' },
                                                        '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' }
                                                    }}
                                                    disabled={!customer.phone}
                                                >
                                                    <IconBrandWhatsapp size={20} />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </Box>
                                </Box>
                                <Typography variant="caption" color="textSecondary">
                                    Placed on: {orderData.createdAt ? format(new Date(orderData.createdAt), 'MMM dd, yyyy hh:mm a') : 'N/A'}
                                </Typography>

                                <Divider sx={{ my: 3 }} />

                                <Grid container spacing={3}>
                                    {/* Customer Details */}
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                            <IconUser size={22} color="#5D87FF" />
                                            <Typography variant="h6" fontWeight="600">Customer</Typography>
                                        </Stack>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(9, 29, 36, 0.96)',
                                                borderColor: 'rgba(24, 197, 188, 0.14)'
                                            }}
                                        >
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar src={customer.image} sx={{ width: 50, height: 50 }}>{customer.name?.charAt(0)}</Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="700" color="#e8fffb">{customer.name || 'N/A'}</Typography>
                                                    <Typography variant="body2" color="rgba(233, 255, 251, 0.72)">{customer.phone || 'N/A'}</Typography>
                                                    <Typography variant="body2" color="rgba(233, 255, 251, 0.72)">{customer.email || 'N/A'}</Typography>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    </Grid>

                                    {/* Provider Details */}
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                            <IconTruckDelivery size={22} color="#009688" />
                                            <Typography variant="h6" fontWeight="600">Assigned Partner</Typography>
                                        </Stack>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(9, 29, 36, 0.96)',
                                                borderColor: 'rgba(24, 197, 188, 0.14)'
                                            }}
                                        >
                                            {providerDisplayName ? (
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar
                                                        src={provider.image ? (provider.image.startsWith('http') ? provider.image : `${mediaBase}/${String(provider.image).replace(/^\//, '')}`) : undefined}
                                                        sx={{ width: 50, height: 50 }}
                                                    >
                                                        {providerDisplayName.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="700" color="#e8fffb">{providerDisplayName}</Typography>
                                                        <Typography variant="body2" color="rgba(233, 255, 251, 0.72)">
                                                            {provider.phone || 'Contact N/A'}
                                                        </Typography>
                                                        <Typography variant="body2" color="#18c5bc" fontWeight="600">
                                                            {provider.providerRating || provider.rating || '5.0'} &#9733; Rating
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            ) : (
                                                <Box py={1.5} textAlign="center">
                                                    <Typography color="rgba(233, 255, 251, 0.72)" variant="body2">No partner assigned yet</Typography>
                                                </Box>
                                            )}
                                        </Paper>
                                    </Grid>

                                    {/* Booking Address */}
                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                            <IconMapPin size={22} color="#E91E63" />
                                            <Typography variant="h6" fontWeight="600">Booking Address</Typography>
                                        </Stack>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(9, 29, 36, 0.96)',
                                                borderColor: 'rgba(24, 197, 188, 0.14)'
                                            }}
                                        >
                                            {(() => {
                                                // API returns address as a populated object under orderData.address
                                                const addr = typeof orderData.address === 'object' && orderData.address !== null
                                                    ? orderData.address
                                                    : null;

                                                if (!addr) {
                                                    return <Typography variant="body2" color="rgba(233, 255, 251, 0.72)">No address available</Typography>;
                                                }

                                                return (
                                                    <Stack spacing={0.5}>
                                                        {addr.name && (
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Typography variant="subtitle2" fontWeight={700} color="#e8fffb">
                                                                    {addr.name}
                                                                </Typography>
                                                                {addr.phone && (
                                                                    <Typography variant="body2" color="rgba(233, 255, 251, 0.72)">
                                                                        &middot; {addr.phone}
                                                                    </Typography>
                                                                )}
                                                                {addr.type && (
                                                                    <Chip label={addr.type} size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                                                                )}
                                                            </Stack>
                                                        )}
                                                        {[addr.flat, addr.area].filter(Boolean).length > 0 && (
                                                            <Typography variant="body2" color="rgba(233, 255, 251, 0.72)">
                                                                {[addr.flat, addr.area].filter(Boolean).join(', ')}
                                                            </Typography>
                                                        )}
                                                        {addr.addressLineOne && (
                                                            <Typography variant="body2" color="rgba(233, 255, 251, 0.72)">
                                                                {addr.addressLineOne}
                                                            </Typography>
                                                        )}
                                                        <Typography variant="body2" fontWeight={600} color="#e8fffb">
                                                            {[addr.cityName, addr.stateName, addr.postalCode].filter(Boolean).join(' - ')}
                                                        </Typography>
                                                    </Stack>
                                                );
                                            })()}
                                        </Paper>
                                    </Grid>

                                    {/* Service Details */}
                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                            <IconBriefcase size={22} color="#5D87FF" />
                                            <Typography variant="h6" fontWeight="600">Service Items & Pricing</Typography>
                                        </Stack>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(9, 29, 36, 0.96)',
                                                borderColor: 'rgba(24, 197, 188, 0.14)'
                                            }}
                                        >
                                            {selectedServiceRatesList.length > 0 ? (
                                                <Stack spacing={2}>
                                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                                        <Avatar src={displayServiceImage} variant="rounded" sx={{ width: 60, height: 60 }}><IconBriefcase /></Avatar>
                                                        <Box flexGrow={1}>
                                                            <Typography variant="subtitle2" color="rgba(233, 255, 251, 0.72)" fontWeight={600}>
                                                                Selected services (from checkout)
                                                            </Typography>
                                                            <Typography variant="body2" color="rgba(233, 255, 251, 0.72)" sx={{ mt: 0.5 }}>
                                                                {displayServiceCategory}
                                                            </Typography>
                                                        </Box>
                                                        <Box textAlign="right">
                                                            <Typography variant="caption" color="rgba(233, 255, 251, 0.72)" display="block">Order payment</Typography>
                                                            <Typography variant="h5" color="secondary.main" fontWeight="700">&#8377;{orderData.totalAmount || orderData.amount || '0'}</Typography>
                                                            <Chip
                                                                label={orderData.paymentStatus?.toUpperCase() || 'UNPAID'}
                                                                size="small"
                                                                color={orderData.paymentStatus === 'paid' ? 'success' : 'warning'}
                                                                sx={{ mt: 0.5, fontWeight: '700' }}
                                                            />
                                                        </Box>
                                                    </Stack>
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell sx={{ fontWeight: 700, color: '#e8fffb', borderColor: 'rgba(24, 197, 188, 0.14)' }}>Service / rate line</TableCell>
                                                                    <TableCell align="right" sx={{ fontWeight: 700, color: '#e8fffb', borderColor: 'rgba(24, 197, 188, 0.14)' }}>Qty</TableCell>
                                                                    <TableCell align="right" sx={{ fontWeight: 700, color: '#e8fffb', borderColor: 'rgba(24, 197, 188, 0.14)' }}>Line (&#8377;)</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {selectedServiceRatesList.map((row, idx) => {
                                                                    const label = String(row.name || row.title || '—').trim();
                                                                    const qty = Math.max(1, Number(row.quantity) || 1);
                                                                    const linePrice = Number(row.price) || 0;
                                                                    return (
                                                                        <TableRow key={`${label}-${idx}`}>
                                                                            <TableCell>{label}</TableCell>
                                                                            <TableCell align="right">{qty}</TableCell>
                                                                            <TableCell align="right">
                                                                                {(linePrice * qty).toFixed(0)}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                    <Typography variant="caption" color="textSecondary">
                                                        Line totals are indicative (name + price × qty from booking snapshot). Platform / inspection fees may be separate on the order.
                                                    </Typography>
                                                </Stack>
                                            ) : (
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar src={displayServiceImage} variant="rounded" sx={{ width: 60, height: 60 }}><IconBriefcase /></Avatar>
                                                    <Box flexGrow={1}>
                                                        <Typography variant="subtitle1" fontWeight="700">{displayServiceName}</Typography>
                                                        <Typography variant="body2" color="textSecondary">{displayServiceCategory}</Typography>
                                                    </Box>
                                                    <Box textAlign="right">
                                                        <Typography variant="h5" color="secondary.main" fontWeight="700">&#8377;{orderData.totalAmount || orderData.amount || '0'}</Typography>
                                                        <Chip
                                                            label={orderData.paymentStatus?.toUpperCase() || 'UNPAID'}
                                                            size="small"
                                                            color={orderData.paymentStatus === 'paid' ? 'success' : 'warning'}
                                                            sx={{ mt: 0.5, fontWeight: '700' }}
                                                        />
                                                    </Box>
                                                </Stack>
                                            )}
                                        </Paper>
                                    </Grid>

                                    {/* Transaction Details */}
                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2} mt={1}>
                                            <IconCreditCard size={22} color="#5D87FF" />
                                            <Typography variant="h6" fontWeight="600">Transaction Details</Typography>
                                        </Stack>
                                        <Paper variant="outlined" sx={{ p: 0, borderRadius: '12px', overflow: 'hidden', border: '1px solid', borderColor: 'rgba(24, 197, 188, 0.14)', bgcolor: 'rgba(9, 29, 36, 0.96)' }}>
                                            <Box p={2} sx={{ bgcolor: 'rgba(9, 29, 36, 0.96)', borderBottom: '1px solid', borderColor: 'rgba(24, 197, 188, 0.14)' }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={4}>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Typography variant="subtitle2" color="rgba(233, 255, 251, 0.72)">Status:</Typography>
                                                            <Chip
                                                                label={orderData.paymentStatus?.toUpperCase() || 'PENDING'}
                                                                size="small"
                                                                color={orderData.paymentStatus === 'paid' || orderData.paymentStatus === 'Success' ? 'success' : 'warning'}
                                                                sx={{ fontWeight: '700', borderRadius: '6px' }}
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Typography variant="subtitle2" color="rgba(233, 255, 251, 0.72)">Method:</Typography>
                                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                                {orderData.paymentMethod?.toLowerCase() === 'wallet' ? <IconWallet size={16} /> : <IconCoin size={16} />}
                                                                <Typography variant="subtitle2" fontWeight="700">
                                                                    {orderData.paymentMethod?.toUpperCase() || 'COD'}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Typography variant="subtitle2" color="rgba(233, 255, 251, 0.72)">Txn ID:</Typography>
                                                            <Typography variant="subtitle2" fontWeight="700" sx={{ wordBreak: 'break-all', color: 'primary.main' }}>
                                                                {orderData.paymentTransactionId || orderData.paymentId || 'N/A'}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            <Box p={2.5}>
                                                <Grid container spacing={3} justifyContent="flex-end">
                                                    {summaryPrimaryAmount > 0 && (
                                                        <Grid item xs={12} sm={4}>
                                                            <Typography variant="caption" color="textSecondary" fontWeight="600" gutterBottom display="block">{summaryPrimaryLabel}</Typography>
                                                            <Typography variant="subtitle1" fontWeight="700">&#8377;{summaryPrimaryAmount}</Typography>
                                                        </Grid>
                                                    )}
                                                    {summarySecondaryAmount > 0 && (
                                                        <Grid item xs={12} sm={4}>
                                                            <Typography variant="caption" color="textSecondary" fontWeight="600" gutterBottom display="block">
                                                                {summarySecondaryLabel}
                                                            </Typography>
                                                            <Typography variant="subtitle1" fontWeight="700">&#8377;{summarySecondaryAmount}</Typography>
                                                        </Grid>
                                                    )}
                                                    <Grid item xs={12} sm={4}>
                                                        <Typography variant="caption" color="primary.main" fontWeight="600" gutterBottom display="block">Total paid so far</Typography>
                                                        <Typography variant="h5" fontWeight="800" color="primary.main">&#8377;{displayTotalPaidAmount}</Typography>
                                                    </Grid>
                                                </Grid>
                                                {uniquePaymentFlowRows.length > 0 && (
                                                    <Box mt={3} p={1.5} sx={{ bgcolor: 'rgba(6, 24, 30, 0.96)', borderRadius: '8px', border: '1px dashed', borderColor: 'rgba(24, 197, 188, 0.2)' }}>
                                                        <Typography variant="subtitle2" fontWeight="700" mb={1.25} color="#e8fffb">
                                                            How payments add up
                                                        </Typography>
                                                        <Stack spacing={0.75}>
                                                            {uniquePaymentFlowRows.map((item, index) => (
                                                                <Stack key={`${item.label}-${index}`} direction="row" justifyContent="space-between" alignItems="center">
                                                                    <Typography variant="body2" color="rgba(233, 255, 251, 0.72)">{item.label}</Typography>
                                                                    <Typography variant="body2" fontWeight="700">&#8377;{Number(item.amount || 0).toFixed(2)}</Typography>
                                                                </Stack>
                                                            ))}
                                                            <Divider sx={{ my: 0.5 }} />
                                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                <Typography variant="subtitle2" fontWeight="700" color="#e8fffb">Total collected</Typography>
                                                                <Typography variant="subtitle2" fontWeight="800" color="primary.main">&#8377;{displayTotalPaidAmount.toFixed(2)}</Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Box>
                                                )}
                                                {orderData.paymentRequest && Number(orderData.paymentRequest.amount) > 0 && (
                                                    <Box mt={3} p={1.5} sx={{ bgcolor: 'rgba(24, 197, 188, 0.08)', borderRadius: '8px', border: '1px solid rgba(24, 197, 188, 0.35)' }}>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                            <Box>
                                                                <Typography variant="subtitle2" color="#18c5bc" fontWeight="700">
                                                                    {['paid', 'completed'].includes(normalizedPaymentRequestStatus)
                                                                        ? 'Latest payment from customer'
                                                                        : 'Payment request (awaiting customer)'}
                                                                </Typography>
                                                                <Typography variant="caption" color="rgba(233, 255, 251, 0.72)">
                                                                    {['paid', 'completed'].includes(normalizedPaymentRequestStatus)
                                                                        ? 'Amount received recently'
                                                                        : orderData.paymentRequest.type === 'partial'
                                                                            ? 'Advance requested from customer'
                                                                            : 'Balance / remainder requested from customer'}
                                                                </Typography>
                                                            </Box>
                                                            <Box textAlign="right">
                                                                <Typography variant="h6" color="#18c5bc" fontWeight="800">&#8377;{displayPaymentRequestAmount}</Typography>
                                                                <Chip
                                                                    label={orderData.paymentRequest.status?.toUpperCase() || 'PENDING'}
                                                                    size="small"
                                                                    color={['paid', 'completed'].includes(normalizedPaymentRequestStatus) ? 'success' : 'warning'}
                                                                    sx={{ fontWeight: 'bold' }}
                                                                />
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Paper>
                                    </Grid>

                                    {/* Customer Rating & Review */}
                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2} mt={1}>
                                            <IconInfoCircle size={22} color="#FF9800" />
                                            <Typography variant="h6" fontWeight="600">Rate & Review</Typography>
                                        </Stack>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(9, 29, 36, 0.96)', borderColor: 'rgba(24, 197, 188, 0.14)' }}>
                                            {submittedReview ? (
                                                <Stack spacing={1.25}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="subtitle1" fontWeight="700" color="#e8fffb">
                                                            {Number(submittedReview.rating || 0).toFixed(1)} / 5
                                                        </Typography>
                                                        <Chip
                                                            label="SUBMITTED"
                                                            size="small"
                                                            color="success"
                                                            sx={{ fontWeight: 700 }}
                                                        />
                                                    </Stack>
                                                    <Typography variant="body2" color="rgba(233, 255, 251, 0.72)">
                                                        {submittedReview.description || 'No review comment provided.'}
                                                    </Typography>
                                                    <Divider />
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="caption" color="rgba(233, 255, 251, 0.72)" fontWeight={600}>Mapped Service</Typography>
                                                            <Typography variant="body2" fontWeight={700} color="#e8fffb">
                                                                {submittedReview.serviceName || displayServiceName || 'N/A'}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="caption" color="rgba(233, 255, 251, 0.72)" fontWeight={600}>Mapped Provider</Typography>
                                                            <Typography variant="body2" fontWeight={700} color="#e8fffb">
                                                                {submittedReview.providerName || providerDisplayName || 'N/A'}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Stack>
                                            ) : (
                                                <Typography variant="body2" color="rgba(233, 255, 251, 0.72)">
                                                    Customer has not submitted any rating or review for this booking yet.
                                                </Typography>
                                            )}
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Quotation / Estimation Section */}
                        {(orderData.latestEstimation || (orderData.estimations && orderData.estimations.length > 0) || orderData.estimation) && (
                            <Box sx={{ mt: 1 }}>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                    <IconReceipt2 size={24} color="#007367" />
                                    <Typography variant="h6" fontWeight="600">Quotations & Estimations</Typography>
                                </Stack>

                                {(() => {
                                    const sortedEST = sortedEstimations;
                                    const paymentStateTargetsPreviousQuotation =
                                        hasCompletedQuotationPayment &&
                                        hasMultipleQuotations &&
                                        !paymentStateTargetsLatestQuotation;
                                    const earliestQuotationSettledPortion = hasRevisedAdvanceSettlement
                                        ? Math.min(earliestQuotationGrandTotal, advancePaidAmount)
                                        : 0;
                                    const earliestQuotationPendingAfterAdvance = Math.max(
                                        Number((earliestQuotationGrandTotal - earliestQuotationSettledPortion).toFixed(2)),
                                        0
                                    );

                                    return sortedEST.map((est, index) => {
                                        const isLatestQuotation = index === 0;
                                        const isPreviousQuotation = index === sortedEST.length - 1;
                                        const showPaidQuotationState =
                                            (paymentStateTargetsLatestQuotation && isLatestQuotation) ||
                                            (paymentStateTargetsPreviousQuotation && isPreviousQuotation);
                                        const showPreviousQuotationSettledState =
                                            hasRevisedAdvanceSettlement &&
                                            isPreviousQuotation &&
                                            earliestQuotationPendingAfterAdvance <= 0.01;
                                        const showLatestRevisedAdvanceState =
                                            hasRevisedAdvanceSettlement &&
                                            isLatestQuotation;
                                        const showQuotationSentState =
                                            !showPaidQuotationState &&
                                            !showPreviousQuotationSettledState &&
                                            isLatestQuotation &&
                                            ['sendquotation', 'quoted', 'quotation', 'quotationpending'].includes(normalizedOrderStatus);
                                        const quotationChipLabel = showLatestRevisedAdvanceState
                                            ? 'ADVANCE PAID'
                                            : showPreviousQuotationSettledState
                                                ? 'ADVANCE PAID'
                                            : showPaidQuotationState
                                                ? (isPartialQuotationPayment ? 'ADVANCE PAID' : 'PAID')
                                            : showQuotationSentState
                                                ? 'QUOTATION SENT'
                                                : (est.status?.toUpperCase() || 'PENDING');

                                        return (
                                        <Card key={est._id || index} elevation={3} sx={{ borderRadius: '12px', mb: 3, border: index === 0 ? '2px solid #007367' : 'none' }}>
                                            <Paper sx={{ p: 2, bgcolor: index === 0 ? '#007367' : 'grey.200', color: index === 0 ? '#fff' : 'text.primary', borderRadius: '12px 12px 0 0' }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Typography variant="subtitle1" fontWeight="700">
                                                            Quotation {sortedEST.length - index} {index === 0 && '(Latest)'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                            {est.date} {est.time}
                                                        </Typography>
                                                    </Stack>
                                                    <Chip
                                                        label={quotationChipLabel}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: (showPaidQuotationState || showPreviousQuotationSettledState)
                                                                ? (index === 0 ? '#DCFCE7' : '#2E7D32')
                                                                : showQuotationSentState
                                                                    ? (index === 0 ? '#FFF4E5' : '#ED6C02')
                                                                : index === 0
                                                                    ? 'rgba(255,255,255,0.9)'
                                                                    : '#007367',
                                                            color: (showPaidQuotationState || showPreviousQuotationSettledState)
                                                                ? (index === 0 ? '#166534' : '#fff')
                                                                : showQuotationSentState
                                                                    ? (index === 0 ? '#B45309' : '#fff')
                                                                : index === 0
                                                                    ? '#007367'
                                                                    : '#fff',
                                                            fontWeight: '900',
                                                        }}
                                                    />
                                                </Stack>
                                            </Paper>
                                            <CardContent>
                                                <TableContainer component={Box}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Item Description</TableCell>
                                                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {(est.ratedCards || []).map((item, i) => (
                                                                <TableRow key={`rc-${i}`}>
                                                                    <TableCell>
                                                                        <Typography variant="body2">{item.serviceName || item.name || 'Service'}</Typography>
                                                                        {item.quantity > 1 && <Typography variant="caption" color="textSecondary">{item.quantity} units</Typography>}
                                                                    </TableCell>
                                                                    <TableCell align="center"><Chip label="Service" size="small" variant="outlined" color="info" /></TableCell>
                                                                    <TableCell align="right">
                                                                        <Typography variant="body2">&#8377;{(item.price || item.amount || item.rate || 0) * (item.quantity || 1)}</Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                            {(est.spareParts || []).map((item, i) => {
                                                                const up = item.customer_price || item.price || item.amount || 0;
                                                                return (
                                                                    <TableRow key={`sp-${i}`}>
                                                                        <TableCell>
                                                                            <Typography variant="body2">{item.name || item.partName || 'Spare'}</Typography>
                                                                            {item.quantity > 1 && <Typography variant="caption" color="textSecondary">{item.quantity} units</Typography>}
                                                                        </TableCell>
                                                                        <TableCell align="center"><Chip label="Spare Part" size="small" variant="outlined" color="primary" /></TableCell>
                                                                        <TableCell align="right">
                                                                            <Typography variant="body2">&#8377;{up * (item.quantity || 1)}</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })}
                                                            {(est.serviceCards || []).map((item, i) => (
                                                                <TableRow key={`sc-${i}`}>
                                                                    <TableCell>
                                                                        <Typography variant="body2">{item.name || item.cardName || 'Plan'}</Typography>
                                                                    </TableCell>
                                                                    <TableCell align="center"><Chip label="Card" size="small" variant="outlined" color="secondary" /></TableCell>
                                                                    <TableCell align="right">
                                                                        <Typography variant="body2">&#8377;{(item.price || item.amount || 0) * (item.quantity || 1)}</Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>

                                                <Box
                                                    mt={2}
                                                    p={1.5}
                                                    sx={{
                                                        bgcolor: 'rgba(6, 24, 30, 0.96)',
                                                        borderRadius: '8px',
                                                        border: '1px solid rgba(24, 197, 188, 0.14)'
                                                    }}
                                                >
                                                    <Grid container justifyContent="flex-end">
                                                        <Grid item xs={12} md={6}>
                                                            <Stack spacing={0.5}>
                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography variant="body2" color="rgba(233, 255, 251, 0.72)">Base Amount:</Typography>
                                                                    <Typography variant="body2" fontWeight="600" color="#e8fffb">&#8377;{est.baseAmount}</Typography>
                                                                </Stack>
                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography variant="body2" color="rgba(233, 255, 251, 0.72)">GST (18%):</Typography>
                                                                    <Typography variant="body2" fontWeight="600" color="#e8fffb">&#8377;{est.gstAmount}</Typography>
                                                                </Stack>
                                                                <Divider sx={{ my: 0.5 }} />
                                                                <Stack direction="row" justifyContent="space-between">
                                                                    <Typography variant="subtitle1" fontWeight="700" color="#e8fffb">Grand Total:</Typography>
                                                                    <Typography variant="subtitle1" fontWeight="700" color="primary.main">&#8377;{est.grandTotal}</Typography>
                                                                </Stack>
                                                                {(showPaidQuotationState || showPreviousQuotationSettledState) && isPartialQuotationPayment && (
                                                                    <>
                                                                        <Divider sx={{ my: 0.75 }} />
                                                                        <Stack direction="row" justifyContent="space-between">
                                                                            <Typography variant="body2" color="rgba(233, 255, 251, 0.72)">Advance Paid:</Typography>
                                                                            <Typography variant="body2" fontWeight="700" color="success.main">
                                                                                &#8377;{
                                                                                    showLatestRevisedAdvanceState
                                                                                        ? revisedAdvanceOnlyPaid
                                                                                        : showPreviousQuotationSettledState
                                                                                            ? earliestQuotationOriginalAdvance
                                                                                            : advancePaidAmount
                                                                                }
                                                                            </Typography>
                                                                        </Stack>
                                                                        <Stack direction="row" justifyContent="space-between">
                                                                            <Typography variant="body2">Pending Amount:</Typography>
                                                                            <Typography variant="body2" fontWeight="700" color="warning.main">
                                                                                &#8377;{
                                                                                    showLatestRevisedAdvanceState
                                                                                        ? revisedQuotationPendingAfterAdvance
                                                                                        : showPreviousQuotationSettledState
                                                                                            ? earliestQuotationOriginalPending
                                                                                            : pendingQuotationAmount
                                                                                }
                                                                            </Typography>
                                                                        </Stack>
                                                                    </>
                                                                )}
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    )});
                                })()}
                            </Box>
                        )}
                    </Grid>

                    {/* Right Column: Order Timeline */}
                    <Grid item xs={12} lg={4}>
                        <Card elevation={3} sx={{ borderRadius: '12px', bgcolor: 'background.paper' }}>
                            <CardContent>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
                                    <IconHistory size={24} color="#5D87FF" />
                                    <Typography variant="h6" fontWeight="600">Lifecycle Tracking</Typography>
                                </Stack>

                                {statusHistory.length > 0 ? (
                                    <Timeline sx={{ [`& .MuiTimelineItem-root:before`]: { flex: 0, padding: 0 } }}>
                                        {statusHistory.slice().reverse().map((item, index) => {
                                            return (
                                                <TimelineItem key={index}>
                                                    <TimelineSeparator>
                                                        <TimelineDot color={index === 0 ? "primary" : "success"} variant={index === 0 ? "filled" : "outlined"} />
                                                        {index !== statusHistory.length - 1 && <TimelineConnector />}
                                                    </TimelineSeparator>
                                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                                        <Typography variant="subtitle2" fontWeight="700" color={index === 0 ? "primary.main" : "textPrimary"}>
                                                            {formatStatus(item.status)}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                                            {item.statusTextMessage}
                                                        </Typography>

                                                        {/* Time + Eye button row */}
                                                        <Stack direction="row" spacing={0.5} alignItems="center" mb={0.5}>
                                                            <IconInfoCircle size={14} color="#949db2" />
                                                            <Typography variant="caption" color="textSecondary">
                                                                {item.logCreatedDate ? format(new Date(item.logCreatedDate), 'MMM dd, hh:mm a') : 'N/A'}
                                                            </Typography>
                                                            {/* Eye button - only show if there's actor info */}
                                                            {(item.changedByRole || item.changedByName || item.changedByEmail) && (
                                                                <Tooltip title="View actor details">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={(e) => handleActorPopoverOpen(e, item)}
                                                                        sx={{
                                                                            p: 0.3,
                                                                            ml: 0.5,
                                                                            color: 'primary.main',
                                                                            '&:hover': { bgcolor: 'primary.light', color: '#fff' }
                                                                        }}
                                                                    >
                                                                        <IconEye size={14} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Stack>
                                                    </TimelineContent>
                                                </TimelineItem>
                                            );
                                        })}

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
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        p: 2,
                        minWidth: 220,
                        maxWidth: 300,
                    }
                }}
            >
                {activeActorItem && (() => {
                    const role = activeActorItem.changedByRole || 'system';
                    const roleColor = {
                        admin: '#5D87FF',
                        provider: '#13DEB9',
                        user: '#FA896B',
                        system: '#949db2'
                    }[role] || '#949db2';
                    return (
                        <Box>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                                <Box sx={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    bgcolor: `${roleColor}22`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <IconUser size={18} color={roleColor} />
                                </Box>
                                <Box>
                                    <Chip
                                        label={role.toUpperCase()}
                                        size="small"
                                        sx={{
                                            height: 18, fontSize: '0.65rem', fontWeight: 700,
                                            bgcolor: roleColor, color: '#fff', borderRadius: '4px'
                                        }}
                                    />
                                    <Typography variant="subtitle2" fontWeight="700" mt={0.3}>
                                        {activeActorItem.changedByName || activeActorItem.createdByName || 'Unknown'}
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
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
                    {['cancelledByUser', 'cancelledByProvider'].includes(pendingStatusChange)
                        ? `Cancellation Details`
                        : `Reschedule Details`}
                </DialogTitle>
                <DialogContent>
                    {['cancelledByUser', 'cancelledByProvider'].includes(pendingStatusChange) && (
                        <Box mt={1}>
                            <Typography variant="body2" color="textSecondary" mb={2}>
                                You are marking this booking as <strong>
                                    {pendingStatusChange === 'cancelledByUser' ? 'Cancelled by User' : 'Cancelled by Provider'}
                                </strong>. Please provide a reason.
                            </Typography>
                            <TextField
                                label="Cancellation Reason"
                                multiline
                                rows={3}
                                fullWidth
                                required
                                value={cancellationReason}
                                onChange={(e) => setCancellationReason(e.target.value)}
                                placeholder="e.g. Customer not available, Provider unavailable..."
                                sx={{ mt: 1 }}
                            />
                        </Box>
                    )}

                    {['rescheduleByProvider'].includes(pendingStatusChange) && (
                        <Box mt={1}>
                            <Typography variant="body2" color="textSecondary" mb={2}>
                                You are marking this booking as <strong>Rescheduled by Provider</strong>. Please provide the new schedule and reason.
                            </Typography>
                            <Stack spacing={2} mt={1}>
                                <TextField
                                    label="New Date"
                                    type="date"
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                />
                                <TextField
                                    label="New Time"
                                    type="time"
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    value={rescheduleTime}
                                    onChange={(e) => setRescheduleTime(e.target.value)}
                                />
                                <TextField
                                    label="Reason for Reschedule (Optional)"
                                    multiline
                                    rows={2}
                                    fullWidth
                                    value={rescheduleReason}
                                    onChange={(e) => setRescheduleReason(e.target.value)}
                                    placeholder="e.g. Provider had an emergency..."
                                />
                            </Stack>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button onClick={handleDialogClose} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDialogConfirm}
                        variant="contained"
                        color={['cancelledByUser', 'cancelledByProvider'].includes(pendingStatusChange) ? 'error' : 'primary'}
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

export default OrderDetails;

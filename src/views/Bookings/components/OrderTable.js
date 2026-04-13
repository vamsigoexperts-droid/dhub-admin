import React from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Tooltip,
    Typography,
    CircularProgress,
} from '@mui/material';
import { IconEye, IconUserPlus, IconBrandWhatsapp } from '@tabler/icons-react';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';

/** Same “attention required” treatment as SLA / Order Accepted By Admin (red row + ATTENTION filter). */
const isAttentionRequiredRow = (order, orderType) => {
    const raw = orderType === 'professional' ? order.orderStatus : order.status;
    const s = (raw || '').toString().toLowerCase();
    return (
        order.slaFlag === true ||
        s === 'orderacceptedbyadmin' ||
        s === 'cancelledbyprovider'
    );
};

const OrderTable = ({
    orders = [],
    loading = false,
    onViewOrder,
    onAssignProvider,
    orderType = 'verified',
    page = 0,
    rowsPerPage = 10,
    totalCount = 0,
    onPageChange,
    onRowsPerPageChange,
}) => {
    const formatDate = (date) => {
        if (!date) return '-';
        try {
            return format(new Date(date), 'dd/MM/yyyy hh:mm a');
        } catch (error) {
            return '-';
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0';
        return `₹${parseFloat(amount).toFixed(2)}`;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (orders.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="textSecondary">
                    No orders found
                </Typography>
            </Box>
        );
    }

    return (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'grey.100' }}>
                            <TableCell sx={{ fontWeight: 700 }}>Sl No</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                            {orderType === 'professional' && (
                                <TableCell sx={{ fontWeight: 700 }}>Provider</TableCell>
                            )}
                            <TableCell sx={{ fontWeight: 700 }}>Service</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Lead Source / Date</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            {orderType !== 'verified' && (
                                <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                            )}
                            <TableCell sx={{ fontWeight: 700 }} align="center">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order, index) => (
                            <TableRow
                                key={order._id}
                                hover
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    borderLeft: isAttentionRequiredRow(order, orderType) ? '8px solid #f44336' : 'inherit',
                                    backgroundColor: isAttentionRequiredRow(order, orderType) ? 'rgba(244, 67, 54, 0.08)' : 'inherit',
                                }}
                            >
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {page * rowsPerPage + index + 1}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600} color="primary">
                                        {order.orderId || order._id?.slice(-8).toUpperCase()}
                                    </Typography>
                                </TableCell>

                                {orderType === 'professional' && (
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>
                                            {order.provider?.businessName || order.providerSnapshot?.businessName || '-'}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {order.provider?.providerPhone || order.providerSnapshot?.phone || ''}
                                        </Typography>
                                    </TableCell>
                                )}

                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {orderType === 'professional'
                                            ? (order.services?.[0]?.serviceName || order.serviceSnapshot?.serviceName || '-')
                                            : (order.service?.serviceName || order.serviceId?.serviceName || '-')}
                                    </Typography>
                                    {orderType === 'professional' &&
                                        (order.services?.[0]?.serviceCategory || order.services?.[0]?.serviceSubcategory) && (
                                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                                            {[
                                                order.services?.[0]?.serviceCategory,
                                                order.services?.[0]?.serviceSubcategory,
                                            ]
                                                .filter(Boolean)
                                                .join(' › ')}
                                        </Typography>
                                    )}
                                    {(order.provider?.businessName || order.providerSnapshot?.businessName) && (
                                        <Typography variant="caption" color="primary.main" sx={{ display: 'block', fontWeight: 600 }}>
                                            Provider: {order.provider?.businessName || order.providerSnapshot?.businessName}
                                        </Typography>
                                    )}
                                    {orderType !== 'professional' && (
                                        <Typography variant="caption" color="textSecondary">
                                            {order.category?.categoryName || order.categoryId?.categoryName || ''}
                                        </Typography>
                                    )}
                                </TableCell>

                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {order.user?.name || order.userId?.name || order.userSnapshot?.name || '-'}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {order.user?.phone || order.userId?.phone || order.userSnapshot?.phone || ''}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                                        {order.sourceOfLead || '-'}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                                        {formatDate(order.createdAt)}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <StatusBadge
                                        status={orderType === 'professional' ? order.orderStatus : order.status}
                                        variant={orderType}
                                    />
                                </TableCell>

                                {orderType !== 'verified' && (
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700} color="success.main">
                                            {formatCurrency(order.totalAmount || order.amount)}
                                        </Typography>
                                    </TableCell>
                                )}

                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#fa896b',
                                                    color: '#fff',
                                                    '&:hover': { backgroundColor: '#d46b50' }
                                                }}
                                                onClick={() => onViewOrder(order)}
                                            >
                                                <IconEye size={18} />
                                            </IconButton>
                                        </Tooltip>

                                        {(orderType === 'verified' || orderType === 'professional') &&
                                            onAssignProvider && (
                                                <Tooltip title={(orderType === 'professional' ? order.orderStatus : order.status) === 'missed' ? "Cannot assign missed booking" : "Assign Provider"}>
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            disabled={(orderType === 'professional' ? order.orderStatus : order.status) === 'missed'}
                                                            sx={{
                                                                backgroundColor: (orderType === 'professional' ? order.orderStatus : order.status) === 'missed' ? '#e0e0e0' : '#009688',
                                                                color: (orderType === 'professional' ? order.orderStatus : order.status) === 'missed' ? '#9e9e9e' : '#fff',
                                                                '&:hover': {
                                                                    backgroundColor: (orderType === 'professional' ? order.orderStatus : order.status) === 'missed' ? '#e0e0e0' : '#00796b'
                                                                },
                                                                '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' }
                                                            }}
                                                            onClick={() => onAssignProvider(order)}
                                                        >
                                                            <IconUserPlus size={18} />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            )}


                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[10, 25, 50, 100]}
            />
        </Paper>
    );
};

export default OrderTable;

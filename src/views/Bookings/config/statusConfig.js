export const granularPartnerStatuses = [
    { key: 'orderAcceptedByAdmin', label: 'Order Accepted By Admin', color: 'warning' },
    { key: 'appointmentConfirmedByProvider', label: 'Appointment Confirmed', color: 'success' },
    { key: 'onTheWay', label: 'On The Way', color: 'primary' },
    { key: 'reachedLocation', label: 'Reached Location', color: 'success' },
    { key: 'workInProgress', label: 'Work In Progress', color: 'primary' },
    { key: 'workIsCompleted', label: 'Work Completed', color: 'success' },
    { key: 'rescheduleByProvider', label: 'Rescheduled By Provider', color: 'info' },
    { key: 'cancelledByUser', label: 'Cancelled By User', color: 'error' },
    { key: 'cancelledByProvider', label: 'Cancelled By Provider', color: 'error' },
];

// Verified Partner Order Status Configurations (For Filters)
export const verifiedPartnerStatuses = [
    {
        key: 'all',
        label: 'All',
        color: 'default',
        route: '/bookings/verified-partner/all',
    },
    {
        key: 'missed',
        label: 'Missed',
        color: 'error',
        route: '/bookings/verified-partner/missed',
    },
    {
        key: 'pending',
        label: 'Pending',
        color: 'warning',
        route: '/bookings/verified-partner/pending',
    },
    {
        key: 'payment_pending',
        label: 'Booking Pending',
        color: 'secondary',
        route: '/bookings/verified-partner/payment-pending',
    },
    {
        key: 'ongoing',
        label: 'Ongoing',
        color: 'primary',
        route: '/bookings/verified-partner/ongoing',
    },
    {
        key: 'completed',
        label: 'Completed',
        color: 'success',
        route: '/bookings/verified-partner/completed',
    },
    {
        key: 'rescheduled',
        label: 'Rescheduled',
        color: 'info',
        route: '/bookings/verified-partner/rescheduled',
    },
    {
        key: 'cancelled',
        label: 'Cancelled',
        color: 'error',
        route: '/bookings/verified-partner/cancelled',
    },
];

// Professional Order Status Configurations
export const professionalOrderStatuses = [
    {
        key: 'all',
        label: 'All',
        color: 'default',
        route: '/bookings/professional/all',
    },
    {
        key: 'pending',
        label: 'Pending',
        color: 'warning',
        route: '/bookings/professional/pending',
    },
    {
        key: 'in-progress',
        label: 'Ongoing / In Progress',
        color: 'primary',
        route: '/bookings/professional/in-progress',
        statuses: ['workInProgress', 'onTheWay', 'reachedLocation', 'assignToProvider', 'acceptedByProvider']
    },
    {
        key: 'completed',
        label: 'Completed',
        color: 'success',
        route: '/bookings/professional/completed',
    },
    {
        key: 'cancelled',
        label: 'Cancelled',
        color: 'error',
        route: '/bookings/professional/cancelled',
    },
    {
        key: 'missed',
        label: 'Missed',
        color: 'secondary',
        route: '/bookings/professional/missed',
    },
];

// CRM Website Booking Status Configurations
export const crmWebsiteStatuses = [
    {
        key: 'all',
        label: 'All',
        color: 'default',
        route: '/bookings/crm-website/all',
    },
    {
        key: 'missed',
        label: 'Missed',
        color: 'error',
        route: '/bookings/crm-website/missed',
    },
    {
        key: 'payment_pending',
        label: 'Booking Pending',
        color: 'secondary',
        route: '/bookings/crm-website/payment-pending',
    },
    {
        key: 'pending',
        label: 'Pending',
        color: 'warning',
        route: '/bookings/crm-website/pending',
    },
    {
        key: 'confirmed',
        label: 'Confirmed',
        color: 'success',
        route: '/bookings/crm-website/confirmed',
    },
    {
        key: 'assignToProvider',
        label: 'Assigned',
        color: 'info',
        route: '/bookings/crm-website/assignToProvider',
    },
    {
        key: 'acceptedByProvider',
        label: 'Ongoing',
        color: 'primary',
        route: '/bookings/crm-website/acceptedByProvider',
    },
    {
        key: 'onTheWay',
        label: 'On The Way',
        color: 'primary',
        route: '/bookings/crm-website/onTheWay',
    },
    {
        key: 'reachedLocation',
        label: 'Reached Location',
        color: 'primary',
        route: '/bookings/crm-website/reachedLocation',
    },
    {
        key: 'workInProgress',
        label: 'Work In Progress',
        color: 'primary',
        route: '/bookings/crm-website/workInProgress',
    },
    {
        key: 'completed',
        label: 'Completed',
        color: 'primary',
        route: '/bookings/crm-website/completed',
    },
    {
        key: 'rescheduled',
        label: 'Rescheduled',
        color: 'info',
        route: '/bookings/crm-website/rescheduled',
    },
    {
        key: 'cancelled',
        label: 'Cancelled',
        color: 'error',
        route: '/bookings/crm-website/cancelled',
    },
    {
        key: 'rejectedByProvider',
        label: 'Rejected',
        color: 'error',
        route: '/bookings/crm-website/rejectedByProvider',
    },
];

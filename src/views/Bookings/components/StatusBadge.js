import React from 'react';
import { Chip } from '@mui/material';

const StatusBadge = ({ status, variant = 'verified' }) => {
    const getStatusConfig = () => {
        const statusLower = status?.toLowerCase() || '';

        // Human-readable status labels
        const labels = {
            assignToProvider: 'Assign To Provider',
            acceptedByProvider: 'Accepted By Provider',
            appointmentConfirmedByProvider: 'Appointment Confirmed',
            onTheWay: 'On The Way',
            reachedLocation: 'Reached Location',
            workInProgress: 'Work In Progress',
            sendQuotation: 'Send Quotation',
            quotationAccepted: 'Quotation Accepted',
            rejectedByProvider: 'Rejected By Provider',
            quotationRejected: 'Quotation Rejected',
        };

        const statusMap = {
            pending: { label: 'Pending', color: 'warning' },
            payment_pending: { label: 'Booking Pending', color: 'secondary' },
            ongoing: { label: 'Ongoing', color: 'primary' },
            completed: { label: 'Completed', color: 'success' },
            cancelled: { label: 'Cancelled', color: 'error' },
            rescheduled: { label: 'Rescheduled', color: 'info' },
            accepted: { label: 'Accepted', color: 'primary' },
            rejected: { label: 'Rejected', color: 'error' },
            missed: { label: 'Missed', color: 'secondary' },

            // Ongoing sub-statuses (Blue/Purple)
            assigntoprovider: { label: labels.assignToProvider, color: 'primary' },
            acceptedbyprovider: { label: labels.acceptedByProvider, color: 'primary' },
            appointmentconfirmedbyprovider: { label: labels.appointmentConfirmedByProvider, color: 'primary' },
            ontheway: { label: labels.onTheWay, color: 'info' },
            reachedlocation: { label: labels.reachedLocation, color: 'success' },
            "on-the-way": { label: labels.onTheWay, color: 'info' }, // safety
            "reached-location": { label: labels.reachedLocation, color: 'success' }, // safety
            workinprogress: { label: labels.workInProgress, color: 'primary' },
            "work-in-progress": { label: labels.workInProgress, color: 'primary' }, // safety
            sendquotation: { label: labels.sendQuotation, color: 'primary' },
            quotationaccepted: { label: labels.quotationAccepted, color: 'primary' },

            // ... other statuses ...
            rejectedbyprovider: { label: labels.rejectedByProvider, color: 'error' },
            quotationrejected: { label: labels.quotationRejected, color: 'error' },
            confirmed: { label: 'Confirmed', color: 'success' },
            assigntoprovider: { label: 'Assigned', color: 'info' },
            acceptedbyprovider: { label: 'Ongoing', color: 'primary' },
            orderacceptedbyadmin: { label: 'Order Accepted By Admin', color: 'warning' },
            cancelledbyprovider: { label: 'Cancelled By Provider', color: 'error' },
        };

        // Professional-specific statuses
        if (variant === 'professional') {
            statusMap['in-progress'] = { label: 'In Progress', color: 'primary' };
            statusMap['work-in-progress'] = { label: 'Work In Progress', color: 'primary' };
            statusMap['inprogress'] = { label: 'In Progress', color: 'primary' };
        }

        const config = statusMap[statusLower] || { label: status, color: 'default' };
        // Safety for specific CRM status labels
        if (statusLower === 'assigntoprovider') config.label = 'Assigned';

        return config;
    };

    const config = getStatusConfig();

    return (
        <Chip
            label={config.label}
            color={config.color}
            size="small"
            sx={{
                fontWeight: 600,
                minWidth: 100,
                textTransform: 'capitalize',
            }}
        />
    );
};

export default StatusBadge;

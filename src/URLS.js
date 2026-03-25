const API_BASE = 'http://192.168.0.5:5013/v1/dhubApi/admin';
//const API_BASE = 'http://192.168.0.5:5013/v1/dhubApi/admin';

// Unified Bookings APIs
const URLS = {
    // Verified Partner Orders
    GetVerifiedPartnerOrders: `${API_BASE}/orders/verified-partner`,
    GetVerifiedPartnerStats: `${API_BASE}/orders/verified-partner/stats`,

    // Professional Orders
    GetProfessionalOrders: `${API_BASE}/orders/professional`,
    GetProfessionalStats: `${API_BASE}/orders/professional/stats`,

    // Analytics
    GetBookingsAnalytics: `${API_BASE}/orders/analytics`,

    // Single Order Details
    GetOrderById: (orderId) => `${API_BASE}/orders/${orderId}`,

    // Assign Provider
    AssignProviderToOrder: (orderId) => `${API_BASE}/orders/${orderId}/assign-provider`,

    // Update Status
    UpdateOrderStatus: (orderId) => `${API_BASE}/orders/${orderId}/status`,

    // Clear SLA
    ClearOrderSla: (orderId) => `${API_BASE}/orders/${orderId}/clear-sla`,
};

export default URLS;


import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze } from '@tabler/icons-react';
import PageContainer from '../../../components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import {
  TextField,
  Avatar,
  Paper,
  Box,
  Typography,
  Divider,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  styled,
  Select,
  MenuItem,
  DialogActions,
  Card,
  CardActionArea,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { URLS } from '../../../Url';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Accepted Orders - Verified Partners' }];

// Styled Components
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  '&.active': {
    '& .status-card': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light + '10',
    },
    '& .status-label': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
}));

const StatusCard = styled(Card)(({ theme }) => ({
  height: '50px',
  border: `2px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  minHeight: 48,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

// Updated Order status configurations with routes for Verified Partners
const orderStatusConfig = [
  {
    key: 'pending',
    label: 'Pending',
    description: 'Orders awaiting response',
    color: 'warning',
    route: '/ondemandservice/verified-partners/pending',
  },
  {
    key: 'accepted',
    label: 'Accepted',
    description: 'Orders accepted by partners',
    color: 'primary',
    route: '/ondemandservice/verified-partners/accepted',
  },
  {
    key: 'work-in-progress',
    label: 'Work In Progress',
    description: 'Services being performed',
    color: 'info',
    route: '/ondemandservice/verified-partners/work-in-progress',
  },
  {
    key: 'completed',
    label: 'Completed',
    description: 'Services completed successfully',
    color: 'success',
    route: '/ondemandservice/verified-partners/completed',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    description: 'Orders cancelled by customer',
    color: 'error',
    route: '/ondemandservice/verified-partners/cancelled',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    description: 'Orders rejected by partner',
    color: 'error',
    route: '/ondemandservice/verified-partners/rejected',
  },
  {
    key: 'missed',
    label: 'Missed',
    description: 'Orders not responded in time',
    color: 'secondary',
    route: '/ondemandservice/verified-partners/missed',
  },
];

// Updated Tab configuration with multiple statuses for ADMIN_ACCEPTED
const TAB_CONFIG = {
  ADMIN_ACCEPTED: {
    value: 0,
    label: 'Accepted by Admin',
    statuses: ['assignToProvider', 'orderAcceptedByAdmin'],
    description: 'Orders accepted by admin and ready for provider assignment',
  },
  PROVIDER_ACCEPTED: {
    value: 1,
    label: 'Accepted by Provider',
    statuses: ['orderAcceptedByProvider'],
    description: 'Orders accepted by providers and ready for service execution',
  },
};

// Main Accepted Orders Component for Verified Partners
const AcceptedOrders = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB_CONFIG.ADMIN_ACCEPTED.value);
  const [tabCounts, setTabCounts] = useState({
    adminAccepted: 0,
    providerAccepted: 0,
  });
  const [formEdit, setFormEdit] = useState({
    _id: '',
    serviceProviderId: '',
    comment: '',
  });

  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];
  const token = authData?.token;

  // Get current tab configuration
  const getCurrentTabConfig = () => {
    return activeTab === TAB_CONFIG.ADMIN_ACCEPTED.value
      ? TAB_CONFIG.ADMIN_ACCEPTED
      : TAB_CONFIG.PROVIDER_ACCEPTED;
  };

  // Fetch bookings for multiple statuses (used for ADMIN_ACCEPTED tab)
  const fetchBookingsForMultipleStatuses = async (statuses) => {
    try {
      const promises = statuses.map((status) =>
        axios.post(
          URLS.GetVerifiedPartnersBookingsByStatus,
          { status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const responses = await Promise.all(promises);

      // Combine all bookings from different statuses
      let allBookings = [];
      responses.forEach((response) => {
        if (response.data.success && response.data.bookings) {
          allBookings = [...allBookings, ...response.data.bookings];
        }
      });

      return allBookings;
    } catch (error) {
      throw error;
    }
  };

  // Fetch bookings data from API based on active tab
  const fetchBookings = async (tabValue = activeTab) => {
    setLoading(true);
    try {
      const tabConfig =
        tabValue === TAB_CONFIG.ADMIN_ACCEPTED.value
          ? TAB_CONFIG.ADMIN_ACCEPTED
          : TAB_CONFIG.PROVIDER_ACCEPTED;

      let allBookings = [];

      if (tabConfig.statuses.length > 1) {
        // Multiple statuses - use the new function
        allBookings = await fetchBookingsForMultipleStatuses(tabConfig.statuses);
      } else {
        // Single status - use existing logic
        const response = await axios.post(
          URLS.GetVerifiedPartnersBookingsByStatus,
          { status: tabConfig.statuses[0] },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.data.success && response.data.bookings) {
          allBookings = response.data.bookings;
        }
      }

      if (allBookings.length > 0) {
        const transformedData = allBookings.map((booking) => ({
          _id: booking._id,
          orderId: booking.orderId,
          customerName: booking.userName,
          customerPhone: booking.userPhone,
          customerEmail: booking.userEmail || 'N/A',
          partnerName: booking.serviceProviderName || 'Unassigned',
          partnerImage: booking.providerImage || '/images/profile/default-avatar.jpg',
          partnerVerificationLevel: booking.providerVerificationLevel || 'Standard Verified',
          partnerRating: booking.providerRating || 4.5,
          serviceName: booking.serviceName,
          serviceCategory: booking.serviceCategory || 'Professional Service',
          orderDate: booking.date,
          orderTime: booking.time,
          bookedDate: booking.bookedDate,
          bookedTime: booking.bookedTime,
          orderValue: booking.amount,
          location: `${booking.addressArea || ''}, ${booking.addressCityName || ''}, ${
            booking.addressStateName || ''
          }`.replace(/^,\s*|,\s*$/g, ''),
          status: booking.status,
          priority: booking.priority || 'medium',
          acceptedAt: booking.acceptedAt ? new Date(booking.acceptedAt).toLocaleString() : 'N/A',
          estimatedServiceDate: booking.estimatedServiceDate || 'To be scheduled',
          responseDeadline: booking.responseDeadline || 'N/A',
          paymentStatus: booking.paymentStatus,
          paymentMethod: booking.paymentMethod,
          ratecards: booking.ratecards || [],
          addressDetails: {
            addressLineOne: booking.addressLineOne,
            addressFlat: booking.addressFlat,
            addressArea: booking.addressArea,
            addressCityName: booking.addressCityName,
            addressStateName: booking.addressStateName,
            addressLatitude: booking.addressLatitude,
            addressLongitude: booking.addressLongitude,
          },
        }));

        // Remove duplicates based on _id (in case same order appears in multiple statuses)
        const uniqueBookings = transformedData.filter(
          (booking, index, self) => index === self.findIndex((b) => b._id === booking._id),
        );

        setBookingsData(uniqueBookings);

        // Update tab counts
        setTabCounts((prev) => ({
          ...prev,
          [tabValue === TAB_CONFIG.ADMIN_ACCEPTED.value ? 'adminAccepted' : 'providerAccepted']:
            uniqueBookings.length,
        }));
      } else {
        toast.error(`No ${tabConfig.label.toLowerCase()} orders found`);
        setBookingsData([]);
      }
    } catch (error) {
      console.error(`Error fetching ${getCurrentTabConfig().label.toLowerCase()}:`, error);
      toast.error(
        error.response?.data?.message ||
          `Failed to fetch ${getCurrentTabConfig().label.toLowerCase()}`,
      );
      setBookingsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch both tab counts for badges
  const fetchTabCounts = async () => {
    try {
      // Fetch admin accepted count (multiple statuses)
      const adminBookings = await fetchBookingsForMultipleStatuses(
        TAB_CONFIG.ADMIN_ACCEPTED.statuses,
      );

      // Remove duplicates for admin count
      const uniqueAdminBookings = adminBookings.filter(
        (booking, index, self) => index === self.findIndex((b) => b._id === booking._id),
      );

      // Fetch provider accepted count (single status)
      const providerResponse = await axios.post(
        URLS.GetVerifiedPartnersBookingsByStatus,
        { status: TAB_CONFIG.PROVIDER_ACCEPTED.statuses[0] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      setTabCounts({
        adminAccepted: uniqueAdminBookings.length,
        providerAccepted: providerResponse.data.success
          ? providerResponse.data.bookings?.length || 0
          : 0,
      });
    } catch (error) {
      console.error('Error fetching tab counts:', error);
    }
  };

  // Fetch service providers based on order ID
  const fetchServiceProviders = async (orderId) => {
    setLoadingProviders(true);
    try {
      const response = await axios.post(
        URLS.GetServiceProvidersBasedOnId,
        {
          bookingId: orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success && response.data.data) {
        setServiceProviders(response.data.data);
        toast.success(`Found ${response.data.data.length} service providers`);
      } else {
        toast.error('No service providers available for this order');
        setServiceProviders([]);
      }
    } catch (error) {
      console.error('Error fetching service providers:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch service providers');
      setServiceProviders([]);
    } finally {
      setLoadingProviders(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearch(''); // Clear search when switching tabs
    fetchBookings(newValue);
  };

  // Filter data based on search
  useEffect(() => {
    if (search === '') {
      setFilteredData(bookingsData);
    } else {
      const filtered = bookingsData.filter(
        (item) =>
          item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
          item.orderId?.toLowerCase().includes(search.toLowerCase()) ||
          item.partnerName?.toLowerCase().includes(search.toLowerCase()) ||
          item.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
          item.location?.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [search, bookingsData]);

  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      fetchTabCounts(); // Fetch counts for both tabs
      fetchBookings(); // Fetch data for current tab
    } else {
      toast.error('Authentication token not found');
    }
  }, [token]);

  const handleViewOrder = (orderData) => {
    toast.info(`Viewing order ${orderData.orderId}`);
    localStorage.setItem('orderId', orderData._id);
    navigate(`/verified-partners/view-order/${orderData._id}`);
  };

  const handleUpdateStatus = (orderData) => {
    if (activeTab === TAB_CONFIG.PROVIDER_ACCEPTED.value) {
      toast.info('This order is already assigned to a provider');
      return;
    }

    setFormEdit({
      _id: orderData._id,
      serviceProviderId: '',
      comment: '',
    });
    setOpenModal(true);
    fetchServiceProviders(orderData._id);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormEdit({ _id: '', serviceProviderId: '', comment: '' });
    setServiceProviders([]);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEditInputChange = (e) => {
    setFormEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!formEdit.serviceProviderId) {
      toast.error('Please select a service provider');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${URLS.AssignOrdertoProvider}/${formEdit._id}`,
        {
          serviceProviderId: formEdit.serviceProviderId,
          comment: formEdit.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        toast.success('Order assigned to service provider successfully');
        handleCloseModal();
        fetchBookings(); // Refresh current tab data
        fetchTabCounts(); // Update tab counts
      } else {
        toast.error(response.data.message || 'Failed to assign order to provider');
      }
    } catch (error) {
      console.error('Error assigning order to provider:', error);

      if (error.response?.status === 404) {
        toast.error('Order or service provider not found');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to assign this order');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Invalid assignment data');
      } else {
        toast.error(error.response?.data?.message || 'Failed to assign order to provider');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPriorityChip = (priority) => {
    const colorMap = {
      high: 'error',
      medium: 'warning',
      low: 'info',
    };
    return (
      <Chip
        label={priority?.toUpperCase() || 'MED'}
        size="small"
        color={colorMap[priority] || 'info'}
        variant="filled"
        sx={{ fontSize: '0.65rem', height: '22px', minWidth: '50px' }}
      />
    );
  };

  const getVerificationChip = (level) => {
    const colorMap = {
      'Gold Verified': 'warning',
      'Premium Verified': 'success',
      'Standard Verified': 'info',
    };
    const shortLabel =
      level === 'Standard Verified'
        ? 'Standard'
        : level === 'Gold Verified'
        ? 'Gold'
        : level === 'Premium Verified'
        ? 'Premium'
        : 'Standard';
    return (
      <Chip
        label={shortLabel}
        size="small"
        color={colorMap[level] || 'info'}
        variant="outlined"
        sx={{ fontSize: '0.6rem', height: '18px' }}
      />
    );
  };

  const getRatingDisplay = (rating) => {
    return (
      <Typography
        variant="caption"
        color="success.main"
        fontWeight="600"
        sx={{ fontSize: '0.65rem' }}
      >
        ★ {rating?.toFixed(1) || '4.5'}
      </Typography>
    );
  };

  const getStatusChip = (status) => {
    const statusColorMap = {
      assignToProvider: { color: 'warning', label: 'Assign to Provider' },
      orderAcceptedByAdmin: { color: 'primary', label: 'Accepted by Admin' },
      orderAcceptedByProvider: { color: 'success', label: 'Accepted by Provider' },
    };

    const statusConfig = statusColorMap[status] || { color: 'default', label: status };

    return (
      <Chip
        label={statusConfig.label}
        size="small"
        color={statusConfig.color}
        variant="outlined"
        sx={{ fontSize: '0.6rem', height: '20px' }}
      />
    );
  };

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S.No',
        flex: 1,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
          >
            <Typography variant="body2" fontWeight="500" sx={{ fontSize: '0.8rem' }}>
              {params.api.getRowIndexRelativeToVisibleRows(params.id) + 1}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'orderInfo',
        headerName: 'Order Info',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              py: 1,
              px: 0.5,
            }}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{ fontSize: '0.8rem', lineHeight: 1.3, mb: 0.5 }}
            >
              {params.row.orderId}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.7rem', lineHeight: 1.2, mb: 0.2 }}
            >
              {params.row.orderDate}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.7rem', lineHeight: 1.2, mb: 0.2 }}
            >
              {params.row.orderTime}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'customerInfo',
        headerName: 'Customer',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              py: 1,
              px: 0.5,
            }}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{
                fontSize: '0.8rem',
                lineHeight: 1.3,
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={params.row.customerName}
            >
              {params.row.customerName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}
            >
              {params.row.customerPhone}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'partnerInfo',
        headerName: 'Verified Partner',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              py: 1,
              px: 0.5,
            }}
          >
            <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.5 }}>
              <Avatar
                src={params.row.partnerImage}
                alt={params.row.partnerName}
                sx={{ width: 22, height: 22, fontSize: '0.7rem' }}
              >
                {params.row.partnerName.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  fontWeight="500"
                  sx={{
                    fontSize: '0.75rem',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '110px',
                  }}
                  title={params.row.partnerName}
                >
                  {params.row.partnerName}
                </Typography>
              </Box>
            </Box>
          </Box>
        ),
      },
      {
        field: 'serviceInfo',
        headerName: 'Premium Service',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              py: 1,
              px: 0.5,
            }}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{
                fontSize: '0.8rem',
                lineHeight: 1.3,
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                maxHeight: '2.6em',
              }}
              title={params.row.serviceName}
            >
              {params.row.serviceName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: '0.7rem',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {params.row.serviceCategory}
            </Typography>
            <Typography
              variant="caption"
              color="primary.main"
              sx={{
                fontSize: '0.65rem',
                lineHeight: 1.2,
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              Scheduled: {params.row.estimatedServiceDate}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'orderValue',
        headerName: 'Amount',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              py: 1,
            }}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              color="primary"
              sx={{ fontSize: '0.8rem', lineHeight: 1.3, mb: 0.3 }}
            >
              ₹{params.row.orderValue?.toFixed(0)}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.65rem', lineHeight: 1.2 }}
            >
              {params.row.paymentStatus}
            </Typography>
          </Box>
        ),
      },

      {
        field: 'location',
        headerName: 'Location',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              py: 1,
              px: 0.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.8rem',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                maxHeight: '2.6em',
              }}
              title={params.row.location || 'N/A'}
            >
              {params.row.location || 'N/A'}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 1,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {rolesAndPermission.verified_bookings_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                {activeTab === TAB_CONFIG.ADMIN_ACCEPTED.value && (
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    onClick={() => handleUpdateStatus(params.row)}
                    disabled={loading}
                    sx={{
                      minWidth: '30px',
                      padding: '4px 6px',
                      '& .MuiButton-startIcon': { margin: 0 },
                    }}
                    title="Assign Provider"
                  >
                    <IconAnalyze stroke={1.5} size={14} /> Assign
                  </Button>
                )}
              </>
            ) : (
              <></>
            )}
            <Button
              size="small"
              color="info"
              variant="contained"
              onClick={() => handleViewOrder(params.row)}
              disabled={loading}
              sx={{
                minWidth: '30px',
                padding: '4px 6px',
                '& .MuiButton-startIcon': { margin: 0 },
              }}
              title="View Order"
            >
              <IconEye size={14} /> View
            </Button>
          </Box>
        ),
      },
    ],
    [loading, activeTab],
  );

  const rows = useMemo(
    () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
    [filteredData],
  );

  const currentTabConfig = getCurrentTabConfig();

  return (
    <PageContainer
      title="Accepted Orders - Verified Partners"
      description="Manage premium service orders accepted by verified partners ready for execution"
    >
      <Breadcrumb title="Accepted Orders - Verified Partners" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Status Navigation Cards */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Order Status Navigation
        </Typography>
        <Grid container spacing={2}>
          {orderStatusConfig.map((status) => (
            <Grid item xs={12} sm={6} md={4} lg={12 / 7} key={status.key}>
              <StyledNavLink to={status.route} end>
                <StatusCard className="status-card">
                  <CardActionArea
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <CardContent
                      sx={{
                        textAlign: 'center',
                        py: 2,
                        px: 1.5,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        className="status-label"
                        sx={{
                          mb: 1,
                          fontSize: '0.875rem',
                          lineHeight: 1.2,
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          hyphens: 'auto',
                        }}
                      >
                        {status.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: '0.75rem',
                          lineHeight: 1.2,
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {status.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </StatusCard>
              </StyledNavLink>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
          overflow: 'hidden',
        }}
      >
        {/* Tabs Section */}
        <Box>
          <StyledTabs value={activeTab} onChange={handleTabChange} sx={{ px: 2 }}>
            <StyledTab
              label={
                <Badge
                  badgeContent={tabCounts.adminAccepted}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      right: -12,
                      top: -8,
                      minWidth: '18px',
                      height: '18px',
                      fontSize: '0.65rem',
                      padding: '0 4px',
                    },
                  }}
                >
                  {TAB_CONFIG.ADMIN_ACCEPTED.label}
                </Badge>
              }
            />
            <StyledTab
              label={
                <Badge
                  badgeContent={tabCounts.providerAccepted}
                  color="success"
                  sx={{
                    '& .MuiBadge-badge': {
                      right: -12,
                      top: -8,
                      minWidth: '18px',
                      height: '18px',
                      fontSize: '0.65rem',
                      padding: '0 4px',
                    },
                  }}
                >
                  {TAB_CONFIG.PROVIDER_ACCEPTED.label}
                </Badge>
              }
            />
          </StyledTabs>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h6">Accepted Orders - Verified Partners</Typography>
            <Typography variant="body2" color="text.secondary">
              {currentTabConfig.description} ({filteredData.length} orders)
            </Typography>
          </Box>
          <TextField
            size="small"
            placeholder="Search orders..."
            value={search}
            onChange={handleSearch}
            sx={{ minWidth: { xs: 150, sm: 250 }, bgcolor: 'background.paper' }}
          />
          <Button
            variant="outlined"
            onClick={() => fetchBookings()}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </Box>

        {/* Data Grid */}
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowHeight={130}
              pageSizeOptions={[5, 10, 20, 50]}
              disableRowSelectionOnClick
              loading={loading}
              density="compact"
              sx={{
                border: 'none',
                width: '100%',
                maxWidth: '100%',
                '& .MuiDataGrid-main': {
                  overflow: 'hidden',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                },
                '& .MuiDataGrid-row': {
                  maxWidth: '100%',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.grey[50],
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  minHeight: '40px !important',
                  maxHeight: '40px !important',
                },
                '& .MuiDataGrid-columnHeader': {
                  padding: '4px 8px',
                },
                '& .MuiDataGrid-columnSeparator': {
                  display: 'none',
                },
                '& .MuiDataGrid-virtualScroller': {
                  overflow: 'hidden auto',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: `1px solid ${theme.palette.divider}`,
                  minHeight: '45px',
                },
                '& .MuiTablePagination-root': {
                  overflow: 'hidden',
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Service Provider Assignment Modal - Only for Admin Accepted Tab */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Service Provider</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="serviceProviderId">
                  Select Service Provider*
                </CustomFormLabel>
                <CustomSelect
                  id="serviceProviderId"
                  name="serviceProviderId"
                  value={formEdit.serviceProviderId}
                  onChange={handleEditInputChange}
                  fullWidth
                  required
                  disabled={loadingProviders}
                >
                  <MenuItem value="" disabled>
                    {loadingProviders ? 'Loading providers...' : 'Select Service Provider'}
                  </MenuItem>
                  {serviceProviders.map((provider) => {
                    const fullName = `${provider.firstName || ''} ${
                      provider.lastName || ''
                    }`.trim();
                    const displayName = fullName || 'Unnamed Provider';

                    return (
                      <MenuItem key={provider._id} value={provider._id}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar
                            src={provider.profileImage || provider.image || ''}
                            alt={displayName}
                            sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
                          >
                            {displayName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {displayName}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    );
                  })}
                </CustomSelect>
                {loadingProviders && (
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <CircularProgress size={16} />
                    <Typography variant="caption">
                      Loading available service providers...
                    </Typography>
                  </Box>
                )}
                {!loadingProviders && serviceProviders.length === 0 && formEdit._id && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    No service providers found for this order
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Assignment Comments</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add comments about the provider assignment..."
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseModal} variant="outlined" disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !formEdit.serviceProviderId || loadingProviders}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Assigning...' : 'Assign Provider'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default AcceptedOrders;


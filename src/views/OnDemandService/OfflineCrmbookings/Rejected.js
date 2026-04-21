import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { URLS } from '../../../Url';
import CrmNav from './CrmNav';
import axios from 'axios';
import {
  TextField,
  Avatar,
  Paper,
  Box,
  Typography,
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
  CircularProgress,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Rejected Orders - Verified Partners' }];

// Styled Components
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

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

const TAB_CONFIG = {
  PARTNER_REJECTED: {
    value: 0,
    label: 'Rejected by provider',
    statuses: ['rejected'],
    description: 'Orders rejected by verified partners requiring reassignment',
  },
  AUTO_REJECTED: {
    value: 1,
    label: 'Rejected by Admin',
    statuses: ['rejectedByProvider'],
    description: 'Orders automatically rejected due to timeouts or system rules',
  },
};

// Main Rejected Orders Component for Verified Partners
const RejectedOrders = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB_CONFIG.PARTNER_REJECTED.value);
  const [tabCounts, setTabCounts] = useState({
    partnerRejected: 0,
    autoRejected: 0,
  });
  const [formEdit, setFormEdit] = useState({
    _id: '',
    action: '',
    comment: '',
    serviceProviderId: '',
  });

  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];
  const token = authData?.token;

  // Get current tab configuration
  const getCurrentTabConfig = () => {
    return activeTab === TAB_CONFIG.PARTNER_REJECTED.value
      ? TAB_CONFIG.PARTNER_REJECTED
      : TAB_CONFIG.AUTO_REJECTED;
  };

  // Fetch bookings for multiple statuses (used for multiple status tabs)
  const fetchBookingsForMultipleStatuses = async (statuses) => {
    try {
      const promises = statuses.map((status) =>
        axios.post(
          URLS.GetVerifiedPartnersCrmbookingByStatusOffline,
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
        tabValue === TAB_CONFIG.PARTNER_REJECTED.value
          ? TAB_CONFIG.PARTNER_REJECTED
          : TAB_CONFIG.AUTO_REJECTED;

      let allBookings = [];

      if (tabConfig.statuses.length > 1) {
        // Multiple statuses - use the new function
        allBookings = await fetchBookingsForMultipleStatuses(tabConfig.statuses);
      } else {
        // Single status - use existing logic
        const response = await axios.post(
          URLS.GetVerifiedPartnersCrmbookingByStatusOffline,
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
          partnerName: booking.serviceProviderName || booking.providerName || 'Unassigned',
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
          rejectedAt: booking.rejectedAt ? new Date(booking.rejectedAt).toLocaleString() : 'N/A',
          rejectionReason: booking.rejectionReason || 'No reason provided',
          alternativeVerifiedPartners: booking.alternativeVerifiedPartners || 0,
          reassignmentStatus: booking.reassignmentStatus || 'pending',
          customerRetentionOffer: booking.customerRetentionOffer || 'Standard offer available',
          escalationLevel: booking.escalationLevel || 'standard',
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
          [tabValue === TAB_CONFIG.PARTNER_REJECTED.value ? 'partnerRejected' : 'autoRejected']:
            uniqueBookings.length,
        }));
      } else {
        // toast.info(`No ${tabConfig.label.toLowerCase()} orders found`);
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
      // Fetch Rejected by provider count
      const partnerResponse = await axios.post(
        URLS.GetVerifiedPartnersCrmbookingByStatusOffline,
        { status: TAB_CONFIG.PARTNER_REJECTED.statuses[0] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Fetch auto rejected count
      const autoResponse = await axios.post(
        URLS.GetVerifiedPartnersCrmbookingByStatusOffline,
        { status: TAB_CONFIG.AUTO_REJECTED.statuses[0] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      setTabCounts({
        partnerRejected: partnerResponse.data.success
          ? partnerResponse.data.bookings?.length || 0
          : 0,
        autoRejected: autoResponse.data.success ? autoResponse.data.bookings?.length || 0 : 0,
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
        toast.success(`Found ${response.data.data.length} alternative service providers`);
      } else {
        toast.error('No alternative service providers available for this order');
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
          item.location?.toLowerCase().includes(search.toLowerCase()) ||
          item.rejectionReason?.toLowerCase().includes(search.toLowerCase()),
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
    navigate(`/verified-partners-crm/view-order/${orderData._id}`);
  };

  const handleUpdateStatus = (orderData) => {
    setFormEdit({
      _id: orderData._id,
      action: '',
      comment: '',
      serviceProviderId: '',
    });
    setOpenModal(true);
    fetchServiceProviders(orderData._id);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormEdit({ _id: '', action: '', comment: '', serviceProviderId: '' });
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

    if (!formEdit.action) {
      toast.error('Please select an action');
      return;
    }

    // Check if service provider selection is required for certain actions
    const actionsRequiringProvider = [
      'reassign-premium',
      'auto-reassign-verified',
      'manual-partner-selection',
    ];
    if (actionsRequiringProvider.includes(formEdit.action) && !formEdit.serviceProviderId) {
      toast.error('Please select a service provider for this action');
      return;
    }

    setLoading(true);

    try {
      // Mock API call for rejection management
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

      toast.success('Rejection management action completed successfully');
      handleCloseModal();
      fetchBookings(); // Refresh current tab data
      fetchTabCounts(); // Update tab counts
    } catch (error) {
      console.error('Error processing rejection action:', error);
      toast.error('Failed to process rejection action');
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

  const getReassignmentStatusChip = (status) => {
    const colorMap = {
      completed: 'success',
      'in-progress': 'info',
      pending: 'warning',
      failed: 'error',
    };
    return (
      <Chip
        label={status?.toUpperCase() || 'PENDING'}
        size="small"
        color={colorMap[status] || 'warning'}
        variant="outlined"
        sx={{ fontSize: '0.55rem', height: '16px', minWidth: '60px' }}
      />
    );
  };

  const getEscalationChip = (level) => {
    const colorMap = {
      premium: 'error',
      standard: 'warning',
      none: 'info',
    };
    return (
      <Chip
        label={level?.toUpperCase() || 'STD'}
        size="small"
        color={colorMap[level] || 'warning'}
        variant="filled"
        sx={{ fontSize: '0.55rem', height: '16px', minWidth: '40px' }}
      />
    );
  };

  const getAlternativePartnersDisplay = (count) => {
    const color = count > 2 ? 'success.main' : count > 0 ? 'warning.main' : 'error.main';
    return (
      <Typography variant="caption" color={color} fontWeight="600" sx={{ fontSize: '0.75rem' }}>
        {count} Available
      </Typography>
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
              color="error.main"
              sx={{ fontSize: '0.65rem', lineHeight: 1.2, fontWeight: 500 }}
            >
              Rejected:{' '}
              {params.row.rejectedAt !== 'N/A'
                ? new Date(params.row.rejectedAt).toLocaleDateString()
                : 'Unknown'}
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
        headerName: 'Rejected By',
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
                  color="error.main"
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
                {getRatingDisplay(params.row.partnerRating)}
              </Box>
            </Box>
            {getVerificationChip(params.row.partnerVerificationLevel)}
          </Box>
        ),
      },
      {
        field: 'serviceInfo',
        headerName: 'Service & Reason',
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
                mb: 0.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {params.row.serviceCategory}
            </Typography>
            <Typography
              variant="caption"
              color="error.main"
              sx={{
                fontSize: '0.65rem',
                lineHeight: 1.2,
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={params.row.rejectionReason}
            >
              Reason:{' '}
              {params.row.rejectionReason?.length > 25
                ? params.row.rejectionReason.substring(0, 25) + '...'
                : params.row.rejectionReason}
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
        field: 'alternativePartners',
        headerName: 'Alternatives',
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
            {getAlternativePartnersDisplay(params.row.alternativeVerifiedPartners)}
            {getReassignmentStatusChip(params.row.reassignmentStatus)}
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
            {' '}
            {rolesAndPermission.crm_bookings_list_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleUpdateStatus(params.row)}
                  disabled={loading}
                  sx={{
                    minWidth: '30px',
                    padding: '4px 6px',
                    '& .MuiButton-startIcon': { margin: 0 },
                  }}
                  title="Reassign Order"
                >
                  <IconAnalyze stroke={1.5} size={14} />
                </Button>{' '}
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
              <IconEye size={14} />
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
      title="Rejected Orders - Verified Partners"
      description="Manage premium orders rejected by verified partners and handle customer retention"
    >
      <Breadcrumb title="Rejected Orders - Verified Partners" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <CrmNav />

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
                  badgeContent={tabCounts.autoRejected}
                  color="warning"
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
                  {TAB_CONFIG.AUTO_REJECTED.label}
                </Badge>
              }
            />
            <StyledTab
              label={
                <Badge
                  badgeContent={tabCounts.partnerRejected}
                  color="error"
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
                  {TAB_CONFIG.PARTNER_REJECTED.label}
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
            <Typography variant="h6">Rejected Orders - Verified Partners</Typography>
            <Typography variant="body2" color="text.secondary">
              {currentTabConfig.description} ({filteredData.length} orders)
            </Typography>
          </Box>
          <Box display="flex" gap={2} alignItems="center">
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

      {/* Rejection Management Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Reassign Premium Order</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="action">Action*</CustomFormLabel>
                <CustomSelect
                  id="action"
                  name="action"
                  value={formEdit.action}
                  onChange={handleEditInputChange}
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled>
                    Select Action
                  </MenuItem>
                  <MenuItem value="reassign-premium">Reassign to Premium Partner</MenuItem>
                  <MenuItem value="auto-reassign-verified">
                    Auto-assign to Verified Partner
                  </MenuItem>
                  <MenuItem value="customer-retention-offer">Activate Retention Offer</MenuItem>
                  <MenuItem value="escalate-premium-support">Escalate to Premium Support</MenuItem>
                  <MenuItem value="manual-partner-selection">Manual Partner Selection</MenuItem>
                  <MenuItem value="cancel-with-compensation">
                    Cancel with Premium Compensation
                  </MenuItem>
                  <MenuItem value="priority-reassignment">Priority Reassignment</MenuItem>
                </CustomSelect>
              </Grid>

              {/* Service Provider Selection - Show only for certain actions */}
              {['reassign-premium', 'auto-reassign-verified', 'manual-partner-selection'].includes(
                formEdit.action,
              ) && (
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
                    required={[
                      'reassign-premium',
                      'auto-reassign-verified',
                      'manual-partner-selection',
                    ].includes(formEdit.action)}
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
                      No alternative service providers found for this order
                    </Typography>
                  )}
                </Grid>
              )}

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Notes</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add reassignment strategy, customer retention notes, or escalation details..."
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
              disabled={
                loading ||
                !formEdit.action ||
                ([
                  'reassign-premium',
                  'auto-reassign-verified',
                  'manual-partner-selection',
                ].includes(formEdit.action) &&
                  (!formEdit.serviceProviderId || loadingProviders))
              }
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Processing...' : 'Execute Action'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default RejectedOrders;


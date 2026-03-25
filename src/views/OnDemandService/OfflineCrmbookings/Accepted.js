import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
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
  Menu,
  Checkbox,
  ListItemText,
} from '@mui/material';

import { WhatsApp, MoreVert, Send } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Accepted Orders - Verified Partners' }];

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
  padding: '20px 30px',
  borderRadius: '12px',
  marginRight: theme.spacing(1.5),
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

const TAB_CONFIG = {
  ADMIN_ACCEPTED: {
    value: 0,
    label: 'Accepted by Admin',
    statuses: ['assignToProvider', 'orderAcceptedByAdmin','pending'],
  },
  PROVIDER_ACCEPTED: {
    value: 1,
    label: 'Accepted by Provider',
    statuses: ['acceptedByProvider'],
  },
};

const AcceptedOrders = () => {
  const theme = useTheme();
  const [selectedOrders, setSelectedOrders] = useState([]);

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
  
  // FIXED: Changed providerId to providerIds array
  const [formEdit, setFormEdit] = useState({
    _id: '',
    providerIds: [], // Changed from providerId to providerIds
    statusTextMessage: '',
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];
  const token = authData?.token;

  const getCurrentTabConfig = () => {
    return activeTab === TAB_CONFIG.ADMIN_ACCEPTED.value
      ? TAB_CONFIG.ADMIN_ACCEPTED
      : TAB_CONFIG.PROVIDER_ACCEPTED;
  };

  const fetchBookingsForMultipleStatuses = async (statuses) => {
    try {
      const promises = statuses.map((status) =>
        axios.post(
          URLS.GetVerifiedPartnersCrmbookingByStatusOffline,
          { status:["orderAcceptedByAdmin","pending","assignToProvider"]},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const responses = await Promise.all(promises);
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



//   const fetchBookingsForMultipleStatuses = async (statuses, searchQuery = "") => {
//   try {
//     const promises = statuses.map((status) =>
//       axios.post(
//         URLS.GetVerifiedPartnersCrmbookingByStatusOffline,
//         {
//           status,          // <-- send each status individually
//           searchQuery,     // <-- send search query also
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       )
//     );

//     const responses = await Promise.all(promises);

//     let allBookings = [];

//     responses.forEach((response) => {
//       if (response.data.success && response.data.bookings) {
//         allBookings = [...allBookings, ...response.data.bookings];
//       }
//     });

//     return allBookings;
//   } catch (error) {
//     throw error;
//   }
// };

  const fetchBookings = async (tabValue = activeTab) => {
    setLoading(true);
    try {
      const tabConfig =
        tabValue === TAB_CONFIG.ADMIN_ACCEPTED.value
          ? TAB_CONFIG.ADMIN_ACCEPTED
          : TAB_CONFIG.PROVIDER_ACCEPTED;
      let allBookings = [];
      if (tabConfig.statuses.length > 1) {
        allBookings = await fetchBookingsForMultipleStatuses(tabConfig.statuses);
      } else {
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
          partnerName: booking.serviceProviderName || 'Unassigned',
          partnerImage: booking.providerImage || '/images/profile/default-avatar.jpg',
          partnerVerificationLevel: booking.providerVerificationLevel || 'Standard Verified',
          partnerRating: booking.providerRating || 4.5,
          serviceName: booking.serviceName,
          serviceCategory: booking.serviceCategory || 'Professional Service',
          orderDate: booking.date,
            sourceOfLead: booking.sourceOfLead || "N/A",
          subcategoryName:booking.subcategoryName,

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
        const uniqueBookings = transformedData.filter(
          (booking, index, self) => index === self.findIndex((b) => b._id === booking._id),
        );
        setBookingsData(uniqueBookings);
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

  const fetchTabCounts = async () => {
    try {
      const adminBookings = await fetchBookingsForMultipleStatuses(
        TAB_CONFIG.ADMIN_ACCEPTED.statuses,
      );
      const uniqueAdminBookings = adminBookings.filter(
        (booking, index, self) => index === self.findIndex((b) => b._id === booking._id),
      );
      const providerResponse = await axios.post(
        URLS.GetVerifiedPartnersCrmbookingByStatusOffline,
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

  const fetchServiceProviders = async (orderId) => {
    setLoadingProviders(true);
    try {
      const response = await axios.post(
        URLS.GetServiceProvidersBasedCrmOnId,
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearch('');
    fetchBookings(newValue);
  };

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

  useEffect(() => {
    if (token) {
      fetchTabCounts();
      fetchBookings();
    } else {
      toast.error('Authentication token not found');
    }
  }, [token]);

  const handleViewOrder = (orderData) => {
    toast.info(`Viewing order ${orderData.orderId}`);
    localStorage.setItem('orderId', orderData._id);
    navigate(`/verified-partners-crm/view-order/${orderData._id}`);
  };

  // FIXED: Initialize with empty array for providerIds
  const handleUpdateStatus = (orderData) => {
    if (activeTab === TAB_CONFIG.PROVIDER_ACCEPTED.value) {
      toast.info('This order is already assigned to a provider');
      return;
    }
    setFormEdit({
      _id: orderData._id,
      providerIds: [], // Changed from providerId
      statusTextMessage: '',
    });
    setOpenModal(true);
    fetchServiceProviders(orderData._id);
  };

  // FIXED: Reset with empty array
  const handleCloseModal = () => {
    setOpenModal(false);
    setFormEdit({ _id: '', providerIds: [], statusTextMessage: '' }); // Changed from providerId
    setServiceProviders([]);
  };

  // const handleSearch = (e) => {
  //   setSearch(e.target.value);
  // };

  const handleSearch = (e) => {
  const query = e.target.value;
  setSearch(query);

  fetchBookingsForMultipleStatuses(
    ['assignToProvider', 'orderAcceptedByAdmin', 'pending'],
    query
  );
};


  // FIXED: Handle multi-select for providerIds
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'providerIds') {
      // Handle multi-select array value
      setFormEdit((prev) => ({ 
        ...prev, 
        [name]: typeof value === 'string' ? value.split(',') : value 
      }));
    } else {
      // Handle other inputs normally
      setFormEdit((prev) => ({ ...prev, [name]: value }));
    }
  };

  // FIXED: Send providerIds array in payload
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // FIXED: Check for providerIds array
    if (!formEdit.providerIds || formEdit.providerIds.length === 0) {
      toast.error('Please select at least one service provider');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.put(
        `${URLS.AssignOrderCrmtoProvider}/${formEdit._id}`,
        {
          providerIds: formEdit.providerIds, // FIXED: Send array
          statusTextMessage: formEdit.statusTextMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        toast.success(`Order assigned to ${formEdit.providerIds.length} service provider(s) successfully`);
        handleCloseModal();
        fetchBookings();
        fetchTabCounts();
      } else {
        toast.error(response.data.message || 'Failed to assign order to providers');
      }
    } catch (error) {
      console.error('Error assigning order to providers:', error);

      if (error.response?.status === 404) {
        toast.error('Order or service providers not found');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to assign this order');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Invalid assignment data');
      } else {
        toast.error(error.response?.data?.message || 'Failed to assign order to providers');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) {
      toast.warning('Please select at least one order.');
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        URLS.archieveBookings,
        { ids: selectedOrders },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success('Bookings deleted successfully!');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to delete ');
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const handleSendToServiceProvider = () => {
    if (selectedOrders.length === 0) {
      toast.warning('Please select at least one order.');
      return;
    }

    navigate('/verified-partners-crm/assign-providers', {
      state: { orderIds: selectedOrders },
    });

    handleMenuClose();
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
      // {
      //   field: 'sourceOfLead',
      //   headerName: 'Source',
      //   flex: 1,
      //   headerAlign: 'left',
      //   align: 'left',
      //   renderCell: (params) => (
      //     <Box
      //       sx={{
      //         display: 'flex',
      //         flexDirection: 'column',
      //         justifyContent: 'center',
      //         height: '100%',
      //         py: 1,
      //         px: 0.5,
      //       }}
      //     >
      //       <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.5 }}>
      //         <Avatar
      //           src={params.row.partnerImage}
      //           alt={params.row.partnerName}
      //           sx={{ width: 22, height: 22, fontSize: '0.7rem' }}
      //         >
      //           {params.row.partnerName.charAt(0).toUpperCase()}
      //         </Avatar>
      //         <Box>
      //           <Typography
      //             variant="body2"
      //             fontWeight="500"
      //             sx={{
      //               fontSize: '0.75rem',
      //               lineHeight: 1.2,
      //               overflow: 'hidden',
      //               textOverflow: 'ellipsis',
      //               whiteSpace: 'nowrap',
      //               maxWidth: '110px',
      //             }}
      //             title={params.row.partnerName}
      //           >
      //             {params.row.partnerName}
      //           </Typography>
      //         </Box>
      //       </Box>
      //     </Box>
      //   ),
      // },


      {
  field: 'sourceOfLead',
  headerName: 'Source',
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
          textTransform: 'capitalize',
        }}
      >
        {params.row.sourceOfLead || "N/A"}
      </Typography>
    </Box>
  ),
}
,
      {
        field: 'subcategoryName',
        headerName: 'Sub Category ',
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
              title={params.row.subcategoryName}
            >
              {params.row.subcategoryName}
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
              {/* {params.row.subcategoryName} */}
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
              {/* Scheduled: {params.row.subcategoryName} */}
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
              â‚¹{params.row.orderValue?.toFixed(0)}
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
  // Update the status column in the columns array - Replace the existing status field with this:

{
  field: 'status',
  headerName: 'Status',
  flex: 1,
  headerAlign: 'center',
  align: 'center',
  renderCell: (params) => {
    // Function to map backend status to friendly label
    const getFriendlyStatus = (status) => {
      const s = status?.toLowerCase() || '';
      switch (s) {
        case 'pending':
          return 'Wait for Approval';
        case 'assigntoprovider':
          return 'Assigned to Provider';
        case 'acceptedbyprovider':
          return 'Accepted by Provider';
        case 'orderAcceptedByAdmin':
          return 'Order Accepted by Admin';
        default:
          return status; // fallback to original
      }
    };

    // Function to determine chip color based on backend status
    const getStatusColor = (status) => {
      const statusLower = status?.toLowerCase() || '';
      if (statusLower === 'pending') {
        return { bgcolor: '#FFF3CD', color: '#856404', borderColor: '#FFE69C' };
      } else if (statusLower === 'assigntoprovider') {
        return { bgcolor: '#D1ECF1', color: '#0C5460', borderColor: '#BEE5EB' };
      } else if (statusLower === 'acceptedbyprovider') {
        return { bgcolor: '#D4EDDA', color: '#155724', borderColor: '#C3E6CB' };
      } else if (statusLower === 'orderAcceptedByAdmin') {
        return { bgcolor: '#D4EDDA', color: '#fa1111ff', borderColor: '#f3fcf5ff' };
      } else {
        return { bgcolor: '#E7F3FF', color: '#1976d2', borderColor: '#BBDEFB' };
      }
    };

    const statusStyle = getStatusColor(params.row.status);
    const friendlyLabel = getFriendlyStatus(params.row.status);

    return (
   

      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
         
        <Chip
          label={friendlyLabel}
          size="small"
          sx={{
            backgroundColor: statusStyle.bgcolor,
            color: statusStyle.color,
            border: `1px solid ${statusStyle.borderColor}`,
            fontWeight: 600,
            fontSize: '0.75rem',
            whiteSpace: 'nowrap', // ensures text doesn't wrap
            '&:hover': {
              backgroundColor: statusStyle.bgcolor,
              opacity: 0.9,
            },
          }}
        />
      </Box>
    );
  },
}
,

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
  renderCell: (params) => {
    const phoneNumber =
      params.row?.customerPhone ||
      params.row?.phone ||
      params.row?.customer?.phone ||
      '8886688666';

    const handleWhatsAppClick = () => {
      if (!phoneNumber) {
        toast.warning('Customer phone number not available');
        return;
      }

      const orderDetails = params.row;
      
      // âœ… Format rate cards OR show Doorstep Inspection if no rate cards
      let rateCardsText;
      if (orderDetails.ratecards && orderDetails.ratecards.length > 0) {
        rateCardsText = orderDetails.ratecards.map((rc, idx) => {
          const price = rc.rateCardPrice || rc.price || 'Price not available';
          const title = rc.rateCardTitle || rc.name || 'Service Item';
          return `${idx + 1}. ${title} - â‚¹${price}`;
        }).join('\n');
      } else {
        rateCardsText = '1. Doorstep Inspection - â‚¹299';
      }

      // âœ… Format full address
      const fullAddress = [
        orderDetails.addressDetails?.addressFlat,
        orderDetails.addressDetails?.addressLineOne,
        orderDetails.addressDetails?.addressArea,
        orderDetails.addressDetails?.addressCityName,
        orderDetails.addressDetails?.addressStateName,
        orderDetails.addressDetails?.addressCountry
      ].filter(Boolean).join(', ');

      // âœ… Payment method defaults to COD if empty
      const paymentMethod = orderDetails.paymentMethod && orderDetails.paymentMethod.trim() !== '' 
        ? orderDetails.paymentMethod 
        : 'COD (Cash on Service Delivery)';

      // âœ… Build comprehensive WhatsApp message (NO EXTRA GAPS)
      const message = `ðŸ  *DoorstepHub Service Order Details*

ðŸ“‹ *Order Information*
â€¢ Order ID: ${orderDetails.orderId}
â€¢ Status: ${orderDetails.status}
â€¢ Appointment Date: ${orderDetails.bookedDate || orderDetails.orderDate}
â€¢ Appointment Time: ${orderDetails.bookedTime || orderDetails.orderTime}
â€¢ Source: ${orderDetails.sourceOfLead}

ðŸ‘¤ *Customer Details*
â€¢ Name: ${orderDetails.customerName}
â€¢ Phone: ${orderDetails.customerPhone}${orderDetails.customerEmail && orderDetails.customerEmail !== 'N/A' && orderDetails.customerEmail.trim() !== '' ? `\nâ€¢ Email: ${orderDetails.customerEmail}` : ''}

ðŸ› ï¸ *Service Details*
â€¢ Category: ${orderDetails.serviceCategory}
â€¢ Sub-Category: ${orderDetails.subcategoryName || 'N/A'}${orderDetails.serviceName && orderDetails.serviceName.trim() !== '' ? `\nâ€¢ Service: ${orderDetails.serviceName}` : ''}${orderDetails.estimatedServiceDate && orderDetails.estimatedServiceDate !== 'To be scheduled' ? `\nâ€¢ Scheduled Date: ${orderDetails.estimatedServiceDate}` : ''}

ðŸ’° *Billing Information/Rate Cards*
â€¢ Total Amount: â‚¹${orderDetails.orderValue?.toFixed(2)}
â€¢ Payment Status: ${orderDetails.paymentStatus}
â€¢ Payment Method: ${paymentMethod}

ðŸ“¦ *Services Charges:*
${rateCardsText}

ðŸ“ *Service Address*
${fullAddress || 'Address not available'}
${orderDetails.addMoreInfo && orderDetails.addMoreInfo.trim() !== '' ? `\nðŸ“ *Additional Info:* ${orderDetails.addMoreInfo}` : ''}

---
âœ… Thank you for choosing DoorstepHub!
Need assistance? Reply to this message or call us.`.trim();

      const encodedMessage = encodeURIComponent(message);
      const url = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
      window.open(url, '_blank');
    };

    return (
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {/* Assign Button */}
        {(rolesAndPermission.crm_bookings_list_edit === true ||
          rolesAndPermission.accessAll === true) &&
          activeTab === TAB_CONFIG.ADMIN_ACCEPTED.value && (
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
              <IconAnalyze stroke={1.5} size={14} />
            </Button>
          )}

        {/* View Button */}
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

        {/* WhatsApp Button */}
        <Button
          size="small"
          variant="contained"
          onClick={handleWhatsAppClick}
          disabled={loading}
          sx={{
            backgroundColor: '#25D366',
            minWidth: '30px',
            padding: '4px 6px',
            '&:hover': { backgroundColor: '#1ebe5c' },
            '& .MuiButton-startIcon': { margin: 0 },
          }}
          title="Send Order Details via WhatsApp"
        >
          <WhatsApp fontSize="small" />
        </Button>
      </Box>
    );
  },
}


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
  {/* Tabs Section with New Request Button */}
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    px: 2,
    borderBottom: `1px solid ${theme.palette.divider}`,
  }}>
    <StyledTabs value={activeTab} onChange={handleTabChange}>
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
                padding: '2 4px',
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

    {/* New Request Button */}
    <Button
      variant="contained"
      color="primary"
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        py: 1,
    
        boxShadow: theme.shadows[2],
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
      }}
      onClick={() => navigate('/add-crm-booking')} // Update with your route
    >
      + New Request
    </Button>
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
            sx={{ minWidth: { xs: 150, sm: 250 }, bgcolor: 'white' }}
          />
          <Button
            variant="outlined"
            onClick={() => fetchBookings()}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>

          

          <Button onClick={handleMenuOpen} variant="outlined" size="small" endIcon={<MoreVert />}>
            Actions
          </Button>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleDeleteSelected}>
              <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
              Delete Selected
            </MenuItem>
          </Menu>
        </Box>
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
              checkboxSelection
              onRowSelectionModelChange={(ids) => setSelectedOrders(ids)}
              rowSelectionModel={selectedOrders}
              getRowId={(row) => row._id}
            />
          </Box>
        </CardContent>
      </Paper>
      


<Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
  <DialogTitle>Assign Service Providers</DialogTitle>
  <form onSubmit={handleEditSubmit}>
    <DialogContent>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <CustomFormLabel htmlFor="providerIds">
              Select Service Providers
            </CustomFormLabel>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                if (formEdit.providerIds.length === serviceProviders.length) {
                  // Deselect all
                  setFormEdit((prev) => ({ ...prev, providerIds: [] }));
                  toast.info('All providers deselected');
                } else {
                  // Select all
                  const allProviderIds = serviceProviders.map((p) => p._id);
                  setFormEdit((prev) => ({ ...prev, providerIds: allProviderIds }));
                  toast.success(`All ${serviceProviders.length} providers selected`);
                }
              }}
              disabled={loadingProviders || serviceProviders.length === 0}
              sx={{
                textTransform: 'none',
                fontSize: '0.75rem',
                padding: '4px 12px',
              }}
            >
              {formEdit.providerIds.length === serviceProviders.length && serviceProviders.length > 0
                ? 'Deselect All'
                : 'Select All'}
            </Button>
          </Box>
          <CustomSelect
            id="providerIds"
            name="providerIds"
            multiple
            value={formEdit.providerIds}
            onChange={handleEditInputChange}
            fullWidth
            required
            disabled={loadingProviders}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.length === 0 ? (
                  'Select Service Providers'
                ) : (
                  selected.map((value) => {
                    const provider = serviceProviders.find((p) => p._id === value);
                    if (!provider) return null;
                    const fullName = `${provider.firstName || ''} ${provider.lastName || ''}`.trim();
                    const displayName = fullName || 'Unnamed Provider';
                    return (
                      <Chip
                        key={value}
                        label={displayName}
                        size="small"
                        sx={{ m: 0.5 }}
                      />
                    );
                  })
                )}
              </Box>
            )}
          >
            <MenuItem value="" disabled>
              {loadingProviders ? 'Loading providers...' : 'Select Service Providers'}
            </MenuItem>
            {serviceProviders.map((provider) => {
              const fullName = `${provider.firstName || ''} ${provider.lastName || ''}`.trim();
              const displayName = fullName || 'Unnamed Provider';

              return (
                <MenuItem key={provider._id} value={provider._id}>
                  <Checkbox checked={formEdit.providerIds.indexOf(provider._id) > -1} />
                  <Avatar
                    src={URLS.FileBase + provider.image}
                    alt={displayName}
                    sx={{ width: 24, height: 24, fontSize: '0.75rem', mr: 1 }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="500">
                        {displayName}
                      </Typography>
                    }
                  />
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
          {formEdit.providerIds.length > 0 && (
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              {formEdit.providerIds.length} of {serviceProviders.length} provider(s) selected
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <CustomFormLabel htmlFor="statusTextMessage">Assignment Comments</CustomFormLabel>
          <CustomTextField
            id="statusTextMessage"
            name="statusTextMessage"
            value={formEdit.statusTextMessage}
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
        disabled={loading || formEdit.providerIds.length === 0 || loadingProviders}
        startIcon={loading ? <CircularProgress size={16} /> : null}
      >
        {loading ? 'Assigning...' : `Assign to ${formEdit.providerIds.length} Provider(s)`}
      </Button>
    </DialogActions>
  </form>
</Dialog>

    </PageContainer>
  );
};

export default AcceptedOrders;

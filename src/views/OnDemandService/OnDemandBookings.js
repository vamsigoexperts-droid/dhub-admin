// import React, { useState, useEffect, useMemo } from 'react';
// import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
// import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
// import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
// import { IconEye, IconAnalyze, IconDownload } from '@tabler/icons-react';
// import PageContainer from 'src/components/container/PageContainer';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Button } from '@mui/material';
// import {
//   TextField,
//   Avatar,
//   Paper,
//   Box,
//   Typography,
//   Divider,
//   CardContent,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Grid,
//   styled,
//   Select,
//   MenuItem,
//   DialogActions,
//   Tabs,
//   Tab,
//   Badge,
// } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import { DataGrid } from '@mui/x-data-grid';
// import { useNavigate } from 'react-router';

// const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Service-Orders' }];

// // Styled Components
// const CustomSelect = styled(Select)({
//   '& .MuiOutlinedInput-root': {
//     borderRadius: '8px',
//   },
// });

// const StyledTab = styled(Tab)(({ theme }) => ({
//   textTransform: 'none',
//   fontWeight: 600,
//   fontSize: '0.875rem',
//   minWidth: 0,
//   padding: '8px 16px',
//   '&.Mui-selected': {
//     color: theme.palette.primary.main,
//   },
// }));

// // Mock Data for different order statuses
// const mockOrdersData = {
//   'received-orders': [
//     {
//       _id: '1',
//       orderId: 'ORD-2024-001',
//       customerName: 'John Smith',
//       customerPhone: '+1 234-567-8900',
//       customerEmail: 'john.smith@email.com',
//       partnerName: 'Alex Johnson',
//       partnerImage: '/images/profile/user-1.jpg',
//       serviceName: 'Home Cleaning',
//       serviceCategory: 'Cleaning Services',
//       orderDate: '2024-08-19',
//       orderTime: '10:00 AM',
//       orderValue: 150.00,
//       location: 'New York, NY',
//       status: 'received',
//       priority: 'high',
//     },
//     {
//       _id: '2',
//       orderId: 'ORD-2024-002',
//       customerName: 'Sarah Wilson',
//       customerPhone: '+1 234-567-8901',
//       customerEmail: 'sarah.wilson@email.com',
//       partnerName: 'Mike Davis',
//       partnerImage: '/images/profile/user-2.jpg',
//       serviceName: 'Plumbing Repair',
//       serviceCategory: 'Home Maintenance',
//       orderDate: '2024-08-19',
//       orderTime: '2:00 PM',
//       orderValue: 275.00,
//       location: 'Los Angeles, CA',
//       status: 'received',
//       priority: 'medium',
//     },
//   ],
//   'accepted': [
//     {
//       _id: '3',
//       orderId: 'ORD-2024-003',
//       customerName: 'Robert Brown',
//       customerPhone: '+1 234-567-8902',
//       customerEmail: 'robert.brown@email.com',
//       partnerName: 'Emily Chen',
//       partnerImage: '/images/profile/user-3.jpg',
//       serviceName: 'AC Repair',
//       serviceCategory: 'HVAC Services',
//       orderDate: '2024-08-18',
//       orderTime: '9:00 AM',
//       orderValue: 320.00,
//       location: 'Chicago, IL',
//       status: 'accepted',
//       acceptedAt: '2024-08-18 15:30',
//       priority: 'high',
//     },
//   ],
//   'appointment-confirmed': [
//     {
//       _id: '4',
//       orderId: 'ORD-2024-004',
//       customerName: 'Lisa Anderson',
//       customerPhone: '+1 234-567-8903',
//       customerEmail: 'lisa.anderson@email.com',
//       partnerName: 'David Rodriguez',
//       partnerImage: '/images/profile/user-4.jpg',
//       serviceName: 'Electrical Wiring',
//       serviceCategory: 'Electrical Services',
//       orderDate: '2024-08-17',
//       orderTime: '11:00 AM',
//       orderValue: 450.00,
//       location: 'Houston, TX',
//       status: 'appointment-confirmed',
//       appointmentDate: '2024-08-20',
//       appointmentTime: '11:00 AM',
//       priority: 'high',
//     },
//   ],
//   'in-progress': [
//     {
//       _id: '5',
//       orderId: 'ORD-2024-005',
//       customerName: 'Michael Taylor',
//       customerPhone: '+1 234-567-8904',
//       customerEmail: 'michael.taylor@email.com',
//       partnerName: 'Jessica Martinez',
//       partnerImage: '/images/profile/user-5.jpg',
//       serviceName: 'Garden Landscaping',
//       serviceCategory: 'Landscaping',
//       orderDate: '2024-08-16',
//       orderTime: '8:00 AM',
//       orderValue: 680.00,
//       location: 'Phoenix, AZ',
//       status: 'in-progress',
//       startedAt: '2024-08-16 08:00',
//       estimatedCompletion: '2024-08-16 16:00',
//       priority: 'medium',
//     },
//   ],
//   'completed': [
//     {
//       _id: '6',
//       orderId: 'ORD-2024-006',
//       customerName: 'Jennifer Lee',
//       customerPhone: '+1 234-567-8905',
//       customerEmail: 'jennifer.lee@email.com',
//       partnerName: 'Chris Thompson',
//       partnerImage: '/images/profile/user-6.jpg',
//       serviceName: 'Kitchen Renovation',
//       serviceCategory: 'Home Renovation',
//       orderDate: '2024-08-15',
//       orderTime: '9:00 AM',
//       orderValue: 1200.00,
//       location: 'Philadelphia, PA',
//       status: 'completed',
//       completedAt: '2024-08-15 17:00',
//       rating: 5,
//       priority: 'high',
//     },
//   ],
//   'amount-received': [
//     {
//       _id: '7',
//       orderId: 'ORD-2024-007',
//       customerName: 'Daniel White',
//       customerPhone: '+1 234-567-8906',
//       customerEmail: 'daniel.white@email.com',
//       partnerName: 'Amanda Garcia',
//       partnerImage: '/images/profile/user-7.jpg',
//       serviceName: 'Painting Service',
//       serviceCategory: 'Home Improvement',
//       orderDate: '2024-08-14',
//       orderTime: '10:00 AM',
//       orderValue: 850.00,
//       location: 'San Antonio, TX',
//       status: 'amount-received',
//       completedAt: '2024-08-14 16:00',
//       paymentReceived: '2024-08-14 18:00',
//       paymentMethod: 'Credit Card',
//       commission: 85.00,
//       priority: 'medium',
//     },
//   ],
// };

// // Order status configurations
// const orderStatusConfig = {
//   'received-orders': { 
//     label: 'Received Orders', 
//     color: 'info',
//   },
//   'accepted': { 
//     label: 'Accepted', 
//     color: 'primary',
//   },
//   'appointment-confirmed': { 
//     label: 'Appointment Confirmed', 
//     color: 'warning',
//   },
//   'in-progress': { 
//     label: 'In Progress', 
//     color: 'secondary',
//   },
//   'completed': { 
//     label: 'Completed', 
//     color: 'success',
//   },
//   'amount-received': { 
//     label: 'Amount Received', 
//     color: 'success',
//   },
// };

// // Main Orders Component
// const OnDemandBookings = () => {
//   const theme = useTheme();
//   const [activeTab, setActiveTab] = useState('received-orders');
//   const [search, setSearch] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [openModal, setOpenModal] = useState(false);
//   const [formEdit, setFormEdit] = useState({
//     _id: '',
//     status: '',
//     comment: '',
//   });

//   const navigate = useNavigate();

//   // Get current tab data
//   const currentTabData = mockOrdersData[activeTab] || [];

//   // Handle tab change
//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//     setSearch(''); // Reset search when changing tabs
//   };

//   // Filter data based on search
//   useEffect(() => {
//     if (search === '') {
//       setFilteredData(currentTabData);
//     } else {
//       const filtered = currentTabData.filter((item) =>
//         item.customerName.toLowerCase().includes(search.toLowerCase()) ||
//         item.orderId.toLowerCase().includes(search.toLowerCase()) ||
//         item.partnerName.toLowerCase().includes(search.toLowerCase()) ||
//         item.serviceName.toLowerCase().includes(search.toLowerCase())
//       );
//       setFilteredData(filtered);
//     }
//   }, [currentTabData, search, activeTab]);

//   const handleViewOrder = (orderData) => {
//     toast.info(`Viewing order ${orderData.orderId}`);
//     localStorage.setItem('orderId', orderData._id);
//   };

//   const handleUpdateStatus = (orderData) => {
//     setFormEdit({
//       _id: orderData._id,
//       status: orderData.status,
//       comment: '',
//     });
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setFormEdit({ _id: '', status: '', comment: '' });
//   };

//   const handleSearch = (e) => {
//     setSearch(e.target.value);
//   };

//   const handleEditInputChange = (e) => {
//     setFormEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     toast.success('Order status updated successfully');
//     handleCloseModal();
//     // Implement status update logic here
//   };

//   const getStatusChip = (status) => {
//     const config = orderStatusConfig[status];
//     return (
//       <Chip 
//         label={config?.label || status} 
//         size="small" 
//         color={config?.color || 'default'} 
//         variant="outlined" 
//       />
//     );
//   };

//   const getPriorityChip = (priority) => {
//     const colorMap = {
//       high: 'error',
//       medium: 'warning',
//       low: 'info'
//     };
//     return (
//       <Chip 
//         label={priority?.toUpperCase() || 'MEDIUM'} 
//         size="small" 
//         color={colorMap[priority] || 'info'} 
//         variant="filled" 
//       />
//     );
//   };

//   const columns = useMemo(
//     () => [
//       {
//         field: 'sno',
//         headerName: 'S. No',
//         width: 70,
//         sortable: false,
//         filterable: false,
//         renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
//       },
//       {
//         field: 'orderInfo',
//         headerName: 'Order Info',
//         flex: 1.2,
//         renderCell: (params) => (
//           <Box>
//             <Typography variant="body2" fontWeight="600">
//               {params.row.orderId}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               {params.row.orderDate} at {params.row.orderTime}
//             </Typography>
//           </Box>
//         ),
//       },
//       {
//         field: 'customerInfo',
//         headerName: 'Customer Info',
//         flex: 1.2,
//         renderCell: (params) => (
//           <Box>
//             <Typography variant="body2" fontWeight="600">
//               {params.row.customerName}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               {params.row.customerPhone}
//             </Typography>
//           </Box>
//         ),
//       },
//       {
//         field: 'partnerInfo',
//         headerName: 'Partner Info',
//         flex: 1.2,
//         renderCell: (params) => (
//           <Box display="flex" alignItems="center" gap={1}>
//             <Avatar
//               src={params.row.partnerImage}
//               alt={params.row.partnerName}
//               sx={{ width: 32, height: 32 }}
//             />
//             <Typography variant="body2">{params.row.partnerName}</Typography>
//           </Box>
//         ),
//       },
//       {
//         field: 'serviceInfo',
//         headerName: 'Service Info',
//         flex: 1.2,
//         renderCell: (params) => (
//           <Box>
//             <Typography variant="body2" fontWeight="600">
//               {params.row.serviceName}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               {params.row.serviceCategory}
//             </Typography>
//           </Box>
//         ),
//       },
//       {
//         field: 'orderValue',
//         headerName: 'Amount',
//         width: 100,
//         renderCell: (params) => (
//           <Typography variant="body2" fontWeight="600" color="primary">
//             ₹{params.row.orderValue?.toFixed(2)}
//           </Typography>
//         ),
//       },
//       {
//         field: 'priority',
//         headerName: 'Priority',
//         width: 100,
//         renderCell: (params) => getPriorityChip(params.row.priority),
//       },
//       {
//         field: 'location',
//         headerName: 'Location',
//         flex: 1,
//       },
//       {
//         field: 'status',
//         headerName: 'Status',
//         width: 120,
//         renderCell: (params) => getStatusChip(params.row.status),
//       },
//       {
//         field: 'action',
//         headerName: 'Actions',
//         width: 100,
//         sortable: false,
//         filterable: false,
//         renderCell: (params) => (
//           <Box display="flex" gap={0.5}>
//             <Button
//               size="small"
//               color="primary"
//               variant="contained"
//               onClick={() => handleUpdateStatus(params.row)}
//               disabled={loading}
//               sx={{ minWidth: '32px', padding: '4px 6px' }}
//               title="Update Status"
//             >
//               <IconAnalyze stroke={1.5} size={16} />
//             </Button>

            

//             <Button
//               size="small"
//               color="info"
//               variant="contained"
//               onClick={() => handleViewOrder(params.row)}
//               disabled={loading}
//               sx={{ minWidth: '32px', padding: '4px 6px' }}
//               title="View Order"
//             >
//               <IconEye size={16} />
//             </Button>
//           </Box>
//         ),
//       },
//     ],
//     [loading],
//   );

//   const rows = useMemo(
//     () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
//     [filteredData],
//   );

//   return (
//     <PageContainer
//       title="Service Orders Management"
//       description="Manage all service orders from verified partners"
//     >
//       <Breadcrumb title="Service Orders Management" items={BCrumb} />
//       <ToastContainer position="top-right" autoClose={3000} />

//       <Paper
//         variant="outlined"
//         sx={{
//           mt: 3,
//           border: `1px solid ${theme.palette.divider}`,
//           borderRadius: '8px',
//           boxShadow: theme.shadows[2],
//         }}
//       >
//         {/* Header */}
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           p={2}
//           flexWrap="wrap"
//           gap={2}
//         >
//           <Typography variant="h6">Service Orders Management</Typography>
//           <Box display="flex" gap={2} alignItems="center">
//             <TextField
//               size="small"
//               placeholder="Search orders..."
//               value={search}
//               onChange={handleSearch}
//               sx={{ minWidth: { xs: 150, sm: 250 }, bgcolor: 'white' }}
//             />
//             {/* <Button
//               variant="contained"
//               color="primary"
//               startIcon={<IconPlus size={20} />}
//               onClick={() => toast.info('Create new order functionality')}
//             >
//               Create Order
//             </Button> */}
            
//           </Box>
//         </Box>

//         {/* Tabs */}
//         <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
//           <Tabs
//             value={activeTab}
//             onChange={handleTabChange}
//             variant="scrollable"
//             scrollButtons="auto"
//             allowScrollButtonsMobile
//           >
//             {Object.entries(orderStatusConfig).map(([key, config]) => (
//               <StyledTab
//                 key={key}
//                 label={
//                   <Badge
//                     badgeContent={config.count}
//                     color={config.color}
//                     sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem' } }}
//                   >
//                     {config.label}
//                   </Badge>
//                 }
//                 value={key}
//               />
//             ))}
//           </Tabs>
//         </Box>

//         <Divider />

//         {/* Data Grid */}
//         <CardContent>
//           <Box sx={{ height: 600, width: '100%' }}>
//             <DataGrid
//               rows={rows}
//               columns={columns}
//               pageSize={10}
//               rowHeight={60}
//               pageSizeOptions={[5, 10, 20, 50]}
//               disableRowSelectionOnClick
//               loading={loading}
//               density="comfortable"
//               sx={{
//                 '& .MuiDataGrid-cell': {
//                   borderBottom: `1px solid ${theme.palette.divider}`,
//                 },
//                 '& .MuiDataGrid-row:hover': {
//                   backgroundColor: theme.palette.action.hover,
//                 },
//               }}
//             />
//           </Box>
//         </CardContent>
//       </Paper>

//       {/* Status Update Modal */}
//       <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
//         <DialogTitle>Update Order Status</DialogTitle>
//         <form onSubmit={handleEditSubmit}>
//           <DialogContent>
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={12}>
//                 <CustomFormLabel htmlFor="status">Status*</CustomFormLabel>
//                 <CustomSelect
//                   id="status"
//                   name="status"
//                   value={formEdit.status}
//                   onChange={handleEditInputChange}
//                   fullWidth
//                   required
//                 >
//                   <MenuItem value="" disabled>
//                     Select Status
//                   </MenuItem>
//                   <MenuItem value="received">Received</MenuItem>
//                   <MenuItem value="accepted">Accepted</MenuItem>
//                   <MenuItem value="appointment-confirmed">Appointment Confirmed</MenuItem>
//                   <MenuItem value="in-progress">In Progress</MenuItem>
//                   <MenuItem value="completed">Completed</MenuItem>
//                   <MenuItem value="amount-received">Amount Received</MenuItem>
//                   <MenuItem value="cancelled">Cancelled</MenuItem>
//                 </CustomSelect>
//               </Grid>
//               <Grid item xs={12}>
//                 <CustomFormLabel htmlFor="comment">Comments</CustomFormLabel>
//                 <CustomTextField
//                   id="comment"
//                   name="comment"
//                   value={formEdit.comment}
//                   onChange={handleEditInputChange}
//                   placeholder="Add any additional comments..."
//                   multiline
//                   rows={3}
//                   fullWidth
//                 />
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions sx={{ p: 3 }}>
//             <Button onClick={handleCloseModal} variant="outlined">
//               Cancel
//             </Button>
//             <Button type="submit" variant="contained" color="primary">
//               Update Status
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </PageContainer>
//   );
// };

// export default OnDemandBookings;

import React from 'react'

const OnDemandBookings = () => {
  return (
    <div>OnDemandBookings</div>
  )
}

export default OnDemandBookings
import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconShoppingCart, IconClock, IconTruck, IconSnowflake } from '@tabler/icons-react';
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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, NavLink } from 'react-router-dom';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Work In Progress - Grocery' }
];

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
    }
  }
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

// Mock Data for Work In Progress Grocery Orders
const workInProgressOrdersData = [
  {
    _id: '1',
    orderId: 'GRO-ORD-2024-004',
    customerName: 'Arjun Mehta',
    customerPhone: '+91 98765 43212',
    customerEmail: 'arjun.mehta@email.com',
    storeName: 'SuperFresh Mart',
    storeImage: '/images/stores/superfresh.jpg',
    packerName: 'Priya Sharma',
    storeType: 'Premium Supermarket',
    orderType: 'Family Weekly Shopping',
    totalItems: 22,
    orderDate: '2024-08-17',
    orderTime: '11:00 AM',
    orderValue: 3200.00,
    location: 'Hebbal, Bangalore',
    status: 'workInProgress',
    priority: 'high',
    startedAt: '2024-08-20 10:30',
    estimatedCompletion: '2024-08-20 12:15',
    progressPercentage: 70,
    currentStage: 'Quality Check & Cold Storage Packing',
    itemsPicked: 20,
    itemsRemaining: 2,
    perishableItems: 8,
    coldStorageRequired: true,
    deliveryVehicle: 'Refrigerated Van RV-101',
    qualityCheckStatus: 'in_progress',
  },
  {
    _id: '2',
    orderId: 'GRO-ORD-2024-011',
    customerName: 'Kavitha Nair',
    customerPhone: '+91 87654 32111',
    customerEmail: 'kavitha.nair@email.com',
    storeName: 'OrganicLife Store',
    storeImage: '/images/stores/organiclife.jpg',
    packerName: 'Suresh Kumar',
    storeType: 'Organic Specialty Store',
    orderType: 'Organic Health Pack',
    totalItems: 15,
    orderDate: '2024-08-17',
    orderTime: '2:00 PM',
    orderValue: 2100.00,
    location: 'Marathahalli, Bangalore',
    status: 'workInProgress',
    priority: 'medium',
    startedAt: '2024-08-20 14:15',
    estimatedCompletion: '2024-08-20 15:45',
    progressPercentage: 45,
    currentStage: 'Organic Item Verification & Packing',
    itemsPicked: 10,
    itemsRemaining: 5,
    perishableItems: 12,
    coldStorageRequired: true,
    deliveryVehicle: 'Eco Van EV-205',
    qualityCheckStatus: 'pending',
  },
];

// Updated Order status configurations with routes for Grocery
const orderStatusConfig = [
  {
    key: 'pending',
    label: 'Pending',
    description: 'Orders awaiting store response',
    color: 'warning',
    route: '/grocery/pending',
  },
  {
    key: 'accepted',
    label: 'Accepted',
    description: 'Orders accepted by store',
    color: 'primary',
    route: '/grocery/accepted',
  },
  {
    key: 'work-in-progress',
    label: 'Work In Progress',
    description: 'Orders being prepared',
    color: 'info',
    route: '/grocery/work-in-progress',
  },
  {
    key: 'completed',
    label: 'Completed',
    description: 'Orders delivered successfully',
    color: 'success',
    route: '/grocery/completed',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    description: 'Orders cancelled by customer',
    color: 'error',
    route: '/grocery/cancelled',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    description: 'Orders rejected by store',
    color: 'error',
    route: '/grocery/rejected',
  },
  {
    key: 'missed',
    label: 'Missed',
    description: 'Orders not responded in time',
    color: 'secondary',
    route: '/grocery/missed',
  },
];

// Main Work In Progress Component for Grocery
const WorkInProgress = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [formEdit, setFormEdit] = useState({
    _id: '',
    status: '',
    comment: '',
  });

  const navigate = useNavigate();

  // Filter data based on search
  useEffect(() => {
    if (search === '') {
      setFilteredData(workInProgressOrdersData);
    } else {
      const filtered = workInProgressOrdersData.filter((item) =>
        item.customerName.toLowerCase().includes(search.toLowerCase()) ||
        item.orderId.toLowerCase().includes(search.toLowerCase()) ||
        item.storeName.toLowerCase().includes(search.toLowerCase()) ||
        item.orderType.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [search]);

  const handleViewOrder = (orderData) => {
    toast.info(`Viewing order ${orderData.orderId}`);
    localStorage.setItem('orderId', orderData._id);
  };

  const handleUpdateStatus = (orderData) => {
    setFormEdit({
      _id: orderData._id,
      status: orderData.status,
      comment: '',
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormEdit({ _id: '', status: '', comment: '' });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEditInputChange = (e) => {
    setFormEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    toast.success('Order status updated successfully');
    handleCloseModal();
  };

  const getPriorityChip = (priority) => {
    const colorMap = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return (
      <Chip 
        label={priority?.toUpperCase() || 'MEDIUM'} 
        size="small" 
        color={colorMap[priority] || 'info'} 
        variant="filled" 
      />
    );
  };

  const getQualityCheckChip = (status) => {
    const colorMap = {
      'completed': 'success',
      'in_progress': 'info',
      'pending': 'warning',
      'failed': 'error'
    };
    const labels = {
      'completed': 'QC PASSED',
      'in_progress': 'QC IN PROGRESS',
      'pending': 'QC PENDING',
      'failed': 'QC FAILED'
    };
    return (
      <Chip 
        label={labels[status] || 'QC PENDING'} 
        size="small" 
        color={colorMap[status] || 'warning'} 
        variant="outlined" 
      />
    );
  };

  const getColdStorageChip = (required) => {
    if (!required) return null;
    return (
      <Chip 
        label="COLD STORAGE" 
        size="small" 
        color="info" 
        variant="outlined" 
        icon={<IconSnowflake size={12} />}
      />
    );
  };

  const getProgressBar = (percentage) => {
    const color = percentage >= 75 ? 'success.main' : percentage >= 50 ? 'info.main' : percentage >= 25 ? 'warning.main' : 'error.main';
    return (
      <Box sx={{ width: '100%', mt: 0.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Packing Progress
          </Typography>
          <Typography variant="caption" color={color} fontWeight="600">
            {percentage}%
          </Typography>
        </Box>
        <Box sx={{ 
          height: 4, 
          bgcolor: 'grey.200', 
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            width: `${percentage}%`, 
            height: '100%', 
            bgcolor: color,
            transition: 'width 0.3s ease'
          }} />
        </Box>
      </Box>
    );
  };

  const getItemPickingStatus = (picked, total) => {
    return (
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Items: {picked}/{total} picked
        </Typography>
        <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
          Remaining: {total - picked}
        </Typography>
      </Box>
    );
  };

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
      },
      {
        field: 'orderInfo',
        headerName: 'Order Info',
        flex: 1.3,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.orderId}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {params.row.orderDate} at {params.row.orderTime}
            </Typography>
            <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
              Started: {params.row.startedAt}
            </Typography>
            <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
              ETA: {params.row.estimatedCompletion}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'customerInfo',
        headerName: 'Customer Info',
        flex: 1.2,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.customerName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {params.row.customerPhone}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'storeInfo',
        headerName: 'Store & Packer',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
              <Avatar
                src={params.row.storeImage}
                alt={params.row.storeName}
                sx={{ width: 36, height: 36 }}
              />
              <Box>
                <Typography variant="body2" fontWeight="500" sx={{ lineHeight: 1.2 }}>
                  {params.row.storeName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Packer: {params.row.packerName}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {getQualityCheckChip(params.row.qualityCheckStatus)}
              {getColdStorageChip(params.row.coldStorageRequired)}
            </Box>
          </Box>
        ),
      },
      {
        field: 'packingProgress',
        headerName: 'Packing Progress',
        flex: 1.5,
        renderCell: (params) => (
          <Box sx={{ py: 1, width: '100%' }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.orderType}
            </Typography>
            {getItemPickingStatus(params.row.itemsPicked, params.row.totalItems)}
            <Typography variant="caption" color="info.main" sx={{ display: 'block', mb: 0.5 }}>
              Stage: {params.row.currentStage}
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ display: 'block', mb: 0.5 }}>
              Vehicle: {params.row.deliveryVehicle}
            </Typography>
            {getProgressBar(params.row.progressPercentage)}
          </Box>
        ),
      },
      {
        field: 'orderValue',
        headerName: 'Amount',
        width: 110,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="600" color="primary">
            ₹{params.row.orderValue?.toFixed(2)}
          </Typography>
        ),
      },
      {
        field: 'priority',
        headerName: 'Priority',
        width: 110,
        renderCell: (params) => getPriorityChip(params.row.priority),
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: 1,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ py: 1 }}>
            {params.row.location}
          </Typography>
        ),
      },
      {
        field: 'action',
        headerName: 'Actions',
        width: 130,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={0.5} sx={{ py: 1 }}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleUpdateStatus(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              title="Update Progress"
            >
              <IconAnalyze stroke={1.5} size={16} />
            </Button>

            <Button
              size="small"
              color="info"
              variant="contained"
              onClick={() => handleViewOrder(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              title="View Order"
            >
              <IconEye size={16} />
            </Button>
          </Box>
        ),
      },
    ],
    [loading],
  );

  const rows = useMemo(
    () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
    [filteredData],
  );

  return (
    <PageContainer
      title="Work In Progress - Grocery"
      description="Monitor and manage ongoing grocery order packing and quality control processes"
    >
      <Breadcrumb title="Work In Progress - Grocery" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Status Navigation Cards */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Order Status Navigation</Typography>
        <Grid container spacing={2}>
          {orderStatusConfig.map((status) => (
            <Grid item xs={12} sm={6} md={4} lg={12/7} key={status.key}>
              <StyledNavLink 
                to={status.route}
                end
              >
                <StatusCard className="status-card">
                  <CardActionArea sx={{ 
                    height: '100%', 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <CardContent sx={{ 
                      textAlign: 'center', 
                      py: 2, 
                      px: 1.5,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%'
                    }}>
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
                          hyphens: 'auto'
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
                          overflow: 'hidden'
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
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h6">Work In Progress - Grocery</Typography>
            <Typography variant="body2" color="text.secondary">
              Grocery orders currently being packed with quality control and cold storage management ({filteredData.length} orders)
            </Typography>
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search orders..."
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 250 }, bgcolor: 'white' }}
            />
          </Box>
        </Box>

        <Divider />

        {/* Data Grid */}
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowHeight={120}
              pageSizeOptions={[5, 10, 20, 50]}
              disableRowSelectionOnClick
              loading={loading}
              density="comfortable"
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.grey[50],
                  fontWeight: 600,
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Status Update Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Update Packing Progress</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="status">Action*</CustomFormLabel>
                <CustomSelect
                  id="status"
                  name="status"
                  value={formEdit.status}
                  onChange={handleEditInputChange}
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled>
                    Select Action
                  </MenuItem>
                  <MenuItem value="completed">Mark as Ready for Delivery</MenuItem>
                  <MenuItem value="quality-check">Perform Quality Check</MenuItem>
                  <MenuItem value="cold-storage">Move to Cold Storage</MenuItem>
                  <MenuItem value="update-progress">Update Packing Progress</MenuItem>
                  <MenuItem value="assign-vehicle">Assign Delivery Vehicle</MenuItem>
                  <MenuItem value="cancelled">Cancel Due to Issues</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Progress Notes</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add packing progress details, quality control notes, cold storage requirements, or delivery preparation updates..."
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseModal} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Progress
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default WorkInProgress;

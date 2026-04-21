import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconAnalyze, IconEye, IconTrash, IconChartBar, IconDotsVertical } from '@tabler/icons-react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Paper,
  Box,
  Typography,
  Divider,
  CardContent,
  Chip,
  Grid,
  styled,
  Select,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { URLS } from '../../Url';

// Styled Components
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    minWidth: 180,
    boxShadow: theme.shadows[8],
    borderRadius: '8px',
    '& .MuiMenuItem-root': {
      padding: '10px 16px',
      gap: '12px',
      fontSize: '0.875rem',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  },
}));

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Blocked Service Provider' }];

const BlockedServiceProvider = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  // State management
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formEdit, setFormEdit] = useState({
    _id: '',
    status: '',
    kyc_status: '',
    bankDetailsStatus: '',
    comment: '',
  });

  const [openMetricsModal, setOpenMetricsModal] = useState(false);
  const [metricsForm, setMetricsForm] = useState({
    providerId: '',
    providerType: 'regular',
    metrics: {
      satisfactionRate: 0,
      totalRatings: 0,
      happyResidents: 0,
      safeLocations: 0,
      isVerified: false
    }
  });
  const [bulkForm, setBulkForm] = useState({ // âœ… NEW: Bulk form state
    status: '',
    kyc_status: '',
    bankDetailsStatus: '',
    comment: '',
  });

  const childCategories = [
    { label: 'ALL', id: '' },
    { label: 'Verified Partners', id: '683dbbfbb62d2a241de0f7e3' },
    { label: 'Service Center', id: '683dbc04b62d2a241de0f7e8' }
  ];

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  // Fetch provider data
  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetProviderStatus,
        {
          type: 'blocked',
          childcategoryId: selectedCategoryId
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.activeproviders || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch providers.');
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    getData();
  }, [selectedCategoryId]);

  // Filter data based on search
  useEffect(() => {
    if (search === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        `${item.firstName} ${item.lastName}`.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [data, search]);

  // Handlers
  const handleViewPopUp = (data) => {
    navigate('/view-provider');
    localStorage.setItem('providerId', data._id);
    handleActionMenuClose();
  };

  const handleActionMenuOpen = (event, row) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRow(null);
  };

  const handleEditInputChange = (e) => {
    setFormEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditPopUp = (data) => {
    setFormEdit({
      _id: data._id,
      status: data.status || '',
      kyc_status: data.kyc_status || '',
      bankDetailsStatus: data.bankDetailsStatus || '',
      comment: data.comment || '',
    });
    setOpenModal(true);
    handleActionMenuClose();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleMetricsPopUp = async (data) => {
    setLoading(true);
    try {
      const res = await axios.get(`${URLS.GetProviderMetrics}?providerId=${data._id}&providerType=regular`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const metricsData = res.data.data?.displayMetrics || res.data.metrics || res.data.data?.metrics;

      if (metricsData) {
        setMetricsForm({
          providerId: data._id,
          providerType: 'regular',
          metrics: {
            satisfactionRate: metricsData.satisfactionRate ?? 0,
            totalRatings: metricsData.totalRatings ?? 0,
            happyResidents: metricsData.happyResidents ?? 0,
            safeLocations: metricsData.safeLocations ?? 0,
            isVerified: metricsData.isVerified ?? false
          }
        });
      } else {
        setMetricsForm({
          providerId: data._id,
          providerType: 'regular',
          metrics: {
            satisfactionRate: 0,
            totalRatings: 0,
            happyResidents: 0,
            safeLocations: 0,
            isVerified: false
          }
        });
      }
      setOpenMetricsModal(true);
    } catch (error) {
      console.error('Error fetching metrics', error);
      setMetricsForm({
        providerId: data._id,
        providerType: 'regular',
        metrics: {
          satisfactionRate: 0,
          totalRatings: 0,
          happyResidents: 0,
          safeLocations: 0,
          isVerified: false
        }
      });
      setOpenMetricsModal(true);
    } finally {
      setLoading(false);
      handleActionMenuClose();
    }
  };

  const handleMetricsChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = value;

    if (type === 'checkbox') {
      finalValue = checked;
    } else if (value === '') {
      finalValue = 0;
    } else {
      finalValue = name === 'satisfactionRate' ? parseFloat(value) : parseInt(value);
      if (isNaN(finalValue)) finalValue = 0;
    }

    setMetricsForm(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [name]: finalValue
      }
    }));
  };

  const handleMetricsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(URLS.UpdateProviderMetrics, metricsForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message || 'Metrics updated successfully');
      setOpenMetricsModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        status: formEdit.status,
        kyc_status: formEdit.kyc_status,
        bankDetailsStatus: formEdit.bankDetailsStatus,
        comment: formEdit.comment,
      };

      const res = await axios.put(`${URLS.UpdateProviderStatus}${formEdit._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message);
      getData();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    if (window.confirm('Do you really want to delete this provider?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteProvider}/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          getData();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
    handleActionMenuClose();
  };

  // âœ… NEW: Bulk Delete Handler
  const handleBulkDelete = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (selectionModel.length === 0) {
      toast.warning('Please select at least one provider to delete.');
      return;
    }

    const selectedProviders = selectionModel
      .map((id) => rows.find((r) => r.id === id))
      .filter(Boolean);

    if (
      !window.confirm(
        `Do you really want to delete ${selectedProviders.length} provider(s)?\n\nThis action cannot be undone.`,
      )
    ) {
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const provider of selectedProviders) {
        try {
          await axios.delete(`${URLS.DeleteProvider}/${provider._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to delete provider ${provider._id}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} provider(s).`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to delete ${errorCount} provider(s).`);
      }

      setSelectionModel([]);
      getData();
    } catch (error) {
      toast.error('An error occurred during bulk delete.');
    } finally {
      setLoading(false);
    }
  };

  // âœ… NEW: Bulk Status Update Handler
  const handleBulkStatusUpdate = () => {
    if (selectionModel.length === 0) {
      toast.warning('Please select at least one provider.');
      return;
    }
    setBulkForm({ status: '', comment: '' });
    setOpenBulkModal(true);
  };

  const handleBulkFormChange = (e) => {
    setBulkForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    const selectedProviders = selectionModel
      .map((id) => rows.find((r) => r.id === id))
      .filter(Boolean);

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const provider of selectedProviders) {
        try {
          const payload = {
            status: bulkForm.status,
            kyc_status: bulkForm.kyc_status,
            bankDetailsStatus: bulkForm.bankDetailsStatus,
            ...((bulkForm.status === 'rejected' ||
              bulkForm.status === 'blocked' ||
              bulkForm.kyc_status === 'rejected' ||
              bulkForm.kyc_status === 'blocked' ||
              bulkForm.bankDetailsStatus === 'rejected' ||
              bulkForm.bankDetailsStatus === 'blocked') && {
              comment: bulkForm.comment,
            }),
          };

          await axios.put(`${URLS.UpdateProviderStatus}${provider._id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to update provider ${provider._id}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully updated ${successCount} provider(s).`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to update ${errorCount} provider(s).`);
      }

      setSelectionModel([]);
      setOpenBulkModal(false);
      getData();
    } catch (error) {
      toast.error('An error occurred during bulk update.');
    } finally {
      setLoading(false);
    }
  };

  // DataGrid columns
  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 60,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return (
            <Box display="flex" alignItems="center" height="100%">
              {sortedRows.indexOf(params.id) + 1}
            </Box>
          );
        },
      },
      {
        field: 'sectionInfo',
        headerName: 'Provider Info',
        width: 200,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2} height="100%">
            <Avatar
              src={`${URLS.FileBase}${params.row.image}`}
              alt={`${params.row.firstName} ${params.row.lastName}`}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">{`${params.row.firstName} ${params.row.lastName}`}</Typography>
          </Box>
        ),
      },
      {
        field: 'phone',
        headerName: 'Phone',
        width: 140,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" height="100%">
            <Typography variant="body2">{params.row.phone}</Typography>
          </Box>
        ),
      },
      {
        field: 'email',
        headerName: 'Email',
        width: 200,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" height="100%">
            <Typography variant="body2">{params.row.email}</Typography>
          </Box>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 110,
        renderCell: (params) => {
          let statusText;
          let statusColor;

          if (params.row.status === 'active') {
            statusText = 'Active';
            statusColor = 'primary';
          } else if (params.row.status === 'rejected') {
            statusText = 'Rejected';
            statusColor = 'error';
          } else if (params.row.status === 'blocked') {
            statusText = 'Blocked';
            statusColor = 'error';
          } else {
            statusText = 'Inactive';
            statusColor = 'default';
          }

          return (
            <Box display="flex" alignItems="center" height="100%">
              <Chip label={statusText} size="small" color={statusColor} variant="outlined" />
            </Box>
          );
        },
      },
      {
        field: 'comment',
        headerName: 'Reason',
        width: 200,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" height="100%">
            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {params.row.comment || '--'}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 80,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <IconButton size="small" onClick={(e) => handleActionMenuOpen(e, params.row)} sx={{ p: 0 }}>
              <IconDotsVertical size={20} />
            </IconButton>
          </Box>
        ),
      },
    ],
    [loading, theme.palette],
  );

  // DataGrid rows
  const rows = useMemo(
    () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
    [filteredData],
  );

  return (
    <PageContainer
      title="Blocked Service Providers"
      description="Manage Blocked service provider approvals"
    >
      <Breadcrumb title="Blocked Service Provider Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main Content */}
      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Child Category Tabs */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              overflowX: 'auto',
              mb: 3,
              pb: 1,
              '::-webkit-scrollbar': { height: '6px' },
              '::-webkit-scrollbar-track': { background: '#f1f1f1' },
              '::-webkit-scrollbar-thumb': { background: '#ccc', borderRadius: '4px' },
            }}
          >
            {childCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategoryId === cat.id ? 'contained' : 'outlined'}
                onClick={() => setSelectedCategoryId(cat.id)}
                sx={{
                  borderRadius: '8px',
                  whiteSpace: 'nowrap',
                  minWidth: 'auto',
                  px: 3,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: selectedCategoryId === cat.id ? '0 4px 12px rgba(0,115,103,0.2)' : 'none',
                  backgroundColor: selectedCategoryId === cat.id ? '#007367' : 'transparent',
                  color: selectedCategoryId === cat.id ? '#ffffff' : '#757575',
                  borderColor: selectedCategoryId === cat.id ? '#007367' : '#e0e0e0',
                  '&:hover': {
                    backgroundColor: selectedCategoryId === cat.id ? '#005d54' : '#e0f2f1',
                    color: selectedCategoryId === cat.id ? '#ffffff' : '#007367',
                    borderColor: '#007367',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                {cat.label}
              </Button>
            ))}
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={3}
          >
            <Typography variant="h6" sx={{ minWidth: 'fit-content' }}>
              Service Provider List
            </Typography>
            <Box
              display="flex"
              gap={2}
              alignItems="center"
              flexWrap="wrap"
              sx={{ flexGrow: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}
            >
              <TextField
                size="small"
                placeholder="Search by name"
                value={search}
                onChange={handleSearch}
                sx={{ minWidth: { xs: '100%', sm: 250 }, bgcolor: 'background.paper' }}
              />

              <Box display="flex" gap={1} flexWrap="wrap">
                {/* âœ… NEW: Bulk Status Update Button */}
                {(rolesAndPermission.blocked_providers_view || rolesAndPermission.accessAll) && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    disabled={loading || selectionModel.length === 0}
                    onClick={handleBulkStatusUpdate}
                    startIcon={<IconAnalyze size={18} />}
                  >
                    Status ({selectionModel.length})
                  </Button>
                )}

                {/* âœ… NEW: Bulk Delete Button */}
                {(rolesAndPermission.blocked_providers_edit || rolesAndPermission.accessAll) && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    disabled={loading || selectionModel.length === 0}
                    onClick={handleBulkDelete}
                    startIcon={<IconTrash size={18} />}
                  >
                    Delete ({selectionModel.length})
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%', overflowX: 'auto' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowHeight={65}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              loading={loading}
              autoHeight
              checkboxSelection // âœ… Enable checkbox selection
              rowSelectionModel={selectionModel} // âœ… Controlled selection
              onRowSelectionModelChange={(newSelection) => {
                setSelectionModel(newSelection);
              }}
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Styled Action Menu */}
      <StyledMenu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {(rolesAndPermission.blocked_providers_view || rolesAndPermission.accessAll) && (
          <MenuItem onClick={() => handleEditPopUp(selectedRow)}>
            <ListItemIcon>
              <IconAnalyze size={18} color={theme.palette.info.main} />
            </ListItemIcon>
            <ListItemText>Analyze</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => handleViewPopUp(selectedRow)}>
          <ListItemIcon>
            <IconEye size={18} color={theme.palette.primary.main} />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        {(rolesAndPermission.blocked_providers_view || rolesAndPermission.accessAll) && (
          <MenuItem onClick={() => handleMetricsPopUp(selectedRow)}>
            <ListItemIcon>
              <IconChartBar size={18} color={theme.palette.secondary.main} />
            </ListItemIcon>
            <ListItemText>View Metrics</ListItemText>
          </MenuItem>
        )}

        {(rolesAndPermission.blocked_providers_edit || rolesAndPermission.accessAll) && (
          <MenuItem onClick={() => handleDelete(selectedRow)}>
            <ListItemIcon>
              <IconTrash size={18} color={theme.palette.error.main} />
            </ListItemIcon>
            <ListItemText>Delete Provider</ListItemText>
          </MenuItem>
        )}
      </StyledMenu>

      {/* Single Edit Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Update Provider Status</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="status">Account Status</CustomFormLabel>
                <CustomSelect
                  id="status"
                  name="status"
                  value={formEdit.status}
                  onChange={handleEditInputChange}
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Select Status
                  </MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </CustomSelect>
              </Grid>

              {(formEdit.status === 'blocked' || formEdit.status === 'rejected') && (
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="comment" required>
                    Reason for Block/Reject*
                  </CustomFormLabel>
                  <CustomTextField
                    id="comment"
                    name="comment"
                    value={formEdit.comment}
                    onChange={handleEditInputChange}
                    placeholder="Please provide reason..."
                    multiline
                    rows={4}
                    fullWidth
                    required
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseModal} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Status
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Bulk Status Update Modal */}
      <Dialog
        open={openBulkModal}
        onClose={() => setOpenBulkModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Status for {selectionModel.length} Provider(s)</DialogTitle>
        <form onSubmit={handleBulkSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="bulkStatus">Account Status</CustomFormLabel>
                <CustomSelect
                  id="bulkStatus"
                  name="status"
                  value={bulkForm.status}
                  onChange={handleBulkFormChange}
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled>
                    Select Status
                  </MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </CustomSelect>
              </Grid>

              {(bulkForm.status === 'rejected' || bulkForm.status === 'blocked') && (
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="bulkComment">Reason for Block/Reject*</CustomFormLabel>
                  <CustomTextField
                    id="bulkComment"
                    name="comment"
                    value={bulkForm.comment}
                    onChange={handleBulkFormChange}
                    placeholder="Please provide reason..."
                    multiline
                    rows={4}
                    fullWidth
                    required
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenBulkModal(false)} variant="outlined" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              Update All
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Metrics Modal */}
      <Dialog open={openMetricsModal} onClose={() => setOpenMetricsModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Provider Performance Metrics</DialogTitle>
        <form onSubmit={handleMetricsSubmit}>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="satisfactionRate">Satisfaction Rate (0-5)</CustomFormLabel>
                <CustomTextField
                  id="satisfactionRate"
                  name="satisfactionRate"
                  type="number"
                  inputProps={{ step: "0.1", min: "0", max: "5" }}
                  value={metricsForm.metrics.satisfactionRate}
                  onChange={handleMetricsChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="totalRatings">Total Ratings</CustomFormLabel>
                <CustomTextField
                  id="totalRatings"
                  name="totalRatings"
                  type="number"
                  value={metricsForm.metrics.totalRatings}
                  onChange={handleMetricsChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="happyResidents">Happy Residents</CustomFormLabel>
                <CustomTextField
                  id="happyResidents"
                  name="happyResidents"
                  type="number"
                  value={metricsForm.metrics.happyResidents}
                  onChange={handleMetricsChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="safeLocations">Safe Locations</CustomFormLabel>
                <CustomTextField
                  id="safeLocations"
                  name="safeLocations"
                  type="number"
                  value={metricsForm.metrics.safeLocations}
                  onChange={handleMetricsChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <FormControlLabel
                  control={
                    <Switch
                      checked={metricsForm.metrics.isVerified}
                      onChange={handleMetricsChange}
                      name="isVerified"
                      color="primary"
                    />
                  }
                  label="Show Verified Badge on App"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenMetricsModal(false)} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              Save Metrics
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default BlockedServiceProvider;


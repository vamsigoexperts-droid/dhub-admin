import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconAnalyze,
  IconTablePlus,
  IconSettingsAutomation,
  IconChartBar,
  IconCircle,
  IconDotsVertical
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
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
  Switch,
  FormControlLabel,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { URLS } from '../../Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Service Provider ' }];

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

const Providers = () => {
  const theme = useTheme();
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
    comment: '',
  });

  const [bulkForm, setBulkForm] = useState({
    status: '',
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

  const childCategories = [
    { label: 'ALL', id: '' },
    { label: 'Verified Partners', id: '683dbbfbb62d2a241de0f7e3' },
    { label: 'Service Center', id: '683dbc04b62d2a241de0f7e8' }
  ];

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData?.rolesAndPermission?.[0] || {};
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const handleActionMenuOpen = (event, row) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRow(null);
  };

  const handleAddPopUp = () => { navigate('/add-provider'); };
  const handleServiceRequests = (row) => {
    localStorage.setItem('ProfessionalProviderId', row._id);
    navigate('/service-requests');
    handleActionMenuClose();
  };
  const handleViewPopUp = (row) => {
    navigate('/view-provider');
    localStorage.setItem('providerId', row._id);
    handleActionMenuClose();
  };
  const handleEditPopUp = (row) => {
    navigate('/edit-provider');
    localStorage.setItem('providerId', row._id);
    handleActionMenuClose();
  };

  const handleMetricsPopUp = async (row) => {
    setLoading(true);
    try {
      const res = await axios.get(`${URLS.GetProviderMetrics}?providerId=${row._id}&providerType=regular`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const metricsData = res.data.data?.displayMetrics || res.data.metrics || res.data.data?.metrics;
      if (metricsData) {
        setMetricsForm({
          providerId: row._id,
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
          providerId: row._id,
          providerType: 'regular',
          metrics: { satisfactionRate: 0, totalRatings: 0, happyResidents: 0, safeLocations: 0, isVerified: false }
        });
      }
      setOpenMetricsModal(true);
    } catch (error) {
      setMetricsForm({
        providerId: row._id,
        providerType: 'regular',
        metrics: { satisfactionRate: 0, totalRatings: 0, happyResidents: 0, safeLocations: 0, isVerified: false }
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
    if (type === 'checkbox') finalValue = checked;
    else if (value === '') finalValue = 0;
    else {
      finalValue = name === 'satisfactionRate' ? parseFloat(value) : parseInt(value);
      if (isNaN(finalValue)) finalValue = 0;
    }
    setMetricsForm(prev => ({ ...prev, metrics: { ...prev.metrics, [name]: finalValue } }));
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
    } finally { setLoading(false); }
  };

  const handleDelete = async (row) => {
    if (!token) return;
    if (window.confirm('Do you really want to delete this provider?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteProvider}/${row._id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 200) { toast.success(res.data.message); getData(); }
      } catch (error) { toast.error('Delete failed'); }
      finally { setLoading(false); }
    }
    handleActionMenuClose();
  };

  const handleBulkDelete = async () => {
    if (!token || selectionModel.length === 0) return;
    const selectedProviders = selectionModel.map((id) => rows.find((r) => r.id === id)).filter(Boolean);
    if (!window.confirm(`Do you really want to delete ${selectedProviders.length} provider(s)?`)) return;
    setLoading(true);
    try {
      for (const p of selectedProviders) {
        await axios.delete(`${URLS.DeleteProvider}/${p._id}`, { headers: { Authorization: `Bearer ${token}` } });
      }
      toast.success('Successfully deleted selected providers.');
      setSelectionModel([]);
      getData();
    } catch (error) { toast.error('Bulk delete failed.'); }
    finally { setLoading(false); }
  };

  const handleBulkStatusUpdate = () => {
    if (selectionModel.length === 0) return;
    setBulkForm({ status: '', comment: '' });
    setOpenBulkModal(true);
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    const selectedProviders = selectionModel.map((id) => rows.find((r) => r.id === id)).filter(Boolean);
    setLoading(true);
    try {
      for (const p of selectedProviders) {
        const payload = { status: bulkForm.status, ...((bulkForm.status === 'rejected' || bulkForm.status === 'blocked') && { comment: bulkForm.comment }) };
        await axios.put(`${URLS.UpdateProviderStatus}${p._id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      toast.success('Bulk status update completed.');
      setSelectionModel([]);
      setOpenBulkModal(false);
      getData();
    } catch (error) { toast.error('Bulk update failed.'); }
    finally { setLoading(false); }
  };

  const getData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.post(URLS.GetProviderStatus, { type: '', childcategoryId: selectedCategoryId }, { headers: { Authorization: `Bearer ${token}` } });
      const providers = res.data.activeproviders || [];
      setData(providers.sort((a, b) => new Date(b.logCreatedDate || 0) - new Date(a.logCreatedDate || 0)));
    } catch (error) { toast.error('Failed to fetch providers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { getData(); }, [selectedCategoryId]);
  useEffect(() => {
    if (search === '') setFilteredData(data);
    else setFilteredData(data.filter((item) => `${item.firstName} ${item.lastName}`.toLowerCase().includes(search.toLowerCase())));
  }, [data, search]);

  const handleUpdatePopUp = (row) => {
    setFormEdit({ _id: row._id, status: row.status || '', comment: row.comment || '' });
    setOpenModal(true);
    handleActionMenuClose();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { status: formEdit.status, comment: formEdit.comment };
      const res = await axios.put(`${URLS.UpdateProviderStatus}${formEdit._id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(res.data.message);
      getData();
      setOpenModal(false);
    } catch (err) { toast.error('Update failed'); }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: 'sno',
        headerName: 'S.No',
        width: 60,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" height="100%">
            {params.api.getSortedRowIds().indexOf(params.id) + 1}
          </Box>
        ),
      },
      {
        field: 'sectionInfo',
        headerName: 'Provider Info',
        flex: 1.5,
        minWidth: 200,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2} height="100%">
            <Avatar src={URLS.FileBase + params.row.image} sx={{ width: 40, height: 40 }} />
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{`${params.row.firstName} ${params.row.lastName}`}</Typography>
          </Box>
        ),
      },
      {
        field: 'phone',
        headerName: 'Phone',
        width: 150,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" height="100%">
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{params.row.phone}</Typography>
          </Box>
        ),
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1.2,
        minWidth: 180,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" height="100%">
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{params.row.email}</Typography>
          </Box>
        ),
      },
      {
        field: 'childcategoryName',
        headerName: 'Child Category',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" height="100%">
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{params.row.childcategoryName}</Typography>
          </Box>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => {
          let statusText;
          let statusColor;

          switch (params.row.status) {
            case 'active':
              statusText = 'Active';
              statusColor = 'success';
              break;
            case 'rejected':
              statusText = 'Rejected';
              statusColor = 'error';
              break;
            case 'blocked':
              statusText = 'Blocked';
              statusColor = 'warning';
              break;
            default:
              statusText = 'Pending';
              statusColor = 'default';
          }

          return <Chip label={statusText} size="small" color={statusColor} variant="outlined" />;
        },
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
    ];

    return baseColumns.filter((col) => col.field !== 'childcategoryName' || selectedCategoryId === '');
  }, [selectedCategoryId, rolesAndPermission]);

  const rows = useMemo(() => filteredData?.map((item, index) => ({ id: index, ...item })) || [], [filteredData]);

  return (
    <PageContainer title="All Providers">
      <Breadcrumb title="Service Provider Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper variant="outlined" sx={{ mt: 3, borderRadius: '8px', overflow: 'hidden' }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', mb: 3, pb: 1 }}>
            {childCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategoryId === cat.id ? 'contained' : 'outlined'}
                onClick={() => setSelectedCategoryId(cat.id)}
                sx={{
                  borderRadius: '8px', px: 3, fontWeight: 600,
                  backgroundColor: selectedCategoryId === cat.id ? '#007367' : 'transparent',
                  color: selectedCategoryId === cat.id ? '#fff' : '#757575',
                  borderColor: selectedCategoryId === cat.id ? '#007367' : '#e0e0e0',
                }}
              >
                {cat.label}
              </Button>
            ))}
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" p={2} flexWrap="wrap" gap={2}>
            <Typography variant="h6">Service Provider List</Typography>
            <Box display="flex" gap={2} alignItems="center">
              <TextField size="small" placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
              {(rolesAndPermission.all_providers_edit || rolesAndPermission.accessAll) && (
                <Button variant="outlined" disabled={selectionModel.length === 0} onClick={handleBulkStatusUpdate} startIcon={<IconAnalyze size={18} />}>
                  Status ({selectionModel.length})
                </Button>
              )}
              {(rolesAndPermission.all_providers_delete || rolesAndPermission.accessAll) && (
                <Button variant="outlined" color="error" disabled={selectionModel.length === 0} onClick={handleBulkDelete} startIcon={<IconTrash size={18} />}>
                  Delete ({selectionModel.length})
                </Button>
              )}
              {(rolesAndPermission.all_providers_add || rolesAndPermission.accessAll) && (
                <Button variant="contained" onClick={handleAddPopUp} startIcon={<IconPlus size={20} />}>
                  Create Provider
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        <Divider />
        <CardContent>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowSpacing={() => ({ top: 0, bottom: 0 })}
            pageSizeOptions={[5, 10, 20]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            checkboxSelection
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={setSelectionModel}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              '& .MuiDataGrid-row': {
                backgroundColor: 'white',
                borderBottom: '1px solid #f0f0f0',
                '&:hover': { backgroundColor: '#f8f9fa' }
              },
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
                padding: '8px'
              },
              '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8f9fa', borderBottom: '1px solid #f0f0f0' }
            }}
          />
        </CardContent>
      </Paper>

      <StyledMenu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {(rolesAndPermission.all_providers_edit || rolesAndPermission.accessAll) && (
          <MenuItem onClick={() => handleUpdatePopUp(selectedRow)}>
            <ListItemIcon><IconAnalyze size={18} color={theme.palette.info.main} /></ListItemIcon>
            <ListItemText>Analyze</ListItemText>
          </MenuItem>
        )}
        {(rolesAndPermission.all_providers_edit || rolesAndPermission.accessAll) && (
          <MenuItem onClick={() => handleEditPopUp(selectedRow)}>
            <ListItemIcon><IconEdit size={18} color={theme.palette.primary.main} /></ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {selectedRow?.childcategoryId !== '683dbbfbb62d2a241de0f7e3' && (
          <MenuItem onClick={() => handleServiceRequests(selectedRow)}>
            <ListItemIcon><IconTablePlus size={18} color={theme.palette.success.main} /></ListItemIcon>
            <ListItemText>Service Rates</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => handleViewPopUp(selectedRow)}>
          <ListItemIcon><IconEye size={18} color={theme.palette.secondary.main} /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        {(rolesAndPermission.all_providers_edit || rolesAndPermission.accessAll) && (
          <MenuItem onClick={() => handleMetricsPopUp(selectedRow)}>
            <ListItemIcon><IconChartBar size={18} color={theme.palette.info.dark} /></ListItemIcon>
            <ListItemText>Metrics</ListItemText>
          </MenuItem>
        )}
        {(rolesAndPermission.all_providers_delete || rolesAndPermission.accessAll) && (
          <MenuItem onClick={() => handleDelete(selectedRow)}>
            <ListItemIcon><IconTrash size={18} color={theme.palette.error.main} /></ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </StyledMenu>

      {/* Modals */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Provider Status</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel>Status</CustomFormLabel>
                <CustomSelect fullWidth value={formEdit.status} onChange={(e) => setFormEdit({ ...formEdit, status: e.target.value })}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </CustomSelect>
              </Grid>
              {(formEdit.status === 'blocked' || formEdit.status === 'rejected') && (
                <Grid item xs={12}>
                  <CustomFormLabel>Reason</CustomFormLabel>
                  <TextField fullWidth multiline rows={3} value={formEdit.comment} onChange={(e) => setFormEdit({ ...formEdit, comment: e.target.value })} />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button variant="contained" type="submit">Update</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openBulkModal} onClose={() => setOpenBulkModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Status Update ({selectionModel.length})</DialogTitle>
        <form onSubmit={handleBulkSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel>Status</CustomFormLabel>
                <CustomSelect fullWidth value={bulkForm.status} onChange={(e) => setBulkForm({ ...bulkForm, status: e.target.value })}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </CustomSelect>
              </Grid>
              {(bulkForm.status === 'rejected' || bulkForm.status === 'blocked') && (
                <Grid item xs={12}>
                  <CustomFormLabel>Reason</CustomFormLabel>
                  <TextField fullWidth multiline rows={3} value={bulkForm.comment} onChange={(e) => setBulkForm({ ...bulkForm, comment: e.target.value })} />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBulkModal(false)}>Cancel</Button>
            <Button variant="contained" type="submit">Update All</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Metrics Modal */}
      <Dialog open={openMetricsModal} onClose={() => setOpenMetricsModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Provider Metrics</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <CustomFormLabel>Satisfaction Rate (%)</CustomFormLabel>
              <TextField fullWidth type="number" name="satisfactionRate" value={metricsForm.metrics.satisfactionRate} onChange={handleMetricsChange} />
            </Grid>
            <Grid item xs={6}>
              <CustomFormLabel>Total Ratings</CustomFormLabel>
              <TextField fullWidth type="number" name="totalRatings" value={metricsForm.metrics.totalRatings} onChange={handleMetricsChange} />
            </Grid>
            <Grid item xs={6}>
              <CustomFormLabel>Happy Residents</CustomFormLabel>
              <TextField fullWidth type="number" name="happyResidents" value={metricsForm.metrics.happyResidents} onChange={handleMetricsChange} />
            </Grid>
            <Grid item xs={6}>
              <CustomFormLabel>Safe Locations</CustomFormLabel>
              <TextField fullWidth type="number" name="safeLocations" value={metricsForm.metrics.safeLocations} onChange={handleMetricsChange} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={metricsForm.metrics.isVerified} onChange={handleMetricsChange} name="isVerified" />}
                label="Is Verified"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMetricsModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleMetricsSubmit}>Save Metrics</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Providers;

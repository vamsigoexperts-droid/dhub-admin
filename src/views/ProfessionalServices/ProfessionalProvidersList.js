import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { IconPlus, IconEdit, IconTrash, IconEye, IconAnalyze, IconTablePlus, IconUsers, IconSettingsAutomation } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { URLS } from '../../Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Professional Providers' }];

// Styled Components
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Main Professional Providers Component
const ProfessionalProviders = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [formEdit, setFormEdit] = useState({
    _id: '',
    status: '',
    comment: '',
  });
  const [bulkForm, setBulkForm] = useState({
    status: '',
    comment: '',
  });

  // Delete Dialog State
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    reason: '',
    itemToDelete: null, // can be single ID or array of IDs
    isBulk: false,
  });

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData?.rolesAndPermission?.[0] || {};

  const navigate = useNavigate();


  const handleRatePopUp = (row) => {
    // Store provider ID in localStorage for the rates page
    localStorage.setItem('ProfessionalProviderId', row._id);

    // Navigate to Provider Service Rates page
    navigate(`/provider-service-rates?providerId=${row._id}`);
  };

  const handleTeamPopUp = (row) => {
    // Store provider ID and name in localStorage for the team management page
    localStorage.setItem('ProfessionalProviderId', row._id);
    localStorage.setItem('ProfessionalProviderName', `${row.firstName} ${row.lastName}`);

    // Navigate to Team Management page
    navigate(`/team-management?providerId=${row._id}`);
  };

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const handleAddPopUp = () => {
    navigate('/Addprofessional-providers');
  };

  const handleViewPopUp = (row) => {
    navigate(`/view-professional-provider/${row._id}`);

  };

  const handleEditPopUp = (row) => {
    navigate(`/edit-professional-provider/${row._id}`);
  };


  const handleDelete = (row) => {
    setDeleteDialog({
      open: true,
      reason: '',
      itemToDelete: row._id,
      isBulk: false
    });
  };

  // Bulk Delete Handler
  const handleBulkDelete = () => {
    if (selectionModel.length === 0) {
      toast.warning('Please select at least one provider to delete.');
      return;
    }

    const selectedProviders = selectionModel
      .map((index) => filteredData[index])
      .filter(Boolean);

    setDeleteDialog({
      open: true,
      reason: '',
      itemToDelete: selectedProviders, // Pass array of objects
      isBulk: true,
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog((prev) => ({ ...prev, open: false }));
  };

  const handleConfirmDelete = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (!deleteDialog.reason.trim()) {
      toast.error('Please provide a deletion reason');
      return;
    }

    setLoading(true);
    try {
      if (deleteDialog.isBulk) {
        // Bulk Delete Logic
        let successCount = 0;
        let errorCount = 0;
        const providers = deleteDialog.itemToDelete;

        for (const provider of providers) {
          try {
            await axios.put(
              `http://192.168.0.5:5013/v1/dhubApi/admin/professional-providers/delete-professional-provider/${provider._id}`,
              { reason: deleteDialog.reason },
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            successCount++;
          } catch (error) {
            errorCount++;
            console.error(`Failed to delete provider ${provider._id}:`, error);
          }
        }

        if (successCount > 0)
          toast.success(`Successfully deleted ${successCount} provider(s).`);
        if (errorCount > 0)
          toast.error(`Failed to delete ${errorCount} provider(s).`);
        setSelectionModel([]);
      } else {
        // Single Delete Logic
        await axios.put(
          `http://192.168.0.5:5013/v1/dhubApi/admin/professional-providers/delete-professional-provider/${deleteDialog.itemToDelete}`,
          { reason: deleteDialog.reason },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        toast.success('Provider deleted successfully');
      }

      getData();
      handleCloseDeleteDialog();
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred during deletion';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Bulk Status Update Handler
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
      .map((id) => filteredData.find((r) => r.id === id)) // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ FIXED: Use filteredData
      .filter(Boolean);

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const provider of selectedProviders) {
        try {
          const payload = {
            status: bulkForm.status,
            ...(bulkForm.status === 'rejected' && { comment: bulkForm.comment }),
          };

          await axios.put(
            `http://192.168.0.5:5013/v1/dhubApi/admin/professional-providers/update-professional-provider-status/${provider._id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
            },
          );
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to update provider ${provider._id}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully updated ${successCount} professional provider(s).`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to update ${errorCount} professional provider(s).`);
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

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('page', '1');
      formData.append('limit', '1000');
      formData.append('type', 'active');

      const res = await axios.post(
        'http://192.168.0.5:5013/v1/dhubApi/admin/professional-providers/get-all-professional-providers',
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ FIX: Access the correct data path from API response
      const providers = res.data?.data || [];

      console.log("aesfd", providers)

      // Sort by logCreatedDate DESC (newest first)
      const sortedProviders = providers.sort((a, b) => {
        const dateA = new Date(a.logCreatedDate || a.logModifiedDate || 0);
        const dateB = new Date(b.logCreatedDate || b.logModifiedDate || 0);
        return dateB - dateA;
      });

      setData(sortedProviders);
    } catch (error) {
      toast.error('Failed to fetch professional providers.');
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (search === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        `${item.firstName || ''} ${item.lastName || ''} ${item.business_name || ''} ${item.email || ''} ${item.phone || ''}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [data, search]);

  const handleEditInputChange = (e) => {
    setFormEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdatePopUp = (data) => {
    setFormEdit({
      _id: data._id,
      status: data.status || '',
      comment: data.comment || '',
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        status: formEdit.status,
        ...(formEdit.status === 'rejected' && { comment: formEdit.comment }),
      };

      // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ CORRECT ENDPOINT from your curl example
      const res = await axios.put(
        `http://192.168.0.5:5013/v1/dhubApi/admin/professional-providers/update-professional-provider-status/${formEdit._id}`,
        payload, // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Matches your curl payload structure
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Explicit content-type
          },
        },
      );

      toast.success(res.data.message || 'Status updated successfully');
      getData();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        headerAlign: 'left',
        align: 'left',
        width: 30,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'providerInfo',
        headerName: 'Provider Info',
        flex: 1.5,
        minWidth: 180,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={params.row.image ? `http://192.168.0.5:5013/${params.row.image}` : undefined}
              alt={`${params.row.firstName} ${params.row.lastName}`}
              sx={{ width: 40, height: 40 }}
            >
              {params.row.firstName?.charAt(0) || ''}
              {params.row.lastName?.charAt(0) || ''}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {`${params.row.firstName || ''} ${params.row.lastName || ''}`}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'phone',
        headerName: 'Phone',
        flex: 0.7,
        minWidth: 90,
        headerAlign: 'left',
        renderCell: (params) => (
          <Typography variant="body2">{params.row.phone || 'N/A'}</Typography>
        ),
      },
      // {
      //   field: 'email',
      //   headerName: 'Email',
      //   flex: 1,
      //   minWidth: 200,
      //   renderCell: (params) => (
      //     <Typography variant="body2">{params.row.email || 'N/A'}</Typography>
      //   ),
      // },
      {
        field: 'service',
        headerName: 'Service',
        flex: 0.8,
        minWidth: 110,
        renderCell: (params) => (
          <Typography variant="body2">{params.row.serviceName || 'N/A'}</Typography>
        ),
      },
      {
        field: 'category',
        headerName: 'Category',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Typography variant="body2">
            {params.row.professionalCategoryName?.join(', ') || 'N/A'}
          </Typography>
        ),
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: 1,
        minWidth: 180,
        renderCell: (params) => (
          <Typography variant="body2">
            {params.row.cityName || 'N/A'}
            {params.row.stateName ? `, ${params.row.stateName}` : ''}
          </Typography>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.6,
        minWidth: 110,
        renderCell: (params) => {
          let statusText;
          let statusColor;

          switch (params.row.status) {
            case 'active':
              statusText = 'Active';
              statusColor = 'success';
              break;
            case 'applied':
              statusText = 'Applied';  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ NEW
              statusColor = 'warning';
              break;
            case 'inactive':
              statusText = 'Inactive'; // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ NEW
              statusColor = 'default';
              break;
            case 'blocked':
              statusText = 'Blocked';
              statusColor = 'error';
              break;
            case 'rejected':
              statusText = 'Rejected';
              statusColor = 'error';
              break;
            default:
              statusText = 'Unknown';
              statusColor = 'default';
          }

          return <Chip label={statusText} size="small" color={statusColor} variant="outlined" />;
        },
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 2,
        minWidth: 450,
        headerAlign: 'left',
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Analyze Button (Existing) */}
            {(rolesAndPermission.all_providers_edit || rolesAndPermission.accessAll) && (
              <Button
                variant="text"
                color="warning"
                size="small"
                startIcon={<IconAnalyze size={16} />}
                onClick={() => handleUpdatePopUp(params.row)}
                disabled={loading}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  textTransform: 'none',
                }}
              >
                Analyze
              </Button>
            )}

            {(rolesAndPermission.all_providers_edit || rolesAndPermission.accessAll) && (
              <Button
                variant="text"
                color="primary"
                size="small"
                startIcon={<IconEdit size={16} />}
                onClick={() => handleEditPopUp(params.row)}
                disabled={loading}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  textTransform: 'none',
                }}
              >
                Edit
              </Button>
            )}

            {(rolesAndPermission.all_providers_edit || rolesAndPermission.accessAll) && (
              <Button
                variant="text"
                size="small"
                color="secondary"
                startIcon={<IconTablePlus size={16} />}
                onClick={() => handleRatePopUp(params.row)}
                disabled={loading}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  textTransform: 'none',
                }}
              >
                Rate
              </Button>
            )}

            {(rolesAndPermission.Near_by_professionals || rolesAndPermission.accessAll) && (
              <Button
                variant="text"
                size="small"
                color="success"
                startIcon={<IconUsers size={16} />}
                onClick={() => handleTeamPopUp(params.row)}
                disabled={loading}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  textTransform: 'none',
                }}
              >
                Team
              </Button>
            )}

            <Button
              variant="text"
              color="info"
              size="small"
              startIcon={<IconEye size={16} />}
              onClick={() => handleViewPopUp(params.row)}
              disabled={loading}
              sx={{
                minWidth: 'auto',
                px: 1,
                textTransform: 'none',
              }}
            >
              View
            </Button>

            {(rolesAndPermission.all_providers_edit || rolesAndPermission.accessAll) && (
              <Button
                variant="text"
                color="info"
                size="small"
                startIcon={<IconSettingsAutomation size={16} />}
                onClick={() => handleMetricsPopUp(params.row)}
                disabled={loading}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  textTransform: 'none',
                }}
              >
                Metrics
              </Button>
            )}

            {(rolesAndPermission.all_providers_delete || rolesAndPermission.accessAll) && (
              <Button
                variant="text"
                color="error"
                size="small"
                startIcon={<IconTrash size={16} />}
                onClick={() => handleDelete(params.row)}
                disabled={loading}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  textTransform: 'none',
                }}
              >
                Delete
              </Button>
            )}

            {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Delete Button (Uncomment if needed) */}
            {/* {(rolesAndPermission.all_providers_delete || rolesAndPermission.accessAll) && (
        <Button
          variant="text"
          color="error"
          size="small"
          startIcon={<IconTrash size={16} />}
          onClick={() => handleDelete(params.row)}
          disabled={loading}
          sx={{
            minWidth: 'auto',
            px: 0.5,
            textTransform: 'none',
            fontFamily: 'Poppins',
            fontSize: '13px',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Delete
        </Button>
      )} */}
          </Box>
        ),
      },

    ],
    [loading, rolesAndPermission],
  );

  const rows = useMemo(
    () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
    [filteredData],
  );

  return (
    <PageContainer
      title="Professional Providers"
      description="Manage professional service providers for your platform"
    >
      <Breadcrumb title="Professional Providers Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={1}
          sx={{ pr: 16 }}
        >
          <Typography variant="h6">Professional Providers List</Typography>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 110, sm: 250 }, bgcolor: 'white' }}
              aria-label="Search Professional Providers"
            />

            {/* Bulk Status Update Button */}
            {(rolesAndPermission.all_providers_edit || rolesAndPermission.accessAll) && (
              <Button
                variant="outlined"
                color="primary"
                disabled={loading || selectionModel.length === 0}
                onClick={handleBulkStatusUpdate}
                startIcon={<IconAnalyze size={18} />}
              >
                Update Status ({selectionModel.length})
              </Button>
            )}

            {/* Bulk Delete Button */}
            {(rolesAndPermission.all_providers_delete || rolesAndPermission.accessAll) && (
              <Button
                variant="outlined"
                color="error"
                disabled={loading || selectionModel.length === 0}
                onClick={handleBulkDelete}
                startIcon={<IconTrash size={18} />}
              >
                Delete Selected ({selectionModel.length})
              </Button>
            )}

            {(rolesAndPermission.all_providers_add || rolesAndPermission.accessAll) && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddPopUp}
                disabled={loading}
                startIcon={<IconPlus size={20} />}
                aria-label="Create New Professional Provider"
              >
                Create Provider
              </Button>
            )}
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              rowHeight={60}
              pageSizeOptions={[5, 10, 20, 50, 100]}
              disableRowSelectionOnClick
              loading={loading}
              checkboxSelection
              rowSelectionModel={selectionModel}
              onRowSelectionModelChange={(newSelection) => {
                setSelectionModel(newSelection);
              }}
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Single Edit Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Update Professional Provider Status</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="status">Status*</CustomFormLabel>
                <CustomSelect
                  id="status"
                  name="status"
                  value={formEdit.status}
                  onChange={handleEditInputChange}
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled>
                    Select Status
                  </MenuItem>
                  <MenuItem value="active">Active</MenuItem>      {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ */}
                  <MenuItem value="applied">Applied</MenuItem>    {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ NEW */}
                  <MenuItem value="inactive">Inactive</MenuItem>  {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ */}
                  <MenuItem value="blocked">Blocked</MenuItem>    {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ */}
                  <MenuItem value="rejected">Rejected</MenuItem>
                </CustomSelect>
              </Grid>
              {formEdit.status === 'rejected' && (
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="comment">Rejection Reason*</CustomFormLabel>
                  <CustomTextField
                    id="comment"
                    name="comment"
                    value={formEdit.comment}
                    onChange={handleEditInputChange}
                    placeholder="Please provide reason for rejection"
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
                <CustomFormLabel htmlFor="bulkStatus">Status*</CustomFormLabel>
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
                  <MenuItem value="applied">Applied</MenuItem>     {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ NEW */}
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </CustomSelect>
              </Grid>
              {bulkForm.status === 'rejected' && (
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="bulkComment">Rejection Reason*</CustomFormLabel>
                  <CustomTextField
                    id="bulkComment"
                    name="comment"
                    value={bulkForm.comment}
                    onChange={handleBulkFormChange}
                    placeholder="Please provide reason for rejection"
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleCloseDeleteDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete {deleteDialog.isBulk ? `${deleteDialog.itemToDelete?.length} providers` : 'this provider'}?
            This action cannot be undone.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="delete-reason"
            label="Deletion Reason"
            type="text"
            fullWidth
            variant="outlined"
            value={deleteDialog.reason}
            onChange={(e) => setDeleteDialog(prev => ({ ...prev, reason: e.target.value }))}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={!deleteDialog.reason.trim()}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ProfessionalProviders;


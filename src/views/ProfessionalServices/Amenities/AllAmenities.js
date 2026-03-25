import React, { useState, useEffect, useMemo } from 'react';
import { URLS } from 'src/Url';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { IconPlus, IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
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
  Tabs,
  Tab,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Amenities' }];

// Styled Components
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Styled Tabs
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.divider}`,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  marginRight: theme.spacing(3),
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 0.8,
  },
}));

// Utility function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  const normalizedPath = imagePath.replace(/\\/g, '/');
  return `${URLS.FileBase}${normalizedPath}`;
};

// Main Amenities Component
const AllAmenities = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [currentTab, setCurrentTab] = useState('all');
  const [formEdit, setFormEdit] = useState({
    _id: '',
    status: '',
  });
  const [bulkForm, setBulkForm] = useState({
    status: '',
  });
  const [deleteData, setDeleteData] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData?.rolesAndPermission?.[0] || {};

  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  // Fetch Services
  useEffect(() => {
    if (!token) return;

    const fetchServices = async () => {
      try {
        const res = await axios.post(
          URLS.GetActiveServices,
          null,
          {
            params: {
              serviceType: 'professional',
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setServices(res.data.services || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, [token]);

  const getData = React.useCallback(async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.ListAmenities,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const amenities = res.data?.amenities || res.data?.data || [];

      // Sort by created date DESC (newest first)
      const sortedAmenities = amenities.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.logCreatedDate || 0);
        const dateB = new Date(b.createdAt || b.logCreatedDate || 0);
        return dateB - dateA;
      });

      setData(sortedAmenities);
    } catch (error) {
      toast.error('Failed to fetch amenities.');
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleAddPopUp = React.useCallback(() => {
    navigate('/amenities/add');
  }, [navigate]);

  const handleViewPopUp = React.useCallback((row) => {
    navigate(`/amenities/view/${row._id}`);
  }, [navigate]);

  const handleEditPopUp = React.useCallback((row) => {
    navigate(`/amenities/edit/${row._id}`);
  }, [navigate]);

  const handleDelete = React.useCallback(async (row) => {
    console.log('Opening delete confirmation for row:', row);
    setDeleteData(row);
    setOpenDeleteModal(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!token || !deleteData) return;

    setLoading(true);
    try {
      const id = deleteData._id || (filteredData[deleteData.id]?._id);
      if (!id) throw new Error('Amenity ID not found');

      const res = await axios.delete(
        `${URLS.DeleteAmenity}${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.status === 200) {
        toast.success(res.data.message || 'Amenity deleted successfully');
        getData();
      }
    } catch (error) {
      console.error('Delete failed:', error);
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
      setOpenDeleteModal(false);
      setDeleteData(null);
    }
  };

  // Bulk Delete Handler
  const handleBulkDelete = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (selectionModel.length === 0) {
      toast.warning('Please select at least one amenity to delete.');
      return;
    }

    const selectedAmenities = selectionModel
      .map((id) => rows.find((r) => r.id === id))
      .filter(Boolean);

    if (selectedAmenities.length === 0) {
      toast.warning('No valid amenities selected.');
      return;
    }

    if (
      !window.confirm(
        `Do you really want to delete ${selectedAmenities.length} amenity(ies)?\n\nThis action cannot be undone.`,
      )
    ) {
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const amenity of selectedAmenities) {
        try {
          const id = amenity._id || amenity.id; // amenity is from 'rows' which has everything
          await axios.delete(
            `${URLS.DeleteAmenity}${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to delete amenity:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} amenity(ies).`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to delete ${errorCount} amenity(ies).`);
      }

      setSelectionModel([]);
      getData();
    } catch (error) {
      toast.error('An error occurred during bulk delete.');
    } finally {
      setLoading(false);
    }
  };

  // Bulk Status Update Handler
  const handleBulkStatusUpdate = () => {
    if (selectionModel.length === 0) {
      toast.warning('Please select at least one amenity.');
      return;
    }
    setBulkForm({ status: '' });
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

    const selectedAmenities = selectionModel
      .map((id) => rows.find((r) => r.id === id))
      .filter(Boolean);

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const amenity of selectedAmenities) {
        try {
          const id = amenity._id || amenity.id;
          const payload = {
            status: bulkForm.status,
          };

          await axios.put(
            `${URLS.UpdateAmenity}${amenity._id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          );
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to update amenity ${amenity._id}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully updated ${successCount} amenity(ies).`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to update ${errorCount} amenity(ies).`);
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



  useEffect(() => {
    getData();
  }, []);

  // Filter data by service tab and search
  useEffect(() => {
    let filtered = data;

    // Filter by service tab
    if (currentTab !== 'all') {
      filtered = filtered.filter(
        (item) =>
          item.serviceId === currentTab ||
          item.serviceId?._id === currentTab ||
          item.serviceName === services.find((s) => s._id === currentTab)?.name
      );
    }

    // Filter by search
    if (search !== '') {
      filtered = filtered.filter((item) =>
        `${item.title || ''} ${item.serviceName || ''} ${item.categoryName || ''} ${item.subcategoryName || ''}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    }

    setFilteredData(filtered);
  }, [data, search, currentTab, services]);

  const handleEditInputChange = (e) => {
    setFormEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdatePopUp = (data) => {
    setFormEdit({
      _id: data._id,
      status: data.status || '',
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setSelectionModel([]);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        status: formEdit.status,
      };

      const res = await axios.put(
        `${URLS.UpdateAmenity}${formEdit._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
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

  // Get count for each service
  const getServiceCount = (serviceId) => {
    if (serviceId === 'all') return data.length;
    return data.filter(
      (item) =>
        item.serviceId === serviceId ||
        item.serviceId?._id === serviceId ||
        item.serviceName === services.find((s) => s._id === serviceId)?.name
    ).length;
  };

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        headerAlign: 'left',
        align: 'left',
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'amenityInfo',
        headerName: 'Amenity Info',
        flex: 1,
        minWidth: 250,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={params.row.image ? getImageUrl(params.row.image) : undefined}
              alt={params.row.title}
              sx={{ width: 40, height: 40 }}
            >
              {params.row.title?.charAt(0) || 'A'}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {params.row.title || 'N/A'}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'service',
        headerName: 'Service',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Typography variant="body2">
            {params.row.serviceName || params.row.serviceId?.name || 'N/A'}
          </Typography>
        ),
      },
      {
        field: 'category',
        headerName: 'Category',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Typography variant="body2">
            {params.row.categoryName || params.row.categoryId?.name || 'N/A'}
          </Typography>
        ),
      },
      {
        field: 'subcategory',
        headerName: 'Subcategory',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Typography variant="body2">
            {params.row.subcategoryName || params.row.subcategoryId?.name || 'N/A'}
          </Typography>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.6,
        minWidth: 110,
        renderCell: (params) => {
          const statusText = params.row.status === 'active' ? 'Active' : 'Inactive';
          const statusColor = params.row.status === 'active' ? 'success' : 'default';

          return <Chip label={statusText} size="small" color={statusColor} variant="outlined" />;
        },
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 280,
        minWidth: 250,
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
            {(rolesAndPermission.all_amenities_edit || rolesAndPermission.accessAll) && (
              <Button
                variant="text"
                color="primary"
                size="small"
                startIcon={<IconEdit size={16} />}
                onClick={() => handleEditPopUp(params.row)}
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
                Edit
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
                px: 0.5,
                textTransform: 'none',
                fontFamily: 'Poppins',
                fontSize: '13px',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              View
            </Button>

            {(rolesAndPermission.all_amenities_delete || rolesAndPermission.accessAll) && (
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
            )}
          </Box>
        ),
      },
    ],
    [loading, rolesAndPermission, handleDelete, handleEditPopUp, handleViewPopUp],
  );

  const rows = useMemo(
    () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
    [filteredData],
  );

  return (
    <PageContainer title="Amenities" description="Manage amenities for your platform">
      <Breadcrumb title="Amenities Management" items={BCrumb} />
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
        {/* Header Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={1}
        >
          <Typography variant="h6">Amenities Management</Typography>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search by name, service, category..."
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 110, sm: 250 }, bgcolor: 'white' }}
              aria-label="Search Amenities"
            />

            {/* Bulk Status Update Button */}
            {(rolesAndPermission.all_amenities_edit || rolesAndPermission.accessAll) && (
              <Button
                variant="outlined"
                color="primary"
                disabled={loading || selectionModel.length === 0}
                onClick={handleBulkStatusUpdate}
                startIcon={<IconEdit size={18} />}
              >
                Update Status ({selectionModel.length})
              </Button>
            )}

            {/* Bulk Delete Button */}
            {(rolesAndPermission.all_amenities_delete || rolesAndPermission.accessAll) && (
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

            {(rolesAndPermission.all_amenities_add || rolesAndPermission.accessAll) && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddPopUp}
                disabled={loading}
                startIcon={<IconPlus size={20} />}
                aria-label="Create New Amenity"
              >
                Create Amenity
              </Button>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Service Tabs */}
        <Box sx={{ px: 2, pt: 2 }}>
          <StyledTabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Service filter tabs"
          >
            <StyledTab
              label={`All Amenities (${getServiceCount('all')})`}
              value="all"
            />
            {services.map((service) => (
              <StyledTab
                key={service._id}
                label={`${service.name} (${getServiceCount(service._id)})`}
                value={service._id}
              />
            ))}
          </StyledTabs>
        </Box>

        <Divider sx={{ mt: 2 }} />

        {/* Data Grid */}
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
        <DialogTitle>Update Amenity Status</DialogTitle>
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
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </CustomSelect>
              </Grid>
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
        <DialogTitle>Update Status for {selectionModel.length} Amenity(ies)</DialogTitle>
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
                  <MenuItem value="inactive">Inactive</MenuItem>
                </CustomSelect>
              </Grid>
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          <IconTrash size={24} />
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1">
            Are you sure you want to delete the amenity <strong>"{deleteData?.title}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDeleteModal(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default AllAmenities;

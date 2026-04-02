import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconEye, IconAnalyze, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
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
  MenuItem,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
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

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  minHeight: 48,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Service Management' }];

const PendingServiceProvider = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Provider state management
  const [providerData, setProviderData] = useState([]);
  const [providerSearch, setProviderSearch] = useState('');
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerSelectionModel, setProviderSelectionModel] = useState([]);
  const [openProviderModal, setOpenProviderModal] = useState(false);
  const [openBulkProviderModal, setOpenBulkProviderModal] = useState(false);
  const [providerFormEdit, setProviderFormEdit] = useState({
    _id: '',
    status: '',
    comment: '',
  });
  const [bulkProviderForm, setBulkProviderForm] = useState({
    status: '',
    comment: '',
  });

  // Service Request state management
  const [serviceRequestData, setServiceRequestData] = useState([]);
  const [serviceRequestSearch, setServiceRequestSearch] = useState('');
  const [serviceRequestLoading, setServiceRequestLoading] = useState(false);
  const [serviceRequestSelectionModel, setServiceRequestSelectionModel] = useState([]);
  const [openServiceRequestModal, setOpenServiceRequestModal] = useState(false);
  const [openViewServiceRequestModal, setOpenViewServiceRequestModal] = useState(false);
  const [openBulkRejectModal, setOpenBulkRejectModal] = useState(false);
  const [selectedServiceRequest, setSelectedServiceRequest] = useState(null);
  const [serviceRequestFormEdit, setServiceRequestFormEdit] = useState({
    _id: '',
    status: '',
    rejectionReason: '',
  });
  const [bulkRejectReason, setBulkRejectReason] = useState('');

  // ==================== PROVIDER FUNCTIONS ====================

  const getProviderData = async (searchQuery = '') => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setProviderLoading(true);
    try {
      const url = `${URLS.GetProviderStatus}?searchQuery=${encodeURIComponent(searchQuery)}`;
      const res = await axios.post(
        url,
        { type: 'inactive' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setProviderData(res.data.activeproviders || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch providers.');
      console.error('Failed to fetch provider data:', error);
    } finally {
      setProviderLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 0) {
      getProviderData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 0) {
      const delayDebounce = setTimeout(() => {
        getProviderData(providerSearch.trim());
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [providerSearch]);

  const handleProviderSearch = (e) => {
    setProviderSearch(e.target.value);
  };

  const handleViewProvider = (data) => {
    navigate('/view-provider');
    localStorage.setItem('providerId', data._id);
  };

  const handleEditProviderInputChange = (e) => {
    setProviderFormEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditProvider = (data) => {
    setProviderFormEdit({
      _id: data._id,
      status: data.status || '',
      comment: data.comment || '',
    });
    setOpenProviderModal(true);
  };

  const handleCloseProviderModal = () => {
    setOpenProviderModal(false);
  };

  const handleEditProviderSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        status: providerFormEdit.status,
        ...(providerFormEdit.status === 'rejected' && { comment: providerFormEdit.comment }),
      };

      const res = await axios.put(`${URLS.UpdateProviderStatus}${providerFormEdit._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message);
      getProviderData(providerSearch.trim());
      handleCloseProviderModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDeleteProvider = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    if (window.confirm('Do you really want to delete this provider?')) {
      setProviderLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteProvider}/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          getProviderData(providerSearch.trim());
        }
      } catch (error) {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
      } finally {
        setProviderLoading(false);
      }
    }
  };

  const handleBulkDeleteProvider = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (providerSelectionModel.length === 0) {
      toast.warning('Please select at least one provider to delete.');
      return;
    }

    const selectedProviders = providerSelectionModel
      .map((id) => providerRows.find((r) => r.id === id))
      .filter(Boolean);

    if (
      !window.confirm(
        `Do you really want to delete ${selectedProviders.length} provider(s)?\n\nThis action cannot be undone.`,
      )
    ) {
      return;
    }

    setProviderLoading(true);
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

      setProviderSelectionModel([]);
      getProviderData(providerSearch.trim());
    } catch (error) {
      toast.error('An error occurred during bulk delete.');
    } finally {
      setProviderLoading(false);
    }
  };

  const handleBulkProviderStatusUpdate = () => {
    if (providerSelectionModel.length === 0) {
      toast.warning('Please select at least one provider.');
      return;
    }
    setBulkProviderForm({ status: '', comment: '' });
    setOpenBulkProviderModal(true);
  };

  const handleBulkProviderFormChange = (e) => {
    setBulkProviderForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBulkProviderSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    const selectedProviders = providerSelectionModel
      .map((id) => providerRows.find((r) => r.id === id))
      .filter(Boolean);

    setProviderLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const provider of selectedProviders) {
        try {
          const payload = {
            status: bulkProviderForm.status,
            ...(bulkProviderForm.status === 'rejected' && { comment: bulkProviderForm.comment }),
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

      setProviderSelectionModel([]);
      setOpenBulkProviderModal(false);
      getProviderData(providerSearch.trim());
    } catch (error) {
      toast.error('An error occurred during bulk update.');
    } finally {
      setProviderLoading(false);
    }
  };

  // ==================== SERVICE REQUEST FUNCTIONS ====================

  const getServiceRequestData = async (searchQuery = '') => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setServiceRequestLoading(true);
    try {
      const url = `https://api.doorstephub.com/v1/dhubApi/admin/service-requests/all?status=pending${
        searchQuery ? `&searchQuery=${encodeURIComponent(searchQuery)}` : ''
      }`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServiceRequestData(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch service requests.');
      console.error('Failed to fetch service request data:', error);
    } finally {
      setServiceRequestLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 1) {
      getServiceRequestData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 1) {
      const delayDebounce = setTimeout(() => {
        getServiceRequestData(serviceRequestSearch.trim());
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [serviceRequestSearch]);

  const handleServiceRequestSearch = (e) => {
    setServiceRequestSearch(e.target.value);
  };

  const handleViewServiceRequest = (data) => {
    setSelectedServiceRequest(data);
    setOpenViewServiceRequestModal(true);
  };

  const handleEditServiceRequest = (data) => {
    setServiceRequestFormEdit({
      _id: data._id,
      status: data.status || '',
      rejectionReason: '',
    });
    setOpenServiceRequestModal(true);
  };

  const handleCloseServiceRequestModal = () => {
    setOpenServiceRequestModal(false);
  };

  const handleCloseViewServiceRequestModal = () => {
    setOpenViewServiceRequestModal(false);
    setSelectedServiceRequest(null);
  };

  const handleEditServiceRequestInputChange = (e) => {
    setServiceRequestFormEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditServiceRequestSubmit = async (e) => {
    e.preventDefault();

    try {
      if (serviceRequestFormEdit.status === 'approved') {
        const res = await axios.post(
          'https://api.doorstephub.com/v1/dhubApi/admin/service-requests/bulk-approve',
          { requestIds: [serviceRequestFormEdit._id] },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success(res.data.message || 'Service request approved successfully');
      } else if (serviceRequestFormEdit.status === 'rejected') {
        const res = await axios.post(
          'https://api.doorstephub.com/v1/dhubApi/admin/service-requests/bulk-reject',
          {
            requestIds: [serviceRequestFormEdit._id],
            rejectionReason: serviceRequestFormEdit.rejectionReason,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success(res.data.message || 'Service request rejected successfully');
      }

      getServiceRequestData(serviceRequestSearch.trim());
      handleCloseServiceRequestModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDeleteServiceRequest = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    if (window.confirm('Do you really want to delete this service request?')) {
      setServiceRequestLoading(true);
      try {
        const res = await axios.delete(
          `https://api.doorstephub.com/v1/dhubApi/admin/service-requests/${data._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        toast.success(res.data.message || 'Service request deleted successfully');
        getServiceRequestData(serviceRequestSearch.trim());
      } catch (error) {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
      } finally {
        setServiceRequestLoading(false);
      }
    }
  };

  const handleBulkDeleteServiceRequest = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (serviceRequestSelectionModel.length === 0) {
      toast.warning('Please select at least one service request to delete.');
      return;
    }

    const selectedRequests = serviceRequestSelectionModel
      .map((id) => serviceRequestRows.find((r) => r.id === id))
      .filter(Boolean);

    if (
      !window.confirm(
        `Do you really want to delete ${selectedRequests.length} service request(s)?\n\nThis action cannot be undone.`,
      )
    ) {
      return;
    }

    setServiceRequestLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const request of selectedRequests) {
        try {
          await axios.delete(
            `https://api.doorstephub.com/v1/dhubApi/admin/service-requests/${request._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to delete service request ${request._id}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} service request(s).`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to delete ${errorCount} service request(s).`);
      }

      setServiceRequestSelectionModel([]);
      getServiceRequestData(serviceRequestSearch.trim());
    } catch (error) {
      toast.error('An error occurred during bulk delete.');
    } finally {
      setServiceRequestLoading(false);
    }
  };

  const handleBulkApprove = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (serviceRequestSelectionModel.length === 0) {
      toast.warning('Please select at least one service request to approve.');
      return;
    }

    const selectedRequests = serviceRequestSelectionModel
      .map((id) => serviceRequestRows.find((r) => r.id === id))
      .filter(Boolean);

    const requestIds = selectedRequests.map((req) => req._id);

    if (
      !window.confirm(`Do you want to approve ${selectedRequests.length} service request(s)?`)
    ) {
      return;
    }

    setServiceRequestLoading(true);
    try {
      const res = await axios.post(
        'https://api.doorstephub.com/v1/dhubApi/admin/service-requests/bulk-approve',
        { requestIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      toast.success(
        res.data.message || `Successfully approved ${selectedRequests.length} service request(s)`,
      );
      setServiceRequestSelectionModel([]);
      getServiceRequestData(serviceRequestSearch.trim());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bulk approve failed');
      console.error('Bulk approve error:', error);
    } finally {
      setServiceRequestLoading(false);
    }
  };

  const handleBulkReject = () => {
    if (serviceRequestSelectionModel.length === 0) {
      toast.warning('Please select at least one service request to reject.');
      return;
    }
    setBulkRejectReason('');
    setOpenBulkRejectModal(true);
  };

  const handleBulkRejectSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (!bulkRejectReason.trim()) {
      toast.warning('Please provide a rejection reason.');
      return;
    }

    const selectedRequests = serviceRequestSelectionModel
      .map((id) => serviceRequestRows.find((r) => r.id === id))
      .filter(Boolean);

    const requestIds = selectedRequests.map((req) => req._id);

    setServiceRequestLoading(true);
    try {
      const res = await axios.post(
        Bulkapprove,
        {
          requestIds,
          rejectionReason: bulkRejectReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      toast.success(
        res.data.message || `Successfully rejected ${selectedRequests.length} service request(s)`,
      );
      setServiceRequestSelectionModel([]);
      setOpenBulkRejectModal(false);
      getServiceRequestData(serviceRequestSearch.trim());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bulk reject failed');
      console.error('Bulk reject error:', error);
    } finally {
      setServiceRequestLoading(false);
    }
  };

  // ==================== PROVIDER DATAGRID COLUMNS ====================

  const providerColumns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'sectionInfo',
        headerName: 'Provider Info',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => {
          const firstName = params.row.firstName?.trim() || '';
          const lastName = params.row.lastName?.trim() || '';
          const hasName = firstName || lastName;
          const displayName = hasName
            ? `${firstName} ${lastName}`.trim()
            : 'Incomplete Profile';

          return (
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={`${URLS.FileBase}${params.row.image}`}
                alt={displayName}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: hasName ? undefined : theme.palette.warning.light,
                }}
              >
                {hasName ? firstName.charAt(0).toUpperCase() : '?'}
              </Avatar>
              <Typography
                sx={{
                  color: hasName ? 'text.primary' : 'warning.main',
                  fontStyle: hasName ? 'normal' : '',
                  fontWeight: hasName ? 400 : 500,
                }}
              >
                {displayName}
              </Typography>
            </Box>
          );
        },
      },
      { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 150 },
      { field: 'email', headerName: 'Email', flex: 1, minWidth: 150 },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
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
            <Chip label={statusText} size="small" color={statusColor} variant="outlined" />
          );
        },
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 320,
        minWidth: 220,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1} alignItems="center" flexWrap="nowrap">
            {(rolesAndPermission.new_providers_edit || rolesAndPermission.accessAll) && (
              <Button
                variant="text"
                color="primary"
                size="small"
                startIcon={<IconAnalyze size={16} />}
                onClick={() => handleEditProvider(params.row)}
                disabled={providerLoading}
                sx={{
                  whiteSpace: 'nowrap',
                  minWidth: 'auto',
                }}
              >
                Analyze
              </Button>
            )}

            <Button
              variant="text"
              color="secondary"
              size="small"
              startIcon={<IconEye size={16} />}
              onClick={() => handleViewProvider(params.row)}
              disabled={providerLoading}
              sx={{
                whiteSpace: 'nowrap',
                minWidth: 'auto',
              }}
            >
              View
            </Button>

            {(rolesAndPermission.new_providers_delete || rolesAndPermission.accessAll) && (
              <Button
                variant="text"
                color="error"
                size="small"
                startIcon={<IconTrash size={16} />}
                onClick={() => handleDeleteProvider(params.row)}
                disabled={providerLoading}
                sx={{
                  whiteSpace: 'nowrap',
                  minWidth: 'auto',
                }}
              >
                Delete
              </Button>
            )}
          </Box>
        ),
      },
    ],
    [providerLoading],
  );

  // ==================== SERVICE REQUEST DATAGRID COLUMNS ====================

  const serviceRequestColumns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'serviceInfo',
        headerName: 'Service Info',
        flex: 1,
        minWidth: 250,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={`https://api.doorstephub.com/${params.row.image}`}
              alt={params.row.name}
              variant="rounded"
              sx={{ width: 50, height: 50 }}
            />
            <Box>
     
              <Typography variant="caption" color="text.secondary">
                {params.row.subcategoryName}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'providerInfo',
        headerName: 'Provider',
        flex: 1,
        minWidth: 180,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2">
              {params.row.providerName !== 'undefined undefined'
                ? params.row.providerName
                : 'N/A'}
            </Typography>
            {/* <Typography variant="caption" color="text.secondary">
              {params.row.providerId?.phone || 'N/A'}
            </Typography> */}
          </Box>
        ),
      },
      {
        field: 'price',
        headerName: 'Price',
        width: 150,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" fontWeight={600}>
              ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{params.row.price}
            </Typography>
      
          </Box>
        ),
      },
      {
        field: 'reason',
        headerName: 'Reason',
        flex: 1,
        minWidth: 180,
        renderCell: (params) => (
          <Typography variant="caption" noWrap>
            {params.row.reason}
          </Typography>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => {
          const statusMap = {
            pending: { label: 'Pending', color: 'warning' },
            approved: { label: 'Approved', color: 'success' },
            rejected: { label: 'Rejected', color: 'error' },
          };
          const status = statusMap[params.row.status] || statusMap.pending;

          return <Chip label={status.label} size="small" color={status.color} variant="outlined" />;
        },
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 320,
        minWidth: 220,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1} alignItems="center" flexWrap="nowrap">
            {(rolesAndPermission.new_providers_edit || rolesAndPermission.accessAll) && (
              <Button
                variant="text"
                color="primary"
                size="small"
                startIcon={<IconAnalyze size={16} />}
                onClick={() => handleEditServiceRequest(params.row)}
                disabled={serviceRequestLoading}
                sx={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
              >
                Review
              </Button>
            )}

            <Button
              variant="text"
              color="secondary"
              size="small"
              startIcon={<IconEye size={16} />}
              onClick={() => handleViewServiceRequest(params.row)}
              disabled={serviceRequestLoading}
              sx={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
            >
              View
            </Button>

            {(rolesAndPermission.new_providers_delete || rolesAndPermission.accessAll) && (
              <Button
                variant="text"
                color="error"
                size="small"
                startIcon={<IconTrash size={16} />}
                onClick={() => handleDeleteServiceRequest(params.row)}
                disabled={serviceRequestLoading}
                sx={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
              >
                Delete
              </Button>
            )}
          </Box>
        ),
      },
    ],
    [serviceRequestLoading],
  );

  // DataGrid rows
  const providerRows = useMemo(
    () => providerData?.map((item, index) => ({ id: index, ...item })) || [],
    [providerData],
  );

  const serviceRequestRows = useMemo(
    () => serviceRequestData?.map((item, index) => ({ id: index, ...item })) || [],
    [serviceRequestData],
  );

  return (
    <PageContainer
      title="Service Management"
      description="Manage service providers and service requests"
    >
      <Breadcrumb title="Service Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Tabs */}
      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 2,
          }}
        >
          <StyledTab label="Service Providers" />
          <StyledTab label="Service Requests" />
        </Tabs>

        {/* Tab Content */}
        {activeTab === 0 && (
          <>
            {/* Provider Management */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              flexWrap="wrap"
              gap={2}
            >
              <Typography variant="h6">Service Provider List</Typography>
              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <TextField
                  size="small"
                  placeholder="Search by name, email or phone"
                  value={providerSearch}
                  onChange={handleProviderSearch}
                  sx={{ minWidth: { xs: 150, sm: 250 }, bgcolor: 'background.paper' }}
                />

                {(rolesAndPermission.new_providers_edit || rolesAndPermission.accessAll) && (
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={providerLoading || providerSelectionModel.length === 0}
                    onClick={handleBulkProviderStatusUpdate}
                    startIcon={<IconAnalyze size={18} />}
                  >
                    Update Status ({providerSelectionModel.length})
                  </Button>
                )}

                {(rolesAndPermission.new_providers_delete || rolesAndPermission.accessAll) && (
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={providerLoading || providerSelectionModel.length === 0}
                    onClick={handleBulkDeleteProvider}
                    startIcon={<IconTrash size={18} />}
                  >
                    Delete Selected ({providerSelectionModel.length})
                  </Button>
                )}
              </Box>
            </Box>
            <Divider />
            <CardContent>
              <Box sx={{ height: 'auto', width: '100%' }}>
                <DataGrid
                  rows={providerRows}
                  columns={providerColumns}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10 },
                    },
                  }}
                  rowHeight={70}
                  pageSizeOptions={[5, 10, 20, 50]}
                  disableRowSelectionOnClick
                  loading={providerLoading}
                  autoHeight
                  checkboxSelection
                  rowSelectionModel={providerSelectionModel}
                  onRowSelectionModelChange={(newSelection) => {
                    setProviderSelectionModel(newSelection);
                  }}
                  sx={{
                    '& .MuiDataGrid-cell': {
                      display: 'flex',
                      alignItems: 'center',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: theme.palette.grey[100],
                      fontWeight: 600,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </>
        )}

        {activeTab === 1 && (
          <>
            {/* Service Request Management */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              flexWrap="wrap"
              gap={2}
            >
              <Typography variant="h6">Service Request List</Typography>
              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <TextField
                  size="small"
                  placeholder="Search by service name or provider"
                  value={serviceRequestSearch}
                  onChange={handleServiceRequestSearch}
                  sx={{ minWidth: { xs: 150, sm: 250 }, bgcolor: 'background.paper' }}
                />

                {(rolesAndPermission.new_providers_edit || rolesAndPermission.accessAll) && (
                  <Button
                    variant="contained"
                    color="success"
                    disabled={
                      serviceRequestLoading || serviceRequestSelectionModel.length === 0
                    }
                    onClick={handleBulkApprove}
                    startIcon={<IconCheck size={18} />}
                  >
                    Approve ({serviceRequestSelectionModel.length})
                  </Button>
                )}

                {(rolesAndPermission.new_providers_edit || rolesAndPermission.accessAll) && (
                  <Button
                    variant="outlined"
                    color="warning"
                    disabled={
                      serviceRequestLoading || serviceRequestSelectionModel.length === 0
                    }
                    onClick={handleBulkReject}
                    startIcon={<IconX size={18} />}
                  >
                    Reject ({serviceRequestSelectionModel.length})
                  </Button>
                )}

                {(rolesAndPermission.new_providers_delete || rolesAndPermission.accessAll) && (
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={
                      serviceRequestLoading || serviceRequestSelectionModel.length === 0
                    }
                    onClick={handleBulkDeleteServiceRequest}
                    startIcon={<IconTrash size={18} />}
                  >
                    Delete ({serviceRequestSelectionModel.length})
                  </Button>
                )}
              </Box>
            </Box>
            <Divider />
            <CardContent>
              <Box sx={{ height: 'auto', width: '100%' }}>
                <DataGrid
                  rows={serviceRequestRows}
                  columns={serviceRequestColumns}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10 },
                    },
                  }}
                  rowHeight={70}
                  pageSizeOptions={[5, 10, 20, 50]}
                  disableRowSelectionOnClick
                  loading={serviceRequestLoading}
                  autoHeight
                  checkboxSelection
                  rowSelectionModel={serviceRequestSelectionModel}
                  onRowSelectionModelChange={(newSelection) => {
                    setServiceRequestSelectionModel(newSelection);
                  }}
                  sx={{
                    '& .MuiDataGrid-cell': {
                      display: 'flex',
                      alignItems: 'center',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: theme.palette.grey[100],
                      fontWeight: 600,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </>
        )}
      </Paper>

      {/* ==================== MODALS - Continue with same modals as before ==================== */}
      {/* Provider Modals */}
      <Dialog open={openProviderModal} onClose={handleCloseProviderModal} maxWidth="sm" fullWidth>
        <DialogTitle>Update Provider Status</DialogTitle>
        <form onSubmit={handleEditProviderSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="status">Status*</CustomFormLabel>
                <CustomSelect
                  id="status"
                  name="status"
                  value={providerFormEdit.status}
                  onChange={handleEditProviderInputChange}
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
              {providerFormEdit.status === 'rejected' && (
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="comment">Rejection Reason*</CustomFormLabel>
                  <CustomTextField
                    id="comment"
                    name="comment"
                    value={providerFormEdit.comment}
                    onChange={handleEditProviderInputChange}
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
            <Button onClick={handleCloseProviderModal} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Status
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openBulkProviderModal}
        onClose={() => setOpenBulkProviderModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Status for {providerSelectionModel.length} Provider(s)</DialogTitle>
        <form onSubmit={handleBulkProviderSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="bulkStatus">Status*</CustomFormLabel>
                <CustomSelect
                  id="bulkStatus"
                  name="status"
                  value={bulkProviderForm.status}
                  onChange={handleBulkProviderFormChange}
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
              {bulkProviderForm.status === 'rejected' && (
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="bulkComment">Rejection Reason*</CustomFormLabel>
                  <CustomTextField
                    id="bulkComment"
                    name="comment"
                    value={bulkProviderForm.comment}
                    onChange={handleBulkProviderFormChange}
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
            <Button onClick={() => setOpenBulkProviderModal(false)} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={providerLoading}>
              Update All
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Service Request Modals */}
      <Dialog
        open={openServiceRequestModal}
        onClose={handleCloseServiceRequestModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Review Service Request</DialogTitle>
        <form onSubmit={handleEditServiceRequestSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="serviceStatus">Action*</CustomFormLabel>
                <CustomSelect
                  id="serviceStatus"
                  name="status"
                  value={serviceRequestFormEdit.status}
                  onChange={handleEditServiceRequestInputChange}
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled>
                    Select Action
                  </MenuItem>
                  <MenuItem value="approved">Approve Request</MenuItem>
                  <MenuItem value="rejected">Reject Request</MenuItem>
                </CustomSelect>
              </Grid>
              {serviceRequestFormEdit.status === 'rejected' && (
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="rejectionReason">Rejection Reason*</CustomFormLabel>
                  <CustomTextField
                    id="rejectionReason"
                    name="rejectionReason"
                    value={serviceRequestFormEdit.rejectionReason}
                    onChange={handleEditServiceRequestInputChange}
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
            <Button onClick={handleCloseServiceRequestModal} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color={serviceRequestFormEdit.status === 'approved' ? 'success' : 'error'}
            >
              {serviceRequestFormEdit.status === 'approved' ? 'Approve' : 'Reject'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openBulkRejectModal}
        onClose={() => setOpenBulkRejectModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Reject {serviceRequestSelectionModel.length} Service Request(s)
        </DialogTitle>
        <form onSubmit={handleBulkRejectSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="bulkRejectionReason">
                  Rejection Reason*
                </CustomFormLabel>
                <CustomTextField
                  id="bulkRejectionReason"
                  name="rejectionReason"
                  value={bulkRejectReason}
                  onChange={(e) => setBulkRejectReason(e.target.value)}
                  placeholder="Please provide reason for rejection"
                  multiline
                  rows={4}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenBulkRejectModal(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={serviceRequestLoading}
            >
              Reject All
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openViewServiceRequestModal}
        onClose={handleCloseViewServiceRequestModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Service Request Details</DialogTitle>
        <DialogContent>
          {selectedServiceRequest && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Box
                  component="img"
                  src={`https://api.doorstephub.com/${selectedServiceRequest.image}`}
                  alt={selectedServiceRequest.name}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: theme.shadows[3],
                  }}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom>
                  {selectedServiceRequest.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedServiceRequest.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedServiceRequest.subcategoryName}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{selectedServiceRequest.price} ({selectedServiceRequest.priceUnit})
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Provider
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedServiceRequest.providerName !== 'undefined undefined'
                        ? selectedServiceRequest.providerName
                        : 'Provider'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedServiceRequest.providerId?.phone || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Box mt={0.5}>
                      <Chip
                        label={selectedServiceRequest.status.toUpperCase()}
                        size="small"
                        color={
                          selectedServiceRequest.status === 'approved'
                            ? 'success'
                            : selectedServiceRequest.status === 'rejected'
                              ? 'error'
                              : 'warning'
                        }
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Reason for Request
                    </Typography>
                    <Typography variant="body2">{selectedServiceRequest.reason}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Created Date
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedServiceRequest.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedServiceRequest.updatedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {selectedServiceRequest.banner_images &&
                selectedServiceRequest.banner_images.length > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Banner Images
                    </Typography>
                    <ImageList cols={3} gap={8}>
                      {selectedServiceRequest.banner_images.map((img, index) => (
                        <ImageListItem key={index}>
                          <img
                            src={`https://api.doorstephub.com/${img}`}
                            alt={`Banner ${index + 1}`}
                            loading="lazy"
                            style={{ borderRadius: 8 }}
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Grid>
                )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseViewServiceRequestModal} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default PendingServiceProvider;


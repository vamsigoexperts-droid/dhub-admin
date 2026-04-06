import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconEye, IconAnalyze, IconTrash } from '@tabler/icons-react';
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
  TextField,
  Alert,
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

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Rejected Professional Providers' },
];

const RejectedProfessionalProviders = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData?.rolesAndPermission?.[0] || {};

  // State management
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [viewCommentModal, setViewCommentModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState('');
  const [formEdit, setFormEdit] = useState({
    _id: '',
    status: '',
    comment: '',
  });

  // âœ… Fetch rejected professional provider data
  const getData = async (searchQuery = '') => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const url = `${URLS.Base}v1/dhubApi/admin/professional-providers/get-all-professional-providers`;
      const payload = {
        searchQuery: searchQuery.trim(),
        type: 'rejected', // Filter for rejected providers
      };

      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data.professionalProviders || res.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to fetch rejected providers.',
      );
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // âœ… Initial fetch
  useEffect(() => {
    getData();
  }, []);

  // âœ… Debounced API search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getData(search.trim());
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // âœ… Search handler
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // âœ… View provider details
  const handleViewPopUp = (providerData) => {
    navigate(`/view-professional-provider/${providerData._id}`);

  };

  // âœ… View rejection comment
  const handleViewComment = (comment) => {
    setSelectedComment(comment || 'No rejection reason provided');
    setViewCommentModal(true);
  };

  // âœ… Edit form handler
  const handleEditInputChange = (e) => {
    setFormEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // âœ… Open edit modal
  const handleEditPopUp = (providerData) => {
    setFormEdit({
      _id: providerData._id,
      status: providerData.status || '',
      comment: providerData.comment || '',
    });
    setOpenModal(true);
  };

  // âœ… Close modals
  const handleCloseModal = () => {
    setOpenModal(false);
    setFormEdit({ _id: '', status: '', comment: '' });
  };

  const handleCloseCommentModal = () => {
    setViewCommentModal(false);
    setSelectedComment('');
  };

  // âœ… Submit status update
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!formEdit.status) {
      toast.error('Please select a status');
      return;
    }

    if (formEdit.status === 'rejected' && !formEdit.comment.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    try {
      const payload = {
        status: formEdit.status,
        ...(formEdit.status === 'rejected' && { comment: formEdit.comment }),
      };

      const url = `${URLS.Base}/v1/dhubApi/admin/professional-providers/update-professional-provider-status/${formEdit._id}`;

      const res = await axios.put(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || 'Status updated successfully');
      getData(search.trim());
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      console.error('Update error:', err);
    }
  };

  // âœ… Delete provider
  const handleDelete = async (providerData) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm('Do you really want to delete this rejected provider?')) {
      setLoading(true);
      try {
        const url = `${URLS.Base}/v1/dhubApi/admin/professional-providers/delete-professional-provider/${providerData._id}`;

        const res = await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          toast.success(res.data.message || 'Provider deleted successfully');
          getData(search.trim());
        }
      } catch (error) {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
        console.error('Delete error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // âœ… DataGrid columns
  const columns = useMemo(
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
        field: 'providerInfo',
        headerName: 'Provider Info',
        flex: 1,
        minWidth: 220,
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
                src={params.row.image ? `${URLS.FileBase}${params.row.image}` : ''}
                alt={displayName}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: hasName ? undefined : theme.palette.warning.light,
                }}
              >
                {hasName ? firstName.charAt(0).toUpperCase() : '?'}
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    color: hasName ? 'text.primary' : 'warning.main',
                    fontStyle: hasName ? 'normal' : 'italic',
                    fontWeight: hasName ? 500 : 500,
                    fontSize: '0.875rem',
                  }}
                >
                  {displayName}
                </Typography>
                {params.row.specialization && (
                  <Typography variant="caption" color="text.secondary">
                    {params.row.specialization}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        },
      },
      {
        field: 'phone',
        headerName: 'Phone',
        flex: 1,
        minWidth: 140,
        renderCell: (params) => params.row.phone || 'N/A',
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => params.row.email || 'N/A',
      },
    //   {
    //     field: 'rejectionReason',
    //     headerName: 'Rejection Reason',
    //     flex: 1,
    //     minWidth: 180,
    //     renderCell: (params) => (
    //       <Button
    //         size="small"
    //         variant="outlined"
    //         color="error"
    //         onClick={() => handleViewComment(params.row.comment)}
    //         sx={{ textTransform: 'none' }}
    //       >
    //         View Reason
    //       </Button>
    //     ),
    //   },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.7,
        minWidth: 100,
        renderCell: (params) => (
          <Chip label="Rejected" size="small" color="error" variant="outlined" />
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        minWidth: 160,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            {(rolesAndPermission.professional_providers_edit === true ||
              rolesAndPermission.accessAll === true) && (
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={() => handleEditPopUp(params.row)}
                disabled={loading}
                sx={{ minWidth: '32px', padding: '4px 6px' }}
              >
                <IconAnalyze stroke={1.5} size={18} />
              </Button>
            )}

            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={() => handleViewPopUp(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
            >
              <IconEye size={18} />
            </Button>

            {(rolesAndPermission.professional_providers_delete === true ||
              rolesAndPermission.accessAll === true) && (
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => handleDelete(params.row)}
                disabled={loading}
                sx={{ minWidth: '32px', padding: '4px 6px' }}
              >
                <IconTrash stroke={1.5} size={18} />
              </Button>
            )}
          </Box>
        ),
      },
    ],
    [loading, rolesAndPermission],
  );

  // âœ… DataGrid rows
  const rows = useMemo(
    () => data?.map((item, index) => ({ id: index, ...item })) || [],
    [data],
  );

  return (
    <PageContainer
      title="Rejected Professional Providers"
      description="Manage rejected professional providers"
    >
      <Breadcrumb title="Rejected Professional Providers" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main Content */}
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
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">Rejected Provider List</Typography>
            <Chip label={data.length} size="small" color="error" />
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name, email or phone"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 250 }, bgcolor: 'background.paper' }}
            />
          </Box>
        </Box>
        <Divider />
        <CardContent>
          {data.length === 0 && !loading ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No rejected professional providers found.
            </Alert>
          ) : (
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowHeight={70}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
                loading={loading}
                autoHeight
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Paper>

      {/* View Rejection Comment Modal */}
      <Dialog
        open={viewCommentModal}
        onClose={handleCloseCommentModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rejection Reason</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body1">{selectedComment}</Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseCommentModal} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Status Modal */}
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
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
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
    </PageContainer>
  );
};

export default RejectedProfessionalProviders;

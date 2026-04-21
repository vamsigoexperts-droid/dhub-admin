import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { IconPlus, IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
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
  Stack,
  DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Coupons Management' }];

// Main Offers Component
const OffersManagement = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData?.rolesAndPermission?.[0] || {};
  const token = localStorage.getItem('token') || authData?.token || '';

  const navigate = useNavigate();

  // Fetch Offers Data
  const getData = async (page = 1, limit = 10) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        'https://api.doorstephub.com/v1/dhubApi/admin/offers/getalloffers',
        {
          page: page,
          limit: limit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        const offers = res.data.data || [];

        // Sort by creation date (newest first)
        const sortedOffers = offers.sort((a, b) => {
          const dateA = new Date(a.logCreatedDate || 0);
          const dateB = new Date(b.logCreatedDate || 0);
          return dateB - dateA;
        });

        setData(sortedOffers);
        setPagination(
          res.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
            limit: 10,
          }
        );
      } else {
        toast.error(res.data.message || 'Failed to fetch offers');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch offers.';
      toast.error(errorMessage);
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Search Filter
  useEffect(() => {
    if (search === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => {
        const title = item.title?.toLowerCase() || '';
        const serviceName = getServiceDisplayName(item).toLowerCase();
        const categoryName = getCategoryDisplayName(item).toLowerCase();
        const couponCode = item.couponCode?.toLowerCase() || '';
        const description = item.description?.toLowerCase() || '';

        return (
          title.includes(search.toLowerCase()) ||
          serviceName.includes(search.toLowerCase()) ||
          categoryName.includes(search.toLowerCase()) ||
          couponCode.includes(search.toLowerCase()) ||
          description.includes(search.toLowerCase())
        );
      });
      setFilteredData(filtered);
    }
  }, [data, search]);

  // Handle View Details
  const handleViewPopUp = (offerData) => {
    setSelectedOffer(offerData);
    setOpenDetailsModal(true);
  };

  // Handle Edit - Navigate to Edit Page
  const handleEdit = (offerData) => {
    navigate(`/offers/editoffer/${offerData._id}`);
  };

  // Handle Delete
  const handleDelete = async (offerData) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm(`Do you really want to delete "${offerData.title}"?`)) {
      setLoading(true);
      try {
        const res = await axios.delete(
          `https://api.doorstephub.com/v1/dhubApi/admin/offers/deleteoffer/${offerData._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 200 || res.data.success) {
          toast.success(res.data.message || 'Offer deleted successfully');
          getData();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'An error occurred during deletion';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedOffer(null);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Status Color Helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  };

  const getServiceDisplayName = (item) => {
    if (item?.serviceName) return item.serviceName;
    if (item?.service?.name) return item.service.name;
    if (item?.serviceId && typeof item.serviceId === 'object') {
      return item.serviceId.name || item.serviceId.serviceName || 'N/A';
    }
    return 'N/A';
  };

  const getCategoryDisplayName = (item) => {
    if (item?.categoryName) return item.categoryName;
    if (item?.category?.name) return item.category.name;
    if (item?.categoryId && typeof item.categoryId === 'object') {
      return item.categoryId.name || item.categoryId.categoryName || 'N/A';
    }
    return 'N/A';
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    return `Rs. ${value}`;
  };

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // DataGrid Columns Configuration
  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S.No',
        width: 70,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        display: 'flex',
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'image',
        headerName: 'Image',
        width: 100,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        display: 'flex',
        renderCell: (params) => (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Avatar
              src={params.row.image ? `${URLS.FileBase}${params.row.image}` : ''}
              alt={params.row.title || 'Offer'}
              variant="rounded"
              sx={{ width: 60, height: 60 }}
            >
              {params.row.title?.charAt(0) || 'O'}
            </Avatar>
          </Box>
        ),
      },
      {
        field: 'title',
        headerName: 'Title',
        flex: 2,
        align: 'left',
        headerAlign: 'left',
        display: 'flex',
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {params.row.title || 'N/A'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {params.row.couponCode || 'No Code'}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'serviceName',
        headerName: 'Service Name',
        flex: 1.5,
        align: 'center',
        headerAlign: 'center',
        display: 'flex',
        renderCell: (params) => (
          <Typography variant="body2">{params.row.serviceName || 'N/A'}</Typography>
        ),
      },
      {
        field: 'categoryName',
        headerName: 'Category Name',
        flex: 1.5,
        align: 'center',
        headerAlign: 'center',
        display: 'flex',
        renderCell: (params) => (
          <Typography variant="body2">{params.row.categoryName || 'N/A'}</Typography>
        ),
      },
      {
        field: 'discount',
        headerName: 'Discount',
        flex: 1.2,
        align: 'center',
        headerAlign: 'center',
        display: 'flex',
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" fontWeight={600} color="primary">
              {params.row.discountType === 'percentage'
                ? `${params.row.discountValue}%`
                : formatCurrency(params.row.discountValue)}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {params.row.discountType}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'validity',
        headerName: 'Validity',
        flex: 1.5,
        align: 'center',
        headerAlign: 'center',
        display: 'flex',
        renderCell: (params) => (
          <Box>
            <Typography variant="caption" display="block">
              {formatDate(params.row.startDate)}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              to {formatDate(params.row.endDate)}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.8,
        align: 'center',
        headerAlign: 'center',
        display: 'flex',
        renderCell: (params) => (
          <Chip
            label={getStatusText(params.row.status)}
            size="small"
            color={getStatusColor(params.row.status)}
            variant="outlined"
          />
        ),
      },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 1.8,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        display: 'flex',
        renderCell: (params) => (
          <Box display="flex" gap={1} alignItems="center">
            {(rolesAndPermission.offers_edit === true || rolesAndPermission.accessAll === true) && (
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={() => handleEdit(params.row)}
                disabled={loading}
                sx={{ minWidth: '32px', padding: '4px 6px' }}
                aria-label={`Edit ${params.row.title}`}
              >
                <IconEdit stroke={1.5} size={18} />
              </Button>
            )}

            <Button
              size="small"
              color="info"
              variant="contained"
              onClick={() => handleViewPopUp(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`View ${params.row.title}`}
            >
              <IconEye size={18} />
            </Button>

            {(rolesAndPermission.offers_delete === true ||
              rolesAndPermission.accessAll === true) && (
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => handleDelete(params.row)}
                disabled={loading}
                sx={{ minWidth: '32px', padding: '4px 6px' }}
                aria-label={`Delete ${params.row.title}`}
              >
                <IconTrash stroke={1.5} size={18} />
              </Button>
            )}
          </Box>
        ),
      },
    ],
    [loading, rolesAndPermission]
  );

  const rows = useMemo(
    () =>
      filteredData?.map((item, index) => ({
        id: item._id || index,
        ...item,
        serviceName: getServiceDisplayName(item),
        categoryName: getCategoryDisplayName(item),
      })) || [],
    [filteredData]
  );

  return (
    <PageContainer title="Coupon Management Page" description="Manage coupons for your platform">
      <Breadcrumb title="Coupon Management" items={BCrumb} />
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
          gap={2}
        >
          <Typography variant="h6">Coupons List ({pagination.totalCount})</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by title, service, category, coupon..."
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 200, sm: 350 }, bgcolor: 'background.paper' }}
              aria-label="Search Coupons"
            />
            {(rolesAndPermission.offers_add === true || rolesAndPermission.accessAll === true) && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<IconPlus />}
                onClick={() => navigate('/advertisments/addoffer')}
              >
                Add Coupon
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
              pageSize={10}
              rowHeight={80}
              pageSizeOptions={[5, 10, 20, 50]}
              disableRowSelectionOnClick
              loading={loading}
              sx={{
                '& .MuiDataGrid-cell': {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                },
                '& .MuiDataGrid-columnHeader': {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>

      {/* View Details Modal */}
      <Dialog open={openDetailsModal} onClose={handleCloseDetailsModal} maxWidth="md" fullWidth>
        <DialogTitle>Coupon Details</DialogTitle>
        <DialogContent>
          {selectedOffer && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Offer Image */}
              {selectedOffer.image && (
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="textSecondary">
                    Coupon Image
                  </Typography>
                  <Box mt={1}>
                    <img
                      src={`${URLS.FileBase}${selectedOffer.image}`}
                      alt={selectedOffer.title}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                </Grid>
              )}

              {/* Offer Information */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Title
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedOffer.title || 'N/A'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Coupon Code
                    </Typography>
                    <Chip label={selectedOffer.couponCode || 'N/A'} color="primary" sx={{ mt: 0.5 }} />
                  </Box>

                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Status
                    </Typography>
                    <Box mt={0.5}>
                      <Chip
                        label={getStatusText(selectedOffer.status)}
                        color={getStatusColor(selectedOffer.status)}
                        size="medium"
                      />
                    </Box>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  Description
                </Typography>
                <Typography variant="body1" mt={1}>
                  {selectedOffer.description || 'No description available'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">
                  Service Name
                </Typography>
                <Typography variant="body1" mt={1}>
                  {selectedOffer.serviceName || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">
                  Category Name
                </Typography>
                <Typography variant="body1" mt={1}>
                  {selectedOffer.categoryName || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">
                  Discount Type
                </Typography>
                <Typography variant="body1" mt={1}>
                  {selectedOffer.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">
                  Discount Value
                </Typography>
                <Typography variant="h6" color="primary" fontWeight={600} mt={1}>
                  {selectedOffer.discountType === 'percentage'
                    ? `${selectedOffer.discountValue}%`
                    : formatCurrency(selectedOffer.discountValue)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">
                  Max Discount Amount
                </Typography>
                <Typography variant="body1" mt={1}>
                  {formatCurrency(selectedOffer.maxDiscountAmount)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">
                  Min Order Amount
                </Typography>
                <Typography variant="body1" mt={1}>
                  {formatCurrency(selectedOffer.minOrderAmount)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">
                  Start Date
                </Typography>
                <Typography variant="body1" mt={1}>
                  {formatDate(selectedOffer.startDate)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">
                  End Date
                </Typography>
                <Typography variant="body1" mt={1}>
                  {formatDate(selectedOffer.endDate)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">
                  Usage Limit
                </Typography>
                <Typography variant="body1" mt={1}>
                  {selectedOffer.usageLimit || 'Unlimited'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">
                  Used Count
                </Typography>
                <Typography variant="body1" fontWeight={600} mt={1}>
                  {selectedOffer.usedCount || 0}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">
                  Created Date
                </Typography>
                <Typography variant="body2" mt={1}>
                  {selectedOffer.logCreatedDate
                    ? new Date(selectedOffer.logCreatedDate).toLocaleString('en-IN')
                    : 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">
                  Modified Date
                </Typography>
                <Typography variant="body2" mt={1}>
                  {selectedOffer.logModifiedDate
                    ? new Date(selectedOffer.logModifiedDate).toLocaleString('en-IN')
                    : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDetailsModal} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default OffersManagement;



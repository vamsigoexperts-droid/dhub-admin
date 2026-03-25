import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, Paper, Box, Typography, Divider, CardContent } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { IconCheck, IconX, IconEye, IconTrash } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Medicine Request' }];

const CategoriesRequest = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [rejectedReason, setrejectedReason] = useState('');

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  };

  const token = getToken();

  const handleApprove = async (categoryData) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    if (window.confirm(`Are you sure you want to approve "${categoryData.name}" category?`)) {
      setLoading(true);
      try {
        const res = await axios.put(
          `${URLS.UpdateMedicineItemRequest}/${categoryData.productId}`,
          { isRequested: 'approved' },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.status === 200) {
          toast.success(res.data.message);
          getData();
        }
      } catch (error) {
        const message = error.response?.data?.message;
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const openRejectDialog = (categoryData) => {
    setSelectedCategory(categoryData);
    setrejectedReason('');
    setRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setRejectDialogOpen(false);
    setSelectedCategory(null);
    setrejectedReason('');
  };

  const handleView = (product) => {
    navigate('/view-grocery-item');
    localStorage.setItem('groceryId', product.productId);
  };

  const handleReject = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (!rejectedReason.trim()) {
      toast.error('Please provide a reason for rejection.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${URLS.UpdateMedicineItemRequest}/${selectedCategory.productId}`,
        {
          isRequested: 'rejected',
          rejectedReason: rejectedReason.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        getData();
        closeRejectDialog();
      }
    } catch (error) {
      const message = error.response?.data?.message;
      toast.error(message);
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
      const res = await axios.post(
        URLS.GetMedicineItemRequest,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success && Array.isArray(res.data.data)) {
        const mappedData = res.data.data;
        setData(mappedData);
        setFilteredData(mappedData);
      } else {
        setData([]);
        setFilteredData([]);
        toast.warn('No Items found.');
      }
    } catch (error) {
      console.error('Failed to fetch Items:', error);
      toast.error('Failed to load Items. Please try again.');
      setData([]);
      setFilteredData([]);
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
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [data, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (product) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm(`Do you really want to delete "${product.name}"?`)) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteMedicalItem}/${product.productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message || 'Product deleted successfully');
          getData();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete product';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const page = params.api.state.pagination.paginationModel.page || 0;
          const pageSize = params.api.state.pagination.paginationModel.pageSize || 5;
          const rowIndex = page * pageSize + params.api.getSortedRowIds().indexOf(params.id) + 1;
          return (
            <Typography variant="body2" color="text.secondary">
              {rowIndex}
            </Typography>
          );
        },
      },
      {
        field: 'medicineInfo',
        headerName: 'Medicine Info',
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={URLS.FileBase + params.row.productImage}
              alt={params.row.medicineName}
              sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }}
              variant="rounded"
            />
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {params.row.medicineName}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'mrp',
        headerName: 'MRP',
        flex: 1,
      },
      {
        field: 'sellingPrice',
        headerName: 'Selling Price',
        flex: 1,
      },
      {
        field: 'categoryName',
        headerName: 'Category',
        flex: 1,
        renderCell: (params) => <Typography variant="body2">{params.row.categoryName}</Typography>,
      },
      {
        field: 'brandName',
        headerName: 'Brand',
        flex: 1,
        renderCell: (params) => <Typography variant="body2">{params.row.brandName}</Typography>,
      },
      {
        field: 'prescriptionRequired',
        headerName: 'Prescription',

        renderCell: (params) => (
          <Typography variant="body2">
            {params.row.prescriptionRequired ? 'Required' : 'Not Required'}
          </Typography>
        ),
      },
      {
        field: 'rejectedReason',
        headerName: 'Rejected Reason',
        flex: 1,
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <Box display="flex" gap={1}>
              {rolesAndPermission.medicines_request_edit === true ||
              rolesAndPermission.accessAll === true ? (
                <>
                  {params.row.isRequested === 'rejected' ? (
                    <></>
                  ) : (
                    <>
                      <Button
                        size="small"
                        color="success"
                        variant="contained"
                        onClick={() => handleApprove(params.row)}
                        disabled={loading}
                        sx={{ minWidth: '32px', padding: '4px 6px' }}
                        aria-label={`Approve ${params.row.name}`}
                      >
                        <IconCheck stroke={1.5} size={18} />
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => openRejectDialog(params.row)}
                        disabled={loading}
                        sx={{ minWidth: '32px', padding: '4px 6px' }}
                        aria-label={`Reject ${params.row.name}`}
                      >
                        <IconX stroke={1.5} size={18} />
                      </Button>{' '}
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
              <Button
                size="small"
                color="secondary"
                variant="contained"
                sx={{ minWidth: '32px', padding: '4px 6px' }}
                onClick={() => handleView(params.row)}
                aria-label={`View ${params.row.name}`}
              >
                <IconEye stroke={1.5} size={18} />
              </Button>

              {rolesAndPermission.medicines_request_delete === true ||
              rolesAndPermission.accessAll === true ? (
                <>
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    sx={{ minWidth: '32px', padding: '4px 6px' }}
                    onClick={() => handleDelete(params.row)}
                    aria-label={`Delete ${params.row.name}`}
                  >
                    <IconTrash stroke={1.5} size={18} />
                  </Button>{' '}
                </>
              ) : (
                <></>
              )}
            </Box>
          );
        },
      },
    ],
    [loading],
  );

  const rows = useMemo(
    () =>
      filteredData?.map((item, index) => ({
        id: index,
        ...item,
      })) || [],
    [filteredData],
  );

  return (
    <PageContainer
      title="Medicine Request"
      description="Review and manage Medicine Request for your e-commerce platform"
    >
      <Breadcrumb title="Medicine Request" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Reject Reason Dialog */}
      <Dialog open={rejectDialogOpen} onClose={closeRejectDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Category</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide a reason for rejecting "{selectedCategory?.name}"
          </Typography>
          <TextField
            autoFocus
            label="Rejection Reason"
            fullWidth
            multiline
            rows={3}
            value={rejectedReason}
            onChange={(e) => setrejectedReason(e.target.value)}
            placeholder="Enter the reason for rejection..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRejectDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            color="error"
            variant="contained"
            disabled={loading || !rejectedReason.trim()}
          >
            {loading ? 'Rejecting...' : 'Reject Category'}
          </Button>
        </DialogActions>
      </Dialog>

      <Paper
        variant="outlined"
        sx={{
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
          <Typography variant="h6">Medicine Request List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Medicine Request"
            />
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              autoHeight
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default CategoriesRequest;

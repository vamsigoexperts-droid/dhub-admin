import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Avatar, Paper, Box, Typography, Divider, CardContent, Chip } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { IconCheck, IconX, IconTrash } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Sub Categories Request' }];

const SubCategoriesRequest = () => {
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
          `${URLS.UpdatePendingSubCategoriesRequest}/${categoryData._id}`,
          { status: 'active', isRequested: 'approved' },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.status === 200) {
          toast.success(res.data.message || 'Category approved successfully!');
          getData();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to approve category';
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
        `${URLS.UpdatePendingSubCategoriesRequest}/${selectedCategory._id}`,
        {
          isRequested: 'rejected',
          status: 'inactive',
          rejectedReason: rejectedReason.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.status === 200) {
        toast.success(res.data.message || 'Category rejected successfully!');
        getData();
        closeRejectDialog();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reject category';
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
        URLS.GetPendingSubCategoriesRequest,
        { flagType: 'shopping' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const inactiveCategories = res.data.subcategory;
      setData(inactiveCategories);
    } catch (error) {
      toast.error('Failed to fetch Sub Categories Request.');
      console.error('Failed to fetch Sub Categories Request:', error);
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

  const handleDelete = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    if (window.confirm('Do you really want to delete this Sub Category?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteSubCategories}/${data._id}`, {
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
  };

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'categoryinfo',
        headerName: 'Sub Category Info',
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={URLS.FileBase + params.row.image}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">{params.row.name}</Typography>
          </Box>
        ),
      },
      {
        field: 'categoryName',
        headerName: 'Category Name',
        flex: 1,
      },
      {
        field: 'storeName',
        headerName: 'Store Name',
        flex: 1,
      },
      {
        field: 'isRequested',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => (
          <Chip label={params.row.isRequested} size="small" color="warning" variant="outlined" />
        ),
      },
      {
        field: 'rejectedReason',
        headerName: 'Rejected Reason',
        flex: 1,
      },
      {
        field: 'createdAt',
        headerName: 'Created Date',
        flex: 1,
        renderCell: (params) => {
          const date = new Date(params.row.logCreatedDate);
          return (
            <Typography variant="body2">
              {date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Typography>
          );
        },
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
              {rolesAndPermission.shopping_subcat_request_edit === true ||
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
                      </Button>{' '}
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
              {rolesAndPermission.shopping_subcat_request_delete === true ||
              rolesAndPermission.accessAll === true ? (
                <>
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    onClick={() => handleDelete(params.row)}
                    disabled={loading}
                    sx={{ minWidth: '32px', padding: '4px 6px' }}
                    aria-label={`Delete ${params.row.name}`}
                  >
                    <IconTrash stroke={1.5} size={18} />
                  </Button>
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
      title="Sub Categories Request"
      description="Review and manage Sub Categories Request for your e-commerce platform"
    >
      <Breadcrumb title="Sub Categories Request" items={BCrumb} />
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
          <Typography variant="h6">Sub Categories Request List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Sub Categories Request"
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

export default SubCategoriesRequest;

import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconCheck, IconX } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  TextField,
  Avatar,
  Paper,
  Box,
  Typography,
  Divider,
  CardContent,
  Chip,
} from '@mui/material';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Pending Categories' }];

// Main PendingCategories Component
const PendingCategories = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleApprove = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    if (window.confirm(`Are you sure you want to approve "${data.name}" category?`)) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('serviceId', data.serviceId);
        formData.append('status', 'active');
        
        const res = await axios.put(
          `${URLS.ApproveCategorie}/${data._id}`,
          formData,
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

  const handleReject = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    if (window.confirm(`Are you sure you want to reject "${data.name}" category? This will delete it permanently.`)) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteCategorie}/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message || 'Category rejected and deleted successfully!');
          getData();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to reject category';
        toast.error(message);
      } finally {
        setLoading(false);
      }
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
        URLS.GetCategories,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Filter only inactive categories
      const inactiveCategories = res.data.category?.filter(
        (item) => item.status === 'inactive'
      ) || [];
      setData(inactiveCategories);
    } catch (error) {
      toast.error('Failed to fetch Pending Categories.');
      console.error('Failed to fetch Pending Categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }
      setLoading(true);
      try {
        const serviceRes = await axios.post(
          URLS.GetService,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setServiceTypes(serviceRes.data.services || []);

        await getData();
      } catch (error) {
        toast.error('Failed to fetch data.');
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

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
        headerName: 'Category Info',
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
        field: 'serviceName',
        headerName: 'Service Name',
        flex: 1,
        renderCell: (params) => {
          const serviceName = params.row.serviceName || 
            serviceTypes.find((service) => service._id === params.row.serviceId)?.name || 'N/A';
          return <Typography variant="body2">{serviceName}</Typography>;
        },
      },
      {
        field: 'storeName',
        headerName: 'Store Name',
        flex: 1,
        renderCell: (params) => (
          <Typography variant="body2">{params.row.storeName || 'N/A'}</Typography>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => (
          <Chip
            label="Pending"
            size="small"
            color="warning"
            variant="outlined"
          />
        ),
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
        renderCell: (params) => (
          <Box display="flex" gap={1}>
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
              onClick={() => handleReject(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Reject ${params.row.name}`}
            >
              <IconX stroke={1.5} size={18} />
            </Button>
          </Box>
        ),
      },
    ],
    [loading, serviceTypes],
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
      title="Pending Categories"
      description="Review and manage pending Categories for your e-commerce platform"
    >
      <Breadcrumb title="Pending Categories" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      
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
          <Typography variant="h6">Pending Categories List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'background.paper' }}
              aria-label="Search Pending Categories"
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
              sx={{
                '& .MuiDataGrid-row': {
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default PendingCategories;


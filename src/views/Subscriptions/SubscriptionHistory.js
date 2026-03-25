import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  TextField,
  Paper,
  Box,
  Divider,
  CardContent,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from 'src/Url';
import axios from 'axios';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Subscription History' }];

// Utility to get auth token
const getAuthToken = () => JSON.parse(localStorage.getItem('user'))?.token || '';

const SubscriptionHistory = () => {
  const theme = useTheme();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState({ fetch: false, submit: false, delete: false });

  const token = getAuthToken();

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setIsLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const res = await axios.post(
        URLS.GetUsers,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.user || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch Roles');
    } finally {
      setIsLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) => `${item.name}`.toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'UserInfo',
        headerName: 'User Name',
        flex: 1,

        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={URLS.FileBase + params.row.image}
              alt={`${params.row.name}`}
              sx={{ width: 40, height: 40 }}
            />
            <Typography>{`${params.row.name}`}</Typography>
          </Box>
        ),
      },
      { field: 'phone', headerName: 'User Mobile Number', flex: 1 },
      { field: 'email', headerName: 'User Email', flex: 1 },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => (
          <Chip
            label={params.row.status ? 'Active' : 'Inactive'}
            size="small"
            color={params.row.status ? 'primary' : 'error'}
            variant="outlined"
          />
        ),
      },
    ],
    [isLoading],
  );

  const rows = useMemo(
    () => filteredData.map((item) => ({ id: item._id, ...item })),
    [filteredData],
  );

  return (
    <PageContainer
      title="Subscription History"
      description="Manage Subscription History for your e-commerce platform"
    >
      <Breadcrumb title="Subscription History" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Paper variant="outlined">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h6">Subscription History</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: theme.palette.background.paper }}
              aria-label="Search Users by name"
            />
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default SubscriptionHistory;

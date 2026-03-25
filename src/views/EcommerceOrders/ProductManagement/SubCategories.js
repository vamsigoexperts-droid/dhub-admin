import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  TextField,
  Avatar,
  Paper,
  Box,
  Typography,
  Divider,
  CardContent,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../../Url';
import axios from 'axios';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Sub Categories' }];

// Main Sub Categories Component
const SubCategories = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch {
      return '';
    }
  };

  const token = getToken();

  // Fetch subcategories for table
  const getSubCategories = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetSubCategories,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.subcategory || []); // as per API response
    } catch {
      toast.error('Failed to fetch sub-categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    getSubCategories();
  }, [token]);

  useEffect(() => {
    setFilteredData(
      search === ''
        ? data
        : data.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase()),
          ),
    );
  }, [data, search]);

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 70,
        sortable: false,
        renderCell: (params) =>
          params.api.getSortedRowIds().indexOf(params.id) + 1,
      },
      {
        field: 'subcategoryinfo',
        headerName: 'Sub-Category Info',
        flex: 1,
        minWidth: 220,
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
        minWidth: 180,
        renderCell: (params) => (
          <Typography variant="body2">{params.row.categoryName}</Typography>
        ),
      },
    ],
    [],
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
    <PageContainer title="Sub Categories" description="Manage Sub Categories">
      <Breadcrumb title="Sub Categories" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper
        variant="outlined"
        sx={{ borderRadius: '8px', boxShadow: theme.shadows[2] }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Typography variant="h6">Sub Categories List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 200, bgcolor: 'white' }}
              aria-label="Search sub categories"
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

export default SubCategories;

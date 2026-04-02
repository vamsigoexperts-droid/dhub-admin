import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import {
  Paper,
  Box,
  Divider,
  CardContent,
  Typography,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Stack,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { IconSearch } from '@tabler/icons-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'https://api.doorstephub.com/v1/dhubApi/admin/category-banner/get';

const getAuthToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || '';
  } catch {
    return '';
  }
};

const CategoryBanner = () => {
  const navigate = useNavigate();
  const token = getAuthToken();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });

  const fetchData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && res.data.data) {
        const dataWithSno = res.data.data.map((item, index) => ({
          ...item,
          sno: index + 1,
        }));
        setData(dataWithSno);
      } else {
        toast.error('Failed to fetch category banners');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch category banners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) => {
      const bannerName = (item.serviceId?.name || '') + ' ' + (item.categoryId?.name || '');
      return bannerName.toLowerCase().includes(search.toLowerCase());
    });
  }, [data, search]);

  const handleView = (row) => {
    navigate(`/advertisments/categorybanner/${row._id}`);
  };

  const handleEdit = (row) => {
    navigate(`/advertisments/category-banner/${row._id}`);
  };

  const handleDelete = (row) => {
    // TODO: hook up delete API
    console.log('Delete row', row);
    toast.info(`Delete functionality for ${row.serviceId?.name || 'banner'}`);
  };

  const columns = [
    {
      field: 'sno',
      headerName: 'S. No',
      width: 70,
      sortable: false,
      filterable: false,
    },
    {
      field: 'bannerName',
      headerName: 'Service name',
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            alt={params.row.serviceId?.name || params.row.categoryId?.name}
            src={params.row.bannerImage || ''}
            sx={{ width: 40, height: 40 }}
          />
          <Typography variant="body2" fontWeight="medium">
            {params.row.serviceId?.name || params.row.categoryId?.name || '---'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.status ? 'Active' : 'Inactive'}
          size="small"
          color={params.row.status ? 'success' : 'default'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 280,
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            color="info"
            startIcon={<VisibilityIcon />}
            onClick={() => handleView(params.row)}
            sx={{
              textTransform: 'none',
              minWidth: 70,
              fontSize: '12px',
              paddingInline: 1,
            }}
          >
            View
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params.row)}
            sx={{
              textTransform: 'none',
              minWidth: 70,
              fontSize: '12px',
              paddingInline: 1,
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row)}
            sx={{
              textTransform: 'none',
              minWidth: 80,
              fontSize: '12px',
              paddingInline: 1,
            }}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Paper sx={{ p: 2 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Category Banners ({data.length})</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search category banners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={18} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/advertisments/categorybanner/create')}
            sx={{
              height: 40,
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': { boxShadow: 'none' },
            }}
            startIcon={<AddIcon fontSize="small" />}
          >
            Create Banner
          </Button>
        </Box>
      </Box>

      <Divider />
      <CardContent>
        <Box sx={{ height: 'auto', width: '100%' }}>
          <DataGrid
            autoHeight
            rows={filteredData}
            columns={columns}
            loading={isLoading}
            pagination
            pageSizeOptions={[5, 10, 20]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowId={(row) => row._id}
            disableRowSelectionOnClick
            sx={{ '& .MuiDataGrid-cell:focus': { outline: 'none' } }}
          />
        </Box>
      </CardContent>
    </Paper>
  );
};

export default CategoryBanner;


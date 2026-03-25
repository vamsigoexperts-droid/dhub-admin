import React, { useState, useEffect, useMemo } from 'react';
import {
  TextField,
  Avatar,
  Paper,
  Box,
  Typography,
  Button,
  CardContent,
  IconButton,
} from '@mui/material';
import { IconPlus, IconTrash, IconPencil, IconEye } from '@tabler/icons-react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { URLS } from '../../../Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Items' }];

const Products = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetAllProducts,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success && Array.isArray(res.data.data)) {
        const mappedData = res.data.data.map((item) => ({
          _id: item._id,
          name: item.name || 'Unnamed Product',
          price: item.sellingPrice ? `â‚¹${parseFloat(item.sellingPrice).toFixed(2)}` : 'N/A',
          quantity: item.currentStockQuantity || '0',
          storeName: item.categoryName || 'Uncategorized',
          image: item.image && item.image.length > 0 ? item.image[0] : '',
          brandName: item.brandName,
          subcategoryName: item.subcategoryName,
          productSku: item.productSku,
          status: item.status,
          ...item,
        }));
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
    if (!search.trim()) {
      setFilteredData(data);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearch) ||
          item.productSku?.toLowerCase().includes(lowerSearch) ||
          item.brandName?.toLowerCase().includes(lowerSearch),
      );
      setFilteredData(filtered);
    }
  }, [data, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleView = (product) => {
    navigate('/viewproduct');
    localStorage.setItem('productId', product._id);
  };

  const handleEdit = (product) => {
    navigate('/editproduct');
    localStorage.setItem('productId', product._id);
  };

  const handleDelete = async (product) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm(`Do you really want to delete "${product.name}"?`)) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteProduct}/${product._id}`, {
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

  const handleAddPopUp = () => {
    navigate('/addproduct');
  };

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const page = params.api.state.pagination.paginationModel.page || 0;
          const pageSize = params.api.state.pagination.paginationModel.pageSize || 5;
          const rowIndex = page * pageSize + params.api.getSortedRowIds().indexOf(params.id) + 1;
          return <Typography variant="body2">{rowIndex}</Typography>;
        },
      },
      {
        field: 'sectionInfo',
        headerName: 'Items Info',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={`${URLS.FileBase}${params.row.image[0]}`}
              alt={params.row.name}
              sx={{ width: 40, height: 40, borderRadius: '4px' }}
            />
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {params.row.name}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'price',
        headerName: 'Selling Price',
        flex: 0.7,
        minWidth: 100,
        renderCell: (params) => <Typography variant="body2">{params.row.price}</Typography>,
      },
      {
        field: 'quantity',
        headerName: 'Stock',
        flex: 0.5,
        minWidth: 80,
        renderCell: (params) => <Typography variant="body2">{params.row.quantity}</Typography>,
      },
      {
        field: 'storeName',
        headerName: 'Category',
        flex: 0.7,
        minWidth: 120,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" noWrap>
              {params.row.storeName}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'brandName',
        headerName: 'Brand',
        flex: 0.6,
        minWidth: 100,
        renderCell: (params) => (
          <Typography variant="body2">{params.row.brandName || 'N/A'}</Typography>
        ),
      },
      {
        field: 'action',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1} justifyContent="center">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleView(params.row)}
              aria-label={`View ${params.row.name}`}
            >
              <IconEye size={18} stroke={1.5} />
            </IconButton>
            <IconButton
              size="small"
              color="info"
              onClick={() => handleEdit(params.row)}
              aria-label={`Edit ${params.row.name}`}
            >
              <IconPencil size={18} stroke={1.5} />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row)}
              disabled={loading}
              aria-label={`Delete ${params.row.name}`}
            >
              <IconTrash size={18} stroke={1.5} />
            </IconButton>
          </Box>
        ),
      },
    ],
    [loading],
  );

  const rows = useMemo(
    () => filteredData.map((item) => ({ id: item._id, ...item })),
    [filteredData],
  );

  return (
    <PageContainer title="Items" description="Manage Items for your e-commerce platform">
      <Breadcrumb title="Items Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
          overflow: 'hidden',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Add Items
          </Typography>
        </Box>
      </Paper>
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
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Items List
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name, SKU, or brand"
              value={search}
              onChange={handleSearch}
              sx={{
                minWidth: { xs: 150, sm: 200 },
                bgcolor: 'white',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                },
              }}
              aria-label="Search Items"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              disabled={loading}
              startIcon={<IconPlus size={20} />}
              aria-label="Create New Items"
              sx={{ borderRadius: '6px' }}
            >
              Create Items
            </Button>
          </Box>
        </Box>
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pageSizeOptions={[5, 10, 20]}
              pagination
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.grey[50],
                  borderBottom: `2px solid ${theme.palette.divider}`,
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: `1px solid ${theme.palette.divider}`,
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default Products;

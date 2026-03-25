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
import { URLS } from '../../Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Groceries List' }];

const Products = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetGrocerysItem,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success && Array.isArray(res.data.data)) {
        const mappedData = res.data.data.map((item) => ({
          _id: item._id,
          name: item.productName || 'Unnamed Product',
          mrp: item.price,
          saleprice: item.discountPrice,
          quantity: item.stockQuantity || 0,
          storeName: item.categoryName || 'Uncategorized',
          image: item.thumbnailImage ? `${URLS.FileBase}${item.thumbnailImage}` : '',
          productSku: item.productCode || 'N/A',
          status: item.status || 'N/A',
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
          item.productSku.toLowerCase().includes(lowerSearch),
      );
      setFilteredData(filtered);
    }
  }, [data, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleView = (product) => {
    navigate('/view-grocery-item');
    localStorage.setItem('groceryId', product.productId);
  };

  const handleEdit = (product) => {
    navigate('/edit-grocerys-Item');
    localStorage.setItem('groceryId', product.productId);
  };

  const handleDelete = async (product) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm(`Do you really want to delete "${product.name}"?`)) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteGrocerysItem}/${product.productId}`, {
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
    navigate('/add-grocerys-Item');
  };

  const columns = useMemo(
    () => [
  {
  field: 'sno',
  headerName: 'S. No',
  sortable: false,
  filterable: false,
  renderCell: (params) => {
    const page = params.api.state.pagination.paginationModel.page ?? 0;
    const pageSize = params.api.state.pagination.paginationModel.pageSize ?? 5;

    // 1) Prefer global index from the sorted list (most reliable for client-side)
    let indexInAll = -1;
    try {
      const allIds = params.api.getSortedRowIds?.() ?? [];
      indexInAll = allIds.indexOf(params.id);
    } catch (e) {
      indexInAll = -1;
    }

    // 2) Fallback to getRowIndex (some versions of DataGrid expose this)
    if (indexInAll === -1 && typeof params.api.getRowIndex === 'function') {
      try {
        // getRowIndex usually returns the index inside the full sorted/filtered set
        indexInAll = params.api.getRowIndex(params.id);
      } catch (e) {
        indexInAll = -1;
      }
    }

    // 3) Last fallback: compute using page + visible row order on the page
    let serial;
    if (indexInAll >= 0) {
      serial = indexInAll + 1; // continuous numbering across all rows
    } else {
      // fallback behaviour: use index inside current page (if available)
      const visibleIds = params.api.getVisibleRowModels
        ? Array.from(params.api.getVisibleRowModels().keys())
        : (params.api.getSortedRowIds?.() ?? []);
      const indexInPage = visibleIds.indexOf(params.id);
      serial = page * pageSize + (indexInPage >= 0 ? indexInPage + 1 : 0) + 1;
    }

    return (
      <Typography variant="body2" color="text.secondary">
        {serial}
      </Typography>
    );
  },
}
,
      {
        field: 'sectionInfo',
        headerName: 'Product Info',
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={params.row.image}
              alt={params.row.name}
              sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }}
              variant="rounded"
            />
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {params.row.name}
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
        field: 'saleprice',
        headerName: 'Sale Price',
        flex: 1,
      },
      {
        field: 'storeName',
        headerName: 'Category',
        flex: 1,

        renderCell: (params) => <Typography variant="body2">{params.row.storeName}</Typography>,
      },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 1,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            {rolesAndPermission.grocery_list_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  onClick={() => handleEdit(params.row)}
                  aria-label={`Edit ${params.row.name}`}
                >
                  <IconPencil stroke={1.5} size={18} />
                </Button>
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

            {rolesAndPermission.grocery_list_delete === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  onClick={() => handleDelete(params.row)}
                  disabled={loading}
                  aria-label={`Delete ${params.row.name}`}
                >
                  <IconTrash stroke={1.5} size={18} />
                </Button>
              </>
            ) : (
              <></>
            )}
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
    <PageContainer
      title="Groceries List"
      description="Manage Groceries List for your e-commerce platform"
    >
      <Breadcrumb title="Groceries List" items={BCrumb} />
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
          <Typography variant="h6">Groceries List </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Grocery"
            />{' '}
            {rolesAndPermission.add_grocery_add === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create New Grocery"
                >
                  Create Grocery
                </Button>
              </>
            ) : (
              <></>
            )}
          </Box>
        </Box>
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pageSize={5}
              rowHeight={38}
              rowsPerPageOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default Products;

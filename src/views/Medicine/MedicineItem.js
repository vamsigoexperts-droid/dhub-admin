import React, { useState, useEffect, useMemo } from 'react';
import { TextField, Avatar, Paper, Box, Typography, Button, CardContent } from '@mui/material';
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

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Medicines' }];

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
        URLS.GetMedicalItem,
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
        toast.warn('No medicines found.');
      }
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
      toast.error('Failed to load medicines. Please try again.');
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
          item.medicineName?.toLowerCase().includes(lowerSearch) ||
          item.productCodeSku?.toLowerCase().includes(lowerSearch) ||
          item.brandName?.toLowerCase().includes(lowerSearch) ||
          item.categoryName?.toLowerCase().includes(lowerSearch),
      );
      setFilteredData(filtered);
    }
  }, [data, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleView = (product) => {
    navigate('/view-medicine-Item');
    localStorage.setItem('medicineId', product.productId);
  };

  const handleEdit = (product) => {
    navigate('/edit-medicine-item');
    localStorage.setItem('medicineId', product.productId);
  };

  const handleDelete = async (product) => {
    console.log(product);
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm(`Do you really want to delete "${product.medicineName}"?`)) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteMedicalItem}/${product.productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message || 'Medicine deleted successfully');
          getData();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete medicine';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddPopUp = () => {
    navigate('/add-medicine-item');
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
        field: 'action',
        headerName: 'Actions',
        flex: 1,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            {rolesAndPermission.medicines_edit === true || rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  onClick={() => handleEdit(params.row)}
                  aria-label={`Edit ${params.row.medicineName}`}
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
              aria-label={`View ${params.row.medicineName}`}
            >
              <IconEye stroke={1.5} size={18} />
            </Button>
            {rolesAndPermission.medicines_delete === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  onClick={() => handleDelete(params.row)}
                  disabled={loading}
                  aria-label={`Delete ${params.row.medicineName}`}
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
      title="Medicines Management"
      description="Manage medicines for your e-commerce platform"
    >
      <Breadcrumb title="Medicines Management" items={BCrumb} />
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
          <Typography variant="h6">Medicines List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name, SKU, brand, or category"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Medicine"
            />
            {rolesAndPermission.add_medicine_add === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create New Medicine"
                >
                  Create Medicine
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
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.grey[100],
                },
                '& .MuiDataGrid-cell': {
                  padding: '8px',
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

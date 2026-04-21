import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { IconEye, IconRestore, IconSearch, IconTrash } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { URLS } from 'src/Url';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Deleted Service Providers' }];

const DeletedServiceProvider = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData?.rolesAndPermission?.[0] || {};
  const token = authData?.token || '';

  const getData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetDeletedProviders,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data?.activeproviders || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch deleted providers');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      `${item.firstName || ''} ${item.lastName || ''}`.toLowerCase().includes(q) ||
      `${item.phone || ''}`.toLowerCase().includes(q) ||
      `${item.email || ''}`.toLowerCase().includes(q),
    );
  }, [data, search]);

  const handleView = (row) => {
    localStorage.setItem('providerId', row._id);
    navigate('/view-provider');
  };

  const handleRestore = async (row) => {
    if (!token) return;
    try {
      await axios.put(`${URLS.RestoreProvider}/${row._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Provider restored successfully');
      getData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to restore provider');
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm('Are you sure you want to permanently delete this provider?')) return;
    if (!token) return;
    try {
      await axios.delete(`${URLS.DeleteProvider}/${row._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Provider deleted permanently');
      getData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete provider');
    }
  };

  const columns = [
    {
      field: 'sno',
      headerName: 'S.No',
      width: 80,
      resizable: false,
      renderCell: (params) => params.api.getSortedRowIds().indexOf(params.id) + 1,
    },
    {
      field: 'provider',
      headerName: 'Provider',
      width: 250,
      resizable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar src={params.row.image ? `${URLS.FileBase}${params.row.image}` : ''} />
          <Typography variant="body2" sx={{ fontSize: '0.82rem' }}>
            {`${params.row.firstName || ''} ${params.row.lastName || ''}`.trim() || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150,
      resizable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      resizable: false,
    },
    {
      field: 'deleted',
      headerName: 'Status',
      width: 130,
      resizable: false,
      renderCell: (params) => (
        <Box
          sx={{ 
            backgroundColor: '#ff3333', 
            color: 'white',
            px: 2,
            py: 0.5,
            minWidth: '80px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8125rem',
            fontWeight: 500,
            gap: 1
          }}
        >
          <IconTrash size={14} />
          Delete
        </Box>
      ),
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 250,
      resizable: false,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {(rolesAndPermission.all_providers_view || rolesAndPermission.accessAll) && (
            <Button
              size="small"
              variant="contained"
              color="info"
              sx={{ px: 2, py: 0.5, minWidth: '80px' }}
              startIcon={<IconEye size={14} />}
              onClick={() => handleView(params.row)}
            >
              View
            </Button>
          )}
          {(rolesAndPermission.all_providers_edit || rolesAndPermission.accessAll) && (
            <Button
              size="small"
              color="success"
              variant="contained"
              sx={{ px: 2, py: 0.5, minWidth: '80px' }}
              startIcon={<IconRestore size={14} />}
              onClick={() => handleRestore(params.row)}
            >
              Restore
            </Button>
          )}
        </Box>
      ),
    },
  ];

  return (
    <PageContainer title="Deleted Service Providers">
      <Breadcrumb title="Deleted Service Providers" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2} gap={2}>
          <Typography variant="h6">Deleted Service Providers</Typography>
          <TextField
            size="small"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <IconSearch size={16} style={{ marginRight: 8 }} /> }}
          />
        </Box>
        <Divider />
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <DataGrid
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row._id}
            loading={loading}
            autoHeight
            pageSizeOptions={[10, 20, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
            disableColumnMenu
            sx={{
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.grey[50],
              },
            }}
          />
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default DeletedServiceProvider;

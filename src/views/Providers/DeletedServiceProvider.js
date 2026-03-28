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

  const columns = [
    {
      field: 'sno',
      headerName: 'S.No',
      width: 70,
      renderCell: (params) => params.api.getSortedRowIds().indexOf(params.id) + 1,
    },
    {
      field: 'provider',
      headerName: 'Provider',
      flex: 1.4,
      minWidth: 220,
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
      minWidth: 140,
      flex: 0.7,
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'deleted',
      headerName: 'Status',
      width: 110,
      renderCell: () => (
        <Chip label="Deleted" size="small" color="error" variant="outlined" icon={<IconTrash size={14} />} />
      ),
    },
    {
      field: 'action',
      headerName: 'Actions',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {(rolesAndPermission.all_providers_view || rolesAndPermission.accessAll) && (
            <Button
              size="small"
              variant="outlined"
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
        <CardContent>
          <DataGrid
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row._id}
            loading={loading}
            autoHeight
            pageSizeOptions={[10, 20, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
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

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  TextField,
  Paper,
  Box,
  Button,
  Divider,
  CardContent,
  Typography,
  Chip,
} from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from 'src/Url';
import axios from 'axios';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Roles' }];

// Utility to get auth token
const getAuthToken = () => JSON.parse(localStorage.getItem('user'))?.token || '';

const Roles = () => {
  const theme = useTheme();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState({ fetch: false, submit: false, delete: false });

  const token = getAuthToken();
  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0]


  const navigate = useNavigate();

  const handleAddPopUp = () => {
    navigate('/access-control/addrole');
  };

  const handleEditPopUp = (data) => {
    localStorage.setItem('RoleId', data._id);
    navigate('/access-control/editrole');
  };

  const handleDelete = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (!window.confirm('Do you really want to delete this Roles?')) return;

    setIsLoading((prev) => ({ ...prev, delete: true }));
    try {
      const res = await axios.delete(`${URLS.DeleteRole}/${data._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        toast.success(res.data.message || 'Vendor deleted successfully');
        await getData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete vendor');
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setIsLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const res = await axios.post(
        URLS.GetRoles,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.roles || []);
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
    return data.filter((item) => `${item.roleName}`.toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      { field: 'roleName', headerName: 'Department / Role Name', flex: 1, minWidth: 150 },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => (
          <Chip
            label={params.row.status ? 'Active' : 'Inactive'}
            size="small"
            color={params.row.status ? 'primary' : 'error'}
            variant="outlined"
          />
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        minWidth: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            {rolesAndPermission.department_roles_edit === true || rolesAndPermission.accessAll === true ? <>
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={() => handleEditPopUp(params.row)}
                sx={{ minWidth: '32px', padding: '4px 6px' }}
                aria-label={`Edit ${params.row.name}`}
              >
                <IconEdit stroke={1.5} size={18} />
              </Button></> : <></>}

            {rolesAndPermission.department_roles_delete === true || rolesAndPermission.accessAll === true ? <>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => handleDelete(params.row)}
                sx={{ minWidth: '32px', padding: '4px 6px' }}
                aria-label={`Delete ${params.row.name}`}
              >
                <IconTrash stroke={1.5} size={18} />
              </Button></> : <></>}
          </Box>
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
    <PageContainer title="Roles" description="Manage Roles for your e-commerce platform">
      <Breadcrumb title="Roles" items={BCrumb} />
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
          <Typography variant="h6">Roles List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: theme.palette.background.paper }}
              aria-label="Search Roles by name"
            /> {rolesAndPermission.department_roles_add === true || rolesAndPermission.accessAll === true ? <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddPopUp}
                disabled={isLoading.submit}
                startIcon={<IconPlus size={20} />}
                aria-label="Create New Vendor"
              >
                Create Role
              </Button></> : <></>}
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowHeight={40}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default Roles;

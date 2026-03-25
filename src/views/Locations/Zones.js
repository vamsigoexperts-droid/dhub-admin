import React, { useState, useEffect, useMemo } from 'react';
import { TextField, Paper, Box, Divider, CardContent } from '@mui/material';
import { IconPlus, IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import { URLS } from '../../Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Zones' }];

const Zones = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const [stores, setStores] = useState([]);
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

  const handleAddPopUp = () => {
    navigate('/locations/addzone');
  };

  const handleEditPopUp = (data) => {
    localStorage.setItem('zoneId', data._id);
    navigate('/locations/editzone');
  };

  const handleView = (data) => {
    localStorage.setItem('zoneId', data._id);
    navigate(`/locations/viewzone`);
  };

  const getStores = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetZones,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const zones = res.data.zones;
      setStores(zones);
    } catch (error) {
      toast.error('Failed to fetch Zones.');
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item) => {
    if (window.confirm('Do you really want to delete this state?')) {
      axios
        .delete(`${URLS.DeleteZone}${item._id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          toast.success(res.data.message);
          getStores();
        })
        .catch((err) => toast.error(err.response?.data?.message || 'Delete failed'));
    }
  };

  useEffect(() => {
    getStores();
  }, [token]);

  useEffect(() => {
    const filtered = stores.filter((store) => {
      if (!search) return true;

      const searchLower = search.toLowerCase();
      return (
        store.name?.toLowerCase().includes(searchLower) ||
        store.serviceName?.toLowerCase().includes(searchLower) ||
        store.phone?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredData(filtered);
  }, [stores, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

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
        field: 'name',
        headerName: 'Zone Name',
        flex: 1,
      },
      {
        field: 'cityName',
        headerName: 'City Name',
        flex: 1,
      },
      {
        field: 'stateName',
        headerName: 'State Name',
        flex: 1,
      },
      {
        field: 'countryName',
        headerName: 'Country Name',
        flex: 1,
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1.2,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1} alignItems="center" sx={{ padding: '4px 6px' }}>
            {rolesAndPermission.zones_edit === true || rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleEditPopUp(params.row)}
                  disabled={loading}
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  aria-label={`Edit ${params.row.name}`}
                >
                  <IconEdit stroke={1.5} size={18} />
                </Button>
              </>
            ) : (
              <></>
            )}
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={() => handleView(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`View ${params.row.name}`}
            >
              <IconEye stroke={1.5} size={18} />
            </Button>
            {rolesAndPermission.zones_delete === true || rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleDelete(params.row)}
                  disabled={loading}
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
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
    () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
    [filteredData],
  );

  return (
    <PageContainer title="Zone Page" description="Manage Zones for your e-commerce platform">
      <Breadcrumb title="Zones Management" items={BCrumb} />
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
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search Zone Name..."
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Zone Name"
            />
            {rolesAndPermission.zones_add === true || rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create New Zone"
                >
                  Create Zone
                </Button>
              </>
            ) : (
              <></>
            )}
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%', minHeight: 400 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default Zones;

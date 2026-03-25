import React, { useState, useEffect, useMemo } from 'react';
import { TextField, Avatar, Paper, Box, Typography, Divider, CardContent } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { IconPlus, IconEdit, IconTrash, IconEye, IconTablePlus } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import { URLS } from '../../Url';
import axios from 'axios';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'On Demand Service' }];

// Main On Demand Service
const OnDemandService = () => {
  const theme = useTheme();

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const handleAddPopUp = () => {
    navigate('/ondemandservice/addondemandservice');
  };

  const handleEditPopUp = (data) => {
    navigate('/ondemandservice/editondemandservice');
    localStorage.setItem('DemandServicesId', data._id);
  };

  const handleRatePopUp = (data) => {
    navigate('/ondemandservice/ondemandservicerates');
    localStorage.setItem('DemandServicesId', data._id);
  };

  const handleViewPopUp = (data) => {
    navigate('/ondemandservice/viewondemandservice');
    localStorage.setItem('DemandServicesId', data._id);
  };

  const handleDelete = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm('Do you really want to delete this On Demand Sevice?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeletOnDemandSevice}/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          getData();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetOnDemandSevice,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.ondemandservices || []);
    } catch (error) {
      toast.error('Failed to fetch On Demand services.');
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (search === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [data, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'sectionInfo',
        headerName: 'Name',
        flex: 0.5,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src={URLS.FileBase + params.row.mainImage}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">{params.row.name}</Typography>
          </Box>
        ),
      },
      {
        field: 'categoryName',
        headerName: 'Category',
        flex: 1,
      },
      {
        field: 'subcategoryName',
        headerName: 'Sub Category',
        flex: 1,
      },
      {
        field: 'childcategoryName',
        headerName: 'Child Category',
        flex: 1,
      },
   {
  field: 'action',
  headerName: 'Action',
  flex: 2,
  sortable: false,
  filterable: false,
  renderCell: (params) => (
    <Box display="flex" gap={1} alignItems="center">
      
      {(rolesAndPermission.on_demand_service_edit || rolesAndPermission.accessAll) && (
        <Button
          variant="text"
          size="small"
          color="primary"
          startIcon={<IconEdit size={16} />}
          onClick={() => handleEditPopUp(params.row)}
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontFamily: 'Poppins',
            fontSize: '13px',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Edit
        </Button>
      )}

      {(rolesAndPermission.on_demand_service_edit || rolesAndPermission.accessAll) && (
        <Button
          variant="text"
          size="small"
          color="warning"
          startIcon={<IconTablePlus size={16} />}
          onClick={() => handleRatePopUp(params.row)}
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontFamily: 'Poppins',
            fontSize: '13px',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Rate
        </Button>
      )}

      <Button
        variant="text"
        size="small"
        color="secondary"
        startIcon={<IconEye size={16} />}
        onClick={() => handleViewPopUp(params.row)}
        disabled={loading}
        sx={{
          textTransform: 'none',
          fontFamily: 'Poppins',
          fontSize: '13px',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        View
      </Button>

      {(rolesAndPermission.on_demand_service_delete || rolesAndPermission.accessAll) && (
        <Button
          variant="text"
          size="small"
          color="error"
          startIcon={<IconTrash size={16} />}
          onClick={() => handleDelete(params.row)}
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontFamily: 'Poppins',
            fontSize: '13px',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Delete
        </Button>
      )}

    </Box>
  ),
}
,
    ],
    [loading],
  );

  const rows = useMemo(
    () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
    [filteredData],
  );

  return (
    <PageContainer
      title="Store Page"
      description="Manage On Demand Service for your e-commerce platform"
    >
      <Breadcrumb title="On Demand Service" items={BCrumb} />
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
          <Typography variant="h6">On Demand Service List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search On Demand Service"
            />{' '}
            {rolesAndPermission.on_demand_service_add === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create New On Demand Service"
                >
                  Create On Demand Service
                </Button>{' '}
              </>
            ) : (
              <></>
            )}
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

export default OnDemandService;

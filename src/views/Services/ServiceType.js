import React, { useState, useEffect } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Card,
  CardContent,
  Divider,
  Box,
  Button,
  CardHeader,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Service Type' }];

function ServiceType() {
  const authData = JSON.parse(localStorage.getItem('user'));
  const token = authData?.token;

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ name: '', cityId: [] });
  const [formEdit, setFormEdit] = useState({ name: '', cityId: [], _id: '' });
  const [data, setData] = useState([]);
  const [City, SetCity] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setFormEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e) => {
    setForm((prev) => ({ ...prev, cityId: e.target.value }));
  };

  const handleEditCityChange = (e) => {
    setFormEdit((prev) => ({ ...prev, cityId: e.target.value }));
  };

  const handleAddPopup = () => {
    setShowAdd(!showAdd);
    setShowEdit(false);
    scrollToTop();
  };

  const handleEditPopUp = (rowData) => {
    setFormEdit({ ...rowData });
    setShowAdd(false);
    setShowEdit(true);
    scrollToTop();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: form.name,
      cityId: form.cityId,
    };
    axios
      .post(URLS.AddServiceType, formData, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        toast.success(res.data.message);
        resetForm();
        getData();
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Add failed'));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: formEdit.name,
      cityId: formEdit.cityId,
    };
    axios
      .put(`${URLS.EditServiceType}${formEdit._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success(res.data.message);
        resetForm();
        getData();
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Edit failed'));
  };

  const handleDelete = (item) => {
    if (window.confirm('Do you really want to delete?')) {
      axios
        .delete(`${URLS.DeleteServiceType}${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast.success(res.data.message);
          getData();
        })
        .catch((err) => toast.error(err.response?.data?.message || 'Delete failed'));
    }
  };

  const getData = () => {
    setLoading(true);
    axios
      .post(URLS.GetServiceType, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data.servicetypes || []))
      .catch(() => toast.error('Failed to fetch services'))
      .finally(() => setLoading(false));
  };

  const getCity = () => {
    setLoading(true);
    axios
      .post(URLS.GetCity, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => SetCity(res.data.city || []))
      .catch(() => toast.error('Failed to fetch cities'))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ name: '', cityId: [] });
    setFormEdit({ name: '', cityId: [], _id: '' });
    setShowAdd(false);
    setShowEdit(false);
  };

  useEffect(() => {
    getData();
    getCity();
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

  const columns = [
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
    { field: 'name', headerName: 'Service Name', flex: 1 },
    { field: 'cityName', headerName: 'Cities', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
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
          {/* <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => handleDelete(params.row)}
            disabled={loading}
            sx={{ minWidth: '32px', padding: '4px 6px' }}
            aria-label={`Delete ${params.row.name}`}
          >
            <IconTrash stroke={1.5} size={18} />
          </Button> */}
        </Box>
      ),
    },
  ];

  const rows = filteredData.map((item) => ({ id: item._id, ...item }));

  return (
    <PageContainer title="Service Type" description="this is Service Type page">
      <Breadcrumb title="Service Type" items={BCrumb} />

      {/* Add Section */}
      {showAdd && (
        <form onSubmit={handleAddSubmit}>
          <ParentCard title="Create Section">
            <Grid container rowSpacing={3}>
              <Grid item xs={6} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Service Name</CustomFormLabel>
                <CustomTextField
                  placeholder="Service Name"
                  id="name"
                  name="name"
                  value={form.name}
                  required
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={6} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="cityId">Select City</CustomFormLabel>
                <TextField
                  select
                  SelectProps={{ multiple: true, value: form.cityId, onChange: handleCityChange }}
                  id="cityId"
                  name="cityId"
                  fullWidth
                  required
                >
                  {City.map((city) => (
                    <MenuItem key={city._id} value={city._id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ float: 'right', py: 1 }}>
              <Button
                variant="contained"
                color="error"
                sx={{ mr: 1 }}
                onClick={() => setShowAdd(false)}
              >
                Close
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </ParentCard>
        </form>
      )}

      {/* Edit Section */}
      {showEdit && (
        <form onSubmit={handleEditSubmit}>
          <ParentCard title="Edit Section">
            <Grid container rowSpacing={3}>
              <Grid item xs={6} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Service Name</CustomFormLabel>
                <CustomTextField
                  placeholder="Service Name"
                  id="name"
                  name="name"
                  value={formEdit.name}
                  required
                  fullWidth
                  onChange={handleEditInputChange}
                />
              </Grid>

              <Grid item xs={6} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="cityId">Select City</CustomFormLabel>
                <TextField
                  select
                  SelectProps={{
                    multiple: true,
                    value: formEdit.cityId,
                    onChange: handleEditCityChange,
                  }}
                  id="cityId"
                  name="cityId"
                  fullWidth
                  required
                >
                  {City.map((city) => (
                    <MenuItem key={city._id} value={city._id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ float: 'right', py: 1 }}>
              <Button
                variant="contained"
                color="error"
                sx={{ mr: 1 }}
                onClick={() => setShowEdit(false)}
              >
                Close
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </ParentCard>
        </form>
      )}

      {/* List Section */}
      <Card sx={{ padding: 0, mt: 3 }} elevation={9} variant="outlined">
        <CardHeader
          title="Service Type List"
          action={
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <TextField
                size="small"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {/* <Button variant="contained" color="primary" onClick={handleAddPopup}>
                <IconPlus /> Create Section
              </Button> */}
            </Box>
          }
          sx={{ pb: 2, pt: 2, px: 2, alignItems: 'center' }}
        />
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
      </Card>
      <ToastContainer />
    </PageContainer>
  );
}

export default ServiceType;

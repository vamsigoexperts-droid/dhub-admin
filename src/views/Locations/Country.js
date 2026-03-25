import React, { useState, useEffect } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import ParentCard from '../../components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
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
  styled,
  Select,
  Chip,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Country' }];

// Styled Components
const CustomSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
}));

function Country() {
  const authData = JSON.parse(localStorage.getItem('user'));
  const token = authData?.token;

  const rolesAndPermission = authData.rolesAndPermission[0];

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    name: '',
    currencyName: '',
    currencySymbol: '',
    currencyRate: '',
    countryCode: '',
  });
  const [formEdit, setFormEdit] = useState({
    _id: '',
    name: '',
    currencyName: '',
    currencySymbol: '',
    currencyRate: '',
    countryCode: '',
  });
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEditInputChange = (e) =>
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });

  const handleAddPopup = () => {
    setShowAdd(!showAdd);
    setShowEdit(false);
    scrollToTop();
  };

  const handleEditPopup = (rowData) => {
    setFormEdit(rowData);
    setShowAdd(false);
    setShowEdit(true);
    scrollToTop();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: form.name,
      currencyName: form.currencyName,
      currencySymbol: form.currencySymbol,
      countryCode: form.countryCode,
      currencyRate: form.currencyRate,
    };
    axios
      .post(URLS.AddCountry, formData, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        toast(res.data.message);
        resetForm();
        getData();
      })
      .catch((err) => toast(err.response?.data?.message || 'Add failed'));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: formEdit.name,
      currencyName: formEdit.currencyName,
      currencySymbol: formEdit.currencySymbol,
      countryCode: formEdit.countryCode,
      currencyRate: formEdit.currencyRate,
      status: formEdit.status,
    };

    axios
      .put(`${URLS.EditCountry}${formEdit._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast(res.data.message);
        resetForm();
        getData();
      })
      .catch((err) => toast(err.response?.data?.message || 'Edit failed'));
  };

  const handleDelete = (item) => {
    if (window.confirm('Do you really want to delete?')) {
      axios
        .delete(`${URLS.DeleteCountry}${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast(res.data.message);
          getData();
        })
        .catch((err) => toast(err.response?.data?.message || 'Delete failed'));
    }
  };

  const getData = () => {
    setLoading(true);
    axios
      .post(URLS.GetCountry, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data.country || []))
      .catch((err) => toast('Failed to fetch country'))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ name: '', currencyName: '', currencySymbol: ' ', countryCode: '', currencyRate: '' });
    setFormEdit({
      name: '',
      _id: '',
      currencyName: '',
      currencySymbol: ' ',
      countryCode: '',
      currencyRate: '',
    });
    setShowAdd(false);
    setShowEdit(false);
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
    { field: 'countryCode', headerName: 'Country Code', flex: 1 },
    { field: 'name', headerName: 'Country Name', flex: 1 },
    { field: 'currencyName', headerName: 'Currency Name', flex: 1 },
    { field: 'currencySymbol', headerName: 'Currency Symbol', flex: 1 },
    { field: 'currencyRate', headerName: 'Currency Rate', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.row.status == 'active' ? 'Active' : 'inactive'}
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
          {rolesAndPermission.country_edit === true || rolesAndPermission.accessAll === true ? (
            <>
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={() => handleEditPopup(params.row)}
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
          {rolesAndPermission.country_delete === true || rolesAndPermission.accessAll === true ? (
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
  ];

  const rows = filteredData.map((item) => ({ id: item._id, ...item }));

  return (
    <PageContainer title="Country" description="this is Country page">
      <Breadcrumb title="Country" items={BCrumb} />
      {/* Add Section */}
      {showAdd && (
        <form onSubmit={handleAddSubmit}>
          <ParentCard title="Create Section" sx={{ overflowX: 'hidden' }}>
            <Grid container rowSpacing={3}>
              <Grid item xs={2} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Country Code</CustomFormLabel>
                <CustomTextField
                  placeholder="Enter Country Code"
                  id="countryCode"
                  name="countryCode"
                  value={form.countryCode}
                  required
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={2} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Country Name</CustomFormLabel>
                <CustomTextField
                  placeholder="Enter Country Name"
                  id="name"
                  name="name"
                  value={form.name}
                  required
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={2} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Currency Name </CustomFormLabel>
                <CustomTextField
                  placeholder="Enter Currency Name"
                  id="currencyName"
                  name="currencyName"
                  value={form.currencyName}
                  required
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={2} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Currency Symbol</CustomFormLabel>
                <CustomTextField
                  placeholder="Enter Currency Symbol"
                  id="currencySymbol"
                  name="currencySymbol"
                  value={form.currencySymbol}
                  required
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={2} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Currency Rate</CustomFormLabel>
                <CustomTextField
                  type="number"
                  placeholder="Enter Currency Rate"
                  id="currencyRate"
                  name="currencyRate"
                  value={form.currencyRate}
                  required
                  fullWidth
                  onChange={handleInputChange}
                />
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
        <form onSubmit={handleEditSubmit} sx={{ overflowX: 'hidden' }}>
          <ParentCard title="Edit Section">
            <Grid container rowSpacing={3}>
              <Grid item xs={2} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Country Code</CustomFormLabel>
                <CustomTextField
                  placeholder="Enter Country Code"
                  id="countryCode"
                  name="countryCode"
                  value={formEdit.countryCode}
                  required
                  fullWidth
                  onChange={handleEditInputChange}
                />
              </Grid>
              <Grid item xs={2} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Country Name</CustomFormLabel>
                <CustomTextField
                  placeholder="Country Name"
                  id="name"
                  name="name"
                  value={formEdit.name}
                  required
                  fullWidth
                  onChange={handleEditInputChange}
                />
              </Grid>
              <Grid item xs={2} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Currency Name </CustomFormLabel>
                <CustomTextField
                  placeholder="Enter Currency Name"
                  id="currencyName"
                  name="currencyName"
                  value={formEdit.currencyName}
                  required
                  fullWidth
                  onChange={handleEditInputChange}
                />
              </Grid>
              <Grid item xs={2} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Currency Symbol</CustomFormLabel>
                <CustomTextField
                  placeholder="Enter Currency Symbol"
                  id="currencySymbol"
                  name="currencySymbol"
                  value={formEdit.currencySymbol}
                  required
                  fullWidth
                  onChange={handleEditInputChange}
                />
              </Grid>
              <Grid item xs={2} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Currency Rate</CustomFormLabel>
                <CustomTextField
                  placeholder="Enter Currency Rate"
                  id="currencyRate"
                  name="currencyRate"
                  value={formEdit.currencyRate}
                  required
                  fullWidth
                  onChange={handleInputChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={2} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="status">Status</CustomFormLabel>
                <CustomSelect
                  id="status"
                  name="status"
                  value={formEdit.status}
                  onChange={handleEditInputChange}
                  fullWidth
                >
                  <MenuItem value="">Select Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">InActive</MenuItem>
                </CustomSelect>
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
      <Card sx={{ padding: 0, mt: 3 }} elevation={9} variant="outlined">
        <CardHeader
          title="Country List"
          action={
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <TextField
                size="small"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {rolesAndPermission.country_add === true || rolesAndPermission.accessAll === true ? (
                <>
                  <Button variant="contained" color="primary" onClick={handleAddPopup}>
                    <IconPlus /> Create Section
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Box>
          }
          sx={{
            pb: 2,
            pt: 2,
            px: 2,
            alignItems: 'center',
          }}
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

export default Country;

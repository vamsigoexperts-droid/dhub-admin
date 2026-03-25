import React, { useState, useEffect } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../components/forms/theme-elements/CustomSelect';
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
  Typography,
  CircularProgress,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Sub Shop Variation' }];

function SubShopVariation() {
  const authData = JSON.parse(localStorage.getItem('user'));
  const token = authData?.token;
  const rolesAndPermission = authData.rolesAndPermission[0];

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ name: '', shopVariationId: '' });
  const [formEdit, setFormEdit] = useState({ name: '', shopVariationId: '', _id: '' });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [Country, setCountry] = useState([]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleInputChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditInputChange = (e) =>
    setFormEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleAddForm = () => {
    resetForm();
    setShowAdd((prev) => !prev);
    setShowEdit(false);
    scrollToTop();
  };

  const handleEditPopUp = (rowData) => {
    setFormEdit(rowData);
    setShowAdd(false);
    setShowEdit(true);
    scrollToTop();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    console.log('form', form);
    axios
      .post(URLS.addSubShoppingVariation, form, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        toast.success(res.data.message);
        resetForm();
        fetchStates();
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Add failed'));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const { _id, ...payload } = formEdit;
    axios
      .put(`${URLS.editSubShoppingVariation}${_id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success(res.data.message);
        resetForm();
        fetchStates();
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Edit failed'));
  };

  const handleDelete = (item) => {
    if (window.confirm('Do you really want to delete this sub-shop variation ?')) {
      axios
        .delete(`${URLS.deleteSubShoppingVariation}${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast.success(res.data.message);
          fetchStates();
        })
        .catch((err) => toast.error(err.response?.data?.message || 'Delete failed'));
    }
  };

  const fetchStates = () => {
    setLoading(true);
    axios
      .post(URLS.getSubShoppingVariation, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data.subVariations || []))
      .catch(() => toast.error('Failed to fetch sub-shop variations'))
      .finally(() => setLoading(false));
  };

  const fetchCountries = () => {
    axios
      .post(
        URLS.getAllShoppingVariation,
        { flagType: 'shopping' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setCountry(res.data.variations || []))
      .catch(() => toast.error('Failed to fetch variation'));
  };

  const resetForm = () => {
    setForm({ name: '', shopVariationId: '' });
    setFormEdit({ name: '', shopVariationId: '', _id: '' });
    setShowAdd(false);
    setShowEdit(false);
  };

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!search) setFilteredData(data);
    else {
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
    { field: 'name', headerName: 'sub-shop variation', flex: 1 },
    { field: 'variationName', headerName: 'Variation', flex: 1 },
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
          {rolesAndPermission.sub_shop_variations_edit === true ||
          rolesAndPermission.accessAll === true ? (
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
          {rolesAndPermission.sub_shop_variations_delete === true ||
          rolesAndPermission.accessAll === true ? (
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
    <PageContainer title="sub-shop variation" description="Manage sub-shop variation">
      <Breadcrumb title="sub-shop variation" items={BCrumb} />

      {/* Add / Edit Form */}
      {(showAdd || showEdit) && (
        <form onSubmit={showAdd ? handleAddSubmit : handleEditSubmit}>
          <ParentCard
            title={showAdd ? 'Create sub-shop variation' : 'Edit sub-shop variation'}
            sx={{ overflowX: 'hidden' }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <CustomFormLabel htmlFor="shopVariationId">Varient</CustomFormLabel>
                <CustomSelect
                  id="shopVariationId"
                  name="shopVariationId"
                  value={showAdd ? form.shopVariationId : formEdit.shopVariationId}
                  onChange={showAdd ? handleInputChange : handleEditInputChange}
                  fullWidth
                  required
                >
                  {Country.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomFormLabel htmlFor="name">Sub-Variation Name</CustomFormLabel>
                <CustomTextField
                  id="name"
                  name="name"
                  value={showAdd ? form.name : formEdit.name}
                  placeholder="Enter sub-shop-variation Name"
                  fullWidth
                  required
                  onChange={showAdd ? handleInputChange : handleEditInputChange}
                />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" color="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </ParentCard>
        </form>
      )}

      {/* List */}
      <Card sx={{ mt: 3 }} elevation={3}>
        <CardHeader
          title={<Typography variant="h6">Sub-Shop Variation List</Typography>}
          action={
            <Box display="flex" gap={2}>
              <TextField
                size="small"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {rolesAndPermission.sub_shop_variations_add === true ||
              rolesAndPermission.accessAll === true ? (
                <>
                  <Button variant="contained" startIcon={<IconPlus />} onClick={toggleAddForm}>
                    Create sub-shop variation
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Box>
          }
        />
        <Divider />
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              autoHeight
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          )}
        </CardContent>
      </Card>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </PageContainer>
  );
}

export default SubShopVariation;

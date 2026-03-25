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
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Type Of Product' }];

function ProductType() {
  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];
  const token = authData?.token;
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [formEdit, setFormEdit] = useState({ name: '', _id: '' });
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
    setLoading(true);
    const formData = {
      name: form.name,
      flagType: 'shopping',
      dropDownType: 'productType',
    };
    axios
      .post(URLS.AddShoppingDropDown, formData, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        toast.success(res.data.message);
        resetForm();
        getData();
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Add failed'))
      .finally(() => setLoading(false));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      name: formEdit.name,
      flagType: 'shopping',
      dropDownType: 'productType',
    };

    axios
      .put(`${URLS.EditShoppingDropDown}${formEdit._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success(res.data.message);
        resetForm();
        getData();
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Edit failed'))
      .finally(() => setLoading(false));
  };

  const handleDelete = (item) => {
    if (window.confirm('Do you really want to delete?')) {
      setLoading(true);
      axios
        .delete(`${URLS.DeleteShoppingDropDown}${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast.success(res.data.message);
          getData();
        })
        .catch((err) => toast.error(err.response?.data?.message || 'Delete failed'))
        .finally(() => setLoading(false));
    }
  };

  const getData = () => {
    setLoading(true);
    axios
      .post(
        URLS.GetShoppingDropDowns,
        { flagType: 'shopping', dropDownType: 'productType' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setData(res.data.ecommercedropdown || []))
      .catch((err) => toast.error('Failed to fetch Data'))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ name: '' });
    setFormEdit({ name: '', _id: '' });
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
        const rowIndex = filteredData.findIndex((row) => row._id === params.id);
        return rowIndex + 1;
      },
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
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
          {rolesAndPermission.product_type_edit === true ||
          rolesAndPermission.accessAll === true ? (
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
          {rolesAndPermission.product_type_delete === true ||
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
    <PageContainer title="Type Of Product" description="This is Type Of Product page">
      <Breadcrumb title="Type Of Product" items={BCrumb} />
      {showAdd && (
        <form onSubmit={handleAddSubmit}>
          <ParentCard title="Create Form" sx={{ overflowX: 'hidden' }}>
            <Grid container rowSpacing={3}>
              <Grid item xs={6} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
                <CustomTextField
                  placeholder="Name"
                  id="name"
                  name="name"
                  value={form.name}
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
                disabled={loading}
              >
                Close
              </Button>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
                Submit
              </Button>
            </Box>
          </ParentCard>
        </form>
      )}
      {showEdit && (
        <form onSubmit={handleEditSubmit}>
          <ParentCard title="Edit Form" sx={{ overflowX: 'hidden' }}>
            <Grid container rowSpacing={3}>
              <Grid item xs={6} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
                <CustomTextField
                  placeholder="Name"
                  id="name"
                  name="name"
                  value={formEdit.name}
                  required
                  fullWidth
                  onChange={handleEditInputChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ float: 'right', py: 1 }}>
              <Button
                variant="contained"
                color="error"
                sx={{ mr: 1 }}
                onClick={() => setShowEdit(false)}
                disabled={loading}
              >
                Close
              </Button>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
                Submit
              </Button>
            </Box>
          </ParentCard>
        </form>
      )}
      <Card sx={{ padding: 0, mt: 3 }} elevation={9} variant="outlined">
        <CardHeader
          title="Type Of Product List"
          action={
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <TextField
                size="small"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />{' '}
              {rolesAndPermission.product_type_add === true ||
              rolesAndPermission.accessAll === true ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddPopup}
                    disabled={loading}
                  >
                    <IconPlus /> Create Type Of Product
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
              autoHeight
            />
          </Box>
        </CardContent>
      </Card>
      <ToastContainer />
    </PageContainer>
  );
}

export default ProductType;

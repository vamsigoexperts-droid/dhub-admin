import React, { useState, useEffect } from 'react';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import ParentCard from '../../../components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../../Url';
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

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Brands' }];

function Brands() {
  const authData = JSON.parse(localStorage.getItem('user'));
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
    const formData = { name: form.name };
    axios
      .post(URLS.AddBrands, formData, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        toast(res.data.message || 'Brand created');
        resetForm();
        getData();
      })
      .catch((err) => toast(err.response?.data?.message || 'Add failed'));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = { name: formEdit.name };
    axios
      .put(`${URLS.EditBrands}/${formEdit._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast(res.data.message || 'Brand updated');
        resetForm();
        getData();
      })
      .catch((err) => toast(err.response?.data?.message || 'Edit failed'));
  };

  const handleDelete = (item) => {
    if (window.confirm('Do you really want to delete?')) {
      axios
        .delete(`${URLS.DeleteBrands}/${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast(res.data.message || 'Brand deleted');
          getData();
        })
        .catch((err) => toast(err.response?.data?.message || 'Delete failed'));
    }
  };

  const getData = () => {
    setLoading(true);
    axios
      .post(URLS.GetBrands, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        // FIX: your API returns "brands" (lowercase), not "Brands"
        const list = res.data?.brands ?? res.data?.Brands ?? [];
        setData(Array.isArray(list) ? list : []);
      })
      .catch(() => toast('Failed to fetch brands'))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredData(data);
    } else {
      const s = search.toLowerCase();
      setFilteredData(data.filter((item) => item.name?.toLowerCase().includes(s)));
    }
  }, [data, search]);

  // We'll define rows first so we can safely use it in renderers if needed
  const rows = filteredData;

  const columns = [
    {
      field: 'sno',
      headerName: 'S. No',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const api = params.api;
        // Try modern visible-rows index
        if (typeof api.getRowIndexRelativeToVisibleRows === 'function') {
          return api.getRowIndexRelativeToVisibleRows(params.id) + 1;
        }
        // Fallbacks for older versions
        if (typeof api.getRowIndex === 'function') {
          const idx = api.getRowIndex(params.id);
          if (typeof idx === 'number') return idx + 1;
        }
        if (typeof api.getAllRowIds === 'function') {
          const all = api.getAllRowIds();
          return all.indexOf(params.id) + 1;
        }
        // Last resort: compute from current rows in view
        const idx = rows.findIndex((r) => r._id === params.id || r.id === params.id);
        return idx + 1;
      },
    },
    { field: 'name', headerName: 'Brand Name', flex: 1, minWidth: 160 },
    { field: 'status', headerName: 'Status', flex: 0.7, minWidth: 120 },
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
            onClick={() => handleEditPopup(params.row)}
            disabled={loading}
            sx={{ minWidth: '32px', padding: '4px 6px' }}
            aria-label={`Edit ${params.row.name}`}
          >
            <IconEdit stroke={1.5} size={18} />
          </Button>
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
        </Box>
      ),
    },
  ];

  return (
    <PageContainer title="Brands" description="this is Brands page">
      <Breadcrumb title="Brands" items={BCrumb} />

      {/* Add Section */}
      {showAdd && (
        <form onSubmit={handleAddSubmit}>
          <ParentCard title="Create Brand" sx={{ overflowX: 'hidden' }}>
            <Grid container rowSpacing={3}>
              <Grid item xs={12} md={6} sx={{ p: 1 }}>
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
              <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <CustomFormLabel htmlFor="name">Category Name</CustomFormLabel>
                <CustomTextField
                  placeholder="Category Name"
                  id="name"
                  name="name"
                  value={form.name}
                  required
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <CustomFormLabel htmlFor="name">Sub Category Name</CustomFormLabel>
                <CustomTextField
                  placeholder="Sub Category Name"
                  id="name"
                  name="name"
                  value={form.name}
                  required
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <CustomFormLabel htmlFor="name">Field Name</CustomFormLabel>
                <CustomTextField
                  placeholder="Field Name"
                  id="name"
                  name="name"
                  value={form.name}
                  required
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <CustomFormLabel htmlFor="name">Field Type</CustomFormLabel>
                <CustomTextField
                  placeholder="Field Type"
                  id="name"
                  name="name"
                  value={form.name}
                  required
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <CustomFormLabel htmlFor="name">Description</CustomFormLabel>
                <CustomTextField
                  placeholder="Description"
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
          <ParentCard title="Edit Brand">
            <Grid container rowSpacing={3}>
              <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <CustomFormLabel htmlFor="name">Brand Name</CustomFormLabel>
                <CustomTextField
                  placeholder="Brand Name"
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

      <Card sx={{ p: 0, mt: 3 }} elevation={9} variant="outlined">
        <CardHeader
          title="Brands List"
          action={
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <TextField
                size="small"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddPopup}
                startIcon={<IconPlus />}
              >
                Create Brand
              </Button>
            </Box>
          }
          sx={{ pb: 2, pt: 2, px: 2, alignItems: 'center' }}
        />
        <Divider />
        <CardContent>
          <Box sx={{ width: '100%' }}>
            <DataGrid
              rows={rows}
              getRowId={(row) => row._id} // use backend _id directly
              columns={columns}
              loading={loading}
              initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
              pageSizeOptions={[5, 10, 20]} // works in MUI v6+
              rowHeight={38}
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

export default Brands;

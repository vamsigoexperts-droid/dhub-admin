import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  TextField,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  CardContent,
  Chip,
} from '@mui/material';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { DataGrid } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from 'src/components/shared/ParentCard';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import { URLS } from 'src/Url';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'CMSPages' }];

const CKEDITOR_CONFIG = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'strikethrough',
    'link',
    '|',
    'bulletedList',
    'numberedList',
    'blockQuote',
    'code',
    '|',
    'undo',
    'redo',
  ],
  placeholder: 'Type Terms & Conditions here...',
};

const AddCMSPagesForm = ({ onClose, onSubmit, loading }) => {
  const theme = useTheme();
  const [form, setForm] = useState({ pageName: '', pageSlug: '' });
  const [data, setData] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateSlug = (slug) => {
    const slugRegex = /^[a-z0-9-]+$/;
    return slugRegex.test(slug);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pageName) return toast.error('Page Name is required.');
    if (!form.pageSlug) return toast.error('Page Slug is required.');
    if (!validateSlug(form.pageSlug)) return toast.error('Page Slug must be lowercase, alphanumeric, and use hyphens only.');
    if (!data) return toast.error('Page Description is required.');
    const formData = {
      pageName: form.pageName,
      pageSlug: form.pageSlug,
      pageDescription: data,
    };
    onSubmit(formData);
  };

  return (
    <Box py={1}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Create CMS Pages" sx={{ boxShadow: theme.shadows[4], borderRadius: 2 }}>
          <Grid container spacing={2} p={2}>
            <Grid item xs={6}>
              <CustomFormLabel required>Page Name</CustomFormLabel>
              <CustomTextField
                placeholder="Enter Page Name"
                onChange={handleChange}
                value={form.pageName}
                name="pageName"
                type="text"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <CustomFormLabel required>Page Slug</CustomFormLabel>
              <CustomTextField
                placeholder="Enter Page slug (e.g., about-us)"
                onChange={handleChange}
                value={form.pageSlug}
                name="pageSlug"
                type="text"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel required>Page Description</CustomFormLabel>
              <CKEditor
                editor={ClassicEditor}
                data={data}
                onChange={(event, editor) => setData(editor.getData())}
                config={CKEDITOR_CONFIG}
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="flex-end" gap={1} p={2}>
            <Button variant="outlined" color="error" onClick={onClose} disabled={loading}>
              Close
            </Button>
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

const EditCMSPagesForm = ({ onClose, onSubmit, initialData, loading }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    pageName: initialData?.pageName || '',
    pageSlug: initialData?.pageSlug || '',
  });
  const [data, setData] = useState(initialData?.pageDescription || '');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateSlug = (slug) => {
    const slugRegex = /^[a-z0-9-]+$/;
    return slugRegex.test(slug);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pageName) return toast.error('Page Name is required.');
    if (!form.pageSlug) return toast.error('Page Slug is required.');
    if (!validateSlug(form.pageSlug)) return toast.error('Page Slug must be lowercase, alphanumeric, and use hyphens only.');
    if (!data) return toast.error('Page Description is required.');
    const formData = {
      pageName: form.pageName,
      pageSlug: form.pageSlug,
      pageDescription: data,
    };
    onSubmit(formData, initialData._id);
  };

  return (
    <Box py={1}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Edit CMS Pages" sx={{ boxShadow: theme.shadows[4], borderRadius: 2 }}>
          <Grid container spacing={2} p={2}>
            <Grid item xs={6}>
              <CustomFormLabel required>Page Name</CustomFormLabel>
              <CustomTextField
                placeholder="Enter Page Name"
                onChange={handleChange}
                value={form.pageName}
                name="pageName"
                type="text"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <CustomFormLabel required>Page Slug</CustomFormLabel>
              <CustomTextField
                placeholder="Enter Page slug (e.g., about-us)"
                onChange={handleChange}
                value={form.pageSlug}
                name="pageSlug"
                type="text"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel required>Page Description</CustomFormLabel>
              <CKEditor
                editor={ClassicEditor}
                data={data}
                onChange={(event, editor) => setData(editor.getData())}
                config={CKEDITOR_CONFIG}
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="flex-end" gap={1} p={2}>
            <Button variant="outlined" color="error" onClick={onClose} disabled={loading}>
              Close
            </Button>
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

const CMSPages = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.token) {
        toast.error('No authentication token found. Please log in.');
        return '';
      }
      return user.token;
    } catch (error) {
      toast.error('Failed to retrieve authentication token.');
      return '';
    }
  }, []);

  const handleAddPopUp = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setEditData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditPopUp = (data) => {
    setShowEditForm(true);
    setShowAddForm(false);
    setEditData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditData(null);
  };

  const handleSubmit = async (formData, id) => {
    if (!token) return toast.error('Authentication token missing.');

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = id
        ? await axios.put(`${URLS.EditCMSPages}/${id}`, formData, config)
        : await axios.post(URLS.AddCMSPages, formData, config);

      toast.success(res.data.message);
      handleCloseForm();
      await getData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    if (!token) return toast.error('Authentication token missing.');
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      const res = await axios.delete(`${URLS.DeleteCMSPages}/${row._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message);
      await getData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete.');
    } finally {
      setLoading(false);
    }
  };

  const getData = async () => {
    if (!token) return toast.error('Authentication token missing.');

    const controller = new AbortController();
    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetCMSPages,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        },
      );
      setData(res.data.cmspage || []);
    } catch (error) {
      if (error.name === 'AbortError') return;
      toast.error('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  };

  useEffect(() => {
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const filtered = search
      ? data.filter((item) => item.pageName.toLowerCase().includes(search.toLowerCase()))
      : data;
    setFilteredData(filtered);
  }, [search, data]);

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
      {
        field: 'pageName',
        headerName: 'Page Name',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'pageSlug',
        headerName: 'Page Slug',
        flex: 1,
        minWidth: 150,
      },
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
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleEditPopUp(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Edit ${params.row.pageName}`}
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
              aria-label={`Delete ${params.row.pageName}`}
            >
              <IconTrash stroke={1.5} size={18} />
            </Button>
          </Box>
        ),
      },
    ],
    [loading],
  );

  const rows = useMemo(
    () => filteredData.map((item) => ({ ...item, id: item._id })),
    [filteredData],
  );

  return (
    <PageContainer title="CMSPages" description="Manage your CMSPages">
      <Breadcrumb title="CMSPages" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      {showAddForm && (
        <AddCMSPagesForm onClose={handleCloseForm} onSubmit={handleSubmit} loading={loading} />
      )}
      {showEditForm && (
        <EditCMSPagesForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          loading={loading}
        />
      )}
      <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Typography variant="h6">CMS Pages List</Typography>
          <Box display="flex" gap={2}>
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              startIcon={<IconPlus size={18} />}
              disabled={loading}
            >
              Create
            </Button>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pagination
              paginationMode="client"
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5, page: 0 },
                },
              }}
              autoHeight
              disableSelectionOnClick
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default CMSPages;
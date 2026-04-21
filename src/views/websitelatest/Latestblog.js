import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, Box, Typography, Grid, Divider, Paper, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, MenuItem } from '@mui/material';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomCKEditor from '../../components/theme-elements/CustomCKEditor';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Blog' }];

const getEncodedImageUrl = (imagePath) => {
  if (!imagePath) return null;
  try {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    let cleanPath = imagePath;
    if (imagePath.includes('uploads/')) cleanPath = imagePath.substring(imagePath.indexOf('uploads/'));
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
    return `${URLS.FileBase}${cleanPath}`;
  } catch (error) {
    console.error('Error building image URL:', error);
    return null;
  }
};

const slugify = (text) => {
  if (typeof text !== 'string') return '';
  return text.toLowerCase().replace(/\s+/g, '-').replace(/^-+|-+$/g, '');
};

const BlogForm = ({ onClose, onSubmit, initialData, services = [] }) => {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    fullcontent: '',
    serviceId: ''
  });
  const [slugEdited, setSlugEdited] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        fullcontent: initialData.fullcontent || '',
        serviceId: initialData.serviceId || '',
      });
      if (initialData.image) setPreview(getEncodedImageUrl(initialData.image));
    }
  }, [initialData]);



  useEffect(() => {
    if (!slugEdited) {
      setForm(prev => ({
        ...prev,
        slug: slugify(prev.title || ''),
      }));
    }
  }, [form.title, slugEdited]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'slug') setSlugEdited(true);
    if (name === 'slug' && value.trim() === '') setSlugEdited(false);
  };

  const handleCKEditorChange = (_, editor) => {
    setForm((prev) => ({ ...prev, fullcontent: editor.getData() }));
  };

  const changeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, or PNG.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) return toast.error('Title is required');
    if (!form.slug) return toast.error('Slug is required');
    if (!form.description) return toast.error('Description is required');
    if (!form.fullcontent) return toast.error('Full content is required');
    if (!form.serviceId) return toast.error('Service is required');
    if (!initialData && !file) return toast.error('Image is required for new blog');
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('slug', form.slug);
    formData.append('description', form.description);
    formData.append('fullcontent', form.fullcontent);
    formData.append('serviceId', form.serviceId);
    if (file) formData.append('image', file);
    onSubmit(formData, initialData?._id);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title={initialData ? "Edit Blog Post" : "Create Blog Post"}
          sx={{ boxShadow: 3, borderRadius: '8px' }}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="title" required>Title</CustomFormLabel>
              <CustomTextField
                id="title"
                name="title"
                variant="outlined"
                fullWidth
                placeholder="Enter blog title"
                value={form.title}
                required
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="slug" required>Slug</CustomFormLabel>
              <CustomTextField
                id="slug"
                name="slug"
                variant="outlined"
                fullWidth
                placeholder="Auto-generated slug"
                value={form.slug}
                required
                onChange={handleChange}
                helperText="Auto-generated, editable. Only lowercase and dashes."
              />
            </Grid>
              <Grid item xs={12} md={6}>
                <CustomFormLabel htmlFor="serviceId" required>
                  Service
                </CustomFormLabel>
                <CustomTextField
                  select
                  id="serviceId"
                  name="serviceId"
                  value={form.serviceId}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  placeholder="Select a Service"
                >
                  <MenuItem value="">Select Service</MenuItem>
                  {services.map((svc) => (
                    <MenuItem key={svc._id} value={svc._id}>
                      {svc.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="description" required>Blog Description</CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                multiline
                rows={2}
                value={form.description}
                required
                onChange={handleChange}
                fullWidth
                placeholder="Short blog description"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="fullcontent" required>Full Content</CustomFormLabel>
              <Box sx={{ border: '1px solid #ccc', borderRadius: 1, minHeight: 220, '& .ck-editor__editable': { minHeight: 180 } }}>
                <CKEditor
                  editor={CustomCKEditor}
                  data={form.fullcontent}
                  onChange={handleCKEditorChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="image" required={!initialData}>Blog Image</CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{ accept: 'image/jpeg,image/png,image/jpg' }}
              />
              {preview && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Avatar src={preview} alt="Preview" sx={{ width: 200, height: 150 }} variant="rounded" />
                </Box>
              )}
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="flex-end" gap={1} sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', p: 2, zIndex: 1 }}>
            <Button color="error" variant="outlined" onClick={onClose}>Close</Button>
            <Button color="primary" variant="contained" type="submit">{initialData ? 'Update' : 'Publish'}</Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

const LatestBlogs = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, data: null });
  const [services, setServices] = useState([]);

  useEffect(() => {
    const getServices = async () => {
      try {
        const res = await axios.get(URLS.Services);

        setServices(res.data.data || []);
       
      } catch {
        setServices([]);
      }
    };
    getServices();
  }, []);

  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch {
      return '';
    }
  };

  const token = getToken();

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
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      let res;
      if (id) res = await axios.put(`${URLS.Blog}/${id}`, formData, config);
      else res = await axios.post(URLS.Blog, formData, config);
      if (res.status === 200 || res.status === 201) {
        handleCloseForm();
        toast.success(res.data.message || (id ? 'Blog updated successfully!' : 'Blog published successfully!'));
        await getData();
        setTimeout(() => { window.scrollTo({ top: 500, behavior: 'smooth' }); }, 100);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (data) => setDeleteDialog({ open: true, data });
  const handleDeleteDialogClose = () => setDeleteDialog({ open: false, data: null });

  const handleDeleteConfirm = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      handleDeleteDialogClose();
      return;
    }
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.delete(`${URLS.Blog}/${deleteDialog.data._id}`, config);
      if (res.status === 200) {
        toast.success(res.data.message || 'Blog deleted successfully');
        getData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
      console.error(error);
    } finally {
      setLoading(false);
      handleDeleteDialogClose();
    }
  };

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(URLS.Blog, config);
      setData(res.data.data || []);
    } catch (error) {
      if (error.response?.status !== 404) toast.error('Failed to fetch blogs.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getData(); }, []);

  useEffect(() => {
    if (search === '') setFilteredData(data);
    else {
      const filtered = data.filter(item =>
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.slug?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [data, search]);

  const handleSearch = (e) => setSearch(e.target.value);

  const columns = useMemo(() => [
    {
      field: 'sno', headerName: 'S. No', width: 70, sortable: false, filterable: false, renderCell: (params) => {
        const sortedRows = params.api.getSortedRowIds();
        return sortedRows.indexOf(params.id) + 1;
      }
    },
    {
      field: 'image', headerName: 'Image', width: 120, renderCell: (params) =>
        <Avatar src={getEncodedImageUrl(params.row.image)} alt={params.row.title} sx={{ width: 80, height: 50 }}
          variant="rounded" />
    },
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 200 },
    { field: 'slug', headerName: 'Slug', flex: 1, minWidth: 200 },
    {
      field: 'description', headerName: 'Description', flex: 1, minWidth: 250, renderCell: (params) =>
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{params.value}</Typography>
    },
    {
      field: 'createdAt', headerName: 'Published', width: 120, renderCell: (params) =>
        <Typography variant="body2">{new Date(params.value).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</Typography>
    },
    {
      field: 'action', headerName: 'Actions', width: 150, sortable: false, filterable: false, renderCell: (params) =>
        <Box display="flex" gap={1}>
          <Button size="small" color="primary" variant="contained" onClick={() => handleEditPopUp(params.row)} disabled={loading} sx={{ minWidth: '32px', padding: '4px 6px' }}>
            <IconEdit stroke={1.5} size={18} />
          </Button>
          <Button size="small" color="error" variant="contained" onClick={() => handleDeleteClick(params.row)} disabled={loading} sx={{ minWidth: '32px', padding: '4px 6px' }}>
            <IconTrash stroke={1.5} size={18} />
          </Button>
        </Box>
    },
  ], [loading, theme]);

  const rows = useMemo(() => filteredData.map(item => ({ id: item._id, ...item })), [filteredData]);

  return (
    <PageContainer title="Blog" description="Manage blog posts">
      <Breadcrumb title="Blog Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      {showAddForm && <BlogForm onClose={handleCloseForm} onSubmit={handleSubmit} services={services} />}
      {showEditForm && <BlogForm onClose={handleCloseForm} onSubmit={handleSubmit} initialData={editData} services={services} />}
      <Dialog open={deleteDialog.open} onClose={handleDeleteDialogClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px', boxShadow: theme.shadows[10] } }}>
        <DialogTitle sx={{ bgcolor: theme.palette.error.main, color: theme.palette.error.contrastText, fontWeight: 600 }}>Confirm Deletion</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ color: theme.palette.text.primary }}>
            Are you sure you want to delete <strong>{deleteDialog.data?.title}</strong>? This action cannot be undone.
          </DialogContentText>
          {deleteDialog.data?.image && (
            <Box mt={2} display="flex" justifyContent="center">
              <Avatar src={getEncodedImageUrl(deleteDialog.data.image)} alt="To delete" sx={{ width: 120, height: 80 }} variant="rounded" />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleDeleteDialogClose} variant="outlined" color="inherit" disabled={loading}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={loading} autoFocus>{loading ? 'Deleting...' : 'Delete'}</Button>
        </DialogActions>
      </Dialog>
      <Paper variant="outlined" sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', boxShadow: theme.shadows[2] }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2} flexWrap="wrap" gap={2}>
          <Typography variant="h6">Blog Posts ({data.length})</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <CustomTextField size="small" placeholder="Search by title, slug, or description" value={search} onChange={handleSearch} sx={{ minWidth: { xs: 150, sm: 250 }, bgcolor: 'background.paper' }} />
            <Button variant="contained" color="primary" onClick={handleAddPopUp} disabled={loading} startIcon={<IconPlus size={20} />}>Create Blog</Button>
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid rows={rows} columns={columns} loading={loading} pageSizeOptions={[5, 10, 20]} disableRowSelectionOnClick autoHeight getRowId={row => row._id} sx={{ '& .MuiDataGrid-cell': { py: 1 } }} />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default LatestBlogs;


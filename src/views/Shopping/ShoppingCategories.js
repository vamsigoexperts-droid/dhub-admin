import React, { useState, useEffect, useMemo } from 'react';
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
import { Button } from '@mui/material';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  TextField,
  Avatar,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormHelperText
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

import { Close as CloseIcon } from '@mui/icons-material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Categories' }];


const AddCategoryForm = ({ onClose, onSubmit, loading }) => {
  
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    flagType: '',
  });

  const [iconFile, setIconFile] = useState(null);
const [iconPreview, setIconPreview] = useState(null);


  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const changeHandler = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }
};


const iconChangeHandler = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    setIconFile(selectedFile);
    setIconPreview(URL.createObjectURL(selectedFile));
  }
};

const toSlug = (text) => {
  return (text || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};


useEffect(() => {
  if (!slugManuallyEdited && form.name) {
    const generatedSlug = toSlug(form.name);
    setForm(prev => ({ ...prev, slug: generatedSlug }));
  }
}, [form.name, slugManuallyEdited]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Category name is required.');
      return;
    }
    if (!form.slug) {
      toast.error('Permalink is required.');
      return;
    }
    if (!file) {
      toast.error('Image is required for new categories.');
      return;
    }
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('slug', form.slug);
    formData.append('flagType', 'shopping');
    formData.append('image', file);
    if (iconFile) {
  formData.append('categoryIcon', iconFile);
}
    onSubmit(formData);
  };
 return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create Category"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="name" required>
                Category Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Category Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Enter category name"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="image" required>
                Image <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                  'aria-label': 'Upload category image',
                }}
                disabled={loading}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
            
            {/* Permalink Field */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="slug">
                Permalink (auto-generated)
              </CustomFormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isEditingSlug ? (
                  <CustomTextField
                    id="slug"
                    name="slug"
                    value={`https://doorstephub.com/${form.slug || ""}`}
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/^https?:\/\/(www\.)?doorstephub\.com\/?/i, '');
                      setForm(prev => ({ ...prev, slug: value }));
                    }}
                    placeholder="https://doorstephub.com/categoryname"
                    fullWidth
                    autoFocus
                    inputProps={{ maxLength: 90 }}
                    disabled={loading}
                  />
                ) : (
                  <Box sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1.5,
                    backgroundColor: 'action.hover',
                    minHeight: '40px'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'primary.main',
                        fontWeight: 500,
                        wordBreak: 'break-all'
                      }}
                    >
                      https://doorstephub.com/{form.slug || 'categoryname'}
                    </Typography>
                  </Box>
                )}
                
              <IconButton
    size="small"
    onClick={() => {
      if (isEditingSlug) {
        setSlugManuallyEdited(true); // â† ADD THIS
      }
      setIsEditingSlug(!isEditingSlug);
    }}
    color={isEditingSlug ? "success" : "primary"}
    disabled={loading}
  >
    {isEditingSlug ? <CheckIcon /> : <EditIcon />}
  </IconButton>
              </Box>
              <FormHelperText>
                {isEditingSlug 
                  ? "Edit the full URL path - click âœ“ to save" 
                  : " "
                }
              </FormHelperText>
            </Grid>

                        <Grid item xs={12} sm={6}>
  <CustomFormLabel htmlFor="categoryIcon">Category Icon</CustomFormLabel>
  <CustomTextField
    id="categoryIcon"
    type="file"
    variant="outlined"
    fullWidth
    onChange={e => {
      if(!e.target.files?.[0]) return;
      setIconFile(e.target.files[0]);
      setIconPreview(URL.createObjectURL(e.target.files[0]));
    }}
    inputProps={{ accept: 'image/*', 'aria-label': 'Upload category icon' }}
    disabled={loading}
  />
  {iconPreview && (
    <Box mt={1}>
      <Typography variant="caption">Icon Preview:</Typography>
      <Avatar src={iconPreview} sx={{ width: 60, height: 60, mt: 1 }} />
    </Box>
  )}
</Grid>

          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box
            display="flex"
            justifyContent="flex-end"
            gap={1}
            sx={{
              position: 'sticky',
              bottom: 0,
              bgcolor: theme.palette.background.paper,
              p: 2,
              zIndex: 1,
            }}
          >
            <Button
              color="error"
              variant="outlined"
              onClick={onClose}
              aria-label="Close form"
              disabled={loading}
            >
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              aria-label="Create category"
              disabled={loading}
              startIcon={loading && <CircularProgress size={16} />}
            >
              {loading ? 'Creating...' : 'Submit'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};
const EditCategoryForm = ({ onClose, onSubmit, initialData, loading }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    flagType: initialData?.flagType || '',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.image ? URLS.FileBase + initialData.image : null);

  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(
    initialData?.categoryIcon ? URLS.FileBase + initialData.categoryIcon : null
  );

  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const toSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
      .replace(/\s+/g, '-')          // replace spaces with -
      .replace(/-+/g, '-');          // collapse multiple -
  };

  useEffect(() => {
    if (!slugManuallyEdited && form.name) {
      const generatedSlug = toSlug(form.name);
      setForm(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [form.name, slugManuallyEdited]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Accept all image types for main image without validation
  const changeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Accept all image types for category icon without validation
  const iconChangeHandler = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setIconFile(selectedFile);
      setIconPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Category name is required.');
      return;
    }
    if (!form.slug) {
      toast.error('Permalink is required.');
      return;
    }
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('slug', form.slug);
    formData.append('flagType', 'shopping');
    if (file) {
      formData.append('image', file);
    }
    if (iconFile) {
      formData.append('categoryIcon', iconFile);
    }
    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Edit Category" sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="name" required>
                Category Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Category Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Enter category name"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="image">Image</CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{ accept: 'image/*', 'aria-label': 'Upload category image' }}
                disabled={loading}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
              <CustomFormLabel htmlFor="categoryIcon">Category Icon</CustomFormLabel>
              <CustomTextField
                id="categoryIcon"
                type="file"
                variant="outlined"
                fullWidth
                onChange={iconChangeHandler}
                inputProps={{ accept: 'image/*', 'aria-label': 'Upload category icon' }}
                disabled={loading}
              />
              {iconPreview && (
                <Box mt={1}>
                  <Typography variant="caption">Icon Preview:</Typography>
                  <Avatar src={iconPreview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sx={{ mt: 3 }}>
              <CustomFormLabel htmlFor="slug">Permalink (auto-generated)</CustomFormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isEditingSlug ? (
                  <CustomTextField
                    id="slug"
                    name="slug"
                    value={`https://doorstephub.com/${form.slug || ""}`}
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/^https?:\/\/(www\.)?doorstephub\.com\/?/i, '');
                      setForm(prev => ({ ...prev, slug: value }));
                    }}
                    placeholder="https://doorstephub.com/categoryname"
                    fullWidth
                    autoFocus
                    inputProps={{ maxLength: 90 }}
                    disabled={loading}
                  />
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1.5,
                      backgroundColor: 'action.hover',
                      minHeight: '40px',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 500,
                        wordBreak: 'break-all',
                      }}
                    >
                      https://doorstephub.com/{form.slug || 'categoryname'}
                    </Typography>
                  </Box>
                )}
                <IconButton
                  size="small"
                  onClick={() => {
                    if (isEditingSlug) {
                      setSlugManuallyEdited(true);
                    }
                    setIsEditingSlug(!isEditingSlug);
                  }}
                  color={isEditingSlug ? 'success' : 'primary'}
                  disabled={loading}
                >
                  {isEditingSlug ? <CheckIcon /> : <EditIcon />}
                </IconButton>
              </Box>
              <FormHelperText>
                {isEditingSlug ? 'Edit the full URL path - click âœ“ to save' : ' '}
              </FormHelperText>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box
            display="flex"
            justifyContent="flex-end"
            gap={1}
            sx={{
              position: 'sticky',
              bottom: 0,
              bgcolor: theme.palette.background.paper,
              p: 2,
              zIndex: 1,
            }}
          >
            <Button
              color="error"
              variant="outlined"
              onClick={onClose}
              aria-label="Close form"
              disabled={loading}
            >
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              aria-label="Update category"
              disabled={loading}
              startIcon={loading && <CircularProgress size={16} />}
            >
              {loading ? 'Updating...' : 'Submit'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, categoryName, loading }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Confirm Delete
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the category "{categoryName}"? This action cannot be
          undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Categories = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      let res;
      if (id) {
        res = await axios.put(`${URLS.EditCategorie}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddCategorie, formData, config);
      }
      if (res.status === 200) {
        toast.success(res.data.message);
        handleCloseForm();
        getData();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (data) => {
    setCategoryToDelete(data);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleDelete = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.delete(`${URLS.DeleteCategorie}/${categoryToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        getData();
        closeDeleteDialog();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
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
        URLS.GetCategories,
        { flagType: 'shopping' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.category);
    } catch (error) {
      toast.error('Failed to fetch categories.');
      console.error('Failed to fetch categories:', error);
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
        width: 80,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'categoryinfo',
        headerName: 'Category Info',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={URLS.FileBase + params.row.image}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">{params.row.name}</Typography>
          </Box>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Chip
            label={params.row.status === 'active' ? 'Active' : 'Inactive'}
            size="small"
            color={params.row.status === 'active' ? 'primary' : 'error'}
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
            {rolesAndPermission.shopping_categories_edit === true ||
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
            {rolesAndPermission.shopping_categories_delete === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => openDeleteDialog(params.row)}
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
    () =>
      filteredData?.map((item, index) => ({
        id: item._id || index,
        ...item,
      })) || [],
    [filteredData],
  );

  return (
    <PageContainer title="Categories" description="Manage Categories for your e-commerce platform">
      <Breadcrumb title="Categories" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      {showAddForm && (
        <AddCategoryForm onClose={handleCloseForm} onSubmit={handleSubmit} loading={loading} />
      )}
      {showEditForm && (
        <EditCategoryForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          loading={loading}
        />
      )}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        categoryName={categoryToDelete?.name || ''}
        loading={loading}
      />
      <Paper
        variant="outlined"
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
          mt: showAddForm || showEditForm ? 2 : 0,
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
          <Typography variant="h6">Categories List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search categories"
            />
            {rolesAndPermission.shopping_categories_add === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create new category"
                >
                  Create Category
                </Button>
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
              rowsPerPageOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              autoHeight
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-columnHeader:focus': {
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

export default Categories;

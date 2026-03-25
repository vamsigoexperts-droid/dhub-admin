import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Select,
  MenuItem,
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
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Child Category' }];

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const AddCategoryForm = ({ onClose, onSubmit, categories, loading }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    subcategoryId: '',
    flagType: 'shopping',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryLoading, setSubcategoryLoading] = useState(false);

  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  };

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!form.categoryId) {
        setSubcategories([]);
        return;
      }

      setSubcategoryLoading(true);
      const token = getToken();

      try {
        const res = await axios.post(
          URLS.GetCategorieIdbySubCategory,
          { categoryId: form.categoryId, flagType: 'shopping' },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (res.data && res.data.data) {
          setSubcategories(res.data.data);
        }
      } catch (error) {
        toast.error('Failed to fetch subcategories.');
        console.error('Failed to fetch subcategories:', error);
      } finally {
        setSubcategoryLoading(false);
      }
    };

    fetchSubcategories();
  }, [form.categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'categoryId' && { subcategoryId: '' }),
    }));
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
    if (!form.name) {
      toast.error('Child category name is required.');
      return;
    }
    if (!form.categoryId) {
      toast.error('Category is required.');
      return;
    }
    if (!form.subcategoryId) {
      toast.error('Sub category is required.');
      return;
    }
    if (!file) {
      toast.error('Image is required for new child category.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('categoryId', form.categoryId);
    formData.append('subcategoryId', form.subcategoryId);
    formData.append('flagType', form.flagType);
    formData.append('image', file);

    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create Child Category"
          sx={{
            boxShadow: theme.shadows[4],
            borderRadius: '8px',
            background: theme.palette.background.paper,
          }}
        >
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="categoryId" required>
                Category Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                id="categoryId"
                value={form.categoryId}
                name="categoryId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled={loading}
                aria-label="Select category"
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="subcategoryId" required>
                Sub Category Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                id="subcategoryId"
                value={form.subcategoryId}
                name="subcategoryId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled={!form.categoryId || loading || subcategoryLoading}
                aria-label="Select sub category"
              >
                <MenuItem value="">
                  <em>Select Sub Category</em>
                </MenuItem>
                {subcategories.map((subcategory) => (
                  <MenuItem key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="name" required>
                Child Category Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Child Category Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                disabled={loading}
                aria-label="Enter child category name"
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
                disabled={loading}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                  'aria-label': 'Upload category image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption" color="textSecondary">
                    Preview:
                  </Typography>
                  <Avatar
                    src={preview}
                    sx={{
                      width: 60,
                      height: 60,
                      mt: 1,
                      border: `2px solid ${theme.palette.primary.main}`,
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box
            display="flex"
            justifyContent="flex-end"
            gap={2}
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
              disabled={loading}
              aria-label="Close form"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : null}
              aria-label="Create child category"
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

const EditCategoryForm = ({ onClose, onSubmit, initialData, categories, loading }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    categoryId: initialData?.categoryId || '',
    subcategoryId: initialData?.subcategoryId || '',
    flagType: initialData?.flagType || 'shopping',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.image ? URLS.FileBase + initialData.image : null);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryLoading, setSubcategoryLoading] = useState(false);

  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  };

  // Fetch subcategories when category changes or initial data loads
  useEffect(() => {
    const fetchSubcategories = async () => {
      const categoryId = form.categoryId || initialData?.categoryId;

      if (!categoryId) {
        setSubcategories([]);
        return;
      }

      setSubcategoryLoading(true);
      const token = getToken();

      try {
        const res = await axios.post(
          URLS.GetCategorieIdbySubCategory,
          { categoryId: categoryId, flagType: 'shopping' },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (res.data && res.data.data) {
          setSubcategories(res.data.data);
        }
      } catch (error) {
        toast.error('Failed to fetch subcategories.');
        console.error('Failed to fetch subcategories:', error);
      } finally {
        setSubcategoryLoading(false);
      }
    };

    fetchSubcategories();
  }, [form.categoryId, initialData]);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        categoryId: initialData.categoryId || '',
        subcategoryId: initialData.subcategoryId || '',
        flagType: initialData.flagType || 'shopping',
      });
      setPreview(initialData.image ? URLS.FileBase + initialData.image : null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'categoryId' && { subcategoryId: '' }),
    }));
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
    if (!form.name) {
      toast.error('Child category name is required.');
      return;
    }
    if (!form.categoryId) {
      toast.error('Category is required.');
      return;
    }
    if (!form.subcategoryId) {
      toast.error('Sub category is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('categoryId', form.categoryId);
    formData.append('subcategoryId', form.subcategoryId);
    formData.append('flagType', form.flagType);
    if (file) {
      formData.append('image', file);
    }

    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit Child Category"
          sx={{
            boxShadow: theme.shadows[4],
            borderRadius: '8px',
            background: theme.palette.background.paper,
          }}
        >
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="categoryId" required>
                Category Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                id="categoryId"
                value={form.categoryId}
                name="categoryId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled={loading}
                aria-label="Select category"
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="subcategoryId" required>
                Sub Category Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                id="subcategoryId"
                value={form.subcategoryId}
                name="subcategoryId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled={!form.categoryId || loading || subcategoryLoading}
                aria-label="Select sub category"
              >
                <MenuItem value="">
                  <em>Select Sub Category</em>
                </MenuItem>
                {subcategories.map((subcategory) => (
                  <MenuItem key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="name" required>
                Child Category Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Child Category Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                disabled={loading}
                aria-label="Enter child category name"
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
                disabled={loading}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                  'aria-label': 'Upload category image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption" color="textSecondary">
                    Preview:
                  </Typography>
                  <Avatar
                    src={preview}
                    sx={{
                      width: 60,
                      height: 60,
                      mt: 1,
                      border: `2px solid ${theme.palette.primary.main}`,
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box
            display="flex"
            justifyContent="flex-end"
            gap={2}
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
              disabled={loading}
              aria-label="Close form"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : null}
              aria-label="Update child category"
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

const ChildCategory = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

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
    const token = getToken();
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setFormLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      let res;
      if (id) {
        res = await axios.put(`${URLS.UpdateChildCategories}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddChildCategories, formData, config);
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
      setFormLoading(false);
    }
  };

  const handleDelete = async (data) => {
    const token = getToken();
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${data.name}"?`)) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteChildCategories}/${data._id}`, {
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
    const token = getToken();
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetChildCategories,
        { flagType: 'shopping' },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const enhancedData = res.data.childcategorys;

      setData(enhancedData);
      setFilteredData(enhancedData);
    } catch (error) {
      toast.error('Failed to fetch child categories.');
      console.error('Failed to fetch child categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.post(
        URLS.GetCategories,
        { flagType: 'shopping' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCategories(res.data.category || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const token = getToken();
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }

      setLoading(true);
      try {
        await fetchCategories();
        await getData();
      } catch (error) {
        toast.error('Failed to fetch data.');
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (search === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.categoryName && item.categoryName.toLowerCase().includes(search.toLowerCase())) ||
          (item.subcategoryName &&
            item.subcategoryName.toLowerCase().includes(search.toLowerCase())),
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
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const index = filteredData.findIndex((item) => item._id === params.row._id);
          return index + 1;
        },
      },
      {
        field: 'image',
        headerName: 'Image',
        sortable: false,
        filterable: false,
        width: 100,
        renderCell: (params) => (
          <Avatar
            src={params.row.image ? URLS.FileBase + params.row.image : '/default-image.png'}
            alt={params.row.name}
            sx={{ width: 40, height: 40 }}
          />
        ),
      },
      {
        field: 'name',
        headerName: 'Child Category Name',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'categoryName',
        headerName: 'Category Name',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'subcategoryName',
        headerName: 'Sub Category Name',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => (
          <Chip
            label={params.row.status === 'active' ? 'Active' : 'Inactive'}
            size="small"
            color={params.row.status === 'active' ? 'success' : 'error'}
            variant="filled"
          />
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            {rolesAndPermission.shopping_child_categories_edit === true ||
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

            {rolesAndPermission.shopping_child_categories_delete === true ||
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
    ],
    [loading, filteredData],
  );

  const rows = useMemo(
    () =>
      filteredData.map((item, index) => ({
        id: item._id || index,
        ...item,
      })),
    [filteredData],
  );

  return (
    <PageContainer
      title="Child Category Management"
      description="Manage child categories for your e-commerce platform"
    >
      <Breadcrumb title="Child Category" items={BCrumb} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {showAddForm && (
        <AddCategoryForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          categories={categories}
          loading={formLoading}
        />
      )}

      {showEditForm && (
        <EditCategoryForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          categories={categories}
          loading={formLoading}
        />
      )}

      <Paper
        variant="outlined"
        sx={{
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
          <Typography variant="h5" fontWeight="600">
            Child Category List
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Child Categories"
            />
            {rolesAndPermission.shopping_child_categories_add === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create new child category"
                >
                  Create new child category
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
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default ChildCategory;

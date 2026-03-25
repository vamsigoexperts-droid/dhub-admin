import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../../Url';
import axios from 'axios';
import {
  Select,
  MenuItem,
  TextField,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  CardContent,
  Chip,
} from '@mui/material';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Attributes' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Add Attribute Form Component
const AddAttributeForm = ({
  onClose,
  onSubmit,
  serviceTypes,
  categories,
  subcategories,
  onServiceChange,
  onCategoryChange,
}) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    serviceId: '',
    categoryId: '',
    subcategoryId: '',
    type: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'serviceId') {
      setForm({
        ...form,
        [name]: value,
        categoryId: '', // Reset category when service changes
        subcategoryId: '', // Reset subcategory when service changes
      });
      onServiceChange(value); // Fetch categories for selected service
    } else if (name === 'categoryId') {
      setForm({
        ...form,
        [name]: value,
        subcategoryId: '', // Reset subcategory when category changes
      });
      onCategoryChange(value); // Fetch subcategories for selected category
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Attribute name is required.');
      return;
    }

    onSubmit(form);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create Attribute"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="serviceId" required>
                Service Name
              </CustomFormLabel>
              <CustomSelect
                id="serviceId"
                value={form.serviceId}
                name="serviceId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select service"
              >
                {serviceTypes.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="categoryId" required>
                Category Name
              </CustomFormLabel>
              <CustomSelect
                id="categoryId"
                value={form.categoryId}
                name="categoryId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select Category"
                disabled={!form.serviceId}
              >
                {categories.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="subcategoryId" required>
                Sub Category Name
              </CustomFormLabel>
              <CustomSelect
                id="subcategoryId"
                value={form.subcategoryId}
                name="subcategoryId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select Sub Category"
                disabled={!form.categoryId}
              >
                {subcategories.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="name" required>
                Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Enter Name"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="type" required>
                Type
              </CustomFormLabel>
              <CustomSelect
                id="type"
                value={form.type}
                name="type"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select Type"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="select">Select</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={4}>
              <CustomFormLabel htmlFor="description">
                Description <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter Description"
                multiline
                fullWidth
              />
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
            <Button color="error" variant="outlined" onClick={onClose} aria-label="Close form">
              Close
            </Button>
            <Button color="primary" variant="contained" type="submit" aria-label="Create attribute">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit Attribute Form Component
const EditAttributeForm = ({
  onClose,
  onSubmit,
  initialData,
  serviceTypes,
  categories,
  subcategories,
  onServiceChange,
  onCategoryChange,
}) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    serviceId: initialData?.serviceId || '',
    categoryId: initialData?.categoryId || '',
    subcategoryId: initialData?.subcategoryId || '',
    type: initialData?.type || '',
    description: initialData?.description || '',
  });

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Load categories and subcategories when component mounts with initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (initialData && !initialLoadDone) {
        setInitialLoadDone(true);

        // Only fetch if we have serviceId but no categories, or if categories are empty
        if (initialData.serviceId && categories.length === 0) {
          await onServiceChange(initialData.serviceId);
        }

        // Only fetch if we have categoryId but no subcategories, or if subcategories are empty
        if (initialData.categoryId && subcategories.length === 0) {
          await onCategoryChange(initialData.categoryId);
        }
      }
    };

    loadInitialData();
  }, [
    initialData,
    categories.length,
    subcategories.length,
    onServiceChange,
    onCategoryChange,
    initialLoadDone,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'serviceId') {
      setForm({
        ...form,
        [name]: value,
        categoryId: '', // Reset category when service changes
        subcategoryId: '', // Reset subcategory when service changes
      });
      onServiceChange(value); // Fetch categories for selected service
    } else if (name === 'categoryId') {
      setForm({
        ...form,
        [name]: value,
        subcategoryId: '', // Reset subcategory when category changes
      });
      onCategoryChange(value); // Fetch subcategories for selected category
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Attribute name is required.');
      return;
    }

    onSubmit(form, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit Attribute"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={4}>
              <CustomFormLabel htmlFor="serviceId" required>
                Service Name
              </CustomFormLabel>
              <CustomSelect
                id="serviceId"
                value={form.serviceId}
                name="serviceId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select service"
              >
                {serviceTypes.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={4}>
              <CustomFormLabel htmlFor="categoryId" required>
                Category Name
              </CustomFormLabel>
              <CustomSelect
                id="categoryId"
                value={form.categoryId}
                name="categoryId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select Category"
                disabled={!form.serviceId}
              >
                {categories.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={4}>
              <CustomFormLabel htmlFor="subcategoryId" required>
                Sub Category Name
              </CustomFormLabel>
              <CustomSelect
                id="subcategoryId"
                value={form.subcategoryId}
                name="subcategoryId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select Sub Category"
                disabled={!form.categoryId}
              >
                {subcategories.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={4}>
              <CustomFormLabel htmlFor="name" required>
                Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Enter Name"
              />
            </Grid>
            <Grid item xs={4}>
              <CustomFormLabel htmlFor="type" required>
                Type
              </CustomFormLabel>
              <CustomSelect
                id="type"
                value={form.type}
                name="type"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select Type"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="select">Select</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={4}>
              <CustomFormLabel htmlFor="description">
                Description <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter Description"
                multiline
                rows={2}
                fullWidth
              />
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
            <Button color="error" variant="outlined" onClick={onClose} aria-label="Close form">
              Close
            </Button>
            <Button color="primary" variant="contained" type="submit" aria-label="Update attribute">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main Attributes Component
const Attributes = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [fetchingSubcategories, setFetchingSubcategories] = useState(false);

  // Cache to store fetched data to avoid redundant API calls
  const [categoryCache, setCategoryCache] = useState({});
  const [subcategoryCache, setSubcategoryCache] = useState({});

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
    // Reset categories and subcategories when opening add form
    setCategories([]);
    setSubcategories([]);
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
    // Don't reset categories and subcategories to avoid unnecessary API calls
    // setCategories([]);
    // setSubcategories([]);
  };

  const handleSubmit = async (formData, id) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let res;
      if (id) {
        res = await axios.put(`${URLS.UpdateAttribute}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddAttribute, formData, config);
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

  const handleDelete = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    if (window.confirm('Do you really want to delete this attribute?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteAttribute}/${data._id}`, {
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
        URLS.GetAttribute,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data && res.data.success) {
        setData(res.data.attribute || []);
      } else {
        setData([]);
      }
    } catch (error) {
      toast.error('Failed to fetch attributes.');
      console.error('Failed to fetch attributes:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesByService = useCallback(
    async (serviceId) => {
      const token = getToken();
      if (!token || !serviceId) return;

      // Check cache first
      if (categoryCache[serviceId]) {
        setCategories(categoryCache[serviceId]);
        setSubcategories([]); // Reset subcategories when service changes
        return;
      }

      // Prevent multiple simultaneous calls
      if (fetchingCategories) return;

      setFetchingCategories(true);
      try {
        const response = await axios.post(
          URLS.GetServiceIdbyCategory,
          { serviceId: serviceId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (response.data && response.data.success) {
          const fetchedCategories = response.data.data || [];
          setCategories(fetchedCategories);
          // Cache the result
          setCategoryCache((prev) => ({ ...prev, [serviceId]: fetchedCategories }));
        } else {
          setCategories([]);
        }
        // Reset subcategories when service changes
        setSubcategories([]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
        setSubcategories([]);
      } finally {
        setFetchingCategories(false);
      }
    },
    [categoryCache, fetchingCategories],
  );

  const fetchSubcategoriesByCategory = useCallback(
    async (categoryId) => {
      const token = getToken();
      if (!token || !categoryId) return;

      // Check cache first
      if (subcategoryCache[categoryId]) {
        setSubcategories(subcategoryCache[categoryId]);
        return;
      }

      // Prevent multiple simultaneous calls
      if (fetchingSubcategories) return;

      setFetchingSubcategories(true);
      try {
        const response = await axios.post(
          URLS.GetCategorieIdbySubCategory,
          { categoryId: categoryId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (response.data && response.data.success) {
          const fetchedSubcategories = response.data.data || [];
          setSubcategories(fetchedSubcategories);
          // Cache the result
          setSubcategoryCache((prev) => ({ ...prev, [categoryId]: fetchedSubcategories }));
        } else {
          setSubcategories([]);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setSubcategories([]);
      } finally {
        setFetchingSubcategories(false);
      }
    },
    [subcategoryCache, fetchingSubcategories],
  );

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }
      setLoading(true);
      try {
        const serviceRes = await axios.post(
          URLS.GetActiveServices,
          {
            searchQuery: '',
            serviceType: '',
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setServiceTypes(serviceRes.data.data || []);
        await getData();
      } catch (error) {
        toast.error('Failed to fetch data.');
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token]);

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
        field: 'name',
        headerName: 'Name',
        flex: 1,
      },
      {
        field: 'serviceName',
        headerName: 'Service',
        flex: 1,
      },
      {
        field: 'categoryName',
        headerName: 'Category',
        flex: 1,
      },
      {
        field: 'subcategoryName',
        headerName: 'Subcategory',
        flex: 1,
      },
      {
        field: 'type',
        headerName: 'Type',
        flex: 1,
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
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
    ],
    [loading, serviceTypes, categories, subcategories],
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
    <PageContainer title="Attributes" description="Manage Attributes for your e-commerce platform">
      <Breadcrumb title="Attributes" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      {showAddForm && (
        <AddAttributeForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          serviceTypes={serviceTypes}
          categories={categories}
          subcategories={subcategories}
          onServiceChange={fetchCategoriesByService}
          onCategoryChange={fetchSubcategoriesByCategory}
        />
      )}
      {showEditForm && (
        <EditAttributeForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          serviceTypes={serviceTypes}
          categories={categories}
          subcategories={subcategories}
          onServiceChange={fetchCategoriesByService}
          onCategoryChange={fetchSubcategoriesByCategory}
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
          <Typography variant="h6">Attributes List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Attributes"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              disabled={loading}
              startIcon={<IconPlus size={20} />}
              aria-label="Create new Attributes"
            >
              Create Attributes
            </Button>
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

export default Attributes;

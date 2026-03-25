import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Specifications' }];

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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'serviceId') {
      setForm({
        ...form,
        [name]: value,
        categoryId: '',
        subcategoryId: '',
      });
      onServiceChange(value);
    } else if (name === 'categoryId') {
      setForm({
        ...form,
        [name]: value,
        subcategoryId: '',
      });
      onCategoryChange(value);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Specification Name is required.');
      return;
    }

    if (!form.serviceId) {
      toast.error('Service selection is required.');
      return;
    }

    if (!form.categoryId) {
      toast.error('Category selection is required.');
      return;
    }

    if (!form.subcategoryId) {
      toast.error('Subcategory selection is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create Attribute"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
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
                disabled={isSubmitting}
              >
                {serviceTypes.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                disabled={!form.serviceId || isSubmitting}
              >
                {categories.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                disabled={!form.categoryId || isSubmitting}
              >
                {subcategories.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                disabled={isSubmitting}
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
            <Button
              color="error"
              variant="outlined"
              onClick={onClose}
              aria-label="Close form"
              disabled={isSubmitting}
            >
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              aria-label="Create attribute"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Submit'}
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Load categories and subcategories when component mounts with initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (initialData && !initialLoadDone) {
        setInitialLoadDone(true);

        // Load categories if we have serviceId
        if (initialData.serviceId) {
          await onServiceChange(initialData.serviceId);
        }

        // Load subcategories if we have categoryId
        if (initialData.categoryId) {
          await onCategoryChange(initialData.categoryId);
        }
      }
    };

    loadInitialData();
  }, [initialData, initialLoadDone, onServiceChange, onCategoryChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'serviceId') {
      setForm({
        ...form,
        [name]: value,
        categoryId: '',
        subcategoryId: '',
      });
      onServiceChange(value);
    } else if (name === 'categoryId') {
      setForm({
        ...form,
        [name]: value,
        subcategoryId: '',
      });
      onCategoryChange(value);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Specification Name is required.');
      return;
    }

    if (!form.serviceId) {
      toast.error('Service selection is required.');
      return;
    }

    if (!form.categoryId) {
      toast.error('Category selection is required.');
      return;
    }

    if (!form.subcategoryId) {
      toast.error('Subcategory selection is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form, initialData._id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit Attribute"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
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
                disabled={isSubmitting}
              >
                {serviceTypes.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                disabled={!form.serviceId || isSubmitting}
              >
                {categories.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                disabled={!form.categoryId || isSubmitting}
              >
                {subcategories.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                disabled={isSubmitting}
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
            <Button
              color="error"
              variant="outlined"
              onClick={onClose}
              aria-label="Close form"
              disabled={isSubmitting}
            >
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              aria-label="Update attribute"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Submit'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main Specifications Component
const Specifications = () => {
  const theme = useTheme();
  const isMountedRef = useRef(true);

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

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const getToken = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  }, []);

  const handleAddPopUp = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setEditData(null);
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
  };

  const getData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetSpecifications,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (isMountedRef.current) {
        if (res.data && res.data.success) {
          setData(res.data.specifications || []);
        } else {
          setData([]);
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        toast.error('Failed to fetch Specifications.');
        console.error('Failed to fetch Specifications:', error);
        setData([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [getToken]);

  const handleSubmit = async (formData, id) => {
    const token = getToken();
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let res;
      if (id) {
        res = await axios.put(`${URLS.UpdateSpecifications}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddSpecifications, formData, config);
      }

      if (res.status === 200 && isMountedRef.current) {
        toast.success(res.data.message);
        handleCloseForm();
        await getData();
      }
    } catch (error) {
      if (isMountedRef.current) {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (data) => {
    const token = getToken();
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm('Do you really want to delete this attribute?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteSpecifications}/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200 && isMountedRef.current) {
          toast.success(res.data.message);
          await getData();
        }
      } catch (error) {
        if (isMountedRef.current) {
          const message = error.response?.data?.message || 'An error occurred';
          toast.error(message);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
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

        if (response.data && response.data.success && isMountedRef.current) {
          const fetchedCategories = response.data.data || [];
          setCategories(fetchedCategories);
          // Cache the result
          setCategoryCache((prev) => ({ ...prev, [serviceId]: fetchedCategories }));
        } else if (isMountedRef.current) {
          setCategories([]);
        }
        // Reset subcategories when service changes
        if (isMountedRef.current) {
          setSubcategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (isMountedRef.current) {
          setCategories([]);
          setSubcategories([]);
        }
      } finally {
        if (isMountedRef.current) {
          setFetchingCategories(false);
        }
      }
    },
    [getToken, categoryCache, fetchingCategories],
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

        if (response.data && response.data.success && isMountedRef.current) {
          const fetchedSubcategories = response.data.data || [];
          setSubcategories(fetchedSubcategories);
          // Cache the result
          setSubcategoryCache((prev) => ({ ...prev, [categoryId]: fetchedSubcategories }));
        } else if (isMountedRef.current) {
          setSubcategories([]);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        if (isMountedRef.current) {
          setSubcategories([]);
        }
      } finally {
        if (isMountedRef.current) {
          setFetchingSubcategories(false);
        }
      }
    },
    [getToken, subcategoryCache, fetchingSubcategories],
  );

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      const token = getToken();
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

        if (isMountedRef.current) {
          setServiceTypes(serviceRes.data.data || []);
          await getData();
        }
      } catch (error) {
        if (isMountedRef.current) {
          toast.error('Failed to fetch data.');
          console.error('Failed to fetch data:', error);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();
  }, [getToken, getData]);

  // Filter data based on search
  useEffect(() => {
    if (search === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase()),
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
          return params.api.getRowIndexRelativeToVisibleRows(params.id) + 1;
        },
      },
      {
        field: 'name',
        headerName: 'Specification Name',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'serviceName',
        headerName: 'Service',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'categoryName',
        headerName: 'Category',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'subcategoryName',
        headerName: 'Subcategory',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 100,
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
        width: 120,
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
    <PageContainer
      title="Specifications"
      description="Manage Specifications for your e-commerce platform"
    >
      <Breadcrumb title="Specifications" items={BCrumb} />
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

      {showEditForm && editData && (
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
          <Typography variant="h6">Specifications List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 } }}
              aria-label="Search Specifications"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              disabled={loading}
              startIcon={<IconPlus size={20} />}
              aria-label="Create new Specifications"
            >
              Create Specifications
            </Button>
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell': {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default Specifications;

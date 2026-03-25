import React, { useState, useEffect, useCallback } from 'react';
import { URLS } from 'src/Url';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
  styled,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
} from '@mui/material';
import { IconArrowBackUp } from '@tabler/icons-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/amenities', title: 'Amenities' },
  { title: 'Add Amenity' },
];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const AddAmenity = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    serviceId: '',
    categoryId: '',
    subcategoryId: [],
    status: 'active',
  });

  const getToken = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.token || '' : '';
  }, []);

  // Fetch Services (Professional only)
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchServices = async () => {
      try {
        const res = await axios.post(
          URLS.GetActiveServices,
          null,
          {
            params: {
              serviceType: 'professional',
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setServices(res.data.services || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        toast.error('Failed to fetch services');
      }
    };

    fetchServices();
  }, [getToken]);

  // Fetch Categories based on selected service
  useEffect(() => {
    const token = getToken();
    if (!token || !form.serviceId) return;

    const fetchCategories = async () => {
      try {
        const res = await axios.post(
          URLS.GetProfessionalCategories,
          { serviceId: form.serviceId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setCategories(res.data.data || res.data.category || []);
        // Reset selections if previous categories are no longer available? 
        // For simplicity, we keep them, or the user can remove them.
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, [form.serviceId, getToken]);

  // Fetch Subcategories based on selected category
  useEffect(() => {
    const token = getToken();
    if (!token || !form.categoryId) {
      setSubcategories([]);
      setForm(prev => ({ ...prev, subcategoryId: [] })); // Clear dependent selections
      return;
    }

    const fetchSubcategories = async () => {
      try {
        const res = await axios.post(
          URLS.GetProfessionalSubcategories,
          { categoryId: [form.categoryId] },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setSubcategories(res.data.data || []);

        // Cleanup subcategoryId: remove any that are no longer in the new subcategories list
        setForm(prev => {
          const newSubs = res.data.data || [];
          const validSubIds = newSubs.map(s => s._id);
          const filteredSubIds = prev.subcategoryId.filter(id => validSubIds.includes(id));
          if (filteredSubIds.length !== prev.subcategoryId.length) {
            return { ...prev, subcategoryId: filteredSubIds };
          }
          return prev;
        });

      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
        toast.error('Failed to fetch subcategories');
      }
    };

    fetchSubcategories();
  }, [form.categoryId, getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset dependent fields if service changes
      ...(name === 'serviceId' && { categoryId: [], subcategoryId: [] }),
    }));

    // Clear dependent subcategories if category selection changes and some are now invalid
    if (name === 'categoryId') {
      setSubcategories([]);
      // We'll let useEffect fetch them
    }

    // Clear everything if service changes
    if (name === 'serviceId') {
      setCategories([]);
      setSubcategories([]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'svg'].includes(ext)) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        toast.error('Please choose JPG, JPEG, PNG, or SVG file');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (!token) {
      toast.error('Authentication required');
      return;
    }

    if (!form.title.trim()) {
      toast.error('Amenity title is required.');
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

    if (form.subcategoryId.length === 0) {
      toast.error('At least one subcategory selection is required.');
      return;
    }

    if (!imageFile) {
      toast.error('Amenity image is required.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title.trim());
    formData.append('description', form.description.trim());
    formData.append('serviceId', form.serviceId);
    formData.append('categoryId', form.categoryId);

    // Append multiple subcategories
    if (Array.isArray(form.subcategoryId)) {
      form.subcategoryId.forEach(id => {
        formData.append('subcategoryId', id);
      });
    } else {
      formData.append('subcategoryId', form.subcategoryId);
    }

    formData.append('status', form.status);
    formData.append('image', imageFile);

    try {
      const res = await axios.post(
        URLS.AddAmenity,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(res.data?.message || 'Amenity created successfully');
      navigate('/amenities');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to create amenity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Add Amenity" description="Create new amenity">
      <Breadcrumb title="Add Amenity" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ py: 1 }}>
        <form onSubmit={handleSubmit}>
          <ParentCard
            title="Create Amenity"
            sx={{ boxShadow: theme.shadows[4], borderRadius: '8px', mb: 3 }}
          >
            <Grid container spacing={2} sx={{ p: 2 }}>
              {/* Amenity Title */}
              <Grid item xs={12} sm={6} md={4}>
                <CustomFormLabel htmlFor="title" required>
                  Amenity Title
                </CustomFormLabel>
                <CustomTextField
                  id="title"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Amenity Title"
                  name="title"
                  value={form.title}
                  required
                  onChange={handleChange}
                  aria-label="Enter amenity title"
                />
              </Grid>

              {/* Service */}
              <Grid item xs={12} sm={6} md={4}>
                <CustomFormLabel htmlFor="serviceId" required>
                  Service
                </CustomFormLabel>
                <CustomSelect
                  id="serviceId"
                  value={form.serviceId}
                  name="serviceId"
                  required
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  displayEmpty
                  aria-label="Select service"
                >
                  <MenuItem value="" disabled>
                    Select a service
                  </MenuItem>
                  {services.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>

              {/* Category (Multi-select) */}
              <Grid item xs={12} sm={6} md={4}>
                <CustomFormLabel htmlFor="categoryId" required>
                  Categories
                </CustomFormLabel>
                <CustomSelect
                  id="categoryId"
                  value={form.categoryId}
                  name="categoryId"
                  required
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  displayEmpty
                  disabled={!form.serviceId}
                >
                  <MenuItem value="" disabled>
                    Select a category
                  </MenuItem>
                  {categories.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>

              {/* Subcategory (Multi-select) */}
              <Grid item xs={12} sm={6} md={4}>
                <CustomFormLabel htmlFor="subcategoryId" required>
                  Subcategories
                </CustomFormLabel>
                <CustomSelect
                  id="subcategoryId"
                  multiple
                  value={form.subcategoryId}
                  name="subcategoryId"
                  required
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  input={<OutlinedInput label="Subcategories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const sub = subcategories.find(s => s._id === value);
                        const cat = categories.find(c => c._id === sub?.categoryId);
                        const label = sub ? `${cat ? cat.name + ' > ' : ''}${sub.name}` : value;
                        return <Chip key={value} label={label} size="small" />;
                      })}
                    </Box>
                  )}
                  disabled={!form.categoryId}
                >
                  {subcategories.map((option) => {
                    const cat = categories.find(c => c._id === option.categoryId);
                    return (
                      <MenuItem key={option._id} value={option._id}>
                        <Checkbox checked={form.subcategoryId.indexOf(option._id) > -1} />
                        <ListItemText
                          primary={option.name}
                          secondary={cat ? `Category: ${cat.name}` : ''}
                        />
                      </MenuItem>
                    );
                  })}
                </CustomSelect>
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6} md={4}>
                <CustomFormLabel htmlFor="status" required>
                  Status
                </CustomFormLabel>
                <CustomSelect
                  id="status"
                  value={form.status}
                  name="status"
                  required
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  aria-label="Select status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </CustomSelect>
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12} sm={6} md={4}>
                <CustomFormLabel htmlFor="image" required>
                  Amenity Image
                </CustomFormLabel>
                <CustomTextField
                  id="image"
                  type="file"
                  variant="outlined"
                  fullWidth
                  onChange={handleImageChange}
                  inputProps={{ accept: 'image/jpeg,image/png,image/jpg,image/svg+xml' }}
                  aria-label="Upload amenity image"
                />
                {imagePreview && (
                  <Box mt={2}>
                    <Typography variant="caption">Image Preview</Typography>
                    <Avatar
                      src={imagePreview}
                      variant="rounded"
                      sx={{ width: 100, height: 100, mt: 1 }}
                    />
                  </Box>
                )}
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="description">Description</CustomFormLabel>
                <CustomTextField
                  id="description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter description (optional)"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  aria-label="Enter description"
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
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
                onClick={() => navigate('/amenities')}
                disabled={loading}
                aria-label="Close form"
              >
                Close
              </Button>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
                aria-label="Create amenity"
              >
                {loading ? 'Creating...' : 'Submit'}
              </Button>
            </Box>
          </ParentCard>
        </form>
      </Box>
    </PageContainer>
  );
};

export default AddAmenity;

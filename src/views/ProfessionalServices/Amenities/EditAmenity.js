import React, { useState, useEffect, useCallback } from 'react';
import { URLS } from 'src/Url';
import { useNavigate, useParams } from 'react-router-dom';
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
  { title: 'Edit Amenity' },
];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const EditAmenity = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    serviceId: '',
    categoryId: '',
    subcategoryId: '',
    status: 'active',
  });

  const getToken = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.token || '' : '';
  }, []);

  // Fetch Amenity Data
  useEffect(() => {
    const token = getToken();
    if (!token || !id) return;

    const fetchAmenity = async () => {
      try {
        setFetchLoading(true);
        const res = await axios.get(
          `${URLS.GetAmenityById}${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const amenity = res.data.amenity || res.data.data;
        setForm({
          title: amenity.title || '',
          description: amenity.description || '',
          serviceId: amenity.serviceId?._id || amenity.serviceId || '',
          categoryId: amenity.categoryId?._id || amenity.categoryId || '',
          subcategoryId: amenity.subcategoryId?._id || amenity.subcategoryId || '',
          status: amenity.status || 'active',
        });

        if (amenity.image) {
          const imageUrl = `${URLS.FileBase}${amenity.image}`;
          setExistingImage(imageUrl);
          setImagePreview(imageUrl);
        }
      } catch (error) {
        console.error('Failed to fetch amenity:', error);
        toast.error('Failed to load amenity data');
        navigate('/amenities');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchAmenity();
  }, [id, getToken, navigate]);

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
      }
    };

    fetchServices();
  }, [getToken]);

  // Fetch Categories
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
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, [form.serviceId, getToken]);

  // Fetch Subcategories
  useEffect(() => {
    const token = getToken();
    if (!token || !form.categoryId) return;

    const fetchSubcategories = async () => {
      try {
        const res = await axios.post(
          URLS.GetProfessionalSubcategories,
          { categoryId: form.categoryId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setSubcategories(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      }
    };

    fetchSubcategories();
  }, [form.categoryId, getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'serviceId' && { categoryId: '', subcategoryId: '' }),
      ...(name === 'categoryId' && { subcategoryId: '' }),
    }));

    if (name === 'serviceId') {
      setCategories([]);
      setSubcategories([]);
    }
    if (name === 'categoryId') {
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
        setExistingImage(null);
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

    if (!form.subcategoryId) {
      toast.error('Subcategory selection is required.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', form.title.trim());
    formData.append('description', form.description.trim());
    formData.append('serviceId', form.serviceId);
    formData.append('categoryId', form.categoryId);
    formData.append('subcategoryId', form.subcategoryId);
    formData.append('status', form.status);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await axios.put(
        `${URLS.EditAmenity}${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(res.data?.message || 'Amenity updated successfully');
      navigate('/amenities');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to update amenity');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <PageContainer title="Edit Amenity" description="Loading...">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Amenity" description="Update amenity details">
      <Breadcrumb title="Edit Amenity" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ py: 1 }}>
        <form onSubmit={handleSubmit}>
          <ParentCard
            title="Edit Amenity"
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

              {/* Category */}
              <Grid item xs={12} sm={6} md={4}>
                <CustomFormLabel htmlFor="categoryId" required>
                  Category
                </CustomFormLabel>
                <CustomSelect
                  id="categoryId"
                  value={form.categoryId}
                  name="categoryId"
                  required
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  disabled={!form.serviceId}
                  aria-label="Select category"
                >
                  <MenuItem value="" disabled>
                    {!form.serviceId ? 'Select service first' : 'Select a category'}
                  </MenuItem>
                  {categories.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>

              {/* Subcategory */}
              <Grid item xs={12} sm={6} md={4}>
                <CustomFormLabel htmlFor="subcategoryId" required>
                  Subcategory
                </CustomFormLabel>
                <CustomSelect
                  id="subcategoryId"
                  value={form.subcategoryId}
                  name="subcategoryId"
                  required
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  disabled={!form.categoryId}
                  aria-label="Select subcategory"
                >
                  <MenuItem value="" disabled>
                    {!form.categoryId ? 'Select category first' : 'Select a subcategory'}
                  </MenuItem>
                  {subcategories.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
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
                <CustomFormLabel htmlFor="image">
                  Amenity Image {!imagePreview && '(Required)'}
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
                    <Typography variant="caption">
                      {imageFile ? 'New Image Preview' : 'Current Image'}
                    </Typography>
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
                aria-label="Update amenity"
              >
                {loading ? 'Updating...' : 'Submit'}
              </Button>
            </Box>
          </ParentCard>
        </form>
      </Box>
    </PageContainer>
  );
};

export default EditAmenity;

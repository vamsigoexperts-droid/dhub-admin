import React, { useState, useEffect, useMemo } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconPlus, IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tabs,
  Tab,
  styled,
  FormHelperText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';

// API Base URL for Professional Categories
const API_BASE_URL = 'https://api.doorstephub.com/v1/dhubApi/admin/professional-services-category';
const IMAGE_BASE_URL = 'https://api.doorstephub.com';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Professional Categories' }];

// Utility function to normalize file paths (convert backslashes to forward slashes)
const normalizeImagePath = (path) => {
  if (!path) return '';
  return path.replace(/\\/g, '/');
};

// Utility function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  const normalizedPath = normalizeImagePath(imagePath);
  return `${IMAGE_BASE_URL}/${normalizedPath}`;
};

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Styled Tabs component
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.95rem',
  marginRight: theme.spacing(1),
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

// Add Professional Category Form Component
const AddProfessionalCategoryForm = ({ onClose, onSubmit, serviceTypes, loading }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    serviceId: '',
    description: '',
    status: 'active',
    metaTitle: '',
    metaDescription: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        setImageFile(selectedFile);
        setImagePreview(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, or PNG for image.');
      }
    }
  };

  const handleIconChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        setIconFile(selectedFile);
        setIconPreview(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, or PNG for icon.');
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Professional category name is required.');
      return;
    }
    if (!form.serviceId) {
      toast.error('Service selection is required.');
      return;
    }
    if (!imageFile) {
      toast.error('Image is required for new professional categories.');
      return;
    }
    if (!iconFile) {
      toast.error('Category icon is required for new professional categories.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('serviceId', form.serviceId);
    formData.append('description', form.description.trim());
    formData.append('status', form.status);
    formData.append('metaTitle', form.metaTitle.trim());
    formData.append('metaDescription', form.metaDescription.trim());
    formData.append('metakeywords', tags.length > 0 ? tags.join(', ') : '');
    formData.append('image', imageFile);
    formData.append('categoryIcon', iconFile);

    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <ParentCard
          title="Create Professional Category"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px', mb: 3 }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="name" required>
                Professional Category Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Professional Category Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Enter professional category name"
              />
            </Grid>

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
                {serviceTypes.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

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

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="description">
                Description
              </CustomFormLabel>
              <CustomTextField
                id="description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                placeholder="Enter description"
                name="description"
                value={form.description}
                onChange={handleChange}
                aria-label="Enter description"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="image" required>
                Category Image
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={handleImageChange}
                inputProps={{
                  accept: 'image/jpeg,image/png,image/jpg',
                  'aria-label': 'Upload professional category image',
                }}
              />
              {imagePreview && (
                <Box mt={2}>
                  <Typography variant="caption">Image Preview:</Typography>
                  <Avatar
                    src={imagePreview}
                    variant="rounded"
                    sx={{ width: 100, height: 100, mt: 1 }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="categoryIcon" required>
                Category Icon
              </CustomFormLabel>
              <CustomTextField
                id="categoryIcon"
                type="file"
                variant="outlined"
                fullWidth
                onChange={handleIconChange}
                inputProps={{
                  accept: 'image/jpeg,image/png,image/jpg',
                  'aria-label': 'Upload category icon',
                }}
              />
              {iconPreview && (
                <Box mt={2}>
                  <Typography variant="caption">Icon Preview:</Typography>
                  <Avatar
                    src={iconPreview}
                    variant="rounded"
                    sx={{ width: 100, height: 100, mt: 1 }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </ParentCard>

        {/* SEO Settings - Separate ParentCard */}
        <ParentCard
          title="SEO Settings"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaTitle">
                Meta Title
              </CustomFormLabel>
              <CustomTextField
                id="metaTitle"
                name="metaTitle"
                inputProps={{ maxLength: 90 }}
                value={form.metaTitle}
                onChange={handleChange}
                placeholder="Optimized title for search engines (max 90 chars)"
                fullWidth
              />
              <FormHelperText>{form.metaTitle?.length || 0}/90 characters</FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metakeywords">
                Meta Keywords
              </CustomFormLabel>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1,
                  '&:hover': {
                    borderColor: 'text.primary',
                  },
                  '&:focus-within': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                }}
              >
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeTag(index)}
                    sx={{ mr: 0.5 }}
                  />
                ))}
                <CustomTextField
                  variant="standard"
                  value={inputValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.includes(',')) {
                      const newTags = value
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter((tag) => tag !== '');
                      if (newTags.length > 0) {
                        setTags([...tags, ...newTags]);
                        setInputValue('');
                      }
                    } else {
                      setInputValue(value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (inputValue.trim() !== '') {
                        setTags([...tags, inputValue.trim()]);
                        setInputValue('');
                      }
                    }
                  }}
                  onPaste={(e) => {
                    setTimeout(() => {
                      const pastedText = e.clipboardData.getData('text');
                      if (pastedText.includes(',')) {
                        e.preventDefault();
                        const newTags = pastedText
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter((tag) => tag !== '');
                        if (newTags.length > 0) {
                          setTags([...tags, ...newTags]);
                          setInputValue('');
                        }
                      }
                    }, 0);
                  }}
                  placeholder="Type keywords separated by commas or press Enter"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  style={{ minWidth: '150px' }}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
              <FormHelperText>Type comma to separate or press Enter to add keywords</FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaDescription">
                Meta Description
              </CustomFormLabel>
              <CustomTextField
                id="metaDescription"
                name="metaDescription"
                inputProps={{ maxLength: 250 }}
                value={form.metaDescription}
                onChange={handleChange}
                placeholder="Meta description for search results (max 250 chars)"
                multiline
                rows={4}
                fullWidth
              />
              <FormHelperText>{form.metaDescription?.length || 0}/250 characters</FormHelperText>
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
              aria-label="Create professional category"
            >
              {loading ? 'Creating...' : 'Submit'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit Professional Category Form Component
const EditProfessionalCategoryForm = ({
  onClose,
  onSubmit,
  initialData,
  serviceTypes,
  loading,
}) => {
  const theme = useTheme();

  const [form, setForm] = useState({
    name: initialData?.name || '',
    serviceId: initialData?.serviceId || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialData?.image ? getImageUrl(initialData.image) : null
  );
  const [iconPreview, setIconPreview] = useState(
    initialData?.categoryIcon ? getImageUrl(initialData.categoryIcon) : null
  );

  // Parse comma-separated keywords from API response - handles undefined/null/empty
  const [tags, setTags] = useState(() => {
    if (initialData?.metakeywords && typeof initialData.metakeywords === 'string') {
      return initialData.metakeywords
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');

  // State for service dropdown - prefetch with current service from API response
  const [localServices, setLocalServices] = useState(() => {
    if (initialData?.serviceId && initialData?.serviceName) {
      return [{
        _id: initialData.serviceId,
        name: initialData.serviceName
      }];
    }
    return [];
  });
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        setImageFile(selectedFile);
        setImagePreview(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, or PNG for image.');
      }
    }
  };

  const handleIconChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        setIconFile(selectedFile);
        setIconPreview(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, or PNG for icon.');
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleServiceDropdownOpen = async () => {
    if (!servicesLoaded && !loadingServices) {
      setLoadingServices(true);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token || '';

        if (!token) {
          toast.error('Authentication token missing.');
          return;
        }

        const res = await axios.post(
          URLS.GetActiveServices,
          {
            searchQuery: '',
            serviceType: 'professional',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        const services = res.data.data || res.data.services || [];
        setLocalServices(services);
        setServicesLoaded(true);
      } catch (error) {
        toast.error('Failed to fetch services.');
        console.error('Failed to fetch services:', error);
      } finally {
        setLoadingServices(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Professional category name is required.');
      return;
    }
    if (!form.serviceId) {
      toast.error('Service selection is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('serviceId', form.serviceId);
    formData.append('description', form.description.trim());
    formData.append('status', form.status);
    formData.append('metaTitle', form.metaTitle.trim());
    formData.append('metaDescription', form.metaDescription.trim());
    formData.append('metakeywords', tags.length > 0 ? tags.join(', ') : '');

    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (iconFile) {
      formData.append('categoryIcon', iconFile);
    }

    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <ParentCard
          title="Edit Professional Category"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px', mb: 3 }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="name" required>
                Professional Category Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Professional Category Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Enter professional category name"
              />
            </Grid>

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
                onOpen={handleServiceDropdownOpen}
                fullWidth
                variant="outlined"
                aria-label="Select service"
              >
                {loadingServices ? (
                  <MenuItem disabled>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={20} />
                      <Typography>Loading services...</Typography>
                    </Box>
                  </MenuItem>
                ) : localServices.length > 0 ? (
                  localServices.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No services available</MenuItem>
                )}
              </CustomSelect>
            </Grid>

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

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="description">
                Description
              </CustomFormLabel>
              <CustomTextField
                id="description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                placeholder="Enter description"
                name="description"
                value={form.description}
                onChange={handleChange}
                aria-label="Enter description"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="image">
                Category Image {!imagePreview && '(Required)'}
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={handleImageChange}
                inputProps={{
                  accept: 'image/jpeg,image/png,image/jpg',
                  'aria-label': 'Upload professional category image',
                }}
              />
              {imagePreview && (
                <Box mt={2}>
                  <Typography variant="caption">
                    {imageFile ? 'New Image Preview:' : 'Current Image:'}
                  </Typography>
                  <Avatar
                    src={imagePreview}
                    variant="rounded"
                    sx={{ width: 100, height: 100, mt: 1 }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="categoryIcon">
                Category Icon {!iconPreview && '(Required)'}
              </CustomFormLabel>
              <CustomTextField
                id="categoryIcon"
                type="file"
                variant="outlined"
                fullWidth
                onChange={handleIconChange}
                inputProps={{
                  accept: 'image/jpeg,image/png,image/jpg',
                  'aria-label': 'Upload category icon',
                }}
              />
              {iconPreview && (
                <Box mt={2}>
                  <Typography variant="caption">
                    {iconFile ? 'New Icon Preview:' : 'Current Icon:'}
                  </Typography>
                  <Avatar
                    src={iconPreview}
                    variant="rounded"
                    sx={{ width: 100, height: 100, mt: 1 }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </ParentCard>

        {/* SEO Settings - Separate ParentCard */}
        <ParentCard
          title="SEO Settings"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaTitle">
                Meta Title
              </CustomFormLabel>
              <CustomTextField
                id="metaTitle"
                name="metaTitle"
                inputProps={{ maxLength: 90 }}
                value={form.metaTitle}
                onChange={handleChange}
                placeholder="Optimized title for search engines (max 90 chars)"
                fullWidth
              />
              <FormHelperText>{form.metaTitle?.length || 0}/90 characters</FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metakeywords">
                Meta Keywords
              </CustomFormLabel>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1,
                  '&:hover': {
                    borderColor: 'text.primary',
                  },
                  '&:focus-within': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                }}
              >
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeTag(index)}
                    sx={{ mr: 0.5 }}
                  />
                ))}
                <CustomTextField
                  variant="standard"
                  value={inputValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.includes(',')) {
                      const newTags = value
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter((tag) => tag !== '');
                      if (newTags.length > 0) {
                        setTags([...tags, ...newTags]);
                        setInputValue('');
                      }
                    } else {
                      setInputValue(value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (inputValue.trim() !== '') {
                        setTags([...tags, inputValue.trim()]);
                        setInputValue('');
                      }
                    }
                  }}
                  onPaste={(e) => {
                    setTimeout(() => {
                      const pastedText = e.clipboardData.getData('text');
                      if (pastedText.includes(',')) {
                        e.preventDefault();
                        const newTags = pastedText
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter((tag) => tag !== '');
                        if (newTags.length > 0) {
                          setTags([...tags, ...newTags]);
                          setInputValue('');
                        }
                      }
                    }, 0);
                  }}
                  placeholder="Type keywords separated by commas or press Enter"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  style={{ minWidth: '150px' }}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
              <FormHelperText>Type comma to separate or press Enter to add keywords</FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaDescription">
                Meta Description
              </CustomFormLabel>
              <CustomTextField
                id="metaDescription"
                name="metaDescription"
                inputProps={{ maxLength: 250 }}
                value={form.metaDescription}
                onChange={handleChange}
                placeholder="Meta description for search results (max 250 chars)"
                multiline
                rows={4}
                fullWidth
              />
              <FormHelperText>{form.metaDescription?.length || 0}/250 characters</FormHelperText>
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
              aria-label="Update professional category"
            >
              {loading ? 'Updating...' : 'Submit'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// View Professional Category Dialog Component
const ViewCategoryDialog = ({ open, onClose, categoryId, token }) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && categoryId) {
      fetchCategoryDetails();
    }
  }, [open, categoryId]);

  const fetchCategoryDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getcategorybyid/${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategory(response.data.data || response.data.category || response.data);
    } catch (error) {
      toast.error('Failed to fetch category details.');
      console.error('Failed to fetch category details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Professional Category Details</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : category ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Category Name
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {category.name}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Service
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {category.serviceName || category.serviceId?.name || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={category.status === 'active' ? 'Active' : 'Inactive'}
                size="small"
                color={category.status === 'active' ? 'success' : 'error'}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">
                {category.description || 'No description available'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider>
                <Chip label="SEO Information" size="small" />
              </Divider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Meta Title
              </Typography>
              <Typography variant="body1">
                {category.metaTitle || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Meta Keywords
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {category.metakeywords && category.metakeywords.trim() !== '' ? (
                  category.metakeywords.split(',').map((keyword, index) => (
                    <Chip key={index} label={keyword.trim()} size="small" variant="outlined" />
                  ))
                ) : (
                  <Typography variant="body1">N/A</Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Meta Description
              </Typography>
              <Typography variant="body1">
                {category.metaDescription || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider>
                <Chip label="Media" size="small" />
              </Divider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Category Image
              </Typography>
              {category.image && (
                <Avatar
                  src={getImageUrl(category.image)}
                  variant="rounded"
                  sx={{ width: 150, height: 150 }}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Category Icon
              </Typography>
              {category.categoryIcon && (
                <Avatar
                  src={getImageUrl(category.categoryIcon)}
                  variant="rounded"
                  sx={{ width: 150, height: 150 }}
                />
              )}
            </Grid>
          </Grid>
        ) : (
          <Typography>No data available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Professional Categories Component
const ProfessionalCategories = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [groupedData, setGroupedData] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

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

  const handleEditPopUp = async (rowData) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getcategorybyid/${rowData._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const categoryData = response.data.data || response.data.category || response.data;

      setEditData(categoryData);
      setShowEditForm(true);
      setShowAddForm(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error('Failed to fetch category details.');
      console.error('Failed to fetch category details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setViewDialogOpen(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditData(null);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
    setSearch('');
    setPaginationModel({ page: 0, pageSize: 10 });
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
        res = await axios.put(`${API_BASE_URL}/editcategory/${id}`, formData, config);
      } else {
        res = await axios.post(`${API_BASE_URL}/addcategory`, formData, config);
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message || 'Operation successful!');
        handleCloseForm();
        getData();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm(`Do you really want to delete "${data.name}"?`)) {
      setLoading(true);
      try {
        const res = await axios.delete(`${API_BASE_URL}/deletecategory/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          toast.success(res.data.message || 'Category deleted successfully!');
          getData();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'An error occurred during deletion';
        toast.error(message);
        console.error('Delete error:', error);
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
      const res = await axios.get(`${API_BASE_URL}/getall-categories-grouped-by-service`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const serviceGroups = res.data.data || res.data.categories || [];
      setGroupedData(serviceGroups);
    } catch (error) {
      toast.error('Failed to fetch professional categories.');
      console.error('Failed to fetch professional categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServices = async () => {
    if (!token) {
      return;
    }
    try {
      const res = await axios.post(
        URLS.GetActiveServices,
        {
          searchQuery: '',
          serviceType: 'professional',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const services = res.data.data || res.data.services || [];
      setServiceTypes(services);
    } catch (error) {
      toast.error('Failed to fetch services.');
      console.error('Failed to fetch services:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }
      await getServices();
      await getData();
    };

    fetchData();
  }, [token]);

  const currentCategories = useMemo(() => {
    if (!groupedData || groupedData.length === 0) return [];

    const currentGroup = groupedData[selectedTabIndex];
    if (!currentGroup || !currentGroup.categories) return [];

    return currentGroup.categories;
  }, [groupedData, selectedTabIndex]);

  const filteredCategories = useMemo(() => {
    if (search === '') {
      return currentCategories;
    }
    return currentCategories.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [currentCategories, search]);

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
          return paginationModel.page * paginationModel.pageSize + params.api.getRowIndexRelativeToVisibleRows(params.id) + 1;
        },
      },
      {
        field: 'categoryinfo',
        headerName: 'Professional Category Info',
        flex: 1,
        minWidth: 250,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={getImageUrl(params.row.image)}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">{params.row.name}</Typography>
          </Box>
        ),
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <Typography variant="body2" noWrap>
            {params.row.description || 'N/A'}
          </Typography>
        ),
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
            variant="outlined"
          />
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 180,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            <Button
              size="small"
              color="info"
              variant="contained"
              onClick={() => handleViewCategory(params.row._id)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`View ${params.row.name}`}
            >
              <IconEye stroke={1.5} size={18} />
            </Button>
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
    [loading, paginationModel]
  );

  const rows = useMemo(
    () =>
      filteredCategories?.map((item) => ({
        id: item._id,
        ...item,
      })) || [],
    [filteredCategories]
  );

  return (
    <PageContainer
      title="Professional Categories"
      description="Manage Professional Categories for your platform"
    >
      <Breadcrumb title="Professional Categories" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && (
        <AddProfessionalCategoryForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          serviceTypes={serviceTypes}
          loading={loading}
        />
      )}

      {showEditForm && editData && (
        <EditProfessionalCategoryForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          serviceTypes={serviceTypes}
          loading={loading}
        />
      )}

      <ViewCategoryDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        categoryId={selectedCategoryId}
        token={token}
      />

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
          <Typography variant="h6">Professional Categories List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search professional categories"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              disabled={loading}
              startIcon={<IconPlus size={20} />}
              aria-label="Create new professional category"
            >
              Create Category
            </Button>
          </Box>
        </Box>

        <Divider />

        {groupedData.length > 0 && (
          <Box sx={{ px: 2, pt: 2 }}>
            <StyledTabs
              value={selectedTabIndex}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Service category tabs"
            >
              {groupedData.map((serviceGroup, index) => (
                <StyledTab
                  key={serviceGroup.serviceId || index}
                  label={`${serviceGroup.serviceName} (${serviceGroup.categories?.length || 0})`}
                  aria-label={`${serviceGroup.serviceName} categories`}
                />
              ))}
            </StyledTabs>
          </Box>
        )}

        <CardContent>
          {groupedData.length === 0 && !loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={200}
            >
              <Typography variant="body1" color="text.secondary">
                No categories found. Click "Create Category" to add one.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 20, 50]}
                disableRowSelectionOnClick
                getRowId={(row) => row.id}
                autoHeight
                sx={{
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default ProfessionalCategories;


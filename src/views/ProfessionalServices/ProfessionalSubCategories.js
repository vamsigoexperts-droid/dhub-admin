import React, { useState, useEffect, useMemo } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from '../../components/forms/theme-elements/CustomCheckbox';
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
  FormControlLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';

// API Base URL for Professional Sub Categories
const API_BASE_URL = 'https://api.doorstephub.com/v1/dhubApi/admin/professional-services-subcategory';
const IMAGE_BASE_URL = 'https://api.doorstephub.com';
const CATEGORY_DROPDOWN = 'https://api.doorstephub.com/v1/dhubApi/admin/professional-services-category/getall-categories-grouped-by-service';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Professional Sub Categories' }];

// Utility function to normalize file paths
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

// Add Professional Sub Category Form Component


const AddProfessionalSubCategoryForm = ({ onClose, onSubmit, loading }) => {
  const theme = useTheme();

  const [form, setForm] = useState({
    name: '',
    categoryId: '',
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

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // =============================
  // FETCH CATEGORIES
  // =============================
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        if (!token) {
          toast.error('Authentication token missing.');
          return;
        }

        const res = await axios.get(CATEGORY_DROPDOWN, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const groupedData = res.data?.data || [];
        const allCategories = groupedData.flatMap(group =>
          (group.categories || []).map(cat => ({
            _id: cat._id,
            name: cat.name,
            serviceId: group.serviceId,
          }))
        );

        setCategories(allCategories);
      } catch (err) {
        toast.error('Failed to fetch categories.');
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // =============================
  // HANDLERS
  // =============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ FIXED CATEGORY CHANGE (important)
  const handleCategoryChange = (e) => {
    const selectedId = e?.target?.value ?? e;

    const selectedCategory = categories.find(
      cat => cat._id === selectedId
    );

    setForm(prev => ({
      ...prev,
      categoryId: selectedId,
      serviceId: selectedCategory?.serviceId || '',
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      toast.error('Only JPG, JPEG, PNG allowed.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      toast.error('Only JPG, JPEG, PNG allowed.');
      return;
    }

    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // =============================
  // SUBMIT
  // =============================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error('Sub category name required');
    if (!form.categoryId) return toast.error('Category required');
    if (!imageFile) return toast.error('Banner image required');
    if (!iconFile) return toast.error('Icon required');

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('serviceId', form.serviceId);
    formData.append('categoryId', form.categoryId);
    formData.append('description', form.description.trim());
    formData.append('status', form.status);
    formData.append('metaTitle', form.metaTitle.trim());
    formData.append('metaDescription', form.metaDescription.trim());
    formData.append('metakeywords', tags.join(','));
    formData.append('image', imageFile);
    formData.append('subcategoryIcon', iconFile);

    onSubmit(formData);
  };

  return (
    <Box py={1}>
      <form onSubmit={handleSubmit}>

        {/* BASIC INFO */}
        <ParentCard title="Create Professional Sub Category">
          <Grid container spacing={2} p={2}>

            <Grid item xs={12} md={4}>
              <CustomFormLabel required>Sub Category Name</CustomFormLabel>
              <CustomTextField
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomFormLabel required>Category</CustomFormLabel>
              <CustomSelect
                value={form.categoryId}
                onChange={handleCategoryChange}
                displayEmpty
                fullWidth
                disabled={loadingCategories}
              >
                <MenuItem value="" disabled>Select a category</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomFormLabel>Status</CustomFormLabel>
              <CustomSelect
                name="status"
                value={form.status}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </CustomSelect>
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel>Description</CustomFormLabel>
              <CustomTextField
                multiline
                rows={3}
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* BANNER IMAGE */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel required>Banner Image</CustomFormLabel>
              <CustomTextField type="file" onChange={handleImageChange} fullWidth />
              {imagePreview && (
                <Avatar
                  src={imagePreview}
                  variant="rounded"
                  sx={{ width: 100, height: 100, mt: 1 }}
                />
              )}
            </Grid>

            {/* ICON */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel required>Subcategory Icon</CustomFormLabel>
              <CustomTextField type="file" onChange={handleIconChange} fullWidth />
              {iconPreview && (
                <Avatar
                  src={iconPreview}
                  variant="rounded"
                  sx={{ width: 100, height: 100, mt: 1 }}
                />
              )}
            </Grid>

          </Grid>
        </ParentCard>

        {/* SEO SETTINGS */}
        <ParentCard title="SEO Settings">
          <Grid container spacing={2} p={2}>

            <Grid item xs={12}>
              <CustomFormLabel>Meta Title</CustomFormLabel>
              <CustomTextField
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel>Meta Keywords</CustomFormLabel>
              <Box display="flex" flexWrap="wrap" gap={1} border="1px solid #ccc" p={1}>
                {tags.map((tag, i) => (
                  <Chip key={i} label={tag} onDelete={() => removeTag(i)} />
                ))}
                <CustomTextField
                  variant="standard"
                  value={inputValue}
                  onChange={(e) => {
                    if (e.target.value.includes(',')) {
                      setTags([...tags, ...e.target.value.split(',').map(t => t.trim())]);
                      setInputValue('');
                    } else {
                      setInputValue(e.target.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputValue.trim()) {
                      e.preventDefault();
                      setTags([...tags, inputValue.trim()]);
                      setInputValue('');
                    }
                  }}
                  InputProps={{ disableUnderline: true }}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel>Meta Description</CustomFormLabel>
              <CustomTextField
                multiline
                rows={4}
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

          </Grid>

          <Divider />

          <Box display="flex" justifyContent="flex-end" p={2} gap={1}>
            <Button color="error" variant="outlined" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Creating...' : 'Submit'}
            </Button>
          </Box>
        </ParentCard>

      </form>
    </Box>
  );
};
// Edit Professional Sub Category Form Component
const EditProfessionalSubCategoryForm = ({
  onClose,
  onSubmit,
  initialData,
  categoryTypes,
  serviceTypes,
  loading,
}) => {
  const theme = useTheme();

  const [form, setForm] = useState({
    name: initialData?.name || '',
    categoryId: initialData?.categoryId || '',
    serviceId: initialData?.serviceId || '', // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ FIX
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
    initialData?.subcategoryIcon
      ? getImageUrl(initialData.subcategoryIcon)
      : null
  );

  const [tags, setTags] = useState(() => {
    if (initialData?.metakeywords && typeof initialData.metakeywords === 'string') {
      return initialData.metakeywords
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
    }
    return [];
  });

  const [inputValue, setInputValue] = useState('');

  // =============================
  // CATEGORY DROPDOWN
  // =============================
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        if (!token) {
          toast.error('Authentication token missing.');
          return;
        }

        const res = await axios.get(CATEGORY_DROPDOWN, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const groupedData = res.data?.data || [];
        const allCategories = groupedData.flatMap(group =>
          (group.categories || []).map(cat => ({
            _id: cat._id,
            name: cat.name,
            serviceId: group.serviceId,
            serviceName: group.serviceName,
          }))
        );

        setCategories(allCategories);
      } catch (error) {
        toast.error('Failed to fetch categories.');
        console.error(error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Sync serviceId on initial load (EDIT case)
  useEffect(() => {
    if (form.categoryId && categories.length > 0 && !form.serviceId) {
      const selected = categories.find(c => c._id === form.categoryId);
      if (selected) {
        setForm(prev => ({
          ...prev,
          serviceId: selected.serviceId,
        }));
      }
    }
  }, [categories, form.categoryId, form.serviceId]);

  // =============================
  // HANDLERS
  // =============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ FIXED CATEGORY HANDLER
  const handleCategoryChange = (e) => {
    const selectedId = e?.target?.value ?? e;
    const selectedCategory = categories.find(cat => cat._id === selectedId);

    setForm(prev => ({
      ...prev,
      categoryId: selectedId,
      serviceId: selectedCategory?.serviceId || '',
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      e.target.value = null;
      toast.error('Please choose JPG, JPEG, or PNG for image.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      e.target.value = null;
      toast.error('Please choose JPG, JPEG, or PNG for icon.');
      return;
    }

    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // =============================
  // SUBMIT
  // =============================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Professional sub category name is required.');
      return;
    }

    if (!form.categoryId) {
      toast.error('Category selection is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('serviceId', form.serviceId); // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ FIX
    formData.append('categoryId', form.categoryId);
    formData.append('description', form.description.trim());
    formData.append('status', form.status);
    formData.append('metaTitle', form.metaTitle.trim());
    formData.append('metaDescription', form.metaDescription.trim());
    formData.append('metakeywords', tags.join(','));

    if (imageFile) formData.append('image', imageFile);
    if (iconFile) formData.append('subcategoryIcon', iconFile);

    onSubmit(formData, initialData._id);
  };


  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <ParentCard
          title="Edit Professional Sub Category"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px', mb: 3 }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="name" required>
                Sub Category Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Sub Category Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Enter sub category name"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <CustomFormLabel htmlFor="categoryId" required>
                Category
              </CustomFormLabel>
              <CustomSelect
                id="categoryId"
                value={form.categoryId}
                name="categoryId"
                required
                onChange={handleCategoryChange} // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ FIX
                fullWidth
                variant="outlined"
                disabled={loadingCategories}
              >
                <MenuItem value="" disabled>
                  Select a category
                </MenuItem>
                {categories.map(option => (
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
              <CustomFormLabel htmlFor="image">
                Banner Image {!imagePreview && '(Required)'}
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={handleImageChange}
                inputProps={{
                  accept: 'image/jpeg,image/png,image/jpg',
                  'aria-label': 'Upload banner image',
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
              <CustomFormLabel htmlFor="subcategoryIcon">
                Subcategory Icon {!iconPreview && '(Required)'}
              </CustomFormLabel>
              <CustomTextField
                id="subcategoryIcon"
                type="file"
                variant="outlined"
                fullWidth
                onChange={handleIconChange}
                inputProps={{
                  accept: 'image/jpeg,image/png,image/jpg',
                  'aria-label': 'Upload subcategory icon',
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

        {/* SEO Settings */}
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
              aria-label="Update professional sub category"
            >
              {loading ? 'Updating...' : 'Submit'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// ViewSubCategoryDialog and ProfessionalSubCategory components remain the same as in your file...
// (Copy the rest from file:36 starting from line "// View Sub Category Dialog Component")

// View Sub Category Dialog Component
const ViewSubCategoryDialog = ({ open, onClose, subcategoryId, token }) => {
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && subcategoryId) {
      fetchSubCategoryDetails();
    }
  }, [open, subcategoryId]);

  const fetchSubCategoryDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getsubcategorybyid/${subcategoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubcategory(response.data.data || response.data.subcategory || response.data);
    } catch (error) {
      toast.error('Failed to fetch subcategory details.');
      console.error('Failed to fetch subcategory details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Professional Sub Category Details</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : subcategory ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Sub Category Name
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {subcategory.name}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Service
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {subcategory.serviceName || subcategory.serviceId?.name || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Category
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {subcategory.categoryName || subcategory.categoryId?.name || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={subcategory.status === 'active' ? 'Active' : 'Inactive'}
                size="small"
                color={subcategory.status === 'active' ? 'success' : 'error'}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">
                {subcategory.description || 'No description available'}
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
                {subcategory.metaTitle || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Meta Keywords
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {subcategory.metakeywords && subcategory.metakeywords.trim() !== '' ? (
                  subcategory.metakeywords.split(',').map((keyword, index) => (
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
                {subcategory.metaDescription || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider>
                <Chip label="Media" size="small" />
              </Divider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Banner Image
              </Typography>
              {subcategory.image && (
                <Avatar
                  src={getImageUrl(subcategory.image)}
                  variant="rounded"
                  sx={{ width: 150, height: 150 }}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Subcategory Icon
              </Typography>
              {subcategory.subcategoryIcon && (
                <Avatar
                  src={getImageUrl(subcategory.subcategoryIcon)}
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

// Main Professional Sub Categories Component
const ProfessionalSubCategory = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [groupedData, setGroupedData] = useState([]);
  // const [categoryTypes, setCategoryTypes] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData?.rolesAndPermission?.[0] || {};

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
        `${API_BASE_URL}/getsubcategorybyid/${rowData._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const subcategoryData = response.data.data || response.data.subcategory || response.data;

      setEditData(subcategoryData);
      setShowEditForm(true);
      setShowAddForm(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error('Failed to fetch subcategory details.');
      console.error('Failed to fetch subcategory details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubCategory = (subcategoryId) => {
    setSelectedSubCategoryId(subcategoryId);
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
        res = await axios.put(`${API_BASE_URL}/editsubcategory/${id}`, formData, config);
      } else {
        res = await axios.post(`${API_BASE_URL}/addsubcategory`, formData, config);
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
        const res = await axios.delete(`${API_BASE_URL}/deletesubcategory/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          toast.success(res.data.message || 'Sub category deleted successfully!');
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
      const res = await axios.get(`${API_BASE_URL}/getall-subcategories-grouped-by-service`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const serviceGroups = res.data.data || res.data.subcategories || [];
      setGroupedData(serviceGroups);
    } catch (error) {
      toast.error('Failed to fetch professional sub categories.');
      console.error('Failed to fetch professional sub categories:', error);
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
          serviceType: '',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const services = res.data.services || res.data.data || [];
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
      // await getCategoryData();
      await getData();
    };

    fetchData();
  }, [token]);

  const currentSubCategories = useMemo(() => {
    if (!groupedData || groupedData.length === 0) return [];

    const currentGroup = groupedData[selectedTabIndex];
    if (!currentGroup || !currentGroup.subcategories) return [];

    return currentGroup.subcategories;
  }, [groupedData, selectedTabIndex]);

  const filteredSubCategories = useMemo(() => {
    if (search === '') {
      return currentSubCategories;
    }
    return currentSubCategories.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [currentSubCategories, search]);

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
        field: 'subcategoryinfo',
        headerName: 'Professional Sub Category Info',
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
        field: 'categoryName',
        headerName: 'Category',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Typography variant="body2">
            {params.row.categoryName || 'N/A'}
          </Typography>
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
              onClick={() => handleViewSubCategory(params.row._id)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`View ${params.row.name}`}
            >
              <IconEye stroke={1.5} size={18} />
            </Button>
            {(rolesAndPermission.professional_sub_categories_edit === true ||
              rolesAndPermission.accessAll === true) && (
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
              )}
            {(rolesAndPermission.professional_sub_categories_delete === true ||
              rolesAndPermission.accessAll === true) && (
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
              )}
          </Box>
        ),
      },
    ],
    [loading, paginationModel, rolesAndPermission]
  );

  const rows = useMemo(
    () =>
      filteredSubCategories?.map((item) => ({
        id: item._id,
        ...item,
      })) || [],
    [filteredSubCategories]
  );

  return (
    <PageContainer
      title="Professional Sub Categories"
      description="Manage Professional Sub Categories for your platform"
    >
      <Breadcrumb title="Professional Sub Categories" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && (
        <AddProfessionalSubCategoryForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}

          serviceTypes={serviceTypes}
          loading={loading}
        />
      )}

      {showEditForm && editData && (
        <EditProfessionalSubCategoryForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}

          serviceTypes={serviceTypes}
          loading={loading}
        />
      )}

      <ViewSubCategoryDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        subcategoryId={selectedSubCategoryId}
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
          <Typography variant="h6">Professional Sub-Categories List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search professional sub categories"
            />
            {(rolesAndPermission.professional_sub_categories_add === true ||
              rolesAndPermission.accessAll === true) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create new professional sub category"
                >
                  Create Sub Category
                </Button>
              )}
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
              aria-label="Service sub category tabs"
            >
              {groupedData.map((serviceGroup, index) => (
                <StyledTab
                  key={serviceGroup.serviceId || index}
                  label={`${serviceGroup.serviceName} (${serviceGroup.subcategories?.length || 0})`}
                  aria-label={`${serviceGroup.serviceName} sub categories`}
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
                No sub categories found. Click "Create Sub Category" to add one.
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

export default ProfessionalSubCategory;


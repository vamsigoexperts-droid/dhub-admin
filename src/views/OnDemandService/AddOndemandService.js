import React, { useState, useEffect, useCallback } from 'react';
import { IconArrowBackUp, IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ParentCard from '../../components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';

import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Button,
  Select,
  MenuItem,
  Avatar,
  Box,
  Grid,
  CircularProgress,
  FormHelperText,
  Chip,
  Checkbox,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Add On Demand Service' }];

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const PackageBenefitsSection = ({ benefits, onChange, onAdd, onRemove, loading }) => {
  return (
    <ParentCard title="Service Benefits">
      <Grid container spacing={2}>
        {benefits.map((benefit, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box display="flex" alignItems="flex-end" gap={1}>
              <Box flex={1}>
                <CustomFormLabel htmlFor={`benefitsOfTheService-${index}`}>
                  Service Benefits
                </CustomFormLabel>
                <CustomTextField
                  id={`benefitsOfTheService-${index}`}
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Service Benefits"
                  name="benefitsOfTheService"
                  value={benefit.benefitsOfTheService}
                  onChange={(e) => onChange(index, e)}
                  disabled={loading}
                />
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => onRemove(index)}
                  disabled={benefits.length === 1 || loading}
                  aria-label="Remove benefit"
                >
                  <IconMinus />
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
        <Grid item xs={4} sx={{ mt: 5 }}>
          <Button variant="outlined" onClick={onAdd} aria-label="Add benefit" disabled={loading}>
            <IconPlus />
          </Button>
        </Grid>
      </Grid>
    </ParentCard>
  );
};

// Helper functions for slug generation
const toSlug = (text) => {
  return (text || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const getId = (obj) => {
  if (!obj) return '';
  return String(obj._id || obj.id || '');
};

const AddOndemandService = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    categoryId: '',
    subcategoryId: '',
    childcategoryId: '683dbbfbb62d2a241de0f7e3',
    name: '',
    slug: '',
    videoUrl: '',
    seoTitle: '',
    seoDescription: '',
    stateId: [],
    cityId: [],
    zoneId: [],
    defaultTitle: '',
    defaultPrice: '',
    defaultQuantity: '',
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);

  // ✅ SEPARATE: HTML description for CKEditor
  const [htmlDescription, setHtmlDescription] = useState('');

  // ✅ SEPARATE: Plain text description for backend
  const [description, setDescription] = useState('');

  const [benefitsOfTheService, setBenefitsOfTheService] = useState([
    { benefitsOfTheService: 'Doorstep Inspection' },
    { benefitsOfTheService: 'Repair Estimation at your Doorstep' },
    { benefitsOfTheService: 'Free Inspection Charges with Repair/Service' },
    { benefitsOfTheService: '30 Days to 90 Days Service Warranty on Repairs' },
    { benefitsOfTheService: 'Genuine Spare Parts Guarantee' },
  ]);

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const getToken = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.token || '' : '';
  }, []);

  const [isEditingSlug, setIsEditingSlug] = useState(false);

  // ✅ Fetch Categories, Child Categories, and States on Mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }

    const fetchInitialData = async () => {
      try {
        const [categoryRes, childCategoryRes, statesRes] = await Promise.all([
          axios.post(
            URLS.GetDemandCategory,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.post(
            URLS.GetOnDemandChildCategory,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.post(URLS.GetState, {}, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setCategories(categoryRes.data.ondemandcategorys || []);
        const childCats = childCategoryRes.data.ondemandcategorys || [];
        setChildCategories(childCats);
        // childcategoryId is hardcoded to 'Verified Partners' ID

        setStates(statesRes.data.state || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch initial data.');
      }
    };

    fetchInitialData();
  }, [getToken]);

  // ✅ Fetch Subcategories when Category changes (SINGLE SELECTION)
  useEffect(() => {
    if (!form.categoryId) {
      setSubcategories([]);
      return;
    }

    const token = getToken();
    const fetchSubcategories = async () => {
      try {
        const res = await axios.post(
          URLS.GetOnDemandSubCategorybyCategoryMulti,
          { categoryId: [form.categoryId] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubcategories(res.data.subcategories || []);
      } catch (error) {
        toast.error('Failed to fetch subcategories');
        setSubcategories([]);
      }
    };

    fetchSubcategories();
  }, [form.categoryId, getToken]);

  // ✅ Fetch Cities when States change
  useEffect(() => {
    if (form.stateId && form.stateId.length > 0) {
      const token = getToken();
      axios
        .post(
          URLS.GetStateByCity,
          { state_id: form.stateId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => setCities(res.data.cities || []))
        .catch(() => toast.error('Failed to fetch cities'));
    }
  }, [form.stateId, getToken]);

  // ✅ Fetch Zones when Cities change
  useEffect(() => {
    if (form.cityId && form.cityId.length > 0) {
      const token = getToken();
      axios
        .post(
          URLS.GetCityByZone,
          { cityId: form.cityId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => setZones(res.data.zones || []))
        .catch(() => toast.error('Failed to fetch zones'));
    }
  }, [form.cityId, getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBenefitChange = (index, e) => {
    const newBenefits = [...benefitsOfTheService];
    newBenefits[index][e.target.name] = e.target.value;
    setBenefitsOfTheService(newBenefits);
  };

  const handleAddBenefit = () => {
    setBenefitsOfTheService([...benefitsOfTheService, { benefitsOfTheService: '' }]);
  };

  const handleRemoveBenefit = (index) => {
    const newBenefits = benefitsOfTheService.filter((_, i) => i !== index);
    setBenefitsOfTheService(newBenefits);
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Please upload a JPG or PNG file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remaining = 5 - galleryPreviews.length;
    if (remaining <= 0) {
      toast.error('Maximum 5 gallery images allowed');
      return;
    }

    const toProcess = files.slice(0, remaining);
    const validFiles = toProcess.filter((file) => {
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (!isValidType) toast.error(`${file.name}: Only JPG/PNG allowed`);
      if (!isValidSize) toast.error(`${file.name}: Max 5MB size allowed`);

      return isValidType && isValidSize;
    });

    if (files.length > remaining) {
      toast.warning(`Only ${remaining} image(s) can be added. Maximum 5 allowed.`);
    }

    setGalleryFiles((prev) => [...prev, ...validFiles]);
    setGalleryPreviews((prev) => [...prev, ...validFiles.map((file) => URL.createObjectURL(file))]);
  };

  const removeGalleryImage = (index) => {
    if (!galleryPreviews[index]) return;
    URL.revokeObjectURL(galleryPreviews[index]);
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // ✅ NO VALIDATION - All fields optional
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === 'childcategoryId') {
        formData.append('childcategoryId', '683dbbfbb62d2a241de0f7e3');
      } else if (Array.isArray(form[key])) {
        if (form[key].length > 0) {
          formData.append(key, JSON.stringify(form[key]));
        }
      } else if (form[key]) {
        formData.append(key, form[key]);
      }
    });

    // ✅ Send BOTH plain text and HTML description
    if (description) formData.append('description', description);
    if (htmlDescription) formData.append('description_html', htmlDescription);

    if (tags.length > 0) formData.append('seoTags', tags.join(','));
    if (benefitsOfTheService.length > 0)
      formData.append('benefitsOfTheService', JSON.stringify(benefitsOfTheService));

    if (mainImage) formData.append('mainImage', mainImage);
    galleryFiles.forEach((file) => {
      formData.append('workingImages', file);
    });

    setLoading(true);
    try {
      const res = await axios.post(URLS.AddOnDemandSevice, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        toast.success('Service added successfully!');
        navigate('/ondemandservice/ondemandservices');
      }
    } catch (error) {
      const message =
        error.response?.status === 400
          ? error.response?.data?.message
          : error.response?.data?.message || 'Failed to add service.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      galleryPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [mainImagePreview, galleryPreviews]);

  // ✅ ONLY Auto-generate slug from service name
  useEffect(() => {
    if (isEditingSlug) return;

    const serviceName = form.name || '';
    let slug = toSlug(serviceName);

    if (slug.length > 65) {
      slug = slug.slice(0, 65);
    }

    setForm((prev) => ({ ...prev, slug }));
  }, [form.name, isEditingSlug]);

  // ✅ REMOVED: Auto-sync tags to SEO Title
  // ✅ REMOVED: Auto-sync description to SEO Description

  return (
    <PageContainer title="Add On Demand Service">
      <Breadcrumb title="Add On Demand Service" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ float: 'right', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          startIcon={<IconArrowBackUp />}
          disabled={loading}
        >
          Back
        </Button>
      </Box>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Add Service Details">
          <Grid container spacing={2}>
            {/* ✅ SINGLE SELECT CATEGORY */}
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="categoryId">Category</CustomFormLabel>
              <CustomSelect
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                    subcategoryId: '',
                    childcategoryId: '',
                  }));
                }}
                fullWidth
                displayEmpty
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            {/* ✅ SINGLE SELECT SUBCATEGORY */}
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="subcategoryId">Subcategory</CustomFormLabel>
              <CustomSelect
                id="subcategoryId"
                name="subcategoryId"
                value={form.subcategoryId}
                onChange={handleChange}
                fullWidth
                disabled={!form.categoryId}
                displayEmpty
              >
                <MenuItem value="">
                  {form.categoryId ? 'Select Subcategory' : 'Select Category First'}
                </MenuItem>
                {subcategories.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="name">Service Title</CustomFormLabel>

              <CustomTextField
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Service Title"
                fullWidth
              />
            </Grid>

            <Grid container spacing={4} sx={{ pl: '20px' }}>
              <Grid item xs={6} sm={6} md={3}>
                <CustomFormLabel htmlFor="videoUrl">YouTube URL</CustomFormLabel>
                <CustomTextField
                  id="videoUrl"
                  name="videoUrl"
                  value={form.videoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/example"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomFormLabel htmlFor="slug">Slug (auto-generated)</CustomFormLabel>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  {isEditingSlug ? (
                    <CustomTextField
                      id="slug"
                      name="slug"
                      value={form.slug || ''}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, slug: e.target.value }));
                      }}
                      placeholder="Enter slug (e.g. ac-repair)"
                      fullWidth
                      autoFocus
                      inputProps={{ maxLength: 90 }}
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
                        {form.slug || 'servicename'}
                      </Typography>
                    </Box>
                  )}

                  <IconButton
                    size="small"
                    onClick={() => setIsEditingSlug(!isEditingSlug)}
                    color={isEditingSlug ? 'success' : 'primary'}
                  >
                    {isEditingSlug ? <CheckIcon /> : <EditIcon />}
                  </IconButton>
                </Box>
                <FormHelperText>
                  {isEditingSlug ? 'Edit the full URL path - click ✓ to save' : ''}
                </FormHelperText>
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel>Description</CustomFormLabel>
                <CKEditor
                  editor={ClassicEditor}
                  data={htmlDescription}
                  onChange={(_, editor) => {
                    const html = editor.getData();

                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    const plainText = tempDiv.textContent || tempDiv.innerText || '';

                    setHtmlDescription(html);   // ✅ HTML for UI/display
                    setDescription(plainText);   // ✅ Plain text for backend
                  }}
                  config={{ placeholder: 'Describe your service...' }}
                />
              </Grid>


              <Grid item xs={12} sm={6} md={3}>
                <CustomFormLabel htmlFor="mainImage">Main Image</CustomFormLabel>
                <CustomTextField
                  id="mainImage"
                  type="file"
                  onChange={handleMainImageChange}
                  inputProps={{ accept: 'image/jpeg,image/png' }}
                  fullWidth
                />
                {mainImagePreview && (
                  <Box mt={1}>
                    <Avatar
                      src={mainImagePreview}
                      alt="Main Preview"
                      sx={{ width: 100, height: 100 }}
                      variant="rounded"
                    />
                  </Box>
                )}
              </Grid>
            </Grid>

            <Grid item xs={12} md={9}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CustomFormLabel sx={{ mb: 0 }}>Gallery Images (Multiple)</CustomFormLabel>
                <Typography variant="caption" color="text.secondary">
                  ({galleryPreviews.length}/5)
                </Typography>
              </Box>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {galleryPreviews.map((url, idx) => (
                    <Box key={idx} sx={{ position: 'relative' }}>
                      <Avatar
                        src={url}
                        variant="rounded"
                        sx={{ width: 90, height: 90, border: '1px solid #ddd' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeGalleryImage(idx)}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'error.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'error.dark' },
                          width: 20,
                          height: 20,
                          boxShadow: 2,
                        }}
                      >
                        <IconX size={16} />
                      </IconButton>
                    </Box>
                  ))}
                  {galleryPreviews.length < 5 && (
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        width: 90,
                        height: 90,
                        borderStyle: 'dashed',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        bgcolor: 'white',
                      }}
                    >
                      <IconPlus size={24} />
                      <Typography variant="caption" sx={{ fontSize: '0.6rem', textAlign: 'center' }}>
                        Add
                      </Typography>
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/jpeg,image/png"
                        onChange={handleGalleryImagesChange}
                      />
                    </Button>
                  )}
                  {[...Array(Math.max(0, 5 - galleryPreviews.length - (galleryPreviews.length < 5 ? 1 : 0)))].map((_, i) => (
                    <Box
                      key={`placeholder-${i}`}
                      sx={{
                        width: 90,
                        height: 90,
                        border: '1px dashed #ccc',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0,0,0,0.02)',
                      }}
                    >
                      <IconPlus size={20} color="#ddd" />
                    </Box>
                  ))}
                </Box>
                {galleryPreviews.length === 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Upload up to 5 working images for the gallery.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </ParentCard>

        <ParentCard title="SEO Settings" sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="seoTitle">SEO Title</CustomFormLabel>
              <CustomTextField
                id="seoTitle"
                name="seoTitle"
                inputProps={{ maxLength: 90 }}
                value={form.seoTitle}
                onChange={handleChange}
                placeholder="Optimized title for search engines"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="seoTags">SEO Keywords</CustomFormLabel>
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
                    style: { minWidth: '150px' },
                  }}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
              <FormHelperText>Type comma to separate or press Enter to add keywords</FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="seoDescription">SEO Description</CustomFormLabel>
              <CustomTextField
                id="seoDescription"
                name="seoDescription"
                inputProps={{ maxLength: 200 }}
                value={form.seoDescription}
                onChange={handleChange}
                placeholder="Meta description for search results"
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
          </Grid>
        </ParentCard>

        <PackageBenefitsSection
          benefits={benefitsOfTheService}
          onChange={handleBenefitChange}
          onAdd={handleAddBenefit}
          onRemove={handleRemoveBenefit}
          loading={loading}
        />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Submitting...' : 'Submit Service'}
          </Button>
        </Box>
      </form>
    </PageContainer>
  );
};

export default AddOndemandService;

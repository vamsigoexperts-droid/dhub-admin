import React, { useState, useEffect, useCallback } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from '../../components/forms/theme-elements/CustomCheckbox';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { styled, useTheme } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import { IconArrowBackUp } from '@tabler/icons-react';
import { Delete, Add } from '@mui/icons-material';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Button,
  Select,
  MenuItem,
  Avatar,
  Box,
  Typography,
  Grid,
  Divider,
  FormControlLabel,
  IconButton,
  CircularProgress,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Add Item' }];

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const AddItem = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const [form, setForm] = useState({
    storeId: '',
    categoryId: '',
    name: '',
    price: '',
    discountPrice: '',
    quantity: '',
    description: '',
  });

  const [state, setState] = useState({ isPublish: false });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [addons, setAddons] = useState([{ title: '', price: '' }]);
  const [specifications, setSpecifications] = useState([{ label: '', value: '' }]);

  const getToken = useCallback(() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user)?.token || '' : '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.price || form.price <= 0) errors.price = 'Price must be a positive number';
    if (!form.discountPrice || form.discountPrice < 0)
      errors.discountPrice = 'Discount price cannot be negative';
    if (!form.quantity || form.quantity <= 0)
      errors.quantity = 'Quantity must be a positive number';
    if (!form.storeId) errors.storeId = 'Store is required';
    if (!form.categoryId) errors.categoryId = 'Category is required';
    if (!file) errors.image = 'Image is required';

    addons.forEach((addon, index) => {
      if (!addon.title.trim()) errors[`addonTitle${index}`] = 'Addon title is required';
      if (!addon.price || addon.price <= 0)
        errors[`addonPrice${index}`] = 'Addon price must be positive';
    });

    specifications.forEach((spec, index) => {
      if (!spec.label.trim()) errors[`specLabel${index}`] = 'Specification label is required';
      if (!spec.value.trim()) errors[`specValue${index}`] = 'Specification value is required';
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form, file, addons, specifications]);

  const fetchData = useCallback(async (token) => {
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }
    setDataLoading(true);
    try {
      const [categoryRes, storeRes] = await Promise.all([
        axios.post(URLS.GetCategories, {}, { headers: { Authorization: `Bearer ${token}` } }),
        axios.post(URLS.GetStore, {}, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setCategories(categoryRes.data.category || []);
      setStores(storeRes.data.store || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch data.');
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    fetchData(token);
  }, [getToken, fetchData]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleChangeCheckBox = useCallback((event) => {
    setState((prev) => ({ ...prev, [event.target.name]: event.target.checked }));
  }, []);

  const changeHandler = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB.');
          e.target.value = null;
          return;
        }
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setFormErrors((prev) => ({ ...prev, image: '' }));
      } else {
        e.target.value = null;
        toast.error('Please upload a JPG, JPEG, or PNG file.');
      }
    }
  }, []);

  const handleAddonChange = useCallback((index, e) => {
    const { name, value } = e.target;
    const updatedAddons = [...addons];
    updatedAddons[index][name] = value;
    setAddons(updatedAddons);
    setFormErrors((prev) => ({ ...prev, [`addon${name}${index}`]: '' }));
  }, [addons]);

  const handleAddAddon = useCallback(() => {
    setAddons([...addons, { title: '', price: '' }]);
  }, [addons]);

  const handleDeleteAddon = useCallback((index) => {
    setAddons(addons.filter((_, i) => i !== index));
  }, [addons]);

  const handleSpecChange = useCallback((index, e) => {
    const { name, value } = e.target;
    const updatedSpecs = [...specifications];
    updatedSpecs[index][name] = value;
    setSpecifications(updatedSpecs);
    setFormErrors((prev) => ({ ...prev, [`spec${name}${index}`]: '' }));
  }, [specifications]);

  const handleAddSpec = useCallback(() => {
    setSpecifications([...specifications, { label: '', value: '' }]);
  }, [specifications]);

  const handleDeleteSpec = useCallback((index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  }, [specifications]);

  const resetForm = useCallback(() => {
    setForm({
      storeId: '',
      categoryId: '',
      name: '',
      price: '',
      discountPrice: '',
      quantity: '',
      description: '',
    });
    setState({ isPublish: false });
    setFile(null);
    setPreview(null);
    setAddons([{ title: '', price: '' }]);
    setSpecifications([{ label: '', value: '' }]);
    setFormErrors({});
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        toast.error('Please fix the form errors before submitting.');
        return;
      }

      const token = getToken();
      if (!token) {
        toast.error('Please log in to continue.');
        return;
      }

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('storeId', form.storeId);
      formData.append('quantity', form.quantity);
      formData.append('isPublish', state.isPublish);
      formData.append('categoryId', form.categoryId);
      formData.append('description', form.description);
      formData.append('addons', JSON.stringify(addons));
      formData.append('discountPrice', form.discountPrice);
      formData.append('specifications', JSON.stringify(specifications));
      if (file) formData.append('image', file);

      setLoading(true);
      try {
        const res = await axios.post(URLS.AddItems, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(res.data.message || 'Item added successfully!');
        navigate('/items');
        resetForm();
      } catch (error) {
        const status = error.response?.status;
        let message = 'Failed to add item.';
        if (status === 400) message = 'Unauthorized access. Please log in again.';
        else if (status === 400) message = error.response?.data?.message || 'Invalid input data.';
        else if (status === 500) message = 'Server error. Please try again later.';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [
      form,
      state,
      file,
      addons,
      specifications,
      getToken,
      validateForm,
      resetForm,
      navigate,
    ]
  );

  return (
    <PageContainer title="Add Item" description="Manage Add Item for your e-commerce platform">
      <Breadcrumb title="Add Item" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ float: 'right', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          startIcon={<IconArrowBackUp />}
          aria-label="Go back"
        >
          Back
        </Button>
      </Box>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Create Item Details">
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel required>Name</CustomFormLabel>
              <CustomTextField
                placeholder="Enter name"
                onChange={handleChange}
                variant="outlined"
                value={form.name}
                name="name"
                type="text"
                fullWidth
                required
                error={!!formErrors.name}
                helperText={formErrors.name}
                aria-label="Item name"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel required>Price</CustomFormLabel>
              <CustomTextField
                placeholder="Enter Price"
                onChange={handleChange}
                variant="outlined"
                value={form.price}
                name="price"
                type="number"
                inputProps={{ min: 0, step: '0.01' }}
                fullWidth
                required
                error={!!formErrors.price}
                helperText={formErrors.price}
                aria-label="Item price"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel required>Discount Price</CustomFormLabel>
              <CustomTextField
                placeholder="Enter Discount Price"
                onChange={handleChange}
                variant="outlined"
                value={form.discountPrice}
                name="discountPrice"
                type="number"
                inputProps={{ min: 0, step: '0.01' }}
                fullWidth
                required
                error={!!formErrors.discountPrice}
                helperText={formErrors.discountPrice}
                aria-label="Discount price"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel required>Quantity</CustomFormLabel>
              <CustomTextField
                placeholder="Enter Quantity"
                onChange={handleChange}
                variant="outlined"
                value={form.quantity}
                name="quantity"
                type="number"
                inputProps={{ min: 0 }}
                fullWidth
                required
                error={!!formErrors.quantity}
                helperText={formErrors.quantity}
                aria-label="Item quantity"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel required>Store</CustomFormLabel>
              {dataLoading ? (
                <CircularProgress size={24} />
              ) : (
                <CustomSelect
                  value={form.storeId}
                  onChange={handleChange}
                  variant="outlined"
                  name="storeId"
                  fullWidth
                  required
                  error={!!formErrors.storeId}
                  aria-label="Select store"
                >
                  {stores.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              )}
              {formErrors.storeId && (
                <Typography color="error" variant="caption">
                  {formErrors.storeId}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel required>Category</CustomFormLabel>
              {dataLoading ? (
                <CircularProgress size={24} />
              ) : (
                <CustomSelect
                  value={form.categoryId}
                  name="categoryId"
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                  error={!!formErrors.categoryId}
                  aria-label="Select category"
                >
                  {categories.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              )}
              {formErrors.categoryId && (
                <Typography color="error" variant="caption">
                  {formErrors.categoryId}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel required>Image</CustomFormLabel>
              <CustomTextField
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{ accept: 'image/jpeg,image/png' }}
                error={!!formErrors.image}
                helperText={formErrors.image}
                aria-label="Upload item image"
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar
                    src={preview}
                    sx={{ width: 60, height: 60, mt: 1 }}
                    alt="Item image preview"
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel>Description</CustomFormLabel>
              <CustomTextField
                name="description"
                multiline
                rows={4}
                value={form.description}
                onChange={handleChange}
                fullWidth
                aria-label="Item description"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.isPublish}
                    onChange={handleChangeCheckBox}
                    name="isPublish"
                    color="primary"
                    inputProps={{ 'aria-label': 'Publish item' }}
                  />
                }
                label="Publish Item"
              />
            </Grid>
          </Grid>
        </ParentCard>
        <ParentCard title="Add Addons">
          {addons.map((addon, index) => (
            <Grid container spacing={2} sx={{ p: 2 }} key={index}>
              <Grid item xs={12} sm={5}>
                <CustomFormLabel required>Title</CustomFormLabel>
                <CustomTextField
                  placeholder="Enter Title"
                  variant="outlined"
                  value={addon.title}
                  name="title"
                  type="text"
                  fullWidth
                  required
                  onChange={(e) => handleAddonChange(index, e)}
                  error={!!formErrors[`addonTitle${index}`]}
                  helperText={formErrors[`addonTitle${index}`]}
                  aria-label={`Addon title ${index + 1}`}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <CustomFormLabel required>Price</CustomFormLabel>
                <CustomTextField
                  placeholder="Enter Price"
                  variant="outlined"
                  value={addon.price}
                  name="price"
                  type="number"
                  inputProps={{ min: 0, step: '0.01' }}
                  fullWidth
                  required
                  onChange={(e) => handleAddonChange(index, e)}
                  error={!!formErrors[`addonPrice${index}`]}
                  helperText={formErrors[`addonPrice${index}`]}
                  aria-label={`Addon price ${index + 1}`}
                />
              </Grid>
              <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteAddon(index)}
                  disabled={addons.length === 1}
                  aria-label={`Delete addon ${index + 1}`}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddAddon}
            sx={{ mt: 2 }}
            aria-label="Add another addon"
          >
            Add More
          </Button>
        </ParentCard>
        <ParentCard title="Product Specifications">
          {specifications.map((spec, index) => (
            <Grid container spacing={2} sx={{ p: 2 }} key={index}>
              <Grid item xs={12} sm={5}>
                <CustomFormLabel required>Label</CustomFormLabel>
                <CustomTextField
                  placeholder="Enter Label"
                  variant="outlined"
                  value={spec.label}
                  name="label"
                  type="text"
                  fullWidth
                  required
                  onChange={(e) => handleSpecChange(index, e)}
                  error={!!formErrors[`specLabel${index}`]}
                  helperText={formErrors[`specLabel${index}`]}
                  aria-label={`Specification label ${index + 1}`}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <CustomFormLabel required>Value</CustomFormLabel>
                <CustomTextField
                  placeholder="Enter Value"
                  variant="outlined"
                  value={spec.value}
                  name="value"
                  type="text"
                  fullWidth
                  required
                  onChange={(e) => handleSpecChange(index, e)}
                  error={!!formErrors[`specValue${index}`]}
                  helperText={formErrors[`specValue${index}`]}
                  aria-label={`Specification value ${index + 1}`}
                />
              </Grid>
              <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteSpec(index)}
                  disabled={specifications.length === 1}
                  aria-label={`Delete specification ${index + 1}`}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddSpec}
            sx={{ mt: 2 }}
            aria-label="Add another specification"
          >
            Add More
          </Button>
        </ParentCard>
        <Divider sx={{ my: 2 }} />
        <Box
          display="flex"
          justifyContent="flex-end"
          gap={1}
          sx={{ p: 2, bgcolor: theme.palette.background.paper }}
        >
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading || dataLoading}
            aria-label="Submit item details"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </Box>
      </form>
    </PageContainer>
  );
};

export default AddItem;
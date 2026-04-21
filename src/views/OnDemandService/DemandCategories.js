import React, { useState, useEffect, useMemo } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from '../../components/forms/theme-elements/CustomCheckbox';
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
  FormControlLabel,
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
  FormHelperText,
} from '@mui/material';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'On Demand Category' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Add Category Form Component
const AddCategoryForm = ({ onClose, onSubmit, serviceTypes, Zone }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    serviceId: '',
    metaTitle: '',
    metaDescription: '',
    zoneId: [],
    categoryIcon: null,
  });

  const [state, setState] = useState({
    isPublish: false,
  });

  const [tags, setTags] = useState([]);

  const [inputValue, setInputValue] = useState('');

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleZoneChange = (e) => {
    setForm((prev) => ({ ...prev, zoneId: e.target.value }));
  };

  const handleChangeCheckBox = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [iconPreview, setIconPreview] = useState(null);
  const iconChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIconPreview(URL.createObjectURL(file));
    setForm((p) => ({ ...p, categoryIcon: file }));
  };

  const changeHandler = (e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const ext = selectedFile.name.split(".").pop().toLowerCase();

      // Allow ZIP (no preview possible)
      if (ext === "zip") {
        setFile(selectedFile);
        setPreview(null);
        return;
      }

      // Accept ALL image formats (GIF, SVG, WEBP, HEIC, TIFF, etc.)
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = null;
        toast.error("Please upload a valid image file or ZIP archive.");
      }
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Category name is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('zoneId', JSON.stringify(form.zoneId));
    formData.append('metaTitle', form.metaTitle);
    formData.append('metaDescription', form.metaDescription);
    formData.append('metakeywords', tags.join(','));
    formData.append('serviceId', form.serviceId);
    formData.append('isPublish', state.isPublish);
    if (file) {
      formData.append('image', file);
    }
    if (form.categoryIcon) {
      formData.append('categoryIcon', form.categoryIcon);
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
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="name" required>
                Category Name
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
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                {serviceTypes.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            {/* <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="zoneId">Select Zone</CustomFormLabel>
              <TextField
                select
                SelectProps={{ multiple: true, value: form.zoneId, onChange: handleZoneChange }}
                id="zoneId"
                name="zoneId"
                fullWidth
                required
              >
                {Zone.map((zone) => (
                  <MenuItem key={zone._id} value={zone._id}>
                    {zone.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="image" required>
                Category Banner Image
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: "image/*",
                  'aria-label': 'Upload category image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>



            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="categoryIcon" required>
                Category Icon
              </CustomFormLabel>

              <CustomTextField
                id="categoryIcon"
                type="file"
                variant="outlined"
                fullWidth
                onChange={iconChangeHandler}
                inputProps={{
                  accept: "image/*",
                  "aria-label": "Upload Category Icon",
                }}
              />

              {iconPreview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar
                    src={iconPreview}
                    sx={{ width: 60, height: 60, mt: 1 }}
                  />
                </Box>
              )}
            </Grid>


          </Grid>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.isPublish}
                    onChange={handleChangeCheckBox}
                    name="isPublish"
                    color="primary"
                    inputProps={{ 'aria-label': 'isPublish category' }}
                  />
                }
                label="isPublish"
              />
            </Grid>
          </Grid>
        </ParentCard>
        <ParentCard title="Meta Settings" sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaTitle" required>
                Meta Title
              </CustomFormLabel>
              <CustomTextField
                id="metaTitle"
                name="metaTitle"
                inputProps={{ maxLength: 90 }}
                value={form.metaTitle}
                onChange={handleChange}
                placeholder="Optimized title for search engines"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="metakeywords" required>
                Meta keywords
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
                    style: { minWidth: '150px' },
                  }}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
              <FormHelperText>Type comma to separate or press Enter to add keywords</FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaDescription">Meta Description</CustomFormLabel>
              <CustomTextField
                id="metaDescription"
                name="metaDescription"
                inputProps={{ maxLength: 200 }}
                value={form.metaDescription}
                onChange={handleChange}
                placeholder="Meta description for search results"
                multiline
                rows={4}
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
            <Button color="primary" variant="contained" type="submit" aria-label="Create category">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit Category Form Component
const EditCategoryForm = ({ onClose, onSubmit, initialData, serviceTypes, Zone }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    serviceId: initialData?.serviceId || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    zoneId: initialData?.zoneId || [],
    categoryIcon: null,
  });

  const handleZoneChange = (e) => {
    setForm((prev) => ({ ...prev, zoneId: e.target.value }));
  };

  const [state, setState] = useState({
    isPublish: initialData?.isPublish || false,
  });

  const [tags, setTags] = useState(
    initialData?.metakeywords ? initialData.metakeywords.split(',') : [],
  );

  const [inputValue, setInputValue] = useState('');

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.image ? URLS.FileBase + initialData.image : null);

  const [iconPreview, setIconPreview] = useState(
    initialData?.categoryIcon ? URLS.FileBase + initialData.categoryIcon : null
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeCheckBox = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const changeHandler = (e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const ext = selectedFile.name.split(".").pop().toLowerCase();

      // Allow ZIP (no preview possible)
      if (ext === "zip") {
        setFile(selectedFile);
        setPreview(null);
        return;
      }

      // Accept ALL image formats (GIF, SVG, WEBP, HEIC, TIFF, etc.)
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = null;
        toast.error("Please upload a valid image file or ZIP archive.");
      }
    }
  };


  const iconChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((p) => ({ ...p, categoryIcon: file }));
    setIconPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name) {
      toast.error("Category name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("zoneId", JSON.stringify(form.zoneId));
    formData.append("serviceId", form.serviceId);
    formData.append("isPublish", state.isPublish);
    formData.append("metaTitle", form.metaTitle);
    formData.append("metaDescription", form.metaDescription);
    formData.append("metakeywords", tags.join(","));

    // Append image if new file selected
    if (file) {
      formData.append("image", file);
    }

    // Append categoryIcon if new file selected
    if (form.categoryIcon) {
      formData.append("categoryIcon", form.categoryIcon);
    }

    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Edit Category" sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="name" required>
                Category Name
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
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                {serviceTypes.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="image">Category Banner Image </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: "image/*"
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CustomFormLabel htmlFor="categoryIcon">Category Icon</CustomFormLabel>

            <CustomTextField
              id="categoryIcon"
              type="file"
              fullWidth
              onChange={iconChangeHandler}
              inputProps={{ accept: "image/*" }}
            />

            {iconPreview && (
              <Box mt={1}>
                <Avatar src={iconPreview} sx={{ width: 60, height: 60, mt: 1 }} />
              </Box>
            )}
          </Grid>

          <Grid container spacing={2} sx={{ p: 2 }}>

            <Grid item xs={12} sm={6} md={3}>

              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.isPublish}
                    onChange={handleChangeCheckBox}
                    name="isPublish"
                    color="primary"
                    inputProps={{ 'aria-label': 'isPublish category' }}
                  />
                }
                label="isPublish"
              />
            </Grid>
          </Grid>
        </ParentCard>
        <ParentCard title="SEO Settings" sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaTitle" required>
                Meta Title
              </CustomFormLabel>
              <CustomTextField
                id="metaTitle"
                name="metaTitle"
                inputProps={{ maxLength: 90 }}
                value={form.metaTitle}
                onChange={handleChange}
                placeholder="Optimized title for search engines"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="metakeywords" required>
                Meta keywords
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
                    style: { minWidth: '150px' },
                  }}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
              <FormHelperText>Type comma to separate or press Enter to add keywords</FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="metaDescription">Meta Description</CustomFormLabel>
              <CustomTextField
                id="metaDescription"
                name="metaDescription"
                inputProps={{ maxLength: 200 }}
                value={form.metaDescription}
                onChange={handleChange}
                placeholder="Meta description for search results"
                multiline
                rows={4}
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
            <Button color="primary" variant="contained" type="submit" aria-label="Update category">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};







// Main DemandCategory Component
const DemandCategory = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);

  const [Zone, SetZone] = useState([]);

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const getZone = () => {
    setLoading(true);
    axios
      .post(URLS.GetZones, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => SetZone(res.data.zones || []))
      .catch(() => toast.error('Failed to fetch Zones'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getZone();
  }, []);

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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let res;
      if (id) {
        res = await axios.put(`${URLS.EditDemandCategory}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddDemandCategory, formData, config);
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
    if (window.confirm('Do you really want to delete this category?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteDemandCategory}/${data._id}`, {
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
        URLS.GetDemandCategory,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.ondemandcategorys || []);
    } catch (error) {
      toast.error('Failed to fetch categories.');
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
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
            serviceType: 'professional',
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setServiceTypes(serviceRes.data.services || []);
        await getData();
      } catch (error) {
        toast.error('Failed to fetch data.');
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        width: 70,
        sortable: false,
        filterable: false,
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
        field: 'serviceName',
        headerName: 'Service Name',
        flex: 1,
        minWidth: 150,
      },
      // { field: 'zoneName', headerName: 'Zones', flex: 1 },
      {
        field: 'isPublish',
        headerName: 'isPublish',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <Typography>{params.row.isPublish ? 'Yes' : 'No'}</Typography>,
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => (
          <Chip
            label={params.row.status ? 'Active' : 'Inactive'}
            size="small"
            color={params.row.status ? 'primary' : 'error'}
            variant="outlined"
          />
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1.5,
        minWidth: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={2} alignItems="center">
            {(rolesAndPermission.on_demand_categories_edit === true ||
              rolesAndPermission.accessAll === true) && (
                <Button
                  variant="text"
                  size="small"
                  startIcon={<IconEdit stroke={1.5} size={16} />}
                  onClick={() => handleEditPopUp(params.row)}
                  disabled={loading}
                  sx={{
                    padding: '15',
                    minWidth: 'auto',
                    textTransform: 'none',
                    fontWeight: 500,
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'Green',
                      textDecoration: 'underline',
                    },
                  }}
                  aria-label={`Edit ${params.row.name}`}
                >
                  Edit
                </Button>
              )}

            {(rolesAndPermission.on_demand_categories_delete === true ||
              rolesAndPermission.accessAll === true) && (
                <Button
                  variant="text"
                  size="small"
                  startIcon={<IconTrash stroke={1.5} size={16} />}
                  onClick={() => handleDelete(params.row)}
                  disabled={loading}
                  sx={{
                    padding: '15',
                    minWidth: 'auto',
                    textTransform: 'none',
                    fontWeight: 500,
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'red',
                      textDecoration: 'underline',
                    },
                  }}
                  aria-label={`Delete ${params.row.name}`}
                >
                  Delete
                </Button>
              )}
          </Box>
        ),
      }

    ],
    [loading, rolesAndPermission],
  );

  const rows = useMemo(
    () =>
      filteredData?.map((item, index) => ({
        id: index,
        ...item,
        serviceName: item.serviceName || serviceTypes.find((service) => service._id === item.serviceId)?.name || 'N/A',
      })) || [],
    [filteredData, serviceTypes],
  );

  return (
    <PageContainer
      title="On Demand Category"
      description="Manage On Demand Category for your e-commerce platform"
    >
      <Breadcrumb title="On Demand Category" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      {showAddForm && (
        <AddCategoryForm
          serviceTypes={serviceTypes}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          Zone={Zone}
        />
      )}
      {showEditForm && (
        <EditCategoryForm
          serviceTypes={serviceTypes}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          Zone={Zone}
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
          <Typography variant="h6">On Demand Category List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'background.paper' }}
              aria-label="Search On Demand Category"
            />
            {rolesAndPermission.on_demand_categories_add === true || rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create On Demand category"
                >
                  Create On Demand Category
                </Button>
              </>
            ) : null}
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

export default DemandCategory;


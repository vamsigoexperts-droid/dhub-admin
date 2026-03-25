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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'On Demand Coupons' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Add Coupon Form Component
const AddCouponForm = ({ onClose, onSubmit, categories, subcategories }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    providerId: '',
    code: '',
    discountType: '',
    discount: '',
    expiresAt: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    limitforUser: '',
    fromDate: '',
  });

  const [state, setState] = useState({
    isPublic: false,
    enable: false,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeCheckBox = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
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
    if (!form.code) {
      toast.error('Coupon Code is required.');
      return;
    }

    if (!file) {
      toast.error('Image is required for new Coupons.');
      return;
    }

    const formData = new FormData();
    formData.append('code', form.code);
    formData.append('limitforUser', form.limitforUser);
    formData.append('discountType', form.discountType);
    formData.append('categoryId', form.categoryId);
    formData.append('subcategoryId', form.subcategoryId);
    formData.append('discount', form.discount);
    formData.append('expiresAt', form.expiresAt);
    formData.append('fromDate', form.fromDate);
    formData.append('description', form.description);
    formData.append('isPublic', state.isPublic);
    formData.append('enable', state.enable);
    formData.append('image', file);
    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Create Coupon" sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}>
          <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel required>
                Coupon Code <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                placeholder="Enter Coupon Code"
                onChange={handleChange}
                variant="outlined"
                value={form.code}
                name="code"
                type="text"
                fullWidth
                required
              />
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="categoryId" required>
                Category <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="subcategoryId" required>
                Subcategory <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                id="subcategoryId"
                name="subcategoryId"
                value={form.subcategoryId}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="" disabled>
                  Select Subcategory
                </MenuItem>
                {subcategories.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel required>
                Discount Type <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                value={form.discountType}
                name="discountType"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
              >
                <MenuItem value={'percent'}>Percent</MenuItem>
                <MenuItem value={'fixed'}>Fixed</MenuItem>
              </CustomSelect>
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel required>
                Discount <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                placeholder="Enter Discount"
                onChange={handleChange}
                variant="outlined"
                value={form.discount}
                name="discount"
                type="number"
                fullWidth
                required
              />
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel required>
                Limit for User <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                placeholder="Enter limit for User"
                onChange={handleChange}
                variant="outlined"
                value={form.limitforUser}
                name="limitforUser"
                type="number"
                fullWidth
                required
              />
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel required>
                From Date <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                onChange={handleChange}
                variant="outlined"
                value={form.fromDate}
                name="fromDate"
                type="date"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel required>
                Expires At <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                onChange={handleChange}
                variant="outlined"
                value={form.expiresAt}
                name="expiresAt"
                type="date"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="image" required>
                Image <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                  'aria-label': 'Upload Coupon image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="description">
                Description <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Coupon description"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.isPublic}
                    onChange={handleChangeCheckBox}
                    name="isPublic"
                    color="primary"
                    inputProps={{ 'aria-label': 'Is Public' }}
                  />
                }
                label="Is Public"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.enable}
                    onChange={handleChangeCheckBox}
                    name="enable"
                    color="primary"
                    inputProps={{ 'aria-label': 'Enabled' }}
                  />
                }
                label="Enabled"
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
            <Button color="primary" variant="contained" type="submit" aria-label="Create Coupon">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit Coupon Form Component
const EditCouponForm = ({ onClose, onSubmit, initialData, categories, subcategories }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    code: initialData?.code || '',
    discountType: initialData?.discountType || '',
    discount: initialData?.discount || '',
    expiresAt: initialData?.expiresAt || '',
    description: initialData?.description || '',
    categoryId: initialData?.categoryId || '',
    subcategoryId: initialData?.subcategoryId || '',
    limitforUser: initialData?.limitforUser || '',
    fromDate: initialData?.fromDate || '',
  });

  const [state, setState] = useState({
    isPublic: initialData?.isPublic || false,
    enable: initialData?.enable || false,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.image ? URLS.FileBase + initialData.image : null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeCheckBox = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
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
    if (!form.code) {
      toast.error('Coupon Code is required.');
      return;
    }

    const formData = new FormData();

    formData.append('code', form.code);
    formData.append('discountType', form.discountType);
    formData.append('fromDate', form.fromDate);
    formData.append('limitforUser', form.limitforUser);
    formData.append('categoryId', form.categoryId);
    formData.append('subcategoryId', form.subcategoryId);
    formData.append('discount', form.discount);
    formData.append('expiresAt', form.expiresAt);
    formData.append('description', form.description);
    formData.append('isPublic', state.isPublic);
    formData.append('enable', state.enable);
    if (file) {
      formData.append('image', file);
    }

    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Edit Coupon" sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}>
          <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel required>
                Coupon Code <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                placeholder="Enter Coupon Code"
                onChange={handleChange}
                variant="outlined"
                value={form.code}
                name="code"
                type="text"
                fullWidth
                required
              />
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="categoryId" required>
                Category <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="subcategoryId" required>
                Subcategory <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                id="subcategoryId"
                name="subcategoryId"
                value={form.subcategoryId}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="" disabled>
                  Select Subcategory
                </MenuItem>
                {subcategories.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel required>
                Discount Type <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomSelect
                value={form.discountType}
                name="discountType"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
              >
                <MenuItem value={'percent'}>Percent</MenuItem>
                <MenuItem value={'fixed'}>Fixed</MenuItem>
              </CustomSelect>
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel required>Discount</CustomFormLabel>
              <CustomTextField
                placeholder="Enter Discount"
                onChange={handleChange}
                variant="outlined"
                value={form.discount}
                name="discount"
                type="number"
                fullWidth
                required
              />
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel required>
                Limit for User <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                placeholder="Enter limit for User"
                onChange={handleChange}
                variant="outlined"
                value={form.limitforUser}
                name="limitforUser"
                type="number"
                fullWidth
                required
              />
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel required>
                From Date <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                onChange={handleChange}
                variant="outlined"
                value={form.fromDate}
                name="fromDate"
                type="date"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel required>
                Expires At <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                onChange={handleChange}
                variant="outlined"
                value={form.expiresAt}
                name="expiresAt"
                type="date"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
      <Grid item xs={12} sm={6} md={3}>
              <CustomFormLabel htmlFor="image">
                Image <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                  'aria-label': 'Upload Coupon image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="description">
                Description <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Coupon description"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.isPublic}
                    onChange={handleChangeCheckBox}
                    name="isPublic"
                    color="primary"
                    inputProps={{ 'aria-label': 'Is Public' }}
                  />
                }
                label="Is Public"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.enable}
                    onChange={handleChangeCheckBox}
                    name="enable"
                    color="primary"
                    inputProps={{ 'aria-label': 'Enabled' }}
                  />
                }
                label="Enabled"
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
            <Button color="primary" variant="contained" type="submit" aria-label="Update Coupon">
              Update
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main OnDemandCoupons Component
const OnDemandCoupons = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      let res;
      if (id) {
        res = await axios.put(`${URLS.EditOnDemandCoupon}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddOnDemandCoupon, formData, config);
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

    if (window.confirm('Do you really want to delete this Coupon?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeletOnDemandCoupon}/${data._id}`, {
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
        URLS.GetOnDemandCoupon,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.coupons || []);
    } catch (error) {
      toast.error('Failed to fetch Coupons.');
      console.error('Failed to fetch Coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndSubcategories = async () => {
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }

    try {
      const [categoryRes, subcategoryRes] = await Promise.all([
        axios.post(URLS.GetDemandCategory, {}, { headers: { Authorization: `Bearer ${token}` } }),
        axios.post(
          URLS.GetOnDemandSubCategory,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      ]);
      setCategories(categoryRes.data.ondemandcategorys || []);
      setSubcategories(subcategoryRes.data.ondemandsubcategorys || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch data.');
    }
  };

  useEffect(() => {
    fetchCategoriesAndSubcategories();
    getData();
  }, []);

  useEffect(() => {
    if (search === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.code.toLowerCase().includes(search.toLowerCase()),
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
          const rowIndex = data.findIndex((row) => row._id === params.row._id);
          return rowIndex + 1;
        },
      },
      {
        field: 'couponinfo',
        headerName: 'Coupon Info',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={params.row.image ? `${URLS.FileBase}${params.row.image}` : ''}
              alt={params.row.code}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">{params.row.code}</Typography>
          </Box>
        ),
      },
      {
        field: 'discount',
        headerName: 'Discount',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'expiresAt',
        headerName: 'Expires At',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'isPublic',
        headerName: 'isPublic',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <Typography>{params.row.isPublic ? 'Yes' : 'No'}</Typography>,
      },
      {
        field: 'enable',
        headerName: 'Status',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => (
          <Chip
            label={params.row.enable ? 'Active' : 'Inactive'}
            size="small"
            color={params.row.enable ? 'primary' : 'error'}
            variant="outlined"
          />
        ),
      },
{
  field: 'action',
  headerName: 'Action',
  flex: 1,
  minWidth: 180,
  sortable: false,
  filterable: false,
  renderCell: (params) => (
    <Box display="flex" gap={1}>
      {(rolesAndPermission.on_demand_coupons_edit ||
        rolesAndPermission.accessAll) && (
        <Button
          size="small"
          color="primary"
          variant="contained"
          startIcon={<IconEdit stroke={1.5} size={18} />}
          onClick={() => handleEditPopUp(params.row)}
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontSize: '13px',
            padding: '4px 10px',
          }}
          aria-label={`Edit ${params.row.code}`}
        >
          Edit
        </Button>
      )}

      {(rolesAndPermission.on_demand_coupons_delete ||
        rolesAndPermission.accessAll) && (
        <Button
          size="small"
          color="error"
          variant="contained"
          startIcon={<IconTrash stroke={1.5} size={18} />}
          onClick={() => handleDelete(params.row)}
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontSize: '13px',
            padding: '4px 10px',
          }}
          aria-label={`Delete ${params.row.code}`}
        >
          Delete
        </Button>
      )}
    </Box>
  ),
}
,
    ],
    [loading, data],
  );

  return (
    <PageContainer
      title="On Demand Coupons"
      description="Manage On Demand Coupons for your e-commerce platform"
    >
      <Breadcrumb title="On Demand Coupons" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      {showAddForm && (
        <AddCouponForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          categories={categories}
          subcategories={subcategories}
        />
      )}
      {showEditForm && (
        <EditCouponForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          categories={categories}
          subcategories={subcategories}
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
          <Typography variant="h6">On Demand Coupons List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by coupon code"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Coupons"
            />
            {rolesAndPermission.on_demand_coupons_add === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create new Coupon"
                >
                  Create Coupon
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
              rows={filteredData}
              columns={columns}
              loading={loading}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              autoHeight
              getRowId={(row) => row._id}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default OnDemandCoupons;

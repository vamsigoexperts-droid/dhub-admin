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
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Banners' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Add Banner Form Component
const AddBannerForm = ({ onClose, onSubmit, serviceTypes, City }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    title: '',
    setOrder: '',
    cityId: [],
    serviceId: '',
  });

  const [state, setState] = useState({
    isPublish: false,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [file1, setFile1] = useState(null);
  const [preview1, setPreview1] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCityChange = (e) => {
    setForm((prev) => ({ ...prev, cityId: e.target.value }));
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

  const changeHandler1 = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        setFile1(selectedFile);
        setPreview1(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, or PNG.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Banner title is required.');
      return;
    }

    if (!file) {
      toast.error('Image is required for new Banners.');
      return;
    }

    const formData = new FormData();
    formData.append('cityId', JSON.stringify(form.cityId));
    formData.append('serviceId', form.serviceId);
    formData.append('title', form.title);
    formData.append('setOrder', form.setOrder);
    formData.append('isPublish', state.isPublish);
    formData.append('appBanner', file);
    formData.append('webBanner', file1);
    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Create Banner" sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel required>Banner title</CustomFormLabel>
              <CustomTextField
                placeholder="Enter Banner title"
                onChange={handleChange}
                variant="outlined"
                value={form.title}
                name="title"
                type="text"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel required>Set Order</CustomFormLabel>
              <CustomTextField
                placeholder="Enter Set Order"
                onChange={handleChange}
                variant="outlined"
                value={form.setOrder}
                name="setOrder"
                type="number"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={4} sx={{ padding: 1 }}>
              <CustomFormLabel htmlFor="cityId">Select City</CustomFormLabel>
              <TextField
                select
                SelectProps={{ multiple: true, value: form.cityId, onChange: handleCityChange }}
                id="cityId"
                name="cityId"
                fullWidth
                required
              >
                {City.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel>App Banner</CustomFormLabel>
              <CustomTextField
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel>Web Banner</CustomFormLabel>
              <CustomTextField
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler1}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                }}
              />
              {preview1 && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview1} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.isPublish}
                    onChange={handleChangeCheckBox}
                    name="isPublish"
                    color="primary"
                    inputProps={{ 'aria-label': 'Is Public' }}
                  />
                }
                label="Is Public"
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
            <Button color="primary" variant="contained" type="submit" aria-label="Create Banner">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit Banner Form Component
const EditBannerForm = ({ onClose, onSubmit, initialData, serviceTypes, City }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    serviceId: initialData?.serviceId || '',
    title: initialData?.title || '',
    setOrder: initialData?.setOrder || '',
    cityId: initialData?.cityId || [],
  });

  const [state, setState] = useState({
    isPublish: initialData?.isPublish || false,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    initialData?.appBanner ? URLS.FileBase + initialData.appBanner : null,
  );

  const [file1, setFile1] = useState(null);
  const [preview1, setPreview1] = useState(
    initialData?.webBanner ? URLS.FileBase + initialData.webBanner : null,
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCityChange = (e) => {
    setForm((prev) => ({ ...prev, cityId: e.target.value }));
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

  const changeHandler1 = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        setFile1(selectedFile);
        setPreview1(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, or PNG.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Banner title is required.');
      return;
    }

    const formData = new FormData();
    formData.append('cityId', JSON.stringify(form.cityId));
    formData.append('serviceId', form.serviceId);
    formData.append('title', form.title);
    formData.append('setOrder', form.setOrder);
    formData.append('isPublish', state.isPublish);
    if (file) {
      formData.append('appBanner', file);
    }
    if (file1) {
      formData.append('webBanner', file1);
    }
    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Edit Banner" sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel required>Banner title</CustomFormLabel>
              <CustomTextField
                placeholder="Enter Banner title"
                onChange={handleChange}
                variant="outlined"
                value={form.title}
                name="title"
                type="text"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel required>Set Order</CustomFormLabel>
              <CustomTextField
                placeholder="Enter Set Order"
                onChange={handleChange}
                variant="outlined"
                value={form.setOrder}
                name="setOrder"
                type="number"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={4} sx={{ padding: 1 }}>
              <CustomFormLabel htmlFor="cityId">Select City</CustomFormLabel>
              <TextField
                select
                SelectProps={{ multiple: true, value: form.cityId, onChange: handleCityChange }}
                id="cityId"
                name="cityId"
                fullWidth
                required
              >
                {City.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel>App Banner</CustomFormLabel>
              <CustomTextField
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel>Web Banner</CustomFormLabel>
              <CustomTextField
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler1}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                }}
              />
              {preview1 && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview1} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={3}>
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={state.isPublish}
                    onChange={handleChangeCheckBox}
                    name="isPublish"
                    color="primary"
                    inputProps={{ 'aria-label': 'Is Public' }}
                  />
                }
                label="Is Public"
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
            <Button color="primary" variant="contained" type="submit" aria-label="Create Banner">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main Banners Component
const Banners = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [City, SetCity] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const getCity = () => {
    setLoading(true);
    axios
      .post(URLS.GetCity, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => SetCity(res.data.city || []))
      .catch(() => toast.error('Failed to fetch cities'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCity();
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
        res = await axios.put(`${URLS.EditBannerItems}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddBannerItems, formData, config);
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

    if (window.confirm('Do you really want to delete this Banner?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteBannerItems}/${data._id}`, {
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
        URLS.GetBannerItems,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.banneritem || []);
    } catch (error) {
      toast.error('Failed to fetch Banners.');
      console.error('Failed to fetch Banners:', error);
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
          URLS.GetService,
          {},
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
        item.title.toLowerCase().includes(search.toLowerCase()),
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
        field: 'Bannerinfo',
        headerName: 'Banner Info',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={URLS.FileBase + params.row.webBanner}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">{params.row.title}</Typography>
          </Box>
        ),
      },
      {
        field: 'setOrder',
        headerName: 'Banner Position',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'serviceName',
        headerName: 'Service Name',
        flex: 1,
        minWidth: 150,
      },
      { field: 'cityName', headerName: 'Cities', flex: 1 },
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
        flex: 1,
        minWidth: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            {rolesAndPermission.banner_items_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
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
              </>
            ) : (
              <></>
            )}
            {rolesAndPermission.banner_items_delete === true ||
            rolesAndPermission.accessAll === true ? (
              <>
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
              </>
            ) : (
              <></>
            )}
          </Box>
        ),
      },
    ],
    [loading],
  );

  const rows = useMemo(
    () =>
      filteredData?.map((item, index) => ({
        id: index,
        ...item,
        serviceName: serviceTypes.find((service) => service._id === item.serviceId)?.name || 'N/A',
      })) || [],
    [filteredData, serviceTypes],
  );

  return (
    <PageContainer title="Banners" description="Manage Banners for your e-commerce platform">
      <Breadcrumb title="Banners" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && (
        <AddBannerForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          serviceTypes={serviceTypes}
          City={City}
        />
      )}
      {showEditForm && (
        <EditBannerForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          serviceTypes={serviceTypes}
          City={City}
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
          <Typography variant="h6">Banners List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Banners"
            />{' '}
            {rolesAndPermission.banner_items_add === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create new Banner"
                >
                  Create Banner
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

export default Banners;

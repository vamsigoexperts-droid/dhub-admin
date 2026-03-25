import React, { useState, useEffect } from 'react';
import { IconPlus, IconEdit, IconTrash, IconX, IconSearch } from '@tabler/icons-react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import { toast, ToastContainer } from 'react-toastify';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'App Settings' }];

function AppSettings() {
  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];
  const token = authData?.token;

  const [mode, setMode] = useState('list');
  const [formData, setFormData] = useState({
    cityId: '',
    displayType: 'service',
  });
  const [appSettings, setAppSettings] = useState([]);
  const [filteredSettings, setFilteredSettings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAppSettings();
    fetchCities();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredSettings(appSettings);
    } else {
      const filtered = appSettings.filter(
        (item) =>
          item.cityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.displayType?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredSettings(filtered);
    }
  }, [appSettings, searchTerm]);

  const fetchAppSettings = () => {
    setLoading(true);
    axios
      .post(
        URLS.GetAppSettings,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        setAppSettings(res.data.appdisplaysetting || []);
      })
      .catch((err) => {
        console.error('Failed to fetch app settings:', err);
        toast.error('Failed to fetch app settings');
      })
      .finally(() => setLoading(false));
  };

  const fetchCities = () => {
    axios
      .post(
        URLS.GetCity,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        setCities(res.data.city || []);
      })
      .catch((err) => {
        console.error('Failed to fetch cities:', err);
        toast.error('Failed to fetch cities');
      });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cityId) {
      newErrors.cityId = 'City is required';
    }

    if (!formData.displayType) {
      newErrors.displayType = 'Display type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    const url = mode === 'add' ? URLS.AddAppSettings : `${URLS.EditAppSettings}${formData._id}`;

    const method = mode === 'add' ? 'post' : 'put';

    const { _id, ...submitData } = formData;
    const payload = mode === 'add' ? submitData : formData;

    axios[method](url, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        toast.success(res.data.message);
        resetForm();
        fetchAppSettings();
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.message ||
          (mode === 'add' ? 'Failed to create setting' : 'Failed to update setting');
        toast.error(errorMsg);
      })
      .finally(() => setSubmitting(false));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this app setting?')) {
      axios
        .delete(`${URLS.DeleteAppSettings}${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast.success(res.data.message);
          fetchAppSettings();
        })
        .catch((err) => {
          const errorMsg = err.response?.data?.message || 'Failed to delete setting';
          toast.error(errorMsg);
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleEdit = (row) => {
    setFormData({
      _id: row.id,
      cityId: row.cityId,
      displayType: row.displayType,
    });
    setMode('edit');
  };

  const resetForm = () => {
    setFormData({
      cityId: '',
      displayType: 'service',
    });
    setErrors({});
    setMode('list');
  };

  const columns = [
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
      field: 'cityName',
      headerName: 'City',
      flex: 1,
    },
    {
      field: 'displayType',
      headerName: 'Display Type',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'service' ? 'primary' : 'secondary'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,

      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {rolesAndPermission.app_settings_edit === true ||
          rolesAndPermission.accessAll === true ? (
            <>
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={() => handleEdit(params.row)}
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

          {rolesAndPermission.app_settings_edit === true ||
          rolesAndPermission.accessAll === true ? (
            <>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => handleDelete(params.row.id)}
                disabled={loading}
                sx={{ minWidth: '32px', padding: '4px 6px' }}
                aria-label={`Delete ${params.row.name}`}
              >
                <IconTrash stroke={1.5} size={18} />
              </Button>{' '}
            </>
          ) : (
            <></>
          )}
        </Box>
      ),
    },
  ];

  const rows = filteredSettings.map((item, index) => ({
    id: item._id || index,
    cityId: item.cityId,
    cityName: cities.find((c) => c._id === item.cityId)?.name || 'Unknown City',
    displayType: item.displayType,
  }));

  return (
    <PageContainer title="App Settings" description="Manage app display settings">
      <Breadcrumb title="App Settings" items={BCrumb} />
      {(mode === 'add' || mode === 'edit') && (
        <Card sx={{ mb: 3 }} elevation={3}>
          <CardHeader
            title={
              <Typography variant="h5">
                {mode === 'add' ? 'Create App Setting' : 'Edit App Setting'}
              </Typography>
            }
            action={
              <IconButton onClick={resetForm} aria-label="Close">
                <IconX />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.cityId}>
                    <TextField
                      select
                      label="City"
                      name="cityId"
                      value={formData.cityId}
                      onChange={handleInputChange}
                      required
                      error={!!errors.cityId}
                      helperText={errors.cityId}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city._id} value={city._id}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" error={!!errors.displayType}>
                    <FormLabel component="legend">Display Type</FormLabel>
                    <RadioGroup
                      row
                      name="displayType"
                      value={formData.displayType}
                      onChange={handleInputChange}
                    >
                      <FormControlLabel value="service" control={<Radio />} label="Service" />
                      <FormControlLabel value="category" control={<Radio />} label="Category" />
                    </RadioGroup>
                    {errors.displayType && (
                      <Typography variant="caption" color="error">
                        {errors.displayType}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={resetForm} disabled={submitting}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      startIcon={submitting ? <CircularProgress size={16} /> : null}
                    >
                      {mode === 'add' ? 'Create' : 'Update'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}
      <Card elevation={3}>
        <CardHeader
          title={<Typography variant="h5">App Settings</Typography>}
          action={
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Search settings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <IconSearch size={18} style={{ marginRight: 8 }} />,
                }}
              />
              {rolesAndPermission.app_settings_edit === true ||
              rolesAndPermission.accessAll === true ? (
                <>
                  <Button
                    variant="contained"
                    startIcon={<IconPlus size={18} />}
                    onClick={() => setMode('add')}
                  >
                    Add Setting
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Box>
          }
        />
        <Divider />
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : appSettings.length === 0 ? (
            <Alert severity="info">No app settings found. Click "Add Setting" to create one.</Alert>
          ) : filteredSettings.length === 0 ? (
            <Alert severity="warning">No settings match your search criteria.</Alert>
          ) : (
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 25]}
                disableSelectionOnClick
                components={{
                  Toolbar: GridToolbar,
                }}
                sx={{
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </PageContainer>
  );
}

export default AppSettings;

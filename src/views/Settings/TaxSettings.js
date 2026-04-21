import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Select,
  MenuItem,
  TextField,
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
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Tax Settings' }];

// Add TaxSetting Form Component
const AddTaxSettingForm = ({ onClose, onSubmit, serviceTypes, countries }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    countryId: '',
    serviceId: '',
    title: '',
    taxType: '',
    taxAmount: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Tax Setting title is required.');
      return;
    }

    const formData = {
      countryId: form.countryId,
      serviceId: form.serviceId,
      title: form.title,
      taxType: form.taxType,
      taxAmount: parseFloat(form.taxAmount), // Ensure taxAmount is a number
    };
    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create Tax Setting"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="title" required>
                Tax Title
              </CustomFormLabel>
              <CustomTextField
                id="title"
                variant="outlined"
                fullWidth
                placeholder="Enter Tax Title"
                name="title"
                value={form.title}
                required
                type="text"
                onChange={handleChange}
                aria-label="Tax Title"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="countryId" required>
                Country
              </CustomFormLabel>
              <Select
                id="countryId"
                value={form.countryId}
                name="countryId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select country"
              >
                {countries.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="serviceId" required>
                Service
              </CustomFormLabel>
              <Select
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
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="taxType" required>
                Tax Type
              </CustomFormLabel>
              <Select
                id="taxType"
                value={form.taxType}
                name="taxType"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select tax type"
              >
                <MenuItem value="Percentage">Percentage</MenuItem>
                <MenuItem value="Fix">Fix</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="taxAmount" required>
                Tax Value
              </CustomFormLabel>
              <CustomTextField
                id="taxAmount"
                variant="outlined"
                fullWidth
                placeholder="Enter Tax Value"
                name="taxAmount"
                value={form.taxAmount}
                required
                type="number"
                inputProps={{ step: '0.01', min: 0 }} // Allow decimal values
                onChange={handleChange}
                aria-label="Tax Value"
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
            <Button color="error" variant="outlined" onClick={onClose} aria-label="Cancel form">
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              aria-label="Create Tax Setting"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit TaxSetting Form Component
const EditTaxSettingForm = ({ onClose, onSubmit, initialData, serviceTypes, countries }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    countryId: initialData?.countryId || '',
    serviceId: initialData?.serviceId || '',
    title: initialData?.title || '',
    taxType: initialData?.taxType || '',
    taxAmount: initialData?.taxAmount || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Tax Setting title is required.');
      return;
    }

    const formData = {
      countryId: form.countryId,
      serviceId: form.serviceId,
      title: form.title,
      taxType: form.taxType,
      taxAmount: parseFloat(form.taxAmount), // Ensure taxAmount is a number
    };

    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit Tax Setting"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="title" required>
                Tax Title
              </CustomFormLabel>
              <CustomTextField
                id="title"
                variant="outlined"
                fullWidth
                placeholder="Enter Tax Title"
                name="title"
                value={form.title}
                required
                type="text"
                onChange={handleChange}
                aria-label="Tax Title"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="countryId" required>
                Country
              </CustomFormLabel>
              <Select
                id="countryId"
                value={form.countryId}
                name="countryId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select country"
              >
                {countries.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="serviceId" required>
                Service
              </CustomFormLabel>
              <Select
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
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="taxType" required>
                Tax Type
              </CustomFormLabel>
              <Select
                id="taxType"
                value={form.taxType}
                name="taxType"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Select tax type"
              >
                <MenuItem value="Percentage">Percentage</MenuItem>
                <MenuItem value="Fix">Fix</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="taxAmount" required>
                Tax Value
              </CustomFormLabel>
              <CustomTextField
                id="taxAmount"
                variant="outlined"
                fullWidth
                placeholder="Enter Tax Value"
                name="taxAmount"
                value={form.taxAmount}
                required
                type="number"
                inputProps={{ step: '0.01', min: 0 }}
                onChange={handleChange}
                aria-label="Tax Value"
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
            <Button color="error" variant="outlined" onClick={onClose} aria-label="Cancel form">
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              aria-label="Update Tax Setting"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main TaxSettings Component
const TaxSettings = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState({
    fetch: false,
    submit: false,
    delete: false,
  });

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

    setLoading((prev) => ({ ...prev, submit: true }));
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let res;
      if (id) {
        res = await axios.put(`${URLS.EditTaxSetting}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddTaxSetting, formData, config);
      }

      if (res.status === 200) {
        toast.success(res.data.message);
        handleCloseForm();
        await getData();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'An error occurred while saving the tax setting.';
      toast.error(message);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const handleDelete = async (data) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (window.confirm('Do you really want to delete this Tax Setting?')) {
      setLoading((prev) => ({ ...prev, delete: true }));
      try {
        const res = await axios.delete(`${URLS.DeleteTaxSetting}/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          await getData();
        }
      } catch (error) {
        const message =
          error.response?.data?.message || 'An error occurred while deleting the tax setting.';
        toast.error(message);
      } finally {
        setLoading((prev) => ({ ...prev, delete: false }));
      }
    }
  };

  const getData = useCallback(async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const res = await axios.post(
        URLS.GetTaxSetting,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.taxsetting || []);
    } catch (error) {
      toast.error('Failed to fetch Tax Settings.');
      console.error('Failed to fetch Tax Settings:', error);
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, [token]);

  const getCountries = useCallback(async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    try {
      const res = await axios.post(
        URLS.GetCountry,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCountries(res.data.country || []);
    } catch (error) {
      toast.error('Failed to fetch Countries.');
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }

      setLoading((prev) => ({ ...prev, fetch: true }));
      try {
        const [serviceRes, taxRes, countryRes] = await Promise.all([
          axios.post(URLS.GetService, {}, { headers: { Authorization: `Bearer ${token}` } }),
          axios.post(URLS.GetTaxSetting, {}, { headers: { Authorization: `Bearer ${token}` } }),
          axios.post(URLS.GetCountry, {}, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setServiceTypes(serviceRes.data.services || []);
        setData(taxRes.data.taxsetting || []);
        setCountries(countryRes.data.country || []);
      } catch (error) {
        toast.error('Failed to fetch data.');
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading((prev) => ({ ...prev, fetch: false }));
      }
    };

    fetchData();
  }, [token]);

  const filteredData = useMemo(() => {
    if (search === '') return data;
    return data.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
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
        field: 'title',
        headerName: 'Title',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'countryName',
        headerName: 'Country',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'taxType',
        headerName: 'Type',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'taxAmount',
        headerName: 'Tax Value',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'serviceName',
        headerName: 'Service',
        flex: 1,
        minWidth: 150,
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
            aria-label={`Status: ${params.row.status ? 'Active' : 'Inactive'}`}
          />
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        minWidth: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            {rolesAndPermission.tax_setting_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleEditPopUp(params.row)}
                  disabled={loading.submit || loading.delete}
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  aria-label={`Edit ${params.row.title}`}
                >
                  <IconEdit stroke={1.5} size={18} />
                </Button>
              </>
            ) : (
              <></>
            )}

            {rolesAndPermission.tax_setting_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleDelete(params.row)}
                  disabled={loading.submit || loading.delete}
                  sx={{ minWidth: '32px', padding: '4px 6px' }}
                  aria-label={`Delete ${params.row.title}`}
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
    ],
    [loading.submit, loading.delete],
  );

  const rows = useMemo(
    () =>
      filteredData.map((item) => ({
        id: item._id, // Use _id as the unique identifier
        ...item,
        serviceName: serviceTypes.find((service) => service._id === item.serviceId)?.name || 'N/A',
        countryName: countries.find((country) => country._id === item.countryId)?.name || 'N/A',
      })),
    [filteredData, serviceTypes, countries],
  );

  return (
    <PageContainer
      title="Tax Settings"
      description="Manage Tax Settings for your e-commerce platform"
    >
      <Breadcrumb title="Tax Settings" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && (
        <AddTaxSettingForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          serviceTypes={serviceTypes}
          countries={countries}
        />
      )}

      {showEditForm && (
        <EditTaxSettingForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          serviceTypes={serviceTypes}
          countries={countries}
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
          <Typography variant="h6">Tax Settings List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by title"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'background.paper' }}
              aria-label="Search Tax Settings by title"
            />
            {rolesAndPermission.tax_setting_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading.submit || loading.delete}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create new Tax Setting"
                >
                  Create Tax Setting
                </Button>{' '}
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
              loading={loading.fetch}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              autoHeight
              aria-label="Tax Settings Table"
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default TaxSettings;


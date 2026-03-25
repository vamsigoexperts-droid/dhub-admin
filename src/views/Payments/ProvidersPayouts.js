import React, { useState, useEffect, useMemo } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconAnalyze } from '@tabler/icons-react';
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
  Select,
  MenuItem,
  TextField,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  CardContent,
} from '@mui/material';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Provider Payouts' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Add ProviderPayout Form Component
const AddProviderPayoutForm = ({ onClose, onSubmit, providers }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    providerId: '',
    note: '',
    paidAmount: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.providerId) {
      toast.error('Provider Name is required.');
      return;
    }

    const formData = {
      providerId: form.providerId,
      paidAmount: form.paidAmount,
      note: form.note,
    };
    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create Provider Payout"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="providerId" required>
                Provider Name
              </CustomFormLabel>
              <CustomSelect
                aria-label="Select Provider Name"
                onChange={handleChange}
                value={form.providerId}
                variant="outlined"
                name="providerId"
                id="providerId"
                required
                fullWidth
              >
                {providers.map((provider) => (
                  <MenuItem key={provider._id} value={provider._id}>
                    {provider.firstName} {provider.lastName}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="paidAmount" required>
                Amount
              </CustomFormLabel>
              <CustomTextField
                id="paidAmount"
                type="number"
                variant="outlined"
                fullWidth
                placeholder="Enter Amount"
                name="paidAmount"
                value={form.paidAmount}
                required
                onChange={handleChange}
                aria-label="Enter Amount"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="note">Note</CustomFormLabel>
              <CustomTextField
                onChange={handleChange}
                aria-label="Enter Note"
                value={form.note}
                name="note"
                fullWidth
                id="note"
                multiline
                rows={1}
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
            <Button
              color="primary"
              variant="contained"
              type="submit"
              aria-label="Create Provider Payout"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit ProviderPayout Form Component
const EditProviderPayoutForm = ({ onClose, onSubmit, initialData, providers }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    providerId: initialData?.providerId || '',
    paidAmount: initialData?.paidAmount || '',
    note: initialData?.note || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.providerId) {
      toast.error('Provider Name is required.');
      return;
    }
    const formData = {
      providerId: form.providerId,
      paidAmount: form.paidAmount,
      note: form.note,
    };
    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit Provider Payout"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="providerId" required>
                Provider Name
              </CustomFormLabel>
              <CustomSelect
                aria-label="Select Provider Name"
                onChange={handleChange}
                value={form.providerId}
                variant="outlined"
                name="providerId"
                id="providerId"
                required
                fullWidth
              >
                {providers.map((provider) => (
                  <MenuItem key={provider._id} value={provider._id}>
                    {provider.firstName} {provider.lastName}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="paidAmount" required>
                Amount
              </CustomFormLabel>
              <CustomTextField
                id="paidAmount"
                type="number"
                variant="outlined"
                fullWidth
                placeholder="Enter Amount"
                name="paidAmount"
                value={form.paidAmount}
                required
                onChange={handleChange}
                aria-label="Enter Amount"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="note">Note</CustomFormLabel>
              <CustomTextField
                onChange={handleChange}
                aria-label="Enter Note"
                value={form.note}
                name="note"
                fullWidth
                id="note"
                multiline
                rows={1}
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
            <Button
              color="primary"
              variant="contained"
              type="submit"
              aria-label="Update Provider Payout"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main ProviderPayouts Component
const ProviderPayouts = () => {
  const theme = useTheme();
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);

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
        res = await axios.put(`${URLS.EditProviderPayout}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddProviderPayout, formData, config);
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

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetProviderPayout,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.providerpayouts || []);
    } catch (error) {
      toast.error('Failed to fetch provider payouts.');
      console.error('Failed to fetch provider payouts:', error);
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
        const providersRes = await axios.post(
          URLS.GetProvider,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setProviders(providersRes.data.activeproviders || []);
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
        item.providerName?.toLowerCase().includes(search.toLowerCase()),
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
        field: 'providerName',
        headerName: 'Provider Name',
        flex: 1,
      },
      {
        field: 'paidAmount',
        headerName: 'Paid Amount',
        flex: 1,
      },
      {
        field: 'date',
        headerName: 'Date',
        flex: 1,
      },
      {
        field: 'note',
        headerName: 'Note',
        flex: 1,
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,

        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleEditPopUp(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Edit ${params.row.providerName}`}
            >
              <IconAnalyze stroke={1.5} size={18} />
            </Button>
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
      })) || [],
    [filteredData],
  );

  return (
    <PageContainer title="Provider Payouts" description="Manage Provider Payouts for your platform">
      <Breadcrumb title="Provider Payouts" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      {showEditForm && (
        <EditProviderPayoutForm
          providers={providers}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
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
          <Typography variant="h6">Provider Payouts List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by provider name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Provider Payouts"
            />
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

export default ProviderPayouts;

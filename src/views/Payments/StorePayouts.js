import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconAnalyze} from '@tabler/icons-react';
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
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Store Payouts' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Edit Store Payout Form Component
const EditStorePayoutForm = ({ onClose, onSubmit, initialData, storeTypes }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    storeId: initialData?.storeId || '',
    amount: initialData?.amount || '',
    note: initialData?.note || '',
  });

  const handleChange = useCallback((e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!form.storeId) {
      toast.error('Store Name is required.');
      return;
    }
    onSubmit(form, initialData?._id);
  }, [form, initialData?._id, onSubmit]);

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit Store Payout"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="storeId" required>
                Store Name
              </CustomFormLabel>
              <CustomSelect
                aria-label="Select Store Name"
                onChange={handleChange}
                value={form.storeId}
                variant="outlined"
                name="storeId"
                id="storeId"
                required
                fullWidth
              >
                {storeTypes.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="amount" required>
                Amount
              </CustomFormLabel>
              <CustomTextField
                id="amount"
                type="number"
                variant="outlined"
                fullWidth
                placeholder="Enter Amount"
                name="amount"
                value={form.amount}
                required
                onChange={handleChange}
                aria-label="Enter Amount"
              />
            </Grid>
            <Grid item xs={12}>
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
            <Button 
              color="error" 
              variant="outlined" 
              onClick={onClose} 
              aria-label="Close form"
            >
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              aria-label="Update Store Payout"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main StorePayouts Component
const StorePayouts = () => {
  const theme = useTheme();
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [storeTypes, setStoreTypes] = useState([]);

  const getToken = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  }, []);

  const token = useMemo(() => getToken(), [getToken]);

  const handleEditPopUp = useCallback((data) => {
    setShowEditForm(true);
    setEditData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowEditForm(false);
    setEditData(null);
  }, []);

  const getData = useCallback(async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetStorePayOut,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.storepayouts || []);
    } catch (error) {
      toast.error('Failed to fetch store payouts.');
      console.error('Failed to fetch store payouts:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleSubmit = useCallback(async (formData, id) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const url = id ? `${URLS.EditStorePayOut}/${id}` : URLS.AddStorePayOut;
      const method = id ? 'put' : 'post';
      
      const res = await axios[method](url, formData, config);
      
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
  }, [token, handleCloseForm, getData]);


  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }
      setLoading(true);
      try {
        const [storeRes] = await Promise.all([
          axios.post(URLS.GetStore, {}, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        
        setStoreTypes(storeRes.data.store || []);
        await getData();
      } catch (error) {
        toast.error('Failed to fetch data.');
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token, getData]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      item.storeName.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

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
        field: 'storeName',
        headerName: 'Store Name',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'amount',
        headerName: 'Paid Amount',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'logCreatedDate',
        headerName: 'Date',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'note',
        headerName: 'Note',
        flex: 1,
        minWidth: 150,
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
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleEditPopUp(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Edit ${params.row.storeName}`}
            >
              <IconAnalyze stroke={1.5} size={18} />
            </Button>
          </Box>
        ),
      },
    ],
    [loading, handleEditPopUp],
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
    <PageContainer
      title="Store Payouts"
      description="Manage Store Payouts for your e-commerce platform"
    >
      <Breadcrumb title="Store Payouts" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      
      {showEditForm && (
        <EditStorePayoutForm
          storeTypes={storeTypes}
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
          <Typography variant="h6">Store Payouts List</Typography>
          <TextField
            size="small"
            placeholder="Search by store name"
            value={search}
            onChange={handleSearch}
            sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
            aria-label="Search Store Payouts"
          />
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

export default StorePayouts;

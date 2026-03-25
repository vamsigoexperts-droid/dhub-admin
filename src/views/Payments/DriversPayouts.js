import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconAnalyze, } from '@tabler/icons-react';
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
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Driver Payouts' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Edit Driver Payout Form Component
const EditDriverPayoutForm = ({ onClose, onSubmit, initialData, driverTypes }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    driverId: initialData?.driverId || '',
    amount: initialData?.amount || '',
    note: initialData?.note || '',
  });

  const handleChange = useCallback((e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!form.driverId) {
      toast.error('Driver Name is required.');
      return;
    }
    onSubmit(form, initialData?._id);
  }, [form, initialData?._id, onSubmit]);

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit Driver Payout"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="driverId" required>
                Driver Name
              </CustomFormLabel>
              <CustomSelect
                aria-label="Select Driver Name"
                onChange={handleChange}
                value={form.driverId}
                variant="outlined"
                name="driverId"
                id="driverId"
                required
                fullWidth
              >
                {driverTypes.map((option) => (
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
                inputProps={{ min: 0, step: "0.01" }}
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
                rows={2}
                placeholder="Enter additional notes (optional)"
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
              aria-label="Update Driver Payout"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main DriversPayouts Component
const DriversPayouts = () => {
  const theme = useTheme();
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [driverTypes, setDriverTypes] = useState([]);

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
        URLS.GetDriverPayOut,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.driverpayouts || []);
    } catch (error) {
      toast.error('Failed to fetch driver payouts.');
      console.error('Failed to fetch driver payouts:', error);
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
      const url = id ? `${URLS.EditDriverPayOut}/${id}` : URLS.AddDriverPayOut;
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
        const [driverRes] = await Promise.all([
          axios.post(URLS.GetDriver, {}, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        
        setDriverTypes(driverRes.data.drivers || []);
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
      item.driverName?.toLowerCase().includes(search.toLowerCase()) ||
      item.driverEmail?.toLowerCase().includes(search.toLowerCase()) ||
      item.driverPhone?.toLowerCase().includes(search.toLowerCase())
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
        field: 'driverName',
        headerName: 'Driver Name',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'driverEmail',
        headerName: 'Driver Email',
        flex: 1,
        minWidth: 180,
      },
      {
        field: 'driverPhone',
        headerName: 'Driver Phone',
        flex: 1,
        minWidth: 130,
      },
      {
        field: 'amount',
        headerName: 'Paid Amount',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="medium">
            ₹{params.value || 0}
          </Typography>
        ),
      },
      {
        field: 'logCreatedDate',
        headerName: 'Date',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Typography variant="body2">
            {params.value ? new Date(params.value).toLocaleDateString('en-IN') : 'N/A'}
          </Typography>
        ),
      },
      {
        field: 'note',
        headerName: 'Note',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Typography 
            variant="body2" 
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={params.value || 'No note'}
          >
            {params.value || 'No note'}
          </Typography>
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
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleEditPopUp(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Edit ${params.row.driverName || 'driver'} payout`}
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
      title="Driver Payouts"
      description="Manage Driver Payouts for your delivery platform"
    >
      <Breadcrumb title="Driver Payouts" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      
      {showEditForm && (
        <EditDriverPayoutForm
          driverTypes={driverTypes}
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
          <Typography variant="h6">Driver Payouts List</Typography>
          <TextField
            size="small"
            placeholder="Search by name, email, or phone"
            value={search}
            onChange={handleSearch}
            sx={{ minWidth: { xs: 180, sm: 250 }, bgcolor: 'white' }}
            aria-label="Search Driver Payouts"
          />
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10, 20, 50]}
              disableRowSelectionOnClick
              autoHeight
              sx={{
                '& .MuiDataGrid-root': {
                  border: 'none',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.grey[50],
                  borderBottom: `2px solid ${theme.palette.divider}`,
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default DriversPayouts;

import React, { useState, useEffect, useMemo } from 'react';
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

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'On Demand Child Categories' }];

const AddItemattributeForm = ({ onClose, onSubmit }) => {
  const theme = useTheme();
  const [form, setForm] = useState({ name: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Name is required.');
    onSubmit({ ...form });
  };

  return (
    <Box py={1}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create On Demand Child Category"
          sx={{ boxShadow: theme.shadows[4], borderRadius: 2 }}
        >
          <Grid container spacing={2} p={2}>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="name" required>
                Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                name="name"
                fullWidth
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Name"
                required
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="flex-end" gap={1} p={2}>
            <Button variant="outlined" color="error" onClick={onClose}>
              Close
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

const EditItemattributeForm = ({ onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const [form, setForm] = useState({ name: initialData?.name || '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Name is required.');
    onSubmit({ ...form }, initialData._id);
  };

  return (
    <Box py={1}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit On Demand Child Category"
          sx={{ boxShadow: theme.shadows[4], borderRadius: 2 }}
        >
          <Grid container spacing={2} p={2}>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="name" required>
                Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                name="name"
                fullWidth
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Name"
                required
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="flex-end" gap={1} p={2}>
            <Button variant="outlined" color="error" onClick={onClose}>
              Close
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

const Itemattribute = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const token = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch {
      return '';
    }
  }, []);

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
    if (!token) return toast.error('Authentication token missing.');

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = id
        ? await axios.put(`${URLS.EditOnDemandChildCategory}/${id}`, formData, config)
        : await axios.post(URLS.AddOnDemandChildCategory, formData, config);

      toast.success(res.data.message);
      handleCloseForm();
      getData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    if (!token) return toast.error('Authentication token missing.');
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      const res = await axios.delete(`${URLS.DeletOnDemandChildCategory}/${row._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message);
      getData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete.');
    } finally {
      setLoading(false);
    }
  };

  const getData = async () => {
    if (!token) return toast.error('Authentication token missing.');

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetOnDemandChildCategory,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setData(res.data.ondemandcategorys || []);
    } catch {
      toast.error('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const filtered = search
      ? data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
      : data;
    setFilteredData(filtered);
  }, [search, data]);

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
        field: 'name',
        headerName: 'Name',
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
            {rolesAndPermission.on_demand_child_categories_edit === true ||
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
                  <IconEdit stroke={2} size={18} />
                  Edit
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
    () => filteredData.map((item) => ({ ...item, id: item._id })),
    [filteredData],
  );

  return (
    <PageContainer
      title="On Demand Child Categories"
      description="Manage your On Demand Child Categories"
    >
      <Breadcrumb title="On Demand Child Categories" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && <AddItemattributeForm onClose={handleCloseForm} onSubmit={handleSubmit} />}
      {showEditForm && (
        <EditItemattributeForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
        />
      )}

      <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Typography variant="h6">On Demand Child Categories List</Typography>
          <Box display="flex" gap={2}>
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            {/* <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              startIcon={<IconPlus size={18} />}
              disabled={loading}
            >
              Create
            </Button> */}
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              autoHeight
              disableSelectionOnClick
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default Itemattribute;

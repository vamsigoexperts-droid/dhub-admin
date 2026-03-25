import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Button,
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
import { styled, useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { URLS } from '../../Url';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Admin Users' }];

// Styled Select component
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

// Add Service Form Component
const AddServiceForm = ({ onClose, onSubmit, roles, loading }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    roleId: '',
    confirmPassword: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('phone', form.phone);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('confirmPassword', form.confirmPassword);
    formData.append('roleId', form.roleId);
    if (file) formData.append('image', file);

    onSubmit(formData);
    // Reset form
    setForm({
      name: '',
      phone: '',
      email: '',
      password: '',
      roleId: '',
      confirmPassword: '',
    });
    setFile(null);
    setPreview(null);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Create Admin User">
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={3}>
              <CustomFormLabel htmlFor="name" required>
                Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Name"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomFormLabel htmlFor="phone" required>
                Phone Number
              </CustomFormLabel>
              <CustomTextField
                id="phone"
                variant="outlined"
                fullWidth
                placeholder="Enter Phone Number"
                name="phone"
                value={form.phone}
                required
                onChange={handleChange}
                aria-label="Phone Number"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomFormLabel htmlFor="roleId" required>
                Role
              </CustomFormLabel>
              <CustomSelect
                id="roleId"
                value={form.roleId}
                name="roleId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Role"
              >
                {roles.length === 0 ? (
                  <MenuItem disabled>No roles available</MenuItem>
                ) : (
                  roles.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.roleName}
                    </MenuItem>
                  ))
                )}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomFormLabel htmlFor="image">Image</CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{ accept: 'image/jpeg,image/png', 'aria-label': 'Upload Image' }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="email" required>
                Email
              </CustomFormLabel>
              <CustomTextField
                id="email"
                variant="outlined"
                fullWidth
                placeholder="Enter Email"
                name="email"
                value={form.email}
                required
                onChange={handleChange}
                aria-label="Email"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="password" required>
                Password
              </CustomFormLabel>
              <CustomTextField
                id="password"
                type="password"
                variant="outlined"
                fullWidth
                placeholder="Enter Password"
                name="password"
                value={form.password}
                required
                onChange={handleChange}
                aria-label="Password"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="confirmPassword" required>
                Confirm Password
              </CustomFormLabel>
              <CustomTextField
                id="confirmPassword"
                type="password"
                variant="outlined"
                fullWidth
                placeholder="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                required
                onChange={handleChange}
                aria-label="Confirm Password"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit Service Form Component
const EditServiceForm = ({ onClose, onSubmit, initialData, roles, loading }) => {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    roleId: initialData?.roleId || '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.image ? URLS.FileBase + initialData.image : null);

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview && !preview.startsWith(URLS.FileBase)) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('phone', form.phone);
    formData.append('email', form.email);
    formData.append('roleId', form.roleId);

    if (file) formData.append('image', file);

    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard title="Edit Admin User">
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="name" required>
                Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Name"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="phone" required>
                Phone Number
              </CustomFormLabel>
              <CustomTextField
                id="phone"
                variant="outlined"
                fullWidth
                placeholder="Enter Phone Number"
                name="phone"
                value={form.phone}
                required
                onChange={handleChange}
                aria-label="Phone Number"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="roleId" required>
                Role
              </CustomFormLabel>
              <CustomSelect
                id="roleId"
                value={form.roleId}
                name="roleId"
                required
                onChange={handleChange}
                fullWidth
                variant="outlined"
                aria-label="Role"
              >
                {roles.length === 0 ? (
                  <MenuItem disabled>No roles available</MenuItem>
                ) : (
                  roles.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.roleName}
                    </MenuItem>
                  ))
                )}
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="image">Image</CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{ accept: 'image/jpeg,image/png', 'aria-label': 'Upload Image' }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="email" required>
                Email
              </CustomFormLabel>
              <CustomTextField
                id="email"
                variant="outlined"
                fullWidth
                placeholder="Enter Email"
                name="email"
                value={form.email}
                required
                onChange={handleChange}
                aria-label="Email"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  Update
                </Button>
              </Box>
            </Grid>
          </Grid>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main AdminUsers Component
const AdminUsers = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0]


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

  const handleSubmit = useCallback(
    async (formData, id) => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }

      setLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        };
        let res;
        if (id) {
          res = await axios.put(`${URLS.UpdateStaff}/${id}`, formData, config);
        } else {
          res = await axios.post(URLS.AddStaff, formData, config);
        }

        if (res.status === 200 || res.status === 201) {
          toast.success(res.data.message || 'Operation successful.');
          handleCloseForm();
          getData();
        }
      } catch (error) {
        const status = error.response?.status;
        let message = error.response?.data?.message || 'An error occurred';
        if (status === 400) message = 'Unauthorized. Please log in again.';
        if (status === 400) message = 'Invalid input. Please check your data.';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const handleDelete = useCallback(
    async (data) => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }

      if (!window.confirm('Are you sure you want to delete this admin user?')) return;

      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteStaff}/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message || 'Admin user deleted successfully.');
          getData();
        }
      } catch (error) {
        const status = error.response?.status;
        let message = error.response?.data?.message || 'An error occurred';
        if (status === 400) message = 'Unauthorized. Please log in again.';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const getData = useCallback(async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetStaff,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.staff || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch admin users.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getRoles = useCallback(async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    try {
      const res = await axios.post(
        URLS.GetRoles,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRoles(res.data.roles || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch roles.');
    }
  }, [token]);

  useEffect(() => {
    getData();
    getRoles();
  }, [getData, getRoles]);

  useEffect(() => {
    setFilteredData(
      search ? data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())) : data,
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
        field: 'name',
        headerName: 'Admin Users',
        flex: 1,
        minWidth: 200,
        renderCell: ({ row }) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={row.image ? URLS.FileBase + row.image : '/default-avatar.png'}
              alt={row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Typography>{row.name}</Typography>
          </Box>
        ),
      },
      { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 150 },
      { field: 'email', headerName: 'Email', flex: 1, minWidth: 150 },
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
            {rolesAndPermission.admin_user_edit === true || rolesAndPermission.accessAll === true ? <>
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
              </Button></> : <></>}

            {rolesAndPermission.admin_user_delete === true || rolesAndPermission.accessAll === true ? <>
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
              </Button></> : <></>}
          </Box>
        ),
      },
    ],
    [loading, handleEditPopUp, handleDelete],
  );

  const rows = useMemo(
    () => filteredData.map((item, index) => ({ id: item._id || index, ...item })),
    [filteredData],
  );

  return (
    <PageContainer title="Admin Users" description="Manage Admin Users for your platform">
      <Breadcrumb title="Admin Users" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />
      {showAddForm && (
        <AddServiceForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          roles={roles}
          loading={loading}
        />
      )}
      {showEditForm && (
        <EditServiceForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          roles={roles}
          loading={loading}
        />
      )}
      <Paper
        variant="outlined"
        sx={{
          mt: 3,
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
          <Typography variant="h6">Admin Users List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Admin Users"
            />{rolesAndPermission.admin_user_add === true || rolesAndPermission.accessAll === true ? <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddPopUp}
                disabled={loading}
                startIcon={<IconPlus size={20} />}
                aria-label="Create Admin User"
              >
                Create Admin User
              </Button></> : <></>}
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowHeight={40}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              loading={loading}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default AdminUsers;

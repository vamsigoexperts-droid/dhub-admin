import React, { useState, useEffect, useMemo } from 'react';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, MenuItem } from '@mui/material';
import {
  TextField,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../../Url';
import axios from 'axios';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Attributes Values' }];

// Add Attributes Values Form Component
const AddAttributesValuesForm = ({ onClose, onSubmit, attributes, loading }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    value: '',
    attributeId: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.value.trim()) {
      toast.error('Attribute Value is required.');
      return;
    }
    if (!form.attributeId) {
      toast.error('Attribute is required.');
      return;
    }
    onSubmit(form);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create Attributes Values"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="attributeId" required>
                Attribute Name
              </CustomFormLabel>
              <CustomTextField
                id="attributeId"
                select
                name="attributeId"
                value={form.attributeId}
                onChange={handleChange}
                disabled={loading}
                fullWidth
                variant="outlined"
                required
                aria-label="Select Attribute"
              >
                <MenuItem value="">Select Attribute</MenuItem>
                {attributes.map((attribute) => (
                  <MenuItem key={attribute._id} value={attribute._id}>
                    {attribute.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="value" required>
                Attribute Value
              </CustomFormLabel>
              <CustomTextField
                id="value"
                name="value"
                value={form.value}
                onChange={handleChange}
                disabled={loading}
                fullWidth
                variant="outlined"
                placeholder="Enter Attribute Value"
                required
                aria-label="Enter Attribute Value"
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
              disabled={loading}
              aria-label="Close form"
            >
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={loading}
              aria-label="Create Attribute value"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit Attributes Values Form Component
const EditAttributesValuesForm = ({ onClose, onSubmit, attributes, loading, editData }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    value: editData?.value || '',
    attributeId: editData?.attributeId || '',
  });

  useEffect(() => {
    if (editData) {
      setForm({
        value: editData.value || '',
        attributeId: editData.attributeId || '',
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.value.trim()) {
      toast.error('Attribute Value is required.');
      return;
    }
    if (!form.attributeId) {
      toast.error('Attribute is required.');
      return;
    }
    onSubmit({ ...form, id: editData._id });
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit Attributes Values"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="attributeId" required>
                Attribute Name
              </CustomFormLabel>
              <CustomTextField
                id="attributeId"
                select
                name="attributeId"
                value={form.attributeId}
                onChange={handleChange}
                disabled={loading}
                fullWidth
                variant="outlined"
                required
                aria-label="Select Attribute"
              >
                <MenuItem value="">Select Attribute</MenuItem>
                {attributes.map((attribute) => (
                  <MenuItem key={attribute._id} value={attribute._id}>
                    {attribute.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="value" required>
                Attribute Value
              </CustomFormLabel>
              <CustomTextField
                id="value"
                name="value"
                value={form.value}
                onChange={handleChange}
                disabled={loading}
                fullWidth
                variant="outlined"
                placeholder="Enter Attribute Value"
                required
                aria-label="Enter Attribute Value"
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
              disabled={loading}
              aria-label="Close form"
            >
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={loading}
              aria-label="Update Attribute value"
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Delete Confirmation Dialog
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, attributeValueName, loading }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the Attribute value "{attributeValueName}"? This action
          cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AttributesValues = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleEditPopUp = (item) => {
    setEditData(item);
    setShowEditForm(true);
    setShowAddForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setEditData(null);
  };

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteClose = () => {
    setDeleteDialog({ open: false, item: null });
  };

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(URLS.GetAttributeValues, {}, config);

      if (response.data && response.data.success) {
        const attributeValuesData = response.data.attributevalues || [];
        setData(attributeValuesData);
      } else {
        setData([]);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch Attributes Values';
      toast.error(errorMessage);
      console.error('Get Attributes Values Error:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const getAttributes = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(URLS.GetAttribute, {}, config);
      
      if (response.data && response.data.success) {
        const attributesData = response.data.attribute || [];
        setAttributes(attributesData);
      } else {
        setAttributes([]);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch Attributes';
      toast.error(errorMessage);
      console.error('Get Attributes Error:', error);
      setAttributes([]);
    }
  };

  const handleSubmit = async (formData) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setFormLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(URLS.AddAttributeValues, formData, config);
      
      if (response.status === 200) {
        toast.success(response.data.message || 'Attribute Value created successfully');
        handleCloseAddForm();
        await getData();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create Attribute value';
      toast.error(errorMessage);
      console.error('Submit Attribute Value Error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (formData) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setFormLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const { id, ...updateData } = formData;
      const response = await axios.put(`${URLS.UpdateAttributeValues}/${id}`, updateData, config);
      
      if (response.status === 200) {
        toast.success(response.data.message || 'Attribute Value updated successfully');
        handleCloseEditForm();
        await getData();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update Attribute value';
      toast.error(errorMessage);
      console.error('Edit Attribute Value Error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!token || !deleteDialog.item) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setDeleteLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.delete(
        `${URLS.DeleteAttributeValues}/${deleteDialog.item._id}`,
        config,
      );
      
      if (response.status === 200) {
        toast.success(response.data.message || 'Attribute Value deleted successfully');
        handleDeleteClose();
        await getData();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Attribute value';
      toast.error(errorMessage);
      console.error('Delete Attribute Value Error:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }
      await getAttributes();
      await getData();
    };

    fetchData();
  }, [token]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) => {
      const attributeName = attributes.find(attr => attr._id === item.attributeId)?.name || '';
      return (
        item.value?.toLowerCase().includes(search.toLowerCase()) ||
        attributeName.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [data, search, attributes]);

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S.No',
        width: 80,
        sortable: false,
        renderCell: (params) => {
          const rowIndex = filteredData.findIndex((item) => item._id === params.row._id);
          return rowIndex + 1;
        },
      },
      {
        field: 'value',
        headerName: 'Value Name',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'attributeName',
        headerName: 'Attribute',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => {
          const attributeName = attributes.find(attr => attr._id === params.row.attributeId)?.name || 'N/A';
          return <Typography variant="body2">{attributeName}</Typography>;
        },
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleEditPopUp(params.row)}
              disabled={loading || formLoading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Edit ${params.row.value}`}
            >
              <IconEdit stroke={1.5} size={18} />
            </Button>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => handleDeleteClick(params.row)}
              disabled={loading || formLoading || deleteLoading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Delete ${params.row.value}`}
            >
              <IconTrash stroke={1.5} size={18} />
            </Button>
          </Box>
        ),
      },
    ],
    [filteredData, loading, formLoading, deleteLoading, attributes],
  );

  const rows = useMemo(
    () =>
      filteredData.map((item) => ({
        ...item,
        id: item._id,
      })),
    [filteredData],
  );

  return (
    <PageContainer
      title="Attributes Values"
      description="Manage Attributes Values for your e-commerce platform"
    >
      <Breadcrumb title="Attributes Values" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && (
        <AddAttributesValuesForm
          onClose={handleCloseAddForm}
          onSubmit={handleSubmit}
          attributes={attributes}
          loading={formLoading}
        />
      )}

      {showEditForm && (
        <EditAttributesValuesForm
          onClose={handleCloseEditForm}
          onSubmit={handleEditSubmit}
          attributes={attributes}
          loading={formLoading}
          editData={editData}
        />
      )}

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        attributeValueName={deleteDialog.item?.value || ''}
        loading={deleteLoading}
      />

      <Paper
        variant="outlined"
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
          mt: 2,
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
          <Typography variant="h6">Attributes Values</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search values or attributes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 200, sm: 250 }, bgcolor: 'white' }}
              disabled={loading}
              aria-label="Search Attributes Values"
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconPlus size={20} />}
              onClick={handleAddPopUp}
              disabled={loading || formLoading}
              aria-label="Create new Attribute value"
            >
              Add Attribute Value
            </Button>
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ width: '100%' }}>
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

export default AttributesValues;

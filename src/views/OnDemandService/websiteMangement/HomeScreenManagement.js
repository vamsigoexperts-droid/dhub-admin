import React, { useState, useEffect, useMemo } from 'react';
import {
  TextField,
  Avatar,
  Paper,
  Box,
  Typography,
  Button,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { IconPlus, IconTrash, IconPencil, IconEye } from '@tabler/icons-react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { URLS } from '../../../Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Home Screen Management' }];

const HomeScreenManagement = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Dialog states for delete confirmation
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';
  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData?.rolesAndPermission?.[0] || {};

  // ðŸ”¹ Fetch all home screen data
  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${URLS.GetAllHomeScreens}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && Array.isArray(res.data.data)) {
        const base = res.data.baseUrl || URLS.FileBase;

const mappedData = res.data.data.map((item) => {
  const base = res.data.baseUrl || URLS.FileBase;

  const getImageUrl = (img) => (img ? `${base}${img}` : '');

  return {
    _id: item._id,
    title: item.title,
    description: item.description,
    curvedImage1: getImageUrl(item.curvedImage1),
    curvedImage2: getImageUrl(item.curvedImage2),
    bannerImage: getImageUrl(item.bannerImage),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
});


        setData(mappedData);
        setFilteredData(mappedData);
      } else {
        toast.warn('No Home Screen data found.');
      }
    } catch (error) {
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

 

  useEffect(() => {
    getData();
  }, []);

  // ðŸ”¹ Handle search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredData(data);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = data.filter(
        (item) =>
          item._id.toLowerCase().includes(lowerSearch) ||
          (item.title && item.title.toLowerCase().includes(lowerSearch))
      );
      setFilteredData(filtered);
    }
  }, [data, search]);

  // ðŸ”¹ Event Handlers
  const handleSearch = (e) => setSearch(e.target.value);
  const handleAddPopUp = () => navigate('/serviceprovider-website/addhomeScreen');

  const handleView = (item) => {
    localStorage.setItem('homeScreenId', item._id);
    navigate('/serviceprovider-website/viewscreen');
  };

  const handleEdit = (item) => {
    localStorage.setItem('homeScreenId', item._id);
    navigate('/serviceprovider-website/edit-home-screen');
  };

  // Open delete dialog
  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setOpenDelete(true);
  };

  // Confirm delete request
  const confirmDelete = async () => {
    if (!selectedItem) return;
    setDeleting(true);

    try {
      const res = await axios.delete(`${URLS.DeleteHomeScreen}/${selectedItem._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        toast.success('Deleted successfully');
        getData();
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting item');
    } finally {
      setDeleting(false);
      setOpenDelete(false);
      setSelectedItem(null);
    }
  };

  // ðŸ”¹ Define DataGrid Columns
  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S.No',
        width: 80,
        renderCell: (params) => {
          const index = params.api.getSortedRowIds().indexOf(params.id);
          return index + 1;
        },
      },
      {
        field: 'bannerImage',
        headerName: 'Banner',
        flex: 1,
        renderCell: (params) => (
          <Avatar
            src={params.row.bannerImage}
            alt="Banner"
            variant="rounded"
            sx={{ width: 60, height: 40 }}
          />
        ),
      },
      {
        field: 'curvedImage1',
        headerName: 'Curved 1',
        flex: 1,
        renderCell: (params) => (
          <Avatar
            src={params.row.curvedImage1}
            alt="Curved 1"
            variant="rounded"
            sx={{ width: 60, height: 40 }}
          />
        ),
      },
      {
        field: 'curvedImage2',
        headerName: 'Curved 2',
        flex: 1,
        renderCell: (params) => (
          <Avatar
            src={params.row.curvedImage2}
            alt="Curved 2"
            variant="rounded"
            sx={{ width: 60, height: 40 }}
          />
        ),
      },
   {
  field: 'actions',
  headerName: 'Actions',
  flex: 1,
  sortable: false,
  renderCell: (params) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {(rolesAndPermission.home_screen_edit ||
        rolesAndPermission.accessAll) && (
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<IconPencil size={16} />}
          onClick={() => handleEdit(params.row)}
          sx={{
            textTransform: 'none',
            minHeight: 32,
            px: 1.5,
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          Edit
        </Button>
      )}

      <Button
        size="small"
        variant="contained"
        color="secondary"
        startIcon={<IconEye size={16} />}
        onClick={() => handleView(params.row)}
        sx={{
          textTransform: 'none',
          minHeight: 32,
          px: 1.5,
          fontSize: '0.75rem',
          fontWeight: 500,
        }}
      >
        View
      </Button>

      {(rolesAndPermission.home_screen_delete ||
        rolesAndPermission.accessAll) && (
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<IconTrash size={16} />}
          onClick={() => handleOpenDelete(params.row)}
          sx={{
            textTransform: 'none',
            minHeight: 32,
            px: 1.5,
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          Delete
        </Button>
      )}
    </Box>
  ),
}

    ],
    [loading]
  );

  const rows = useMemo(
    () => filteredData.map((item) => ({ id: item._id, ...item })),
    [filteredData]
  );

  return (
    <PageContainer
      title="Home Screen Management"
      description="Manage home screen images (curved & banner)"
    >
      <Breadcrumb title="Home Screen Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
        }}
      >
        {/* Header Bar */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h6">Home Screen List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by ID or Title"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'background.paper' }}
            />
            {(rolesAndPermission.home_screen_add ||
              rolesAndPermission.accessAll) && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddPopUp}
                startIcon={<IconPlus size={20} />}
              >
                Add Home Screen
              </Button>
            )}
          </Box>
        </Box>

        {/* Data Table */}
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pageSize={5}
              rowHeight={60}
              rowsPerPageOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this home screen item
            {selectedItem?.title ? `: "${selectedItem.title}"?` : '?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default HomeScreenManagement;


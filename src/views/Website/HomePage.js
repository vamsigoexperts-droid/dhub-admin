import React, { useState, useEffect, useMemo, useRef } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Select,
  Avatar,
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
  Paper,
  CardContent,
} from '@mui/material';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Home Page' }];

let ALLOWED_FILE_TYPES = ['jpg', 'jpeg', 'png'];
let MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
let MAX_IMAGE_HEIGHT = 200;

// Add Home Page Form Component
const AddHomePageForm = ({ onClose, onSubmit }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    videoUrl: '',
    description: '',
  });

  const [files, setFiles] = useState({
    image: null,
    imageTwo: null,
    imageThree: null,
    imageFour: null,
    imageFive: null,
  });

  const [previews, setPreviews] = useState({
    image: null,
    imageTwo: null,
    imageThree: null,
    imageFour: null,
    imageFive: null,
  });

  const fileInputRefs = {
    image: useRef(null),
    imageTwo: useRef(null),
    imageThree: useRef(null),
    imageFour: useRef(null),
    imageFive: useRef(null),
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (field) => (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(ext)) {
      fileInputRefs[field].current.value = null;
      toast.error(`Please select a ${ALLOWED_FILE_TYPES.join(', ')} file.`);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      fileInputRefs[field].current.value = null;
      toast.error('File size exceeds 5MB.');
      return;
    }

    setFiles((prev) => ({ ...prev, [field]: selectedFile }));
    setPreviews((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(selectedFile),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Home Page name is required.');
      return;
    }

    if (!form.videoUrl) {
      toast.error('Video URL is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('videoUrl', form.videoUrl);

    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    onSubmit(formData);
  };

  const renderFileInput = (field, label) => (
    <Grid item xs={12} sm={4}>
      <CustomFormLabel htmlFor={`${field}-image`}>{label}</CustomFormLabel>
      <CustomTextField
        id={`${field}-image`}
        type="file"
        variant="outlined"
        fullWidth
        onChange={handleFileChange(field)}
        inputProps={{
          accept: 'image/jpeg,image/png',
          'aria-label': `Upload ${label}`,
        }}
        inputRef={fileInputRefs[field]}
      />
      {previews[field] && (
        <Box mt={2}>
          <Typography variant="caption">Preview:</Typography>
          <Box
            component="img"
            src={previews[field]}
            alt={`${label} preview`}
            sx={{
              maxHeight: MAX_IMAGE_HEIGHT,
              width: '200px',
              objectFit: 'contain',
              borderRadius: 1,
            }}
          />
        </Box>
      )}
    </Grid>
  );

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create Home Page"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
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
                aria-label="Enter Name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="videoUrl" required>
                YouTube URL
              </CustomFormLabel>
              <CustomTextField
                id="videoUrl"
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/example"
                fullWidth
                required
              />
            </Grid>
            {renderFileInput('image', 'Image 1')}
            {renderFileInput('imageTwo', 'Image 2')}
            {renderFileInput('imageThree', 'Image 3')}
            {renderFileInput('imageFour', 'Image 4')}
            {renderFileInput('imageFive', 'Image 5')}
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="description">Description</CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Home Page description"
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
            <Button color="primary" variant="contained" type="submit" aria-label="Create Home Page">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit Home Page Form Component
const EditHomePageForm = ({ onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    videoUrl: initialData?.videoUrl || '',
    description: initialData?.description || '',
  });

  const [files, setFiles] = useState({
    image: null,
    imageTwo: null,
    imageThree: null,
    imageFour: null,
    imageFive: null,
  });

  const [previews, setPreviews] = useState({
    image: initialData?.image ? `${URLS.FileBase}${initialData.image}` : null,
    imageTwo: initialData?.imageTwo ? `${URLS.FileBase}${initialData.imageTwo}` : null,
    imageThree: initialData?.imageThree ? `${URLS.FileBase}${initialData.imageThree}` : null,
    imageFour: initialData?.imageFour ? `${URLS.FileBase}${initialData.imageFour}` : null,
    imageFive: initialData?.imageFive ? `${URLS.FileBase}${initialData.imageFive}` : null,
  });

  const fileInputRefs = {
    image: useRef(null),
    imageTwo: useRef(null),
    imageThree: useRef(null),
    imageFour: useRef(null),
    imageFive: useRef(null),
  };

  const handleFileChange = (field) => (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(ext)) {
      fileInputRefs[field].current.value = null;
      toast.error(`Please select a ${ALLOWED_FILE_TYPES.join(', ')} file.`);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      fileInputRefs[field].current.value = null;
      toast.error('File size exceeds 5MB.');
      return;
    }

    setFiles((prev) => ({ ...prev, [field]: selectedFile }));
    setPreviews((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(selectedFile),
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const renderFileInput = (field, label) => (
    <Grid item xs={12} sm={4}>
      <CustomFormLabel htmlFor={`${field}-image`}>{label}</CustomFormLabel>
      <CustomTextField
        id={`${field}-image`}
        type="file"
        variant="outlined"
        fullWidth
        onChange={handleFileChange(field)}
        inputProps={{
          accept: 'image/jpeg,image/png',
          'aria-label': `Upload ${label}`,
        }}
        inputRef={fileInputRefs[field]}
      />
      {previews[field] && (
        <Box mt={2}>
          <Typography variant="caption">Preview:</Typography>
          <Box
            component="img"
            src={previews[field]}
            alt={`${label} preview`}
            sx={{
              maxHeight: MAX_IMAGE_HEIGHT,
              width: '160px',
              height: '80px',
              objectFit: 'contain',
              borderRadius: 1,
            }}
          />
        </Box>
      )}
    </Grid>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Home Page name is required.');
      return;
    }

    if (!form.videoUrl) {
      toast.error('Video URL is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('videoUrl', form.videoUrl);

    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit Home Page"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
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
                aria-label="Enter name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="videoUrl" required>
                YouTube URL
              </CustomFormLabel>
              <CustomTextField
                id="videoUrl"
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/example"
                fullWidth
                required
              />
            </Grid>
            {renderFileInput('image', 'Image 1')}
            {renderFileInput('imageTwo', 'Image 2')}
            {renderFileInput('imageThree', 'Image 3')}
            {renderFileInput('imageFour', 'Image 4')}
            {renderFileInput('imageFive', 'Image 5')}
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="description">Description</CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Home Page description"
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
            <Button color="primary" variant="contained" type="submit" aria-label="Update Home Page">
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main HomePage Component
const HomePage = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      let res;
      if (id) {
        res = await axios.put(`${URLS.EditHomePage}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddHomePage, formData, config);
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

    if (window.confirm('Are you sure you want to delete this Home Page?')) {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.delete(`${URLS.DeletHomePage}/${data._id}`, config);
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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(URLS.GetHomePage, {}, config);
      setData(res.data.homepage || []);
    } catch (error) {
      toast.error('Failed to fetch Home Page.');
      console.error('Failed to fetch Home Page:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (search === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
          (item.videoUrl && item.videoUrl.toLowerCase().includes(search.toLowerCase())),
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
        field: 'Homepage',
        headerName: 'Home Page Info',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={URLS.FileBase + params.row.image}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">{params.row.name}</Typography>
          </Box>
        ),
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1,
        renderCell: (params) => (
          <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'videoUrl',
        headerName: 'YouTube URL',
        flex: 1,
        renderCell: (params) => (
          <Typography
            sx={{
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              color: theme.palette.primary.main,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => window.open(params.value, '_blank')}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => (
          <Chip
            label={params.row.status ? 'Active' : 'Inactive'}
            size="small"
            color={params.row.status ? 'success' : 'error'}
            variant="outlined"
          />
        ),
      },
      {
        field: 'action',
        headerName: 'Actions',
        width: 150,
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
              aria-label={`Edit ${params.row.name}`}
            >
              <IconEdit stroke={1.5} size={18} />
            </Button>
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
          </Box>
        ),
      },
    ],
    [loading, filteredData, theme],
  );

  const rows = useMemo(
    () =>
      filteredData.map((item) => ({
        id: item._id,
        ...item,
      })),
    [filteredData],
  );

  return (
    <PageContainer title="Home Page" description="Manage Home Page for your application">
      <Breadcrumb title="Home Page" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && <AddHomePageForm onClose={handleCloseForm} onSubmit={handleSubmit} />}
      {showEditForm && (
        <EditHomePageForm
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
          <Typography variant="h6">Home Page List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <CustomTextField
              size="small"
              placeholder="Search by name, description, or URL"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Home Page"
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPopUp}
              disabled={loading}
              startIcon={<IconPlus size={20} />}
              aria-label="Create Home Page"
            >
              Create Home Page
            </Button>
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              autoHeight
              getRowId={(row) => row._id}
              sx={{
                '& .MuiDataGrid-cell': {
                  py: 1,
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default HomePage;

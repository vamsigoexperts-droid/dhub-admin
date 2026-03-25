import React, { useState, useEffect } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../components/forms/theme-elements/CustomSelect';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import ParentCard from '../../components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';



import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


import { URLS } from '../../Url';
import axios from 'axios';
import {
  Card,
  CardContent,
  Divider,
  Box,
  Button,
  CardHeader,
  Grid,
  TextField,
  MenuItem,
  Chip,

  IconButton
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'City' }];
const PAGE_SIZE_OPTIONS = [5, 10, 20];

function City() {
  const authData = JSON.parse(localStorage.getItem('user'));
  const token = authData?.token ?? '';

  const rolesAndPermission = authData.rolesAndPermission[0];

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ name: '', state_id: '', country_id: '' ,  image: null,});
  const [formEdit, setFormEdit] = useState({ name: '', state_id: '', country_id: '', image: null, _id: '' });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [search, setSearch] = useState('');

  const [imagePreview, setImagePreview] = useState(null);
const [editImagePreview, setEditImagePreview] = useState(null);


const previewStyle = {
  width: '100%',
  height: 160,
  objectFit: 'cover',
  borderRadius: 10,
};



  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };


  

  const handleAddPopup = () => {
    setShowAdd(true);
    setShowEdit(false);
    scrollToTop();
  };


const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setForm({ ...form, image: file });

  const previewUrl = URL.createObjectURL(file);
  setImagePreview(previewUrl);
};

const handleRemoveImage = () => {
  setForm({ ...form, image: null });
  setImagePreview(null);
};

const handleEditImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setFormEdit({ ...formEdit, image: file });

  const previewUrl = URL.createObjectURL(file);
  setEditImagePreview(previewUrl);
};


const handleRemoveEditImage = () => {
  setFormEdit({ ...formEdit, image: null });
  setEditImagePreview(null);
};



  const handleEditPopUp = (rowData) => {
    setFormEdit(rowData);
    setSelectedCountry(rowData.country_id);
    getStates(rowData.country_id);

      setEditImagePreview(rowData.image_url || null);
    setShowEdit(true);
    setShowAdd(false);
    scrollToTop();
  };

  // const handleAddSubmit = (e) => {
  //   e.preventDefault();
  //   axios
  //     .post(URLS.AddCity, form, { headers: { Authorization: `Bearer ${token}` } })
  //     .then((res) => {
  //       toast.success(res.data.message);
  //       resetForm();
  //       getData();
  //       scrollToTop();
  //     })
  //     .catch((err) => toast.error(err.response?.data?.message || 'Add failed'));
  // };



  const handleAddSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('country_id', form.country_id);
  formData.append('state_id', form.state_id);

  if (form.image) {
    formData.append('image', form.image);
  }

  axios
    .post(URLS.AddCity, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      toast.success(res.data.message);
      resetForm();
      getData();
    })
    .catch((err) =>
      toast.error(err.response?.data?.message || 'Add failed')
    );
};

  // const handleEditSubmit = (e) => {
  //   e.preventDefault();
  //   const { _id, ...formData } = formEdit;
  //   axios
  //     .put(`${URLS.EditCity}${_id}`, formData, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => {
  //       toast.success(res.data.message);
  //       resetForm();
  //       getData();
  //       scrollToTop();
  //     })
  //     .catch((err) => toast.error(err.response?.data?.message || 'Edit failed'));
  // };


  const handleEditSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', formEdit.name);
  formData.append('country_id', formEdit.country_id);
  formData.append('state_id', formEdit.state_id);
  formData.append('status', formEdit.status);

  if (formEdit.image) {
    formData.append('image', formEdit.image);
  }

  axios
    .put(`${URLS.EditCity}${formEdit._id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      toast.success(res.data.message);
      resetForm();
      getData();
    })
    .catch((err) =>
      toast.error(err.response?.data?.message || 'Edit failed')
    );
};

  const handleDelete = (item) => {
    if (window.confirm('Do you really want to delete?')) {
      axios
        .delete(`${URLS.DeleteCity}${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast.success(res.data.message);
          getData();
          scrollToTop();
        })
        .catch((err) => toast.error(err.response?.data?.message || 'Delete failed'));
    }
  };

  const getData = () => {
    setLoading(true);
    axios
      .post(URLS.GetCity, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data.city || []))
      .catch(() => toast.error('Failed to fetch cities'))
      .finally(() => setLoading(false));
  };

  const getCountries = () => {
    axios
      .post(URLS.GetCountry, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCountries(res.data.country || []))
      .catch(() => toast.error('Failed to fetch countries'));
  };

  const getStates = (country_id) => {
    axios
      .post(
        URLS.GetCountryByState,
        { country_id: country_id },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setStates(res.data.states || []))
      .catch(() => toast.error('Failed to fetch states'));
  };

  const resetForm = () => {
    setForm({ name: '', state_id: '', country_id: '' ,image: null});
    setFormEdit({ name: '', state_id: '', country_id: '',  image: null, _id: '' });

      setImagePreview(null);
  setEditImagePreview(null);
    setSelectedCountry('');
    setShowAdd(false);
    setShowEdit(false);
  };

  useEffect(() => {
    getData();
    getCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) getStates(selectedCountry);
  }, [selectedCountry]);

  useEffect(() => {
    const filtered = search
      ? data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
      : data;
    setFilteredData(filtered);
  }, [data, search]);

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
    { field: 'name', headerName: 'City Name', flex: 1 },
    { field: 'state_name', headerName: 'State Name', flex: 1 },
    { field: 'country_name', headerName: 'Country', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.row.status == 'active' ? 'Active' : 'inactive'}
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
          {rolesAndPermission.city_edit === true || rolesAndPermission.accessAll === true ? (
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
                <IconEdit stroke={1.5} size={18} />
              </Button>
            </>
          ) : (
            <></>
          )}

          {rolesAndPermission.city_delete === true || rolesAndPermission.accessAll === true ? (
            <>
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
            </>
          ) : (
            <></>
          )}
        </Box>
      ),
    },
  ];

  const rows = filteredData.map((item) => ({ id: item._id, ...item }));

  return (
    <PageContainer title="City" description="This is the City page">
      <Breadcrumb title="City" items={BCrumb} />

      {/* Add Form */}
      {showAdd && (
        <form onSubmit={handleAddSubmit}>
          <ParentCard title="Add City" sx={{ overflowX: 'hidden' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <CustomFormLabel htmlFor="country_id">Country</CustomFormLabel>
                <CustomSelect
                  id="country_id"
                  name="country_id"
                  value={form.country_id}
                  onChange={(e) => {
                    const country_id = e.target.value;
                    setSelectedCountry(country_id);
                    setForm({ ...form, country_id, state_id: '' });
                  }}
                  fullWidth
                  required
                >
                  {countries.map((country) => (
                    <MenuItem key={country._id} value={country._id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomFormLabel htmlFor="state_id">State</CustomFormLabel>
                <CustomSelect
                  id="state_id"
                  name="state_id"
                  value={form.state_id}
                  onChange={handleInputChange}
                  fullWidth
                  required
                >
                  {states.map((state) => (
                    <MenuItem key={state._id} value={state._id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomFormLabel htmlFor="name">City Name</CustomFormLabel>
                <CustomTextField
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  placeholder="City Name"
                />
              </Grid>

<Grid item xs={12} md={3}>
  <CustomFormLabel>City Image</CustomFormLabel>

  {!imagePreview ? (
    /* ---- Choose Image Button ---- */
    <Button
      variant="outlined"
      component="label"
      startIcon={<CloudUploadIcon />}
      fullWidth
      sx={{
        textTransform: 'none',
        justifyContent: 'flex-start',
        height: 40,
      }}
    >
      Choose Image
      <input
        type="file"
        hidden
        accept="image/*"
        onChange={handleImageChange}
      />
    </Button>
  ) : (
    /* ---- Image Preview ---- */
    <Box
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
      }}
    >
    <img
  src={imagePreview}
  alt="City"
  style={{
    width: '100%',
    height: 160,
    objectFit: 'cover',
    borderRadius: 10,
  }}
/>


      {/* Actions */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 1,
        }}
      >
        <IconButton
          component="label"
          size="small"
          sx={{ bgcolor: 'white' }}
        >
          <CloudUploadIcon fontSize="small" />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </IconButton>

        <IconButton
          size="small"
          color="error"
          onClick={handleRemoveImage}
          sx={{ bgcolor: 'white' }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )}
</Grid>




            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', py: 2, gap: 1 }}>
              <Button variant="contained" color="error" onClick={resetForm}>
                Close
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </ParentCard>
        </form>
      )}

      {/* Edit Form */}
      {showEdit && (
        <form onSubmit={handleEditSubmit} sx={{ overflowX: 'hidden' }}>
          <ParentCard title="Edit City">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <CustomFormLabel htmlFor="country_id">Country</CustomFormLabel>
                <CustomSelect
                  id="country_id"
                  name="country_id"
                  value={formEdit.country_id}
                  onChange={(e) => {
                    const country_id = e.target.value;
                    setSelectedCountry(country_id);
                    setFormEdit({ ...formEdit, country_id, state_id: '' });
                  }}
                  fullWidth
                  required
                >
                  {countries.map((country) => (
                    <MenuItem key={country._id} value={country._id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomFormLabel htmlFor="state_id">State</CustomFormLabel>
                <CustomSelect
                  id="state_id"
                  name="state_id"
                  value={formEdit.state_id}
                  onChange={handleEditInputChange}
                  fullWidth
                  required
                >
                  {states.map((state) => (
                    <MenuItem key={state._id} value={state._id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomFormLabel htmlFor="name">City Name</CustomFormLabel>
                <CustomTextField
                  id="name"
                  name="name"
                  value={formEdit.name}
                  onChange={handleEditInputChange}
                  fullWidth
                  required
                  placeholder="City Name"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <CustomFormLabel htmlFor="status">Status</CustomFormLabel>
                <CustomSelect
                  id="status"
                  name="status"
                  value={formEdit.status}
                  onChange={handleEditInputChange}
                  fullWidth
                >
                  <MenuItem value="">Select Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">InActive</MenuItem>
                </CustomSelect>
              </Grid>



<Grid item xs={12} md={4}>
  <CustomFormLabel>City Image</CustomFormLabel>

  {!editImagePreview && !formEdit.image_url ? (
    <Button
      variant="outlined"
      component="label"
      startIcon={<CloudUploadIcon />}
      fullWidth
      sx={{ textTransform: 'none', height: 40 }}
    >
      Choose Image
      <input
        type="file"
        hidden
        accept="image/*"
        onChange={handleEditImageChange}
      />
    </Button>
  ) : (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
      }}
    >
      <img
        src={editImagePreview || formEdit.image_url}
        alt="City"
        style={previewStyle}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 1,
        }}
      >
        <IconButton component="label" size="small" sx={{ bgcolor: 'white' }}>
          <CloudUploadIcon fontSize="small" />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleEditImageChange}
          />
        </IconButton>

        <IconButton
          size="small"
          color="error"
          onClick={handleRemoveEditImage}
          sx={{ bgcolor: 'white' }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )}
</Grid>



            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', py: 2, gap: 1 }}>
              <Button variant="contained" color="error" onClick={resetForm}>
                Close
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </ParentCard>
        </form>
      )}

      {/* City Table */}
      <Card sx={{ mt: 3 }} elevation={9} variant="outlined">
        <CardHeader
          title="City List"
          action={
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <TextField
                size="small"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {rolesAndPermission.city_add === true || rolesAndPermission.accessAll === true ? (
                <>
                  <Button variant="contained" color="primary" onClick={handleAddPopup}>
                    <IconPlus /> Create City
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
          <Box sx={{ width: '100%' }}>
            <DataGrid
              autoHeight
              rows={rows}
              columns={columns}
              loading={loading}
              pageSize={5}
              rowsPerPageOptions={PAGE_SIZE_OPTIONS}
              disableRowSelectionOnClick
              localeText={{ noRowsLabel: 'No Cities Found' }}
            />
          </Box>
        </CardContent>
      </Card>
      <ToastContainer />
    </PageContainer>
  );
}

export default City;

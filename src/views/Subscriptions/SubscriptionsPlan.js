import React, { useState, useEffect, useMemo } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { IconPlus, IconEdit, IconTrash, IconMinus } from '@tabler/icons-react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, styled } from '@mui/material';
import {
  FormControlLabel,
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
  RadioGroup,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import CustomRadio from '../../components/forms/theme-elements/CustomRadio';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'SubscriptionsPlan' }];
const ROLE_OPTIONS = [
  { value: 'verified_partner', label: 'verified_partner' },
  { value: 'service_center', label: 'service_center' },
  { value: 'professional', label: 'professional' },
];

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const AddSubscriptionsPlanForm = ({ onClose, onSubmit, serviceTypes }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    services: [], // Array of service IDs
    selectedRoles: [],
    description: '',
    planType: 'free',
    planValidityDays: 'unlimited',
    price: '',
    validDays: '',
  });

  const [availableFeatures, setAvailableFeatures] = useState([{ availableFeatures: '' }]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const roleToServiceIds = useMemo(() => {
    const professional = serviceTypes
      .filter((s) => String(s?.providerType || '').toLowerCase() === 'professional')
      .map((s) => s._id);
    const regular = serviceTypes
      .filter((s) => String(s?.providerType || '').toLowerCase() !== 'professional')
      .map((s) => s._id);
    return {
      professional,
      verified_partner: regular,
      service_center: regular,
    };
  }, [serviceTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRoleSelection = (e) => {
    const selected = e.target.value;
    const ids = new Set();
    selected.forEach((role) => {
      (roleToServiceIds[role] || []).forEach((id) => ids.add(id));
    });
    setForm((prev) => ({ ...prev, selectedRoles: selected, services: Array.from(ids) }));
  };

  const handleChanges = (index, e) => {
    const newAvailableFeatures = [...availableFeatures];
    newAvailableFeatures[index][e.target.name] = e.target.value;
    setAvailableFeatures(newAvailableFeatures);
  };

  const handleAdd = () => {
    setAvailableFeatures([...availableFeatures, { availableFeatures: '' }]);
  };

  const handleRemove = (index) => {
    const newAvailableFeatures = availableFeatures.filter((_, i) => i !== index);
    setAvailableFeatures(newAvailableFeatures);
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

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('SubscriptionsPlan name is required.');
      return;
    }
    if (!form.services || form.services.length === 0) {
      toast.error('Please select at least one role.');
      return;
    }
    if (!file) {
      toast.error('Image is required for new SubscriptionsPlan.');
      return;
    }
    if (availableFeatures.some((feature) => !feature.availableFeatures.trim())) {
      toast.error('All available features must be filled.');
      return;
    }

    const formData = new FormData();
    // Append each serviceId individually so backend sees it as an array
    form.services.forEach((id) => {
      formData.append('serviceId', id);
    });
    formData.append('name', form.name);
    formData.append('planType', form.planType);
    formData.append('allowedRoles', JSON.stringify(form.selectedRoles));
    formData.append('price', form.price || 0);
    formData.append('validDays', form.validDays || 0);
    formData.append('planValidityDays', form.planValidityDays);
    formData.append('description', form.description);
    formData.append('availableFeatures', JSON.stringify(availableFeatures.map(f => f.availableFeatures)));
    formData.append('image', file);

    console.log('Submission Payload:', Object.fromEntries(formData.entries()));
    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create SubscriptionsPlan"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
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
                aria-label="Enter SubscriptionsPlan name"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="image" required>
                Image
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                  'aria-label': 'Upload SubscriptionsPlan image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sm={8}>
              <CustomFormLabel htmlFor="services" required>
                Select Role
              </CustomFormLabel>
              <CustomSelect
                id="services"
                multiple
                name="services"
                value={form.selectedRoles}
                onChange={handleRoleSelection}
                input={<OutlinedInput label="Select Role" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const role = ROLE_OPTIONS.find((r) => r.value === value);
                      return <Chip key={value} label={role?.label || value} />;
                    })}
                  </Box>
                )}
                fullWidth
                variant="outlined"
                aria-label="Select roles"
              >
                {ROLE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox checked={form.selectedRoles.indexOf(option.value) > -1} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="planType" required>
                Plan Type
              </CustomFormLabel>
              <RadioGroup
                row
                aria-label="planType"
                name="planType"
                value={form.planType}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="free"
                  control={<CustomRadio />}
                  label="Free"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="paid"
                  control={<CustomRadio />}
                  label="Paid"
                  labelPlacement="end"
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="planValidityDays" required>
                Plan Validity Days
              </CustomFormLabel>
              <RadioGroup
                row
                aria-label="planValidityDays"
                name="planValidityDays"
                value={form.planValidityDays}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="unlimited"
                  control={<CustomRadio />}
                  label="Unlimited"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="limited"
                  control={<CustomRadio />}
                  label="Limited"
                  labelPlacement="end"
                />
              </RadioGroup>
            </Grid>

            {form.planType == 'paid' ? (
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="price" required>
                  Price
                </CustomFormLabel>
                <CustomTextField
                  type="number"
                  id="price"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Price"
                  name="price"
                  value={form.price}
                  required
                  onChange={handleChange}
                  aria-label="Enter Price"
                />
              </Grid>
            ) : null}

            {form.planValidityDays == 'limited' ? (
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="validDays" required>
                  Valid Days
                </CustomFormLabel>
                <CustomTextField
                  type="number"
                  id="validDays"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Valid Days"
                  name="validDays"
                  value={form.validDays}
                  required
                  onChange={handleChange}
                  aria-label="Enter Valid Days"
                />
              </Grid>
            ) : null}

            <Grid item xs={12} sm={12}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {availableFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={8} key={index}>
                    <Box display="flex" alignItems="flex-end" gap={1}>
                      <Box flex={1}>
                        <CustomFormLabel htmlFor={`availableFeatures-${index}`} required>
                          Available Features
                        </CustomFormLabel>
                        <CustomTextField
                          id={`availableFeatures-${index}`}
                          variant="outlined"
                          fullWidth
                          placeholder="Enter Available Features"
                          name="availableFeatures"
                          value={feature.availableFeatures}
                          required
                          onChange={(e) => handleChanges(index, e)}
                          aria-label="Enter available feature"
                        />
                      </Box>
                      <Box>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemove(index)}
                          disabled={availableFeatures.length === 1}
                          aria-label="Remove feature"
                        >
                          <IconMinus />
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
                <Grid item xs={4} sx={{ mt: 5 }}>
                  <Button variant="outlined" onClick={handleAdd} aria-label="Add new feature">
                    <IconPlus />
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="description">Description</CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                multiline
                rows={4}
                value={form.description}
                onChange={handleChange}
                fullWidth
                aria-label="Enter SubscriptionsPlan description"
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
              aria-label="Create SubscriptionsPlan"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

const EditSubscriptionsPlanForm = ({ onClose, onSubmit, initialData, serviceTypes }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    services: initialData?.serviceId
      ? (Array.isArray(initialData.serviceId)
        ? initialData.serviceId
        : (typeof initialData.serviceId === 'string' && initialData.serviceId.startsWith('[')
          ? JSON.parse(initialData.serviceId)
          : [initialData.serviceId]))
      : [],
    selectedRoles: Array.isArray(initialData?.allowedRoles)
      ? initialData.allowedRoles
      : (typeof initialData?.allowedRoles === 'string' && initialData.allowedRoles.startsWith('[')
        ? JSON.parse(initialData.allowedRoles)
        : []),
    description: initialData?.description || '',
    planType: initialData?.planType || 'free',
    planValidityDays: initialData?.planValidityDays || 'unlimited',
    price: initialData?.price || '',
    validDays: initialData?.validDays || '',
  });

  const [availableFeatures, setAvailableFeatures] = useState(() => {
    if (initialData?.availableFeatures?.length > 0) {
      return initialData.availableFeatures.map((feature) => {
        return {
          availableFeatures: feature.availableFeatures || feature || '',
        };
      });
    }
    return [{ availableFeatures: '' }];
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    initialData?.image ? (URLS.FileBase + initialData.image).replace(/\\/g, '/') : null,
  );
  const roleToServiceIds = useMemo(() => {
    const professional = serviceTypes
      .filter((s) => String(s?.providerType || '').toLowerCase() === 'professional')
      .map((s) => s._id);
    const regular = serviceTypes
      .filter((s) => String(s?.providerType || '').toLowerCase() !== 'professional')
      .map((s) => s._id);
    return {
      professional,
      verified_partner: regular,
      service_center: regular,
    };
  }, [serviceTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRoleSelection = (e) => {
    const selected = e.target.value;
    const ids = new Set();
    selected.forEach((role) => {
      (roleToServiceIds[role] || []).forEach((id) => ids.add(id));
    });
    setForm((prev) => ({ ...prev, selectedRoles: selected, services: Array.from(ids) }));
  };

  const handleChanges = (index, e) => {
    const newAvailableFeatures = [...availableFeatures];
    newAvailableFeatures[index][e.target.name] = e.target.value;
    setAvailableFeatures(newAvailableFeatures);
  };

  const handleAdd = () => {
    setAvailableFeatures([...availableFeatures, { availableFeatures: '' }]);
  };

  const handleRemove = (index) => {
    const newAvailableFeatures = availableFeatures.filter((_, i) => i !== index);
    setAvailableFeatures(newAvailableFeatures);
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

  useEffect(() => {
    return () => {
      if (preview && !preview.startsWith(URLS.FileBase)) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('SubscriptionsPlan name is required.');
      return;
    }
    if (!form.services || form.services.length === 0) {
      toast.error('Please select at least one role.');
      return;
    }
    if (availableFeatures.some((feature) => !feature.availableFeatures.trim())) {
      toast.error('All available features must be filled.');
      return;
    }

    const formData = new FormData();
    // Append each serviceId individually so backend sees it as an array
    form.services.forEach((id) => {
      formData.append('serviceId', id);
    });
    formData.append('name', form.name);
    formData.append('planType', form.planType);
    formData.append('allowedRoles', JSON.stringify(form.selectedRoles));
    formData.append('price', form.price || 0);
    formData.append('validDays', form.validDays || 0);
    formData.append('planValidityDays', form.planValidityDays);
    formData.append('description', form.description);
    formData.append('availableFeatures', JSON.stringify(availableFeatures.map(f => f.availableFeatures)));
    if (file) {
      formData.append('image', file);
    }

    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit SubscriptionsPlan"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="name" required>
                SubscriptionsPlan Name
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter SubscriptionsPlan Name"
                name="name"
                value={form.name}
                required
                onChange={handleChange}
                aria-label="Enter SubscriptionsPlan name"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="image">Image</CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                  'aria-label': 'Upload SubscriptionsPlan image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sm={8}>
              <CustomFormLabel htmlFor="services-edit" required>
                Select Role
              </CustomFormLabel>
              <CustomSelect
                id="services-edit"
                multiple
                name="services"
                value={form.selectedRoles}
                onChange={handleRoleSelection}
                input={<OutlinedInput label="Select Role" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const role = ROLE_OPTIONS.find((r) => r.value === value);
                      return <Chip key={value} label={role?.label || value} />;
                    })}
                  </Box>
                )}
                fullWidth
                variant="outlined"
                aria-label="Select roles"
              >
                {ROLE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox checked={form.selectedRoles.indexOf(option.value) > -1} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="planType" required>
                Plan Type
              </CustomFormLabel>
              <RadioGroup
                row
                aria-label="planType"
                name="planType"
                value={form.planType}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="free"
                  control={<CustomRadio />}
                  label="Free"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="paid"
                  control={<CustomRadio />}
                  label="Paid"
                  labelPlacement="end"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="planValidityDays" required>
                Plan Validity Days
              </CustomFormLabel>
              <RadioGroup
                row
                aria-label="planValidityDays"
                name="planValidityDays"
                value={form.planValidityDays}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="unlimited"
                  control={<CustomRadio />}
                  label="Unlimited"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="limited"
                  control={<CustomRadio />}
                  label="Limited"
                  labelPlacement="end"
                />
              </RadioGroup>
            </Grid>

            {form.planType == 'paid' ? (
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="price" required>
                  Price
                </CustomFormLabel>
                <CustomTextField
                  type="number"
                  id="price"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Price"
                  name="price"
                  value={form.price}
                  required
                  onChange={handleChange}
                  aria-label="Enter Price"
                />
              </Grid>
            ) : null}

            {form.planValidityDays == 'limited' ? (
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="validDays" required>
                  Valid Days
                </CustomFormLabel>
                <CustomTextField
                  type="number"
                  id="validDays"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Valid Days"
                  name="validDays"
                  value={form.validDays}
                  required
                  onChange={handleChange}
                  aria-label="Enter Valid Days"
                />
              </Grid>
            ) : null}

            <Grid item xs={12} sm={12}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {availableFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={8} key={index}>
                    <Box display="flex" alignItems="flex-end" gap={1}>
                      <Box flex={1}>
                        <CustomFormLabel htmlFor={`availableFeatures-${index}`} required>
                          Available Features
                        </CustomFormLabel>
                        <CustomTextField
                          id={`availableFeatures-${index}`}
                          variant="outlined"
                          fullWidth
                          placeholder="Enter Available Features"
                          name="availableFeatures"
                          value={feature.availableFeatures}
                          required
                          onChange={(e) => handleChanges(index, e)}
                          aria-label="Enter available feature"
                        />
                      </Box>
                      <Box>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemove(index)}
                          disabled={availableFeatures.length === 1}
                          aria-label="Remove feature"
                        >
                          <IconMinus />
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
                <Grid item xs={4} sx={{ mt: 5 }}>
                  <Button variant="outlined" onClick={handleAdd} aria-label="Add new feature">
                    <IconPlus />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="description">Description</CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                multiline
                rows={4}
                value={form.description}
                onChange={handleChange}
                fullWidth
                aria-label="Enter SubscriptionsPlan description"
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
              aria-label="Update SubscriptionsPlan"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

const SubscriptionsPlan = () => {
  const theme = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const getToken = () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return '';
      return JSON.parse(user)?.token || '';
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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let res;
      if (id) {
        res = await axios.put(`${URLS.EditSubscriptionsplan}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddSubscriptionsplan, formData, config);
      }

      if (res.status === 200) {
        toast.success(res.data.message);
        handleCloseForm();
        getData();
      }
    } catch (error) {
      const message =
        error.response?.status === 401
          ? 'Unauthorized access. Please log in again.'
          : error.response?.data?.message || 'An error occurred';
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

    if (window.confirm('Do you really want to delete this SubscriptionsPlan?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeleteSubscriptionsplan}/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          getData();
        }
      } catch (error) {
        const message =
          error.response?.status === 400
            ? 'Unauthorized access. Please log in again.'
            : error.response?.data?.message || 'An error occurred';
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
      const res = await axios.post(
        URLS.GetSubscriptionsplan,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.plan || []);
    } catch (error) {
      toast.error('Failed to fetch SubscriptionsPlan.');
      console.error('Failed to fetch SubscriptionsPlan:', error);
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
        const serviceRes = await axios.post(
          URLS.GetActiveServices,
          {
            searchQuery: '',
            serviceType: '',
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setServiceTypes(serviceRes.data.services || []);

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
        item.name.toLowerCase().includes(search.toLowerCase()),
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
        field: 'name',
        headerName: 'Name',
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={(URLS.FileBase + params.row.image).replace(/\\/g, '/')}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">{params.row.name}</Typography>
          </Box>
        ),
      },
      {
        field: 'planType',
        headerName: 'Plan Type',
        flex: 1,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
            {params.row.planType === 'paid'
              ? `${params.row.planType} - Rs ${params.row.price || 0}`
              : params.row.planType}
          </Typography>
        ),
      },
      {
        field: 'planValidityDays',
        headerName: 'Duration',
        flex: 1,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
            {params.row.planValidityDays === 'limited' ? `${params.row.planValidityDays} - ${params.row.validDays || 0} Days` : params.row.planValidityDays}
          </Typography>
        ),
      },

      // {
      //   field: 'serviceName',
      //   headerName: 'Section',
      //   flex: 1,
      //   renderCell: (params) => {
      //     if (!params.value || params.value === 'N/A') return 'N/A';
      //     const names = params.value.split(', ').filter(Boolean);
      //     return (
      //       <Box display="flex" flexDirection="column" gap={0.5} sx={{ py: 1, minHeight: '50px', justifyContent: 'center' }}>
      //         {names.map((name, i) => (
      //           <Typography key={i} variant="body2" sx={{ display: 'block', fontSize: '13px' }}>
      //             • {name}
      //           </Typography>
      //         ))}
      //       </Box>
      //     );
      //   },
      // },
      {
        field: 'allowedRoles',
        headerName: 'Allowed Roles',
        flex: 1,
        minWidth: 220,
        renderCell: (params) => {
          const roles = Array.isArray(params.row.allowedRoles) ? params.row.allowedRoles : [];
          if (!roles.length) return <Typography variant="body2">All</Typography>;
          return (
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {roles.map((role) => (
                <Chip
                  key={role}
                  size="small"
                  label={String(role).replace('_', ' ')}
                  variant="outlined"
                />
              ))}
            </Box>
          );
        },
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
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            {rolesAndPermission.subscription_plans_edit === true ||
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
                  <IconEdit stroke={1.5} size={18} />
                </Button>
              </>
            ) : (
              <></>
            )}
            {rolesAndPermission.subscription_plans_delete === true ||
              rolesAndPermission.accessAll === true ? (
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
    ],
    [loading],
  );

  const rows = useMemo(() => {
    return (
      filteredData?.map((item) => {
        let serviceNames = 'N/A';
        if (item.serviceId) {
          try {
            // Check if it's a JSON array string
            if (typeof item.serviceId === 'string' && item.serviceId.startsWith('[')) {
              const ids = JSON.parse(item.serviceId);
              serviceNames = ids
                .map((id) => serviceTypes.find((s) => s._id === id)?.name)
                .filter(Boolean)
                .join(', ');
            } else if (Array.isArray(item.serviceId)) {
              serviceNames = item.serviceId
                .map((id) => serviceTypes.find((s) => s._id === id)?.name)
                .filter(Boolean)
                .join(', ');
            } else {
              // Single ID string
              serviceNames = serviceTypes.find((s) => s._id === item.serviceId)?.name || 'N/A';
            }
          } catch (e) {
            serviceNames = serviceTypes.find((s) => s._id === item.serviceId)?.name || 'N/A';
          }
        }
        return {
          id: item._id,
          ...item,
          serviceName: serviceNames,
        };
      }) || []
    );
  }, [filteredData, serviceTypes]);

  return (
    <PageContainer
      title="SubscriptionsPlan"
      description="Manage SubscriptionsPlan for your e-commerce platform"
    >
      <Breadcrumb title="SubscriptionsPlan" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && (
        <AddSubscriptionsPlanForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          serviceTypes={serviceTypes}
        />
      )}

      {showEditForm && (
        <EditSubscriptionsPlanForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editData}
          serviceTypes={serviceTypes}
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
          <Typography variant="h6">SubscriptionsPlan List</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'background.paper' }}
              aria-label="Search SubscriptionsPlan"
            />{' '}
            {rolesAndPermission.subscription_plans_add === true ||
              rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create new SubscriptionsPlan"
                >
                  Create SubscriptionsPlan
                </Button>
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
              loading={loading}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              autoHeight
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default SubscriptionsPlan;


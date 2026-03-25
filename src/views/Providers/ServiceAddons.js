import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import {
  IconPlus, IconEdit, IconTrash, IconEye, IconX, IconArrowBackUp, IconRefresh
} from '@tabler/icons-react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Avatar,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  CardContent,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  TextField,
  Switch,
  FormControlLabel
} from '@mui/material';
import axios from 'axios';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/service-requests', title: 'Service Requests' },
  { title: 'Service Addons' }
];

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ IMAGE URL HELPER
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `http://192.168.0.5:5013/${cleanPath}`;
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ API CONFIGURATION
const API_URLS = {
  CREATE: 'http://192.168.0.5:5013/v1/dhubApi/admin/service-addons/create',
  GET_ALL: 'http://192.168.0.5:5013/v1/dhubApi/admin/service-addons/getall',
  GET_SINGLE: 'http://192.168.0.5:5013/v1/dhubApi/admin/service-addons',
  UPDATE: 'http://192.168.0.5:5013/v1/dhubApi/admin/service-addons/update',
  DELETE: 'http://192.168.0.5:5013/v1/dhubApi/admin/service-addons/delete',
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ GET IDS FROM STORAGE
const getProviderId = () => localStorage.getItem('ProfessionalProviderId');
const getServiceId = () => localStorage.getItem('SelectedServiceId');
const getServiceName = () => localStorage.getItem('SelectedServiceName');

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ GET TOKEN
const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.token || localStorage.getItem('token') || null;
  } catch (error) {
    console.error('Token extraction error:', error);
    return null;
  }
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ VIEW DIALOG COMPONENT
const AddonViewDialog = ({ open, onClose, addonData }) => {
  if (!addonData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.lighter' }}>
        <Typography variant="h5" fontWeight={700} color="primary.main">Addon Details</Typography>
        <IconButton onClick={onClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Addon Image */}
          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent="center">
              <Avatar
                src={getImageUrl(addonData.image)}
                sx={{ width: 120, height: 120, boxShadow: 3 }}
                variant="rounded"
              >
                {addonData.childServiceName?.charAt(0)}
              </Avatar>
            </Box>
          </Grid>

          {/* Basic Info */}
          <Grid item xs={12} md={8}>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Addon Name</Typography>
              <Typography variant="h6" fontWeight={600}>{addonData.childServiceName}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Parent Service</Typography>
              <Typography variant="body1">{addonData.parentServiceId?.name}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Status</Typography>
              <Box mt={0.5}>
                <Chip
                  label={addonData.isActive ? 'Active' : 'Inactive'}
                  color={addonData.isActive ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </Box>
          </Grid>

          {/* Price Info */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.lighter', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Price</Typography>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹{addonData.price}
              </Typography>
            </Paper>
          </Grid>


          {/* Display Order */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Display Order</Typography>
              <Typography variant="body1">{addonData.displayOrder}</Typography>
            </Paper>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Description</Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {addonData.description || '-'}
              </Typography>
            </Paper>
          </Grid>

          {/* Timestamps */}
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>Created At</Typography>
            <Typography variant="body2">
              {new Date(addonData.createdAt).toLocaleString('en-IN')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>Last Modified</Typography>
            <Typography variant="body2">
              {new Date(addonData.updatedAt).toLocaleString('en-IN')}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" onClick={onClose} size="large">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ ADDON FORM (Add/Edit) - UPDATED WITH WHITE BACKGROUND & FOOTER BUTTON
const AddonForm = ({
  onClose,
  onSubmit,
  providerId,
  parentServiceId,
  initialData = null,
  isEdit = false,
  loading = false
}) => {
  const theme = useTheme();

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ State for multiple addons
  const [addons, setAddons] = useState(
    initialData
      ? [{
        childServiceName: initialData?.childServiceName || '',
        description: initialData?.description || '',
        price: initialData?.price || '',

        displayOrder: initialData?.displayOrder || 0,
        isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
      }]
      : [{
        childServiceName: '',
        description: '',
        price: '',

        displayOrder: 0,
        isActive: true,
      }]
  );

  const [images, setImages] = useState({
    addon_images: []
  });
  const [previews, setPreviews] = useState({
    image: initialData?.image ? getImageUrl(initialData.image) : null,
    addon_images: []
  });

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Add new addon row
  const handleAddAddon = () => {
    setAddons([...addons, {
      childServiceName: '',
      description: '',
      price: '',
      priceUnit: 'per service',
      displayOrder: addons.length,
      isActive: true,
    }]);
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Remove addon row
  const handleRemoveAddon = (index) => {
    if (addons.length === 1) {
      toast.warning('At least one addon is required');
      return;
    }
    const newAddons = addons.filter((_, i) => i !== index);
    setAddons(newAddons);
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Update addon field
  const handleAddonChange = (index, field, value) => {
    const newAddons = [...addons];
    newAddons[index][field] = value;
    setAddons(newAddons);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && ['jpg', 'jpeg', 'png'].includes(file.name.split('.').pop().toLowerCase())) {
      const newImages = [...images.addon_images, file];
      setImages({ addon_images: newImages });
      setPreviews(prev => ({
        ...prev,
        addon_images: [...prev.addon_images, URL.createObjectURL(file)]
      }));
    } else {
      toast.error('Only JPG, JPEG, PNG allowed');
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    const newImages = images.addon_images.filter((_, i) => i !== index);
    const newPreviews = previews.addon_images.filter((_, i) => i !== index);
    setImages({ addon_images: newImages });
    setPreviews(prev => ({ ...prev, addon_images: newPreviews }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Validate all addons
    const hasEmptyFields = addons.some(addon =>
      !addon.childServiceName?.trim() || !addon.price || parseFloat(addon.price) <= 0
    );

    if (hasEmptyFields) {
      toast.error('Please fill all required fields for each addon');
      return;
    }

    const formData = new FormData();

    if (isEdit) {
      // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ EDIT MODE - Send individual fields (single addon)
      formData.append('childServiceName', addons[0].childServiceName);
      formData.append('description', addons[0].description);
      formData.append('price', addons[0].price);

      formData.append('displayOrder', addons[0].displayOrder);
      formData.append('isActive', addons[0].isActive);
    } else {
      // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ CREATE MODE - Send as childServices array (multiple addons)
      formData.append('providerId', providerId);
      formData.append('parentServiceId', parentServiceId);

      const childServices = addons.map(addon => ({
        name: addon.childServiceName,
        price: parseFloat(addon.price),
        description: addon.description || '',
        displayOrder: parseInt(addon.displayOrder) || 0,
        isActive: addon.isActive
      }));

      formData.append('childServices', JSON.stringify(childServices));
    }

    // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Add images
    images.addon_images.forEach(img => formData.append('addon_images', img));

    console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â¤ Submitting addons:', addons);
    onSubmit(formData, initialData?._id);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title={isEdit ? "Edit Addon" : "Create Multiple Addons"}
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Box sx={{ p: 2 }}>
            {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ MULTIPLE ADDON ROWS - WHITE BACKGROUND */}
            {addons.map((addon, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  p: 3,
                  mb: 3,
                  bgcolor: 'background.paper',
                  position: 'relative',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 3,
                    borderColor: 'primary.light'
                  }
                }}
              >
                {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Section Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`Addon #${index + 1}`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700, borderRadius: '4px' }}
                    />
                    <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                      {addon.childServiceName || 'New Addon Details'}
                    </Typography>
                  </Box>

                  {!isEdit && addons.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveAddon(index)}
                      sx={{
                        bgcolor: 'error.lighter',
                        color: 'error.main',
                        '&:hover': { bgcolor: 'error.main', color: 'white' }
                      }}
                      size="small"
                    >
                      <IconTrash size={18} />
                    </IconButton>
                  )}
                </Box>

                <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}>
                    <CustomFormLabel required>Addon Name*</CustomFormLabel>
                    <CustomTextField
                      value={addon.childServiceName}
                      onChange={(e) => handleAddonChange(index, 'childServiceName', e.target.value)}
                      fullWidth
                      required
                      placeholder="e.g. Extra Cleaning, Express Delivery"
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel required>Price (ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹)*</CustomFormLabel>
                    <CustomTextField
                      type="number"
                      value={addon.price}
                      onChange={(e) => handleAddonChange(index, 'price', e.target.value)}
                      fullWidth
                      required
                      inputProps={{ min: 0, step: "0.01" }}
                      placeholder="0.00"
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={2}>
                    <CustomFormLabel>Display Order</CustomFormLabel>
                    <CustomTextField
                      type="number"
                      value={addon.displayOrder}
                      onChange={(e) => handleAddonChange(index, 'displayOrder', e.target.value)}
                      fullWidth
                      inputProps={{ min: 0 }}
                      placeholder="0"
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <CustomFormLabel>Status</CustomFormLabel>
                    <Box sx={{ mt: 0.5 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={addon.isActive}
                            onChange={(e) => handleAddonChange(index, 'isActive', e.target.checked)}
                            color="primary"
                          />
                        }
                        label={addon.isActive ? "Active" : "Inactive"}
                        sx={{ ml: 0 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <CustomFormLabel>Description</CustomFormLabel>
                    <CustomTextField
                      value={addon.description}
                      onChange={(e) => handleAddonChange(index, 'description', e.target.value)}
                      multiline
                      rows={2}
                      fullWidth
                      placeholder="Briefly describe what this addon includes"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}

            {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ REMOVED: Dashed button from here */}

            <Divider sx={{ my: 2 }} />

            {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ ADDON IMAGE - EDIT MODE */}
            {isEdit && previews.image && (
              <Box sx={{ mb: 3 }}>
                <CustomFormLabel>Current Addon Image</CustomFormLabel>
                <Box sx={{ position: 'relative', display: 'inline-block', mt: 2 }}>
                  <Avatar
                    src={previews.image}
                    sx={{
                      width: 150,
                      height: 150,
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: 'divider'
                    }}
                    variant="rounded"
                  />

                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: 36,
                      height: 36,
                      '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.1)' },
                      boxShadow: 3,
                      transition: 'all 0.2s'
                    }}
                    title="Upload new image"
                  >
                    <IconPlus size={20} />
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageChange}
                    />
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      setPreviews(prev => ({ ...prev, image: null }));
                    }}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: 'error.main',
                      color: 'white',
                      width: 28,
                      height: 28,
                      '&:hover': { bgcolor: 'error.dark', transform: 'scale(1.1)' },
                      boxShadow: 3,
                      transition: 'all 0.2s'
                    }}
                    title="Remove image"
                  >
                    <IconX size={16} />
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ ADDON IMAGES */}
            <Box>
              <CustomFormLabel>Addon Images (Optional)</CustomFormLabel>

              {previews.addon_images.length > 0 ? (
                <Box mt={2}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Images ({previews.addon_images.length}):
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
                    {previews.addon_images.map((preview, idx) => (
                      <Box key={idx} sx={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar
                          src={preview}
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: 'divider'
                          }}
                          variant="rounded"
                        />

                        <IconButton
                          component="label"
                          sx={{
                            position: 'absolute',
                            bottom: 4,
                            left: 4,
                            bgcolor: 'primary.main',
                            color: 'white',
                            width: 28,
                            height: 28,
                            '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.1)' },
                            boxShadow: 2,
                            transition: 'all 0.2s'
                          }}
                          title="Replace image"
                        >
                          <IconPlus size={16} />
                          <input
                            type="file"
                            hidden
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file && ['jpg', 'jpeg', 'png'].includes(file.name.split('.').pop().toLowerCase())) {
                                const newImages = [...images.addon_images];
                                const newPreviews = [...previews.addon_images];
                                newImages[idx] = file;
                                newPreviews[idx] = URL.createObjectURL(file);
                                setImages({ addon_images: newImages });
                                setPreviews(prev => ({ ...prev, addon_images: newPreviews }));
                              } else {
                                toast.error('Only JPG, JPEG, PNG allowed');
                                e.target.value = '';
                              }
                            }}
                          />
                        </IconButton>

                        <IconButton
                          onClick={() => removeImage(idx)}
                          sx={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            bgcolor: 'error.main',
                            color: 'white',
                            width: 24,
                            height: 24,
                            '&:hover': { bgcolor: 'error.dark', transform: 'scale(1.1)' },
                            boxShadow: 2,
                            transition: 'all 0.2s'
                          }}
                          title="Remove image"
                        >
                          <IconX size={14} />
                        </IconButton>

                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                            bgcolor: 'info.main',
                            color: 'white',
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            boxShadow: 2
                          }}
                        >
                          {idx + 1}
                        </Box>
                      </Box>
                    ))}

                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: 2,
                        border: '2px dashed',
                        borderColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        bgcolor: 'primary.lighter',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'primary.light',
                          transform: 'scale(1.05)'
                        }
                      }}
                      component="label"
                    >
                      <Box textAlign="center">
                        <IconPlus size={32} />
                        <Typography variant="caption" fontWeight={600}>
                          Add More
                        </Typography>
                      </Box>
                      <input
                        type="file"
                        hidden
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleImageChange}
                      />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box mt={2}>
                  <CustomTextField
                    type="file"
                    fullWidth
                    onChange={handleImageChange}
                    inputProps={{ accept: 'image/jpeg,image/png,image/jpg' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Upload addon images (JPG, JPEG, PNG)
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Divider />

          {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ UPDATED FOOTER - ADD ANOTHER ADDON BUTTON MOVED HERE */}
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} sx={{ p: 2 }}>
            {/* Left side - Counter */}
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {isEdit ? '1 addon' : `${addons.length} addon(s) to create`}
            </Typography>

            {/* Right side - Action buttons */}
            <Box display="flex" gap={2}>
              {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ ADD ANOTHER ADDON - MOVED HERE */}
              {!isEdit && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<IconPlus />}
                  onClick={handleAddAddon}
                  disabled={loading}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 160
                  }}
                >
                  Add Another Addon
                </Button>
              )}

              <Button
                color="error"
                variant="outlined"
                onClick={onClose}
                disabled={loading}
                sx={{ textTransform: 'none', minWidth: 100 }}
              >
                Cancel
              </Button>

              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ textTransform: 'none', fontWeight: 600, minWidth: 140 }}
              >
                {loading ? 'Saving...' : isEdit ? 'Update Addon' : `Create ${addons.length} Addon(s)`}
              </Button>
            </Box>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ MAIN COMPONENT
const ServiceAddons = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const providerId = getProviderId();
  const parentServiceId = getServiceId();
  const serviceName = getServiceName();
  const token = getToken();

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ GET ALL ADDONS
  const getData = useCallback(async () => {
    if (!providerId || !token) {
      if (!providerId) toast.error('No provider selected');
      if (!token) toast.error('Please login again');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        providerId,
        page: 1,
        limit: 100
      });
      if (search) params.append('search', search);

      const res = await axios.get(`${API_URLS.GET_ALL}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allAddons = res.data.data || [];
      const filtered = parentServiceId
        ? allAddons.filter(addon => addon.parentServiceId?._id === parentServiceId)
        : allAddons;

      setData(filtered);
      console.log('ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Loaded addons:', filtered.length);
    } catch (error) {
      console.error('ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€¦Ã¢â‚¬â„¢ Error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to load addons');
    } finally {
      setLoading(false);
    }
  }, [providerId, parentServiceId, token, search]);

  const getSingleAddon = async (addonId) => {
    setLoading(true);
    try {
      console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â¡ Fetching addon:', addonId);
      const res = await axios.get(`${API_URLS.GET_SINGLE}/${addonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Addon data:', res.data.data);
      setEditData(res.data.data);
      setIsEditMode(true);
      setShowForm(true);
    } catch (error) {
      console.error('ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€¦Ã¢â‚¬â„¢ Fetch error:', error.response?.data);
      toast.error('Failed to load addon details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData, id = null) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (id) {
        console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â Updating addon:', id);
        res = await axios.put(`${API_URLS.UPDATE}/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â¤ Creating addon...');
        res = await axios.post(API_URLS.CREATE, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      console.log('ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Success:', res.data);
      toast.success(res.data.message);
      setShowForm(false);
      setIsEditMode(false);
      setEditData(null);
      getData();
    } catch (error) {
      console.error('ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€¦Ã¢â‚¬â„¢ Submit error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete "${row.childServiceName}"?`)) return;

    setLoading(true);
    try {
      await axios.delete(`${API_URLS.DELETE}/${row._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Addon deleted successfully');
      getData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (row) => {
    setViewData(row);
    setViewDialogOpen(true);
  };

  const handleEdit = (row) => {
    getSingleAddon(row._id);
  };

  useEffect(() => {
    if (providerId && token) {
      getData();
    }
  }, [providerId, token, getData]);

  useEffect(() => {
    const filtered = data.filter(item =>
      item.childServiceName?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, search]);

  const columns = useMemo(() => [
    {
      field: 'sno',
      headerName: 'S.No',
      width: 60,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          {params.api.getSortedRowIds().indexOf(params.id) + 1}
        </Typography>
      )
    },
    {
      field: 'addonInfo',
      headerName: 'Addon Info',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar
            src={getImageUrl(params.row.image)}
            sx={{ width: 40, height: 40 }}
          >
            {params.row.childServiceName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600} noWrap>
              {params.row.childServiceName}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 110,
      renderCell: (params) => (
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ lineHeight: 1.2 }}>
            ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹{params.row.price}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
            {params.row.priceUnit}
          </Typography>
        </Box>
      )
    },
    {
      field: 'displayOrder',
      headerName: 'Order',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip label={params.row.displayOrder} size="small" variant="outlined" />
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.row.isActive ? 'Active' : 'Inactive'}
          color={params.row.isActive ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 250,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box display="flex" gap={0.5} justifyContent="center">
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleEdit(params.row)}
            disabled={loading}
            startIcon={<IconEdit size={14} />}
            sx={{
              minWidth: 70,
              px: 1,
              py: 0.5,
              textTransform: 'none',
              fontSize: '0.7rem',
              borderRadius: '20px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderRadius: '4px',
                bgcolor: 'primary.main',
                color: 'white',
                transform: 'scale(1.08)',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)'
              }
            }}
          >
            Edit
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row)}
            disabled={loading}
            startIcon={<IconTrash size={14} />}
            sx={{
              minWidth: 75,
              px: 1,
              py: 0.5,
              textTransform: 'none',
              fontSize: '0.7rem',
              borderRadius: '20px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderRadius: '4px',
                bgcolor: 'error.main',
                color: 'white',
                transform: 'scale(1.08)',
                boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)'
              }
            }}
          >
            Delete
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="info"
            onClick={() => handleView(params.row)}
            disabled={loading}
            startIcon={<IconEye size={14} />}
            sx={{
              minWidth: 65,
              px: 1,
              py: 0.5,
              textTransform: 'none',
              fontSize: '0.7rem',
              borderRadius: '20px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderRadius: '4px',
                bgcolor: 'info.main',
                color: 'white',
                transform: 'scale(1.08)'
              }
            }}
          >
            View
          </Button>
        </Box>
      )
    }
  ], [loading]);

  const rows = useMemo(() =>
    filteredData.map(item => ({ id: item._id, ...item }))
    , [filteredData]);

  if (!providerId) {
    return (
      <PageContainer title="Service Addons">
        <Breadcrumb title="Service Addons" items={BCrumb} />
        <Alert severity="warning" sx={{ mt: 3 }}>
          No Provider selected. Please select a service request first.
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Service Addons" description="Manage addons for service requests">
      <Breadcrumb title="Service Addons" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <AddonViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        addonData={viewData}
      />

      {showForm && (
        <AddonForm
          onClose={() => {
            setShowForm(false);
            setIsEditMode(false);
            setEditData(null);
          }}
          onSubmit={handleSubmit}
          providerId={providerId}
          parentServiceId={parentServiceId}
          initialData={editData}
          isEdit={isEditMode}
          loading={loading}
        />
      )}

      {serviceName && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.lighter' }}>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            Addons for: {serviceName}
          </Typography>
        </Paper>
      )}

      <Paper sx={{ mt: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: '12px', boxShadow: theme.shadows[3] }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={3} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h5" fontWeight={700} color="primary">
              Service Addons
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all service addons and pricing
            </Typography>
          </Box>

          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" sx={{ pr: 2 }}>
            <TextField
              size="small"
              placeholder="Search addons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 200, md: 300 }, bgcolor: 'background.paper' }}
            />
            <IconButton onClick={getData} disabled={loading} color="primary">
              <IconRefresh />
            </IconButton>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setShowForm(true);
                setIsEditMode(false);
                setEditData(null);
              }}
              disabled={loading}
              startIcon={<IconPlus size={20} />}
              sx={{ mr: 1 }}
            >
              Add Addon
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(-1)}
              startIcon={<IconArrowBackUp />}
            >
              Back
            </Button>
          </Box>
        </Box>

        <Divider />
        <CardContent sx={{ p: [2, 3] }}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              disableRowSelectionOnClick
              autoHeight={false}
              sx={{
                border: 'none',
                '& .MuiDataGrid-main': { border: 'none' },
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: 'grey.50',
                  fontWeight: 600,
                  borderBottom: `2px solid ${theme.palette.divider}`
                },
                '& .MuiDataGrid-cell': {
                  padding: '6px 8px',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center'
                },
                '& .MuiDataGrid-row:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default ServiceAddons;


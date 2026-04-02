import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import {
  Paper,
  Box,
  Typography,
  Button,
  Divider,
  CardContent,
  Avatar,
  Chip,
  Grid,
  Select,
  MenuItem,
  Alert,
  IconButton,

} from '@mui/material';
import { IconPlus, IconEdit, IconTrash, IconArrowBackUp, IconX } from '@tabler/icons-react';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Spare Parts' }];

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ ADDON API URLs
const ADDON_API_URLS = {
  GET_ADDONS: 'https://api.doorstephub.com/v1/dhubApi/admin/professional-service-addons/get-addons',
  GET_ADDON: 'https://api.doorstephub.com/v1/dhubApi/admin/professional-service-addons/get-addon',
  CREATE_ADDON: 'https://api.doorstephub.com/v1/dhubApi/admin/professional-service-addons/create-addon',
  UPDATE_ADDON: 'https://api.doorstephub.com/v1/dhubApi/admin/professional-service-addons/update-addon',
  DELETE_ADDON: 'https://api.doorstephub.com/v1/dhubApi/admin/professional-service-addons/delete-addon',
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ UTILITY FUNCTIONS
const getProfessionalProviderId = () => {
  return localStorage.getItem('ProfessionalProviderId') ||
    new URLSearchParams(window.location.search).get('providerId');
};

const getSelectedServiceId = () => {
  return localStorage.getItem('SelectedServiceId') ||
    new URLSearchParams(window.location.search).get('serviceId');
};

const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.token || localStorage.getItem('token') || null;
  } catch (error) {
    console.error('Token extraction error:', error);
    return null;
  }
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ ADDON FORM COMPONENT - WITH EDIT SUPPORT
const AddonForm = ({
  onClose,
  onSubmit,
  professionalProviderId,
  parentServiceId,
  initialData = null,
  isEdit = false,
  loading = false
}) => {
  const theme = useTheme();

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ EDIT MODE: Single addon form
  const [form, setForm] = useState({
    childServiceName: initialData?.childServiceName || '',
    price: initialData?.price || '',
    purchasePrice: initialData?.purchasePrice || '',
    salePrice: initialData?.salePrice || initialData?.price || '',
    warrantyDays: initialData?.warrantyDays || '',
    description: initialData?.description || '',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true
  });

  const [singleFiles, setSingleFiles] = useState({
    purchasePriceBillDocument: null
  });
  const [singlePreviews, setSinglePreviews] = useState({
    purchasePriceBillDocument: initialData?.purchaseBillDocument ? `https://api.doorstephub.com/${initialData.purchaseBillDocument}` : null
  });


  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ CREATE MODE: Multiple addons
  const [addonsList, setAddonsList] = useState([
    {
      childServiceName: '',
      price: '',
      purchasePrice: '',
      salePrice: '',
      warrantyDays: '',
      description: '',
      purchasePriceBillDocument: null,
      purchasePriceBillDocumentPreview: null
    }
  ]);

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Add new addon row (CREATE mode only)
  const addAddonRow = () => {
    setAddonsList(prev => [
      ...prev,
      {
        childServiceName: '',
        price: '',
        purchasePrice: '',
        salePrice: '',
        warrantyDays: '',
        description: '',
        purchasePriceBillDocument: null,
        purchasePriceBillDocumentPreview: null
      }
    ]);
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Remove addon row (CREATE mode only)
  const removeAddonRow = (index) => {
    if (addonsList.length > 1) {
      setAddonsList(prev => prev.filter((_, i) => i !== index));
    }
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Update specific addon field (CREATE mode)
  const handleAddonChange = (index, field, value) => {
    const newList = [...addonsList];
    newList[index][field] = value;
    setAddonsList(newList);
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Handle file upload for specific spare part row (CREATE mode)
  const handleRowFileChange = (index, e, type) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
      const isDocument = ['pdf', 'jpg', 'jpeg', 'png'].includes(ext);

      const newList = [...addonsList];
      if (type === 'bill' && isDocument) {
        newList[index].purchasePriceBillDocument = file;
        newList[index].purchasePriceBillDocumentPreview = isImage ? URL.createObjectURL(file) : 'document';
        setAddonsList(newList);
      } else {
        toast.error('Invalid file type');
      }
    }
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Handle form change (EDIT mode)
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Handle single image (EDIT mode)
  const handleSingleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
      const isDocument = ['pdf', 'jpg', 'jpeg', 'png'].includes(ext);

      if (type === 'bill' && isDocument) {
        setSingleFiles(prev => ({ ...prev, purchasePriceBillDocument: file }));
        setSinglePreviews(prev => ({ ...prev, purchasePriceBillDocument: isImage ? URL.createObjectURL(file) : 'document' }));
      } else {
        toast.error('Invalid file type');
      }
    }
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ FORM SUBMIT - Handles both CREATE and EDIT
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (isEdit) {
      // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Validate
      if (!form.childServiceName.trim() || !form.salePrice) {
        toast.error('Name and Sale Price are required');
        return;
      }

      // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ EDIT MODE: Update single addon
      formData.append('childServiceName', form.childServiceName.trim());
      formData.append('price', parseFloat(form.salePrice || form.price));
      formData.append('salePrice', parseFloat(form.salePrice || form.price));
      formData.append('purchasePrice', parseFloat(form.purchasePrice || 0));
      formData.append('warrantyDays', parseInt(form.warrantyDays || 0));
      formData.append('description', form.description || '');
      formData.append('isActive', form.isActive);

      if (singleFiles.purchasePriceBillDocument) {
        formData.append('purchasePriceBillDocument', singleFiles.purchasePriceBillDocument);
      }

    } else {
      // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ CREATE MODE: Multiple addons
      const validAddons = addonsList.filter(addon =>
        addon.childServiceName.trim() &&
        addon.salePrice &&
        parseFloat(addon.salePrice) > 0
      );

      if (validAddons.length === 0) {
        toast.error('Please fill at least one valid addon');
        return;
      }

      formData.append('professionalProviderId', professionalProviderId);
      formData.append('parentServiceId', parentServiceId);

      const childServicesArray = validAddons.map(addon => ({
        name: addon.childServiceName.trim(),
        price: parseFloat(addon.salePrice || addon.price),
        salePrice: parseFloat(addon.salePrice || addon.price),
        purchasePrice: parseFloat(addon.purchasePrice || 0),
        warrantyDays: parseInt(addon.warrantyDays || 0),
        description: addon.description || ''
      }));

      formData.append('childServices', JSON.stringify(childServicesArray));

      // Since it's a batch, we'll take the first bill document if any
      const firstBill = validAddons.find(a => a.purchasePriceBillDocument);
      if (firstBill) {
        formData.append('purchasePriceBillDocument', firstBill.purchasePriceBillDocument);
      }

      console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â¤ CREATE FormData:', {
        professionalProviderId,
        parentServiceId,
        childServicesCount: childServicesArray.length
      });
    }

    onSubmit(formData);
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ EDIT MODE FORM
  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ EDIT MODE FORM - Image with Upload/Remove buttons
  if (isEdit) {
    return (
      <Box sx={{ py: 1 }}>
        <form onSubmit={handleFormSubmit}>
          <ParentCard title="Edit Spare Part" sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" fontWeight={700} color="primary">Basic Information</Typography>
                    <Divider sx={{ flex: 1 }} />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <CustomFormLabel required>Spare Part Name*</CustomFormLabel>
                      <CustomTextField
                        name="childServiceName"
                        fullWidth
                        required
                        value={form.childServiceName}
                        onChange={handleFormChange}
                        placeholder="e.g., LED Panel, Capacitor etc."
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <CustomFormLabel>Status</CustomFormLabel>
                      <Select
                        name="isActive"
                        fullWidth
                        value={form.isActive}
                        onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                        size="small"
                      >
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight={700} color="primary" sx={{ mt: 1 }}>Pricing & Warranty</Typography>
                  <Divider />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFormLabel required>Purchase Price (ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹)</CustomFormLabel>
                  <CustomTextField
                    name="purchasePrice"
                    type="number"
                    fullWidth
                    value={form.purchasePrice}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFormLabel required>Sale Price (ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹)*</CustomFormLabel>
                  <CustomTextField
                    name="salePrice"
                    type="number"
                    fullWidth
                    required
                    value={form.salePrice}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFormLabel>Warranty Days</CustomFormLabel>
                  <CustomTextField
                    name="warrantyDays"
                    type="number"
                    fullWidth
                    value={form.warrantyDays}
                    onChange={handleFormChange}
                    placeholder="e.g. 90"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="primary">Media & Details</Typography>
                    <Divider sx={{ flex: 1 }} />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <CustomFormLabel>Description (Optional)</CustomFormLabel>
                      <CustomTextField
                        name="description"
                        fullWidth
                        multiline
                        rows={3}
                        value={form.description}
                        onChange={handleFormChange}
                        placeholder="Brief description about the spare part"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <CustomFormLabel>Purchase Bill (Optional)</CustomFormLabel>
                      <Box sx={{
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 2,
                        textAlign: 'center',
                        bgcolor: 'grey.50',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        {singlePreviews.purchasePriceBillDocument ? (
                          <Box sx={{ position: 'relative', width: '100%' }}>
                            {singlePreviews.purchasePriceBillDocument === 'document' ? (
                              <Typography variant="subtitle2" color="primary">DOC/PDF Uploaded</Typography>
                            ) : (
                              <Avatar src={singlePreviews.purchasePriceBillDocument} variant="rounded" sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }} />
                            )}
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setSingleFiles(prev => ({ ...prev, purchasePriceBillDocument: null }));
                                setSinglePreviews(prev => ({ ...prev, purchasePriceBillDocument: null }));
                              }}
                              sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'white', border: '1px solid #eee' }}
                            >
                              <IconX size={14} />
                            </IconButton>
                          </Box>
                        ) : (
                          <Button variant="text" component="label" startIcon={<IconPlus />}>
                            Upload Bill
                            <input type="file" hidden onChange={(e) => handleSingleFileChange(e, 'bill')} />
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ BILL DOCUMENT */}
                <Grid item xs={12} md={6}>
                  <CustomFormLabel>Purchase Bill Document (Optional)</CustomFormLabel>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ py: 1.5, borderStyle: 'dashed' }}
                    >
                      {singleFiles.purchasePriceBillDocument ? singleFiles.purchasePriceBillDocument.name :
                        singlePreviews.purchasePriceBillDocument ? 'Change Document' : 'Upload Purchase Bill'}
                      <input type="file" hidden onChange={(e) => handleSingleFileChange(e, 'bill')} />
                    </Button>
                    {singlePreviews.purchasePriceBillDocument && (
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSingleFiles(prev => ({ ...prev, purchasePriceBillDocument: null }));
                          setSinglePreviews(prev => ({ ...prev, purchasePriceBillDocument: null }));
                        }}
                      >
                        <IconX size={20} />
                      </IconButton>
                    )}
                  </Box>
                </Grid>

              </Grid>
            </Box>

            <Divider />
            <Box display="flex" justifyContent="flex-end" gap={2} sx={{ p: 3 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading || !form.childServiceName.trim() || !form.salePrice}
              >
                {loading ? 'Updating...' : 'Update Spare Part'}
              </Button>
            </Box>
          </ParentCard>
        </form>
      </Box>
    );
  }


  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ CREATE MODE FORM (Multiple Addons)
  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleFormSubmit}>
        <ParentCard title="Create Multiple Spare Parts" sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add multiple spare parts with individual images for the same parent service
            </Typography>
          </Box>

          {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ DYNAMIC ADDON ROWS */}
          {addonsList.map((addon, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                mx: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.light',
                  boxShadow: 2
                }
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip label={`Spare Part #${index + 1}`} color="primary" size="small" sx={{ borderRadius: '4px', fontWeight: 700 }} />
                  <Typography variant="subtitle1" color="primary" fontWeight={700}>
                    {addon.childServiceName || 'New Spare Part Details'}
                  </Typography>
                </Box>
                {addonsList.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => removeAddonRow(index)}
                    size="small"
                    sx={{ bgcolor: 'error.lighter', '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                  >
                    <IconTrash size={18} />
                  </IconButton>
                )}
              </Box>

              <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <CustomFormLabel required>Spare Part Name*</CustomFormLabel>
                      <CustomTextField
                        fullWidth
                        required
                        placeholder="e.g., LED Panel, Capacitor etc."
                        value={addon.childServiceName}
                        onChange={(e) => handleAddonChange(index, 'childServiceName', e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <CustomFormLabel>Warranty Days</CustomFormLabel>
                      <CustomTextField
                        type="number"
                        fullWidth
                        placeholder="e.g. 90"
                        value={addon.warrantyDays}
                        onChange={(e) => handleAddonChange(index, 'warrantyDays', e.target.value)}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFormLabel>Purchase Price (ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹)</CustomFormLabel>
                  <CustomTextField
                    type="number"
                    fullWidth
                    placeholder="0.00"
                    value={addon.purchasePrice}
                    onChange={(e) => handleAddonChange(index, 'purchasePrice', e.target.value)}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFormLabel required>Sale Price (ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹)*</CustomFormLabel>
                  <CustomTextField
                    type="number"
                    fullWidth
                    required
                    placeholder="0.00"
                    value={addon.salePrice}
                    onChange={(e) => handleAddonChange(index, 'salePrice', e.target.value)}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFormLabel>Purchase Bill (Optional)</CustomFormLabel>
                  <Box sx={{
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 1,
                    bgcolor: 'grey.50',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Button variant="text" component="label" size="small" startIcon={<IconPlus />}>
                      {addon.purchasePriceBillDocument ? 'Change' : 'Upload'}
                      <input type="file" hidden onChange={(e) => handleRowFileChange(index, e, 'bill')} />
                    </Button>
                    {addon.purchasePriceBillDocument && (
                      <Typography variant="caption" color="success.main" fontWeight={700} noWrap sx={{ maxWidth: 100 }}>
                        {addon.purchasePriceBillDocument.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <CustomFormLabel>Description</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Enter description (optional)"
                    value={addon.description}
                    onChange={(e) => handleAddonChange(index, 'description', e.target.value)}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Divider />
          <Box display="flex" justifyContent="flex-end" gap={2} sx={{ p: 3 }}>

            <Button
              variant="outlined"
              startIcon={<IconPlus size={20} />}
              onClick={addAddonRow}
              size="large"
              disabled={loading}
            >
              Add Another Spare Part
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={onClose}
              disabled={loading}
              size="large"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || addonsList.every(a => !a.childServiceName.trim() || !a.salePrice)}
              size="large"
            >
              {loading ? 'Creating...' :
                addonsList.length === 1
                  ? 'Create 1 Spare Part'
                  : `Create ${addonsList.filter(a => a.childServiceName.trim()).length} Spare Parts`
              }
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ MAIN COMPONENT
const ProviderServiceAddons = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [addonsData, setAddonsData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const professionalProviderId = getProfessionalProviderId();
  const selectedServiceId = getSelectedServiceId();
  const serviceName = localStorage.getItem('SelectedServiceName') || 'Selected Service';
  const token = getToken();

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Get all addons for provider
  const getAddons = useCallback(async () => {
    if (!professionalProviderId || !token) {
      toast.error('Missing provider or token');
      return;
    }

    setLoading(true);
    try {
      console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â¡ Loading addons for provider:', professionalProviderId);
      const payload = { professionalProviderId };

      const res = await axios.post(ADDON_API_URLS.GET_ADDONS, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const allAddons = res.data.data?.flatMap(group =>
        group.addons.map(addon => ({
          id: addon._id,
          _id: addon._id,
          ...addon,
          parentServiceName: group.parentService.name,
          parentServiceId: group.parentService._id
        }))
      ) || [];

      setAddonsData(allAddons);
      console.log('ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Loaded', allAddons.length, 'addons');
    } catch (error) {
      console.error('ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€¦Ã¢â‚¬â„¢ Addons error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to load addons');
    } finally {
      setLoading(false);
    }
  }, [professionalProviderId, token]);

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ CRUD Operations
  const handleSubmit = async (formData) => {
    if (!token) {
      toast.error('Authentication token missing');
      return;
    }

    setLoading(true);
    try {
      let res;

      if (isEditMode && editData?._id) {
        // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ UPDATE ADDON
        console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â Updating addon:', editData._id);
        res = await axios.put(
          `${ADDON_API_URLS.UPDATE_ADDON}/${editData._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ CREATE SPARE PART(S)
        console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â¤ Creating spare parts...');
        res = await axios.post(ADDON_API_URLS.CREATE_ADDON, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      console.log('ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Success:', res.data);
      toast.success(res.data.message || 'Operation successful');
      setShowForm(false);
      setIsEditMode(false);
      setEditData(null);
      getAddons();
    } catch (error) {
      console.error('ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€¦Ã¢â‚¬â„¢ Error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ EDIT: Fetch addon by ID
  const handleEdit = async (addonId) => {
    setLoading(true);
    try {
      console.log('ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€šÃ‚Â¡ Fetching spare part:', addonId);
      const res = await axios.get(`${ADDON_API_URLS.GET_ADDON}/${addonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Spare part data:', res.data.data);
      setEditData(res.data.data);
      setIsEditMode(true);
      setShowForm(true);
    } catch (error) {
      console.error('ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€¦Ã¢â‚¬â„¢ Fetch error:', error.response?.data);
      toast.error('Failed to load spare part details');
    } finally {
      setLoading(false);
    }
  };

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ DELETE spare part
  const handleDelete = async (addonId) => {
    if (!window.confirm('Are you sure you want to delete this spare part?')) return;

    try {
      await axios.delete(`${ADDON_API_URLS.DELETE_ADDON}/${addonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Spare part deleted successfully');
      getAddons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  // Effects
  useEffect(() => {
    if (professionalProviderId && token) {
      getAddons();
    }
  }, [professionalProviderId, token, getAddons]);

  useEffect(() => {
    const filtered = addonsData.filter(item =>
      item.childServiceName?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.parentServiceName?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [addonsData, search]);

  const columns = useMemo(() => [
    {
      field: 'sno',
      headerName: 'S.No',
      width: 70,
      sortable: false,
      renderCell: (params) => {
        const sortedRows = params.api.getSortedRowIds();
        return sortedRows.indexOf(params.id) + 1;
      }
    },
    {
      field: 'addonInfo',
      headerName: 'Spare Part Info',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} noWrap>
          {params.row.childServiceName}
        </Typography>
      )
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ maxWidth: 200 }}>
          {params.row.description || '-'}
        </Typography>
      )
    },
    {
      field: 'pricing',
      headerName: 'Pricing',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Box display="flex" flexDirection="column" gap={0.5} py={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>Sale:</Typography>
            <Typography variant="subtitle2" fontWeight={700} color="primary.main">ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹{params.row.salePrice || params.row.price}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>Purchase:</Typography>
            <Typography variant="body2" fontWeight={600}>ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹{params.row.purchasePrice || 0}</Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'warrantyDays',
      headerName: 'Warranty',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
          <Typography variant="body2" fontWeight={600}>
            {params.row.warrantyDays ? `${params.row.warrantyDays} Days` : 'No Warranty'}
          </Typography>
        </Box>
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.7,
      renderCell: (params) => (
        <Chip
          label={params.row.isActive ? 'Active' : 'Inactive'}
          color={params.row.isActive ? 'success' : 'warning'}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Edit Button - Rectangle on Hover */}
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleEdit(params.row.id)}
            disabled={loading}
            startIcon={<IconEdit size={16} />}
            sx={{
              minWidth: 80,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1, // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Rectangle shape
              transition: 'all 0.3s ease',
              '&:hover': {
                borderRadius: 1, // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Stays rectangle on hover
                bgcolor: 'primary.main',
                color: 'white',
                transform: 'scale(1.05)', // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Slight grow effect
                boxShadow: 2
              }
            }}
          >
            Edit
          </Button>

          {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Delete Button - Rectangle on Hover */}
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            disabled={loading}
            startIcon={<IconTrash size={16} />}
            sx={{
              minWidth: 90,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1, // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Rectangle shape
              transition: 'all 0.3s ease',
              '&:hover': {
                borderRadius: 1, // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Stays rectangle on hover
                bgcolor: 'error.main',
                color: 'white',
                transform: 'scale(1.05)', // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Slight grow effect
                boxShadow: 2
              }
            }}
          >
            Delete
          </Button>
        </Box>
      )
    }

  ], [loading]);

  const rows = useMemo(() =>
    filteredData.map(item => ({ ...item }))
    , [filteredData]);

  if (!professionalProviderId) {
    return (
      <PageContainer title="Spare Parts">
        <Breadcrumb title="Spare Parts" items={BCrumb} />
        <Alert severity="warning" sx={{ mt: 3 }}>
          No provider selected. <Button onClick={() => navigate('/AllprofessionalProviders')}>Go to Providers</Button>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Spare Parts"
      description="Manage spare parts for professional providers"
    >
      <Breadcrumb title="Spare Parts" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* SPARE PART FORM */}
      {showForm && (
        <AddonForm
          onClose={() => {
            setShowForm(false);
            setIsEditMode(false);
            setEditData(null);
          }}
          onSubmit={handleSubmit}
          professionalProviderId={professionalProviderId}
          parentServiceId={selectedServiceId}
          initialData={editData}
          isEdit={isEditMode}
          loading={loading}
        />
      )}

      {/* MAIN TABLE */}
      <Paper sx={{
        mt: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '12px',
        boxShadow: theme.shadows[3]
      }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={3}
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} color="primary">
              Spare Parts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Provider Services Spare Parts
            </Typography>
          </Box>

          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <CustomTextField
              size="small"
              placeholder="Search spare parts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 200, md: 300 }, bgcolor: 'background.paper' }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setShowForm(true);
                setIsEditMode(false);
                setEditData(null);
              }}
              disabled={loading || !professionalProviderId}
              startIcon={<IconPlus size={20} />}
              size="medium"
            >
              Add Spare Part
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(-1)}
              startIcon={<IconArrowBackUp />}
              disabled={loading}
            >
              Back to Services
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
              disableRowSelectionOnClick
              autoHeight={false}
              sx={{
                '& .MuiDataGrid-cell': {
                  whiteSpace: 'normal',
                  lineHeight: '1.4'
                },
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: 'primary.50',
                  fontWeight: 600
                }
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default ProviderServiceAddons;


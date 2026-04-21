import React, { useState, useEffect, useMemo } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { IconPlus, IconEdit, IconTrash, IconArrowBackUp, IconX } from '@tabler/icons-react';
import { IconButton } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Alert } from '@mui/material';
import { URLS } from '../../Url';
import axios from 'axios';
import { Avatar, Paper, Box, Typography, Grid, Divider, CardContent } from '@mui/material';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Service Rate Card' }];

const CONSTANT_SERVICE_DESCRIPTION = "Spare Parts Paid Seperately";
const CONSTANT_SERVICE_NOTE = "Estimated Adjusted By Type ,Capacity & Brand";

// Add Service Rate Card Form Component
const AddCategoryForm = ({ onClose, onSubmit, DemandServicesId }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    rateCardTitle: '',
    rateCardPrice: '',
    rateCardQuantity: '',
    rateCardVideoUrl: '',
    reason: '',
    serviceDescription: '',
    serviceNote: '',
    includeServiceDescription: false,  // âœ… NEW
    includeServiceNote: false
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [serviceImageFiles, setServiceImageFiles] = useState([]);
  const [serviceImagePreviews, setServiceImagePreviews] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleServiceDescriptionToggle = (e) => {
    const isEnabled = e.target.value === 'yes';
    setForm(prev => ({
      ...prev,
      includeServiceDescription: isEnabled,
      serviceDescription: isEnabled ? CONSTANT_SERVICE_DESCRIPTION : ''
    }));
  };

  // âœ… NEW: Handle Service Note radio toggle
  const handleServiceNoteToggle = (e) => {
    const isEnabled = e.target.value === 'yes';
    setForm(prev => ({
      ...prev,
      includeServiceNote: isEnabled,
      serviceNote: isEnabled ? CONSTANT_SERVICE_NOTE : ''
    }));
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

  const handleServiceImagesChange = (e) => {
    const selected = Array.from(e.target.files);
    const remaining = 5 - serviceImagePreviews.length;
    if (remaining <= 0) {
      toast.error('Maximum 5 service images allowed');
      e.target.value = '';
      return;
    }
    const toProcess = selected.slice(0, remaining);
    const newFiles = [];
    const newPreviews = [];
    toProcess.forEach((f) => {
      const ext = f.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        newFiles.push(f);
        newPreviews.push(URL.createObjectURL(f));
      } else {
        toast.error(`"${f.name}" is not a valid image format`);
      }
    });
    if (selected.length > remaining) {
      toast.warning(`Only ${remaining} image(s) added. Maximum 5 allowed.`);
    }
    if (newFiles.length > 0) {
      setServiceImageFiles((prev) => [...prev, ...newFiles]);
      setServiceImagePreviews((prev) => [...prev, ...newPreviews]);
    }
    e.target.value = '';
  };

  const removeServiceImage = (index) => {
    const previewToRemove = serviceImagePreviews[index];
    if (!previewToRemove) return;

    if (previewToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(previewToRemove);
      const blobsBefore = serviceImagePreviews
        .slice(0, index)
        .filter((p) => p && p.startsWith('blob:')).length;
      setServiceImageFiles((prev) => prev.filter((_, i) => i !== blobsBefore));
    }
    setServiceImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.rateCardTitle) {
      toast.error('Rate Card Title is required.');
      return;
    }

    if (!form.rateCardPrice) {
      toast.error('Price is required.');
      return;
    }

    if (!form.rateCardQuantity) {
      toast.error('Quantity is required.');
      return;
    }




    if (form.includeServiceNote && !form.serviceNote) {
      toast.error('Note is required when enabled.');
      return;
    }

    let formattedPrice = form.rateCardPrice.toString();
    if (!formattedPrice.endsWith('+')) {
      formattedPrice += '+';
    }

    const formData = new FormData();
    formData.append('serviceId', DemandServicesId);
    formData.append('rateCardTitle', form.rateCardTitle);
    formData.append('rateCardPrice', formattedPrice);
    formData.append('rateCardQuantity', form.rateCardQuantity);
    formData.append('rateCardVideoUrl', form.rateCardVideoUrl);
    if (form.includeServiceDescription && form.serviceDescription) {
      formData.append('serviceDescription', form.serviceDescription);
    }

    // âœ… CONDITIONAL: Only add if enabled
    if (form.includeServiceNote && form.serviceNote) {
      formData.append('serviceNote', form.serviceNote);
    }
    formData.append('reason', form.reason);
    if (file) {
      formData.append('rateCardServiceImage', file);
    }
    if (serviceImageFiles.length > 0) {
      serviceImageFiles.forEach((f) => formData.append('serviceImages', f));
    }
    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 1 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Create On demand Service Rates"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="name" required>
                Service Name <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="rateCardTitle"
                variant="outlined"
                fullWidth
                placeholder="Enter Service Name"
                name="rateCardTitle"
                value={form.rateCardTitle}
                required
                onChange={handleChange}
                aria-label="Enter Service Name"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="rateCardPrice" required>
                Cost Of Service <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                type="text"
                id="rateCardPrice"
                name="rateCardPrice"
                variant="outlined"
                value={form.rateCardPrice}
                onChange={handleChange}
                onBlur={() => {
                  if (form.rateCardPrice && !form.rateCardPrice.toString().endsWith('+')) {
                    setForm({ ...form, rateCardPrice: `${form.rateCardPrice}+` });
                  }
                }}
                aria-label="Enter Cost Of Service"
                placeholder="Enter Cost Of Service"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="rateCardQuantity" required>
                Quantity <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                type="number"
                id="rateCardQuantity"
                name="rateCardQuantity"
                variant="outlined"
                value={form.rateCardQuantity}
                onChange={handleChange}
                aria-label="Enter Quantity"
                placeholder="Enter Quantity"
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
                  'aria-label': 'Upload category image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>

            {/* Service Images - up to 5 */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CustomFormLabel sx={{ mb: 0 }}>Service Images</CustomFormLabel>
                <Typography variant="caption" color="text.secondary">
                  ({serviceImagePreviews.length}/5)
                </Typography>
              </Box>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {serviceImagePreviews.map((url, idx) => (
                    <Box key={idx} sx={{ position: 'relative' }}>
                      <Avatar
                        src={url}
                        variant="rounded"
                        sx={{ width: 90, height: 90, border: '1px solid #ddd' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeServiceImage(idx)}
                        sx={{
                          position: 'absolute', top: -8, right: -8,
                          bgcolor: 'error.main', color: 'white',
                          '&:hover': { bgcolor: 'error.dark' },
                          width: 20, height: 20, boxShadow: 2,
                        }}
                      >
                        <IconX size={16} />
                      </IconButton>
                    </Box>
                  ))}
                  {serviceImagePreviews.length < 5 && (
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        width: 90,
                        height: 90,
                        borderStyle: 'dashed',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <IconPlus size={24} />
                      <Typography variant="caption" sx={{ fontSize: '0.6rem', textAlign: 'center' }}>
                        Add
                      </Typography>
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/jpg,image/jpeg,image/png,image/webp"
                        onChange={handleServiceImagesChange}
                      />
                    </Button>
                  )}
                  {[...Array(Math.max(0, 5 - serviceImagePreviews.length - (serviceImagePreviews.length < 5 ? 1 : 0)))].map((_, i) => (
                    <Box
                      key={`placeholder-${i}`}
                      sx={{
                        width: 90,
                        height: 90,
                        border: '1px dashed #ccc',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0,0,0,0.02)',
                      }}
                    >
                      <IconPlus size={20} color="#ddd" />
                    </Box>
                  ))}
                </Box>
                {serviceImagePreviews.length === 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Upload up to 5 images. Select individually or all at once.
                  </Typography>
                )}
              </Paper>
            </Grid>
            {/* <Grid item xs={12} sm={8}>
              <CustomFormLabel htmlFor="rateCardVideoUrl">YouTube URL</CustomFormLabel>
              <CustomTextField
                id="rateCardVideoUrl"
                name="rateCardVideoUrl"
                value={form.rateCardVideoUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/example"
                fullWidth
              />
            </Grid> */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <CustomFormLabel>
                  Include Service Description
                </CustomFormLabel>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      id="service-desc-yes"
                      name="includeServiceDescription"
                      value="yes"
                      checked={form.includeServiceDescription === true}
                      onChange={handleServiceDescriptionToggle}
                      style={{ marginRight: '8px', cursor: 'pointer' }}
                    />
                    <label htmlFor="service-desc-yes" style={{ cursor: 'pointer', userSelect: 'none' }}>
                      <Typography variant="body2">Yes</Typography>
                    </label>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      id="service-desc-no"
                      name="includeServiceDescription"
                      value="no"
                      checked={form.includeServiceDescription === false}
                      onChange={handleServiceDescriptionToggle}
                      style={{ marginRight: '8px', cursor: 'pointer' }}
                    />
                    <label htmlFor="service-desc-no" style={{ cursor: 'pointer', userSelect: 'none' }}>
                      <Typography variant="body2">No</Typography>
                    </label>
                  </Box>
                </Box>
              </Box>

              {form.includeServiceDescription && (
                <Box>
                  <CustomFormLabel htmlFor="serviceDescription">
                    Service Description
                  </CustomFormLabel>
                  <CustomTextField
                    id="serviceDescription"
                    name="serviceDescription"
                    value={form.serviceDescription}
                    fullWidth
                    multiline
                    rows={2}
                    disabled
                    InputProps={{
                      readOnly: true,
                      sx: {
                        bgcolor: 'action.hover',
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000',
                        }
                      }
                    }}
                  />

                </Box>
              )}
            </Grid>

            {/* Reason */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="reason">Reason</CustomFormLabel>
              <CustomTextField
                id="reason"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Enter Reason"
                multiline
                rows={2}
                fullWidth
              />
            </Grid>

            {/* âœ… SERVICE NOTE WITH RADIO BUTTON */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <CustomFormLabel>
                  Include Service Note
                </CustomFormLabel>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      id="service-note-yes"
                      name="includeServiceNote"
                      value="yes"
                      checked={form.includeServiceNote === true}
                      onChange={handleServiceNoteToggle}
                      style={{ marginRight: '8px', cursor: 'pointer' }}
                    />
                    <label htmlFor="service-note-yes" style={{ cursor: 'pointer', userSelect: 'none' }}>
                      <Typography variant="body2">Yes</Typography>
                    </label>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      id="service-note-no"
                      name="includeServiceNote"
                      value="no"
                      checked={form.includeServiceNote === false}
                      onChange={handleServiceNoteToggle}
                      style={{ marginRight: '8px', cursor: 'pointer' }}
                    />
                    <label htmlFor="service-note-no" style={{ cursor: 'pointer', userSelect: 'none' }}>
                      <Typography variant="body2">No</Typography>
                    </label>
                  </Box>
                </Box>
              </Box>

              {form.includeServiceNote && (
                <Box>
                  <CustomFormLabel htmlFor="serviceNote">
                    Service Note
                  </CustomFormLabel>
                  <CustomTextField
                    id="serviceNote"
                    name="serviceNote"
                    value={form.serviceNote}
                    fullWidth
                    multiline
                    rows={2}
                    disabled
                    InputProps={{
                      readOnly: true,
                      sx: {
                        bgcolor: 'action.hover',
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: '#000',
                        }
                      }
                    }}
                  />

                </Box>
              )}
            </Grid>


            {/* <Grid item xs={6}>
              <CustomFormLabel htmlFor="serviceNote" required>
                Note <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="serviceNote"
                name="serviceNote"
                value={form.serviceNote}
                onChange={handleChange}
                placeholder="Enter Note"
                required
                multiline
                rows={2}
                fullWidth
              />
            </Grid> */}
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
              aria-label="Create Service Rate Card"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Edit Service Rate Card Form Component
const EditCategoryForm = ({ onClose, onSubmit, initialData, DemandServicesId }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    rateCardTitle: initialData?.rateCardTitle || '',
    rateCardPrice: initialData?.rateCardPrice || '',
    rateCardQuantity: initialData?.rateCardQuantity || '',
    rateCardVideoUrl: initialData?.rateCardVideoUrl || '',
    serviceDescription: initialData?.serviceDescription || '',
    reason: initialData?.reason || '',
    serviceNote: initialData?.serviceNote || '',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    initialData?.rateCardServiceImage ? URLS.FileBase + initialData.rateCardServiceImage : null,
  );
  const [serviceImageFiles, setServiceImageFiles] = useState([]);
  const [existingServiceImages, setExistingServiceImages] = useState(
    initialData?.serviceImages || []
  );
  const [serviceImagePreviews, setServiceImagePreviews] = useState(
    initialData?.serviceImages?.map((img) => URLS.FileBase + img) || []
  );

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

  const handleServiceImagesChange = (e) => {
    const selected = Array.from(e.target.files);
    const remaining = 5 - serviceImagePreviews.length;
    if (remaining <= 0) {
      toast.error('Maximum 5 service images allowed');
      e.target.value = '';
      return;
    }
    const toProcess = selected.slice(0, remaining);
    const newFiles = [];
    const newPreviews = [];
    toProcess.forEach((f) => {
      const ext = f.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        newFiles.push(f);
        newPreviews.push(URL.createObjectURL(f));
      } else {
        toast.error(`"${f.name}" is not a valid image format`);
      }
    });
    if (selected.length > remaining) {
      toast.warning(`Only ${remaining} image(s) added. Maximum 5 allowed.`);
    }
    if (newFiles.length > 0) {
      setServiceImageFiles((prev) => [...prev, ...newFiles]);
      setServiceImagePreviews((prev) => [...prev, ...newPreviews]);
    }
    e.target.value = '';
  };

  const removeServiceImage = (index) => {
    const previewToRemove = serviceImagePreviews[index];
    if (previewToRemove?.startsWith('blob:')) {
      URL.revokeObjectURL(previewToRemove);
      const blobpast = serviceImagePreviews
        .slice(0, index)
        .filter((p) => p.startsWith('blob:')).length;
      setServiceImageFiles((prev) => prev.filter((_, i) => i !== blobpast));
    } else {
      const pathToRemove = previewToRemove.replace(URLS.FileBase, '');
      setExistingServiceImages((prev) => prev.filter((path) => path !== pathToRemove));
    }
    setServiceImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.rateCardTitle) {
      toast.error('Card Title is required.');
      return;
    }

    if (!form.rateCardPrice) {
      toast.error('Price is required.');
      return;
    }

    if (!form.rateCardQuantity) {
      toast.error('Quantity is required.');
      return;
    }

    if (!form.serviceNote) {
      toast.error('Note is required.');
      return;
    }


    let formattedPrice = form.rateCardPrice.toString().trim();
    if (!formattedPrice.endsWith('+')) {
      formattedPrice += '+';
    }

    const formData = new FormData();
    formData.append('serviceId', DemandServicesId);
    formData.append('rateCardTitle', form.rateCardTitle);
    formData.append('rateCardPrice', formattedPrice);
    formData.append('rateCardQuantity', form.rateCardQuantity);
    formData.append('rateCardVideoUrl', form.rateCardVideoUrl);
    formData.append('serviceDescription', form.serviceDescription);
    formData.append('serviceNote', form.serviceNote);
    formData.append('reason', form.reason);

    // Existing images to keep
    formData.append('existingServiceImages', JSON.stringify(existingServiceImages));

    if (file) {
      formData.append('rateCardServiceImage', file);
    }
    if (serviceImageFiles.length > 0) {
      serviceImageFiles.forEach((f) => formData.append('serviceImages', f));
    }

    onSubmit(formData, initialData._id);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit On demand Service Rates"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="name" required>
                Title <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="rateCardTitle"
                variant="outlined"
                fullWidth
                placeholder="Enter Service Name"
                name="rateCardTitle"
                value={form.rateCardTitle}
                required
                onChange={handleChange}
                aria-label="Enter Service Name"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="rateCardPrice" required>
                Cost Of Service <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                // type="number"
                type="text"
                id="rateCardPrice"
                name="rateCardPrice"
                variant="outlined"
                value={form.rateCardPrice}
                onChange={handleChange}
                onBlur={() => {
                  if (form.rateCardPrice && !form.rateCardPrice.toString().endsWith('+')) {
                    setForm({ ...form, rateCardPrice: `${form.rateCardPrice}+` });
                  }
                }}
                aria-label="Enter Cost Of Service"
                placeholder="Enter Cost Of Service"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="rateCardQuantity" required>
                Quantity <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                required
                fullWidth
                type="number"
                id="rateCardQuantity"
                name="rateCardQuantity"
                variant="outlined"
                value={form.rateCardQuantity}
                onChange={handleChange}
                aria-label="Enter Quantity"
                placeholder="Enter Quantity"
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
                  'aria-label': 'Upload category image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar src={preview} sx={{ width: 60, height: 60, mt: 1 }} />
                </Box>
              )}
            </Grid>

            {/* Service Images - up to 5 */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CustomFormLabel sx={{ mb: 0 }}>Service Images</CustomFormLabel>
                <Typography variant="caption" color="text.secondary">
                  ({serviceImagePreviews.length}/5)
                </Typography>
              </Box>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {serviceImagePreviews.map((url, idx) => (
                    <Box key={idx} sx={{ position: 'relative' }}>
                      <Avatar
                        src={url}
                        variant="rounded"
                        sx={{ width: 90, height: 90, border: '1px solid #ddd' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeServiceImage(idx)}
                        sx={{
                          position: 'absolute', top: -8, right: -8,
                          bgcolor: 'error.main', color: 'white',
                          '&:hover': { bgcolor: 'error.dark' },
                          width: 20, height: 20, boxShadow: 2,
                        }}
                      >
                        <IconX size={16} />
                      </IconButton>
                    </Box>
                  ))}
                  {serviceImagePreviews.length < 5 && (
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        width: 90,
                        height: 90,
                        borderStyle: 'dashed',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <IconPlus size={24} />
                      <Typography variant="caption" sx={{ fontSize: '0.6rem', textAlign: 'center' }}>
                        Add
                      </Typography>
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/jpg,image/jpeg,image/png,image/webp"
                        onChange={handleServiceImagesChange}
                      />
                    </Button>
                  )}
                  {[...Array(Math.max(0, 5 - serviceImagePreviews.length - (serviceImagePreviews.length < 5 ? 1 : 0)))].map((_, i) => (
                    <Box
                      key={`placeholder-${i}`}
                      sx={{
                        width: 90,
                        height: 90,
                        border: '1px dashed #ccc',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0,0,0,0.02)',
                      }}
                    >
                      <IconPlus size={20} color="#ddd" />
                    </Box>
                  ))}
                </Box>
                {serviceImagePreviews.length === 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Upload up to 5 images. Select individually or all at once.
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={8}>
              <CustomFormLabel htmlFor="rateCardVideoUrl">YouTube URL</CustomFormLabel>
              <CustomTextField
                id="rateCardVideoUrl"
                name="rateCardVideoUrl"
                value={form.rateCardVideoUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/example"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <CustomFormLabel htmlFor="serviceDescription">Service Description</CustomFormLabel>
              <CustomTextField
                id="serviceDescription"
                name="serviceDescription"
                value={form.serviceDescription}
                onChange={handleChange}
                placeholder="Enter Service Description"
                multiline
                rows={2}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <CustomFormLabel htmlFor="reason">Reason</CustomFormLabel>
              <CustomTextField
                id="reason"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Enter Reason"
                multiline
                rows={2}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <CustomFormLabel htmlFor="serviceNote" required>
                Note <span style={{ color: 'red' }}>*</span>
              </CustomFormLabel>
              <CustomTextField
                id="serviceNote"
                name="serviceNote"
                value={form.serviceNote}
                onChange={handleChange}
                placeholder="Enter Note"
                required
                multiline
                rows={2}
                fullWidth
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
              aria-label="Update Service Rate Card"
            >
              Submit
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main Service Rate Card Component
const ServiceRateCard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const DemandServicesId = localStorage.getItem('DemandServicesId');

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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let res;
      if (id) {
        res = await axios.put(`${URLS.EditOnDemandSeviceRates}/${id}`, formData, config);
      } else {
        res = await axios.post(URLS.AddOnDemandSeviceRates, formData, config);
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

    if (window.confirm('Do you really want to delete this Service Rate Card?')) {
      setLoading(true);
      try {
        const res = await axios.delete(`${URLS.DeletOnDemandSeviceRates}/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
      const res = await axios.post(
        URLS.GetOnDemandSeviceRates,
        { serviceId: DemandServicesId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setData(res.data.serviceratecards || []);
    } catch (error) {
      toast.error('Failed to load Service Rates Card.');
      console.error('Failed to load Service Rates Card:', error);
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
      const filtered = data.filter((item) =>
        item.rateCardTitle?.toLowerCase().includes(search.toLowerCase()),
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
        field: 'rateCardinfo',
        headerName: 'Rate Card Info',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={URLS.FileBase + params.row.rateCardServiceImage}
              alt={params.row.rateCardTitle}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">{params.row.rateCardTitle}</Typography>
          </Box>
        ),
      },
      {
        field: 'serviceName',
        headerName: 'Service Name',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'rateCardPrice',
        headerName: 'Cost Of Service',
        flex: 1,
        minWidth: 130,
      },
      {
        field: 'rateCardQuantity',
        headerName: 'Quantity',
        flex: 1,
        minWidth: 100,
      },

      {
        field: 'rateCardVideoUrl',
        headerName: 'Youtube Url',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            {params.row.rateCardVideoUrl || '-'}
          </Typography>
        ),
      },
      {
        field: 'serviceDescription',
        headerName: 'Service Description',
        flex: 1,
        minWidth: 180,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            {params.row.serviceDescription || '-'}
          </Typography>
        ),
      },
      {
        field: 'reason',
        headerName: 'Reason',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            {params.row.reason || '-'}
          </Typography>
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
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleEditPopUp(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              aria-label={`Edit ${params.row.rateCardTitle}`}
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
              aria-label={`Delete ${params.row.rateCardTitle}`}
            >
              <IconTrash stroke={1.5} size={18} />
            </Button>
          </Box>
        ),
      },
    ],
    [loading],
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
      title="Service Rate Card"
      description="Manage Service Rate Card for your e-commerce platform"
    >
      <Breadcrumb title="Service Rate Card" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showAddForm && (
        <AddCategoryForm
          onClose={handleCloseForm}
          DemandServicesId={DemandServicesId}
          onSubmit={handleSubmit}
        />
      )}

      {showEditForm && (
        <EditCategoryForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          DemandServicesId={DemandServicesId}
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
          <Typography variant="h6">Service Rate Card List</Typography>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <CustomTextField
              size="small"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'background.paper' }}
              aria-label="Search Category"
            />

            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddPopUp}
              disabled={loading}
              startIcon={<IconPlus size={20} />}
              aria-label="Create Service Rate Card"
            >
              Create Service Rate Card
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(-1)}
              startIcon={<IconArrowBackUp />}
              disabled={loading}
              sx={{ mr: 7 }}
            >
              Back
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
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              autoHeight
              sx={{
                '& .MuiDataGrid-cell': {
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default ServiceRateCard;


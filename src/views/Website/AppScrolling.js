import React, { useState, useEffect } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { Button, Box, Grid, Divider, Typography, Avatar, Chip } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import { URLS } from 'src/Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'App Scrolling' }];

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token || '';
};

const AppScrolling = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    mainTitle: '',
    mainDescription: '',
    mainImage: [],
    title1: '',
    title2: '',
    title3: '',
    title4: '',
    description1: '',
    description2: '',
    description3: '',
    description4: '',
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingMainImage, setExistingMainImage] = useState([]);
  const [mainImageToDelete, setMainImageToDelete] = useState([]);
  const token = getAuthToken();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const changeHandler = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png'].includes(ext);
    });

    if (validFiles.length !== selectedFiles.length) {
      toast.error('Please choose only JPG, JPEG, or PNG files.');
    }

    if (validFiles.length > 0) {
      setFiles([...files, ...validFiles]);
      setPreviews([...previews, ...validFiles.map((file) => URL.createObjectURL(file))]);
    }

    e.target.value = null;
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const removeExistingImage = (index, imageId) => {
    const newExistingMainImage = [...existingMainImage];
    newExistingMainImage.splice(index, 1);
    setExistingMainImage(newExistingMainImage);
    setMainImageToDelete([...mainImageToDelete, imageId]);
  };

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        URLS.GetAppScrolling,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.screenscrollingupdate) {
        const aboutData = res.data.screenscrollingupdate;
        setForm({
          mainTitle: aboutData.mainTitle || '',
          mainDescription: aboutData.mainDescription || '',
          mainImage: aboutData.mainImage || [],
          title1: aboutData.title1 || '',
          title2: aboutData.title2 || '',
          title3: aboutData.title3 || '',
          title4: aboutData.title4 || '',
          description1: aboutData.description1 || '',
          description2: aboutData.description2 || '',
          description3: aboutData.description3 || '',
          description4: aboutData.description4 || '',
        });

        if (aboutData.mainImage && aboutData.mainImage.length > 0) {
          // Check if mainImage is an array of strings or objects
          if (typeof aboutData.mainImage[0] === 'string') {
            setExistingMainImage(
              aboutData.mainImage.map((image, index) => ({
                id: index, // temporary ID if the API doesn't provide one
                url: image,
              })),
            );
          } else {
            setExistingMainImage(
              aboutData.mainImage.map((image) => ({
                id: image._id || image.id,
                url: image.url || image.path,
              })),
            );
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch App Scrolling');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    const formData = new FormData();
    formData.append('mainTitle', form.mainTitle);
    formData.append('mainDescription', form.mainDescription);
    formData.append('title1', form.title1);
    formData.append('title2', form.title2);
    formData.append('title3', form.title3);
    formData.append('title4', form.title4);
    formData.append('description1', form.description1);
    formData.append('description2', form.description2);
    formData.append('description3', form.description3);
    formData.append('description4', form.description4);

    // Append mainImage to delete
    mainImageToDelete.forEach((id) => {
      formData.append('mainImageToDelete[]', id);
    });

    // Append new files
    files.forEach((file) => {
      formData.append('mainImage', file);
    });

    try {
      setLoading(true);
      await axios.put(URLS.EditAppScrolling, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('App Scrolling updated successfully!');
      getData();
      setFiles([]);
      setMainImageToDelete([]);
      setPreviews([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update App Scrolling');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <PageContainer title="App Scrolling" description="This is App Scrolling page">
      <Breadcrumb title="App Scrolling" items={BCrumb} />

      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit App Scrolling Page"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="title1" required>
                Title One
              </CustomFormLabel>
              <CustomTextField
                id="title1"
                variant="outlined"
                fullWidth
                placeholder="Enter Title One"
                name="title1"
                value={form.title1}
                required
                onChange={handleChange}
                aria-label="Enter Title One"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="title2" required>
                Title Two
              </CustomFormLabel>
              <CustomTextField
                id="title2"
                variant="outlined"
                fullWidth
                placeholder="Enter Title Two"
                name="title2"
                value={form.title2}
                required
                onChange={handleChange}
                aria-label="Enter Title Two"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="title3" required>
                Title Three
              </CustomFormLabel>
              <CustomTextField
                id="title3"
                variant="outlined"
                fullWidth
                placeholder="Enter Title Three"
                name="title3"
                value={form.title3}
                required
                onChange={handleChange}
                aria-label="Enter Title Three"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="title4" required>
                Title Four
              </CustomFormLabel>
              <CustomTextField
                id="title4"
                variant="outlined"
                fullWidth
                placeholder="Enter Title Four"
                name="title4"
                value={form.title4}
                required
                onChange={handleChange}
                aria-label="Enter Title Four"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="description1">Description One</CustomFormLabel>
              <CustomTextField
                id="description1"
                name="description1"
                multiline
                placeholder="Enter Description One"
                rows={3}
                value={form.description1}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Description One"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="description2">Description Two</CustomFormLabel>
              <CustomTextField
                id="description2"
                name="description2"
                multiline
                placeholder="Enter Description Two"
                rows={3}
                value={form.description2}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Description Two"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="description3">Description Three</CustomFormLabel>
              <CustomTextField
                id="description3"
                name="description3"
                multiline
                placeholder="Enter Description Three"
                rows={3}
                value={form.description3}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Description Three"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="description4">Description Four</CustomFormLabel>
              <CustomTextField
                id="description4"
                name="description4"
                multiline
                placeholder="Enter Description Four"
                rows={3}
                value={form.description4}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Description Four"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="mainTitle" required>
                Main Title
              </CustomFormLabel>
              <CustomTextField
                id="mainTitle"
                variant="outlined"
                fullWidth
                placeholder="Enter Main Title"
                name="mainTitle"
                value={form.mainTitle}
                required
                onChange={handleChange}
                aria-label="Enter Main Title"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="mainImage">Main Image</CustomFormLabel>
              <CustomTextField
                id="mainImage"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                  multiple: true,
                  'aria-label': 'Upload App Scrolling Main Image',
                }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                You can upload multiple images (JPG, PNG)
              </Typography>
            </Grid>

            {existingMainImage.length > 0 && (
              <Grid item xs={12}>
                <CustomFormLabel>Current Images</CustomFormLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {existingMainImage.map((image, index) => (
                    <Box key={image.id || index} sx={{ position: 'relative' }}>
                      <Avatar
                        src={`${URLS.FileBase}${image.url}`}
                        sx={{ width: 100, height: 100 }}
                        alt={`Existing image ${index + 1}`}
                        variant="rounded"
                      />
                      <Chip
                        label="Delete"
                        color="error"
                        size="small"
                        onClick={() => removeExistingImage(index, image.id)}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          transform: 'translate(50%, -50%)',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}

            {previews.length > 0 && (
              <Grid item xs={12}>
                <CustomFormLabel>New Image Previews</CustomFormLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {previews.map((preview, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                      <Avatar
                        src={preview}
                        sx={{ width: 100, height: 100 }}
                        alt={`Preview ${index + 1}`}
                        variant="rounded"
                      />
                      <Chip
                        label="Remove"
                        color="error"
                        size="small"
                        onClick={() => removeFile(index)}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          transform: 'translate(50%, -50%)',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="mainDescription">Main Description</CustomFormLabel>
              <CustomTextField
                id="mainDescription"
                name="mainDescription"
                multiline
                placeholder="Enter Main Description"
                rows={3}
                value={form.mainDescription}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Main description"
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
              color="primary"
              variant="contained"
              type="submit"
              disabled={loading}
              aria-label="Save Changes"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </ParentCard>
      </form>
      <ToastContainer />
    </PageContainer>
  );
};

export default AppScrolling;

import React, { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Box, Grid, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { URLS } from 'src/Url';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'App Banners' }];

const ALLOWED_FILE_TYPES = ['jpg', 'jpeg', 'png'];
const MAX_IMAGE_HEIGHT = 200;

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token || '';
};

const AppBanners = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const token = getAuthToken();

  const fetchBanner = useCallback(async () => {
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        URLS.GetSettings,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPreview(URLS.FileBase + response.data.policy.appBanner);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load app banner.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(ext)) {
      event.target.value = null;
      toast.error(`Please select a ${ALLOWED_FILE_TYPES.join(', ')} file.`);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const updateBanner = async () => {
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }

    if (!file) {
      toast.error('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('appBanner', file);

    try {
      setLoading(true);
      await axios.put(URLS.EditAppBanner, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('App banner updated successfully!');
      setFile(null);
      fetchBanner();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update app banner.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

  return (
    <PageContainer title="App Banners" description="Manage app banners">
      <Breadcrumb title="App Banners" items={BCrumb} />
      <ParentCard title="App Banners">
        {loading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="banner-image">Banner Image</CustomFormLabel>
            <CustomTextField
              id="banner-image"
              type="file"
              variant="outlined"
              fullWidth
              onChange={handleFileChange}
              inputProps={{
                accept: 'image/jpeg,image/png',
                'aria-label': 'Upload banner image',
              }}
              disabled={loading}
            />
            {preview && (
              <Box mt={2}>
                <Typography variant="caption" component="p">
                  Preview:
                </Typography>
                <Box
                  component="img"
                  src={preview}
                  alt="Banner preview"
                  sx={{
                    maxHeight: MAX_IMAGE_HEIGHT,
                    width: '100%',
                    objectFit: 'contain',
                    borderRadius: 1,
                  }}
                />
              </Box>
            )}
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'right', p: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={updateBanner}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </ParentCard>
      <ToastContainer />
    </PageContainer>
  );
};

export default AppBanners;

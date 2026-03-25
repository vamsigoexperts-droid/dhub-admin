import React, { useState, useEffect } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { Button, Box, Grid, Divider, Typography, Avatar } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import { URLS } from 'src/Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'App Download Screen' }];

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token || '';
};

const AppdownloadScreens = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    link:''
  });
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const token = getAuthToken();

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

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        URLS.GetAppdownloadScreens,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.webhomescreenupdate) {
        const aboutData = res.data.webhomescreenupdate;
        setForm({
          name: aboutData.name || '',
          description: aboutData.description || '',
          image: aboutData.image || '',
          link: aboutData.link || '',
        });

        if (aboutData.image) {
          setPreview(`${URLS.FileBase}${aboutData.image}`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch App Download Screen');
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
    formData.append('name', form.name);
    formData.append('link', form.link);
    formData.append('description', form.description);

    if (file) {
      formData.append('image', file);
    }

    try {
      setLoading(true);
      await axios.put(URLS.EditAppdownloadScreens, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('App Download Screen updated successfully!');
      getData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update App Download Screen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <PageContainer title="App Download Screen" description="This is App Download Screen page">
      <Breadcrumb title="App Download Screen" items={BCrumb} />

      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit App Download Screen Page"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={12}>
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

            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="link" required>
                Link
              </CustomFormLabel>
              <CustomTextField
                id="link"
                variant="outlined"
                fullWidth
                placeholder="Enter Link"
                name="link"
                value={form.link}
                required
                onChange={handleChange}
                aria-label="Enter Link"
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="image">Image</CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png',
                  'aria-label': 'Upload App Download Screen image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar
                    src={preview}
                    sx={{ width: 60, height: 60, mt: 1 }}
                    alt="App Download Screen preview"
                  />
                </Box>
              )}
            </Grid>

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
                aria-label="Enter App Download Screen description"
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

export default AppdownloadScreens;

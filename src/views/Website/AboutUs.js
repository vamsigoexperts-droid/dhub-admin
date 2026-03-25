import React, { useState, useEffect } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { Button, Box, Grid, Divider, Typography, Avatar } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ParentCard from 'src/components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useTheme } from '@mui/material/styles';
import { URLS } from 'src/Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'About Us' }];

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token || '';
};

const AboutUs = () => {
  const theme = useTheme();
  const [largeDescription, setLargeDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
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
        URLS.GetAboutUs,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.aboutus) {
        const aboutData = res.data.aboutus;
        setForm({
          title: aboutData.title || '',
          description: aboutData.description || '',
          image: aboutData.image || '',
        });
        setLargeDescription(aboutData.largeDescription || '');
        if (aboutData.image) {
          setPreview(`${URLS.FileBase}${aboutData.image}`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch About Us');
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
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('largeDescription', largeDescription);
    if (file) {
      formData.append('image', file);
    }

    try {
      setLoading(true);
      await axios.put(URLS.EditAboutUs, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('About Us updated successfully!');
      getData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update About Us');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <PageContainer title="About Us" description="This is About Us page">
      <Breadcrumb title="About Us" items={BCrumb} />

      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit About Us Page"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="title" required>
                Title
              </CustomFormLabel>
              <CustomTextField
                id="title"
                variant="outlined"
                fullWidth
                placeholder="Enter Title"
                name="title"
                value={form.title}
                required
                onChange={handleChange}
                aria-label="Enter Title"
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
                  'aria-label': 'Upload About Us image',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar
                    src={preview}
                    sx={{ width: 60, height: 60, mt: 1 }}
                    alt="About Us preview"
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
                aria-label="Enter About Us description"
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="largeDescription">Detailed Description</CustomFormLabel>
              <CKEditor
                editor={ClassicEditor}
                data={largeDescription}
                onChange={(event, editor) => setLargeDescription(editor.getData())}
                config={{
                  toolbar: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'strikethrough',
                    'link',
                    '|',
                    'bulletedList',
                    'numberedList',
                    'blockQuote',
                    'code',
                    '|',
                    'undo',
                    'redo',
                  ],
                  placeholder: 'Type detailed About Us content here...',
                }}
                disabled={loading}
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

export default AboutUs;

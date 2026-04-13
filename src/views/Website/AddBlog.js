import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import {
  Button,
  Avatar,
  Box,
  Typography,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import { IconArrowBackUp } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomCKEditor from '../../components/theme-elements/CustomCKEditor';

// Custom components
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';

// Constants
import { URLS } from '../../Url';
import 'react-toastify/dist/ReactToastify.css';

const BREADCRUMB_ITEMS = [
  { to: '/', title: 'Home' }, 
  { title: 'Add Blog' }
];


const IMAGE_TYPES = ['jpg', 'jpeg', 'png'];

const AddBlog = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editorData, setEditorData] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    authorName: '',
  });

  const [backgroundImage, setBackgroundImage] = useState({
    file: null,
    preview: null
  });

  const [authorImage, setAuthorImage] = useState({
    file: null,
    preview: null
  });

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

  useEffect(() => {
    return () => {
      if (backgroundImage.preview) URL.revokeObjectURL(backgroundImage.preview);
      if (authorImage.preview) URL.revokeObjectURL(authorImage.preview);
    };
  }, [backgroundImage.preview, authorImage.preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, setImageState) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const extension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!IMAGE_TYPES.includes(extension)) {
      e.target.value = null;
      toast.error('Please upload a JPG, JPEG, or PNG file.');
      return;
    }

    setImageState({
      file: selectedFile,
      preview: URL.createObjectURL(selectedFile)
    });
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      authorName: '',
    });
    setEditorData('');
    setBackgroundImage({ file: null, preview: null });
    setAuthorImage({ file: null, preview: null });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error('Blog Title is required');
      return false;
    }
    if (!backgroundImage.file) {
      toast.error('Blog Image is required');
      return false;
    }
    if (!form.authorName.trim()) {
      toast.error('Author Name is required');
      return false;
    }
    if (!authorImage.file) {
      toast.error('Author Image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const token = getToken();
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('authorName', form.authorName);
    formData.append('largeDescription', editorData);
    formData.append('backgroundImage', backgroundImage.file);
    formData.append('authorImage', authorImage.file);

    setLoading(true);
    try {
      const response = await axios.post(URLS.AddBlog, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      
      toast.success(response.data.message || 'Blog added successfully!');
      navigate('/website/blog');
      resetForm();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         (error.response?.status === 400 ? 
                          'Unauthorized access. Please log in again.' : 
                          'Failed to add blog.');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Add Blog" description="Add a new blog post">
      <Breadcrumb title="Add Blog" items={BREADCRUMB_ITEMS} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ float: 'right', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          startIcon={<IconArrowBackUp />}
        >
          Back
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        <ParentCard title="Create Blog">
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="name" required>
                Blog Title
              </CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                placeholder="Enter Blog Title"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="backgroundImage" required>
                Blog Image
              </CustomFormLabel>
              <CustomTextField
                id="backgroundImage"
                type="file"
                variant="outlined"
                fullWidth
                onChange={(e) => handleImageChange(e, setBackgroundImage)}
                inputProps={{ accept: 'image/jpeg,image/png' }}
              />
              {backgroundImage.preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar
                    src={backgroundImage.preview}
                    sx={{ width: 60, height: 60, mt: 1 }}
                    alt="Blog preview"
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="description">
                Short Description
              </CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                multiline
                rows={4}
                value={form.description}
                onChange={handleChange}
                fullWidth
                placeholder="Enter a short description for the blog"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="authorName" required>
                Author Name
              </CustomFormLabel>
              <CustomTextField
                id="authorName"
                variant="outlined"
                fullWidth
                placeholder="Enter Author Name"
                name="authorName"
                value={form.authorName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="authorImage" required>
                Author Image
              </CustomFormLabel>
              <CustomTextField
                id="authorImage"
                type="file"
                variant="outlined"
                fullWidth
                onChange={(e) => handleImageChange(e, setAuthorImage)}
                inputProps={{ accept: 'image/jpeg,image/png' }}
              />
              {authorImage.preview && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar
                    src={authorImage.preview}
                    sx={{ width: 60, height: 60, mt: 1 }}
                    alt="Author preview"
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </ParentCard>

        <ParentCard title="Blog Content">
          <Grid item xs={12}>
            <CustomFormLabel required>Detailed Content</CustomFormLabel>
            <CKEditor
              editor={CustomCKEditor}
              data={editorData}
              onChange={(event, editor) => setEditorData(editor.getData())}
              config={{ placeholder: 'Type Large Description...' }}
            />
          </Grid>
        </ParentCard>

        <Divider sx={{ my: 2 }} />
        <Box
          display="flex"
          justifyContent="flex-end"
          gap={1}
          sx={{ p: 2, bgcolor: theme.palette.background.paper }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={resetForm}
            disabled={loading}
          >
            Reset
          </Button>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
      </form>
    </PageContainer>
  );
};

export default AddBlog;
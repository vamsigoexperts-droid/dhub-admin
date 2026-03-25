import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { Button, Avatar, Box, Typography, Grid, Divider, CircularProgress } from '@mui/material';
import { IconArrowBackUp } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
  { to: '/website/blog', title: 'Blogs' },
  { title: 'Edit Blog' },
];

const CKEDITOR_CONFIG = {
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
  placeholder: 'Type Large Description...',
};

const IMAGE_TYPES = ['jpg', 'jpeg', 'png'];

const EditBlog = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const id = localStorage.getItem('blogId');
  const [loading, setLoading] = useState(false);
  const [editorData, setEditorData] = useState('');

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const [form, setForm] = useState({
    name: '',
    description: '',
    authorName: '',
  });

  const [backgroundImage, setBackgroundImage] = useState({
    file: null,
    preview: null,
    existing: null,
  });

  const [authorImage, setAuthorImage] = useState({
    file: null,
    preview: null,
    existing: null,
  });

  const getToken = () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user)?.token : '';
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
    setForm((prev) => ({ ...prev, [name]: value }));
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

    setImageState((prev) => ({
      ...prev,
      file: selectedFile,
      preview: URL.createObjectURL(selectedFile),
    }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      authorName: '',
    });
    setEditorData('');
    setBackgroundImage({ file: null, preview: null, existing: backgroundImage.existing });
    setAuthorImage({ file: null, preview: null, existing: authorImage.existing });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error('Blog Title is required');
      return false;
    }
    if (!form.authorName.trim()) {
      toast.error('Author Name is required');
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

    if (backgroundImage.file) {
      formData.append('backgroundImage', backgroundImage.file);
    }

    if (authorImage.file) {
      formData.append('authorImage', authorImage.file);
    }

    setLoading(true);
    try {
      const response = await axios.put(`${URLS.EditBlog}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message || 'Blog updated successfully!');
      navigate('/website/blog');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.status === 400
          ? 'Unauthorized access. Please log in again.'
          : 'Failed to update blog.');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    try {
      const res = await axios.post(
        URLS.GetOneBlog,
        { id: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const blogData = res.data?.data || {};

      setForm({
        name: blogData.name || '',
        description: blogData.description || '',
        authorName: blogData.authorName || '',
      });

      setEditorData(blogData.largeDescription || '');

      setBackgroundImage((prev) => ({
        ...prev,
        existing: blogData.backgroundImage ? `${URLS.FileBase}${blogData.backgroundImage}` : null,
      }));

      setAuthorImage((prev) => ({
        ...prev,
        existing: blogData.authorImage ? `${URLS.FileBase}${blogData.authorImage}` : null,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch blog data.');
      navigate('/website/blog');
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, []);

  return (
    <PageContainer title="Edit Blog" description="Edit blog post">
      <Breadcrumb title="Edit Blog" items={BREADCRUMB_ITEMS} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ float: 'right', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/website/blog')}
          startIcon={<IconArrowBackUp />}
        >
          Back to Blogs
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        <ParentCard title="Edit Blog">
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
              <CustomFormLabel htmlFor="backgroundImage">
                Blog Image (Leave empty to keep current)
              </CustomFormLabel>
              <CustomTextField
                id="backgroundImage"
                type="file"
                variant="outlined"
                fullWidth
                onChange={(e) => handleImageChange(e, setBackgroundImage)}
                inputProps={{ accept: 'image/jpeg,image/png' }}
              />
              {(backgroundImage.preview || backgroundImage.existing) && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar
                    src={backgroundImage.preview || backgroundImage.existing}
                    sx={{ width: 120, height: 120, mt: 1 }}
                    alt="Blog preview"
                    variant="rounded"
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="description">Short Description</CustomFormLabel>
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
              <CustomFormLabel htmlFor="authorImage">
                Author Image (Leave empty to keep current)
              </CustomFormLabel>
              <CustomTextField
                id="authorImage"
                type="file"
                variant="outlined"
                fullWidth
                onChange={(e) => handleImageChange(e, setAuthorImage)}
                inputProps={{ accept: 'image/jpeg,image/png' }}
              />
              {(authorImage.preview || authorImage.existing) && (
                <Box mt={1}>
                  <Typography variant="caption">Preview:</Typography>
                  <Avatar
                    src={authorImage.preview || authorImage.existing}
                    sx={{ width: 120, height: 120, mt: 1 }}
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
              editor={ClassicEditor}
              data={editorData}
              onChange={(event, editor) => setEditorData(editor.getData())}
              config={CKEDITOR_CONFIG}
            />
          </Grid>
        </ParentCard>

        <Divider sx={{ my: 2 }} />
        <Box
          display="flex"
          justifyContent="flex-end"
          gap={2}
          sx={{ p: 2, bgcolor: theme.palette.background.paper }}
        >
          <Button variant="outlined" color="error" onClick={() => navigate('/website/blog')}>
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Updating...' : 'Update Blog'}
          </Button>
        </Box>
      </form>
    </PageContainer>
  );
};

export default EditBlog;

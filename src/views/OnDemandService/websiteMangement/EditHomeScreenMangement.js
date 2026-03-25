import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  TextField,
  CardContent,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IconArrowBackUp, IconUpload, IconX } from '@tabler/icons-react'; // âœ… Added IconX
import axios from 'axios';
import { URLS } from '../../../Url';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/serviceprovider-website/homescreenmanagement', title: 'Home Screen Management' },
  { title: 'Edit Home Screen' },
];

const EditHomeScreenManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [homeScreenId, setHomeScreenId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    curvedImage1: null,
    curvedImage2: null,
    bannerImage: null,
  });
  const [preview, setPreview] = useState({
    curvedImage1: '',
    curvedImage2: '',
    bannerImage: '',
  });

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  useEffect(() => {
    const id = localStorage.getItem('homeScreenId');
    if (!id) {
      toast.error('No Home Screen ID found.');
      navigate('/serviceprovider-website/homescreenmanagement');
    } else {
      setHomeScreenId(id);
      getHomeScreenById(id);
    }
  }, []);

  const getHomeScreenById = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${URLS.GetSingleHomeScreen}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && res.data.data) {
        const { title, description, curvedImage1, curvedImage2, bannerImage } = res.data.data;
        const base = res.data.baseUrl || URLS.FileBase;

        setFormData({
          title: title || '',
          description: description || '',
          curvedImage1: null,
          curvedImage2: null,
          bannerImage: null,
        });

        setPreview({
          curvedImage1: curvedImage1?.startsWith('http') ? curvedImage1 : `${base}${curvedImage1 || ''}`,
          curvedImage2: curvedImage2?.startsWith('http') ? curvedImage2 : `${base}${curvedImage2 || ''}`,
          bannerImage: bannerImage?.startsWith('http') ? bannerImage : `${base}${bannerImage || ''}`,
        });
      }
    } catch (error) {
      toast.error('Failed to fetch home screen details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(files[0]) }));
    }
  };

  // âœ… Remove image function
  const handleRemoveImage = (name) => {
    setFormData((prev) => ({ ...prev, [name]: null }));
    setPreview((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!formData.title || !formData.description) {
    //   toast.warn('Please fill in all required fields.');
    //   return;
    // }

    const body = new FormData();
    body.append('title', formData.title);
    body.append('description', formData.description);
    if (formData.curvedImage1) body.append('curvedImage1', formData.curvedImage1);
    if (formData.curvedImage2) body.append('curvedImage2', formData.curvedImage2);
    if (formData.bannerImage) body.append('bannerImage', formData.bannerImage);

    try {
      setLoading(true);
      const res = await axios.put(`${URLS.UpdateHomeScreen}/${homeScreenId}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        toast.success('Home Screen updated successfully!');
        setTimeout(() => navigate('/serviceprovider-website/homeScreen/'), 1000);
      } else {
        toast.error(res.data.message || 'Update failed.');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Edit Home Screen" description="Edit Home Screen details">
      <Breadcrumb title="Edit Home Screen" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper elevation={3} sx={{ mt: 3, p: 3, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Edit Home Screen</Typography>
          <Button
            variant="outlined"
            startIcon={<IconArrowBackUp />}
            onClick={() => navigate('/serviceprovider-website/homeScreen/')}
          >
            Back
          </Button>
        </Box>

        {loading ? (
          <Box textAlign="center" py={5}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Grid container spacing={3}>
                {/* Title */}
                {/* <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Grid> */}

                {/* Description */}
                {/* <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Grid> */}

                {/* Banner Image */}
                <Grid item xs={12} md={4}>
                  <Typography mb={1}>Banner Image</Typography>
                  <Button variant="contained" component="label" startIcon={<IconUpload size={18} />}>
                    Upload Banner
                    <input type="file" hidden name="bannerImage" accept="image/*" onChange={handleFileChange} />
                  </Button>
                  {preview.bannerImage && (
                    <Box mt={1} position="relative" display="inline-block" width="100%">
                      <img
                        src={preview.bannerImage}
                        alt="Banner Preview"
                        style={{ width: '100%', borderRadius: 8, marginTop: 8 }}
                      />
                      {/* âœ… Cross Mark */}
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage('bannerImage')}
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          backgroundColor: 'rgba(255, 0, 0, 0.8)',
                          color: 'white',
                          '&:hover': { backgroundColor: 'red' },
                        }}
                      >
                        <IconX size={16} />
                      </IconButton>
                    </Box>
                  )}
                </Grid>

                {/* Curved Image 1 */}
                <Grid item xs={12} md={4}>
                  <Typography mb={1}>Curved Image 1</Typography>
                  <Button variant="contained" component="label" startIcon={<IconUpload size={18} />}>
                    Upload Curved 1
                    <input type="file" hidden name="curvedImage1" accept="image/*" onChange={handleFileChange} />
                  </Button>
                  {preview.curvedImage1 && (
                    <Box mt={1} position="relative" display="inline-block" width="100%">
                      <img
                        src={preview.curvedImage1}
                        alt="Curved 1 Preview"
                        style={{ width: '100%', borderRadius: 8, marginTop: 8 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage('curvedImage1')}
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          backgroundColor: 'rgba(255, 0, 0, 0.8)',
                          color: 'white',
                          '&:hover': { backgroundColor: 'red' },
                        }}
                      >
                        <IconX size={16} />
                      </IconButton>
                    </Box>
                  )}
                </Grid>

                {/* Curved Image 2 */}
                <Grid item xs={12} md={4}>
                  <Typography mb={1}>Curved Image 2</Typography>
                  <Button variant="contained" component="label" startIcon={<IconUpload size={18} />}>
                    Upload Curved 2
                    <input type="file" hidden name="curvedImage2" accept="image/*" onChange={handleFileChange} />
                  </Button>
                  {preview.curvedImage2 && (
                    <Box mt={1} position="relative" display="inline-block" width="100%">
                      <img
                        src={preview.curvedImage2}
                        alt="Curved 2 Preview"
                        style={{ width: '100%', borderRadius: 8, marginTop: 8 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage('curvedImage2')}
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          backgroundColor: 'rgba(255, 0, 0, 0.8)',
                          color: 'white',
                          '&:hover': { backgroundColor: 'red' },
                        }}
                      >
                        <IconX size={16} />
                      </IconButton>
                    </Box>
                  )}
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12} mt={2}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Home Screen'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        )}
      </Paper>
    </PageContainer>
  );
};

export default EditHomeScreenManagement;

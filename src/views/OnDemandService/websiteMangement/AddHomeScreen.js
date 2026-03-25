import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  IconButton
} from '@mui/material';
import { IconUpload ,IconX,IconArrowBackUp} from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../../Url';



const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/serviceprovider-website/addWebsiteManagement', title: 'Website Management' },
  { title: 'Add Home Screen' },
];

const AddHomeScreen = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const [formData, setFormData] = useState({
    curvedImage1: null,
    curvedImage2: null,
    bannerImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState({
    curvedImage1: '',
    curvedImage2: '',
    bannerImage: '',
  });

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    if (!file.type.match(/image.*/)) {
      toast.error('Please upload a valid image file');
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: file }));
    setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
  };

 const handleRemoveImage = (name) => {
  setFormData((prev) => ({ ...prev, [name]: null }));
  setPreview((prev) => ({ ...prev, [name]: '' }));
};


  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.curvedImage1 || !formData.curvedImage2 || !formData.bannerImage) {
    toast.error('All three images are required!');
    return;
  }

  const data = new FormData();
  data.append('curvedImage1', formData.curvedImage1);
  data.append('curvedImage2', formData.curvedImage2);
  data.append('bannerImage', formData.bannerImage);
  data.append('title', formData.title);
  data.append('description', formData.description);

  setLoading(true);
  try {
    const res = await axios.post(`${URLS.AddWebsiteManagement}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.success) {
      toast.success('Home screen images added successfully!');
      
      // ✅ Redirect after success
      setTimeout(() => {
        navigate('/serviceprovider-website/homeScreen/');
      }, 1500);
    } else {
      toast.error(res.data.message || 'Failed to add home screen');
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Something went wrong!');
  } finally {
    setLoading(false);
  }
};


  return (
    <PageContainer title="Add Home Screen" description="Upload images for your home screen layout">
      <Breadcrumb title="Add Home Screen" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper
        sx={{
          mt: 6,
          p: 3,
          borderRadius: '12px',
          boxShadow: 2,
        }}
      >
    <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  mb={2}
>
  <Typography variant="h6" gutterBottom>
    Upload Home Screen Images
  </Typography>

  <Button
    variant="outlined"
    // color="secondary"
    backgroundColor="green"
      startIcon={<IconArrowBackUp />}
    onClick={() => navigate(-1)}
  >
    Back
  </Button>
</Box>


        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Curved Image 1 */}
       {/* Curved Image 1 */}
<Grid item xs={12} md={4}>
  <Typography fontWeight={500}>Curved Image 1</Typography>
  <Box
    sx={{
      mt: 1,
      border: '1px dashed #ccc',
      borderRadius: '10px',
      p: 1,
      textAlign: 'center',
    }}
  >
    <IconUpload size={20} color="#888" />
    <Typography variant="body2" color="text.secondary">
      Upload Curved Image 1
    </Typography>
    <Button variant="contained" component="label" sx={{ mt: 1 }}>
      Choose File
      <input
        type="file"
        hidden
        name="curvedImage1"
        accept="image/*"
        onChange={handleImageChange}
      />
    </Button>
  </Box>

  {preview.curvedImage1 && (
    <Box mt={2} position="relative" display="inline-block" width="100%">
      <img
        src={preview.curvedImage1}
        alt="Curved 1 Preview"
        style={{ width: '100%', borderRadius: '8px', border: '1px solid #eee' }}
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
  <Typography fontWeight={500}>Curved Image 2</Typography>
  <Box
    sx={{
      mt: 1,
      border: '1px dashed #ccc',
      borderRadius: '10px',
      p: 1,
      textAlign: 'center',
    }}
  >
    <IconUpload size={20} color="#888" />
    <Typography variant="body2" color="text.secondary">
      Upload Curved Image 2
    </Typography>
    <Button variant="contained" component="label" sx={{ mt: 1 }}>
      Choose File
      <input
        type="file"
        hidden
        name="curvedImage2"
        accept="image/*"
        onChange={handleImageChange}
      />
    </Button>
  </Box>

  {preview.curvedImage2 && (
    <Box mt={2} position="relative" display="inline-block" width="100%">
      <img
        src={preview.curvedImage2}
        alt="Curved 2 Preview"
        style={{ width: '100%', borderRadius: '8px', border: '1px solid #eee' }}
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

{/* Banner Image */}
<Grid item xs={12} md={4}>
  <Typography fontWeight={500}>Banner Image</Typography>
  <Box
    sx={{
      mt: 1,
      border: '1px dashed #ccc',
      borderRadius: '10px',
      p: 1,
      textAlign: 'center',
    }}
  >
    <IconUpload size={10} color="#888" />
    <Typography variant="body2" color="text.secondary">
      Upload Banner Image
    </Typography>
    <Button variant="contained" component="label" sx={{ mt: 1 }}>
    Choose File
      <input
        type="file"
        hidden
        name="bannerImage"
        accept="image/*"
        onChange={handleImageChange}
      />
    </Button>
  </Box>

  {preview.bannerImage && (
    <Box mt={2} position="relative" display="inline-block" width="100%">
      <img
        src={preview.bannerImage}
        alt="Banner Preview"
        style={{ width: '100%', borderRadius: '8px', border: '1px solid #eee' }}
      />
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


            {/* Submit Section */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={18} /> : null}
                >
                  {loading ? 'Uploading...' : 'Save Home Screen'}
           
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </PageContainer>
  );
};

export default AddHomeScreen;

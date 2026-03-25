import React, { useState, useEffect } from 'react';
import { Avatar, Box, Typography, Grid, Divider, Paper, CardContent, Card } from '@mui/material';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconEdit, IconUsers, IconShoppingCart, IconBuilding } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { URLS } from '../../Url';
import axios from 'axios';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'About Us' }];

// âœ… Helper function to properly encode image URLs
const getEncodedImageUrl = (imagePath) => {
  if (!imagePath) return null;
  try {
    const encodedPath = imagePath
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return `${URLS.FileBase}${encodedPath}`;
  } catch (error) {
    console.error('Error encoding image URL:', error);
    return null;
  }
};

// Edit About Us Form Component
const EditAboutUsForm = ({ onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    title: '',
    subTitle: '',
    description: '',
    totalVendors: '',
    totalSales: '',
    totalCustomers: '',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        subTitle: initialData.subTitle || '',
        description: initialData.description || '',
        totalVendors: initialData.totalVendors || '',
        totalSales: initialData.totalSales || '',
        totalCustomers: initialData.totalCustomers || '',
      });
      if (initialData.image) {
        setPreview(getEncodedImageUrl(initialData.image));
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers for total fields
    if (['totalVendors', 'totalSales', 'totalCustomers'].includes(name)) {
      if (value === '' || /^\d+$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title) {
      toast.error('Title is required');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('subTitle', form.subTitle);
    formData.append('description', form.description);
    formData.append('totalVendors', form.totalVendors || '0');
    formData.append('totalSales', form.totalSales || '0');
    formData.append('totalCustomers', form.totalCustomers || '0');
    
    if (file) {
      formData.append('image', file);
    }

    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit About Us Information"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            {/* Company Details Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Company Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Title */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="title" required>
                Company Title
              </CustomFormLabel>
              <CustomTextField
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Go Experts Pvt Ltd"
              />
            </Grid>

            {/* Sub Title */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="subTitle">
                Sub Title
              </CustomFormLabel>
              <CustomTextField
                id="subTitle"
                name="subTitle"
                value={form.subTitle}
                onChange={handleChange}
                fullWidth
                placeholder="Your Trusted Global Partner"
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="description">
                Description
              </CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
                fullWidth
                placeholder="We connect businesses and customers worldwide with smart digital solutions."
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="image">
                Company Image
              </CustomFormLabel>
              <CustomTextField
                id="image"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png,image/jpg',
                }}
              />
              {preview && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Avatar
                    src={preview}
                    alt="Company Image"
                    sx={{ width: 150, height: 150 }}
                    variant="rounded"
                  />
                </Box>
              )}
            </Grid>

            {/* Statistics Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, mt: 2 }}>
                Statistics
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Total Vendors */}
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="totalVendors">
                <Box display="flex" alignItems="center" gap={1}>
                  <IconBuilding size={18} />
                  Total Vendors
                </Box>
              </CustomFormLabel>
              <CustomTextField
                id="totalVendors"
                name="totalVendors"
                type="text"
                value={form.totalVendors}
                onChange={handleChange}
                fullWidth
                placeholder="150"
              />
            </Grid>

            {/* Total Sales */}
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="totalSales">
                <Box display="flex" alignItems="center" gap={1}>
                  <IconShoppingCart size={18} />
                  Total Sales
                </Box>
              </CustomFormLabel>
              <CustomTextField
                id="totalSales"
                name="totalSales"
                type="text"
                value={form.totalSales}
                onChange={handleChange}
                fullWidth
                placeholder="12000"
              />
            </Grid>

            {/* Total Customers */}
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="totalCustomers">
                <Box display="flex" alignItems="center" gap={1}>
                  <IconUsers size={18} />
                  Total Customers
                </Box>
              </CustomFormLabel>
              <CustomTextField
                id="totalCustomers"
                name="totalCustomers"
                type="text"
                value={form.totalCustomers}
                onChange={handleChange}
                fullWidth
                placeholder="3500"
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
            <Button color="error" variant="outlined" onClick={onClose}>
              Close
            </Button>
            <Button color="primary" variant="contained" type="submit">
              Update About Us
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main About Us Component
const AboutUs = () => {
  const theme = useTheme();
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aboutData, setAboutData] = useState({
    title: '',
    subTitle: '',
    description: '',
    image: '',
    totalVendors: 0,
    totalSales: 0,
    totalCustomers: 0,
  });

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

  const handleEditClick = () => {
    setShowEditForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseForm = () => {
    setShowEditForm(false);
  };

  const handleSubmit = async (formData) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const res = await axios.put(URLS.Aboutuslatest, formData, config);

      if (res.status === 200) {
        toast.success(res.data.message || 'About Us updated successfully');
        handleCloseForm();
        await getData();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(URLS.Aboutuslatest, config);
      console.log('About Us API response:', res.data);

      if (res.data.data) {
        const data = res.data.data;
        setAboutData({
          title: data.title || '',
          subTitle: data.subTitle || '',
          description: data.description || '',
          image: data.image || '',
          totalVendors: data.totalVendors || 0,
          totalSales: data.totalSales || 0,
          totalCustomers: data.totalCustomers || 0,
        });
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch About Us data.');
      }
      console.error('Failed to fetch About Us:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const statsConfig = [
    {
      label: 'Total Vendors',
      value: aboutData.totalVendors,
      icon: <IconBuilding size={32} />,
      color: '#1877F2',
    },
    {
      label: 'Total Sales',
      value: aboutData.totalSales,
      icon: <IconShoppingCart size={32} />,
      color: '#E4405F',
    },
    {
      label: 'Total Customers',
      value: aboutData.totalCustomers,
      icon: <IconUsers size={32} />,
      color: '#0A66C2',
    },
  ];

  return (
    <PageContainer title="About Us" description="Manage About Us information">
      <Breadcrumb title="About Us Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showEditForm && (
        <EditAboutUsForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={aboutData}
        />
      )}

      {/* Company Information Section */}
      <Paper
        variant="outlined"
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
          mb: 3,
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
          <Typography variant="h6">Company Information</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditClick}
            disabled={loading}
            startIcon={<IconEdit size={20} />}
          >
            Edit About Us
          </Button>
        </Box>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {/* Company Image */}
            {aboutData.image && (
              <Grid item xs={12} display="flex" justifyContent="center">
                <Avatar
                  src={getEncodedImageUrl(aboutData.image)}
                  alt="Company"
                  sx={{ width: 150, height: 150 }}
                  variant="rounded"
                />
              </Grid>
            )}

            {/* Title */}
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Company Title
                </Typography>
                <Typography variant="h6">
                  {aboutData.title || 'Not set'}
                </Typography>
              </Card>
            </Grid>

            {/* Sub Title */}
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Sub Title
                </Typography>
                <Typography variant="h6">
                  {aboutData.subTitle || 'Not set'}
                </Typography>
              </Card>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">
                  {aboutData.description || 'Not set'}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Paper>

      {/* Statistics Section */}
      <Paper
        variant="outlined"
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
        }}
      >
        <Box p={2}>
          <Typography variant="h6">Company Statistics</Typography>
        </Box>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {statsConfig.map((stat) => (
              <Grid item xs={12} sm={4} key={stat.label}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: '8px',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                      borderColor: stat.color,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ color: stat.color, mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color={stat.color}>
                    {stat.value.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default AboutUs;

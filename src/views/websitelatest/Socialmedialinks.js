import React, { useState, useEffect } from 'react';
import { Avatar, Box, Typography, Grid, Divider, Paper, CardContent, Card, Stack } from '@mui/material';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconEdit, IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconBrandLinkedin, IconBrandWhatsapp, IconMail, IconMapPin, IconCopyright } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Chip, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { URLS } from '../../Url';
import axios from 'axios';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Social Media Links' }];

// âœ… Helper function to properly encode image URLs
const getEncodedImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  try {
    console.log('Original path:', imagePath); // Debug
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    let cleanPath = imagePath;
    if (imagePath.includes('uploads/')) {
      cleanPath = imagePath.substring(imagePath.indexOf('uploads/'));
    }
    
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }
    
    const finalUrl = `${URLS.FileBase}${cleanPath}`;
    console.log('Final URL:', finalUrl); // Debug
    
    return finalUrl;
  } catch (error) {
    console.error('Error building image URL:', error);
    return null;
  }
};


// Edit Social Media Form Component
const EditSocialMediaForm = ({ onClose, onSubmit, initialData }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    // âœ… Footer fields
    copyRight: '',
    map: '',
    shortDescription: '',
    gmail: '',
    // Social media fields
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    whatsapp: '',
  });

  // âœ… Image state for footer logo
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        copyRight: initialData.copyRight || '',
        map: initialData.map || '',
        shortDescription: initialData.shortDescription || '',
        gmail: initialData.gmail || '',
        facebook: initialData.facebook || '',
        twitter: initialData.twitter || '',
        instagram: initialData.instagram || '',
        linkedin: initialData.linkedin || '',
        whatsapp: initialData.whatsapp || '',
      });
      // âœ… Set preview if image exists
      if (initialData.images) {
        setPreview(getEncodedImageUrl(initialData.images));
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // âœ… Image handler
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

  const validateURL = (url) => {
    if (!url) return true; // Optional fields
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const validateEmail = (email) => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // âœ… Validate copyright (required)
    if (!form.copyRight) {
      toast.error('Copyright text is required');
      return;
    }

    // âœ… Validate email
    if (!validateEmail(form.gmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate all URLs
    const urlFields = [
      { name: 'Map', value: form.map },
      { name: 'Facebook', value: form.facebook },
      { name: 'Twitter', value: form.twitter },
      { name: 'Instagram', value: form.instagram },
      { name: 'LinkedIn', value: form.linkedin },
      { name: 'WhatsApp', value: form.whatsapp },
    ];

    for (const field of urlFields) {
      if (field.value && !validateURL(field.value)) {
        toast.error(`Please enter a valid ${field.name} URL`);
        return;
      }
    }

    // âœ… Use FormData instead of JSON
    const formData = new FormData();
    formData.append('copyRight', form.copyRight);
    formData.append('map', form.map);
    formData.append('shortDescription', form.shortDescription);
    formData.append('gmail', form.gmail);
    formData.append('facebook', form.facebook);
    formData.append('twitter', form.twitter);
    formData.append('instagram', form.instagram);
    formData.append('linkedin', form.linkedin);
    formData.append('whatsapp', form.whatsapp);
    
    if (file) {
      formData.append('images', file);
    }

    onSubmit(formData);
  };

  return (
    <Box sx={{ py: 2 }}>
      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit Social Media Links & Footer"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            {/* âœ… Footer Details Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Footer Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Copyright */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="copyRight" required>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconCopyright size={18} />
                  Copyright Text
                </Box>
              </CustomFormLabel>
              <CustomTextField
                id="copyRight"
                name="copyRight"
                value={form.copyRight}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Â© 2025 Doorstep Hub. All rights reserved."
              />
            </Grid>

            {/* Gmail */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="gmail">
                <Box display="flex" alignItems="center" gap={1}>
                  <IconMail size={18} />
                  Email Address
                </Box>
              </CustomFormLabel>
              <CustomTextField
                id="gmail"
                name="gmail"
                type="email"
                value={form.gmail}
                onChange={handleChange}
                fullWidth
                placeholder="support@doorstephub.com"
              />
            </Grid>

            {/* Short Description */}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="shortDescription">
                Short Description
              </CustomFormLabel>
              <CustomTextField
                id="shortDescription"
                name="shortDescription"
                multiline
                rows={2}
                value={form.shortDescription}
                onChange={handleChange}
                fullWidth
                placeholder="Doorstep Hub is your trusted partner for local services and business growth."
              />
            </Grid>

            {/* Map URL */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="map">
                <Box display="flex" alignItems="center" gap={1}>
                  <IconMapPin size={18} />
                  Google Maps Link
                </Box>
              </CustomFormLabel>
              <CustomTextField
                id="map"
                name="map"
                type="url"
                value={form.map}
                onChange={handleChange}
                fullWidth
                placeholder="https://www.google.com/maps/place/Doorstep+Hub"
              />
            </Grid>

            {/* Footer Logo/Image */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="images">
                Footer Logo/Image
              </CustomFormLabel>
              <CustomTextField
                id="images"
                type="file"
                variant="outlined"
                fullWidth
                onChange={changeHandler}
                inputProps={{
                  accept: 'image/jpeg,image/png,image/jpg',
                }}
              />
              {preview && (
                <Box mt={1}>
                  <Avatar
                    src={preview}
                    alt="Footer Logo"
                    sx={{ width: 80, height: 80, mt: 1 }}
                    variant="rounded"
                  />
                </Box>
              )}
            </Grid>

            {/* Social Media Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, mt: 2 }}>
                Social Media Links
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Facebook */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="facebook">
                <Box display="flex" alignItems="center" gap={1}>
                  <IconBrandFacebook size={18} />
                  Facebook
                </Box>
              </CustomFormLabel>
              <CustomTextField
                id="facebook"
                name="facebook"
                type="url"
                value={form.facebook}
                onChange={handleChange}
                fullWidth
                placeholder="https://www.facebook.com/YourPage"
              />
            </Grid>

            {/* Twitter */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="twitter">
                <Box display="flex" alignItems="center" gap={1}>
                  <IconBrandTwitter size={18} />
                  Twitter
                </Box>
              </CustomFormLabel>
              <CustomTextField
                id="twitter"
                name="twitter"
                type="url"
                value={form.twitter}
                onChange={handleChange}
                fullWidth
                placeholder="https://twitter.com/YourHandle"
              />
            </Grid>

            {/* Instagram */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="instagram">
                <Box display="flex" alignItems="center" gap={1}>
                  <IconBrandInstagram size={18} />
                  Instagram
                </Box>
              </CustomFormLabel>
              <CustomTextField
                id="instagram"
                name="instagram"
                type="url"
                value={form.instagram}
                onChange={handleChange}
                fullWidth
                placeholder="https://www.instagram.com/YourHandle"
              />
            </Grid>

            {/* LinkedIn */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="linkedin">
                <Box display="flex" alignItems="center" gap={1}>
                  <IconBrandLinkedin size={18} />
                  LinkedIn
                </Box>
              </CustomFormLabel>
              <CustomTextField
                id="linkedin"
                name="linkedin"
                type="url"
                value={form.linkedin}
                onChange={handleChange}
                fullWidth
                placeholder="https://www.linkedin.com/company/yourcompany"
              />
            </Grid>

            {/* WhatsApp */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="whatsapp">
                <Box display="flex" alignItems="center" gap={1}>
                  <IconBrandWhatsapp size={18} />
                  WhatsApp
                </Box>
              </CustomFormLabel>
              <CustomTextField
                id="whatsapp"
                name="whatsapp"
                type="url"
                value={form.whatsapp}
                onChange={handleChange}
                fullWidth
                placeholder="https://wa.me/919999999999"
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
              Update Links
            </Button>
          </Box>
        </ParentCard>
      </form>
    </Box>
  );
};

// Main Social Media Component
const SocialMedia = () => {
  const theme = useTheme();
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    copyRight: '',
    map: '',
    shortDescription: '',
    gmail: '',
    images: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    whatsapp: '',
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
          'Content-Type': 'multipart/form-data', // âœ… Changed to multipart
        },
      };

      // âœ… PUT request to update social media links
      const res = await axios.put(URLS.Editsocialmedialink, formData, config);

      if (res.status === 200) {
        toast.success(res.data.message || 'Social media links updated successfully');
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
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.get(URLS.Getsocialmedialink, config);
    console.log('Social Media API response:', res.data);

    // âœ… Handle single object response (not array)
    if (res.data.data) {
      const links = res.data.data; // Direct object, not array
      setSocialLinks({
        copyRight: links.copyRight || '',
        map: links.map || '',
        shortDescription: links.shortDescription || '',
        gmail: links.gmail || '',
        images: links.images || '',
        facebook: links.facebook || '',
        twitter: links.twitter || '',
        instagram: links.instagram || '',
        linkedin: links.linkedin || '',
        whatsapp: links.whatsapp || '',
      });
    } else {
      toast.info('No social media links configured yet');
    }
  } catch (error) {
    if (error.response?.status !== 404) {
      toast.error('Failed to fetch social media links.');
    }
    console.error('Failed to fetch social media links:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    getData();
  }, []);

  const socialMediaConfig = [
    {
      name: 'Facebook',
      icon: <IconBrandFacebook size={24} />,
      link: socialLinks.facebook,
      color: '#1877F2',
    },
    {
      name: 'Twitter',
      icon: <IconBrandTwitter size={24} />,
      link: socialLinks.twitter,
      color: '#1DA1F2',
    },
    {
      name: 'Instagram',
      icon: <IconBrandInstagram size={24} />,
      link: socialLinks.instagram,
      color: '#E4405F',
    },
    {
      name: 'LinkedIn',
      icon: <IconBrandLinkedin size={24} />,
      link: socialLinks.linkedin,
      color: '#0A66C2',
    },
    {
      name: 'WhatsApp',
      icon: <IconBrandWhatsapp size={24} />,
      link: socialLinks.whatsapp,
      color: '#25D366',
    },
  ];

  return (
    <PageContainer title="Social Media Links" description="Manage social media links">
      <Breadcrumb title="Social Media Links" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {showEditForm && (
        <EditSocialMediaForm
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={socialLinks}
        />
      )}

      {/* âœ… Footer Info Display Section */}
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
          <Typography variant="h6">Footer Information</Typography>
        </Box>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Copyright
                </Typography>
                <Typography variant="body1">
                  {socialLinks.copyRight || 'Not set'}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body1">
                  {socialLinks.gmail || 'Not set'}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Short Description
                </Typography>
                <Typography variant="body1">
                  {socialLinks.shortDescription || 'Not set'}
                </Typography>
              </Card>
            </Grid>

            {socialLinks.map && (
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Google Maps
                  </Typography>
                  <Link
                    href={socialLinks.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ wordBreak: 'break-all' }}
                  >
                    View Map
                  </Link>
                </Card>
              </Grid>
            )}

            {socialLinks.images && (
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Footer Logo
                  </Typography>
                  <Avatar
                    src={getEncodedImageUrl(socialLinks.images)}
                    alt="Footer Logo"
                    sx={{ width: 80, height: 80, mt: 1 }}
                    variant="rounded"
                  />
                </Card>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Paper>

      {/* Social Media Links Display */}
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
          <Typography variant="h6">Social Media Links</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditClick}
            disabled={loading}
            startIcon={<IconEdit size={20} />}
            aria-label="Edit social media links"
          >
            Edit Links
          </Button>
        </Box>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {socialMediaConfig.map((platform) => (
              <Grid item xs={12} sm={6} md={4} key={platform.name}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: '8px',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                      borderColor: platform.color,
                    },
                  }}
                >
                  <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ color: platform.color }}>{platform.icon}</Box>
                      <Typography variant="h6">{platform.name}</Typography>
                    </Box>

                    {platform.link ? (
                      <>
                        <Link
                          href={platform.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                            wordBreak: 'break-all',
                            fontSize: '0.875rem',
                          }}
                        >
                          {platform.link}
                        </Link>
                        <Chip
                          label="Active"
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ width: 'fit-content' }}
                        />
                      </>
                    ) : (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          No link configured
                        </Typography>
                        <Chip
                          label="Not Set"
                          size="small"
                          color="default"
                          variant="outlined"
                          sx={{ width: 'fit-content' }}
                        />
                      </>
                    )}
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Paper>
    </PageContainer>
  );
};

export default SocialMedia;

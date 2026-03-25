import React, { useState, useEffect } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { Button, Box, Grid, Divider } from '@mui/material';
import ParentCard from 'src/components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import { URLS } from 'src/Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'All Modules Headings' }];

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token || '';
};

const AllModules = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    ourLeaderShipTitle: '',
    ourLeaderShipDescription: '',
    testimonialTitle: '',
    testimonialDescription: '',
    serviceTitle: '',
    serviceDescription: '',
    categoryTitle: '',
    categoryDescription: '',
    plansTitle: '',
    plansDescription: '',
    paymentAcceptTitle: '',
    paymentAcceptDescription: '',
    faqTitle: '',
    faqDescription: '',
    aboutusTitle: '',
    aboutusDescription: '',
    blogTitle: '',
    blogDescription: '',
    contactusTitle: '',
    contactusDescription: '',
  });

  const token = getAuthToken();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        URLS.GetAllModules,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.allmodules) {
        const aboutData = res.data.allmodules;
        setForm(aboutData);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch All Modules Headings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      setLoading(false);
      return;
    }

    const requestData = {
      ourLeaderShipTitle: form.ourLeaderShipTitle,
      ourLeaderShipDescription: form.ourLeaderShipDescription,
      testimonialTitle: form.testimonialTitle,
      testimonialDescription: form.testimonialDescription,
      serviceTitle: form.serviceTitle,
      serviceDescription: form.serviceDescription,
      categoryTitle: form.categoryTitle,
      categoryDescription: form.categoryDescription,
      plansTitle: form.plansTitle,
      plansDescription: form.plansDescription,
      paymentAcceptTitle: form.paymentAcceptTitle,
      paymentAcceptDescription: form.paymentAcceptDescription,
      faqTitle: form.faqTitle,
      faqDescription: form.faqDescription,
      aboutusTitle: form.aboutusTitle,
      aboutusDescription: form.aboutusDescription,
      blogTitle: form.blogTitle,
      blogDescription: form.blogDescription,
      contactusTitle: form.contactusTitle,
      contactusDescription: form.contactusDescription,
    };

    try {
      const res = await axios.put(URLS.EditAllModules, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success(res.data.message || 'Modules updated successfully!');
    } catch (error) {
      let errorMessage = 'Failed to update modules.';
      if (error.response) {
        if (error.response.status === 400 || error.response.status === 401) {
          errorMessage = 'Unauthorized access. Please log in again.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Check your connection.';
      } else {
        errorMessage = 'An unexpected error occurred.';
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <PageContainer title="All Modules Headings" description="This is All Modules Headings page">
      <Breadcrumb title="All Modules Headings" items={BCrumb} />

      <form onSubmit={handleSubmit}>
        <ParentCard
          title="Edit All Modules Headings Page"
          sx={{ boxShadow: theme.shadows[4], borderRadius: '8px' }}
        >
          <Grid container spacing={2} sx={{ p: 2 }}>
            {/* Our Leadership Section */}
            <Grid item xs={12}>
              <Divider textAlign="left">Our Leadership</Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="ourLeaderShipTitle">Our Leadership Title</CustomFormLabel>
              <CustomTextField
                id="ourLeaderShipTitle"
                variant="outlined"
                fullWidth
                placeholder="Enter Our Leadership Title"
                name="ourLeaderShipTitle"
                value={form.ourLeaderShipTitle}
                onChange={handleChange}
                aria-label="Enter Our Leadership Title"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="ourLeaderShipDescription">
                Our Leadership Description
              </CustomFormLabel>
              <CustomTextField
                id="ourLeaderShipDescription"
                name="ourLeaderShipDescription"
                multiline
                placeholder="Enter Our Leadership Description"
                rows={3}
                value={form.ourLeaderShipDescription}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Our Leadership Description"
              />
            </Grid>

            {/* Testimonial Section */}
            <Grid item xs={12}>
              <Divider textAlign="left">Testimonial</Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="testimonialTitle">Testimonial Title</CustomFormLabel>
              <CustomTextField
                id="testimonialTitle"
                variant="outlined"
                fullWidth
                placeholder="Enter Testimonial Title"
                name="testimonialTitle"
                value={form.testimonialTitle}
                onChange={handleChange}
                aria-label="Enter Testimonial Title"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="testimonialDescription">
                Testimonial Description
              </CustomFormLabel>
              <CustomTextField
                id="testimonialDescription"
                name="testimonialDescription"
                multiline
                placeholder="Enter Testimonial Description"
                rows={3}
                value={form.testimonialDescription}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Testimonial Description"
              />
            </Grid>

            {/* Service Section */}
            <Grid item xs={12}>
              <Divider textAlign="left">Service</Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="serviceTitle">Service Title</CustomFormLabel>
              <CustomTextField
                id="serviceTitle"
                variant="outlined"
                fullWidth
                placeholder="Enter Service Title"
                name="serviceTitle"
                value={form.serviceTitle}
                onChange={handleChange}
                aria-label="Enter Service Title"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="serviceDescription">Service Description</CustomFormLabel>
              <CustomTextField
                id="serviceDescription"
                name="serviceDescription"
                multiline
                placeholder="Enter Service Description"
                rows={3}
                value={form.serviceDescription}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Service Description"
              />
            </Grid>

            {/* Category Section */}
            <Grid item xs={12}>
              <Divider textAlign="left">Category</Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="categoryTitle">Category Title</CustomFormLabel>
              <CustomTextField
                id="categoryTitle"
                variant="outlined"
                fullWidth
                placeholder="Enter Category Title"
                name="categoryTitle"
                value={form.categoryTitle}
                onChange={handleChange}
                aria-label="Enter Category Title"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="categoryDescription">Category Description</CustomFormLabel>
              <CustomTextField
                id="categoryDescription"
                name="categoryDescription"
                multiline
                placeholder="Enter Category Description"
                rows={3}
                value={form.categoryDescription}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Category Description"
              />
            </Grid>

            {/* Plans Section */}
            <Grid item xs={12}>
              <Divider textAlign="left">Plans</Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="plansTitle">Plans Title</CustomFormLabel>
              <CustomTextField
                id="plansTitle"
                variant="outlined"
                fullWidth
                placeholder="Enter Plans Title"
                name="plansTitle"
                value={form.plansTitle}
                onChange={handleChange}
                aria-label="Enter Plans Title"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="plansDescription">Plans Description</CustomFormLabel>
              <CustomTextField
                id="plansDescription"
                name="plansDescription"
                multiline
                placeholder="Enter Plans Description"
                rows={3}
                value={form.plansDescription}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Plans Description"
              />
            </Grid>

            {/* Payment Accept Section */}
            <Grid item xs={12}>
              <Divider textAlign="left">Payment Accept</Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="paymentAcceptTitle">Payment Accept Title</CustomFormLabel>
              <CustomTextField
                id="paymentAcceptTitle"
                variant="outlined"
                fullWidth
                placeholder="Enter Payment Accept Title"
                name="paymentAcceptTitle"
                value={form.paymentAcceptTitle}
                onChange={handleChange}
                aria-label="Enter Payment Accept Title"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="paymentAcceptDescription">
                Payment Accept Description
              </CustomFormLabel>
              <CustomTextField
                id="paymentAcceptDescription"
                name="paymentAcceptDescription"
                multiline
                placeholder="Enter Payment Accept Description"
                rows={3}
                value={form.paymentAcceptDescription}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Payment Accept Description"
              />
            </Grid>

            {/* FAQ Section */}
            <Grid item xs={12}>
              <Divider textAlign="left">FAQ</Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="faqTitle">FAQ Title</CustomFormLabel>
              <CustomTextField
                id="faqTitle"
                variant="outlined"
                fullWidth
                placeholder="Enter FAQ Title"
                name="faqTitle"
                value={form.faqTitle}
                onChange={handleChange}
                aria-label="Enter FAQ Title"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="faqDescription">FAQ Description</CustomFormLabel>
              <CustomTextField
                id="faqDescription"
                name="faqDescription"
                multiline
                placeholder="Enter FAQ Description"
                rows={3}
                value={form.faqDescription}
                onChange={handleChange}
                fullWidth
                aria-label="Enter FAQ Description"
              />
            </Grid>

            {/* About Us Section */}
            <Grid item xs={12}>
              <Divider textAlign="left">About Us</Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="aboutusTitle">About Us</CustomFormLabel>
              <CustomTextField
                id="aboutusTitle"
                variant="outlined"
                fullWidth
                placeholder="Enter About Us"
                name="aboutusTitle"
                value={form.aboutusTitle}
                onChange={handleChange}
                aria-label="Enter About Us"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="aboutusDescription">About Us Description</CustomFormLabel>
              <CustomTextField
                id="aboutusDescription"
                name="aboutusDescription"
                multiline
                placeholder="Enter About Us Description"
                rows={3}
                value={form.aboutusDescription}
                onChange={handleChange}
                fullWidth
                aria-label="Enter About Us Description"
              />
            </Grid>

            {/* Blog Section */}
            <Grid item xs={12}>
              <Divider textAlign="left">Blog</Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="blogTitle">Blog Title</CustomFormLabel>
              <CustomTextField
                id="blogTitle"
                variant="outlined"
                fullWidth
                placeholder="Enter Blog Title"
                name="blogTitle"
                value={form.blogTitle}
                onChange={handleChange}
                aria-label="Enter Blog Title"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="blogDescription">Blog Description</CustomFormLabel>
              <CustomTextField
                id="blogDescription"
                name="blogDescription"
                multiline
                placeholder="Enter Blog Description"
                rows={3}
                value={form.blogDescription}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Blog Description"
              />
            </Grid>

            {/* Contact Us Section */}
            <Grid item xs={12}>
              <Divider textAlign="left">Contact Us</Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="contactusTitle">Contact Us Title</CustomFormLabel>
              <CustomTextField
                id="contactusTitle"
                variant="outlined"
                fullWidth
                placeholder="Enter Contact Us Title"
                name="contactusTitle"
                value={form.contactusTitle}
                onChange={handleChange}
                aria-label="Enter Contact Us Title"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="contactusDescription">
                Contact Us Description
              </CustomFormLabel>
              <CustomTextField
                id="contactusDescription"
                name="contactusDescription"
                multiline
                placeholder="Enter Contact Us Description"
                rows={3}
                value={form.contactusDescription}
                onChange={handleChange}
                fullWidth
                aria-label="Enter Contact Us Description"
              />
            </Grid>
          </Grid>

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

export default AllModules;

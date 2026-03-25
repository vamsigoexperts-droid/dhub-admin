import React, { useState, useEffect } from 'react';
import CustomCheckbox from '../../components/forms/theme-elements/CustomCheckbox';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { Button, Box, FormControlLabel, Grid } from '@mui/material';
import ParentCard from 'src/components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { URLS } from 'src/Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Special Offer' }];

const getAuthToken = () => JSON.parse(localStorage.getItem('user'))?.token || '';

const SpecialOffer = () => {
  const [specialOffer, setSpecialOffer] = useState(false); 
  const [loading, setLoading] = useState(false);

  const token = getAuthToken();

  const handleChangeCheckBox = (event) => {
    setSpecialOffer(event.target.checked);
  };

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        URLS.GetSettings,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSpecialOffer(!!res.data.specialOffer); // Convert to boolean
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch Special Offer');
    } finally {
      setLoading(false);
    }
  };

  const updateData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        URLS.EditSpecialOffer, 
        { specialOffer },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success('Special Offer updated successfully!');
      await getData(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update Special Offer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <PageContainer title="Special Offer" description="This is the Special Offer page">
      <Breadcrumb title="Special Offer" items={BCrumb} />
      <ParentCard title="Special Offer">
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={12} textAlign="center">
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={specialOffer}
                  onChange={handleChangeCheckBox}
                  name="specialOffer"
                  color="primary"
                  disabled={loading} 
                  inputProps={{ 'aria-label': 'Enable Special Discount Offer' }}
                />
              }
              label="Enable Special Discount Offer"
            />
          </Grid>
        </Grid>
        <Box sx={{ float: 'right', p: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={updateData}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </ParentCard>
      <ToastContainer />
    </PageContainer>
  );
};

export default SpecialOffer;
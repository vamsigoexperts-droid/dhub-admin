import React, { useState, useEffect } from 'react';
import CustomCheckbox from '../../components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { Button, Box, FormControlLabel, Grid } from '@mui/material';
import ParentCard from 'src/components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { URLS } from 'src/Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Delivery Charge' }];

const getAuthToken = () => JSON.parse(localStorage.getItem('user'))?.token || '';

const DeliveryCharges = () => {
  const [deliveryCharges, setDeliveryCharges] = useState({
    vendorCanModify: false,
    deliveryChargePerkm: '',
    minimumDeliveryCharges: '',
    minimumDeliveryChargesWithinKm: '',
  });
  const [loading, setLoading] = useState(false);

  const token = getAuthToken();

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const handleChangeCheckBox = (event) => {
    setDeliveryCharges((prev) => ({
      ...prev,
      vendorCanModify: event.target.checked,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryCharges((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        URLS.GetDeliveryCharges,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = res.data?.deliverycharge || {};
      setDeliveryCharges({
        vendorCanModify: !!data.vendorCanModify,
        deliveryChargePerkm: data.deliveryChargePerkm || '',
        minimumDeliveryCharges: data.minimumDeliveryCharges || '',
        minimumDeliveryChargesWithinKm: data.minimumDeliveryChargesWithinKm || '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch Delivery Charge');
    } finally {
      setLoading(false);
    }
  };

  const updateData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    // Validate inputs
    const { deliveryChargePerkm, minimumDeliveryCharges, minimumDeliveryChargesWithinKm } =
      deliveryCharges;
    if (!deliveryChargePerkm || !minimumDeliveryCharges || !minimumDeliveryChargesWithinKm) {
      toast.error('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        URLS.EditDeliveryCharges,
        {
          deliveryChargePerkm: parseFloat(deliveryChargePerkm),
          minimumDeliveryCharges: parseFloat(minimumDeliveryCharges),
          minimumDeliveryChargesWithinKm: parseFloat(minimumDeliveryChargesWithinKm),
          vendorCanModify: deliveryCharges.vendorCanModify,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success('Delivery Charge updated successfully!');
      await getData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update Delivery Charge');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <PageContainer title="Delivery Charge" description="This is the Delivery Charge page">
      <Breadcrumb title="Delivery Charge" items={BCrumb} />
      <ParentCard title="Delivery Charge">
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} sm={12}>
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={deliveryCharges.vendorCanModify}
                  onChange={handleChangeCheckBox}
                  name="vendorCanModify"
                  color="primary"
                  disabled={loading}
                  inputProps={{ 'aria-label': 'Vendor Can Modify' }}
                />
              }
              label="Vendor Can Modify"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="deliveryChargePerkm" required>
              Delivery Charges Per km
            </CustomFormLabel>
            <CustomTextField
              id="deliveryChargePerkm"
              variant="outlined"
              fullWidth
              placeholder="Enter Delivery Charges Per km"
              name="deliveryChargePerkm"
              type="number"
              value={deliveryCharges.deliveryChargePerkm}
              required
              onChange={handleChange}
              aria-label="Delivery Charges Per km"
              inputProps={{ min: 0, step: '0.01' }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="minimumDeliveryCharges" required>
              Minimum Delivery Charges
            </CustomFormLabel>
            <CustomTextField
              id="minimumDeliveryCharges"
              variant="outlined"
              fullWidth
              placeholder="Enter Minimum Delivery Charges"
              name="minimumDeliveryCharges"
              value={deliveryCharges.minimumDeliveryCharges}
              type="number"
              required
              onChange={handleChange}
              aria-label="Minimum Delivery Charges"
              inputProps={{ min: 0, step: '0.01' }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="minimumDeliveryChargesWithinKm" required>
              Minimum Delivery Charges Within Km
            </CustomFormLabel>
            <CustomTextField
              id="minimumDeliveryChargesWithinKm"
              variant="outlined"
              fullWidth
              placeholder="Enter Minimum Delivery Charges Within Km"
              name="minimumDeliveryChargesWithinKm"
              value={deliveryCharges.minimumDeliveryChargesWithinKm}
              required
              type="number"
              onChange={handleChange}
              aria-label="Minimum Delivery Charges Within Km"
              inputProps={{ min: 0, step: '0.01' }}
            />
          </Grid>
        </Grid>
        <Box sx={{ float: 'right', p: 2, mt: 2 }}>
          {rolesAndPermission.global_settings_edit === true ||
          rolesAndPermission.accessAll === true ? (
            <>
              <Button variant="contained" color="primary" onClick={updateData} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <></>
          )}
        </Box>
      </ParentCard>
      <ToastContainer />
    </PageContainer>
  );
};

export default DeliveryCharges;

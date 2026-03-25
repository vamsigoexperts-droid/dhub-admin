import React, { useState, useEffect } from 'react';
import CustomCheckbox from '../../components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../components/forms/theme-elements/CustomSelect';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { Button, Box, FormControlLabel, Grid, MenuItem } from '@mui/material';
import ParentCard from 'src/components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { URLS } from 'src/Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Radius Configuration' }];

const getAuthToken = () => JSON.parse(localStorage.getItem('user'))?.token || '';

const RadiusConfiguration = () => {
  const [radiusconfiguration, setradiusconfiguration] = useState({
    enableOtpOnTripStart: false,
    distanceType: '',
    driverNearByRadius: '',
    driverOrderAcceptRejectDuration: '',
  });
  const [loading, setLoading] = useState(false);

  const token = getAuthToken();

  const handleChangeCheckBox = (event) => {
    setradiusconfiguration((prev) => ({
      ...prev,
      enableOtpOnTripStart: event.target.checked,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setradiusconfiguration((prev) => ({
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
        URLS.GetRadiusConifiguration,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = res.data?.radiusconfiguration || {};
      setradiusconfiguration({
        enableOtpOnTripStart: !!data.enableOtpOnTripStart,
        distanceType: data.distanceType || '',
        driverNearByRadius: data.driverNearByRadius || '',
        driverOrderAcceptRejectDuration: data.driverOrderAcceptRejectDuration || '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch Radius Configuration');
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
    const { distanceType, driverNearByRadius, driverOrderAcceptRejectDuration } =
      radiusconfiguration;
    if (!distanceType || !driverNearByRadius || !driverOrderAcceptRejectDuration) {
      toast.error('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        URLS.EditRadiusConifiguration,
        {
          distanceType: distanceType,
          driverNearByRadius: parseFloat(driverNearByRadius),
          driverOrderAcceptRejectDuration: parseFloat(driverOrderAcceptRejectDuration),
          enableOtpOnTripStart: radiusconfiguration.enableOtpOnTripStart,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success('Radius Configuration updated successfully!');
      await getData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update Radius Configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  return (
    <PageContainer title="Radius Configuration" description="This is the Radius Configuration page">
      <Breadcrumb title="Radius Configuration" items={BCrumb} />
      <ParentCard title="Radius Configuration">
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="distanceType" required>
              Distance Type
            </CustomFormLabel>
            <CustomSelect
              id="distanceType"
              name="distanceType"
              value={radiusconfiguration.distanceType}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="Km">KM</MenuItem>
              <MenuItem value="Miles">Miles</MenuItem>
            </CustomSelect>
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="driverNearByRadius" required>
              Driver nearby Radius
            </CustomFormLabel>
            <CustomTextField
              id="driverNearByRadius"
              variant="outlined"
              fullWidth
              placeholder="Enter Driver nearby Radius"
              name="driverNearByRadius"
              value={radiusconfiguration.driverNearByRadius}
              type="number"
              required
              onChange={handleChange}
              aria-label="Driver nearby Radius"
              inputProps={{ min: 0, step: '0.01' }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomFormLabel htmlFor="driverOrderAcceptRejectDuration" required>
              Driver Order Accept Reject Duration
            </CustomFormLabel>
            <CustomTextField
              id="driverOrderAcceptRejectDuration"
              variant="outlined"
              fullWidth
              placeholder="Enter Driver Order Accept Reject Duration"
              name="driverOrderAcceptRejectDuration"
              value={radiusconfiguration.driverOrderAcceptRejectDuration}
              required
              type="number"
              onChange={handleChange}
              aria-label="Driver Order Accept Reject Duration"
              inputProps={{ min: 0, step: '0.01' }}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={radiusconfiguration.enableOtpOnTripStart}
                  onChange={handleChangeCheckBox}
                  name="enableOtpOnTripStart"
                  color="primary"
                  disabled={loading}
                  inputProps={{ 'aria-label': 'Enable OTP On Trip Start' }}
                />
              }
              label="Enable OTP On Trip Start"
            />
          </Grid>
        </Grid>
        <Box sx={{ float: 'right', p: 2, mt: 2 }}>
          {rolesAndPermission.radius_configuration_edit === true ||
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

export default RadiusConfiguration;

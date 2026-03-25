import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Paper, Switch, Typography } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import { URLS } from '../../Url';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Referral Settings' }];

const defaultState = {
  customer_referrer_reward: 99,
  customer_referee_reward: 0,
  customer_trigger_condition: 'after_first_successful_booking',
  customer_reward_expiry_days: 30,
  customer_program_active: true,
  provider_referrer_reward: 365,
  provider_referee_reward: 0,
  provider_trigger_condition: 'after_first_successful_service',
  provider_reward_expiry_days: 30,
  provider_program_active: true,
};

const ReferralSettings = () => {
  const [form, setForm] = useState(defaultState);
  const [loading, setLoading] = useState(false);

  const token = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch {
      return '';
    }
  })();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;
      try {
        const res = await axios.get(URLS.ReferralSettings, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm((prev) => ({ ...prev, ...(res.data?.data || {}) }));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load referral settings');
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await axios.put(URLS.ReferralSettings, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Referral settings updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update referral settings');
    } finally {
      setLoading(false);
    }
  };

  const renderProgramSection = (title, prefix) => (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CustomTextField
            fullWidth
            label="Referrer Bonus"
            type="number"
            value={form[`${prefix}_referrer_reward`]}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [`${prefix}_referrer_reward`]: Number(e.target.value) }))
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextField
            fullWidth
            label="Referee Bonus"
            type="number"
            value={form[`${prefix}_referee_reward`]}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [`${prefix}_referee_reward`]: Number(e.target.value) }))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            label="Trigger Condition"
            value={form[`${prefix}_trigger_condition`]}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [`${prefix}_trigger_condition`]: e.target.value }))
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextField
            fullWidth
            label="Reward Expiry (Days)"
            type="number"
            value={form[`${prefix}_reward_expiry_days`]}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [`${prefix}_reward_expiry_days`]: Number(e.target.value) }))
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: '1px solid #E5EAEF',
              borderRadius: 1,
              px: 2,
              py: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 56,
            }}
          >
            <Typography variant="body1" fontWeight={500}>
              Program Active
            </Typography>
            <Switch
              checked={Boolean(form[`${prefix}_program_active`])}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [`${prefix}_program_active`]: e.target.checked }))
              }
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <PageContainer title="Referral Settings" description="Manage referral program rules">
      <Breadcrumb title="Referral Settings" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderProgramSection('Customer Referral Program', 'customer')}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderProgramSection('Provider Referral Program', 'provider')}
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" size="large" onClick={handleSave} disabled={loading}>
              Save Referral Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ReferralSettings;

import React, { useEffect, useState } from 'react';
import ProfileBanner from '../../../components/userprofile/profile/ProfileBanner';
import PageContainer from 'src/components/container/PageContainer';
import { UserDataProvider } from 'src/context/UserDataContext/index';
import { Box, Divider, Button, useTheme, Grid } from '@mui/material';
import ParentCard from 'src/components/shared/ParentCard';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import { URLS } from '../../../Url';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const ChangePassword = () => {
  const theme = useTheme();
  const authData = JSON.parse(localStorage.getItem('user'));
  const token = authData?.token;

  const [form, setForm] = useState({
    password: '',
    newpassword: '',
    confirmpassword: '',
  });

  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .post(URLS.GetProfile, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data.profile || []))
      .catch(() => toast.error('Failed to fetch profile'));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataArray = {
      password: form.password,
      newpassword: form.newpassword,
      confirmpassword: form.confirmpassword,
    };

    axios
      .post(URLS.ChangePassword, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          setForm({ password: '', newpassword: '', confirmpassword: '' });
          getData();
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        }
      });
  };

  const onClose = () => {
    setForm({ password: '', newpassword: '', confirmpassword: '' });
    setErrors({});
  };

  return (
    <UserDataProvider>
      <PageContainer title="Change Password" description="Change your account password">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ProfileBanner data={data} />
          </Grid>

          <Grid item xs={12}>
            <ParentCard title="Change Password">
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <CustomFormLabel htmlFor="password" required>
                      Current Password
                    </CustomFormLabel>
                    <CustomTextField
                      id="password"
                      name="password"
                      type="text"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter Current Password"
                      fullWidth
                      required
                      error={!!errors.password}
                      helperText={errors.password}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <CustomFormLabel htmlFor="newpassword" required>
                      New Password
                    </CustomFormLabel>
                    <CustomTextField
                      id="newpassword"
                      name="newpassword"
                      type="text"
                      value={form.newpassword}
                      onChange={handleChange}
                      placeholder="Enter New Password"
                      fullWidth
                      required
                      error={!!errors.newpassword}
                      helperText={errors.newpassword}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <CustomFormLabel htmlFor="confirmpassword" required>
                      Confirm New Password
                    </CustomFormLabel>
                    <CustomTextField
                      id="confirmpassword"
                      name="confirmpassword"
                      type="text"
                      value={form.confirmpassword}
                      onChange={handleChange}
                      placeholder="Confirm New Password"
                      fullWidth
                      required
                      error={!!errors.confirmpassword}
                      helperText={errors.confirmpassword}
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
                  <Button color="primary" variant="contained" type="submit" aria-label="Submit">
                    Submit
                  </Button>
                </Box>
              </form>
            </ParentCard>
          </Grid>
        </Grid>
      </PageContainer>
      <ToastContainer />
    </UserDataProvider>
  );
};

export default ChangePassword;

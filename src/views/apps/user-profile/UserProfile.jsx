import React, { useEffect, useState } from 'react';
import ProfileBanner from '../../../components/userprofile/profile/ProfileBanner';
import { Stack, Typography, Box, Divider, Button, useTheme } from '@mui/material';
import ChildCard from 'src/components/shared/ChildCard';
import { IconUser, IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';
import { UserDataProvider } from 'src/context/UserDataContext/index';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import Grid from '@mui/material/Grid';
import { URLS } from '../../../Url';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const UserProfile = () => {
  const authData = JSON.parse(localStorage.getItem('user'));
  const token = authData?.token;
  const theme = useTheme();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [data, setData] = useState({});
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .post(URLS.GetProfile, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const profile = res.data.profile || {};
        setData(profile);
        setForm({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
        });
      })
      .catch(() => toast.error('Failed to fetch profile'));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const changeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        setFile(selectedFile);
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, or PNG.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataArray = new FormData();
    dataArray.append('name', form.name);
    dataArray.append('email', form.email);
    dataArray.append('phone', form.phone);
    dataArray.append('address', form.address);
    if (file) {
      dataArray.append('image', file);
    }

    axios
      .put(URLS.UpdateProfile, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
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
    getData();
    setFile(null);
    setErrors({});
  };

  return (
    <UserDataProvider>
      <PageContainer title="User Profile" description="this is User Profile page">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ProfileBanner data={data} />
          </Grid>

          <Grid item xs={12} lg={4}>
            <ChildCard>
              <Typography fontWeight={600} variant="h4" mb={1}>
                User Info
              </Typography>
              <Divider />
              <Stack spacing={2} mt={1} mb={1}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconUser size={20} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {data.name}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconMail size={20} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {data.email}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconPhone size={20} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Phone
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {data.phone}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconMapPin size={20} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Address
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {data.address}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </ChildCard>
          </Grid>

          <Grid item xs={12} lg={8}>
            <ParentCard title="Edit Profile">
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="name" required>
                      Name
                    </CustomFormLabel>
                    <CustomTextField
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter Name"
                      fullWidth
                      required
                      error={!!errors.name}
                      helperText={errors.name}
                      aria-label="Enter Name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="phone" required>
                      Phone Number
                    </CustomFormLabel>
                    <CustomTextField
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter Phone Number"
                      fullWidth
                      required
                      error={!!errors.phone}
                      helperText={errors.phone}
                      aria-label="Enter Phone Number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="image">Image</CustomFormLabel>
                    <CustomTextField
                      id="image"
                      type="file"
                      onChange={changeHandler}
                      fullWidth
                      inputProps={{ accept: 'image/jpeg,image/png', 'aria-label': 'Upload Image' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="email" required>
                      Email
                    </CustomFormLabel>
                    <CustomTextField
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter Email"
                      fullWidth
                      required
                      error={!!errors.email}
                      helperText={errors.email}
                      aria-label="Enter Email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomFormLabel htmlFor="address" required>
                      Address
                    </CustomFormLabel>
                    <CustomTextField
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter Address"
                      fullWidth
                      required
                      error={!!errors.address}
                      helperText={errors.address}
                      aria-label="Enter Address"
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
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    aria-label="Update Profile"
                  >
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

export default UserProfile;

import React, { useState } from 'react';
import { Button, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { toast, ToastContainer } from 'react-toastify';
import { URLS } from '../../../Url';
import axios from 'axios';

const AuthChangePassword = () => {
  const [form, setForm] = useState({ newpassword: '', confirmpassword: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const UserId = localStorage.getItem('_id');

  const formSubmit = async (e) => {
    e.preventDefault();

    if (form.newpassword !== form.confirmpassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post(URLS.ResetPassword, {
        newpassword: form.newpassword,
        confirmpassword: form.confirmpassword,
        userId: UserId,
      });

      if (res.status === 200) {
        toast.success('Password changed successfully');
        navigate('/auth/login');
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          formSubmit(e);
        }}
      >
        <Stack mt={4} spacing={2}>
          <CustomFormLabel htmlFor="reset-email">New Password</CustomFormLabel>
          <CustomTextField
            fullWidth
            name="newpassword"
            id="reset-email"
            variant="outlined"
            value={form.newpassword}
            type="text"
            onChange={handleChange}
            required
          />
          <CustomFormLabel htmlFor="reset-email">Confirm Password</CustomFormLabel>
          <CustomTextField
            fullWidth
            name="confirmpassword"
            id="reset-email"
            variant="outlined"
            value={form.confirmpassword}
            type="text"
            onChange={handleChange}
            required
          />
          <Button color="primary" variant="contained" size="large" fullWidth type="submit">
            Forgot Password
          </Button>
          <Button color="primary" size="large" fullWidth component={Link} to="/auth/login">
            Back to Login
          </Button>
        </Stack>
      </form>
      <ToastContainer />
    </>
  );
};

export default AuthChangePassword;

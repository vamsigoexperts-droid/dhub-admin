import React, { useState } from 'react';
import { Button, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { toast, ToastContainer } from 'react-toastify';
import { URLS } from '../../../Url';
import axios from 'axios';

const AuthForgotPassword = () => {
  const [form, setForm] = useState({ email: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(URLS.ForgetPassword, { email: form.email });
      if (res.status === 200) {
        localStorage.setItem('_id', res.data.userInfo);
        toast.success('Verification code sent to your email');
        navigate('/auth/two-steps');
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
          <CustomFormLabel htmlFor="reset-email">Email Adddress</CustomFormLabel>
          <CustomTextField
            fullWidth
            name="email"
            id="reset-email"
            variant="outlined"
            value={form.email}
            type="email"
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

export default AuthForgotPassword;

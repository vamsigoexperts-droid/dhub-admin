import React, { useState, useRef } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { Link, useNavigate } from 'react-router';
import { URLS } from '../../../Url';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AuthTwoSteps = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const UserId = localStorage.getItem('_id');

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // only allow 0-9

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailOtp = otp.join('');
    if (emailOtp.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    const payload = { emailOtp, _id: UserId };

    try {
      const res = await axios.post(URLS.VerifyOtp, payload);
      if (res.status === 200) {
        toast.success('OTP Verified!');
        navigate('/auth/change-password'); // update this route as needed
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box mt={4}>
        <Stack mb={3}>
          <CustomFormLabel htmlFor="code">Type your 6-digit security code</CustomFormLabel>
          <Stack spacing={2} direction="row">
            {otp.map((digit, index) => (
              <CustomTextField
                key={index}
                required
                value={digit}
                inputProps={{ maxLength: 1 }}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputRef={(el) => (inputRefs.current[index] = el)}
                sx={{ width: '50px', textAlign: 'center' }}
              />
            ))}
          </Stack>
        </Stack>

        <Button color="primary" variant="contained" size="large" fullWidth type="submit">
          Verify My Account
        </Button>

        <Stack direction="row" spacing={1} mt={3}>
          <Typography color="textSecondary" variant="h6" fontWeight="400">
            Didn't get the code?
          </Typography>
          <Typography
            component={Link}
            to="/auth/forgot-password"
            fontWeight="500"
            sx={{ textDecoration: 'none', color: 'primary.main' }}
          >
            Resend
          </Typography>
        </Stack>
      </Box>
      <ToastContainer />
    </form>
  );
};

export default AuthTwoSteps;

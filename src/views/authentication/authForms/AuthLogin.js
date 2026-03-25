// src/views/authentication/auth1/Login.js
import React from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { Form, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router';
import CustomCheckbox from '../../theme-elements/CustomCheckbox';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import useAuth from '../../../guards/UseAuth';
import useMounted from '../../../guards/UseMounted';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const mounted = useMounted();
  const { signin } = useAuth();
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        await signin(values.email, values.password);
        if (mounted.current) {
          setStatus({ success: true });
          setSubmitting(false);
          navigate('/');
        }
      } catch (error) {
        if (mounted.current) {
          setStatus({ success: false });
          setErrors({ submit: error.message });
          setSubmitting(false);
        }
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      {title && (
        <Typography fontWeight={700} variant="h3" mb={1}>
          {title}
        </Typography>
      )}
      {subtext}

      <Box mt={3}>
        <Divider>
          <Typography component="span" color="textSecondary" variant="h6" fontWeight="400" px={2}>
            Sign in
          </Typography>
        </Divider>
      </Box>

      {errors.submit && (
        <Box mt={2}>
          <Alert severity="error">{errors.submit}</Alert>
        </Box>
      )}

      <FormikProvider value={formik}>
        <Form noValidate onSubmit={handleSubmit}>
          <Stack spacing={2} mt={2}>
            <Box>
              <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="email"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
              <CustomTextField
                fullWidth
                type="password"
                id="password"
                {...getFieldProps('password')}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
            </Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <FormGroup>
                <FormControlLabel
                  control={<CustomCheckbox defaultChecked={false} />}
                  label="Remember this device"
                />
              </FormGroup>
              <Typography
                component={Link}
                to="/auth/forgot-password"
                fontWeight="500"
                sx={{ textDecoration: 'none', color: 'primary.main' }}
              >
                Forgot Password?
              </Typography>
            </Stack>
            <Box>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>
          </Stack>
        </Form>
      </FormikProvider>

      {subtitle}
    </>
  );
};

export default AuthLogin;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Button,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Divider,
  CardHeader,
} from '@mui/material';
import axios from 'axios';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomCKEditor from '../../components/theme-elements/CustomCKEditor';
import { URLS } from 'src/Url';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Global Settings' }];

const ALLOWED_FILE_TYPES = ['jpg', 'jpeg', 'png'];
const MAX_IMAGE_HEIGHT = 200;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token || '';
};

const AppBanners = () => {
  const [form, setForm] = useState({
    applicationName: '',
    customerReferedAmount: '',
    vendorReferredAmount: '',
    buysellProductLimit: '',
    phone: '',
    email: '',
    address: '',
    applicaionLogo: '',
    menuPlaceHolderImage: '',
    providerLogo: '',
    workerLogo: '',
    map: '',
    googleMapapi: '',
    address2: '',
    email2: '',
    phone2: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    aboutus: '',
    customerAndroidAppLink: '',
    customerIosAppLink: '',
    vendorAndroidAppLink: '',
    vendorIosAppLink: '',
    playstoreButtonImage: '',
    iosButtonImage: '',
    websiteMobileImage: '',
    workerLogo: '',
  });
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({
    applicaionLogo: null,
    menuPlaceHolderImage: null,
    providerLogo: null,
    workerLogo: null,
    playstoreButtonImage: null,
    iosButtonImage: null,
    websiteMobileImage: null,
  });
  const [previews, setPreviews] = useState({
    applicaionLogo: null,
    menuPlaceHolderImage: null,
    providerLogo: null,
    workerLogo: null,
    playstoreButtonImage: null,
    iosButtonImage: null,
    websiteMobileImage: null,
  });

  const fileInputRefs = {
    applicaionLogo: useRef(null),
    menuPlaceHolderImage: useRef(null),
    providerLogo: useRef(null),
    workerLogo: useRef(null),
    playstoreButtonImage: useRef(null),
    iosButtonImage: useRef(null),
    websiteMobileImage: useRef(null),
  };

  const token = getAuthToken();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchBanner = useCallback(async () => {
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        URLS.GetGobalSettings,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = response.data?.policy || {};
      setForm({
        applicationName: data.applicationName || '',
        customerReferedAmount: data.customerReferedAmount || '',
        vendorReferredAmount: data.vendorReferredAmount || '',
        phone: data.phone || '',
        email: data.email || '',
        buysellProductLimit: data.buysellProductLimit || '',
        address: data.address || '',
        map: data.map || '',
        googleMapapi: data.googleMapapi || ' ',
        address2: data.address2 || '',
        email2: data.email2 || '',
        phone2: data.phone2 || '',
        facebook: data.facebook || '',
        twitter: data.twitter || '',
        instagram: data.instagram || '',
        linkedin: data.linkedin || '',
        youtube: data.youtube || '',
        aboutus: data.aboutus || '',
        customerAndroidAppLink: data.customerAndroidAppLink || '',
        customerIosAppLink: data.customerIosAppLink || '',
        vendorAndroidAppLink: data.vendorAndroidAppLink || '',
        vendorIosAppLink: data.vendorIosAppLink || '',
        playstoreButtonImage: (data.playstoreButtonImage === 'undefined' || !data.playstoreButtonImage) ? '' : data.playstoreButtonImage,
        iosButtonImage: (data.iosButtonImage === 'undefined' || !data.iosButtonImage) ? '' : data.iosButtonImage,
        websiteMobileImage: (data.websiteMobileImage === 'undefined' || !data.websiteMobileImage) ? '' : data.websiteMobileImage,
        applicaionLogo: (data.applicaionLogo === 'undefined' || !data.applicaionLogo) ? '' : data.applicaionLogo,
        menuPlaceHolderImage: (data.menuPlaceHolderImage === 'undefined' || !data.menuPlaceHolderImage) ? '' : data.menuPlaceHolderImage,
        providerLogo: (data.providerLogo === 'undefined' || !data.providerLogo) ? '' : data.providerLogo,
        workerLogo: (data.workerLogo === 'undefined' || !data.workerLogo) ? '' : data.workerLogo,
      });
      setPreviews({
        applicaionLogo: data.applicaionLogo ? URLS.FileBase + data.applicaionLogo : null,
        menuPlaceHolderImage: data.menuPlaceHolderImage
          ? URLS.FileBase + data.menuPlaceHolderImage
          : null,
        providerLogo: data.providerLogo ? URLS.FileBase + data.providerLogo : null,
        workerLogo: data.workerLogo ? URLS.FileBase + data.workerLogo : null,
        playstoreButtonImage: data.playstoreButtonImage ? URLS.FileBase + data.playstoreButtonImage : null,
        iosButtonImage: data.iosButtonImage ? URLS.FileBase + data.iosButtonImage : null,
        websiteMobileImage: data.websiteMobileImage ? URLS.FileBase + data.websiteMobileImage : null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load global settings.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const handleFileChange = (field) => (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const isVideoField = field === 'websiteMobileImage';
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    const allowedExtensions = isVideoField ? [...ALLOWED_FILE_TYPES, 'mp4', 'mov', 'avi', 'webm'] : ALLOWED_FILE_TYPES;

    if (!allowedExtensions.includes(ext)) {
      event.target.value = null;
      toast.error(`Please select a ${allowedExtensions.join(', ')} file.`);
      return;
    }

    if (selectedFile.size > (isVideoField ? 50 * 1024 * 1024 : MAX_FILE_SIZE)) {
      event.target.value = null;
      toast.error(isVideoField ? 'Video size exceeds 50MB.' : 'File size exceeds 5MB.');
      return;
    }

    setFiles((prev) => ({ ...prev, [field]: selectedFile }));
    setPreviews((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(selectedFile),
    }));
  };

  const updateBanner = async () => {
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }

    const formData = new FormData();
    formData.append('applicationName', form.applicationName);
    formData.append('customerReferedAmount', form.customerReferedAmount);
    formData.append('vendorReferredAmount', form.vendorReferredAmount);
    formData.append('googleMapapi', form.googleMapapi);
    formData.append('phone', form.phone);
    formData.append('email', form.email);
    formData.append('buysellProductLimit', form.buysellProductLimit);
    formData.append('address', form.address);
    formData.append('map', form.map);
    formData.append('address2', form.address2);
    formData.append('email2', form.email2);
    formData.append('phone2', form.phone2);
    formData.append('facebook', form.facebook);
    formData.append('twitter', form.twitter);
    formData.append('instagram', form.instagram);
    formData.append('linkedin', form.linkedin);
    formData.append('youtube', form.youtube);
    formData.append('aboutus', form.aboutus);
    formData.append('customerAndroidAppLink', form.customerAndroidAppLink);
    formData.append('customerIosAppLink', form.customerIosAppLink);
    formData.append('vendorAndroidAppLink', form.vendorAndroidAppLink);
    formData.append('vendorIosAppLink', form.vendorIosAppLink);
    formData.append('playstoreButtonImage', form.playstoreButtonImage || '');
    formData.append('iosButtonImage', form.iosButtonImage || '');
    formData.append('websiteMobileImage', form.websiteMobileImage || '');
    formData.append('applicaionLogo', form.applicaionLogo || '');
    formData.append('menuPlaceHolderImage', form.menuPlaceHolderImage || '');
    formData.append('providerLogo', form.providerLogo || '');
    formData.append('workerLogo', form.workerLogo || '');

    if (files.applicaionLogo) formData.append('applicaionLogo', files.applicaionLogo);
    if (files.menuPlaceHolderImage)
      formData.append('menuPlaceHolderImage', files.menuPlaceHolderImage);
    if (files.providerLogo) formData.append('providerLogo', files.providerLogo);
    if (files.workerLogo) formData.append('workerLogo', files.workerLogo);
    if (files.playstoreButtonImage) formData.append('playstoreButtonImage', files.playstoreButtonImage);
    if (files.iosButtonImage) formData.append('iosButtonImage', files.iosButtonImage);
    if (files.websiteMobileImage) formData.append('websiteMobileImage', files.websiteMobileImage);

    try {
      setLoading(true);
      await axios.put(URLS.EditGobalSettings, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Global settings updated successfully!');

      setFiles({
        applicaionLogo: null,
        menuPlaceHolderImage: null,
        providerLogo: null,
        workerLogo: null,
        playstoreButtonImage: null,
        iosButtonImage: null,
        websiteMobileImage: null,
      });

      Object.values(fileInputRefs).forEach((ref) => {
        if (ref.current) ref.current.value = null;
      });
      fetchBanner();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update global settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

  const renderFileInput = (field, label) => {
    const isVideo = previews[field] && (previews[field].includes('data:video') || previews[field].endsWith('.mp4') || previews[field].endsWith('.webm') || previews[field].endsWith('.mov'));

    return (
      <Grid item xs={12} sm={6}>
        <CustomFormLabel htmlFor={`${field}-image`}>{label}</CustomFormLabel>
        <CustomTextField
          id={`${field}-image`}
          type="file"
          variant="outlined"
          fullWidth
          onChange={handleFileChange(field)}
          inputProps={{
            accept: field === 'websiteMobileImage' ? 'image/*,video/*' : 'image/jpeg,image/png',
            'aria-label': `Upload ${label}`,
          }}
          inputRef={fileInputRefs[field]}
          disabled={loading}
        />
        {previews[field] && (
          <Box mt={2}>
            <Typography variant="caption" component="p">
              Preview:
            </Typography>
            {isVideo ? (
              <Box
                component="video"
                src={previews[field]}
                controls
                sx={{
                  maxHeight: MAX_IMAGE_HEIGHT,
                  width: '200px',
                  borderRadius: 1,
                }}
              />
            ) : (
              <Box
                component="img"
                src={previews[field]}
                alt={`${label} preview`}
                sx={{
                  maxHeight: MAX_IMAGE_HEIGHT,
                  width: '200px',
                  objectFit: 'contain',
                  borderRadius: 1,
                }}
              />
            )}
          </Box>
        )}
      </Grid>
    );
  };

  return (
    <PageContainer title="Global Settings" description="Manage Global Settings">
      <Breadcrumb title="Global Settings" items={BCrumb} />
      <ParentCard title="Global Settings">
        {loading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        )}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <CustomFormLabel htmlFor="applicationName" required>
              Application Name
            </CustomFormLabel>
            <CustomTextField
              id="applicationName"
              variant="outlined"
              fullWidth
              placeholder="Enter Application Name"
              name="applicationName"
              value={form.applicationName}
              required
              onChange={handleChange}
              aria-label="Application Name"
              type="text"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomFormLabel htmlFor="customerReferedAmount" required>
              Customer Referred Amount
            </CustomFormLabel>
            <CustomTextField
              id="customerReferedAmount"
              variant="outlined"
              fullWidth
              placeholder="Enter Customer Referred Amount"
              name="customerReferedAmount"
              value={form.customerReferedAmount}
              required
              onChange={handleChange}
              aria-label="Customer Referred Amount"
              type="text"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomFormLabel htmlFor="vendorReferredAmount" required>
              Vendor Referred Amount
            </CustomFormLabel>
            <CustomTextField
              id="vendorReferredAmount"
              variant="outlined"
              fullWidth
              placeholder="Enter Vendor Referred Amount"
              name="vendorReferredAmount"
              value={form.vendorReferredAmount}
              required
              onChange={handleChange}
              aria-label="Vendor Referred Amount"
              type="text"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomFormLabel htmlFor="buysellProductLimit" required>
              Buy Sell Product Limit
            </CustomFormLabel>
            <CustomTextField
              id="buysellProductLimit"
              variant="outlined"
              fullWidth
              placeholder="Enter Buy Sell Product Limit"
              name="buysellProductLimit"
              value={form.buysellProductLimit}
              required
              onChange={handleChange}
              aria-label="Buy Sell Product Limit"
              type="number"
              disabled={loading}
            />
          </Grid>
          {renderFileInput('applicaionLogo', 'Website Header Logo ')}
          {renderFileInput('menuPlaceHolderImage', 'Website Footer Logo')}
          {renderFileInput('providerLogo', 'Become a partner Page Logo')}
          {renderFileInput('workerLogo', 'App Download Image')}
        </Grid>
        <Divider />
        <CardHeader title="Contact Us" sx={{ backgroundColor: 'primary.light', color: 'primary.main', py: 1 }} />
        <Divider />
        <Grid container spacing={2} sx={{ mt: 2 }}>


          <Grid item xs={12} sm={12}>
            <CustomFormLabel htmlFor="googleMapapi" required>
              Google Map Api Key
            </CustomFormLabel>
            <CustomTextField
              id="googleMapapi"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              placeholder="Enter Google Map Api"
              name="googleMapapi"
              value={form.googleMapapi}
              required
              onChange={handleChange}
              aria-label="Enter Google Map Api Key"
              type="text"
              disabled={loading}
            />
          </Grid>



          <Grid item xs={12} sm={12}>
            <CustomFormLabel htmlFor="map" required>
              Map for contact us page
            </CustomFormLabel>
            <CustomTextField
              id="map"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              placeholder="Enter Map"
              name="map"
              value={form.map}
              required
              onChange={handleChange}
              aria-label="Enter Map"
              type="text"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="address" required>
              Registered Address
            </CustomFormLabel>
            <CustomTextField
              id="address"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              placeholder="Enter Address 1"
              name="address"
              value={form.address}
              required
              onChange={handleChange}
              aria-label="Enter Address 1"
              type="text"
              disabled={loading}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="address2" required>
              Address 2
            </CustomFormLabel>
            <CustomTextField
              id="address2"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              placeholder="Enter Address 2"
              name="address2"
              value={form.address2}
              required
              onChange={handleChange}
              aria-label="Enter Address 2"
              type="text"
              disabled={loading}
            />
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="email" required>
              Vendor Support Email
            </CustomFormLabel>
            <CustomTextField
              id="email"
              variant="outlined"
              fullWidth
              placeholder="Enter Email 1"
              name="email"
              value={form.email}
              required
              onChange={handleChange}
              aria-label="Enter Email 1"
              type="email"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="email2" required>
              Customer Support Email
            </CustomFormLabel>
            <CustomTextField
              id="email2"
              variant="outlined"
              fullWidth
              placeholder="Enter Email 2"
              name="email2"
              value={form.email2}
              required
              onChange={handleChange}
              aria-label="Enter Email 2"
              type="email"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="phone" required>
              Customer Support
            </CustomFormLabel>
            <CustomTextField
              id="phone"
              variant="outlined"
              fullWidth
              placeholder="Enter Phone 1"
              name="phone"
              value={form.phone}
              required
              onChange={handleChange}
              aria-label="Enter Phone 1"
              type="tel"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="phone2" required>
              Vendor Support
            </CustomFormLabel>
            <CustomTextField
              id="phone2"
              variant="outlined"
              fullWidth
              placeholder="Enter Phone 2"
              name="phone2"
              value={form.phone2}
              required
              onChange={handleChange}
              aria-label="Enter Phone 2"
              type="tel"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="facebook" required>
              Facebook
            </CustomFormLabel>
            <CustomTextField
              id="facebook"
              variant="outlined"
              fullWidth
              placeholder="Enter Facebook"
              name="facebook"
              value={form.facebook}
              required
              onChange={handleChange}
              aria-label="Enter Facebook"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="twitter" required>
              Twitter
            </CustomFormLabel>
            <CustomTextField
              id="twitter"
              variant="outlined"
              fullWidth
              placeholder="Enter Twitter"
              name="twitter"
              value={form.twitter}
              required
              onChange={handleChange}
              aria-label="Enter Twitter"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="instagram" required>
              Instagram
            </CustomFormLabel>
            <CustomTextField
              id="instagram"
              variant="outlined"
              fullWidth
              placeholder="Enter Instagram"
              name="instagram"
              value={form.instagram}
              required
              onChange={handleChange}
              aria-label="Enter Instagram"
              type="tel"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="linkedin" required>
              Linkedin
            </CustomFormLabel>
            <CustomTextField
              id="linkedin"
              variant="outlined"
              fullWidth
              placeholder="Enter Linkedin"
              name="linkedin"
              value={form.linkedin}
              required
              onChange={handleChange}
              aria-label="Enter Linkedin"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="youtube" required>
              Youtube
            </CustomFormLabel>
            <CustomTextField
              id="youtube"
              variant="outlined"
              fullWidth
              placeholder="Enter Youtube"
              name="youtube"
              value={form.youtube}
              required
              onChange={handleChange}
              aria-label="Enter Youtube"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="aboutus" required>
              About Us
            </CustomFormLabel>
            <CKEditor
              editor={CustomCKEditor}
              data={form.aboutus}
              onChange={(event, editor) => {
                const data = editor.getData();
                setForm((prev) => ({ ...prev, aboutus: data }));
              }}
              config={{
                placeholder: 'Enter About Us content here...',
              }}
              disabled={loading}
            />
          </Grid>
        </Grid>
        <Divider />
        <CardHeader title="Mobile App Download Links" sx={{ backgroundColor: 'primary.light', color: 'primary.main', py: 1 }} />
        <Divider />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="customerAndroidAppLink" required>
              Customer Android App
            </CustomFormLabel>
            <CustomTextField
              id="customerAndroidAppLink"
              variant="outlined"
              fullWidth
              placeholder="Enter Customer Android App Link"
              name="customerAndroidAppLink"
              value={form.customerAndroidAppLink}
              required
              onChange={handleChange}
              aria-label="Enter Customer Android App Link"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="customerIosAppLink" required>
              Customer iOS App
            </CustomFormLabel>
            <CustomTextField
              id="customerIosAppLink"
              variant="outlined"
              fullWidth
              placeholder="Enter Customer iOS App Link"
              name="customerIosAppLink"
              value={form.customerIosAppLink}
              required
              onChange={handleChange}
              aria-label="Enter Customer iOS App Link"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="vendorAndroidAppLink" required>
              Vendor Android App
            </CustomFormLabel>
            <CustomTextField
              id="vendorAndroidAppLink"
              variant="outlined"
              fullWidth
              placeholder="Enter Vendor Android App Link"
              name="vendorAndroidAppLink"
              value={form.vendorAndroidAppLink}
              required
              onChange={handleChange}
              aria-label="Enter Vendor Android App Link"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="vendorIosAppLink" required>
              Vendor iOS App
            </CustomFormLabel>
            <CustomTextField
              id="vendorIosAppLink"
              variant="outlined"
              fullWidth
              placeholder="Enter Vendor iOS App Link"
              name="vendorIosAppLink"
              value={form.vendorIosAppLink}
              required
              onChange={handleChange}
              aria-label="Enter Vendor iOS App Link"
              disabled={loading}
            />
          </Grid>
          {/* {renderFileInput('playstoreButtonImage', 'Playstore Button Image')} */}
          {/* {renderFileInput('iosButtonImage', 'iOS Button Image')} */}
          {renderFileInput('websiteMobileImage', 'Website Mobile Image / Video')}
        </Grid>
        <Box sx={{ textAlign: 'right', p: 2, mt: 2 }}>
          {rolesAndPermission.global_settings_edit === true ||
            rolesAndPermission.accessAll === true ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={updateBanner}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
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

export default AppBanners;

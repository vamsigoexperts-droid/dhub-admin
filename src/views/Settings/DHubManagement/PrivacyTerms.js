import React, { useState, useEffect } from 'react';
import {
    Button,
    Box,
    Grid,
    Typography,
    CircularProgress,
    FormControl,
    MenuItem,
    Select,
    Chip,
} from '@mui/material';
import axios from 'axios';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';

const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/globalsettings', title: 'Settings' },
    { to: '/policies-management/applications', title: 'Policies Management' },
    { title: 'Privacy & Terms Management' },
];

const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || '';
};

const DHUB_BASE_URL = 'https://api.doorstephub.com/v1/dhubApi/admin/dhub-management';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomCKEditor from '../../../components/theme-elements/CustomCKEditor';

const PrivacyTermsManagement = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedApp, setSelectedApp] = useState('');
    const [formData, setFormData] = useState({
        termsAndConditions: '',
        privacyPolicy: '',
        status: 'active',
    });

    const token = getAuthToken();

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        if (selectedApp) {
            fetchPrivacyData();
        } else {
            setFormData({
                termsAndConditions: '',
                privacyPolicy: '',
                status: 'active',
            });
        }
    }, [selectedApp]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${DHUB_BASE_URL}/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // API returns applications array directly in response.data.data
            const appsData = response.data.data || response.data.applications || [];
            setApplications(appsData);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const fetchPrivacyData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${DHUB_BASE_URL}/privacy/${selectedApp}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Privacy API Response:', response.data);
            // Privacy data is directly in response.data.data
            const privacyData = response.data.data || response.data.privacy;
            console.log('Privacy data:', privacyData);

            if (privacyData) {
                setFormData({
                    termsAndConditions: privacyData.termsAndConditions || '',
                    privacyPolicy: privacyData.privacyPolicy || '',
                    status: privacyData.status || 'active',
                });
            } else {
                setFormData({
                    termsAndConditions: '',
                    privacyPolicy: '',
                    status: 'active',
                });
            }
        } catch (error) {
            console.error('Error fetching privacy data:', error);
            // If no data exists, that's okay - we'll create new
            if (error.response?.status !== 404) {
                toast.error(error.response?.data?.message || 'Failed to load privacy data');
            }
            setFormData({
                termsAndConditions: '',
                privacyPolicy: '',
                status: 'active',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditorChange = (field, data) => {
        setFormData({ ...formData, [field]: data });
    };

    const handleSubmit = async () => {
        if (!selectedApp) {
            toast.error('Please select an application');
            return;
        }

        if (!formData.termsAndConditions.trim() || !formData.privacyPolicy.trim()) {
            toast.error('Both Terms & Conditions and Privacy Policy are required');
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                `${DHUB_BASE_URL}/privacy`,
                {
                    applicationId: selectedApp,
                    ...formData,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            toast.success('Privacy data saved successfully');
            fetchPrivacyData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save privacy data');
        } finally {
            setLoading(false);
        }
    };

    const selectedAppData = applications.find((app) => app._id === selectedApp);
    const termsEditorData =
        typeof formData.termsAndConditions === 'string' ? formData.termsAndConditions : '';
    const privacyEditorData =
        typeof formData.privacyPolicy === 'string' ? formData.privacyPolicy : '';

    return (
        <PageContainer
            title="Privacy & Terms Management"
            description="Manage Privacy Policies and Terms & Conditions"
        >
            <Breadcrumb title="Privacy & Terms Management" items={BCrumb} />
            <ParentCard title="Privacy & Terms Management">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <CustomFormLabel htmlFor="application" required>
                            Select Application
                        </CustomFormLabel>
                        <FormControl fullWidth>
                            <Select
                                id="application"
                                value={selectedApp}
                                onChange={(e) => setSelectedApp(e.target.value)}
                                displayEmpty
                                disabled={loading}
                            >
                                <MenuItem value="">
                                    <em>Select an application</em>
                                </MenuItem>
                                {applications.map((app) => (
                                    <MenuItem key={app._id} value={app._id}>
                                        {app.applicationName} ({app.applicationType})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {selectedAppData && (
                            <Box sx={{ mt: 1 }}>
                                <Chip
                                    label={`Type: ${selectedAppData.applicationType}`}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                <Chip
                                    label={`Status: ${selectedAppData.status}`}
                                    color={selectedAppData.status === 'active' ? 'success' : 'default'}
                                    size="small"
                                />
                            </Box>
                        )}
                    </Grid>

                    {selectedApp && (
                        <>
                            <Grid item xs={12}>
                                <CustomFormLabel htmlFor="termsAndConditions" required>
                                    Terms & Conditions
                                </CustomFormLabel>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        zIndex: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        minHeight: '420px',
                                        overflow: 'visible',
                                        pointerEvents: 'auto',
                                        bgcolor: 'background.paper',
                                        cursor: 'text',
                                        '& .ck-editor': {
                                            minHeight: '420px',
                                            display: 'block',
                                        },
                                        '& .ck-editor__main': {
                                            minHeight: '360px',
                                            overflow: 'visible',
                                        },
                                        '& .ck-editor__editable': {
                                            minHeight: '360px !important',
                                            cursor: 'text',
                                            position: 'relative',
                                            zIndex: 3,
                                        },
                                        '& .ck-content': {
                                            minHeight: '360px',
                                        },
                                    }}
                                >
                                    <CKEditor
                                        key={`terms-${selectedApp}`}
                                        editor={CustomCKEditor}
                                        data={termsEditorData}
                                        onChange={(event, editor) =>
                                            handleEditorChange('termsAndConditions', editor.getData() || '')
                                        }
                                        config={{
                                            placeholder: 'Enter Terms & Conditions',
                                        }}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <CustomFormLabel htmlFor="privacyPolicy" required>
                                    Privacy Policy
                                </CustomFormLabel>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        zIndex: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        minHeight: '420px',
                                        overflow: 'visible',
                                        pointerEvents: 'auto',
                                        bgcolor: 'background.paper',
                                        cursor: 'text',
                                        '& .ck-editor': {
                                            minHeight: '420px',
                                            display: 'block',
                                        },
                                        '& .ck-editor__main': {
                                            minHeight: '360px',
                                            overflow: 'visible',
                                        },
                                        '& .ck-editor__editable': {
                                            minHeight: '360px !important',
                                            cursor: 'text',
                                            position: 'relative',
                                            zIndex: 3,
                                        },
                                        '& .ck-content': {
                                            minHeight: '360px',
                                        },
                                    }}
                                >
                                    <CKEditor
                                        key={`privacy-${selectedApp}`}
                                        editor={CustomCKEditor}
                                        data={privacyEditorData}
                                        onChange={(event, editor) =>
                                            handleEditorChange('privacyPolicy', editor.getData() || '')
                                        }
                                        config={{
                                            placeholder: 'Enter Privacy Policy',
                                        }}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <CustomFormLabel htmlFor="status" required>
                                    Status
                                </CustomFormLabel>
                                <FormControl fullWidth>
                                    <Select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} /> : null}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </Box>
                            </Grid>
                        </>
                    )}

                    {!selectedApp && (
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 8,
                                    color: 'text.secondary',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    No Application Selected
                                </Typography>
                                <Typography variant="body2">
                                    Please select an application from the dropdown above to manage its privacy policy
                                    and terms & conditions.
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </ParentCard>
            <ToastContainer />
        </PageContainer>
    );
};

export default PrivacyTermsManagement;


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
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomCKEditor from '../../../components/theme-elements/CustomCKEditor';

const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/globalsettings', title: 'Settings' },
    { to: '/policies-management/applications', title: 'Policies Management' },
    { title: 'Refund Policy Management' },
];

const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || '';
};

const DHUB_BASE_URL = 'https://api.doorstephub.com/v1/dhubApi/admin/dhub-management';

const DHubRefundPolicy = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedApp, setSelectedApp] = useState('');
    const [refundPolicy, setRefundPolicy] = useState('');
    const [status, setStatus] = useState('active');
    const [saving, setSaving] = useState(false);

    const token = getAuthToken();

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        if (selectedApp) {
            fetchPrivacyData();
        } else {
            setRefundPolicy('');
            setStatus('active');
        }
    }, [selectedApp]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${DHUB_BASE_URL}/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
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

            const privacyData = response.data.data || response.data.privacy;

            if (privacyData) {
                setRefundPolicy(privacyData.refundPolicy || '');
                setStatus(privacyData.status || 'active');
            } else {
                setRefundPolicy('');
                setStatus('active');
            }
        } catch (error) {
            console.error('Error fetching privacy data:', error);
            if (error.response?.status !== 404) {
                toast.error(error.response?.data?.message || 'Failed to load policy data');
            }
            setRefundPolicy('');
            setStatus('active');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedApp) {
            toast.error('Please select an application');
            return;
        }

        try {
            setSaving(true);
            await axios.post(
                `${DHUB_BASE_URL}/privacy`,
                {
                    applicationId: selectedApp,
                    refundPolicy: refundPolicy,
                    status: status,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            toast.success('Refund policy saved successfully');
            fetchPrivacyData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save refund policy');
        } finally {
            setSaving(false);
        }
    };

    const selectedAppData = applications.find((app) => app._id === selectedApp);
    const editorData = typeof refundPolicy === 'string' ? refundPolicy : '';

    return (
        <PageContainer
            title="Refund Policy Management"
            description="Manage Refund Policies for Applications"
        >
            <Breadcrumb title="Refund Policy Management" items={BCrumb} />
            <ParentCard title="Refund Policy Management">
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
                                <CustomFormLabel htmlFor="refundPolicy" required>
                                    Refund Policy Content
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
                                    {loading ? (
                                        <Box
                                            sx={{
                                                minHeight: 420,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <CKEditor
                                            key={`refund-policy-${selectedApp}`}
                                            editor={CustomCKEditor}
                                            data={editorData}
                                            onChange={(event, editor) => {
                                                const data = editor.getData() || '';
                                                setRefundPolicy(data);
                                            }}
                                            config={{
                                                placeholder: 'Enter Refund Policy content here...',
                                            }}
                                        />
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <CustomFormLabel htmlFor="status" required>
                                    Status
                                </CustomFormLabel>
                                <FormControl fullWidth>
                                    <Select
                                        id="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
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
                                        disabled={loading || saving}
                                        startIcon={saving ? <CircularProgress size={20} /> : null}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
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
                                    Please select an application from the dropdown above to manage its refund policy.
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

export default DHubRefundPolicy;


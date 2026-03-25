import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Paper,
} from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { URLS } from 'src/Url';

const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/website-management/manage-screens', title: 'Website Management' },
    { title: 'About Us' },
];

const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || '';
};

const ManageAboutUs = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState('');

    const token = getAuthToken();

    const fetchAboutUs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(URLS.Aboutuslatest, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success && response.data.data) {
                // Using 'description' as seen in the backend response
                setContent(response.data.data.description || '');
            }
        } catch (error) {
            console.error('Error fetching About Us:', error);
            if (error.response?.status !== 404) {
                toast.error('Failed to load About Us content');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAboutUs();
    }, []);

    const handleSubmit = async () => {
        if (!content) {
            toast.warning('Please enter some content before saving.');
            return;
        }

        try {
            setSaving(true);

            // Sending 'description' field to match the backend structure
            const payload = {
                description: content,
                title: 'About Us' // Title is required in the backend model
            };

            await axios.put(URLS.Aboutuslatest, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            toast.success('About Us content updated successfully');
        } catch (error) {
            console.error('Error updating About Us:', error);
            toast.error(error.response?.data?.message || 'Failed to update content');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <PageContainer title="About Us Management" description="Manage Website About Us Content">
            <Breadcrumb title="About Us Management" items={BCrumb} />

            <ParentCard
                title="About Us Content"
            >
                <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="600">
                            Edit Page Content (Rich Text)
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={saving}
                            startIcon={saving ? <CircularProgress size={20} /> : null}
                        >
                            {saving ? 'Saving...' : 'Save Content'}
                        </Button>
                    </Box>
                    <Paper variant="outlined" sx={{ overflow: 'hidden', minHeight: '400px' }}>
                        <CKEditor
                            editor={ClassicEditor}
                            data={content}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setContent(data);
                            }}
                            config={{
                                placeholder: 'Enter your About Us page content here...',
                            }}
                        />
                    </Paper>
                </Box>
            </ParentCard>
            <ToastContainer />
        </PageContainer>
    );
};

export default ManageAboutUs;

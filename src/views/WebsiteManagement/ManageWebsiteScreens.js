import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Switch,
    FormControlLabel,
    Divider,
    CircularProgress
} from '@mui/material';
import { IconDeviceFloppy } from '@tabler/icons-react';
import axios from 'axios';
import { toast } from 'react-toastify';

import ParentCard from '../../components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Website Management' },
    { title: 'Manage Website Screens' },
];

const BASE_URL = 'https://api.doorstephub.com';
const API_URL = `${BASE_URL}/v1/dhubApi/admin/manage-website-screens`;

const getToken = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user?.token || localStorage.getItem('token') || null;
    } catch (error) {
        return null;
    }
};

const ManageWebsiteScreens = () => {
    const [homescreen, setHomescreen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const token = getToken();

    const fetchDetails = async () => {
        setFetching(true);
        try {
            const res = await axios.get(`${API_URL}/get-details`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setHomescreen(res.data.data.homescreen);
            }
        } catch (error) {
            console.error('Error fetching details:', error);
            toast.error('Failed to load settings');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDetails();
        }
    }, [token]);

    const handleUpdate = async (newValue) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/update-details`,
                { homescreen: newValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                setHomescreen(newValue);
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer title="Manage Website Screens" description="Manage Website Screens Visibility">
            <Breadcrumb title="Manage Website Screens" items={BCrumb} />

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <ParentCard title="Screen Visibility Settings">
                        <Box sx={{ p: 2 }}>
                            {fetching ? (
                                <Box display="flex" justifyContent="center" p={3}>
                                    <CircularProgress size={24} />
                                </Box>
                            ) : (
                                <>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        Control which screens are active on the website. Changes are saved automatically.
                                    </Typography>

                                    <Divider sx={{ my: 3 }} />

                                    <Grid container spacing={4}>
                                        <Grid item xs={12}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={homescreen}
                                                            onChange={(e) => handleUpdate(e.target.checked)}
                                                            color="primary"
                                                            disabled={loading}
                                                        />
                                                    }
                                                    label={
                                                        <Box>
                                                            <Typography variant="h6">
                                                                Home Screen
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {homescreen ? 'Visible to users' : 'Hidden from users'}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                                {loading && <CircularProgress size={20} />}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                        </Box>
                    </ParentCard>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default ManageWebsiteScreens;


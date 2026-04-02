import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, styled } from '@mui/material/styles';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconRefresh,
    IconLink,
    IconEye,
    IconX,
} from '@tabler/icons-react';
import axios from 'axios';
import { toast } from 'react-toastify';

import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import ParentCard from '../../components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Website Management' },
    { title: 'URL Structure' },
];

// API Configuration
const BASE_URL = 'https://api.doorstephub.com';
const API_URLS = {
    GET_SERVICES: `${BASE_URL}/v1/dhubApi/admin/service/getactiveservices`,
    ADD_SLUG: `${BASE_URL}/v1/dhubApi/admin/slugs/add`,
    GET_ALL_SLUGS: `${BASE_URL}/v1/dhubApi/admin/slugs/getall`,
    UPDATE_SLUG: `${BASE_URL}/v1/dhubApi/admin/slugs/update`,
    DELETE_SLUG: `${BASE_URL}/v1/dhubApi/admin/slugs/delete`,
    GET_SINGLE: `${BASE_URL}/v1/dhubApi/admin/slugs/get`,
};

const getToken = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user?.token || localStorage.getItem('token') || null;
    } catch (error) {
        console.error('Token extraction error:', error);
        return null;
    }
};

const UrlStructure = () => {
    const theme = useTheme();
    const token = getToken();

    // State
    const [services, setServices] = useState([]);
    const [slugs, setSlugs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedSlug, setSelectedSlug] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewData, setViewData] = useState(null);

    // Form State
    const [form, setForm] = useState({
        serviceId: '',
        serviceName: '',
        home: '',
        category: '',
        recentlyBooked: '',
        featuredServices: '',
        serviceCenter: '',
    });

    // Fetch Logic
    const fetchServices = useCallback(async () => {
        try {
            const res = await axios.post(
                API_URLS.GET_SERVICES,
                { serviceType: 'professional' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // The API returns services in "res.data.services" based on your provided JSON
            setServices(res.data.services || []);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to load services');
        }
    }, [token]);

    const fetchSlugs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URLS.GET_ALL_SLUGS, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSlugs(res.data.data || []);
        } catch (error) {
            console.error('Error fetching slugs:', error);
            toast.error('Failed to load URL structures');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchServices();
            fetchSlugs();
        }
    }, [token, fetchServices, fetchSlugs]);

    // Form Handlers
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'serviceId') {
            const selectedService = services.find((s) => s._id === value);
            setForm((prev) => ({
                ...prev,
                serviceId: value,
                serviceName: selectedService ? selectedService.name : '',
                serviceCenter: selectedService ? `${selectedService.name.toLowerCase().replace(/\s+/g, '-')}-service-centers` : '',
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleOpenDialog = (slug = null) => {
        if (slug) {
            setIsEdit(true);
            setSelectedSlug(slug);
            setForm({
                serviceId: slug.serviceId?._id || slug.serviceId || '',
                serviceName: slug.serviceName || '',
                home: slug.home || '',
                category: slug.category || '',
                recentlyBooked: slug.recentlyBooked || '',
                featuredServices: slug.featuredServices || '',
                serviceCenter: slug.serviceCenter || '',
            });
        } else {
            setIsEdit(false);
            setSelectedSlug(null);
            setForm({
                serviceId: '',
                serviceName: '',
                home: '',
                category: '',
                recentlyBooked: '',
                featuredServices: '',
                serviceCenter: '',
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setForm({
            serviceId: '',
            serviceName: '',
            home: '',
            category: '',
            recentlyBooked: '',
            featuredServices: '',
            serviceCenter: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (isEdit) {
                // Update - Send subset based on curl example if needed, but normally full payload is fine
                res = await axios.put(`${API_URLS.UPDATE_SLUG}/${selectedSlug._id}`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                // Add
                res = await axios.post(API_URLS.ADD_SLUG, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            if (res.data.success || res.status === 200 || res.status === 201) {
                toast.success(res.data.message || (isEdit ? 'Updated successfully' : 'Added successfully'));
                handleCloseDialog();
                fetchSlugs();
            } else {
                toast.error(res.data.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error.response?.data?.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this URL structure?')) return;

        setLoading(true);
        try {
            const res = await axios.delete(`${API_URLS.DELETE_SLUG}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(res.data.message || 'Deleted successfully');
            fetchSlugs();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Delete failed');
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (id) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URLS.GET_SINGLE}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setViewData(res.data.data);
            setViewDialogOpen(true);
        } catch (error) {
            console.error('Fetch single error:', error);
            toast.error('Failed to load details');
        } finally {
            setLoading(false);
        }
    };

    // DataGrid Columns
    const columns = [
        {
            field: 'sno',
            headerName: 'S.No',
            width: 70,
            renderCell: (params) => (
                <Typography variant="body2">{slugs.indexOf(params.row) + 1}</Typography>
            ),
        },
        {
            field: 'serviceName',
            headerName: 'Service Name',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight={600}>
                    {params.row.serviceName}
                </Typography>
            ),
        },
        {
            field: 'home',
            headerName: 'Home Slug',
            flex: 1,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ color: 'primary.main' }}>
                    /{params.row.home}
                </Typography>
            ),
        },
        {
            field: 'category',
            headerName: 'Category Slug',
            flex: 1,
        },
        {
            field: 'featuredServices',
            headerName: 'Featured Slug',
            flex: 1,
        },
        {
            field: 'serviceCenter',
            headerName: 'Service Center Slug',
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="View">
                        <IconButton size="small" color="primary" onClick={() => handleView(params.row._id)}>
                            <IconEye size={18} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpenDialog(params.row)}>
                            <IconEdit size={18} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(params.row._id)}>
                            <IconTrash size={18} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <PageContainer title="URL Structure Management" description="Manage Website URL structure">
            <Breadcrumb title="URL Structure" items={BCrumb} />

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <ParentCard
                        title="URL Structure List"
                        codeModel={
                            <Box display="flex" gap={1}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<IconRefresh size={18} />}
                                    onClick={fetchSlugs}
                                    size="small"
                                >
                                    Refresh
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<IconPlus size={18} />}
                                    onClick={() => handleOpenDialog()}
                                    size="small"
                                >
                                    Add New Slug
                                </Button>
                            </Box>
                        }
                    >
                        <Box sx={{ height: 600, width: '100%' }}>
                            <DataGrid
                                rows={slugs}
                                columns={columns}
                                getRowId={(row) => row._id}
                                loading={loading}
                                pageSizeOptions={[10, 25, 50]}
                                initialState={{
                                    pagination: {
                                        paginationModel: { pageSize: 10 },
                                    },
                                }}
                                disableRowSelectionOnClick
                                sx={{
                                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                                    border: 'none',
                                }}
                            />
                        </Box>
                    </ParentCard>
                </Grid>
            </Grid>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <IconLink size={24} />
                        <Typography variant="h5">
                            {isEdit ? 'Update URL Structure' : 'Add New URL Structure'}
                        </Typography>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <CustomFormLabel required>Select Service*</CustomFormLabel>
                                {(() => {
                                    // Check if ALL services already have a slug configured
                                    const allConfigured = !isEdit && services.length > 0 && services.every(service =>
                                        slugs.some(slug => (slug.serviceId?._id || slug.serviceId) === service._id)
                                    );

                                    if (allConfigured) {
                                        return (
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: 'success.light',
                                                    border: '1px solid',
                                                    borderColor: 'success.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Typography variant="body2" fontWeight={600} color="success.dark">
                                                    Ã¢Å“â€¦ All services already have URL structures configured!
                                                </Typography>
                                            </Box>
                                        );
                                    }

                                    return (
                                        <Select
                                            fullWidth
                                            displayEmpty
                                            name="serviceId"
                                            value={form.serviceId}
                                            onChange={handleFormChange}
                                            required
                                            disabled={isEdit}
                                        >
                                            <MenuItem value="" disabled>Select a Service</MenuItem>
                                            {services.map((service) => {
                                                const alreadyAdded = !isEdit && slugs.some(
                                                    slug => (slug.serviceId?._id || slug.serviceId) === service._id
                                                );
                                                return (
                                                    <MenuItem key={service._id} value={service._id} disabled={alreadyAdded}>
                                                        {service.name}
                                                        {alreadyAdded && ' Ã¢Å“â€œ Already added'}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    );
                                })()}
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <CustomFormLabel required>Home Page Slug*</CustomFormLabel>
                                <CustomTextField
                                    fullWidth
                                    name="home"
                                    value={form.home}
                                    onChange={handleFormChange}
                                    placeholder="e.g., ac-repair-home"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <CustomFormLabel required>Category Page Slug*</CustomFormLabel>
                                <CustomTextField
                                    fullWidth
                                    name="category"
                                    value={form.category}
                                    onChange={handleFormChange}
                                    placeholder="e.g., ac-repair-category"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <CustomFormLabel required>Recently Booked Slug*</CustomFormLabel>
                                <CustomTextField
                                    fullWidth
                                    name="recentlyBooked"
                                    value={form.recentlyBooked}
                                    onChange={handleFormChange}
                                    placeholder="e.g., ac-repair-recent"
                                    required
                                />
                            </Grid>



                            <Grid item xs={12} md={6}>
                                <CustomFormLabel required>Featured Services Slug*</CustomFormLabel>
                                <CustomTextField
                                    fullWidth
                                    name="featuredServices"
                                    value={form.featuredServices}
                                    onChange={handleFormChange}
                                    placeholder="e.g., ac-repair-featured"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <CustomFormLabel>Service Center Slug (Auto-generated)</CustomFormLabel>
                                <CustomTextField
                                    fullWidth
                                    name="serviceCenter"
                                    value={form.serviceCenter}
                                    onChange={handleFormChange}
                                    placeholder="e.g., ac-repair-service-centers"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Divider />
                    <DialogActions sx={{ p: 3, gap: 1 }}>
                        <Button variant="outlined" color="error" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" type="submit" loading={loading}>
                            {isEdit ? 'Update Structure' : 'Create Structure'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            {/* View Dialog */}
            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle
                    sx={{
                        bgcolor: 'primary.light',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h5" fontWeight={600}>
                        URL Structure Details
                    </Typography>
                    <IconButton onClick={() => setViewDialogOpen(false)}>
                        <IconX size={20} />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ p: 3 }}>
                    {viewData && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Service Name
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    {viewData.serviceName}
                                </Typography>
                            </Grid>
                            <Divider sx={{ width: '100%', my: 1 }} />
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Home Page Slug
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 600 }} gutterBottom>
                                    /{viewData.home}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Category Page Slug
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {viewData.category}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Recently Booked Slug
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {viewData.recentlyBooked}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Featured Services Slug
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {viewData.featuredServices}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Service Center Slug
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {viewData.serviceCenter || '-'}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <Divider />
                <DialogActions sx={{ p: 2 }}>
                    <Button variant="contained" onClick={() => setViewDialogOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default UrlStructure;


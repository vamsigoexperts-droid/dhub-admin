import React, { useState, useEffect, useCallback } from 'react';
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
    Chip,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputAdornment,
    Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconRefresh,
    IconSearch,
    IconWorld,
    IconDeviceDesktop,
    IconTags,
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
    { title: 'SEO Management' },
];

const BASE_URL = 'https://api.doorstephub.com';
const API_URLS = {
    GET_SERVICES: `${BASE_URL}/v1/dhubApi/admin/service/getactiveservices`,
    UPSERT_SEO: `${BASE_URL}/v1/dhubApi/web/seo/upsert-seo`,
    GET_ALL_SEO: `${BASE_URL}/v1/dhubApi/web/seo/get-all-seo`,
    GET_SUBCATEGORIES: `${BASE_URL}/v1/dhubApi/web/seo/get-subcategories`,
};

const getToken = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user?.token || localStorage.getItem('token') || null;
    } catch (error) {
        return null;
    }
};

const STATIC_PAGES = [
    { label: 'Home Page', value: '/' },
    { label: 'About Us', value: '/about-us' },
    { label: 'Contact Us', value: '/contact-us' },
    { label: 'Partner With Us', value: '/partner' },
    { label: 'Careers', value: '/careers' },
    { label: 'All Services', value: '/all-services' },
    { label: 'Privacy Policy', value: '/privacy-policy' },
    { label: 'Terms & Conditions', value: '/terms-conditions' },
];

const SeoManagement = () => {
    const token = getToken();

    // State
    const [seoList, setSeoList] = useState([]);
    const [services, setServices] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // Form State
    const [form, setForm] = useState({
        type: 'static', // static or dynamic
        pagePath: '',
        serviceId: '',
        subcategoryId: '',
        pageType: 'home', // home, category, recentlyBooked, featuredServices, serviceCenter
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
        status: 'active',
    });

    const fetchServices = useCallback(async () => {
        try {
            const res = await axios.post(
                API_URLS.GET_SERVICES,
                { serviceType: 'professional' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setServices(res.data.services || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    }, [token]);

    const fetchSeoList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URLS.GET_ALL_SEO, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSeoList(res.data.data || []);
        } catch (error) {
            console.error('Error fetching SEO list:', error);
            toast.error('Failed to load SEO settings');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchServices();
            fetchSeoList();
        }
    }, [token, fetchServices, fetchSeoList]);

    useEffect(() => {
        if (form.serviceId && form.type === 'dynamic') {
            const fetchSubcategories = async () => {
                try {
                    const res = await axios.get(`${API_URLS.GET_SUBCATEGORIES}/${form.serviceId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setSubcategories(res.data.data || []);
                } catch (error) {
                    console.error('Error fetching subcategories:', error);
                }
            };
            fetchSubcategories();
        } else {
            setSubcategories([]);
        }
    }, [form.serviceId, form.type, token]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleOpenDialog = (seo = null) => {
        if (seo) {
            setIsEdit(true);
            setSelectedId(seo._id);
            setForm({
                type: seo.type,
                pagePath: seo.pagePath || '',
                serviceId: seo.serviceId?._id || seo.serviceId || '',
                subcategoryId: seo.subcategoryId?._id || seo.subcategoryId || '',
                pageType: seo.pageType || 'home',
                seoTitle: seo.seoTitle,
                seoDescription: seo.seoDescription,
                seoKeywords: seo.seoKeywords || '',
                status: seo.status,
            });
        } else {
            setIsEdit(false);
            setSelectedId(null);
            setForm({
                type: 'static',
                pagePath: '',
                serviceId: '',
                subcategoryId: '',
                pageType: 'home',
                seoTitle: '',
                seoDescription: '',
                seoKeywords: '',
                status: 'active',
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...form };
            if (isEdit) payload.id = selectedId;

            const res = await axios.post(API_URLS.UPSERT_SEO, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                toast.success(res.data.message);
                handleCloseDialog();
                fetchSeoList();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            field: 'page',
            headerName: 'Page / Service',
            flex: 1,
            renderCell: (params) => {
                if (params.row.type === 'static') {
                    return (
                        <Box display="flex" alignItems="center" gap={1}>
                            <IconWorld size={18} color="#2196f3" />
                            <Typography variant="body2">{params.row.pagePath}</Typography>
                        </Box>
                    );
                }
                return (
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" alignItems="center" gap={1}>
                            <IconDeviceDesktop size={18} color="#4caf50" />
                            <Typography variant="body2" fontWeight={600}>
                                {params.row.serviceId?.name || 'Unknown Service'}
                            </Typography>
                        </Box>
                        {params.row.subcategoryId && (
                            <Typography variant="caption" color="primary" fontWeight={500}>
                                Sub: {params.row.subcategoryId?.name || 'Unknown Sub'}
                            </Typography>
                        )}
                        <Typography variant="caption" color="textSecondary">
                            Type: {params.row.pageType}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            field: 'seoTitle',
            headerName: 'SEO Title',
            flex: 1.5,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <Typography variant="body2" noWrap>
                        {params.value}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'active' ? 'success' : 'default'}
                    size="small"
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Tooltip title="Edit">
                    <IconButton size="small" color="primary" onClick={() => handleOpenDialog(params.row)}>
                        <IconEdit size={20} />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    return (
        <PageContainer title="SEO Management" description="Manage Website Metadata">
            <Breadcrumb title="SEO Management" items={BCrumb} />

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <ParentCard
                        title="Search Engine Optimization (SEO)"
                        codeModel={
                            <Box display="flex" gap={1}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<IconRefresh size={18} />}
                                    onClick={fetchSeoList}
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
                                    Add New SEO
                                </Button>
                            </Box>
                        }
                    >
                        <Box sx={{ height: 600, width: '100%' }}>
                            <DataGrid
                                rows={seoList}
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
                            />
                        </Box>
                    </ParentCard>
                </Grid>
            </Grid>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconSearch size={24} />
                        <Typography variant="h5">
                            {isEdit ? 'Update SEO Details' : 'Configure New SEO'}
                        </Typography>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl component="fieldset">
                                    <CustomFormLabel>Page Type Selection</CustomFormLabel>
                                    <RadioGroup
                                        row
                                        name="type"
                                        value={form.type}
                                        onChange={handleFormChange}
                                    >
                                        <FormControlLabel value="static" control={<Radio />} label="Static Page (URL)" />
                                        <FormControlLabel value="dynamic" control={<Radio />} label="Service Based" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            {form.type === 'static' ? (
                                <Grid item xs={12} md={6}>
                                    <CustomFormLabel required>Select or Type Path*</CustomFormLabel>
                                    {(() => {
                                        // Check if ALL predefined static pages are already configured
                                        const allStaticConfigured = !isEdit && STATIC_PAGES.every(page =>
                                            seoList.some(seo => seo.type === 'static' && seo.pagePath === page.value)
                                        );

                                        if (allStaticConfigured) {
                                            return (
                                                <>
                                                    <Alert
                                                        severity="success"
                                                        sx={{ mb: 2, borderRadius: 2 }}
                                                        icon={<span>Ã¢Å“â€¦</span>}
                                                    >
                                                        <Typography variant="body2" fontWeight={600}>
                                                            All predefined pages are configured!
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Use <strong>Custom Path</strong> below to add a new unique page path.
                                                        </Typography>
                                                    </Alert>
                                                    <CustomTextField
                                                        fullWidth
                                                        name="pagePath"
                                                        value={form.pagePath}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. /my-custom-page"
                                                        required
                                                    />
                                                </>
                                            );
                                        }

                                        return (
                                            <>
                                                <Select
                                                    fullWidth
                                                    name="pagePath"
                                                    value={STATIC_PAGES.some(p => p.value === form.pagePath) ? form.pagePath : 'custom'}
                                                    onChange={(e) => {
                                                        if (e.target.value !== 'custom') {
                                                            setForm(prev => ({ ...prev, pagePath: e.target.value }));
                                                        } else {
                                                            setForm(prev => ({ ...prev, pagePath: '' }));
                                                        }
                                                    }}
                                                    required
                                                >
                                                    {STATIC_PAGES.map((page) => {
                                                        const alreadyAdded = seoList.some(
                                                            seo => seo.type === 'static' && seo.pagePath === page.value && seo._id !== selectedId
                                                        );
                                                        return (
                                                            <MenuItem
                                                                key={page.value}
                                                                value={page.value}
                                                                disabled={alreadyAdded}
                                                            >
                                                                {page.label} ({page.value})
                                                                {alreadyAdded && ' Ã¢Å“â€œ Already configured'}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                    <MenuItem value="custom">-- Custom Path --</MenuItem>
                                                </Select>
                                                {(!STATIC_PAGES.some(p => p.value === form.pagePath) || form.pagePath === '') && (
                                                    <CustomTextField
                                                        fullWidth
                                                        sx={{ mt: 2 }}
                                                        name="pagePath"
                                                        value={form.pagePath}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. /my-custom-page"
                                                        required
                                                    />
                                                )}
                                            </>
                                        );
                                    })()}
                                </Grid>
                            ) : (
                                <>
                                    <Grid item xs={12} md={6}>
                                        <CustomFormLabel required>Select Service*</CustomFormLabel>
                                        <Select
                                            fullWidth
                                            name="serviceId"
                                            value={form.serviceId}
                                            onChange={handleFormChange}
                                            displayEmpty
                                            required
                                        >
                                            <MenuItem value="" disabled>-- Select a Service --</MenuItem>
                                            {services.map((s) => (
                                                <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <CustomFormLabel required>Select Slug Category*</CustomFormLabel>
                                        {(() => {
                                            // All possible slug types for this service
                                            const isApplianceService = services.find(s => s._id === form.serviceId)?.name === 'Appliance Service' || form.serviceId === '6638843ce80486c9d747065a';
                                            const slugOptions = [
                                                { value: 'home', label: 'Home Page Slug' },
                                                { value: 'category', label: 'Category Page Slug' },
                                                { value: 'subcategory', label: 'Subcategory Page Slug' },
                                                { value: 'recentlyBooked', label: 'Recently Booked Slug' },
                                                { value: 'featuredServices', label: 'Featured Services Slug' },
                                                ...(isApplianceService ? [{ value: 'serviceCenter', label: 'Service Center Slug' }] : []),
                                            ];

                                            // Check which ones are already used for this serviceId
                                            const isSlugTypeUsed = (pageType) => seoList.some(
                                                seo =>
                                                    seo.type === 'dynamic' &&
                                                    (seo.serviceId?._id || seo.serviceId) === form.serviceId &&
                                                    seo.pageType === pageType &&
                                                    seo._id !== selectedId
                                            );

                                            const allUsed = !isEdit && form.serviceId && slugOptions.every(opt => isSlugTypeUsed(opt.value));

                                            if (allUsed) {
                                                return (
                                                    <Alert severity="info" sx={{ borderRadius: 2 }} icon={<span>Ã¢â€žÂ¹Ã¯Â¸Â</span>}>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            All slug types are already configured for this service!
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Select a different service or edit an existing SEO entry.
                                                        </Typography>
                                                    </Alert>
                                                );
                                            }

                                            return (
                                                <Select
                                                    fullWidth
                                                    name="pageType"
                                                    value={form.pageType}
                                                    onChange={handleFormChange}
                                                    required
                                                >
                                                    {slugOptions.map(opt => {
                                                        const alreadyUsed = isSlugTypeUsed(opt.value);
                                                        return (
                                                            <MenuItem key={opt.value} value={opt.value} disabled={alreadyUsed}>
                                                                {opt.label}
                                                                {alreadyUsed && ' Ã¢Å“â€œ Already configured'}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            );
                                        })()}
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                            </Grid>

                            <Grid item xs={12}>
                                <CustomFormLabel required>SEO Meta Title*</CustomFormLabel>
                                <CustomTextField
                                    fullWidth
                                    name="seoTitle"
                                    value={form.seoTitle}
                                    onChange={handleFormChange}
                                    placeholder="Enter meta title (max 60 chars recommended)"
                                    required
                                    helperText={`${form.seoTitle.length} characters`}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography variant="caption" color={form.seoTitle.length > 60 ? 'error' : 'textSecondary'}>
                                                    {form.seoTitle.length}/60
                                                </Typography>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <CustomFormLabel required>SEO Meta Description*</CustomFormLabel>
                                <CustomTextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    name="seoDescription"
                                    value={form.seoDescription}
                                    onChange={handleFormChange}
                                    placeholder="Enter search results snippet (max 160 chars recommended)"
                                    required
                                    helperText={`${form.seoDescription.length} characters`}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography variant="caption" color={form.seoDescription.length > 160 ? 'error' : 'textSecondary'}>
                                                    {form.seoDescription.length}/160
                                                </Typography>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <CustomFormLabel>SEO Keywords (Comma Separated)</CustomFormLabel>
                                <CustomTextField
                                    fullWidth
                                    name="seoKeywords"
                                    value={form.seoKeywords}
                                    onChange={handleFormChange}
                                    placeholder="e.g. AC Repair, Home Services, Hyderabad"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <IconTags size={18} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Divider />
                    <DialogActions sx={{ p: 3 }}>
                        <Button variant="outlined" color="error" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" type="submit" loading={loading}>
                            {isEdit ? 'Update SEO' : 'Save SEO'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </PageContainer>
    );
};

export default SeoManagement;


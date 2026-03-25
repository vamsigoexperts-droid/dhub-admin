import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import ParentCard from 'src/components/shared/ParentCard';
import {
    Button,
    Box,
    Grid,
    Divider,
    Avatar,
    Typography,
    MenuItem,
    FormControlLabel,
    Select,
    CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { URLS } from 'src/Url';
import axios from 'axios';

const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/business-verticals', title: 'Business Verticals' },
    { to: '/knowledge-base', title: 'Knowledge Base' },
    { title: 'Create Article' },
];

const CreateKnowledgeBase = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    const [form, setForm] = useState({
        title: '',
        slug: '',
        summary: '',
        serviceId: '',
        categoryId: '',
        subcategoryId: '',
        flagType: '',
        readTime: '',
        isTrending: false,
        status: 'draft',
        coverImageAlt: '',
    });

    const [coverImage, setCoverImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (form.serviceId) {
            const selectedService = services.find((s) => s._id === form.serviceId);
            if (selectedService) {
                // Determine flagType, defaulting to 'services'
                const currentFlagType = selectedService.flagType || 'services';

                setForm((prev) => ({
                    ...prev,
                    flagType: currentFlagType,
                    categoryId: '',
                    subcategoryId: ''
                }));
                // Pass both serviceId and flagType
                fetchCategories(form.serviceId, currentFlagType);
            }
        } else {
            setCategories([]);
            setSubcategories([]);
        }
    }, [form.serviceId, services]);

    useEffect(() => {
        if (form.categoryId) {
            setForm(prev => ({ ...prev, subcategoryId: '' })); // Reset subcategory
            fetchSubcategories(form.categoryId);
        } else {
            setSubcategories([]);
        }
    }, [form.categoryId]);

    // Auto-generate slug from title
    useEffect(() => {
        if (form.title && !form.slug) {
            const generatedSlug = form.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setForm((prev) => ({ ...prev, slug: generatedSlug }));
        }
    }, [form.title]);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token missing in fetchServices");
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`${URLS.GetKnowledgeBaseServices}?status=true`, config);

            if (response.data.success || response.data.data) {
                setServices(response.data.data || response.data.services || []);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to fetch services');
        }
    };

    const fetchCategories = async (serviceId, flagType = 'services') => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            // Format: .../categories/FLAG_TYPE?serviceId=SERVICE_ID
            const response = await axios.get(
                `${URLS.GetKnowledgeBaseCategories}${flagType}?serviceId=${serviceId}`,
                config
            );

            if (response.data.success) {
                setCategories(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories');
            setCategories([]);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            // Format: .../subcategories/CATEGORY_ID/FLAG_TYPE
            // We need to use valid flagType from form
            const currentFlagType = form.flagType || 'services';

            const response = await axios.get(
                `${URLS.GetKnowledgeBaseSubcategories}${categoryId}/${currentFlagType}`,
                config,
            );

            if (response.data.success) {
                setSubcategories(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            // toast.error('Failed to fetch subcategories');
            setSubcategories([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const ext = selectedFile.name.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png'].includes(ext)) {
                setCoverImage(selectedFile);
                setPreview(URL.createObjectURL(selectedFile));
            } else {
                e.target.value = null;
                toast.error('Please choose JPG, JPEG, or PNG.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!form.title || form.title.length < 10) {
            toast.error('Title is required and must be at least 10 characters.');
            return;
        }
        if (!form.serviceId) {
            toast.error('Please select a service.');
            return;
        }
        if (!coverImage) {
            toast.error('Cover image is required.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('title', form.title);
            if (form.slug) formData.append('slug', form.slug);
            if (form.summary) formData.append('summary', form.summary);
            if (form.serviceId) formData.append('serviceId', form.serviceId);
            if (form.categoryId) formData.append('categoryId', form.categoryId);
            if (form.subcategoryId) formData.append('subcategoryId', form.subcategoryId);
            if (form.flagType) formData.append('flagType', form.flagType);
            if (form.readTime) formData.append('readTime', form.readTime);
            formData.append('isTrending', form.isTrending);
            formData.append('status', form.status);
            if (coverImage) formData.append('coverImage', coverImage);
            if (form.coverImageAlt) formData.append('coverImageAlt', form.coverImageAlt);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            const response = await axios.post(URLS.CreateKnowledgeBase, formData, config);

            if (response.data.success) {
                toast.success('Article created successfully!');
                setTimeout(() => {
                    navigate('/knowledge-base');
                }, 1500);
            } else {
                toast.error(response.data.message || 'Failed to create article');
            }
        } catch (error) {
            console.error('Error creating article:', error);
            toast.error(error.response?.data?.message || 'Failed to create article');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer title="Create Knowledge Base Article" description="Create a new article">
            <Breadcrumb title="Create Article" items={BCrumb} />
            <form onSubmit={handleSubmit}>
                <ParentCard title="Create Knowledge Base Article">
                    <Grid container spacing={3} sx={{ p: 2 }}>
                        {/* Service Selection */}
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="serviceId" required>
                                Select Service
                            </CustomFormLabel>
                            <Select
                                id="serviceId"
                                name="serviceId"
                                value={form.serviceId}
                                onChange={handleChange}
                                fullWidth
                                required
                            >
                                <MenuItem value="">Select a service</MenuItem>
                                {services.map((service) => (
                                    <MenuItem key={service._id} value={service._id}>
                                        {service.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        {/* Category Selection */}
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="categoryId">Select Category</CustomFormLabel>
                            <Select
                                id="categoryId"
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleChange}
                                fullWidth
                                disabled={!form.serviceId || categories.length === 0}
                            >
                                <MenuItem value="">Select a category</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        {/* Subcategory Selection */}
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="subcategoryId">Select Subcategory</CustomFormLabel>
                            <Select
                                id="subcategoryId"
                                name="subcategoryId"
                                value={form.subcategoryId}
                                onChange={handleChange}
                                fullWidth
                                disabled={!form.categoryId || subcategories.length === 0}
                            >
                                <MenuItem value="">Select a subcategory</MenuItem>
                                {subcategories.map((subcategory) => (
                                    <MenuItem key={subcategory._id} value={subcategory._id}>
                                        {subcategory.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        {/* Title */}
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="title" required>
                                Article Title
                            </CustomFormLabel>
                            <CustomTextField
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                fullWidth
                                required
                                placeholder="Enter article title (min 10 characters)"
                            />
                        </Grid>

                        {/* Slug */}
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="slug">Slug (URL-friendly)</CustomFormLabel>
                            <CustomTextField
                                id="slug"
                                name="slug"
                                value={form.slug}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Auto-generated from title"
                            />
                        </Grid>

                        {/* Summary */}
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="summary">Summary</CustomFormLabel>
                            <CustomTextField
                                id="summary"
                                name="summary"
                                value={form.summary}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Brief description of the article"
                            />
                        </Grid>

                        {/* Cover Image */}
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="coverImage" required>
                                Cover Image
                            </CustomFormLabel>
                            <CustomTextField
                                id="coverImage"
                                type="file"
                                onChange={handleImageChange}
                                fullWidth
                                inputProps={{ accept: 'image/jpeg,image/png' }}
                            />
                            {preview && (
                                <Box mt={2}>
                                    <Typography variant="caption">Preview:</Typography>
                                    <Avatar
                                        src={preview}
                                        alt="Cover preview"
                                        variant="rounded"
                                        sx={{ width: 200, height: 120, mt: 1 }}
                                    />
                                </Box>
                            )}
                        </Grid>

                        {/* Cover Image Alt Text */}
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="coverImageAlt">Cover Image Alt Text</CustomFormLabel>
                            <CustomTextField
                                id="coverImageAlt"
                                name="coverImageAlt"
                                value={form.coverImageAlt}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Describe the image for accessibility"
                            />
                        </Grid>

                        {/* Read Time */}
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="readTime">Read Time (minutes)</CustomFormLabel>
                            <CustomTextField
                                id="readTime"
                                name="readTime"
                                type="number"
                                value={form.readTime}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Estimated reading time"
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        {/* Status */}
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="status">Status</CustomFormLabel>
                            <Select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="draft">Draft</MenuItem>
                                <MenuItem value="published">Published</MenuItem>
                                <MenuItem value="archived">Archived</MenuItem>
                            </Select>
                        </Grid>

                        {/* Is Trending */}
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <CustomCheckbox
                                        checked={form.isTrending}
                                        onChange={handleCheckboxChange}
                                        name="isTrending"
                                        color="primary"
                                    />
                                }
                                label="Mark as Trending"
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        gap={2}
                        sx={{
                            position: 'sticky',
                            bottom: 0,
                            bgcolor: theme.palette.background.paper,
                            p: 2,
                            zIndex: 1,
                        }}
                    >
                        <Button
                            color="error"
                            variant="outlined"
                            onClick={() => navigate('/knowledge-base')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            disabled={loading}
                            startIcon={loading && <CircularProgress size={20} />}
                        >
                            {loading ? 'Creating...' : 'Create Article'}
                        </Button>
                    </Box>
                </ParentCard>
            </form>
            <ToastContainer position="top-right" autoClose={3000} />
        </PageContainer>
    );
};

export default CreateKnowledgeBase;

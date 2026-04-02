import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    { title: 'Edit Article' },
];

const EditKnowledgeBase = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetchingArticle, setFetchingArticle] = useState(true);
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
    const [existingImage, setExistingImage] = useState(null);

    useEffect(() => {
        fetchServices();
        fetchArticle();
    }, [id]);

    useEffect(() => {
        if (form.serviceId && services.length > 0) {
            const selectedService = services.find((s) => s._id === form.serviceId);
            if (selectedService) {
                const newFlagType = selectedService.flagType || 'services';

                // Check for mismatch between saved flagType and current service definition
                if (form.flagType && form.flagType !== newFlagType) {
                    setForm((prev) => ({
                        ...prev,
                        flagType: newFlagType,
                        categoryId: '',
                        subcategoryId: '',
                    }));
                    fetchCategories(newFlagType, form.serviceId);
                }
            }
        }
    }, [form.serviceId, services, form.flagType]);

    useEffect(() => {
        if (form.categoryId && form.flagType) {
            fetchSubcategories(form.categoryId, form.flagType);
        }
    }, [form.categoryId, form.flagType]);

    const fetchArticle = async () => {
        setFetchingArticle(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`${URLS.GetKnowledgeBaseById}${id}`, config);

            if (response.data.success && response.data.data) {
                const article = response.data.data;
                const flagType = article.flagType || 'services';

                setForm({
                    title: article.title || '',
                    slug: article.slug || '',
                    summary: article.summary || '',
                    serviceId: article.serviceId?._id || article.serviceId || '',
                    categoryId: article.categoryId?._id || article.categoryId || '',
                    subcategoryId: article.subcategoryId?._id || article.subcategoryId || '',
                    flagType: flagType,
                    readTime: article.readTime || '',
                    isTrending: article.isTrending || false,
                    status: article.status || 'draft',
                    coverImageAlt: article.coverImageAlt || '',
                });

                // Immediately fetch categories based on the saved flagType
                // This ensures categories are loaded even if the service list takes time or the service is not found
                if (flagType) {
                    fetchCategories(flagType, article.serviceId?._id || article.serviceId);
                }

                if (article.coverImage) {
                    const imageUrl = article.coverImage.url || article.coverImage;
                    const imageAlt = article.coverImage.alt || article.coverImageAlt || '';
                    setExistingImage(`${URLS.FileBase}${imageUrl}`);
                    setPreview(`${URLS.FileBase}${imageUrl}`);
                    if (imageAlt) {
                        setForm((prev) => ({ ...prev, coverImageAlt: imageAlt }));
                    }
                }
            } else {
                toast.error('Article not found');
                navigate('/knowledge-base');
            }
        } catch (error) {
            console.error('Error fetching article:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch article');
            navigate('/knowledge-base');
        } finally {
            setFetchingArticle(false);
        }
    };

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
            // Endpoint: https://api.doorstephub.com/v1/dhubApi/admin/services/getall?status=true
            const response = await axios.get(`${URLS.GetKnowledgeBaseServices}?status=true`, config);

            if (response.data.success || response.data.data) {
                setServices(response.data.data || response.data.services || []);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            // toast.error('Failed to fetch services');
        }
    };

    const fetchCategories = async (flagType, serviceId = '') => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            // If we have a form.serviceId or passed serviceId, use it
            const sId = serviceId || form.serviceId;
            let url = `${URLS.GetKnowledgeBaseCategories}${flagType}`;
            if (sId) {
                url += `?serviceId=${sId}`;
            }

            const response = await axios.get(url, config);

            if (response.data.success) {
                setCategories(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    const fetchSubcategories = async (categoryId, flagType) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            // Format: .../subcategories/CATEGORY_ID/FLAG_TYPE
            const response = await axios.get(
                `${URLS.GetKnowledgeBaseSubcategories}${categoryId}/${flagType}`,
                config,
            );

            if (response.data.success) {
                setSubcategories(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            setSubcategories([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        const selectedService = services.find((s) => s._id === serviceId);
        const newFlagType = selectedService?.flagType || 'services';

        setForm((prev) => ({
            ...prev,
            serviceId,
            flagType: newFlagType,
            categoryId: '',
            subcategoryId: '',
        }));
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setForm((prev) => ({
            ...prev,
            categoryId,
            subcategoryId: '',
        }));
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

            const response = await axios.put(`${URLS.UpdateKnowledgeBase}${id}`, formData, config);

            if (response.data.success) {
                toast.success('Article updated successfully!');
                setTimeout(() => {
                    navigate('/knowledge-base');
                }, 1500);
            } else {
                toast.error(response.data.message || 'Failed to update article');
            }
        } catch (error) {
            console.error('Error updating article:', error);
            toast.error(error.response?.data?.message || 'Failed to update article');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingArticle) {
        return (
            <PageContainer title="Edit Knowledge Base Article" description="Edit article">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Edit Knowledge Base Article" description="Edit article">
            <Breadcrumb title="Edit Article" items={BCrumb} />
            <form onSubmit={handleSubmit}>
                <ParentCard title="Edit Knowledge Base Article">
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
                                onChange={handleServiceChange}
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
                                onChange={handleCategoryChange}
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

                        {/* Slug (Read-only) */}
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="slug">Slug (Read-only)</CustomFormLabel>
                            <CustomTextField
                                id="slug"
                                name="slug"
                                value={form.slug}
                                fullWidth
                                disabled
                                placeholder="Slug cannot be changed"
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
                            <CustomFormLabel htmlFor="coverImage">
                                Cover Image {existingImage && '(Optional - leave empty to keep current)'}
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
                                    <Typography variant="caption">
                                        {coverImage ? 'New Preview:' : 'Current Image:'}
                                    </Typography>
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
                            {loading ? 'Updating...' : 'Update Article'}
                        </Button>
                    </Box>
                </ParentCard>
            </form>
            <ToastContainer position="top-right" autoClose={3000} />
        </PageContainer>
    );
};

export default EditKnowledgeBase;


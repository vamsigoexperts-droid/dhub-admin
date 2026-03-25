import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import {
    Button,
    Box,
    Grid,
    Divider,
    Avatar,
    Typography,
    Chip,
    CircularProgress,
    Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { URLS } from 'src/Url';
import axios from 'axios';

const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/business-verticals', title: 'Business Verticals' },
    { to: '/knowledge-base', title: 'Knowledge Base' },
    { title: 'View Article' },
];

const ViewKnowledgeBase = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState(null);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`${URLS.GetKnowledgeBaseById}${id}`, config);

            if (response.data.success && response.data.data) {
                setArticle(response.data.data);
            } else {
                toast.error('Article not found');
                navigate('/knowledge-base');
            }
        } catch (error) {
            console.error('Error fetching article:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch article');
            navigate('/knowledge-base');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <PageContainer title="View Knowledge Base Article" description="View article details">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (!article) {
        return null;
    }

    const statusColors = {
        published: 'success',
        draft: 'warning',
        archived: 'error',
    };

    return (
        <PageContainer title="View Knowledge Base Article" description="View article details">
            <Breadcrumb title="View Article" items={BCrumb} />
            <ParentCard title="Knowledge Base Article Details">
                <Grid container spacing={3} sx={{ p: 2 }}>
                    {/* Cover Image */}
                    {article.coverImage && (
                        <Grid item xs={12}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    Cover Image
                                </Typography>
                                <Avatar
                                    src={`${URLS.FileBase}${article.coverImage.url || article.coverImage}`}
                                    alt={article.coverImage.alt || article.coverImageAlt || article.title}
                                    variant="rounded"
                                    sx={{ width: '100%', maxWidth: 600, height: 'auto', mx: 'auto' }}
                                />
                                {(article.coverImage.alt || article.coverImageAlt) && (
                                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                        Alt Text: {article.coverImage.alt || article.coverImageAlt}
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                    )}

                    {/* Title */}
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>
                            {article.title}
                        </Typography>
                        <Divider />
                    </Grid>

                    {/* Slug */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Slug
                        </Typography>
                        <Typography variant="body1">{article.slug || 'N/A'}</Typography>
                    </Grid>

                    {/* Status */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Status
                        </Typography>
                        <Chip
                            label={article.status || 'draft'}
                            color={statusColors[article.status] || 'default'}
                            sx={{ mt: 0.5 }}
                        />
                    </Grid>

                    {/* Service */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Service
                        </Typography>
                        <Typography variant="body1">
                            {article.serviceId?.name || 'N/A'}
                        </Typography>
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Category
                        </Typography>
                        <Typography variant="body1">
                            {article.categoryId?.name || 'N/A'}
                        </Typography>
                    </Grid>

                    {/* Subcategory */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Subcategory
                        </Typography>
                        <Typography variant="body1">
                            {article.subcategoryId?.name || 'N/A'}
                        </Typography>
                    </Grid>

                    {/* Flag Type */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Type
                        </Typography>
                        <Chip
                            label={article.flagType || 'N/A'}
                            color={article.flagType === 'services' ? 'primary' : 'secondary'}
                            size="small"
                            sx={{ mt: 0.5 }}
                        />
                    </Grid>

                    {/* Read Time */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Read Time
                        </Typography>
                        <Typography variant="body1">{article.readTime || 0} minutes</Typography>
                    </Grid>

                    {/* Trending */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Trending
                        </Typography>
                        <Chip
                            label={article.isTrending ? 'Yes' : 'No'}
                            color={article.isTrending ? 'success' : 'default'}
                            size="small"
                            sx={{ mt: 0.5 }}
                        />
                    </Grid>

                    {/* Summary */}
                    {article.summary && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Summary
                            </Typography>
                            <Paper elevation={1} sx={{ p: 2, bgcolor: theme.palette.grey[50] }}>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {article.summary}
                                </Typography>
                            </Paper>
                        </Grid>
                    )}

                    {/* Metadata */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" color="textSecondary">
                            Metadata
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="textSecondary">
                            Created At
                        </Typography>
                        <Typography variant="body2">
                            {article.createdAt
                                ? new Date(article.createdAt).toLocaleString()
                                : 'N/A'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="textSecondary">
                            Updated At
                        </Typography>
                        <Typography variant="body2">
                            {article.updatedAt
                                ? new Date(article.updatedAt).toLocaleString()
                                : 'N/A'}
                        </Typography>
                    </Grid>

                    {article.publishedAt && (
                        <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="textSecondary">
                                Published At
                            </Typography>
                            <Typography variant="body2">
                                {new Date(article.publishedAt).toLocaleString()}
                            </Typography>
                        </Grid>
                    )}
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
                        color="secondary"
                        variant="outlined"
                        onClick={() => navigate('/knowledge-base')}
                    >
                        Back to List
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => navigate(`/knowledge-base/edit/${id}`)}
                    >
                        Edit Article
                    </Button>
                </Box>
            </ParentCard>
            <ToastContainer position="top-right" autoClose={3000} />
        </PageContainer>
    );
};

export default ViewKnowledgeBase;

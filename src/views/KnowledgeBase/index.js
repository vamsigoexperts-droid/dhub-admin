import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { Button, Box, Typography, Chip, Avatar, IconButton, Tooltip, Tabs, Tab } from '@mui/material';
import { IconPlus, IconEdit, IconTrash, IconEye, IconUserPlus } from '@tabler/icons-react';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { URLS } from 'src/Url';
import axios from 'axios';

const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/business-verticals', title: 'Business Verticals' },
    { title: 'Knowledge Base' },
];

const KnowledgeBase = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0); // 0 for "All"
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    useEffect(() => {
        fetchServices();
        fetchArticles();
    }, []);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`${URLS.GetKnowledgeBaseServices}?status=true`, config);

            if (response.data.success || response.data.data) {
                setServices(response.data.data || response.data.services || []);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            // toast.error('Failed to fetch services');
        }
    };

    const fetchArticles = async (serviceId = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            let url = URLS.GetAllKnowledgeBase;
            if (serviceId) {
                url += `?serviceId=${serviceId}`;
            }

            const response = await axios.get(url, config);

            if (response.data.success) {
                setArticles(response.data.data || []);
            } else {
                toast.error('Failed to fetch articles');
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch articles');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        if (newValue === 0) {
            fetchArticles();
        } else {
            // services array index is newValue - 1 because 0 is "All"
            const service = services[newValue - 1];
            if (service) {
                fetchArticles(service._id);
            }
        }
    };

    const handleAssignProvider = (id) => {
        // Here you can navigate to the assign provider page or open a modal
        // navigate(`/knowledge-base/assign-provider/${id}`);
        toast.info('Assign Provider functionality coming soon');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.delete(`${URLS.DeleteKnowledgeBase}${id}`, config);

            if (response.data.success) {
                toast.success('Article deleted successfully');
                refreshArticles();
            } else {
                toast.error('Failed to delete article');
            }
        } catch (error) {
            console.error('Error deleting article:', error);
            toast.error(error.response?.data?.message || 'Failed to delete article');
        }
    };

    const handleBulkDelete = async () => {
        if (rowSelectionModel.length === 0) return;

        if (!window.confirm(`Are you sure you want to delete ${rowSelectionModel.length} selected article(s)?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            // Use Promise.all to delete multiple items concurrently
            // Ideally backend should support bulk delete endpoint
            const deletePromises = rowSelectionModel.map(id =>
                axios.delete(`${URLS.DeleteKnowledgeBase}${id}`, config)
            );

            await Promise.all(deletePromises);

            toast.success('Selected articles deleted successfully');
            setRowSelectionModel([]); // Clear selection
            refreshArticles();

        } catch (error) {
            console.error('Error deleting articles:', error);
            toast.error('Failed to delete some selected articles');
            // Still refresh to show what remains
            refreshArticles();
        }
    };

    const refreshArticles = () => {
        if (selectedTab === 0) {
            fetchArticles();
        } else {
            const service = services[selectedTab - 1];
            fetchArticles(service?._id);
        }
    };

    const columns = [
        {
            field: 'sl',
            headerName: 'SL',
            width: 50,
            renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
        },
        {
            field: 'coverImage',
            headerName: 'Image',
            width: 80,
            renderCell: (params) => {
                const imageUrl = params.value?.url || params.value;
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <Avatar
                            src={imageUrl ? `${URLS.FileBase}${imageUrl}` : '/images/placeholder.png'}
                            alt={params.row.title}
                            variant="rounded"
                            sx={{ width: 50, height: 50 }}
                        />
                    </Box>
                );
            },
        },
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Typography
                        variant="body2"
                        sx={{
                            whiteSpace: 'normal',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: '1.4em',
                            maxHeight: '2.8em',
                        }}
                    >
                        {params.value}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 120,
            valueGetter: (value, row) => row?.categoryId?.name || 'N/A',
        },
        {
            field: 'subcategory',
            headerName: 'Subcategory',
            width: 120,
            valueGetter: (value, row) => row?.subcategoryId?.name || 'N/A',
        },
        {
            field: 'flagType',
            headerName: 'Type',
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value || 'N/A'}
                    size="small"
                    color={params.value === 'services' ? 'primary' : 'secondary'}
                />
            ),
        },
        {
            field: 'readTime',
            headerName: 'Time',
            width: 80,
            renderCell: (params) => `${params.value || 0} min`,
        },
        {
            field: 'isTrending',
            headerName: 'Trend',
            width: 80,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'Yes' : 'No'}
                    size="small"
                    color={params.value ? 'success' : 'default'}
                />
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => {
                const statusColors = {
                    published: 'success',
                    draft: 'warning',
                    archived: 'error',
                };
                return (
                    <Chip
                        label={params.value || 'draft'}
                        size="small"
                        color={statusColors[params.value] || 'default'}
                    />
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 160,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View">
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => navigate(`/knowledge-base/view/${params.row._id}`)}
                        >
                            <IconEye size={18} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/knowledge-base/edit/${params.row._id}`)}
                        >
                            <IconEdit size={18} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Assign Provider">
                        <IconButton
                            size="small"
                            sx={{
                                color: '#fff',
                                backgroundColor: '#009688',
                                '&:hover': {
                                    backgroundColor: '#00796b',
                                },
                            }}
                            onClick={() => handleAssignProvider(params.row._id)}
                        >
                            <IconUserPlus size={18} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(params.row._id)}
                        >
                            <IconTrash size={18} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <PageContainer title="Knowledge Base" description="Manage knowledge base articles">
            <Breadcrumb title="Knowledge Base" items={BCrumb} />
            <ParentCard title="Knowledge Base Articles">
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                        Manage your knowledge base articles
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {rowSelectionModel.length > 0 && (
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<IconTrash />}
                                onClick={handleBulkDelete}
                            >
                                Delete Selected ({rowSelectionModel.length})
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<IconPlus />}
                            onClick={() => navigate('/knowledge-base/create')}
                        >
                            Create New Article
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        aria-label="knowledge base service tabs"
                        sx={{
                            '& .MuiTabs-indicator': { display: 'none' },
                            '& .MuiTabs-flexContainer': { gap: 1 },
                        }}
                    >
                        <Tab
                            label="All"
                            sx={{
                                borderRadius: '6px', // Matched to reference
                                textTransform: 'capitalize',
                                px: 3,
                                py: 1,
                                minHeight: 'unset',
                                fontSize: '0.9rem',
                                color: selectedTab === 0 ? theme.palette.primary.main : theme.palette.text.secondary,
                                backgroundColor: selectedTab === 0 ? 'rgba(0, 133, 219, 0.1)' : 'transparent', // Light primary bg
                                border: `1px solid ${selectedTab === 0 ? theme.palette.primary.main : theme.palette.divider}`,
                                fontWeight: selectedTab === 0 ? '600' : '400',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 133, 219, 0.05)',
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main,
                                },
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main,
                                },
                            }}
                        />
                        {services.map((service, index) => (
                            <Tab
                                key={service._id}
                                label={service.name}
                                sx={{
                                    borderRadius: '6px', // Matched to reference
                                    textTransform: 'capitalize',
                                    px: 3,
                                    py: 1,
                                    minHeight: 'unset',
                                    fontSize: '0.9rem',
                                    color: selectedTab === index + 1 ? theme.palette.primary.main : theme.palette.text.secondary,
                                    backgroundColor: selectedTab === index + 1 ? 'rgba(0, 133, 219, 0.1)' : 'transparent',
                                    border: `1px solid ${selectedTab === index + 1 ? theme.palette.primary.main : theme.palette.divider}`,
                                    fontWeight: selectedTab === index + 1 ? '600' : '400',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 133, 219, 0.05)',
                                        borderColor: theme.palette.primary.main,
                                        color: theme.palette.primary.main,
                                    },
                                    '&.Mui-selected': {
                                        color: theme.palette.primary.main,
                                    },
                                }}
                            />
                        ))}
                    </Tabs>
                </Box>

                <Box sx={{ height: 700, width: '100%' }}>
                    <DataGrid
                        rows={articles}
                        columns={columns}
                        getRowId={(row) => row._id}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 25, 50]}
                        loading={loading}
                        rowHeight={80}
                        checkboxSelection
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setRowSelectionModel(newRowSelectionModel);
                        }}
                        rowSelectionModel={rowSelectionModel}
                        disableRowSelectionOnClick
                        sx={{
                            '& .MuiDataGrid-cell': {
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                display: 'flex',
                                alignItems: 'center',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: theme.palette.grey[100],
                                borderBottom: `2px solid ${theme.palette.divider}`,
                            },
                        }}
                    />
                </Box>
            </ParentCard>
            <ToastContainer position="top-right" autoClose={3000} />
        </PageContainer>
    );
};

export default KnowledgeBase;

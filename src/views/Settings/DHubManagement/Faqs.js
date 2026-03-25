import React, { useState, useEffect } from 'react';
import {
    Button,
    Box,
    Grid,
    Typography,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    FormControl,
    MenuItem,
    Select,
    Chip,
} from '@mui/material';
import axios from 'axios';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';

const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/globalsettings', title: 'Settings' },
    { to: '/policies-management/applications', title: 'Policies Management' },
    { title: 'FAQs Management' },
];

const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || '';
};

const DHUB_BASE_URL = 'http://192.168.0.5:5013/v1/dhubApi/admin/dhub-management';

const FaqsManagement = () => {
    const [applications, setApplications] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedApp, setSelectedApp] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentFaq, setCurrentFaq] = useState(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        status: 'active',
    });

    const token = getAuthToken();

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        if (selectedApp) {
            fetchFaqs();
        } else {
            setFaqs([]);
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

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${DHUB_BASE_URL}/faqs/${selectedApp}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('FAQs API Response:', response.data);
            // API returns FAQs array directly in response.data.data
            const faqsData = response.data.data || response.data.faqs || [];
            console.log('FAQs data:', faqsData);
            setFaqs(faqsData);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            toast.error(error.response?.data?.message || 'Failed to load FAQs');
            setFaqs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (faq = null) => {
        if (faq) {
            setEditMode(true);
            setCurrentFaq(faq);
            setFormData({
                question: faq.question,
                answer: faq.answer,
                status: faq.status,
            });
        } else {
            setEditMode(false);
            setCurrentFaq(null);
            setFormData({
                question: '',
                answer: '',
                status: 'active',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditMode(false);
        setCurrentFaq(null);
        setFormData({
            question: '',
            answer: '',
            status: 'active',
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!selectedApp) {
            toast.error('Please select an application');
            return;
        }

        if (!formData.question.trim() || !formData.answer.trim()) {
            toast.error('Question and Answer are required');
            return;
        }

        try {
            setLoading(true);
            if (editMode) {
                await axios.put(`${DHUB_BASE_URL}/faqs/${currentFaq._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('FAQ updated successfully');
            } else {
                await axios.post(
                    `${DHUB_BASE_URL}/faqs`,
                    {
                        applicationId: selectedApp,
                        ...formData,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                toast.success('FAQ created successfully');
            }
            handleCloseDialog();
            fetchFaqs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`${DHUB_BASE_URL}/faqs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('FAQ deleted successfully');
            fetchFaqs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete FAQ');
        } finally {
            setLoading(false);
        }
    };

    const selectedAppData = applications.find((app) => app._id === selectedApp);

    return (
        <PageContainer title="FAQs Management" description="Manage Frequently Asked Questions">
            <Breadcrumb title="FAQs Management" items={BCrumb} />
            <ParentCard title="FAQs Management">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
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
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<IconPlus />}
                                onClick={() => handleOpenDialog()}
                                disabled={loading || !selectedApp}
                            >
                                Add FAQ
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {selectedApp && (
                    <Box sx={{ mt: 3 }}>
                        {loading && faqs.length === 0 ? (
                            <Box display="flex" justifyContent="center" my={4}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width="5%">
                                                <strong>S.No</strong>
                                            </TableCell>
                                            <TableCell width="30%">
                                                <strong>Question</strong>
                                            </TableCell>
                                            <TableCell width="45%">
                                                <strong>Answer</strong>
                                            </TableCell>
                                            <TableCell width="10%">
                                                <strong>Status</strong>
                                            </TableCell>
                                            <TableCell width="10%" align="right">
                                                <strong>Actions</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {faqs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    No FAQs found. Click "Add FAQ" to create one.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            faqs.map((faq, index) => (
                                                <TableRow key={faq._id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight="500">
                                                            {faq.question}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                maxWidth: 500,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                            }}
                                                        >
                                                            {faq.answer}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={faq.status}
                                                            color={faq.status === 'active' ? 'success' : 'default'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleOpenDialog(faq)}
                                                            size="small"
                                                        >
                                                            <IconEdit />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDelete(faq._id)}
                                                            size="small"
                                                        >
                                                            <IconTrash />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                )}

                {!selectedApp && (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            color: 'text.secondary',
                            mt: 3,
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            No Application Selected
                        </Typography>
                        <Typography variant="body2">
                            Please select an application from the dropdown above to manage its FAQs.
                        </Typography>
                    </Box>
                )}

                {/* Add/Edit Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>{editMode ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <CustomFormLabel htmlFor="question" required>
                                    Question
                                </CustomFormLabel>
                                <CustomTextField
                                    id="question"
                                    name="question"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    placeholder="Enter question"
                                    value={formData.question}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomFormLabel htmlFor="answer" required>
                                    Answer
                                </CustomFormLabel>
                                <CustomTextField
                                    id="answer"
                                    name="answer"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={6}
                                    placeholder="Enter answer"
                                    value={formData.answer}
                                    onChange={handleChange}
                                    required
                                />
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
                                    >
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? 'Saving...' : editMode ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </ParentCard>
            <ToastContainer />
        </PageContainer>
    );
};

export default FaqsManagement;


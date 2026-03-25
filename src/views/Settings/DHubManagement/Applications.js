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
    Switch,
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
    { title: 'Applications Management' },
];

const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || '';
};

const DHUB_BASE_URL = 'http://192.168.0.5:5013/v1/dhubApi/admin/dhub-management';

const ApplicationsManagement = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentApp, setCurrentApp] = useState(null);
    const [formData, setFormData] = useState({
        applicationName: '',
        applicationType: 'customer app',
        status: 'active',
    });

    const token = getAuthToken();

    const applicationTypes = [
        'customer app',
        'service app',
        'admin panel',
    ];

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${DHUB_BASE_URL}/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('API Response:', response.data); // Debug log
            // API returns applications array directly in response.data.data
            const appsData = response.data.data || response.data.applications || [];
            console.log('Applications data:', appsData); // Debug log
            setApplications(appsData);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error(error.response?.data?.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (app = null) => {
        if (app) {
            setEditMode(true);
            setCurrentApp(app);
            setFormData({
                applicationName: app.applicationName,
                applicationType: app.applicationType,
                status: app.status,
            });
        } else {
            setEditMode(false);
            setCurrentApp(null);
            setFormData({
                applicationName: '',
                applicationType: 'customer app',
                status: 'active',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditMode(false);
        setCurrentApp(null);
        setFormData({
            applicationName: '',
            applicationType: 'customer app',
            status: 'active',
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.applicationName.trim()) {
            toast.error('Application name is required');
            return;
        }

        try {
            setLoading(true);
            if (editMode) {
                await axios.put(
                    `${DHUB_BASE_URL}/applications/${currentApp._id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                toast.success('Application updated successfully');
            } else {
                await axios.post(`${DHUB_BASE_URL}/applications`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Application created successfully');
            }
            handleCloseDialog();
            fetchApplications();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        console.log('handleDelete called with id:', id);
        console.log('Proceeding with delete for ID:', id);

        try {
            setLoading(true);
            console.log('Making DELETE request to:', `${DHUB_BASE_URL}/applications/${id}`);
            const response = await axios.delete(`${DHUB_BASE_URL}/applications/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Delete response:', response.data);
            toast.success('Application deleted successfully');
            fetchApplications();
        } catch (error) {
            console.error('Delete error:', error);
            console.error('Delete error response:', error.response);
            toast.error(error.response?.data?.message || 'Failed to delete application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer title="Applications Management" description="Manage Application Types">
            <Breadcrumb title="Applications Management" items={BCrumb} />
            <ParentCard title="Applications Management">
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<IconPlus />}
                        onClick={() => handleOpenDialog()}
                        disabled={loading}
                    >
                        Add Application
                    </Button>
                </Box>

                {loading && applications.length === 0 ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>S.No</strong></TableCell>
                                    <TableCell><strong>Application Name</strong></TableCell>
                                    <TableCell><strong>Application Type</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell align="right"><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {applications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No applications found. Click "Add Application" to create one.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    applications.map((app, index) => (
                                        <TableRow key={app._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{app.applicationName}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={app.applicationType}
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={app.status}
                                                    color={app.status === 'active' ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => {
                                                        console.log('Edit clicked for:', app);
                                                        handleOpenDialog(app);
                                                    }}
                                                    size="small"
                                                >
                                                    <IconEdit />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={(e) => {
                                                        console.log('Delete button clicked!', app._id);
                                                        e.stopPropagation();
                                                        handleDelete(app._id);
                                                    }}
                                                    size="small"
                                                    disabled={loading}
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

                {/* Add/Edit Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>{editMode ? 'Edit Application' : 'Add Application'}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <CustomFormLabel htmlFor="applicationName" required>
                                    Application Name
                                </CustomFormLabel>
                                <CustomTextField
                                    id="applicationName"
                                    name="applicationName"
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Enter application name"
                                    value={formData.applicationName}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomFormLabel htmlFor="applicationType" required>
                                    Application Type
                                </CustomFormLabel>
                                <FormControl fullWidth>
                                    <Select
                                        id="applicationType"
                                        name="applicationType"
                                        value={formData.applicationType}
                                        onChange={handleChange}
                                    >
                                        {applicationTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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

export default ApplicationsManagement;


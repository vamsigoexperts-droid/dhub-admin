import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Button,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Avatar,
    Tab,
    Tabs,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { IconEdit, IconTrash, IconPlus, IconSettings } from '@tabler/icons-react';
import { URLS } from 'src/Url';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from 'src/components/shared/ParentCard';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Website Management' },
    { title: 'Spa & Salon Hero CMS' },
];

const SpaHeroCMS = () => {
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(false);

    // Settings State
    const [settings, setSettings] = useState({
        mainTitle: '',
        subTitle: '',
        buttonText: '',
        happyClients: '',
        expertStaff: '',
        avgRating: '',
        status: 'active',
    });

    // Services State
    const [services, setServices] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [serviceForm, setServiceForm] = useState({
        name: '',
        rating: '5.0',
        status: 'active',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const getToken = useCallback(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user)?.token : '';
    }, []);

    const fetchSettings = useCallback(async () => {
        try {
            const res = await axios.get(URLS.GetSpaHeroSettings);
            if (res.data.success) {
                setSettings(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchServices = useCallback(async () => {
        try {
            const res = await axios.get(URLS.ListSpaHeroServices);
            if (res.data.success) {
                setServices(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
        fetchServices();
    }, [fetchSettings, fetchServices]);

    const handleSettingsChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const saveSettings = async () => {
        setLoading(true);
        try {
            const res = await axios.put(URLS.UpdateSpaHeroSettings, settings, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.data.success) {
                toast.success('Settings updated successfully');
            }
        } catch (err) {
            toast.error('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (service = null) => {
        if (service) {
            setEditingService(service);
            setServiceForm({
                name: service.name,
                rating: service.rating,
                status: service.status,
            });
            setImagePreview(service.image ? `${URLS.FileBase}${service.image}` : null);
        } else {
            setEditingService(null);
            setServiceForm({ name: '', rating: '5.0', status: 'active' });
            setImagePreview(null);
        }
        setImageFile(null);
        setOpenDialog(true);
    };

    const handleServiceSubmit = async () => {
        if (!serviceForm.name) return toast.error('Name is required');

        const formData = new FormData();
        formData.append('name', serviceForm.name);
        formData.append('rating', serviceForm.rating);
        formData.append('status', serviceForm.status);
        if (imageFile) formData.append('image', imageFile);

        setLoading(true);
        try {
            let res;
            if (editingService) {
                res = await axios.put(`${URLS.UpdateSpaHeroService}${editingService._id}`, formData, {
                    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data' },
                });
            } else {
                res = await axios.post(URLS.AddSpaHeroService, formData, {
                    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data' },
                });
            }

            if (res.data.success) {
                toast.success(editingService ? 'Service updated' : 'Service added');
                setOpenDialog(false);
                fetchServices();
            }
        } catch (err) {
            toast.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const res = await axios.delete(`${URLS.DeleteSpaHeroService}${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.data.success) {
                toast.success('Deleted successfully');
                fetchServices();
            }
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    return (
        <PageContainer title="Spa Hero CMS" description="Manage Spa & Salon Hero Section">
            <Breadcrumb title="Spa Hero CMS" items={BCrumb} />
            <ToastContainer />

            <ParentCard title="Spa & Salon Section Management">
                <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
                    <Tab label="Hero section" icon={<IconSettings size={20} />} iconPosition="start" />
                    <Tab label="Highleted popup services" icon={<IconPlus size={20} />} iconPosition="start" />
                </Tabs>

                {tab === 0 && (
                    <Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField label="Main Title" name="mainTitle" value={settings.mainTitle} onChange={handleSettingsChange} fullWidth sx={{ mb: 3 }} />
                                <TextField label="Sub Title" name="subTitle" value={settings.subTitle} onChange={handleSettingsChange} fullWidth multiline rows={2} sx={{ mb: 3 }} />
                                <TextField label="Button Text" name="buttonText" value={settings.buttonText} onChange={handleSettingsChange} fullWidth sx={{ mb: 3 }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}><TextField label="Happy Clients" name="happyClients" value={settings.happyClients} onChange={handleSettingsChange} fullWidth /></Grid>
                                    <Grid item xs={4}><TextField label="Expert Staff" name="expertStaff" value={settings.expertStaff} onChange={handleSettingsChange} fullWidth /></Grid>
                                    <Grid item xs={4}><TextField label="Avg Rating" name="avgRating" value={settings.avgRating} onChange={handleSettingsChange} fullWidth /></Grid>
                                </Grid>
                                <TextField select label="Status" name="status" value={settings.status} onChange={handleSettingsChange} fullWidth sx={{ mt: 3 }}>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Button variant="contained" color="primary" onClick={saveSettings} disabled={loading} sx={{ mt: 3 }}>
                            {loading ? <CircularProgress size={24} /> : 'Save Settings'}
                        </Button>
                    </Box>
                )}

                {tab === 1 && (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Button variant="contained" startIcon={<IconPlus />} onClick={() => handleOpenDialog()}>Add popup service</Button>
                        </Box>
                        <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: 'primary.light' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>S/No</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Icon</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Rating</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Status</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {services.map((row, index) => (
                                        <TableRow key={row._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <Avatar src={`${URLS.FileBase}${row.image}`} variant="rounded" />
                                            </TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.rating}</TableCell>
                                            <TableCell>{row.status}</TableCell>
                                            <TableCell align="right">
                                                <IconButton color="primary" onClick={() => handleOpenDialog(row)}><IconEdit size={20} /></IconButton>
                                                <IconButton color="error" onClick={() => handleDeleteService(row._id)}><IconTrash size={20} /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </ParentCard>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
                <DialogTitle>{editingService ? 'Edit popup service' : 'Add popup service'}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Avatar src={imagePreview} sx={{ width: 80, height: 80, margin: '0 auto', mb: 1 }} variant="rounded" />
                        <input type="file" onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setImageFile(file);
                                setImagePreview(URL.createObjectURL(file));
                            }
                        }} />
                    </Box>
                    <TextField label="Service Name" fullWidth sx={{ mb: 2 }} value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} />
                    <TextField label="Rating" fullWidth sx={{ mb: 2 }} value={serviceForm.rating} onChange={(e) => setServiceForm({ ...serviceForm, rating: e.target.value })} />
                    <TextField select label="Status" fullWidth value={serviceForm.status} onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value })}>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleServiceSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default SpaHeroCMS;

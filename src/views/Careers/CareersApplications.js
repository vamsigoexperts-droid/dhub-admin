import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Typography,
    Drawer,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Divider,
    Avatar,
    Stack,
    InputAdornment,
} from '@mui/material';
import { IconEye, IconFileText, IconSearch, IconFilter, IconPhone, IconMail, IconBriefcase, IconBrandLinkedin } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import axios from 'axios';
import { URLS } from 'src/Url';
import { toast, ToastContainer } from 'react-toastify';
import { format } from 'date-fns';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Careers' },
    { title: 'Job Applications' },
];

const CareersApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const getToken = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user)?.token : '';
    };

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get(URLS.CareersApplications, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data;
            // Check data.data based on provided JSON structure
            const appsList = Array.isArray(data?.data) ? data.data : (Array.isArray(data?.applications) ? data.applications : []);
            setApplications(appsList);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = getToken();
            await axios.put(`${URLS.CareersUpdateApplicationStatus}${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Status updated successfully');

            // Update local state
            setApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app));
            if (selectedApplication && selectedApplication._id === id) {
                setSelectedApplication(prev => ({ ...prev, status }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleView = (app) => {
        setSelectedApplication(app);
        setOpenDrawer(true);
    };

    const filteredApplications = applications.filter((app) => {
        // Use fullName and jobId.title
        const name = app.fullName || '';
        const title = app.jobId?.title || '';

        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Applied': return '#ffb300'; // Light Orange Yellow
            case 'Shortlisted': return '#ed6c02';
            case 'Interview': return '#9c27b0';
            case 'Hired': return '#2e7d32';
            case 'Rejected': return '#d32f2f';
            default: return '#757575';
        }
    };

    return (
        <PageContainer title="Job Applications Tracker" description="Track job applications">
            <Breadcrumb title="Job Applications" items={BCrumb} />
            <ToastContainer />

            <ParentCard title="Applications">
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search Candidate or Job..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconSearch size={20} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: { xs: '100%', md: 300 } }}
                    />
                    <FormControl size="small" sx={{ width: 200 }}>
                        <InputLabel>Status Filter</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status Filter"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="All">All Status</MenuItem>
                            <MenuItem value="Applied">Applied</MenuItem>
                            <MenuItem value="Shortlisted">Shortlisted</MenuItem>
                            <MenuItem value="Interview">Interview</MenuItem>
                            <MenuItem value="Hired">Hired</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ overflow: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>S.No.</TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Candidate Name</TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Job Role</TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Applied Date</TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map((app, index) => (
                                    <TableRow key={app._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar>{app.fullName?.[0]}</Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={600}>{app.fullName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{app.email}</Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{app.jobId?.title || 'N/A'}</TableCell>
                                        <TableCell>{app.appliedAt ? format(new Date(app.appliedAt), 'dd MMM yyyy') : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={app.status}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getStatusColor(app.status),
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleView(app)} color="primary">
                                                <IconEye size={20} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No applications found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </ParentCard>

            <Drawer
                anchor="right"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                PaperProps={{ sx: { width: { xs: '100%', md: 450 }, p: 3 } }}
            >
                {selectedApplication && (
                    <Box>
                        <Typography variant="h5" gutterBottom>Candidate Profile</Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                            <Avatar sx={{ width: 64, height: 64, fontSize: '2rem' }}>{selectedApplication.fullName?.[0]}</Avatar>
                            <Box>
                                <Typography variant="h6">{selectedApplication.fullName}</Typography>
                                <Typography variant="body2" color="text.secondary">Applied for: {selectedApplication.jobId?.title}</Typography>
                            </Box>
                        </Stack>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1 }}>
                                    <IconMail size={18} /> <Typography variant="body2">{selectedApplication.email}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1 }}>
                                    <IconPhone size={18} /> <Typography variant="body2">{selectedApplication.phone}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1 }}>
                                    <IconBriefcase size={18} /> <Typography variant="body2">{selectedApplication.experienceYears} Years Exp</Typography>
                                </Box>
                                {selectedApplication.currentCompany && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                        <Typography variant="body2">Current Company: {selectedApplication.currentCompany}</Typography>
                                    </Box>
                                )}
                                {selectedApplication.linkedinUrl && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                        <IconBrandLinkedin size={18} color="#0077b5" />
                                        <a href={selectedApplication.linkedinUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#0077b5' }}>LinkedIn Profile</a>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" gutterBottom>Resume</Typography>
                            <Button
                                variant="outlined"
                                startIcon={<IconFileText />}
                                fullWidth
                                href={`${URLS.FileBase}${selectedApplication.resumeUrl}`}
                                target="_blank"
                                disabled={!selectedApplication.resumeUrl}
                            >
                                View / Download Resume
                            </Button>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" gutterBottom>Update Status</Typography>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={selectedApplication.status}
                                    onChange={(e) => handleUpdateStatus(selectedApplication._id, e.target.value)}
                                >
                                    <MenuItem value="Applied">Applied</MenuItem>
                                    <MenuItem value="Shortlisted">Shortlisted</MenuItem>
                                    <MenuItem value="Interview">Interview</MenuItem>
                                    <MenuItem value="Hired">Hired</MenuItem>
                                    <MenuItem value="Rejected">Rejected</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                )}
            </Drawer>
        </PageContainer>
    );
};

export default CareersApplications;

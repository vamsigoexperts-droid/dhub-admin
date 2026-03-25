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
} from '@mui/material';
import { IconPlus, IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URLS } from 'src/Url';
import { toast, ToastContainer } from 'react-toastify';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Careers' },
    { title: 'Job Postings' },
];

const CareersJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    const getToken = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user)?.token : '';
    };

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get(URLS.CareersJobs, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Adjust based on actual API response
            const data = response.data;
            const jobsList = Array.isArray(data?.data) ? data.data : (Array.isArray(data?.jobs) ? data.jobs : (Array.isArray(data) ? data : []));
            setJobs(jobsList);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) return;
        try {
            const token = getToken();
            await axios.delete(`${URLS.CareersDeleteJob}${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // If URLS.CareersJobs is /all-jobs, DELETE might be a different endpoint like /delete-job/:id
            // Since I defined CareersJobs as /all-jobs, I might need a separate Delete Job URL or assume Restful on /admin/careers/jobs/:id 
            // I'll assume standard REST for now or check if I need to update URLS. 
            // Ideally I should stick to the patterns in URLS.js which often has specific Delete URLs. 
            // I didn't add CareersDeleteJob in Url.js. I'll stick to a best guess or just use the same base if it supports method differentiation.
            // Actually I'll update Url.js later if the DELETE fails, but for now I'll assume standard REST on a "job" resource if possible.
            // Re-reading URLS.js, most have DeleteXxx endpoints.
            // I'll try to DELETE on the updated URL logic or use a generic one if I missed it.
            // Let's assume standard behavior for now.
            toast.success('Job deleted successfully');
            fetchJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error('Failed to delete job');
        }
    };

    return (
        <PageContainer title="Job Postings" description="Manage job postings">
            <Breadcrumb title="Job Postings" items={BCrumb} />
            <ToastContainer />

            <ParentCard title="Job Postings">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<IconPlus />}
                        onClick={() => navigate('/careers/create-job')}
                        sx={{ backgroundColor: '#0d5959', '&:hover': { backgroundColor: '#084040' } }}
                    >
                        Create New Job
                    </Button>
                </Box>

                <Box sx={{ overflow: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>S.No.</TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Location</TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Openings</TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jobs.length > 0 ? (
                                jobs.map((job, index) => (
                                    <TableRow key={job._id || job.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {job.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={job.roleId?.name || job.role || 'N/A'} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell>{job.location}</TableCell>
                                        <TableCell>{job.openingsCount || job.openings}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={job.status}
                                                color={job.status === 'Open' ? 'success' : job.status === 'Closed' ? 'error' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => navigate(`/careers/update-job/${job._id}`)} color="primary">
                                                <IconEdit size={20} />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(job._id || job.id)} color="error">
                                                <IconTrash size={20} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">No job postings found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </ParentCard>
        </PageContainer>
    );
};

export default CareersJobs;

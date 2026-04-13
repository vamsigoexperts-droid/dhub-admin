import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    MenuItem,
    Typography,
    IconButton,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { URLS } from 'src/Url';
import { toast, ToastContainer } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomCKEditor from '../../components/theme-elements/CustomCKEditor';

const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/careers/jobs', title: 'Job Postings' },
    { title: 'Create Job' },
];

const CreateJob = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // For Edit Mode
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        roleId: '', // ID from Roles API
        department: '',
        location: '',
        employmentType: 'Full-time',
        experienceLevel: '',
        description: '',
        responsibilities: [''],
        requirements: [''],
        skills: [''],
        minSalary: '',
        maxSalary: '',
        currency: 'INR',
        openings: 1,
        status: 'Open',
        expiryDate: '',
    });

    const getToken = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user)?.token : '';
    };

    useEffect(() => {
        fetchRoles();
        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    const fetchRoles = async () => {
        try {
            const token = getToken();
            console.log('Fetching roles from:', URLS.CareersRoles);
            const response = await axios.get(URLS.CareersRoles, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Roles API Response:', response.data);
            const data = response.data;

            // Check for roles array in different possible locations or default to empty array
            const rolesList = Array.isArray(data?.data)
                ? data.data
                : (Array.isArray(data?.roles)
                    ? data.roles
                    : (Array.isArray(data) ? data : []));

            console.log('Extracted roles list:', rolesList);
            setRoles(rolesList);

            if (rolesList.length === 0) {
                toast.warning('No roles found. Please add roles first in the Careers > Job Roles section.');
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            console.error('Error response:', error.response?.data);
            toast.error('Failed to fetch roles: ' + (error.response?.data?.message || error.message));
            setRoles([]); // Fallback to empty array on error
        }
    };

    const fetchJobDetails = async () => {
        if (!id) return;

        try {
            const token = getToken();
            console.log('Fetching job details for ID:', id);

            const response = await axios.get(`${URLS.CareersGetJob}${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Job details response:', response.data);
            const jobData = response.data?.data || response.data;

            if (jobData) {
                setFormData({
                    title: jobData.title || '',
                    roleId: jobData.roleId?._id || jobData.roleId || '',
                    department: jobData.department || '',
                    location: jobData.location || '',
                    employmentType: jobData.employmentType || 'Full-time',
                    experienceLevel: jobData.experienceLevel || '',
                    description: jobData.description || '',
                    responsibilities: jobData.responsibilities?.length > 0 ? jobData.responsibilities : [''],
                    requirements: jobData.requirements?.length > 0 ? jobData.requirements : [''],
                    skills: jobData.skills?.length > 0 ? jobData.skills : [''],
                    minSalary: jobData.salaryRangeMin || jobData.minSalary || '',
                    maxSalary: jobData.salaryRangeMax || jobData.maxSalary || '',
                    currency: jobData.currency || 'INR',
                    openings: jobData.openingsCount || jobData.openings || 1,
                    status: jobData.status || 'Open',
                    expiryDate: jobData.expiryDate ? jobData.expiryDate.split('T')[0] : '',
                });
                console.log('Form data populated successfully');
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
            console.error('Error response:', error.response?.data);
            toast.error('Failed to load job details: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setFormData((prev) => ({ ...prev, description: data }));
    };

    // Dynamic Fields Helpers
    const handleDynamicChange = (index, value, field) => {
        const list = [...formData[field]];
        list[index] = value;
        setFormData((prev) => ({ ...prev, [field]: list }));
    };

    const addDynamicField = (field) => {
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeDynamicField = (index, field) => {
        const list = [...formData[field]];
        list.splice(index, 1);
        setFormData((prev) => ({ ...prev, [field]: list }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = getToken();
            const payload = { ...formData };

            if (id) {
                // Edit logic
                await axios.put(`${URLS.CareersUpdateJob}${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Job updated successfully');
            } else {
                // Create logic
                await axios.post(URLS.CareersCreateJob, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Job created successfully');
            }
            navigate('/careers/jobs');
        } catch (error) {
            console.error('Submit Error:', error);
            toast.error('Failed to save job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer title={id ? "Edit Job" : "Create New Job"} description="Create or edit a job posting">
            <Breadcrumb title={id ? "Edit Job" : "Create Job"} items={BCrumb} />
            <ToastContainer />

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Basic Info */}
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="#0d5959">Basic Information</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Job Title"
                                            name="title"
                                            fullWidth
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Role</InputLabel>
                                            <Select
                                                label="Role"
                                                name="roleId"
                                                value={formData.roleId}
                                                onChange={handleChange}
                                                required
                                            >
                                                {Array.isArray(roles) && roles.length > 0 ? (
                                                    roles.map((role) => (
                                                        <MenuItem key={role._id} value={role._id}>{role.name}</MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem value="" disabled>
                                                        No roles available - Please add roles in Careers → Job Roles
                                                    </MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Department"
                                            name="department"
                                            fullWidth
                                            value={formData.department}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Location"
                                            name="location"
                                            fullWidth
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Job Details */}
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="#0d5959">Job Details</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Employment Type</InputLabel>
                                            <Select
                                                label="Employment Type"
                                                name="employmentType"
                                                value={formData.employmentType}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="Full-time">Full-time</MenuItem>
                                                <MenuItem value="Part-time">Part-time</MenuItem>
                                                <MenuItem value="Contract">Contract</MenuItem>
                                                <MenuItem value="Internship">Internship</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Experience Level (e.g. 2-5 Years)"
                                            name="experienceLevel"
                                            fullWidth
                                            value={formData.experienceLevel}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" gutterBottom>Job Description</Typography>
                                        <CKEditor
                                            editor={CustomCKEditor}
                                            data={formData.description}
                                            onChange={handleEditorChange}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Dynamic Lists: Responsibilities */}
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" color="#0d5959">Responsibilities</Typography>
                                    <Button startIcon={<IconPlus />} size="small" onClick={() => addDynamicField('responsibilities')}>Add</Button>
                                </Box>
                                {formData.responsibilities.map((req, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <TextField
                                            placeholder={`Responsibility ${index + 1}`}
                                            fullWidth
                                            size="small"
                                            value={req}
                                            onChange={(e) => handleDynamicChange(index, e.target.value, 'responsibilities')}
                                        />
                                        <IconButton onClick={() => removeDynamicField(index, 'responsibilities')} color="error">
                                            <IconTrash size={18} />
                                        </IconButton>
                                    </Box>
                                ))}

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 4 }}>
                                    <Typography variant="h6" color="#0d5959">Requirements</Typography>
                                    <Button startIcon={<IconPlus />} size="small" onClick={() => addDynamicField('requirements')}>Add</Button>
                                </Box>
                                {formData.requirements.map((req, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <TextField
                                            placeholder={`Requirement ${index + 1}`}
                                            fullWidth
                                            size="small"
                                            value={req}
                                            onChange={(e) => handleDynamicChange(index, e.target.value, 'requirements')}
                                        />
                                        <IconButton onClick={() => removeDynamicField(index, 'requirements')} color="error">
                                            <IconTrash size={18} />
                                        </IconButton>
                                    </Box>
                                ))}

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 4 }}>
                                    <Typography variant="h6" color="#0d5959">Skills</Typography>
                                    <Button startIcon={<IconPlus />} size="small" onClick={() => addDynamicField('skills')}>Add</Button>
                                </Box>
                                {formData.skills.map((req, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <TextField
                                            placeholder={`Skill ${index + 1}`}
                                            fullWidth
                                            size="small"
                                            value={req}
                                            onChange={(e) => handleDynamicChange(index, e.target.value, 'skills')}
                                        />
                                        <IconButton onClick={() => removeDynamicField(index, 'skills')} color="error">
                                            <IconTrash size={18} />
                                        </IconButton>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Compensation & Settings */}
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="#0d5959">Compensation & Settings</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <TextField label="Min Salary" name="minSalary" fullWidth type="number" value={formData.minSalary} onChange={handleChange} />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField label="Max Salary" name="maxSalary" fullWidth type="number" value={formData.maxSalary} onChange={handleChange} />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField label="Currency" name="currency" fullWidth value={formData.currency} onChange={handleChange} />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField label="Opening Count" name="openings" fullWidth type="number" value={formData.openings} onChange={handleChange} />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select label="Status" name="status" value={formData.status} onChange={handleChange}>
                                                <MenuItem value="Open">Open</MenuItem>
                                                <MenuItem value="Closed">Closed</MenuItem>
                                                <MenuItem value="Draft">Draft</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField label="Expiry Date" name="expiryDate" fullWidth type="date" InputLabelProps={{ shrink: true }} value={formData.expiryDate} onChange={handleChange} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button variant="outlined" onClick={() => navigate('/careers/jobs')}>Cancel</Button>
                            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0d5959', '&:hover': { backgroundColor: '#084040' } }}>{id ? 'Update Job' : 'Create Job'}</Button>
                        </Box>
                    </Grid>

                </Grid>
            </form>
        </PageContainer>
    );
};

export default CreateJob;

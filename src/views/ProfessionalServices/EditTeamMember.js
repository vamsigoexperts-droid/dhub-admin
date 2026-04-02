import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Paper,
    Box,
    Typography,
    Button,
    Grid,
    Divider,
    MenuItem,
    Select,
    FormControl,
    Chip,
    OutlinedInput,
    Avatar,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { IconArrowLeft, IconUpload, IconX } from '@tabler/icons-react';
import { getTeamMemberById, updateTeamMember } from '../../services/teamService';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EditTeamMember = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const providerId = searchParams.get('providerId') || localStorage.getItem('ProfessionalProviderId');
    const providerName = localStorage.getItem('ProfessionalProviderName') || 'Provider';

    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        whatsappNumber: '',
        designation: '',
        work_experience: '',
        projects_done: '',
        skills: [],
        specialization: '',
        employmentType: 'full_time',
        joiningDate: null,
        bio: '',
        languages: [],
        salaryType: 'monthly',
        salaryAmount: '',
        emergencyContactName: '',
        emergencyContactRelationship: '',
        emergencyContactPhone: '',
        status: 'active',
        isAvailable: true,
        notes: '',
        profile_image: null,
    });

    const BCrumb = [
        { to: '/', title: 'Home' },
        { to: '/AllprofessionalProviders', title: 'Professional Providers' },
        { to: `/team-management?providerId=${providerId}`, title: `Team - ${providerName}` },
        { title: 'Edit Team Member' },
    ];

    const employmentTypes = [
        { value: 'full_time', label: 'Full Time' },
        { value: 'part_time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'freelance', label: 'Freelance' },
    ];

    const salaryTypes = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'daily', label: 'Daily' },
        { value: 'hourly', label: 'Hourly' },
        { value: 'project_based', label: 'Project Based' },
    ];

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'on_leave', label: 'On Leave' },
        { value: 'terminated', label: 'Terminated' },
    ];

    const commonSkills = [
        'Plumbing',
        'Electrical',
        'Carpentry',
        'Painting',
        'AC Repair',
        'Appliance Repair',
        'Cleaning',
        'Pest Control',
        'Hair Styling',
        'Massage Therapy',
        'Nail Art',
        'Makeup',
        'Spa Services',
    ];

    const commonLanguages = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Bengali'];

    // Fetch team member data
    useEffect(() => {
        const fetchTeamMember = async () => {
            if (!id || !providerId) {
                toast.error('Invalid team member or provider ID');
                navigate(`/team-management?providerId=${providerId}`);
                return;
            }

            setFetchingData(true);
            try {
                const response = await getTeamMemberById(id, providerId);

                if (response.success && response.data) {
                    const member = response.data;

                    setFormData({
                        name: member.name || '',
                        phone: member.phone || '',
                        email: member.email || '',
                        whatsappNumber: member.whatsappNumber || '',
                        designation: member.designation || '',
                        work_experience: member.work_experience || '',
                        projects_done: member.projects_done || '',
                        skills: member.skills || [],
                        specialization: member.specialization || '',
                        employmentType: member.employmentType || 'full_time',
                        joiningDate: member.joiningDate ? new Date(member.joiningDate) : null,
                        bio: member.bio || '',
                        languages: member.languages || [],
                        salaryType: member.salaryType || 'monthly',
                        salaryAmount: member.salaryAmount || '',
                        emergencyContactName: member.emergencyContactName || '',
                        emergencyContactRelationship: member.emergencyContactRelationship || '',
                        emergencyContactPhone: member.emergencyContactPhone || '',
                        status: member.status || 'active',
                        isAvailable: member.isAvailable !== undefined ? member.isAvailable : true,
                        notes: member.notes || '',
                        profile_image: null, // Will be set if user uploads new image
                    });

                    // Set image preview if exists
                    if (member.profile_image) {
                        setImagePreview(`https://api.doorstephub.com/${member.profile_image}`);
                    }
                } else {
                    toast.error(response.message || 'Failed to fetch team member details');
                    navigate(`/team-management?providerId=${providerId}`);
                }
            } catch (error) {
                const message = error.message || 'An error occurred while fetching team member details';
                toast.error(message);
                navigate(`/team-management?providerId=${providerId}`);
            } finally {
                setFetchingData(false);
            }
        };

        fetchTeamMember();
    }, [id, providerId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSkillsChange = (event) => {
        const {
            target: { value },
        } = event;
        setFormData((prev) => ({
            ...prev,
            skills: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleLanguagesChange = (event) => {
        const {
            target: { value },
        } = event;
        setFormData((prev) => ({
            ...prev,
            languages: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setFormData((prev) => ({ ...prev, profile_image: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, profile_image: null }));
        setImagePreview(null);
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return false;
        }

        if (!formData.phone.trim()) {
            toast.error('Phone number is required');
            return false;
        }

        if (!/^\d{10}$/.test(formData.phone)) {
            toast.error('Phone number must be 10 digits');
            return false;
        }

        if (!formData.email.trim()) {
            toast.error('Email is required');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        if (!formData.designation.trim()) {
            toast.error('Designation is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!providerId || !id) {
            toast.error('Provider ID or Team Member ID is missing');
            return;
        }

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                joiningDate: formData.joiningDate
                    ? new Date(formData.joiningDate).toISOString().split('T')[0]
                    : null,
            };

            const response = await updateTeamMember(id, providerId, submitData);

            if (response.success) {
                toast.success(response.message || 'Team member updated successfully');
                setTimeout(() => {
                    navigate(`/team-management?providerId=${providerId}`);
                }, 1500);
            } else {
                toast.error(response.message || 'Failed to update team member');
            }
        } catch (error) {
            const message = error.message || 'An error occurred while updating team member';
            toast.error(message);
            console.error('Failed to update team member:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(`/team-management?providerId=${providerId}`);
    };

    if (fetchingData) {
        return (
            <PageContainer title="Edit Team Member" description="Edit team member details">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Edit Team Member" description="Edit team member details">
            <Breadcrumb title="Edit Team Member" items={BCrumb} />
            <ToastContainer position="top-right" autoClose={3000} />

            <Paper variant="outlined" sx={{ mt: 3, p: 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<IconArrowLeft size={18} />}
                        onClick={handleCancel}
                    >
                        Back
                    </Button>
                    <Typography variant="h5">Edit Team Member</Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit}>
                    {/* Profile Image Upload */}
                    <Box mb={4}>
                        <Typography variant="h6" gutterBottom>
                            Profile Image
                        </Typography>
                        <Box display="flex" alignItems="center" gap={3}>
                            <Avatar src={imagePreview} sx={{ width: 100, height: 100 }}>
                                {formData.name?.charAt(0) || 'T'}
                            </Avatar>
                            <Box>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="profile-image-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="profile-image-upload">
                                    <Button variant="outlined" component="span" startIcon={<IconUpload size={18} />}>
                                        {imagePreview ? 'Change Image' : 'Upload Image'}
                                    </Button>
                                </label>
                                {imagePreview && (
                                    <IconButton color="error" onClick={handleRemoveImage} sx={{ ml: 1 }}>
                                        <IconX size={18} />
                                    </IconButton>
                                )}
                                <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                                    Max file size: 5MB. Supported formats: JPG, PNG
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Personal Information */}
                    <Typography variant="h6" gutterBottom>
                        Personal Information
                    </Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="name">Name *</CustomFormLabel>
                            <CustomTextField
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="phone">Phone *</CustomFormLabel>
                            <CustomTextField
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="10-digit phone number"
                                fullWidth
                                required
                                inputProps={{ maxLength: 10 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="email">Email *</CustomFormLabel>
                            <CustomTextField
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="email@example.com"
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="whatsappNumber">WhatsApp Number</CustomFormLabel>
                            <CustomTextField
                                id="whatsappNumber"
                                name="whatsappNumber"
                                value={formData.whatsappNumber}
                                onChange={handleInputChange}
                                placeholder="10-digit WhatsApp number"
                                fullWidth
                                inputProps={{ maxLength: 10 }}
                            />
                        </Grid>
                    </Grid>

                    {/* Professional Details */}
                    <Typography variant="h6" gutterBottom>
                        Professional Details
                    </Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="designation">Designation *</CustomFormLabel>
                            <CustomTextField
                                id="designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleInputChange}
                                placeholder="e.g., Senior Technician"
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <CustomFormLabel htmlFor="work_experience">Work Experience (Years)</CustomFormLabel>
                            <CustomTextField
                                id="work_experience"
                                name="work_experience"
                                type="number"
                                value={formData.work_experience}
                                onChange={handleInputChange}
                                placeholder="Years"
                                fullWidth
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <CustomFormLabel htmlFor="projects_done">Projects Done</CustomFormLabel>
                            <CustomTextField
                                id="projects_done"
                                name="projects_done"
                                type="number"
                                value={formData.projects_done}
                                onChange={handleInputChange}
                                placeholder="Number"
                                fullWidth
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        {/* <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="skills">Skills</CustomFormLabel>
                            <FormControl fullWidth>
                                <Select
                                    id="skills"
                                    multiple
                                    value={formData.skills}
                                    onChange={handleSkillsChange}
                                    input={<OutlinedInput />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {commonSkills.map((skill) => (
                                        <MenuItem key={skill} value={skill}>
                                            {skill}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid> */}

                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="specialization">Specialization</CustomFormLabel>
                            <CustomTextField
                                id="specialization"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleInputChange}
                                placeholder="e.g., Home Repairs"
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="languages">Languages</CustomFormLabel>
                            <FormControl fullWidth>
                                <Select
                                    id="languages"
                                    multiple
                                    value={formData.languages}
                                    onChange={handleLanguagesChange}
                                    input={<OutlinedInput />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {commonLanguages.map((language) => (
                                        <MenuItem key={language} value={language}>
                                            {language}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <CustomFormLabel htmlFor="bio">Bio</CustomFormLabel>
                            <CustomTextField
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Brief description about the team member"
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>

                    {/* Employment Information */}
                    <Typography variant="h6" gutterBottom>
                        Employment Information
                    </Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="employmentType">Employment Type *</CustomFormLabel>
                            <FormControl fullWidth>
                                <Select
                                    id="employmentType"
                                    name="employmentType"
                                    value={formData.employmentType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {employmentTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="joiningDate">Joining Date *</CustomFormLabel>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={formData.joiningDate}
                                    onChange={(newValue) => {
                                        setFormData((prev) => ({ ...prev, joiningDate: newValue }));
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="salaryType">Salary Type</CustomFormLabel>
                            <FormControl fullWidth>
                                <Select
                                    id="salaryType"
                                    name="salaryType"
                                    value={formData.salaryType}
                                    onChange={handleInputChange}
                                >
                                    {salaryTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="salaryAmount">Salary Amount</CustomFormLabel>
                            <CustomTextField
                                id="salaryAmount"
                                name="salaryAmount"
                                type="number"
                                value={formData.salaryAmount}
                                onChange={handleInputChange}
                                placeholder="Amount in INR"
                                fullWidth
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                    </Grid>

                    {/* Status and Availability */}
                    <Typography variant="h6" gutterBottom>
                        Status & Availability
                    </Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="status">Status</CustomFormLabel>
                            <FormControl fullWidth>
                                <Select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="isAvailable">Availability</CustomFormLabel>
                            <FormControl fullWidth>
                                <Select
                                    id="isAvailable"
                                    name="isAvailable"
                                    value={formData.isAvailable}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, isAvailable: e.target.value === 'true' }))
                                    }
                                >
                                    <MenuItem value={true}>Available</MenuItem>
                                    <MenuItem value={false}>Unavailable</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <CustomFormLabel htmlFor="notes">Admin Notes</CustomFormLabel>
                            <CustomTextField
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Internal notes about this team member"
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>

                    {/* Emergency Contact */}
                    <Typography variant="h6" gutterBottom>
                        Emergency Contact
                    </Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={4}>
                            <CustomFormLabel htmlFor="emergencyContactName">Contact Name</CustomFormLabel>
                            <CustomTextField
                                id="emergencyContactName"
                                name="emergencyContactName"
                                value={formData.emergencyContactName}
                                onChange={handleInputChange}
                                placeholder="Emergency contact name"
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <CustomFormLabel htmlFor="emergencyContactRelationship">Relationship</CustomFormLabel>
                            <CustomTextField
                                id="emergencyContactRelationship"
                                name="emergencyContactRelationship"
                                value={formData.emergencyContactRelationship}
                                onChange={handleInputChange}
                                placeholder="e.g., Spouse, Parent"
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <CustomFormLabel htmlFor="emergencyContactPhone">Contact Phone</CustomFormLabel>
                            <CustomTextField
                                id="emergencyContactPhone"
                                name="emergencyContactPhone"
                                value={formData.emergencyContactPhone}
                                onChange={handleInputChange}
                                placeholder="10-digit phone number"
                                fullWidth
                                inputProps={{ maxLength: 10 }}
                            />
                        </Grid>
                    </Grid>

                    {/* Action Buttons */}
                    <Divider sx={{ my: 3 }} />
                    <Box display="flex" gap={2} justifyContent="flex-end">
                        <Button variant="outlined" color="secondary" onClick={handleCancel} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Team Member'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </PageContainer>
    );
};

export default EditTeamMember;

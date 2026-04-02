import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Paper,
    Box,
    Typography,
    Button,
    Grid,
    Divider,
    Avatar,
    Chip,
    Card,
    CardContent,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import {
    IconArrowLeft,
    IconPhone,
    IconMail,
    IconBriefcase,
    IconCalendar,
    IconCurrencyRupee,
    IconUser,
    IconStar,
    IconChecklist,
    IconClipboardCheck,
} from '@tabler/icons-react';
import { getTeamMemberById } from '../../services/teamService';
import { format } from 'date-fns';

const ViewTeamMember = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const providerId = searchParams.get('providerId') || localStorage.getItem('ProfessionalProviderId');
    const providerName = localStorage.getItem('ProfessionalProviderName') || 'Provider';

    const [loading, setLoading] = useState(true);
    const [teamMember, setTeamMember] = useState(null);

    const BCrumb = [
        { to: '/', title: 'Home' },
        { to: '/AllprofessionalProviders', title: 'Professional Providers' },
        { to: `/team-management?providerId=${providerId}`, title: `Team - ${providerName}` },
        { title: 'View Team Member' },
    ];

    useEffect(() => {
        const fetchTeamMember = async () => {
            if (!id || !providerId) {
                toast.error('Invalid team member or provider ID');
                navigate(`/team-management?providerId=${providerId}`);
                return;
            }

            setLoading(true);
            try {
                const response = await getTeamMemberById(id, providerId);

                if (response.success && response.data) {
                    setTeamMember(response.data);
                } else {
                    toast.error(response.message || 'Failed to fetch team member details');
                    navigate(`/team-management?providerId=${providerId}`);
                }
            } catch (error) {
                const message = error.message || 'An error occurred while fetching team member details';
                toast.error(message);
                navigate(`/team-management?providerId=${providerId}`);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamMember();
    }, [id, providerId, navigate]);

    const handleBack = () => {
        navigate(`/team-management?providerId=${providerId}`);
    };

    const handleEdit = () => {
        navigate(`/edit-team-member/${id}?providerId=${providerId}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'on_leave':
                return 'warning';
            case 'terminated':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'on_leave':
                return 'On Leave';
            case 'terminated':
                return 'Terminated';
            default:
                return 'Unknown';
        }
    };

    const getEmploymentTypeLabel = (type) => {
        const types = {
            full_time: 'Full Time',
            part_time: 'Part Time',
            contract: 'Contract',
            freelance: 'Freelance',
        };
        return types[type] || type;
    };

    const getSalaryTypeLabel = (type) => {
        const types = {
            monthly: 'Monthly',
            daily: 'Daily',
            hourly: 'Hourly',
            project_based: 'Project Based',
        };
        return types[type] || type;
    };

    if (loading) {
        return (
            <PageContainer title="View Team Member" description="View team member details">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (!teamMember) {
        return null;
    }

    return (
        <PageContainer title="View Team Member" description="View team member details">
            <Breadcrumb title="Team Member Details" items={BCrumb} />
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header Section */}
            <Paper variant="outlined" sx={{ mt: 3, p: 3, borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<IconArrowLeft size={18} />}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                    </Box>
                    <Button variant="contained" color="primary" onClick={handleEdit}>
                        Edit Details
                    </Button>
                </Box>

                {/* Profile Header */}
                <Box display="flex" alignItems="center" gap={3} mb={3}>
                    <Avatar
                        src={
                            teamMember.profile_image
                                ? `https://api.doorstephub.com/${teamMember.profile_image}`
                                : undefined
                        }
                        sx={{ width: 120, height: 120 }}
                    >
                        {teamMember.name?.charAt(0) || 'T'}
                    </Avatar>
                    <Box flex={1}>
                        <Typography variant="h4" gutterBottom>
                            {teamMember.name || 'N/A'}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {teamMember.designation || 'N/A'}
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            <Chip
                                label={getStatusLabel(teamMember.status)}
                                color={getStatusColor(teamMember.status)}
                                size="small"
                            />
                            <Chip
                                label={teamMember.isAvailable ? 'Available' : 'Unavailable'}
                                color={teamMember.isAvailable ? 'success' : 'default'}
                                variant="outlined"
                                size="small"
                            />
                            <Chip
                                label={getEmploymentTypeLabel(teamMember.employmentType)}
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Grid container spacing={3} mt={1}>
                {/* Personal Information */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <List dense>
                                <ListItem>
                                    <IconPhone size={20} style={{ marginRight: 12 }} />
                                    <ListItemText primary="Phone" secondary={teamMember.phone || 'N/A'} />
                                </ListItem>
                                <ListItem>
                                    <IconMail size={20} style={{ marginRight: 12 }} />
                                    <ListItemText primary="Email" secondary={teamMember.email || 'N/A'} />
                                </ListItem>
                                <ListItem>
                                    <IconPhone size={20} style={{ marginRight: 12 }} />
                                    <ListItemText
                                        primary="WhatsApp"
                                        secondary={teamMember.whatsappNumber || 'N/A'}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Professional Details */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Professional Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <List dense>
                                <ListItem>
                                    <IconBriefcase size={20} style={{ marginRight: 12 }} />
                                    <ListItemText
                                        primary="Work Experience"
                                        secondary={
                                            teamMember.work_experience
                                                ? `${teamMember.work_experience} years`
                                                : 'N/A'
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <IconChecklist size={20} style={{ marginRight: 12 }} />
                                    <ListItemText
                                        primary="Projects Done"
                                        secondary={teamMember.projects_done || 'N/A'}
                                    />
                                </ListItem>
                                <ListItem>
                                    <IconUser size={20} style={{ marginRight: 12 }} />
                                    <ListItemText
                                        primary="Specialization"
                                        secondary={teamMember.specialization || 'N/A'}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Skills & Languages */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Skills & Languages
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box mb={2}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Skills
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {teamMember.skills && teamMember.skills.length > 0 ? (
                                        teamMember.skills.map((skill, index) => (
                                            <Chip key={index} label={skill} size="small" color="primary" />
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No skills listed
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Languages
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {teamMember.languages && teamMember.languages.length > 0 ? (
                                        teamMember.languages.map((language, index) => (
                                            <Chip key={index} label={language} size="small" color="secondary" />
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No languages listed
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Employment Information */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Employment Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <List dense>
                                <ListItem>
                                    <IconCalendar size={20} style={{ marginRight: 12 }} />
                                    <ListItemText
                                        primary="Joining Date"
                                        secondary={
                                            teamMember.joiningDate
                                                ? format(new Date(teamMember.joiningDate), 'dd MMM yyyy')
                                                : 'N/A'
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <IconCurrencyRupee size={20} style={{ marginRight: 12 }} />
                                    <ListItemText
                                        primary="Salary"
                                        secondary={
                                            teamMember.salaryAmount
                                                ? `ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¹${teamMember.salaryAmount} (${getSalaryTypeLabel(teamMember.salaryType)})`
                                                : 'N/A'
                                        }
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Performance Metrics (if available) */}
                {teamMember.performance && (
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Performance Metrics
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <List dense>
                                    <ListItem>
                                        <IconStar size={20} style={{ marginRight: 12 }} />
                                        <ListItemText
                                            primary="Average Rating"
                                            secondary={
                                                teamMember.performance.averageRating
                                                    ? `${parseFloat(teamMember.performance.averageRating).toFixed(1)} / 5.0`
                                                    : 'N/A'
                                            }
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <IconClipboardCheck size={20} style={{ marginRight: 12 }} />
                                        <ListItemText
                                            primary="Bookings Completed"
                                            secondary={teamMember.performance.totalBookingsCompleted || 0}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <IconChecklist size={20} style={{ marginRight: 12 }} />
                                        <ListItemText
                                            primary="Bookings Assigned"
                                            secondary={teamMember.performance.totalBookingsAssigned || 0}
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Emergency Contact */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Emergency Contact
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <List dense>
                                <ListItem>
                                    <IconUser size={20} style={{ marginRight: 12 }} />
                                    <ListItemText
                                        primary="Contact Name"
                                        secondary={teamMember.emergencyContactName || 'N/A'}
                                    />
                                </ListItem>
                                <ListItem>
                                    <IconUser size={20} style={{ marginRight: 12 }} />
                                    <ListItemText
                                        primary="Relationship"
                                        secondary={teamMember.emergencyContactRelationship || 'N/A'}
                                    />
                                </ListItem>
                                <ListItem>
                                    <IconPhone size={20} style={{ marginRight: 12 }} />
                                    <ListItemText
                                        primary="Contact Phone"
                                        secondary={teamMember.emergencyContactPhone || 'N/A'}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Bio */}
                {teamMember.bio && (
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Bio
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {teamMember.bio}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Admin Notes */}
                {teamMember.notes && (
                    <Grid item xs={12}>
                        <Card variant="outlined" sx={{ bgcolor: 'warning.lighter' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Admin Notes
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {teamMember.notes}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Activity Timeline */}
                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Activity Timeline
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <List dense>
                                {teamMember.logCreatedDate && (
                                    <ListItem>
                                        <ListItemText
                                            primary="Created"
                                            secondary={format(new Date(teamMember.logCreatedDate), 'dd MMM yyyy, hh:mm a')}
                                        />
                                    </ListItem>
                                )}
                                {teamMember.logModifiedDate && (
                                    <ListItem>
                                        <ListItemText
                                            primary="Last Modified"
                                            secondary={format(
                                                new Date(teamMember.logModifiedDate),
                                                'dd MMM yyyy, hh:mm a'
                                            )}
                                        />
                                    </ListItem>
                                )}
                                {teamMember.createdBy && (
                                    <ListItem>
                                        <ListItemText primary="Created By" secondary={`Admin ID: ${teamMember.createdBy}`} />
                                    </ListItem>
                                )}
                                {teamMember.lastModifiedBy && (
                                    <ListItem>
                                        <ListItemText
                                            primary="Last Modified By"
                                            secondary={`Admin ID: ${teamMember.lastModifiedBy}`}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default ViewTeamMember;

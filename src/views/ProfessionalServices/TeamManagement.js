import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconEye,
    IconUserCheck,
    IconUserX,
    IconArrowLeft,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import {
    TextField,
    Avatar,
    Paper,
    Box,
    Typography,
    Divider,
    CardContent,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TeamStatsCard from './components/TeamStatsCard';
import {
    getAllTeamMembers,
    deleteTeamMember,
    updateAvailability,
    getTeamPerformanceStats,
} from '../../services/teamService';

const TeamManagement = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const providerId = searchParams.get('providerId') || localStorage.getItem('ProfessionalProviderId');
    const providerName = localStorage.getItem('ProfessionalProviderName') || 'Provider';

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('active');
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [stats, setStats] = useState(null);

    const authData = JSON.parse(localStorage.getItem('user'));
    const rolesAndPermission = authData?.rolesAndPermission?.[0] || {};

    const BCrumb = [
        { to: '/', title: 'Home' },
        { to: '/AllprofessionalProviders', title: 'Professional Providers' },
        { title: `Team - ${providerName}` },
    ];

    // Fetch team performance stats
    const fetchStats = async () => {
        if (!providerId) return;

        try {
            const response = await getTeamPerformanceStats(providerId);
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch team stats:', error);
        }
    };

    // Fetch team members
    const fetchTeamMembers = async () => {
        if (!providerId) {
            toast.error('Provider ID is missing');
            navigate('/AllprofessionalProviders');
            return;
        }

        setLoading(true);
        try {
            const filters = {
                ...(statusFilter && { status: statusFilter }),
                ...(availabilityFilter && { isAvailable: availabilityFilter }),
                ...(search && { search }),
            };

            const response = await getAllTeamMembers(providerId, filters);

            if (response.success) {
                setData(response.data || []);
            } else {
                toast.error(response.message || 'Failed to fetch team members');
            }
        } catch (error) {
            const message = error.message || 'An error occurred while fetching team members';
            toast.error(message);
            console.error('Failed to fetch team members:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
        fetchStats();
    }, [providerId, statusFilter, availabilityFilter]);

    useEffect(() => {
        if (search === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter((item) =>
                `${item.name || ''} ${item.phone || ''} ${item.email || ''} ${item.designation || ''}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [data, search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleAddTeamMember = () => {
        navigate(`/add-team-member?providerId=${providerId}`);
    };

    const handleEditTeamMember = (row) => {
        navigate(`/edit-team-member/${row._id}?providerId=${providerId}`);
    };

    const handleViewTeamMember = (row) => {
        navigate(`/view-team-member/${row._id}?providerId=${providerId}`);
    };

    const handleDeleteTeamMember = async (row) => {
        if (!window.confirm(`Do you really want to remove ${row.name} from the team?`)) {
            return;
        }

        setLoading(true);
        try {
            const response = await deleteTeamMember(row._id, providerId);

            if (response.success) {
                toast.success(response.message || 'Team member removed successfully');
                fetchTeamMembers();
                fetchStats();
            } else {
                toast.error(response.message || 'Failed to remove team member');
            }
        } catch (error) {
            const message = error.message || 'An error occurred while removing team member';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAvailability = async (row) => {
        const newStatus = !row.isAvailable;
        const action = newStatus ? 'available' : 'unavailable';

        setLoading(true);
        try {
            const response = await updateAvailability(row._id, providerId, newStatus);

            if (response.success) {
                toast.success(`Team member marked as ${action}`);
                fetchTeamMembers();
            } else {
                toast.error(response.message || `Failed to update availability`);
            }
        } catch (error) {
            const message = error.message || 'An error occurred while updating availability';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToProviders = () => {
        navigate('/AllprofessionalProviders');
    };

    const columns = useMemo(
        () => [
            {
                field: 'sno',
                headerName: 'S. No',
                headerAlign: 'left',
                align: 'left',
                width: 60,
                sortable: false,
                filterable: false,
                renderCell: (params) => {
                    const sortedRows = params.api.getSortedRowIds();
                    return sortedRows.indexOf(params.id) + 1;
                },
            },
            {
                field: 'memberInfo',
                headerName: 'Member Info',
                flex: 1,
                minWidth: 220,
                renderCell: (params) => (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            src={
                                params.row.profile_image
                                    ? `http://192.168.0.5:5013/${params.row.profile_image}`
                                    : undefined
                            }
                            alt={params.row.name}
                            sx={{ width: 40, height: 40 }}
                        >
                            {params.row.name?.charAt(0) || 'T'}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {params.row.name || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {params.row.designation || 'N/A'}
                            </Typography>
                        </Box>
                    </Box>
                ),
            },
            {
                field: 'contact',
                headerName: 'Contact',
                flex: 0.8,
                minWidth: 150,
                renderCell: (params) => (
                    <Box>
                        <Typography variant="body2">{params.row.phone || 'N/A'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {params.row.email || 'N/A'}
                        </Typography>
                    </Box>
                ),
            },
            {
                field: 'experience',
                headerName: 'Experience',
                flex: 0.6,
                minWidth: 120,
                renderCell: (params) => (
                    <Box>
                        <Typography variant="body2">
                            {params.row.work_experience ? `${params.row.work_experience} years` : 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {params.row.projects_done ? `${params.row.projects_done} projects` : ''}
                        </Typography>
                    </Box>
                ),
            },
            // Skills column removed to improve responsive layout
            {
                field: 'availability',
                headerName: 'Availability',
                flex: 0.6,
                minWidth: 120,
                renderCell: (params) => (
                    <Chip
                        label={params.row.isAvailable ? 'Available' : 'Unavailable'}
                        size="small"
                        color={params.row.isAvailable ? 'success' : 'default'}
                        variant="outlined"
                    />
                ),
            },
            {
                field: 'status',
                headerName: 'Status',
                flex: 0.6,
                minWidth: 110,
                renderCell: (params) => {
                    let statusText;
                    let statusColor;

                    switch (params.row.status) {
                        case 'active':
                            statusText = 'Active';
                            statusColor = 'success';
                            break;
                        case 'on_leave':
                            statusText = 'On Leave';
                            statusColor = 'warning';
                            break;
                        case 'terminated':
                            statusText = 'Terminated';
                            statusColor = 'error';
                            break;
                        default:
                            statusText = 'Unknown';
                            statusColor = 'default';
                    }

                    return <Chip label={statusText} size="small" color={statusColor} variant="outlined" />;
                },
            },
            {
                field: 'action',
                headerName: 'Action',
                width: 400,
                minWidth: 350,
                headerAlign: 'left',
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <Box display="flex" alignItems="center" gap={1} sx={{ whiteSpace: 'nowrap' }}>
                        {/* Toggle Availability Button */}
                        {(rolesAndPermission.Near_by_professionals || rolesAndPermission.accessAll) && (
                            <Button
                                variant="text"
                                color={params.row.isAvailable ? 'warning' : 'success'}
                                size="small"
                                startIcon={params.row.isAvailable ? <IconUserX size={16} /> : <IconUserCheck size={16} />}
                                onClick={() => handleToggleAvailability(params.row)}
                                disabled={loading || params.row.status === 'terminated'}
                                sx={{
                                    minWidth: 'auto',
                                    px: 0.5,
                                    textTransform: 'none',
                                    fontFamily: 'Poppins',
                                    fontSize: '13px',
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                {params.row.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                            </Button>
                        )}

                        {/* Edit Button */}
                        {(rolesAndPermission.Near_by_professionals || rolesAndPermission.accessAll) && (
                            <Button
                                variant="text"
                                color="primary"
                                size="small"
                                startIcon={<IconEdit size={16} />}
                                onClick={() => handleEditTeamMember(params.row)}
                                disabled={loading}
                                sx={{
                                    minWidth: 'auto',
                                    px: 0.5,
                                    textTransform: 'none',
                                    fontFamily: 'Poppins',
                                    fontSize: '13px',
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                Edit
                            </Button>
                        )}

                        {/* View Button */}
                        <Button
                            variant="text"
                            color="info"
                            size="small"
                            startIcon={<IconEye size={16} />}
                            onClick={() => handleViewTeamMember(params.row)}
                            disabled={loading}
                            sx={{
                                minWidth: 'auto',
                                px: 0.5,
                                textTransform: 'none',
                                fontFamily: 'Poppins',
                                fontSize: '13px',
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            View
                        </Button>

                        {/* Delete Button */}
                        {(rolesAndPermission.Near_by_professionals || rolesAndPermission.accessAll) && (
                            <Button
                                variant="text"
                                color="error"
                                size="small"
                                startIcon={<IconTrash size={16} />}
                                onClick={() => handleDeleteTeamMember(params.row)}
                                disabled={loading}
                                sx={{
                                    minWidth: 'auto',
                                    px: 0.5,
                                    textTransform: 'none',
                                    fontFamily: 'Poppins',
                                    fontSize: '13px',
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                Remove
                            </Button>
                        )}
                    </Box>
                ),
            },
        ],
        [loading, rolesAndPermission]
    );

    const rows = useMemo(
        () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
        [filteredData]
    );

    return (
        <PageContainer
            title="Team Management"
            description="Manage team members for professional service provider"
        >
            <Breadcrumb title="Team Management" items={BCrumb} />
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Team Stats Card */}
            {stats && <TeamStatsCard stats={stats} />}

            <Paper
                variant="outlined"
                sx={{
                    mt: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px',
                    boxShadow: theme.shadows[2],
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={2}
                    flexWrap="wrap"
                    gap={2}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<IconArrowLeft size={18} />}
                            onClick={handleBackToProviders}
                            sx={{ minWidth: 'auto' }}
                        >
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                Back to Providers
                            </Box>
                            <Box component="span" sx={{ display: { xs: 'block', sm: 'none' } }}>
                                Back
                            </Box>
                        </Button>
                        <Typography variant="h6">Team</Typography>
                    </Box>

                    <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                        <TextField
                            size="small"
                            placeholder="Search..."
                            value={search}
                            onChange={handleSearch}
                            sx={{ minWidth: { xs: 100, sm: 150 }, bgcolor: 'white' }}
                            aria-label="Search Team Members"
                        />

                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="on_leave">On Leave</MenuItem>
                                <MenuItem value="terminated">Terminated</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 115 }}>
                            <InputLabel>Availability</InputLabel>
                            <Select
                                value={availabilityFilter}
                                label="Availability"
                                onChange={(e) => setAvailabilityFilter(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="true">Available</MenuItem>
                                <MenuItem value="false">Unavailable</MenuItem>
                            </Select>
                        </FormControl>

                        {(rolesAndPermission.Near_by_professionals || rolesAndPermission.accessAll) && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddTeamMember}
                                disabled={loading}
                                startIcon={<IconPlus size={18} />}
                                aria-label="Add Team Member"
                                sx={{ whiteSpace: 'nowrap', minWidth: 'auto', px: 2 }}
                            >
                                Add
                            </Button>
                        )}
                    </Box>
                </Box>
                <Divider />
                <CardContent>
                    <Box sx={{ height: 'auto', width: '100%', overflowX: 'auto' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10 },
                                },
                            }}
                            rowHeight={70}
                            pageSizeOptions={[5, 10, 20, 50, 100]}
                            disableRowSelectionOnClick
                            loading={loading}
                            sx={{
                                minWidth: 800,
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: 'primary.lighter',
                                },
                            }}
                        />
                    </Box>
                </CardContent>
            </Paper>
        </PageContainer>
    );
};

export default TeamManagement;

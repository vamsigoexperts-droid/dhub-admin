import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    MenuItem,
    Typography,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    Autocomplete,
    Chip,
    CircularProgress,
    ToggleButton,
    ToggleButtonGroup,
    Paper,
} from '@mui/material';
import {
    IconSend,
    IconUsers,
    IconBuildingStore,
    IconMassage,
    IconBuildingCommunity,
    IconHome2,
    IconChecklist,
    IconUpload,
    IconX
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URLS } from 'src/Url';
import { toast, ToastContainer } from 'react-toastify';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Notifications' },
    { title: 'Send Notification' },
];

// Provider sub-types configuration with icons
const PROVIDER_SUBTYPES = [
    { value: 'all', label: 'All Providers', icon: IconUsers, color: '#0d5959' },
    { value: 'verified_partner', label: 'Verified Partner', icon: IconChecklist, color: '#1976d2' },
    { value: 'service_center', label: 'Service Center', icon: IconBuildingStore, color: '#f57c00' },
    { value: 'spa', label: 'Spa', icon: IconMassage, color: '#7b1fa2' },
    { value: 'hostel', label: 'Hostel', icon: IconBuildingCommunity, color: '#388e3c' },
    { value: 'religious', label: 'Religious', icon: IconHome2, color: '#d32f2f' },
];

const SendNotificationNew = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [targetOptions, setTargetOptions] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [activeSubType, setActiveSubType] = useState('all'); // Default to 'all'
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        target: 'All',
        type: '',
        userIds: [],
        title: '',
        description: '',
    });

    const getToken = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user)?.token : '';
    };

    // Fetch targets from API with search and optional subType
    const fetchTargets = async (type, search = '', subType = null) => {
        if (!type) return;

        setSearchLoading(true);
        try {
            const token = getToken();
            const params = {
                type: type,
                search: search,
            };

            // Add subType only for Provider type and when not 'all'
            if (type === 'Provider' && subType && subType !== 'all') {
                params.subType = subType;
            }

            const response = await axios.get(URLS.NotificationTargets, {
                headers: { Authorization: `Bearer ${token}` },
                params: params,
            });

            // API returns array of objects with { id, label }
            const data = response.data?.data || response.data || [];
            setTargetOptions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching targets:', error);
            toast.error('Failed to load users: ' + (error.response?.data?.message || error.message));
            setTargetOptions([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            // Reset dependent fields when target changes
            if (name === 'target') {
                if (value !== 'Selected') {
                    updated.type = '';
                    updated.userIds = [];
                    setSelectedUsers([]);
                    setTargetOptions([]);
                    setSearchText('');
                    setActiveSubType('all');
                }
            }

            // Reset userIds when type changes, but keep selected users from different sub-types
            if (name === 'type') {
                // Don't clear selectedUsers - allow multi-subtype selection
                setTargetOptions([]);
                setSearchText('');
                setActiveSubType('all');
                // Don't fetch here - let the useEffect or subType button handle it
            }

            return updated;
        });
    };

    const handleUserSelection = (event, newValue) => {
        setSelectedUsers(newValue);
        setFormData((prev) => ({
            ...prev,
            userIds: newValue.map(item => item.id), // Use 'id' from API response
        }));
    };

    // Handle sub-type button click for Providers
    const handleSubTypeChange = (event, newSubType) => {
        if (newSubType !== null) {
            setActiveSubType(newSubType);
            setSearchText(''); // Clear search when switching sub-type
            // Fetch new list for this sub-type
            fetchTargets('Provider', '', newSubType);
        }
    };

    // Debounced search effect - immediate load for empty search, debounced for typed search
    React.useEffect(() => {
        if (!formData.type) return;

        // For Provider type, use the active subType
        const subType = formData.type === 'Provider' ? activeSubType : null;

        // If searchText is empty, load immediately (initial load)
        if (searchText === '') {
            fetchTargets(formData.type, '', subType);
            return;
        }

        // Otherwise, debounce the search
        const timeoutId = setTimeout(() => {
            fetchTargets(formData.type, searchText, subType);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText, formData.type, activeSubType]);

    const handleSearchChange = (event, value, reason) => {
        if (reason === 'input') {
            setSearchText(value);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Description is required');
            return;
        }
        if (formData.target === 'Selected' && !formData.type) {
            toast.error('Please select user type (Customer or Provider)');
            return;
        }
        if (formData.target === 'Selected' && formData.userIds.length === 0) {
            toast.error('Please select at least one user');
            return;
        }

        setLoading(true);
        try {
            const token = getToken();

            // Create FormData for multipart/form-data submission
            const formDataToSend = new FormData();
            formDataToSend.append('target', formData.target);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);

            // Add type and userIds only if target is "Selected"
            if (formData.target === 'Selected') {
                formDataToSend.append('type', formData.type);
                // Send userIds as JSON string
                formDataToSend.append('userIds', JSON.stringify(formData.userIds));
            }

            // Add image if selected
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            }

            console.log('Sending notification with FormData');

            await axios.post(URLS.NotificationSend, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            toast.success('Notification sent successfully!');

            // Reset form
            setFormData({
                target: 'All',
                type: '',
                userIds: [],
                title: '',
                description: '',
            });
            setSelectedUsers([]);
            setTargetOptions([]);
            setSearchText('');
            setActiveSubType('all');
            setSelectedImage(null);
            setImagePreview(null);

            // Navigate to history after 1.5 seconds
            setTimeout(() => {
                navigate('/notifications/history');
            }, 1500);
        } catch (error) {
            console.error('Error sending notification:', error);
            toast.error('Failed to send notification: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer title="Send Notification" description="Send push notifications to users">
            <Breadcrumb title="Send Notification" items={BCrumb} />
            <ToastContainer />

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="#0d5959">
                                    Notification Details
                                </Typography>

                                <Grid container spacing={3}>
                                    {/* Target Selection */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Target Audience</InputLabel>
                                            <Select
                                                label="Target Audience"
                                                name="target"
                                                value={formData.target}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="All">All Users</MenuItem>
                                                <MenuItem value="Users">All Customers</MenuItem>
                                                <MenuItem value="Providers">All Providers</MenuItem>
                                                <MenuItem value="Selected">Selected Users</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Type Selection - Only show if "Selected" is chosen */}
                                    {formData.target === 'Selected' && (
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth required>
                                                <InputLabel>User Type</InputLabel>
                                                <Select
                                                    label="User Type"
                                                    name="type"
                                                    value={formData.type}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value="Customer">Customer</MenuItem>
                                                    <MenuItem value="Provider">Provider</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    )}

                                    {/* Provider Sub-Type Buttons - Only show if Provider is selected */}
                                    {formData.target === 'Selected' && formData.type === 'Provider' && (
                                        <Grid item xs={12}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2.5,
                                                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                                    borderRadius: 2,
                                                    border: '1px solid #e0e0e0'
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    gutterBottom
                                                    sx={{
                                                        mb: 2,
                                                        fontWeight: 600,
                                                        color: '#0d5959',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1
                                                    }}
                                                >
                                                    <IconUsers size={20} />
                                                    Select Provider Category:
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                                    {PROVIDER_SUBTYPES.map((subType) => {
                                                        const Icon = subType.icon;
                                                        const isSelected = activeSubType === subType.value;
                                                        return (
                                                            <Button
                                                                key={subType.value}
                                                                variant={isSelected ? 'contained' : 'outlined'}
                                                                onClick={() => handleSubTypeChange(null, subType.value)}
                                                                startIcon={<Icon size={18} />}
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    px: 2.5,
                                                                    py: 1.2,
                                                                    borderRadius: 2,
                                                                    fontWeight: isSelected ? 600 : 500,
                                                                    fontSize: '0.875rem',
                                                                    transition: 'all 0.3s ease',
                                                                    ...(isSelected ? {
                                                                        backgroundColor: subType.color,
                                                                        borderColor: subType.color,
                                                                        color: 'white',
                                                                        boxShadow: `0 4px 12px ${subType.color}40`,
                                                                        '&:hover': {
                                                                            backgroundColor: subType.color,
                                                                            filter: 'brightness(0.9)',
                                                                            transform: 'translateY(-2px)',
                                                                            boxShadow: `0 6px 16px ${subType.color}60`,
                                                                        },
                                                                    } : {
                                                                        borderColor: subType.color,
                                                                        color: subType.color,
                                                                        backgroundColor: 'background.paper',
                                                                        '&:hover': {
                                                                            backgroundColor: `${subType.color}10`,
                                                                            borderColor: subType.color,
                                                                            transform: 'translateY(-1px)',
                                                                        },
                                                                    }),
                                                                }}
                                                            >
                                                                {subType.label}
                                                            </Button>
                                                        );
                                                    })}
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    )}

                                    {/* User Selection - Only show if "Selected" and type is chosen */}
                                    {formData.target === 'Selected' && formData.type && (
                                        <Grid item xs={12}>
                                            <Autocomplete
                                                multiple
                                                options={targetOptions}
                                                getOptionLabel={(option) => option.label || ''}
                                                value={selectedUsers}
                                                onChange={handleUserSelection}
                                                onInputChange={handleSearchChange}
                                                inputValue={searchText}
                                                loading={searchLoading}
                                                filterOptions={(x) => x} // Disable client-side filtering since we use server-side search
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label={`Select ${formData.type}s`}
                                                        placeholder={`Search ${formData.type}s...`}
                                                        helperText={
                                                            formData.type === 'Provider'
                                                                ? activeSubType === 'all'
                                                                    ? 'Showing all providers. Select a specific category to filter.'
                                                                    : `Showing ${activeSubType.replace(/_/g, ' ')} providers. Switch categories to select from other types.`
                                                                : ''
                                                        }
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <>
                                                                    {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                    {params.InputProps.endAdornment}
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip
                                                            label={option.label}
                                                            {...getTagProps({ index })}
                                                            key={option.id}
                                                            sx={{
                                                                backgroundColor: '#e8f5f5',
                                                                color: '#0d5959',
                                                                '& .MuiChip-deleteIcon': {
                                                                    color: '#0d5959',
                                                                },
                                                            }}
                                                        />
                                                    ))
                                                }
                                                noOptionsText={searchText ? "No users found" : "Type to search..."}
                                            />
                                            {selectedUsers.length > 0 && (
                                                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                                    {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                                                </Typography>
                                            )}
                                        </Grid>
                                    )}

                                    {/* Title */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Notification Title"
                                            name="title"
                                            fullWidth
                                            required
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Enter notification title"
                                        />
                                    </Grid>

                                    {/* Description */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Notification Message"
                                            name="description"
                                            fullWidth
                                            required
                                            multiline
                                            rows={4}
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Enter notification message"
                                        />
                                    </Grid>

                                    {/* Promotional Image Upload */}
                                    <Grid item xs={12}>
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5, fontWeight: 600 }}>
                                                Promotional Image (Optional)
                                            </Typography>

                                            {!imagePreview ? (
                                                <Box
                                                    sx={{
                                                        border: '2px dashed #0d5959',
                                                        borderRadius: 2,
                                                        p: 3,
                                                        textAlign: 'center',
                                                        backgroundColor: '#f5f9f9',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            backgroundColor: '#e8f5f5',
                                                            borderColor: '#084040',
                                                        },
                                                    }}
                                                    onClick={() => document.getElementById('image-upload').click()}
                                                >
                                                    <IconUpload size={48} color="#0d5959" style={{ marginBottom: 8 }} />
                                                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                                                        Click to upload or drag and drop
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        PNG, JPG, JPEG up to 5MB
                                                    </Typography>
                                                    <input
                                                        id="image-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        style={{ display: 'none' }}
                                                    />
                                                </Box>
                                            ) : (
                                                <Box
                                                    sx={{
                                                        position: 'relative',
                                                        border: '2px solid #0d5959',
                                                        borderRadius: 2,
                                                        p: 2,
                                                        backgroundColor: '#f5f9f9',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box
                                                            component="img"
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            sx={{
                                                                width: 120,
                                                                height: 120,
                                                                objectFit: 'cover',
                                                                borderRadius: 1,
                                                                border: '1px solid #ddd',
                                                            }}
                                                        />
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                                {selectedImage?.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                {(selectedImage?.size / 1024).toFixed(2)} KB
                                                            </Typography>
                                                        </Box>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            startIcon={<IconX size={16} />}
                                                            onClick={handleRemoveImage}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/notifications/history')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<IconSend />}
                                disabled={loading}
                                sx={{
                                    backgroundColor: '#0d5959',
                                    '&:hover': { backgroundColor: '#084040' }
                                }}
                            >
                                {loading ? 'Sending...' : 'Send Notification'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </PageContainer>
    );
};

export default SendNotificationNew;


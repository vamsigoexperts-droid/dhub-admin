import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Grid,
    Button,
    MenuItem,
    InputAdornment,
} from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { URLS } from '../../../Url';

const OrderFilters = ({ onFilterChange, statuses, orderType, slaCount, providerType }) => {
    const [filters, setFilters] = useState({
        searchTerm: '',
        status: 'all',
        startDate: null,
        endDate: null,
        serviceId: '',
        sourceOfLead: '',
        slaOnly: false,
    });
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetchServices();
    }, [orderType]);

    const fetchServices = async () => {
        try {
            const user = localStorage.getItem('user');
            const userToken = user ? JSON.parse(user)?.token || '' : '';

            // Map orderType to flagType for service fetching
            const flagType = orderType === 'verified' ? 'verifiedPartner' : (orderType === 'professional' ? 'professional' : 'verifiedPartner');

            const response = await axios.post(
                URLS.GetServicesByFlagType,
                { providerType: flagType },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            if (response.data.success) {
                let allServices = response.data.data || [];

                // Filter categories based on the specific view type
                if (providerType === 'Service Center') {
                    // Only show services relevant to service centers
                    allServices = allServices.filter(s => s.flagType === 'services');
                } else if (providerType === 'Professional Service') {
                    // Show other professional categories
                    allServices = allServices.filter(s => ['salon', 'hostel', 'purohith'].includes(s.flagType));
                }

                setServices(allServices);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleClear = () => {
        const clearedFilters = {
            searchTerm: '',
            status: 'all',
            startDate: null,
            endDate: null,
            serviceId: '',
            sourceOfLead: '',
            slaOnly: false,
        };
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    const leadSources = [
        { label: 'ALL', value: '' },
        { label: 'Website', value: 'Website' },
        { label: 'App', value: 'App' },
        { label: 'CRM', value: 'CRM' }
    ];

    return (
        <Box sx={{ mb: 3 }}>
            {/* Top Bar - Conditional: Lead Source for Verified, Categories for Professional */}
            {orderType !== 'crm-website' && (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1.5,
                        overflowX: 'auto',
                        mb: 3,
                        pb: 1,
                        '::-webkit-scrollbar': {
                            height: '6px',
                        },
                        '::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                        },
                        '::-webkit-scrollbar-thumb': {
                            background: '#ccc',
                            borderRadius: '4px',
                        },
                        '&:hover ::-webkit-scrollbar-thumb': {
                            background: '#bbb',
                        },
                    }}
                >
                    {orderType === 'verified' ? (
                        leadSources.map((source) => (
                            <Button
                                key={source.value}
                                variant={filters.sourceOfLead === source.value ? 'contained' : 'outlined'}
                                onClick={() => handleChange('sourceOfLead', source.value)}
                                sx={{
                                    borderRadius: '8px',
                                    whiteSpace: 'nowrap',
                                    minWidth: 'auto',
                                    px: 3,
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease-in-out',
                                    boxShadow: filters.sourceOfLead === source.value ? '0 4px 12px rgba(0,115,103,0.2)' : 'none',
                                    backgroundColor: filters.sourceOfLead === source.value ? '#007367' : 'transparent',
                                    color: filters.sourceOfLead === source.value ? '#ffffff' : '#757575',
                                    borderColor: filters.sourceOfLead === source.value ? '#007367' : '#e0e0e0',
                                    '&:hover': {
                                        backgroundColor: filters.sourceOfLead === source.value ? '#005d54' : '#e0f2f1',
                                        color: filters.sourceOfLead === source.value ? '#ffffff' : '#007367',
                                        borderColor: '#007367',
                                        transform: 'translateY(-1px)',
                                    }
                                }}
                            >
                                {source.label}
                            </Button>
                        ))
                    ) : (
                        <>
                            <Button
                                variant={!filters.serviceId ? 'contained' : 'outlined'}
                                onClick={() => handleChange('serviceId', '')}
                                sx={{
                                    borderRadius: '8px',
                                    whiteSpace: 'nowrap',
                                    minWidth: 'auto',
                                    px: 3,
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease-in-out',
                                    boxShadow: !filters.serviceId ? '0 4px 12px rgba(0,115,103,0.2)' : 'none',
                                    backgroundColor: !filters.serviceId ? '#007367' : 'transparent',
                                    color: !filters.serviceId ? '#ffffff' : '#757575',
                                    borderColor: !filters.serviceId ? '#007367' : '#e0e0e0',
                                    '&:hover': {
                                        backgroundColor: !filters.serviceId ? '#005d54' : '#e0f2f1',
                                        color: !filters.serviceId ? '#ffffff' : '#007367',
                                        borderColor: '#007367',
                                        transform: 'translateY(-1px)',
                                    }
                                }}
                            >
                                ALL
                            </Button>

                            {/* Manual Tab for Appliance Repair (Special DHUB Case) */}
                            {providerType === 'Service Center' && (
                                <Button
                                    variant={filters.serviceId === 'appliance_repair_dhub' ? 'contained' : 'outlined'}
                                    onClick={() => handleChange('serviceId', 'appliance_repair_dhub')}
                                    sx={{
                                        borderRadius: '8px',
                                        whiteSpace: 'nowrap',
                                        minWidth: 'auto',
                                        px: 3,
                                        textTransform: 'uppercase',
                                        fontWeight: 600,
                                        transition: 'all 0.2s ease-in-out',
                                        boxShadow: filters.serviceId === 'appliance_repair_dhub' ? '0 4px 12px rgba(0,115,103,0.2)' : 'none',
                                        backgroundColor: filters.serviceId === 'appliance_repair_dhub' ? '#007367' : 'transparent',
                                        color: filters.serviceId === 'appliance_repair_dhub' ? '#ffffff' : '#757575',
                                        borderColor: filters.serviceId === 'appliance_repair_dhub' ? '#007367' : '#e0e0e0',
                                        '&:hover': {
                                            backgroundColor: filters.serviceId === 'appliance_repair_dhub' ? '#005d54' : '#e0f2f1',
                                            color: filters.serviceId === 'appliance_repair_dhub' ? '#ffffff' : '#007367',
                                            borderColor: '#007367',
                                            transform: 'translateY(-1px)',
                                        }
                                    }}
                                >
                                    Appliance Repair
                                </Button>
                            )}

                            {services.map((service) => (
                                <Button
                                    key={service._id}
                                    variant={filters.serviceId === service._id ? 'contained' : 'outlined'}
                                    onClick={() => handleChange('serviceId', service._id)}
                                    sx={{
                                        borderRadius: '8px',
                                        whiteSpace: 'nowrap',
                                        minWidth: 'auto',
                                        px: 3,
                                        textTransform: 'uppercase',
                                        fontWeight: 600,
                                        transition: 'all 0.2s ease-in-out',
                                        boxShadow: filters.serviceId === service._id ? '0 4px 12px rgba(0,115,103,0.2)' : 'none',
                                        backgroundColor: filters.serviceId === service._id ? '#007367' : 'transparent',
                                        color: filters.serviceId === service._id ? '#ffffff' : '#757575',
                                        borderColor: filters.serviceId === service._id ? '#007367' : '#e0e0e0',
                                        '&:hover': {
                                            backgroundColor: filters.serviceId === service._id ? '#005d54' : '#e0f2f1',
                                            color: filters.serviceId === service._id ? '#ffffff' : '#007367',
                                            borderColor: '#007367',
                                            transform: 'translateY(-1px)',
                                        }
                                    }}
                                >
                                    {service.serviceName || service.name}
                                </Button>
                            ))}
                        </>
                    )}
                </Box>
            )}

            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search by Order ID..."
                        value={filters.searchTerm}
                        onChange={(e) => handleChange('searchTerm', e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconSearch size={20} />
                                </InputAdornment>
                            ),
                            sx: {
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                    borderWidth: '1.5px',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.dark',
                                    borderWidth: '2px',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                    borderWidth: '2px',
                                },
                                backgroundColor: 'background.paper',
                            }
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={2.5}>
                    <Button
                        fullWidth
                        variant={filters.slaOnly ? "contained" : "outlined"}
                        color="error"
                        size="small"
                        onClick={() => handleChange('slaOnly', !filters.slaOnly)}
                        sx={{
                            height: 40,
                            borderRadius: '8px',
                            fontWeight: 700,
                            borderWidth: filters.slaOnly ? 0 : '1.5px',
                            '&:hover': {
                                borderWidth: '2px',
                                backgroundColor: filters.slaOnly ? 'error.dark' : 'error.light',
                                color: filters.slaOnly ? '#fff' : 'error.main',
                            },
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1,
                            backgroundColor: filters.slaOnly ? '#f44336' : 'transparent',
                            borderColor: '#f44336',
                            color: filters.slaOnly ? '#fff' : '#f44336',
                        }}
                    >
                        ATTENTION REQUIRED ({slaCount || 0})
                    </Button>
                </Grid>

                <Grid item xs={12} md={2.25}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Start Date"
                            value={filters.startDate}
                            onChange={(date) => handleChange('startDate', date)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    sx: {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: '1.5px',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.dark',
                                            borderWidth: '2px',
                                        },
                                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: '2px',
                                        },
                                        backgroundColor: 'background.paper',
                                    }
                                },
                            }}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={2.25}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="End Date"
                            value={filters.endDate}
                            onChange={(date) => handleChange('endDate', date)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    sx: {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: '1.5px',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.dark',
                                            borderWidth: '2px',
                                        },
                                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: '2px',
                                        },
                                        backgroundColor: 'background.paper',
                                    }
                                },
                            }}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={1}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        onClick={handleClear}
                        sx={{ height: 40, minWidth: 'auto', px: 1 }}
                    >
                        <IconX size={18} />
                    </Button>
                </Grid>
            </Grid>
        </Box >
    );
};

export default OrderFilters;

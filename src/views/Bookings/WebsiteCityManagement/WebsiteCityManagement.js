import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Chip,
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
} from '@mui/material';
import { IconTrash, IconPlus, IconSettings } from '@tabler/icons-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { URLS } from 'src/Url';
import { useAuth } from 'src/context/AuthContext';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Website City Management' },
];

const WebsiteCityManagement = () => {
    const { token } = useAuth();
    const [masterCities, setMasterCities] = useState([]);
    const [websiteCities, setWebsiteCities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedMasterCity, setSelectedMasterCity] = useState('');
    const [loading, setLoading] = useState(true);

    const [openMappingDialog, setOpenMappingDialog] = useState(false);
    const [currentCity, setCurrentCity] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Master Cities and Categories use POST in this backend
            const [masterRes, websiteRes, catRes] = await Promise.all([
                axios.post(URLS.GetCity, {}, { headers }),
                axios.get(URLS.GetWebsiteCities, { headers }),
                axios.post(URLS.GetDemandCategory, {}, { headers })
            ]);

            if (masterRes.data.success) setMasterCities(masterRes.data.city || []);
            if (websiteRes.data.success) setWebsiteCities(websiteRes.data.data || []);
            if (catRes.data.success) setCategories(catRes.data.ondemandcategorys || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch management data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const handleAddCity = async () => {
        if (!selectedMasterCity) {
            toast.warning('Please select a city first');
            return;
        }

        try {
            const response = await axios.post(URLS.AddWebsiteCity, { cityId: selectedMasterCity }, { headers });
            if (response.data.success) {
                toast.success('City added to website');
                setSelectedMasterCity('');
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add city');
        }
    };

    const handleDeleteCity = async (id) => {
        if (window.confirm('Remove this city from website?')) {
            try {
                const response = await axios.delete(URLS.DeleteWebsiteCity + id, { headers });
                if (response.data.success) {
                    toast.success('City removed');
                    fetchData();
                }
            } catch (error) {
                console.error('Delete error:', error);
                toast.error(error.response?.data?.message || 'Failed to remove city');
            }
        }
    };

    const handleOpenMapping = async (city) => {
        setCurrentCity(city);
        try {
            const response = await axios.get(URLS.GetCityCategories + city._id, { headers });
            if (response.data.success) {
                // Map to just IDs for the multiselect
                const mappedIds = (response.data.data || []).map(c => c._id);
                setSelectedCategories(mappedIds);
            }
            setOpenMappingDialog(true);
        } catch (error) {
            toast.error('Failed to fetch city categories');
        }
    };

    const handleSaveMapping = async () => {
        try {
            const response = await axios.post(URLS.SaveCityCategories, {
                websiteCityId: currentCity._id,
                categoryIds: selectedCategories
            }, { headers });
            if (response.data.success) {
                toast.success('Categories updated for city');
                setOpenMappingDialog(false);
                fetchData(); // Refresh list to show new chips
            }
        } catch (error) {
            toast.error('Failed to save mapping');
        }
    };

    const handleRemoveCategory = (catId) => {
        setSelectedCategories(prev => prev.filter(id => id !== catId));
    };

    return (
        <PageContainer title="Website City Management" description="Manage visible cities and their categories">
            <Breadcrumb title="Website City Management" items={BCrumb} />

            <Box sx={{ p: 3 }}>
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ mb: 2 }}>Add Website City</Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <FormControl fullWidth>
                                    <InputLabel>Select Cities</InputLabel>
                                    <Select
                                        value={selectedMasterCity}
                                        onChange={(e) => setSelectedMasterCity(e.target.value)}
                                        label="Select Cities"
                                    >
                                        {(masterCities || []).map((city) => (
                                            <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<IconPlus />}
                                    onClick={handleAddCity}
                                    size="large"
                                >
                                    Add Website
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Typography variant="h5" sx={{ mb: 2 }}>Enabled Website Cities</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>S/NO</TableCell>
                                <TableCell>City Name</TableCell>
                                <TableCell>Selected Categories</TableCell>
                                <TableCell>Enabled On</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} align="center">Loading...</TableCell></TableRow>
                            ) : (websiteCities || []).length === 0 ? (
                                <TableRow><TableCell colSpan={5} align="center">No cities enabled yet</TableCell></TableRow>
                            ) : (
                                (websiteCities || []).map((city, index) => (
                                    <TableRow key={city._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {city.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 300 }}>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {city.categories?.length > 0 ? (
                                                    city.categories.map((cat) => (
                                                        <Chip
                                                            key={cat._id}
                                                            label={cat.name}
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                        />
                                                    ))
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary">No categories assigned</Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{city.logCreatedDate}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<IconSettings size="16" />}
                                                onClick={() => handleOpenMapping(city)}
                                                sx={{ mr: 1 }}
                                            >
                                                Manage
                                            </Button>
                                            <IconButton color="error" onClick={() => handleDeleteCity(city._id)}>
                                                <IconTrash size="18" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Category Mapping Dialog */}
            <Dialog open={openMappingDialog} onClose={() => setOpenMappingDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Mange Categories for {currentCity?.name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id="category-select-label">Select On-Demand Categories</InputLabel>
                            <Select
                                labelId="category-select-label"
                                multiple
                                value={selectedCategories}
                                onChange={(e) => setSelectedCategories(e.target.value)}
                                input={<OutlinedInput label="Select On-Demand Categories" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {(selected || []).map((value) => (
                                            <Chip
                                                key={value}
                                                label={categories?.find(c => c._id === value)?.name || 'Unknown'}
                                                onDelete={(e) => {
                                                    e.stopPropagation(); // Prevent dropdown from opening
                                                    handleRemoveCategory(value);
                                                }}
                                                onMouseDown={(e) => {
                                                    e.stopPropagation(); // Extra safety for MUI Select
                                                }}
                                            />
                                        ))}
                                    </Box>
                                )}
                            >
                                {(categories || []).map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMappingDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveMapping} variant="contained" color="primary">Save Mappings</Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};



export default WebsiteCityManagement;

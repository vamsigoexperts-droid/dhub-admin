import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Divider,
    Chip,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Avatar,
    useTheme,
    Fade,
    Zoom,
    MenuItem
} from '@mui/material';
import {
    IconArrowUp,
    IconArrowDown,
    IconPlus,
    IconTrash,
    IconDeviceFloppy,
    IconEdit,
    IconGripVertical,
    IconWorld,
    IconListDetails,
    IconCirclePlus,
} from '@tabler/icons-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ParentCard from '../../components/shared/ParentCard';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import { URLS } from '../../Url';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Website Management' },
    { title: 'Header Management' },
];

const URL_CHOICES = [
    { value: '/', label: 'Main Homepage / Landing' },
    { value: '/about-us', label: 'About Us' },
    { value: '/contact-us', label: 'Contact Us' },
    { value: '/privacy-policy', label: 'Privacy Policy' },
    { value: '/terms-and-conditions', label: 'Terms & Conditions' },
    { value: '/careers', label: 'Careers' },
    { value: '/partner', label: 'Become a Partner' },
    { value: '/faqs', label: 'FAQs' },
    { value: '/knowledge', label: 'Knowledge Base / Blog' },
    { value: '/book-appointment', label: 'Book Appointment' }
];

const HeaderManagement = () => {
    const theme = useTheme();
    const [activeHeader, setActiveHeader] = useState([]);
    const [poolLabels, setPoolLabels] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pool Label Dialog State
    const [openPoolDialog, setOpenPoolDialog] = useState(false);
    const [editingPoolLabel, setEditingPoolLabel] = useState(null);
    const [poolFormData, setPoolFormData] = useState({ label: '', url: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [navbarRes, availableRes] = await Promise.all([
                axios.get(URLS.GetNavbarItems),
                axios.get(URLS.GetAvailableNavbarLabels),
            ]);
            if (navbarRes.data.success) setActiveHeader(navbarRes.data.data);
            if (availableRes.data.success) setPoolLabels(availableRes.data.data);
        } catch (error) {
            toast.error('Failed to fetch header data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Pool Management ---

    const handleOpenPoolDialog = (item = null) => {
        if (item) {
            setEditingPoolLabel(item);
            setPoolFormData({ label: item.label, url: item.url });
        } else {
            setEditingPoolLabel(null);
            setPoolFormData({ label: '', url: '' });
        }
        setOpenPoolDialog(true);
    };

    const handleSavePoolLabel = async () => {
        if (!poolFormData.label || !poolFormData.url) {
            toast.error('Both label and URL are required');
            return;
        }

        try {
            if (editingPoolLabel) {
                await axios.put(`${URLS.UpdatePoolLabel}${editingPoolLabel._id}`, poolFormData);
                toast.success('Label updated in pool');

                // Update local pool list
                setPoolLabels(prev => prev.map(p =>
                    p._id === editingPoolLabel._id ? { ...p, ...poolFormData } : p
                ));

                // Synchronize live active header if names/urls changed
                setActiveHeader(prev => prev.map(headerItem =>
                    (headerItem.label === editingPoolLabel.label && headerItem.url === editingPoolLabel.url)
                        ? { ...headerItem, ...poolFormData }
                        : headerItem
                ));
            } else {
                const res = await axios.post(URLS.AddPoolLabel, poolFormData);
                toast.success('New label added to pool library');
                // Refresh pool at least to get real IDs or just add locally
                setPoolLabels(prev => [...prev, res.data.data]);
            }
            setOpenPoolDialog(false);
            // fetchData() removed to prevent overwriting our current work on the live structure
        } catch (error) {
            toast.error('Error saving pool label');
        }
    };

    const handleDeletePoolLabel = async (item) => {
        if (window.confirm(`Are you sure you want to remove "${item.label}" from the library? It will be removed from the website header permanently.`)) {
            try {
                await axios.delete(`${URLS.DeletePoolLabel}${item._id}`);

                const updatedHeader = activeHeader.filter(headerItem =>
                    !(headerItem.label === item.label && headerItem.url === item.url)
                );

                // Automically publish the new structure without the deleted item
                await axios.post(URLS.SaveNavbarStructure, { items: updatedHeader });

                setPoolLabels(prev => prev.filter(p => p._id !== item._id));
                setActiveHeader(updatedHeader);
                toast.success('Deleted permanently from library and website');
            } catch (error) {
                toast.error('Error during permanent deletion');
            }
        }
    };

    // --- Active Header Actions ---

    const handleAddItemToHeader = (item) => {
        const exists = activeHeader.find((n) => n.url === item.url && n.label === item.label);
        if (exists) {
            toast.info('Item already in header');
            return;
        }
        setActiveHeader([...activeHeader, { ...item, isVisible: true }]);
    };

    const removeItemFromHeader = (index) => {
        const updated = activeHeader.filter((_, i) => i !== index);
        setActiveHeader(updated);
    };

    const moveItem = (index, direction) => {
        const newItems = [...activeHeader];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newItems.length) {
            [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
            setActiveHeader(newItems);
        }
    };

    const handleSaveHeader = async () => {
        try {
            const res = await axios.post(URLS.SaveNavbarStructure, { items: activeHeader });
            if (res.data.success) {
                toast.success('Header setup saved successfully');
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to save header structure');
        }
    };

    return (
        <PageContainer title="Header Management" description="Manage your website navigation">
            <Breadcrumb title="Header Management" items={BCrumb} />
            <Box sx={{ p: { xs: 1, md: 3 } }}>
                <Grid container spacing={3}>
                    {/* Pool Management Column */}
                    <Grid item xs={12} md={5}>
                        <ParentCard
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconListDetails size="22" color={theme.palette.primary.main} />
                                    <Typography variant="h5">Label Library</Typography>
                                </Box>
                            }
                            footer={
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<IconPlus size="18" />}
                                        fullWidth
                                        sx={{ borderRadius: '12px', py: 1.5, fontWeight: 600, boxShadow: theme.shadows[4] }}
                                        onClick={() => handleOpenPoolDialog()}
                                    >
                                        Create New Master Label
                                    </Button>
                                </Box>
                            }
                        >
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                Manage the master list of links available for your website navigation.
                            </Typography>

                            <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.1)', p: 1 }}>
                                <List sx={{ maxHeight: 550, overflowY: 'auto', p: 0 }}>
                                    {poolLabels.map((item, idx) => (
                                        <Fade in={true} style={{ transitionDelay: `${idx * 50}ms` }} key={item._id}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    mb: 1,
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        bgcolor: 'background.paper',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                        transform: 'translateY(-2px)'
                                                    }
                                                }}
                                            >
                                                <ListItem sx={{ py: 1.5 }}>
                                                    <Avatar sx={{ bgcolor: theme.palette.primary.light, mr: 2, width: 32, height: 32 }}>
                                                        <IconWorld size="18" color={theme.palette.primary.main} />
                                                    </Avatar>
                                                    <ListItemText
                                                        primary={<Typography variant="subtitle2" fontWeight="700">{item.label}</Typography>}
                                                        secondary={<Typography variant="caption" color="textSecondary">{item.url}</Typography>}
                                                    />
                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                        <Tooltip title="Add to Header">
                                                            <IconButton
                                                                size="small"
                                                                sx={{ color: theme.palette.success.main, bgcolor: 'rgba(40, 199, 111, 0.1)' }}
                                                                onClick={() => handleAddItemToHeader(item)}
                                                            >
                                                                <IconPlus size="20" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Edit Master Label">
                                                            <IconButton
                                                                size="small"
                                                                sx={{ color: theme.palette.info.main, bgcolor: 'rgba(0, 207, 232, 0.1)' }}
                                                                onClick={() => handleOpenPoolDialog(item)}
                                                            >
                                                                <IconEdit size="18" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete from Library">
                                                            <IconButton
                                                                size="small"
                                                                sx={{ color: theme.palette.error.main, bgcolor: 'rgba(234, 84, 85, 0.1)' }}
                                                                onClick={() => handleDeletePoolLabel(item)}
                                                            >
                                                                <IconTrash size="18" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </ListItem>
                                            </Paper>
                                        </Fade>
                                    ))}
                                    {poolLabels.length === 0 && (
                                        <Box sx={{ p: 4, textAlign: 'center' }}>
                                            <Typography color="textSecondary">No labels in library</Typography>
                                        </Box>
                                    )}
                                </List>
                            </Box>
                        </ParentCard>
                    </Grid>

                    {/* Active Navbar Setup Column */}
                    <Grid item xs={12} md={7}>
                        <ParentCard
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconWorld size="22" color={theme.palette.success.main} />
                                    <Typography variant="h5">Live Website Header</Typography>
                                </Box>
                            }
                            footer={
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="large"
                                        startIcon={<IconDeviceFloppy size="20" />}
                                        onClick={handleSaveHeader}
                                        disabled={activeHeader.length === 0}
                                        sx={{
                                            borderRadius: '12px',
                                            px: 4,
                                            fontWeight: 700,
                                            boxShadow: '0 8px 16px rgba(40, 199, 111, 0.25)'
                                        }}
                                    >
                                        Publish Header Changes
                                    </Button>
                                </Box>
                            }
                        >
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                Arrange items to appear on the header. First item will be left-most.
                            </Typography>

                            <Box sx={{
                                bgcolor: 'rgba(0,0,0,0.01)',
                                maxHeight: 500,
                                overflowY: 'auto',
                                borderRadius: '20px',
                                p: 1,
                                border: '1px solid rgba(0,0,0,0.05)',
                                '&::-webkit-scrollbar': { width: '6px' },
                                '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }
                            }}>
                                {activeHeader.length === 0 ? (
                                    <Box sx={{
                                        height: 350,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0.6
                                    }}>
                                        <IconCirclePlus size="64" color={theme.palette.grey[400]} />
                                        <Typography variant="h6" sx={{ mt: 2 }}>Your Header is Empty</Typography>
                                        <Typography variant="body2">Click (+) on library items to add them here.</Typography>
                                    </Box>
                                ) : (
                                    <List sx={{ p: 0 }}>
                                        {activeHeader.map((item, index) => (
                                            <Zoom in={true} key={index}>
                                                <Paper
                                                    elevation={2}
                                                    sx={{
                                                        mb: 2,
                                                        borderRadius: '16px',
                                                        overflow: 'hidden',
                                                        borderLeft: `6px solid ${theme.palette.success.main}`,
                                                        position: 'relative'
                                                    }}
                                                >
                                                    <ListItem sx={{ py: 2 }}>
                                                        <ListItemIcon sx={{ minWidth: 40, color: 'text.disabled' }}>
                                                            <IconGripVertical size="24" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="h6" fontWeight="800" sx={{ color: theme.palette.text.primary }}>
                                                                    {item.label}
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography variant="body2" sx={{ color: theme.palette.success.dark, fontWeight: 500, fontFamily: 'monospace' }}>
                                                                    {item.url}
                                                                </Typography>
                                                            }
                                                        />

                                                        {/* Step Badge */}
                                                        <Box sx={{ mr: 2 }}>
                                                            <Chip
                                                                label={index + 1}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: '900',
                                                                    bgcolor: theme.palette.success.main,
                                                                    color: '#fff',
                                                                    fontSize: '14px'
                                                                }}
                                                            />
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(0,0,0,0.03)', borderRadius: '10px', p: 0.5 }}>
                                                            <Tooltip title="Move Higher">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => moveItem(index, 'up')}
                                                                    disabled={index === 0}
                                                                    sx={{ color: theme.palette.primary.main }}
                                                                >
                                                                    <IconArrowUp size="20" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Move Lower">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => moveItem(index, 'down')}
                                                                    disabled={index === activeHeader.length - 1}
                                                                    sx={{ color: theme.palette.primary.main }}
                                                                >
                                                                    <IconArrowDown size="20" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />
                                                            <Tooltip title="Discard">
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{ color: theme.palette.error.main }}
                                                                    onClick={() => removeItemFromHeader(index)}
                                                                >
                                                                    <IconTrash size="20" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </ListItem>
                                                </Paper>
                                            </Zoom>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        </ParentCard>
                    </Grid>
                </Grid>
            </Box>

            {/* Premium Styled Dialog */}
            <Dialog
                open={openPoolDialog}
                onClose={() => setOpenPoolDialog(false)}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: { borderRadius: '24px', p: 1 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', pb: 1 }}>
                    {editingPoolLabel ? 'Refine Label' : 'New Master Entry'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Changes here will affect what you can add to your web navigation.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                        <TextField
                            label="Display Name"
                            placeholder="e.g. Help Center"
                            fullWidth
                            variant="outlined"
                            autoFocus
                            value={poolFormData.label}
                            onChange={(e) => setPoolFormData({ ...poolFormData, label: e.target.value })}
                            InputProps={{ sx: { borderRadius: '12px' } }}
                        />
                        <TextField
                            select
                            label="Target URL"
                            fullWidth
                            variant="outlined"
                            value={poolFormData.url}
                            onChange={(e) => setPoolFormData({ ...poolFormData, url: e.target.value })}
                            InputProps={{ sx: { borderRadius: '12px' } }}
                            helperText="Choose where this link will direct users"
                        >
                            {URL_CHOICES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{option.value}</Typography>
                                        <Typography variant="caption" color="textSecondary">{option.label}</Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                            {/* In case of existing custom URLs, show them to avoid broken states */}
                            {poolFormData.url && !URL_CHOICES.find(opt => opt.value === poolFormData.url) && (
                                <MenuItem value={poolFormData.url}>
                                    {poolFormData.url} (Custom)
                                </MenuItem>
                            )}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        onClick={() => setOpenPoolDialog(false)}
                        sx={{ fontWeight: 600, color: 'text.secondary' }}
                    >
                        Maybe Later
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSavePoolLabel}
                        sx={{ borderRadius: '12px', px: 3, fontWeight: 700 }}
                    >
                        {editingPoolLabel ? 'Update Label' : 'Add to Library'}
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default HeaderManagement;


import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Switch,
    FormControlLabel,
    InputAdornment,
} from '@mui/material';
import { IconEdit, IconTrash, IconPlus, IconSearch } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import axios from 'axios';
import { URLS } from 'src/Url';
import { toast, ToastContainer } from 'react-toastify';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Careers' },
    { title: 'Job Roles' },
];

const CareersRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [currentRole, setCurrentRole] = useState({ name: '', status: 'active' });
    const [isEdit, setIsEdit] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const getToken = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user)?.token : '';
    };

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get(URLS.CareersRoles, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data;
            const rolesList = Array.isArray(data?.data) ? data.data : (Array.isArray(data?.roles) ? data.roles : (Array.isArray(data) ? data : []));
            setRoles(rolesList);
        } catch (error) {
            console.error('Error fetching roles:', error);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleOpen = (role = null) => {
        if (role) {
            setCurrentRole(role);
            setIsEdit(true);
        } else {
            setCurrentRole({ name: '', status: 'active' });
            setIsEdit(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentRole({ name: '', status: 'active' });
    };

    const handleSave = async () => {
        if (!currentRole.name.trim()) {
            toast.error('Role name is required');
            return;
        }

        try {
            const token = getToken();
            if (isEdit) {
                await axios.put(`${URLS.CareersUpdateRole}${currentRole._id}`, currentRole, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Role updated successfully');
            } else {
                await axios.post(URLS.CareersRoles, currentRole, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Role added successfully');
            }
            fetchRoles();
            handleClose();
        } catch (error) {
            console.error('Error saving role:', error);
            toast.error('Failed to save role');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this role?')) return;
        try {
            const token = getToken();
            // Assuming DELETE method is supported or user defined PUT for delete logic? 
            // User said "Actions: ... Delete". I'll assume DELETE method or PUT status. 
            // Usually DELETE /roles/:id or similar. The user didn't explicitly specify DELETE endpoint but implied functionality.
            // I'll try axios.delete, if fails I'll check if they use POST for delete.
            // URLS.CareersRoles usually points to base. I'll assume endpoint adherence.
            await axios.delete(`${URLS.CareersDeleteRole}${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Role deleted');
            fetchRoles();
        } catch (error) {
            console.error('Error deleting role:', error);
            toast.error('Failed to delete role');
        }
    };

    const filteredRoles = roles.filter((role) =>
        role.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageContainer title="Job Roles Management" description="Manage job roles for careers page">
            <Breadcrumb title="Job Roles" items={BCrumb} />
            <ToastContainer />

            <ParentCard title="Job Roles">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <TextField
                        placeholder="Search Roles..."
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
                    />
                    <Button
                        variant="contained"
                        color="primary" // Should filter to #0d5959 via theme if configured, otherwise default primary
                        startIcon={<IconPlus />}
                        onClick={() => handleOpen()}
                        sx={{ backgroundColor: '#0d5959', '&:hover': { backgroundColor: '#084040' } }}
                    >
                        Add New Role
                    </Button>
                </Box>

                <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>S.No.</TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Role Name</TableCell>
                                <TableCell sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#0d5959', color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRoles.length > 0 ? (
                                filteredRoles.map((role, index) => (
                                    <TableRow key={role._id || role.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {role.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={role.status === 'active' ? 'Active' : 'Inactive'}
                                                color={role.status === 'active' ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleOpen(role)} color="primary">
                                                <IconEdit size={20} />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(role._id || role.id)} color="error">
                                                <IconTrash size={20} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No roles found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </ParentCard>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{isEdit ? 'Edit Role' : 'Add New Role'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label="Role Name"
                            fullWidth
                            value={currentRole.name}
                            onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={currentRole.status === 'active'}
                                    onChange={(e) => setCurrentRole({ ...currentRole, status: e.target.checked ? 'active' : 'inactive' })}
                                    color="primary"
                                />
                            }
                            label="Active Status"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#0d5959' }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default CareersRoles;

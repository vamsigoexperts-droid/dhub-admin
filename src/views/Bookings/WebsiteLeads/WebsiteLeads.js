import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { URLS } from 'src/Url';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Website Leads' },
];

const WebsiteLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const user = localStorage.getItem('user');
            const token = user ? JSON.parse(user)?.token : '';

            const response = await axios.get(URLS.GetWebsiteLeads, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setLeads(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
            toast.error('Failed to fetch leads');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    return (
        <PageContainer title="Website Leads" description="Leads from website contact form">
            <Breadcrumb title="Website Leads" items={BCrumb} />
            <Box sx={{ p: 3 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>S/No</TableCell>
                                <TableCell>Lead Info</TableCell>
                                <TableCell>Role (I am)</TableCell>
                                <TableCell>Message</TableCell>
                                <TableCell>Verification</TableCell>
                                <TableCell>Submitted Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">Loading...</TableCell>
                                </TableRow>
                            ) : leads.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No leads found</TableCell>
                                </TableRow>
                            ) : (
                                leads.map((lead, index) => (
                                    <TableRow key={lead._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle1">{lead.name}</Typography>
                                            <Typography variant="body2" color="textSecondary">{lead.email}</Typography>
                                            <Typography variant="body2" color="textSecondary">WA: {lead.whatsapp}</Typography>
                                        </TableCell>
                                        <TableCell>{lead.iam}</TableCell>
                                        <TableCell sx={{ maxWidth: 300, whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                            {lead.message}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={lead.isVerified ? "Verified" : "Pending"}
                                                color={lead.isVerified ? "success" : "warning"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {lead.logCreatedDate ? new Date(lead.logCreatedDate).toLocaleString() : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </PageContainer>
    );
};

export default WebsiteLeads;

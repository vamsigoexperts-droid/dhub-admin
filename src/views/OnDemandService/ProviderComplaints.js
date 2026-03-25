import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { IconEye, IconTrash } from '@tabler/icons-react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router';
import axios from 'axios';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import { URLS } from '../../Url';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Manage Tickets' }];

const statusColor = (status) => {
  const value = String(status || '').toLowerCase();
  if (['solved', 'resolved'].includes(value)) return 'success';
  if (value === 'in-progress') return 'info';
  if (value === 'closed') return 'error';
  if (value === 'escalated') return 'warning';
  return 'warning';
};

const priorityColor = (priority) => {
  const value = String(priority || '').toLowerCase();
  if (value === 'urgent') return 'error';
  if (value === 'high') return 'warning';
  if (value === 'low') return 'success';
  return 'info';
};

const roleLabel = (role) => {
  if (role === 'provider') return 'Provider';
  if (role === 'customer') return 'Customer';
  return role || 'Unknown';
};

const ProviderComplaints = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const relatedOptions = [
    { label: 'All Categories', value: 'all' },
    { label: 'Booking Issue', value: 'Booking Ops' },
    { label: 'Payment / Refund', value: 'Billing & Wallet' },
    { label: 'Wallet Issue', value: 'Billing & Wallet' },
    { label: 'Service Quality', value: 'Customer Support' },
    { label: 'Address Issue', value: 'Customer Support' },
    { label: 'Technical Support', value: 'Technical Support' },
    { label: 'General Support', value: 'Customer Support' },
  ];

  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch {
      return '';
    }
  };

  const token = getToken();

  const fetchTickets = async (searchQuery = search) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.SupportTicketsList,
        {
          searchQuery: searchQuery,
          status: statusFilter,
          raisedByRole: roleFilter,
          department: departmentFilter,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      setTickets(res.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh when filters change
  useEffect(() => {
    fetchTickets();
  }, [statusFilter, roleFilter, departmentFilter]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTickets(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const handleDelete = async (ticket) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (!window.confirm(`Delete support ticket ${ticket.ticketId}?`)) {
      return;
    }

    try {
      await axios.delete(URLS.DeleteSupportTicket(ticket._id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Ticket deleted successfully');
      fetchTickets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete ticket');
    }
  };

  const rows = useMemo(
    () =>
      tickets.map((ticket) => ({
        id: ticket._id,
        ...ticket,
      })),
    [tickets],
  );

  const columns = useMemo(
    () => [
      {
        field: 'index',
        headerName: 'S. No',
        flex: 0.4,
        sortable: false,
        renderCell: (params) => params.api.getSortedRowIds().indexOf(params.id) + 1,
      },
      {
        field: 'ticketId',
        headerName: 'Ticket ID',
        flex: 0.9,
      },
      {
        field: 'raisedByRole',
        headerName: 'Type',
        flex: 0.8,
        renderCell: (params) => (
          <Chip size="small" label={roleLabel(params.row.raisedByRole)} variant="outlined" />
        ),
      },
      {
        field: 'name',
        headerName: 'Name',
        flex: 1.2,
      },
      {
        field: 'department',
        headerName: 'Related To',
        flex: 1.2,
      },
      {
        field: 'priority',
        headerName: 'Priority',
        flex: 0.8,
        renderCell: (params) => (
          <Chip size="small" color={priorityColor(params.row.priority)} label={params.row.priority || 'Medium'} />
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.9,
        renderCell: (params) => (
          <Chip size="small" color={statusColor(params.row.status)} label={String(params.row.status || 'pending').toUpperCase()} />
        ),
      },
      {
        field: 'date',
        headerName: 'Date',
        flex: 0.8,
      },
      {
        field: 'time',
        headerName: 'Time',
        flex: 0.8,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 0.9,
        sortable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => {
                localStorage.setItem('supportTicketId', params.row._id);
                navigate('/view-provider-complaints');
              }}
            >
              <IconEye size={16} />
            </Button>
            <Button size="small" variant="contained" color="error" onClick={() => handleDelete(params.row)}>
              <IconTrash size={16} />
            </Button>
          </Box>
        ),
      },
    ],
    [navigate, tickets],
  );

  return (
    <PageContainer title="Manage Tickets" description="Unified customer and provider support tickets">
      <Breadcrumb title="Manage Tickets" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2} gap={2} flexWrap="wrap">
          <Typography variant="h6">Support Tickets ({tickets.length})</Typography>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select value={statusFilter} label="Status Filter" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="open">Open / Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="waiting-customer">Waiting Customer</MenuItem>
                <MenuItem value="waiting-provider">Waiting Provider</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Role Filter</InputLabel>
              <Select value={roleFilter} label="Role Filter" onChange={(e) => setRoleFilter(e.target.value)}>
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="provider">Provider</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Related To</InputLabel>
              <Select value={departmentFilter} label="Related To" onChange={(e) => setDepartmentFilter(e.target.value)}>
                {relatedOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <CustomTextField
              size="small"
              placeholder="Search by ticket, name, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 220, sm: 300 }, bgcolor: 'white' }}
            />
            <Button variant="contained" onClick={() => fetchTickets()} disabled={loading}>
              Refresh
            </Button>
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[10, 20, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
          />
        </CardContent>
      </Paper>
    </PageContainer>
  );
};


export default ProviderComplaints;

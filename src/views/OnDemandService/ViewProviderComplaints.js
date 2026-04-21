import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Link,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { URLS } from '../../Url';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/ondemandservice/provider-complaints', title: 'Manage Tickets' },
  { title: 'Ticket Details' },
];

const ViewProviderComplaints = () => {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [status, setStatus] = useState('open');

  const ticketId = localStorage.getItem('supportTicketId');

  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch {
      return '';
    }
  };

  const token = getToken();

  const buildFileUrl = (filePath) => {
    if (!filePath) return '';
    if (/^https?:\/\//i.test(filePath)) return filePath;
    return `${URLS.FileBase}${String(filePath).replace(/^\/+/, '')}`;
  };

  const isImageFile = (filePath) => /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(String(filePath || ''));

  const renderAttachments = (attachments = []) => {
    if (!attachments.length) return null;

    return (
      <Stack spacing={1.5} mt={1.5}>
        {attachments.map((attachment, index) => {
          const fileUrl = buildFileUrl(attachment);
          const image = isImageFile(attachment);
          const fileName = String(attachment).split('/').pop() || `Attachment ${index + 1}`;

          return (
            <Paper
              key={`${attachment}-${index}`}
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: '#FAFBFC',
              }}
            >
              <Stack spacing={1}>
                <Link
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                  sx={{ fontWeight: 600, wordBreak: 'break-all' }}
                >
                  {fileName}
                </Link>
                {image ? (
                  <Box
                    component="img"
                    src={fileUrl}
                    alt={fileName}
                    sx={{
                      width: '100%',
                      maxHeight: 240,
                      objectFit: 'contain',
                      borderRadius: 2,
                      border: '1px solid #E5E7EB',
                      bgcolor: 'background.paper',
                    }}
                  />
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    component="a"
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    View Document
                  </Button>
                )}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    );
  };

  const fetchTicket = async () => {
    if (!ticketId || !token) return;
    setLoading(true);
    try {
      const res = await axios.get(URLS.SupportTicketById(ticketId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTicket(res.data?.data || null);
      setStatus(res.data?.data?.status || 'open');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ticketId) {
      navigate('/ondemandservice/provider-complaints');
      return;
    }
    fetchTicket();
  }, [ticketId]);

  const updateStatus = async () => {
    try {
      await axios.put(
        URLS.UpdateSupportTicket(ticketId),
        { status },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
      );
      toast.success('Ticket updated successfully');
      fetchTicket();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update ticket');
    }
  };

  const sendReply = async (isInternal = false) => {
    const content = isInternal ? internalNote : message;
    if (!content.trim()) {
      toast.error(isInternal ? 'Please enter an internal note' : 'Please enter a reply');
      return;
    }

    try {
      await axios.post(
        URLS.ReplySupportTicket(ticketId),
        { message: content, isInternalNote: isInternal },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
      );
      toast.success(isInternal ? 'Internal note saved' : 'Reply sent successfully');
      if (isInternal) {
        setInternalNote('');
      } else {
        setMessage('');
      }
      fetchTicket();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reply');
    }
  };

  return (
    <PageContainer title="Ticket Details" description="Support ticket conversation">
      <Breadcrumb title="Ticket Details" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {!ticket ? (
        <Paper sx={{ p: 3 }}>
          <Typography>{loading ? 'Loading ticket...' : 'Ticket not found'}</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" mb={2}>
                Conversation
              </Typography>
              <Stack spacing={2} sx={{ maxHeight: 420, overflowY: 'auto', pr: 1 }}>
                {(ticket.messages || []).map((item) => (
                  <Box
                    key={item._id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: item.isInternalNote ? '#FFF8E1' : item.senderRole === 'admin' ? '#E3F2FD' : '#F8FAFC',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="700">
                      {item.senderName || item.senderRole}
                      {item.isInternalNote ? ' (Internal Note)' : ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {item.logCreatedDate || ''}
                    </Typography>
                    <Typography variant="body1" whiteSpace="pre-wrap">
                      {item.message}
                    </Typography>
                    {item.attachments?.length ? renderAttachments(item.attachments) : null}
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" mb={1}>
                Reply to user
              </Typography>
              <TextField
                multiline
                minRows={3}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your reply..."
              />
              <Box mt={2}>
                <Button variant="contained" onClick={() => sendReply(false)}>
                  Send Reply
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" mb={1}>
                Internal note
              </Typography>
              <TextField
                multiline
                minRows={3}
                fullWidth
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Visible only to admins..."
              />
              <Box mt={2}>
                <Button variant="outlined" onClick={() => sendReply(true)}>
                  Save Internal Note
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" mb={2}>
                {ticket.ticketId}
              </Typography>
              <Stack spacing={1.5}>
                <Typography><strong>Raised By:</strong> {ticket.name || 'N/A'}</Typography>
                <Typography><strong>Role:</strong> {ticket.raisedByRole}</Typography>
                <Typography><strong>Email:</strong> {ticket.email || 'N/A'}</Typography>
                <Typography><strong>Phone:</strong> {ticket.phone || 'N/A'}</Typography>
                <Typography><strong>Title:</strong> {ticket.title}</Typography>
                <Typography><strong>Subject:</strong> {ticket.subject || 'N/A'}</Typography>
                <Typography><strong>Priority:</strong> {ticket.priority}</Typography>
                <Typography><strong>Department:</strong> {ticket.department}</Typography>
                <Typography><strong>Service Vertical:</strong> {ticket.serviceVertical}</Typography>
                <Typography><strong>Created:</strong> {ticket.date} {ticket.time}</Typography>
                <Box>
                  <Chip label={String(ticket.status || 'open').toUpperCase()} color="primary" />
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2} alignItems="center">
                <Select size="small" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 180 }}>
                  <MenuItem value="open">Open / Pending</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="waiting-customer">Waiting Customer</MenuItem>
                  <MenuItem value="waiting-provider">Waiting Provider</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                  <MenuItem value="escalated">Escalated</MenuItem>
                </Select>
                <Button variant="contained" onClick={updateStatus}>
                  Update Status
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}
    </PageContainer>
  );
};

export default ViewProviderComplaints;


import React, { useState, useEffect, useMemo, useRef } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import CustomTextField from '../theme-elements/CustomTextField';
import CustomFormLabel from '../theme-elements/CustomFormLabel';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { URLS } from 'src/Url';
import axios from 'axios';
import {
  TextField,
  Paper,
  Box,
  Divider,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Card,
  InputAdornment,
} from '@mui/material';
import {
  IconMail,
  IconBrandWhatsapp,
  IconUserCancel,
  IconSend,
  IconDotsVertical,
  IconUser,
  IconPhone,
  IconCalendar,
  IconSearch,
  IconEye,
  IconTrash,
} from '@tabler/icons-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomCKEditor from '../../components/theme-elements/CustomCKEditor';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Users' }];

const getAuthToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || '';
  } catch (error) {
    console.error('Error parsing user token:', error);
    return '';
  }
};

const Users = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState({
    fetch: false,
    submit: false,
    delete: false,
    mail: false,
  });

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openMailModal, setOpenMailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);

  const [blockForm, setBlockForm] = useState({ blockedReason: '' });
  const [mailForm, setMailForm] = useState({
    subject: '',
    messageHtml: '',
  });

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const token = getAuthToken();
  const editorRef = useRef(null);

  const handleView = (data) => {
    localStorage.setItem('userId', data._id);
    navigate(`/view-user`);
  };

  const handleActionMenuOpen = (event, user) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
  };

  const handleBlockClick = () => {
    setOpenBlockModal(true);
    handleActionMenuClose();
  };

  const handleDeleteClick = () => {
    setOpenDeleteModal(true);
    handleActionMenuClose();
  };

  const handleMailClick = () => {
    setOpenMailModal(true);
    setMailForm({
      subject: '',
      messageHtml: '',
    });
    handleActionMenuClose();
  };

  const handleWhatsAppClick = () => {
    if (selectedUser?.phone) {
      const phoneNumber = selectedUser.phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${phoneNumber}`;
      window.open(whatsappUrl, '_blank');
    } else {
      toast.error('No phone number available for this user');
    }
    handleActionMenuClose();
  };

  const handleBlockModalClose = () => {
    setOpenBlockModal(false);
    setBlockForm({ blockedReason: '' });
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
  };

  const handleMailModalClose = () => {
    setOpenMailModal(false);
    setMailForm({ subject: '', messageHtml: '' });
  };

  const resetSelectedUser = () => {
    setSelectedUser(null);
  };

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setIsLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const res = await axios.post(
        URLS.GetUsers,
        { status: 'active' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const unblockedUsers = res.data.user;
      setData(unblockedUsers);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

  useEffect(() => {
    getData();
  }, [token]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(
      (item) =>
        `${item.name}`.toLowerCase().includes(search.toLowerCase()) ||
        `${item.email}`.toLowerCase().includes(search.toLowerCase()) ||
        `${item.phone}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  const handleBlockFormChange = (e) => {
    setBlockForm({ ...blockForm, [e.target.name]: e.target.value });
  };

  const handleBlockSubmit = async (e) => {
    e.preventDefault();

    if (!blockForm.blockedReason.trim()) {
      toast.error('Please provide a reason for blocking this user');
      return;
    }

    if (!selectedUser) {
      toast.error('No user selected');
      return;
    }

    setIsLoading((prev) => ({ ...prev, submit: true }));

    try {
      const response = await axios.put(
        `${URLS.UpdateUserStatus}/${selectedUser._id}`,
        {
          status: 'blocked',
          blockedReason: blockForm.blockedReason.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        toast.success(`User ${selectedUser.name} has been blocked successfully`);
        setOpenBlockModal(false);
        setBlockForm({ blockedReason: '' });
        resetSelectedUser();
        getData();
      } else {
        toast.error(response.data.message || 'Failed to block user');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error(error.response?.data?.message || 'Failed to block user');
    } finally {
      setIsLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedUser) {
      toast.error('No user selected');
      return;
    }

    setIsLoading((prev) => ({ ...prev, delete: true }));

    try {
      const response = await axios.put(
        `${URLS.IsDeleteUser}/${selectedUser._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(`User ${selectedUser.name} has been deleted successfully`);
        setOpenDeleteModal(false);
        resetSelectedUser();
        getData();
      } else {
        toast.error(response.data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const handleMailFormChange = (e) => {
    setMailForm({ ...mailForm, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    const plainText = editor.getData({ stripHtml: true });

    setMailForm({
      ...mailForm,
      messageHtml: data,
    });
  };

  const handleMailSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error('No user selected');
      return;
    }

    setIsLoading((prev) => ({ ...prev, mail: true }));

    try {
      const response = await axios.post(
        URLS.UserSendMail,
        {
          sub: mailForm.subject,
          body: mailForm.messageHtml || mailForm.message,
          userId: selectedUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        toast.success(`Email sent successfully to ${selectedUser.email}`);
        setOpenMailModal(false);
        setMailForm({ subject: '', messageHtml: '' });
        resetSelectedUser();
      } else {
        toast.error(response.data.message || 'Failed to send email');
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.success(`Email simulation: Message would be sent to ${selectedUser.email}`);
        setOpenMailModal(false);
        setMailForm({ subject: '', messageHtml: '' });
        resetSelectedUser();
      } else {
        toast.error(error.response?.data?.message || 'Failed to send email');
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, mail: false }));
    }
  };


  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'UserInfo',
        headerName: 'User Info',
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={params.row.image ? `${URLS.FileBase}${params.row.image}` : ''}
              alt={`${params.row.name}`}
              sx={{ width: 40, height: 40 }}
            >
              <IconUser size={20} />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {params.row.name}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'phone',
        headerName: 'Phone',
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={1}>
            <IconPhone size={16} color={theme.palette.text.secondary} />
            <Typography variant="body2">{params.row.phone}</Typography>
          </Box>
        ),
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">{params.row.email}</Typography>
          </Box>
        ),
      },
      {
        field: 'logCreatedDate',
        headerName: 'Joined Date',
        flex: 1,
        renderCell: (params) => {
          const date = new Date(params.row.logCreatedDate);
          return (
            <Box display="flex" alignItems="center" gap={1}>
              <IconCalendar size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2">
                {date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => (
          <Chip
            label="Active"
            size="small"
            color="success"
            variant="outlined"
            icon={<IconEye size={16} />}
          />
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Box>
            <Tooltip title="Actions">
              <IconButton
                size="small"
                onClick={(e) => handleActionMenuOpen(e, params.row)}
                aria-label={`Actions for ${params.row.name}`}
              >
                <IconDotsVertical size={18} />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [theme],
  );

  return (
    <PageContainer title="Users" description="Manage Users for your e-commerce platform">
      <Breadcrumb title="Users" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Paper
        variant="outlined"
        sx={{
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
          <Typography variant="h6">Active Users ({data.length})</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'background.paper' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={18} />
                  </InputAdornment>
                ),
              }}
              aria-label="Search Users"
            />
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={filteredData}
              columns={columns}
              loading={isLoading.fetch}
              pageSizeOptions={[5, 10, 20]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              disableRowSelectionOnClick
              autoHeight
              getRowId={(row) => row._id}
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 200 },
        }}
      >
        {rolesAndPermission.users_view === true || rolesAndPermission.accessAll === true ? (
          <>
            <MenuItem
              onClick={() => {
                handleView(selectedUser);
                handleActionMenuClose();
              }}
            >
              <ListItemIcon>
                <IconEye size={20} />
              </ListItemIcon>
              <ListItemText>View</ListItemText>
            </MenuItem>
          </>
        ) : (
          <></>
        )}

        {rolesAndPermission.users_edit === true || rolesAndPermission.accessAll === true ? (
          <>
            <MenuItem onClick={handleMailClick}>
              <ListItemIcon>
                <IconMail size={20} color={theme.palette.info.main} />
              </ListItemIcon>
              <ListItemText>Send Mail</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleWhatsAppClick} disabled={!selectedUser?.phone}>
              <ListItemIcon>
                <IconBrandWhatsapp size={20} color={theme.palette.success.main} />
              </ListItemIcon>
              <ListItemText>
                Send WhatsApp
                {!selectedUser?.phone && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    No phone number
                  </Typography>
                )}
              </ListItemText>
            </MenuItem>
          </>
        ) : (
          <></>
        )}

        <Divider />
        {rolesAndPermission.users_delete === true || rolesAndPermission.accessAll === true ? (
          <>
            <MenuItem onClick={handleBlockClick}>
              <ListItemIcon>
                <IconUserCancel size={20} color={theme.palette.error.main} />
              </ListItemIcon>
              <ListItemText>Block User</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDeleteClick}>
              <ListItemIcon>
                <IconTrash size={20} color={theme.palette.error.main} />
              </ListItemIcon>
              <ListItemText>Delete User</ListItemText>
            </MenuItem>
          </>
        ) : (
          <></>
        )}
      </Menu>

      {/* Block User Modal */}
      <Dialog open={openBlockModal} onClose={handleBlockModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <IconUserCancel color={theme.palette.error.main} />
            Block User
          </Box>
        </DialogTitle>
        <form onSubmit={handleBlockSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  You are about to block <strong>{selectedUser?.name}</strong>. This action will
                  prevent them from accessing the platform.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="blockedReason">Reason for Blocking*</CustomFormLabel>
                <CustomTextField
                  id="blockedReason"
                  name="blockedReason"
                  value={blockForm.blockedReason}
                  onChange={handleBlockFormChange}
                  placeholder="Please provide a detailed reason for blocking this user..."
                  multiline
                  rows={4}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleBlockModalClose} variant="outlined" disabled={isLoading.submit}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={isLoading.submit || !blockForm.blockedReason.trim()}
              startIcon={
                isLoading.submit ? <CircularProgress size={16} /> : <IconUserCancel size={16} />
              }
            >
              {isLoading.submit ? 'Blocking...' : 'Block User'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete User Modal */}
      <Dialog open={openDeleteModal} onClose={handleDeleteModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <IconTrash color={theme.palette.error.main} />
            Delete User
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            This action cannot be undone. All user data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleDeleteModalClose} variant="outlined" disabled={isLoading.delete}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSubmit}
            variant="contained"
            color="error"
            disabled={isLoading.delete}
            startIcon={isLoading.delete ? <CircularProgress size={16} /> : <IconTrash size={16} />}
          >
            {isLoading.delete ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Mail Modal */}
      <Dialog
        open={openMailModal}
        onClose={handleMailModalClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            height: '80vh',
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <IconMail color={theme.palette.info.main} />
            Send Email to {selectedUser?.name}
          </Box>
        </DialogTitle>
        <form onSubmit={handleMailSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="mailSubject">Subject*</CustomFormLabel>
                <CustomTextField
                  id="mailSubject"
                  name="subject"
                  value={mailForm.subject}
                  onChange={handleMailFormChange}
                  placeholder="Enter email subject..."
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="mailMessage">Message*</CustomFormLabel>
                <Box
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    overflow: 'hidden',
                    '& .ck-editor': {
                      border: 'none !important',
                    },
                    '& .ck-content': {
                      minHeight: '200px',
                      maxHeight: '300px',
                      overflow: 'auto',
                    },
                  }}
                >
                  <CKEditor
                    editor={CustomCKEditor}
                    config={{ placeholder: 'Type your email message here...' }}
                    data={mailForm.messageHtml}
                    onChange={handleEditorChange}
                    onReady={(editor) => {
                      editorRef.current = editor;
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Recipient Information
                  </Typography>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedUser?.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedUser?.name}
                    </Typography>
                    {selectedUser?.phone && (
                      <Typography variant="body2">
                        <strong>Phone:</strong> {selectedUser.phone}
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleMailModalClose} variant="outlined" disabled={isLoading.mail}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="info"
              startIcon={isLoading.mail ? <CircularProgress size={16} /> : <IconSend size={16} />}
            >
              {isLoading.mail ? 'Sending...' : 'Send Email'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default Users;


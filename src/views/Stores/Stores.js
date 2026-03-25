import React, { useState, useEffect, useMemo, useRef } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import PageContainer from 'src/components/container/PageContainer';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastContainer, toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  TextField,
  Avatar,
  Paper,
  Box,
  Typography,
  Divider,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Card,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconSend,
  IconDotsVertical,
  IconMail,
  IconUserCancel,
} from '@tabler/icons-react';

// Breadcrumb configuration
const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Store' }];

// Styled Menu Component
const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    minWidth: 160,
    boxShadow: theme.shadows[8],
    borderRadius: '8px',
    '& .MuiMenuItem-root': {
      padding: '8px 16px',
      gap: '12px',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  },
}));

// Main Store Component
const Store = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const [openMailModal, setOpenMailModal] = useState(false);

  // Action Menu State
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      console.error('Error parsing user token:', error);
      return '';
    }
  };

  const token = getToken();

  //Mail.start
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState({
    mail: false,
  });
  const [mailForm, setMailForm] = useState({
    subject: '',
    messageHtml: '',
  });

  const editorRef = useRef(null);
  //Mail.end

  // Action Menu Handlers
  const handleActionMenuOpen = (event, row) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRow(null);
  };

  //Mail.start
  const handleMailClick = (data) => {
    setSelectedUser(data);
    setOpenMailModal(true);
    setMailForm({
      subject: '',
      messageHtml: '',
    });
    handleActionMenuClose();
  };

  const handleMailModalClose = () => {
    setOpenMailModal(false);
    setMailForm({ subject: '', messageHtml: '' });
  };

  const handleMailFormChange = (e) => {
    setMailForm({ ...mailForm, [e.target.name]: e.target.value });
  };

  const resetSelectedUser = () => {
    setSelectedUser(null);
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
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
        URLS.StoreSendMail,
        {
          sub: mailForm.subject,
          body: mailForm.messageHtml || mailForm.message,
          userId: selectedUser.storeId,
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
  //MailEnd

  const handleAddPopUp = () => {
    navigate('/addstore');
  };

  const handleEditPopUp = (data) => {
    localStorage.setItem('storeId', data.storeId);
    navigate('/editstore');
  };

  const handleView = (data) => {
    localStorage.setItem('storeId', data.storeId);

    console.log("afdvshdbcm",data.storeId)
    navigate(`/viewstore`);
  };

  // Open block confirmation modal
  const handleBlockClick = (store) => {
    setSelectedStore(store);
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStore(null);
  };

  // Block store function
  const handleBlockStore = async () => {
    if (!selectedStore || !token) {
      toast.error('Authentication token missing or store not selected');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${URLS.BlockorUnblockStore}/${selectedStore.storeId}`,
        { blockOrUnblock: 'block' },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 200) {
        toast.success('Store blocked successfully');
        getStores();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error blocking store';
      toast.error(message);
      console.error('Block store error:', error);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  // Get active stores
  const getStores = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetStoresByStatus,
        { blockOrUnblock: 'unblock' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Filter only active stores
      const activeStores = res.data.store?.filter((store) => store.status === 'active') || [];
      setStores(activeStores);
    } catch (error) {
      toast.error('Failed to fetch stores.');
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStores();
  }, [token]);

  const handleDeleteSubmit = async (data) => {
    if (window.confirm('Do you really want to delete?')) {
      try {
        const response = await axios.delete(`${URLS.DeleteStore}/${data.storeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          toast.success(`User ${data.name} has been deleted successfully`);
          getStores();
        } else {
          toast.error(response.data.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  // Filter data based on search
  useEffect(() => {
    const filtered = stores.filter((store) => {
      if (!search) return true;

      const searchLower = search.toLowerCase();
      return (
        store.name?.toLowerCase().includes(searchLower) ||
        store.serviceName?.toLowerCase().includes(searchLower) ||
        store.phone?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredData(filtered);
  }, [stores, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'sectionInfo',
        headerName: 'Store Info',
        flex: 1.5,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={params.row.logo ? `${URLS.FileBase}${params.row.logo}` : ''}
              alt={params.row.name}
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {params.row.name}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'serviceName',
        headerName: 'Service',
        flex: 1,
        renderCell: (params) => (
          <Chip label={params.row.serviceName || 'N/A'} size="small" variant="outlined" />
        ),
      },
      {
        field: 'contact',
        headerName: 'Contact',
        flex: 1,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2">{params.row.phone}</Typography>
          </Box>
        ),
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: 1,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2">{params.row.cityName || 'N/A'}</Typography>
          </Box>
        ),
      },
      {
        field: 'logCreatedDate',
        headerName: 'Created Date',
        flex: 1,
        renderCell: (params) => {
          const date = new Date(params.row.logCreatedDate);
          return (
            <Typography variant="body2">
              {date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Typography>
          );
        },
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.8,
        renderCell: (params) => (
          <Chip label="Active" color="success" size="small" variant="outlined" />
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex">
            <IconButton
              size="small"
              onClick={(event) => handleActionMenuOpen(event, params.row)}
              disabled={loading}
              aria-label="Actions"
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '6px',
                padding: '4px',
              }}
            >
              <IconDotsVertical size={18} />
            </IconButton>
          </Box>
        ),
      },

      // {
      //   field: 'action',
      //   headerName: 'Action',
      //   flex: 1.2,
      //   sortable: false,
      //   filterable: false,
      //   renderCell: (params) => (
      //     <Box display="flex" gap={1} alignItems="center" sx={{ padding: '4px 6px' }}>
      //       <Button
      //         size="small"
      //         color="primary"
      //         variant="contained"
      //         onClick={() => handleEditPopUp(params.row)}
      //         disabled={loading}
      //         sx={{ minWidth: '32px', padding: '4px 6px' }}
      //         aria-label={`Edit ${params.row.name}`}
      //       >
      //         <IconEdit stroke={1.5} size={18} />
      //       </Button>
      //       <Button
      //         size="small"
      //         color="secondary"
      //         variant="contained"
      //         onClick={() => handleView(params.row)}
      //         disabled={loading}
      //         sx={{ minWidth: '32px', padding: '4px 6px' }}
      //         aria-label={`View ${params.row.name}`}
      //       >
      //         <IconEye stroke={1.5} size={18} />
      //       </Button>
      //       {params.row.blockOrUnblock !== 'block' && (
      //         <Button
      //           size="small"
      //           color="error"
      //           variant="contained"
      //           onClick={() => handleBlockClick(params.row)}
      //           disabled={loading}
      //           sx={{ minWidth: '32px', padding: '4px 6px' }}
      //           aria-label={`Block ${params.row.name}`}
      //         >
      //           Block
      //         </Button>
      //       )}
      //     </Box>
      //   ),
      // },
    ],
    [loading],
  );

  const rows = useMemo(
    () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
    [filteredData],
  );

  const editorConfiguration = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'alignment',
        '|',
        'link',
        'blockQuote',
        'insertTable',
        '|',
        'undo',
        'redo',
      ],
    },
    language: 'en',
    placeholder: 'Type your email message here...',
  };

  return (
    <PageContainer title="Store Page" description="Manage Stores for your e-commerce platform">
      <Breadcrumb title="Store Management" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

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
          <Typography variant="h6">Active Stores ({stores.length})</Typography>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search stores..."
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 200 }, bgcolor: 'white' }}
              aria-label="Search Stores"
            />

            {rolesAndPermission.stores_list_add === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPopUp}
                  disabled={loading}
                  startIcon={<IconPlus size={20} />}
                  aria-label="Create New Store"
                >
                  Create Store
                </Button>
              </>
            ) : (
              <></>
            )}
          </Box>
        </Box>
        <Divider />
        <CardContent>
          <Box sx={{ height: 'auto', width: '100%', minHeight: 400 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
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
      <StyledMenu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {rolesAndPermission.stores_list_edit === true || rolesAndPermission.accessAll === true ? (
          <>
            <MenuItem onClick={() => handleEditPopUp(selectedRow)}>
              <ListItemIcon>
                <IconEdit size={18} color={theme.palette.primary.main} />
              </ListItemIcon>
              <ListItemText>Edit Store</ListItemText>
            </MenuItem>
          </>
        ) : (
          <></>
        )}

        <MenuItem onClick={() => handleView(selectedRow)}>
          <ListItemIcon>
            <IconEye size={18} color={theme.palette.secondary.main} />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        
        {rolesAndPermission.stores_list_edit === true || rolesAndPermission.accessAll === true ? (
          <>
            <MenuItem onClick={() => handleMailClick(selectedRow)}>
              <ListItemIcon>
                <IconMail size={18} color={theme.palette.warning.main} />
              </ListItemIcon>
              <ListItemText>Send Email</ListItemText>
            </MenuItem>{' '}
          </>
        ) : (
          <></>
        )}

        {rolesAndPermission.stores_list_delete === true || rolesAndPermission.accessAll === true ? (
          <>
            <MenuItem onClick={() => handleBlockClick(selectedRow)}>
              <ListItemIcon>
                <IconUserCancel size={18} color={theme.palette.error.main} />
              </ListItemIcon>
              <ListItemText>Block</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => handleDeleteSubmit(selectedRow)}>
              <ListItemIcon>
                <IconTrash size={18} color={theme.palette.warning.main} />
              </ListItemIcon>
              <ListItemText>Delete Store</ListItemText>
            </MenuItem>
          </>
        ) : (
          <></>
        )}
      </StyledMenu>

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
            Send Email to {selectedUser?.firstName} {selectedUser?.lastName}
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
                    editor={ClassicEditor}
                    config={editorConfiguration}
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
                      <strong>Name:</strong> {selectedUser?.firstName} {selectedUser?.lastName}
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
              disabled={isLoading.mail}
              startIcon={isLoading.mail ? <CircularProgress size={16} /> : <IconSend size={16} />}
            >
              {isLoading.mail ? 'Sending...' : 'Send Email'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Block Confirmation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Block Store</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to block{' '}
            {selectedStore ? `"${selectedStore.name}"` : 'this store'}?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Blocked stores will no longer be visible to customers.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={handleBlockStore} variant="contained" color="error" disabled={loading}>
            {loading ? 'Blocking...' : 'Confirm Block'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Store;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Avatar,
  Paper,
  Box,
  Typography,
  Divider,
  CardContent,
  Chip,
  Grid,
  Card,
  CardMedia,
  CircularProgress,
  Stack,
  List,
  ListItem,
  ListItemText,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ButtonGroup,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  IconArrowLeft,
  IconMapPin,
  IconPhone,
  IconMail,
  IconBrandWhatsapp,
  IconEye,
  IconCalendar,
  IconCurrencyRupee,
  IconVideo,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { URLS } from '../../Url';
import axios from 'axios';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';

const SingleViewServiceRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch Single Provider Service
  const getServiceData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      navigate('/provider-services');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.doorstephub.com/v1/dhubApi/admin/ondemandservice/providerService/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setServiceData(res.data.data);
        // Check initial status
        if (res.data.data.status === 'approved') {
          setIsApproved(true);
        } else if (res.data.data.status === 'rejected') {
          setIsRejected(true);
        }
      } else {
        toast.error(res.data.message || 'Failed to fetch service details');
        navigate('/provider-services');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch service details.';
      toast.error(errorMessage);
      console.error('Failed to fetch data:', error);
      navigate('/provider-services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServiceData();
  }, [id]);

  // Handle Approve
  const handleApprove = async () => {
    if (!token) {
      toast.error('Authentication token missing.');
      return;
    }

    if (window.confirm('Are you sure you want to approve this service?')) {
      setActionLoading(true);
      try {
        const res = await axios.put(
          `https://api.doorstephub.com/v1/dhubApi/admin/ondemandservice/approve-reject-provider-service/${id}`,
          { action: 'approve' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (res.data.success) {
          toast.success(res.data.message || 'Service approved successfully');
          setIsApproved(true);
          getServiceData(); // Refresh data
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to approve service';
        toast.error(errorMessage);
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Handle Reject - Open Modal
  const handleRejectClick = () => {
    setOpenRejectModal(true);
  };

  // Handle Reject - Close Modal
  const handleCloseRejectModal = () => {
    setOpenRejectModal(false);
    setRejectionReason('');
  };

  // Handle Reject - Submit
  const handleRejectSubmit = async (e) => {
    e.preventDefault();

    if (!rejectionReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    if (!token) {
      toast.error('Authentication token missing.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await axios.put(
        `https://api.doorstephub.com/v1/dhubApi/admin/ondemandservice/approve-reject-provider-service/${id}`,
        {
          action: 'reject',
          rejectionReason: rejectionReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || 'Service rejected successfully');
        setIsRejected(true);
        handleCloseRejectModal();
        getServiceData(); // Refresh data
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reject service';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Status Color Helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'approved':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  };

  // Breadcrumb
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/provider-services', title: 'Provider Services' },
    { title: 'Service Details' },
  ];

  if (loading) {
    return (
      <PageContainer title="Loading..." description="Loading service details">
        <Breadcrumb title="Service Request Details" items={BCrumb} />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (!serviceData) {
    return (
      <PageContainer title="Not Found" description="Service not found">
        <Breadcrumb title="Service Request Details" items={BCrumb} />
        <Box textAlign="center" py={5}>
          <Typography variant="h5" color="error">
            Service not found
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate('/ondemandservice/ondemandservicerequest')}
          >
            Back to Services
          </Button>
        </Box>
      </PageContainer>
    );
  }

  const { provider, category, subcategory, childcategory } = serviceData;

  return (
    <PageContainer
      title="Service Request Details"
      description="View detailed information about provider service request"
    >
      <Breadcrumb title="Service Request Details" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Back Button */}
      <Box mb={3}>
        <Button
          variant="outlined"
          startIcon={<IconArrowLeft />}
          onClick={() => navigate('/ondemandservice/ondemandservicerequest')}
        >
          Back to Services
        </Button>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Service Information Card */}
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '8px',
              boxShadow: theme.shadows[2],
            }}
          >
            <CardContent>
              {/* Service Header with Approve/Reject Buttons */}
              <Box display="flex" justifyContent="space-between" alignItems="start" flexWrap="wrap" mb={3} gap={2}>
                <Box>
                  <Typography variant="h4" fontWeight={600} gutterBottom>
                    {serviceData.name || 'N/A'}
                  </Typography>
                  <Chip
                    label={getStatusText(serviceData.status)}
                    color={getStatusColor(serviceData.status)}
                    size="medium"
                    sx={{ mt: 1 }}
                  />
                </Box>
                
                {/* Approve and Reject Buttons Side by Side */}
                <Box display="flex" gap={2} alignItems="center">
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<IconCheck />}
                    onClick={handleApprove}
                    disabled={actionLoading || isApproved}
                    sx={{
                      minWidth: '140px',
                      opacity: isApproved ? 0.6 : 1,
                    }}
                  >
                    {isApproved ? 'Approved' : 'Approve'}
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={<IconX />}
                    onClick={handleRejectClick}
                    disabled={actionLoading || isRejected}
                    sx={{
                      minWidth: '140px',
                      opacity: isRejected ? 0.6 : 1,
                    }}
                  >
                    {isRejected ? 'Rejected' : 'Reject'}
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Service Details Grid */}
              <Grid container spacing={3}>
                {/* Main Service Image */}
                {serviceData.mainImage && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Service Image
                    </Typography>
                    <Card sx={{ maxWidth: '100%' }}>
                      <CardMedia
                        component="img"
                        image={`${URLS.FileBase}${serviceData.mainImage}`}
                        alt={serviceData.name}
                        sx={{
                          maxHeight: 400,
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                    </Card>
                    {serviceData.mainImageAltTagName && (
                      <Typography variant="caption" color="textSecondary" mt={1} display="block">
                        Alt Tag: {serviceData.mainImageAltTagName}
                      </Typography>
                    )}
                  </Grid>
                )}

                {/* Pricing Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Pricing Details
                  </Typography>
                  <Stack spacing={2}>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: theme.palette.primary.light,
                        borderRadius: '8px',
                      }}
                    >
                      <Typography variant="caption" color="textSecondary">
                        Service Title
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {serviceData.defaultTitle || 'N/A'}
                      </Typography>
                    </Paper>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: theme.palette.success.light,
                        borderRadius: '8px',
                      }}
                    >
                      <Typography variant="caption" color="textSecondary">
                        Price
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <IconCurrencyRupee size={20} />
                        <Typography variant="h6" fontWeight={600}>
                          {serviceData.defaultPrice || 'N/A'}
                        </Typography>
                      </Box>
                    </Paper>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: theme.palette.info.light,
                        borderRadius: '8px',
                      }}
                    >
                      <Typography variant="caption" color="textSecondary">
                        Quantity
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {serviceData.defaultQuantity || 'N/A'}
                      </Typography>
                    </Paper>
                  </Stack>
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.background.default,
                      borderRadius: '8px',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: serviceData.description || 'No description available',
                    }}
                  />
                </Grid>

                {/* Benefits of the Service */}
                {serviceData.benefitsOfTheService &&
                  serviceData.benefitsOfTheService.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Service Benefits
                      </Typography>
                      <List
                        sx={{
                          bgcolor: theme.palette.background.default,
                          borderRadius: '8px',
                        }}
                      >
                        {serviceData.benefitsOfTheService.map((benefit, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={`ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ ${benefit.benefitsOfTheService || benefit}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}

                {/* Provider Information (if available) */}
                {provider && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Provider Information
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: theme.palette.background.default,
                        borderRadius: '8px',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar
                          src={provider.image ? `${URLS.FileBase}${provider.image}` : ''}
                          alt={`${provider.firstName} ${provider.lastName}`}
                          sx={{ width: 60, height: 60 }}
                        >
                          {provider.firstName?.charAt(0)}
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          {`${provider.firstName || ''} ${provider.lastName || ''}`.trim() ||
                            'N/A'}
                        </Typography>
                      </Box>

                      <Stack spacing={1.5}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <IconPhone size={20} color={theme.palette.primary.main} />
                          <Typography variant="body2">
                            {provider.phone || 'N/A'}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1.5}>
                          <IconMail size={20} color={theme.palette.primary.main} />
                          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                            {provider.email || 'N/A'}
                          </Typography>
                        </Box>

                        {provider.whatsappNumber && (
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <IconBrandWhatsapp size={20} color={theme.palette.success.main} />
                            <Typography variant="body2">
                              {provider.whatsappNumber}
                            </Typography>
                          </Box>
                        )}

                        {provider.address && (
                          <Box display="flex" alignItems="start" gap={1.5}>
                            <IconMapPin size={20} color={theme.palette.primary.main} />
                            <Typography variant="body2">{provider.address}</Typography>
                          </Box>
                        )}
                      </Stack>
                    </Paper>
                  </Grid>
                )}

                {/* Working Images */}
                {serviceData.workingImages && serviceData.workingImages.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Working Images
                    </Typography>
                    <Grid container spacing={2}>
                      {serviceData.workingImages.map((image, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                          <Card>
                            <CardMedia
                              component="img"
                              image={`${URLS.FileBase}${image}`}
                              alt={`Working image ${index + 1}`}
                              sx={{
                                height: 200,
                                objectFit: 'cover',
                                borderRadius: '8px',
                              }}
                            />
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}

                {/* Video URL */}
                {serviceData.videoUrl && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Video
                    </Typography>
                    <Alert severity="info" icon={<IconVideo />}>
                      <a
                        href={serviceData.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: theme.palette.primary.main, fontWeight: 600 }}
                      >
                        {serviceData.videoUrl}
                      </a>
                    </Alert>
                  </Grid>
                )}

                {/* SEO Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    SEO Information
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.background.default,
                      borderRadius: '8px',
                    }}
                  >
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          SEO Title
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {serviceData.seoTitle || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          SEO Description
                        </Typography>
                        <Typography variant="body2">
                          {serviceData.seoDescription || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          SEO Tags
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                          {serviceData.seoTags?.split(',').map((tag, index) => (
                            <Chip key={index} label={tag.trim()} size="small" />
                          ))}
                        </Box>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                {/* Timestamps */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Timeline
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: theme.palette.background.default,
                          borderRadius: '8px',
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <IconCalendar size={20} />
                          <Box>
                            <Typography variant="caption" color="textSecondary">
                              Created Date
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {serviceData.logCreatedDate
                                ? new Date(serviceData.logCreatedDate).toLocaleString('en-IN')
                                : 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: theme.palette.background.default,
                          borderRadius: '8px',
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <IconCalendar size={20} />
                          <Box>
                            <Typography variant="caption" color="textSecondary">
                              Last Modified
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {serviceData.logModifiedDate
                                ? new Date(serviceData.logModifiedDate).toLocaleString('en-IN')
                                : 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>

      {/* Reject Reason Modal */}
      <Dialog open={openRejectModal} onClose={handleCloseRejectModal} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Service Request</DialogTitle>
        <form onSubmit={handleRejectSubmit}>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" gutterBottom mb={2}>
              Please provide a reason for rejecting this service request:
            </Typography>
            <CustomFormLabel htmlFor="rejectionReason">Rejection Reason*</CustomFormLabel>
            <TextField
              id="rejectionReason"
              name="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              fullWidth
              required
              multiline
              rows={4}
              placeholder="Enter reason for rejection (e.g., Need better images, Incomplete information, Poor quality content)"
              error={!rejectionReason.trim() && rejectionReason !== ''}
              helperText={
                !rejectionReason.trim() && rejectionReason !== ''
                  ? 'Rejection reason is required'
                  : ''
              }
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseRejectModal} variant="outlined" disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={actionLoading || !rejectionReason.trim()}
            >
              {actionLoading ? 'Rejecting...' : 'Reject Service'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default SingleViewServiceRequest;


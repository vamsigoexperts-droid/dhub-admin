import React, { useState, useEffect } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { toast, ToastContainer } from 'react-toastify';
import { IconArrowBackUp } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Dialog,
  DialogContent,
  IconButton,
  Chip,
} from '@mui/material';
import {
  IconUser,
  IconBuildingStore,
  IconPhone,
  IconMail,
  IconTruck,
  IconX,
  IconDownload,
  IconCalendar,
  IconIdBadge,
  IconReceipt,
  IconFileDescription,
  IconShield,
  IconActivity,
  IconCalendarEvent,
} from '@tabler/icons-react';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'View User' }];

const ViewUser = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const getUserData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetOneUser,
        { id: userId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setUserData(res.data.user);
      }
    } catch (error) {
      toast.error('Failed to fetch user details.');
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserData();
    }
  }, [userId]);

  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl);
    setOpenDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const InfoCard = ({ icon: Icon, title, children, gradient = false }) => (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: theme.shadows[3],
        height: '100%',
        background: gradient
          ? `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`
          : 'white',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              bgcolor: `${theme.palette.primary.main}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={24} color={theme.palette.primary.main} />
          </Box>
          <Typography variant="h6" fontWeight={600} color="primary">
            {title}
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );

  const InfoItem = ({ icon: Icon, label, value, color = 'text.primary', children }) => (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Icon size={18} color={theme.palette.text.secondary} />
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}:
        </Typography>
      </Stack>
      <Box sx={{ mt: 0.5, ml: 4.5 }}>
        {children || (
          <Typography variant="body1" fontWeight={600} color={color}>
            {value || 'N/A'}
          </Typography>
        )}
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <PageContainer title="User Details" description="View user details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Loading user information...</Typography>
        </Box>
      </PageContainer>
    );
  }

  if (!userData) {
    return (
      <PageContainer title="User Details" description="View user details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography color="error">Failed to load user data</Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="User Details" description="View User details">
      {/* Header Section */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Breadcrumb title="View User" items={BCrumb} />
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ float: 'right', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          startIcon={<IconArrowBackUp />}
        >
          Back
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Personal Information Section */}
        <Grid item xs={12} lg={8}>
          <InfoCard icon={IconUser} title="Personal Information">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: 200,
                    border: `3px solid ${theme.palette.primary.main}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                  }}
                >
                  {userData.image ? (
                    <Box
                      component="img"
                      src={`${URLS.FileBase}${userData.image}`}
                      alt={userData.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleImageClick(`${URLS.FileBase}${userData.image}`)}
                    />
                  ) : (
                    <IconUser size={64} color={theme.palette.grey[400]} />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <InfoItem icon={IconUser} label="Full Name" value={userData.name} />
                <InfoItem icon={IconMail} label="Email" value={userData.email} />
                <InfoItem icon={IconPhone} label="Primary Phone" value={userData.phone} />
                <InfoItem icon={IconPhone} label="Alternate Phone" value={userData.altPhone} />
                <InfoItem icon={IconIdBadge} label="User ID" value={userData.userUniqueId} />
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>

        {/* Account Status Section */}
        <Grid item xs={12} lg={4}>
          <InfoCard icon={IconShield} title="Account Status" >
            <InfoItem icon={IconActivity} label="Status">
              <Chip 
                label={userData.status?.toUpperCase()} 
                color={getStatusColor(userData.status)}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </InfoItem>
            
            <InfoItem icon={IconUser} label="Login Status">
              <Chip 
                label={userData.isloggedin ? 'LOGGED IN' : 'LOGGED OUT'} 
                color={userData.isloggedin ? 'success' : 'default'}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </InfoItem>

            <InfoItem icon={IconReceipt} label="Account Deleted">
              <Chip 
                label={userData.isDelete ? 'YES' : 'NO'} 
                color={userData.isDelete ? 'error' : 'success'}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </InfoItem>

            {userData.blockedReason && (
              <InfoItem 
                icon={IconFileDescription} 
                label="Block Reason" 
                value={userData.blockedReason}
                color="error"
              />
            )}
          </InfoCard>
        </Grid>

    

      </Grid>

      {/* Image Preview Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogContent sx={{ position: 'relative', p: 0 }}>
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              bgcolor: 'rgba(255,255,255,0.8)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,1)',
              },
            }}
            onClick={() => setOpenDialog(false)}
          >
            <IconX />
          </IconButton>
          <Box
            component="img"
            src={currentImage}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default ViewUser;

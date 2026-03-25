import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URLS } from '../../../Url';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  CircularProgress,
  Chip,
  Checkbox,
  Card,
  CardContent,
  Grid,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Send,
  CheckCircle,
  RadioButtonUnchecked,
  Star,
  Phone,
  Assignment,
} from '@mui/icons-material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/verified-partners-crm/accepted-orders', title: 'Accepted Orders' },
  { title: 'Send to Service Providers' },
];

const AssignServiceProviders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderIds } = location.state || {};

  const authData = JSON.parse(localStorage.getItem('user'));
  const token = authData?.token;

  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [hoveredProvider, setHoveredProvider] = useState(null);

  useEffect(() => {
    if (!orderIds || orderIds.length === 0) {
      toast.error('No orders selected');
      navigate('/verified-partners-crm/accepted-orders');
      return;
    }

    if (token) {
      fetchServiceProviders();
    }
  }, [orderIds, token]);

  const fetchServiceProviders = async () => {
    setLoading(true);
    try {
      // Fetch providers for the first order (you can modify logic as needed)
      const response = await axios.post(
        URLS.GetServiceProvidersBasedCrmOnId,
        { bookingId: orderIds[0] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success && response.data.data) {
        setServiceProviders(response.data.data);
        toast.success(`Found ${response.data.data.length} service providers`);
      } else {
        toast.warning('No service providers found');
      }
    } catch (error) {
      console.error('Error fetching service providers:', error);
      toast.error('Failed to load service providers');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderToggle = (providerId) => {
    setSelectedProviders((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProviders.length === serviceProviders.length) {
      setSelectedProviders([]);
    } else {
      setSelectedProviders(serviceProviders.map((p) => p._id));
    }
  };

  const handleSendOrders = async () => {
    if (selectedProviders.length === 0) {
      toast.warning('Please select at least one service provider');
      return;
    }

    setSending(true);
    try {
      // Send each order to each selected provider
      const promises = [];

      orderIds.forEach((orderId) => {
        selectedProviders.forEach((providerId) => {
          promises.push(
            axios.put(
              `${URLS.AssignOrderCrmtoProvider}/${orderId}`,
              {
                providerId,
                statusTextMessage: 'Order sent to service provider',
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            )
          );
        });
      });

      const results = await Promise.allSettled(promises);

      const successCount = results.filter((r) => r.status === 'fulfilled').length;
      const failCount = results.filter((r) => r.status === 'rejected').length;

      if (successCount > 0) {
        toast.success(
          `Successfully sent ${orderIds.length} order(s) to ${selectedProviders.length} provider(s)`
        );
        setTimeout(() => {
          navigate('/verified-partners-crm/accepted-orders');
        }, 2000);
      }

      if (failCount > 0) {
        toast.error(`${failCount} assignment(s) failed`);
      }
    } catch (error) {
      console.error('Error sending orders:', error);
      toast.error('Failed to send orders');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Send to Service Providers" description="Loading...">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Send to Service Providers"
      description="Select service providers to send orders"
    >
      <Breadcrumb title="Send to Service Providers" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton
          onClick={() => navigate('/verified-partners-crm/accepted-orders')}
          className="transition-all duration-300 hover:scale-110 hover:bg-gray-100"
        >
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="600">
            Send to Service Providers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Selected Orders: {orderIds?.length || 0}
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={3}
        sx={{ padding: '24px', borderRadius: '16px', minHeight: '500px' }}
        className="transition-all duration-500 hover:shadow-2xl"
      >
        {/* Header with Select All */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Available Service Providers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedProviders.length} of {serviceProviders.length} selected
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleSelectAll}
            className="transition-all duration-300 hover:scale-105"
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
          >
            {selectedProviders.length === serviceProviders.length ? 'Deselect All' : 'Select All'}
          </Button>
        </Box>

        {/* Service Providers Grid */}
        <Grid container spacing={2}>
          {serviceProviders.length === 0 ? (
            <Grid item xs={12}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="300px"
              >
                <Assignment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No service providers available
                </Typography>
              </Box>
            </Grid>
          ) : (
            serviceProviders.map((provider) => {
              const isSelected = selectedProviders.includes(provider._id);
              const fullName = `${provider.firstName || ''} ${provider.lastName || ''}`.trim();
              const displayName = fullName || 'Unnamed Provider';

              return (
                <Grid item xs={12} sm={6} md={3} key={provider._id}>
                  <Card
                    onClick={() => handleProviderToggle(provider._id)}
                    onMouseEnter={() => setHoveredProvider(provider._id)}
                    onMouseLeave={() => setHoveredProvider(null)}
                    className="cursor-pointer transition-all duration-300 ease-in-out"
                    sx={{
                      border: isSelected ? '3px solid #667eea' : '2px solid #e0e0e0',
                      borderRadius: '16px',
                      position: 'relative',
                      overflow: 'hidden',
                      background: isSelected
                        ? 'linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%)'
                        : 'white',
                      transform:
                        hoveredProvider === provider._id ? 'translateY(-8px) scale(1.05)' : 'translateY(0)',
                      boxShadow:
                        hoveredProvider === provider._id
                          ? '0 20px 40px rgba(0,0,0,0.15)'
                          : '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* Animated Line on Hover */}
                    {hoveredProvider === provider._id && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '3px',
                          background: 'linear-gradient(90deg, transparent, #667eea, transparent)',
                          animation: 'scrollLineHorizontal 1.5s ease-in-out infinite',
                          '@keyframes scrollLineHorizontal': {
                            '0%': { left: '-100%' },
                            '100%': { left: '100%' },
                          },
                        }}
                      />
                    )}

                    {/* Selection Checkbox */}
                    <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                      <Checkbox
                        checked={isSelected}
                        icon={<RadioButtonUnchecked sx={{ fontSize: 28 }} />}
                        checkedIcon={
                          <CheckCircle
                            className="transition-all duration-300"
                            sx={{ fontSize: 28, color: '#667eea' }}
                          />
                        }
                        sx={{ padding: 0 }}
                      />
                    </Box>

                    <CardContent sx={{ padding: '20px', textAlign: 'center' }}>
                      {/* Avatar */}
                      <Avatar
                        src={URLS.FileBase + provider.image}
                        alt={displayName}
                        className="transition-all duration-500 ease-out"
                        sx={{
                          width: isSelected ? 90 : 80,
                          height: isSelected ? 90 : 80,
                          margin: '0 auto 16px',
                          border: isSelected ? '4px solid #667eea' : '3px solid #e0e0e0',
                          transform:
                            hoveredProvider === provider._id
                              ? 'rotate(5deg) scale(1.1)'
                              : 'rotate(0deg) scale(1)',
                        }}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </Avatar>

                      {/* Name */}
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        gutterBottom
                        sx={{ color: isSelected ? '#667eea' : 'text.primary' }}
                      >
                        {displayName}
                      </Typography>

                      {/* Rating */}
                      {provider.rating && (
                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mb={1}>
                          <Star sx={{ fontSize: 18, color: '#ffc107' }} />
                          <Typography variant="body2" fontWeight="600">
                            {provider.rating.toFixed(1)}
                          </Typography>
                        </Box>
                      )}

                      {/* Phone */}
                      <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                        <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {provider.phone || 'No phone'}
                        </Typography>
                      </Box>

                      {/* Verified Badge */}
                      {provider.isVerified && (
                        <Chip label="Verified" size="small" color="success" sx={{ mt: 1 }} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>

        {/* Action Buttons */}
        {serviceProviders.length > 0 && (
          <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
            <Button
              variant="outlined"
              onClick={() => navigate('/verified-partners-crm/accepted-orders')}
              disabled={sending}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                padding: '10px 24px',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSendOrders}
              disabled={selectedProviders.length === 0 || sending}
              startIcon={sending ? <CircularProgress size={20} /> : <Send />}
              className="transition-all duration-300 hover:scale-105"
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                padding: '10px 32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              {sending
                ? 'Sending...'
                : `Send to ${selectedProviders.length} Provider${
                    selectedProviders.length !== 1 ? 's' : ''
                  }`}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Custom CSS for Animations */}
      <style jsx global>{`
        .transition-all {
          transition: all 0.3s ease-in-out;
        }

        .hover\\:scale-110:hover {
          transform: scale(1.1);
        }

        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }

        .hover\\:bg-gray-100:hover {
          background-color: #f3f4f6;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .duration-300 {
          transition-duration: 300ms;
        }

        .duration-500 {
          transition-duration: 500ms;
        }

        .ease-in-out {
          transition-timing-function: ease-in-out;
        }

        .ease-out {
          transition-timing-function: ease-out;
        }
      `}</style>
    </PageContainer>
  );
};

export default AssignServiceProviders;

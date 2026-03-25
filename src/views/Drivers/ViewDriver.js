import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Avatar,
  Chip,
  Divider,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  IconArrowLeft, 
  IconUser, 
  IconCar, 
  IconFileText,
  IconCreditCard,
  IconPhoto,
  IconMapPin,
  IconPhone,
  IconMail,
  IconTag,
  IconTruck,
  IconBuildingBank,
  IconId,
  IconLicense,
  IconGps,
  IconShieldCheck,
  IconToggleLeft,
  IconToggleRight,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { URLS } from '../../Url';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IconArrowBackUp } from '@tabler/icons-react';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'View Driver' }
];

const ViewDriver = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const driverId = id || localStorage.getItem('driverId');
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';


  const getDriverData = async (driverIdToUse) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    if (!driverIdToUse) {
      toast.error('Driver ID is missing. Please select a driver first.');
      navigate('/drivers'); 
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetDriverone,
        { driverId: driverIdToUse },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      
      if (res.data.success) {
        setDriverData(res.data.driver);
      } else {
        toast.error(res.data.message || 'Failed to fetch driver details.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch driver details.';
      toast.error(errorMessage);
      console.error('Failed to fetch driver data:', error);
      
      if (error.response?.status === 404) {
        setTimeout(() => navigate('/drivers'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (driverId) {
      getDriverData(driverId);
    } else {
      toast.error('No driver selected. Redirecting...');
      navigate('/drivers');
    }
  }, [driverId, navigate]);

  const getCountryName = (countryId, countries) => {
    const country = countries.find(c => c._id === countryId);
    return country ? country.name : 'N/A';
  };

  const getStateName = (stateId, states) => {
    const state = states.find(s => s._id === stateId);
    return state ? state.name : 'N/A';
  };

  const getCityName = (cityId, cities) => {
    const city = cities.find(c => c._id === cityId);
    return city ? city.name : 'N/A';
  };

  const DocumentView = ({ title, filePath, fileName }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      {filePath ? (
        <Box
          sx={{
            borderRadius: '12px',
            overflow: 'hidden',
            height: 200,
            border: `2px solid ${theme.palette.divider}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
              border: `2px solid ${theme.palette.primary.main}`
            }
          }}
        >
          {filePath.endsWith('.pdf') ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: theme.palette.grey[100],
                p: 2
              }}
            >
              <IconFileText size={48} color={theme.palette.primary.main} />
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                {fileName || 'PDF Document'}
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 1 }}
                onClick={() => window.open(`${URLS.FileBase}${filePath}`, '_blank')}
              >
                View PDF
              </Button>
            </Box>
          ) : (
            <Box
              component="img"
              src={`${URLS.FileBase}${filePath}`}
              alt={title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Not uploaded
        </Typography>
      )}
    </Box>
  );

  if (loading || !driverData) {
    return (
      <PageContainer title="Driver Details" description="View driver details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Loading driver details...</Typography>
        </Box>
      </PageContainer>
    );
  }

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
          boxShadow: theme.shadows[8]
        }
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
              justifyContent: 'center'
            }}
          >
            <Icon size={24} color={theme.palette.primary.main} />
          </Box>
          <Typography 
            variant="h6" 
            fontWeight={600}
            color="primary"
          >
            {title}
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );

  const InfoItem = ({ icon: Icon, label, value, color = "text.primary" }) => (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Icon size={18} color={theme.palette.text.secondary} />
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}:
        </Typography>
      </Stack>
      <Typography 
        variant="body1" 
        fontWeight={600}
        color={color}
        sx={{ mt: 0.5, ml: 4.5 }}
      >
        {value || 'N/A'}
      </Typography>
    </Box>
  );

  const StatusChip = ({ online }) => (
    <Chip
      icon={online ? <IconToggleRight /> : <IconToggleLeft />}
      label={online ? 'Online' : 'Offline'}
      color={online ? 'success' : 'default'}
      variant="filled"
      sx={{
        fontWeight: 600,
        px: 2,
        py: 1,
        borderRadius: '20px'
      }}
    />
  );

  return (
    <PageContainer title="Driver Details" description="View driver details">
      <Breadcrumb title="View Driver" items={BCrumb} />
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
        <Grid item xs={12} lg={6}>
          <InfoCard icon={IconUser} title="Personal Information">
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: 200,
                    border: `3px solid ${theme.palette.primary.main}20`
                  }}
                >
                  {driverData.profileImage ? (
                    <Box
                      component="img"
                      src={`${URLS.FileBase}${driverData.profileImage}`}
                      alt={`${driverData.firstName} ${driverData.lastName}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: theme.palette.primary.main,
                        fontSize: '3rem'
                      }}
                    >
                      {driverData.firstName?.charAt(0)}{driverData.lastName?.charAt(0)}
                    </Avatar>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <InfoItem 
                  icon={IconUser} 
                  label="Full Name" 
                  value={`${driverData?.firstName || ''} ${driverData?.lastName || ''}`} 
                />
                <InfoItem 
                  icon={IconMail} 
                  label="Email" 
                  value={driverData?.email} 
                />
                <InfoItem 
                  icon={IconPhone} 
                  label="Phone" 
                  value={driverData?.phone} 
                />
                <InfoItem 
                  icon={IconPhone} 
                  label="Alternate Phone" 
                  value={driverData?.alterNateNumber} 
                />
                <InfoItem 
                  icon={IconTag} 
                  label="Status" 
                  value={driverData?.status} 
                  color={driverData?.status === 'active' ? 'success.main' : 'error.main'}
                />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
                    Driver Status:
                  </Typography>
                  <StatusChip online={driverData?.driverOnlineOrOfline} />
                </Box>
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>

        {/* Location Information */}
        <Grid item xs={12} lg={6}>
          <InfoCard icon={IconMapPin} title="Location Information">
            <InfoItem 
              icon={IconMapPin} 
              label="Country" 
              value={driverData?.countryName} 
            />
            <InfoItem 
              icon={IconMapPin} 
              label="State" 
              value={driverData?.stateName} 
            />
            <InfoItem 
              icon={IconMapPin} 
              label="City" 
              value={driverData?.cityName} 
            />
          </InfoCard>
        </Grid>

        {/* Vehicle Information */}
        <Grid item xs={12} lg={6}>
          <InfoCard icon={IconCar} title="Vehicle Information">
            <InfoItem 
              icon={IconTag} 
              label="Service Type" 
              value={driverData?.serviceType} 
            />
            <InfoItem 
              icon={IconCar} 
              label="Vehicle Number" 
              value={driverData?.vehicleNumber} 
            />
            <InfoItem 
              icon={IconCar} 
              label="Vehicle Model" 
              value={driverData?.vehicleModel} 
            />
            <InfoItem 
              icon={IconFileText} 
              label="Other Information" 
              value={driverData?.otherinformation} 
            />
          </InfoCard>
        </Grid>

        {/* Bank Details */}
        <Grid item xs={12} lg={6}>
          <InfoCard icon={IconBuildingBank} title="Bank Details">
            <InfoItem 
              icon={IconBuildingBank} 
              label="Bank Name" 
              value={driverData?.bankName} 
            />
            <InfoItem 
              icon={IconMapPin} 
              label="Branch Name" 
              value={driverData?.branchName} 
            />
            <InfoItem 
              icon={IconUser} 
              label="Account Holder" 
              value={driverData?.holderName} 
            />
            <InfoItem 
              icon={IconCreditCard} 
              label="Account Number" 
              value={driverData?.accountNumber} 
            />
            <InfoItem 
              icon={IconId} 
              label="IFSC Code" 
              value={driverData?.ifscCode} 
            />
          </InfoCard>
        </Grid>

        {/* Identity Documents */}
        <Grid item xs={12} lg={6}>
          <InfoCard icon={IconId} title="Identity Documents">
            <InfoItem 
              icon={IconId} 
              label="PAN Card Number" 
              value={driverData?.panCard} 
            />
            <InfoItem 
              icon={IconLicense} 
              label="Driving License Number" 
              value={driverData?.driving_license_number} 
            />
            <InfoItem 
              icon={IconShieldCheck} 
              label="Aadhaar Card Number" 
              value={driverData?.adharcard_number} 
            />
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Document Images:
              </Typography>
              <Grid container spacing={2}>
                {driverData?.panCardImage && (
                  <Grid item xs={6}>
                    <DocumentView 
                      title="PAN Card" 
                      filePath={driverData.panCardImage} 
                    />
                  </Grid>
                )}
                {driverData?.driving_license_front && (
                  <Grid item xs={6}>
                    <DocumentView 
                      title="Driving License Front" 
                      filePath={driverData.driving_license_front} 
                    />
                  </Grid>
                )}
                {driverData?.driving_license_back && (
                  <Grid item xs={6}>
                    <DocumentView 
                      title="Driving License Back" 
                      filePath={driverData.driving_license_back} 
                    />
                  </Grid>
                )}
                {driverData?.adharcard_front && (
                  <Grid item xs={6}>
                    <DocumentView 
                      title="Aadhaar Card Front" 
                      filePath={driverData.adharcard_front} 
                    />
                  </Grid>
                )}
                {driverData?.adharcard_back && (
                  <Grid item xs={6}>
                    <DocumentView 
                      title="Aadhaar Card Back" 
                      filePath={driverData.adharcard_back} 
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </InfoCard>
        </Grid>

        {/* Vehicle Documents */}
        <Grid item xs={12} lg={6}>
          <InfoCard icon={IconCar} title="Vehicle Documents">
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Vehicle Documents:
              </Typography>
              <Grid container spacing={2}>
                {driverData?.vehicleImage && (
                  <Grid item xs={6}>
                    <DocumentView 
                      title="Vehicle Image" 
                      filePath={driverData.vehicleImage} 
                    />
                  </Grid>
                )}
                {driverData?.vehicleProof && (
                  <Grid item xs={6}>
                    <DocumentView 
                      title="Vehicle Proof" 
                      filePath={driverData.vehicleProof} 
                    />
                  </Grid>
                )}
                {driverData?.vechile_rc_front && (
                  <Grid item xs={6}>
                    <DocumentView 
                      title="Vehicle RC Front" 
                      filePath={driverData.vechile_rc_front} 
                    />
                  </Grid>
                )}
                {driverData?.vechile_rc_back && (
                  <Grid item xs={6}>
                    <DocumentView 
                      title="Vehicle RC Back" 
                      filePath={driverData.vechile_rc_back} 
                    />
                  </Grid>
                )}
                {driverData?.vechile_front_Image && (
                  <Grid item xs={6}>
                    <DocumentView 
                      title="Vehicle Front Image" 
                      filePath={driverData.vechile_front_Image} 
                    />
                  </Grid>
                )}
                {driverData?.insurance_image && (
                  <Grid item xs={6}>
                    <DocumentView 
                      title="Insurance Document" 
                      filePath={driverData.insurance_image} 
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </InfoCard>
        </Grid>

        {/* Reference Details */}
        {(driverData?.referenceName || driverData?.referenceNumber2) && (
          <Grid item xs={12} lg={6}>
            <InfoCard icon={IconUser} title="Reference Details">
              <InfoItem 
                icon={IconUser} 
                label="Reference Name" 
                value={driverData?.referenceName} 
              />
              <InfoItem 
                icon={IconPhone} 
                label="Reference Contact 1" 
                value={driverData?.referenceNumber2} 
              />
              <InfoItem 
                icon={IconPhone} 
                label="Reference Contact 2" 
                value={driverData?.alterNateNumber} 
              />
            </InfoCard>
          </Grid>
        )}
      </Grid>
    </PageContainer>
  );
};

export default ViewDriver;

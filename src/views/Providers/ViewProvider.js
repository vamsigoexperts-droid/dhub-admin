
import React, { useState, useEffect, useCallback } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { toast, ToastContainer } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  useTheme,
  Stack,
  DialogTitle,
  DialogActions,
  TextField,

  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  IconArrowBackUp,
  IconX,
  IconPhoto,
  IconFileText,
  IconMapPin,
  IconBuildingBank,
  IconSeo,
  IconUser,
  IconId,
  IconFileTypePdf,
  IconBuildingStore,
  IconCreditCard,
  IconPhone,
  IconMail,
  IconTag,
  IconCalendar,
  IconIdBadge,
  IconReceipt,
  IconShield,
} from '@tabler/icons-react';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Service Providers' },
  { title: 'View Provider' },
];

const DocumentCard = styled(Card)(({ theme }) => ({
  width: 120,
  height: 140,
  borderRadius: theme.spacing(1.5),
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));







const ImageDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '90vw',
    maxHeight: '90vh',
    borderRadius: theme.spacing(2),
  },
}));

const InfoCard = ({ icon: Icon, title, children, gradient = false }) => {
  const theme = useTheme();
  return (
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
      <Box sx={{ p: 3 }}>
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
      </Box>
    </Card>
  );
};

const InfoItem = ({ icon: Icon, label, value, color = 'text.primary' }) => {
  const theme = useTheme();
  return (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Icon size={18} color={theme.palette.text.secondary} />
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}:
        </Typography>
      </Stack>
      <Typography variant="body1" fontWeight={600} color={color} sx={{ mt: 0.5, ml: 4.5 }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  );
};



// â­ ADD THIS COMPONENT BEFORE ViewProvider (after InfoItem)
const RejectDialog = ({ open, onClose, onConfirm, title }) => {
  const [reason, setReason] = useState('');
  const theme = useTheme();

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    onConfirm(reason);
    setReason('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Enter detailed reason for rejection..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          label="Rejection Reason *"
          helperText="Required for audit purposes"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={!reason.trim()}
        >
          Confirm Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const ViewProvider = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const providerId = localStorage.getItem('providerId');
  const [provider, setProvider] = useState([]);
  const [business_images, setbusiness_images] = useState([]);
  const [openImage, setOpenImage] = useState(null);


  const [isFeatured, setIsFeatured] = useState(false);
  const [featureLoading, setFeatureLoading] = useState(false);


  const [rejectDialog, setRejectDialog] = useState({
    open: false,
    type: null, // 'provider', 'kyc', 'bank'
    title: '',
  });

  const getToken = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.token || '' : '';
  }, []);


  const fetchProvider = useCallback(async () => {
    const token = getToken();
    if (!token || !providerId) return;

    try {
      const res = await axios.post(
        `${URLS.GetOneProvider}/${providerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setProvider(res.data?.provider || []);
      setIsFeatured(res.data?.provider?.isFeatured === 'active');

      setbusiness_images(res.data?.provider.business_images || []);
    } catch (error) {
      console.error('Failed to fetch provider data:', error);
      toast.error('Failed to fetch provider details.');
    }
  }, [getToken, providerId]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  const handleImageOpen = (imageUrl) => {
    setOpenImage(imageUrl);
  };

  const handleImageClose = () => {
    setOpenImage(null);
  };

  const isPdfFile = (filename) => {
    if (!filename || typeof filename !== 'string') {
      return false;
    }
    return filename.toLowerCase().endsWith('.pdf');
  };

  const renderDocumentPreview = (fileUrl, altText, highlight = false) => {
    if (!fileUrl) return null;

    if (isPdfFile(fileUrl)) {
      return (
        <DocumentCard
          onClick={() => handleImageOpen(`${URLS.FileBase}${fileUrl}`)}
          sx={highlight ? { border: `2px solid ${theme.palette.primary.main}`, boxShadow: theme.shadows[10] } : {}}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 100,
              backgroundColor: theme.palette.grey[100],
            }}
          >
            <IconFileTypePdf size={40} color={theme.palette.error.main} />
          </Box>
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Typography variant="caption" noWrap>
              {altText}
            </Typography>
          </Box>
        </DocumentCard>
      );
    } else {
      return (
        <DocumentCard
          onClick={() => handleImageOpen(`${URLS.FileBase}${fileUrl}`)}
          sx={highlight ? { border: `2px solid ${theme.palette.primary.main}`, boxShadow: theme.shadows[10] } : {}}
        >
          <img
            src={`${URLS.FileBase}${fileUrl}`}
            alt={altText}
            style={{ width: '100%', height: 100, objectFit: 'cover' }}
          />
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Typography variant="caption" noWrap>
              {altText}
            </Typography>
          </Box>
        </DocumentCard>
      );
    }
  };



  // â­ REPLACE handleReject (remove id param, add reason param)
  const handleProviderReject = async (reason) => {
    try {
      const token = getToken();
      const providerId = localStorage.getItem("providerId");
      await axios.put(`${URLS.UpdateProviderStatus}/${providerId}`, {
        status: "rejected",
        rejectionReason: reason  // â­ CORRECT FIELD NAME
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Provider Rejected");
      setRejectDialog({ open: false, type: null, title: '' });
      fetchProvider();
    } catch (error) {
      toast.error("Reject Failed");
    }
  };


  const handleFeaturedToggle = async (e) => {
    const checked = e.target.checked;
    setIsFeatured(checked); // optimistic UI
    setFeatureLoading(true);

    try {
      const token = getToken();
      const providerId = localStorage.getItem('providerId');

      await axios.put(
        `${URLS.UpdateProviderStatus}/${providerId}`,
        { isFeatured: checked ? 'active' : 'inactive' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        checked ? 'Provider marked as Featured' : 'Provider unfeatured'
      );
    } catch (error) {
      // rollback if API fails
      setIsFeatured(!checked);
      toast.error('Failed to update featured status');
    } finally {
      setFeatureLoading(false);
    }
  };

  // â­ REPLACE handlekycReject
  const handleKycReject = async (reason) => {
    try {
      const token = getToken();
      const providerId = localStorage.getItem("providerId");
      await axios.put(`${URLS.UpdateProviderStatus}/${providerId}`, {
        kyc_status: "rejected",
        kycRejectionReason: reason
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.error("Provider Kyc Status rejected");
      setRejectDialog({ open: false, type: null, title: '' });
      fetchProvider();
    } catch (error) {
      toast.error("Update Failed");
    }
  };

  // â­ REPLACE handleBankdetailsReject  
  const handleBankdetailsReject = async (reason) => {
    try {
      const token = getToken();
      const providerId = localStorage.getItem("providerId");
      await axios.put(`${URLS.UpdateProviderStatus}/${providerId}`, {
        bankDetailsStatus: "rejected",
        bankRejectionReason: reason  // â­ CORRECT FIELD NAME
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.error("Provider bankdetails rejected");
      setRejectDialog({ open: false, type: null, title: '' });
      fetchProvider();
    } catch (error) {
      toast.error("Update Failed");
    }
  };



  const handleBankdetailsUpdate = async (id) => {

    try {
      const token = getToken();
      const providerId = localStorage.getItem("providerId");
      // const id =localStorage.getItem("gvnh",providerId)


      await axios.put(`${URLS.UpdateProviderStatus}/${providerId}`, { bankDetailsStatus: "approved" }, {
        headers: { Authorization: `Bearer ${token}` },
      });


      toast.success("Provider bankdetails Approved");
      fetchProvider();
    } catch (error) {
      toast.error("Update Failed");
    }

  }




  const handlekycUpdate = async () => {
    try {
      const token = getToken();
      const providerId = localStorage.getItem("providerId");
      await axios.put(`${URLS.UpdateProviderStatus}/${providerId}`, { kyc_status: "approved" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Provider KYC Status Approved");
      fetchProvider();
    } catch (error) {
      toast.error("Status Update Failed");
    }
  };

  const handleUpdate = async () => {
    try {
      const token = getToken();
      const providerId = localStorage.getItem("providerId");
      await axios.put(`${URLS.UpdateProviderStatus}/${providerId}`, { status: "active" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Provider Approved");
      fetchProvider();
    } catch (error) {
      toast.error("Approval Failed");
    }
  };

  const handleBlock = async () => {
    try {
      const token = getToken();
      const providerId = localStorage.getItem("providerId");
      await axios.put(`${URLS.UpdateProviderStatus}/${providerId}`, { status: "blocked" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.error("Provider Blocked");
      fetchProvider();
    } catch (error) {
      toast.error("Block Action Failed");
    }
  };

  // â­ NEW: Get Document Type Display Name
  const getDocumentTypeLabel = (docType) => {
    if (docType === 'pan_card') return 'PAN Card';
    if (docType === 'driving_license') return 'Driving License';
    return docType;
  };


  return (
    <PageContainer title="View Provider" description="View provider details">
      <Breadcrumb title="View Provider" items={BCrumb} />
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
        {/* Row 1: Personal & Business Info */}
        <Grid item xs={12} lg={6}>
          <InfoCard
            icon={IconUser}
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="h6">Personal Information</Typography>
                <FormControlLabel
                  control={<Checkbox checked={isFeatured} onChange={handleFeaturedToggle} disabled={featureLoading} size="small" />}
                  label="Featured"
                />
              </Box>
            }
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Box sx={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: 200, border: `3px solid ${theme.palette.primary.main}20` }}>
                  {provider.image ? (
                    <Box component="img" src={`${URLS.FileBase}${provider.image}`} alt={`${provider.firstName} ${provider.lastName}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: theme.palette.grey[100] }}>
                      <IconPhoto size={48} color={theme.palette.grey[400]} />
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <InfoItem icon={IconUser} label="Full Name" value={`${provider.firstName} ${provider.lastName}`} />
                <InfoItem icon={IconMail} label="Email" value={provider.email} />
                <InfoItem icon={IconPhone} label="Phone" value={provider.phone} />
                <InfoItem icon={IconCalendar} label="Date of Birth" value={provider.dob ? new Date(provider.dob).toLocaleDateString() : 'N/A'} />
                <InfoItem icon={IconIdBadge} label="Experience" value={`${provider.experiance || 0} years`} />
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleUpdate} disabled={provider.status === 'active'}>Approve</Button>
                  <Button variant="contained" color="error" onClick={handleBlock}>Block</Button>
                  <Button variant="contained" sx={{ backgroundColor: '#ff0000', '&:hover': { backgroundColor: '#cc0000' } }} onClick={() => setRejectDialog({ open: true, type: 'provider', title: 'Reject Provider' })}>Reject</Button>
                </Box>
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>

        <Grid item xs={12} lg={6}>
          <InfoCard icon={IconBuildingStore} title="Business Information">
            <InfoItem icon={IconTag} label="Child Category" value={provider.childcategoryName} />
            {provider.childcategoryName === 'Service Center' && (
              <>
                <InfoItem icon={IconBuildingStore} label="Business Name" value={provider.business_name} />
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <IconPhoto size={18} /> Logo & Banner
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(provider.logo, 'Logo')}
                  {renderDocumentPreview(provider.banner_image, 'Banner')}
                </Box>
              </>
            )}
            <InfoItem icon={IconTag} label="Categories" value={provider.categoryName} />
            <InfoItem icon={IconTag} label="Subcategories" value={provider.subcategoryName} />
            <InfoItem icon={IconId} label="Slug" value={provider.slug} color="primary.main" />
          </InfoCard>
        </Grid>

        {/* Row 2: Address Info */}
        <Grid item xs={12}>
          <InfoCard icon={IconMapPin} title="Address Information">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <InfoItem icon={IconMapPin} label="Country" value={provider.countryName} />
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoItem icon={IconMapPin} label="State" value={provider.stateName} />
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoItem icon={IconMapPin} label="City" value={provider.cityName} />
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoItem icon={IconMapPin} label="Pincode" value={provider.pincode} />
              </Grid>
              <Grid item xs={12} md={8}>
                <InfoItem icon={IconMapPin} label="Address" value={provider.address} />
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>

        {/* Row 3: Identity & Verification Documents (Unified) */}
        <Grid item xs={12}>
          <InfoCard icon={IconShield} title="Identity & Verification Documents">
            <Grid container spacing={3}>
              {/* Common Fields */}
              <Grid item xs={12} md={4}>
                <InfoItem icon={IconId} label="Aadhaar Number" value={provider.aadhar_number} />
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoItem icon={IconId} label="PAN Number" value={provider.pan_number || provider.pan_card_number} />
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoItem icon={IconPhone} label="Whatsapp Number" value={provider.whatsappNumber || provider.altphone} />
              </Grid>

              {/* Service Center Specific Fields */}
              {provider.childcategoryName === 'Service Center' && (
                <>
                  <Grid item xs={12} md={4}>
                    <InfoItem icon={IconShield} label="Business Proof Type" value={provider.business_proof_type || 'N/A'} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <InfoItem icon={IconReceipt} label="Business ID / Labour Licence" value={provider.business_number} />
                  </Grid>
                  {/* <Grid item xs={12} md={4}>
                    <InfoItem icon={IconReceipt} label="GST Number" value={provider.gst_number} />
                  </Grid> */}
                </>
              )}

              {/* Verified Partner Specific Fields */}
              {provider.childcategoryName === 'Verified Partners' && (
                <>
                  <Grid item xs={12} md={4}>
                    <InfoItem icon={IconMapPin} label="Address Proof Type" value={provider.address_proof_type || 'N/A'} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <InfoItem icon={IconReceipt} label="Address Proof Number" value={provider.gas_bill_number || provider.address_proof_number} />
                  </Grid>
                </>
              )}

              {/* General Documents Preview Sections */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>PAN Card Documents</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(provider.pan_card_front, 'Front')}
                  {renderDocumentPreview(provider.pan_card_back, 'Back')}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Aadhaar Documents</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(provider.aadhar_card_front, 'Front')}
                  {renderDocumentPreview(provider.aadhar_card_back, 'Back')}
                </Box>
              </Grid>

              {/* Verification Specific Images */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Verification Documents</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                  {/* Service Center Proofs */}
                  {renderDocumentPreview(provider.business_proof, 'Business Proof')}
                  {/* {renderDocumentPreview(provider.gst_bill, 'GST Proof')} */}
                  {/* Verified Partner Proofs */}
                  {renderDocumentPreview(provider.gas_bill || provider.address_proof, 'Address Proof')}
                  {renderDocumentPreview(provider.rental_aggrement, 'Rental Agreement')}
                  {renderDocumentPreview(provider.power_bill, 'Power Bill')}
                  {/* Common Other */}
                  {renderDocumentPreview(provider.customer_bill_copy, 'Customer Bill')}
                  {renderDocumentPreview(provider.business_card, 'Business Card')}
                </Box>
              </Grid>

              {/* Business Images (Service Center) */}
              {provider.childcategoryName === 'Service Center' && business_images && business_images.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Business Images</Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                    {business_images.map((image, index) => (
                      <DocumentCard key={index} onClick={() => handleImageOpen(`${URLS.FileBase}${image}`)}>
                        <img src={`${URLS.FileBase}${image}`} alt={`Business ${index + 1}`} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                      </DocumentCard>
                    ))}
                  </Box>
                </Grid>
              )}

              {/* Actions Box */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                  <Button variant="contained" color="primary" onClick={handlekycUpdate} disabled={!(provider.kyc_status === 'applied' || provider.kyc_status === 'rejected')}>Approve Documents</Button>
                  <Button variant="contained" sx={{ backgroundColor: '#ff0000', '&:hover': { backgroundColor: '#cc0000' } }} onClick={() => setRejectDialog({ open: true, type: 'kyc', title: 'Reject Verification Documents' })}>Reject Documents</Button>
                </Box>
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>

        {/* Row 4: Bank Details & SEO */}
        <Grid item xs={12} md={6}>
          <InfoCard icon={IconBuildingBank} title="Bank Details">
            <InfoItem icon={IconBuildingBank} label="Bank Name" value={provider.bankName} />
            <InfoItem icon={IconMapPin} label="Branch Name" value={provider.branchName} />
            <InfoItem icon={IconUser} label="Account Holder" value={provider.holderName} />
            <InfoItem icon={IconCreditCard} label="Account Number" value={provider.accountNumber} />
            <InfoItem icon={IconId} label="IFSC Code" value={provider.ifsc_code} />
            <InfoItem icon={IconCreditCard} label="UPI ID" value={provider.upid} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
              <Button variant="contained" color="primary" onClick={handleBankdetailsUpdate} disabled={provider.bankDetailsStatus === 'approved'}>Approve</Button>
              <Button variant="contained" sx={{ backgroundColor: '#ff0000', '&:hover': { backgroundColor: '#cc0000' } }} onClick={() => setRejectDialog({ open: true, type: 'bank', title: 'Reject Bank Details' })}>Reject</Button>
            </Box>
          </InfoCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <InfoCard icon={IconSeo} title="SEO Meta Details">
            <InfoItem icon={IconTag} label="Meta Title" value={provider.metaTitle} />
            <Box sx={{ mb: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <IconFileText size={18} color={theme.palette.text.secondary} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>Meta Description:</Typography>
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.5, ml: 4.5, bgcolor: `${theme.palette.secondary.main}08`, p: 1.5, borderRadius: 1, border: `1px solid ${theme.palette.secondary.main}20` }}>
                {provider.metaDescription || 'N/A'}
              </Typography>
            </Box>
            <InfoItem icon={IconTag} label="Meta Keywords" value={provider.metakeywords} />
          </InfoCard>
        </Grid>

        {/* Gallery Images (If any) */}
        {provider.images && provider.images.length > 0 && (
          <Grid item xs={12}>
            <InfoCard icon={IconPhoto} title="Gallery Images">
              <Grid container spacing={2}>
                {provider.images.map((img, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    {renderDocumentPreview(img, `Gallery ${index + 1}`)}
                  </Grid>
                ))}
              </Grid>
            </InfoCard>
          </Grid>
        )}
      </Grid>

      {/* Dialogs */}
      <ImageDialog open={!!openImage} onClose={handleImageClose}>
        <DialogContent dividers sx={{ p: 0, position: 'relative' }}>
          <IconButton onClick={handleImageClose} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, bgcolor: 'rgba(255,255,255,0.8)' }}><IconX /></IconButton>
          {openImage && isPdfFile(openImage) ? (
            <Box sx={{ height: '70vh', width: '100%' }}>
              <iframe src={`${openImage}#view=fitH`} width="100%" height="100%" frameBorder="0" title="PDF Document" />
            </Box>
          ) : (
            <img src={openImage} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' }} />
          )}
        </DialogContent>
      </ImageDialog>

      <RejectDialog
        open={rejectDialog.open}
        onClose={() => setRejectDialog({ open: false, type: null, title: '' })}
        onConfirm={(reason) => {
          switch (rejectDialog.type) {
            case 'provider': handleProviderReject(reason); break;
            case 'kyc': handleKycReject(reason); break;
            case 'bank': handleBankdetailsReject(reason); break;
          }
        }}
        title={rejectDialog.title}
      />
    </PageContainer>
  );
};

export default ViewProvider;


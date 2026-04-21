import React, { useState, useEffect, useCallback } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { toast, ToastContainer } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
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
  Chip,
  TextField,
  Divider,
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
  IconUsers,
  IconBuilding,
  IconCheck,
  IconShield,
  IconX as IconXMark,
} from '@tabler/icons-react';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/AllprofessionalProviders', title: 'Professional Providers' },
  { title: 'View Professional Provider' },
];

const generateSlug = (text) => {
  if (text == null || text === '') return '';
  return String(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

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

const InfoCard = ({ icon: Icon, title, children, gradient = false, headerAction }) => {
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
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
          {headerAction && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {headerAction}
            </Box>
          )}
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

const ViewProfessionalProvider = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const [providerData, setProviderData] = useState({});
  const [documents, setDocuments] = useState({});
  const [providerFields, setProviderFields] = useState({});
  const [openImage, setOpenImage] = useState(null);
  const [rejectDialog, setRejectDialog] = useState({ open: false, type: null, title: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);

  const provider = providerData;

  // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ UPDATED HELPER FUNCTIONS - Display NAMES not IDs
  const getServiceName = (providerData) => {
    if (providerData.serviceName) return providerData.serviceName;
    if (providerData.serviceId && typeof providerData.serviceId === 'object' && providerData.serviceId.name) {
      return providerData.serviceId.name;
    }
    return 'N/A';
  };

  const getCategoryNames = (providerData) => {
    // Priority 1: professionalServiceCategoryName array (populated)
    if (providerData.professionalServiceCategoryName && Array.isArray(providerData.professionalServiceCategoryName)) {
      return providerData.professionalServiceCategoryName.filter(Boolean);
    }
    // Priority 2: professionalCategoryName array
    if (providerData.professionalCategoryName && Array.isArray(providerData.professionalCategoryName)) {
      return providerData.professionalCategoryName.filter(Boolean);
    }
    // Priority 3: professionalServiceCategoryId array fallback
    if (providerData.professionalServiceCategoryId && Array.isArray(providerData.professionalServiceCategoryId)) {
      return providerData.professionalServiceCategoryId.map(id => id.name || id);
    }
    return [];
  };

  const getSubcategoryNames = (providerData) => {
    // Priority 1: professionalServiceSubcategoryName array (populated)
    if (providerData.professionalServiceSubcategoryName && Array.isArray(providerData.professionalServiceSubcategoryName)) {
      return providerData.professionalServiceSubcategoryName.filter(Boolean);
    }
    // Priority 2: professionalSubcategoryName array
    if (providerData.professionalSubcategoryName && Array.isArray(providerData.professionalSubcategoryName)) {
      return providerData.professionalSubcategoryName.filter(Boolean);
    }
    // Priority 3: professionalServiceSubcategoryId array fallback
    if (providerData.professionalServiceSubcategoryId && Array.isArray(providerData.professionalServiceSubcategoryId)) {
      return providerData.professionalServiceSubcategoryId.map(id => id.name || id);
    }
    return [];
  };

  const getAmenities = (providerData) => {
    let list = [];

    // Priority 1: amenities array (populated with objects or strings)
    if (providerData.amenities && Array.isArray(providerData.amenities)) {
      list = providerData.amenities.map(a => a.name || a.title || a);
    }

    // Priority 2: otherAmenities string (split by newlines)
    if (providerData.otherAmenities) {
      const others = providerData.otherAmenities.split(/\r?\n/).filter(item => item.trim() !== '');
      list = [...list, ...others];
    }

    return list.filter(Boolean);
  };

  const handleFeaturedToggle = async (event) => {
    const token = getToken();
    if (!token || !id) return;

    const checked = event.target.checked;

    setLoading(true);
    try {
      const res = await axios.put(
        `https://api.doorstephub.com/v1/dhubApi/admin/professional-providers/update-professional-provider-featured/${id}`,
        { isFeatured: checked ? 'active' : 'inactive' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success(res.data?.message || 'Featured status updated');
      fetchProvider();
    } catch (error) {
      console.error('Featured update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update featured status');
    } finally {
      setLoading(false);
    }
  };

  const getToken = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.token || '' : '';
  }, []);

  const fetchProvider = useCallback(async () => {
    const token = getToken();
    if (!token || !id) return;

    try {
      const res = await axios.get(
        `https://api.doorstephub.com/v1/dhubApi/admin/professional-providers/get-professional-provider/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Provider data:', res.data);
      setProviderData(res.data.provider || {});
      setDocuments(res.data.documents || {});
      setProviderFields(res.data.providerFields || {});
    } catch (error) {
      console.error('Failed to fetch professional provider data:', error);
      toast.error('Failed to fetch provider details.');
    }
  }, [getToken, id]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  const handleImageOpen = (imageUrl) => {
    setOpenImage(imageUrl);
  };

  const handleImageClose = () => {
    setOpenImage(null);
  };

  const getDocumentPath = (fileValue) => {
    if (Array.isArray(fileValue)) {
      return getDocumentPath(fileValue.find(Boolean));
    }

    if (fileValue && typeof fileValue === 'object') {
      return getDocumentPath(
        fileValue.url ||
        fileValue.path ||
        fileValue.file ||
        fileValue.image ||
        fileValue.src ||
        fileValue.location
      );
    }

    return typeof fileValue === 'string' ? fileValue.trim() : '';
  };

  const getDocumentUrl = (fileValue) => {
    const filePath = getDocumentPath(fileValue);
    if (!filePath) return '';

    if (/^(https?:|blob:|data:)/i.test(filePath)) {
      return filePath;
    }

    return `https://api.doorstephub.com/${filePath.replace(/^\/+/, '')}`;
  };

  const getDocumentList = (fileValue) => {
    if (!fileValue) return [];
    if (Array.isArray(fileValue)) return fileValue.map(getDocumentPath).filter(Boolean);

    const filePath = getDocumentPath(fileValue);
    return filePath ? [filePath] : [];
  };

  const isPdfFile = (filename) => {
    const filePath = getDocumentPath(filename);
    return filePath.split('?')[0].toLowerCase().endsWith('.pdf');
  };

  const renderDocumentPreview = (fileUrl, altText) => {
    const fullUrl = getDocumentUrl(fileUrl);

    if (!fullUrl) return null;

    if (isPdfFile(fileUrl)) {
      return (
        <DocumentCard onClick={() => handleImageOpen(fullUrl)}>
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
        <DocumentCard onClick={() => handleImageOpen(fullUrl)}>
          <img
            src={fullUrl}
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

  /** Identity / document KYC (PAN, Aadhaar, proofs) — same API as list flow */
  const handleIdentityDocumentsApprove = async () => {
    const token = getToken();
    if (!token || !id) return;

    setLoading(true);
    try {
      const res = await axios.put(
        `https://api.doorstephub.com/v1/dhubApi/admin/professional-providers/update-professional-provider-kyc/${id}`,
        { kyc_status: 'approved' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success(res.data?.message || 'Documents approved successfully');
      fetchProvider();
    } catch (error) {
      console.error('Approve documents failed:', error);
      toast.error(error.response?.data?.message || 'Failed to approve documents');
    } finally {
      setLoading(false);
    }
  };

  /** Bank details only — dedicated JSON route so status persists (multipart update often skipped req.body fields). */
  const handleBankdetailsApprove = async () => {
    const token = getToken();
    if (!token || !id) return;

    setLoading(true);
    try {
      const res = await axios.put(
        `https://api.doorstephub.com/v1/dhubApi/admin/professional-providers/update-professional-provider-bank-status/${id}`,
        { bankDetailsStatus: 'approved' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success(res.data?.message || 'Bank details approved successfully!');
      if (res.data?.data?.bankDetailsStatus) {
        setProviderData((prev) => ({
          ...prev,
          bankDetailsStatus: res.data.data.bankDetailsStatus,
        }));
      }
      fetchProvider();
    } catch (error) {
      console.error('Approve bank details failed:', error);
      toast.error(error.response?.data?.message || 'Failed to approve bank details');
    } finally {
      setLoading(false);
    }
  };

  // Approve Overall Provider Status
  const handleProviderStatusApprove = async () => {
    const token = getToken();
    if (!token || !id) return;

    setLoading(true);
    try {
      const res = await axios.put(
        `https://api.doorstephub.com/v1/dhubApi/admin/professional-providers/update-professional-provider-status/${id}`,
        { status: 'active' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success(res.data?.message || 'Provider approved successfully!');
      fetchProvider();
    } catch (error) {
      console.error('Approve provider status failed:', error);
      toast.error(error.response?.data?.message || 'Failed to approve provider');
    } finally {
      setLoading(false);
    }
  };

  // Reject Handler
  const handleRejectSubmit = async () => {
    const token = getToken();
    if (!token || !id || !rejectDialog.type) return;

    if (!rejectReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      let payload = {};

      if (rejectDialog.type === 'kyc') {
        endpoint = `https://api.doorstephub.com/v1/dhubApi/admin/professional-providers/update-professional-provider-kyc/${id}`;
        payload = { kyc_status: 'rejected' };
      } else if (rejectDialog.type === 'bank') {
        const res = await axios.put(
          `https://api.doorstephub.com/v1/dhubApi/admin/professional-providers/update-professional-provider-bank-status/${id}`,
          { bankDetailsStatus: 'rejected' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        toast.success(res.data?.message || 'Rejected successfully');
        if (res.data?.data?.bankDetailsStatus) {
          setProviderData((prev) => ({
            ...prev,
            bankDetailsStatus: res.data.data.bankDetailsStatus,
          }));
        }
        setRejectDialog({ open: false, type: null, title: '' });
        setRejectReason('');
        fetchProvider();
        setLoading(false);
        return;
      } else if (rejectDialog.type === 'provider') {
        endpoint = `https://api.doorstephub.com/v1/dhubApi/admin/professional-providers/update-professional-provider-status/${id}`;
        payload = { status: 'inactive', reason: rejectReason };
      }

      const res = await axios.put(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success(res.data?.message || 'Rejected successfully');
      setRejectDialog({ open: false, type: null, title: '' });
      setRejectReason('');
      fetchProvider();
    } catch (error) {
      console.error('Reject failed:', error);
      toast.error(error.response?.data?.message || 'Failed to reject');
    } finally {
      setLoading(false);
    }
  };

  const documentsData = documents;
  const providerImageUrl = getDocumentUrl(provider.image);
  const businessImages = getDocumentList(documents.business_images);

  const docKycStatus = documents.kyc_status || provider.kyc_status;
  const isKycApproved = docKycStatus === 'active' || docKycStatus === 'approved';
  const isProviderActive = provider.status === 'active';
  const bankStatus = provider.bankDetailsStatus || 'not_applied';
  const isBankApproved = bankStatus === 'approved';

  return (
    <PageContainer title="View Professional Provider" description="View professional provider details">
      <Breadcrumb title="View Professional Provider" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ float: 'right', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/AllprofessionalProviders')}
          startIcon={<IconArrowBackUp />}
        >
          Back
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Personal Information with Overall Approve/Reject */}
        <Grid item xs={12} lg={6}>
          <InfoCard
            icon={IconUser}
            title="Personal Information"
            headerAction={
              <FormControlLabel
                control={
                  <Checkbox
                    checked={provider.isFeatured === 'active' || provider.isFeatured === true}
                    onChange={handleFeaturedToggle}
                    color="success"
                    disabled={loading}
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 22 }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" fontWeight={500} color="text.secondary">
                    Is Featured
                  </Typography>
                }
                labelPlacement="start"
                sx={{
                  m: 0,
                  gap: 0.5
                }}
              />
            }
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: 200,
                    border: `3px solid ${theme.palette.primary.main}20`,
                  }}
                >
                  {providerImageUrl ? (
                    <Box
                      component="img"
                      src={providerImageUrl}
                      alt={`${provider.firstName} ${provider.lastName}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: theme.palette.grey[100],
                      }}
                    >
                      <IconPhoto size={48} color={theme.palette.grey[400]} />
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <InfoItem
                  icon={IconUser}
                  label="Full Name"
                  value={`${provider.firstName || ''} ${provider.lastName || ''}`}
                />
                <InfoItem icon={IconMail} label="Email" value={provider.email} />
                <InfoItem icon={IconPhone} label="Phone" value={provider.phone} />
                {/* <InfoItem icon={IconPhone} label="Alt Phone" value={provider.altphone || 'N/A'} /> */}
                <InfoItem icon={IconPhone} label="WhatsApp" value={provider.whatsappNumber} />
                <InfoItem
                  icon={IconCalendar}
                  label="Date of Birth"
                  value={
                    providerFields.dob ? new Date(providerFields.dob).toLocaleDateString() : 'N/A'
                  }
                />
                <InfoItem
                  icon={IconIdBadge}
                  label="Experience"
                  value={`${providerFields.experiance || 0} years`}
                />
              </Grid>
            </Grid>

            {/* Overall Approve/Reject Buttons */}
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<IconCheck />}
                onClick={handleProviderStatusApprove}
                disabled={loading || isProviderActive}
                size="small"
              >
                Approve Provider
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<IconXMark />}
                onClick={() =>
                  setRejectDialog({ open: true, type: 'provider', title: 'Reject Provider' })
                }
                disabled={loading || provider.status === 'inactive'}
                size="small"
              >
                Reject Provider
              </Button>
            </Box>
          </InfoCard>
        </Grid>

        {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ FIXED Business Information - Now shows NAMES */}
        <Grid item xs={12} lg={6}>
          <InfoCard icon={IconBuildingStore} title="Business Information">
            <InfoItem icon={IconBuilding} label="Business Name" value={provider.business_name} />
            <InfoItem
              icon={IconId}
              label="Slug"
              value={provider.slug?.trim() || generateSlug(provider.business_name) || undefined}
              color="primary.main"
            />

            {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Service Name - FIXED */}
            <InfoItem
              icon={IconUsers}
              label="Service"
              value={getServiceName(provider)}
            />

            {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Categories - FIXED */}
            <Box sx={{ mb: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <IconTag size={18} color={theme.palette.text.secondary} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Categories:
                </Typography>
              </Stack>
              <Box sx={{ mt: 0.5, ml: 4.5 }}>
                {getCategoryNames(provider).length > 0 ? (
                  getCategoryNames(provider).map((catName, idx) => (
                    <Chip
                      key={idx}
                      label={catName}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No categories selected
                  </Typography>
                )}
              </Box>
            </Box>

            {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Subcategories - FIXED */}
            <Box sx={{ mb: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <IconTag size={18} color={theme.palette.text.secondary} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Subcategories:
                </Typography>
              </Stack>
              <Box sx={{ mt: 0.5, ml: 4.5 }}>
                {getSubcategoryNames(provider).length > 0 ? (
                  getSubcategoryNames(provider).map((subName, idx) => (
                    <Chip
                      key={idx}
                      label={subName}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No subcategories selected
                  </Typography>
                )}
              </Box>
            </Box>

            {/* ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ Amenities - FIXED */}
            <Box sx={{ mb: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <IconCheck size={18} color={theme.palette.text.secondary} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Amenities:
                </Typography>
              </Stack>
              <Box sx={{ mt: 0.5, ml: 4.5 }}>
                {getAmenities(provider).length > 0 ? (
                  getAmenities(provider).map((amenity, idx) => (
                    <Chip
                      key={idx}
                      label={amenity}
                      size="small"
                      color="info"
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No amenities selected
                  </Typography>
                )}
              </Box>
            </Box>
          </InfoCard>
        </Grid>

        {/* Identity & verification — same approval pattern as View Provider (on-demand) */}
        <Grid item xs={12}>
          <InfoCard icon={IconShield} title="Identity & Verification Documents">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <InfoItem icon={IconPhone} label="Whatsapp Number" value={provider.whatsappNumber} />
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoItem
                  icon={IconId}
                  label="Address Proof Type"
                  value={documents.address_proof_type || 'N/A'}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoItem
                  icon={IconReceipt}
                  label="Address Proof Number"
                  value={documents.address_proof_number || 'N/A'}
                />
              </Grid>

              {/* PAN Card Section - Row 1 */}
              <Grid item xs={12} md={3}>
                <InfoItem icon={IconId} label="PAN Number" value={documents.pan_number} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  PAN Card Front
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(documents.pan_card_front, 'PAN Front')}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  PAN Card Back
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(documents.pan_card_back, 'PAN Back')}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                {/* Empty space */}
              </Grid>

              {/* Aadhar Card Section - Row 2 */}
              <Grid item xs={12} md={3}>
                <InfoItem icon={IconId} label="Aadhaar Number" value={documents.aadhar_number} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Aadhaar Card Front
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(documents.aadhar_card_front, 'Aadhaar Front')}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Aadhaar Card Back
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(documents.aadhar_card_back, 'Aadhaar Back')}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                {/* Empty space */}
              </Grid>

              {/* Passport Section - Row 3 */}
              <Grid item xs={12} md={3}>
                <InfoItem
                  icon={IconReceipt}
                  label="Passport Number"
                  value={documents.passport_number}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Passport Front
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(documents.passport_front, 'Passport Front')}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Passport Back
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(documents.passport_back, 'Passport Back')}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                {/* Empty space */}
              </Grid>

              {/* Gas Bill Section - Row 4 */}
              <Grid item xs={12} md={3}>
                <InfoItem
                  icon={IconReceipt}
                  label="Gas Bill Number"
                  value={documents.gas_bill_number}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Gas Bill
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(documents.gas_bill, 'Gas Bill')}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                {/* Empty space */}
              </Grid>
              <Grid item xs={12} md={3}>
                {/* Empty space */}
              </Grid>

              {/* Business Proof Section - Row 5 */}
              <Grid item xs={12} md={3}>
                <InfoItem
                  icon={IconReceipt}
                  label="Business Number"
                  value={documents.business_number}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Business Proof
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(documents.business_proof, 'Business Proof')}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                {/* Empty space */}
              </Grid>
              <Grid item xs={12} md={3}>
                {/* Empty space */}
              </Grid>

              {/* GST Section - Row 6 */}
              <Grid item xs={12} md={3}>
                <InfoItem icon={IconReceipt} label="GST Number" value={documents.gst_number} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  GST Bill
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(
                    Array.isArray(documents.gst_bill) && documents.gst_bill.length > 0
                      ? documents.gst_bill[0]
                      : documents.gst_bill,
                    'GST Bill'
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                {/* Reserved */}
              </Grid>
              <Grid item xs={12} md={3}>
                {/* Reserved */}
              </Grid>

              {/* Logo, Banner, Bill Sample, Business Card - Row 7 */}
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Logo
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(provider.logo, 'Logo')}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Banner Image
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(documents.banner_image, 'Banner')}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Bill Sample
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(documents.bill_sample, 'Bill Sample')}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Business Card
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {renderDocumentPreview(documents.business_card, 'Business Card')}
                </Box>
              </Grid>

              {/* Business Images */}
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Business Images
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                  {businessImages.slice(0, 4).map((img, idx) =>
                    renderDocumentPreview(img, `Business ${idx + 1}`)
                  )}
                  {businessImages.length > 4 && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      +{businessImages.length - 4} more
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Document KYC:{' '}
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 700,
                        color: isKycApproved
                          ? 'success.main'
                          : docKycStatus === 'rejected'
                            ? 'error.main'
                            : 'warning.main',
                      }}
                    >
                      {(docKycStatus || 'not_applied').toUpperCase()}
                    </Box>
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleIdentityDocumentsApprove}
                      disabled={loading || isKycApproved}
                      size="small"
                    >
                      Approve Documents
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#b71c1c' } }}
                      onClick={() =>
                        setRejectDialog({
                          open: true,
                          type: 'kyc',
                          title: 'Reject Verification Documents',
                        })
                      }
                      disabled={loading || docKycStatus === 'rejected'}
                      size="small"
                    >
                      Reject Documents
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>

        {/* Address Information */}
        <Grid item xs={12}>
          <InfoCard icon={IconMapPin} title="Address Information">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={IconMapPin}
                  label="Country"
                  value={
                    typeof provider.countryId === 'object' && provider.countryId?.name
                      ? provider.countryId.name
                      : provider.countryName || 'N/A'
                  }
                />
                <InfoItem
                  icon={IconMapPin}
                  label="State"
                  value={
                    typeof provider.stateId === 'object' && provider.stateId?.name
                      ? provider.stateId.name
                      : provider.stateName || 'N/A'
                  }
                />
                <InfoItem
                  icon={IconMapPin}
                  label="City"
                  value={
                    typeof provider.cityId === 'object' && provider.cityId?.name
                      ? provider.cityId.name
                      : provider.cityName || 'N/A'
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem icon={IconMapPin} label="Pincode" value={providerFields.pincode} />
                <InfoItem icon={IconMapPin} label="Address" value={provider.address} />
                <InfoItem
                  icon={IconMapPin}
                  label="Coordinates"
                  value={
                    provider.latitude && provider.longitude
                      ? `${provider.latitude}, ${provider.longitude}`
                      : 'N/A'
                  }
                />
                <InfoItem
                  icon={IconReceipt}
                  label="Delivery Radius"
                  value={`${provider.deliveryRadiusKm || 0} KM`}
                />
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>

        {/* Bank Details with Approve/Reject */}
        <Grid item xs={12} md={6}>
          <InfoCard icon={IconBuildingBank} title="Bank Details">
            <InfoItem icon={IconBuildingBank} label="Bank Name" value={provider.bankName} />
            <InfoItem icon={IconMapPin} label="Branch Name" value={provider.branchName} />
            <InfoItem icon={IconUser} label="Account Holder" value={provider.holderName} />
            <InfoItem icon={IconCreditCard} label="Account Number" value={provider.accountNumber} />
            <InfoItem icon={IconId} label="IFSC Code" value={provider.ifsc_code} />
            <InfoItem icon={IconCreditCard} label="UPI ID" value={provider.upi} />
            <InfoItem
              icon={IconId}
              label="Bank verification status"
              value={bankStatus.replace(/_/g, ' ').toUpperCase()}
              color={
                isBankApproved
                  ? 'success.main'
                  : bankStatus === 'rejected'
                    ? 'error.main'
                    : 'warning.main'
              }
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<IconCheck />}
                onClick={handleBankdetailsApprove}
                disabled={loading || isBankApproved}
                size="small"
              >
                Approve Bank
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<IconXMark />}
                onClick={() =>
                  setRejectDialog({ open: true, type: 'bank', title: 'Reject Bank Details' })
                }
                disabled={loading || bankStatus === 'rejected'}
                size="small"
              >
                Reject Bank
              </Button>
            </Box>
          </InfoCard>
        </Grid>

        {/* SEO & Status */}
        <Grid item xs={12} md={6}>
          <InfoCard icon={IconSeo} title="SEO & Status">
            <InfoItem icon={IconTag} label="Meta Title" value={provider.metaTitle} />
            <InfoItem
              icon={IconFileText}
              label="Meta Description"
              value={provider.metaDescription}
            />
            <InfoItem icon={IconFileText} label="Bio" value={provider.bio} />
            <InfoItem
              icon={IconId}
              label="Provider Status"
              value={provider.status?.toUpperCase() || 'PENDING'}
              color={
                provider.status === 'active'
                  ? 'success.main'
                  : provider.status === 'inactive'
                    ? 'error.main'
                    : 'warning.main'
              }
            />
            <InfoItem
              icon={IconId}
              label="Featured"
              value={
                provider.isFeatured === 'active' || provider.isFeatured === true
                  ? 'Active'
                  : 'Inactive'
              }
              color={
                provider.isFeatured === 'active' || provider.isFeatured === true
                  ? 'success.main'
                  : 'text.secondary'
              }
            />

            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 3 }}>
              Meta Keywords
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(provider.metakeywords || '')
                .split(',')
                .filter((keyword) => keyword.trim())
                .map((keyword, idx) => (
                  <Chip key={idx} label={keyword.trim()} size="small" variant="outlined" />
                ))}
            </Box>
          </InfoCard>
        </Grid>
      </Grid>

      {/* Image preview dialog */}
      <ImageDialog open={!!openImage} onClose={handleImageClose} maxWidth="lg">
        <DialogContent sx={{ position: 'relative', p: 0 }}>
          <IconButton
            onClick={handleImageClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <IconX size={20} color="#fff" />
          </IconButton>
          {openImage && isPdfFile(openImage) ? (
            <iframe
              src={openImage}
              title="PDF Preview"
              style={{
                width: '100%',
                height: '80vh',
                border: 'none',
              }}
            />
          ) : (
            <Box
              component="img"
              src={openImage}
              alt="Preview"
              sx={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                bgcolor: 'black',
              }}
            />
          )}
        </DialogContent>
      </ImageDialog>

      {/* Reject dialog */}
      <Dialog
        open={rejectDialog.open}
        onClose={() => {
          setRejectDialog({ open: false, type: null, title: '' });
          setRejectReason('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {rejectDialog.title || 'Reject'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please enter reason for rejection.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
            variant="outlined"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setRejectDialog({ open: false, type: null, title: '' });
                setRejectReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleRejectSubmit}
              disabled={!rejectReason.trim() || loading}
            >
              Submit Rejection
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default ViewProfessionalProvider;


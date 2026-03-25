import React, { useState, useEffect, useMemo } from 'react';
import {
  Avatar,
  Box,
  Typography,
  Stack,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Checkbox, FormControlLabel
} from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import { IconArrowBackUp } from '@tabler/icons-react';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'View On Demand Service' }];

const ViewOndemandService = () => {
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);
  const [rateCards, setRateCards] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [workingImages, setWorkingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const DemandServicesId = localStorage.getItem('DemandServicesId');

  const [isFeatured, setIsFeatured] = useState(false);
  const [featureLoading, setFeatureLoading] = useState(false);


  const getToken = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.token || '' : '';
  };

  const fetchServiceData = async () => {
    const token = getToken();
    if (!token || !DemandServicesId) {
      toast.error('Authentication required');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        URLS.GetOneOnDemandSevice,
        { id: DemandServicesId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const service = response.data?.ondemandservice || {};
      setServiceData(service);
      setIsFeatured(service?.isFeatured === 'active');


      setRateCards(service.rateCards || []);
      setBenefits(service.benefitsOfTheService || []);
      setWorkingImages(service.workingImages || []);
    } catch (error) {
      console.error('Error fetching service data:', error);
      toast.error(error.response?.data?.message || 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };


  const handleFeaturedToggle = async (event) => {
    const checked = event.target.checked;
    const status = checked ? 'active' : 'inactive';
    const token = getToken();

    try {
      setFeatureLoading(true);
      await axios.put(
        `${URLS.AddFeatured}/${DemandServicesId}`,
        { isFeatured: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFeatured(checked);
    } catch (error) {
      toast.error('Failed to update featured status');
    } finally {
      setFeatureLoading(false);
    }
  };


  useEffect(() => {
    fetchServiceData();
  }, []);

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S.No',
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const sortedRows = params.api.getSortedRowIds();
          return sortedRows.indexOf(params.id) + 1;
        },
      },
      {
        field: 'rateCardinfo',
        headerName: 'Rate Card Info',
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={
                params.row.rateCardServiceImage
                  ? `${URLS.FileBase}${params.row.rateCardServiceImage}`
                  : ''
              }
              alt={params.row.rateCardTitle}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="body2">{params.row.rateCardTitle || '-'}</Typography>
          </Box>
        ),
      },
      {
        field: 'serviceName',
        headerName: 'Service Name',
        flex: 1,
      },
      {
        field: 'rateCardPrice',
        headerName: 'Price',
        flex: 1,
      },
      {
        field: 'rateCardQuantity',
        headerName: 'Quantity',
        flex: 1,
      },
      {
        field: 'rateCardVideoUrl',
        headerName: 'YouTube URL',
        flex: 1,
      },
      {
        field: 'serviceDescription',
        headerName: 'Service Description',
        flex: 1,
      },
      {
        field: 'reason',
        headerName: 'Reason',
        flex: 1,
      },
    ],
    [serviceData],
  );

  const rows = useMemo(() => rateCards.map((card, index) => ({ id: index, ...card })), [rateCards]);

  if (loading && !serviceData) {
    return (
      <PageContainer title="View On Demand Service">
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (!serviceData) {
    return (
      <PageContainer title="View On Demand Service">
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <Typography variant="h6">Service not found</Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="View On Demand Service"
      description="View details of the on-demand service"
    >
      <Breadcrumb title="View On Demand Service" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          startIcon={<IconArrowBackUp />}
          disabled={loading}
        >
          Back
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ParentCard
            title={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography variant="h6">Main Image</Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isFeatured}
                      onChange={handleFeaturedToggle}
                      disabled={featureLoading || loading}
                      size="small"
                    />
                  }
                  label="Featured"
                  sx={{ mr: 0 }}
                />
              </Box>
            }
          >

            {serviceData.mainImage ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 280,
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: '1px solid #eee',
                }}
              >
                <img
                  src={`${URLS.FileBase}${serviceData.mainImage}`}
                  alt="Main Service"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            ) : (
              <Typography variant="body1" color="textSecondary" textAlign="center" py={6}>
                No main image available
              </Typography>
            )}
          </ParentCard>
        </Grid>

        {/* <Grid item xs={12} md={6}>
          <ParentCard title="Pricing Details">
            <Stack spacing={2}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Default Title
                </Typography>
                <Typography variant="body1">{serviceData.defaultTitle || '-'}</Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Default Price
                </Typography>
                <Typography variant="body1">{serviceData.defaultPrice || '-'}</Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Default Quantity
                </Typography>
                <Typography variant="body1">{serviceData.defaultQuantity || '-'}</Typography>
              </Paper>
            </Stack>
          </ParentCard>
        </Grid> */}

        <Grid item xs={12} md={6}>
          <ParentCard title="Service Details">
            <Stack spacing={2}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Category
                </Typography>
                <Typography variant="body1">{serviceData.categoryName || '-'}</Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Subcategory
                </Typography>
                <Typography variant="body1">{serviceData.subcategoryName || '-'}</Typography>
              </Paper>


              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Service Title
                </Typography>
                <Typography variant="body1">{serviceData.name || '-'}</Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Slug
                </Typography>
                <Typography variant="body1">{serviceData.slug || serviceData.parmalinks || '-'}</Typography>
              </Paper>
            </Stack>
          </ParentCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ParentCard title="Location">
            <Stack spacing={2}>

              {/* <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Zone
                </Typography>
                <Typography variant="body1">{serviceData.zoneName + ',' || '-'}</Typography>
              </Paper> */}

              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  YouTube URL
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                  {serviceData.videoUrl || '-'}
                </Typography>
              </Paper>
            </Stack>
          </ParentCard>
        </Grid>

        <Grid item xs={12}>
          <ParentCard title="SEO Details">
            <Stack spacing={2}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  SEO Title
                </Typography>
                <Typography variant="body1">{serviceData.seoTitle || '-'}</Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  SEO Keywords
                </Typography>
                <Typography variant="body1">{serviceData.seoTags || '-'}</Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  SEO Description
                </Typography>
                <Typography variant="body1">{serviceData.seoDescription || '-'}</Typography>
              </Paper>
            </Stack>
          </ParentCard>
        </Grid>

        <Grid item xs={12}>
          <ParentCard title="Description">
            {serviceData.description ? (
              <Box
                sx={{
                  p: 2,
                  border: '1px solid #eee',
                  borderRadius: 2,
                  minHeight: 100,
                }}
                dangerouslySetInnerHTML={{ __html: serviceData.description }}
              />
            ) : (
              <Typography variant="body1" color="textSecondary" textAlign="center" py={6}>
                No description available
              </Typography>
            )}
          </ParentCard>
        </Grid>

        <Grid item xs={12}>
          <ParentCard title="Service Benefits">
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
              {benefits.length > 0 ? (
                <Stack spacing={1}>
                  {benefits.map((benefit, index) => (
                    <Typography variant="body1" key={index}>
                      â€¢ {benefit.benefitsOfTheService}
                    </Typography>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No benefits listed
                </Typography>
              )}
            </Paper>
          </ParentCard>
        </Grid>

        <Grid item xs={12}>
          <ParentCard title="Working Images">
            {workingImages.length > 0 ? (
              <Grid container spacing={2}>
                {workingImages.map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      sx={{
                        height: 220,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                        borderRadius: 2,
                        border: '1px solid #eee',
                      }}
                    >
                      <img
                        src={`${URLS.FileBase}${image}`}
                        alt={`Working ${index + 1}`}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="textSecondary" textAlign="center" py={6}>
                No working images available
              </Typography>
            )}
          </ParentCard>
        </Grid>

        {/* <Grid item xs={12}>
          <ParentCard title="Rate Cards">
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
                sx={{
                  '& .MuiDataGrid-cell': {
                    borderRight: '1px solid #eee',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              />
            </Box>
          </ParentCard>
        </Grid> */}
      </Grid>
    </PageContainer>
  );
};

export default ViewOndemandService;

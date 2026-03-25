// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   Stack,
//   Dialog,
//   DialogContent,
//   IconButton,
//   Chip,
//   Tabs,
//   Tab,
// } from '@mui/material';
// import {
//   IconUser,
//   IconBuildingStore,
//   IconFileText,
//   IconCreditCard,
//   IconPhoto,
//   IconMapPin,
//   IconPhone,
//   IconMail,
//   IconTag,
//   IconTruck,
//   IconBuildingBank,
//   IconId,
//   IconSeo,
//   IconX,
//   IconDownload,
//   IconCalendar,
//   IconIdBadge,
//   IconReceipt,
//   IconFileDescription,
//   IconArrowBackUp,
// } from '@tabler/icons-react';
// import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
// import PageContainer from 'src/components/container/PageContainer';
// import { useTheme } from '@mui/material/styles';
// import { useNavigate } from 'react-router';
// import { URLS } from '../../Url';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import placeholderImage from 'src/assets/images/backgrounds/place-holder-image.jpg';

// const BCrumb = [{ to: '/', title: 'Home' }, { title: 'View Store' }];

// const ViewStore = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const storeId = localStorage.getItem('storeId');
//   const [storeData, setStoreData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [currentImage, setCurrentImage] = useState('');
//   const [currentSlug, setCurrentSlug] = useState('');
//   const [tabValue, setTabValue] = useState(0);

//   const token = JSON.parse(localStorage.getItem('user'))?.token || '';



//   // Safe: encode each path segment, normalize slashes, handle empty values
// const getImageUrl = (imagePath) => {
//   const placeholder = placeholderImage; // imported placeholder
//   if (!imagePath) return placeholder;

//   try {
//     // Normalize backslashes and trim
//     let normalized = imagePath.replace(/\\/g, '/').trim();

//     // Remove leading slash if present (because URLS.FileBase already ends with '/')
//     if (normalized.startsWith('/')) normalized = normalized.slice(1);

//     // Encode each path segment to safely handle spaces and special chars
//     const segments = normalized.split('/').map(seg => encodeURIComponent(seg));
//     const encodedPath = segments.join('/');

//     const base = (URLS && URLS.FileBase) ? URLS.FileBase : URLS.FileBase || '';
//     // Ensure base ends with exactly one slash
//     const baseWithSlash = base.endsWith('/') ? base : base + '/';

//     return baseWithSlash + encodedPath;
//   } catch (err) {
//     console.error('getImageUrl error', err);
//     return placeholder;
//   }
// };

//   // âœ… FETCH STORE DATA
//   const getStoreData = async () => {
//     if (!token) {
//       toast.error('Authentication token missing. Please log in.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post(
//         URLS.GetStoreone,
//         { id: storeId },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );

//       if (res.data.success) {
//         setStoreData(res.data.store);
//       }
//     } catch (error) {
//       toast.error('Failed to fetch store details.');
//       console.error('Failed to fetch store data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (storeId) {
//       getStoreData();
//     }
//   }, [storeId]);

//   // âœ… HANDLE IMAGE CLICK - OPEN PREVIEW DIALOG
//   const handleImageClick = (imageUrl, slug = '') => {
//     setCurrentImage(imageUrl);
//     setCurrentSlug(slug || storeData?.slug || storeData?.name);
//     setOpenDialog(true);
//   };

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const isPdfFile = (fileName) => {
//     return fileName?.toLowerCase().endsWith('.pdf');
//   };

// const downloadFile = (fileUrl, fileName) => {
//   try {
//     // âœ… Encode the file path properly
//     const encodedUrl = encodeURI(fileUrl);
//     const fullUrl = `${URLS.FileBase}${encodedUrl}`;
    
//     console.log('ðŸ“¥ Downloading from:', fullUrl);
    
//     // Create a temporary anchor element
//     const link = document.createElement('a');
//     link.href = fullUrl;
//     link.download = fileName || 'document';
//     link.target = '_blank'; // â† Open in new tab if needed
    
//     // Append to DOM
//     document.body.appendChild(link);
    
//     // Trigger download
//     link.click();
    
//     // Cleanup
//     setTimeout(() => {
//       document.body.removeChild(link);
//     }, 100);
    
//     toast.success('Download started!');
//   } catch (error) {
//     console.error('Download error:', error);
//     toast.error('Failed to download file');
//   }
// };

//   // âœ… INFO CARD COMPONENT
//   const InfoCard = ({ icon: Icon, title, children }) => (
//     <Card
//       sx={{
//         borderRadius: '16px',
//         boxShadow: theme.shadows[3],
//         height: '100%',
//         border: `1px solid ${theme.palette.divider}`,
//         transition: 'all 0.3s ease',
//         '&:hover': {
//           transform: 'translateY(-4px)',
//           boxShadow: theme.shadows[8],
//         },
//       }}
//     >
//       <CardContent sx={{ p: 3 }}>
//         <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
//           <Box
//             sx={{
//               p: 1.5,
//               borderRadius: '12px',
//               bgcolor: `${theme.palette.primary.main}15`,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//           >
//             <Icon size={24} color={theme.palette.primary.main} />
//           </Box>
//           <Typography variant="h6" fontWeight={600} color="primary">
//             {title}
//           </Typography>
//         </Stack>
//         {children}
//       </CardContent>
//     </Card>
//   );

//   // âœ… INFO ITEM COMPONENT
//   const InfoItem = ({ icon: Icon, label, value, color = 'text.primary' }) => (
//     <Box sx={{ mb: 2.5 }}>
//       <Stack direction="row" alignItems="center" spacing={1.5}>
//         <Icon size={18} color={theme.palette.text.secondary} />
//         <Typography variant="body2" color="text.secondary" fontWeight={500}>
//           {label}:
//         </Typography>
//       </Stack>
//       <Typography variant="body1" fontWeight={600} color={color} sx={{ mt: 0.5, ml: 4.5 }}>
//         {value || 'N/A'}
//       </Typography>
//     </Box>
//   );

//   // âœ… DOCUMENT VIEWER - SHOWS IMAGE OR PLACEHOLDER


//   // âœ… DOCUMENT VIEWER - SHOWS IMAGE OR PLACEHOLDER
// const DocumentViewer = ({ title, filePath, documentName }) => {
//   const isPDF = isPdfFile(filePath);
//   const fileName = documentName || (filePath ? filePath.split('/').pop() : title);
//   const hasFile = filePath && filePath !== '';

//   const handleViewClick = (e) => {
//     e.stopPropagation();
//     if (hasFile && !isPDF) {
//       handleImageClick(getImageUrl(filePath), title);
//     }
//   };

//   const handleDownloadClick = (e) => {
//     e.stopPropagation();
//     if (hasFile) {
//       downloadFile(filePath, fileName);
//     }
//   };

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="subtitle1" fontWeight={600} gutterBottom>
//         {title}
//       </Typography>
//       <Box
//         sx={{
//           borderRadius: '12px',
//           overflow: 'hidden',
//           height: 200,
//           border: `2px solid ${theme.palette.divider}`,
//           transition: 'all 0.3s ease',
//           position: 'relative',
//           cursor: hasFile ? 'pointer' : 'default',
//           '&:hover': {
//             transform: hasFile ? 'scale(1.02)' : 'none',
//             border: hasFile ? `2px solid ${theme.palette.primary.main}` : `2px solid ${theme.palette.divider}`,
//             '& .overlay': {
//               opacity: hasFile ? 1 : 0,
//             },
//           },
//         }}
//         onClick={() => {
//           if (hasFile && !isPDF) {
//             handleImageClick(getImageUrl(filePath), title);
//           }
//         }}
//       >
//         {isPDF && hasFile ? (
//           // ðŸ“„ PDF FILE
//           <Box
//             sx={{
//               width: '100%',
//               height: '100%',
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               justifyContent: 'center',
//               bgcolor: theme.palette.grey[100],
//             }}
//           >
//             <IconFileDescription size={48} color={theme.palette.primary.main} />
//             <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', px: 1 }}>
//               {fileName}
//             </Typography>
//           </Box>
//         ) : (
//           // ðŸ–¼ï¸ IMAGE OR PLACEHOLDER
//           <Box
//             component="img"
//             src={hasFile ? getImageUrl(filePath) : placeholderImage}
//             alt={title}
//             sx={{
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//               opacity: hasFile ? 1 : 0.6,
//             }}
//             onError={(e) => {
//               e.target.src = placeholderImage;
//             }}
//           />
//         )}

//         {/* âœ… OVERLAY - ONLY SHOW IF FILE EXISTS */}
//         {hasFile && (
//           <Box
//             className="overlay"
//             sx={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               bgcolor: 'rgba(0,0,0,0.7)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: 1,
//               opacity: 0,
//               transition: 'opacity 0.3s ease',
//             }}
//           >
//             {!isPDF && (
//               <Button
//                 variant="contained"
//                 color="primary"
//                 size="small"
//                 onClick={handleViewClick}
//               >
//                 View
//               </Button>
//             )}
//             <Button
//               variant="contained"
//               color="primary"
//               size="small"
//               startIcon={<IconDownload size={16} />}
//               onClick={handleDownloadClick}
//             >
//               Download
//             </Button>
//           </Box>
//         )}

//         {/* âœ… NO DATA BADGE - ONLY SHOW IF NO FILE */}
//         {!hasFile && (
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: 8,
//               right: 8,
//               bgcolor: 'rgba(255,0,0,0.7)',
//               color: 'white',
//               borderRadius: '8px',
//               px: 1,
//               py: 0.5,
//               fontSize: '0.7rem',
//               fontWeight: 600,
//             }}
//           >
//             NO DATA
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };


//   // âœ… LOADING STATE
//   if (loading || !storeData) {
//     return (
//       <PageContainer title="Store Details" description="View store details">
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//           <Typography>Loading...</Typography>
//         </Box>
//       </PageContainer>
//     );
//   }

//   // âœ… MAIN RENDER
//   return (
//     <PageContainer title="Store Details" description="View store details">
//       {/* HEADER */}
//       <Box sx={{ position: 'relative', zIndex: 2 }}>
//         <Breadcrumb title="View Store" items={BCrumb} />
//       </Box>
//       <ToastContainer position="top-right" autoClose={3000} />

//       <Box sx={{ float: 'right', mb: 2 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => navigate(-1)}
//           startIcon={<IconArrowBackUp />}
//         >
//           Back
//         </Button>
//       </Box>

//       <Grid container spacing={3}>
//         {/* PERSONAL INFO SECTION */}
//         <Grid item xs={12} lg={6}>
//           <InfoCard icon={IconUser} title="Personal Information">
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={5}>
//                 <Box
//                   sx={{
//                     position: 'relative',
//                     borderRadius: '16px',
//                     overflow: 'hidden',
//                     height: 200,
//                     border: `3px solid ${theme.palette.primary.main}20`,
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                     '&:hover': {
//                       transform: 'scale(1.02)',
//                       border: `3px solid ${theme.palette.primary.main}`,
//                       boxShadow: theme.shadows[4],
//                     }
//                   }}
//                   onClick={() => handleImageClick(getImageUrl(storeData?.image))}
//                 >
//              <Box
//               component="img"
//               src={getImageUrl(storeData?.image)}
//               alt={storeData?.name || 'image'}
//               sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = placeholderImage;
//               }}
//             />
//                 </Box>
//               </Grid>
//               <Grid item xs={12} md={7}>
//                 <InfoItem icon={IconUser} label="Full Name" value={storeData?.personalName} />
//                 <InfoItem icon={IconMail} label="Email" value={storeData?.personalEmail} />
//                 <InfoItem icon={IconPhone} label="Phone" value={storeData?.personalPhone} />
//                 <InfoItem icon={IconCalendar} label="Date of Birth" value={storeData?.dob} />
//                 <InfoItem icon={IconIdBadge} label="Experience" value={`${storeData?.experiance} years`} />
//               </Grid>
//             </Grid>
//           </InfoCard>
//         </Grid>

//         {/* BUSINESS INFO SECTION */}
//         <Grid item xs={12} lg={6}>
//           <InfoCard icon={IconBuildingStore} title="Business Information">
//             <InfoItem icon={IconBuildingStore} label="Business Name" value={storeData?.name} />
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, ml: 4.5 }}>
//               <Chip
//                 label={storeData?.status}
//                 color={storeData?.status === 'active' ? 'success' : 'error'}
//                 size="small"
//               />
//             </Box>
//             <InfoItem icon={IconPhone} label="Business Phone" value={storeData?.phone} />
//             <InfoItem icon={IconMail} label="Business Email" value={storeData?.email} />
//             <InfoItem
//               icon={IconTruck}
//               label="Delivery Charge"
//               value={`â‚¹${storeData?.deliveryCharge || 0}`}
//               color="success.main"
//             />
//             <InfoItem icon={IconReceipt} label="GST Bill Number" value={storeData?.gas_bill_number} />
//           </InfoCard>
//         </Grid>

//         {/* LOCATION SECTION */}
//         <Grid item xs={12}>
//           <InfoCard icon={IconMapPin} title="Store Details & Location">
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={6}>
//                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                   Description
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   sx={{
//                     bgcolor: `${theme.palette.primary.main}08`,
//                     p: 2,
//                     borderRadius: 2,
//                     border: `1px solid ${theme.palette.primary.main}20`,
//                   }}
//                 >
//                   {storeData?.description || 'No description available'}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <InfoItem icon={IconMapPin} label="Address" value={storeData?.address} />
//                 <InfoItem icon={IconMapPin} label="City" value={storeData?.cityName} />
//                 <InfoItem icon={IconMapPin} label="State" value={storeData?.stateName} />
//                 <InfoItem icon={IconMapPin} label="Zone" value={storeData?.zoneName} />
//                 <InfoItem icon={IconMapPin} label="Pincode" value={storeData?.pincode} />
//                 <InfoItem
//                   icon={IconMapPin}
//                   label="Delivery Pincodes"
//                   value={storeData?.deliveryPincode?.join(', ') || 'N/A'}
//                 />
//               </Grid>
//             </Grid>
//           </InfoCard>
//         </Grid>

//         {/* KYC DOCUMENTS SECTION */}
//       {/* KYC DOCUMENTS SECTION */}
// <Grid item xs={12}>
//   <InfoCard icon={IconFileText} title="KYC Documents">
//     <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
//       <Tab label="Personal Documents" />
//       <Tab label="Business Proof" />
//     </Tabs>

//     {tabValue === 0 && (
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6} md={4} lg={2.4}>
//           <DocumentViewer title="PAN Card Front" filePath={storeData?.pan_card_front} />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4} lg={2.4}>
//           <DocumentViewer title="PAN Card Back" filePath={storeData?.pan_card_back} />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4} lg={2.4}>
//           <DocumentViewer title="Aadhar Card Front" filePath={storeData?.aadhar_card_front} />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4} lg={2.4}>
//           <DocumentViewer title="Aadhar Card Back" filePath={storeData?.aadhar_card_back} />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4} lg={2.4}>
//           <DocumentViewer title="Gas Bill" filePath={storeData?.gas_bill} />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4} lg={2.4}>
//           <DocumentViewer title="Other Document" filePath={storeData?.otherrDocumentImage} />
//         </Grid>
//       </Grid>
//     )}

//     {tabValue === 1 && (
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6} md={4} lg={2.4}>
//           <DocumentViewer title="Business Proof" filePath={storeData?.business_proof} />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4} lg={2.4}>
//           <DocumentViewer title="GST Bill" filePath={storeData?.gst_bill} />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4} lg={2.4}>
//           <DocumentViewer title="Bill Sample" filePath={storeData?.bill_sample} />
//         </Grid>
//       </Grid>
//     )}
//   </InfoCard>
// </Grid>


//         {/* BANK DETAILS SECTION */}
//         <Grid item xs={12} md={6}>
//           <InfoCard icon={IconBuildingBank} title="Bank Details">
//             <InfoItem icon={IconBuildingBank} label="Bank Name" value={storeData?.bankName} />
//             <InfoItem icon={IconMapPin} label="Branch Name" value={storeData?.branchName} />
//             <InfoItem icon={IconUser} label="Account Holder" value={storeData?.accountHolderName} />
//             <InfoItem icon={IconCreditCard} label="Account Number" value={storeData?.accountNumber} />
//             <InfoItem icon={IconId} label="IFSC Code" value={storeData?.ifsCode} />
//             <InfoItem icon={IconCreditCard} label="UPI ID" value={storeData?.upiId} />
//           </InfoCard>
//         </Grid>

//         {/* ADDITIONAL INFO SECTION */}
//         <Grid item xs={12} md={6}>
//           <InfoCard icon={IconSeo} title="Additional Information">
//             <InfoItem icon={IconTag} label="PAN Number" value={storeData?.pan_number} />
//             <InfoItem icon={IconIdBadge} label="Aadhar Number" value={storeData?.aadhar_number} />
//             <InfoItem icon={IconReceipt} label="Business Number" value={storeData?.business_number} />
            
//             {/* PERMALINK */}
//             <Box sx={{ mb: 2.5 }}>
//               <Stack direction="row" alignItems="center" spacing={1.5}>
//                 <IconSeo size={18} color={theme.palette.text.secondary} />
//                 <Typography variant="body2" color="text.secondary" fontWeight={500}>
//                   Permalink:
//                 </Typography>
//               </Stack>
//               <Typography 
//                 variant="body2" 
//                 sx={{ 
//                   mt: 0.5, 
//                   ml: 4.5,
//                   color: 'primary.main',
//                   fontWeight: 600,
//                   wordBreak: 'break-all',
//                   bgcolor: `${theme.palette.primary.main}08`,
//                   p: 1,
//                   borderRadius: 1,
//                 }}
//               >
//                 https://doorstephub.com/{storeData?.slug || storeData?.name?.toLowerCase().replace(/\s+/g, '-')}
//               </Typography>
//             </Box>
            
//             <InfoItem icon={IconSeo} label="Meta Title" value={storeData?.metaTitle} />
            
//             <Box sx={{ mb: 2.5 }}>
//               <Stack direction="row" alignItems="center" spacing={1.5}>
//                 <IconFileText size={18} color={theme.palette.text.secondary} />
//                 <Typography variant="body2" color="text.secondary" fontWeight={500}>
//                   Meta Description:
//                 </Typography>
//               </Stack>
//               <Typography
//                 variant="body2"
//                 sx={{
//                   mt: 0.5,
//                   ml: 4.5,
//                   bgcolor: `${theme.palette.secondary.main}08`,
//                   p: 1.5,
//                   borderRadius: 1,
//                   border: `1px solid ${theme.palette.secondary.main}20`,
//                 }}
//               >
//                 {storeData?.metaDescription || 'N/A'}
//               </Typography>
//             </Box>
            
//             <InfoItem icon={IconTag} label="Meta Keywords" value={storeData?.metakeywords} />
//           </InfoCard>
//         </Grid>

//         {/* BUSINESS IMAGES SECTION */}
//         <Grid item xs={12}>
//           <InfoCard icon={IconPhoto} title="Business Images">
//             {storeData.business_images && storeData.business_images.length > 0 ? (
//               <Grid container spacing={2}>
//                 {storeData.business_images.map((image, index) => (
//                   <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
//                     <Box
//                       sx={{
//                         position: 'relative',
//                         borderRadius: '16px',
//                         overflow: 'hidden',
//                         height: 200,
//                         border: `2px solid ${theme.palette.divider}`,
//                         transition: 'all 0.3s ease',
//                         cursor: 'pointer',
//                         '&:hover': {
//                           transform: 'scale(1.05)',
//                           border: `2px solid ${theme.palette.primary.main}`,
//                           boxShadow: theme.shadows[8],
//                         },
//                       }}
//                       onClick={() => handleImageClick(getImageUrl(image))}
//                     >
//                       <Box
//                         component="img"
//                         src={getImageUrl(image)}
//                         alt={`Business image ${index + 1}`}
//                         sx={{
//                           width: '100%',
//                           height: '100%',
//                           objectFit: 'cover',
//                         }}
//                         onError={(e) => {
//                           e.target.src = placeholderImage;
//                         }}
//                       />
//                       <Box
//                         sx={{
//                           position: 'absolute',
//                           top: 8,
//                           right: 8,
//                           bgcolor: 'rgba(0,0,0,0.6)',
//                           color: 'white',
//                           borderRadius: '12px',
//                           px: 1,
//                           py: 0.5,
//                           fontSize: '0.75rem',
//                         }}
//                       >
//                         {index + 1}
//                       </Box>
//                     </Box>
//                   </Grid>
//                 ))}
//               </Grid>
//             ) : (
//               <Box
//                 sx={{
//                   textAlign: 'center',
//                   py: 8,
//                   bgcolor: `${theme.palette.grey[100]}`,
//                   borderRadius: 2,
//                   border: `2px dashed ${theme.palette.grey[300]}`,
//                 }}
//               >
//                 <IconPhoto size={48} color={theme.palette.grey[400]} />
//                 <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
//                   ðŸ“· No business images available
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
//                   Upload images to showcase your business
//                 </Typography>
//               </Box>
//             )}
//           </InfoCard>
//         </Grid>
//       </Grid>

//       {/* IMAGE PREVIEW DIALOG */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
//         <DialogContent sx={{ position: 'relative', p: 2 }}>
//           <IconButton
//             sx={{
//               position: 'absolute',
//               top: 8,
//               right: 8,
//               zIndex: 1,
//               bgcolor: 'rgba(255,255,255,0.9)',
//               '&:hover': {
//                 bgcolor: 'rgba(255,255,255,1)',
//               }
//             }}
//             onClick={() => setOpenDialog(false)}
//           >
//             <IconX />
//           </IconButton>
          
//           {/* PERMALINK IN PREVIEW */}
//           {currentSlug && (
//             <Box sx={{ mb: 2, p: 1.5, bgcolor: theme.palette.grey[100], borderRadius: 1 }}>
//               <Typography variant="caption" color="text.secondary">
//                 ðŸ“ Permalink:
//               </Typography>
//               <Typography 
//                 variant="body2" 
//                 sx={{ 
//                   color: 'primary.main', 
//                   fontWeight: 600,
//                   wordBreak: 'break-all',
//                   mt: 0.5
//                 }}
//               >
//                 https://doorstephub.com/{currentSlug?.toLowerCase().replace(/\s+/g, '-')}
//               </Typography>
//             </Box>
//           )}
          
//           <Box
//             component="img"
//             src={currentImage}
//             sx={{
//               width: '100%',
//               height: 'auto',
//               maxHeight: '75vh',
//               objectFit: 'contain',
//               borderRadius: 1,
//             }}
//           />
//         </DialogContent>
//       </Dialog>
//     </PageContainer>
//   );
// };

// export default ViewStore;

import React, { useState, useEffect, useCallback } from 'react';
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
  Tabs,
  Tab,
} from '@mui/material';
import {
  IconUser,
  IconBuildingStore,
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
  IconSeo,
  IconX,
  IconDownload,
  IconCalendar,
  IconIdBadge,
  IconReceipt,
  IconFileDescription,
  IconArrowBackUp,
  IconUpload,
} from '@tabler/icons-react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import { URLS } from '../../Url';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import placeholderImage from 'src/assets/images/backgrounds/place-holder-image.jpg';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'View Store' }];

const ViewStore = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const storeId = localStorage.getItem('storeId');
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentSlug, setCurrentSlug] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  // â­ MOVED OUTSIDE WITH useCallback
const navigateToEditStore = useCallback(() => {
  const id = localStorage.getItem('storeId');
  
  if (id) {
    console.log('âœ… Navigating to edit store with ID:', id);
    navigate('/editstore');  // â­ JUST NAVIGATE - storeId already in localStorage
  } else {
    toast.error('Store ID not found');
  }
}, [navigate]);


  // Safe: encode each path segment
// const getImageUrl = (imagePath) => {
//   const placeholder = placeholderImage;
//   if (!imagePath) return placeholder;

//   try {
//     // If already has full URL, return as is
//     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//       return imagePath;
//     }

//     // If it doesn't start with 'uploads/', add URLS.FileBase
//     if (!imagePath.startsWith('uploads/')) {
//       const base = (URLS && URLS.FileBase) ? URLS.FileBase : URLS.FileBase || '';
//       const baseWithSlash = base.endsWith('/') ? base : base + '/';
//       return baseWithSlash + imagePath;
//     }

//     // If it starts with 'uploads/', just add URLS.FileBase
//     const base = (URLS && URLS.FileBase) ? URLS.FileBase : URLS.FileBase || '';
//     const baseWithSlash = base.endsWith('/') ? base : base + '/';
//     return baseWithSlash + imagePath;
//   } catch (err) {
//     console.error('getImageUrl error', err);
//     return placeholder;
//   }
// };


const getImageUrl = (imagePath) => {
  const placeholder = placeholderImage;
  if (!imagePath) return placeholder;

  try {
    // If already has full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('âœ… Full URL detected:', imagePath);
      return imagePath;
    }

    // Get base URL
    const base = (URLS && URLS.FileBase) ? URLS.FileBase : URLS.FileBase || '';
    const baseWithSlash = base.endsWith('/') ? base : base + '/';

    const fullUrl = baseWithSlash + imagePath;
    console.log('âœ… Constructed URL:', fullUrl);
    
    return fullUrl;
  } catch (err) {
    console.error('getImageUrl error', err);
    return placeholder;
  }
};


  // âœ… FETCH STORE DATA
  const getStoreData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetStoreone,
        { id: storeId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setStoreData(res.data.store);
      }
    } catch (error) {
      toast.error('Failed to fetch store details.');
      console.error('Failed to fetch store data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      getStoreData();
    }
  }, [storeId]);

  const handleImageClick = (imageUrl, slug = '') => {
    setCurrentImage(imageUrl);
    setCurrentSlug(slug || storeData?.slug || storeData?.name);
    setOpenDialog(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const isPdfFile = (fileName) => {
    return fileName?.toLowerCase().endsWith('.pdf');
  };

  const downloadFile = (fileUrl, fileName) => {
    try {
      const encodedUrl = encodeURI(fileUrl);
      const fullUrl = `${URLS.FileBase}${encodedUrl}`;
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = fileName || 'document';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  // âœ… INFO CARD COMPONENT
  const InfoCard = ({ icon: Icon, title, children }) => (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: theme.shadows[3],
        height: '100%',
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

  // âœ… INFO ITEM COMPONENT
  const InfoItem = ({ icon: Icon, label, value, color = 'text.primary' }) => (
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

  // âœ… DOCUMENT VIEWER
  const DocumentViewer = ({ title, filePath, documentName }) => {
    const isPDF = isPdfFile(filePath);
    const fileName = documentName || (filePath ? filePath.split('/').pop() : title);
    const hasFile = filePath && filePath !== '';

    const handleViewClick = (e) => {
      e.stopPropagation();
      if (hasFile && !isPDF) {
        handleImageClick(getImageUrl(filePath), title);
      }
    };

    const handleDownloadClick = (e) => {
      e.stopPropagation();
      if (hasFile) {
        downloadFile(filePath, fileName);
      }
    };

    // â­ HANDLE UPLOAD CLICK
    const handleUploadClick = (e) => {
      e.stopPropagation();
      console.log('ðŸ“¤ Upload button clicked');
      navigateToEditStore();
    };

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Box
          sx={{
            borderRadius: '12px',
            overflow: 'hidden',
            height: 200,
            border: `2px solid ${theme.palette.divider}`,
            transition: 'all 0.3s ease',
            position: 'relative',
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.02)',
              border: `2px solid ${theme.palette.primary.main}`,
              '& .overlay': {
                opacity: 1,
              },
            },
          }}
          onClick={() => {
            if (hasFile && !isPDF) {
              handleImageClick(getImageUrl(filePath), title);
            }
          }}
        >
          {isPDF && hasFile ? (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: theme.palette.grey[100],
              }}
            >
              <IconFileDescription size={48} color={theme.palette.primary.main} />
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', px: 1 }}>
                {fileName}
              </Typography>
            </Box>
          ) : (
            <Box
              component="img"
              src={hasFile ? getImageUrl(filePath) : placeholderImage}
              alt={title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: hasFile ? 1 : 0.6,
              }}
              onError={(e) => {
                e.target.src = placeholderImage;
              }}
            />
          )}

          {/* â­ OVERLAY */}
          <Box
            className="overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            {hasFile && !isPDF && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleViewClick}
              >
                View
              </Button>
            )}
            {hasFile && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<IconDownload size={16} />}
                onClick={handleDownloadClick}
              >
                Download
              </Button>
            )}
            {!hasFile && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<IconUpload size={16} />}
                onClick={handleUploadClick}
              >
                Upload
              </Button>
            )}
          </Box>

          {!hasFile && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'rgba(255,0,0,0.7)',
                color: 'white',
                borderRadius: '8px',
                px: 1,
                py: 0.5,
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              NO DATA
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  // âœ… LOADING STATE
  if (loading || !storeData) {
    return (
      <PageContainer title="Store Details" description="View store details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Loading...</Typography>
        </Box>
      </PageContainer>
    );
  }

  // âœ… MAIN RENDER
  return (
    <PageContainer title="Store Details" description="View store details">
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Breadcrumb title="View Store" items={BCrumb} />
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
        {/* STORE NAME & PERMALINK */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: '16px',
              boxShadow: theme.shadows[3],
              border: `1px solid ${theme.palette.divider}`,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                  {storeData?.name || 'Store Name'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Business Store Details & Information
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconSeo size={20} color={theme.palette.primary.main} />
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                    Permalink:
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    wordBreak: 'break-all',
                    bgcolor: theme.palette.background.paper,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.primary.main}20`,
                  }}
                >
                  https://doorstephub.com/{storeData?.slug || storeData?.name?.toLowerCase().replace(/\s+/g, '-')}
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ mb: 1 }}>
                  Status:
                </Typography>
                <Chip
                  label={storeData?.status || 'N/A'}
                  color={storeData?.status === 'active' ? 'success' : 'error'}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* PERSONAL INFO */}
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
                    border: `3px solid ${theme.palette.primary.main}20`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      border: `3px solid ${theme.palette.primary.main}`,
                      boxShadow: theme.shadows[4],
                      '& .upload-overlay': {
                        opacity: 1,
                      },
                    },
                  }}
                  onClick={() => {
                    if (storeData?.image) {
                      handleImageClick(getImageUrl(storeData?.image));
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={getImageUrl(storeData?.image)}
                    alt={storeData?.name || 'image'}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImage;
                    }}
                  />

                  {!storeData?.image && (
                    <Box
                      className="upload-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<IconUpload size={18} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('ðŸ–¼ï¸ Profile image upload clicked');
                          navigateToEditStore();
                        }}
                      >
                        Upload Image
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <InfoItem icon={IconUser} label="Full Name" value={storeData?.personalName} />
                <InfoItem icon={IconMail} label="Email" value={storeData?.personalEmail} />
                <InfoItem icon={IconPhone} label="Phone" value={storeData?.personalPhone} />
                <InfoItem icon={IconCalendar} label="Date of Birth" value={storeData?.dob} />
                <InfoItem icon={IconIdBadge} label="Experience" value={`${storeData?.experiance} years`} />
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>

        {/* BUSINESS INFO */}
        <Grid item xs={12} lg={6}>
          <InfoCard icon={IconBuildingStore} title="Business Information">
            <InfoItem icon={IconBuildingStore} label="Business Name" value={storeData?.name} />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, ml: 4.5 }}>
              <Chip
                label={storeData?.status}
                color={storeData?.status === 'active' ? 'success' : 'error'}
                size="small"
              />
            </Box>
            <InfoItem icon={IconPhone} label="Business Phone" value={storeData?.phone} />
            <InfoItem icon={IconMail} label="Business Email" value={storeData?.email} />
            <InfoItem
              icon={IconTruck}
              label="Delivery Charge"
              value={`â‚¹${storeData?.deliveryCharge || 0}`}
              color="success.main"
            />
            <InfoItem icon={IconReceipt} label="GST Bill Number" value={storeData?.gas_bill_number} />
          </InfoCard>
        </Grid>

        {/* KYC DOCUMENTS */}
        <Grid item xs={12}>
          <InfoCard icon={IconFileText} title="KYC Documents">
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Personal Documents" />
              <Tab label="Business Proof" />
            </Tabs>

            {tabValue === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                  <DocumentViewer title="PAN Card Front" filePath={storeData?.pan_card_front} />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                  <DocumentViewer title="PAN Card Back" filePath={storeData?.pan_card_back} />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                  <DocumentViewer title="Aadhar Card Front" filePath={storeData?.aadhar_card_front} />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                  <DocumentViewer title="Aadhar Card Back" filePath={storeData?.aadhar_card_back} />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                  <DocumentViewer title="Gas Bill" filePath={storeData?.gas_bill} />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                  <DocumentViewer title="Other Document" filePath={storeData?.otherrDocumentImage} />
                </Grid>
              </Grid>
            )}

            {tabValue === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                  <DocumentViewer title="Business Proof" filePath={storeData?.business_proof} />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                  <DocumentViewer title="GST Bill" filePath={storeData?.gst_bill} />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                  <DocumentViewer title="Bill Sample" filePath={storeData?.bill_sample} />
                </Grid>
              </Grid>
            )}
          </InfoCard>
        </Grid>

        {/* BANK DETAILS */}
        <Grid item xs={12} md={6}>
          <InfoCard icon={IconBuildingBank} title="Bank Details">
            <InfoItem icon={IconBuildingBank} label="Bank Name" value={storeData?.bankName} />
            <InfoItem icon={IconMapPin} label="Branch Name" value={storeData?.branchName} />
            <InfoItem icon={IconUser} label="Account Holder" value={storeData?.accountHolderName} />
            <InfoItem icon={IconCreditCard} label="Account Number" value={storeData?.accountNumber} />
            <InfoItem icon={IconId} label="IFSC Code" value={storeData?.ifsCode} />
            <InfoItem icon={IconCreditCard} label="UPI ID" value={storeData?.upiId} />
          </InfoCard>
        </Grid>

        {/* ADDITIONAL INFO */}
        <Grid item xs={12} md={6}>
          <InfoCard icon={IconSeo} title="Additional Information">
            <InfoItem icon={IconTag} label="PAN Number" value={storeData?.pan_number} />
            <InfoItem icon={IconIdBadge} label="Aadhar Number" value={storeData?.aadhar_number} />
            <InfoItem icon={IconReceipt} label="Business Number" value={storeData?.business_number} />
          </InfoCard>
        </Grid>

        {/* BUSINESS IMAGES */}
        <Grid item xs={12}>
          <InfoCard icon={IconPhoto} title="Business Images">
            {storeData.business_images && storeData.business_images.length > 0 ? (
              <Grid container spacing={2}>
                {storeData.business_images.map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Box
                      sx={{
                        position: 'relative',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        height: 200,
                        border: `2px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          border: `2px solid ${theme.palette.primary.main}`,
                          boxShadow: theme.shadows[8],
                        },
                      }}
                      onClick={() => handleImageClick(getImageUrl(image))}
                    >
                      <Box
                        component="img"
                        src={getImageUrl(image)}
                        alt={`Business image ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.src = placeholderImage;
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          borderRadius: '12px',
                          px: 1,
                          py: 0.5,
                          fontSize: '0.75rem',
                        }}
                      >
                        {index + 1}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  bgcolor: `${theme.palette.grey[100]}`,
                  borderRadius: 2,
                  border: `2px dashed ${theme.palette.grey[300]}`,
                }}
              >
                <IconPhoto size={48} color={theme.palette.grey[400]} />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  ðŸ“· No business images available
                </Typography>
              </Box>
            )}
          </InfoCard>
        </Grid>
      </Grid>

      {/* IMAGE PREVIEW DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogContent sx={{ position: 'relative', p: 2 }}>
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            }}
            onClick={() => setOpenDialog(false)}
          >
            <IconX />
          </IconButton>

          {currentSlug && (
            <Box sx={{ mb: 2, p: 1.5, bgcolor: theme.palette.grey[100], borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                ðŸ“ Permalink:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  wordBreak: 'break-all',
                  mt: 0.5,
                }}
              >
                https://doorstephub.com/{currentSlug?.toLowerCase().replace(/\s+/g, '-')}
              </Typography>
            </Box>
          )}

          <Box
            component="img"
            src={currentImage}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '75vh',
              objectFit: 'contain',
              borderRadius: 1,
            }}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default ViewStore;

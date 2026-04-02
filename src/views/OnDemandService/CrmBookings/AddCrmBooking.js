// import React, { useState, useEffect, useCallback } from 'react';
// import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
// import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
// import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
// import PageContainer from 'src/components/container/PageContainer';
// import { LoadScript, Autocomplete } from '@react-google-maps/api';
// import ParentCard from '../../../components/shared/ParentCard';
// import { toast, ToastContainer } from 'react-toastify';
// import { IconArrowBackUp } from '@tabler/icons-react';
// import { useNavigate } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
// import { styled } from '@mui/material/styles';
// import { URLS } from '../../../Url';
// import axios from 'axios';
// import {
//   Button,
//   Select,
//   MenuItem,
//   Box,
//   Grid,
//   CircularProgress,
//   Checkbox,
//   Tabs,
//   Tab,
//   Card,
//   CardContent,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Chip,
//   Divider,
// } from '@mui/material';

// const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Add CRM Booking' }];

// const CustomSelect = styled(Select)({
//   '& .MuiOutlinedInput-root': {
//     borderRadius: '8px',
//   },
// });

// const AddressCard = styled(Card)(({ theme, selected }) => ({
//   border: selected
//     ? `2px solid ${theme.palette.primary.main}`
//     : `1px solid ${theme.palette.divider}`,
//   cursor: 'pointer',
//   transition: 'all 0.2s ease-in-out',
//   '&:hover': {
//     borderColor: theme.palette.primary.main,
//     boxShadow: theme.shadows[4],
//   },
// }));

// const TabPanel = ({ children, value, index, ...other }) => (
//   <div
//     role="tabpanel"
//     hidden={value !== index}
//     id={`booking-tabpanel-${index}`}
//     aria-labelledby={`booking-tab-${index}`}
//     {...other}
//   >
//     {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//   </div>
// );

// const libraries = ['places'];

// const AddCrmBooking = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);
//   const [autocomplete, setAutocomplete] = useState(null);
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const [showManualAddress, setShowManualAddress] = useState(false);

//   // Customer Details
//   const [customerForm, setCustomerForm] = useState({
//     customerName: '',
//     email: '',
//     mobileNumber: '',
//     alternateNumber: '',
//     address: {
//       countryName: '',
//       stateName: '',
//       cityName: '',
//       area: '',
//       flat: '',
//       postalCode: '',
//       addressLineOne: '',
//       addressLineTwo: '',
//       type: 'Home',
//       latitude: '',
//       longitude: '',
//       _id: '',
//       defaultAddress: false,
//     },
//   });

//   // Service Details
//   const [serviceForm, setServiceForm] = useState({
//     categoryId: '',
//     subcategoryId: '',
//     serviceId: '',
//     selectedRateCards: [],
//     totalAmount: 0,
//     sourceOfLead: '',
//     bookedDate: '',
//     bookedTime: '',
//     additionalInfo: '',
//   });

//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [services, setServices] = useState([]);
//   const [rateCards, setRateCards] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [userDetails, setUserDetails] = useState(null);
//   const [userAddresses, setUserAddresses] = useState([]);
//   const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
//   const [addressDialogOpen, setAddressDialogOpen] = useState(false);

//   const getToken = useCallback(() => {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user)?.token || '' : '';
//   }, []);

//   useEffect(() => {
//     if (window.google) {
//       setScriptLoaded(true);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       if (customerForm.mobileNumber.length === 10) {
//         const token = getToken();
//         if (!token) return;

//         try {
//           const response = await axios.post(
//             URLS.GetUserDetailsByPhone,
//             { phone: customerForm.mobileNumber },
//             { headers: { Authorization: `Bearer ${token}` } },
//           );

//           if (response.data && response.data.data) {
//             const user = response.data.data;
//             const addresses = response.data.addresses || [];

//             setUserDetails(user);
//             setUserAddresses(addresses);

//             // Set customer form with user details
//             setCustomerForm((prev) => ({
//               ...prev,
//               customerName: user.name || '',
//               email: user.email || user.phone || '',
//               alternateNumber: user.alternatePhone || '',
//             }));

//             // If there are addresses, select the default one or first one
//             if (addresses.length > 0) {
//               const defaultAddressIndex = addresses.findIndex(
//                 (addr) => addr.defaultAddress === true,
//               );
//               const addressToUse =
//                 defaultAddressIndex !== -1 ? addresses[defaultAddressIndex] : addresses[0];

//               setSelectedAddressIndex(defaultAddressIndex !== -1 ? defaultAddressIndex : 0);
//               setCustomerForm((prev) => ({
//                 ...prev,
//                 address: {
//                   ...prev.address,
//                   ...addressToUse,
//                   countryName: addressToUse.countryName || 'India',
//                 },
//               }));

//               // Hide manual address section when existing address is selected
//               setShowManualAddress(false);

//               // Fetch zones for the selected address
//               if (addressToUse.latitude && addressToUse.longitude) {
//                 fetchZones(addressToUse.latitude, addressToUse.longitude, addressToUse.cityName);
//               }

//               if (addresses.length > 1) {
//                 toast.info(
//                   `${addresses.length} addresses found for this user. You can select different address.`,
//                 );
//               } else {
//                 toast.success('User details and address loaded successfully!');
//               }
//             } else {
//               setSelectedAddressIndex(-1);
//               setShowManualAddress(true);
//               toast.info('No existing addresses found. Please enter address manually.');
//             }
//           }
//         } catch (error) {
//           setUserDetails(null);
//           setUserAddresses([]);
//           setSelectedAddressIndex(-1);
//           setShowManualAddress(true);
//         }
//       } else {
//         // Reset if mobile number is not 10 digits
//         setUserDetails(null);
//         setUserAddresses([]);
//         setSelectedAddressIndex(-1);
//         setShowManualAddress(false);
//       }
//     };

//     const delayDebounceFn = setTimeout(() => {
//       if (customerForm.mobileNumber.length === 10) {
//         fetchUserDetails();
//       }
//     }, 1000);

//     return () => clearTimeout(delayDebounceFn);
//   }, [customerForm.mobileNumber, getToken]);

//   // Fetch zones based on coordinates
//   const fetchZones = async (lat, lng, cityName) => {
//     const token = getToken();
//     if (!token) return;

//     try {
//       const response = await axios.post(
//         URLS.GetZonesbylocation,
//         {
//           lat: lat,
//           lng: lng,
//           cityName: cityName,
//         },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );

//       setZones(response.data.zone || []);
//     } catch (error) {
//       console.error('Failed to fetch zones:', error);
//       toast.error('Failed to fetch zones');
//     }
//   };

//   // Fetch categories based on zone
//   // useEffect(() => {
//   //   const fetchCategories = async () => {
//   //     if (zones && zones._id) {
//   //       const token = getToken();
//   //       if (!token) return;

//   //       try {
//   //         const response = await axios.post(
//   //           URLS.GetDemandCategory,
//   //           { zoneId: zones._id },
//   //           { headers: { Authorization: `Bearer ${token}` } },
//   //         );
//   //         setCategories(response.data.categories || []);
//   //       } catch (error) {
//   //         toast.error('Failed to fetch categories');
//   //       }
//   //     }
//   //   };

//   //   fetchCategories();
//   // }, [zones, getToken]);

//   // Update the fetchCategories useEffect:

//  useEffect(() => {
//     const fetchCategories = async () => {
//       const token = getToken();
//       if (!token) return;

//       setCategoriesLoading(true);
//       try {
//         const response = await axios.post(
//         URLS.GetDemandCategory,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (response.data.success && response.data.ondemandcategorys) {
//           const activeCategories = response.data.ondemandcategorys.filter(
//             cat => cat.isPublish === true && cat.status === 'active'
//           );

//           setCategories(activeCategories);
//         } else {
//           setCategories([]);
//         }
//       } catch (error) {
//         console.error('Failed to fetch categories:', error);
//         setCategories([]);
//         toast.error('Failed to fetch categories');
//       } finally {
//         setCategoriesLoading(false);
//       }
//     };

//     fetchCategories();
//   }, [getToken]);


//   // Fetch subcategories when category and zone change
//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       if (serviceForm.categoryId && zones && zones._id) {
//         const token = getToken();
//         try {
//           const response = await axios.post(
//             URLS.GetOnDemandSubCategorybyZoneId,
//             {
//               zoneId: zones._id,
//               categoryId: serviceForm.categoryId,
//             },
//             { headers: { Authorization: `Bearer ${token}` } },
//           );
//           setSubcategories(response.data.subcategories || []);
//         } catch (error) {
//           toast.error('Failed to fetch subcategories');
//         }
//       } else {
//         setSubcategories([]);
//       }
//     };

//     fetchSubcategories();
//   }, [serviceForm.categoryId, zones, getToken]);

//   // Fetch services when subcategory and zone change
//   useEffect(() => {
//     const fetchServices = async () => {
//       if (serviceForm.subcategoryId && zones && zones._id) {
//         const token = getToken();
//         try {
//           const response = await axios.post(
//             URLS.GetOnDemandServicesbyZoneId,
//             {
//               zoneId: zones._id,
//               subcategoryId: serviceForm.subcategoryId,
//             },
//             { headers: { Authorization: `Bearer ${token}` } },
//           );
//           setServices(response.data.data || []);
//         } catch (error) {
//           toast.error('Failed to fetch services');
//         }
//       } else {
//         setServices([]);
//       }
//     };

//     fetchServices();
//   }, [serviceForm.subcategoryId, zones, getToken]);

//   // Fetch rate cards when service changes
//   useEffect(() => {
//     const fetchRateCards = async () => {
//       if (serviceForm.serviceId) {
//         const token = getToken();
//         try {
//           const response = await axios.post(
//             URLS.GetServiceRateCards,
//             {
//               serviceId: serviceForm.serviceId,
//             },
//             { headers: { Authorization: `Bearer ${token}` } },
//           );
//           setRateCards(response.data.data || []);
//         } catch (error) {
//           toast.error('Failed to fetch rate cards');
//         }
//       } else {
//         setRateCards([]);
//         setServiceForm((prev) => ({ ...prev, selectedRateCards: [], totalAmount: 0 }));
//       }
//     };

//     fetchRateCards();
//   }, [serviceForm.serviceId, getToken]);

//   const handleCustomerChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerForm((prev) => ({
//       ...prev,
//       address: { ...prev.address, [name]: value },
//     }));
//   };

//   const handleServiceChange = (e) => {
//     const { name, value } = e.target;
//     setServiceForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleRateCardSelection = (rateCard) => {
//     setServiceForm((prev) => {
//       const exists = prev.selectedRateCards.some((rc) => rc._id === rateCard._id);

//       return {
//         ...prev,
//         selectedRateCards: exists
//           ? prev.selectedRateCards.filter((rc) => rc._id !== rateCard._id)
//           : [
//               ...prev.selectedRateCards,
//               {
//                 _id: rateCard._id,
//                 rateCardTitle: rateCard.rateCardTitle,
//                 rateCardPrice: rateCard.rateCardPrice,
//               },
//             ],
//       };
//     });
//   };

//   useEffect(() => {
//     const total = serviceForm.selectedRateCards.reduce(
//       (sum, rc) => sum + (Number(rc.rateCardPrice) || 0),
//       0,
//     );
//     setServiceForm((prev) => ({ ...prev, totalAmount: total }));
//   }, [serviceForm.selectedRateCards]);

//   const handleAddressSelect = (index) => {
//     if (userAddresses[index]) {
//       const selectedAddress = userAddresses[index];
//       setSelectedAddressIndex(index);
//       setCustomerForm((prev) => ({
//         ...prev,
//         address: {
//           ...prev.address,
//           ...selectedAddress,
//           countryName: selectedAddress.countryName || 'India',
//         },
//       }));

//       // Hide manual address section when existing address is selected
//       setShowManualAddress(false);

//       // Fetch zones for the selected address
//       if (selectedAddress.latitude && selectedAddress.longitude) {
//         fetchZones(selectedAddress.latitude, selectedAddress.longitude, selectedAddress.cityName);
//       }

//       setAddressDialogOpen(false);
//       toast.success('Address selected successfully!');
//     }
//   };

//   const handleAddNewAddress = () => {
//     // Reset address form and show manual address section
//     setCustomerForm((prev) => ({
//       ...prev,
//       address: {
//         countryName: '',
//         stateName: '',
//         cityName: '',
//         area: '',
//         flat: '',
//         postalCode: '',
//         addressLineOne: '',
//         addressLineTwo: '',
//         type: 'Home',
//         latitude: '',
//         longitude: '',
//         _id: '',
//         defaultAddress: false,
//       },
//     }));
//     setSelectedAddressIndex(-1);
//     setShowManualAddress(true);
//     setAddressDialogOpen(false);
//     toast.info('Please enter new address details manually.');
//   };

//   const onPlaceChanged = () => {
//     if (autocomplete !== null) {
//       const place = autocomplete.getPlace();
//       if (place && place.geometry && place.address_components) {
//         const addressComponents = place.address_components;
//         const geometry = place.geometry.location;

//         let country = '',
//           state = '',
//           city = '',
//           postalCode = '',
//           area = '';

//         addressComponents.forEach((component) => {
//           const types = component.types;
//           if (types.includes('country')) {
//             country = component.long_name;
//           }
//           if (types.includes('administrative_area_level_1')) {
//             state = component.long_name;
//           }
//           if (types.includes('locality')) {
//             city = component.long_name;
//           }
//           if (types.includes('postal_code')) {
//             postalCode = component.long_name;
//           }
//           if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
//             area = component.long_name;
//           }
//         }); 

//         setCustomerForm((prev) => ({
//           ...prev,
//           address: {
//             ...prev.address,
//             countryName: country,
//             stateName: state,
//             cityName: city,
//             area: area,
//             postalCode: postalCode,
//             addressLineOne: place.formatted_address || '',
//             latitude: geometry.lat().toString(),
//             longitude: geometry.lng().toString(),
//             _id: '',
//             defaultAddress: false,
//           },
//         }));

//         // Reset selected address index when manually entering address
//         setSelectedAddressIndex(-1);
//         setShowManualAddress(true);

//         // Fetch zones based on new coordinates
//         fetchZones(geometry.lat(), geometry.lng(), city);
//       }
//     }
//   };

//   const onLoad = (autoC) => {
//     setAutocomplete(autoC);
//   };

//   const validateCustomerTab = () => {
//     const requiredFields = [
//       !customerForm.customerName && 'Customer Name',
//       !customerForm.email && 'Email',
//       !customerForm.mobileNumber && 'Mobile Number',
//       !customerForm.address.addressLineOne && 'Address',
//     ].filter(Boolean);

//     if (requiredFields.length) {
//       toast.error(`Missing: ${requiredFields.join(', ')}`);
//       return false;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(customerForm.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }

//     // Mobile validation
//     const mobileRegex = /^[0-9]{10}$/;
//     if (!mobileRegex.test(customerForm.mobileNumber)) {
//       toast.error('Please enter a valid 10-digit mobile number');
//       return false;
//     }

//     return true;
//   };

//   const validateServiceTab = () => {
//     const requiredFields = [
//       !serviceForm.categoryId && 'Category',
//       !serviceForm.subcategoryId && 'Subcategory',
//       !serviceForm.serviceId && 'Service',
//       serviceForm.selectedRateCards.length === 0 && 'At least one Rate Card',
//       !serviceForm.sourceOfLead && 'Source of Lead',
//     ].filter(Boolean);

//     if (requiredFields.length) {
//       toast.error(`Missing: ${requiredFields.join(', ')}`);
//       return false;
//     }

//     return true;
//   };

//   const handleTabChange = (event, newValue) => {
//     if (newValue === 1 && !validateCustomerTab()) {
//       return;
//     }
//     setActiveTab(newValue);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateCustomerTab() || !validateServiceTab()) {
//       return;
//     }

//     const token = getToken();

//     const bookingData = {
//       name: customerForm.customerName,
//       email: customerForm.email,
//       phone: customerForm.mobileNumber,
//       altPhone: customerForm.alternateNumber,
//       area: customerForm.address.area,
//       flat: customerForm.address.flat,
//       postalCode: customerForm.address.postalCode,
//       addressLineOne: customerForm.address.addressLineOne,
//       addressLineTwo: customerForm.address.addressLineTwo,
//       latitude: customerForm.address.latitude,
//       longitude: customerForm.address.longitude,
//       type: customerForm.address.type,
//       serviceAddressId: customerForm.address._id,
//       zoneId: zones._id,
//       defaultAddress: customerForm.address.defaultAddress,
//       stateName: customerForm.address.stateName,
//       cityName: customerForm.address.cityName,
//       countryName: customerForm.address.countryName,
//       categoryId: serviceForm.categoryId,
//       subcategoryId: serviceForm.subcategoryId,
//       serviceId: serviceForm.serviceId,
//       ratecardDetails: serviceForm.selectedRateCards,
//       amount: serviceForm.totalAmount,
//       sourceOfLead: serviceForm.sourceOfLead,
//       bookedDate: serviceForm.bookedDate,
//       bookedTime: serviceForm.bookedTime,
//       addMoreInfo: serviceForm.additionalInfo,
//     };

//     setLoading(true);
//     try {
//       const res = await axios.post(URLS.AddCrmBooking, bookingData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       if (res.status === 200) {
//         toast.success('Booking created successfully!');
//         navigate('/ondemandservice/verified-partners-crm/accepted');
//       }
//     } catch (error) {
//       const message =
//         error.response?.status === 400
//           ? 'Unauthorized access. Please log in again.'
//           : error.response?.data?.message || 'Failed to create booking.';
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LoadScript
//       googleMapsApiKey="AIzaSyBNVn5j-M6F4VHkaOluoOcVY3K5r2-NlPk"
//       libraries={libraries}
//       onLoad={() => setScriptLoaded(true)}
//     >
//       <PageContainer title="Add CRM Booking">
//         <Breadcrumb title="Add CRM Booking" items={BCrumb} />
//         <ToastContainer position="top-right" autoClose={3000} />
//         <Box sx={{ float: 'right', mb: 2 }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => navigate(-1)}
//             startIcon={<IconArrowBackUp />}
//             disabled={loading}
//           >
//             Back
//           </Button>
//         </Box>

//         <Tabs
//           value={activeTab}
//           onChange={handleTabChange}
//           sx={{ borderBottom: 1, borderColor: 'divider' }}
//         >
//           <Tab label="Customer Details" />
//           <Tab label="Service Details" />
//         </Tabs>

//         <form onSubmit={handleSubmit}>
//           {/* Customer Details Tab */}
//           <TabPanel value={activeTab} index={0}>
//             <ParentCard title="Customer Information">
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="mobileNumber" required>
//                     Whats App Number *
//                   </CustomFormLabel>
//                   <CustomTextField
//                     id="mobileNumber"
//                     name="mobileNumber"
//                     value={customerForm.mobileNumber}
//                     onChange={handleCustomerChange}
//                     placeholder="Enter your 10-digit mobile number"
//                     inputProps={{ maxLength: 10 }}
//                     fullWidth
//                     required
//                   />
//                   {userDetails && (
//                     <Typography variant="caption" color="success.main">
//                       Ã¢Å“â€œ User details loaded from existing records
//                     </Typography>
//                   )}
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="alternateNumber">Alternate Number</CustomFormLabel>
//                   <CustomTextField
//                     id="alternateNumber"
//                     name="alternateNumber"
//                     value={customerForm.alternateNumber}
//                     onChange={handleCustomerChange}
//                     placeholder="Alternate mobile number"
//                     inputProps={{ maxLength: 10 }}
//                     fullWidth
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="customerName" required>
//                     Customer Name *
//                   </CustomFormLabel>
//                   <CustomTextField
//                     id="customerName"
//                     name="customerName"
//                     value={customerForm.customerName}
//                     onChange={handleCustomerChange}
//                     placeholder="Enter customer name"
//                     fullWidth
//                     required
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="email" required>
//                     Email Address *
//                   </CustomFormLabel>
//                   <CustomTextField
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={customerForm.email}
//                     onChange={handleCustomerChange}
//                     placeholder="customer@example.com"
//                     fullWidth
//                     required
//                   />
//                 </Grid>

//                 {/* Address Selection Section - Only show if user has addresses */}
//                 {userAddresses.length > 0 && !showManualAddress && (
//                   <Grid item xs={12}>
//                     <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'center',
//                           mb: 2,
//                         }}
//                       >
//                         <Typography variant="h6">
//                           Select Existing Address ({userAddresses.length} available)
//                         </Typography>
//                         <Box sx={{ display: 'flex', gap: 1 }}>
//                           <Button
//                             variant="outlined"
//                             size="small"
//                             onClick={() => setAddressDialogOpen(true)}
//                           >
//                             View All Addresses
//                           </Button>
//                           <Button
//                             variant="text"
//                             size="small"
//                             color="primary"
//                             onClick={handleAddNewAddress}
//                           >
//                             Add New Address
//                           </Button>
//                         </Box>
//                       </Box>

//                       <Grid container spacing={2}>
//                         {userAddresses.slice(0, 2).map((address, index) => (
//                           <Grid item xs={12} md={6} key={address._id}>
//                             <AddressCard
//                               selected={selectedAddressIndex === index}
//                               onClick={() => handleAddressSelect(index)}
//                             >
//                               <CardContent>
//                                 <Box
//                                   sx={{
//                                     display: 'flex',
//                                     justifyContent: 'space-between',
//                                     alignItems: 'flex-start',
//                                     mb: 1,
//                                   }}
//                                 >
//                                   <Typography variant="subtitle1" fontWeight="bold">
//                                     {address.name || customerForm.customerName}
//                                   </Typography>
//                                   {address.defaultAddress && (
//                                     <Chip label="Default" color="primary" size="small" />
//                                   )}
//                                   {selectedAddressIndex === index && (
//                                     <Chip label="Selected" color="success" size="small" />
//                                   )}
//                                 </Box>
//                                 <Typography variant="body2" color="textSecondary">
//                                   {address.flat}, {address.addressLineOne}
//                                 </Typography>
//                                 <Typography variant="body2" color="textSecondary">
//                                   {address.area}, {address.cityName} - {address.postalCode}
//                                 </Typography>
//                                 <Typography variant="body2" color="textSecondary">
//                                   {address.stateName}, {address.countryName || 'India'}
//                                 </Typography>
//                                 <Typography variant="caption" color="textSecondary">
//                                   Type: {address.type}
//                                 </Typography>
//                               </CardContent>
//                             </AddressCard>
//                           </Grid>
//                         ))}
//                       </Grid>

//                       {userAddresses.length > 2 && (
//                         <Box sx={{ textAlign: 'center', mt: 2 }}>
//                           <Button
//                             variant="text"
//                             size="small"
//                             onClick={() => setAddressDialogOpen(true)}
//                           >
//                             + {userAddresses.length - 2} more addresses
//                           </Button>
//                         </Box>
//                       )}
//                     </Card>
//                   </Grid>
//                 )}

//                 {/* Manual Address Section - Show when adding new address or no existing addresses */}
//                 {showManualAddress && (
//                   <>
//                     <Grid item xs={12}>
//                       <Divider sx={{ my: 2 }}>
//                         <Chip label="Enter New Address" color="primary" />
//                       </Divider>
//                     </Grid>

//                     <Grid item xs={12}>
//                       <CustomFormLabel htmlFor="address-search" required>
//                         Search Location *
//                       </CustomFormLabel>
//                       {scriptLoaded && (
//                         <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
//                           <TextField
//                             fullWidth
//                             placeholder="Enter complete address to auto-fill location details"
//                             variant="outlined"
//                           />
//                         </Autocomplete>
//                       )}
//                       <Typography variant="caption" color="textSecondary">
//                         Start typing to search for your location
//                       </Typography>
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="countryName" required>
//                         Country *
//                       </CustomFormLabel>
//                       <CustomTextField
//                         id="countryName"
//                         name="countryName"
//                         value={customerForm.address.countryName}
//                         onChange={handleAddressChange}
//                         placeholder="Country"
//                         fullWidth
//                         required
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="stateName" required>
//                         State *
//                       </CustomFormLabel>
//                       <CustomTextField
//                         id="stateName"
//                         name="stateName"
//                         value={customerForm.address.stateName}
//                         onChange={handleAddressChange}
//                         placeholder="State"
//                         fullWidth
//                         required
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="cityName" required>
//                         City *
//                       </CustomFormLabel>
//                       <CustomTextField
//                         id="cityName"
//                         name="cityName"
//                         value={customerForm.address.cityName}
//                         onChange={handleAddressChange}
//                         placeholder="City"
//                         fullWidth
//                         required
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="area" required>
//                         Area/Zone *
//                       </CustomFormLabel>
//                       <CustomTextField
//                         id="area"
//                         name="area"
//                         value={customerForm.address.area}
//                         onChange={handleAddressChange}
//                         placeholder="Area or Zone"
//                         fullWidth
//                         required
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="postalCode" required>
//                         Postal Code *
//                       </CustomFormLabel>
//                       <CustomTextField
//                         id="postalCode"
//                         name="postalCode"
//                         value={customerForm.address.postalCode}
//                         onChange={handleAddressChange}
//                         placeholder="Postal Code"
//                         fullWidth
//                         required
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="flat">Flat/Building No.</CustomFormLabel>
//                       <CustomTextField
//                         id="flat"
//                         name="flat"
//                         value={customerForm.address.flat}
//                         onChange={handleAddressChange}
//                         placeholder="Flat/Building Number"
//                         fullWidth
//                       />
//                     </Grid>

//                     <Grid item xs={12}>
//                       <CustomFormLabel htmlFor="addressLineOne" required>
//                         Address Line 1 *
//                       </CustomFormLabel>
//                       <CustomTextField
//                         id="addressLineOne"
//                         name="addressLineOne"
//                         value={customerForm.address.addressLineOne}
//                         onChange={handleAddressChange}
//                         placeholder="Street address, P.O. box, company name"
//                         fullWidth
//                         required
//                         multiline
//                         rows={2}
//                       />
//                     </Grid>

//                     <Grid item xs={12}>
//                       <CustomFormLabel htmlFor="addressLineTwo">Address Line 2</CustomFormLabel>
//                       <CustomTextField
//                         id="addressLineTwo"
//                         name="addressLineTwo"
//                         value={customerForm.address.addressLineTwo}
//                         onChange={handleAddressChange}
//                         placeholder="Apartment, suite, unit, building, floor, etc."
//                         fullWidth
//                         multiline
//                         rows={2}
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <CustomFormLabel htmlFor="addressType">Address Type</CustomFormLabel>
//                       <CustomSelect
//                         id="addressType"
//                         name="type"
//                         value={customerForm.address.type}
//                         onChange={handleAddressChange}
//                         fullWidth
//                       >
//                         <MenuItem value="Home">Home</MenuItem>
//                         <MenuItem value="Office">Office</MenuItem>
//                         <MenuItem value="Other">Other</MenuItem>
//                       </CustomSelect>
//                     </Grid>
//                   </>
//                 )}

//                 {customerForm.address.latitude && customerForm.address.longitude && (
//                   <Grid item xs={12}>
//                     <Card variant="outlined">
//                       <CardContent>
//                         {zones && zones._id && (
//                           <Typography variant="body2" color="primary">
//                             Zone: {zones.name || zones._id}
//                           </Typography>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 )}

//                 <Grid item xs={12} sx={{ textAlign: 'right' }}>
//                   <Button variant="contained" color="primary" onClick={() => setActiveTab(1)}>
//                     Next: Service Details
//                   </Button>
//                 </Grid>
//               </Grid>
//             </ParentCard>
//           </TabPanel>

//           {/* Service Details Tab */}
//           <TabPanel value={activeTab} index={1}>
//             <ParentCard title="Service Selection">
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="categoryId" required>
//                     Category *
//                   </CustomFormLabel>
//                   <CustomSelect
//                     id="categoryId"
//                     name="categoryId"
//                     value={serviceForm.categoryId}
//                     onChange={handleServiceChange}
//                     fullWidth
//                     required
//                   >
//                     <MenuItem value="">Select Category</MenuItem>
//                     {categories.map((cat) => (
//                       <MenuItem key={cat._id} value={cat._id}>
//                         {cat.name}
//                       </MenuItem>
//                     ))}
//                   </CustomSelect>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="subcategoryId" required>
//                     Subcategory *
//                   </CustomFormLabel>
//                   <CustomSelect
//                     id="subcategoryId"
//                     name="subcategoryId"
//                     value={serviceForm.subcategoryId}
//                     onChange={handleServiceChange}
//                     fullWidth
//                     required
//                     disabled={!serviceForm.categoryId}
//                   >
//                     <MenuItem value="">Select Subcategory</MenuItem>
//                     {subcategories.map((sub) => (
//                       <MenuItem key={sub._id} value={sub._id}>
//                         {sub.name}
//                       </MenuItem>
//                     ))}
//                   </CustomSelect>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="serviceId" required>
//                     Service *
//                   </CustomFormLabel>
//                   <CustomSelect
//                     id="serviceId"
//                     name="serviceId"
//                     value={serviceForm.serviceId}
//                     onChange={handleServiceChange}
//                     fullWidth
//                     required
//                     disabled={!serviceForm.subcategoryId}
//                   >
//                     <MenuItem value="">Select Service</MenuItem>
//                     {services.map((service) => (
//                       <MenuItem key={service._id} value={service._id}>
//                         {service.name}
//                       </MenuItem>
//                     ))}
//                   </CustomSelect>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="sourceOfLead" required>
//                     Source of Lead *
//                   </CustomFormLabel>
//                   <CustomSelect
//                     id="sourceOfLead"
//                     name="sourceOfLead"
//                     value={serviceForm.sourceOfLead}
//                     onChange={handleServiceChange}
//                     fullWidth
//                     required
//                   >
//                     <MenuItem value="">Select Source</MenuItem>
//                     <MenuItem value="whatsapp">WhatsApp</MenuItem>
//                     <MenuItem value="call">Phone Call</MenuItem>
//                     <MenuItem value="website">Website</MenuItem>
//                     <MenuItem value="walkin">Walk-in</MenuItem>
//                     <MenuItem value="referral">Referral</MenuItem>
//                   </CustomSelect>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="bookedDate" required>
//                     Booked Date *
//                   </CustomFormLabel>
//                   <CustomTextField
//                     id="bookedDate"
//                     type="date"
//                     name="bookedDate"
//                     value={serviceForm.bookedDate}
//                     onChange={handleServiceChange}
//                     placeholder="bookedDate"
//                     fullWidth
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel htmlFor="bookedTime" required>
//                     Booked Time *
//                   </CustomFormLabel>
//                   <CustomTextField
//                     id="bookedTime"
//                     type="time"
//                     name="bookedTime"
//                     value={serviceForm.bookedTime}
//                     onChange={handleServiceChange}
//                     placeholder="bookedTime"
//                     fullWidth
//                     required
//                   />
//                 </Grid>
//                 {rateCards.length > 0 && (
//                   <Grid item xs={12}>
//                     <CustomFormLabel required>Select Rate Cards *</CustomFormLabel>
//                     <TableContainer component={Paper} variant="outlined">
//                       <Table>
//                         <TableHead>
//                           <TableRow>
//                             <TableCell>Select</TableCell>
//                             <TableCell>Title</TableCell>
//                             <TableCell>Price (Ã¢â€šÂ¹)</TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {rateCards.map((rateCard) => (
//                             <TableRow key={rateCard._id} hover>
//                               <TableCell>
//                                 <Checkbox
//                                   checked={serviceForm.selectedRateCards.some(
//                                     (rc) => rc._id === rateCard._id,
//                                   )}
//                                   onChange={() => handleRateCardSelection(rateCard)}
//                                 />
//                               </TableCell>
//                               <TableCell>{rateCard.rateCardTitle}</TableCell>
//                               <TableCell>
//                                 Ã¢â€šÂ¹{Number(rateCard.rateCardPrice).toLocaleString('en-IN')}
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   </Grid>
//                 )}

//                 <Grid item xs={12} md={6}>
//                   <CustomFormLabel>Total Amount</CustomFormLabel>
//                   <TextField
//                     value={`Ã¢â€šÂ¹${serviceForm.totalAmount.toLocaleString('en-IN')}`}
//                     fullWidth
//                     disabled
//                     variant="outlined"
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <CustomFormLabel htmlFor="additionalInfo">Additional Information</CustomFormLabel>
//                   <CustomTextField
//                     id="additionalInfo"
//                     name="additionalInfo"
//                     value={serviceForm.additionalInfo}
//                     onChange={handleServiceChange}
//                     placeholder="Any additional information about the booking..."
//                     fullWidth
//                     multiline
//                     rows={3}
//                   />
//                 </Grid>

//                 <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Button variant="outlined" onClick={() => setActiveTab(0)}>
//                     Back to Customer Details
//                   </Button>

//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     disabled={loading}
//                     startIcon={loading ? <CircularProgress size={20} /> : null}
//                   >
//                     {loading ? 'Creating Booking...' : 'Create Booking'}
//                   </Button>
//                 </Grid>
//               </Grid>
//             </ParentCard>
//           </TabPanel>
//         </form>

//         {/* Address Selection Dialog */}
//         <Dialog
//           open={addressDialogOpen}
//           onClose={() => setAddressDialogOpen(false)}
//           maxWidth="md"
//           fullWidth
//         >
//           <DialogTitle>
//             Select Address
//             <Typography variant="subtitle1" color="textSecondary">
//               {userAddresses.length} addresses found for {customerForm.customerName}
//             </Typography>
//           </DialogTitle>
//           <DialogContent>
//             <Grid container spacing={2}>
//               {userAddresses.map((address, index) => (
//                 <Grid item xs={12} key={address._id}>
//                   <AddressCard
//                     selected={selectedAddressIndex === index}
//                     onClick={() => handleAddressSelect(index)}
//                   >
//                     <CardContent>
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'flex-start',
//                           mb: 1,
//                         }}
//                       >
//                         <Typography variant="h6">
//                           {address.name || customerForm.customerName}
//                         </Typography>
//                         <Box sx={{ display: 'flex', gap: 1 }}>
//                           {address.defaultAddress && (
//                             <Chip label="Default" color="primary" size="small" />
//                           )}
//                           {selectedAddressIndex === index && (
//                             <Chip label="Currently Selected" color="success" size="small" />
//                           )}
//                         </Box>
//                       </Box>
//                       <Typography variant="body1" gutterBottom>
//                         {address.flat}, {address.addressLineOne}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary" gutterBottom>
//                         {address.addressLineTwo}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         {address.area}, {address.cityName} - {address.postalCode}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         {address.stateName}, {address.countryName || 'India'}
//                       </Typography>
//                       <Box
//                         sx={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'center',
//                           mt: 1,
//                         }}
//                       >
//                         <Typography variant="caption" color="textSecondary">
//                           Type: {address.type}
//                         </Typography>
//                         <Button
//                           variant={selectedAddressIndex === index ? 'contained' : 'outlined'}
//                           size="small"
//                         >
//                           {selectedAddressIndex === index ? 'Selected' : 'Select This Address'}
//                         </Button>
//                       </Box>
//                     </CardContent>
//                   </AddressCard>
//                 </Grid>
//               ))}
//             </Grid>
//           </DialogContent>
//           <DialogActions sx={{ justifyContent: 'space-between' }}>
//             <Button variant="outlined" color="primary" onClick={handleAddNewAddress}>
//               Add New Address
//             </Button>
//             <Button onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
//           </DialogActions>
//         </Dialog>
//       </PageContainer>
//     </LoadScript>
//   );
// };

// export default AddCrmBooking;
import React, { useState, useEffect, useCallback } from 'react';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import ParentCard from '../../../components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { IconArrowBackUp } from '@tabler/icons-react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import { URLS } from '../../../Url';
import axios from 'axios';
import {
  Button,
  Select,
  MenuItem,
  Box,
  Grid,
  CircularProgress,
  Checkbox,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Alert,
  IconButton
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Add CRM Booking' }];

const API_BASE = 'https://api.doorstephub.com/v1/dhubApi/admin';

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const AddressCard = styled(Card)(({ theme, selected }) => ({
  border: selected
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
  },
}));

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`booking-tabpanel-${index}`}
    aria-labelledby={`booking-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const libraries = ['places'];

const AddCrmBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [autocomplete, setAutocomplete] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [showManualAddress, setShowManualAddress] = useState(false);

  //whatsappotp
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [phoneVerified, setPhoneVerified] = useState(false);



  // Customer Details
  const [customerForm, setCustomerForm] = useState({
    customerName: '',
    email: '',
    mobileNumber: '',
    alternateNumber: '',
    address: {
      countryName: '',
      stateName: '',
      cityName: '',
      area: '',
      flat: '',
      postalCode: '',
      addressLineOne: '',
      addressLineTwo: '',
      type: 'Home',
      latitude: '',
      longitude: '',
      _id: '',
      defaultAddress: false,
    },
  });

  // Service Details
  const [serviceForm, setServiceForm] = useState({
    categoryId: '',
    subcategoryId: '',
    serviceId: '',
    selectedRateCards: [],

    discount: 0,           // Ã¢â€ Â ADD THIS
    gstAmount: 0,          // Ã¢â€ Â ADD THIS
    grandTotal: 0,
    totalAmount: 0,
    sourceOfLead: '',
    bookedDate: '',
    bookedTime: '',
    additionalInfo: '',
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [services, setServices] = useState([]);
  const [rateCards, setRateCards] = useState([]);
  const [zones, setZones] = useState({});
  const [userDetails, setUserDetails] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  // Loading states
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [rateCardsLoading, setRateCardsLoading] = useState(false);

  const [showAddRateCard, setShowAddRateCard] = useState(false);
  const [addingRateCard, setAddingRateCard] = useState(false);


  const [newRateCard, setNewRateCard] = useState({

    rateCardTitle: '',
    rateCardPrice: '',
    rateCardQuantity: '1',
    serviceDescription: '',
    reason: '',
    serviceNote: '',
    rateCardServiceImage: null,
    rateCardVideoUrl: '',
    includeServiceDescription: false,

    includeServiceNote: false
  });


  const CONSTANT_SERVICE_DESCRIPTION = "Spare Parts Paid Seperately";

  const CONSTANT_SERVICE_NOTE = "Estimated Adjusted By Type ,Capacity & Brand";

  // Add this with other state declarations
  const [inspectionCharges, setInspectionCharges] = useState({
    inspectionCost: 0,
    serviceBookingCost: 0,
    loading: false
  });



  const getToken = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.token || '' : '';
  }, []);

  useEffect(() => {
    if (window.google) {
      setScriptLoaded(true);
    }
  }, []);


  // Add this useEffect after your other useEffects
  useEffect(() => {
    const fetchBookingCharges = async () => {
      const token = getToken();
      if (!token) return;

      setInspectionCharges(prev => ({ ...prev, loading: true }));

      try {
        const response = await axios.get(
          'https://api.doorstephub.com/v1/dhubApi/admin/service-booking-charges',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success && response.data.data) {
          setInspectionCharges({
            inspectionCost: response.data.data.inspectionCost || 0,
            serviceBookingCost: response.data.data.serviceBookingCost || 0,
            loading: false
          });
        }
      } catch (error) {
        console.error('Failed to fetch booking charges:', error);
        setInspectionCharges(prev => ({ ...prev, loading: false }));
      }
    };

    fetchBookingCharges();
  }, [getToken]);





  //   useEffect(() => {
  //   const checkUserAndSendOTP = async () => {
  //     if (customerForm.mobileNumber.length === 10) {
  //       const token = getToken();
  //       if (!token) return;

  //       try {
  //         const response = await axios.post(
  //          URLS.SendWhatsAppotp,
  //           { phone: customerForm.mobileNumber },
  //           { headers: { Authorization: `Bearer ${token}` } }
  //         );

  //         if (response.data.success) {
  //           if (response.data.userExists) {
  //             // Existing user - load data
  //             const user = response.data.data;
  //             const addresses = response.data.addresses || [];

  //             setUserDetails(user);
  //             setUserAddresses(addresses);
  //             setPhoneVerified(true);

  //             setCustomerForm((prev) => ({
  //               ...prev,
  //               customerName: user.name || '',
  //               email: user.email || '',
  //               alternateNumber: user.alternatePhone || '',
  //             }));

  //             if (addresses.length > 0) {
  //               const defaultIdx = addresses.findIndex(a => a.defaultAddress);
  //               const addr = defaultIdx !== -1 ? addresses[defaultIdx] : addresses[0];

  //               setSelectedAddressIndex(defaultIdx !== -1 ? defaultIdx : 0);
  //               setCustomerForm(prev => ({
  //                 ...prev,
  //                 address: { ...prev.address, ...addr, countryName: addr.countryName || 'India' }
  //               }));

  //               setShowManualAddress(false);
  //               if (addr.latitude && addr.longitude) {
  //                 fetchZones(addr.latitude, addr.longitude, addr.cityName);
  //               }
  //               toast.success('User loaded successfully!');
  //             } else {
  //               setShowManualAddress(true);
  //               toast.info('No addresses found');
  //             }
  //           } else {
  //             // New user - OTP sent
  //             setOtpDialogOpen(true);
  //             setPhoneVerified(false);
  //             setResendTimer(60);
  //             toast.info('OTP sent to WhatsApp');
  //           }
  //         }
  //       } catch (error) {
  //         setUserDetails(null);
  //         setPhoneVerified(false);
  //         toast.error('Failed to verify number');
  //       }
  //     } else {
  //       setPhoneVerified(false);
  //     }
  //   };

  //   const timer = setTimeout(() => {
  //     if (customerForm.mobileNumber.length === 10) checkUserAndSendOTP();
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, [customerForm.mobileNumber, getToken]);



  useEffect(() => {
    const checkUserAndSendOTP = async () => {
      if (customerForm.mobileNumber.length === 10) {
        const token = getToken();
        if (!token) return;

        try {
          console.log('Ã°Å¸â€Â Step 1: Checking if user exists...');
          console.log('Ã°Å¸â€œÂ± Phone number:', customerForm.mobileNumber);

          // STEP 1: Check if user exists - use "phone" key
          const checkResponse = await axios.post(
            URLS.GetUserDetailsByPhone,
            { phone: customerForm.mobileNumber },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log('Ã¢Å“â€¦ Check API Response:', checkResponse.data);
          console.log('Ã°Å¸â€œÅ  Raw data object:', checkResponse.data.data);

          const userData = checkResponse.data.data;
          const addresses = checkResponse.data.addresses || [];

          // Check if data object is empty or has no properties
          const isEmptyData = !userData || Object.keys(userData).length === 0;

          console.log('Ã°Å¸â€Â Is Empty Data?', isEmptyData);
          console.log('Ã°Å¸â€Â Object keys count:', userData ? Object.keys(userData).length : 0);
          console.log('Ã°Å¸â€Â Success flag:', checkResponse.data.success);

          if (!isEmptyData && checkResponse.data.success) {
            // EXISTING USER - Load data
            console.log('Ã°Å¸â€˜Â¤ Existing user found!');

            setUserDetails(userData);
            setUserAddresses(addresses);
            setPhoneVerified(true);

            setCustomerForm((prev) => ({
              ...prev,
              customerName: userData.name || '',
              email: userData.email || '',
              alternateNumber: userData.alternatePhone || '',
            }));

            if (addresses.length > 0) {
              const defaultIdx = addresses.findIndex(a => a.defaultAddress);
              const addr = defaultIdx !== -1 ? addresses[defaultIdx] : addresses[0];

              setSelectedAddressIndex(defaultIdx !== -1 ? defaultIdx : 0);
              setCustomerForm(prev => ({
                ...prev,
                address: { ...prev.address, ...addr, countryName: addr.countryName || 'India' }
              }));

              setShowManualAddress(false);
              if (addr.latitude && addr.longitude) {
                fetchZones(addr.latitude, addr.longitude, addr.cityName);
              }
              toast.success('User loaded successfully!');
            } else {
              setShowManualAddress(true);
              toast.info('No addresses found');
            }
          } else {
            // NEW USER - data is empty object
            console.log('Ã°Å¸â€ â€¢ New user detected - sending OTP...');
            console.log('Ã°Å¸â€œÂ Current otpDialogOpen state:', otpDialogOpen); // CHECK STATE

            try {
              // STEP 2: Send WhatsApp OTP - use "mobile" key
              const otpResponse = await axios.post(
                URLS.SendWhatsAppotp,
                { mobile: customerForm.mobileNumber },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              console.log('Ã¢Å“â€¦ OTP API Response:', otpResponse.data);

              // Ã¢Å“â€¦ FIXED: Check for "status" instead of "success"
              if (otpResponse.data.status === 'success') {  // Ã¢â€ Â CHANGED THIS LINE
                console.log('Ã°Å¸Å¡â‚¬ Opening OTP dialog...');
                setOtpDialogOpen(true);
                setPhoneVerified(false);
                setResendTimer(60);
                setUserDetails(null);
                setUserAddresses([]);
                setShowManualAddress(false);
                toast.info('OTP sent to your WhatsApp');
              } else {
                toast.error('Failed to send OTP');
              }

            } catch (otpError) {
              console.error('Ã¢ÂÅ’ OTP API Error:', otpError.response?.data || otpError.message);
              toast.error('Failed to send OTP. Please try again.');
            }
          }
        } catch (error) {
          console.error('Ã¢ÂÅ’ Check User API Error:', error.response?.data || error.message);

          // If API fails completely, treat as new user
          console.log('Ã¢Å¡Â Ã¯Â¸Â API error - treating as new user');
          setUserDetails(null);
          setUserAddresses([]);
          setPhoneVerified(false);
          toast.error('Failed to verify number');
        }
      } else {
        // Reset states when phone number is cleared/incomplete
        setPhoneVerified(false);
        setUserDetails(null);
        setUserAddresses([]);
      }
    };

    const timer = setTimeout(() => {
      if (customerForm.mobileNumber.length === 10) {
        checkUserAndSendOTP();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [customerForm.mobileNumber, getToken]);

  useEffect(() => {

    console.log('Ã°Å¸â€â€ OTP Dialog State Changed:', otpDialogOpen);
    let interval;
    if (resendTimer > 0 && otpDialogOpen) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer, otpDialogOpen]);


  // Fetch user details when mobile number is entered
  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     if (customerForm.mobileNumber.length === 10) {
  //       const token = getToken();
  //       if (!token) return;

  //       try {
  //         const response = await axios.post(
  //           URLS.GetUserDetailsByPhone,
  //           { phone: customerForm.mobileNumber },
  //           { headers: { Authorization: `Bearer ${token}` } },
  //         );

  //         if (response.data && response.data.data) {
  //           const user = response.data.data;
  //           const addresses = response.data.addresses || [];

  //           setUserDetails(user);
  //           setUserAddresses(addresses);

  //           setCustomerForm((prev) => ({
  //             ...prev,
  //             customerName: user.name || '',
  //             email: user.email || user.phone || '',
  //             alternateNumber: user.alternatePhone || '',
  //           }));

  //           if (addresses.length > 0) {
  //             const defaultAddressIndex = addresses.findIndex(
  //               (addr) => addr.defaultAddress === true,
  //             );
  //             const addressToUse =
  //               defaultAddressIndex !== -1 ? addresses[defaultAddressIndex] : addresses[0];

  //             setSelectedAddressIndex(defaultAddressIndex !== -1 ? defaultAddressIndex : 0);
  //             setCustomerForm((prev) => ({
  //               ...prev,
  //               address: {
  //                 ...prev.address,
  //                 ...addressToUse,
  //                 countryName: addressToUse.countryName || 'India',
  //               },
  //             }));

  //             setShowManualAddress(false);

  //             if (addressToUse.latitude && addressToUse.longitude) {
  //               fetchZones(addressToUse.latitude, addressToUse.longitude, addressToUse.cityName);
  //             }

  //             if (addresses.length > 1) {
  //               toast.info(
  //                 `${addresses.length} addresses found. You can select a different address.`,
  //               );
  //             } else {
  //               toast.success('User details and address loaded successfully!');
  //             }
  //           } else {
  //             setSelectedAddressIndex(-1);
  //             setShowManualAddress(true);
  //             toast.info('No existing addresses found. Please enter address manually.');
  //           }
  //         }
  //       } catch (error) {
  //         setUserDetails(null);
  //         setUserAddresses([]);
  //         setSelectedAddressIndex(-1);
  //         setShowManualAddress(true);
  //       }
  //     } else {
  //       setUserDetails(null);
  //       setUserAddresses([]);
  //       setSelectedAddressIndex(-1);
  //       setShowManualAddress(false);
  //     }
  //   };

  //   const delayDebounceFn = setTimeout(() => {
  //     if (customerForm.mobileNumber.length === 10) {
  //       fetchUserDetails();
  //     }
  //   }, 1000);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [customerForm.mobileNumber, getToken]);

  // Fetch zones based on coordinates
  const fetchZones = async (lat, lng, cityName) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.post(
        URLS.GetZonesbylocation,
        {
          lat: lat,
          lng: lng,
          cityName: cityName,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log('Zone API Response:', response.data); // DEBUG

      if (response.data.zone) {
        setZones(response.data.zone);
        toast.success(`Service zone detected: ${response.data.zone.name || 'Zone found'}`);
      }
    } catch (error) {
      console.error('Failed to fetch zones:', error);
      toast.error('Failed to fetch service zone');
      setZones({});
    }
  };

  // Fetch all on-demand categories
  useEffect(() => {
    const fetchCategories = async () => {
      const token = getToken();
      if (!token) return;

      setCategoriesLoading(true);
      try {
        const response = await axios.post(
          `${API_BASE}/ondemandcategory/getallondemandcategorys`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success && response.data.ondemandcategorys) {
          const activeCategories = response.data.ondemandcategorys.filter(
            cat => cat.isPublish === true && cat.status === 'active'
          );

          setCategories(activeCategories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
        toast.error('Failed to fetch categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [getToken]);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!serviceForm.categoryId) {
        setSubcategories([]);
        setServices([]);
        setRateCards([]);
        setServiceForm((prev) => ({
          ...prev,
          subcategoryId: '',
          serviceId: '',
          selectedRateCards: [],
          totalAmount: 0,
        }));
        return;
      }

      const token = getToken();
      if (!token) return;

      setSubcategoriesLoading(true);
      try {
        const response = await axios.post(
          `${API_BASE}/ondemandsubcategory/getsubcategoriesunderondemandcategoryid`,
          {
            categoryId: [serviceForm.categoryId],
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success && response.data.subcategories) {
          setSubcategories(response.data.subcategories);
        } else {
          setSubcategories([]);
        }
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
        setSubcategories([]);
        toast.error('Failed to fetch subcategories');
      } finally {
        setSubcategoriesLoading(false);
      }

      setServiceForm((prev) => ({
        ...prev,
        subcategoryId: '',
        serviceId: '',
        selectedRateCards: [],
        totalAmount: 0,
      }));
      setServices([]);
      setRateCards([]);
    };

    fetchSubcategories();
  }, [serviceForm.categoryId, getToken]);

  // FIXED: Fetch services when subcategory and zone change
  useEffect(() => {
    const fetchServices = async () => {
      console.log('=== SERVICE FETCH DEBUG ===');
      console.log('Subcategory ID:', serviceForm.subcategoryId);
      console.log('Zones Object:', zones);
      console.log('Zone _id:', zones._id);
      console.log('Zone zoneId:', zones.zoneId);

      // Reset if no subcategory
      if (!serviceForm.subcategoryId) {
        console.log('No subcategory selected');
        setServices([]);
        setRateCards([]);
        setServiceForm((prev) => ({
          ...prev,
          serviceId: '',
          selectedRateCards: [],
          totalAmount: 0,
        }));
        return;
      }

      // Check for zone - support multiple formats
      let zoneIdToUse = null;

      if (zones._id) {
        zoneIdToUse = zones._id;
        console.log('Using zones._id:', zoneIdToUse);
      } else if (zones.zoneId && Array.isArray(zones.zoneId) && zones.zoneId.length > 0) {
        zoneIdToUse = zones.zoneId[0];
        console.log('Using zones.zoneId[0]:', zoneIdToUse);
      } else if (zones.zoneId && typeof zones.zoneId === 'string') {
        zoneIdToUse = zones.zoneId;
        console.log('Using zones.zoneId (string):', zoneIdToUse);
      }

      if (!zoneIdToUse) {
        console.log('No valid zone ID found - Zone required!');
        setServices([]);
        setRateCards([]);
        setServiceForm((prev) => ({
          ...prev,
          serviceId: '',
          selectedRateCards: [],
          totalAmount: 0,
        }));
        toast.warning('Please select an address to determine service zone');
        return;
      }

      const token = getToken();
      if (!token) {
        console.log('No token available');
        return;
      }

      setServicesLoading(true);
      console.log('Fetching services with:', {
        zoneId: zoneIdToUse,
        subcategoryId: serviceForm.subcategoryId
      });

      try {
        const response = await axios.post(
          URLS.GetOnDemandServicesbyZoneId,
          {
            zoneId: zoneIdToUse,
            subcategoryId: serviceForm.subcategoryId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('Services API Response:', response.data);

        if (response.data.data && Array.isArray(response.data.data)) {
          setServices(response.data.data);
          console.log('Ã¢Å“â€¦ Services loaded:', response.data.data.length);

          if (response.data.data.length === 0) {
            toast.info('No services available for this subcategory in your zone');
          }
        } else {
          setServices([]);
          console.log('No services data in response');
        }
      } catch (error) {
        console.error('Ã¢ÂÅ’ Failed to fetch services:', error);
        console.error('Error response:', error.response?.data);
        setServices([]);
        toast.error('Failed to fetch services');
      } finally {
        setServicesLoading(false);
      }

      setServiceForm((prev) => ({
        ...prev,
        serviceId: '',
        selectedRateCards: [],
        totalAmount: 0,
      }));
      setRateCards([]);
    };

    fetchServices();
  }, [serviceForm.subcategoryId, zones, getToken]);

  // Fetch rate cards when service changes
  useEffect(() => {
    const fetchRateCards = async () => {
      if (!serviceForm.serviceId) {
        setRateCards([]);
        setServiceForm((prev) => ({
          ...prev,
          selectedRateCards: [],
          totalAmount: 0
        }));
        return;
      }

      const token = getToken();
      if (!token) return;

      setRateCardsLoading(true);
      try {
        const response = await axios.post(
          URLS.GetServiceRateCards,
          {
            serviceId: serviceForm.serviceId,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.data) {
          setRateCards(response.data.data);
        } else {
          setRateCards([]);
        }
      } catch (error) {
        console.error('Failed to fetch rate cards:', error);
        setRateCards([]);
        toast.error('Failed to fetch rate cards');
      } finally {
        setRateCardsLoading(false);
      }
    };

    fetchRateCards();
  }, [serviceForm.serviceId, getToken]);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    console.log('Service change:', name, value); // DEBUG
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  // const handleRateCardSelection = (rateCard) => {
  //   setServiceForm((prev) => {
  //     const exists = prev.selectedRateCards.some((rc) => rc._id === rateCard._id);

  //     return {
  //       ...prev,
  //       selectedRateCards: exists
  //         ? prev.selectedRateCards.filter((rc) => rc._id !== rateCard._id)
  //         : [
  //             ...prev.selectedRateCards,
  //             {
  //               _id: rateCard._id,
  //               rateCardTitle: rateCard.rateCardTitle,
  //               rateCardPrice: rateCard.rateCardPrice,
  //             },
  //           ],
  //     };
  //   });
  // };


  const handleRateCardSelection = (rateCard) => {
    setServiceForm((prev) => {
      const exists = prev.selectedRateCards.some((rc) => rc._id === rateCard._id);

      return {
        ...prev,
        selectedRateCards: exists
          ? prev.selectedRateCards.filter((rc) => rc._id !== rateCard._id)
          : [
            ...prev.selectedRateCards,
            {
              _id: rateCard._id,
              rateCardTitle: rateCard.rateCardTitle,
              rateCardPrice: rateCard.rateCardPrice,
            },
          ],
      };
    });
  };


  // useEffect(() => {
  //   const total = serviceForm.selectedRateCards.reduce(
  //     (sum, rc) => sum + (Number(rc.rateCardPrice) || 0),
  //     0,
  //   );
  //   setServiceForm((prev) => ({ ...prev, totalAmount: total }));
  // }, [serviceForm.selectedRateCards]);
  // Update your existing billing calculation useEffect
  // Ã¢Å“â€¦ UPDATE: Include BOTH inspection AND booking charges
  useEffect(() => {
    // Calculate Sub Total
    const subTotal = serviceForm.selectedRateCards.reduce((sum, rc) => {
      const priceStr = String(rc.rateCardPrice || '0').replace(/[^0-9.]/g, '');
      const price = parseFloat(priceStr) || 0;
      return sum + price;
    }, 0);

    // Calculate amount after discount
    const discountAmount = parseFloat(serviceForm.discount) || 0;
    const amountAfterDiscount = subTotal - discountAmount;

    // Ã¢Å“â€¦ ADD: Include BOTH charges
    const totalWithCharges = amountAfterDiscount +
      inspectionCharges.inspectionCost +
      inspectionCharges.serviceBookingCost;

    // Calculate 18% GST on (SubTotal - Discount + Inspection + Booking)
    const gstAmount = (totalWithCharges * 18) / 100;

    // Calculate Grand Total
    const grandTotal = totalWithCharges + gstAmount;

    setServiceForm((prev) => ({
      ...prev,
      totalAmount: subTotal,           // Sub Total
      gstAmount: gstAmount,            // GST Amount
      grandTotal: grandTotal,          // Grand Total
    }));
  }, [serviceForm.selectedRateCards, serviceForm.discount, inspectionCharges.inspectionCost, inspectionCharges.serviceBookingCost]);

  const handleAddressSelect = (index) => {
    if (userAddresses[index]) {
      const selectedAddress = userAddresses[index];
      setSelectedAddressIndex(index);
      setCustomerForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          ...selectedAddress,
          countryName: selectedAddress.countryName || 'India',
        },
      }));

      setShowManualAddress(false);

      if (selectedAddress.latitude && selectedAddress.longitude) {
        fetchZones(selectedAddress.latitude, selectedAddress.longitude, selectedAddress.cityName);
      }

      setAddressDialogOpen(false);
      toast.success('Address selected successfully!');
    }
  };

  const handleAddNewAddress = () => {
    setCustomerForm((prev) => ({
      ...prev,
      address: {
        countryName: '',
        stateName: '',
        cityName: '',
        area: '',
        flat: '',
        postalCode: '',
        addressLineOne: '',
        addressLineTwo: '',
        type: 'Home',
        latitude: '',
        longitude: '',
        _id: '',
        defaultAddress: false,
      },
    }));
    setSelectedAddressIndex(-1);
    setShowManualAddress(true);
    setAddressDialogOpen(false);
    toast.info('Please enter new address details manually.');
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.address_components) {
        const addressComponents = place.address_components;
        const geometry = place.geometry.location;

        let country = '',
          state = '',
          city = '',
          postalCode = '',
          area = '';

        addressComponents.forEach((component) => {
          const types = component.types;
          if (types.includes('country')) {
            country = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
          if (types.includes('locality')) {
            city = component.long_name;
          }
          if (types.includes('postal_code')) {
            postalCode = component.long_name;
          }
          if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
            area = component.long_name;
          }
        });

        setCustomerForm((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            countryName: country,
            stateName: state,
            cityName: city,
            area: area,
            postalCode: postalCode,
            addressLineOne: place.formatted_address || '',
            latitude: geometry.lat().toString(),
            longitude: geometry.lng().toString(),
            _id: '',
            defaultAddress: false,
          },
        }));

        setSelectedAddressIndex(-1);
        setShowManualAddress(true);

        fetchZones(geometry.lat(), geometry.lng(), city);
      }
    }
  };

  const onLoad = (autoC) => {
    setAutocomplete(autoC);
  };


  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) {
      toast.error('Enter 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    try {
      const response = await axios.post(
        URLS.VerifyWhatsAppotp,
        {
          mobile: customerForm.mobileNumber,  // Ã¢â€ Â "mobile" key
          otp: otpValue
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (response.data.status === 'success') {
        setPhoneVerified(true);
        setOtpDialogOpen(false);
        setOtpValue('');
        setShowManualAddress(true);
        toast.success('Phone verified!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setOtpLoading(false);
    }
  };


  const handleResendOTP = async () => {
    setOtpLoading(true);
    try {
      const response = await axios.post(
        URLS.SendWhatsAppotp,
        { mobile: customerForm.mobileNumber },  // Ã¢â€ Â "mobile" key
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      if (response.data.status === 'success') {
        toast.success('New OTP sent');
        setResendTimer(60);
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setOtpLoading(false);
    }
  };



  const validateCustomerTab = () => {


    if (!phoneVerified) {
      toast.error('Please verify your phone number first');
      return false;
    }
    const requiredFields = [
      !customerForm.customerName && 'Customer Name',
      !customerForm.email && 'Email',
      !customerForm.mobileNumber && 'Mobile Number',
      !customerForm.address.addressLineOne && 'Address',
    ].filter(Boolean);

    if (requiredFields.length) {
      toast.error(`Missing: ${requiredFields.join(', ')}`);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerForm.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(customerForm.mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }

    if (!zones || !zones._id) {
      toast.error('Please select a valid address to determine service zone');
      return false;
    }

    return true;
  };

  const validateServiceTab = () => {
    const requiredFields = [
      !serviceForm.categoryId && 'Category',
      !serviceForm.subcategoryId && 'Subcategory',
      !serviceForm.serviceId && 'Service',
      serviceForm.selectedRateCards.length === 0 && 'At least one Rate Card',
      !serviceForm.sourceOfLead && 'Source of Lead',
    ].filter(Boolean);

    if (requiredFields.length) {
      toast.error(`Missing: ${requiredFields.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleTabChange = (event, newValue) => {
    if (newValue === 1 && !validateCustomerTab()) {
      return;
    }
    setActiveTab(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCustomerTab() || !validateServiceTab()) {
      return;
    }

    const token = getToken();

    const bookingData = {
      name: customerForm.customerName,
      email: customerForm.email,
      phone: customerForm.mobileNumber,
      altPhone: customerForm.alternateNumber,
      area: customerForm.address.area,
      flat: customerForm.address.flat,
      postalCode: customerForm.address.postalCode,
      addressLineOne: customerForm.address.addressLineOne,
      addressLineTwo: customerForm.address.addressLineTwo,
      latitude: customerForm.address.latitude,
      longitude: customerForm.address.longitude,
      type: customerForm.address.type,
      serviceAddressId: customerForm.address._id,
      zoneId: zones._id,
      defaultAddress: customerForm.address.defaultAddress,
      stateName: customerForm.address.stateName,
      cityName: customerForm.address.cityName,
      countryName: customerForm.address.countryName,
      categoryId: serviceForm.categoryId,
      subcategoryId: serviceForm.subcategoryId,
      serviceId: serviceForm.serviceId,
      ratecardDetails: serviceForm.selectedRateCards.map(rc => ({
        _id: rc._id,
        rateCardTitle: rc.rateCardTitle,
        rateCardPrice: String(rc.rateCardPrice), // Keep as string
      })),
      amount: serviceForm.totalAmount,
      sourceOfLead: serviceForm.sourceOfLead,
      bookedDate: serviceForm.bookedDate,
      bookedTime: serviceForm.bookedTime,
      addMoreInfo: serviceForm.additionalInfo,
    };

    setLoading(true);
    try {
      const res = await axios.post(URLS.AddCrmBooking, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        toast.success('Booking created successfully!');
        navigate('/offlineverifiedpartnercrmbookings/accepted');
      }
    } catch (error) {
      const message =
        error.response?.status === 400
          ? 'Unauthorized access. Please log in again.'
          : error.response?.data?.message || 'Failed to create booking.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };




  // Handle new rate card input changes
  const handleNewRateCardChange = (e) => {
    const { name, value } = e.target;
    setNewRateCard(prev => ({ ...prev, [name]: value }));
  };


  const handleServiceDescriptionToggle = (e) => {
    const isEnabled = e.target.value === 'yes';
    setNewRateCard(prev => ({
      ...prev,
      includeServiceDescription: isEnabled,
      serviceDescription: isEnabled ? CONSTANT_SERVICE_DESCRIPTION : ''
    }));
  };

  const handleServiceNoteToggle = (e) => {
    const isEnabled = e.target.value === 'yes';
    setNewRateCard(prev => ({
      ...prev,
      includeServiceNote: isEnabled,
      serviceNote: isEnabled ? CONSTANT_SERVICE_NOTE : ''
    }));
  };
  // Handle image upload
  const handleRateCardImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewRateCard(prev => ({ ...prev, rateCardServiceImage: file }));
    }
  };

  // Submit new rate card
  // Submit new rate card
  // Submit new rate card
  // Submit new rate card
  // Ã¢Å“â€¦ UPDATE: Submit new rate card with conditional description
  const handleAddNewRateCard = async () => {
    // Validation
    if (!newRateCard.rateCardTitle || !newRateCard.rateCardPrice) {
      toast.error('Please fill Service Name and Price');
      return;
    }

    const token = getToken();
    if (!token) return;

    setAddingRateCard(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('serviceId', serviceForm.serviceId);
      formData.append('serviceName', newRateCard.rateCardTitle);
      formData.append('rateCardTitle', newRateCard.rateCardTitle);
      formData.append('rateCardPrice', newRateCard.rateCardPrice);
      formData.append('rateCardQuantity', newRateCard.rateCardQuantity);

      // Ã¢Å“â€¦ CONDITIONAL: Only add serviceDescription if radio is "Yes"
      if (newRateCard.includeServiceDescription && newRateCard.serviceDescription) {
        formData.append('serviceDescription', newRateCard.serviceDescription);
      }

      formData.append('reason', newRateCard.reason);
      formData.append('serviceNote', newRateCard.serviceNote);
      formData.append('rateCardVideoUrl', newRateCard.rateCardVideoUrl);

      if (newRateCard.rateCardServiceImage) {
        formData.append('rateCardServiceImage', newRateCard.rateCardServiceImage);
      }

      const response = await axios.post(
        'https://api.doorstephub.com/v1/dhubApi/admin/ondemandservice/addondemandserviceratecard',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Rate card added successfully!');

        // Add the new rate card to the list
        const addedRateCard = {
          _id: response.data.data?._id || Date.now().toString(),
          ...newRateCard,
        };
        setRateCards(prev => [...prev, addedRateCard]);

        // Reset form
        setNewRateCard({
          rateCardTitle: '',
          rateCardPrice: '',
          rateCardQuantity: '1',
          serviceDescription: '',
          reason: '',
          serviceNote: '',
          rateCardServiceImage: null,
          rateCardVideoUrl: '',
          includeServiceDescription: false  // Ã¢Å“â€¦ Reset radio
        });
        setShowAddRateCard(false);
      }
    } catch (error) {
      console.error('Failed to add rate card:', error);
      toast.error(error.response?.data?.message || 'Failed to add rate card');
    } finally {
      setAddingRateCard(false);
    }
  };


  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBNVn5j-M6F4VHkaOluoOcVY3K5r2-NlPk"
      libraries={libraries}
      onLoad={() => setScriptLoaded(true)}
    >
      <PageContainer title="Add CRM Booking">
        <Breadcrumb title="Add CRM Booking" items={BCrumb} />
        <ToastContainer position="top-right" autoClose={3000} />
        <Box sx={{ float: 'right', mb: 2 }}>
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

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Customer Details" />
          <Tab label="Service Details" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          {/* Customer Details Tab */}
          <TabPanel value={activeTab} index={0}>
            <ParentCard title="Customer Information">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="mobileNumber" required>
                    Whats App Number *
                  </CustomFormLabel>
                  <CustomTextField
                    id="mobileNumber"
                    name="mobileNumber"
                    value={customerForm.mobileNumber}
                    onChange={handleCustomerChange}
                    placeholder="Enter your 10-digit mobile number"
                    inputProps={{ maxLength: 10 }}
                    fullWidth
                    required
                  />
                  {userDetails && (
                    <Typography variant="caption" color="success.main">
                      Ã¢Å“â€œ User details loaded from existing records
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="alternateNumber">Alternate Number</CustomFormLabel>
                  <CustomTextField
                    id="alternateNumber"
                    name="alternateNumber"
                    value={customerForm.alternateNumber}
                    onChange={handleCustomerChange}
                    placeholder="Alternate mobile number"
                    inputProps={{ maxLength: 10 }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="customerName" required>
                    Customer Name *
                  </CustomFormLabel>
                  <CustomTextField
                    id="customerName"
                    name="customerName"
                    value={customerForm.customerName}
                    onChange={handleCustomerChange}
                    placeholder="Enter customer name"
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="email" required>
                    Email Address *
                  </CustomFormLabel>
                  <CustomTextField
                    id="email"
                    name="email"
                    type="email"
                    value={customerForm.email}
                    onChange={handleCustomerChange}
                    placeholder="customer@example.com"
                    fullWidth
                    required
                  />
                </Grid>

                {/* Address Selection Section */}
                {userAddresses.length > 0 && !showManualAddress && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">
                          Select Existing Address ({userAddresses.length} available)
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setAddressDialogOpen(true)}
                          >
                            View All Addresses
                          </Button>
                          <Button
                            variant="text"
                            size="small"
                            color="primary"
                            onClick={handleAddNewAddress}
                          >
                            Add New Address
                          </Button>
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        {userAddresses.slice(0, 2).map((address, index) => (
                          <Grid item xs={12} md={6} key={address._id}>
                            <AddressCard
                              selected={selectedAddressIndex === index}
                              onClick={() => handleAddressSelect(index)}
                            >
                              <CardContent>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {address.name || customerForm.customerName}
                                  </Typography>
                                  {address.defaultAddress && (
                                    <Chip label="Default" color="primary" size="small" />
                                  )}
                                  {selectedAddressIndex === index && (
                                    <Chip label="Selected" color="success" size="small" />
                                  )}
                                </Box>
                                <Typography variant="body2" color="textSecondary">
                                  {address.flat}, {address.addressLineOne}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {address.area}, {address.cityName} - {address.postalCode}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {address.stateName}, {address.countryName || 'India'}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  Type: {address.type}
                                </Typography>
                              </CardContent>
                            </AddressCard>
                          </Grid>
                        ))}
                      </Grid>

                      {userAddresses.length > 2 && (
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => setAddressDialogOpen(true)}
                          >
                            + {userAddresses.length - 2} more addresses
                          </Button>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                )}

                {/* Manual Address Section */}
                {showManualAddress && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Chip label="Enter New Address" color="primary" />
                      </Divider>
                    </Grid>

                    <Grid item xs={12}>
                      <CustomFormLabel htmlFor="address-search" required>
                        Search Location *
                      </CustomFormLabel>
                      {scriptLoaded && (
                        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                          <TextField
                            fullWidth
                            placeholder="Enter complete address to auto-fill location details"
                            variant="outlined"
                          />
                        </Autocomplete>
                      )}
                      <Typography variant="caption" color="textSecondary">
                        Start typing to search for your location
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="countryName" required>
                        Country *
                      </CustomFormLabel>
                      <CustomTextField
                        id="countryName"
                        name="countryName"
                        value={customerForm.address.countryName}
                        onChange={handleAddressChange}
                        placeholder="Country"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="stateName" required>
                        State *
                      </CustomFormLabel>
                      <CustomTextField
                        id="stateName"
                        name="stateName"
                        value={customerForm.address.stateName}
                        onChange={handleAddressChange}
                        placeholder="State"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="cityName" required>
                        City *
                      </CustomFormLabel>
                      <CustomTextField
                        id="cityName"
                        name="cityName"
                        value={customerForm.address.cityName}
                        onChange={handleAddressChange}
                        placeholder="City"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="area" required>
                        Area *
                      </CustomFormLabel>
                      <CustomTextField
                        id="area"
                        name="area"
                        value={customerForm.address.area}
                        onChange={handleAddressChange}
                        placeholder="Area or Zone"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="postalCode" required>
                        Postal Code *
                      </CustomFormLabel>
                      <CustomTextField
                        id="postalCode"
                        name="postalCode"
                        value={customerForm.address.postalCode}
                        onChange={handleAddressChange}
                        placeholder="Postal Code"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="flat">Flat/Building No.</CustomFormLabel>
                      <CustomTextField
                        id="flat"
                        name="flat"
                        value={customerForm.address.flat}
                        onChange={handleAddressChange}
                        placeholder="Flat/Building Number"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <CustomFormLabel htmlFor="addressLineOne" required>
                        Address Line 1 *
                      </CustomFormLabel>
                      <CustomTextField
                        id="addressLineOne"
                        name="addressLineOne"
                        value={customerForm.address.addressLineOne}
                        onChange={handleAddressChange}
                        placeholder="Street address, P.O. box, company name"
                        fullWidth
                        required
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <CustomFormLabel htmlFor="addressLineTwo">Address Line 2(Optional)</CustomFormLabel>
                      <CustomTextField
                        id="addressLineTwo"
                        name="addressLineTwo"
                        value={customerForm.address.addressLineTwo}
                        onChange={handleAddressChange}
                        placeholder="Apartment, suite, unit, building, floor, etc."
                        fullWidth
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <CustomFormLabel htmlFor="addressType">Address Type</CustomFormLabel>
                      <CustomSelect
                        id="addressType"
                        name="type"
                        value={customerForm.address.type}
                        onChange={handleAddressChange}
                        fullWidth
                      >
                        <MenuItem value="Home">Home</MenuItem>
                        <MenuItem value="Office">Work</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </CustomSelect>
                    </Grid>
                  </>
                )}

                {customerForm.address.latitude && customerForm.address.longitude && zones && zones._id && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="primary">
                          Ã¢Å“â€œ Zone: {zones.name || zones._id}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                  <Button variant="contained" color="primary" onClick={() => setActiveTab(1)}>
                    Next: Service Details
                  </Button>
                </Grid>
              </Grid>
            </ParentCard>
          </TabPanel>

          {/* Service Details Tab */}
          <TabPanel value={activeTab} index={1}>
            <ParentCard title="Service Selection">
              <Grid container spacing={3}>
                {/* Category */}
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="categoryId" required>
                    Category *
                  </CustomFormLabel>
                  <CustomSelect
                    id="categoryId"
                    name="categoryId"
                    value={serviceForm.categoryId}
                    onChange={handleServiceChange}
                    fullWidth
                    required
                    disabled={categoriesLoading || categories.length === 0}
                  >
                    <MenuItem value="">
                      {categoriesLoading ? 'Loading...' : 'Select Category'}
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {categoriesLoading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="caption">Loading categories...</Typography>
                    </Box>
                  )}
                </Grid>

                {/* Subcategory */}
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="subcategoryId" required>
                    Subcategory *
                  </CustomFormLabel>
                  <CustomSelect
                    id="subcategoryId"
                    name="subcategoryId"
                    value={serviceForm.subcategoryId}
                    onChange={handleServiceChange}
                    fullWidth
                    required
                    disabled={!serviceForm.categoryId || subcategoriesLoading}
                  >
                    <MenuItem value="">
                      {subcategoriesLoading ? 'Loading...' : !serviceForm.categoryId ? 'Select category first' : 'Select Subcategory'}
                    </MenuItem>
                    {subcategories.map((sub) => (
                      <MenuItem key={sub._id} value={sub._id}>
                        {sub.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {subcategoriesLoading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="caption">Loading subcategories...</Typography>
                    </Box>
                  )}
                </Grid>

                {/* Service */}
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="serviceId" required>
                    Service *
                  </CustomFormLabel>
                  <CustomSelect
                    id="serviceId"
                    name="serviceId"
                    value={serviceForm.serviceId}
                    onChange={handleServiceChange}
                    fullWidth
                    required
                    disabled={
                      !serviceForm.subcategoryId ||
                      !(zones && (zones._id || (zones.zoneId && zones.zoneId.length > 0))) ||
                      servicesLoading
                    }
                  >
                    <MenuItem value="">
                      {servicesLoading
                        ? 'Loading...'
                        : !serviceForm.subcategoryId
                          ? 'Select subcategory first'
                          : !(zones && (zones._id || (zones.zoneId && zones.zoneId.length > 0)))
                            ? 'Zone required - Please select address'
                            : 'Select Service'}
                    </MenuItem>
                    {services.map((service) => (
                      <MenuItem key={service._id} value={service._id}>
                        {service.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {servicesLoading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="caption">Loading services...</Typography>
                    </Box>
                  )}
                </Grid>

                {/* Source of Lead */}
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="sourceOfLead" required>
                    Source of Lead *
                  </CustomFormLabel>
                  <CustomSelect
                    id="sourceOfLead"
                    name="sourceOfLead"
                    value={serviceForm.sourceOfLead}
                    onChange={handleServiceChange}
                    fullWidth
                    required
                  >
                    <MenuItem value="">Select Source</MenuItem>
                    <MenuItem value="whatsapp">WhatsApp</MenuItem>
                    <MenuItem value="call">Phone Call</MenuItem>
                    <MenuItem value="website">Website</MenuItem>
                    <MenuItem value="walkin">Walk-in</MenuItem>
                    <MenuItem value="referral">Referral</MenuItem>
                  </CustomSelect>
                </Grid>

                {/* Booked Date */}
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="bookedDate" required>
                    Appointment Date*
                  </CustomFormLabel>
                  <CustomTextField
                    id="bookedDate"
                    type="date"
                    name="bookedDate"
                    value={serviceForm.bookedDate}
                    onChange={handleServiceChange}
                    placeholder="bookedDate"
                    fullWidth
                    required
                  />
                </Grid>

                {/* Booked Time */}
                <Grid item xs={12} md={6}>
                  <CustomFormLabel htmlFor="bookedTime" required>
                    Appointment Time *
                  </CustomFormLabel>
                  <CustomTextField
                    id="bookedTime"
                    type="time"
                    name="bookedTime"
                    value={serviceForm.bookedTime}
                    onChange={handleServiceChange}
                    placeholder="bookedTime"
                    fullWidth
                    required
                  />
                </Grid>

                {/* Rate Cards Table */}
                {/* {rateCards.length > 0 && (
                  <Grid item xs={12}>
                    <CustomFormLabel required>Select Rate Cards *</CustomFormLabel>
                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableHead> 
                          <TableRow>
                            <TableCell>Select</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Price (Ã¢â€šÂ¹)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rateCards.map((rateCard) => (
                            <TableRow key={rateCard._id} hover>
                              <TableCell>
                                <Checkbox
                                  checked={serviceForm.selectedRateCards.some(
                                    (rc) => rc._id === rateCard._id,
                                  )}
                                  onChange={() => handleRateCardSelection(rateCard)}
                                />
                              </TableCell>
                              <TableCell>{rateCard.rateCardTitle}</TableCell>
                              <TableCell>
                                Ã¢â€šÂ¹{Number(rateCard.rateCardPrice).toLocaleString('en-IN')}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )} */}


                {/* Rate Cards Section */}
                {/* Ã¢Å“â€¦ RATE CARDS SECTION - RESTRUCTURED WITH IMAGE PREVIEW */}
                {(rateCards.length > 0 || showAddRateCard) && (
                  <Grid item xs={12}>
                    <CustomFormLabel required>Select Rate Cards *</CustomFormLabel>

                    {/* Ã¢Å“â€¦ EXISTING RATE CARDS TABLE - SHOWS FIRST */}
                    {rateCards.length > 0 && (
                      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Select</TableCell>
                              <TableCell>Title</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>Reason</TableCell>
                              <TableCell align="right">Price (Ã¢â€šÂ¹)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rateCards.map((rateCard) => (
                              <TableRow key={rateCard._id} hover>
                                <TableCell>
                                  <Checkbox
                                    checked={serviceForm.selectedRateCards.some(
                                      (rc) => rc._id === rateCard._id,
                                    )}
                                    onChange={() => handleRateCardSelection(rateCard)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" fontWeight="medium">
                                    {rateCard.rateCardTitle}
                                  </Typography>
                                  {rateCard.serviceNote && (
                                    <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
                                      Ã¢â€œËœ {rateCard.serviceNote}
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption" color="text.secondary">
                                    {rateCard.serviceDescription || '-'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption" color="text.secondary">
                                    {rateCard.reason || '-'}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2" fontWeight="bold" color="primary">
                                    Ã¢â€šÂ¹{rateCard.rateCardPrice}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}

                    {/* Ã¢Å“â€¦ ADD CUSTOM RATE CARD TOGGLE - BELOW TABLE */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Checkbox
                        checked={showAddRateCard}
                        onChange={(e) => setShowAddRateCard(e.target.checked)}
                        disabled={!serviceForm.serviceId}
                      />
                      <Typography
                        variant="body2"
                        color={!serviceForm.serviceId ? 'text.disabled' : 'text.primary'}
                        sx={{ fontWeight: 500 }}
                      >
                        Add Custom Rate Card
                      </Typography>
                    </Box>

                    {/* Ã¢Å“â€¦ ADD RATE CARD FORM - Shows when toggle is enabled */}
                    {showAddRateCard && (
                      <Card variant="outlined" sx={{ mb: 3, bgcolor: 'action.hover', border: '2px dashed', borderColor: 'primary.main' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              Add Custom Rate Card
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setShowAddRateCard(false);
                                setNewRateCard({
                                  rateCardTitle: '',
                                  rateCardPrice: '',
                                  rateCardQuantity: '1',
                                  serviceDescription: '',
                                  reason: '',
                                  serviceNote: '',
                                  rateCardServiceImage: null,
                                  rateCardVideoUrl: '',
                                  includeServiceDescription: false
                                });
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Box>

                          <Divider sx={{ mb: 3 }} />

                          <Grid container spacing={2}>
                            {/* Service Name */}
                            <Grid item xs={12} md={4}>
                              <CustomFormLabel htmlFor="new-rateCardTitle" required>
                                Service Name *
                              </CustomFormLabel>
                              <CustomTextField
                                id="new-rateCardTitle"
                                name="rateCardTitle"
                                value={newRateCard.rateCardTitle}
                                onChange={handleNewRateCardChange}
                                placeholder="Enter Service Name"
                                fullWidth
                                required
                              />
                            </Grid>

                            {/* Cost Of Service */}
                            <Grid item xs={12} md={4}>
                              <CustomFormLabel htmlFor="new-rateCardPrice" required>
                                Cost Of Service *
                              </CustomFormLabel>
                              <CustomTextField
                                id="new-rateCardPrice"
                                name="rateCardPrice"
                                value={newRateCard.rateCardPrice}
                                onChange={handleNewRateCardChange}
                                placeholder="Enter Cost Of Service"
                                fullWidth
                                required
                              />
                            </Grid>

                            {/* Quantity */}
                            <Grid item xs={12} md={4}>
                              <CustomFormLabel htmlFor="new-rateCardQuantity" required>
                                Quantity *
                              </CustomFormLabel>
                              <CustomTextField
                                id="new-rateCardQuantity"
                                name="rateCardQuantity"
                                type="number"
                                value={newRateCard.rateCardQuantity}
                                onChange={handleNewRateCardChange}
                                placeholder="Enter Quantity"
                                fullWidth
                                required
                                inputProps={{ min: 1 }}
                              />
                            </Grid>

                            {/* Ã¢Å“â€¦ IMAGE UPLOAD WITH PREVIEW */}
                            <Grid item xs={12} md={6}>
                              <CustomFormLabel htmlFor="new-rateCardServiceImage">
                                Image
                              </CustomFormLabel>
                              <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                sx={{
                                  justifyContent: 'flex-start',
                                  py: 1.5,
                                  textTransform: 'none',
                                  color: newRateCard.rateCardServiceImage ? 'primary.main' : 'text.secondary'
                                }}
                              >
                                {newRateCard.rateCardServiceImage ?
                                  newRateCard.rateCardServiceImage.name :
                                  'Choose file'
                                }
                                <input
                                  type="file"
                                  hidden
                                  accept="image/*"
                                  onChange={handleRateCardImageUpload}
                                />
                              </Button>

                              {/* Ã¢Å“â€¦ IMAGE PREVIEW */}
                              {newRateCard.rateCardServiceImage && (
                                <Box sx={{ mt: 2 }}>
                                  <img
                                    src={URL.createObjectURL(newRateCard.rateCardServiceImage)}
                                    alt="Rate Card Preview"
                                    style={{
                                      width: '100%',
                                      maxHeight: '200px',
                                      objectFit: 'contain',
                                      borderRadius: '8px',
                                      border: '1px solid #e0e0e0',
                                    }}
                                  />
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    Size: {(newRateCard.rateCardServiceImage.size / 1024).toFixed(2)} KB
                                  </Typography>
                                </Box>
                              )}
                            </Grid>

                            {/* YouTube URL */}
                            {/* <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="new-rateCardVideoUrl">
                YouTube URL
              </CustomFormLabel>
              <CustomTextField
                id="new-rateCardVideoUrl"
                name="rateCardVideoUrl"
                value={newRateCard.rateCardVideoUrl}
                onChange={handleNewRateCardChange}
                placeholder="https://youtube.com/example"
                fullWidth
              />
            </Grid> */}

                            {/* Service Description */}
                            {/* <Grid item xs={12} md={6}>
              <CustomFormLabel htmlFor="new-serviceDescription">
                Service Description
              </CustomFormLabel>
              <CustomTextField
                id="new-serviceDescription"
                name="serviceDescription"
                value={newRateCard.serviceDescription}
                onChange={handleNewRateCardChange}
                placeholder="Enter Service Description"
                fullWidth
                multiline
                rows={3}
              />
            </Grid> */}


                            {/* Ã¢Å“â€¦ SERVICE DESCRIPTION WITH RADIO BUTTON */}

                            {/* Reason - Keep at full width if serviceDescription is hidden */}
                            {/* <Grid item xs={12} md={newRateCard.includeServiceDescription ? 12 : 6}>
  <CustomFormLabel htmlFor="new-reason">
    Reason
  </CustomFormLabel>
  <CustomTextField
    id="new-reason"
    name="reason"
    value={newRateCard.reason}
    onChange={handleNewRateCardChange}
    placeholder="Enter Reason"
    fullWidth
    multiline
    rows={3}
  />
</Grid> */}


                            {/* Reason */}
                            <Grid item xs={12} md={6}>
                              <CustomFormLabel htmlFor="new-reason">
                                Reason
                              </CustomFormLabel>
                              <CustomTextField
                                id="new-reason"
                                name="reason"
                                value={newRateCard.reason}
                                onChange={handleNewRateCardChange}
                                placeholder="Enter Reason"
                                fullWidth
                                multiline

                              />
                            </Grid>


                            <Grid item xs={12} md={6}>
                              <Box sx={{ mb: 2 }}>
                                <CustomFormLabel>
                                  Include Service Description
                                </CustomFormLabel>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                      type="radio"
                                      id="service-desc-yes"
                                      name="includeServiceDescription"
                                      value="yes"
                                      checked={newRateCard.includeServiceDescription === true}
                                      onChange={handleServiceDescriptionToggle}
                                      style={{ marginRight: '8px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="service-desc-yes" style={{ cursor: 'pointer', userSelect: 'none' }}>
                                      <Typography variant="body2">Yes</Typography>
                                    </label>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                      type="radio"
                                      id="service-desc-no"
                                      name="includeServiceDescription"
                                      value="no"
                                      checked={newRateCard.includeServiceDescription === false}
                                      onChange={handleServiceDescriptionToggle}
                                      style={{ marginRight: '8px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="service-desc-no" style={{ cursor: 'pointer', userSelect: 'none' }}>
                                      <Typography variant="body2">No</Typography>
                                    </label>
                                  </Box>
                                </Box>
                              </Box>

                              {/* Service Description Field - Shows when Yes is selected */}
                              {newRateCard.includeServiceDescription && (
                                <Box>
                                  <CustomFormLabel htmlFor="new-serviceDescription">
                                    Service Description
                                  </CustomFormLabel>
                                  <CustomTextField
                                    id="new-serviceDescription"
                                    name="serviceDescription"
                                    value={newRateCard.serviceDescription}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    disabled
                                    InputProps={{
                                      readOnly: true,
                                      sx: {
                                        bgcolor: 'action.hover',
                                        color: 'text.primary',
                                        fontWeight: 500,
                                        '& .MuiInputBase-input.Mui-disabled': {
                                          WebkitTextFillColor: '#000',
                                          color: '#000'
                                        }
                                      }
                                    }}
                                  />

                                </Box>
                              )}
                            </Grid>




                            {/* Note */}
                            <Grid item xs={12} md={6} >
                              <Box sx={{ mb: 2 }}>
                                <CustomFormLabel>
                                  Include Service Note
                                </CustomFormLabel>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                      type="radio"
                                      id="service-note-yes"
                                      name="includeServiceNote"
                                      value="yes"
                                      checked={newRateCard.includeServiceNote === true}
                                      onChange={handleServiceNoteToggle}
                                      style={{ marginRight: '8px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="service-note-yes" style={{ cursor: 'pointer', userSelect: 'none' }}>
                                      <Typography variant="body2">Yes</Typography>
                                    </label>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                      type="radio"
                                      id="service-note-no"
                                      name="includeServiceNote"
                                      value="no"
                                      checked={newRateCard.includeServiceNote === false}
                                      onChange={handleServiceNoteToggle}
                                      style={{ marginRight: '8px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="service-note-no" style={{ cursor: 'pointer', userSelect: 'none' }}>
                                      <Typography variant="body2">No</Typography>
                                    </label>
                                  </Box>
                                </Box>
                              </Box>

                              {/* Service Note Field - Shows when Yes is selected */}
                              {newRateCard.includeServiceNote && (
                                <Box>
                                  <CustomFormLabel htmlFor="new-serviceNote">
                                    Service Note
                                  </CustomFormLabel>
                                  <CustomTextField
                                    id="new-serviceNote"
                                    name="serviceNote"
                                    value={newRateCard.serviceNote}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    disabled
                                    InputProps={{
                                      readOnly: true,
                                      sx: {
                                        bgcolor: 'action.hover',
                                        color: 'text.primary',
                                        fontWeight: 500,
                                        '& .MuiInputBase-input.Mui-disabled': {
                                          WebkitTextFillColor: '#000',
                                        }
                                      }
                                    }}
                                  />

                                </Box>
                              )}
                            </Grid>

                            {/* Action Buttons */}
                            <Grid item xs={12}>
                              <Divider sx={{ mb: 2 }} />
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    setShowAddRateCard(false);
                                    setNewRateCard({
                                      rateCardTitle: '',
                                      rateCardPrice: '',
                                      rateCardQuantity: '1',
                                      serviceDescription: '',
                                      reason: '',
                                      serviceNote: '',
                                      rateCardServiceImage: null,
                                      rateCardVideoUrl: '',
                                    });
                                  }}
                                  disabled={addingRateCard}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={handleAddNewRateCard}
                                  disabled={addingRateCard}
                                  startIcon={addingRateCard ? <CircularProgress size={20} /> : null}
                                >
                                  {addingRateCard ? 'Adding...' : 'Submit'}
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    )}




                    {/* Ã¢Å“â€¦ BILLING SUMMARY */}
                    {/* Ã¢Å“â€¦ BILLING SUMMARY WITH INSPECTION CHARGES */}
                    {serviceForm.selectedRateCards.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        {/* Selected Items */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Selected Rate Cards ({serviceForm.selectedRateCards.length}):
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {serviceForm.selectedRateCards.map((rc) => (
                              <Chip
                                key={rc._id}
                                label={`${rc.rateCardTitle} - Ã¢â€šÂ¹${rc.rateCardPrice}`}
                                onDelete={() => handleRateCardSelection(rc)}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Billing Calculations */}
                        <Grid container spacing={2}>
                          {/* Discount Input */}
                          <Grid item xs={12} md={6}>
                            <CustomFormLabel htmlFor="discount">
                              Discount Amount (Optional)
                            </CustomFormLabel>
                            <CustomTextField
                              id="discount"
                              name="discount"
                              type="number"
                              value={serviceForm.discount}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setServiceForm(prev => ({ ...prev, discount: value }));
                              }}
                              placeholder="Enter discount amount"
                              fullWidth
                              InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>Ã¢â€šÂ¹</Typography>,
                              }}
                            />
                          </Grid>

                          {/* Ã¢Å“â€¦ DOORSTEP INSPECTION CHARGES - READ ONLY */}
                          {/* <Grid item xs={12} md={6}>
        <CustomFormLabel htmlFor="inspectionCharges">
          Doorstep Inspection Charges
        </CustomFormLabel>
        <CustomTextField
          id="inspectionCharges"
          name="inspectionCharges"
          value={inspectionCharges.loading ? 'Loading...' : `Ã¢â€šÂ¹${inspectionCharges.inspectionCost}`}
          fullWidth
          disabled
          InputProps={{
            readOnly: true,
            sx: { 
              bgcolor: 'action.hover',
              fontWeight: 600,
              color: 'primary.main'
            }
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          This charge is automatically added to the total
        </Typography>
      </Grid> */}


                          {/* <Grid item xs={12} md={6}>
        <CustomFormLabel htmlFor="serviceBookingCost">
          Service Booking Cost
        </CustomFormLabel>
        <CustomTextField
          id="serviceBookingCost"
          name="serviceBookingCost"
          value={inspectionCharges.loading ? 'Loading...' : `Ã¢â€šÂ¹${inspectionCharges.serviceBookingCost}`}
          fullWidth
          disabled
          InputProps={{
            readOnly: true,
            sx: { 
              bgcolor: 'action.hover',
              fontWeight: 600,
              color: 'primary.main'
            }
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Auto-added to total amount
        </Typography>
      </Grid> */}

                          {/* Billing Summary Card */}
                          <Grid item xs={6}>
                            <Card variant="outlined" sx={{ bgcolor: 'action.hover' }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  Billing Summary
                                </Typography>

                                {/* Sub Total */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2">Sub Total:</Typography>
                                  <Typography variant="body2" fontWeight="medium">
                                    Ã¢â€šÂ¹{serviceForm.totalAmount.toFixed(2)}
                                    {serviceForm.selectedRateCards.some(rc =>
                                      String(rc.rateCardPrice).includes('+')
                                    ) && '+'}
                                  </Typography>
                                </Box>

                                {/* Discount */}
                                {serviceForm.discount > 0 && (
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="success.main">Discount:</Typography>
                                    <Typography variant="body2" color="success.main" fontWeight="medium">
                                      - Ã¢â€šÂ¹{serviceForm.discount.toFixed(2)}
                                    </Typography>
                                  </Box>
                                )}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2">Service Booking Fee</Typography>
                                  <Typography variant="body2" fontWeight="medium">
                                    + Ã¢â€šÂ¹{inspectionCharges.serviceBookingCost.toFixed(2)}
                                  </Typography>
                                </Box>

                                {/* Ã¢Å“â€¦ INSPECTION CHARGES */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2">Doorstep Inspection Fee</Typography>
                                  <Typography variant="body2" fontWeight="medium">
                                    + Ã¢â€šÂ¹{inspectionCharges.inspectionCost.toFixed(2)}
                                  </Typography>
                                </Box>

                                {/* Ã¢Å“â€¦ SERVICE BOOKING COST */}


                                <Divider sx={{ my: 1 }} />

                                {/* GST */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2">GST (18%):</Typography>
                                  <Typography variant="body2" fontWeight="medium">
                                    Ã¢â€šÂ¹{serviceForm.gstAmount.toFixed(2)}
                                  </Typography>
                                </Box>

                                <Divider sx={{ my: 1 }} />

                                {/* Grand Total */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="h6" fontWeight="bold">Grand Total:</Typography>
                                  <Typography variant="h5" color="primary" fontWeight="bold">
                                    Ã¢â€šÂ¹{serviceForm.grandTotal.toFixed(2)}
                                    {serviceForm.selectedRateCards.some(rc =>
                                      String(rc.rateCardPrice).includes('+')
                                    ) && '+'}
                                  </Typography>
                                </Box>


                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Grid>
                )}





                {/* Total Amount */}
                {/* <Grid item xs={12} md={6}>
                  <CustomFormLabel>Sub Total</CustomFormLabel>
                  <TextField
                    value={`Ã¢â€šÂ¹${serviceForm.totalAmount.toLocaleString('en-IN')}`}
                    fullWidth
                    disabled
                    variant="outlined"
                  />
                </Grid> */}

                {/* Additional Info */}
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="additionalInfo">Additional Information</CustomFormLabel>
                  <CustomTextField
                    id="additionalInfo"
                    name="additionalInfo"
                    value={serviceForm.additionalInfo}
                    onChange={handleServiceChange}
                    placeholder="Any additional information about the booking..."
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="outlined" onClick={() => setActiveTab(0)}>
                    Back to Customer Details
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Creating Booking...' : 'Create Booking'}
                  </Button>
                </Grid>
              </Grid>
            </ParentCard>
          </TabPanel>



          <Dialog
            open={otpDialogOpen}
            maxWidth="sm"
            fullWidth
            disableEscapeKeyDown
            onClose={(event, reason) => {
              // Prevent closing by clicking outside
              if (reason === 'backdropClick') {
                return;
              }
            }}
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" component="span" fontWeight="bold">
                  Verify WhatsApp Number
                </Typography>
                <IconButton
                  aria-label="close"
                  onClick={() => {
                    setOtpDialogOpen(false);
                    setOtpValue('');
                    setCustomerForm(prev => ({ ...prev, mobileNumber: '' }));
                    toast.info('OTP verification cancelled');
                  }}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Box sx={{ py: 2 }}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  OTP sent to **{customerForm.mobileNumber.slice(-4)}
                </Alert>

                <TextField
                  fullWidth
                  label="Enter OTP"
                  value={otpValue}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 6) setOtpValue(val);
                  }}
                  inputProps={{
                    maxLength: 6,
                    style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }
                  }}
                  disabled={otpLoading}
                />

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  {resendTimer > 0 ? (
                    <Typography variant="body2">Resend in {resendTimer}s</Typography>
                  ) : (
                    <Button onClick={handleResendOTP} disabled={otpLoading}>
                      Resend OTP
                    </Button>
                  )}
                </Box>
              </Box>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() => {
                  setOtpDialogOpen(false);
                  setOtpValue('');
                  setCustomerForm(prev => ({ ...prev, mobileNumber: '' }));
                }}
                disabled={otpLoading}
              >
                Change Number
              </Button>
              <Button
                variant="contained"
                onClick={handleVerifyOTP}
                disabled={otpLoading || otpValue.length !== 6}
              >
                {otpLoading ? 'Verifying...' : 'Verify'}
              </Button>
            </DialogActions>
          </Dialog>



        </form>

        {/* Address Selection Dialog */}
        <Dialog
          open={addressDialogOpen}
          onClose={() => setAddressDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Select Address
            <Typography variant="subtitle1" color="textSecondary">
              {userAddresses.length} addresses found for {customerForm.customerName}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {userAddresses.map((address, index) => (
                <Grid item xs={12} key={address._id}>
                  <AddressCard
                    selected={selectedAddressIndex === index}
                    onClick={() => handleAddressSelect(index)}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">
                          {address.name || customerForm.customerName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {address.defaultAddress && (
                            <Chip label="Default" color="primary" size="small" />
                          )}
                          {selectedAddressIndex === index && (
                            <Chip label="Currently Selected" color="success" size="small" />
                          )}
                        </Box>
                      </Box>
                      <Typography variant="body1" gutterBottom>
                        {address.flat}, {address.addressLineOne}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {address.addressLineTwo}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {address.area}, {address.cityName} - {address.postalCode}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {address.stateName}, {address.countryName || 'India'}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 1,
                        }}
                      >
                        <Typography variant="caption" color="textSecondary">
                          Type: {address.type}
                        </Typography>
                        <Button
                          variant={selectedAddressIndex === index ? 'contained' : 'outlined'}
                          size="small"
                        >
                          {selectedAddressIndex === index ? 'Selected' : 'Select This Address'}
                        </Button>
                      </Box>
                    </CardContent>
                  </AddressCard>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between' }}>
            <Button variant="outlined" color="primary" onClick={handleAddNewAddress}>
              Add New Address
            </Button>
            <Button onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </PageContainer>
    </LoadScript>
  );
};

export default AddCrmBooking;


// import React, { useState, useEffect, useCallback } from 'react';
// import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
// import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
// import { IconArrowBackUp, IconX, IconPlus,IconFileText  } from '@tabler/icons-react';
// import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
// import PageContainer from 'src/components/container/PageContainer';
// import ParentCard from '../../components/shared/ParentCard';
// import { ToastContainer, toast } from 'react-toastify';
// import {
//   Button,
//   styled,
//   Chip,
//   IconButton,
//   Card,
//   CardMedia,
//   Box,
//   Typography,
//   Grid,
//   FormHelperText,
//   Checkbox,
//   Select,
//   MenuItem,
//   FormControl,
// } from '@mui/material';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
// import { LoadingButton } from '@mui/lab';
// import { URLS } from '../../Url';
// import axios from 'axios';


// const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Service Provider' }];

// const CustomSelect = styled(Select)({
//   '& .MuiOutlinedInput-root': {
//     borderRadius: '8px',
//   },
// });

// const ImagePreviewContainer = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   flexWrap: 'wrap',
//   gap: theme.spacing(2),
//   marginTop: theme.spacing(1),
// }));

// const PreviewCard = styled(Card)(({ theme }) => ({
//   position: 'relative',
//   width: 100,
//   height: 100,
//   borderRadius: theme.spacing(1),
//   overflow: 'hidden',
// }));

// const RemoveButton = styled(IconButton)(({ theme }) => ({
//   position: 'absolute',
//   top: 0,
//   right: 0,
//   backgroundColor: 'rgba(255, 255, 255, 0.8)',
//   padding: 2,
//   '&:hover': {
//     backgroundColor: 'rgba(255, 255, 255, 1)',
//   },
// }));

// const FileInputContainer = styled(Box)(({ theme }) => ({
//   border: `2px dashed ${theme.palette.divider}`,
//   borderRadius: theme.spacing(1),
//   padding: theme.spacing(2),
//   textAlign: 'center',
//   cursor: 'pointer',
//   '&:hover': {
//     borderColor: theme.palette.primary.main,
//     backgroundColor: theme.palette.action.hover,
//   },
// }));

// const Providers = () => {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [services, setServices] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [childCategories, setChildCategories] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [zone, setZone] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [selectedState, setSelectedState] = useState('');
//   const [selectedCity, setSelectedCity] = useState('');
//   const providerId = localStorage.getItem('providerId');

//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     phone: '',
//     altphone: '',
//     email: '',
//     bankName: '',
//     branchName: '',
//     holderName: '',
//     accountNumber: '',
//     serviceId: [],
//     categoryId: [],
//     subcategoryId: [],
//     childcategoryId: '',
//     ifsc_code: '',
//     upid: '',
//     countryId: '',
//     stateId: '',
//     cityId: '',
//     zoneId: '',
//     metaTitle: '',
//     metaDescription: '',
//     address: '',
//     gst_number: '',
//     pan_number: '',
//     aadhar_number: '',
//     business_number: '',
//     gas_bill_number: '',
//     pincode: '',
//     experiance: '',
//     dob: '',
//       documentType: '',                   // â­ NEW
//     metakeywords: '',  
//   });

//   const [files, setFiles] = useState({
//     pan_card_front: null,
//     pan_card_back: null,
//     aadhar_card_front: null,
//     aadhar_card_back: null,
//     gst_bill: null,
//     business_proof: null,
//     gas_bill: null,
//     business_images: [],
//     logo: null,
//     banner_image: null,
//     bill_sample: null,
//     image: null,
//     business_card: null,    
//   });

//   const [previews, setPreviews] = useState({
//     pan_card_front: null,
//     pan_card_back: null,
//     aadhar_card_front: null,
//     aadhar_card_back: null,
//     gst_bill: null,
//     business_proof: null,
//     gas_bill: null,
//     business_images: [],
//     logo: null,
//     banner_image: null,
//     bill_sample: null,
//     image: null,
//     business_card: null,    
//   });

//   const getToken = useCallback(() => {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user)?.token || '' : '';
//   }, []);

//   const fetchProvider = useCallback(async () => {
//     const token = getToken();
//     if (!token || !providerId) return;

//     try {
//       const res = await axios.post(
//         `${URLS.GetOneProvider}/${providerId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       const data = res.data?.provider || {};

//       const businessImages = data.business_images
//         ? Array.isArray(data.business_images)
//           ? data.business_images
//           : [data.business_images]
//         : [];

//       setForm({
//         ...data,
//         categoryId: Array.isArray(data.categoryId)
//           ? data.categoryId
//           : data.categoryId
//           ? [data.categoryId]
//           : [],
//         subcategoryId: Array.isArray(data.subcategoryId)
//           ? data.subcategoryId
//           : data.subcategoryId
//           ? [data.subcategoryId]
//           : [],
//         serviceId: Array.isArray(data.serviceId)
//           ? data.serviceId
//           : data.serviceId
//           ? [data.serviceId]
//           : [],
//            documentType: data.documentType || '',           // â­ NEW
//         metakeywords: data.metakeywords || '',  
//       });
//         if (data.documentType) {
//         setDocumentType(data.documentType);
//       }

//       // Set previews for existing files
//       const previewData = {
//         pan_card_front: data.pan_card_front ? `${URLS.FileBase}${data.pan_card_front}` : null,
//         pan_card_back: data.pan_card_back ? `${URLS.FileBase}${data.pan_card_back}` : null,
//         aadhar_card_front: data.aadhar_card_front ? `${URLS.FileBase}${data.aadhar_card_front}` : null,
//         aadhar_card_back: data.aadhar_card_back ? `${URLS.FileBase}${data.aadhar_card_back}` : null,
//         gst_bill: data.gst_bill ? `${URLS.FileBase}${data.gst_bill}` : null,
//         business_proof: data.business_proof ? `${URLS.FileBase}${data.business_proof}` : null,
//         gas_bill: data.gas_bill ? `${URLS.FileBase}${data.gas_bill}` : null,
//         business_images: businessImages.map((img) => `${URLS.FileBase}${img}`),
//         logo: data.logo ? `${URLS.FileBase}${data.logo}` : null,
//         banner_image: data.banner_image ? `${URLS.FileBase}${data.banner_image}` : null,
//         bill_sample: data.bill_sample ? `${URLS.FileBase}${data.bill_sample}` : null,
//         image: data.image ? `${URLS.FileBase}${data.image}` : null,
//       };

//       setPreviews(previewData);

//       if (data.metakeywords) {
//         setTags(data.metakeywords.split(','));
//       }

//       if (data.countryId) {
//         setSelectedCountry(data.countryId);
//         setForm((prev) => ({ ...prev, countryId: data.countryId }));
//       }
//       if (data.stateId) {
//         setSelectedState(data.stateId);
//         setForm((prev) => ({ ...prev, stateId: data.stateId }));
//       }
//       if (data.cityId) {
//         setSelectedCity(data.cityId);
//         setForm((prev) => ({ ...prev, cityId: data.cityId }));
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to fetch Provider data.');
//     }
//   }, [getToken, providerId]);

//   useEffect(() => {
//     fetchProvider();
//   }, [fetchProvider]);

//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       toast.error('Please log in to continue.');
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const [childCategoryRes] = await Promise.all([
//           axios.post(
//             URLS.GetOnDemandChildCategory,
//             {},
//             { headers: { Authorization: `Bearer ${token}` } },
//           ),
//         ]);

//         setChildCategories(childCategoryRes.data.ondemandcategorys || []);
//       } catch (error) {
//         toast.error(error.response?.data?.message || 'Failed to fetch data.');
//       }
//     };

//     fetchData();
//   }, [getToken]);

//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       toast.error('Please log in to continue.');
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const [ServiceRes] = await Promise.all([
//           axios.post(URLS.GetOnDemandSevice, {}, { headers: { Authorization: `Bearer ${token}` } }),
//         ]);

//         setServices(ServiceRes.data.ondemandservices || []);
//       } catch (error) {
//         toast.error(error.response?.data?.message || 'Failed to fetch data.');
//       }
//     };

//     fetchData();
//   }, [getToken]);

//   useEffect(() => {
//     const token = getToken();
//     if (token) {
//       categoryRes(token);
//     }
//   }, [getToken]);

//   const categoryRes = (token) => {
//     axios
//       .post(URLS.GetDemandCategory, {}, { headers: { Authorization: `Bearer ${token}` } })
//       .then((res) => setCategories(res.data.ondemandcategorys || []))
//       .catch(() => toast.error('Failed to fetch ondemandcategorys'));
//   };

//   useEffect(() => {
//     const token = getToken();
//     if (form.categoryId.length > 0 && token) {
//       subcategoryRes(form.categoryId, token);
//     } else {
//       setSubcategories([]);
//       setForm((prev) => ({ ...prev, subcategoryId: [] }));
//     }
//   }, [form.categoryId, getToken]);

//   const subcategoryRes = (categoryIds, token) => {
//     axios
//       .post(
//         URLS.GetOnDemandSubCategorybyCategoryMulti,
//         { categoryId: categoryIds },
//         { headers: { Authorization: `Bearer ${token}` } },
//       )
//       .then((res) => setSubcategories(res.data.subcategories || []))
//       .catch(() => toast.error('Failed to fetch subcategories'));
//   };

//   useEffect(() => {
//     const token = getToken();
//     if (token) {
//       getCountries(token);
//     }
//   }, [getToken]);

//   const getCountries = (token) => {
//     axios
//       .post(URLS.GetCountry, {}, { headers: { Authorization: `Bearer ${token}` } })
//       .then((res) => setCountries(res.data.country || []))
//       .catch(() => toast.error('Failed to fetch countries'));
//   };

//   useEffect(() => {
//     const token = getToken();
//     if (selectedCountry && token) {
//       getStates(selectedCountry, token);
//     }
//   }, [selectedCountry, getToken]);

//   const getStates = (countryId, token) => {
//     axios
//       .post(
//         URLS.GetCountryByState,
//         { country_id: countryId },
//         { headers: { Authorization: `Bearer ${token}` } },
//       )
//       .then((res) => setStates(res.data.states || []))
//       .catch(() => toast.error('Failed to fetch states'));
//   };

//   useEffect(() => {
//     const token = getToken();
//     if (selectedState && token) {
//       getCities(selectedState, token);
//     }
//   }, [selectedState, getToken]);

//   const getCities = (stateId, token) => {
//     axios
//       .post(
//         URLS.GetStateByCitys,
//         { state_id: stateId },
//         { headers: { Authorization: `Bearer ${token}` } },
//       )
//       .then((res) => setCities(res.data.cities || []))
//       .catch(() => toast.error('Failed to fetch cities'));
//   };

//   useEffect(() => {
//     const token = getToken();
//     if (selectedCity && token) {
//       getZones(selectedCity, token);
//     }
//   }, [selectedCity, getToken]);

//   const getZones = (cityId, token) => {
//     axios
//       .post(
//         URLS.GetCityOneByZone,
//         { cityId: cityId },
//         { headers: { Authorization: `Bearer ${token}` } },
//       )
//       .then((res) => setZone(res.data.zones || []))
//       .catch(() => toast.error('Failed to fetch zones'));
//   };

//   const [tags, setTags] = useState([]);
//   const [inputValue, setInputValue] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleMultiSelectChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e, fieldName) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       const ext = selectedFile.name.split('.').pop().toLowerCase();
//       if (['jpg', 'jpeg', 'png', 'pdf', 'PDF'].includes(ext)) {
//         setFiles((prev) => ({ ...prev, [fieldName]: selectedFile }));

//         if (fieldName !== 'business_images') {
//           // Create preview for non-business images
//           const previewUrl = URL.createObjectURL(selectedFile);
//           setPreviews((prev) => ({ ...prev, [fieldName]: previewUrl }));
//         }
//       } else {
//         e.target.value = null;
//         toast.error('Please choose JPG, JPEG, PDF, or PNG.');
//       }
//     }
//   };

//   const handleRemoveFile = (fieldName) => {
//     setFiles((prev) => ({ ...prev, [fieldName]: null }));
//     setPreviews((prev) => ({ ...prev, [fieldName]: null }));

//     // Also clear the file input
//     const fileInput = document.getElementById(fieldName);
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   };

//   const handleBusinessImagesChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     const currentFiles = files.business_images || [];

//     if (currentFiles.length + selectedFiles.length > 5) {
//       toast.error('You can upload a maximum of 5 business images.');
//       e.target.value = null;
//       return;
//     }

//     // Validate file types
//     const validFiles = selectedFiles.filter((file) => {
//       const ext = file.name.split('.').pop().toLowerCase();
//       return ['jpg', 'jpeg', 'png'].includes(ext);
//     });

//     if (validFiles.length !== selectedFiles.length) {
//       toast.error('Please choose only JPG, JPEG, or PNG files.');
//       e.target.value = null;
//       return;
//     }

//     const newFiles = [...currentFiles, ...validFiles];
//     setFiles((prev) => ({ ...prev, business_images: newFiles }));

//     // Create previews for all selected files
//     const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
//     setPreviews((prev) => ({
//       ...prev,
//       business_images: [...prev.business_images, ...newPreviews],
//     }));
//   };

//   const removeBusinessImage = (index) => {
//     const newFiles = [...files.business_images];
//     const newPreviews = [...previews.business_images];

//     newFiles.splice(index, 1);
//     newPreviews.splice(index, 1);

//     setFiles((prev) => ({ ...prev, business_images: newFiles }));
//     setPreviews((prev) => ({ ...prev, business_images: newPreviews }));
//   };

//   const removeTag = (indexToRemove) => {
//     setTags(tags.filter((_, index) => index !== indexToRemove));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const token = getToken();

//     if (!token) {
//       toast.error('Authentication token missing. Please log in.');
//       return;
//     }

//     const formData = new FormData();

//     // // Append all form fields
//     // Object.keys(form).forEach((key) => {
//     //   if (Array.isArray(form[key])) {
//     //     form[key].forEach((value) => {
//     //       formData.append(key, value);
//     //     });
//     //   }
//     // });

//     formData.append('firstName', form.firstName);
//     formData.append('lastName', form.lastName);
//     formData.append('phone', form.phone);
//     formData.append('altphone', form.altphone);
//     formData.append('email', form.email);
//     formData.append('bankName', form.bankName);
//     formData.append('branchName', form.branchName);
//     formData.append('holderName', form.holderName);
//     formData.append('accountNumber', form.accountNumber);
//     formData.append('serviceId', JSON.stringify(form.serviceId));
//     formData.append('categoryId', JSON.stringify(form.categoryId));
//     formData.append('subcategoryId', JSON.stringify(form.subcategoryId));
//     formData.append('childcategoryId', form.childcategoryId);
//     formData.append('ifsc_code', form.ifsc_code);
//     formData.append('upid', form.upid);
//     formData.append('countryId', form.countryId);
//     formData.append('stateId', form.stateId);
//     formData.append('cityId', form.cityId);
//     formData.append('zoneId', form.zoneId);
//     formData.append('metaTitle', form.metaTitle);
//     formData.append('metaDescription', form.metaDescription);
//     formData.append('address', form.address);
//     formData.append('gst_number', form.gst_number);
//     formData.append('pan_number', form.pan_number);
//     formData.append('aadhar_number', form.aadhar_number);
//     formData.append('business_number', form.business_number);
//     formData.append('gas_bill_number', form.gas_bill_number);
//     formData.append('pincode', form.pincode);
//     formData.append('experiance', form.experiance);
//     formData.append('dob', form.dob);
//       formData.append('documentType', form.documentType || '');   

//         if (tags.length > 0) {
//       formData.append('metakeywords', tags.join(','));
//     } else {
//       formData.append('metakeywords', '');
//     }
//     // Append files
//     Object.entries(files).forEach(([key, file]) => {
//       if (key === 'business_images') {
//         if (Array.isArray(file) && file.length > 0) {
//           file.forEach((businessImg) => {
//             formData.append(`business_images`, businessImg);
//           });
//         }
//       } else if (file) {
//         formData.append(key, file);
//       }
//     });

//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       };

//       const res = await axios.put(`${URLS.UpdateProvider}/${providerId}`, formData, config);

//       if (res.status === 200) {
//         toast.success(res.data.message);
//         navigate('/providers');
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || 'An error occurred';
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Custom file input component for better UX
//   const FileInput = ({ id, label, accept, onChange, multiple = false, required = false }) => (
//     <Box>
//       <CustomFormLabel htmlFor={id} required={required}>
//         {label}
//       </CustomFormLabel>
//       <FileInputContainer>
//         <input
//           accept={accept}
//           style={{ display: 'none' }}
//           id={id}
//           multiple={multiple}
//           type="file"
//           onChange={onChange}
//         />
//         <label htmlFor={id}>
//           <Button variant="outlined" component="span" startIcon={<IconPlus size={18} />}>
//             Choose File
//           </Button>
//         </label>
//         <Typography variant="caption" display="block" sx={{ mt: 1 }}>
//           {multiple ? 'You can select multiple files' : 'Select a file to upload'}
//         </Typography>
//       </FileInputContainer>
//     </Box>
//   );

//   // Preview component for single images
//   const ImagePreview = ({ src, onRemove, alt = 'Preview', fileName }) => {
//   const isPdf = src?.toLowerCase().endsWith('.pdf');

//   return (
//     <PreviewCard>
//       {isPdf ? (
//         <div style={{ display: 'flex', alignItems: 'center', padding: 8 }}>
//           <IconFileText size={32} style={{ marginRight: 8 , color:"red"}}  />
//           <Typography variant="body2" noWrap>
//             {fileName || 'PDF'}
//           </Typography>
//         </div>
//       ) : (
//         <CardMedia
//           component="img"
//           height="100"
//           image={src}
//           alt={alt}
//           sx={{ objectFit: 'cover' }}
//         />
//       )}
//       <RemoveButton size="small" onClick={onRemove}>
//         <IconX size={16} />
//       </RemoveButton>
//     </PreviewCard>
//   );
// };

//   return (
//     <PageContainer
//       title="Service Provider Page"
//       description="Manage Service Provider for your e-commerce platform"
//     >
//       <Breadcrumb title="Service Provider Management" items={BCrumb} />
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
//       <Box>
//         <form onSubmit={handleSubmit}>
//           <ParentCard title="Basic Information">
//             <Grid container spacing={2} sx={{ p: 2 }}>
//               <Grid item xs={12} sm={6}>
//                 <CustomFormLabel htmlFor="firstName" required>
//                   First Name
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="firstName"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter First Name"
//                   name="firstName"
//                   value={form.firstName}
//                   required
//                   onChange={handleChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <CustomFormLabel htmlFor="lastName" required>
//                   Last Name
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="lastName"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Last Name"
//                   name="lastName"
//                   value={form.lastName}
//                   required
//                   onChange={handleChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <CustomFormLabel htmlFor="dob" required>
//                   Date of birth
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="dob"
//                   type="date"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Dob"
//                   name="dob"
//                   value={form.dob}
//                   required
//                   onChange={handleChange}
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <CustomFormLabel htmlFor="experiance" required>
//                   Experience
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="experiance"
//                   type="number"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Experience"
//                   name="experiance"
//                   value={form.experiance}
//                   required
//                   onChange={handleChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <CustomFormLabel htmlFor="phone" required>
//                   Phone Number
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="phone"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Phone Number"
//                   name="phone"
//                   value={form.phone}
//                   required
//                   onChange={handleChange}
//                   onKeyPress={(e) => {
//                     if (!/[0-9]/.test(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   inputProps={{
//                     maxLength: 10,
//                     minLength: 10,
//                     pattern: '[0-9]{10}',
//                     inputMode: 'numeric',
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <CustomFormLabel htmlFor="altphone">Alternate Phone Number</CustomFormLabel>
//                 <CustomTextField
//                   id="altphone"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Alternate Phone Number"
//                   name="altphone"
//                   value={form.altphone}
//                   onChange={handleChange}
//                   onKeyPress={(e) => {
//                     if (!/[0-9]/.test(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   inputProps={{
//                     maxLength: 10,
//                     minLength: 10,
//                     pattern: '[0-9]{10}',
//                     inputMode: 'numeric',
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <CustomFormLabel htmlFor="categoryId" required>
//                   Category
//                 </CustomFormLabel>
//                 <FormControl fullWidth>
//                   <CustomSelect
//                     id="categoryId"
//                     name="categoryId"
//                     multiple
//                     value={form.categoryId}
//                     onChange={handleMultiSelectChange}
//                     required
//                     renderValue={(selected) => (
//                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                         {selected.map((value) => {
//                           const category = categories.find((cat) => cat._id === value);
//                           return category ? <Chip key={value} label={category.name} /> : null;
//                         })}
//                       </Box>
//                     )}
//                   >
//                     {categories.map((cat) => (
//                       <MenuItem key={cat._id} value={cat._id}>
//                         <Checkbox checked={form.categoryId.indexOf(cat._id) > -1} />
//                         {cat.name}
//                       </MenuItem>
//                     ))}
//                   </CustomSelect>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <CustomFormLabel htmlFor="subcategoryId" required>
//                   Subcategory
//                 </CustomFormLabel>
//                 <FormControl fullWidth>
//                   <CustomSelect
//                     id="subcategoryId"
//                     name="subcategoryId"
//                     multiple
//                     value={form.subcategoryId}
//                     onChange={handleMultiSelectChange}
//                     required
//                     disabled={form.categoryId.length === 0}
//                     renderValue={(selected) => (
//                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                         {selected.map((value) => {
//                           const subcategory = subcategories.find((sub) => sub._id === value);
//                           return subcategory ? <Chip key={value} label={subcategory.name} /> : null;
//                         })}
//                       </Box>
//                     )}
//                   >
//                     {subcategories.map((sub) => (
//                       <MenuItem key={sub._id} value={sub._id}>
//                         <Checkbox checked={form.subcategoryId.indexOf(sub._id) > -1} />
//                         {sub.name}
//                       </MenuItem>
//                     ))}
//                   </CustomSelect>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <CustomFormLabel htmlFor="childcategoryId" required>
//                   Child Category
//                 </CustomFormLabel>
//                 <FormControl fullWidth>
//                   <CustomSelect
//                     id="childcategoryId"
//                     name="childcategoryId"
//                     value={form.childcategoryId}
//                     onChange={handleChange}
//                     required
//                   >
//                     <MenuItem value="" disabled>
//                       Select Child Category
//                     </MenuItem>
//                     {childCategories.map((child) => (
//                       <MenuItem key={child._id} value={child._id}>
//                         {child.name}
//                       </MenuItem>
//                     ))}
//                   </CustomSelect>
//                 </FormControl>
//               </Grid>
//               {form.childcategoryId == '683dbbfbb62d2a241de0f7e3' ? (
//                 <>
//                   <Grid item xs={12} md={6}>
//                     <CustomFormLabel htmlFor="serviceId" required>
//                       Service
//                     </CustomFormLabel>
//                     <FormControl fullWidth>
//                       <CustomSelect
//                         id="serviceId"
//                         name="serviceId"
//                         multiple
//                         value={form.serviceId}
//                         onChange={handleMultiSelectChange}
//                         required
//                         renderValue={(selected) => (
//                           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                             {selected.map((value) => {
//                               const service = services.find((sub) => sub._id === value);
//                               return service ? <Chip key={value} label={service.name} /> : null;
//                             })}
//                           </Box>
//                         )}
//                       >
//                         {services.map((sub) => (
//                           <MenuItem key={sub._id} value={sub._id}>
//                             <Checkbox checked={form.serviceId.indexOf(sub._id) > -1} />
//                             {sub.name}
//                           </MenuItem>
//                         ))}
//                       </CustomSelect>
//                     </FormControl>
//                   </Grid>
//                 </>
//               ) : (
//                 <></>
//               )}
//               <Grid item xs={12} sm={6}>
//                 <FileInput
//                   id="image"
//                   label="Profile Image"
//                   accept="image/jpeg,image/png"
//                   onChange={(e) => handleFileChange(e, 'image')}
//                   required
//                 />
//                 {previews.image && (
//                   <Box mt={2}>
//                     <ImagePreview
//                       src={previews.image}
//                       onRemove={() => handleRemoveFile('image')}
//                       alt="Profile Preview"
//                     />
//                   </Box>
//                 )}
//               </Grid>
//             </Grid>
//           </ParentCard>

//           <ParentCard title="Identity Documents">
//             <Grid container spacing={2} sx={{ p: 2 }}>
//               {form.childcategoryId == '683dbc04b62d2a241de0f7e8' ? (
//                 <>
//                   <Grid item xs={12} sm={6}>
//                     <FileInput
//                       id="logo"
//                       label="Logo"
//                       accept="image/jpeg,image/png"
//                       onChange={(e) => handleFileChange(e, 'logo')}
//                       required
//                     />
//                     {previews.logo && (
//                       <Box mt={2}>
//                         <ImagePreview
//                           src={previews.logo}
//                           onRemove={() => handleRemoveFile('logo')}
//                           alt="Logo Preview"
//                         />
//                       </Box>
//                     )}
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <FileInput
//                       id="banner_image"
//                       label="Banner Image"
//                       accept="image/jpeg,image/png"
//                       onChange={(e) => handleFileChange(e, 'banner_image')}
//                       required
//                     />
//                     {previews.banner_image && (
//                       <Box mt={2}>
//                         <ImagePreview
//                           src={previews.banner_image}
//                           onRemove={() => handleRemoveFile('banner_image')}
//                           alt="Banner Preview"
//                         />
//                       </Box>
//                     )}
//                   </Grid>
//                 </>
//               ) : (
//                 <></>
//               )}
//               <Grid item xs={12} sm={4}>
//                 <CustomFormLabel htmlFor="pan_number">
//                   PAN Number / Driving License Number
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="pan_number"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter PAN Number or Driving License Number"
//                   name="pan_number"
//                   value={form.pan_number}
//                   onChange={handleChange}
//                   inputProps={{ maxLength: 20 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <FileInput
//                   id="pan_card_front"
//                   label="PAN Card / Driving Licence Front"
//                   accept="image/jpeg,image/png,application/pdf"
//                   onChange={(e) => handleFileChange(e, 'pan_card_front')}
//                   required
//                 />
//                 {previews.pan_card_front && (
//                   <Box mt={2}>
//                     <ImagePreview
//                       src={previews.pan_card_front}
//                       onRemove={() => handleRemoveFile('pan_card_front')}
//                       alt="PAN Front Preview"
//                     />
//                   </Box>
//                 )}
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <FileInput
//                   id="pan_card_back"
//                   label="PAN Card / Driving Licence Back"
//                   accept="image/jpeg,image/png,application/pdf"
//                   onChange={(e) => handleFileChange(e, 'pan_card_back')}
//                   required
//                 />
//                 {previews.pan_card_back && (
//                   <Box mt={2}>
//                     <ImagePreview
//                       src={previews.pan_card_back}
//                       onRemove={() => handleRemoveFile('pan_card_back')}
//                       alt="PAN Back Preview"
//                     />
//                   </Box>
//                 )}
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <CustomFormLabel htmlFor="aadhar_number">Aadhaar Number</CustomFormLabel>
//                 <CustomTextField
//                   id="aadhar_number"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Aadhaar Number"
//                   name="aadhar_number"
//                   value={form.aadhar_number}
//                   onChange={handleChange}
//                   onKeyPress={(e) => {
//                     if (!/[0-9]/.test(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   inputProps={{
//                     maxLength: 12,
//                     pattern: '[0-9]{12}',
//                     inputMode: 'numeric',
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <FileInput
//                   id="aadhar_card_front"
//                   label="Aadhar Card Image Front"
//                   accept="image/jpeg,image/png,application/pdf"
//                   onChange={(e) => handleFileChange(e, 'aadhar_card_front')}
//                   required
//                 />
//                 {previews.aadhar_card_front && (
//                   <Box mt={2}>
//                     <ImagePreview
//                       src={previews.aadhar_card_front}
//                       onRemove={() => handleRemoveFile('aadhar_card_front')}
//                       alt="Aadhar Front Preview"
//                     />
//                   </Box>
//                 )}
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <FileInput
//                   id="aadhar_card_back"
//                   label="Aadhar Card Image Back"
//                   accept="image/jpeg,image/png,application/pdf"
//                   onChange={(e) => handleFileChange(e, 'aadhar_card_back')}
//                   required
//                 />
//                 {previews.aadhar_card_back && (
//                   <Box mt={2}>
//                     <ImagePreview
//                       src={previews.aadhar_card_back}
//                       onRemove={() => handleRemoveFile('aadhar_card_back')}
//                       alt="Aadhar Back Preview"
//                     />
//                   </Box>
//                 )}
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <CustomFormLabel htmlFor="gas_bill_number">
//                   Gas Bill Number / Passport Number
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="gas_bill_number"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Gas Bill Number or Passport Number"
//                   name="gas_bill_number"
//                   value={form.gas_bill_number}
//                   onChange={handleChange}
//                   inputProps={{ maxLength: 30 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FileInput
//                   id="gas_bill"
//                   label="Gas Bill / Passport"
//                   accept="image/jpeg,image/png"
//                   onChange={(e) => handleFileChange(e, 'gas_bill')}
//                   required
//                 />
//                 {previews.gas_bill && (
//                   <Box mt={2}>
//                     <ImagePreview
//                       src={previews.gas_bill}
//                       onRemove={() => handleRemoveFile('gas_bill')}
//                       alt="Gas Bill Preview"
//                     />
//                   </Box>
//                 )}
//               </Grid>
//               {form.childcategoryId == '683dbc04b62d2a241de0f7e8' ? (
//                 <>
//                   <Grid item xs={12} sm={6}>
//                     <CustomFormLabel htmlFor="business_number">
//                       Business Id Proof / Labour Licence Number
//                     </CustomFormLabel>
//                     <CustomTextField
//                       id="business_number"
//                       variant="outlined"
//                       fullWidth
//                       placeholder="Enter Business Id Proof / Labour Licence Number"
//                       name="business_number"
//                       value={form.business_number}
//                       onChange={handleChange}
//                       inputProps={{ maxLength: 30 }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <FileInput
//                       id="business_proof"
//                       label="Business Id Proof / Labour Licence"
//                       accept="image/jpeg,image/png,application/pdf"
//                       onChange={(e) => handleFileChange(e, 'business_proof')}
//                       required
//                     />
//                     {previews.business_proof && (
//                       <Box mt={2}>
//                         <ImagePreview
//                           src={previews.business_proof}
//                           onRemove={() => handleRemoveFile('business_proof')}
//                           alt="Business Proof Preview"
//                         />
//                       </Box>
//                     )}
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <CustomFormLabel htmlFor="gst_number">Gst Number</CustomFormLabel>
//                     <CustomTextField
//                       id="gst_number"
//                       variant="outlined"
//                       fullWidth
//                       placeholder="Enter Gst Number"
//                       name="gst_number"
//                       value={form.gst_number}
//                       onChange={handleChange}
//                       inputProps={{ maxLength: 30 }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <FileInput
//                       id="gst_bill"
//                       label="Gst Proof"
//                       accept="image/jpeg,image/png,application/pdf"
//                       onChange={(e) => handleFileChange(e, 'gst_bill')}
//                       required
//                     />
//                     {previews.gst_bill && (
//                       <Box mt={2}>
//                         <ImagePreview
//                           src={previews.gst_bill}
//                           onRemove={() => handleRemoveFile('gst_bill')}
//                           alt="GST Bill Preview"
//                         />
//                       </Box>
//                     )}
//                   </Grid>
//                 </>
//               ) : (
//                 <></>
//               )}
//               <Grid item xs={12} sm={6}>
//                 <FileInput
//                   id="bill_sample"
//                   label="Customer Bill Copy (Sample)"
//                   accept="image/jpeg,image/png"
//                   onChange={(e) => handleFileChange(e, 'bill_sample')}
//                   required
//                 />
//                 {previews.bill_sample && (
//                   <Box mt={2}>
//                     <ImagePreview
//                       src={previews.bill_sample}
//                       onRemove={() => handleRemoveFile('bill_sample')}
//                       alt="Bill Sample Preview"
//                     />
//                   </Box>
//                 )}
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FileInput
//                   id="business_images"
//                   label="Business Images (Max 5)"
//                   accept="image/jpeg,image/png"
//                   onChange={handleBusinessImagesChange}
//                   multiple
//                   required
//                 />
//                 <FormHelperText>
//                   You can upload up to 5 business images (JPG, JPEG, PNG only)
//                 </FormHelperText>
//                 {previews.business_images &&
//                   Array.isArray(previews.business_images) &&
//                   previews.business_images.length > 0 && (
//                     <Box mt={2}>
//                       <Typography variant="caption">
//                         Preview ({previews.business_images.length} images):
//                       </Typography>
//                       <ImagePreviewContainer>
//                         {previews.business_images.map((preview, index) => (
//                           <PreviewCard key={index}>
//                             <CardMedia
//                               component="img"
//                               height="100"
//                               image={preview}
//                               alt={`Business image ${index + 1}`}
//                               sx={{ objectFit: 'cover' }}
//                             />
//                             <RemoveButton size="small" onClick={() => removeBusinessImage(index)}>
//                               <IconX size={16} />
//                             </RemoveButton>
//                           </PreviewCard>
//                         ))}
//                       </ImagePreviewContainer>
//                     </Box>
//                   )}
//               </Grid>
//             </Grid>
//           </ParentCard>

//           <ParentCard title="Address Information">
//             <Grid container spacing={2} sx={{ p: 2 }}>
//               <Grid item xs={12} md={3}>
//                 <CustomFormLabel htmlFor="countryId">Country</CustomFormLabel>
//                 <FormControl fullWidth>
//                   <CustomSelect
//                     id="countryId"
//                     name="countryId"
//                     value={form.countryId}
//                     onChange={(e) => {
//                       const countryId = e.target.value;
//                       setSelectedCountry(countryId);
//                       setForm({ ...form, countryId, stateId: '', cityId: '' });
//                     }}
//                     required
//                   >
//                     <MenuItem value="" disabled>
//                       Select Country
//                     </MenuItem>
//                     {countries.map((country) => (
//                       <MenuItem key={country._id} value={country._id}>
//                         {country.name}
//                       </MenuItem>
//                     ))}
//                   </CustomSelect>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <CustomFormLabel htmlFor="stateId">State</CustomFormLabel>
//                 <FormControl fullWidth>
//                   <CustomSelect
//                     id="stateId"
//                     name="stateId"
//                     value={form.stateId}
//                     onChange={(e) => {
//                       const stateId = e.target.value;
//                       setSelectedState(stateId);
//                       setForm({ ...form, stateId, cityId: '' });
//                     }}
//                     required
//                     disabled={!form.countryId}
//                   >
//                     <MenuItem value="" disabled>
//                       Select State
//                     </MenuItem>
//                     {states.map((state) => (
//                       <MenuItem key={state._id} value={state._id}>
//                         {state.name}
//                       </MenuItem>
//                     ))}
//                   </CustomSelect>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <CustomFormLabel htmlFor="cityId">City</CustomFormLabel>
//                 <CustomSelect
//                   id="cityId"
//                   name="cityId"
//                   value={form.cityId}
//                   onChange={(e) => {
//                     const cityId = e.target.value;
//                     setSelectedCity(cityId);
//                     setForm({ ...form, cityId, zoneId: '' });
//                   }}
//                   fullWidth
//                   required
//                   disabled={!form.stateId}
//                 >
//                   <MenuItem value="" disabled>
//                     Select City
//                   </MenuItem>
//                   {cities.map((city) => (
//                     <MenuItem key={city._id} value={city._id}>
//                       {city.name}
//                     </MenuItem>
//                   ))}
//                 </CustomSelect>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <CustomFormLabel htmlFor="cityId">Zone</CustomFormLabel>
//                 <CustomSelect
//                   id="zoneId"
//                   name="zoneId"
//                   value={form.zoneId}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   disabled={!form.cityId}
//                 >
//                   <MenuItem value="" disabled>
//                     Select Zone
//                   </MenuItem>
//                   {zone.map((zone) => (
//                     <MenuItem key={zone._id} value={zone._id}>
//                       {zone.name}
//                     </MenuItem>
//                   ))}
//                 </CustomSelect>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <CustomFormLabel htmlFor="pincode" required>
//                   Pincode
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="pincode"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Pincode"
//                   name="pincode"
//                   value={form.pincode}
//                   required
//                   onChange={handleChange}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <CustomFormLabel htmlFor="address">
//                   Address <span style={{ color: 'red' }}>*</span>
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="address"
//                   name="address"
//                   inputProps={{ maxLength: 200 }}
//                   value={form.address}
//                   onChange={handleChange}
//                   placeholder="Enter Address"
//                   multiline
//                   rows={2}
//                   fullWidth
//                 />
//               </Grid>
//             </Grid>
//           </ParentCard>
//           <ParentCard title="Account Credentials">
//             <Grid container spacing={2} sx={{ p: 2 }}>
//               <Grid item xs={12} sm={12}>
//                 <CustomFormLabel htmlFor="email" required>
//                   Email
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="email"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Email"
//                   name="email"
//                   type="email"
//                   value={form.email}
//                   required
//                   onChange={handleChange}
//                 />
//               </Grid>
//             </Grid>
//           </ParentCard>
//           <ParentCard title="Banking Details">
//             <Grid container spacing={2} sx={{ p: 2 }}>
//               <Grid item xs={12} sm={4}>
//                 <CustomFormLabel htmlFor="bankName" required>
//                   Bank Name
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="bankName"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Bank Name"
//                   name="bankName"
//                   value={form.bankName}
//                   required
//                   onChange={handleChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <CustomFormLabel htmlFor="branchName" required>
//                   Branch Name
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="branchName"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Branch Name"
//                   name="branchName"
//                   value={form.branchName}
//                   required
//                   onChange={handleChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <CustomFormLabel htmlFor="holderName" required>
//                   Account Holder Name
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="holderName"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Holder Name"
//                   name="holderName"
//                   value={form.holderName}
//                   required
//                   onChange={handleChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <CustomFormLabel htmlFor="accountNumber" required>
//                   Account Number
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="accountNumber"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Account Number"
//                   name="accountNumber"
//                   type="number"
//                   value={form.accountNumber}
//                   required
//                   onChange={handleChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <CustomFormLabel htmlFor="ifsc_code" required>
//                   IFSC Code
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="ifsc_code"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter IFSC Code"
//                   name="ifsc_code"
//                   value={form.ifsc_code}
//                   required
//                   onChange={handleChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <CustomFormLabel htmlFor="upid" required>
//                   UPI ID
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="upid"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter UPI ID"
//                   name="upid"
//                   value={form.upid}
//                   required
//                   onChange={handleChange}
//                 />
//               </Grid>
//             </Grid>
//           </ParentCard>
//           <ParentCard title="SEO Settings">
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <CustomFormLabel htmlFor="metaTitle" required>
//                   Meta Title
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="metaTitle"
//                   name="metaTitle"
//                   inputProps={{ maxLength: 90 }}
//                   value={form.metaTitle}
//                   onChange={handleChange}
//                   placeholder="Optimized title for search engines (max 90 chars)"
//                   fullWidth
//                 />
//                 <FormHelperText>{form.metaTitle?.length || 0}/90 characters</FormHelperText>
//               </Grid>
//               <Grid item xs={12} sm={12}>
//                 <CustomFormLabel htmlFor="metakeywords" required>
//                   Meta Keywords
//                 </CustomFormLabel>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     gap: 1,
//                     alignItems: 'center',
//                     border: '1px solid',
//                     borderColor: 'divider',
//                     borderRadius: 1,
//                     p: 1,
//                     '&:hover': {
//                       borderColor: 'text.primary',
//                     },
//                     '&:focus-within': {
//                       borderColor: 'primary.main',
//                       borderWidth: 2,
//                     },
//                   }}
//                 >
//                   {tags.map((tag, index) => (
//                     <Chip
//                       key={index}
//                       label={tag}
//                       onDelete={() => removeTag(index)}
//                       sx={{ mr: 0.5 }}
//                     />
//                   ))}
//                   <CustomTextField
//                     variant="standard"
//                     value={inputValue}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       if (value.includes(',')) {
//                         const newTags = value
//                           .split(',')
//                           .map((tag) => tag.trim())
//                           .filter((tag) => tag !== '');

//                         if (newTags.length > 0) {
//                           setTags([...tags, ...newTags]);
//                           setInputValue('');
//                         }
//                       } else {
//                         setInputValue(value);
//                       }
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') {
//                         e.preventDefault();
//                         if (inputValue.trim() !== '') {
//                           setTags([...tags, inputValue.trim()]);
//                           setInputValue('');
//                         }
//                       }
//                     }}
//                     onPaste={(e) => {
//                       setTimeout(() => {
//                         const pastedText = e.clipboardData.getData('text');
//                         if (pastedText.includes(',')) {
//                           e.preventDefault();
//                           const newTags = pastedText
//                             .split(',')
//                             .map((tag) => tag.trim())
//                             .filter((tag) => tag !== '');

//                           if (newTags.length > 0) {
//                             setTags([...tags, ...newTags]);
//                             setInputValue('');
//                           }
//                         }
//                       }, 0);
//                     }}
//                     placeholder="Type keywords separated by commas or press Enter"
//                     InputProps={{
//                       disableUnderline: true,
//                       style: { minWidth: '150px' },
//                     }}
//                     sx={{ flexGrow: 1 }}
//                   />
//                 </Box>
//                 <FormHelperText>
//                   Type comma to separate or press Enter to add keywords
//                 </FormHelperText>
//               </Grid>
//               <Grid item xs={12}>
//                 <CustomFormLabel htmlFor="metaDescription">Meta Description</CustomFormLabel>
//                 <CustomTextField
//                   id="metaDescription"
//                   name="metaDescription"
//                   inputProps={{ maxLength: 250 }}
//                   value={form.metaDescription}
//                   onChange={handleChange}
//                   placeholder="Meta description for search results (max 250 chars)"
//                   multiline
//                   rows={4}
//                   fullWidth
//                 />
//                 <FormHelperText>{form.metaDescription?.length || 0}/250 characters</FormHelperText>
//               </Grid>
//             </Grid>
//           </ParentCard>
//           <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
//             <LoadingButton
//               color="primary"
//               variant="contained"
//               type="submit"
//               loading={loading}
//               sx={{ minWidth: 120 }}
//               onClick={handleSubmit}
//             >
//               Submit
//             </LoadingButton>
//           </Box>
//         </form>
//       </Box>
//       <ToastContainer position="top-right" autoClose={3000} />
//     </PageContainer>
//   );
// };

// export default Providers;
import React, { useState, useEffect, useCallback } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import { IconArrowBackUp, IconX, IconPlus, IconFileText, IconUpload } from '@tabler/icons-react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import { ToastContainer, toast } from 'react-toastify';
import {
  Button,
  styled,
  Chip,
  IconButton,
  Card,
  CardMedia,
  Box,
  Typography,
  Grid,
  FormHelperText,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  TextField,
  CircularProgress,
} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { URLS } from '../../Url';
import axios from 'axios';
import { LoadScript, Autocomplete, GoogleMap, Marker, Circle } from '@react-google-maps/api';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Service Providers' },
  { title: 'Edit Provider' },
];

const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const PreviewCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  width: 80,
  height: 80,
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '2px',
  minWidth: 'auto',
  width: 24,
  height: 24,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
}));

const CompactFileInputContainer = styled(Box)(({ theme }) => ({
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(0.75),
  padding: theme.spacing(1),
  textAlign: 'center',
  cursor: 'pointer',
  minHeight: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const GOOGLE_MAPS_LIBRARIES = ['places'];

const EditProvider = () => {
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const providerId = localStorage.getItem('providerId');

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zone, setZone] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [radiusKm, setRadiusKm] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    altphone: '',
    email: '',
    password: '',
    bankName: '',
    branchName: '',
    holderName: '',
    accountNumber: '',
    serviceId: [],
    categoryId: [],
    subcategoryId: [],
    childcategoryId: '',
    business_name: '',
    passportnumber: '',
    passport_number: '',
    ifsc_code: '',
    upid: '',
    countryId: '',
    stateId: '',
    cityId: '',
    zoneId: '',
    metaTitle: '',
    metaDescription: '',
    address: '',
    latitude: '',
    longitude: '',
    gst_number: '',
    pan_number: '',
    aadhar_number: '',
    business_number: '',
    gas_bill_number: '',
    pincode: '',
    experiance: '',
    dob: '',
    documentType: '',
    metakeywords: '',
    deliveryRadiusKm: '',
    slug: '',
  });

  const [files, setFiles] = useState({
    pan_card_front: null,
    pan_card_back: null,
    aadhar_card_front: null,
    aadhar_card_back: null,
    gst_bill: null,
    business_proof: null,
    gas_bill: null,
    business_images: [],
    logo: null,
    banner_image: null,
    bill_sample: null,
    image: null,
    business_card: null,
    passport_front: null,
    passport_back: null,
  });

  const [previews, setPreviews] = useState({
    pan_card_front: null,
    pan_card_back: null,
    aadhar_card_front: null,
    aadhar_card_back: null,
    gst_bill: null,
    business_proof: null,
    gas_bill: null,
    business_images: [],
    logo: null,
    banner_image: null,
    bill_sample: null,
    image: null,
    business_card: null,
    passport_front: null,
    passport_back: null,
    labour_licence: null,
    udyam_certificate: null,
    rental_aggrement: null,
    power_bill: null,
    customer_bill_copy: null,
    images: [],
  });

  const [originalForm, setOriginalForm] = useState(null);
  const [originalFiles, setOriginalFiles] = useState(null);

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
      const data = res.data?.provider || {};

      const businessImages = data.business_images
        ? Array.isArray(data.business_images)
          ? data.business_images
          : [data.business_images]
        : [];

      let detectedDocumentType = '';
      if (data.pan_number && data.pan_number.trim() !== '') {
        detectedDocumentType = 'pan_card';
      } else {
        detectedDocumentType = 'driving_license';
      }

      const formData = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        altphone: data.altphone || '',
        email: data.email || '',
        password: '',
        bankName: data.bankName || '',
        branchName: data.branchName || '',
        holderName: data.holderName || '',
        accountNumber: data.accountNumber || '',
        serviceId: Array.isArray(data.serviceId)
          ? data.serviceId
          : data.serviceId
            ? [data.serviceId]
            : [],
        categoryId: Array.isArray(data.categoryId)
          ? data.categoryId
          : data.categoryId
            ? [data.categoryId]
            : [],
        subcategoryId: Array.isArray(data.subcategoryId)
          ? data.subcategoryId
          : data.subcategoryId
            ? [data.subcategoryId]
            : [],
        childcategoryId: data.childcategoryId || '',
        business_name: data.business_name || '',
        passportnumber: data.passportnumber || '',
        passport_number: data.passport_number || '',
        ifsc_code: data.ifsc_code || '',
        upid: data.upid || '',
        countryId: data.countryId || '',
        stateId: data.stateId || '',
        cityId: data.cityId || '',
        zoneId: data.zoneId || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        address: data.address || '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        gst_number: data.gst_number || '',
        pan_number: data.pan_number || '',
        aadhar_number: data.aadhar_number || '',
        business_number: data.business_number || '',
        gas_bill_number: data.gas_bill_number || '',
        pincode: data.pincode || '',
        experiance: data.experiance || '',
        dob: data.dob || '',
        documentType: data.documentType || detectedDocumentType,
        metakeywords: data.metakeywords || '',
        deliveryRadiusKm: data.deliveryRadiusKm || '',
        business_proof_type: data.business_proof_type || '',
        address_proof_type: data.address_proof_type || '',
        slug: data.slug || '',
      };

      setForm(formData);
      setOriginalForm(formData);

      if (data.deliveryRadiusKm) {
        setRadiusKm(data.deliveryRadiusKm.toString());
      }
      if (data.documentType) {
        setDocumentType(data.documentType);
      } else {
        setDocumentType(detectedDocumentType);
      }

      const previewData = {
        pan_card_front: data.pan_card_front ? `${URLS.FileBase}${data.pan_card_front}` : null,
        pan_card_back: data.pan_card_back ? `${URLS.FileBase}${data.pan_card_back}` : null,
        aadhar_card_front: data.aadhar_card_front ? `${URLS.FileBase}${data.aadhar_card_front}` : null,
        aadhar_card_back: data.aadhar_card_back ? `${URLS.FileBase}${data.aadhar_card_back}` : null,
        gst_bill: data.gst_bill ? `${URLS.FileBase}${data.gst_bill}` : null,
        business_proof: data.business_proof ? `${URLS.FileBase}${data.business_proof}` : null,
        gas_bill: data.gas_bill ? `${URLS.FileBase}${data.gas_bill}` : null,
        business_images: businessImages.map((img) => `${URLS.FileBase}${img}`),
        logo: data.logo ? `${URLS.FileBase}${data.logo}` : null,
        banner_image: data.banner_image ? `${URLS.FileBase}${data.banner_image}` : null,
        bill_sample: data.bill_sample ? `${URLS.FileBase}${data.bill_sample}` : null,
        image: data.image ? `${URLS.FileBase}${data.image}` : null,
        business_card: data.business_card ? `${URLS.FileBase}${data.business_card}` : null,
        passport_front: data.passport_front ? `${URLS.FileBase}${data.passport_front}` : null,
        passport_back: data.passport_back ? `${URLS.FileBase}${data.passport_back}` : null,
        labour_licence: data.labour_licence ? `${URLS.FileBase}${data.labour_licence}` : null,
        udyam_certificate: data.udyam_certificate ? `${URLS.FileBase}${data.udyam_certificate}` : null,
        rental_aggrement: data.rental_aggrement ? `${URLS.FileBase}${data.rental_aggrement}` : null,
        power_bill: data.power_bill ? `${URLS.FileBase}${data.power_bill}` : null,
        customer_bill_copy: data.customer_bill_copy ? `${URLS.FileBase}${data.customer_bill_copy}` : null,
        images: (data.images || []).map((img) => `${URLS.FileBase}${img}`),
      };

      setPreviews(previewData);

      setOriginalFiles({
        pan_card_front: data.pan_card_front || null,
        pan_card_back: data.pan_card_back || null,
        aadhar_card_front: data.aadhar_card_front || null,
        aadhar_card_back: data.aadhar_card_back || null,
        gst_bill: data.gst_bill || null,
        business_proof: data.business_proof || null,
        gas_bill: data.gas_bill || null,
        logo: data.logo || null,
        banner_image: data.banner_image || null,
        bill_sample: data.bill_sample || null,
        business_card: data.business_card || null,
        image: data.image || null,
        passport_front: data.passport_front || null,
        passport_back: data.passport_back || null,
        labour_licence: data.labour_licence || null,
        udyam_certificate: data.udyam_certificate || null,
        rental_aggrement: data.rental_aggrement || null,
        power_bill: data.power_bill || null,
        customer_bill_copy: data.customer_bill_copy || null,
        business_images: businessImages,
        images: data.images || [],
      });

      if (data.metakeywords) {
        setTags(data.metakeywords.split(','));
      }

      if (data.countryId) setSelectedCountry(data.countryId);
      if (data.stateId) setSelectedState(data.stateId);
      if (data.cityId) setSelectedCity(data.cityId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch Provider data.');
    }
  }, [getToken, providerId]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }

    const fetchData = async () => {
      try {
        const [childCategoryRes] = await Promise.all([
          axios.post(
            URLS.GetOnDemandChildCategory,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        ]);

        setChildCategories(childCategoryRes.data.ondemandcategorys || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch data.');
      }
    };

    fetchData();
  }, [getToken]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error('Please log in to continue.');
      return;
    }

    const fetchData = async () => {
      try {
        const [ServiceRes] = await Promise.all([
          axios.post(URLS.GetOnDemandSevice, { subcategoryId: form.subcategoryId }, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setServices(ServiceRes.data.ondemandservices || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch data.');
      }
    };

    fetchData();
  }, [getToken, form.subcategoryId]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      categoryRes(token);
    }
  }, [getToken]);

  const categoryRes = (token) => {
    axios
      .post(URLS.GetDemandCategory, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCategories(res.data.ondemandcategorys || []))
      .catch(() => toast.error('Failed to fetch ondemandcategorys'));
  };

  useEffect(() => {
    const token = getToken();
    if (form.categoryId.length > 0 && token) {
      subcategoryRes(form.categoryId, token);
    } else {
      setSubcategories([]);
      setForm((prev) => ({ ...prev, subcategoryId: [] }));
    }
  }, [form.categoryId, getToken]);

  const subcategoryRes = (categoryIds, token) => {
    axios
      .post(
        URLS.GetOnDemandSubCategorybyCategoryMulti,
        { categoryId: categoryIds },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setSubcategories(res.data.subcategories || []))
      .catch(() => toast.error('Failed to fetch subcategories'));
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      getCountries(token);
    }
  }, [getToken]);

  const getCountries = (token) => {
    axios
      .post(URLS.GetCountry, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCountries(res.data.country || []))
      .catch(() => toast.error('Failed to fetch countries'));
  };

  useEffect(() => {
    const token = getToken();
    if (selectedCountry && token) {
      getStates(selectedCountry, token);
    }
  }, [selectedCountry, getToken]);

  const getStates = (countryId, token) => {
    axios
      .post(
        URLS.GetCountryByState,
        { country_id: countryId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setStates(res.data.states || []))
      .catch(() => toast.error('Failed to fetch states'));
  };

  useEffect(() => {
    const token = getToken();
    if (selectedState && token) {
      getCities(selectedState, token);
    }
  }, [selectedState, getToken]);

  const getCities = (stateId, token) => {
    axios
      .post(
        URLS.GetStateByCitys,
        { state_id: stateId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setCities(res.data.cities || []))
      .catch(() => toast.error('Failed to fetch cities'));
  };

  useEffect(() => {
    const token = getToken();
    if (selectedCity && token) {
      getZones(selectedCity, token);
    }
  }, [selectedCity, getToken]);

  const getZones = (cityId, token) => {
    axios
      .post(
        URLS.GetCityOneByZone,
        { cityId: cityId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setZone(res.data.zones || []))
      .catch(() => toast.error('Failed to fetch zones'));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onLoad = (autoC) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setForm((prevForm) => ({
          ...prevForm,
          address: place.formatted_address || '',
          latitude: lat.toString(),
          longitude: lng.toString(),
        }));

        toast.success('âœ… Location selected successfully!');
      } else {
        toast.warning('Please select a location from the dropdown');
      }
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoadingCurrentLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat, lng };

          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setForm((prevForm) => ({
                ...prevForm,
                address: results[0].formatted_address,
                latitude: lat.toString(),
                longitude: lng.toString(),
              }));
              toast.success('Current location detected successfully!');
            } else {
              toast.error('Unable to retrieve address for your location');
            }
            setLoadingCurrentLocation(false);
          });
        } catch (error) {
          toast.error('Error fetching location details');
          setLoadingCurrentLocation(false);
        }
      },
      (error) => {
        setLoadingCurrentLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('ðŸ“ Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('An unknown error occurred');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'pdf', 'PDF'].includes(ext)) {
        setFiles((prev) => ({ ...prev, [fieldName]: selectedFile }));

        if (fieldName !== 'business_images') {
          const previewUrl = URL.createObjectURL(selectedFile);
          setPreviews((prev) => ({ ...prev, [fieldName]: previewUrl }));
        }
      } else {
        e.target.value = null;
        toast.error('Please choose JPG, JPEG, PDF, or PNG.');
      }
    }
  };

  const handleRemoveFile = (fieldName) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
    setPreviews((prev) => ({ ...prev, [fieldName]: null }));

    const fileInput = document.getElementById(fieldName);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleBusinessImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const currentFiles = files.business_images || [];

    if (currentFiles.length + selectedFiles.length > 5) {
      toast.error('You can upload a maximum of 5 business images.');
      e.target.value = null;
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png'].includes(ext);
    });

    if (validFiles.length !== selectedFiles.length) {
      toast.error('Please choose only JPG, JPEG, or PNG files.');
      e.target.value = null;
      return;
    }

    const newFiles = [...currentFiles, ...validFiles];
    setFiles((prev) => ({ ...prev, business_images: newFiles }));

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => ({
      ...prev,
      business_images: [...prev.business_images, ...newPreviews],
    }));
  };

  const removeBusinessImage = (index) => {
    const newFiles = [...files.business_images];
    const newPreviews = [...previews.business_images];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setFiles((prev) => ({ ...prev, business_images: newFiles }));
    setPreviews((prev) => ({ ...prev, business_images: newPreviews }));
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const getChangedFormFields = () => {
    if (!originalForm) return form;

    const changed = {};
    Object.entries(form).forEach(([key, value]) => {
      const orig = originalForm[key];

      if (Array.isArray(value) || Array.isArray(orig)) {
        if (JSON.stringify(value || []) !== JSON.stringify(orig || [])) {
          changed[key] = value;
        }
      } else if (value !== orig) {
        changed[key] = value;
      }
    });
    return changed;
  };

  const getChangedFiles = () => {
    if (!originalFiles) return files;

    const changed = {};
    Object.entries(files).forEach(([key, file]) => {
      const orig = originalFiles[key];

      if (key === 'business_images') {
        if (Array.isArray(file)) {
          const newFilesOnly = file.filter((f) => f instanceof File);
          if (newFilesOnly.length > 0) {
            changed[key] = newFilesOnly;
          }
        }
      } else if (file instanceof File) {
        changed[key] = file;
      }
    });
    return changed;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = getToken();
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      setLoading(false);
      return;
    }

    const formData = new FormData();

    // âœ… Send ALL form fields (except the ones we append explicitly)
    Object.entries(form).forEach(([key, value]) => {
      // Exclude fields that are handled separately
      if (key === 'documentType' || key === 'metakeywords') return;

      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            formData.append(key, JSON.stringify(value));
          }
        } else if (value !== '') {
          formData.append(key, value);
        }
      }
    });

    // âœ… Always append documentType and metakeywords
    formData.append('documentType', documentType || '');
    formData.append('metakeywords', tags.length > 0 ? tags.join(',') : '');

    // âœ… Send ALL new files (File objects)
    Object.entries(files).forEach(([key, file]) => {
      if (key === 'business_images' || key === 'images') {
        if (Array.isArray(file) && file.length > 0) {
          file.forEach((img) => {
            if (img instanceof File) {
              formData.append(key, img);
            }
          });
        }
      } else if (file && file instanceof File) {
        formData.append(key, file);
      }
    });

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const res = await axios.put(`${URLS.UpdateProvider}/${providerId}`, formData, config);

      if (res.status === 200) {
        toast.success(res.data.message || 'Provider updated successfully!');
        navigate('/providers');
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'An error occurred while updating provider.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const CompactFileInput = ({ id, accept, onChange }) => (
    <CompactFileInputContainer>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id={id}
        type="file"
        onChange={onChange}
      />
      <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '6px' }}>
        <IconUpload size={16} />
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
          Choose File
        </Typography>
      </label>
    </CompactFileInputContainer>
  );

  const CompactFileInputMultiple = ({ id, accept, onChange }) => (
    <CompactFileInputContainer>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id={id}
        multiple
        type="file"
        onChange={onChange}
      />
      <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '6px' }}>
        <IconUpload size={16} />
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
          Choose Files
        </Typography>
      </label>
    </CompactFileInputContainer>
  );

  const ImagePreview = ({ src, onRemove, onEdit, alt = 'Preview' }) => {
    const isPdf = src?.toLowerCase().endsWith('.pdf');

    return (
      <PreviewCard>
        {isPdf ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <IconFileText size={26} style={{ color: 'red' }} />
          </Box>
        ) : (
          <CardMedia
            component="img"
            height="100"
            image={src}
            alt={alt}
            sx={{ objectFit: 'cover' }}
          />
        )}

        <IconButton
          component="label"
          size="small"
          sx={{
            position: 'absolute',
            top: 2,
            left: 2,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            '&:hover': { bgcolor: 'black' },
          }}
        >
          <IconUpload size={14} />
          <input
            type="file"
            hidden
            accept="image/jpeg,image/png,application/pdf"
            onChange={onEdit}
          />
        </IconButton>

        <RemoveButton size="small" onClick={onRemove}>
          <IconX size={14} />
        </RemoveButton>
      </PreviewCard>
    );
  };

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={GOOGLE_MAPS_LIBRARIES}
      onLoad={() => setScriptLoaded(true)}
    >
      <PageContainer title="Edit Service Provider" description="Edit service provider details">
        <Breadcrumb title="Edit Service Provider" items={BCrumb} />
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

        <Box>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <ParentCard title="Basic Information">
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>First Name</CustomFormLabel>
                  <CustomTextField
                    id="firstName"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Last Name</CustomFormLabel>
                  <CustomTextField
                    id="lastName"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Slug</CustomFormLabel>
                  <CustomTextField
                    id="slug"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Date of Birth</CustomFormLabel>
                  <CustomTextField
                    id="dob"
                    type="date"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter DOB"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Experience</CustomFormLabel>
                  <CustomTextField
                    id="experiance"
                    type="number"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Experience"
                    name="experiance"
                    value={form.experiance}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Primary Number</CustomFormLabel>
                  <CustomTextField
                    id="phone"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    inputProps={{
                      maxLength: 10,
                      inputMode: 'numeric',
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>WhatsApp Number</CustomFormLabel>
                  <CustomTextField
                    id="altphone"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter WhatsApp Number"
                    name="altphone"
                    value={form.altphone}
                    onChange={handleChange}
                    inputProps={{
                      maxLength: 10,
                      inputMode: 'numeric',
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Email</CustomFormLabel>
                  <CustomTextField
                    id="email"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Password</CustomFormLabel>
                  <CustomTextField
                    id="password"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Category</CustomFormLabel>

                  <CustomSelect
                    id="categoryId"
                    name="categoryId"
                    multiple
                    value={form.categoryId}
                    onChange={handleMultiSelectChange}
                    fullWidth
                    displayEmpty

                    /* âœ… FIXED HEIGHT */
                    sx={{
                      height: 56,
                      '& .MuiSelect-select': {
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}

                    renderValue={(selected) => {
                      const MAX_CHIPS = 2; // ðŸ”¥ md={3} â†’ keep small
                      const visible = selected.slice(0, MAX_CHIPS);
                      const hiddenCount = selected.length - visible.length;

                      return (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                          }}
                        >
                          {visible.map((value) => {
                            const category = categories.find(
                              (cat) => cat._id === value
                            );
                            return category ? (
                              <Chip
                                key={value}
                                label={category.name}
                                size="small"
                              />
                            ) : null;
                          })}

                          {hiddenCount > 0 && (
                            <Chip
                              label={`+${hiddenCount} more`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      );
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        <Checkbox checked={form.categoryId.includes(cat._id)} />
                        {cat.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Subcategory</CustomFormLabel>

                  <CustomSelect
                    id="subcategoryId"
                    name="subcategoryId"
                    multiple
                    value={form.subcategoryId}
                    onChange={handleMultiSelectChange}
                    fullWidth
                    disabled={form.categoryId.length === 0}
                    displayEmpty

                    /* âœ… FIXED HEIGHT */
                    sx={{
                      height: 56,
                      '& .MuiSelect-select': {
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}

                    renderValue={(selected) => {
                      const MAX_CHIPS = 2; // ðŸ”¥ adjust as needed
                      const visible = selected.slice(0, MAX_CHIPS);
                      const hiddenCount = selected.length - visible.length;

                      return (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                          }}
                        >
                          {visible.map((value) => {
                            const subcategory = subcategories.find(
                              (sub) => sub._id === value
                            );
                            return subcategory ? (
                              <Chip
                                key={value}
                                label={subcategory.name}
                                size="small"
                              />
                            ) : null;
                          })}

                          {hiddenCount > 0 && (
                            <Chip
                              label={`+${hiddenCount} more`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      );
                    }}
                  >
                    {subcategories.map((sub) => (
                      <MenuItem key={sub._id} value={sub._id}>
                        <Checkbox checked={form.subcategoryId.includes(sub._id)} />
                        {sub.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>


                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Child Category</CustomFormLabel>
                  <CustomSelect
                    id="childcategoryId"
                    name="childcategoryId"
                    value={form.childcategoryId}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Select Child Category
                    </MenuItem>
                    {childCategories.map((child) => (
                      <MenuItem key={child._id} value={child._id}>
                        {child.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>

                {form.childcategoryId === '683dbbfbb62d2a241de0f7e3' && (
                  <Grid item xs={12} md={3}>
                    <CustomFormLabel htmlFor="serviceId" required>
                      Service
                    </CustomFormLabel>

                    <FormControl fullWidth>
                      <CustomSelect
                        id="serviceId"
                        name="serviceId"
                        multiple
                        value={form.serviceId}
                        onChange={handleMultiSelectChange}
                        required
                        displayEmpty

                        /* âœ… FIXED HEIGHT */
                        sx={{
                          height: 56,
                          '& .MuiSelect-select': {
                            height: '56px',
                            display: 'flex',
                            alignItems: 'center',
                          },
                        }}

                        renderValue={(selected) => {
                          const MAX_CHIPS = 2; // ðŸ”¥ adjust if needed
                          const visible = selected.slice(0, MAX_CHIPS);
                          const hiddenCount = selected.length - visible.length;

                          return (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                              }}
                            >
                              {visible.map((value) => {
                                const service = services.find((s) => s._id === value);
                                return service ? (
                                  <Chip
                                    key={value}
                                    label={service.name}
                                    size="small"
                                  />
                                ) : null;
                              })}

                              {hiddenCount > 0 && (
                                <Chip
                                  label={`+${hiddenCount} more`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          );
                        }}
                      >
                        {services.map((sub) => (
                          <MenuItem key={sub._id} value={sub._id}>
                            <Checkbox checked={form.serviceId.includes(sub._id)} />
                            {sub.name}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                    </FormControl>
                  </Grid>
                )}


                {form.childcategoryId === '683dbc04b62d2a241de0f7e8' && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Logo
                      </Typography>

                      {!previews.logo && (
                        <CompactFileInput
                          id="logo"
                          accept="image/jpeg,image/png"
                          onChange={(e) => handleFileChange(e, 'logo')}
                        />
                      )}

                      {previews.logo && (
                        <Box mt={1}>
                          <ImagePreview
                            src={previews.logo}
                            onRemove={() => handleRemoveFile('logo')}
                            onEdit={(e) => handleFileChange(e, 'logo')}
                            alt="Logo Preview"
                          />
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Banner Image
                      </Typography>

                      {!previews.banner_image && (
                        <CompactFileInput
                          id="banner_image"
                          accept="image/jpeg,image/png"
                          onChange={(e) => handleFileChange(e, 'banner_image')}
                        />
                      )}

                      {previews.banner_image && (
                        <Box mt={1}>
                          <ImagePreview
                            src={previews.banner_image}
                            onRemove={() => handleRemoveFile('banner_image')}
                            onEdit={(e) => handleFileChange(e, 'banner_image')}
                            alt="Banner Preview"
                          />
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <CustomFormLabel>Business Name</CustomFormLabel>
                      <CustomTextField
                        id="business_name"
                        variant="outlined"
                        fullWidth
                        placeholder="Enter your Business Name"
                        name="business_name"
                        value={form.business_name}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <CustomFormLabel htmlFor="business_number">
                        Business ID / Labour Licence
                      </CustomFormLabel>
                      <CustomTextField
                        id="business_number"
                        variant="outlined"
                        fullWidth
                        placeholder="Enter Business ID"
                        name="business_number"
                        value={form.business_number}
                        onChange={handleChange}
                        inputProps={{ maxLength: 30 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <CustomFormLabel htmlFor="gst_number">GST Number</CustomFormLabel>
                      <CustomTextField
                        id="gst_number"
                        variant="outlined"
                        fullWidth
                        placeholder="Enter GST Number"
                        name="gst_number"
                        value={form.gst_number}
                        onChange={handleChange}
                        inputProps={{ maxLength: 30 }}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Partner Selfie</CustomFormLabel>

                  {!previews.image ? (
                    <CompactFileInput
                      id="image"
                      accept="image/jpeg,image/png"
                      onChange={(e) => handleFileChange(e, 'image')}
                    />
                  ) : (
                    <Box mt={1}>
                      <ImagePreview
                        src={previews.image}
                        alt="Partner Selfie"
                        onRemove={() => handleRemoveFile('image')}
                        onEdit={(e) => handleFileChange(e, 'image')}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </ParentCard>

            {/* Identity Documents */}
            <ParentCard title="Identity Documents">
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>PAN Number</CustomFormLabel>
                  <CustomTextField
                    id="pan_number"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter PAN Number"
                    name="pan_number"
                    value={form.pan_number}
                    onChange={handleChange}
                    inputProps={{ maxLength: 20 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>PAN Card Front</CustomFormLabel>
                  {!previews.pan_card_front ? (
                    <CompactFileInput
                      id="pan_card_front"
                      accept="image/jpeg,image/png,application/pdf"
                      onChange={(e) => handleFileChange(e, 'pan_card_front')}
                    />
                  ) : (
                    <Box mt={1}>
                      <ImagePreview
                        src={previews.pan_card_front}
                        onRemove={() => handleRemoveFile('pan_card_front')}
                        onEdit={(e) => handleFileChange(e, 'pan_card_front')}
                        alt="PAN Front Preview"
                      />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>PAN Card Back</CustomFormLabel>
                  {!previews.pan_card_back ? (
                    <CompactFileInput
                      id="pan_card_back"
                      accept="image/jpeg,image/png,application/pdf"
                      onChange={(e) => handleFileChange(e, 'pan_card_back')}
                    />
                  ) : (
                    <Box mt={1}>
                      <ImagePreview
                        src={previews.pan_card_back}
                        onRemove={() => handleRemoveFile('pan_card_back')}
                        onEdit={(e) => handleFileChange(e, 'pan_card_back')}
                        alt="PAN Back Preview"
                      />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={3}></Grid>

                {/* Business Proof Type (Service Center only) */}
                {form.childcategoryId === '683dbc04b62d2a241de0f7e8' && (
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Business Proof Type</CustomFormLabel>
                    <CustomSelect
                      id="business_proof_type"
                      name="business_proof_type"
                      value={form.business_proof_type}
                      onChange={handleChange}
                      fullWidth
                    >
                      <MenuItem value="" disabled>Select Business Proof Type</MenuItem>
                      <MenuItem value="LABOUR LICENCE">LABOUR LICENCE</MenuItem>
                      <MenuItem value="UDYAM CERTIFICATE">UDYAM CERTIFICATE</MenuItem>
                      {/* <MenuItem value="GST">GST</MenuItem> */}
                    </CustomSelect>
                  </Grid>
                )}

                {/* Address Proof Type (Verified Partners only) */}
                {/* Address Proof Type (Service Center only) */}
                {/* {form.childcategoryId === '683dbc04b62d2a241de0f7e8' && (
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomFormLabel>Address Proof Type</CustomFormLabel>
                    <CustomSelect
                      id="address_proof_type"
                      name="address_proof_type"
                      value={form.address_proof_type}
                      onChange={handleChange}
                      fullWidth
                    >
                      <MenuItem value="" disabled>Select Address Proof Type</MenuItem>
                      <MenuItem value="GAS BILL">GAS BILL</MenuItem>
                      <MenuItem value="RENTAL AGREEMENT">RENTAL AGREEMENT</MenuItem>
                      <MenuItem value="POWER BILL">POWER BILL</MenuItem>
                    </CustomSelect>
                  </Grid>
                )} */}



                {/* Aadhaar Section (Shown for both Verified Partner and Service Center) */}
                {(form.childcategoryId === '683dbbfbb62d2a241de0f7e3' || form.childcategoryId === '683dbc04b62d2a241de0f7e8') && (
                  <>
                    <Grid item xs={12} sm={6} md={3}>
                      <CustomFormLabel htmlFor="aadhar_number">Aadhaar Number</CustomFormLabel>
                      <CustomTextField
                        id="aadhar_number"
                        variant="outlined"
                        fullWidth
                        placeholder="Enter Aadhaar Number"
                        name="aadhar_number"
                        value={form.aadhar_number}
                        onChange={handleChange}
                        inputProps={{ maxLength: 12, inputMode: 'numeric' }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="subtitle1" gutterBottom>
                        Aadhaar Front
                      </Typography>
                      {!previews.aadhar_card_front && (
                        <CompactFileInput
                          id="aadhar_card_front"
                          accept="image/jpeg,image/png,application/pdf"
                          onChange={(e) => handleFileChange(e, 'aadhar_card_front')}
                        />
                      )}
                      {previews.aadhar_card_front && (
                        <Box mt={1}>
                          <ImagePreview
                            src={previews.aadhar_card_front}
                            onRemove={() => handleRemoveFile('aadhar_card_front')}
                            onEdit={(e) => handleFileChange(e, 'aadhar_card_front')}
                            alt="Aadhaar Front Preview"
                          />
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="subtitle1" gutterBottom>
                        Aadhaar Back
                      </Typography>
                      {!previews.aadhar_card_back && (
                        <CompactFileInput
                          id="aadhar_card_back"
                          accept="image/jpeg,image/png,application/pdf"
                          onChange={(e) => handleFileChange(e, 'aadhar_card_back')}
                        />
                      )}
                      {previews.aadhar_card_back && (
                        <Box mt={1}>
                          <ImagePreview
                            src={previews.aadhar_card_back}
                            onRemove={() => handleRemoveFile('aadhar_card_back')}
                            onEdit={(e) => handleFileChange(e, 'aadhar_card_back')}
                            alt="Aadhaar Back Preview"
                          />
                        </Box>
                      )}
                    </Grid>
                  </>
                )}

                {/* Passport Section - Hidden as per request */}
                {/* 
                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel htmlFor="passport_number">Passport Number</CustomFormLabel>
 ...
                </Grid>
                */}

                {/* Address Proof Section (Verified Partner only) */}
                {form.childcategoryId === '683dbbfbb62d2a241de0f7e3' && (
                  <>
                    {form.address_proof_type === 'GAS BILL' && (
                      <>
                        <Grid item xs={12} sm={6} md={3}>
                          <CustomFormLabel htmlFor="gas_bill_number">Gas Bill Number</CustomFormLabel>
                          <CustomTextField
                            id="gas_bill_number"
                            variant="outlined"
                            fullWidth
                            placeholder="Enter Gas Bill Number"
                            name="gas_bill_number"
                            value={form.gas_bill_number}
                            onChange={handleChange}
                            inputProps={{ maxLength: 30 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="subtitle1" gutterBottom>Gas Bill Image</Typography>
                          {!previews.gas_bill && (
                            <CompactFileInput
                              id="gas_bill"
                              accept="image/jpeg,image/png"
                              onChange={(e) => handleFileChange(e, 'gas_bill')}
                            />
                          )}
                          {previews.gas_bill && (
                            <Box mt={1}>
                              <ImagePreview
                                src={previews.gas_bill}
                                onRemove={() => handleRemoveFile('gas_bill')}
                                onEdit={(e) => handleFileChange(e, 'gas_bill')}
                                alt="Gas Bill Preview"
                              />
                            </Box>
                          )}
                        </Grid>
                      </>
                    )}

                    {form.address_proof_type === 'RENTAL AGREEMENT' && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle1" gutterBottom>Rental Agreement</Typography>
                        {!previews.rental_aggrement ? (
                          <CompactFileInput
                            id="rental_aggrement"
                            accept="image/jpeg,image/png,application/pdf"
                            onChange={(e) => handleFileChange(e, 'rental_aggrement')}
                          />
                        ) : (
                          <Box mt={1}>
                            <ImagePreview
                              src={previews.rental_aggrement}
                              onRemove={() => handleRemoveFile('rental_aggrement')}
                              onEdit={(e) => handleFileChange(e, 'rental_aggrement')}
                              alt="Rental Agreement Preview"
                            />
                          </Box>
                        )}
                      </Grid>
                    )}

                    {form.address_proof_type === 'POWER BILL' && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle1" gutterBottom>Power Bill</Typography>
                        {!previews.power_bill ? (
                          <CompactFileInput
                            id="power_bill"
                            accept="image/jpeg,image/png,application/pdf"
                            onChange={(e) => handleFileChange(e, 'power_bill')}
                          />
                        ) : (
                          <Box mt={1}>
                            <ImagePreview
                              src={previews.power_bill}
                              onRemove={() => handleRemoveFile('power_bill')}
                              onEdit={(e) => handleFileChange(e, 'power_bill')}
                              alt="Power Bill Preview"
                            />
                          </Box>
                        )}
                      </Grid>
                    )}
                  </>
                )}

                {/* Business Proof Section (Service Center only) */}
                {form.childcategoryId === '683dbc04b62d2a241de0f7e8' && (
                  <>
                    {form.business_proof_type === 'LABOUR LICENCE' && (
                      <>
                        <Grid item xs={12} sm={6} md={4}>
                          <CustomFormLabel htmlFor="business_number">Business ID / Labour Licence</CustomFormLabel>
                          <CustomTextField
                            id="business_number"
                            variant="outlined"
                            fullWidth
                            placeholder="Enter Business ID"
                            name="business_number"
                            value={form.business_number}
                            onChange={handleChange}
                            inputProps={{ maxLength: 30 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="subtitle1" gutterBottom>Labour Licence</Typography>
                          {!previews.labour_licence ? (
                            <CompactFileInput
                              id="labour_licence"
                              accept="image/jpeg,image/png,application/pdf"
                              onChange={(e) => handleFileChange(e, 'labour_licence')}
                            />
                          ) : (
                            <Box mt={1}>
                              <ImagePreview
                                src={previews.labour_licence}
                                onRemove={() => handleRemoveFile('labour_licence')}
                                onEdit={(e) => handleFileChange(e, 'labour_licence')}
                                alt="Labour Licence Preview"
                              />
                            </Box>
                          )}
                        </Grid>
                      </>
                    )}

                    {form.business_proof_type === 'UDYAM CERTIFICATE' && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle1" gutterBottom>Udyam Certificate</Typography>
                        {!previews.udyam_certificate ? (
                          <CompactFileInput
                            id="udyam_certificate"
                            accept="image/jpeg,image/png,application/pdf"
                            onChange={(e) => handleFileChange(e, 'udyam_certificate')}
                          />
                        ) : (
                          <Box mt={1}>
                            <ImagePreview
                              src={previews.udyam_certificate}
                              onRemove={() => handleRemoveFile('udyam_certificate')}
                              onEdit={(e) => handleFileChange(e, 'udyam_certificate')}
                              alt="Udyam Certificate Preview"
                            />
                          </Box>
                        )}
                      </Grid>
                    )}

                    {form.business_proof_type === 'GST' && (
                      <>
                        <Grid item xs={12} sm={6} md={4}>
                          <CustomFormLabel htmlFor="gst_number">GST Number</CustomFormLabel>
                          <CustomTextField
                            id="gst_number"
                            variant="outlined"
                            fullWidth
                            placeholder="Enter GST Number"
                            name="gst_number"
                            value={form.gst_number}
                            onChange={handleChange}
                            inputProps={{ maxLength: 30 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="subtitle1" gutterBottom>GST Proof</Typography>
                          {!previews.gst_bill ? (
                            <CompactFileInput
                              id="gst_bill"
                              accept="image/jpeg,image/png,application/pdf"
                              onChange={(e) => handleFileChange(e, 'gst_bill')}
                            />
                          ) : (
                            <Box mt={1}>
                              <ImagePreview
                                src={previews.gst_bill}
                                onRemove={() => handleRemoveFile('gst_bill')}
                                onEdit={(e) => handleFileChange(e, 'gst_bill')}
                                alt="GST Proof Preview"
                              />
                            </Box>
                          )}
                        </Grid>
                      </>
                    )}
                  </>
                )}

                {/* Customer Bill Copy (Shown for both) */}
                {(form.childcategoryId === '683dbbfbb62d2a241de0f7e3' || form.childcategoryId === '683dbc04b62d2a241de0f7e8') && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle1" gutterBottom>Customer Bill Copy</Typography>
                    {!previews.customer_bill_copy ? (
                      <CompactFileInput
                        id="customer_bill_copy"
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(e) => handleFileChange(e, 'customer_bill_copy')}
                      />
                    ) : (
                      <Box mt={1}>
                        <ImagePreview
                          src={previews.customer_bill_copy}
                          onRemove={() => handleRemoveFile('customer_bill_copy')}
                          onEdit={(e) => handleFileChange(e, 'customer_bill_copy')}
                          alt="Customer Bill Copy Preview"
                        />
                      </Box>
                    )}
                  </Grid>
                )}

                {/* Business Card & Images (Service Center only) */}
                {form.childcategoryId === '683dbc04b62d2a241de0f7e8' && (
                  <>
                    {/* <Grid item xs={12} sm={6} md={3}>
                      <CustomFormLabel>Business Card / Visiting Card</CustomFormLabel>
                      {!previews.business_card ? (
                        <CompactFileInput
                          id="business_card"
                          accept="image/jpeg,image/png,application/pdf"
                          onChange={(e) => handleFileChange(e, 'business_card')}
                        />
                      ) : (
                        <Box mt={1}>
                          <ImagePreview
                            src={previews.business_card}
                            onRemove={() => handleRemoveFile('business_card')}
                            onEdit={(e) => handleFileChange(e, 'business_card')}
                            alt="Business Card Preview"
                          />
                        </Box>
                      )}
                    </Grid> */}

                    <Grid item xs={12} sm={6} md={3}>
                      <CompactFileInputMultiple
                        id="business_images"
                        label="Business Images (Max 5)"
                        accept="image/jpeg,image/png"
                        onChange={handleBusinessImagesChange}
                      />
                      {previews.business_images && previews.business_images.length > 0 && (
                        <Box mt={1}>
                          <ImagePreviewContainer>
                            {previews.business_images.map((preview, index) => (
                              <PreviewCard key={index} sx={{ width: 80, height: 80 }}>
                                <CardMedia
                                  component="img"
                                  height="80"
                                  image={preview}
                                  alt={`Business image ${index + 1}`}
                                  sx={{ objectFit: 'cover' }}
                                />
                                <RemoveButton size="small" onClick={() => removeBusinessImage(index)}>
                                  <IconX size={14} />
                                </RemoveButton>
                              </PreviewCard>
                            ))}
                          </ImagePreviewContainer>
                        </Box>
                      )}
                    </Grid>
                  </>
                )}


              </Grid>
            </ParentCard>

            {/* Bank Information */}
            <ParentCard title="Bank Information">
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Bank Name</CustomFormLabel>
                  <CustomTextField
                    id="bankName"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Bank Name"
                    name="bankName"
                    value={form.bankName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Branch Name</CustomFormLabel>
                  <CustomTextField
                    id="branchName"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Branch Name"
                    name="branchName"
                    value={form.branchName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Account Holder Name</CustomFormLabel>
                  <CustomTextField
                    id="holderName"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Holder Name"
                    name="holderName"
                    value={form.holderName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>Account Number</CustomFormLabel>
                  <CustomTextField
                    id="accountNumber"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Account Number"
                    name="accountNumber"
                    value={form.accountNumber}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>IFSC Code</CustomFormLabel>
                  <CustomTextField
                    id="ifsc_code"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter IFSC Code"
                    name="ifsc_code"
                    value={form.ifsc_code}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel>UPI ID</CustomFormLabel>
                  <CustomTextField
                    id="upid"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter UPI ID"
                    name="upid"
                    value={form.upid}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </ParentCard>

            {/* Service Area Information */}
            <ParentCard title="Service Area Information">
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel htmlFor="countryId">Country</CustomFormLabel>
                  <FormControl fullWidth>
                    <CustomSelect
                      id="countryId"
                      name="countryId"
                      value={form.countryId}
                      onChange={(e) => {
                        const countryId = e.target.value;
                        setSelectedCountry(countryId);
                        setForm({ ...form, countryId, stateId: '', cityId: '' });
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Country
                      </MenuItem>

                      {countries.map((country) => (
                        <MenuItem key={country._id} value={country._id}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel htmlFor="stateId">State</CustomFormLabel>
                  <CustomSelect
                    id="stateId"
                    name="stateId"
                    value={form.stateId}
                    onChange={(e) => {
                      const stateId = e.target.value;
                      setSelectedState(stateId);
                      setForm({ ...form, stateId, cityId: '' });
                    }}
                    fullWidth
                    disabled={!form.countryId}
                  >
                    <MenuItem value="" disabled>
                      Select State
                    </MenuItem>
                    {states.map((state) => (
                      <MenuItem key={state._id} value={state._id}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel htmlFor="cityId">City</CustomFormLabel>
                  <CustomSelect
                    id="cityId"
                    name="cityId"
                    value={form.cityId}
                    onChange={(e) => {
                      const cityId = e.target.value;
                      setSelectedCity(cityId);
                      setForm({ ...form, cityId, zoneId: '' });
                    }}
                    fullWidth
                    disabled={!form.stateId}
                  >
                    <MenuItem value="" disabled>
                      Select City
                    </MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city._id} value={city._id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel htmlFor="pincode">Pincode</CustomFormLabel>
                  <CustomTextField
                    id="pincode"
                    name="pincode"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Pincode"
                    value={form.pincode}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormLabel htmlFor="location-search">Search Location</CustomFormLabel>
                  {scriptLoaded ? (
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                      <TextField
                        id="location-search"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Start typing to search"
                        fullWidth
                        variant="outlined"
                        size="small"
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={handleCurrentLocation}
                              disabled={loadingCurrentLocation}
                              color="primary"
                              title="Use my current location"
                              sx={{
                                position: 'absolute',
                                right: 8,
                                padding: '8px',
                              }}
                            >
                              {loadingCurrentLocation ? (
                                <CircularProgress size={20} />
                              ) : (
                                <MyLocationIcon />
                              )}
                            </IconButton>
                          ),
                        }}
                      />
                    </Autocomplete>
                  ) : (
                    <TextField
                      value="Loading Google Maps..."
                      placeholder="Loading..."
                      fullWidth
                      variant="outlined"
                      size="small"
                      disabled
                    />
                  )}
                  <FormHelperText sx={{ fontSize: '0.7rem' }}>Type or click ðŸ“</FormHelperText>
                </Grid>

                <Grid item xs={12} sm={4} md={2}>
                  <CustomFormLabel htmlFor="latitude">Latitude</CustomFormLabel>
                  <CustomTextField
                    id="latitude"
                    name="latitude"
                    value={form.latitude}
                    placeholder="Auto-filled"
                    fullWidth
                    size="small"
                    disabled
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={2}>
                  <CustomFormLabel htmlFor="longitude">Longitude</CustomFormLabel>
                  <CustomTextField
                    id="longitude"
                    name="longitude"
                    value={form.longitude}
                    placeholder="Auto-filled"
                    fullWidth
                    size="small"
                    disabled
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={2}>
                  <CustomFormLabel htmlFor="deliveryRadiusKm">Delivery Radius (KM)</CustomFormLabel>
                  <CustomTextField
                    id="deliveryRadiusKm"
                    name="deliveryRadiusKm"
                    type="number"
                    value={form.deliveryRadiusKm}
                    onChange={handleChange}
                    placeholder="e.g., 5"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0.1, max: 50, step: 0.1 }}
                  />
                  <FormHelperText sx={{ fontSize: '0.7rem' }}>Red circle preview</FormHelperText>
                </Grid>

                {form.latitude && form.longitude && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 2 }}>
                      Delivery Area Preview
                    </Typography>
                    <Box
                      sx={{
                        height: 450,
                        width: '100%',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={{
                          lat: parseFloat(form.latitude),
                          lng: parseFloat(form.longitude),
                        }}
                        zoom={14}
                        options={{
                          streetViewControl: false,
                          mapTypeControl: false,
                          zoomControl: true,
                          fullscreenControl: true,
                        }}
                      >
                        <Marker
                          position={{
                            lat: parseFloat(form.latitude),
                            lng: parseFloat(form.longitude),
                          }}
                        />

                        {form.deliveryRadiusKm && parseFloat(form.deliveryRadiusKm) > 0 && (
                          <Circle
                            center={{
                              lat: parseFloat(form.latitude),
                              lng: parseFloat(form.longitude),
                            }}
                            radius={parseFloat(form.deliveryRadiusKm) * 1000}
                            options={{
                              strokeColor: '#FF0000',
                              strokeOpacity: 0.8,
                              strokeWeight: 3,
                              fillColor: '#FF0000',
                              fillOpacity: 0.35,
                              clickable: false,
                              draggable: false,
                            }}
                          />
                        )}
                      </GoogleMap>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="fulladdress">Full Address</CustomFormLabel>
                  <CustomTextField
                    id="fulladdress"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Full address will appear here"
                    multiline
                    rows={2}
                    fullWidth
                  />
                  <FormHelperText>
                    This will be auto-filled when you select a location above
                  </FormHelperText>
                </Grid>
              </Grid>
            </ParentCard>



            <ParentCard title="SEO Settings">
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12}>
                  <CustomFormLabel>Meta Title</CustomFormLabel>
                  <CustomTextField
                    id="metaTitle"
                    name="metaTitle"
                    inputProps={{ maxLength: 90 }}
                    value={form.metaTitle}
                    onChange={handleChange}
                    placeholder="Optimized title for search engines (max 90 chars)"
                    fullWidth
                  />
                  <FormHelperText>{form.metaTitle?.length || 0}/90 characters</FormHelperText>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomFormLabel>Meta Keywords</CustomFormLabel>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      alignItems: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1,
                      '&:hover': {
                        borderColor: 'text.primary',
                      },
                      '&:focus-within': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                      },
                    }}
                  >
                    {tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => removeTag(index)}
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                    <CustomTextField
                      variant="standard"
                      value={inputValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.includes(',')) {
                          const newTags = value
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter((tag) => tag !== '');

                          if (newTags.length > 0) {
                            setTags([...tags, ...newTags]);
                            setInputValue('');
                          }
                        } else {
                          setInputValue(value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (inputValue.trim() !== '') {
                            setTags([...tags, inputValue.trim()]);
                            setInputValue('');
                          }
                        }
                      }}
                      placeholder="Type keywords separated by commas or press Enter"
                      InputProps={{
                        disableUnderline: true,
                        style: { minWidth: '150px' },
                      }}
                      sx={{ flexGrow: 1 }}
                    />
                  </Box>
                  <FormHelperText>
                    Type comma to separate or press Enter to add keywords
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="metaDescription">Meta Description</CustomFormLabel>
                  <CustomTextField
                    id="metaDescription"
                    name="metaDescription"
                    inputProps={{ maxLength: 200 }}
                    value={form.metaDescription}
                    onChange={handleChange}
                    placeholder="Meta description for search results (max 200 chars)"
                    multiline
                    rows={4}
                    fullWidth
                  />
                  <FormHelperText>{form.metaDescription?.length || 0}/200 characters</FormHelperText>
                </Grid>
              </Grid>
            </ParentCard>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={loading}
                loadingPosition="start"

              >
                Update Provider
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </PageContainer>
    </LoadScript>
  );
};

export default EditProvider;

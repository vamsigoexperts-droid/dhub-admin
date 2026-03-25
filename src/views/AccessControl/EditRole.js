// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Grid,
//   Divider,
//   Button,
//   FormControlLabel,
//   Paper,
//   Typography,
//   CardContent,
// } from '@mui/material';
// import CustomCheckbox from '../../components/forms/theme-elements/CustomCheckbox';
// import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
// import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
// import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
// import PageContainer from 'src/components/container/PageContainer';
// import { ToastContainer, toast } from 'react-toastify';
// import { IconArrowBackUp } from '@tabler/icons-react';
// import { useNavigate } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
// import { URLS } from '../../Url';
// import axios from 'axios';

// const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Add Role' }];

// const EditRole = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     roleName: '',
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const [state, setState] = useState({
//     dashboardView: form?.dashboardView || false,

//     ServiceAdd: form?.ServiceAdd || false,
//     ServiceEdit: form?.ServiceEdit || false,
//     ServiceView: form?.ServiceView || false,
//     ServiceDelete: form?.ServiceDelete || false,

//     RoleAdd: form?.RoleAdd || false,
//     RoleEdit: form?.RoleEdit || false,
//     RoleView: form?.RoleView || false,
//     RoleDelete: form?.RoleDelete || false,

//     StaffAdd: form?.StaffAdd || false,
//     StaffEdit: form?.StaffEdit || false,
//     StaffView: form?.StaffView || false,
//     StaffDelete: form?.StaffDelete || false,

//     CustomerAdd: form?.CustomerAdd || false,
//     CustomerEdit: form?.CustomerEdit || false,
//     CustomerView: form?.CustomerView || false,
//     CustomerDelete: form?.CustomerDelete || false,

//     VendorAdd: form?.VendorAdd || false,
//     VendorEdit: form?.VendorEdit || false,
//     VendorView: form?.VendorView || false,
//     VendorDelete: form?.VendorDelete || false,

//     ProviderAdd: form?.ProviderAdd || false,
//     ProviderEdit: form?.ProviderEdit || false,
//     ProviderView: form?.ProviderView || false,
//     ProviderDelete: form?.ProviderDelete || false,
//   });

//   const token = JSON.parse(localStorage.getItem('user'))?.token || '';

//   const handleChangeCheckBox = (event) => {
//     setState({ ...state, [event.target.name]: event.target.checked });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       toast.error('Authentication token missing. Please log in.');
//       return;
//     }

//     const formData = {
//       roleName: form.roleName,
//       rolesAndPermission: state,
//     };

//     try {
//       const config = { headers: { Authorization: `Bearer ${token}` } };

//       let res = await axios.put(`${URLS.UpdateRole}/${form._id}`, formData, config);

//       if (res.status === 200) {
//         toast.success(res.data.message);
//         navigate('/access-control/roles');
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || 'An error occurred';
//       toast.error(message);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   let RoleId = localStorage.getItem('RoleId');

//   const getData = async () => {
//     if (!token) {
//       toast.error('Authentication token missing. Please log in.');
//       return;
//     }
//     try {
//       const res = await axios.post(
//         URLS.GetByRoleId,
//         { _id: RoleId },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       setForm(res?.data?.data || []);
//       setState(res?.data?.data?.rolesAndPermission[0] || []);
//     } catch (error) {
//       toast.error('Failed to fetch role.');
//       console.error('Failed to fetch data:', error);
//     }
//   };

//   return (
//     <PageContainer title="Add Role" description="Manage Add Role for your e-commerce platform">
//       <Breadcrumb title="Add Role" items={BCrumb} />

//       <Paper variant="outlined">
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           p={2}
//           flexWrap="wrap"
//           gap={2}
//         >
//           <Typography variant="h6">Roles List</Typography>
//           <Box display="flex" gap={2} alignItems="center">
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => navigate(-1)}
//               startIcon={<IconArrowBackUp />}
//             >
//               Back
//             </Button>
//           </Box>
//         </Box>
//         <Divider />
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2} sx={{ p: 2 }}>
//               <Grid item xs={12} sm={4}>
//                 <CustomFormLabel htmlFor="name" required>
//                   Department / Role Name
//                 </CustomFormLabel>
//                 <CustomTextField
//                   id="name"
//                   variant="outlined"
//                   fullWidth
//                   placeholder="Enter Department / Role Name"
//                   name="roleName"
//                   value={form.roleName}
//                   required
//                   onChange={handleChange}
//                   aria-label="Role Name"
//                 />
//               </Grid>
//             </Grid>
//             <Grid container spacing={2} sx={{ p: 2 }}>
//               <Grid item xs={12} sm={2}>
//                 <Typography variant="h6" sx={{ pt: 1 }}>
//                   Dashboard :
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.dashboardView}
//                       onChange={handleChangeCheckBox}
//                       name="dashboardView"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'View' }}
//                     />
//                   }
//                   label="View"
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2} sx={{ p: 2 }}>
//               <Grid item xs={12} sm={2}>
//                 <Typography variant="h6" sx={{ pt: 1 }}>
//                   Services :
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.ServiceAdd}
//                       onChange={handleChangeCheckBox}
//                       name="ServiceAdd"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Add' }}
//                     />
//                   }
//                   label="Add"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.ServiceEdit}
//                       onChange={handleChangeCheckBox}
//                       name="ServiceEdit"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Edit' }}
//                     />
//                   }
//                   label="Edit"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.ServiceView}
//                       onChange={handleChangeCheckBox}
//                       name="ServiceView"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'View' }}
//                     />
//                   }
//                   label="View"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.ServiceDelete}
//                       onChange={handleChangeCheckBox}
//                       name="ServiceDelete"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Delete' }}
//                     />
//                   }
//                   label="Delete"
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2} sx={{ p: 2 }}>
//               <Grid item xs={12} sm={2}>
//                 <Typography variant="h6" sx={{ pt: 1 }}>
//                   Roles :
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.RoleAdd}
//                       onChange={handleChangeCheckBox}
//                       name="RoleAdd"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Add' }}
//                     />
//                   }
//                   label="Add"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.RoleEdit}
//                       onChange={handleChangeCheckBox}
//                       name="RoleEdit"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Edit' }}
//                     />
//                   }
//                   label="Edit"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.RoleView}
//                       onChange={handleChangeCheckBox}
//                       name="RoleView"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'View' }}
//                     />
//                   }
//                   label="View"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.RoleDelete}
//                       onChange={handleChangeCheckBox}
//                       name="RoleDelete"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Delete' }}
//                     />
//                   }
//                   label="Delete"
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2} sx={{ p: 2 }}>
//               <Grid item xs={12} sm={2}>
//                 <Typography variant="h6" sx={{ pt: 1 }}>
//                   Staff :
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.StaffAdd}
//                       onChange={handleChangeCheckBox}
//                       name="StaffAdd"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Add' }}
//                     />
//                   }
//                   label="Add"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.StaffEdit}
//                       onChange={handleChangeCheckBox}
//                       name="StaffEdit"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Edit' }}
//                     />
//                   }
//                   label="Edit"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.StaffView}
//                       onChange={handleChangeCheckBox}
//                       name="StaffView"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'View' }}
//                     />
//                   }
//                   label="View"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.StaffDelete}
//                       onChange={handleChangeCheckBox}
//                       name="StaffDelete"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Delete' }}
//                     />
//                   }
//                   label="Delete"
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2} sx={{ p: 2 }}>
//               <Grid item xs={12} sm={2}>
//                 <Typography variant="h6" sx={{ pt: 1 }}>
//                   Customers :
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.CustomerAdd}
//                       onChange={handleChangeCheckBox}
//                       name="CustomerAdd"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Add' }}
//                     />
//                   }
//                   label="Add"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.CustomerEdit}
//                       onChange={handleChangeCheckBox}
//                       name="CustomerEdit"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Edit' }}
//                     />
//                   }
//                   label="Edit"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.CustomerView}
//                       onChange={handleChangeCheckBox}
//                       name="CustomerView"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'View' }}
//                     />
//                   }
//                   label="View"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.CustomerDelete}
//                       onChange={handleChangeCheckBox}
//                       name="CustomerDelete"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Delete' }}
//                     />
//                   }
//                   label="Delete"
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2} sx={{ p: 2 }}>
//               <Grid item xs={12} sm={2}>
//                 <Typography variant="h6" sx={{ pt: 1 }}>
//                   Vendors :
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.VendorAdd}
//                       onChange={handleChangeCheckBox}
//                       name="VendorAdd"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Add' }}
//                     />
//                   }
//                   label="Add"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.VendorEdit}
//                       onChange={handleChangeCheckBox}
//                       name="VendorEdit"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Edit' }}
//                     />
//                   }
//                   label="Edit"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.VendorView}
//                       onChange={handleChangeCheckBox}
//                       name="VendorView"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'View' }}
//                     />
//                   }
//                   label="View"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.VendorDelete}
//                       onChange={handleChangeCheckBox}
//                       name="VendorDelete"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Delete' }}
//                     />
//                   }
//                   label="Delete"
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2} sx={{ p: 2 }}>
//               <Grid item xs={12} sm={2}>
//                 <Typography variant="h6" sx={{ pt: 1 }}>
//                   Provider :
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.ProviderAdd}
//                       onChange={handleChangeCheckBox}
//                       name="ProviderAdd"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Add' }}
//                     />
//                   }
//                   label="Add"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.ProviderEdit}
//                       onChange={handleChangeCheckBox}
//                       name="ProviderEdit"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Edit' }}
//                     />
//                   }
//                   label="Edit"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.ProviderView}
//                       onChange={handleChangeCheckBox}
//                       name="ProviderView"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'View' }}
//                     />
//                   }
//                   label="View"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <FormControlLabel
//                   control={
//                     <CustomCheckbox
//                       checked={state.ProviderDelete}
//                       onChange={handleChangeCheckBox}
//                       name="ProviderDelete"
//                       color="primary"
//                       inputProps={{ 'aria-label': 'Delete' }}
//                     />
//                   }
//                   label="Delete"
//                 />
//               </Grid>
//             </Grid>

//             <Divider sx={{ my: 2 }} />
//             <Box display="flex" justifyContent="flex-end" gap={1}>
//               <Button color="primary" variant="contained" type="submit" aria-label="Create Service">
//                 Submit
//               </Button>
//             </Box>
//           </form>
//         </CardContent>
//       </Paper>

//       <ToastContainer />
//     </PageContainer>
//   );
// };

// export default EditRole;

import React, { useState, useEffect } from 'react';
import CustomCheckbox from '../../components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import { IconArrowBackUp } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Box,
  Grid,
  Divider,
  Button,
  FormControlLabel,
  Paper,
  Typography,
  CardContent,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Edit Role' }];

const Menuitems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    permissions: ['view'],
  },
  {
    id: 'locations',
    title: 'Locations',
    permissions: ['view'],
    children: [
      { id: 'country', title: 'Country', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'state', title: 'State', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'city', title: 'City', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'zones', title: 'Zones', permissions: ['add', 'edit', 'delete', 'view'] },
    ],
  },
  {
    id: 'services',
    title: 'Services',
    permissions: ['add', 'edit', 'delete', 'view'],
  },
  {
    id: 'access_control',
    title: 'Access Control',
    permissions: ['view'],
    children: [
      {
        id: 'department_roles',
        title: 'Department / Roles',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      { id: 'admin_user', title: 'Admin User', permissions: ['add', 'edit', 'delete', 'view'] },
    ],
  },
  {
    id: 'users_customers',
    title: 'Users / Customers',
    permissions: ['view'],
    children: [
      { id: 'users', title: 'Users / Customers', permissions: ['edit', 'delete', 'view'] },
      { id: 'blocked_users', title: 'Blocked Users/Customers', permissions: ['edit', 'view'] },
      {
        id: 'delete_users',
        title: 'Delete Users/Customers',
        permissions: ['edit', 'delete', 'view'],
      },
    ],
  },
  {
    id: 'on_demand_services',
    title: 'On Demand Services',
    permissions: ['view'],
    children: [
      {
        id: 'on_demand_categories',
        title: 'Categories',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'on_demand_sub_categories',
        title: 'Sub Categories',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'on_demand_child_categories',
        title: 'Child Categories',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'on_demand_service',
        title: 'Services',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      { id: 'on_demand_coupons', title: 'Coupons', permissions: ['add', 'edit', 'delete', 'view'] },
    ],
  },
  {
    id: 'service_providers',
    title: 'Service Providers List',
    permissions: ['view'],
    children: [
      {
        id: 'all_providers',
        title: 'All Service Provider',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'new_providers',
        title: 'New Service Provider Request',
        permissions: ['edit', 'delete', 'view'],
      },
      {
        id: 'approved_providers',
        title: 'Approved Service Provider',
        permissions: ['edit', 'delete', 'view'],
      },
      {
        id: 'rejected_providers',
        title: 'Reject Service Provider',
        permissions: ['edit', 'delete', 'view'],
      },
      { id: 'blocked_providers', title: 'Blocked Service Provider', permissions: ['edit', 'view'] },
    ],
  },
  {
    id: 'service_bookings',
    title: 'Services Bookings',
    permissions: ['view'],
    children: [
      {
        id: 'verified_bookings',
        title: 'Verified Partners Bookings',
        permissions: ['edit', 'view'],
      },
      { id: 'nearby_bookings', title: 'Near by Shops Bookings', permissions: ['edit', 'view'] },
    ],
  },
  {
    id: 'crm_bookings',
    title: 'CRM Bookings',
    permissions: ['view'],
    children: [
      { id: 'add_crm', title: 'Add CRM Booking', permissions: ['edit', 'view'] },
      { id: 'crm_bookings_list', title: 'CRM Bookings', permissions: ['edit', 'view'] },
    ],
  },
  {
    id: 'buy_sell',
    title: 'Buy / Sell',
    permissions: ['view'],
    children: [
      {
        id: 'buy_sell_category',
        title: 'Category',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'buy_sell_subcategory',
        title: 'Sub Category',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      { id: 'sale_request', title: 'Sale Request', permissions: ['add', 'edit', 'delete', 'view'] },
    ],
  },
  {
    id: 'provider_complaints',
    title: 'Provider Complaints',
    permissions: ['view'],
  },
  {
    id: 'grocery',
    title: 'Grocery',
    permissions: ['view'],
    children: [
      {
        id: 'grocery_categories',
        title: 'Categories',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      { id: 'grocery_cat_request', title: 'Categories Request', permissions: ['edit', 'view'] },
      {
        id: 'grocery_subcategories',
        title: 'Sub-Categories',
        permissions: ['edit', 'delete', 'view'],
      },
      {
        id: 'grocery_subcat_request',
        title: 'Sub-Categories Request',
        permissions: ['edit', 'delete', 'view'],
      },
      { id: 'grocery_brands', title: 'Brands', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'grocery_units', title: 'Units', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'grocery_weight', title: 'Weight', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'grocery_flavour', title: 'Flavour', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'add_grocery', title: 'Add Product', permissions: ['add'] },
      { id: 'grocery_list', title: 'Groceries List', permissions: ['edit', 'delete', 'view'] },
      {
        id: 'grocery_request_list',
        title: 'Groceries Request List',
        permissions: ['edit', 'delete', 'view'],
      },
      { id: 'grocery_orders', title: 'Grocery Orders', permissions: ['edit', 'view'] },
    ],
  },
  {
    id: 'food',
    title: 'Food',
    permissions: ['view'],
    children: [
      {
        id: 'food_categories',
        title: 'Categories',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      { id: 'food_cat_request', title: 'Categories Request', permissions: ['edit', 'view'] },
      {
        id: 'food_subcategories',
        title: 'Sub-Categories',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      { id: 'food_subcat_request', title: 'Sub-Categories Request', permissions: ['edit', 'view'] },
      { id: 'cuisine_type', title: 'Cuisine Type', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'add_food_item', title: 'Add Food Item', permissions: ['add'] },
      { id: 'food_items', title: 'Food Items', permissions: ['edit', 'delete', 'view'] },
      { id: 'food_items_request', title: 'Food Items Request', permissions: ['edit', 'view'] },
      { id: 'food_orders', title: 'Food Orders', permissions: ['edit', 'view'] },
    ],
  },
  {
    id: 'shopping',
    title: 'Shopping',
    permissions: ['view'],
    children: [
      {
        id: 'shopping_categories',
        title: 'Categories',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'shopping_cat_request',
        title: 'Categories Request',
        permissions: ['edit', 'view'],
      },
      {
        id: 'shopping_subcategories',
        title: 'Sub-Categories',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'shopping_subcat_request',
        title: 'Sub-Categories Request',
        permissions: ['edit', 'view'],
      },
      {
        id: 'shopping_child_categories',
        title: 'Child-Categories',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'shop_variations',
        title: 'shop-variations',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'sub_shop_variations',
        title: 'sub-shop-variations',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      { id: 'size', title: 'Size', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'weight', title: 'Weight', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'color', title: 'Color', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'ram', title: 'Ram', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'brand', title: 'Brand', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'storage', title: 'Storage', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'fit_type', title: 'Fit Type', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'neck_type', title: 'Neck Type', permissions: ['add', 'edit', 'delete', 'view'] },
      {
        id: 'material_type',
        title: 'Type Of Material',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'product_type',
        title: 'Type Of Product',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      { id: 'sleeve_type', title: 'Sleeve Type', permissions: ['add', 'edit', 'delete', 'view'] },
      {
        id: 'operating_system',
        title: 'Operating System',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'country_origin',
        title: 'Country Origin Type',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      { id: 'add_shopping_item', title: 'Add Shopping Item', permissions: ['add'] },
      {
        id: 'shopping_items_list',
        title: 'Shopping Items List',
        permissions: ['edit', 'delete', 'view'],
      },
      {
        id: 'shopping_items_request',
        title: 'Shopping Items Request',
        permissions: ['edit', 'view'],
      },
      { id: 'shopping_orders', title: 'Shopping Orders', permissions: ['edit', 'view'] },
    ],
  },
  {
    id: 'medicine',
    title: 'Medicine',
    permissions: ['view'],
    children: [
      {
        id: 'medicine_categories',
        title: 'Categories',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'medicine_cat_request',
        title: 'Categories Request ',
        permissions: ['edit', 'view'],
      },
      {
        id: 'medicine_subcategories',
        title: 'Sub-Categories',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'medicine_subcat_request',
        title: 'Sub-Categories Request',
        permissions: ['edit', 'view'],
      },
      {
        id: 'medicine_child_categories',
        title: 'Child-Categories',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      { id: 'medicine_brands', title: 'Brands', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'medicine_units', title: 'Units', permissions: ['add', 'edit', 'delete', 'view'] },
      {
        id: 'medicine_weight',
        title: 'Medicine Weight',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'medicine_form',
        title: 'Medicine Form',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'packing_types',
        title: 'Packing Types',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'therapeutic_class',
        title: 'Therapeutic Class',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'drug_categories',
        title: 'Drug Categories',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      { id: 'add_medicine', title: 'Add Medicine', permissions: ['add'] },
      { id: 'medicines', title: 'Medicines', permissions: ['edit', 'delete', 'view'] },
      { id: 'medicines_request', title: 'Medicines Request', permissions: ['edit', 'view'] },
      { id: 'medicines_orders', title: 'Medicines Orders', permissions: ['edit', 'view'] },
    ],
  },
  {
    id: 'stores',
    title: 'Stores',
    permissions: ['view'],
    children: [
      {
        id: 'pending_stores',
        title: 'Pending Stores Request',
        permissions: ['edit', 'view'],
      },
      { id: 'stores_list', title: 'Stores List', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'blocked_stores', title: 'Blocked Stores', permissions: ['edit', 'view'] },
    ],
  },
  {
    id: 'delivery_partners',
    title: 'Delivery Partners',
    permissions: ['view'],
    children: [
      {
        id: 'delivery_partners_list',
        title: 'Delivery Partners',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'blocked_delivery_partners',
        title: 'Blocked Delivery Partners',
        permissions: ['edit', 'view'],
      },
    ],
  },
  {
    id: 'ecommerce_complaints',
    title: 'ECommerce-Complaints',
    permissions: ['view', 'edit'],
  },
  {
    id: 'subscription_plan',
    title: 'Subscription Plan',
    permissions: ['view'],
    children: [
      {
        id: 'subscription_plans',
        title: 'Subscription Plan',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      {
        id: 'subscription_history',
        title: 'Subscription History',
        permissions: ['view'],
      },
    ],
  },
  {
    id: 'notification',
    title: 'Notification',
    permissions: ['view'],
    children: [
      { id: 'send_notification', title: 'Send Notification', permissions: ['add'] },
      { id: 'app_notification', title: 'App Notification', permissions: ['view'] },
    ],
  },
  {
    id: 'banner_items',
    title: 'Banner Items',
    permissions: ['view', 'add', 'edit', 'delete'],
    children: [
      {
        id: 'banner_item',
        title: 'Banner Item',
        permissions: [],
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments',
    permissions: ['view'],
    children: [
      { id: 'stores_payments', title: 'Stores Payments', permissions: ['view', 'edit'] },
      { id: 'stores_payouts', title: 'Stores Payouts', permissions: ['view', 'edit'] },
      { id: 'drives_payments', title: 'Drives Payments', permissions: ['view', 'edit'] },
      { id: 'drives_payouts', title: 'Drives Payouts', permissions: ['view', 'edit'] },
      { id: 'providers_payments', title: 'Providers Payments', permissions: ['view', 'edit'] },
      { id: 'providers_payouts', title: 'Providers Payouts', permissions: ['view', 'edit'] },
      { id: 'wallet_transaction', title: 'Wallet Transation', permissions: ['view', 'edit'] },
      { id: 'payout_requests', title: 'PayOut Requests', permissions: ['view', 'edit'] },
    ],
  },
  {
    id: 'website',
    title: 'Website',
    permissions: ['view'],
    children: [
      { id: 'home_page', title: 'Home Page', permissions: ['edit', 'view'] },
      { id: 'about_us', title: 'About Us', permissions: ['edit', 'view'] },
      { id: 'our_leadership', title: 'Our leadership', permissions: ['edit', 'view'] },
      { id: 'testimonials', title: 'Testimonials', permissions: ['edit', 'view'] },
      { id: 'blog', title: 'Blog', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'app_screens', title: 'App Screens', permissions: ['edit', 'view'] },
      { id: 'app_download_screen', title: 'App Download Screen', permissions: ['edit', 'view'] },
      { id: 'app_scrolling', title: 'App Scrolling', permissions: ['edit', 'view'] },
      {
        id: 'announcements',
        title: 'Announcements',
        permissions: ['add', 'edit', 'delete', 'view'],
      },
      { id: 'accept_payments', title: 'Accept Payments', permissions: ['edit', 'view'] },
      { id: 'website_headings', title: 'Website All Headings', permissions: ['edit', 'view'] },
      { id: 'enquiry', title: 'Enquiry', permissions: ['view', 'delete'] },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    permissions: ['view'],
    children: [
      { id: 'global_settings', title: 'Global Settings', permissions: ['edit', 'view'] },
      { id: 'app_settings', title: 'App Settings', permissions: ['edit', 'view'] },
      { id: 'radius_configuration', title: 'Radius Configuration', permissions: ['edit', 'view'] },
      { id: 'tax_setting', title: 'Tax Setting', permissions: ['edit', 'view'] },
      { id: 'delivery_charges', title: 'Delivery Charges', permissions: ['edit', 'view'] },
      { id: 'terms_conditions', title: 'Terms & Conditions', permissions: ['edit', 'view'] },
      {
        id: 'service_terms_conditions',
        title: 'Service Terms & Conditions',
        permissions: ['edit', 'view'],
      },
      { id: 'privacy_policy', title: 'Privacy Policy', permissions: ['edit', 'view'] },
      {
        id: 'service_privacy_policy',
        title: 'Service Privacy Policy',
        permissions: ['edit', 'view'],
      },
      { id: 'refund_policy', title: 'Refund Policy', permissions: ['edit', 'view'] },
      {
        id: 'service_refund_policy',
        title: 'Service Refund Policy',
        permissions: ['edit', 'view'],
      },
      { id: 'shipping_policy', title: 'Shipping Policy', permissions: ['edit', 'view'] },
      {
        id: 'service_shipping_policy',
        title: 'Service Shipping Policy',
        permissions: ['edit', 'view'],
      },
      { id: 'faqs', title: 'Faqs', permissions: ['add', 'edit', 'delete', 'view'] },
      { id: 'service_faqs', title: 'Service Faqs', permissions: ['add', 'edit', 'delete', 'view'] },
    ],
  },
];

const AddRole = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    roleName: '',
  });

  const initialState = Menuitems.reduce((acc, item) => {
    if (item.permissions && Array.isArray(item.permissions)) {
      item.permissions.forEach((perm) => {
        acc[`${item.id}_${perm}`] = false;
      });
    }
    if (item.children && Array.isArray(item.children)) {
      item.children.forEach((child) => {
        if (child.permissions && Array.isArray(child.permissions)) {
          child.permissions.forEach((perm) => {
            acc[`${child.id}_${perm}`] = false;
          });
        }
      });
    }
    return acc;
  }, {});

  const [state, setState] = useState(initialState);

  useEffect(() => {
    getData();
  }, []);

  let RoleId = localStorage.getItem('RoleId');

  const getData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    try {
      const res = await axios.post(
        URLS.GetByRoleId,
        { _id: RoleId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setForm(res?.data?.data || []);
      setState(res?.data?.data?.rolesAndPermission[0] || []);
    } catch (error) {
      toast.error('Failed to fetch role.');
      console.error('Failed to fetch data:', error);
    }
  };

  const token = JSON.parse(localStorage.getItem('user'))?.token || '';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeCheckBox = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    if (!form.roleName.trim()) {
      toast.error('Please enter a role name');
      return;
    }
    const formData = {
      roleName: form.roleName,
      rolesAndPermission: state,
    };
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(`${URLS.UpdateRole}/${form._id}`, formData, config);
      if (res.status === 200) {
        toast.success(res.data.message);
        navigate('/access-control/roles');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    }
  };

  return (
    <PageContainer title="Edit Role" description="Manage Edit Role for your e-commerce platform">
      <Breadcrumb title="Edit Role" items={BCrumb} />
      <Paper variant="outlined">
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            flexWrap="wrap"
            gap={2}
          >
            <Typography variant="h6">Edit New Role</Typography>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              startIcon={<IconArrowBackUp />}
            >
              Back
            </Button>
          </Box>
          <Divider />
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={12} sm={4}>
                <CustomFormLabel htmlFor="name" required>
                  Department / Role Name
                </CustomFormLabel>
                <CustomTextField
                  id="roleName"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Department / Role Name"
                  name="roleName"
                  value={form.roleName}
                  required
                  onChange={handleChange}
                  aria-label="Role Name"
                />
              </Grid>
            </Grid>
            {Menuitems.map((item) => (
              <>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6">{item.title}</Typography>
                  </Grid>
                  {item.permissions &&
                    item.permissions.map((perm) => (
                      <Grid item xs={12} sm={2} key={`${item.id}_${perm}`}>
                        <FormControlLabel
                          control={
                            <CustomCheckbox
                              checked={state[`${item.id}_${perm}`] || false}
                              onChange={handleChangeCheckBox}
                              name={`${item.id}_${perm}`}
                              color="primary"
                              inputProps={{ 'aria-label': perm }}
                            />
                          }
                          label={perm.charAt(0).toUpperCase() + perm.slice(1)}
                        />
                      </Grid>
                    ))}
                </Grid>
                {item.children && item.children.length > 0 && (
                  <>
                    {item.children.map((child) => (
                      <Grid container spacing={2} key={child.id} sx={{ p: 2 }}>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="subtitle1">{child.title}</Typography>
                        </Grid>
                        {child.permissions &&
                          child.permissions.map((perm) => (
                            <Grid item xs={12} sm={2} key={`${child.id}_${perm}`}>
                              <FormControlLabel
                                control={
                                  <CustomCheckbox
                                    checked={state[`${child.id}_${perm}`] || false}
                                    onChange={handleChangeCheckBox}
                                    name={`${child.id}_${perm}`}
                                    color="primary"
                                    inputProps={{ 'aria-label': perm }}
                                  />
                                }
                                label={perm.charAt(0).toUpperCase() + perm.slice(1)}
                              />
                            </Grid>
                          ))}
                      </Grid>
                    ))}
                  </>
                )}
              </>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button color="primary" variant="contained" type="submit" aria-label="Create Service">
                Submit
              </Button>
            </Box>
          </form>
        </CardContent>
      </Paper>
      <ToastContainer />
    </PageContainer>
  );
};

export default AddRole;

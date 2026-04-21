// ============================================
// TopCards.jsx - KEEP ALL SECTIONS + SAME CARD SIZE
// ============================================
import React, { useEffect, useState } from 'react';
import { Box, CardContent, Typography, CircularProgress, Chip, Divider, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { URLS } from '../../../Url';

// Import icons
import iconServices from '../../../assets/images/svgs/icon-briefcase.svg';
import iconProducts from '../../../assets/images/svgs/categories.png';
import iconProviders from '../../../assets/images/svgs/employee.png';
import iconStores from '../../../assets/images/svgs/online-store.png';
import iconOrders from '../../../assets/images/svgs/checkout.png';
import iconUsers from '../../../assets/images/svgs/icon-user-male.svg';
import iconCities from '../../../assets/images/svgs/location-pin.png';
import iconlocation from '../../../assets/images/svgs/location.png';
import accesscontrol from '../../../assets/images/svgs/access-control.png'
import customer from '../../../assets/images/svgs/customer.png'
import customerreview from '../../../assets/images/svgs/customer-review.png'


const TopCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // MAIN DASHBOARD SECTION
//   const mainDashboardCards = [
//        { 
//       key: 'servicesCount', 
//       title: 'Main Services', 
//       icon: iconServices, 
//       bgcolor: 'primary',
//       statusBreakdown: [
//         { label: 'Active', key: 'activeServicesCount', color: 'success' },
//         { label: 'Inactive', key: 'inactiveProviderCount', color: 'warning' }
//       ],
//       getValue: (data) => data?.section1?.servicesCount ?? 0
//     },
//     { 
//   key: 'totalLocations', 
//   title: 'Total Locations', 
//   icon: iconlocation, 
//   bgcolor: 'primary',
//   statusBreakdown: [
//     { label: 'Countries', key: 'countries', color: 'info' },
//     { label: 'States', key: 'states', color: 'success' },
//     { label: 'Cities', key: 'cities', color: 'warning' },
//     { label: 'Zones', key: 'zones', color: 'error' }
//   ],
//   getValue: (data) => (data?.section1?.totalLocations?.countries || 0) + 
//                        (data?.section1?.totalLocations?.states || 0) +
//                        (data?.section1?.totalLocations?.cities || 0) +
//                        (data?.section1?.totalLocations?.zones || 0)
// },

//       { 
//   key: 'usersCount', 
//   title: 'Total User Access', 
//   icon: accesscontrol, 
//   bgcolor: 'primary',
//   statusBreakdown: [
//     { label: 'Active', key: 'activeUsers', color: 'success' },
//     { label: 'Inactive', key: 'inactiveUsers', color: 'warning' },
//     { label: 'Blocked', key: 'blockedUsers', color: 'error' }
//   ],
//   getValue: (data) => data?.section1?.usersCount?.totalUsers ?? 0
// },

//        { key: 'DepartmentOrroles', title: 'Department/Roles', icon:customer , bgcolor: 'primary' },
//   ];

const mainDashboardCards = [
  { 
    key: 'servicesCount', 
    title: 'Main Services', 
    icon: iconServices, 
    bgcolor: 'primary',
    statusBreakdown: [
      { label: 'Active', key: 'activeServicesCount', color: 'primary' },
      { label: 'Inactive', key: 'inactiveProviderCount', color: 'primary' }
    ],
    getValue: (data) => data?.section1?.servicesCount ?? 0
  },
  { 
    key: 'totalLocations', 
    title: 'Total Locations', 
    icon: iconlocation, 
    bgcolor: 'primary',
    statusBreakdown: [
      { label: 'Countries', key: 'countries', color: 'primary' },
      { label: 'States', key: 'states', color: 'primary' },
      { label: 'Cities', key: 'cities', color: 'primary' },
      // { label: 'Zones', key: 'zones', color: 'primary' }
    ],
    getValue: (data) => 
      (data?.section1?.totalLocations?.countries || 0) + 
      (data?.section1?.totalLocations?.states || 0) +
      (data?.section1?.totalLocations?.cities || 0) +
      (data?.section1?.totalLocations?.zones || 0)
  },
  { 
    key: 'usersCount', 
    title: 'Total User/Customer', 
    icon: accesscontrol, 
    bgcolor: 'primary',
    statusBreakdown: [
      { label: 'Active', key: 'activeUsers', color: 'primary' },
      { label: 'Inactive', key: 'inactiveUsers', color: 'primary' },
      { label: 'Blocked', key: 'blockedUsers', color: 'primary' }
    ],
    getValue: (data) => data?.section1?.usersCount?.totalUsers ?? 0
  },
  { 
    key: 'departmentRoles', 
    title: 'Departments / Roles', 
    icon: customer, 
    bgcolor: 'primary',
    statusBreakdown: [
      { label: 'Departments', key: 'departmentsCount', color: 'primary' },
      { label: 'Roles', key: 'rolesCount', color: 'primary' }
    ],
    getValue: (data) => 
      (data?.section1?.departmentsCount || 0) + 
      (data?.section1?.rolesCount || 0)
  },
];


  // APPLIANCE REPAIR SERVICES SECTION
//   const applianceServicesCards = [
   

// { 
//   key: 'ondemandCategoriesCount', 
//   title: 'Service Categories', 
//   icon: iconProducts, 
//   bgcolor: 'info',
//   statusBreakdown: [
//     { label: 'Subcategories', key: 'ondemandSubcategoriesCount', color: 'success' },
//     { label: 'Child Categories', key: 'ondemandChildcategoriesCount', color: 'warning' }
//   ],
//   getValue: (data) => data?.section2?.ondemandCategoriesCount ?? 0
// },


//     { 
//       key: 'serviceproviderCount', 
//       title: 'Service Providers', 
//       icon: iconProviders, 
//       bgcolor: 'info' ,
//         statusBreakdown: [
//         { label: 'Active', key: 'activeServiceProviderCount', color: 'success' },
//         { label: 'Inactive', key: 'inactiveServiceProviderCount', color: 'warning' },
//         { label: 'Blocked', key: 'blockedServiceProviderCount', color: 'error' }
//       ],
//       displayTotal: (stats) => (stats?.activeServiceProviderCount || 0) + (stats?.inactiveServiceProviderCount || 0) + (stats?.blockedServiceProviderCount || 0)
//     },
//     { 
//       key: 'verifiedPartnerCount', 
//       title: 'Verified Partners', 
//       icon: iconProviders, 
//       bgcolor: 'info',
//       statusBreakdown: [
//         { label: 'Active', key: 'activeVerifiedPartnerCount', color: 'success' },
//         { label: 'Inactive', key: 'inactiveVerifiedPartnerCount', color: 'warning' },
//         { label: 'Blocked', key: 'blockedVerifiedPartnerCount', color: 'error' }
//       ],
//       displayTotal: (stats) => (stats?.activeVerifiedPartnerCount || 0) + (stats?.inactiveVerifiedPartnerCount || 0) + (stats?.blockedVerifiedPartnerCount || 0)
//     },
//     { 
//       key: 'nearByShopCount', 
//       title: 'Nearby Service centers', 
//       icon: iconStores, 
//       bgcolor: 'info',
//       statusBreakdown: [
//         { label: 'Active', key: 'activeNearByShopCount', color: 'success' },
//         { label: 'Inactive', key: 'inactiveNearByShopCount', color: 'warning' },
//         { label: 'Blocked', key: 'blockedNearByShopCount', color: 'error' }
//       ],
//       displayTotal: (stats) => (stats?.activeNearByShopCount || 0) + (stats?.inactiveNearByShopCount || 0) + (stats?.blockedNearByShopCount || 0)
//     },

//      { 
//       key: 'rateCardCount', 
//       title: 'Service Rate Cards', 
//       icon: customerreview, 
//       bgcolor: 'info',
//       getValue: (data) => data?.section3?.rateCardCount ?? 0
      
//       // displayTotal: (stats) => (stats?.dashboardData?.rateCardCount || 0) + (stats?.inactiveNearByShopCount || 0) + (stats?.blockedNearByShopCount || 0)
//     },
//   ];

const applianceServicesCards = [
  {
    key: 'ondemandCategoriesCount',
    title: 'Service Categories',
    icon: iconProducts,
    bgcolor: 'info',
    statusBreakdown: [
      { label: 'Subcategories', key: 'ondemandSubcategoriesCount', color: 'primary' },
      { label: 'Child Categories', key: 'ondemandChildcategoriesCount', color: 'primary' },
    ],
    getValue: (data) => data?.section2?.ondemandCategoriesCount ?? 0,
  },
  {
    key: 'serviceproviderCount',
    title: 'Service Providers',
    icon: iconProviders,
    bgcolor: 'info',
    statusBreakdown: [
      { label: 'Active', key: 'activeServiceProviderCount', color: 'primary' },
      { label: 'Inactive', key: 'inactiveServiceProviderCount', color: 'primary' },
      { label: 'Blocked', key: 'blockedServiceProviderCount', color: 'primary' },
       { label: 'ActiveCities', key: 'serviceprovideractivecities', color: 'primary' },
    ],
    getValue: (data) => data?.section2?.serviceproviderCount ?? 0,
  },
  {
    key: 'verifiedPartnerCount',
    title: 'Verified Partners',
    icon: iconProviders,
    bgcolor: 'info',
    statusBreakdown: [
      { label: 'Active', key: 'activeVerifiedPartnerCount', color: 'primary' },
      { label: 'Inactive', key: 'inactiveVerifiedPartnerCount', color: 'primary' },
      { label: 'Blocked', key: 'blockedVerifiedPartnerCount', color: 'primary' },
      { label: 'ActiveCities', key: 'verifiedpartneractivecities', color: 'primary' },
    ],
    getValue: (data) =>
      (data?.section2?.activeVerifiedPartnerCount ?? 0) +
      (data?.section2?.inactiveVerifiedPartnerCount ?? 0) +
      (data?.section2?.blockedVerifiedPartnerCount ?? 0),
  },
  {
    key: 'nearByShopCount',
    title: 'Nearby Service Centers',
    icon: iconStores,
    bgcolor: 'info',
    statusBreakdown: [
      { label: 'Active', key: 'activeNearByShopCount', color: 'primary' },
      { label: 'Inactive', key: 'inactiveNearByShopCount', color: 'primary' },
      { label: 'Blocked', key: 'blockedNearByShopCount', color: 'primary' },
       { label: 'ActiveCities', key: 'nearbyservicecenteractivecities', color: 'primary' },
    ],
    getValue: (data) =>
      (data?.section2?.activeNearByShopCount ?? 0) +
      (data?.section2?.inactiveNearByShopCount ?? 0) +
      (data?.section2?.blockedNearByShopCount ?? 0),
  },
  {
    key: 'rateCardCount',
    title: 'Service Rate Cards',
    icon: customerreview,
    bgcolor: 'info',
    getValue: (data) => data?.section3?.rateCardCount ?? 0,
  },
];

  // BUY/SELL SECTION
  // const buySellCards = [
  //   { key: 'totalOrders', title: 'Total Orders', icon: iconOrders, bgcolor: 'info' },
  //   { key: 'totalOrderPerDay', title: 'Orders Per Day', icon: iconOrders, bgcolor: 'info' },
  //   { key: 'totalCustomers', title: 'Total Users', icon: iconUsers, bgcolor: 'info' },
  //   { key: 'totalCities', title: 'Cities', icon: iconCities, bgcolor: 'info' },
    
  // ];

const buySellCards = [
  {
    key: 'totalAdspost',
    title: 'Total Ads Post',
    icon: iconOrders,
    bgcolor: 'info',
    statusBreakdown: [
      { label: 'Completed Ads', key: 'completedadspost', color: 'primary' },
      { label: 'Pending Ads', key: 'pendingadspost', color: 'primary' },
      { label: 'New Ads', key: 'newpostedadds', color: 'primary' },
    ],
    getValue: (data) => data?.section4?.Orders?.totalOrders ?? 0,
  },
  {
    key: 'dailyadspost',
    title: 'Daily Ads',
    icon: iconOrders,
    bgcolor: 'info',
    statusBreakdown: [
      { label: 'Today', key: 'dailyadspostperday', color: 'primary' },
      { label: 'Yesterday', key: 'yesterdayadspost', color: 'primary' },
    ],
    getValue: (data) => data?.section4?.Orders?.totalOrderPerDay ?? 0,
  },
  {
    key: 'totalCustomers',
    title: 'Total Buyers/Sellers',
    icon: iconUsers,
    bgcolor: 'info',
    statusBreakdown: [
      { label: 'Buyers', key: 'buyerCount', color: 'primary' },
      { label: 'Sellers', key: 'sellerCount', color: 'primary' },
    ],
    getValue: (data) => data?.section4?.totalCustomers ?? 0,
  },
  {
    key: 'totalCities',
    title: 'Active Cities',
    icon: iconCities,
    bgcolor: 'info',
    statusBreakdown: [
      { label: 'Cities with Orders', key: 'activeCitiesWithOrders', color: 'primary' },
      { label: 'Other Cities', key: 'inactiveCities', color: 'primary' },
    ],
    getValue: (data) => data?.section4?.Orders?.totalCities ?? 0,
  },
];



 useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(URLS.Getdashboardcard);
        if (response?.data?.status === true && response?.data?.dashboardData) {
          setStats(response.data.dashboardData);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        const errorMessage = err.response?.status === 404 
          ? 'Dashboard endpoint not found' 
          : err.message || 'Failed to load dashboard statistics';
        setError(errorMessage);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  // UNIFIED RENDER CARD FUNCTION - SAME SIZE FOR ALL
  const renderCard = (card, index) => {
    if (!stats) return null;

    const displayValue = card.getValue 
  ? card.getValue(stats)
  : card.displayTotal 
    ? card.displayTotal(stats) 
    : (stats?.[card.key] ?? 0);


    return (
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={index}>
        <Box
          bgcolor={card.bgcolor + '.light'}
          textAlign="center"
          borderRadius={2}
          boxShadow={2}
          sx={{ 
            height: '100%', 
            minHeight: 150, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-5px)',
            },
            position: 'relative',
            p: 2
          }}
        >
          <CardContent sx={{ width: '100%', p: 0 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 72,
                height: 72,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                boxShadow: '0 0 12px rgba(255, 255, 255, 0.25)',
                mb: 0.5,
              }}
            >
              <img
                src={card.icon}
                alt={card.title}
                width="40"
                height="40"
                loading="lazy"
                style={{
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Box>
            
            <Typography
              mt={1}
              variant="subtitle2"
              fontWeight={600}
              fontSize="0.9rem"
              sx={{ color: '#ffffff' }}
            >
              {card.title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              mb={1}
              sx={{ fontSize: '1.75rem', color: '#ffffff' }}
            >
              {displayValue.toLocaleString()}
            </Typography>

{card.statusBreakdown && stats && (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column', // vertical alignment
      gap: 0.4,
      justifyContent: 'center',
      alignItems: 'center', // center inside card
      mt: 1,
    }}
  >
    {card.statusBreakdown.map((status, idx) => (
      <Typography
        key={idx}
        variant="body2"
        sx={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#ffffff',
        }}
      >
{status.label}: {
  card.section4Type 
    ? stats?.section4?.[card.section4Type]?.[status.key]
    : (stats?.section1?.totalLocations?.[status.key] ||
       stats?.section1?.usersCount?.[status.key] ||
       stats?.section2?.[status.key] ||
       stats?.section1?.[status.key])
  || 0
}


      </Typography>
    ))}
  </Box>
)}

          </CardContent>
        </Box>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <strong>Error:</strong> {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        No dashboard data available. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      {/* MAIN DASHBOARD SECTION */}
      <Box mb={4}>
        <Typography 
          variant="h5" 
          fontWeight={700} 
          mb={2}
          sx={{ 
            color: 'primary.main',
            borderLeft: 4,
            borderColor: 'primary.main',
            pl: 2
          }}
        >
          Main Dashboard
        </Typography>
        <Grid container spacing={3}>
          {mainDashboardCards.map((card, i) => renderCard(card, i))}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* APPLIANCE REPAIR SERVICES SECTION */}
      <Box mb={4}>
        <Typography 
          variant="h5" 
          fontWeight={700} 
          mb={2}
          sx={{ 
            color: 'primary.main',
            borderLeft: 4,
            borderColor: 'primary.main',
            pl: 2
          }}
        >
          Appliance Repair Services
        </Typography>
        <Grid container spacing={3}>
          {applianceServicesCards.map((card, i) => renderCard(card, i))}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* BUY/SELL & GENERAL METRICS SECTION */}
      <Box mb={4}>
        <Typography 
          variant="h5" 
          fontWeight={700} 
          mb={2}
          sx={{ 
            color: 'primary.main',
            borderLeft: 4,
            borderColor: 'primary.main',
            pl: 2
          }}
        >
          Buy/Sell & General Metrics
        </Typography>
        <Grid container spacing={3}>
          {buySellCards.map((card, i) => renderCard(card, i))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TopCards;

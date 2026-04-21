import { uniqueId } from 'lodash';
import {
  IconHome,
  IconClipboardData,
  IconLock,
  IconUser,
  IconMap,
  IconPoint,
  IconDeviceDesktop,
  IconCreditCardRefund,
  IconPackage,
  IconBellPlus,
  IconBuildingBank,
  IconSettings,
  IconDeviceLaptop,
  IconUsers,
  IconHeadphones,
} from '@tabler/icons-react';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'DashBoard',
    icon: IconHome,
    href: '/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Locations',
    icon: IconMap,
    href: '/locations/',
    children: [
      {
        id: uniqueId(),
        title: 'Country',
        icon: IconPoint,
        href: '/locations/country',
      },
      {
        id: uniqueId(),
        title: 'State',
        icon: IconPoint,
        href: '/locations/state',
      },
      {
        id: uniqueId(),
        title: 'City',
        icon: IconPoint,
        href: '/locations/city',
      },
      {
        id: uniqueId(),
        title: 'Zones',
        icon: IconPoint,
        href: '/locations/zones',
      },
    ],
  },
  // {
  //   id: uniqueId(),
  //   title: 'Services',
  //   icon: IconClipboardData,
  //   href: '/services/',
  //   children: [
  //     {
  //       id: uniqueId(),
  //       title: 'Service Type',
  //       icon: IconPoint,
  //       href: '/services/servicetype',
  //     },
  //     {
  //       id: uniqueId(),
  //       title: 'Service',
  //       icon: IconPoint,
  //       href: '/services/service',
  //     },
  //   ],
  // },
  {
    id: uniqueId(),
    title: 'Services',
    icon: IconClipboardData,
    href: '/services/service',
  },
  {
    id: uniqueId(),
    title: 'Access Control',
    icon: IconLock,
    href: '/access-control/',
    children: [
      {
        id: uniqueId(),
        title: 'Department / Roles',
        icon: IconPoint,
        href: '/access-control/roles',
      },
      {
        id: uniqueId(),
        title: 'Admin User',
        icon: IconPoint,
        href: '/access-control/adminusers',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Users / Customers',
    icon: IconUser,
    href: '/Customer/',
    children: [
      {
        id: uniqueId(),
        title: 'Users / Customers',
        icon: IconPoint,
        href: '/users',
      },
      {
        id: uniqueId(),
        title: 'Blocked Users/Customers',
        icon: IconPoint,
        href: '/blocked-users',
      },
    ],
  },
  // {
  //   id: uniqueId(),
  //   title: 'Providers',
  //   icon: IconTruckDelivery,
  //   href: '/providers',
  // },
  {
    navlabel: true,
    subheader: 'On Demand Services',
  },
  {
    id: uniqueId(),
    title: 'On Demand Services',
    icon: IconPackage,
    href: '/',
    children: [
      {
        id: uniqueId(),
        title: 'Categories',
        icon: IconPoint,
        href: '/ondemandservice/demandcategories',
      },
      {
        id: uniqueId(),
        title: 'Sub Categories',
        icon: IconPoint,
        href: '/ondemandservice/ondemandsubcategories',
      },
      {
        id: uniqueId(),
        title: 'Child Categories',
        icon: IconPoint,
        href: '/ondemandservice/ondemandchildcategories',
      },
      {
        id: uniqueId(),
        title: 'Services',
        icon: IconPoint,
        href: '/ondemandservice/ondemandservices',
      },
      {
        id: uniqueId(),
        title: 'Coupons',
        icon: IconPoint,
        href: '/ondemandservice/ondemandcoupons',
      },
      // {
      //   id: uniqueId(),
      //   title: 'Workers',
      //   icon: IconPoint,
      //   href: '/ondemandservice/ondemandworkers',
      // },
    ],
  },
  {
    id: uniqueId(),
    title: 'Service Providers List',
    icon: IconUsers,
    href: '/',
    children: [
      {
        id: uniqueId(),
        title: 'All Service Provider',
        icon: IconPoint,
        href: '/all-providers',
      },
      {
        id: uniqueId(),
        title: 'New Service Provider Request',
        icon: IconPoint,
        href: '/pending-service-provider',
      },
      {
        id: uniqueId(),
        title: 'Approved Service Provider',
        icon: IconPoint,
        href: '/providers',
      },
      {
        id: uniqueId(),
        title: 'Reject Service Provider',
        icon: IconPoint,
        href: '/reject-service-provider',
      },
      {
        id: uniqueId(),
        title: 'Blocked Service Provider',
        icon: IconPoint,
        href: '/blocked-service-provider',
      },
      {
        id: uniqueId(),
        title: 'Deleted Service Provider',
        icon: IconPoint,
        href: '/deleted-service-provider',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Services Bookings',
    icon: IconPackage,
    href: '/',
    children: [
      {
        id: uniqueId(),
        title: 'Verified Partners Bookings',
        icon: IconPoint,
        href: '/ondemandservice/verified-partners/pending',
      },
      {
        id: uniqueId(),
        title: 'Near by Shops Bookings',
        icon: IconPoint,
        href: '/ondemandservice/near-by-shops/pending',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Crm Bookings',
    icon: IconPackage,
    href: '/',
    children: [
      {
        id: uniqueId(),
        title: 'Add Crm Booking',
        icon: IconPoint,
        href: '/add-crm-booking',
      },
      {
        id: uniqueId(),
        title: 'Crm Bookings',
        icon: IconPoint,
        href: '/ondemandservice/verified-partners-crm/pending',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Provider Complaints',
    icon: IconHeadphones,
    href: '/ondemandservice/provider-complaints',
  },
  {
    navlabel: true,
    subheader: 'SUBSCRIPTION SETUP',
  },
  {
    id: uniqueId(),
    title: 'Subscription Plan',
    icon: IconCreditCardRefund,
    href: '/',
    children: [
      {
        id: uniqueId(),
        title: 'Subscription Plan',
        icon: IconPoint,
        href: '/subscriptionsplan',
      },
      {
        id: uniqueId(),
        title: 'Subscription History',
        icon: IconPoint,
        href: '/subscriptionhistory',
      },
    ],
  },
  {
    navlabel: true,
    subheader: 'Website Management',
  },
  {
    id: uniqueId(),
    title: 'Website Management',
    icon: IconDeviceLaptop,
    href: '/',
    children: [
      {
        id: uniqueId(),
        title: 'Url Structure',
        icon: IconPoint,
        href: '/website-management/url-structure',
      },
    ],
  },
  {
    navlabel: true,
    subheader: 'General Settings',
  },
  {
    id: uniqueId(),
    title: 'Notification',
    icon: IconBellPlus,
    href: '/',
    children: [
      // OLD NOTIFICATION SYSTEM - Commented out
      // {
      //   id: uniqueId(),
      //   title: 'Send Notification',
      //   icon: IconPoint,
      //   href: '/sendnotification',
      // },
      // {
      //   id: uniqueId(),
      //   title: 'App Notification',
      //   icon: IconPoint,
      //   href: '/appnotification',
      // },

      // NEW NOTIFICATION SYSTEM - Using new API endpoints
      {
        id: uniqueId(),
        title: 'Send Notification',
        icon: IconPoint,
        href: '/notifications/send',
      },
      {
        id: uniqueId(),
        title: 'Notification History',
        icon: IconPoint,
        href: '/notifications/history',
      },
    ],
  },
  // {
  //   id: uniqueId(),
  //   title: 'On Boarding Screens',
  //   icon: IconDeviceMobile,
  //   href: '/onboardingscreens',
  // },
  {
    id: uniqueId(),
    title: 'Banner Items',
    icon: IconDeviceDesktop,
    href: '/banneritems',
  },
  // {
  //   id: uniqueId(),
  //   title: 'Email Templates',
  //   icon: IconMail,
  //   href: '/emailtemplate',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'CMS Pages',
  //   icon: IconBook,
  //   href: '/cms-pages',
  // },
  {
    id: uniqueId(),
    title: 'Payments',
    icon: IconBuildingBank,
    href: '/',
    children: [
      {
        id: uniqueId(),
        title: 'Drives Payments',
        icon: IconPoint,
        href: '/payments/drivers-payments',
      },
      {
        id: uniqueId(),
        title: 'Drives Payouts',
        icon: IconPoint,
        href: '/payments/drivers-payouts',
      },
      {
        id: uniqueId(),
        title: 'Providers Payments',
        icon: IconPoint,
        href: '/payments/providers-payments',
      },
      {
        id: uniqueId(),
        title: 'Providers Payouts',
        icon: IconPoint,
        href: '/payments/providers-payouts',
      },
      {
        id: uniqueId(),
        title: 'Wallet Transation',
        icon: IconPoint,
        href: '/payments/wallet-transtations',
      },
      {
        id: uniqueId(),
        title: 'Admin Wallet',
        icon: IconPoint,
        href: '/payments/admin-wallet',
      },
      {
        id: uniqueId(),
        title: 'PayOut Requests',
        icon: IconPoint,
        href: '/payments/payouts-request',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Website',
    icon: IconDeviceLaptop,
    href: '/',
    children: [
      {
        id: uniqueId(),
        title: 'Home Page',
        icon: IconPoint,
        href: '/website/homepage',
      },
      {
        id: uniqueId(),
        title: 'About Us',
        icon: IconPoint,
        href: '/website/aboutus',
      },
      {
        id: uniqueId(),
        title: 'Our leadership',
        icon: IconPoint,
        href: '/website/ourvendors',
      },
      {
        id: uniqueId(),
        title: 'Testimonials',
        icon: IconPoint,
        href: '/website/testimonials',
      },
      {
        id: uniqueId(),
        title: 'Blog',
        icon: IconPoint,
        href: '/website/blog',
      },
      {
        id: uniqueId(),
        title: 'App Screens',
        icon: IconPoint,
        href: '/website/appscreens',
      },
      {
        id: uniqueId(),
        title: 'App Download Screen',
        icon: IconPoint,
        href: '/website/app-downloads-screens',
      },
      {
        id: uniqueId(),
        title: 'App Scrolling',
        icon: IconPoint,
        href: '/website/appscrolling',
      },
      {
        id: uniqueId(),
        title: 'Announcements',
        icon: IconPoint,
        href: '/website/Announcements',
      },
      {
        id: uniqueId(),
        title: 'Accept Payments',
        icon: IconPoint,
        href: '/website/accept-payments',
      },
      {
        id: uniqueId(),
        title: 'Website All Headings',
        icon: IconPoint,
        href: '/website/all-modules',
      },
      {
        id: uniqueId(),
        title: 'Enquiry',
        icon: IconPoint,
        href: '/website/enquiry',
      },
    ],
  },

  //website latest 

  // {
  //   id: uniqueId(),
  //   title: 'Website',
  //   icon: IconDeviceLaptop,
  //   href: '/',
  //   children: [

  //     {
  //       id: uniqueId(),
  //       title: 'Testimonials',
  //       icon: IconPoint,
  //       href: '/website/testimonialslatest',
  //     },

  //   ],
  // },


  // download a

  {
    id: uniqueId(),
    title: 'Settings',
    icon: IconSettings,
    href: '/',
    children: [
      {
        id: uniqueId(),
        title: 'Global Settings',
        icon: IconPoint,
        href: '/globalsettings',
      },
      {
        id: uniqueId(),
        title: 'App Settings',
        icon: IconPoint,
        href: '/appSettings',
      },
      // {
      //   id: uniqueId(),
      //   title: 'Bussiness Model Setting',
      //   icon: IconPoint,
      //   href: '/bussinessmodelsettings',
      // },
      // {
      //   id: uniqueId(),
      //   title: 'App Banners',
      //   icon: IconPoint,
      //   href: '/appbanners',
      // },
      // {
      //   id: uniqueId(),
      //   title: 'Currencies',
      //   icon: IconPoint,
      //   href: '/currencies',
      // },
      // {
      //   id: uniqueId(),
      //   title: 'Payment Method',
      //   icon: IconPoint,
      //   href: '/paymentmethod',
      // },
      {
        id: uniqueId(),
        title: 'Radius Configuration',
        icon: IconPoint,
        href: '/radiusconfiguration',
      },
      {
        id: uniqueId(),
        title: 'Tax Setting',
        icon: IconPoint,
        href: '/taxsettings',
      },
      {
        id: uniqueId(),
        title: 'Delivery Charges',
        icon: IconPoint,
        href: '/deliverycharges',
      },
      {
        id: uniqueId(),
        title: 'Refund Policy',
        icon: IconPoint,
        href: '/refund-policy',
      },
      {
        id: uniqueId(),
        title: 'Terms & Conditions',
        icon: IconPoint,
        href: '/terms',
      },
      {
        id: uniqueId(),
        title: 'Privacy Policy',
        icon: IconPoint,
        href: '/privacypolicy',
      },
      {
        id: uniqueId(),
        title: 'Faqs',
        icon: IconPoint,
        href: '/faqs',
      },
    ],
  },
];

export default Menuitems;

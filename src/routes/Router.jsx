// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from '../guards/ProtectedRoute';
import NotProtectedRoute from '../guards/NotProtectedRoute';
import HomeScreenManagement from '../views/OnDemandService/websiteMangement/homeScreenManagement';
import AddHomeScreen from '../views/OnDemandService/websiteMangement/AddHomeScreen';
import EditHomeScreenManagement from '../views/OnDemandService/websiteMangement/EditHomeScreenMangement';
import ViewHomeScreenManagement from '../views/OnDemandService/websiteMangement/ViewHomeScreenManagement';

import categorybanner from "../views/banners/categorybanner"
import CategoryBanner from '../views/banners/categorybanner';
import EditCategoryBanner from "../views/banners/Editbanner"
import ViewBanner from '../views/banners/Viewbanner';
import CreateCategoryBanner from '../views/banners/CreateCategoryBanner';
import ServiceBookingCharges from '../views/Settings/ServiceBookingCharges';
import AssignServiceProviders from '../views/OnDemandService/CrmBookings/AssignServiceProviders';
import { element } from 'prop-types';
import ServiceRequests from '../views/OnDemandService/ServiceRequests';
import ProviderServices from '../views/OnDemandService/ProviderServiceView';
import AddOffer from '../views/banners/Addoffer';
import EditOffer from '../views/banners/Editoffer';
import ProfessionalSubCategory from '../views/ProfessionalServices/ProfessionalSubCategories';
import ProfessionalChildCategory from '../views/ProfessionalServices/ProfessionalChildCatgeories';
import AddProfessionalProvider from '../views/ProfessionalServices/AddProfessionalProvider';
import ProfessionalProvidersList from '../views/ProfessionalServices/ProfessionalProvidersList';
import EditProfessionalProvider from '../views/ProfessionalServices/EditProfessionalProvider';
import ViewProfessionalProvider from '../views/ProfessionalServices/ViewProfessionalProvider';
import ProviderServiceRates from '../views/ProfessionalServices/ProviderServiceRates';
import ProviderServiceAddons from '../views/ProfessionalServices/ProviderServiceAddons';
import ServiceAddons from '../views/Providers/ServiceAddons';
import AllAmenities from '../views/ProfessionalServices/Amenities/AllAmenities';
import AddAmenity from '../views/ProfessionalServices/Amenities/AddAmenity';
import EditAmenity from '../views/ProfessionalServices/Amenities/EditAmenity';
import ViewAmenity from '../views/ProfessionalServices/Amenities/ViewAmenity';
import ProfessionalProviderPendingRequest from '../views/ProfessionalServices/ProfessionalProviderPendingrequest';
import ProfessionalProviders from '../views/ProfessionalServices/ProfessionalProvidersList';
import RejectedProfessionalProviders from '../views/ProfessionalServices/RejectedProfessionalProviders';
import BlockedProfessionalProviders from '../views/ProfessionalServices/BlockedProfessionalProviders';
import DeletedProfessionalProviders from '../views/ProfessionalServices/DeletedProfessionalProviders';
import TeamManagement from '../views/ProfessionalServices/TeamManagement';
import AddTeamMember from '../views/ProfessionalServices/AddTeamMember';
import EditTeamMember from '../views/ProfessionalServices/EditTeamMember';
import ViewTeamMember from '../views/ProfessionalServices/ViewTeamMember';

// Unified Bookings
const BookingsDashboard = Loadable(lazy(() => import('../views/Bookings')));
const BookingsOverview = Loadable(lazy(() => import('../views/Bookings/BookingsDashboard')));
const ExploreApps = Loadable(lazy(() => import('../views/websitelatest/ExploreApps')));
const InstaGallery = Loadable(lazy(() => import('../views/websitelatest/InstaGallery')));
const Services = Loadable(lazy(() => import('../views/websitelatest/Services')));
const LatestBlogs = Loadable(lazy(() => import('../views/websitelatest/Latestblog')));
const AboutUslatest = Loadable(lazy(() => import('../views/websitelatest/AboutUslatest')));

// Verified Partner Orders (New Unified Bookings)
const VerifiedPartnerOrders = Loadable(lazy(() => import('../views/Bookings/VerifiedPartnerOrders')));
const BookingsVerifiedPartnerAll = Loadable(lazy(() => import('../views/Bookings/VerifiedPartnerOrders/AllOrders')));
const BookingsVerifiedPartnerPending = Loadable(lazy(() => import('../views/Bookings/VerifiedPartnerOrders/Pending')));
const BookingsVerifiedPartnerCompleted = Loadable(lazy(() => import('../views/Bookings/VerifiedPartnerOrders/Completed')));
const BookingsVerifiedPartnerCancelled = Loadable(lazy(() => import('../views/Bookings/VerifiedPartnerOrders/Cancelled')));
const BookingsVerifiedPartnerRescheduled = Loadable(lazy(() => import('../views/Bookings/VerifiedPartnerOrders/Rescheduled')));

// Professional Orders (New Unified Bookings)
const ProfessionalOrders = Loadable(lazy(() => import('../views/Bookings/ProfessionalOrders')));
const BookingsProfessionalAll = Loadable(lazy(() => import('../views/Bookings/ProfessionalOrders/AllOrders')));
const BookingsProfessionalPending = Loadable(lazy(() => import('../views/Bookings/ProfessionalOrders/Pending')));
const BookingsProfessionalInProgress = Loadable(lazy(() => import('../views/Bookings/ProfessionalOrders/InProgress')));
const BookingsProfessionalCompleted = Loadable(lazy(() => import('../views/Bookings/ProfessionalOrders/Completed')));
const BookingsProfessionalCancelled = Loadable(lazy(() => import('../views/Bookings/ProfessionalOrders/Cancelled')));

// Order Details
const OrderDetails = Loadable(lazy(() => import('../views/Bookings/OrderDetails')));

// Website Bookings
const CRMWebsiteBookings = Loadable(lazy(() => import('../views/Bookings/CRMWebsiteBookings/CRMWebsiteBookings')));
const CRMWebsiteBookingDetails = Loadable(lazy(() => import('../views/Bookings/CRMWebsiteBookings/CRMWebsiteBookingDetails')));
const WebsiteLeads = Loadable(lazy(() => import('../views/Bookings/WebsiteLeads/WebsiteLeads')));
const WebsiteCityManagement = Loadable(lazy(() => import('../views/Bookings/WebsiteCityManagement/WebsiteCityManagement')));

/* ****Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */

//Dashboard
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Mordern')));

//Locations
const Country = Loadable(lazy(() => import('../views/Locations/Country')));
const District = Loadable(lazy(() => import('../views/Locations/Districts')));
const State = Loadable(lazy(() => import('../views/Locations/States')));
const City = Loadable(lazy(() => import('../views/Locations/City')));

const AddZone = Loadable(lazy(() => import('../views/Locations/AddZone')));
const Zones = Loadable(lazy(() => import('../views/Locations/Zones')));
const EditZone = Loadable(lazy(() => import('../views/Locations/EditZone')));
const ViewZone = Loadable(lazy(() => import('../views/Locations/ViewZone')));

//Services
const Service = Loadable(lazy(() => import('../views/Services/Service')));
const ServiceType = Loadable(lazy(() => import('../views/Services/ServiceType')));

//Knowledge Base
const KnowledgeBase = Loadable(lazy(() => import('../views/KnowledgeBase')));
const CreateKnowledgeBase = Loadable(lazy(() => import('../views/KnowledgeBase/CreateKnowledgeBase')));
const EditKnowledgeBase = Loadable(lazy(() => import('../views/KnowledgeBase/EditKnowledgeBase')));
const ViewKnowledgeBase = Loadable(lazy(() => import('../views/KnowledgeBase/ViewKnowledgeBase')));

//Access Control
const AddRole = Loadable(lazy(() => import('../views/AccessControl/AddRole')));
const EditRole = Loadable(lazy(() => import('../views/AccessControl/EditRole')));
const Roles = Loadable(lazy(() => import('../views/AccessControl/Roles')));
const AdminUsers = Loadable(lazy(() => import('../views/AccessControl/AdminUsers')));

//Users/Customers
const Users = Loadable(lazy(() => import('../views/Users/Users')));
const BlockedUsers = Loadable(lazy(() => import('../views/Users/BlockedUsers')));
const ViewUser = Loadable(lazy(() => import('../views/Users/ViewUser')));
const DeleteUser = Loadable(lazy(() => import('../views/Users/DeleteUsers')));

//Vendors
const Vendor = Loadable(lazy(() => import('../views/Vendors/Vendor')));

//Providers
const AddProvider = Loadable(lazy(() => import('../views/Providers/AddProvider')));
const EditProvider = Loadable(lazy(() => import('../views/Providers/EditProvider')));
const ViewProvider = Loadable(lazy(() => import('../views/Providers/ViewProvider')));
const Providers = Loadable(lazy(() => import('../views/Providers/Providers')));
const PendingServiceProvider = Loadable(
  lazy(() => import('../views/Providers/PendingServiceProvider')),
);
const BlockedServiceProvider = Loadable(
  lazy(() => import('../views/Providers/BlockedServiceProvider')),
);
const RejectServiceProvider = Loadable(
  lazy(() => import('../views/Providers/RejectServiceProvider')),
);
const AllProviders = Loadable(lazy(() => import('../views/Providers/AllProviders')));
const DeletedServiceProvider = Loadable(lazy(() => import('../views/Providers/DeletedServiceProvider')));





const SaleCategory = Loadable(lazy(() => import('../views/OnDemandService/BuySale/SaleCategory')));
const SaleSubCategory = Loadable(
  lazy(() => import('../views/OnDemandService/BuySale/SaleSubCategory')),
);
const SaleRequest = Loadable(lazy(() => import('../views/OnDemandService/BuySale/SaleRequest')));



//banners


const categorybanners = Loadable(lazy(() => import('../views/banners/categorybanner')));

const Offers = Loadable(lazy(() => import('../views/banners/Offers')));





//Categories
const Categories = Loadable(lazy(() => import('../views/Categories/Categories')));
const PendingCategories = Loadable(lazy(() => import('../views/Categories/PendingCategories')));

const PendingSubCategories = Loadable(
  lazy(() => import('../views/Categories/PendingSubCategories')),
);
const SubCategories = Loadable(lazy(() => import('../views/Categories/SubCategories')));






//Orders - Updated with all 28 components we created + 14 new components for OnDemand services



const AddCrmBooking = Loadable(
  lazy(() => import('../views/OnDemandService/CrmBookings/AddCrmBooking')),
);
const CrmBooking = Loadable(lazy(() => import('../views/OnDemandService/CrmBookings/CrmBooking')));

//Verified Partners (7 components) - FIXED
const VerifiedPartnersCrmPending = Loadable(
  lazy(() => import('../views/OnDemandService/CrmBookings/Pending')),
);
const VerifiedPartnersCrmAccepted = Loadable(
  lazy(() => import('../views/OnDemandService/CrmBookings/Accepted')),
);



const VerifiedPartnersCrmWorkInProgress = Loadable(
  lazy(() => import('../views/OnDemandService/CrmBookings/InProgress')),
);
const VerifiedPartnersCrmCompleted = Loadable(
  lazy(() => import('../views/OnDemandService/CrmBookings/Completed')),
);
const VerifiedPartnersCrmCancelled = Loadable(
  lazy(() => import('../views/OnDemandService/CrmBookings/Cancelled')),
);
const VerifiedPartnersCrmRejected = Loadable(
  lazy(() => import('../views/OnDemandService/CrmBookings/Rejected')),
);
const VerifiedPartnerCrmsMissed = Loadable(
  lazy(() => import('../views/OnDemandService/CrmBookings/Missed')),
);
const ViewVerifiedPartnersCrmBookings = Loadable(
  lazy(() => import('../views/OnDemandService/CrmBookings/ViewOrder')),
);



const VerifiedAppointmentsconfirmed = Loadable(
  lazy(() => import('../views/OnDemandService/CrmBookings/Appointmentsconfirmed')),
);


const VerifiedPartnerRescheduled = Loadable(lazy(() => import('../views/OnDemandService/CrmBookings/Rescheduled')))



//offline crm bookings


const OfllineverifiedPartnersCrmAccepted = Loadable(
  lazy(() => import('../views/OnDemandService/OfflineCrmbookings/Accepted')),
);


//Others Services
// On Demand Service

//Verified Partners (7 components) - FIXED
const VerifiedPartnersPending = Loadable(
  lazy(() => import('../views/OnDemandService/VerifiedPartnersBookings/Pending')),
);
const VerifiedPartnersAccepted = Loadable(
  lazy(() => import('../views/OnDemandService/VerifiedPartnersBookings/Accepted')),
);
const VerifiedPartnersWorkInProgress = Loadable(
  lazy(() => import('../views/OnDemandService/VerifiedPartnersBookings/InProgress')),
);
const VerifiedPartnersCompleted = Loadable(
  lazy(() => import('../views/OnDemandService/VerifiedPartnersBookings/Completed')),
);
const VerifiedPartnersCancelled = Loadable(
  lazy(() => import('../views/OnDemandService/VerifiedPartnersBookings/Cancelled')),
);
const VerifiedPartnersRejected = Loadable(
  lazy(() => import('../views/OnDemandService/VerifiedPartnersBookings/Rejected')),
);
const VerifiedPartnersMissed = Loadable(
  lazy(() => import('../views/OnDemandService/VerifiedPartnersBookings/Missed')),
);



//View Orders
const ViewVerifiedPartnersBookings = Loadable(
  lazy(() => import('../views/OnDemandService/VerifiedPartnersBookings/ViewOrder')),
);


const ProviderComplaints = Loadable(
  lazy(() => import('../views/OnDemandService/ProviderComplaints')),
);
const SupportDashboard = Loadable(
  lazy(() => import('../views/OnDemandService/SupportDashboard')),
);
const ReferralDashboard = Loadable(lazy(() => import('../views/Referrals/ReferralDashboard')));
const ReferralTracking = Loadable(lazy(() => import('../views/Referrals/ReferralTracking')));
const ReferralSettings = Loadable(lazy(() => import('../views/Referrals/ReferralSettings')));
const OnDemandSubCategories = Loadable(
  lazy(() => import('../views/OnDemandService/OnDemandSubCategories')),
);
const DemandCategories = Loadable(lazy(() => import('../views/OnDemandService/DemandCategories')));
const OnDemandChildCategories = Loadable(
  lazy(() => import('../views/OnDemandService/OnDemandChildCategories')),
);
const OnDemandCoupons = Loadable(lazy(() => import('../views/OnDemandService/OnDemandCoupons')));
const AddOndemandService = Loadable(
  lazy(() => import('../views/OnDemandService/AddOndemandService')),
);
const OnDemandServices = Loadable(lazy(() => import('../views/OnDemandService/OnDemandServices')));
const ViewOndemandService = Loadable(
  lazy(() => import('../views/OnDemandService/ViewOndemandService')),
);
const OndemandServiceRates = Loadable(
  lazy(() => import('../views/OnDemandService/OndemandServiceRates')),
);
const EditOndemandService = Loadable(
  lazy(() => import('../views/OnDemandService/EditOndemandService')),
);
const AddOnDemandWorkers = Loadable(
  lazy(() => import('../views/OnDemandService/AddOnDemandWorkers')),
);
const OnDemandWorkers = Loadable(lazy(() => import('../views/OnDemandService/OnDemandWorkers')));
const EditOnDemandWorkers = Loadable(
  lazy(() => import('../views/OnDemandService/EditOnDemandWorkers')),
);



// Website Management
const UrlStructure = Loadable(lazy(() => import('../views/WebsiteManagement/UrlStructure')));
const ManageWebsiteScreens = Loadable(lazy(() => import('../views/WebsiteManagement/ManageWebsiteScreens')));
const WebsiteAboutUs = Loadable(lazy(() => import('../views/WebsiteManagement/AboutUs')));
const NavbarManagement = Loadable(lazy(() => import('../views/WebsiteManagement/NavbarManagement')));
const SeoManagement = Loadable(lazy(() => import('../views/WebsiteManagement/SeoManagement')));
const SpaHeroCMS = Loadable(lazy(() => import('../views/WebsiteManagement/SpaHeroCMS')));


// General Settings
//Notification
const AppNotification = Loadable(lazy(() => import('../views/Notifications/AppNotification')));
const SendNotification = Loadable(lazy(() => import('../views/Notifications/SendNotification')));
const SendNotificationNew = Loadable(lazy(() => import('../views/Notifications/SendNotificationNew')));
const NotificationHistory = Loadable(lazy(() => import('../views/Notifications/NotificationHistory')));

//OnBoardingScreens
const OnBoardingScreens = Loadable(lazy(() => import('../views/Settings/OnBoardingScreens')));

//EmailTemplate
const EmailTemplate = Loadable(lazy(() => import('../views/Settings/EmailTemplate')));

//CMSPages
const CMSPages = Loadable(lazy(() => import('../views/Settings/CMSPages')));

//Payments
const DriversPayments = Loadable(lazy(() => import('../views/Payments/DriversPayments')));
const DriversPayouts = Loadable(lazy(() => import('../views/Payments/DriversPayouts')));
const FinanceOverview = Loadable(lazy(() => import('../views/Payments/FinanceOverview')));
const BookingPayments = Loadable(lazy(() => import('../views/Payments/BookingPayments')));
const Withdrawals = Loadable(lazy(() => import('../views/Payments/Withdrawals')));
const Subscriptions = Loadable(lazy(() => import('../views/Payments/Subscriptions')));
const WalletLedger = Loadable(lazy(() => import('../views/Payments/WalletLedger')));
const AdminWalletLedger = Loadable(lazy(() => import('../views/Payments/AdminWalletLedger')));

//Website
const HomePage = Loadable(lazy(() => import('../views/Website/HomePage')));
const AboutUs = Loadable(lazy(() => import('../views/Website/AboutUs')));
const OurVendors = Loadable(lazy(() => import('../views/Website/OurVendors')));
const Testimonials = Loadable(lazy(() => import('../views/Website/Testimonials')));
const AddBlog = Loadable(lazy(() => import('../views/Website/AddBlog')));
const Blog = Loadable(lazy(() => import('../views/Website/Blog')));
const EditBlog = Loadable(lazy(() => import('../views/Website/EditBlog')));
const AppScreens = Loadable(lazy(() => import('../views/Website/AppScreens')));
const Announcements = Loadable(lazy(() => import('../views/Website/Announcements')));
const AllModulesTitles = Loadable(lazy(() => import('../views/Website/AllModulesTitles')));
const AcceptPayments = Loadable(lazy(() => import('../views/Website/AcceptPayments')));
const AppdownloadScreens = Loadable(lazy(() => import('../views/Website/AppdownloadScreens')));
const AppScrolling = Loadable(lazy(() => import('../views/Website/AppScrolling')));
const Enquiry = Loadable(lazy(() => import('../views/Settings/Enquiry')));


//website latest
const Testimonialslatest = Loadable(lazy(() => import('../views/websitelatest/Testimonial')));

// applinks download

const Applinksdownload = Loadable(lazy(() => import('../views/websitelatest/downloadApplinks')))

//social media links

const Socialmedialinks = Loadable(lazy(() => import('../views/websitelatest/Socialmedialinks')));
//joinus
const Joinus = Loadable(lazy(() => import('../views/websitelatest/JoinUs')));


//exploreapps
const exploreourapps = Loadable(lazy(() => import('../views/websitelatest/ExploreApps')));


const instapage = Loadable(lazy(() => import('../views/websitelatest/InstaGallery')));

//bloglatest

const bloglatest = Loadable(lazy(() => import('../views/websitelatest/Latestblog')));

//latestaboutus

const latestAboutus = Loadable(lazy(() => import('../views/websitelatest/AboutUslatest')));



//serviceslatest
const latestservices = Loadable(lazy(() => import('../views/websitelatest/Services')));

//Settings
const GlobalSettings = Loadable(lazy(() => import('../views/Settings/GlobalSettings')));
const AppSettings = Loadable(lazy(() => import('../views/Settings/AppSettings')));
const Faqs = Loadable(lazy(() => import('../views/Settings/Faqs')));
const BussinessModelSettings = Loadable(
  lazy(() => import('../views/Settings/BussinessModelSettings')),
);
const AppBanners = Loadable(lazy(() => import('../views/Settings/AppBanners')));
const BannerItems = Loadable(lazy(() => import('../views/Settings/BannerItems')));
const Currencies = Loadable(lazy(() => import('../views/Settings/Currencies')));
const PaymentMethod = Loadable(lazy(() => import('../views/Settings/PaymentMethod')));
const RadiusConfiguration = Loadable(lazy(() => import('../views/Settings/RadiusConfiguration')));
const TaxSettings = Loadable(lazy(() => import('../views/Settings/TaxSettings')));
const DeliveryCharges = Loadable(lazy(() => import('../views/Settings/DeliveryCharges')));
const SepcialOffer = Loadable(lazy(() => import('../views/Settings/SepcialOffer')));
const ServiceFaqs = Loadable(lazy(() => import('../views/Settings/ServiceFaqs')));
const ServiceRefundPolicy = Loadable(lazy(() => import('../views/Settings/ServiceRefundPolicy')));
const ServicePrivacyPolicy = Loadable(lazy(() => import('../views/Settings/ServicePrivacyPolicy')));
const ServiceTerms = Loadable(lazy(() => import('../views/Settings/ServiceTerms')));
const ServiceShippingPolicy = Loadable(
  lazy(() => import('../views/Settings/ServiceShippingPolicy')),
);
const ShippingPolicy = Loadable(lazy(() => import('../views/Settings/ShippingPolicy')));
const Terms = Loadable(lazy(() => import('../views/Settings/Terms')));
const PrivacyPolicy = Loadable(lazy(() => import('../views/Settings/PrivacyPolicy')));
const CustomsPages = Loadable(lazy(() => import('../views/Settings/CustomsPages')));
const RefundPolicy = Loadable(lazy(() => import('../views/Settings/RefundPolicy')));

//GiftCards
const GiftCards = Loadable(lazy(() => import('../views/Settings/GiftCards')));

//Coupons
const Coupons = Loadable(lazy(() => import('../views/Settings/Coupons')));

//Subscription
const SubscriptionsPlan = Loadable(lazy(() => import('../views/Subscriptions/SubscriptionsPlan')));
const SubscriptionHistory = Loadable(
  lazy(() => import('../views/Subscriptions/SubscriptionHistory')),


);




//UserProfile
const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile')));
const ChangeProfilePassword = Loadable(
  lazy(() => import('../views/apps/user-profile/ChangePassword')),
);

const ProviderServiceRequests = Loadable(lazy(() => import('../views/Providers/ProviderServiceRequests')));

//authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Forgot = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const ChangePassword = Loadable(lazy(() => import('../views/authentication/auth1/ChangePassword')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

//archived crm bookings
const ArchivedCrmBookings = Loadable(
  lazy(() => import('../views/OnDemandService/CrmBookings/ArchivedCrmBookings')),
)



const ProfessionalCategories = Loadable(
  lazy(() => import('../views/ProfessionalServices/ProfessionalCategories'))
)

// Careers
const CareersRoles = Loadable(lazy(() => import('../views/Careers/CareersRoles')));
const CareersJobs = Loadable(lazy(() => import('../views/Careers/CareersJobs')));
const CreateJob = Loadable(lazy(() => import('../views/Careers/CreateJob')));
const CareersApplications = Loadable(lazy(() => import('../views/Careers/CareersApplications')));

// D-Hub Management
const DHubApplications = Loadable(lazy(() => import('../views/Settings/DHubManagement/Applications')));
const DHubPrivacyTerms = Loadable(lazy(() => import('../views/Settings/DHubManagement/PrivacyTerms')));
const DHubFaqs = Loadable(lazy(() => import('../views/Settings/DHubManagement/Faqs')));
const DHubRefundPolicy = Loadable(lazy(() => import('../views/Settings/DHubManagement/RefundPolicy')));


const Router = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },

      //Dashboard
      { path: '/dashboard', exact: true, element: <ModernDash /> },

      //Unified Bookings
      {
        path: '/bookings',
        element: <BookingsDashboard />,
        children: [
          { path: '', element: <BookingsOverview /> },
          { path: 'dashboard', element: <BookingsOverview /> },

          // Verified Partner Routes
          { path: 'verified-partner', element: <Navigate to="/bookings/verified-partner/all" /> },
          { path: 'verified-partner/all', element: <BookingsVerifiedPartnerAll /> },
          { path: 'verified-partner/pending', element: <BookingsVerifiedPartnerAll /> },
          { path: 'verified-partner/payment-pending', element: <BookingsVerifiedPartnerAll /> },
          { path: 'verified-partner/ongoing', element: <BookingsVerifiedPartnerAll /> },
          { path: 'verified-partner/completed', element: <BookingsVerifiedPartnerAll /> },
          { path: 'verified-partner/cancelled', element: <BookingsVerifiedPartnerAll /> },
          { path: 'verified-partner/rescheduled', element: <BookingsVerifiedPartnerAll /> },
          { path: 'verified-partner/missed', element: <BookingsVerifiedPartnerAll /> },
          { path: 'verified-partner/view/:id', element: <OrderDetails /> },

          // Service Center Orders Routes
          { path: 'service-center', element: <Navigate to="/bookings/service-center/all" /> },
          { path: 'service-center/all', element: <BookingsProfessionalAll /> },
          { path: 'service-center/pending', element: <BookingsProfessionalAll /> },
          { path: 'service-center/payment-pending', element: <BookingsProfessionalAll /> },
          { path: 'service-center/in-progress', element: <BookingsProfessionalAll /> },
          { path: 'service-center/completed', element: <BookingsProfessionalAll /> },
          { path: 'service-center/cancelled', element: <BookingsProfessionalAll /> },
          { path: 'service-center/missed', element: <BookingsProfessionalAll /> },
          { path: 'service-center/view/:id', element: <OrderDetails /> },

          // Professional Orders Routes
          { path: 'professional', element: <Navigate to="/bookings/professional/all" /> },
          { path: 'professional/all', element: <BookingsProfessionalAll /> },
          { path: 'professional/pending', element: <BookingsProfessionalAll /> },
          { path: 'professional/payment-pending', element: <BookingsProfessionalAll /> },
          { path: 'professional/in-progress', element: <BookingsProfessionalAll /> },
          { path: 'professional/completed', element: <BookingsProfessionalAll /> },
          { path: 'professional/cancelled', element: <BookingsProfessionalAll /> },
          { path: 'professional/missed', element: <BookingsProfessionalAll /> },
          { path: 'professional/view/:id', element: <OrderDetails /> },

          // CRM Website Routes
          { path: 'crm-website', element: <Navigate to="/bookings/crm-website/all" /> },
          { path: 'crm-website/:status', element: <CRMWebsiteBookings /> },
          { path: 'crm-website/view/:id', element: <CRMWebsiteBookingDetails /> },
          { path: 'website-leads', element: <WebsiteLeads /> },
          { path: 'website-city-management', element: <WebsiteCityManagement /> },
        ]
      },

      //Locations
      { path: '/locations/country', element: <Country /> },
      { path: '/locations/state', element: <State /> },
      { path: '/locations/city', element: <City /> },
      { path: '/locations/district', element: <District /> },
      { path: '/locations/addzone', element: <AddZone /> },
      { path: '/locations/zones', element: <Zones /> },
      { path: '/locations/editzone', element: <EditZone /> },
      { path: '/locations/viewzone', element: <ViewZone /> },

      //Service
      { path: '/services/service', element: <Service /> },
      { path: '/services/servicetype', element: <ServiceType /> },

      //Knowledge Base
      { path: '/knowledge-base', element: <KnowledgeBase /> },
      { path: '/knowledge-base/create', element: <CreateKnowledgeBase /> },
      { path: '/knowledge-base/view/:id', element: <ViewKnowledgeBase /> },
      { path: '/knowledge-base/edit/:id', element: <EditKnowledgeBase /> },

      //Access- Control
      { path: '/access-control/roles', element: <Roles /> },
      { path: '/access-control/addrole', element: <AddRole /> },
      { path: '/access-control/editrole', element: <EditRole /> },
      { path: '/access-control/adminusers', element: <AdminUsers /> },

      //Users
      { path: '/users', element: <Users /> },
      { path: '/blocked-users', element: <BlockedUsers /> },
      { path: '/delete-users', element: <DeleteUser /> },
      { path: '/view-user', element: <ViewUser /> },

      //Vendors
      { path: '/vendor', element: <Vendor /> },

      //Providers
      { path: '/pending-service-provider', element: <PendingServiceProvider /> },
      { path: '/blocked-service-provider', element: <BlockedServiceProvider /> },
      { path: '/reject-service-provider', element: <RejectServiceProvider /> },
      { path: '/all-providers', element: <AllProviders /> },
      { path: '/deleted-service-provider', element: <DeletedServiceProvider /> },

      //Careers
      { path: '/careers/roles', element: <CareersRoles /> },
      { path: '/careers/jobs', element: <CareersJobs /> },
      { path: '/careers/create-job', element: <CreateJob /> },
      { path: '/careers/update-job/:id', element: <CreateJob /> },
      { path: '/careers/applications', element: <CareersApplications /> },
      { path: '/providers', element: <Providers /> },
      { path: '/add-provider', element: <AddProvider /> },
      { path: '/edit-provider', element: <EditProvider /> },
      { path: '/view-provider', element: <ViewProvider /> },













      //Categories
      { path: '/categories', element: <Categories /> },
      { path: '/pending-categories', element: <PendingCategories /> },

      { path: '/sub-categories', element: <SubCategories /> },
      { path: '/pending-sub-categories', element: <PendingSubCategories /> },




      { path: '/add-crm-booking', element: <AddCrmBooking /> },
      { path: '/crm-booking', element: <CrmBooking /> },

      {
        path: '/ondemandservice/verified-partners-crm/pending',
        element: <VerifiedPartnersCrmPending />,
      },
      {
        path: '/ondemandservice/verified-partners-crm/accepted',
        element: <VerifiedPartnersCrmAccepted />,
      },


      {
        path: '/ondemandservice/verified-partners-crm/appointmentconfirmed',
        element: <VerifiedAppointmentsconfirmed />,
      },

      {
        path: '/ondemandservice/verified-partners-crm/appointmentrescheduled',
        element: <VerifiedPartnerRescheduled />,
      },

      {
        path: '/ondemandservice/verified-partners-crm/work-in-progress',
        element: <VerifiedPartnersCrmWorkInProgress />,
      },
      {
        path: '/ondemandservice/verified-partners-crm/completed',
        element: <VerifiedPartnersCrmCompleted />,
      },
      {
        path: '/ondemandservice/verified-partners-crm/cancelled',
        element: <VerifiedPartnersCrmCancelled />,
      },
      {
        path: '/ondemandservice/verified-partners-crm/rejected',
        element: <VerifiedPartnersCrmRejected />,
      },
      {
        path: '/ondemandservice/verified-partners-crm/missed',
        element: <VerifiedPartnerCrmsMissed />,
      },
      {
        path: '/verified-partners-crm/view-order/:orderId',
        element: <ViewVerifiedPartnersCrmBookings />,
      },
      {
        path: '/ondemandservice/verified-partners-crm/archieved-crm-bookings',
        element: <ArchivedCrmBookings />,
      },



      //offlinecrm bookings

      { path: '/offlineverifiedpartnercrmbookings/accepted', element: < OfllineverifiedPartnersCrmAccepted /> },




      //GiftCards
      { path: '/giftcards', element: <GiftCards /> },

      //Coupons
      { path: '/coupons', element: <Coupons /> },

      //Subscription
      { path: '/subscriptionsplan', element: <SubscriptionsPlan /> },
      { path: '/subscriptionhistory', element: <SubscriptionHistory /> },

      //Others Services
      // On Demand Service
      { path: '/ondemandservice/verified-partners/pending', element: <VerifiedPartnersPending /> },
      {
        path: '/ondemandservice/verified-partners/accepted',
        element: <VerifiedPartnersAccepted />,
      },
      {
        path: '/ondemandservice/verified-partners/work-in-progress',
        element: <VerifiedPartnersWorkInProgress />,
      },
      {
        path: '/ondemandservice/verified-partners/completed',
        element: <VerifiedPartnersCompleted />,
      },
      {
        path: '/ondemandservice/verified-partners/cancelled',
        element: <VerifiedPartnersCancelled />,
      },
      {
        path: '/ondemandservice/verified-partners/rejected',
        element: <VerifiedPartnersRejected />,
      },
      { path: '/ondemandservice/verified-partners/missed', element: <VerifiedPartnersMissed /> },



      {
        path: '/verified-partners-crm/assign-providers',
        element: <AssignServiceProviders />,
      }
      ,
      // View verified-partners bookings
      { path: '/verified-partners/view-order/:orderId', element: <ViewVerifiedPartnersBookings /> },




      { path: '/ondemandservice/ondemandsubcategories', element: <OnDemandSubCategories /> },
      { path: '/ondemandservice/ondemandchildcategories', element: <OnDemandChildCategories /> },
      { path: '/ondemandservice/demandcategories', element: <DemandCategories /> },
      { path: '/ondemandservice/ondemandcoupons', element: <OnDemandCoupons /> },

      { path: '/ondemandservice/addondemandservice', element: <AddOndemandService /> },
      { path: '/ondemandservice/viewondemandservice', element: <ViewOndemandService /> },
      { path: '/ondemandservice/ondemandservicerates', element: <OndemandServiceRates /> },
      { path: '/ondemandservice/ondemandservices', element: <OnDemandServices /> },

      { path: '/ondemandservice/ondemandservicerequest', element: <ServiceRequests /> },
      { path: '/ondemandservice/editondemandservice', element: <EditOndemandService /> },

      { path: '/ondemandservice/ondemandservicerequest/singleviewservicerequest/:id', element: <ProviderServices /> },

      { path: '/ondemandservice/addondemandworkers', element: <AddOnDemandWorkers /> },
      { path: '/ondemandservice/ondemandworkers', element: <OnDemandWorkers /> },
      { path: '/ondemandservice/editondemandworkers', element: <EditOnDemandWorkers /> },
      { path: '/ondemandservice/provider-complaints', element: <ProviderComplaints /> },
      { path: '/support-management/dashboard', element: <SupportDashboard /> },
      { path: '/support-management/website-leads', element: <WebsiteLeads /> },
      { path: '/referrals/dashboard', element: <ReferralDashboard /> },
      { path: '/referrals/tracking', element: <ReferralTracking /> },
      { path: '/referrals/settings', element: <ReferralSettings /> },


      //website managemnet


      { path: '/serviceprovider-website/homeScreen/', element: <HomeScreenManagement /> },
      { path: '/serviceprovider-website/addhomeScreen', element: <AddHomeScreen /> },

      { path: '/serviceprovider-website/edit-home-screen', element: <EditHomeScreenManagement /> },
      {
        path: '/serviceprovider-website/viewscreen',
        element: <ViewHomeScreenManagement />,
      }
      ,


      // Website Management
      { path: '/website-management/url-structure', element: <UrlStructure /> },
      { path: '/website-management/manage-screens', element: <ManageWebsiteScreens /> },
      { path: '/website-management/about-us', element: <WebsiteAboutUs /> },
      { path: '/website-management/navbar-management', element: <NavbarManagement /> },
      { path: '/website-management/seo-management', element: <SeoManagement /> },
      { path: '/website-management/spa-hero', element: <SpaHeroCMS /> },


      // General Settings
      //Notification
      { path: '/appnotification', element: <AppNotification /> },
      { path: '/sendnotification', element: <SendNotification /> },
      { path: '/notifications/send', element: <SendNotificationNew /> },
      { path: '/notifications/history', element: <NotificationHistory /> },

      //OnBoardingScreens
      { path: '/onboardingscreens', element: <OnBoardingScreens /> },

      //EmailTemplate
      { path: '/emailtemplate', element: <EmailTemplate /> },

      //CMSPages
      { path: '/cms-pages', element: <CMSPages /> },

      //Payments

      { path: '/payments/overview', element: <FinanceOverview /> },
      { path: '/payments/booking-payments', element: <BookingPayments /> },
      { path: '/payments/wallet-ledger', element: <WalletLedger /> },
      { path: '/payments/admin-wallet', element: <AdminWalletLedger /> },
      { path: '/payments/withdrawals', element: <Withdrawals /> },
      { path: '/payments/subscriptions', element: <Subscriptions /> },
      { path: '/payments/providers-payments', element: <BookingPayments /> },
      { path: '/payments/providers-payouts', element: <Withdrawals /> },
      { path: '/payments/wallet-transtations', element: <WalletLedger /> },
      { path: '/payments/payouts-request', element: <Subscriptions /> },

      //Website
      { path: '/website/homepage', element: <HomePage /> },
      { path: '/website/aboutus', element: <AboutUs /> },
      { path: '/website/ourvendors', element: <OurVendors /> },
      { path: '/website/testimonials', element: <Testimonials /> },
      { path: '/website/addblog', element: <AddBlog /> },
      { path: '/website/editblog', element: <EditBlog /> },
      { path: '/website/viewblog', element: <EditBlog /> },
      { path: '/website/blog', element: <Blog /> },
      { path: '/website/appscreens', element: <AppScreens /> },
      { path: '/website/appscrolling', element: <AppScrolling /> },

      { path: '/website/Announcements', element: <Announcements /> },
      { path: '/website/all-modules', element: <AllModulesTitles /> },
      { path: '/website/accept-payments', element: <AcceptPayments /> },
      { path: '/website/app-downloads-screens', element: <AppdownloadScreens /> },
      { path: '/website/enquiry', element: <Enquiry /> },



      //banner section
      { path: '/advertisments/categorybanners', element: <CategoryBanner /> },

      { path: '/advertisments/offers', element: <Offers /> },
      { path: '/advertisments/categorybanner/create', element: <CreateCategoryBanner /> },
      { path: '/advertisments/category-banner/:id', element: <EditCategoryBanner /> },
      { path: '/advertisments/categorybanner/:id', element: <ViewBanner /> },

      { path: '/advertisments/addoffer', element: <AddOffer /> },

      {
        path: '/offers/editoffer/:id',
        element: <EditOffer />,
      },




      //website latest
      //website latest
      { path: '/website/testimonialslatest', element: <Testimonialslatest /> },

      // apps downoad links
      { path: '/website/downloadapplinks', element: <Applinksdownload /> },

      //social media links\
      { path: '/website/socailmedialinks', element: <Socialmedialinks /> },

      //join us

      { path: '/website/joinus', element: <Joinus /> },

      //Explore apps


      { path: '/website/exploreourapps', element: <ExploreApps /> },

      //instapage
      { path: '/website/instapage', element: <InstaGallery /> },


      //latest services 
      { path: '/website/serviceslatest', element: <Services /> },


      //latetst blog 

      { path: '/website/bloglatest', element: <LatestBlogs /> },

      //latestAboutus

      { path: '/website/latestaboutus', element: <AboutUslatest /> },


      //Settings
      { path: '/globalsettings', element: <GlobalSettings /> },
      { path: '/appSettings', element: <AppSettings /> },
      { path: '/faqs', element: <Faqs /> },
      { path: '/bussinessmodelsettings', element: <BussinessModelSettings /> },
      { path: '/appbanners', element: <AppBanners /> },
      { path: '/banneritems', element: <BannerItems /> },
      { path: '/currencies', element: <Currencies /> },
      { path: '/paymentmethod', element: <PaymentMethod /> },
      { path: '/radiusconfiguration', element: <RadiusConfiguration /> },
      { path: '/taxsettings', element: <TaxSettings /> },
      { path: '/deliverycharges', element: <DeliveryCharges /> },
      { path: '/servicebookingcharges', element: <ServiceBookingCharges /> },
      { path: '/sepcialoffer', element: <SepcialOffer /> },
      { path: '/terms', element: <Terms /> },
      { path: '/privacypolicy', element: <PrivacyPolicy /> },
      { path: '/customspages', element: <CustomsPages /> },
      { path: '/shipping-policy', element: <ShippingPolicy /> },
      { path: '/service-shipping-policy', element: <ServiceShippingPolicy /> },
      { path: '/service-terms', element: <ServiceTerms /> },
      { path: '/service-privacy-policy', element: <ServicePrivacyPolicy /> },
      { path: '/service-refund-policy', element: <ServiceRefundPolicy /> },
      { path: '/service-faqs', element: <ServiceFaqs /> },

      // Policies Management (formerly D-Hub Management)
      { path: '/policies-management/applications', element: <DHubApplications /> },
      { path: '/policies-management/privacy-terms', element: <DHubPrivacyTerms /> },
      { path: '/policies-management/faqs', element: <DHubFaqs /> },
      { path: '/policies-management/refund-policy', element: <DHubRefundPolicy /> },


      //User-Profile
      { path: '/user-profile', element: <UserProfile /> },
      { path: '/change-password', element: <ChangeProfilePassword /> },


      //professional services
      { path: '/professional-categories', element: <ProfessionalCategories /> },
      { path: '/professional-subcategories', element: <ProfessionalSubCategory /> },
      { path: '/professional-childcategories', element: <ProfessionalChildCategory /> },


      { path: '/AllprofessionalProviders', element: <ProfessionalProvidersList /> },

      { path: '/Addprofessional-providers', element: <AddProfessionalProvider /> },

      { path: '/edit-professional-provider/:id', element: <EditProfessionalProvider /> },
      { path: '/view-professional-provider/:id', element: <ViewProfessionalProvider /> },

      { path: '/provider-service-rates', element: <ProviderServiceRates /> },
      { path: '/provider-service-addons', element: <ProviderServiceAddons /> },

      { path: '/team-management', element: <TeamManagement /> },
      { path: '/add-team-member', element: <AddTeamMember /> },
      { path: '/edit-team-member/:id', element: <EditTeamMember /> },
      { path: '/view-team-member/:id', element: <ViewTeamMember /> },



      { path: '/service-requests', element: <ProviderServiceRequests /> },

      { path: '/service-addons', element: <ServiceAddons /> },

      { path: '/pendingprofessionalserviceproviderrequest', element: <ProfessionalProviderPendingRequest /> },

      {
        path: '/rejectedProfessionalProvider',
        element: <RejectedProfessionalProviders />,
      },


      {
        path: '/BlockedProfessionalProvider',
        element: <BlockedProfessionalProviders />,
      },

      {
        path: '/DeletedProfessionalProvider',
        element: <DeletedProfessionalProviders />,
      },

      {
        path: '/amenities',
        element: <AllAmenities />,
      },
      {
        path: '/amenities/add',
        element: <AddAmenity />,
      },
      {
        path: '/amenities/edit/:id',
        element: <EditAmenity />,
      },
      {
        path: '/amenities/view/:id',
        element: <ViewAmenity />,
      },

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: (
      <NotProtectedRoute>
        <BlankLayout />
      </NotProtectedRoute>
    ),
    children: [
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/forgot-password', element: <Forgot /> },
      { path: '/auth/two-steps', element: <TwoSteps /> },
      { path: '/auth/change-password', element: <ChangePassword /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);
export default router;

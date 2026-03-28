// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from '../guards/ProtectedRoute';
import NotProtectedRoute from '../guards/NotProtectedRoute';
import ExploreApps from '../views/websitelatest/ExploreApps';
import InstaGallery from '../views/websitelatest/InstaGallery';
import Services from '../views/websitelatest/Services';
import LatestBlogs from '../views/websitelatest/Latestblog'
import AboutUslatest from '../views/websitelatest/AboutUslatest'
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

//ECommerce / Multivendor
//Stores
const AddStore = Loadable(lazy(() => import('../views/Stores/AddStore')));
const EditStore = Loadable(lazy(() => import('../views/Stores/EditStore')));
const Store = Loadable(lazy(() => import('../views/Stores/Stores')));
const ViewStore = Loadable(lazy(() => import('../views/Stores/ViewStore')));
const BlockedStores = Loadable(lazy(() => import('../views/Stores/BlockedStores')));
const PendingStores = Loadable(lazy(() => import('../views/Stores/PendingStores')));

//Drivers
const AddDriver = Loadable(lazy(() => import('../views/Drivers/AddDriver')));
const Drivers = Loadable(lazy(() => import('../views/Drivers/Drivers')));
const EditDriver = Loadable(lazy(() => import('../views/Drivers/EditDriver')));
const ViewDriver = Loadable(lazy(() => import('../views/Drivers/ViewDriver')));
const BlockedDeliveryPartners = Loadable(
  lazy(() => import('../views/Drivers/BlockedDeliveryPartners')),
);

//Shopping
const ShoppingCategories = Loadable(lazy(() => import('../views/Shopping/ShoppingCategories')));
const ShoppingSubCategories = Loadable(
  lazy(() => import('../views/Shopping/ShoppingSubCategories')),
);
const AddShoppingItem = Loadable(lazy(() => import('../views/Shopping/AddShoppingItem')));
const EditShoppingItem = Loadable(lazy(() => import('../views/Shopping/EditShoppingItem')));
const ShoppingItem = Loadable(lazy(() => import('../views/Shopping/ShoppingItem')));
const ShoppingItemRequest = Loadable(lazy(() => import('../views/Shopping/ShoppingItemRequest')));
const ViewShoppingItem = Loadable(lazy(() => import('../views/Shopping/ViewShoppingItem')));
const CountryOriginType = Loadable(lazy(() => import('../views/Shopping/CountryOriginType')));
const NeckType = Loadable(lazy(() => import('../views/Shopping/NeckType')));
const FitType = Loadable(lazy(() => import('../views/Shopping/FitType')));
const MaterialType = Loadable(lazy(() => import('../views/Shopping/MaterialType')));
const ProductTypes = Loadable(lazy(() => import('../views/Shopping/ProductTypes')));
const RamType = Loadable(lazy(() => import('../views/Shopping/RamType')));
const ShoppingColor = Loadable(lazy(() => import('../views/Shopping/ShoppingColor')));
const SizeType = Loadable(lazy(() => import('../views/Shopping/SizeType')));
const SleeveType = Loadable(lazy(() => import('../views/Shopping/SleeveTypes')));
const StorageType = Loadable(lazy(() => import('../views/Shopping/StorageType')));
const OperatingSystem = Loadable(lazy(() => import('../views/Shopping/OperatingSystem')));
const Shoppingbrand = Loadable(lazy(() => import('../views/Shopping/Shoppingbrand')));
const ShoppingWeight = Loadable(lazy(() => import('../views/Shopping/ShoppingWeight')));
const ShoppingChildCategories = Loadable(
  lazy(() => import('../views/Shopping/ShoppingChildCategories')),
);

const SaleCategory = Loadable(lazy(() => import('../views/OnDemandService/BuySale/SaleCategory')));
const SaleSubCategory = Loadable(
  lazy(() => import('../views/OnDemandService/BuySale/SaleSubCategory')),
);
const SaleRequest = Loadable(lazy(() => import('../views/OnDemandService/BuySale/SaleRequest')));

//Medicine
const MedicineCategories = Loadable(lazy(() => import('../views/Medicine/MedicineCategories')));
const MedicineSubCategories = Loadable(
  lazy(() => import('../views/Medicine/MedicineSubCategories')),
);
const AddMedicineItem = Loadable(lazy(() => import('../views/Medicine/AddMedicineItem')));
const EditMedicineItem = Loadable(lazy(() => import('../views/Medicine/EditMedicineItem')));
const MedicineItem = Loadable(lazy(() => import('../views/Medicine/MedicineItem')));
const MedicineItemRequest = Loadable(lazy(() => import('../views/Medicine/MedicineItemRequest')));
const ViewMedicineItem = Loadable(lazy(() => import('../views/Medicine/ViewMedicineItem')));
const MedicineForm = Loadable(lazy(() => import('../views/Medicine/MedicineForm')));
const PackingTypes = Loadable(lazy(() => import('../views/Medicine/PackingTypes')));
const TherapeuticClass = Loadable(lazy(() => import('../views/Medicine/TherapeuticClass')));
const DrugCategories = Loadable(lazy(() => import('../views/Medicine/DrugCategories')));
const MedicineBrands = Loadable(lazy(() => import('../views/Medicine/MedicineBrands')));
const MedicineUnits = Loadable(lazy(() => import('../views/Medicine/MedicineUnits')));
const MedicineWeight = Loadable(lazy(() => import('../views/Medicine/MedicineWeight')));
const MedicineChildCategories = Loadable(
  lazy(() => import('../views/Medicine/MedicineChildCategories')),
);


//banners


const categorybanners = Loadable(lazy(() => import('../views/banners/categorybanner')));

const Offers = Loadable(lazy(() => import('../views/banners/Offers')));

//Grocery
const GroceryCategories = Loadable(lazy(() => import('../views/Grocerys/GrocerysCategories')));
const GrocerySubCategories = Loadable(
  lazy(() => import('../views/Grocerys/GrocerysSubCategories')),
);
const AddGrocerysItem = Loadable(lazy(() => import('../views/Grocerys/AddGrocerysItem')));
const EditGrocerysItem = Loadable(lazy(() => import('../views/Grocerys/EditGrocerysItem')));
const GrocerysItem = Loadable(lazy(() => import('../views/Grocerys/GrocerysItem')));
const ViewGrocerysItem = Loadable(lazy(() => import('../views/Grocerys/ViewGrocerysItem')));
const GrocerysItemRequest = Loadable(lazy(() => import('../views/Grocerys/GrocerysItemRequest')));
const GrocerysBrand = Loadable(lazy(() => import('../views/Grocerys/GrocerysBrand')));
const GrocerysWeight = Loadable(lazy(() => import('../views/Grocerys/GrocerysWeight')));
const GrocerysUnits = Loadable(lazy(() => import('../views/Grocerys/GrocerysUnits')));
const GrocerysChildCategories = Loadable(
  lazy(() => import('../views/Grocerys/GrocerysChildCategories')),
);
const Flavour = Loadable(lazy(() => import('../views/Grocerys/Flavour')));
const GrocerysCategoriesRequest = Loadable(
  lazy(() => import('../views/Grocerys/GrocerysCategoriesRequest')),
);
const GrocerysSubCategoriesRequest = Loadable(
  lazy(() => import('../views/Grocerys/GrocerysSubCategoriesRequest')),
);

const ShoppingCategoriesRequest = Loadable(
  lazy(() => import('../views/Shopping/ShoppingCategoriesRequest')),
);
const ShoppingSubCategoriesRequest = Loadable(
  lazy(() => import('../views/Shopping/ShoppingSubCategoriesRequest')),
);

const FoodCategoriesRquest = Loadable(lazy(() => import('../views/Food/FoodCategoriesRquest')));
const FoodSubCategoriesRequest = Loadable(
  lazy(() => import('../views/Food/FoodSubCategoriesRequest')),
);

const MedicineCategoriesRequest = Loadable(
  lazy(() => import('../views/Medicine/MedicineCategoriesRequest')),
);
const MedicineSubCategoriesRequest = Loadable(
  lazy(() => import('../views/Medicine/MedicineSubCategoriesRequest')),
);

//Food
const FoodCategories = Loadable(lazy(() => import('../views/Food/FoodCategories')));
const FoodSubCategories = Loadable(lazy(() => import('../views/Food/FoodSubCategories')));
const AddFoodItem = Loadable(lazy(() => import('../views/Food/AddFoodItem')));
const EditFoodItem = Loadable(lazy(() => import('../views/Food/EditFoodItem')));
const FoodItem = Loadable(lazy(() => import('../views/Food/FoodItem')));
const FoodItemRequest = Loadable(lazy(() => import('../views/Food/FoodItemRequest')));
const ViewFoodItem = Loadable(lazy(() => import('../views/Food/ViewFoodItem')));
const CuisineType = Loadable(lazy(() => import('../views/Food/CuisineType')));
const FoodChildCategory = Loadable(lazy(() => import('../views/Food/FoodChildCategory')));

//Ecommerce Complaints
const EcommerceComplaints = Loadable(lazy(() => import('../views/Categories/Complaints')));
const ViewComplaints = Loadable(lazy(() => import('../views/Categories/ViewComplaints')));
const ViewProviderComplaints = Loadable(
  lazy(() => import('../views/OnDemandService/ViewProviderComplaints')),
);

//Categories
const Categories = Loadable(lazy(() => import('../views/Categories/Categories')));
const PendingCategories = Loadable(lazy(() => import('../views/Categories/PendingCategories')));

const PendingSubCategories = Loadable(
  lazy(() => import('../views/Categories/PendingSubCategories')),
);
const SubCategories = Loadable(lazy(() => import('../views/Categories/SubCategories')));
const Attributes = Loadable(
  lazy(() => import('../views/EcommerceOrders/ProductManagement/Attributes')),
);
const AttributesValues = Loadable(
  lazy(() => import('../views/EcommerceOrders/ProductManagement/AttributesValues')),
);
const Prices = Loadable(lazy(() => import('../views/EcommerceOrders/ProductManagement/Prices')));
const PricesValues = Loadable(
  lazy(() => import('../views/EcommerceOrders/ProductManagement/PriceValues')),
);

//Brands
const Units = Loadable(lazy(() => import('../views/EcommerceOrders/ProductManagement/Units')));
const Brands = Loadable(lazy(() => import('../views/EcommerceOrders/ProductManagement/Brands')));
const AddProduct = Loadable(
  lazy(() => import('../views/EcommerceOrders/ProductManagement/AddProduct')),
);
const Products = Loadable(
  lazy(() => import('../views/EcommerceOrders/ProductManagement/Products')),
);
const EditProduct = Loadable(
  lazy(() => import('../views/EcommerceOrders/ProductManagement/EditProduct')),
);
const ViewProduct = Loadable(
  lazy(() => import('../views/EcommerceOrders/ProductManagement/ViewProduct')),
);
const Specifications = Loadable(
  lazy(() => import('../views/EcommerceOrders/ProductManagement/Specifications')),
);
const SpecificationValues = Loadable(
  lazy(() => import('../views/EcommerceOrders/ProductManagement/SpecificationValues')),
);

//PopularDestinations
const PopularDestinations = Loadable(
  lazy(() => import('../views/PopularDestination/PopularDestinations')),
);

//Attributes
const Itemattribute = Loadable(lazy(() => import('../views/Attributes/Itemattribute')));
const ReviewAttributes = Loadable(lazy(() => import('../views/Attributes/ReviewAttributes')));

//Reports
const SalesReport = Loadable(lazy(() => import('../views/Reports/SalesReport')));

//Items
const AddItem = Loadable(lazy(() => import('../views/Items/AddItem')));
const Items = Loadable(lazy(() => import('../views/Items/Items')));
const EditItem = Loadable(lazy(() => import('../views/Items/EditItem')));

//Orders - Updated with all 28 components we created + 14 new components for OnDemand services

//E-Commerce (7 components)
const ECommercePending = Loadable(lazy(() => import('../views/EcommerceOrders/Ecommerce/Pending')));
const ECommerceAccepted = Loadable(
  lazy(() => import('../views/EcommerceOrders/Ecommerce/Accepted')),
);
const ECommerceWorkInProgress = Loadable(
  lazy(() => import('../views/EcommerceOrders/Ecommerce/InProgress')),
);
const ECommerceCompleted = Loadable(
  lazy(() => import('../views/EcommerceOrders/Ecommerce/Completed')),
);
const ECommerceCancelled = Loadable(
  lazy(() => import('../views/EcommerceOrders/Ecommerce/Cancelled')),
);
const ECommerceRejected = Loadable(
  lazy(() => import('../views/EcommerceOrders/Ecommerce/Rejected')),
);
const ECommerceMissed = Loadable(lazy(() => import('../views/EcommerceOrders/Ecommerce/Missed')));

//Medicines (7 components)
const MedicinesPending = Loadable(lazy(() => import('../views/EcommerceOrders/Medicine/Pending')));
const MedicinesAccepted = Loadable(
  lazy(() => import('../views/EcommerceOrders/Medicine/Accepted')),
);
const MedicinesWorkInProgress = Loadable(
  lazy(() => import('../views/EcommerceOrders/Medicine/InProgress')),
);
const MedicinesCompleted = Loadable(
  lazy(() => import('../views/EcommerceOrders/Medicine/Completed')),
);
const MedicinesCancelled = Loadable(
  lazy(() => import('../views/EcommerceOrders/Medicine/Cancelled')),
);
const MedicinesRejected = Loadable(
  lazy(() => import('../views/EcommerceOrders/Medicine/Rejected')),
);
const MedicinesMissed = Loadable(lazy(() => import('../views/EcommerceOrders/Medicine/Missed')));

//Grocery (7 components)
const GroceryPending = Loadable(lazy(() => import('../views/EcommerceOrders/Grocery/Pending')));
const GroceryAccepted = Loadable(lazy(() => import('../views/EcommerceOrders/Grocery/Accepted')));
const GroceryWorkInProgress = Loadable(
  lazy(() => import('../views/EcommerceOrders/Grocery/InProgress')),
);
const GroceryCompleted = Loadable(lazy(() => import('../views/EcommerceOrders/Grocery/Completed')));
const GroceryCancelled = Loadable(lazy(() => import('../views/EcommerceOrders/Grocery/Cancelled')));
const GroceryRejected = Loadable(lazy(() => import('../views/EcommerceOrders/Grocery/Rejected')));
const GroceryMissed = Loadable(lazy(() => import('../views/EcommerceOrders/Grocery/Missed')));

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
//Food (7 components)
const FoodPending = Loadable(lazy(() => import('../views/EcommerceOrders/Food/Pending')));
const FoodAccepted = Loadable(lazy(() => import('../views/EcommerceOrders/Food/Accepted')));
const FoodWorkInProgress = Loadable(lazy(() => import('../views/EcommerceOrders/Food/InProgress')));
const FoodCompleted = Loadable(lazy(() => import('../views/EcommerceOrders/Food/Completed')));
const FoodCancelled = Loadable(lazy(() => import('../views/EcommerceOrders/Food/Cancelled')));
const FoodRejected = Loadable(lazy(() => import('../views/EcommerceOrders/Food/Rejected')));
const FoodMissed = Loadable(lazy(() => import('../views/EcommerceOrders/Food/Missed')));

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

//Near By Shops (7 components) - FIXED
const NearbyShopsPending = Loadable(
  lazy(() => import('../views/OnDemandService/NearByShops/Pending')),
);
const NearbyShopsAccepted = Loadable(
  lazy(() => import('../views/OnDemandService/NearByShops/Accepted')),
);
const NearbyShopsWorkInProgress = Loadable(
  lazy(() => import('../views/OnDemandService/NearByShops/InProgress')),
);
const NearbyShopsCompleted = Loadable(
  lazy(() => import('../views/OnDemandService/NearByShops/Completed')),
);
const NearbyShopsCancelled = Loadable(
  lazy(() => import('../views/OnDemandService/NearByShops/Cancelled')),
);
const NearbyShopsRejected = Loadable(
  lazy(() => import('../views/OnDemandService/NearByShops/Rejected')),
);
const NearbyShopsMissed = Loadable(
  lazy(() => import('../views/OnDemandService/NearByShops/Missed')),
);

//View Orders
const ViewVerifiedPartnersBookings = Loadable(
  lazy(() => import('../views/OnDemandService/VerifiedPartnersBookings/ViewOrder')),
);

const ViewNearByShopBookings = Loadable(
  lazy(() => import('../views/OnDemandService/NearByShops/ViewOrder')),
);

const OnDemandBookingsShop = Loadable(
  lazy(() => import('../views/OnDemandService/OnDemandBookingsShop')),
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

//ParcelService
const ParcelGoodsEye = Loadable(lazy(() => import('../views/ParcelServices/ParcelGoodsEye')));
const ParcelCategory = Loadable(lazy(() => import('../views/ParcelServices/ParcelCategory')));
const ParcelWeight = Loadable(lazy(() => import('../views/ParcelServices/ParcelWeight')));
const ParcelOrder = Loadable(lazy(() => import('../views/ParcelServices/ParcelOrder')));
const ParcelCoupon = Loadable(lazy(() => import('../views/ParcelServices/ParcelCoupon')));

// Cab Service
const CabPromo = Loadable(lazy(() => import('../views/CabService/CabPromo')));
const CabVehicleType = Loadable(lazy(() => import('../views/CabService/CabVehicleType')));
const CabGoodsEye = Loadable(lazy(() => import('../views/CabService/CabGoodsEye')));
const CabComplaints = Loadable(lazy(() => import('../views/CabService/CabComplaints')));
const CabSosRiders = Loadable(lazy(() => import('../views/CabService/CabSosRiders')));
const CabRiders = Loadable(lazy(() => import('../views/CabService/CabRiders')));

//Rental Service
const RentalGoodsEye = Loadable(lazy(() => import('../views/RentalServices/RentalGoodsEye')));
const RentalVehicleType = Loadable(lazy(() => import('../views/RentalServices/RentalVehicleType')));
const RentalType = Loadable(lazy(() => import('../views/RentalServices/RentalType')));
const RentalDiscount = Loadable(lazy(() => import('../views/RentalServices/RentalDiscount')));
const RentalOrders = Loadable(lazy(() => import('../views/RentalServices/RentalOrders')));
const RentalVehicles = Loadable(lazy(() => import('../views/RentalServices/RentalVehicles')));

//Vehicle Settings
const Make = Loadable(lazy(() => import('../views/VechileSettings/Make')));
const Model = Loadable(lazy(() => import('../views/VechileSettings/Model')));

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
const StorePayments = Loadable(lazy(() => import('../views/Payments/StorePayments')));
const StorePayouts = Loadable(lazy(() => import('../views/Payments/StorePayouts')));
const WalletLedger = Loadable(lazy(() => import('../views/Payments/WalletLedger')));

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

const ShopVariationG = Loadable(lazy(() => import('../views/Grocerys/shopVariation')));
const SubShopVariationG = Loadable(lazy(() => import('../views/Grocerys/SubShopVariation')));

//Shop Vairations
const ShopVariation = Loadable(lazy(() => import('../views/Shopping/shopVariation')));
const SubShopVariation = Loadable(lazy(() => import('../views/Shopping/SubShopVariation')));
const AddShoppingProduct = Loadable(lazy(() => import('../views/Shopping/AddShoppingProduct')));
const EditShoppingProduct = Loadable(lazy(() => import('../views/Shopping/EditShoppingProduct')));


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

      //Store
      { path: '/addstore', element: <AddStore /> },
      { path: '/stores', element: <Store /> },
      { path: '/editstore', element: <EditStore /> },
      { path: '/viewstore', element: <ViewStore /> },
      { path: '/blocked-stores', element: <BlockedStores /> },
      { path: '/pending-stores', element: <PendingStores /> },

      //Drivers
      { path: '/add-driver', element: <AddDriver /> },
      { path: '/drivers', element: <Drivers /> },
      { path: '/edit-driver/:id', element: <EditDriver /> },
      { path: '/view-driver/:id', element: <ViewDriver /> },
      { path: '/blocked-delivery-partners', element: <BlockedDeliveryPartners /> },

      { path: '/specifications', element: <Specifications /> },
      { path: '/specification-values', element: <SpecificationValues /> },


      { path: '/shop-variation-grocery', element: <ShopVariationG /> },
      { path: '/sub-shop-variation-grocery', element: <SubShopVariationG /> },
      //Shopping
      { path: '/shopping-categories', element: <ShoppingCategories /> },
      { path: '/shopping-subcategories', element: <ShoppingSubCategories /> },
      { path: '/add-shopping-item', element: <AddShoppingItem /> },
      { path: '/edit-shopping-item', element: <EditShoppingItem /> },
      { path: '/shopping-item', element: <ShoppingItem /> },
      { path: '/view-shopping-item', element: <ViewShoppingItem /> },
      { path: '/country-origin-type', element: <CountryOriginType /> },
      { path: '/neck-type', element: <NeckType /> },
      { path: '/fit-type', element: <FitType /> },
      { path: '/material-type', element: <MaterialType /> },
      { path: '/product-types', element: <ProductTypes /> },
      { path: '/ram-type', element: <RamType /> },
      { path: '/shopping-color', element: <ShoppingColor /> },
      { path: '/size-type', element: <SizeType /> },
      { path: '/sleeve-type', element: <SleeveType /> },
      { path: '/storage-type', element: <StorageType /> },
      { path: '/operating-system', element: <OperatingSystem /> },
      { path: '/shopping-brand', element: <Shoppingbrand /> },
      { path: '/shopping-weight', element: <ShoppingWeight /> },
      { path: '/shopping-child-categories', element: <ShoppingChildCategories /> },
      { path: '/shopping-categories-request', element: <ShoppingCategoriesRequest /> },
      { path: '/shopping-sub-categories-request', element: <ShoppingSubCategoriesRequest /> },
      { path: '/shopping-item-request', element: <ShoppingItemRequest /> },
      { path: '/sale-sub-category', element: <SaleSubCategory /> },
      { path: '/sale-category', element: <SaleCategory /> },
      { path: '/sale-request', element: <SaleRequest /> },

      //ShoppingVairations
      { path: '/shop-variation', element: <ShopVariation /> },
      { path: '/sub-shop-variation', element: <SubShopVariation /> },
      { path: '/add-shopping-product', element: <AddShoppingProduct /> },
      { path: '/Edit-shopping-product', element: <EditShoppingProduct /> },



      //Medicine
      { path: '/medicine-categories', element: <MedicineCategories /> },
      { path: '/medicine-subcategories', element: <MedicineSubCategories /> },
      { path: '/add-medicine-item', element: <AddMedicineItem /> },
      { path: '/edit-medicine-item', element: <EditMedicineItem /> },
      { path: '/medicine-item', element: <MedicineItem /> },
      { path: '/view-medicine-Item', element: <ViewMedicineItem /> },
      { path: '/medicine-form', element: <MedicineForm /> },
      { path: '/packing-types', element: <PackingTypes /> },
      { path: '/therapeutic-class', element: <TherapeuticClass /> },
      { path: '/drug-categories', element: <DrugCategories /> },
      { path: '/medicine-brands', element: <MedicineBrands /> },
      { path: '/medicine-units', element: <MedicineUnits /> },
      { path: '/medicine-weight', element: <MedicineWeight /> },
      { path: '/medicine-child-categories', element: <MedicineChildCategories /> },
      { path: '/medicine-categories-request', element: <MedicineCategoriesRequest /> },
      { path: '/medicine-sub-categories-request', element: <MedicineSubCategoriesRequest /> },
      { path: '/medicine-item-request', element: <MedicineItemRequest /> },

      //Grocery
      { path: '/grocery-categories', element: <GroceryCategories /> },
      { path: '/grocery-subcategories', element: <GrocerySubCategories /> },
      { path: '/add-grocerys-Item', element: <AddGrocerysItem /> },
      { path: '/edit-grocerys-Item', element: <EditGrocerysItem /> },
      { path: '/grocerys-item', element: <GrocerysItem /> },
      { path: '/view-grocery-item', element: <ViewGrocerysItem /> },
      { path: '/grocerys-brand', element: <GrocerysBrand /> },
      { path: '/grocerys-weight', element: <GrocerysWeight /> },
      { path: '/grocery-units', element: <GrocerysUnits /> },
      { path: '/grocerys-child-categories', element: <GrocerysChildCategories /> },
      { path: '/grocerys-categories-request', element: <GrocerysCategoriesRequest /> },
      { path: '/flavour', element: <Flavour /> },
      { path: '/grocerys-sub-categories-request', element: <GrocerysSubCategoriesRequest /> },
      { path: '/grocerys-item-request', element: <GrocerysItemRequest /> },

      //Food
      { path: '/food-categories', element: <FoodCategories /> },
      { path: '/food-subcategories', element: <FoodSubCategories /> },
      { path: '/food-child-category', element: <FoodChildCategory /> },
      { path: '/add-food-item', element: <AddFoodItem /> },
      { path: '/edit-food-item', element: <EditFoodItem /> },
      { path: '/food-item', element: <FoodItem /> },
      { path: '/view-food-item', element: <ViewFoodItem /> },
      { path: '/cuisine-type', element: <CuisineType /> },
      { path: '/food-categories-request', element: <FoodCategoriesRquest /> },
      { path: '/food-sub-categories-request', element: <FoodSubCategoriesRequest /> },
      { path: '/food-item-request', element: <FoodItemRequest /> },

      //Categories
      { path: '/categories', element: <Categories /> },
      { path: '/pending-categories', element: <PendingCategories /> },

      { path: '/sub-categories', element: <SubCategories /> },
      { path: '/pending-sub-categories', element: <PendingSubCategories /> },

      { path: '/categories', element: <Categories /> },
      { path: '/pending-categories', element: <PendingCategories /> },

      { path: '/sub-categories', element: <SubCategories /> },
      { path: '/pending-sub-categories', element: <PendingSubCategories /> },

      { path: '/units', element: <Units /> },
      { path: '/addproduct', element: <AddProduct /> },
      { path: '/editproduct', element: <EditProduct /> },
      { path: '/viewproduct', element: <ViewProduct /> },

      { path: '/products', element: <Products /> },
      { path: '/specifications', element: <Specifications /> },
      { path: '/specification-values', element: <SpecificationValues /> },

      { path: '/attributes', element: <Attributes /> },
      { path: '/attributes-values', element: <AttributesValues /> },

      { path: '/prices', element: <Prices /> },
      { path: '/prices-values', element: <PricesValues /> },

      //Brands
      { path: '/brand', element: <Brands /> },

      //EcommerceComplaints
      { path: '/ecommerce-complaints', element: <EcommerceComplaints /> },

      // View complaints
      { path: '/view-complaints', element: <ViewComplaints /> },
      { path: '/view-provider-complaints', element: <ViewProviderComplaints /> },

      //Brands
      { path: '/brands', element: <Brands /> },

      //PopularDestinations
      { path: '/populardestinations', element: <PopularDestinations /> },

      //Attributions
      { path: '/itemattribute', element: <Itemattribute /> },
      { path: '/reviewattributes', element: <ReviewAttributes /> },

      //Reports
      { path: '/salesreport', element: <SalesReport /> },

      //Items
      { path: '/add-item', element: <AddItem /> },
      { path: '/items', element: <Items /> },
      { path: '/edit-item', element: <EditItem /> },

      //Orders - Updated with all our new components
      //E-commerce (7 complete workflow components)
      { path: '/e-commerce/pending', element: <ECommercePending /> },
      { path: '/e-commerce/accepted', element: <ECommerceAccepted /> },
      { path: '/e-commerce/work-in-progress', element: <ECommerceWorkInProgress /> },
      { path: '/e-commerce/completed', element: <ECommerceCompleted /> },
      { path: '/e-commerce/cancelled', element: <ECommerceCancelled /> },
      { path: '/e-commerce/rejected', element: <ECommerceRejected /> },
      { path: '/e-commerce/missed', element: <ECommerceMissed /> },

      //Medicines (7 complete workflow components)
      { path: '/medicines/pending', element: <MedicinesPending /> },
      { path: '/medicines/accepted', element: <MedicinesAccepted /> },
      { path: '/medicines/work-in-progress', element: <MedicinesWorkInProgress /> },
      { path: '/medicines/completed', element: <MedicinesCompleted /> },
      { path: '/medicines/cancelled', element: <MedicinesCancelled /> },
      { path: '/medicines/rejected', element: <MedicinesRejected /> },
      { path: '/medicines/missed', element: <MedicinesMissed /> },

      //Grocery (7 complete workflow components)
      { path: '/grocery/pending', element: <GroceryPending /> },
      { path: '/grocery/accepted', element: <GroceryAccepted /> },
      { path: '/grocery/work-in-progress', element: <GroceryWorkInProgress /> },
      { path: '/grocery/completed', element: <GroceryCompleted /> },
      { path: '/grocery/cancelled', element: <GroceryCancelled /> },
      { path: '/grocery/rejected', element: <GroceryRejected /> },
      { path: '/grocery/missed', element: <GroceryMissed /> },
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
      ,
      ,

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


      //Food (7 complete workflow components)
      { path: '/food/pending', element: <FoodPending /> },
      { path: '/food/accepted', element: <FoodAccepted /> },
      { path: '/food/work-in-progress', element: <FoodWorkInProgress /> },
      { path: '/food/completed', element: <FoodCompleted /> },
      { path: '/food/cancelled', element: <FoodCancelled /> },
      { path: '/food/rejected', element: <FoodRejected /> },
      { path: '/food/missed', element: <FoodMissed /> },

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

      { path: '/ondemandservice/near-by-shops/pending', element: <NearbyShopsPending /> },
      { path: '/ondemandservice/near-by-shops/accepted', element: <NearbyShopsAccepted /> },
      {
        path: '/ondemandservice/near-by-shops/work-in-progress',
        element: <NearbyShopsWorkInProgress />,
      },
      { path: '/ondemandservice/near-by-shops/completed', element: <NearbyShopsCompleted /> },
      { path: '/ondemandservice/near-by-shops/cancelled', element: <NearbyShopsCancelled /> },
      { path: '/ondemandservice/near-by-shops/rejected', element: <NearbyShopsRejected /> },
      { path: '/ondemandservice/near-by-shops/missed', element: <NearbyShopsMissed /> },

      {
        path: '/verified-partners-crm/assign-providers',
        element: <AssignServiceProviders />,
      }
      ,
      // View verified-partners bookings
      { path: '/verified-partners/view-order/:orderId', element: <ViewVerifiedPartnersBookings /> },

      // View Near By Shops bookings
      { path: '/near-by-shops/view-order/:orderId', element: <ViewNearByShopBookings /> },

      { path: '/ondemandservice/ondemandbookingsshop', element: <OnDemandBookingsShop /> },
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
      //Parcel Service
      { path: '/parcelservice/parcelgoodseye', element: <ParcelGoodsEye /> },
      { path: '/parcelservice/parcelcategory', element: <ParcelCategory /> },
      { path: '/parcelservice/parcelweight', element: <ParcelWeight /> },
      { path: '/parcelservice/parcelorder', element: <ParcelOrder /> },
      { path: '/parcelservice/parcelcoupon', element: <ParcelCoupon /> },

      // Cab Service
      { path: '/cabservice/cab-promo', element: <CabPromo /> },
      { path: '/cabservice/cab-vehicle-type', element: <CabVehicleType /> },
      { path: '/cabservice/cab-goods-eye', element: <CabGoodsEye /> },
      { path: '/cabservice/cab-complaints', element: <CabComplaints /> },
      { path: '/cabservice/cab-sos-riders', element: <CabSosRiders /> },
      { path: '/cabservice/cab-riders', element: <CabRiders /> },

      //Rental Service
      { path: '/rentalservice/rental-goods-eye', element: <RentalGoodsEye /> },
      { path: '/rentalservice/rental-vehicle-type', element: <RentalVehicleType /> },
      { path: '/rentalservice/rental-type', element: <RentalType /> },
      { path: '/rentalservice/rental-discount', element: <RentalDiscount /> },
      { path: '/rentalservice/rental-orders', element: <RentalOrders /> },
      { path: '/rentalservice/rental-vehicles', element: <RentalVehicles /> },

      //Vehicle Settings
      { path: '/vehicle/make', element: <Make /> },
      { path: '/vehicle/model', element: <Model /> },

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
      { path: '/payments/store-paymensts', element: <StorePayments /> },
      { path: '/payments/store-payouts', element: <StorePayouts /> },
      { path: '/payments/drivers-payments', element: <DriversPayments /> },
      { path: '/payments/drivers-payouts', element: <DriversPayouts /> },
      { path: '/payments/overview', element: <FinanceOverview /> },
      { path: '/payments/booking-payments', element: <BookingPayments /> },
      { path: '/payments/wallet-ledger', element: <WalletLedger /> },
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

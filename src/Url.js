import { getAdminApiBaseUrl, getMediaBaseUrl } from './config/apiEnv';

const Url = getAdminApiBaseUrl();
const FileBase = getMediaBaseUrl();

export const URLS = {
  Base: Url,
  FileBase,

  //Auth
  LogIn: Url + 'v1/dhubApi/admin/auth/adminlogin',
  ForgetPassword: Url + 'v1/dhubApi/admin/auth/sendotp',
  VerifyOtp: Url + 'v1/dhubApi/admin/auth/compareotp',
  ResetPassword: Url + 'v1/dhubApi/admin/auth/resetpass',
  ChangePassword: Url + 'v1/dhubApi/admin/auth/changepass',
  GetProfile: Url + 'v1/dhubApi/admin/auth/getadminprofile',
  UpdateProfile: Url + 'v1/dhubApi/admin/auth/editprofile',

  //Service
  AddService: Url + 'v1/dhubApi/admin/service/addservice',
  GetService: Url + 'v1/dhubApi/admin/service/getallserives',
  GetActiveServices: Url + 'v1/dhubApi/admin/service/getactiveservices',
  UpdateService: Url + 'v1/dhubApi/admin/service/editservice',
  DeleteService: Url + 'v1/dhubApi/admin/service/deleteservice',

  //Vendors
  AddVendor: Url + 'v1/dhubApi/admin/vendor/addvendor',
  GetVendor: Url + 'v1/dhubApi/admin/vendor/getallvendors',
  UpdateVendor: Url + 'v1/dhubApi/admin/vendor/editvendor',
  DeleteVendor: Url + 'v1/dhubApi/admin/vendor/deletevendor',

  //Roles
  AddRole: Url + 'v1/dhubApi/admin/role/addrole',
  GetRoles: Url + 'v1/dhubApi/admin/role/getAll',
  UpdateRole: Url + 'v1/dhubApi/admin/role/editrole',
  DeleteRole: Url + 'v1/dhubApi/admin/role/deleterole',
  GetByRoleId: Url + 'v1/dhubApi/admin/role/getrole',

  //Staff
  AddStaff: Url + 'v1/dhubApi/admin/staff/addstaff',
  GetStaff: Url + 'v1/dhubApi/admin/staff/getAllstaff',
  UpdateStaff: Url + 'v1/dhubApi/admin/staff/editstaff',
  DeleteStaff: Url + 'v1/dhubApi/admin/staff/deletestaff',
  GetByStaffId: Url + 'v1/dhubApi/admin/staff/getstaffbyid',

  //Users
  GetUsers: Url + 'v1/dhubApi/admin/user/getallusers',
  GetOneUser: Url + 'v1/dhubApi/admin/user/getuserbyid',
  InActiveUsers: Url + 'v1/dhubApi/admin/vendor/deletevendor',
  UpdateUserStatus: Url + 'v1/dhubApi/admin/user/status',
  DeleteUser: Url + 'v1/dhubApi/admin/user/deleteuser',

  RestoreDeletedUser: Url + 'v1/dhubApi/admin/user/restore-user',
  IsDeleteUser: Url + 'v1/dhubApi/admin/user/isdelete',
  IsDeleteUserList: Url + 'v1/dhubApi/admin/user/getdeleted-users',
  UserSendMail: Url + 'v1/dhubApi/admin/sendmail',


  //new service request

  Bulkapprove: Url + 'v1/dhubApi/admin/service-requests/bulk-reject',

  GET_ALL_QUERIES_URL: Url + 'v1/dhubApi/admin/adminsupport/getall-store-queries',
  UPDATE_QUERY_URL: Url + 'v1/dhubApi/admin/adminsupport/update-store-request',
  DeleteStoreQuery: Url + 'v1/dhubApi/admin/adminsupport/deleteStoreQuery',

  //Providers
  AddProvider: Url + 'v1/dhubApi/admin/provider/addprovider',
  GetProvider: Url + 'v1/dhubApi/admin/provider/getallproviders',
  GetOneProvider: Url + 'v1/dhubApi/admin/provider/get-single-provider',
  UpdateProvider: Url + 'v1/dhubApi/admin/provider/editprovider',
  DeleteProvider: Url + 'v1/dhubApi/admin/provider/deleteprovider',
  GetDeletedProviders: Url + 'v1/dhubApi/admin/provider/getdeletedproviders',
  RestoreProvider: Url + 'v1/dhubApi/admin/provider/restoreprovider',
  GetProviderStatus: Url + 'v1/dhubApi/admin/provider/getproviders',
  ProviderUserSendMail: Url + 'v1/dhubApi/admin/provider/getproviders',
  UpdateProviderStatus: Url + 'v1/dhubApi/admin/provider/update-status/',
  ProviderSendMail: Url + 'v1/dhubApi/admin/sendmailprovider',

  //Country
  AddCountry: Url + 'v1/dhubApi/admin/country/addcountry',
  GetCountry: Url + 'v1/dhubApi/admin/country/getallcountrys',
  EditCountry: Url + 'v1/dhubApi/admin/country/editcountry/',
  DeleteCountry: Url + 'v1/dhubApi/admin/country/deletecountry/',

  //State
  AddState: Url + 'v1/dhubApi/admin/state/addstate',
  GetState: Url + 'v1/dhubApi/admin/state/getallstates',
  EditState: Url + 'v1/dhubApi/admin/state/editstate/',
  DeleteState: Url + 'v1/dhubApi/admin/state/deletestate/',
  GetCountryByState: Url + 'v1/dhubApi/admin/state/getstatesbycountryid',

  //City
  AddCity: Url + 'v1/dhubApi/admin/city/addcity',
  GetCity: Url + 'v1/dhubApi/admin/city/getallcitys',
  EditCity: Url + 'v1/dhubApi/admin/city/editcity/',
  DeleteCity: Url + 'v1/dhubApi/admin/city/deletecity/',
  GetStateByCity: Url + 'v1/dhubApi/admin/city/getallcitiesunderstate',
  GetStateByCitys: Url + 'v1/dhubApi/admin/city/get-cities',

  //Zone
  AddZone: Url + 'v1/dhubApi/admin/zone/addzone',
  GetZones: Url + 'v1/dhubApi/admin/zone/getall',
  EditZone: Url + 'v1/dhubApi/admin/zone/editzone/',
  DeleteZone: Url + 'v1/dhubApi/admin/zone/deletezone/',
  GetOneZone: Url + 'v1/dhubApi/admin/zone/getzone',
  GetCityByZone: Url + 'v1/dhubApi/admin/zone/get-multiple-zones-by-cityId',
  GetCityOneByZone: Url + 'v1/dhubApi/admin/zone/getzonesbycityId',

  //ServiceType
  AddServiceType: Url + 'v1/dhubApi/admin/servicetype/addservicetype',
  GetServiceType: Url + 'v1/dhubApi/admin/servicetype/getallservicetypes',
  EditServiceType: Url + 'v1/dhubApi/admin/servicetype/editservicetype/',
  DeleteServiceType: Url + 'v1/dhubApi/admin/servicetype/deleteservicetype/',

  //SellCategories
  AddSellCategorie: Url + 'v1/dhubApi/admin/buy-sell-category/addcategory',
  GetSellCategories: Url + 'v1/dhubApi/admin/buy-sell-category/getallcategorys',
  EditSellCategorie: Url + 'v1/dhubApi/admin/buy-sell-category/editcategory',
  DeleteSellCategorie: Url + 'v1/dhubApi/admin/buy-sell-category/deletecategory',

  //SubCategories
  AddSellSubCategories: Url + 'v1/dhubApi/admin/buy-sell-subcategory/addsubcategory',
  GetSellSubCategories: Url + 'v1/dhubApi/admin/buy-sell-subcategory/getallsubcategorys',
  UpdateSellSubCategories: Url + 'v1/dhubApi/admin/buy-sell-subcategory/editsubcategory',
  DeleteSellSubCategories: Url + 'v1/dhubApi/admin/buy-sell-subcategory/deletesubcategory',

  // Sale Request
  GetAllSellRequest: Url + 'v1/dhubApi/admin/get-buy-sell-products',
  UpdateSellRequest: Url + 'v1/dhubApi/admin/update-buy-sell-product',
  DeleteSellRequest: Url + 'v1/dhubApi/admin/delete-buy-sell-product',

  //Provider Complaints
  GetAllProviderComplaints: Url + 'v1/dhubApi/admin/adminsupport/get-provider-queries',
  UpdateProviderComplaints: Url + 'v1/dhubApi/admin/adminsupport/update-provider-request',
  DeleteProviderComplaints: Url + 'v1/dhubApi/admin/adminsupport/deleteUserSupport',
  SupportTicketsSummary: Url + 'v1/dhubApi/admin/adminsupport/summary',
  SupportTicketsList: Url + 'v1/dhubApi/admin/adminsupport/tickets',
  SupportTicketById: (id) => Url + `v1/dhubApi/admin/adminsupport/ticket/${id}`,
  UpdateSupportTicket: (id) => Url + `v1/dhubApi/admin/adminsupport/ticket/${id}`,
  ReplySupportTicket: (id) => Url + `v1/dhubApi/admin/adminsupport/ticket/${id}/reply`,
  DeleteSupportTicket: (id) => Url + `v1/dhubApi/admin/adminsupport/ticket/${id}`,
  ReferralDashboard: Url + 'v1/dhubApi/admin/referrals/dashboard',
  ReferralTracking: Url + 'v1/dhubApi/admin/referrals/tracking',
  ReferralSettings: Url + 'v1/dhubApi/admin/referrals/settings',
  ReferralBonus: Url + 'v1/dhubApi/admin/referral_bonus',

  //Pending Category Request
  GetPendingCategoriesRequest: Url + 'v1/dhubApi/admin/get-requested-categorys',
  UpdateCategoriesRequest: Url + 'v1/dhubApi/admin/update-category-request',

  //Pending Sub Category Request
  GetPendingSubCategoriesRequest: Url + 'v1/dhubApi/admin/get-requested-subcategorys',
  UpdatePendingSubCategoriesRequest: Url + 'v1/dhubApi/admin/update-subcategory-request',

  //Categories
  AddCategorie: Url + 'v1/dhubApi/admin/category/addcategory',
  GetCategories: Url + 'v1/dhubApi/admin/category/getallcategorys',
  EditCategorie: Url + 'v1/dhubApi/admin/category/editcategory',
  DeleteCategorie: Url + 'v1/dhubApi/admin/category/deletecategory',
  ApproveCategorie: Url + 'v1/dhubApi/admin/approve_request/approve-category-request',
  GetServiceIdbyCategory: Url + 'v1/dhubApi/admin/attributevalue/get-categories-by-serviceId',

  //SubCategories
  AddSubCategories: Url + 'v1/dhubApi/admin/subcategory/addsubcategory',
  GetSubCategories: Url + 'v1/dhubApi/admin/subcategory/getallsubcategorys',
  UpdateSubCategories: Url + 'v1/dhubApi/admin/subcategory/editsubcategory',
  DeleteSubCategories: Url + 'v1/dhubApi/admin/subcategory/deletesubcategory',
  GetCategoryBySubCategoriesId: Url + 'v1/dhubApi/admin/subcategory/getsubcategorysbycategoryid',
  ApproveSubCategorie: Url + 'v1/dhubApi/admin/approve_request/approve-subcategory-request',
  GetCategorieIdbySubCategory:
    Url + 'v1/dhubApi/admin/attributevalue/get-subcategories-by-categoryId',

  //ChildCategories
  AddChildCategories: Url + 'v1/dhubApi/admin/product-child-category/addchildcategory',
  GetChildCategories: Url + 'v1/dhubApi/admin/product-child-category/getallchildcategorys',
  UpdateChildCategories: Url + 'v1/dhubApi/admin/product-child-category/editchildcategory',
  DeleteChildCategories: Url + 'v1/dhubApi/admin/product-child-category/deletechildcategory',
  GetSubCategoriesIdByChildCategories:
    Url + 'v1/dhubApi/admin/product-child-category/getallchildcategorys-by-subcategoryId',

  //Flavour
  AddFlavour: Url + 'v1/dhubApi/admin/flavour/addflavour',
  GetFlavours: Url + 'v1/dhubApi/admin/flavour/getallflavours',
  EditFlavour: Url + 'v1/dhubApi/admin/flavour/editflavour/',
  DeleteFlavour: Url + 'v1/dhubApi/admin/flavour/deleteflavour/',

  //Flavour
  AddBrand: Url + 'v1/dhubApi/admin/brand/addbrand',
  GetBrands: Url + 'v1/dhubApi/admin/brand/getallbrands',
  EditBrand: Url + 'v1/dhubApi/admin/brand/editbrand/',
  DeleteBrand: Url + 'v1/dhubApi/admin/brand/deletebrand/',

  //Units
  AddUnit: Url + 'v1/dhubApi/admin/unit/addunit',
  GetUnits: Url + 'v1/dhubApi/admin/unit/getallunits',
  EditUnit: Url + 'v1/dhubApi/admin/unit/editunit/',
  DeleteUnit: Url + 'v1/dhubApi/admin/unit/deleteunit/',

  //GrocerysItem
  AddGrocerysItem: Url + 'v1/dhubApi/admin/grocery-product/addproduct',
  GetGrocerysItem: Url + 'v1/dhubApi/admin/grocery-product/getallproducts',
  EditGrocerysItem: Url + 'v1/dhubApi/admin/grocery-product/editproduct/',
  DeleteGrocerysItem: Url + 'v1/dhubApi/admin/grocery-product/deleteproduct',
  GetOneGrocerysItem: Url + 'v1/dhubApi/admin/grocery-product/getproductbyid',
  GetGrocerysItemRequest: Url + 'v1/dhubApi/admin/grocery-product/store-requested-products',
  UpdateGrocerysItemRequest: Url + 'v1/dhubApi/admin/grocery-product/update-requested-bystore',

  //Weights
  AddWeight: Url + 'v1/dhubApi/admin/weight/addweight',
  GetWeights: Url + 'v1/dhubApi/admin/weight/getallweights',
  EditWeight: Url + 'v1/dhubApi/admin/weight/editweight/',
  DeleteWeight: Url + 'v1/dhubApi/admin/weight/deleteweight/',

  //Shopping All Drop-Downs
  AddShoppingDropDown: Url + 'v1/dhubApi/admin/ecommerce-dropdown/adddropdown',
  GetShoppingDropDowns: Url + 'v1/dhubApi/admin/ecommerce-dropdown/getalldropdowns',
  EditShoppingDropDown: Url + 'v1/dhubApi/admin/ecommerce-dropdown/editdropdown/',
  DeleteShoppingDropDown: Url + 'v1/dhubApi/admin/ecommerce-dropdown/deletedropdown/',

  //ShoppingItem
  AddShoppingItem: Url + 'v1/dhubApi/admin/shopping-product/addproduct',
  GetShoppingsItem: Url + 'v1/dhubApi/admin/shopping-product/getallproducts',
  EditShoppingItem: Url + 'v1/dhubApi/admin/shopping-product/editproduct/',
  DeleteShoppingItem: Url + 'v1/dhubApi/admin/shopping-product/deleteproduct',
  GetOneShoppingItem: Url + 'v1/dhubApi/admin/shopping-product/getproductbyid',

  //ShoppingItemRequest
  GetShopingItemRequest: Url + 'v1/dhubApi/admin/shopping-product/get-store-requested-products',
  UpdateShopingItemRequest: Url + 'v1/dhubApi/admin/shopping-product/update-requested-product',

  //CuisineType
  AddCuisineType: Url + 'v1/dhubApi/admin/cuisinetype/addcuisinetype',
  GetCuisineTypes: Url + 'v1/dhubApi/admin/cuisinetype/getallcuisinetypes',
  EditCuisineType: Url + 'v1/dhubApi/admin/cuisinetype/editcuisinetype/',
  DeleteCuisineType: Url + 'v1/dhubApi/admin/cuisinetype/deletecuisinetype/',

  //FoodItems
  AddFoodItem: Url + 'v1/dhubApi/admin/restaurent-product/addproduct',
  GetFoodItems: Url + 'v1/dhubApi/admin/restaurent-product/getallproducts',
  EditFoodItem: Url + 'v1/dhubApi/admin/restaurent-product/editproduct/',
  DeleteFoodItem: Url + 'v1/dhubApi/admin/restaurent-product/deleteproduct',
  GetOneFoodItem: Url + 'v1/dhubApi/admin/restaurent-product/getproductbyid',
  GetFoodItemRequest: Url + 'v1/dhubApi/admin/restaurent-product/get-all-requested-products',
  UpdateFoodItemRequest: Url + 'v1/dhubApi/admin/restaurent-product/update-request-for-store',

  //AddCrmBokings
  AddCrmBokings: Url + 'v1/dhubApi/admin/restaurent-product/addproduct',
  GetCrmBokings: Url + 'v1/dhubApi/admin/restaurent-product/getallproducts',

  //Crm Bookings
  GetUserDetailsByPhone: Url + 'v1/dhubApi/admin/crm-booking/getuserdetailsbyphone',
  GetZonesbylocation: Url + 'v1/dhubApi/app/getzone',
  GetDemandCategorybyzoneId: Url + 'v1/dhubApi/admin/crm-booking/get-ondemandcategorys-by-zone',
  GetOnDemandSubCategorybyZoneId:
    Url + 'v1/dhubApi/admin/crm-booking/get-ondemand-subcategorys-by-zoneId-categoryId',
  GetOnDemandServicesbyZoneId: Url + 'v1/dhubApi/admin/crm-booking/get-ondemand-services',
  GetServiceRateCards: Url + 'v1/dhubApi/admin/crm-booking/get-serviceratecards-by-serviceid',
  AddCrmBooking: Url + 'v1/dhubApi/admin/crm-booking/add-crm-booking',
  GetVerifiedPartnersCrmBookingsByStatus: Url + 'v1/dhubApi/admin/crm-booking/get-crm-bookings',
  GetVerifiedPartnersCrmbookingByStatusOffline: Url + 'v1/dhubApi/admin/crm-booking/get-crm-bookings-offline',
  GetServiceCrmBookingsById: Url + 'v1/dhubApi/admin/crm-booking/get-crm-booking-by-id',
  updatePaymentStatus: Url + 'v1/dhubApi/admin/crm-booking/updatePaymentStatusOfBooking',
  GetServiceProvidersBasedCrmOnId: Url + 'v1/dhubApi/admin/crm-booking/get-verified-partners',
  AssignOrderCrmtoProvider: Url + 'v1/dhubApi/admin/crm-booking/assigned-to-verifiedpartner-nearbyshops',
  archieveBookings: Url + 'v1/dhubApi/admin/crm-booking/achieve_booking',
  activate_archieveBookings: Url + 'v1/dhubApi/admin/crm-booking/activate-achieved_booking',
  GetArchivedCrmBookings: Url + 'v1/dhubApi/admin/crm-booking/archived-crm-bookings',

  // Unified booking payments
  GetVerifiedPartnerOrders: Url + 'v1/dhubApi/admin/orders/verified-partner',
  GetVerifiedPartnerStats: Url + 'v1/dhubApi/admin/orders/verified-partner/stats',
  GetProfessionalOrders: Url + 'v1/dhubApi/admin/orders/professional',
  GetProfessionalStats: Url + 'v1/dhubApi/admin/orders/professional/stats',
  GetBookingsAnalytics: Url + 'v1/dhubApi/admin/orders/analytics',
  GetOrderById: (orderId) => Url + `v1/dhubApi/admin/orders/${orderId}`,
  GetServiceReviews: Url + 'v1/dhubApi/admin/orders/service-reviews',

  //CRM Website Bookings
  GetCRMWebsiteBookings: Url + 'v1/dhubApi/admin/crm-website-bookings/get-all-crm-bookings',
  UpdateCRMWebsiteBookingStatus: Url + 'v1/dhubApi/admin/crm-website-bookings/update-crm-booking-status',
  DeleteCRMWebsiteBooking: Url + 'v1/dhubApi/admin/crm-website-bookings/delete-crm-booking/',
  GetPotentialProvidersForWebsite: Url + 'v1/dhubApi/admin/crm-website-bookings/get-potential-providers',
  AssignWebsiteBookingToProvider: Url + 'v1/dhubApi/admin/crm-website-bookings/assign-to-provider',
  GetCRMWebsiteBookingById: Url + 'v1/dhubApi/admin/crm-website-bookings/get-crm-booking-by-id/',
  GetWebsiteLeads: Url + 'v1/dhubApi/app/website-leads/get-leads',

  //Website Management
  GetWebsiteCities: Url + 'v1/dhubApi/admin/website-management/get-website-cities',
  AddWebsiteCity: Url + 'v1/dhubApi/admin/website-management/add-website-city',
  DeleteWebsiteCity: Url + 'v1/dhubApi/admin/website-management/delete-website-city/',
  SaveCityCategories: Url + 'v1/dhubApi/admin/website-management/save-city-categories',
  GetCityCategories: Url + 'v1/dhubApi/admin/website-management/get-city-categories/',


  //DRUG CATEGORIES
  AddDrugCategories: Url + 'v1/dhubApi/admin/drugtype/adddrugtype',
  GetDrugCategories: Url + 'v1/dhubApi/admin/drugtype/getalldrugtypes',
  EditDrugCategories: Url + 'v1/dhubApi/admin/drugtype/editdrugtype/',
  DeleteDrugCategories: Url + 'v1/dhubApi/admin/drugtype/deletedrugtype/',

  //PACKING TYPES
  AddPackingType: Url + 'v1/dhubApi/admin/packingtype/addpackingtype',
  GetPackingTypes: Url + 'v1/dhubApi/admin/packingtype/getallpackingtypes',
  EditPackingType: Url + 'v1/dhubApi/admin/packingtype/editpackingtype/',
  DeletePackingType: Url + 'v1/dhubApi/admin/packingtype/deletepackingtype/',

  //MEDICINE FORMS
  AddMedicineForm: Url + 'v1/dhubApi/admin/medicine-form/addform',
  GetMedicineForms: Url + 'v1/dhubApi/admin/medicine-form/getallforms',
  EditMedicineForm: Url + 'v1/dhubApi/admin/medicine-form/editform/',
  DeleteMedicineForm: Url + 'v1/dhubApi/admin/medicine-form/deleteform/',

  //THERAPEUTIC CLASS
  AddTherapeuticClass: Url + 'v1/dhubApi/admin/therapeutic-class/addtherapeutic-class',
  GetTherapeuticClasss: Url + 'v1/dhubApi/admin/therapeutic-class/getalltherapeutic-class',
  EditTherapeuticClass: Url + 'v1/dhubApi/admin/therapeutic-class/edittherapeutic-class/',
  DeleteTherapeuticClass: Url + 'v1/dhubApi/admin/therapeutic-class/deletetherapeutic-class/',

  //MedicalItem
  AddMedicalItem: Url + 'v1/dhubApi/admin/medicine-product/addproduct',
  GetMedicalItem: Url + 'v1/dhubApi/admin/medicine-product/getallproducts',
  EditMedicalItem: Url + 'v1/dhubApi/admin/medicine-product/editproduct/',
  DeleteMedicalItem: Url + 'v1/dhubApi/admin/medicine-product/deleteproduct',
  GetOneMedicalItem: Url + 'v1/dhubApi/admin/medicine-product/getproductbyid',

  //MedicineItemRequest
  GetMedicineItemRequest:
    Url + 'v1/dhubApi/admin/medicine-product/get-requested-products-from-store',
  UpdateMedicineItemRequest: Url + 'v1/dhubApi/admin/medicine-product/update-request',

  //Attribute
  AddAttribute: Url + 'v1/dhubApi/admin/attribute/addattribute',
  GetAttribute: Url + 'v1/dhubApi/admin/attribute/getallattributes',
  UpdateAttribute: Url + 'v1/dhubApi/admin/attribute/editattribute',
  DeleteAttribute: Url + 'v1/dhubApi/admin/attribute/deleteattribute',
  GetByIdAttribute: Url + 'v1/dhubApi/admin/attribute/getattributebyid',

  //Price
  AddPrice: Url + 'v1/dhubApi/admin/price/addprice',
  GetPrice: Url + 'v1/dhubApi/admin/price/getallprices',
  UpdatePrice: Url + 'v1/dhubApi/admin/price/editprice',
  DeletePrice: Url + 'v1/dhubApi/admin/price/deleteprice',
  GetByIdPrice: Url + 'v1/dhubApi/admin/price/getpricebyid',


  //Specifications
  GetSpecifications: Url + 'v1/dhubApi/vendor/specification/getallspecifications',
  AddSpecifications: Url + 'v1/dhubApi/vendor/specification/addspecification',
  EditSpecifications: Url + 'v1/dhubApi/vendor/specification/editspecification',
  DeleteSpecifications: Url + 'v1/dhubApi/vendor/specification/deletespecification',

  //SpecificationValues
  GetSpecificationValues: Url + 'v1/dhubApi/vendor/specification_value/getallspecification_values',
  AddSpecificationValues: Url + 'v1/dhubApi/vendor/specification_value/addspecification_value',
  EditSpecificationValues: Url + 'v1/dhubApi/vendor/specification_value/editspecification_value',
  DeleteSpecificationValues:
    Url + 'v1/dhubApi/vendor/specification_value/deletespecification_value',



  GetServiceBookingCharges: Url + 'v1/dhubApi/admin/service-booking-charges',
  EditServiceBookingCharges: Url + 'v1/dhubApi/admin/service-booking-charges',

  //variations
  addShoppingVariation: Url + 'v1/dhubApi/admin/shop-variation/add-variation',
  // getShoppingVariation: Url + 'v1/dhubApi/admin/shop-variation/getall-variations',
  getAllShoppingVariation: Url + 'v1/dhubApi/admin/shop-variation/getall-active-variations',
  editShoppingVariation: Url + 'v1/dhubApi/admin/shop-variation/edit-variation/',
  deleteShoppingVariation: Url + 'v1/dhubApi/admin/shop-variation/delete-variation/',




  //sub-variations-shopping
  addSubShoppingVariation: Url + 'v1/dhubApi/admin/sub-shop-variation/add-sub-shop-variation',
  getSubShoppingVariation: Url + 'v1/dhubApi/admin/sub-shop-variation/getall-sub-shop-variations',
  editSubShoppingVariation: Url + 'v1/dhubApi/admin/sub-shop-variation/edit-sub-shop-variation/',
  deleteSubShoppingVariation: Url + 'v1/dhubApi/admin/sub-shop-variation/delete-sub-shop-variation/',


  //Attribute Values
  AddAttributeValues: Url + 'v1/dhubApi/admin/attributevalue/addattributevalue',
  GetAttributeValues: Url + 'v1/dhubApi/admin/attributevalue/getallattributevalues',
  UpdateAttributeValues: Url + 'v1/dhubApi/admin/attributevalue/editattributevalue',
  DeleteAttributeValues: Url + 'v1/dhubApi/admin/attributevalue/deleteattributevalue',

  // //Specification
  // AddSpecification: Url + 'v1/dhubApi/admin/specification/addspecification',
  // GetSpecification: Url + 'v1/dhubApi/admin/specification/getallspecifications',
  // UpdateSpecification: Url + 'v1/dhubApi/admin/specification/editspecification',
  // DeleteSpecification: Url + 'v1/dhubApi/admin/specification/deletespecification',

  // //Specification Values
  // AddSpecificationValues: Url + 'v1/dhubApi/admin/specificationvalue/addspecification_value',
  // GetSpecificationValues: Url + 'v1/dhubApi/admin/specificationvalue/getallspecification_values',
  // UpdateSpecificationValues: Url + 'v1/dhubApi/admin/specificationvalue/editspecification_value',
  // DeleteSpecificationValues: Url + 'v1/dhubApi/admin/specificationvalue/deletespecification_value',

  //Popular Destinations
  AddPopularDestination: Url + 'v1/dhubApi/admin/populardestination/addpopulardestination',
  GetPopularDestination: Url + 'v1/dhubApi/admin/populardestination/getallpopulardestinations',
  EditPopularDestination: Url + 'v1/dhubApi/admin/populardestination/editpopulardestination',
  DeletePopularDestination: Url + 'v1/dhubApi/admin/populardestination/deletepopulardestination',

  //Item Attribute
  AddItemAttribute: Url + 'v1/dhubApi/admin/itemattribute/additemattribute',
  GetItemAttribute: Url + 'v1/dhubApi/admin/itemattribute/getallitemattributes',
  EditItemAttribute: Url + 'v1/dhubApi/admin/itemattribute/edititemattribute',
  DeleteItemAttribute: Url + 'v1/dhubApi/admin/itemattribute/deleteitemattribute',

  //Review Attribute
  AddReviewAttribute: Url + 'v1/dhubApi/admin/reviewattribute/addreviewattribute',
  GetReviewAttribute: Url + 'v1/dhubApi/admin/reviewattribute/getallreviewattributes',
  EditReviewAttribute: Url + 'v1/dhubApi/admin/reviewattribute/editreviewattribute',
  DeleteReviewAttribute: Url + 'v1/dhubApi/admin/reviewattribute/deletereviewattribute',

  //Gift Card
  AddGiftCard: Url + 'v1/dhubApi/admin/gift/addgift',
  GetGiftCard: Url + 'v1/dhubApi/admin/gift/getallgifts',
  EditGiftCard: Url + 'v1/dhubApi/admin/gift/editgift',
  DeleteGiftCard: Url + 'v1/dhubApi/admin/gift/deletegift',


  //whatsappotp
  SendWhatsAppotp: Url + 'v1/dhubApi/admin/crm-booking/sendWhatsAppOtp',
  VerifyWhatsAppotp: Url + 'v1/dhubApi/admin/crm-booking/verifyWhatsAppOtp',

  //Banner Item
  AddBannerItem: Url + 'v1/dhubApi/admin/gift/addgift',
  GetBannerItem: Url + 'v1/dhubApi/admin/gift/getallgifts',
  EditBannerItem: Url + 'v1/dhubApi/admin/gift/editgift',
  DeleteBannerItem: Url + 'v1/dhubApi/admin/gift/deletegift',

  //offer
  GetCategoriesByServiceId: Url + 'v1/dhubApi/admin/category/getallcategorysById',

  //TypeSettings
  GetTypePolicys: Url + 'v1/dhubApi/admin/policyBundle/',
  UpdateTypePolicys: Url + 'v1/dhubApi/admin/policyBundle/createOrUpdatePolicy/',

  //ServiceSettings
  GetServicePolicys: Url + 'v1/dhubApi/admin/policyByService/',
  UpdateServicePolicys: Url + 'v1/dhubApi/admin/policyByService/createOrUpdatePolicy/',

  //TypeFaqs
  AddTypeFaqs: Url + 'v1/dhubApi/admin/faqWithType/',
  GetTypeFaqs: Url + 'v1/dhubApi/admin/faqWithType/',
  EditTypeFaqs: Url + 'v1/dhubApi/admin/faqWithType/',
  DeleteTypeFaqs: Url + 'v1/dhubApi/admin/faqWithType/',

  //ServiceFaqs
  AddServiceFaqs: Url + 'v1/dhubApi/admin/faqWithService/',
  GetServiceFaqs: Url + 'v1/dhubApi/admin/faqWithService/',
  EditServiceFaqs: Url + 'v1/dhubApi/admin/faqWithService/',
  DeleteServiceFaqs: Url + 'v1/dhubApi/admin/faqWithService/',

  GetSettings: Url + 'v1/dhubApi/admin/policy/get',
  EditTermsAndCondition: Url + 'v1/dhubApi/admin/policy/updatetermsAndCondition',
  EditPrivacyPolicy: Url + 'v1/dhubApi/admin/policy/updateprivacyPolicy',
  EditSpecialOffer: Url + 'v1/dhubApi/admin/policy/updatespecialoffer',
  EditAppBanner: Url + 'v1/dhubApi/admin/policy/updateappbanner',

  //Tax Setting
  AddTaxSetting: Url + 'v1/dhubApi/admin/taxsetting/addtaxsetting',
  GetTaxSetting: Url + 'v1/dhubApi/admin/taxsetting/getalltaxsettings',
  EditTaxSetting: Url + 'v1/dhubApi/admin/taxsetting/edittaxsetting',
  DeleteTaxSetting: Url + 'v1/dhubApi/admin/taxsetting/deletetaxsetting',

  //Delivery Charges
  GetDeliveryCharges: Url + 'v1/dhubApi/admin/deliverycharge/get',
  EditDeliveryCharges: Url + 'v1/dhubApi/admin/deliverycharge/updatecharges',

  //Radius Conifiguration
  GetRadiusConifiguration: Url + 'v1/dhubApi/admin/radiusconfiguration/get',
  EditRadiusConifiguration: Url + 'v1/dhubApi/admin/radiusconfiguration/updateradiusconfiguration',

  //Gobal Settings
  GetGobalSettings: Url + 'v1/dhubApi/admin/globalsetting/getglobalsetting',
  EditGobalSettings: Url + 'v1/dhubApi/admin/globalsetting/updateglobalsettings',


  // banners
  GetOneCategoryBanner: Url + 'v1/dhubApi/admin/category-banner/get/:id',

  //Subscriptions Plan
  AddSubscriptionsplan: Url + 'v1/dhubApi/admin/plan/addplan',
  GetSubscriptionsplan: Url + 'v1/dhubApi/admin/plan/getallplans',
  EditSubscriptionsplan: Url + 'v1/dhubApi/admin/plan/editplan',
  DeleteSubscriptionsplan: Url + 'v1/dhubApi/admin/plan/deleteplan',
  GetFinanceOverview: Url + 'v1/dhubApi/admin/finance/overview',
  GetFinanceWalletLedger: Url + 'v1/dhubApi/admin/finance/wallet-ledger',
  GetFinanceWithdrawals: Url + 'v1/dhubApi/admin/finance/withdrawals',
  UpdateFinanceWithdrawal: Url + 'v1/dhubApi/admin/finance/withdrawals/action',
  FinanceWalletAdjustment: Url + 'v1/dhubApi/admin/finance/wallet-adjustment',
  GetLegacyProviderWithdrawals: Url + 'v1/dhubApi/admin/provider-withdraw-requests',
  GetFinanceSubscriptions: Url + 'v1/dhubApi/admin/finance/subscriptions',
  GetProviderSubscriptions: Url + 'v1/dhubApi/admin/get-provider-subscriptions',

  //Store
  AddStore: Url + 'v1/dhubApi/admin/store/addstore',
  GetStore: Url + 'v1/dhubApi/admin/store/getallstores',
  EditStore: Url + 'v1/dhubApi/admin/store/editstore',
  DeleteStore: Url + 'v1/dhubApi/admin/store/deletestore',
  GetStoreone: Url + 'v1/dhubApi/admin/store/getstorebyid',
  BlockorUnblockStore: Url + 'v1/dhubApi/admin/store/update_store_block_unblock',
  GetStoresByStatus: Url + 'v1/dhubApi/admin/store/get-block-unblock-stores',
  ApproveStore: Url + 'v1/dhubApi/admin/approve_request/approve-storekyc-request',
  StoreSendMail: Url + 'v1/dhubApi/admin/sendmailstore',

  //Driver
  AddDriver: Url + 'v1/dhubApi/admin/driver/adddriver',
  GetDriver: Url + 'v1/dhubApi/admin/driver/getalldrivers',
  EditDriver: Url + 'v1/dhubApi/admin/driver/editdriver',
  DeleteDriver: Url + 'v1/dhubApi/admin/driver/deletedriver',
  GetDriverone: Url + 'v1/dhubApi/admin/driver/getdriverbyid',
  BlockorUnblockDriver: Url + 'v1/dhubApi/admin/driver/update-block-unblock',
  GetDriversByStatus: Url + 'v1/dhubApi/admin/driver/get-block-unblock-drivers',

  //Items
  AddItems: Url + 'v1/dhubApi/admin/item/additem',
  GetItems: Url + 'v1/dhubApi/admin/item/getallitems',
  DeleteAllItems: Url + 'v1/dhubApi/admin/item/deleteitems',
  DeleteItems: Url + 'v1/dhubApi/admin/item/deleteitem',

  //Coupon
  AddCoupon: Url + 'v1/dhubApi/admin/coupon/addcoupon',
  GetCoupon: Url + 'v1/dhubApi/admin/coupon/getallcoupons',
  EditCoupon: Url + 'v1/dhubApi/admin/coupon/editcoupon',
  DeleteCoupon: Url + 'v1/dhubApi/admin/coupon/deletecoupon',

  //Banner Items
  AddBannerItems: Url + 'v1/dhubApi/admin/banneritem/addbanneritem',
  GetBannerItems: Url + 'v1/dhubApi/admin/banneritem/getallbanneritems',
  EditBannerItems: Url + 'v1/dhubApi/admin/banneritem/editbanneritem',
  DeleteBannerItems: Url + 'v1/dhubApi/admin/banneritem/deletebanneritem',

  //CMS pages
  AddCMSPages: Url + 'v1/dhubApi/admin/cmspage/addcmspage',
  GetCMSPages: Url + 'v1/dhubApi/admin/cmspage/getallcmspages',
  EditCMSPages: Url + 'v1/dhubApi/admin/cmspage/editcmspage',
  DeleteCMSPages: Url + 'v1/dhubApi/admin/cmspage/deletecmspage',

  //Vehicle Setting
  //Make
  AddMake: Url + 'v1/dhubApi/admin/vechile/addvechile',
  GetMake: Url + 'v1/dhubApi/admin/vechile/getallvechiles',
  EditMake: Url + 'v1/dhubApi/admin/vechile/editvechile/',
  DeleteMake: Url + 'v1/dhubApi/admin/vechile/deletevechile/',

  //Model
  AddModel: Url + 'v1/dhubApi/admin/vechilemodel/addvechilemodel',
  GetModel: Url + 'v1/dhubApi/admin/vechilemodel/getallvechilemodels',
  EditModel: Url + 'v1/dhubApi/admin/vechilemodel/editvechilemodel/',
  DeleteModel: Url + 'v1/dhubApi/admin/vechilemodel/deletevechilemodel/',

  //ParcelCategory
  AddParcelCategory: Url + 'v1/dhubApi/admin/parcelcategory/addparcelcategory',
  GetParcelCategory: Url + 'v1/dhubApi/admin/parcelcategory/getallparcelcategorys',
  EditParcelCategory: Url + 'v1/dhubApi/admin/parcelcategory/editparcelcategory',
  DeleteParcelCategory: Url + 'v1/dhubApi/admin/parcelcategory/deleteparcelcategory',

  //ParcelWeight
  AddParcelWeight: Url + 'v1/dhubApi/admin/parcelweight/addparcelweight',
  GetParcelWeight: Url + 'v1/dhubApi/admin/parcelweight/getallparcelweights',
  EditParcelWeight: Url + 'v1/dhubApi/admin/parcelweight/editparcelweight/',
  DeleteParcelWeight: Url + 'v1/dhubApi/admin/parcelweight/deleteparcelweight/',

  //Store PayOuts
  AddStorePayOut: Url + 'v1/dhubApi/admin/storepayout/addstorepayout',
  GetStorePayOut: Url + 'v1/dhubApi/admin/storepayout/getallstorepayouts',
  EditStorePayOut: Url + 'v1/dhubApi/admin/storepayout/editstorepayout',
  DeleteStorePayOut: Url + 'v1/dhubApi/admin/storepayout/deletestorepayout',

  //Faqs
  AddFaqs: Url + 'v1/dhubApi/admin/faq/addfaq',
  GetFaqs: Url + 'v1/dhubApi/admin/faq/getAll',
  EditFaqs: Url + 'v1/dhubApi/admin/faq/editfaq/',
  DeleteFaqs: Url + 'v1/dhubApi/admin/faq/deletefaq/',

  //DemandCategory
  AddDemandCategory: Url + 'v1/dhubApi/admin/ondemandcategory/addondemandcategory',
  GetDemandCategory: Url + 'v1/dhubApi/admin/ondemandcategory/getallondemandcategorys',
  EditDemandCategory: Url + 'v1/dhubApi/admin/ondemandcategory/editondemandcategory',
  DeleteDemandCategory: Url + 'v1/dhubApi/admin/ondemandcategory/deleteondemandcategory',




  //OnDemandSubCategory
  AddOnDemandSubCategory: Url + 'v1/dhubApi/admin/ondemandsubcategory/addondemandsubcategory',
  GetOnDemandSubCategory: Url + 'v1/dhubApi/admin/ondemandsubcategory/getallondemandsubcategorys',
  EditOnDemandSubCategory: Url + 'v1/dhubApi/admin/ondemandsubcategory/editondemandsubcategory',
  DeletOnDemandSubCategory: Url + 'v1/dhubApi/admin/ondemandsubcategory/deleteondemandsubcategory',
  GetOnDemandSubCategorybyCategory: Url + 'v1/dhubApi/admin/ondemandsubcategory/getsubcategory',
  GetOnDemandSubCategorybyCategoryMulti:
    Url + 'v1/dhubApi/admin/ondemandsubcategory/getsubcategoriesunderondemandcategoryid',

  //OnDemandChildCategory
  AddOnDemandChildCategory: Url + 'v1/dhubApi/admin/ondemandchildcategory/addondemandchildcategory',
  GetOnDemandChildCategory:
    Url + 'v1/dhubApi/admin/ondemandchildcategory/getallondemandchildcategorys',
  EditOnDemandChildCategory:
    Url + 'v1/dhubApi/admin/ondemandchildcategory/editondemandchildcategory',
  DeletOnDemandChildCategory:
    Url + 'v1/dhubApi/admin/ondemandchildcategory/deleteondemandchildcategory',

  //OnDemandSevice
  AddOnDemandSevice: Url + 'v1/dhubApi/admin/ondemandservice/addondemandservice',
  GetOnDemandSevice: Url + 'v1/dhubApi/admin/ondemandservice/getallondemandservices',
  GetOneOnDemandSevice: Url + 'v1/dhubApi/admin/ondemandservice/getondemandservicebyid',
  EditOnDemandSevice: Url + 'v1/dhubApi/admin/ondemandservice/editondemandservice',
  DeletOnDemandSevice: Url + 'v1/dhubApi/admin/ondemandservice/deleteondemandservice',


  ///isfeatured

  AddFeatured: Url + 'v1/dhubApi/admin/ondemandservice/toggleondemandservicefeatured',
  AddRecommended: Url + 'v1/dhubApi/admin/ondemandservice/toggleondemandservicerecommended',

  //OnDemandSeviceRates
  AddOnDemandSeviceRates: Url + 'v1/dhubApi/admin/ondemandservice/addondemandserviceratecard',
  GetOnDemandSeviceRates: Url + 'v1/dhubApi/admin/ondemandservice/getallondemandserviceratecards',
  EditOnDemandSeviceRates: Url + 'v1/dhubApi/admin/ondemandservice/editondemandserviceratecard',
  DeletOnDemandSeviceRates: Url + 'v1/dhubApi/admin/ondemandservice/deleteondemandserviceratecard',

  //OnDemandSeviceBookings
  GetOnDemandProviderSeviceBookings:
    Url + 'v1/dhubApi/admin/providerservicebooking/getallproviderbookings',
  GetOnDemandShopSeviceBookings:
    Url + 'v1/dhubApi/admin/providerservicebooking/getallservicebookings',
  GetOnDemandShopSeviceBookingsBookings:
    Url + 'v1/dhubApi/admin/providerservicebooking/getbookingbyid',
  UpdateOnDemandSeviceBookings: Url + 'v1/dhubApi/admin/providerservicebooking/getbookingbyid',

  //OnDemandWorker
  AddOnDemandWorker: Url + 'v1/dhubApi/admin/ondemandworker/addondemandworker',
  GetOnDemandWorker: Url + 'v1/dhubApi/admin/ondemandworker/getallondemandworkers',
  GetOneOnDemandWorker: Url + 'v1/dhubApi/admin/ondemandworker/getondemandworkerbyid',
  EditOnDemandWorker: Url + 'v1/dhubApi/admin/ondemandworker/editondemandworker/',
  DeletOnDemandWorker: Url + 'v1/dhubApi/admin/ondemandworker/deleteondemandworker',

  //OnDemandCoupon
  AddOnDemandCoupon: Url + 'v1/dhubApi/admin/ondemandcoupon/addondemandcoupon',
  GetOnDemandCoupon: Url + 'v1/dhubApi/admin/ondemandcoupon/getallondemandcoupons',
  EditOnDemandCoupon: Url + 'v1/dhubApi/admin/ondemandcoupon/editondemandcoupon',
  DeletOnDemandCoupon: Url + 'v1/dhubApi/admin/ondemandcoupon/deleteondemandcoupon',

  //Verified Partners Bookings
  GetVerifiedPartnersBookingsByStatus:
    Url + 'v1/dhubApi/admin/providerservicebooking/getallservicebookings',

  //Get Bookings by Id Same for Verified Partners Bookings and Near By Shops bookings
  GetServiceBookingsById: Url + 'v1/dhubApi/admin/providerservicebooking/getbookingbyid',

  //Near By Shops bookings
  GetNearByShopsBookingsByStatus:
    Url + 'v1/dhubApi/admin/providerservicebooking/getallproviderbookings',

  //Assigning Order to provider
  AcceptingTheOrder: Url + 'v1/dhubApi/admin/service_order_status/accepetedbyadmin',
  AssignOrdertoProvider: Url + 'v1/dhubApi/admin/service_order_status/assignToProvider',
  GetServiceProvidersBasedOnId: Url + 'v1/dhubApi/admin/store/get-vendors',

  //Add Notification
  AddNotification: Url + 'v1/dhubApi/admin/notification/addnotification',
  GetNotification: Url + 'v1/dhubApi/admin/notification/getallnotifications',
  DeleteNotification: Url + 'v1/dhubApi/admin/notification/deletenotification',

  //ONBOARDING SCREENS
  AddOnboardingscreens: Url + 'v1/dhubApi/admin/onboarding/addonboarding',
  GetOnboardingscreens: Url + 'v1/dhubApi/admin/onboarding/getallonboardings',
  EditOnboardingscreens: Url + 'v1/dhubApi/admin/onboarding/editonboarding',
  DeletOnboardingscreens: Url + 'v1/dhubApi/admin/onboarding/deleteonboarding',

  //PROVIDER PAYOUTS
  AddProviderPayout: Url + 'v1/dhubApi/admin/providerpayout/addproviderpayout',
  GetProviderPayout: Url + 'v1/dhubApi/admin/providerpayout/getallproviderpayouts',
  EditProviderPayout: Url + 'v1/dhubApi/admin/providerpayout/editproviderpayout',
  DeletProviderPayout: Url + 'v1/dhubApi/admin/providerpayout/deleteproviderpayout',

  //WebSite
  //HomePage
  AddHomePage: Url + 'v1/dhubApi/admin/homepage/addhomepage',
  GetHomePage: Url + 'v1/dhubApi/admin/homepage/getallactivehomepages',
  EditHomePage: Url + 'v1/dhubApi/admin/homepage/edithomepage',
  DeletHomePage: Url + 'v1/dhubApi/admin/homepage/deletehomepage',

  //websitelatest
  //testimonials
  GetLatestTestimonials: Url + 'v1/dhubApi/admin/testimonials-latest/',
  AddLatestTestimonials: Url + 'v1/dhubApi/admin/testimonials-latest/',
  EditLatestTestimonials: Url + 'v1/dhubApi/admin/testimonials-latest',

  //applinks download

  Addapplink: Url + 'v1/dhubApi/admin/download-links',
  Getapplink: Url + 'v1/dhubApi/admin/download-links',
  Editapplink: Url + 'v1/dhubApi/admin/download-links',


  //social media
  Getsocialmedialink: Url + 'v1/dhubApi/admin/social-media-links',
  Editsocialmedialink: Url + 'v1/dhubApi/admin/social-media-links',


  //serviceslatest
  Services: Url + 'v1/dhubApi/website/services',

  // websiteRouter.get("/services", websiteController.getServices);',

  //joinus
  JoinUs: Url + 'v1/dhubApi/admin/join-us',

  //exploreapps
  ExploreApps: Url + 'v1/dhubApi/admin/explore-apps',

  //latest blog

  Blog: Url + 'v1/dhubApi/admin/website-blog',

  Aboutuslatest: Url + 'v1/dhubApi/admin/website-aboutus',


  //instapage
  InstaGallery: Url + 'v1/dhubApi/website/insta-gallery',
  InstaGalleryAdmin: Url + 'v1/dhubApi/admin/insta-gallery',
  //AboutUs
  GetAboutUs: Url + 'v1/dhubApi/admin/aboutus/getaboutus',
  EditAboutUs: Url + 'v1/dhubApi/admin/aboutus/editaboutus',

  //Testimonials
  AddTestimonials: Url + 'v1/dhubApi/admin/testimonial/addtestimonial',
  GetTestimonials: Url + 'v1/dhubApi/admin/testimonial/getalltestimonials',
  EditTestimonials: Url + 'v1/dhubApi/admin/testimonial/edittestimonial',
  DeletTestimonials: Url + 'v1/dhubApi/admin/testimonial/deletetestimonial',

  //Blogs
  AddBlog: Url + 'v1/dhubApi/admin/blog/addblog',
  GetBlog: Url + 'v1/dhubApi/admin/blog/getallblogs',
  EditBlog: Url + 'v1/dhubApi/admin/blog/editblog',
  DeletBlog: Url + 'v1/dhubApi/admin/blog/deleteblog',
  GetOneBlog: Url + 'v1/dhubApi/admin/blog/getblogbyid',

  //Announcements
  AddAnnouncement: Url + 'v1/dhubApi/admin/announcement/addannouncement',
  GetAnnouncement: Url + 'v1/dhubApi/admin/announcement/getallannouncements',
  EditAnnouncement: Url + 'v1/dhubApi/admin/announcement/editannouncement',
  DeletAnnouncement: Url + 'v1/dhubApi/admin/announcement/deleteannouncement',

  //Appscreen
  AddAppscreen: Url + 'v1/dhubApi/admin/apprelateddata/addapprelateddata',
  GetAppscreen: Url + 'v1/dhubApi/admin/apprelateddata/getallapprelateddatas',
  EditAppscreen: Url + 'v1/dhubApi/admin/apprelateddata/editapprelateddata',
  DeletAppscreen: Url + 'v1/dhubApi/admin/apprelateddata/deleteapprelateddata',

  //AboutUs
  GetAppdownloadScreens: Url + 'v1/dhubApi/admin/webhomescreen/gethomescreendata',
  EditAppdownloadScreens: Url + 'v1/dhubApi/admin/webhomescreen/updatehomescreendata',

  //All Modules
  GetAllModules: Url + 'v1/dhubApi/admin/allmodules/getallmodules',
  EditAllModules: Url + 'v1/dhubApi/admin/allmodules/editallmodules',

  //AppScrolling
  GetAppScrolling: Url + 'v1/dhubApi/admin/screenscrolling/getscreenscrolling',
  EditAppScrolling: Url + 'v1/dhubApi/admin/screenscrolling/updatescreenscrolling',

  //Enquiry
  GetEnquiry: Url + 'v1/dhubApi/admin/enqnuiries/getall',
  DeleteEnquiry: Url + 'v1/dhubApi/admin/enqnuiries/delete',

  //PaymentAccept
  AddPaymentAccept: Url + 'v1/dhubApi/admin/paymentaccept/addpaymentaccept',
  GetPaymentAccept: Url + 'v1/dhubApi/admin/paymentaccept/getallpaymentaccepts',
  EditPaymentAccept: Url + 'v1/dhubApi/admin/paymentaccept/editpaymentaccept',
  DeletPaymentAccept: Url + 'v1/dhubApi/admin/paymentaccept/deletepaymentaccept',

  //OurVendor
  AddOurVendor: Url + 'v1/dhubApi/admin/leadership/addleadership',
  GetOurVendor: Url + 'v1/dhubApi/admin/leadership/getallleaderships',
  EditOurVendor: Url + 'v1/dhubApi/admin/leadership/editleadership',
  DeletOurVendor: Url + 'v1/dhubApi/admin/leadership/deleteleadership',

  //E-Commerce Queries
  GetAllEcommerceQueries: Url + 'v1/dhubApi/admin/adminsupport/getall-store-queries',
  UpdateEcommerceQueries: Url + 'v1/dhubApi/admin/adminsupport/update-store-request',

  //Provider Queries
  GetAllProvideQueries: Url + 'v1/dhubApi/admin/adminsupport/get-provider-queries',
  UpdateProviderQueries: Url + 'v1/dhubApi/admin/adminsupport/update-provider-request',

  AddAppSettings: Url + 'v1/dhubApi/admin/appdisplaysetting/add-app-display-setting',
  GetAppSettings: Url + 'v1/dhubApi/admin/appdisplaysetting/getall-app-display-settings',
  EditAppSettings: Url + 'v1/dhubApi/admin/appdisplaysetting/edit-app-display-setting/',
  DeleteAppSettings: Url + 'v1/dhubApi/admin/appdisplaysetting/delete-app-display-setting/',


  //variations
  getShoppingVariation: Url + 'v1/dhubApi/admin/shop-variation/getall-variations',
  // getAllShoppingVariation: Url + 'v1/dhubApi/admin/shop-variation/getall-active-variations',


  //sub-variations-shopping


  Getdashboardcard: Url + 'v1/dhubApi/admin/dashboard/',

  AddWebsiteManagement: Url + "v1/dhubApi/serviceprovider-website/homeScreen/home",

  GetAllHomeScreens: Url + "v1/dhubApi/serviceprovider-website/homeScreen/",
  EditWebsiteManagement: Url + 'v1/dhubApi/serviceprovider-website/homeScreen/:id',
  GetSingleHomeScreen: Url + 'v1/dhubApi/serviceprovider-website/homeScreen',

  UpdateHomeScreen: Url + 'v1/dhubApi/serviceprovider-website/homeScreen',
  DeleteHomeScreen: Url + 'v1/dhubApi/serviceprovider-website/homeScreen',

  //  /v1/dhubApi/serviceprovider-website/homeScreen/:id

  EditSingleServiceBookingCharge: Url + 'v1/dhubApi/admin/service-booking-charges/single',
  EditSingleOnDemandServiceBookingCharge: Url + 'v1/dhubApi/admin/service-booking-charges/ondemand/single',
  GetprofessionalServices: Url + 'v1/dhubApi/admin/service/getallserives',

  // Knowledge Base
  GetKnowledgeBaseServices: Url + 'v1/dhubApi/admin/services/getall',
  GetKnowledgeBaseCategories: Url + 'v1/dhubApi/admin/knowledge-base/categories/',
  GetKnowledgeBaseSubcategories: Url + 'v1/dhubApi/admin/knowledge-base/subcategories/',
  CreateKnowledgeBase: Url + 'v1/dhubApi/admin/knowledge-base/create',
  GetAllKnowledgeBase: Url + 'v1/dhubApi/admin/knowledge-base/getall',
  GetKnowledgeBaseById: Url + 'v1/dhubApi/admin/knowledge-base/get/',
  UpdateKnowledgeBase: Url + 'v1/dhubApi/admin/knowledge-base/update/',
  DeleteKnowledgeBase: Url + 'v1/dhubApi/admin/knowledge-base/delete/',

  GetServicesByFlagType: Url + 'v1/dhubApi/admin/services/getServicesByFlagType',

  // Careers
  CareersRoles: Url + 'v1/dhubApi/admin/careers/roles',
  CareersUpdateRole: Url + 'v1/dhubApi/admin/careers/update-role/',
  CareersDeleteRole: Url + 'v1/dhubApi/admin/careers/delete-role/',
  CareersJobs: Url + 'v1/dhubApi/admin/careers/all-jobs',
  CareersCreateJob: Url + 'v1/dhubApi/admin/careers/create-job',
  CareersGetJob: Url + 'v1/dhubApi/admin/careers/get-job/',
  CareersUpdateJob: Url + 'v1/dhubApi/admin/careers/update-job/',
  CareersDeleteJob: Url + 'v1/dhubApi/admin/careers/delete-job/',
  CareersApplications: Url + 'v1/dhubApi/admin/careers/all-applications',
  CareersUpdateApplicationStatus: Url + 'v1/dhubApi/admin/careers/update-application-status/',

  // Metrics
  UpdateProviderMetrics: Url + 'v1/dhubApi/admin/provider-metrics/update',
  GetProviderMetrics: Url + 'v1/dhubApi/admin/provider-metrics/get',

  // Notifications
  NotificationHistory: Url + 'v1/dhubApi/admin/notification/history',
  NotificationSend: Url + 'v1/dhubApi/admin/notification/send',
  NotificationDelete: Url + 'v1/dhubApi/admin/notification/delete/',
  NotificationTargets: Url + 'v1/dhubApi/admin/notification/targets',

  //Header Management
  GetNavbarItems: Url + 'v1/dhubApi/admin/navbar-management/get-navbar-items',
  GetAvailableNavbarLabels: Url + 'v1/dhubApi/admin/navbar-management/get-available-labels',
  SaveNavbarStructure: Url + 'v1/dhubApi/admin/navbar-management/save-navbar-structure',
  DeleteNavbarItem: Url + 'v1/dhubApi/admin/navbar-management/delete-navbar-item/',
  AddPoolLabel: Url + 'v1/dhubApi/admin/navbar-management/add-pool-label',
  UpdatePoolLabel: Url + 'v1/dhubApi/admin/navbar-management/update-pool-label/',
  DeletePoolLabel: Url + 'v1/dhubApi/admin/navbar-management/delete-pool-label/',

  ListAmenities: Url + 'v1/dhubApi/admin/professional-services-amenities/list',
  DeleteAmenity: Url + 'v1/dhubApi/admin/professional-services-amenities/delete/',
  UpdateAmenity: Url + 'v1/dhubApi/admin/professional-services-amenities/update/',
  AddAmenity: Url + 'v1/dhubApi/admin/professional-services-amenities/add',
  EditAmenity: Url + 'v1/dhubApi/admin/professional-services-amenities/edit/',
  GetAmenityById: Url + 'v1/dhubApi/admin/professional-services-amenities/',
  GetProfessionalSubcategories: Url + 'v1/dhubApi/admin/professional-services-subcategory/subcategories-for-dropdown',
  GetProfessionalCategories: Url + 'v1/dhubApi/admin/professional-services-category/categoryForDropdown',

  // Spa Hero CMS
  GetSpaHeroSettings: Url + 'v1/dhubApi/admin/spa-hero/get-settings',
  UpdateSpaHeroSettings: Url + 'v1/dhubApi/admin/spa-hero/update-settings',
  ListSpaHeroServices: Url + 'v1/dhubApi/admin/spa-hero/list-services',
  AddSpaHeroService: Url + 'v1/dhubApi/admin/spa-hero/add-service',
  UpdateSpaHeroService: Url + 'v1/dhubApi/admin/spa-hero/update-service/',
  DeleteSpaHeroService: Url + 'v1/dhubApi/admin/spa-hero/delete-service/',
};

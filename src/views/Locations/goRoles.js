const authData = JSON.parse(localStorage.getItem('user'));
const rolesAndPermission = authData.rolesAndPermission[0]


{rolesAndPermission.dashboard_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.country_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.country_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.country_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.country_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.state_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.state_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.state_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.state_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.city_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.city_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.city_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.city_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.zones_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.zones_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.zones_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.zones_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.services_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.services_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.services_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.services_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.access_control_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.department_roles_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.department_roles_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.department_roles_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.department_roles_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.admin_user_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.admin_user_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.admin_user_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.admin_user_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.users_customers_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.users_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.users_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.users_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.blocked_users_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.blocked_users_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.delete_users_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.delete_users_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.delete_users_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.on_demand_services_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_categories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_categories_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_categories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_categories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.on_demand_sub_categories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_sub_categories_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_sub_categories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_sub_categories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.on_demand_child_categories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_child_categories_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_child_categories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_child_categories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.on_demand_service_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_service_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_service_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_service_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.on_demand_coupons_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_coupons_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_coupons_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.on_demand_coupons_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.service_providers_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.all_providers_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.all_providers_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.all_providers_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.all_providers_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.new_providers_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.new_providers_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.new_providers_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.approved_providers_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.approved_providers_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.approved_providers_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.rejected_providers_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.rejected_providers_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.rejected_providers_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.blocked_providers_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.blocked_providers_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.service_bookings_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.verified_bookings_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.verified_bookings_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.nearby_bookings_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.nearby_bookings_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.crm_bookings_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.add_crm_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.add_crm_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.crm_bookings_list_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.crm_bookings_list_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.buy_sell_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.buy_sell_category_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.buy_sell_category_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.buy_sell_category_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.buy_sell_category_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.buy_sell_subcategory_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.buy_sell_subcategory_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.buy_sell_subcategory_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.buy_sell_subcategory_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.sale_request_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.sale_request_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.sale_request_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.sale_request_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.provider_complaints_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.grocery_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_categories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_categories_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_categories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_categories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.grocery_cat_request_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_cat_request_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.grocery_subcategories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_subcategories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_subcategories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.grocery_subcat_request_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_subcat_request_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_subcat_request_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.grocery_brands_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_brands_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_brands_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_brands_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.grocery_units_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_units_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_units_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_units_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.grocery_weight_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_weight_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_weight_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_weight_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.grocery_flavour_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_flavour_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_flavour_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_flavour_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.add_grocery_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_list_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_list_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_list_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.grocery_request_list_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_request_list_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_request_list_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.grocery_orders_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.grocery_orders_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.food_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_categories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_categories_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_categories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_categories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.food_cat_request_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_cat_request_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.food_subcategories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_subcategories_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_subcategories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_subcategories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.food_subcat_request_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_subcat_request_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.cuisine_type_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.cuisine_type_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.cuisine_type_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.cuisine_type_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.add_food_item_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_items_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_items_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_items_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.food_items_request_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_items_request_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.food_orders_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.food_orders_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.shopping_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_categories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_categories_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_categories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_categories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.shopping_cat_request_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_cat_request_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.shopping_subcategories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_subcategories_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_subcategories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_subcategories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.shopping_subcat_request_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_subcat_request_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.shopping_child_categories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_child_categories_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_child_categories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_child_categories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.shop_variations_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shop_variations_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shop_variations_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shop_variations_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.sub_shop_variations_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.sub_shop_variations_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.sub_shop_variations_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.sub_shop_variations_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.size_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.size_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.size_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.size_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.weight_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.weight_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.weight_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.weight_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.color_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.color_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.color_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.color_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.ram_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.ram_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.ram_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.ram_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.brand_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.brand_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.brand_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.brand_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.storage_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.storage_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.storage_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.storage_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.fit_type_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.fit_type_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.fit_type_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.fit_type_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.neck_type_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.neck_type_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.neck_type_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.neck_type_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.material_type_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.material_type_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.material_type_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.material_type_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.product_type_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.product_type_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.product_type_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.product_type_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.sleeve_type_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.sleeve_type_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.sleeve_type_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.sleeve_type_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.operating_system_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.operating_system_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.operating_system_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.operating_system_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.country_origin_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.country_origin_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.country_origin_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.country_origin_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.add_shopping_item_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_items_list_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_items_list_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_items_list_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.shopping_items_request_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_items_request_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.shopping_orders_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shopping_orders_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.medicine_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_categories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_categories_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_categories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_categories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.medicine_cat_request_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_cat_request_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.medicine_subcategories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_subcategories_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_subcategories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_subcategories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.medicine_subcat_request_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_subcat_request_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.medicine_child_categories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_child_categories_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_child_categories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_child_categories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.medicine_brands_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_brands_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_brands_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_brands_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.medicine_units_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_units_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_units_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_units_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.medicine_weight_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_weight_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_weight_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_weight_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.medicine_form_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_form_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_form_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicine_form_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.packing_types_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.packing_types_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.packing_types_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.packing_types_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.therapeutic_class_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.therapeutic_class_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.therapeutic_class_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.therapeutic_class_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.drug_categories_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.drug_categories_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.drug_categories_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.drug_categories_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.add_medicine_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicines_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicines_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicines_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.medicines_request_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicines_request_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.medicines_orders_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.medicines_orders_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.stores_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.pending_stores_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.pending_stores_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.stores_list_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.stores_list_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.stores_list_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.stores_list_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.blocked_stores_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.blocked_stores_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.delivery_partners_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.delivery_partners_list_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.delivery_partners_list_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.delivery_partners_list_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.delivery_partners_list_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.blocked_delivery_partners_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.blocked_delivery_partners_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.ecommerce_complaints_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.ecommerce_complaints_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.subscription_plan_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.subscription_plans_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.subscription_plans_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.subscription_plans_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.subscription_plans_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.subscription_history_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.notification_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.send_notification_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.app_notification_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.banner_items_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.banner_items_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.banner_items_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.banner_items_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.payments_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.stores_payments_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.stores_payments_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.stores_payouts_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.stores_payouts_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.drives_payments_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.drives_payments_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.drives_payouts_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.drives_payouts_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.providers_payments_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.providers_payments_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.providers_payouts_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.providers_payouts_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.wallet_transaction_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.wallet_transaction_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.payout_requests_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.payout_requests_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.website_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.home_page_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.home_page_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.about_us_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.about_us_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.our_leadership_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.our_leadership_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.testimonials_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.testimonials_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.blog_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.blog_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.blog_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.blog_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.app_screens_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.app_screens_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.app_download_screen_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.app_download_screen_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.app_scrolling_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.app_scrolling_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.announcements_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.announcements_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.announcements_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.announcements_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.accept_payments_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.accept_payments_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.website_headings_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.website_headings_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.enquiry_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.enquiry_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.settings_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.global_settings_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.global_settings_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.app_settings_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.app_settings_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.radius_configuration_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.radius_configuration_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.tax_setting_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.tax_setting_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.delivery_charges_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.delivery_charges_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.terms_conditions_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.terms_conditions_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.service_terms_conditions_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.service_terms_conditions_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.privacy_policy_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.privacy_policy_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.service_privacy_policy_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.service_privacy_policy_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.refund_policy_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.refund_policy_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.service_refund_policy_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.service_refund_policy_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.shipping_policy_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.shipping_policy_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.service_shipping_policy_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.service_shipping_policy_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.faqs_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.faqs_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.faqs_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.faqs_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}

{rolesAndPermission.service_faqs_view === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.service_faqs_add === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.service_faqs_edit === true || rolesAndPermission.accessAll === true ? <></> : <></>}
{rolesAndPermission.service_faqs_delete === true || rolesAndPermission.accessAll === true ? <></> : <></>}


//add it on add roles 
provider_complaints_edit
provider_complaints_delete

grocery_cat_request_delete

grocery_subcategories_add

food_cat_request_delete

food_subcat_request_delete

food_items_request_delete

shopping_cat_request_delete

shopping_subcat_request_delete

shopping_items_request_delete

medicine_cat_request_delete

medicine_subcat_request_delete

medicines_request_delete

pending_stores_delete

blocked_stores_delete

blocked_delivery_partners_delete

ecommerce_complaints_delete

send_notification_delete

app_notification_add

app_notification_delete


const rolesAndPermissions = {
    "dashboard_view": true,
    "locations_view": true,
    "country_add": true,
    "country_edit": true,
    "country_delete": true,
    "country_view": true,
    "state_add": true,
    "state_edit": true,
    "state_delete": true,
    "state_view": true,
    "city_add": true,
    "city_edit": true,
    "city_delete": true,
    "city_view": true,
    "zones_add": true,
    "zones_edit": true,
    "zones_delete": true,
    "zones_view": true,
    "services_add": true,
    "services_edit": true,
    "services_delete": true,
    "services_view": true,
    "access_control_view": true,
    "department_roles_add": true,
    "department_roles_edit": true,
    "department_roles_delete": true,
    "department_roles_view": true,
    "admin_user_add": true,
    "admin_user_edit": true,
    "admin_user_delete": true,
    "admin_user_view": true,
    "users_customers_view": true,
    "users_edit": true,
    "users_delete": true,
    "users_view": true,
    "blocked_users_edit": true,
    "blocked_users_view": true,
    "delete_users_edit": true,
    "delete_users_delete": true,
    "delete_users_view": true,
    "on_demand_services_view": true,
    "on_demand_categories_add": true,
    "on_demand_categories_edit": true,
    "on_demand_categories_delete": true,
    "on_demand_categories_view": true,
    "on_demand_sub_categories_add": true,
    "on_demand_sub_categories_edit": true,
    "on_demand_sub_categories_delete": true,
    "on_demand_sub_categories_view": true,
    "on_demand_child_categories_add": true,
    "on_demand_child_categories_edit": true,
    "on_demand_child_categories_delete": true,
    "on_demand_child_categories_view": true,
    "on_demand_service_add": true,
    "on_demand_service_edit": true,
    "on_demand_service_delete": true,
    "on_demand_service_view": true,
    "on_demand_coupons_add": true,
    "on_demand_coupons_edit": true,
    "on_demand_coupons_delete": true,
    "on_demand_coupons_view": true,
    "service_providers_view": true,
    "all_providers_add": true,
    "all_providers_edit": true,
    "all_providers_delete": true,
    "all_providers_view": true,
    "new_providers_edit": true,
    "new_providers_delete": true,
    "new_providers_view": true,
    "approved_providers_edit": true,
    "approved_providers_delete": true,
    "approved_providers_view": true,
    "rejected_providers_edit": true,
    "rejected_providers_delete": true,
    "rejected_providers_view": true,
    "blocked_providers_edit": true,
    "blocked_providers_view": true,
    "service_bookings_view": true,
    "verified_bookings_edit": true,
    "verified_bookings_view": true,
    "nearby_bookings_edit": true,
    "nearby_bookings_view": true,
    "crm_bookings_view": true,
    "add_crm_edit": true,
    "add_crm_view": true,
    "crm_bookings_list_edit": true,
    "crm_bookings_list_view": true,
    "buy_sell_view": true,
    "buy_sell_category_add": true,
    "buy_sell_category_edit": true,
    "buy_sell_category_delete": true,
    "buy_sell_category_view": true,
    "buy_sell_subcategory_add": true,
    "buy_sell_subcategory_edit": true,
    "buy_sell_subcategory_delete": true,
    "buy_sell_subcategory_view": true,
    "sale_request_add": true,
    "sale_request_edit": true,
    "sale_request_delete": true,
    "sale_request_view": true,
    "provider_complaints_view": true,
    "grocery_view": true,
    "grocery_categories_add": true,
    "grocery_categories_edit": true,
    "grocery_categories_delete": true,
    "grocery_categories_view": true,
    "grocery_cat_request_edit": true,
    "grocery_cat_request_view": true,
    "grocery_subcategories_edit": true,
    "grocery_subcategories_delete": true,
    "grocery_subcategories_view": true,
    "grocery_subcat_request_edit": true,
    "grocery_subcat_request_delete": true,
    "grocery_subcat_request_view": true,
    "grocery_brands_add": true,
    "grocery_brands_edit": true,
    "grocery_brands_delete": true,
    "grocery_brands_view": true,
    "grocery_units_add": true,
    "grocery_units_edit": true,
    "grocery_units_delete": true,
    "grocery_units_view": true,
    "grocery_weight_add": true,
    "grocery_weight_edit": true,
    "grocery_weight_delete": true,
    "grocery_weight_view": true,
    "grocery_flavour_add": true,
    "grocery_flavour_edit": true,
    "grocery_flavour_delete": true,
    "grocery_flavour_view": true,
    "add_grocery_add": true,
    "grocery_list_edit": true,
    "grocery_list_delete": true,
    "grocery_list_view": true,
    "grocery_request_list_edit": true,
    "grocery_request_list_delete": true,
    "grocery_request_list_view": true,
    "grocery_orders_edit": true,
    "grocery_orders_view": true,
    "food_view": true,
    "food_categories_add": true,
    "food_categories_edit": true,
    "food_categories_delete": true,
    "food_categories_view": true,
    "food_cat_request_edit": true,
    "food_cat_request_view": true,
    "food_subcategories_add": true,
    "food_subcategories_edit": true,
    "food_subcategories_delete": true,
    "food_subcategories_view": true,
    "food_subcat_request_edit": true,
    "food_subcat_request_view": true,
    "cuisine_type_add": true,
    "cuisine_type_edit": true,
    "cuisine_type_delete": true,
    "cuisine_type_view": true,
    "add_food_item_add": true,
    "food_items_edit": true,
    "food_items_delete": true,
    "food_items_view": true,
    "food_items_request_edit": true,
    "food_items_request_view": true,
    "food_orders_edit": true,
    "food_orders_view": true,
    "shopping_view": true,
    "shopping_categories_add": true,
    "shopping_categories_edit": true,
    "shopping_categories_delete": true,
    "shopping_categories_view": true,
    "shopping_cat_request_edit": true,
    "shopping_cat_request_view": true,
    "shopping_subcategories_add": true,
    "shopping_subcategories_edit": true,
    "shopping_subcategories_delete": true,
    "shopping_subcategories_view": true,
    "shopping_subcat_request_edit": true,
    "shopping_subcat_request_view": true,
    "shopping_child_categories_add": true,
    "shopping_child_categories_edit": true,
    "shopping_child_categories_delete": true,
    "shopping_child_categories_view": true,
    "shop_variations_add": true,
    "shop_variations_edit": true,
    "shop_variations_delete": true,
    "shop_variations_view": true,
    "sub_shop_variations_add": true,
    "sub_shop_variations_edit": true,
    "sub_shop_variations_delete": true,
    "sub_shop_variations_view": true,
    "size_add": true,
    "size_edit": true,
    "size_delete": true,
    "size_view": true,
    "weight_add": true,
    "weight_edit": true,
    "weight_delete": true,
    "weight_view": true,
    "color_add": true,
    "color_edit": true,
    "color_delete": true,
    "color_view": true,
    "ram_add": true,
    "ram_edit": true,
    "ram_delete": true,
    "ram_view": true,
    "brand_add": true,
    "brand_edit": true,
    "brand_delete": true,
    "brand_view": true,
    "storage_add": true,
    "storage_edit": true,
    "storage_delete": true,
    "storage_view": true,
    "fit_type_add": true,
    "fit_type_edit": true,
    "fit_type_delete": true,
    "fit_type_view": true,
    "neck_type_add": true,
    "neck_type_edit": true,
    "neck_type_delete": true,
    "neck_type_view": true,
    "material_type_add": true,
    "material_type_edit": true,
    "material_type_delete": true,
    "material_type_view": true,
    "product_type_add": true,
    "product_type_edit": true,
    "product_type_delete": true,
    "product_type_view": true,
    "sleeve_type_add": true,
    "sleeve_type_edit": true,
    "sleeve_type_delete": true,
    "sleeve_type_view": true,
    "operating_system_add": true,
    "operating_system_edit": true,
    "operating_system_delete": true,
    "operating_system_view": true,
    "country_origin_add": true,
    "country_origin_edit": true,
    "country_origin_delete": true,
    "country_origin_view": true,
    "add_shopping_item_add": true,
    "shopping_items_list_edit": true,
    "shopping_items_list_delete": true,
    "shopping_items_list_view": true,
    "shopping_items_request_edit": true,
    "shopping_items_request_view": true,
    "shopping_orders_edit": true,
    "shopping_orders_view": true,
    "medicine_view": true,
    "medicine_categories_add": true,
    "medicine_categories_edit": true,
    "medicine_categories_delete": true,
    "medicine_categories_view": true,
    "medicine_cat_request_edit": true,
    "medicine_cat_request_view": true,
    "medicine_subcategories_add": true,
    "medicine_subcategories_edit": true,
    "medicine_subcategories_delete": true,
    "medicine_subcategories_view": true,
    "medicine_subcat_request_edit": true,
    "medicine_subcat_request_view": true,
    "medicine_child_categories_add": true,
    "medicine_child_categories_edit": true,
    "medicine_child_categories_delete": true,
    "medicine_child_categories_view": true,
    "medicine_brands_add": true,
    "medicine_brands_edit": true,
    "medicine_brands_delete": true,
    "medicine_brands_view": true,
    "medicine_units_add": true,
    "medicine_units_edit": true,
    "medicine_units_delete": true,
    "medicine_units_view": true,
    "medicine_weight_add": true,
    "medicine_weight_edit": true,
    "medicine_weight_delete": true,
    "medicine_weight_view": true,
    "medicine_form_add": true,
    "medicine_form_edit": true,
    "medicine_form_delete": true,
    "medicine_form_view": true,
    "packing_types_add": true,
    "packing_types_edit": true,
    "packing_types_delete": true,
    "packing_types_view": true,
    "therapeutic_class_add": true,
    "therapeutic_class_edit": true,
    "therapeutic_class_delete": true,
    "therapeutic_class_view": true,
    "drug_categories_add": true,
    "drug_categories_edit": true,
    "drug_categories_delete": true,
    "drug_categories_view": true,
    "add_medicine_add": true,
    "medicines_edit": true,
    "medicines_delete": true,
    "medicines_view": true,
    "medicines_request_edit": true,
    "medicines_request_view": true,
    "medicines_orders_edit": true,
    "medicines_orders_view": true,
    "stores_view": true,
    "pending_stores_edit": true,
    "pending_stores_view": true,
    "stores_list_add": true,
    "stores_list_edit": true,
    "stores_list_delete": true,
    "stores_list_view": true,
    "blocked_stores_edit": true,
    "blocked_stores_view": true,
    "delivery_partners_view": true,
    "delivery_partners_list_add": true,
    "delivery_partners_list_edit": true,
    "delivery_partners_list_delete": true,
    "delivery_partners_list_view": true,
    "blocked_delivery_partners_edit": true,
    "blocked_delivery_partners_view": true,
    "ecommerce_complaints_view": true,
    "ecommerce_complaints_edit": true,
    "subscription_plan_view": true,
    "subscription_plans_add": true,
    "subscription_plans_edit": true,
    "subscription_plans_delete": true,
    "subscription_plans_view": true,
    "subscription_history_view": true,
    "notification_view": true,
    "send_notification_add": true,
    "app_notification_view": true,
    "banner_items_view": true,
    "banner_items_add": true,
    "banner_items_edit": true,
    "banner_items_delete": true,
    "payments_view": true,
    "stores_payments_view": true,
    "stores_payments_edit": true,
    "stores_payouts_view": true,
    "stores_payouts_edit": true,
    "drives_payments_view": true,
    "drives_payments_edit": true,
    "drives_payouts_view": true,
    "drives_payouts_edit": true,
    "providers_payments_view": true,
    "providers_payments_edit": true,
    "providers_payouts_view": true,
    "providers_payouts_edit": true,
    "wallet_transaction_view": true,
    "wallet_transaction_edit": true,
    "payout_requests_view": true,
    "payout_requests_edit": true,
    "website_view": true,
    "home_page_edit": true,
    "home_page_view": true,
    "about_us_edit": true,
    "about_us_view": true,
    "our_leadership_edit": true,
    "our_leadership_view": true,
    "testimonials_edit": true,
    "testimonials_view": true,
    "blog_add": true,
    "blog_edit": true,
    "blog_delete": true,
    "blog_view": true,
    "app_screens_edit": true,
    "app_screens_view": true,
    "app_download_screen_edit": true,
    "app_download_screen_view": true,
    "app_scrolling_edit": true,
    "app_scrolling_view": true,
    "announcements_add": true,
    "announcements_edit": true,
    "announcements_delete": true,
    "announcements_view": true,
    "accept_payments_edit": true,
    "accept_payments_view": true,
    "website_headings_edit": true,
    "website_headings_view": true,
    "enquiry_view": true,
    "enquiry_delete": true,
    "settings_view": true,
    "global_settings_edit": true,
    "global_settings_view": true,
    "app_settings_edit": true,
    "app_settings_view": true,
    "radius_configuration_edit": true,
    "radius_configuration_view": true,
    "tax_setting_edit": true,
    "tax_setting_view": true,
    "delivery_charges_edit": true,
    "delivery_charges_view": true,
    "terms_conditions_edit": true,
    "terms_conditions_view": true,
    "service_terms_conditions_edit": true,
    "service_terms_conditions_view": true,
    "privacy_policy_edit": true,
    "privacy_policy_view": true,
    "service_privacy_policy_edit": true,
    "service_privacy_policy_view": true,
    "refund_policy_edit": true,
    "refund_policy_view": true,
    "service_refund_policy_edit": true,
    "service_refund_policy_view": true,
    "shipping_policy_edit": true,
    "shipping_policy_view": true,
    "service_shipping_policy_edit": true,
    "service_shipping_policy_view": true,
    "faqs_add": true,
    "faqs_edit": true,
    "faqs_delete": true,
    "faqs_view": true,
    "service_faqs_add": true,
    "service_faqs_edit": true,
    "service_faqs_delete": true,
    "service_faqs_view": true
}
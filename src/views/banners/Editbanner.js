

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Select,
  MenuItem,
  Box,
  Grid,
  CircularProgress,
  Typography,
  IconButton 
} from "@mui/material";
import { IconUpload, IconPhoto,IconCameraPlus ,IconX } from '@tabler/icons-react';

import {ArrowUpward } from '@mui/icons-material';

import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import ParentCard from "../../components/shared/ParentCard";
import PageContainer from "src/components/container/PageContainer";

const API_BASE = "https://api.doorstephub.com/v1/dhubApi/admin";
const URLS = {
  GetServices: `${API_BASE}/service/getallserives`,
  GetCountry: `${API_BASE}/country/getallcountrys`,
  GetStatesByCountryId: `${API_BASE}/state/getstatesbycountryid`,
  GetCitiesByStateId: `${API_BASE}/city/get-cities`,
  GetZonesByCityId: `${API_BASE}/zone/getzonesbycityId`,
  GetCategoriesByServiceId: `${API_BASE}/category/getallcategorysById`,
  GetBannerById: `${API_BASE}/category-banner/get`,
  UpdateBanner: `${API_BASE}/category-banner/update`,
};

const getAuthToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token || "";
  } catch {
    return "";
  }
};

const EditCategoryBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getAuthToken();

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [services, setServices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    serviceId: "",
    countryId: "",
    stateId: "",
    cityId: "",
    zoneId: "",
    categoryId: "",
    bannerImage: null,
    bannerImagePreview: "",
    states: [],
    cities: [],
    zones: [],
  });

  const lastCountryId = useRef(null);
  const lastStateId = useRef(null);
  const lastCityId = useRef(null);
  const lastServiceId = useRef(null);
  const isPrefilling = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const updateForm = (patch) => {
    if (!mounted.current) return;
    setForm((p) => ({ ...p, ...patch }));
  };

  // Fetch categories by service ID
  const fetchCategoriesByService = useCallback(
    async (serviceId) => {
      if (!serviceId) {
        setCategories([]);
        return;
      }
      
      if (lastServiceId.current === serviceId) return;
      lastServiceId.current = serviceId;

      try {
        const res = await axios.post(
          URLS.GetCategoriesByServiceId,
          { serviceId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res?.data?.success) {
          setCategories(res.data.category || []);
          if (!isPrefilling.current) {
            updateForm({ categoryId: "" });
          }
        } else {
          setCategories([]);
          toast.error("Failed to load categories");
        }
      } catch (err) {
        console.error("fetchCategoriesByService err", err);
        setCategories([]);
        toast.error("Failed loading categories");
      }
    },
    [token]
  );

  // Fetch states by country ID
  const fetchStatesByCountry = useCallback(
    async (countryId) => {
      if (!countryId) return;
      if (lastCountryId.current === countryId) return;

      lastCountryId.current = countryId;

      try {
        const res = await axios.post(
          URLS.GetStatesByCountryId,
          { country_id: countryId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res?.data?.success) {
          updateForm({
            states: res.data.states || [],
            stateId: isPrefilling.current ? form.stateId : "",
            cities: isPrefilling.current ? form.cities : [],
            cityId: isPrefilling.current ? form.cityId : "",
            zones: isPrefilling.current ? form.zones : [],
            zoneId: isPrefilling.current ? form.zoneId : "",
          });
        } else {
          updateForm({
            states: [],
            stateId: "",
            cities: [],
            cityId: "",
            zones: [],
            zoneId: "",
          });
          toast.error("Failed to load states");
        }
      } catch (err) {
        console.error("fetchStatesByCountry err", err);
        toast.error("Failed loading states");
      }
    },
    [token, form.stateId, form.cityId, form.zoneId, form.cities, form.zones]
  );

  // Fetch cities by state ID
  const fetchCitiesByState = useCallback(
    async (stateId) => {
      if (!stateId) return;
      if (lastStateId.current === stateId) return;

      lastStateId.current = stateId;

      try {
        const res = await axios.post(
          URLS.GetCitiesByStateId,
          { state_id: stateId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res?.data?.success) {
          updateForm({
            cities: res.data.cities || [],
            cityId: isPrefilling.current ? form.cityId : "",
            zones: isPrefilling.current ? form.zones : [],
            zoneId: isPrefilling.current ? form.zoneId : "",
          });
        } else {
          updateForm({
            cities: [],
            cityId: "",
            zones: [],
            zoneId: "",
          });
          toast.error("Failed to load cities");
        }
      } catch (err) {
        console.error("fetchCitiesByState err", err);
        toast.error("Failed loading cities");
      }
    },
    [token, form.cityId, form.zoneId, form.zones]
  );

  // Fetch zones by city ID
  const fetchZonesByCity = useCallback(
    async (cityId) => {
      if (!cityId) return;
      if (lastCityId.current === cityId) return;

      lastCityId.current = cityId;

      try {
        const res = await axios.post(
          URLS.GetZonesByCityId,
          { cityId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res?.data?.success) {
          updateForm({
            zones: res.data.zones || [],
            zoneId: isPrefilling.current ? form.zoneId : "",
          });
        } else {
          updateForm({
            zones: [],
            zoneId: "",
          });
          // Don't show error if zones array is empty - it's valid
          if (!res?.data?.success) {
            toast.error("Failed to load zones");
          }
        }
      } catch (err) {
        console.error("fetchZonesByCity err", err);
        toast.error("Failed loading zones");
      }
    },
    [token, form.zoneId]
  );

  // Auto-fetch dependent dropdowns when IDs change (user interaction)
  useEffect(() => {
    if (!form.serviceId || isPrefilling.current) return;
    if (form.serviceId !== lastServiceId.current) {
      fetchCategoriesByService(form.serviceId);
    }
  }, [form.serviceId, fetchCategoriesByService]);

  useEffect(() => {
    if (!form.countryId || isPrefilling.current) return;
    if (form.countryId !== lastCountryId.current) {
      fetchStatesByCountry(form.countryId);
    }
  }, [form.countryId, fetchStatesByCountry]);

  useEffect(() => {
    if (!form.stateId || isPrefilling.current) return;
    if (form.stateId !== lastStateId.current) {
      fetchCitiesByState(form.stateId);
    }
  }, [form.stateId, fetchCitiesByState]);

  useEffect(() => {
    if (!form.cityId || isPrefilling.current) return;
    if (form.cityId !== lastCityId.current) {
      fetchZonesByCity(form.cityId);
    }
  }, [form.cityId, fetchZonesByCity]);

  // Handle user selection changes
  const handleChange = (name, value) => {
    if (name === "serviceId") {
      updateForm({
        serviceId: value,
        categoryId: "",
      });
    } else if (name === "countryId") {
      updateForm({
        countryId: value,
        stateId: "",
        cityId: "",
        zoneId: "",
        states: [],
        cities: [],
        zones: [],
      });
    } else if (name === "stateId") {
      updateForm({
        stateId: value,
        cityId: "",
        zoneId: "",
        cities: [],
        zones: [],
      });
    } else if (name === "cityId") {
      updateForm({
        cityId: value,
        zoneId: "",
        zones: [],
      });
    } else {
      updateForm({ [name]: value });
    }
  };

  // Image upload handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    updateForm({
      bannerImage: file,
      bannerImagePreview: URL.createObjectURL(file),
    });
  };

  // INITIAL LOAD: Fetch all data and prefill banner
  useEffect(() => {
    if (!token || !id) {
      toast.error("Authentication or id missing");
      return;
    }

    const fetchInit = async () => {
      setPageLoading(true);
      isPrefilling.current = true;

      try {
        // Step 1: Fetch services, countries, and banner details in parallel
        const [svRes, countryRes, bannerRes] = await Promise.all([
          axios.post(URLS.GetServices, {}, { headers: { Authorization: `Bearer ${token}` } }),
          axios.post(URLS.GetCountry, {}, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${URLS.GetBannerById}/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        // Set services and countries
        if (svRes?.data?.success) setServices(svRes.data.services || []);
        if (countryRes?.data?.success) setCountries(countryRes.data.country || []);

        // Process banner data
        if (!bannerRes?.data?.success || !bannerRes.data.data) {
          toast.error("Failed to load banner details");
          setPageLoading(false);
          return;
        }

        const bannerData = bannerRes.data.data;
        const bannerServiceId = bannerData?.serviceId?._id || "";
        const bannerCityId = bannerData?.cityId?._id || "";
        const bannerCityName = bannerData?.cityId?.name || "";
        const bannerZoneId = bannerData?.zoneId?._id || "";
        const bannerCategoryId = bannerData?.categoryId?._id || "";

        // Step 2: Fetch categories for the service
        if (bannerServiceId) {
          try {
            const catRes = await axios.post(
              URLS.GetCategoriesByServiceId,
              { serviceId: bannerServiceId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (catRes?.data?.success) {
              setCategories(catRes.data.category || []);
              lastServiceId.current = bannerServiceId;
            }
          } catch (err) {
            console.error("Failed to fetch categories", err);
          }
        }

        // Step 3: Find country and state for the city
        let foundCountryId = null;
        let foundStateId = null;
        let statesList = [];
        let citiesList = [];
        let zonesList = [];

        if (bannerCityId && countryRes?.data?.success) {
          const allCountries = countryRes.data.country || [];

          // Fetch states for all countries in parallel
          const statePromises = allCountries.map((country) =>
            axios
              .post(
                URLS.GetStatesByCountryId,
                { country_id: country._id },
                { headers: { Authorization: `Bearer ${token}` } }
              )
              .then((r) => ({
                countryId: country._id,
                states: r?.data?.states || [],
              }))
              .catch(() => ({ countryId: country._id, states: [] }))
          );

          const allStatesResults = await Promise.all(statePromises);

          // Fetch cities for all states in parallel (batch processing)
          const batchSize = 10;
          const allStates = allStatesResults.flatMap((sr) =>
            sr.states.map((state) => ({ countryId: sr.countryId, state }))
          );

          for (let i = 0; i < allStates.length && !foundCountryId; i += batchSize) {
            const batch = allStates.slice(i, i + batchSize);
            const cityPromises = batch.map(({ countryId, state }) =>
              axios
                .post(
                  URLS.GetCitiesByStateId,
                  { state_id: state._id },
                  { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => ({
                  countryId,
                  stateId: state._id,
                  cities: r?.data?.cities || [],
                }))
                .catch(() => ({ countryId, stateId: state._id, cities: [] }))
            );

            const citiesResults = await Promise.all(cityPromises);

            // Check if any result contains the target city
            for (const result of citiesResults) {
              const cityMatch = result.cities.find((c) => c._id === bannerCityId);
              if (cityMatch) {
                foundCountryId = result.countryId;
                foundStateId = result.stateId;
                citiesList = result.cities;
                
                // Get states list for found country
                const countryStates = allStatesResults.find((sr) => sr.countryId === foundCountryId);
                statesList = countryStates?.states || [];
                
                break;
              }
            }
          }
        }

        // Step 4: Fetch zones for the city
        if (bannerCityId) {
          try {
            const zonesRes = await axios.post(
              URLS.GetZonesByCityId,
              { cityId: bannerCityId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (zonesRes?.data?.success) {
              zonesList = zonesRes.data.zones || [];
            }
          } catch (err) {
            console.error("Failed to fetch zones", err);
          }
        }

        // Step 5: Update refs to prevent duplicate fetches
        if (bannerServiceId) lastServiceId.current = bannerServiceId;
        if (foundCountryId) lastCountryId.current = foundCountryId;
        if (foundStateId) lastStateId.current = foundStateId;
        if (bannerCityId) lastCityId.current = bannerCityId;

        // Step 6: Update form with all data
        updateForm({
          serviceId: bannerServiceId,
          countryId: foundCountryId || "",
          stateId: foundStateId || "",
          cityId: bannerCityId,
          zoneId: bannerZoneId,
          categoryId: bannerCategoryId,
          bannerImage: null,
          bannerImagePreview: bannerData?.bannerImage
            ? `${API_BASE.replace("/v1/dhubApi/admin", "")}/${bannerData.bannerImage}`
            : "",
          states: statesList,
          cities: citiesList,
          zones: zonesList,
        });

      } catch (err) {
        console.error("Initialization error:", err);
        toast.error("Failed to load data");
      } finally {
        isPrefilling.current = false;
        setPageLoading(false);
      }
    };

    fetchInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();

      if (form.serviceId) fd.append("serviceId", form.serviceId);
      if (form.countryId) fd.append("countryId", form.countryId);
      if (form.stateId) fd.append("stateId", form.stateId);
      if (form.cityId) fd.append("cityId", form.cityId);
      if (form.zoneId) fd.append("zoneId", form.zoneId);
      if (form.categoryId) fd.append("categoryId", form.categoryId);
      if (form.bannerImage) {
        fd.append("bannerImage", form.bannerImage, form.bannerImage.name);
      }

      const res = await axios.put(`${URLS.UpdateBanner}/${id}`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.data?.success) {
        toast.success("Banner updated successfully");
        navigate("/advertisments/categorybanners");
      } else {
        toast.error(res?.data?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Update request failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <PageContainer title="Edit Category Banner">
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  const safeSelectValue = (list, value) => 
    (list && list.find((item) => item._id === value) ? value : "");

  return (
    <PageContainer title="Edit Category Banner">
      <ToastContainer autoClose={3000} />

      <Typography variant="h5" mb={3}>
        Edit Category Banner
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <ParentCard title="Banner" sx={{ mb: 3 }}>
          <Grid container spacing={2}>

            {/* SERVICE */}
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="service-select" required>
                Service
              </CustomFormLabel>
              <Select
                labelId="service-label"
                id="service-select"
                name="serviceId"
                fullWidth
                value={safeSelectValue(services, form.serviceId)}
                onChange={(e) => handleChange("serviceId", e.target.value)}
              >
                {services.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.servicetypeName || s.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* COUNTRY */}
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="country-select" required>
                Country
              </CustomFormLabel>
              <Select
                labelId="country-label"
                id="country-select"
                name="countryId"
                fullWidth
                value={safeSelectValue(countries, form.countryId)}
                onChange={(e) => handleChange("countryId", e.target.value)}
              >
                {countries.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* CATEGORY */}
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="category-select" required>
                Category
              </CustomFormLabel>
              <Select
                labelId="category-label"
                id="category-select"
                name="categoryId"
                fullWidth
                disabled={!form.serviceId}
                value={safeSelectValue(categories, form.categoryId)}
                onChange={(e) => handleChange("categoryId", e.target.value)}
              >
                {categories.length === 0 && form.serviceId && (
                  <MenuItem disabled>No categories available</MenuItem>
                )}
                {categories.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* STATE */}
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="state-select" required>
                State
              </CustomFormLabel>
              <Select
                labelId="state-label"
                id="state-select"
                name="stateId"
                fullWidth
                disabled={!form.countryId}
                value={safeSelectValue(form.states, form.stateId)}
                onChange={(e) => handleChange("stateId", e.target.value)}
              >
                {form.states.length === 0 && form.countryId && (
                  <MenuItem disabled>No states available</MenuItem>
                )}
                {form.states.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* CITY */}
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="city-select" required>
                City
              </CustomFormLabel>
              <Select
                labelId="city-label"
                id="city-select"
                name="cityId"
                fullWidth
                disabled={!form.stateId}
                value={safeSelectValue(form.cities, form.cityId)}
                onChange={(e) => handleChange("cityId", e.target.value)}
              >
                {form.cities.length === 0 && form.stateId && (
                  <MenuItem disabled>No cities available</MenuItem>
                )}
                {form.cities.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* ZONE */}
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="zone-select" required>
                Zone
              </CustomFormLabel>
              <Select
                labelId="zone-label"
                id="zone-select"
                name="zoneId"
                fullWidth
                disabled={!form.cityId}
                value={safeSelectValue(form.zones, form.zoneId)}
                onChange={(e) => handleChange("zoneId", e.target.value)}
              >
                {form.zones.length === 0 && form.cityId && (
                  <MenuItem disabled>No zones available</MenuItem>
                )}
                {form.zones.map((z) => (
                  <MenuItem key={z._id} value={z._id}>
                    {z.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

      

<Grid item xs={12} sm={4}>
  <CustomFormLabel htmlFor="banner-image" required>
    Banner Image
  </CustomFormLabel>
  
  {/* Upload Button - Only show when NO image */}
  {!form.bannerImagePreview && (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <input
        id="banner-image"
        name="bannerImage"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        style={{
          opacity: 0,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
      />
      <Button
        component="label"
        htmlFor="banner-image"
        variant="outlined"
        startIcon={<IconUpload size={20} />}
        sx={{
          textTransform: 'none',
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          py: 1.5,
          px: 3,
          minWidth: 180,
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        Choose Banner Image
      </Button>
    </Box>
  )}

  {/* Image Preview with X (top-right) + Camera (top-left) */}
  {form.bannerImagePreview && (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Box
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 1,
            width: 200,
            height: 120,
            mx: 'auto',
            border: '2px solid',
            borderColor: 'divider',
          }}
        >
          <img 
            src={form.bannerImagePreview} 
            alt="Banner Preview"
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }} 
          />
          
          {/* Ã°Å¸â€â€ž CHANGE CAMERA ICON - Top-LEFT corner */}
          <IconButton
            component="label"
            htmlFor="banner-image-change"
            size="small"
            sx={{
              position: 'absolute',
              top: 4,
              left: 4,
              bgcolor: 'primary.main',
              color: 'white',
              width: 32,
              height: 32,
              minWidth: 0,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            <ArrowUpward size={16} />
          </IconButton>

          {/* Ã¢ÂÅ’ REMOVE X ICON - Top-RIGHT corner */}
          <IconButton
            size="small"
            onClick={() => {
              setForm(prev => ({
                ...prev,
                bannerImage: null,
                bannerImagePreview: null
              }));
            }}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              bgcolor: 'error.main',
              color: 'white',
              width: 32,
              height: 32,
              minWidth: 0,
              '&:hover': {
                bgcolor: 'error.dark',
              },
            }}
          >
            <IconX size={16} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )}

  {/* Hidden input for CHANGE functionality */}
  {form.bannerImagePreview && (
    <input
      id="banner-image-change"
      name="bannerImage"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={handleFileChange}
      style={{
        opacity: 0,
        position: 'absolute',
        width: 0,
        height: 0,
      }}
    />
  )}
</Grid>
          </Grid>
               <Box textAlign="right">
          <Button
            variant="outlined"
            sx={{ mr: 2 }}
            onClick={() => navigate("/advertisments/categorybanners")}
          >
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Update Banner"}
          </Button>
        </Box>  
        </ParentCard>

   
      </form>
    </PageContainer>
  );
};

export default EditCategoryBanner;


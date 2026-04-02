// =========================
// FULL UPDATED CODE (MULTIPLE REMOVED)
// =========================

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Grid,
  CircularProgress,
  Typography,
  
} from "@mui/material";

import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';

import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';

// import { IconArrowBackUp } from '@tabler/icons-react';

// const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Category Banner' }];

import { IconArrowBackUp } from '@tabler/icons-react';
import ArrowUpward from '@mui/icons-material/ArrowUpward'; 
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import ParentCard from "../../components/shared/ParentCard";
import PageContainer from "src/components/container/PageContainer";


const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Category Banner' }];

const API_BASE = "https://api.doorstephub.com/v1/dhubApi/admin";
const URLS = {
  GetServices: `${API_BASE}/service/getallserives`,
  GetCountry: `${API_BASE}/country/getallcountrys`,
  GetStatesByCountryId: `${API_BASE}/state/getstatesbycountryid`,
  GetCitiesByStateId: `${API_BASE}/city/get-cities`,
  GetZonesByCityId: `${API_BASE}/zone/getzonesbycityId`,
  GetCategories: `${API_BASE}/category/getallcategorys`,
  CreateBanner: `${API_BASE}/category-banner/create`,
};

const getAuthToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token || "";
  } catch {
    return "";
  }
};

const CreateCategoryBanner = () => {
  const navigate = useNavigate();
  const token = getAuthToken();

  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleRemoveBannerImage = (index) => {
  const newBanners = [...banners]; // assuming 'banners' is your state array
  newBanners[index].bannerImage = null;
  newBanners[index].bannerImagePreview = null;
  setBanners(newBanners);
};


  const [banners, setBanners] = useState([
    {
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
    },
  ]);

  // LOAD INITIAL DROPDOWNS
  useEffect(() => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    async function fetchInit() {
      setLoading(true);

      try {
        const [servicesRes, countriesRes, categoriesRes] = await Promise.all([
          axios.post(URLS.GetServices, {}, { headers: { Authorization: `Bearer ${token}` } }),
          axios.post(URLS.GetCountry, {}, { headers: { Authorization: `Bearer ${token}` } }),
          axios.post(URLS.GetCategories, { flagType: "food" }, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (servicesRes.data.success) setServices(servicesRes.data.services || []);
        if (countriesRes.data.success) setCountries(countriesRes.data.country || []);
        if (categoriesRes.data.success) setCategories(categoriesRes.data.category || []);
      } catch {
        toast.error("Failed loading initial data");
      } finally {
        setLoading(false);
      }
    }

    fetchInit();
  }, [token]);

  // Update banner fields
  const updateBanner = (index, data) => {
    setBanners((prev) => {
      const arr = [...prev];
      arr[index] = { ...arr[index], ...data };
      return arr;
    });
  };

  // FETCH STATES
  const fetchStatesForBanner = useCallback(
    async (index, countryId) => {
      if (!countryId) {
        updateBanner(index, { states: [], stateId: "", cities: [], cityId: "", zones: [], zoneId: "" });
        return;
      }

      try {
        const res = await axios.post(
          URLS.GetStatesByCountryId,
          { country_id: countryId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        updateBanner(index, {
          states: res.data.states || [],
          stateId: "",
          cities: [],
          cityId: "",
          zones: [],
          zoneId: "",
        });
      } catch {
        toast.error("Failed loading states");
      }
    },
    [token]
  );





  // FETCH CITIES
  const fetchCitiesForBanner = useCallback(
    async (index, stateId) => {
      if (!stateId) {
        updateBanner(index, { cities: [], cityId: "", zones: [], zoneId: "" });
        return;
      }

      try {
        const res = await axios.post(
          URLS.GetCitiesByStateId,
          { state_id: stateId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        updateBanner(index, {
          cities: res.data.cities || [],
          cityId: "",
          zones: [],
          zoneId: "",
        });
      } catch {
        toast.error("Failed loading cities");
      }
    },
    [token]
  );

  // FETCH ZONES
  const fetchZonesForBanner = useCallback(
    async (index, cityId) => {
      if (!cityId) {
        updateBanner(index, { zones: [], zoneId: "" });
        return;
      }

      try {
        const res = await axios.post(
          URLS.GetZonesByCityId,
          { cityId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        updateBanner(index, {
          zones: res.data.zones || [],
          zoneId: "",
        });
      } catch {
        toast.error("Failed loading zones");
      }
    },
    [token]
  );



const fetchCategoriesByServiceId = useCallback(async (index, serviceId) => {
  if (!serviceId) {
    updateBanner(index, { categories: [], categoryId: "" });
    return;
  }

  try {
    const res = await axios.post(
      "https://api.doorstephub.com/v1/dhubApi/admin/category/getallcategorysById",
      { serviceId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      updateBanner(index, {
        categories: res.data.category || [],
        categoryId: "",
      });
    } else {
      toast.error("Failed to load categories");
    }
  } catch {
    toast.error("Failed to load categories");
  }
}, [token]);


  // On Change Handlers
  const handleBannerChange = (index, name, value) => {
  updateBanner(index, { [name]: value });

  if (name === "serviceId") {
    fetchCategoriesByServiceId(index, value);
  }
  if (name === "countryId") fetchStatesForBanner(index, value);
  if (name === "stateId") fetchCitiesForBanner(index, value);
  if (name === "cityId") fetchZonesForBanner(index, value);
};

  // IMAGE UPLOAD
  const handleBannerImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      updateBanner(index, {
        bannerImage: file,
        bannerImagePreview: URL.createObjectURL(file),
      });
    }
  };

  // ADD NEW BANNER
  const addBanner = () => {
    setBanners([
      ...banners,
      {
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
      },
    ]);
  };

  // REMOVE BANNER
  const removeBanner = (index) => {
    setBanners(banners.filter((_, i) => i !== index));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return toast.error("Authentication required");

    setLoading(true);
    try {
      const formData = new FormData();

      const payload = banners.map((b) => ({
        serviceId: b.serviceId,
        countryId: b.countryId,
        stateId: b.stateId,
        cityId: b.cityId,
        zoneId: b.zoneId,
        categoryId: b.categoryId,
      }));

      formData.append("banners", JSON.stringify(payload));

      banners.forEach((b) => {
        if (b.bannerImage) {
          formData.append("bannerImage", b.bannerImage, b.bannerImage.name);
        }
      });

      const res = await axios.post(URLS.CreateBanner, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Category banners created!");
        navigate("/advertisments/categorybanners");
      } else {
        toast.error(res.data.message || "Failed to create");
      }
    } catch {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Create Category Banner">

 <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
    <Typography variant="h5">
      Create Category Banner
    </Typography>

 <Button
              variant="contained"
              onClick={() => navigate(-1)}
              startIcon={<IconArrowBackUp />}
            >
              Back
            </Button>
  </Box>

      
      <ToastContainer autoClose={3000} />

   

      <form onSubmit={handleSubmit}>
        {banners.map((banner, index) => (
          
          <ParentCard key={index} t>
             
            <Grid container spacing={2}>
              
              {/* SERVICE */}
              <Grid item xs={12} sm={4}>
                <CustomFormLabel required>Service</CustomFormLabel>
                <Select
                  fullWidth
                  value={banner.serviceId}
                  onChange={(e) => handleBannerChange(index, "serviceId", e.target.value)}
                >
                  {services.map((s) => (
                    <MenuItem key={s._id} value={s._id}>
                      {s.servicetypeName || s.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* COUNTRY SINGLE */}
              <Grid item xs={12} sm={4}>
                <CustomFormLabel required>Country</CustomFormLabel>
                <Select
                  fullWidth
                  value={banner.countryId}
                  onChange={(e) => handleBannerChange(index, "countryId", e.target.value)}
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
                <CustomFormLabel required>Category</CustomFormLabel>
                <Select
                  fullWidth
                  value={banner.categoryId}
                  onChange={(e) => handleBannerChange(index, "categoryId", e.target.value)}
                >
                 {banner.categories?.map((c) => (
  <MenuItem key={c._id} value={c._id}>
    {c.name}
  </MenuItem>
))}
                </Select>
              </Grid>

              {/* STATE SINGLE */}
              <Grid item xs={12} sm={4}>
                <CustomFormLabel required>State</CustomFormLabel>
                <Select
                  fullWidth
                  value={banner.stateId}
                  disabled={!banner.countryId}
                  onChange={(e) => handleBannerChange(index, "stateId", e.target.value)}
                >
                  {banner.states.map((s) => (
                    <MenuItem key={s._id} value={s._id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* CITY SINGLE */}
              <Grid item xs={12} sm={4}>
                <CustomFormLabel required>City</CustomFormLabel>
                <Select
                  fullWidth
                  value={banner.cityId}
                  disabled={!banner.stateId}
                  onChange={(e) => handleBannerChange(index, "cityId", e.target.value)}
                >
                  {banner.cities.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* ZONE SINGLE */}
              <Grid item xs={12} sm={4}>
                <CustomFormLabel required>Zone</CustomFormLabel>
                <Select
                  fullWidth
                  value={banner.zoneId}
                  disabled={!banner.cityId}
                  onChange={(e) => handleBannerChange(index, "zoneId", e.target.value)}
                >
                  {banner.zones.map((z) => (
                    <MenuItem key={z._id} value={z._id}>
                      {z.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* IMAGE UPLOAD */}
<Grid item xs={12} sm={4}>
  <CustomFormLabel required>Banner Image</CustomFormLabel>
  
  {/* Upload Button - Only show when NO image */}
  {!banner.bannerImagePreview && (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleBannerImageChange(index, e)}
        style={{
          opacity: 0,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
        id={`banner-image-${index}`}
      />
      <Button
        component="label"
        htmlFor={`banner-image-${index}`}
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

  {/* Image Preview with Change (top-left) + Remove X (top-right) */}
  {banner.bannerImagePreview && (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
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
            src={banner.bannerImagePreview} 
            alt="Banner Preview"
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }} 
          />
          
          {/* Ã°Å¸â€â€ž CHANGE ICON - Top-LEFT corner */}
          <IconButton
            size="small"
            component="label"
            htmlFor={`banner-image-change-${index}`}
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
            <ArrowUpward  size={16} />
          </IconButton>

          {/* Ã¢ÂÅ’ REMOVE X ICON - Top-RIGHT corner */}
          <IconButton
            size="small"
            onClick={() => handleRemoveBannerImage(index)}
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
      
      {/* Hidden input for CHANGE functionality */}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleBannerImageChange(index, e)}
        style={{
          opacity: 0,
          position: 'absolute',
          width: 0,
          height: 0,
        }}
        id={`banner-image-change-${index}`}
      />
    </Box>
  )}
</Grid>

              {/* REMOVE BUTTON */}
              {banners.length > 1 && (
                <Grid item xs={12} sm={2}>
                  <Button variant="outlined" color="error" onClick={() => removeBanner(index)}>
                    Remove
                  </Button>
                </Grid>
              )}
            </Grid>
    <Box textAlign="right">
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Create Banner"}
          </Button>
        </Box>
         
          </ParentCard>
        ))}

        {/* ADD BANNER */}
       

        {/* SUBMIT */}
    
      </form>
    </PageContainer>
  );
};

export default CreateCategoryBanner;


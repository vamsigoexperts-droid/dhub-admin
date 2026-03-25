import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Polygon, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../components/forms/theme-elements/CustomSelect';
import PageContainer from '../../components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import { IconArrowBackUp, IconHandMove, IconTrash, IconShape } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Card,
  Box,
  Grid,
  Button,
  List,
  Paper,
  ListItem,
  Divider,
  MenuItem,
  CardHeader,
  Typography,
  CardContent,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 17.38714,
  lng: 78.491684,
};

const libraries = ['places'];

function Addzone() {
  const [newZone, setNewZone] = useState([]);
  const [form, setForm] = useState({
    name: '',
    countryId: '',
    stateId: '',
    cityId: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [Country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [City, setCity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState('shape');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [autocomplete, setAutocomplete] = useState(null);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyBNVn5j-M6F4VHkaOluoOcVY3K5r2-NlPk',
    libraries,
  });

  const authData = JSON.parse(localStorage.getItem('user'));
  const token = authData?.token;
  const navigate = useNavigate();

  useEffect(() => {
    getCountry();
  }, []);

  useEffect(() => {
    if (loadError) {
      toast.error('Error loading Google Maps');
    }
  }, [loadError]);

  const getCountry = () => {
    axios
      .post(
        URLS.GetCountry,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        setCountry(res.data.country);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
        toast.error('Failed to load countries');
      });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'countryId') {
      getStates(value);
    } else if (name === 'stateId') {
      getCity(value);
    }
  };

  const getStates = (countryId) => {
    axios
      .post(
        URLS.GetCountryByState,
        { country_id: countryId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        setStates(res.data.states);
        setForm((prev) => ({ ...prev, stateId: '', cityId: '' }));
        setCity([]);
      })
      .catch((error) => {
        console.error('Error fetching states:', error);
        toast.error('Failed to load states');
      });
  };

  const getCity = (stateId) => {
    axios
      .post(
        URLS.GetStateByCitys,
        { state_id: stateId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        setCity(res.data.cities);
        setForm((prev) => ({ ...prev, cityId: '' }));
      })
      .catch((error) => {
        console.error('Error fetching cities:', error);
        toast.error('Failed to load cities');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Addzone();
  };

  const Addzone = () => {
    if (newZone.length < 3) {
      toast.error('Please create a valid zone with at least 3 points');
      return;
    }

    if (!form.name || !form.countryId || !form.stateId || !form.cityId) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    const Data = {
      name: form.name,
      countryId: form.countryId,
      stateId: form.stateId,
      cityId: form.cityId,
      coordinates: newZone,
    };

    axios
      .post(URLS.AddZone, Data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          navigate('/locations/zones');
          sessionStorage.setItem('tost', 'Zone has been Added Successfully');
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An error occurred while adding the zone');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleMapClick = useCallback(
    (event) => {
      if (activeTool === 'shape') {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setNewZone((prev) => [...prev, { lat, lng }]);
      }
    },
    [activeTool],
  );

  const Clear = () => {
    setNewZone([]);
  };

  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(function callback(map) {
    mapRef.current = null;
  }, []);

  const onAutocompleteLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMapCenter({ lat, lng });

        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(15);
        }
      } else {
        toast.error('No location details available for this place');
      }
    } else {
      toast.error('Autocomplete is not loaded yet!');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <PageContainer title="Add Zone" description="Add new zone">
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight="700">
          ZONE CREATE
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          startIcon={<IconArrowBackUp />}
        >
          Back
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={1} variant={'outlined'}>
            <CardHeader title="Zone Details" />
            <Divider />
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <CustomFormLabel htmlFor="name">Zone Name</CustomFormLabel>
                    <CustomTextField
                      fullWidth
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="Add your zone name"
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <CustomFormLabel htmlFor="countryId">Country</CustomFormLabel>
                    <CustomSelect
                      select
                      fullWidth
                      name="countryId"
                      value={form.countryId}
                      onChange={handleFormChange}
                      required
                    >
                      <MenuItem value="">Select Country</MenuItem>
                      {Country.map((country) => (
                        <MenuItem key={country._id} value={country._id}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <CustomFormLabel htmlFor="stateId">State</CustomFormLabel>
                    <CustomSelect
                      select
                      fullWidth
                      name="stateId"
                      value={form.stateId}
                      onChange={handleFormChange}
                      required
                      disabled={!form.countryId}
                    >
                      <MenuItem value="">Select State</MenuItem>
                      {states.map((state) => (
                        <MenuItem key={state._id} value={state._id}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <CustomFormLabel htmlFor="cityId">City</CustomFormLabel>
                    <CustomSelect
                      select
                      fullWidth
                      name="cityId"
                      value={form.cityId}
                      onChange={handleFormChange}
                      required
                      disabled={!form.stateId}
                    >
                      <MenuItem value="">Select City</MenuItem>
                      {City.map((city) => (
                        <MenuItem key={city._id} value={city._id}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </Grid>
                  <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading || newZone.length < 3}
                      fullWidth
                      sx={{ height: '40px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Add Zone'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card
            elevation={1}
            variant={'outlined'}
            sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <CardHeader title="Instructions" />
            <Divider />
            <CardContent sx={{ flex: 1, overflow: 'auto' }}>
              <Typography variant="body2" paragraph>
                Allow users to define the boundary of the business zone interactively on the map by
                clicking to add points or dots.
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <IconHandMove size={20} />
                  </ListItemIcon>
                  <ListItemText primary="Use the 'Hand Tool' to drag the map and select your desired location." />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <IconShape size={20} />
                  </ListItemIcon>
                  <ListItemText primary="Use the 'Shape Tool' to highlight areas and connect the dots. A minimum of three points/dots is required." />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <IconTrash size={20} />
                  </ListItemIcon>
                  <ListItemText primary="Use the 'Trash Tool' to remove the selected area." />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card
            elevation={1}
            variant={'outlined'}
            sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                {isLoaded && (
                  <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
                    <CustomTextField
                      fullWidth
                      placeholder="Search for location..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Autocomplete>
                )}
              </Box>
              <Box sx={{ display: 'flex', p: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Button
                  variant={activeTool === 'hand' ? 'contained' : 'outlined'}
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => setActiveTool('hand')}
                  startIcon={<IconHandMove size={18} />}
                >
                  Hand Tool
                </Button>
                <Button
                  variant={activeTool === 'shape' ? 'contained' : 'outlined'}
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => setActiveTool('shape')}
                  startIcon={<IconShape size={18} />}
                >
                  Shape Tool
                </Button>
                <Button
                  variant={activeTool === 'trash' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => {
                    setActiveTool('trash');
                    Clear();
                  }}
                  startIcon={<IconTrash size={18} />}
                >
                  Trash Tool
                </Button>
              </Box>
              <Box sx={{ position: 'relative', flex: 1 }}>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={12}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={handleMapClick}
                    options={{
                      draggable: activeTool === 'hand',
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: true,
                    }}
                  >
                    <Polygon
                      paths={newZone}
                      options={{
                        strokeColor: '#007367',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#007367',
                        fillOpacity: 0.35,
                        editable: true,
                        draggable: true,
                      }}
                    />
                  </GoogleMap>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height={450}>
                    <CircularProgress />
                  </Box>
                )}
                {newZone.length > 0 && (
                  <Paper
                    elevation={1}
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      p: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <Typography variant="body2">
                      Points: {newZone.length} (Minimum 3 required)
                    </Typography>
                  </Paper>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer />
    </PageContainer>
  );
}

export default Addzone;

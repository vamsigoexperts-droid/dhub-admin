import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { GoogleMap, Polygon, useJsApiLoader } from '@react-google-maps/api';
import { IconArrowBackUp, IconMapPin } from '@tabler/icons-react';
import PageContainer from '../../components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Card,
  Box,
  Grid,
  Button,
  Paper,
  CardHeader,
  Typography,
  CardContent,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,CircularProgress,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Flag as FlagIcon,
  Public as PublicIcon,
  Terrain as TerrainIcon,
} from '@mui/icons-material';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const libraries = ['places'];

function ViewZone() {
  const [zoneData, setZoneData] = useState({
    name: '',
    countryId: '',
    stateId: '',
    cityId: '',
    coordinates: [],
    countryName: '',
    stateName: '',
    cityName: '',
  });
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDG5ybNp25KGne6EOH-Ck-pyDHnQ3tqHfE',
    libraries,
  });

  const authData = JSON.parse(localStorage.getItem('user'));
  const token = authData?.token;
  const navigate = useNavigate();
  const zoneId = localStorage.getItem('zoneId');

  useEffect(() => {
    if (loadError) {
      toast.error('Error loading Google Maps');
    }
  }, [loadError]);

  useEffect(() => {
    GetOneZone();
  }, []);

  const GetOneZone = () => {
    const data = {
      id: zoneId,
    };

    axios
      .post(URLS.GetOneZone, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const zoneData = res.data.zoneResult;
        setZoneData({
          name: zoneData.name,
          countryId: zoneData.countryId,
          stateId: zoneData.stateId,
          cityId: zoneData.cityId,
          coordinates: zoneData.coordinates,
          countryName: zoneData.countryName || 'Not available',
          stateName: zoneData.stateName || 'Not available',
          cityName: zoneData.cityName || 'Not available',
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching zone data:', error);
        toast.error('Failed to load zone data');
        setLoading(false);
      });
  };

  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
    
    // Center and zoom map to show the entire polygon
    if (zoneData.coordinates.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      zoneData.coordinates.forEach(coordinate => {
        bounds.extend(new window.google.maps.LatLng(coordinate.lat, coordinate.lng));
      });
      map.fitBounds(bounds);
    }
  }, [zoneData.coordinates]);

  const onUnmount = useCallback(function callback(map) {
    mapRef.current = null;
  }, []);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <PageContainer title="View Zone" description="View Zone Details">
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight="700">
          Zone Details
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
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardHeader 
                title="Zone Information" 
                avatar={<IconMapPin size={32} />}
              />
              <Divider />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Chip 
                    label={zoneData.name} 
                    color="primary" 
                    size="medium" 
                    sx={{ fontSize: '1.2rem', p: 2 }}
                  />
                </Box>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PublicIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Country" 
                      secondary={zoneData.countryName} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FlagIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="State" 
                      secondary={zoneData.stateName} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="City" 
                      secondary={zoneData.cityName} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TerrainIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Boundary Points" 
                      secondary={zoneData.coordinates.length} 
                    />
                  </ListItem>
                </List>
                
                <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    This zone defines the operational area for your business. The boundaries are marked on the map.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardHeader title="Zone Boundaries" />
              <Divider />
              <CardContent sx={{ p: 0, height: '500px' }}>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    zoom={12}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: true,
                      draggable: true,
                      zoomControl: true,
                    }}
                  >
                    <Polygon
                      paths={zoneData.coordinates}
                      options={{
                        strokeColor: '#007367',
                        strokeOpacity: 0.8,
                        strokeWeight: 3,
                        fillColor: '#007367',
                        fillOpacity: 0.35,
                        editable: false,
                        draggable: false,
                      }}
                    />
                  </GoogleMap>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height={450}>
                    <CircularProgress />
                  </Box>
                )}
                
                <Paper
                  elevation={1}
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    p: 1.5,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                    <TerrainIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="body2" fontWeight="500">
                    {zoneData.coordinates.length} boundary points
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      <ToastContainer />
    </PageContainer>
  );
}

export default ViewZone;
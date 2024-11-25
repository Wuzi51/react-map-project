import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 25.033964, // 臺北 101 的經緯度
  lng: 121.564468,
};



const Map = () => {
  return (
    <div className='m-3 rounded-sm overflow-hidden'>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
    </div>
    
  );
};

export default Map;
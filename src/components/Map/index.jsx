import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import RestaurantInfo from '../RestaurantInfo';
import Loading from '../Loading';
import ErrorBoundary from '../ErrorBoundary';
import { useRestaurantStore } from '@/store/restaurant';
import { showToast } from '../Toast';

const mapContainerStyle = { width: '100%', height: '700px' };
const defaultLocation = { lat: 25.033, lng: 121.5654 };

export default function Map() {
  const [map, setMap] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userLoc, setUserLoc] = useState(defaultLocation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
  const { setNearbyRamenShops, isSearching } = useRestaurantStore();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setUserLoc({ lat: coords.latitude, lng: coords.longitude });
          setLocationError(false);
        },
        (error) => {
          console.warn('未授權定位，使用預設座標', error);
          setLocationError(true);
          showToast('未能取得位置訊息，將使用預設位置（台北）', 'warning');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000
        }
      );
    } else {
      setLocationError(true);
      showToast('您的瀏覽器不支援定位服務', 'error');
    }
  }, []);

  /* map 與 userLoc 就緒後，用 PlacesService 搜附近餐廳 */
  const fetchNearby = useCallback(() => {
    if (!map) return;
    
    setLoading(false); // 地圖已加載，只顯示搜尋狀態
    setError(null);
    const { setSearching } = useRestaurantStore.getState();
    setSearching(true);
    
    try {
      const service = new window.google.maps.places.PlacesService(map);
      service.nearbySearch(
        {
          location: userLoc,
          radius: 1000,
          type: 'restaurant',
          keyword: 'ramen',
        },
        (results, status) => {
          const { setSearching } = useRestaurantStore.getState();
          setSearching(false);
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setRestaurants(results || []);
            setNearbyRamenShops(results || []);
            showToast(`找到 ${results?.length || 0} 家附近的拉麵店`, 'success');
          } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setRestaurants([]);
            setNearbyRamenShops([]);
            showToast('附近沒有找到拉麵店', 'warning');
          } else {
            const errorMsg = `Google Places API 錯誤: ${status}`;
            console.error(errorMsg);
            setError(errorMsg);
            showToast('搜尋附近餐廳時發生錯誤', 'error');
          }
        }
      );
    } catch (err) {
      const { setSearching } = useRestaurantStore.getState();
      setSearching(false);
      setError(err.message);
      showToast('搜尋附近餐廳時發生錯誤', 'error');
      console.error('fetchNearby error:', err);
    }
  }, [map, userLoc, setNearbyRamenShops]);

  useEffect(() => {
    fetchNearby();
  }, [fetchNearby]);

  const handleMarkerClick = useCallback((place) => {
    const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 500 });
    
    if (map && place.place_id) {
      const service = new window.google.maps.places.PlacesService(map);
      service.getDetails(
        { 
          placeId: place.place_id, 
          fields: ['review', 'reviews', 'name', 'vicinity', 'formatted_address', 'types', 'rating', 'photos'] 
        }, 
        (details, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSelected({ ...place, image: photoUrl, ...details });
          } else {
            console.warn('Failed to get place details:', status);
            setSelected({ ...place, image: photoUrl });
          }
        }
      );
    } else {
      setSelected({ ...place, image: photoUrl });
    }
  }, [map]);

  if (!apiKey) {
    return (
      <div className="m-3 p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-bold mb-2">設定錯誤</h3>
        <p className="text-red-600">缺少 Google Maps API Key，請檢查環境設定。</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="m-3 rounded-sm overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 z-10">
            <Loading message="載入地圖中..." />
          </div>
        )}
        
        {isSearching && (
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md z-10 flex items-center">
            <div className="animate-spin w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">搜尋附近餐廳中...</span>
          </div>
        )}
        
        {locationError && (
          <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
            ℹ️ 正使用預設位置（台北），允許定位權限可獲得更精確的搜尋結果
          </div>
        )}

        <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
          <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLoc}
          zoom={14}
          onLoad={(mapInstance) => {
            setMap(mapInstance);
            setLoading(false);
          }}
        >
          {map && (
            <Marker
              key={`user-loc-${userLoc.lat}-${userLoc.lng}`}
              position={userLoc}
              icon={{
                url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4cd.png',
                scaledSize: new window.google.maps.Size(32, 32),
              }}
              title="您的位置"
            />
          )}
          <Circle
            center={userLoc}
            radius={1000}
            options={{
              fillColor: '#FF0002',
              fillOpacity: 0.2,
              strokeColor: '#FF0000',
              strokeOpacity: 0.5,
              strokeWeight: 1,
            }}
          />
          {restaurants.map(
            (place) =>
              map && (
                <Marker
                  key={place.place_id}
                  position={place.geometry.location}
                  icon={{
                    url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f35c.png',
                    scaledSize: new window.google.maps.Size(32, 32),
                  }}
                  title={place.name}
                  onClick={() => handleMarkerClick(place)}
                />
              )
          )}
          </GoogleMap>
        </LoadScript>

        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {selected && <RestaurantInfo restaurant={selected} onClose={() => setSelected(null)} />}
      </div>
    </ErrorBoundary>
  );
}

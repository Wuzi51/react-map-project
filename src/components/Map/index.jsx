import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import RestaurantInfo from "../RestaurantInfo";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "700px",
};

const photoRef= "AdDdOWpX4DM3FirxaTcCYGyoRrxx9XxLxzqc6FNoUUzY8lim0e6ut_0VGU_nOBWGU91ENdw0lgWbktOIwaI9E1DfrWH3Z53FwUX-X-OgEG6QDqyutB5oWqB0vpt-vf8aVbl4q6U1PJ5ntBsrZIfBb1qhbhDhxQCx6c3Af5x9w9R31pbfiWtB"
console.log(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${import.meta.env.GOOGLE_PLACE_API_KEY}
`);

const Map = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState();
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState({});

    // 取得使用者位置
  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUserLocation(userPosition);
    });
  };

const getRestaurantData = async () => {
    const radius = 5000; // 半徑，單位米
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.lat},${userLocation.lng}&radius=${radius}&type=restaurant&key=${import.meta.env.GOOGLE_PLACE_API_KEY}`;
    try {
      const { data: { results } } = await axios.get(url);
      if (results) {
        console.log(results);
        setRestaurants(results);
        return results; // 返回餐廳列表
      } else {
        console.log("未找到餐廳資訊");
        return [];
      }
    } catch (error) {
      console.error("API 請求錯誤:", error);
      return [];
    }
  };

  // 點擊標示事件處理
  const handleMarkerClick = (restaurant) => {
    setSelectedRestaurant({ ...restaurant, image: restaurant.photos[0].photo_reference });
    };
  
  const init = async() => {
    await getUserLocation()
    getRestaurantData()
  };

  useEffect(() => {
    if (!restaurants.length) {
      init()
    };
  }, [restaurants]);

  return (
    <div className="m-3 rounded-sm overflow-hidden">
      {restaurants.length && (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={mapContainerStyle} center={userLocation} zoom={14}>
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.vicinity}
              position={restaurant.geometry.location}
              onClick={() => handleMarkerClick(restaurant)} // 點擊標示時顯示 Modal
            />
          ))}
        </GoogleMap>
      </LoadScript>
      )}
      {/* 顯示餐廳資訊 Modal */}
      {selectedRestaurant && (
        <RestaurantInfo
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant()} // 關閉 Modal
          onClick={() => addToShortList(selectedRestaurant)}
        />
      )}
    </div>
  );
};

export default Map;
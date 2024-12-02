import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import RestaurantInfo from "../RestaurantInfo";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 25.033964, // 臺北 101 的經緯度
  lng: 121.564468,
};

// 模擬餐廳資料
const restaurants = [
  {
    id: 1,
    name: "Restaurant A",
    img: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    comment: "good",
    position: { lat: 25.033964, lng: 121.564468 }, // 餐廳 A 的經緯度
  },
  {
    id: 2,
    name: "Restaurant B",
    img: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    comment: "good",
    position: { lat: 25.047924, lng: 121.517081 }, // 餐廳 B 的經緯度
  },
  {
    id: 3,
    name: "Restaurant c",
    img: "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    comment: "good",
    position: { lat: 25.032728, lng: 121.565137 }, // 餐廳 C 的經緯度
  },
];

const Map = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState();

  // 點擊標示事件處理
  const handleMarkerClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  return (

    <div className="m-3 rounded-sm overflow-hidden">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={14}>
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={restaurant.position}
              onClick={() => handleMarkerClick(restaurant)} // 點擊標示時顯示 Modal
            />
          ))}
        </GoogleMap>
      </LoadScript>

      {/* 顯示餐廳資訊 Modal */}
      {selectedRestaurant && (
        <RestaurantInfo
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant()} // 關閉 Modal
        />
      )}
    </div>

  );
};

export default Map;
import { useRestaurantStore } from "@/store/restaurant";
import { Rate } from "antd";
import { useState } from "react";
import { message } from "antd";

const ShortList = () => {
  const { restaurantList, removeRestaurant, updateVotes } = useRestaurantStore();
  const [votedRestaurantId, setVotedRestaurantId] = useState(null); // 記錄已投票的餐廳

  const handleVote = (place_id) => {
    if (votedRestaurantId === place_id) {
      message.warning("你已經對此餐廳投過票了！");
      return;
    }
    updateVotes(place_id); // 更新票數
    setVotedRestaurantId(place_id); // 記錄投票餐廳
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">我的候選清單</h2>
      {restaurantList.length === 0 ? (
        <p className="text-gray-500">目前沒有候選餐廳。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {restaurantList.map((restaurant) => {
            const imageUrl = restaurant.image
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${restaurant.image}&key=${import.meta.env.VITE_APP_GOOGLE_PLACE_API_KEY}`
              : "https://via.placeholder.com/400x300?text=No+Image";

            return (
              <div
                key={restaurant.place_id}
                className="p-4 bg-white rounded-md shadow-md hover:shadow-lg transition relative"
              >
                {/* 餐廳圖片 */}
                <img
                  className="w-full h-[200px] rounded-md object-cover mb-4"
                  src={imageUrl}
                  alt={restaurant.name || "餐廳圖片"}
                />
                {/* 餐廳名稱 */}
                <p className="text-lg font-medium mb-2">{restaurant.name}</p>
                {/* 餐廳評分 */}
                <div className="flex items-center gap-2 mb-2">
                  <Rate allowHalf disabled defaultValue={restaurant.rating || 0} />
                  <span>({restaurant.rating?.toFixed(1) || "尚無評分"})</span>
                </div>
                {/* 投票按鈕 */}
                <button
                  className="w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400 mb-2"
                  onClick={() => handleVote(restaurant.place_id)}
                >
                  投票 ({restaurant.votes || 0} 票)
                </button>
                {/* 刪除按鈕 */}
                <button
                  className="w-full py-2 bg-rose-500 text-white rounded-md hover:bg-rose-400"
                  onClick={() => removeRestaurant(restaurant.place_id)}
                >
                  刪除
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShortList;

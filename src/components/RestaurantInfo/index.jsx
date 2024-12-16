import { Modal, Rate } from "antd";
import { useRestaurantStore } from "@/store/restaurant";
import { useUserStore } from "@/store/user";

const RestaurantInfo = ({ restaurant, onClose }) => {
  const { addRestaurant } = useRestaurantStore();
  const { token } = useUserStore();

  const imageUrl = restaurant.image
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${restaurant.image}&key=${import.meta.env.VITE_APP_GOOGLE_PLACE_API_KEY}`
    : "https://via.placeholder.com/400x300?text=No+Image";

  const rating = restaurant.rating;
  
  const handleAddToShortlist = () => {
    addRestaurant(restaurant);
    onClose(); // 關閉視窗
  };

  return (
    <Modal
      title="餐廳資訊"
      width={400}
      open={!!restaurant}
      onOk={onClose}
      onCancel={onClose}
      footer={null}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{restaurant.name || "未知餐廳"}</h2>
        <div className="flex justify-center mb-4">
          <img
            className="w-full max-w-[300px] max-h-[200px] rounded-md object-cover"
            src={imageUrl}
            alt={restaurant.name || "餐廳圖片"}
          />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">評分</h3>
          {rating ? (
            <div className="flex items-center gap-2">
              <Rate allowHalf disabled defaultValue={rating} />
              <span>({rating.toFixed(1)})</span>
            </div>
          ) : (
            <p className="text-gray-500">尚無評分</p>
          )}
        </div>
        <div className="flex justify-center mt-6">
          {token && 
          <button
            className="w-full py-2 bg-gray-500 text-lg text-white rounded-md hover:bg-gray-400"
            onClick={handleAddToShortlist}
          >
            加入候選清單
          </button>
          }
        </div>
      </div>
    </Modal>
  );
};

export default RestaurantInfo;
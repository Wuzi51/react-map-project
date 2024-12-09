import { Modal } from "antd";


const RestaurantInfo = ({ restaurant, onClose, onClick }) => {
  return (
    <Modal
      title="餐廳資訊"
      width={400}
      open={restaurant}
      onOk={onClose}
      onCancel={onClose}
    >
      <div className="border border-gray-950 p-4 rounded-lg">
        <h2 className="text-xl font-bold">{restaurant.name}</h2>
        <div className="mt-2 flex flex-col items-center">
          <img
            className="w-full md:max-w-2xl max-h-[300px] rounded-md object-cover"
            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${restaurant.image}&key=${import.meta.env.GOOGLE_PLACE_API_KEY}`}
            alt={restaurant.name}
          />
        </div>
        <div className="mt-2">
          <p>{restaurant.comment}</p>
        </div>
      </div>
      <button onClick={onClick}>加入候選清單</button>
    </Modal>
  );
};

export default RestaurantInfo;



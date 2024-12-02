import { Modal } from "antd";

const RestaurantInfo = ({ restaurant, onClose }) => {
  return (
    <Modal
      title="餐廳資訊"
      width={400}
      open={restaurant}
      onOk={onClose}
      onCancel={onClose}
    >
      <div className="border border-gray-950 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold">{restaurant.name}</h2>
        <div className="mt-2 flex flex-col items-center">
          <img
            className="w-full md:max-w-2xl max-h-[300px] rounded-md object-cover"
            src={restaurant.img}
            alt={restaurant.name}
          />
        </div>
        <div className="mt-2">
          <p>{restaurant.comment}</p>
        </div>
      </div>
    </Modal>
  );
};

export default RestaurantInfo;



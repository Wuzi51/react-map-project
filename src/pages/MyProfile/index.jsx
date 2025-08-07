import { useRestaurantStore } from '@/store/restaurant';
import { useState } from 'react';
import { Button, Rating, Modal } from '@/components/UI';

const MyProfile = () => {
  const { favoriteShops, reviews, removeFavorite, removeReview } = useRestaurantStore();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, message: '' });

  const handleConfirm = (action, message) => {
    setConfirmModal({ isOpen: true, action, message });
  };

  const executeAction = () => {
    if (confirmModal.action) {
      confirmModal.action();
    }
    setConfirmModal({ isOpen: false, action: null, message: '' });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">我的收藏與評論</h2>
      <h3 className="text-xl font-semibold mb-2">收藏的拉麵店</h3>
      {favoriteShops.length === 0 ? (
        <p className="text-gray-500 mb-6">尚未收藏任何拉麵店。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {favoriteShops.map(shop => (
            <div key={shop.place_id} className="p-4 bg-white rounded shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg truncate pr-2">{shop.name}</div>
                  <div className="text-gray-500 text-sm">{shop.vicinity}</div>
                </div>
                <Button 
                  className="flex-shrink-0" 
                  size="small" 
                  variant="danger"
                  onClick={() => handleConfirm(() => removeFavorite(shop.place_id), '確定要移除收藏嗎？')}
                >
                  移除
                </Button>
              </div>
              <Rating value={shop.rating || 0} />
            </div>
          ))}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">我的食記與評分</h3>
      {Object.keys(reviews).length === 0 ? (
        <p className="text-gray-500">尚未撰寫任何食記。</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(reviews).map(([place_id, { note, rating }]) => {
            const shop = favoriteShops.find(s => s.place_id === place_id);
            return (
              <div key={place_id} className="p-4 bg-white rounded shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg truncate pr-2">{shop?.name || '未知餐廳'}</div>
                    <Rating value={rating} />
                  </div>
                  <Button 
                    className="flex-shrink-0" 
                    size="small" 
                    variant="danger"
                    onClick={() => handleConfirm(() => removeReview(place_id), '確定要刪除這則食記嗎？')}
                  >
                    刪除
                  </Button>
                </div>
                <div className="text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded">{note}</div>
              </div>
            );
          })}
        </div>
      )}
      
      <Modal 
        isOpen={confirmModal.isOpen} 
        onClose={() => setConfirmModal({ isOpen: false, action: null, message: '' })}
        title="確認操作"
      >
        <div className="space-y-4">
          <p>{confirmModal.message}</p>
          <div className="flex space-x-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setConfirmModal({ isOpen: false, action: null, message: '' })}
            >
              取消
            </Button>
            <Button 
              variant="danger" 
              onClick={executeAction}
            >
              確認
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyProfile;

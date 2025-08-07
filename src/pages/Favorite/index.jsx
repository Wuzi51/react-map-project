import { useRestaurantStore } from '@/store/restaurant';
import { useState } from 'react';
import { Button, Rating, Modal, Pagination } from '@/components/UI';

const PAGE_SIZE = 6;

const FavoritePage = () => {
  const { favoriteShops, removeFavorite } = useRestaurantStore();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, message: '' });
  const [page, setPage] = useState(1);
  const paged = favoriteShops.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">我的收藏</h2>
      {favoriteShops.length === 0 ? (
        <p className="text-gray-500 mb-6">尚未收藏任何拉麵店。</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {paged.map(shop => (
              <div key={shop.place_id} className="p-4 bg-white rounded shadow flex flex-col h-56">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 pr-2">
                    <ExpandableName name={shop.name} />
                  </div>
                  <Button 
                    className="flex-shrink-0" 
                    size="small" 
                    variant="danger"
                    onClick={() => setConfirmModal({ 
                      isOpen: true, 
                      action: () => removeFavorite(shop.place_id), 
                      message: '確定要移除收藏嗎？' 
                    })}
                  >
                    移除
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="mb-2 text-gray-500 text-sm break-words leading-tight">{shop.vicinity}</div>
                  <div className="mb-2">
                    <Rating value={shop.rating || 0} size="small" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={favoriteShops.length}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        </>
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
              onClick={() => {
                if (confirmModal.action) confirmModal.action();
                setConfirmModal({ isOpen: false, action: null, message: '' });
              }}
            >
              確認
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

function ExpandableName({ name }) {
  const [expand, setExpand] = useState(false);
  const MAX = 16;
  if (!name) return null;
  if (name.length <= MAX) return <div className="font-bold text-lg mb-1">{name}</div>;
  return (
    <div className="font-bold text-lg mb-1">
      {expand ? name : name.slice(0, MAX) + '...'}
      <button 
        className="text-blue-500 hover:text-blue-700 text-sm ml-1"
        onClick={() => setExpand(e => !e)}
      >
        {expand ? '收合' : '展開'}
      </button>
    </div>
  );
}

export default FavoritePage;

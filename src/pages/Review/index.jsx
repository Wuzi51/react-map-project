import { useRestaurantStore } from '@/store/restaurant';
import { useState } from 'react';
import { Button, Rating, Modal, Pagination } from '@/components/UI';

const PAGE_SIZE = 6;

const ReviewPage = () => {
  const { reviews, removeReview, favoriteShops } = useRestaurantStore();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, message: '' });
  const reviewList = Object.entries(reviews).map(([place_id, { note, rating }]) => {
    const shop = favoriteShops.find(s => s.place_id === place_id) || {};
    return { place_id, note, rating, name: shop.name, vicinity: shop.vicinity };
  });
  const [page, setPage] = useState(1);
  const paged = reviewList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">我的食記</h2>
      {reviewList.length === 0 ? (
        <p className="text-gray-500 mb-6">尚未撰寫任何食記。</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {paged.map(item => (
              <div key={item.place_id} className="p-4 bg-white rounded shadow flex flex-col h-56">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 pr-2">
                    <ExpandableName name={item.name} />
                  </div>
                  <Button 
                    className="flex-shrink-0" 
                    size="small" 
                    variant="danger"
                    onClick={() => setConfirmModal({ 
                      isOpen: true, 
                      action: () => removeReview(item.place_id), 
                      message: '確定要刪除這則食記嗎？' 
                    })}
                  >
                    刪除
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="mb-2 text-gray-500 text-sm break-words leading-tight">{item.vicinity}</div>
                  <div className="mb-2">
                    <Rating value={item.rating || 0} size="small" />
                  </div>
                  <div className="text-gray-700 text-sm overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>{item.note}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={reviewList.length}
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

export default ReviewPage;

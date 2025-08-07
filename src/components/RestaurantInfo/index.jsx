import { Modal, Button, Rating, TextArea, Divider, Tooltip } from '@/components/UI';
import { useRestaurantStore } from '@/store/restaurant';
import { useState } from 'react';
import { showToast } from '@/components/Toast';

const MAX_NAME_LENGTH = 16;

const RestaurantInfo = ({ restaurant, onClose }) => {
  const {
    markVisited,
    addFavorite,
    removeFavorite,
    isFavorite,
    isVisited,
    addReview,
    getReview,
  } = useRestaurantStore();
  const [note, setNote] = useState(() => {
    const review = restaurant?.place_id ? getReview(restaurant.place_id) : null;
    return review?.note || '';
  });
  const [rating, setRating] = useState(() => {
    const review = restaurant?.place_id ? getReview(restaurant.place_id) : null;
    return review?.rating || 0;
  });
  const [saving, setSaving] = useState(false);
  const [showFullName, setShowFullName] = useState(false);

  const imageUrl = restaurant?.image || 'https://via.placeholder.com/400x300?text=No+Image';
  const visited = restaurant?.place_id ? isVisited(restaurant.place_id) : false;
  const favorite = restaurant?.place_id ? isFavorite(restaurant.place_id) : false;

  const handleMarkVisited = () => {
    markVisited(restaurant.place_id);
  };
  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(restaurant.place_id);
    } else {
      addFavorite(restaurant);
    }
  };
  const handleSaveReview = () => {
    if (!note.trim()) {
      showToast('食記內容不可為空', 'warning');
      return;
    }
    setSaving(true);
    addReview(restaurant.place_id, note, rating);
    if (!favorite) {
      addFavorite(restaurant);
    }
    setTimeout(() => setSaving(false), 500);
  };

  // 名稱顯示處理
  const displayName = restaurant?.name?.length > MAX_NAME_LENGTH && !showFullName
    ? restaurant.name.slice(0, MAX_NAME_LENGTH) + '...'
    : restaurant?.name;

  const shouldShowExpandButton = restaurant?.name?.length > MAX_NAME_LENGTH;

  return (
    <Modal
      title="餐廳資訊"
      isOpen={!!restaurant}
      onClose={onClose}
      showCloseButton={true}
    >
      <div className="flex flex-col h-full">
        {/* 餐廳基本資訊 - 固定區域 */}
        <div className="flex-shrink-0 p-4 border-b">
          {/* 餐廳名稱和狀態 */}
          <div className="mb-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-800 leading-tight">
                  {displayName}
                </h2>
                {shouldShowExpandButton && (
                  <button
                    onClick={() => setShowFullName(!showFullName)}
                    className="text-blue-500 hover:text-blue-700 text-sm mt-1 transition-colors"
                  >
                    {showFullName ? '收合' : '展開完整名稱'}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1 flex-shrink-0">
                {visited && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs whitespace-nowrap">
                    已吃過
                  </span>
                )}
                {favorite && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs whitespace-nowrap">
                    已收藏
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 圖片和評分 */}
          <div className="flex flex-col md:flex-row gap-4">
            <img
              className="w-full md:w-48 h-32 rounded-md object-cover shadow border"
              src={imageUrl}
              alt={restaurant?.name || '餐廳圖片'}
            />
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <Rating value={restaurant.rating || 0} />
              </div>
              <div className="text-gray-500 text-sm break-words leading-tight">
                {restaurant.vicinity || restaurant.formatted_address}
              </div>
            </div>
          </div>
        </div>

        {/* 可滾動內容區域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <Divider>Google Map 使用者評論</Divider>
            {restaurant.reviews && restaurant.reviews.length > 0 ? (
              <ul className="space-y-2 max-h-32 overflow-y-auto px-1 border rounded bg-gray-50">
                {restaurant.reviews.slice(0, 3).map((r, idx) => (
                  <li key={idx} className="border-b last:border-b-0 py-2">
                    <div className="font-semibold flex items-center gap-2 text-sm">
                      {r.author_name}
                      <Tooltip title={r.relative_time_description}>
                        <span className="text-xs text-gray-400">{r.relative_time_description}</span>
                      </Tooltip>
                    </div>
                    <Rating value={r.rating} size="small" />
                    <div className="text-gray-700 text-sm mt-1">{r.text?.slice(0, 100)}{r.text?.length > 100 ? '...' : ''}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400 text-center py-4">尚無評論</div>
            )}
          </div>

          <div>
            <Divider>我的互動</Divider>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button className="flex-1" variant={visited ? 'primary' : 'secondary'} onClick={handleMarkVisited}>
                {visited ? '已吃過' : '標記已吃過'}
              </Button>
              <Button className="flex-1" variant={favorite ? 'primary' : 'secondary'} onClick={handleFavorite}>
                {favorite ? '已收藏' : '加入收藏'}
              </Button>
            </div>
          </div>

          <div>
            <Divider>我的食記與評分</Divider>
            <div className="space-y-3">
              <Rating value={rating} onChange={setRating} readonly={false} />
              <TextArea
                rows={4}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="寫下你的食記..."
                maxLength={300}
                showCount
              />
              <Button 
                className="w-full" 
                variant="primary" 
                onClick={handleSaveReview} 
                disabled={saving}
              >
                {saving ? '儲存中...' : '儲存'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RestaurantInfo;

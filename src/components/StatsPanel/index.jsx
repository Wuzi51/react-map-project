import { useRestaurantStore } from '@/store/restaurant';

const StatsPanel = ({ className = '' }) => {
  const { favoriteShops, visitedShops, reviews } = useRestaurantStore();

  const statsData = [
    {
      id: 'favorites',
      label: '收藏餐廳',
      value: favoriteShops.length,
      icon: '❤️',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 'visited',
      label: '已拜訪',
      value: visitedShops.length,
      icon: '✅',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'reviews',
      label: '食記數',
      value: Object.keys(reviews).length,
      icon: '📝',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
  ];

  const getTotalExplored = () => {
    const allPlaces = new Set([
      ...favoriteShops.map(s => s.place_id),
      ...visitedShops,
      ...Object.keys(reviews)
    ]);
    return allPlaces.size;
  };

  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6 ${className}`}>
      {/* 標題區域 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          📊 我的美食探索
        </h3>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          總探索: {getTotalExplored()} 家
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsData.map((stat) => (
          <div
            key={stat.id}
            className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-default`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl" role="img" aria-label={stat.label}>
                {stat.icon}
              </span>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">
              {stat.label}
            </div>
            {/* 進度條或額外資訊 */}
            {stat.id === 'favorites' && favoriteShops.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                最近收藏: {favoriteShops[favoriteShops.length - 1]?.name?.slice(0, 10)}...
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 快速洞察 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="text-xs text-gray-600">
            <div className="font-semibold text-gray-800">
              {visitedShops.length > 0 ? Math.round((Object.keys(reviews).length / visitedShops.length) * 100) : 0}%
            </div>
            <div>食記完成率</div>
          </div>
          <div className="text-xs text-gray-600">
            <div className="font-semibold text-gray-800">
              {favoriteShops.length > 0 ? Math.round((visitedShops.length / favoriteShops.length) * 100) : 0}%
            </div>
            <div>收藏拜訪率</div>
          </div>
          <div className="text-xs text-gray-600">
            <div className="font-semibold text-gray-800">
              {favoriteShops.length - visitedShops.length > 0 ? favoriteShops.length - visitedShops.length : 0}
            </div>
            <div>待拜訪餐廳</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
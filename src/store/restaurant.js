import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { showToast } from '@/components/Toast';

const initialState = {
  // 搜尋相關
  nearbyRamenShops: [],
  isSearching: false,
  
  // 收藏清單
  favoriteShops: [],
  
  // 已拜訪店家
  visitedShops: [],
  
  // 食記與評分
  reviews: {},
  
  // 選中店家
  selectedShop: null,
  
  // 用戶統計
  stats: {
    totalFavorites: 0,
    totalVisited: 0,
    totalReviews: 0
  }
};

const restaurantActions = (set, get) => ({
  // 搜尋相關
  setNearbyRamenShops: (shops) => 
    set({ nearbyRamenShops: shops || [] }),
  
  setSearching: (isSearching) => 
    set({ isSearching }),

  // 收藏功能
  addFavorite: (shop) =>
    set((state) => {
      if (!shop?.place_id) {
        showToast('餐廳資訊不完整', 'error');
        return state;
      }

      const exists = state.favoriteShops.some(s => s.place_id === shop.place_id);
      if (exists) {
        showToast('此餐廳已在收藏清單', 'warning');
        return state;
      }

      const newFavorites = [...state.favoriteShops, { 
        ...shop, 
        addedAt: new Date().toISOString() 
      }];
      
      showToast(`${shop.name || '餐廳'} 已加入收藏！`, 'success');
      
      return {
        favoriteShops: newFavorites,
        stats: {
          ...state.stats,
          totalFavorites: newFavorites.length
        }
      };
    }),

  removeFavorite: (place_id) =>
    set((state) => {
      if (!place_id) return state;
      
      const newFavorites = state.favoriteShops.filter(s => s.place_id !== place_id);
      const removed = state.favoriteShops.find(s => s.place_id === place_id);
      
      if (removed) {
        showToast('已移除收藏', 'success');
      }

      return {
        favoriteShops: newFavorites,
        stats: {
          ...state.stats,
          totalFavorites: newFavorites.length
        }
      };
    }),

  isFavorite: (place_id) => {
    const state = get();
    return state.favoriteShops.some(s => s.place_id === place_id);
  },


  // 訪問記錄
  markVisited: (place_id) =>
    set((state) => {
      if (!place_id) return state;
      if (state.visitedShops.includes(place_id)) return state;

      const newVisited = [...state.visitedShops, place_id];
      
      return {
        visitedShops: newVisited,
        stats: {
          ...state.stats,
          totalVisited: newVisited.length
        }
      };
    }),

  isVisited: (place_id) => {
    const state = get();
    return state.visitedShops.includes(place_id);
  },

  // 評論功能
  addReview: (place_id, note, rating) =>
    set((state) => {
      if (!place_id || !note?.trim() || typeof rating !== 'number') {
        showToast('評論資訊不完整', 'error');
        return state;
      }

      const newReviews = {
        ...state.reviews,
        [place_id]: { 
          note: note.trim(), 
          rating, 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      showToast('食記已儲存！', 'success');
      
      return {
        reviews: newReviews,
        stats: {
          ...state.stats,
          totalReviews: Object.keys(newReviews).length
        }
      };
    }),

  removeReview: (place_id) =>
    set((state) => {
      if (!place_id || !state.reviews[place_id]) return state;

      const newReviews = { ...state.reviews };
      delete newReviews[place_id];
      
      showToast('已刪除食記', 'success');
      
      return {
        reviews: newReviews,
        stats: {
          ...state.stats,
          totalReviews: Object.keys(newReviews).length
        }
      };
    }),

  hasReview: (place_id) => {
    const state = get();
    return !!state.reviews[place_id];
  },

  getReview: (place_id) => {
    const state = get();
    return state.reviews[place_id] || null;
  },

  // 選中店家
  setSelectedShop: (shop) => set({ selectedShop: shop }),

  // 重置功能
  resetNearbyShops: () => set({ nearbyRamenShops: [] }),
  
  clearAllData: () => {
    set(initialState);
    showToast('所有資料已清除', 'success');
  },

  // 統計更新
  updateStats: () => 
    set((state) => ({
      stats: {
        totalFavorites: state.favoriteShops.length,
        totalVisited: state.visitedShops.length,
        totalReviews: Object.keys(state.reviews).length
      }
    })),

  // 批量操作
  addMultipleToFavorites: (shops) => 
    set((state) => {
      const newShops = shops.filter(shop => 
        shop?.place_id && !state.favoriteShops.some(s => s.place_id === shop.place_id)
      );

      if (newShops.length === 0) {
        showToast('沒有新的餐廳可以加入收藏', 'warning');
        return state;
      }

      const newFavorites = [...state.favoriteShops, ...newShops.map(shop => ({
        ...shop,
        addedAt: new Date().toISOString()
      }))];

      showToast(`已加入 ${newShops.length} 家餐廳到收藏`, 'success');
      
      return {
        favoriteShops: newFavorites,
        stats: {
          ...state.stats,
          totalFavorites: newFavorites.length
        }
      };
    }),
});

export const useRestaurantStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,
        ...restaurantActions(set, get)
      }),
      {
        name: 'restaurant-store',
        // 過濾掉不需要持久化的狀態
        partialize: (state) => ({
          favoriteShops: state.favoriteShops,
          visitedShops: state.visitedShops,
          reviews: state.reviews,
          stats: state.stats
        }),
        // 版本控制，用於遷移舊數據
        version: 1
      }
    )
  )
);

// 訂閱狀態變化，自動更新統計
useRestaurantStore.subscribe(
  (state) => [state.favoriteShops, state.visitedShops, state.reviews],
  () => {
    const { updateStats } = useRestaurantStore.getState();
    updateStats();
  },
  {
    equalityFn: (a, b) => 
      a[0].length === b[0].length && 
      a[1].length === b[1].length && 
      Object.keys(a[2]).length === Object.keys(b[2]).length
  }
);

// 導出類型定義（如果使用 TypeScript）
export const restaurantStoreActions = restaurantActions;
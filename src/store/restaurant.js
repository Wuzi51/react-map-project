import { create } from "zustand";
import { persist } from "zustand/middleware";
import { message } from "antd";

export const useRestaurantStore = create(
  persist(
    (set) => ({
      restaurantList: [],

      // 設定餐廳列表
      setRestaurantList: (restaurantList) => set({ restaurantList }),

      // 加入餐廳到候選清單
      addRestaurant: (restaurant) =>
        set((state) => {
          // 檢查餐廳是否已經存在於清單中
          const isExisting = state.restaurantList.some((item) => item.place_id === restaurant.place_id);
          if (isExisting) {
            message.warning("此餐廳已經存在候選清單中");
            console.log(restaurant)
            return state; // 如果餐廳已經存在於清單中，則不進行任何變更
          }
          message.success("餐廳已成功加入候選清單");
          return {
            restaurantList: [...state.restaurantList, { ...restaurant, votes: 0 }], // 初始票數為 0
          };
        }),

      // 刪除指定餐廳
      removeRestaurant: (place_id) =>
        set((state) => {
          const newRestaurantList = state.restaurantList.filter(
            (restaurant) => restaurant.place_id !== place_id
          );
          message.success("餐廳已成功從候選清單中刪除");
          return {
            restaurantList: newRestaurantList,
          };
        }),

      // 更新餐廳票數
      updateVotes: (place_id) =>
        set((state) => ({
          restaurantList: state.restaurantList.map((restaurant) =>
            restaurant.place_id === place_id
              ? { ...restaurant, votes: restaurant.votes + 1 } // 增加票數
              : restaurant
          ),
        }));
    }),
    {
      name: "restaurant",
    }
  )
);

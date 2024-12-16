import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from '@/api/user';
import { useUserStore } from "@/store/user";
import { message } from "antd";

const LoginPage = () => {
  const navigate = useNavigate();
  const { username, setUsername } = useUserStore();
  const [password, setPassword] = useState('');
  const { token, setToken } = useUserStore()

  const changePage = (url) => {
    navigate(url);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (!username || !password) {
      message.warning('請填寫所有欄位');
      return;
    }

    try {
      const { accessToken } = await userApi.login(username, password)
      setToken(accessToken)
      setUsername(username)
      message.success("登入成功")
      changePage('/')
    } catch (err) {
      message.error("登入失敗")
      console.error(err)
    } 
  };

  useEffect(() => {
  if (token) { 
    changePage('/')
  }
}, [token]);


  return (
    <div className="flex min-h-screen flex-col md:justify-center">
      <div className="w-full mx-auto mt-8 max-w-sm px-6 py-8 bg-white rounded-lg md:shadow-lg lg:my-0">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">登入</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              使用者名稱
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="請輸入使用者名稱"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div className="mb-10 max-w-full">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密碼
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入密碼"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400"
          >
            登入
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

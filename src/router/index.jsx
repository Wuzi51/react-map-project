import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages";
import { Layout } from "antd";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: {
      path: "home",
      element: <Home />
    },
  },
]);

export default router;
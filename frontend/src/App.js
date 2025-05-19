import "./App.css";
import Home from "./components/Home.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Signup.jsx";
import Room from "./components/Room.jsx";
import MainPanel from "./components/MainPanel";
import CreateRoom from "./components/CreateRoom.jsx";
import JoinRoom from "./components/JoinRoom.jsx";
import AuthLayout from "./hooks/Authlayout.jsx";
import useVerifyAuth from "./hooks/useVerifyAuth.jsx";



const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthLayout>
        <Home />
      </AuthLayout>
    ),
    children: [
      {
        path: "/",
        element: (
        
            <MainPanel />
        
        ),
      },
      {
        path: "/createRoom",
        element: (
        
            <CreateRoom />
        
        ),
      },
      {
        path: "/joinRoom",
        element: (
          
            <JoinRoom />
          
        ),
      },
      {
        path: "/room/:roomId",
        element: (
          
            <Room />
         
        ),
      },
    ],
  },

  {
    path: "/login",
    element: (
      <AuthLayout authentication={false}>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthLayout authentication={false}>
        <Register />
      </AuthLayout>
    ),
  },
]);

function App() {
  console.log("Inside app")
  useVerifyAuth();
    // return <h2 className="bg-slate-300">App page</h2>
  return (
    
  <RouterProvider router={routes} />
);
}

export default App;

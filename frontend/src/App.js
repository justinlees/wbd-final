import "./App.css";
import React from "react";
import Landing from "./components/landing";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import FsignUp, { Action as FsignUpAction } from "./components/FsignUp";
import CsignUp, { Action as CsignUpAction } from "./components/CsignUp";
import Login, { Action as loginAction } from "./components/login";
import ForgotPassword from "./components/forgotPassword";
import Settings from "./components/Settings";

/*Client Imports */
import Home, { Loader as Cloader } from "./Layouts/User/home";
import MainPage, { Action as PostTaskAction } from "./components/User/MainPage";
import CTasks, { Loader as Tloader } from "./components/User/CTasks";
import MessageEntry, {
  Action as UentryAction,
} from "./components/User/MessageEntry";
import RequestPage, {
  Action as RequestAction,
} from "./components/User/RequestPage";
import MessageDisplay from "./components/User/MessageDisplay";
import CrequestedTasks, {
  Action as RequestedAction,
} from "./components/User/CrequestedTasks";
import CacceptedTasks from "./components/User/CacceptedTasks";
import CProfile, { Action as CDeleteAction } from "./components/User/CProfile";
import CRecent from "./components/User/CRecent";

/* Freelancer Imports */
import FreeLance, { Loader as Floader } from "./Layouts/Freelancer/freelancer";
import FProfile, {
  Action as DeleteAction,
} from "./components/Freelancer/FProfile";
import FdashBoard from "./components/Freelancer/fDashBoard";
import FTasks from "./components/Freelancer/FTasks";
import FacceptedTasks, {
  Action as AcceptedAction,
} from "./components/Freelancer/FacceptedTasks";
import FqueuedTasks, {
  Action as QueuedAction,
} from "./components/Freelancer/FqueuedTasks";
import Explore from "./components/Freelancer/Explore";
import Earnings from "./components/Freelancer/Earnings";
import TaskInfo from "./components/Freelancer/TaskInfo";
import FMessages, {
  Action as MessageAction,
} from "./components/Freelancer/FMessages";
import FMessageDisplay from "./components/Freelancer/FMessageDisplay";
import FRecent from "./components/Freelancer/FRecent";

import { Action as ProfileAction } from "./components/Freelancer/SideBar";

/* Admin Imports */
import Admin, { Loader as ALoader } from "./Layouts/Admin/admin";
import AdminDashBoard, {
  Action as ClientsDeleteAction,
} from "./components/Admin/AdminDashBoard";
import Profit from "./components/Admin/Profit";
import AProfile from "./components/Admin/AdminProfile";
import Utilities, {
  Action as MAction,
  Loader as UtilityLoader,
} from "./components/Admin/ManagerInfo";

import ErrorPage from "./components/ErrorPage";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signUp/freelancer",
    element: <FsignUp />,
    action: FsignUpAction,
  },
  {
    path: "/signUp/user",
    element: <CsignUp />,
    action: CsignUpAction,
  },

  {
    path: "/login",
    element: <Login />,
    action: loginAction,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },
  //User routes
  {
    path: "/home/:userId",
    element: <Home />,
    loader: Cloader,
    children: [
      {
        index: true,
        element: <MainPage />,
        action: PostTaskAction,
      },
      // {
      //   index: true,
      //   path: ":fUser/post-task",
      //   element: <MainPage />,
      //   action: PostTaskAction,
      // },
      {
        path: ":fUser/requestPage",
        element: <RequestPage />,
        action: RequestAction,
      },
      {
        path: "tasks",
        element: <CTasks />,
        loader: Tloader,
        children: [
          {
            index: true,
            element: <CrequestedTasks />,
            action: RequestedAction,
          },
          {
            path: "acceptedTasks",
            element: <CacceptedTasks />,
          },
          {
            path: "recentTasks",
            element: <CRecent />,
          },
        ],
      },
      {
        path: "tasks/:fUser/messages",
        element: <MessageEntry />,
        action: UentryAction,
        children: [
          {
            index: true,
            element: <MessageDisplay />,
          },
        ],
      },
      {
        path: "profile",
        element: <CProfile />,
        action: CDeleteAction,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  /* Freelancer routes */
  {
    path: "/freelancer/:fUser",
    element: <FreeLance />,
    loader: Floader,
    children: [
      {
        index: true,
        element: <FdashBoard />,
      },
      {
        path: "profile",
        element: <FProfile />,
        action: DeleteAction,
      },
      {
        path: "explore",
        element: <Explore />,
      },
      {
        path: "tasks",
        element: <FTasks />,
        children: [
          {
            index: true,
            element: <FqueuedTasks />,
            action: QueuedAction,
          },
          {
            path: "acceptedTasks",
            element: <FacceptedTasks />,
            action: AcceptedAction,
            children: [
              {
                path: ":userId/taskInfo",
                element: <TaskInfo />,
              },
            ],
          },
          {
            path: "recentTasks",
            element: <FRecent />,
            children: [
              {
                path: ":userId/taskInfo",
                element: <TaskInfo />,
              },
            ],
          },
        ],
      },
      {
        path: "tasks/:userId/messages",
        element: <FMessages />,
        action: MessageAction,
        children: [
          {
            index: true,
            element: <FMessageDisplay />,
          },
        ],
      },
      {
        path: "explore",
        element: <Explore />,
      },
      {
        path: "earnings",
        element: <Earnings />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
    action: ProfileAction,
  },
  /* Admin routes */
  {
    path: "/admin/:aUser",
    element: <Admin />,
    loader: ALoader,
    children: [
      {
        index: true,
        element: <AdminDashBoard />,
        action: ClientsDeleteAction,
      },
      {
        path: "profit",
        element: <Profit />,
      },
      {
        path: "managersInfo",
        element: <Utilities />,
        action: MAction,
        loader: UtilityLoader,
      },
      {
        path: "profile",
        element: <AProfile />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </Elements>
  );
}

export default App;
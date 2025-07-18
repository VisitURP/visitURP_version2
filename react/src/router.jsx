import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Signup from "./views/Signup";
import SurveyPublicView from "./views/SurveyPublicView";
import Surveys from "./views/Surveys";
import SurveyView from "./views/SurveyView";
import VisitorsP from "./views/VisitorsP";
import VisitorsV from "./views/VisitorsV";
import QuerysP from "./views/QuerysP";
import QuerysN from "./views/QuerysN";
import Semesters from "./views/Semesters";
import RegisterVisit from "./views/RegisterVisit";
import EditVisit from "./views/EditVisit";
import Statistics from "./views/Statistics";
import Advertising from "./views/Advertising";
import Feedbacks from "./views/Feedbacks";
import VisitGroup from "./views/VisitGroup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Navigate to="/" />,
      },
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/surveys",
        element: <Surveys />,
      },
      {
        path: "/surveys/create",
        element: <SurveyView />,
      },
      {
        path: "/surveys/:id",
        element: <SurveyView />,
      },
      {
        path: "/visitorsp",
        element: <VisitorsP />,
      },
      {
        path: "/visitorsv",
        element: <VisitorsV />,
      },
      {
        path: "/register-visit",
        element: <RegisterVisit />,
      },
      {
        path: "/edit-visit",
        element: <EditVisit />,
      },
      {
        path: "/querysp",
        element: <QuerysP />,
      },
      {
        path: "/querysn",
        element: <QuerysN />,
      },
      {
        path: "/semesters",
        element: <Semesters />,
      },
      {
        path: "/statistics",
        element: <Statistics />,
      },
      {
        path: "/advertising",
        element: <Advertising />,
      },
      {
        path: "/feedbacks",
        element: <Feedbacks />,
      },
      {
        path: "/visitgroup",
        element: <VisitGroup />
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/survey/public/:slug",
    element: <SurveyPublicView />,
  },
]);

export default router;

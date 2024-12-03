import { Fragment, useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  MegaphoneIcon,
  BellIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  UserIcon,
  HomeIcon,
  ClipboardIcon,
  UsersIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleBottomCenterTextIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios";
import Toast from "./Toast";
import { CogIcon } from "lucide-react";

// Navigation items with dropdowns for Visitantes and Preguntas
const navigation = [
  { name: "DASHBOARD", to: "/", icon: HomeIcon },
  { name: "ESTADÍSTICAS", to: "/statistics", icon: ChartBarIcon }, // Nueva opción añadida debajo de "DASHBOARD"
  {
    name: "VISITANTES",
    icon: UsersIcon,
    children: [
      { name: "Presenciales", to: "/visitorsp" },
      { name: "Grupos", to: "/visitgroup" },
      { name: "Virtuales", to: "/visitorsv" },
    ],
  },
  {
    name: "PREGUNTAS",
    icon: QuestionMarkCircleIcon,
    children: [
      { name: "Predefinidas", to: "/querysp" },
      { name: "No Predefinidas", to: "/querysn" },
    ],
  },
  {
    name: "FEEDBACKS",
    to: "/feedbacks",
    icon: ChatBubbleBottomCenterTextIcon,
  },
  { name: "SEMESTRES", to: "/semesters", icon: AcademicCapIcon },
  { name: "PUBLICIDAD", to: "/advertising", icon: MegaphoneIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DefaultLayout() {
  const { currentUser, userToken, setCurrentUser, setUserToken } =
    useStateContext();
  const [openDropdown, setOpenDropdown] = useState(null); // To manage dropdown state
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to toggle sidebar
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  if (!userToken) {
    return <Navigate to="login" />;
  }

  const logout = (ev) => {
    ev.preventDefault();
    axiosClient.post("/logout").then((res) => {
      setCurrentUser({});
      setUserToken(null);
    });
  };

  // Se obtienen los datos del usuario
  useEffect(() => {
    axiosClient.get("/me").then(({ data }) => {
      setCurrentUser(data);
    });
    // Simulación de carga de notificaciones
    axiosClient.get("/notifications").then(({ data }) => {
      setNotifications(data || []);
    });
  }, []);

  // Function to handle dropdown toggle
  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

   const toggleNotifications = () => {
     setIsNotificationsOpen(!isNotificationsOpen);
   };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div
        className={`bg-[#282424] text-white ${
          sidebarOpen ? "w-64" : "w-20"
        } flex flex-col justify-between transition-width duration-300 ease-in-out`}
      >
        {/* Logo y título */}
        <div className="flex flex-col items-center px-5 py-6">
          <a
            href="/dashboard"
            className="flex items-center space-x-3 cursor-pointer"
          >
            <img
              className={`h-10 w-10 rounded-full ${
                sidebarOpen ? "" : "mx-auto"
              }`}
              src="/logo_URP.svg"
              alt="URP Logo"
            />
            {sidebarOpen && (
              <h1 className="text-white text-xl font-bold">VISIT | URP</h1>
            )}
          </a>
        </div>

        {/* Search bar */}
        <div className="px-4 border-b border-gray-500 pb-6">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full px-3 py-2 bg-gray-800 text-sm rounded-full placeholder-gray-400 focus:outline-none focus:border-white"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 space-y-2">
          {navigation.map((item) =>
            item.children ? (
              <div key={item.name}>
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`flex items-center justify-between w-full px-4 py-2 text-sm font-semibold rounded-full border border-transparent ${
                    sidebarOpen
                      ? "hover:border-white hover:bg-gray-700"
                      : "justify-center"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-5 w-5" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </div>
                  {sidebarOpen &&
                    (openDropdown === item.name ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    ))}
                </button>
                {openDropdown === item.name && sidebarOpen && (
                  <Transition
                    show={openDropdown === item.name}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="pl-8 mt-2 space-y-2">
                      {item.children.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.to}
                          className={({ isActive }) =>
                            classNames(
                              isActive
                                ? "bg-gray-700 text-white font-bold"
                                : "hover:border-white hover:bg-gray-700 border border-transparent",
                              "block px-4 py-2 text-sm rounded-full"
                            )
                          }
                        >
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  </Transition>
                )}
              </div>
            ) : (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? "bg-gray-700 text-white font-bold"
                      : "hover:border-white hover:bg-gray-700 border border-transparent",
                    "flex items-center px-4 py-2 text-sm rounded-full",
                    sidebarOpen ? "justify-start" : "justify-center"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </NavLink>
            )
          )}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Header */}
        <div className="bg-green-700 shadow p-4 flex justify-between items-center text-white">
          <button onClick={toggleSidebar} className="text-white">
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
          <div className="text-lg font-bold">Universidad Ricardo Palma</div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              {currentUser?.name || "Personal Administrativo"}
            </div>
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative flex items-center justify-center"
              >
                <BellIcon className="w-6 h-6 text-white z-80" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 font-bold">
                    Notificaciones
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {notification.message}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-500">
                        No hay notificaciones.
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center rounded-full bg-green-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="sr-only">Open user menu</span>
                <UserIcon className="w-8 h-8 p-2 rounded-full text-white" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    <a
                      href="#"
                      onClick={logout}
                      className="block px-4 py-2 text-sm text-gray-700"
                    >
                      Sign out
                    </a>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
        <Toast />
      </div>
    </div>
  );
}

import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  UserIcon,
  HomeIcon,
  ClipboardIcon,
  UsersIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios";
import { useEffect } from "react";
import Toast from "./Toast";

// Navigation items with dropdowns for Visitantes and Preguntas
const navigation = [
  { name: "DASHBOARD", to: "/", icon: HomeIcon },
  { name: "SURVEYS", to: "/surveys", icon: ClipboardIcon },
  {
    name: "VISITANTES",
    icon: UsersIcon,
    children: [
      { name: "Presenciales", to: "/visitorsp" },
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
  { name: "SEMESTRES", to: "/semesters", icon: AcademicCapIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DefaultLayout() {
  const { currentUser, userToken, setCurrentUser, setUserToken } =
    useStateContext();
  const [openDropdown, setOpenDropdown] = useState(null); // To manage dropdown state

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

  useEffect(() => {
    axiosClient.get("/me").then(({ data }) => {
      setCurrentUser(data);
    });
  }, []);

  // Function to handle dropdown toggle
  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="bg-green-900 text-white w-64 flex flex-col justify-between">
        {/* Logo */}
        <div className="flex flex-col items-center mt-8 space-y-6">
          <img
            className="h-16 w-16"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Logo Universidad Ricardo Palma"
          />
          <h1 className="text-2xl font-bold text-white">VISITURP</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-4">
          {navigation.map((item) =>
            item.children ? (
              // If the item has children, render it as a dropdown
              <div key={item.name}>
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-green-700"
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  {openDropdown === item.name ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </button>
                {openDropdown === item.name && (
                  <div className="pl-8 mt-2 space-y-2">
                    {item.children.map((subItem) => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.to}
                        className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-green-700"
                      >
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Render normal navigation links
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? "bg-green-700 text-white"
                      : "hover:bg-green-700 hover:text-white",
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md"
                  )
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </NavLink>
            )
          )}
        </nav>

        {/* User profile & Logout */}
        <div className="px-2 py-5">
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 p-2 bg-green-800 rounded-full text-sm">
              <UserIcon className="h-6 w-6 text-white" />
              <span>{currentUser?.name || "Usuario"}</span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 mt-2 w-48 origin-top-right bg-white text-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  <a
                    href="#"
                    onClick={logout}
                    className="block px-4 py-2 text-sm"
                  >
                    Cerrar sesión
                  </a>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Header */}
        <div className="bg-green-600 shadow p-4 flex justify-between items-center text-white">
          <div className="text-lg font-bold">VISITURP</div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">{currentUser?.name || "Alexa Admin"}</div>
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
                leaveTo="transform opacity-0 scale-95"
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

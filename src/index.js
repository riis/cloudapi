import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from '@chakra-ui/react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import './index.css'
import PilotApp from "./PilotApp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "pilot",
    element: <PilotApp />,
  },
]);

createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);
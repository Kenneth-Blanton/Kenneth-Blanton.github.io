import React, { useState } from "react";
import "./App.css";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./router/MainLayout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { AuthContextProvider } from "./data/AuthContext";
import LandingPage from "./components/LandingPage";
import Account from "./pages/Account";
import CreateNote from "./pages/CreateNote";
import EditNote from "./pages/EditNote";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/welcome" element={<LandingPage />} />
      <Route path="/account" element={<Account />} />
      <Route path="/cn" element={<CreateNote />} />
      {/* <Route path="/cb" element={<CreateNote />} /> */}
      <Route path="/n/:id" element={<EditNote />} />

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </div>
  );
}

export default App;

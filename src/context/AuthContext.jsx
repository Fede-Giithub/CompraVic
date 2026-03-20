import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

const decodeJWT = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
};
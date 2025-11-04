import React from "react";
import { api } from "./api/axios";
export const AuthContext = React.createContext(null);

export function AuthProvider({ children }){
  const [user,setUser] = React.useState(null);
  const [loading,setLoading] = React.useState(true);

  React.useEffect(()=>{
    (async ()=>{
      try{ const {data} = await api.get("/auth/me"); setUser(data.user); }
      catch{ setUser(null); }
      finally{ setLoading(false); }
    })();
  },[]);

  const register = async (payload)=>{ await api.post("/auth/register", payload); };
  const login = async (payload)=>{ const {data} = await api.post("/auth/login", payload); setUser(data.user); return data.user; };
  const logout = async ()=>{ await api.post("/auth/logout"); setUser(null); };

  return <AuthContext.Provider value={{user,loading,register,login,logout}}>{children}</AuthContext.Provider>;
}
export function useAuth(){ return React.useContext(AuthContext); }

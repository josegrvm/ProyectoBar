import React from "react";
import axios from "axios";
export const AuthContext = React.createContext(null);
export function AuthProvider({ children }){
  const [user,setUser]=React.useState(null);
  const [loading,setLoading]=React.useState(true);
  React.useEffect(()=>{ axios.get("/auth/me").then(r=>setUser(r.data.user)).catch(()=>setUser(null)).finally(()=>setLoading(false)); },[]);
  const login = async(payload)=>{ const r=await axios.post("/auth/login", payload); setUser(r.data.user); return r.data.user; };
  const logout = async()=>{ await axios.post("/auth/logout"); setUser(null); };
  return <AuthContext.Provider value={{user,loading,login,logout}}>{children}</AuthContext.Provider>;
}
export function useAuth(){ return React.useContext(AuthContext); }
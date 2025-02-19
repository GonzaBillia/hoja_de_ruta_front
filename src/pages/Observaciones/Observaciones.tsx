import React from "react";
import { useAuth } from "@/components/context/auth-context";
import FullScreenLoader from "@/components/common/loader/FSLoader";
import ObservacionesContent from "./components/ObservacionesContent";

const Observaciones: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <FullScreenLoader />;
  }
  return <div className="mx-auto">
    <ObservacionesContent user={user} />
  </div>;
};

export default Observaciones;

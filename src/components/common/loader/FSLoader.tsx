import React from "react";
import { Loader2 } from "lucide-react";

const FullScreenLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Loader2 className="animate-spin h-12 w-12 text-primary" />
    </div>
  );
};

export default FullScreenLoader;

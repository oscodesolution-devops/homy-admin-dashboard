import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import { ReactNode, useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const[activeTab,setActiveTab] = useState("Dashboard");
    return (
    <div className="min-h-screen bg-gray-50/90">
      <Sidebar setActiveTab={setActiveTab}/>
      <div className="pl-64 flex-1 justify-center items-center">
        <Header title={activeTab} />
        {children}
      </div>
    </div>
  );
};

export default Layout;

import { Button } from "@/components/ui/button";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { Bell, ChefHat, Code, FileText, GalleryThumbnails, LayoutDashboard, LogOut, SubscriptIcon, Ticket, User, Users } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavOption {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    target: string;
}

interface SidebarProps {
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveTab }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navOptions = useMemo(() => [
        { name: "Dashboard", icon: LayoutDashboard, target: "/dashboard" },
        { name: "User Management", icon: Users, target: "/usermanagement" },
        { name: "Chef Service", icon: ChefHat, target: "/chefservice" },
        { name: "Orders", icon: FileText, target: '/orders' },
        { name: "Coupons", icon: Code, target: '/couponmanagement' },
        { name: "Gallery", icon: GalleryThumbnails, target: '/gallery' },
        { name: "Plans", icon: SubscriptIcon, target: '/plans' },
        { name: "Query", icon: QuestionMarkIcon, target: '/query' },
        { name: "Notification", icon: Bell, target: '/notification' },
        { name: "Community", icon: Users, target: '/community' },
        { name: "Ticket", icon: Ticket, target: '/ticket' },

    ], []);

    const handleNavClick = (clickedItem: NavOption) => {
        setActiveTab(clickedItem.name);
        navigate(clickedItem.target);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }
    useEffect(()=>{
        navOptions.map(option=>{
            if(location.pathname==option.target){
                setActiveTab(option.name)
            }
        })
    },[])

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
            <div className="flex h-full flex-col">
                <div className="h-16 border-b px-6 flex items-center">
                    <span className="text-2xl font-bold text-rose-500">Homy</span>
                </div>
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navOptions.map((item) => (
                        <Button
                            key={item.name}
                            variant={location.pathname === item.target ? "secondary" : "ghost"}
                            className={`w-full justify-start ${location.pathname === item.target ? "bg-rose-500" : ""}`}
                            onClick={() => handleNavClick(item)}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                        </Button>
                    ))}
                </nav>
                <div className="border-t p-3 space-y-1">
                    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
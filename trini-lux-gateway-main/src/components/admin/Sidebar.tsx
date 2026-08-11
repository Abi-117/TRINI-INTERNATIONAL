import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Boxes,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Star,
  Tag,

} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    name: "Categories",
    icon: Boxes,
    path: "/admin/categories",
  },
  {
    name: "Products",
    icon: Package,
    path: "/admin/products",
  },
  {
    name: "Orders",
    icon: ShoppingCart,
    path: "/admin/order",
  },
{
  name: "Reviews",
  icon: Star,
  path: "/admin/reviews",
},
  {
  name: "Customers",
  icon: Users,
  path: "/admin/customers",
},
  {
    name: "Coupons",
    icon: Tag,
    path: "/admin/coupons",
  },
];

const Sidebar = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <aside className="w-64 bg-black text-white min-h-screen">
      <div className="p-6 text-2xl font-bold">
        TRINI ADMIN
      </div>

      <nav className="space-y-2 px-4">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.path}
              to={menu.path}
              className={`flex items-center gap-3 rounded-lg p-3 transition ${
                pathname === menu.path
                  ? "bg-white text-black"
                  : "hover:bg-gray-800"
              }`}
            >
              <Icon size={20} />
              {menu.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
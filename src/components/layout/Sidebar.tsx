import { NavLink, Link } from 'react-router-dom';
import { visibleNavItems } from '@/config/nav';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/mode-toggle';

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r bg-background/80 backdrop-blur-md z-50">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="http://husteread.com/wp-content/uploads/2026/01/1037-SOLO-右侧1.png"
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-semibold tracking-tight">1037Solo-Docs</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-2">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t space-y-4">
        <ModeToggle />
        <div className="text-xs text-muted-foreground text-center">
          © 2026 1037Solo
        </div>
      </div>
    </aside>
  );
}
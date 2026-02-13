import { NavLink } from 'react-router-dom';
import { navItems } from '@/config/nav';
import { cn } from '@/lib/utils';

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background/90 backdrop-blur-lg z-50 flex items-center justify-around px-1 pb-safe shadow-lg">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 p-1 rounded-lg transition-colors w-full min-w-0",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[9px] font-medium truncate max-w-full leading-tight">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
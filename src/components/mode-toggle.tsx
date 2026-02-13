import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface ModeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ModeToggle({ className, showLabel = true }: ModeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
        "text-muted-foreground hover:bg-muted hover:text-foreground group",
        className
      )}
      title={theme === 'dark' ? '切换至浅色模式' : '切换至深色模式'}
    >
      <div className="relative w-4 h-4">
        <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      {showLabel && <span>{theme === 'dark' ? '深色模式' : '浅色模式'}</span>}
    </button>
  )
}

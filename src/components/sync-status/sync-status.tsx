import { Switch } from "../ui/switch";  // Adjusted import for local usage in React
import { Badge } from "../ui/badge";    // Corrected import path for Badge component
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"; // Adjusted import path
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils"; // Adjusted import path for local utility functions

interface SyncStatusProps {
  isOffline: boolean;
  syncStatus: "idle" | "syncing" | "synced" | "error";
  pendingCount: number;
  onToggle: () => void;
}

export function SyncStatus({ isOffline, syncStatus, pendingCount, onToggle }: SyncStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 border rounded-md px-3 py-1.5">
              <div className="flex items-center gap-2">
                {isOffline ? (
                  <WifiOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Wifi className="h-4 w-4 text-green-500" />
                )}
                <span className="text-sm font-medium">{isOffline ? "Offline" : "Online"}</span>
              </div>
              <Switch checked={!isOffline} onCheckedChange={() => onToggle()} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle between online and offline mode</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {(syncStatus !== "idle" || pendingCount > 0) && (
        <Badge
          variant="outline"
          className={cn(
            "ml-2 gap-1",
            syncStatus === "syncing" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            syncStatus === "synced" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            syncStatus === "error" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          )}
        >
          {syncStatus === "syncing" && <RefreshCw className="h-3 w-3 animate-spin" />}
          {syncStatus === "syncing" && "Syncing..."}
          {syncStatus === "synced" && "All changes synced"}
          {syncStatus === "error" && "Sync failed"}
          {syncStatus === "idle" && pendingCount > 0 && `${pendingCount} pending changes`}
        </Badge>
      )}
    </div>
  );
}

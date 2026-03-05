import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <WifiOff size={48} className="text-text-muted mb-4" />
      <h1 className="text-2xl font-bold mb-2">You&apos;re offline</h1>
      <p className="text-text-secondary text-center max-w-sm">
        DevTrack needs an internet connection. Check your connection and try again.
      </p>
    </div>
  );
}

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-purple-400 gap-4">
      <Loader2 size={48} className="animate-spin" />
      <p className="font-mono text-sm animate-pulse">INITIALIZING...</p>
    </div>
  );
}

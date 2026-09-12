import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallPWA({ dark = false }) {
  const [deferred, setDeferred] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!deferred || installed) return null;

  const handleInstall = async () => {
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <button
      data-testid="pwa-install-button"
      onClick={handleInstall}
      className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
        dark
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500"
          : "bg-blue-700 text-white hover:bg-blue-800"
      }`}
    >
      <Download className="h-4 w-4" /> Install Aplikasi EXAPOS
    </button>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "@/lib/auth-client";
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

type LoginReason = "session_expired" | "account_disabled" | "access_denied" | "forced_logout" | "password_reset" | null;

const REASON_MESSAGES: Record<string, { icon: typeof AlertCircle; message: string; type: "warning" | "error" }> = {
  session_expired: {
    icon: AlertTriangle,
    message: "Votre session a expiré. Veuillez vous reconnecter.",
    type: "warning",
  },
  account_disabled: {
    icon: XCircle,
    message: "Votre compte a été désactivé. Contactez un administrateur.",
    type: "error",
  },
  access_denied: {
    icon: ShieldCheck,
    message: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
    type: "warning",
  },
  forced_logout: {
    icon: XCircle,
    message: "Votre session a été invalidée. Veuillez vous reconnecter.",
    type: "error",
  },
  password_reset: {
    icon: AlertTriangle,
    message: "Votre mot de passe a été réinitialisé. Veuillez vous reconnecter.",
    type: "warning",
  },
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();

  // Get redirect info from URL params
  const redirectPath = searchParams.get("from") || "/admin";
  const loginReason = searchParams.get("reason") as LoginReason;

  // Redirect if already logged in
  useEffect(() => {
    if (session && !isPending) {
      router.push(redirectPath);
      router.refresh();
    }
  }, [session, isPending, router, redirectPath]);

  // Show reason message on mount
  useEffect(() => {
    if (loginReason && REASON_MESSAGES[loginReason]) {
      const { message, type } = REASON_MESSAGES[loginReason];
      if (type === "error") {
        toast.error(message);
      } else {
        toast.warning(message);
      }
    }
  }, [loginReason]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: redirectPath,
      });

      if (result.error) {
        const errorMsg = result.error.message || "Email ou mot de passe incorrect";
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
      } else {
        toast.success("Connexion réussie !");
        // Force router refresh to update session state
        router.refresh();
        // Fallback redirection if the useEffect doesn't trigger fast enough
        router.push(redirectPath);
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Une erreur est survenue";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  // Show loading while checking session
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
          <p className="text-slate-400">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20" />
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-[0.02]" />

        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <div className="mb-8">
            <Image
              src="/logo.svg"
              alt="Forum Génie Entreprise"
              width={280}
              height={100}
              className="opacity-90"
            />
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Panneau d'administration
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-lg">
            Gérez votre contenu, vos événements, vos utilisateurs et bien plus encore depuis un seul endroit.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span>Connexion sécurisée</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Lock className="w-5 h-5 text-emerald-400" />
              </div>
              <span>Accès basé sur les rôles</span>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Administration</h2>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Bienvenue
              </h2>
              <p className="text-gray-600 mt-1">
                Connectez-vous pour continuer
              </p>
            </div>

            {/* Reason Alert */}
            {loginReason && REASON_MESSAGES[loginReason] && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${REASON_MESSAGES[loginReason].type === "error"
                  ? "bg-red-50 border border-red-200"
                  : "bg-amber-50 border border-amber-200"
                  }`}
              >
                {(() => {
                  const Icon = REASON_MESSAGES[loginReason].icon;
                  return (
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${REASON_MESSAGES[loginReason].type === "error"
                        ? "text-red-600"
                        : "text-amber-600"
                        }`}
                    />
                  );
                })()}
                <p
                  className={`text-sm ${REASON_MESSAGES[loginReason].type === "error"
                    ? "text-red-800"
                    : "text-amber-800"
                    }`}
                >
                  {REASON_MESSAGES[loginReason].message}
                </p>
              </div>
            )}

            {/* Error Alert */}
            {error && !loginReason && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="admin@example.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/25"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Redirect info */}
            {redirectPath !== "/admin" && (
              <p className="mt-4 text-xs text-center text-gray-500">
                Vous serez redirigé vers: <span className="font-medium">{redirectPath}</span>
              </p>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Forum Génie Entreprise © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

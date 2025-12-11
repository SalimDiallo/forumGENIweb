"use client";

import React, { useState, useEffect } from "react";
import { resetUserPassword } from "./actions";
import { resetPasswordSchema } from "./schemas";
import {
  Key,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@/hooks/useForm";
import { Input } from "@/components/ui/input";

interface ResetPasswordModalProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type FormValues = {
  newPassword: string;
};

export default function ResetPasswordModal({
  userId,
  userName,
  isOpen,
  onClose,
  onSuccess,
}: ResetPasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    initialValues: { newPassword: "" },
    validationSchema: resetPasswordSchema.pick({ newPassword: true }) as any,
    validateOnChange: true,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.resetForm();
      setShowPassword(false);
    }
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return await resetUserPassword({
        id: userId,
        newPassword: data.newPassword,
      });
    },
    onSuccess: (result) => {
      if (result?.data?.message) {
        toast.success(result.data.message);
        form.resetForm();
        onSuccess();
        onClose();
      } else if (result?.serverError) {
        toast.error(result.serverError);
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erreur lors de la réinitialisation");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.values.newPassword) {
      toast.error("Veuillez saisir un nouveau mot de passe");
      return;
    }

    if (!form.isValid) {
      toast.error(form.getError("newPassword") || "Mot de passe invalide");
      return;
    }

    mutation.mutate(form.values);
  };

  // Password strength indicators
  const password = form.values.newPassword;
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isStrong = hasMinLength && hasUppercase && hasLowercase && hasNumber;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    Réinitialiser le mot de passe
                  </h2>
                  <p className="text-white/80 text-sm">{userName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Password Input */}
            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Input
                  value={form.values.newPassword}
                  onChange={(e) => form.setFieldValue("newPassword", e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  error={form.hasError("newPassword")}
                  errorMessage={form.getError("newPassword")}
                  disabled={mutation.isPending}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength */}
            {password.length > 0 && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className={`h-1 flex-1 rounded-full ${hasMinLength ? "bg-green-500" : "bg-gray-200"}`} />
                  <div className={`h-1 flex-1 rounded-full ${hasLowercase ? "bg-green-500" : "bg-gray-200"}`} />
                  <div className={`h-1 flex-1 rounded-full ${hasUppercase ? "bg-green-500" : "bg-gray-200"}`} />
                  <div className={`h-1 flex-1 rounded-full ${hasNumber ? "bg-green-500" : "bg-gray-200"}`} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1 ${hasMinLength ? "text-green-600" : "text-gray-400"}`}>
                    <Check className="w-3 h-3" /> 8+ caractères
                  </div>
                  <div className={`flex items-center gap-1 ${hasLowercase ? "text-green-600" : "text-gray-400"}`}>
                    <Check className="w-3 h-3" /> Minuscule
                  </div>
                  <div className={`flex items-center gap-1 ${hasUppercase ? "text-green-600" : "text-gray-400"}`}>
                    <Check className="w-3 h-3" /> Majuscule
                  </div>
                  <div className={`flex items-center gap-1 ${hasNumber ? "text-green-600" : "text-gray-400"}`}>
                    <Check className="w-3 h-3" /> Chiffre
                  </div>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                L'utilisateur sera déconnecté de toutes ses sessions après la réinitialisation.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={mutation.isPending}
                className="flex-1 px-4 py-2.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || !form.values.newPassword || !isStrong}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Réinitialisation...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    Réinitialiser
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

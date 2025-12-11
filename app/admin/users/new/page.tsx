"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "../actions";
import { createUserSchema } from "../schemas";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  User,
  Shield,
  Check,
  AlertCircle,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@/hooks/useForm";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatErrorsForToast } from "@/lib/form-utils";

type FormValues = {
  email: string;
  name: string;
  fullName: string;
  password: string;
  role: string;
  isActive: boolean;
};

const roleOptions = [
  { value: "viewer", label: "👁️ Viewer", description: "Consultation uniquement" },
  { value: "editor", label: "✏️ Editor", description: "Création et édition" },
  { value: "admin", label: "🛡️ Admin", description: "Accès complet (hors utilisateurs)" },
  { value: "super_admin", label: "👑 Super Admin", description: "Accès total" },
  { value: "revue", label: "📝 Revue", description: "Accès Blog uniquement" },
  { value: "prospection", label: "💼 Prospection", description: "Accès CRM et Emplois uniquement" },
];

export default function NewUserPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const initialValues: FormValues = {
    email: "",
    name: "",
    fullName: "",
    password: "",
    role: "admin",
    isActive: true,
  };

  const form = useForm<FormValues>({
    initialValues,
    validationSchema: createUserSchema as any,
    validateOnChange: true,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return await createUser(data as any);
    },
    onSuccess: (result) => {
      if (result?.data?.message) {
        toast.success(result.data.message);
        router.push("/admin/users");
        router.refresh();
      } else if (result?.serverError) {
        toast.error(result.serverError);
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erreur lors de la création");
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!form.isValid) {
      const errorMessages = formatErrorsForToast(form.errors, 4);
      toast.error(
        <div>
          <strong>Veuillez corriger les erreurs :</strong>
          <ul className="list-disc list-inside pl-2 text-xs mt-1 space-y-0.5">
            {errorMessages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      );
      return;
    }
    mutation.mutate(values);
  });

  const errorCount = Object.keys(form.errors).length;
  const selectedRole = roleOptions.find((r) => r.value === form.values.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Créer un utilisateur
              </h1>
              <p className="text-gray-600">
                Ajoutez un nouvel administrateur à la plateforme
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.values.email}
                onChange={(e) => form.setFieldValue("email", e.target.value)}
                onBlur={() => form.setFieldTouched("email")}
                type="email"
                placeholder="admin@example.com"
                error={form.hasError("email")}
                errorMessage={form.getError("email")}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Nom d'affichage <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.values.name}
                onChange={(e) => form.setFieldValue("name", e.target.value)}
                onBlur={() => form.setFieldTouched("name")}
                placeholder="Jean Dupont"
                error={form.hasError("name")}
                errorMessage={form.getError("name")}
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block font-medium mb-2">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.values.fullName}
                onChange={(e) => form.setFieldValue("fullName", e.target.value)}
                onBlur={() => form.setFieldTouched("fullName")}
                placeholder="Jean-Pierre Dupont"
                error={form.hasError("fullName")}
                errorMessage={form.getError("fullName")}
              />
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  value={form.values.password}
                  onChange={(e) => form.setFieldValue("password", e.target.value)}
                  onBlur={() => form.setFieldTouched("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  error={form.hasError("password")}
                  errorMessage={form.getError("password")}
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
              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 caractères avec majuscule, minuscule et chiffre
              </p>
            </div>

            {/* Role */}
            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                Rôle <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.values.role}
                onChange={(e) => form.setFieldValue("role", e.target.value)}
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </Select>
              {selectedRole && (
                <p className="mt-1 text-xs text-gray-500">{selectedRole.description}</p>
              )}
            </div>

            {/* Is Active - Toggle Card */}
            <div className="flex items-end">
              <label
                className={`w-full p-4 rounded-xl border-2 cursor-pointer transition-all ${form.values.isActive
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.values.isActive}
                    onChange={(e) => form.setFieldValue("isActive", e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`p-2 rounded-lg ${form.values.isActive ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                  >
                    <Check
                      className={`w-5 h-5 ${form.values.isActive ? "text-white" : "text-gray-500"
                        }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium">Compte actif</p>
                    <p className="text-sm text-gray-500">
                      {form.values.isActive ? "Peut se connecter" : "Ne peut pas se connecter"}
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Role descriptions */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Permissions des rôles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-gray-100">
                <span className="font-semibold text-gray-700">👁️ Viewer:</span>
                <span className="text-gray-600 ml-1">
                  Consultation uniquement, aucune modification
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-100">
                <span className="font-semibold text-gray-700">✏️ Editor:</span>
                <span className="text-gray-600 ml-1">
                  Création et édition de contenu
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-100">
                <span className="font-semibold text-gray-700">🛡️ Admin:</span>
                <span className="text-gray-600 ml-1">
                  Accès complet sauf gestion utilisateurs
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-100">
                <span className="font-semibold text-gray-700">👑 Super Admin:</span>
                <span className="text-gray-600 ml-1">
                  Accès total incluant gestion utilisateurs
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-orange-100">
                <span className="font-semibold text-orange-700">📝 Revue:</span>
                <span className="text-gray-600 ml-1">
                  Accès Blog uniquement (CRUD complet)
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-cyan-100">
                <span className="font-semibold text-cyan-700">💼 Prospection:</span>
                <span className="text-gray-600 ml-1">
                  Accès CRM et Emplois uniquement (CRUD complet)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Summary */}
        {errorCount > 0 && (
          <div className="mx-6 mb-4 flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-red-600 text-sm">
              <span className="font-bold block mb-1">
                {errorCount} erreur{errorCount > 1 ? "s" : ""} à corriger
              </span>
              <ul className="list-disc ml-4 space-y-0.5">
                {formatErrorsForToast(form.errors, 5).map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 p-6 bg-gray-50 border-t">
          <Link
            href="/admin/users"
            className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
          >
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Créer l'utilisateur
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

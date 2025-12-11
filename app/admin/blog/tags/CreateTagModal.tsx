"use client";

import { useMutation } from "@tanstack/react-query";
import Modal from "@/components/Modal";
import { createTag } from "../tags-actions";
import { createTagSchema } from "@/lib/validations/blog";
import { toast } from "sonner";
import { useForm } from "@/hooks/useForm";
import { useSlug } from "@/hooks/useSlug";
import { Input } from "@/components/ui/input";
import SlugField from "@/components/forms/SlugField";
import { formatErrorsForToast } from "@/lib/form-utils";
import { AlertCircle, Save } from "lucide-react";

interface CreateTagModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateTagModal({ open, onClose, onSuccess }: CreateTagModalProps) {
    // ========================================
    // FORM MANAGEMENT with useForm hook
    // ========================================
    const form = useForm({
        initialValues: {
            name: "",
            slug: "",
            color: "#10B981",
        },
        validationSchema: createTagSchema as any,
        validateOnChange: true,
    });

    // ========================================
    // SLUG MANAGEMENT with useSlug hook
    // ========================================
    const slug = useSlug({
        sourceText: form.values.name,
        onSlugChange: (value) => form.setFieldValue("slug", value),
    });

    // ========================================
    // CREATE MUTATION
    // ========================================
    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            return await createTag(data);
        },
        onSuccess: (result) => {
            if (result?.data) {
                toast.success("Tag créé avec succès !");
                handleClose();
                onSuccess();
            } else if (result?.serverError) {
                toast.error(result.serverError);
            }
        },
        onError: (error: any) => {
            toast.error(error?.message || "Erreur lors de la création");
        },
    });

    // ========================================
    // FORM SUBMISSION
    // ========================================
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

        createMutation.mutate(values);
    });

    // ========================================
    // HANDLE MODAL CLOSE
    // ========================================
    const handleClose = () => {
        form.resetForm();
        slug.enableAutoMode();
        onClose();
    };

    return (
        <Modal open={open} title="Créer un tag" onClose={handleClose}>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Nom */}
                <div>
                    <label className="block font-medium mb-1">
                        Nom <span className="text-red-600">*</span>
                    </label>
                    <Input
                        value={form.values.name}
                        onChange={(e) => form.setFieldValue("name", e.target.value)}
                        onBlur={() => form.setFieldTouched("name")}
                        placeholder="Ex: Innovation"
                        error={form.hasError("name")}
                        errorMessage={form.getError("name")}
                    />
                </div>

                {/* Slug */}
                <div>
                    <SlugField
                        value={slug.slug}
                        mode={slug.mode}
                        inputRef={slug.slugInputRef}
                        onChange={slug.setSlug}
                        onEditClick={slug.enableCustomMode}
                        onAutoClick={slug.enableAutoMode}
                        error={form.getError("slug")}
                    />
                </div>

                {/* Couleur */}
                <div>
                    <label className="block font-medium mb-1">Couleur</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={form.values.color}
                            onChange={(e) => form.setFieldValue("color", e.target.value)}
                            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <Input
                            value={form.values.color}
                            onChange={(e) => form.setFieldValue("color", e.target.value)}
                            placeholder="#10B981"
                            error={form.hasError("color")}
                            errorMessage={form.getError("color")}
                        />
                    </div>
                </div>

                {/* Résumé des erreurs */}
                {Object.keys(form.errors).length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-red-600 text-sm">
                            <span className="font-bold block mb-1">Erreurs :</span>
                            <ul className="list-disc ml-4 space-y-0.5">
                                {formatErrorsForToast(form.errors, 3).map((msg, i) => (
                                    <li key={i} className="pl-1">{msg}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-6 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createMutation.isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Création...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Créer
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

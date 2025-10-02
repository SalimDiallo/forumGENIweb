'use client';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { publicEventRegistrationSchema } from "@/lib/validations/public";
import { useAction } from "next-safe-action/hooks";
import { registerForEvent } from "@/app/(sections)/events/register-action";

type Props = { 
  eventSlug: string;
  formData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    organization: string;
    position: string;
    experience: string;
    expectations: string;
    dietaryRestrictions: string;
    newsletter: boolean;
  };
  registrationType?: 'particulier' | 'entreprise';
};

export default function RegistrationForm({ eventSlug, formData, registrationType = 'particulier' }: Props) {
  // Convertir l'expérience du formulaire en experienceLevel pour la base de données
  // In your Zod schema, update the experienceLevel enum to:
  // experienceLevel: z.enum(["none", "beginner", "intermediate", "advanced", "junior", "senior", "expert"]).default("beginner"),
  const mapExperienceToLevel = (
    experience: string
  ): "beginner" | "intermediate" | "advanced" | undefined => {
    const experienceMap: { [key: string]: "beginner" | "intermediate" | "advanced" | undefined } = {
      'student': 'beginner',
      'beginner': 'beginner',
      'intermediate': 'intermediate',
      'advanced': 'advanced',
      '': 'beginner'
    };
    return experienceMap[experience];
  };

  const form = useForm<z.infer<typeof publicEventRegistrationSchema>>({
    resolver: zodResolver(publicEventRegistrationSchema),
    defaultValues: {
      eventSlug,
      firstName: formData?.firstName || "",
      lastName: formData?.lastName || "",
      email: formData?.email || "",
      phone: formData?.phone || "",
      organization: formData?.organization || "",
      position: formData?.position || "",
      experienceLevel: mapExperienceToLevel(formData?.experience || ""),
      expectations: formData?.expectations || "",
      dietaryRestrictions: formData?.dietaryRestrictions || "",
      specialNeeds: "",
      newsletterConsent: formData?.newsletter || false,
    },
  });

  const action = useAction(registerForEvent);

  function onSubmit(values: z.infer<typeof publicEventRegistrationSchema>) {
    action.execute(values);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Prénom *
            </label>
            <input 
              {...form.register("firstName")} 
              placeholder="Votre prénom" 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
            />
            {form.formState.errors.firstName && (
              <p className="text-red-600 text-sm">{form.formState.errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Nom *
            </label>
            <input 
              {...form.register("lastName")} 
              placeholder="Votre nom" 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
            />
            {form.formState.errors.lastName && (
              <p className="text-red-600 text-sm">{form.formState.errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Email *
            </label>
            <input 
              {...form.register("email")} 
              type="email" 
              placeholder="votre@email.com" 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
            />
            {form.formState.errors.email && (
              <p className="text-red-600 text-sm">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Téléphone
            </label>
            <input 
              {...form.register("phone")} 
              placeholder="+212 6XX XX XX XX" 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
            />
          </div>
        </div>

        {(registrationType === 'entreprise' || formData?.organization) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Organisation
              </label>
              <input 
                {...form.register("organization")} 
                placeholder="Nom de votre organisation" 
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Poste/Fonction
              </label>
              <input 
                {...form.register("position")} 
                placeholder="Votre fonction" 
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Niveau d'expérience
          </label>
          <select 
            {...form.register("experienceLevel")} 
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
          >
            <option value="none">Aucune expérience</option>
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="advanced">Avancé</option>
            <option value="junior">Junior (0-2 ans)</option>
            <option value="senior">Senior (5+ ans)</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Vos attentes pour cet événement
          </label>
          <textarea 
            {...form.register("expectations")} 
            placeholder="Qu'espérez-vous obtenir de cet événement ?"
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Restrictions alimentaires
            </label>
            <input 
              {...form.register("dietaryRestrictions")} 
              placeholder="Végétarien, allergies..." 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Besoins spéciaux
            </label>
            <input 
              {...form.register("specialNeeds")} 
              placeholder="Accessibilité, autres besoins..." 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
          <input 
            type="checkbox" 
            {...form.register("newsletterConsent")} 
            className="mt-1 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-600"
          />
          <div>
            <label className="font-medium text-gray-900 block mb-1">
              Recevoir la newsletter GENI
            </label>
            <p className="text-sm text-gray-700">
              Recevez nos actualités et événements par email.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={action.status === "executing"}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {action.status === "executing" ? "Inscription en cours..." : "Finaliser l'inscription"}
          </button>
        </div>

        {action.result?.serverError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">
              {action.result.serverError.message || "Une erreur est survenue lors de l'inscription."}
            </p>
          </div>
        )}

        {action.result?.data?.id && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-700 text-sm font-medium">
              ✅ Inscription confirmée ! Vous recevrez un email de confirmation sous peu.
            </p>
            <p className="text-emerald-600 text-xs mt-1">
              Référence : #{action.result.data.id}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
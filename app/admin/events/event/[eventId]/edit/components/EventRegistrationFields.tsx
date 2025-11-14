"use client";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { updateEventSchema } from "../event.edit.schema";

interface EventRegistrationFieldsProps {
  register: UseFormRegister<updateEventSchema>;
  errors: FieldErrors<updateEventSchema>;
}

export default function EventRegistrationFields({
  register,
  errors,
}: EventRegistrationFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="registrationStart"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Début des inscriptions
          </label>
          <input
            id="registrationStart"
            type="datetime-local"
            {...register("registrationStart")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.registrationStart && (
            <p className="text-red-600 text-sm mt-1">
              {errors.registrationStart.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="registrationEnd"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Fin des inscriptions
          </label>
          <input
            id="registrationEnd"
            type="datetime-local"
            {...register("registrationEnd")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.registrationEnd && (
            <p className="text-red-600 text-sm mt-1">
              {errors.registrationEnd.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="maxParticipants"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre max. de participants
          </label>
          <input
            id="maxParticipants"
            type="number"
            min={0}
            {...register("maxParticipants", { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.maxParticipants && (
            <p className="text-red-600 text-sm mt-1">
              {errors.maxParticipants.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="isFree"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Gratuit ?
          </label>
          <select
            id="isFree"
            {...register("isFree")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
          {errors.isFree && (
            <p className="text-red-600 text-sm mt-1">
              {errors.isFree.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Prix (si payant)
          </label>
          <input
            id="price"
            type="number"
            min={0}
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">
              {errors.price.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Devise
          </label>
          <input
            id="currency"
            {...register("currency")}
            placeholder="MAD"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.currency && (
            <p className="text-red-600 text-sm mt-1">
              {errors.currency.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

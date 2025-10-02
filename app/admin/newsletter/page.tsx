"use client";
import { useAction } from "next-safe-action/hooks";
import { createSubscription, deleteSubscription, listSubscriptions } from "./actions";
import { useEffect } from "react";

export default function AdminNewsletterPage() {
  const list = useAction(listSubscriptions);
  const create = useAction(createSubscription);
  const del = useAction(deleteSubscription);

  useEffect(() => {
    list.execute();
  }, []);

  async function onCreate(formData: FormData) {
    create.execute({
      email: String(formData.get("email") || ""),
      name: (String(formData.get("name") || "") || undefined) as string | undefined,
      frequency: "weekly",
      isActive: true,
    });
  }

  useEffect(() => {
    if (create.status === "hasSucceeded" || del.status === "hasSucceeded") {
      list.execute();
    }
  }, [create.status, del.status]);

  return (
    <div className="space-y-6">
      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">Ajouter un abonné</h2>
        <form action={onCreate} className="grid grid-cols-1 gap-3 max-w-lg">
          <input name="email" placeholder="Email" className="border rounded px-3 py-2" />
          <input name="name" placeholder="Nom (optionnel)" className="border rounded px-3 py-2" />
          <button type="submit" className="bg-gray-900 text-white rounded px-3 py-2">Ajouter</button>
        </form>
      </section>

      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">Abonnés</h2>
        <ul className="divide-y">
          {list.result?.data?.subscriptions?.map((s: any) => (
            <li key={s.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{s.email}</p>
                <p className="text-sm text-gray-600">{s.name}</p>
              </div>
              <button onClick={() => del.execute({ id: s.id })} className="text-red-600 hover:underline">Supprimer</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}



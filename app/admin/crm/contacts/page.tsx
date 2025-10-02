"use client";
import { useAction } from "next-safe-action/hooks";
import { createContact, deleteContact, listContacts } from "../actions";
import { useEffect } from "react";

export default function AdminContactsPage() {
  const contacts = useAction(listContacts);
  const createC = useAction(createContact);
  const delC = useAction(deleteContact);

  useEffect(() => {
    contacts.execute();
  }, []);

  async function onCreate(formData: FormData) {
    createC.execute({
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    });
  }

  useEffect(() => {
    if (createC.status === "hasSucceeded" || delC.status === "hasSucceeded") {
      contacts.execute();
    }
  }, [createC.status, delC.status]);

  return (
    <div className="space-y-6">
      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">Créer un message de contact</h2>
        <form action={onCreate} className="grid grid-cols-1 gap-3 max-w-lg">
          <input name="name" placeholder="Nom" className="border rounded px-3 py-2" />
          <input name="email" placeholder="Email" className="border rounded px-3 py-2" />
          <input name="subject" placeholder="Sujet" className="border rounded px-3 py-2" />
          <textarea name="message" placeholder="Message" className="border rounded px-3 py-2" />
          <button type="submit" className="bg-gray-900 text-white rounded px-3 py-2">Créer</button>
        </form>
      </section>

      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">Messages</h2>
        <ul className="divide-y">
          {contacts.result?.data?.messages?.map((m: any) => (
            <li key={m.id} className="flex items-start justify-between py-2">
              <div>
                <p className="font-medium">{m.subject} — {m.email}</p>
                <p className="text-sm text-gray-600">{m.message}</p>
              </div>
              <button onClick={() => delC.execute({ id: m.id })} className="text-red-600 hover:underline">Supprimer</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}



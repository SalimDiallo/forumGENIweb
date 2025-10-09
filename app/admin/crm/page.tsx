"use client";
import { useAction } from "next-safe-action/hooks";
import { createContact, deleteContact, listContacts, createPartnership, deletePartnership, listPartnerships } from "./actions";
import { useEffect } from "react";

export default function AdminCrmPage() {
  const contacts = useAction(listContacts);
  const createC = useAction(createContact);
  const delC = useAction(deleteContact);

  const partnerships = useAction(listPartnerships);
  const createP = useAction(createPartnership);
  const delP = useAction(deletePartnership);

  useEffect(() => {
    contacts.execute();
    partnerships.execute();
  }, []);

  async function onCreateContact(formData: FormData) {
    createC.execute({
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    });
  }

  async function onCreatePartnership(formData: FormData) {
    createP.execute({
      companyName: String(formData.get("companyName") || ""),
      companySize: (formData.get("companySize") as "startup" | "pme" | "eti" | "grande_entreprise") || "startup",
      contactName: String(formData.get("contactName") || ""),
      contactEmail: String(formData.get("contactEmail") || ""),
      partnershipType: (formData.get("partnershipType") as "sponsor" | "recruiter" | "speaker" | "mentor" | "other") || "sponsor",
    });
  }

  useEffect(() => {
    if (createC.status === "hasSucceeded" || delC.status === "hasSucceeded") {
      contacts.execute();
    }
  }, [createC.status, delC.status]);

  useEffect(() => {
    if (createP.status === "hasSucceeded" || delP.status === "hasSucceeded") {
      partnerships.execute();
    }
  }, [createP.status, delP.status]);

  return (
    <div className="space-y-8">
      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">Créer un message de contact</h2>
        <form action={onCreateContact} className="grid grid-cols-1 gap-3 max-w-lg">
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

      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">Créer une demande de partenariat</h2>
        <form action={onCreatePartnership} className="grid grid-cols-1 gap-3 max-w-lg">
          <input name="companyName" placeholder="Entreprise" className="border rounded px-3 py-2" />
          <input name="companySize" placeholder="Taille (startup, pme, ...)" className="border rounded px-3 py-2" />
          <input name="contactName" placeholder="Nom du contact" className="border rounded px-3 py-2" />
          <input name="contactEmail" placeholder="Email du contact" className="border rounded px-3 py-2" />
          <input name="partnershipType" placeholder="Type (sponsor, recruiter, ...)" className="border rounded px-3 py-2" />
          <button type="submit" className="bg-gray-900 text-white rounded px-3 py-2">Créer</button>
        </form>
      </section>

      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">Demandes de partenariat</h2>
        <ul className="divide-y">
          {partnerships.result?.data?.requests?.map((r: any) => (
            <li key={r.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{r.companyName}</p>
                <p className="text-sm text-gray-600">{r.partnershipType} — {r.contactEmail}</p>
              </div>
              <button onClick={() => delP.execute({ id: r.id })} className="text-red-600 hover:underline">Supprimer</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}



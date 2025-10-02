"use client";
import { useAction } from "next-safe-action/hooks";
import { getAnalyticsByDate, upsertAnalytics } from "./actions";
import { useEffect, useState } from "react";

export default function AdminAnalyticsPage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const get = useAction(getAnalyticsByDate);
  const upsert = useAction(upsertAnalytics);

  useEffect(() => {
    get.execute({ date: new Date(date).toISOString() });
  }, [date]);

  async function onSave(formData: FormData) {
    upsert.execute({
      date: new Date(date).toISOString(),
      pageViews: Number(formData.get("pageViews") || 0),
      uniqueVisitors: Number(formData.get("uniqueVisitors") || 0),
      newsletterSignups: Number(formData.get("newsletterSignups") || 0),
      eventRegistrations: Number(formData.get("eventRegistrations") || 0),
      contactMessages: Number(formData.get("contactMessages") || 0),
      partnershipRequests: Number(formData.get("partnershipRequests") || 0),
      jobViews: Number(formData.get("jobViews") || 0),
      blogViews: Number(formData.get("blogViews") || 0),
    });
  }

  const v = (get.result?.data?.entry ?? {}) as {
    pageViews?: number;
    uniqueVisitors?: number;
    newsletterSignups?: number;
    eventRegistrations?: number;
    contactMessages?: number;
    partnershipRequests?: number;
    jobViews?: number;
    blogViews?: number;
  };

  return (
    <div className="space-y-6">
      <section className="p-4 bg-white rounded-md border">
        <h2 className="text-lg font-semibold mb-3">Analytics du jour</h2>
        <div className="mb-4">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded px-3 py-2" />
        </div>
        <form action={onSave} className="grid grid-cols-2 gap-3 max-w-2xl">
          <input name="pageViews" defaultValue={v.pageViews ?? 0} className="border rounded px-3 py-2" placeholder="Page Views" />
          <input name="uniqueVisitors" defaultValue={v.uniqueVisitors ?? 0} className="border rounded px-3 py-2" placeholder="Unique Visitors" />
          <input name="newsletterSignups" defaultValue={v.newsletterSignups ?? 0} className="border rounded px-3 py-2" placeholder="Newsletter Signups" />
          <input name="eventRegistrations" defaultValue={v.eventRegistrations ?? 0} className="border rounded px-3 py-2" placeholder="Event Registrations" />
          <input name="contactMessages" defaultValue={v.contactMessages ?? 0} className="border rounded px-3 py-2" placeholder="Contact Messages" />
          <input name="partnershipRequests" defaultValue={v.partnershipRequests ?? 0} className="border rounded px-3 py-2" placeholder="Partnership Requests" />
          <input name="jobViews" defaultValue={v.jobViews ?? 0} className="border rounded px-3 py-2" placeholder="Job Views" />
          <input name="blogViews" defaultValue={v.blogViews ?? 0} className="border rounded px-3 py-2" placeholder="Blog Views" />
          <div className="col-span-2 mt-2">
            <button type="submit" className="bg-gray-900 text-white rounded px-3 py-2">Enregistrer</button>
          </div>
        </form>
      </section>
    </div>
  );
}



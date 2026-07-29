"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Contact = { id: string; firstName: string; lastName: string; email: string | null; title: string | null; contactType: string; status: string; organization?: { name: string } | null };
type Opportunity = { id: string; name: string; stage: string; probability: number; valueUsd: string | null; currency: string; contact: Contact | null; listing: { title: string } | null };
type Task = { id: string; title: string; status: string; priority: string; dueAt: string | null; opportunity: { name: string } | null };
type Activity = { id: string; subject: string; body: string; type: string; occurredAt: string; contact: { firstName: string; lastName: string } | null; opportunity: { name: string } | null };
type Option = { id: string; name: string };
type ListingOption = { id: string; title: string };

const input = "w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm";
const button = "w-full rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50";

export default function CrmManager({
  contacts, opportunities, tasks, activities, organizations, listings,
}: {
  contacts: Contact[]; opportunities: Opportunity[]; tasks: Task[]; activities: Activity[];
  organizations: Option[]; listings: ListingOption[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const filteredContacts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return contacts;
    return contacts.filter((contact) => `${contact.firstName} ${contact.lastName} ${contact.email ?? ""} ${contact.organization?.name ?? ""}`.toLowerCase().includes(needle));
  }, [contacts, query]);

  async function send(method: "POST" | "PATCH", body: Record<string, unknown>) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/crm", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error || "The CRM record could not be saved.");
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("The CRM service could not be reached.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <section className="grid gap-4 xl:grid-cols-4">
        <form className="rounded-2xl bg-white p-5 shadow-sm" onSubmit={async (event) => {
          event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
          if (await send("POST", { entity: "contact", firstName: data.get("firstName"), lastName: data.get("lastName"), email: data.get("email"), title: data.get("title"), contactType: data.get("contactType"), organizationId: data.get("organizationId"), notes: data.get("notes") })) form.reset();
        }}>
          <h2 className="font-display text-lg font-bold">Add relationship</h2>
          <div className="mt-4 space-y-3">
            <input className={input} name="firstName" placeholder="First name" required />
            <input className={input} name="lastName" placeholder="Last name" required />
            <input className={input} name="email" type="email" placeholder="Work email" />
            <input className={input} name="title" placeholder="Role or title" />
            <select className={input} name="organizationId" defaultValue=""><option value="">No organisation</option>{organizations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
            <select className={input} name="contactType" defaultValue="investor"><option value="investor">Investor</option><option value="sponsor">Project sponsor</option><option value="advisor">Adviser</option><option value="government">Government / DFI</option><option value="partner">Partner</option><option value="other">Other</option></select>
            <textarea className={input} name="notes" rows={2} placeholder="Relationship notes" />
            <button disabled={busy} className={button}>Save relationship</button>
          </div>
        </form>

        <form className="rounded-2xl bg-white p-5 shadow-sm" onSubmit={async (event) => {
          event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
          if (await send("POST", { entity: "opportunity", name: data.get("name"), contactId: data.get("contactId"), organizationId: data.get("organizationId"), listingId: data.get("listingId"), valueUsd: data.get("valueUsd"), probability: data.get("probability"), nextStep: data.get("nextStep") })) form.reset();
        }}>
          <h2 className="font-display text-lg font-bold">Add opportunity</h2>
          <div className="mt-4 space-y-3">
            <input className={input} name="name" placeholder="Opportunity name" required />
            <select className={input} name="contactId" defaultValue=""><option value="">No primary contact</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}</select>
            <select className={input} name="organizationId" defaultValue=""><option value="">No organisation</option>{organizations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
            <select className={input} name="listingId" defaultValue=""><option value="">No linked project</option>{listings.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select>
            <input className={input} name="valueUsd" inputMode="decimal" placeholder="Potential value (USD)" />
            <input className={input} name="probability" type="number" min="0" max="100" defaultValue="10" aria-label="Probability percent" />
            <input className={input} name="nextStep" placeholder="Next step" />
            <button disabled={busy} className={button}>Save opportunity</button>
          </div>
        </form>

        <form className="rounded-2xl bg-white p-5 shadow-sm" onSubmit={async (event) => {
          event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
          if (await send("POST", { entity: "task", title: data.get("title"), opportunityId: data.get("opportunityId"), contactId: data.get("contactId"), priority: data.get("priority"), dueAt: data.get("dueAt"), description: data.get("description") })) form.reset();
        }}>
          <h2 className="font-display text-lg font-bold">Add follow-up</h2>
          <div className="mt-4 space-y-3">
            <input className={input} name="title" placeholder="Follow-up action" required />
            <select className={input} name="opportunityId" defaultValue=""><option value="">General task</option>{opportunities.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
            <select className={input} name="contactId" defaultValue=""><option value="">No linked contact</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}</select>
            <select className={input} name="priority" defaultValue="normal"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select>
            <input className={input} name="dueAt" type="date" />
            <textarea className={input} name="description" rows={2} placeholder="Context or expected outcome" />
            <button disabled={busy} className={button}>Save follow-up</button>
          </div>
        </form>

        <form className="rounded-2xl bg-white p-5 shadow-sm" onSubmit={async (event) => {
          event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
          if (await send("POST", { entity: "activity", subject: data.get("subject"), body: data.get("body"), type: data.get("type"), contactId: data.get("contactId"), opportunityId: data.get("opportunityId") })) form.reset();
        }}>
          <h2 className="font-display text-lg font-bold">Record activity</h2>
          <div className="mt-4 space-y-3">
            <input className={input} name="subject" placeholder="Activity summary" required />
            <select className={input} name="type" defaultValue="note"><option value="note">Note</option><option value="call">Call</option><option value="email">Email</option><option value="meeting">Meeting</option></select>
            <select className={input} name="contactId" defaultValue=""><option value="">No linked contact</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}</select>
            <select className={input} name="opportunityId" defaultValue=""><option value="">No linked opportunity</option>{opportunities.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
            <textarea className={input} name="body" rows={4} placeholder="Outcome, commitments and next steps" />
            <button disabled={busy} className={button}>Save activity</button>
          </div>
        </form>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-lg font-bold">Relationship directory</h2><input className="rounded-lg border border-black/10 px-3 py-2 text-sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search relationships" aria-label="Search relationships" /></div>
          <div className="mt-4 space-y-3">{filteredContacts.length === 0 ? <p className="text-sm text-wgray">No matching relationships.</p> : filteredContacts.map((contact) => (
            <div key={contact.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 p-3">
              <div><p className="font-bold">{contact.firstName} {contact.lastName}</p><p className="text-sm text-wgray">{contact.title || contact.contactType}{contact.organization ? ` · ${contact.organization.name}` : ""}{contact.email ? ` · ${contact.email}` : ""}</p></div>
              <select className="rounded-lg border border-black/10 px-2 py-2 text-sm" value={contact.status} onChange={(event) => void send("PATCH", { entity: "contact", id: contact.id, status: event.target.value })}><option value="lead">Lead</option><option value="qualified">Qualified</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
            </div>
          ))}</div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold">Opportunity pipeline</h2>
          <div className="mt-4 space-y-3">{opportunities.length === 0 ? <p className="text-sm text-wgray">No opportunities recorded.</p> : opportunities.map((o) => (
            <div key={o.id} className="rounded-xl border border-black/10 p-3">
              <div className="flex items-start justify-between gap-3"><div><p className="font-bold">{o.name}</p><p className="text-sm text-wgray">{o.contact ? `${o.contact.firstName} ${o.contact.lastName}` : "No primary contact"}{o.listing ? ` · ${o.listing.title}` : ""}</p></div><span className="text-sm font-bold">{o.probability}%</span></div>
              <div className="mt-3 flex items-center gap-2"><select className={input} value={o.stage} onChange={(event) => void send("PATCH", { entity: "opportunity", id: o.id, stage: event.target.value })}>{["identified","qualified","nda","diligence","term-sheet","committed","won","lost"].map((stage) => <option key={stage}>{stage}</option>)}</select>{o.valueUsd != null && <span className="whitespace-nowrap text-sm">{o.currency} {Number(o.valueUsd).toLocaleString()}</span>}</div>
            </div>
          ))}</div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold">Follow-ups</h2>
          <div className="mt-4 space-y-3">{tasks.length === 0 ? <p className="text-sm text-wgray">No follow-ups recorded.</p> : tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between gap-3 rounded-xl border border-black/10 p-3"><div><p className="font-bold">{task.title}</p><p className="text-sm text-wgray">{task.opportunity?.name || "General"}{task.dueAt ? ` · due ${new Date(task.dueAt).toLocaleDateString()}` : ""} · {task.priority}</p></div><select className="rounded-lg border border-black/10 px-2 py-2 text-sm" value={task.status} onChange={(event) => void send("PATCH", { entity: "task", id: task.id, status: event.target.value })}><option value="open">Open</option><option value="in-progress">In progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>
          ))}</div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold">Recent activity</h2>
          <div className="mt-4 space-y-3">{activities.length === 0 ? <p className="text-sm text-wgray">No activity recorded.</p> : activities.map((activity) => (
            <div key={activity.id} className="rounded-xl border border-black/10 p-3"><div className="flex justify-between gap-3"><p className="font-bold">{activity.subject}</p><span className="text-sm uppercase text-wgray">{activity.type}</span></div><p className="mt-1 text-sm text-wgray">{activity.contact ? `${activity.contact.firstName} ${activity.contact.lastName}` : activity.opportunity?.name || "General"} · {new Date(activity.occurredAt).toLocaleDateString()}</p>{activity.body && <p className="mt-2 text-sm">{activity.body}</p>}</div>
          ))}</div>
        </div>
      </section>
    </div>
  );
}

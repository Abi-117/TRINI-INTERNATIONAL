import { createFileRoute } from "@tanstack/react-router";
import { Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/store-provider";
import type { Address } from "@/types";
import {Link} from "@tanstack/react-router";

export const Route = createFileRoute("/account/addresses")({
  head: () => ({
    meta: [
      { title: "Address Book — TRINI INTERNATIONAL" },
      { name: "description", content: "Save and manage your delivery addresses." },
      { property: "og:title", content: "Address Book — TRINI INTERNATIONAL" },
      { property: "og:description", content: "Save and manage your delivery addresses." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AddressesPage,
});

const blank = (): Address => ({
  id: `addr_${Date.now()}`,
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  city: "",
  state: "Tamil Nadu",
  pincode: "",
});

function AddressesPage() {
  const { addresses, saveAddress, removeAddress, setDefaultAddress, user } = useStore();
  if (!user) {

return (

<div className="rounded-3xl glass p-20 text-center">

<h2 className="text-xl font-bold">
Login Required
</h2>

<Button className="mt-5" asChild>

<Link to="/auth/login">
Login
</Link>

</Button>

</div>

);

}
  const [draft, setDraft] = useState<Address>(blank());

  const save = () => {
    if (!draft.fullName || !draft.line1 || !draft.pincode) return toast.error("Fill in name, address and pincode");
    saveAddress(draft);
    setDraft(blank());
    toast.success("Address saved");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className="rounded-3xl glass p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{a.label}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => setDefaultAddress(a.id)} aria-label="Set default">
                  <Star className={a.isDefault ? "size-3.5 fill-primary text-primary" : "size-3.5"} />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => removeAddress(a.id)} aria-label="Delete">
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold">{a.fullName}</p>
            <p className="text-sm text-muted-foreground">
              {a.line1}, {a.city}, {a.state} — {a.pincode}
            </p>
            <p className="text-sm text-muted-foreground">{a.phone}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl glass p-7">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
          <Plus className="size-4 text-primary" /> Add a new address
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["fullName", "Full name"],
              ["phone", "Phone"],
              ["line1", "Address"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"],
              ["label", "Label"],
            ] as const
          ).map(([key, label]) => (
            <Input
              key={key}
              placeholder={label}
              value={(draft[key] as string) ?? ""}
              onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
              className="h-11 rounded-2xl border-border bg-surface/60"
            />
          ))}
        </div>
        <Button variant="hero" className="mt-5" onClick={save}>
          Save address
        </Button>
      </div>
    </div>
  );
}

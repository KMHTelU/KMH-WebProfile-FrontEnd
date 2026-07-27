import { useEffect, useRef, useState } from "react";
import { ImageUp, Save } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useOrganizationProfile } from "../../../lib/api/hooks";
import {
  useCreateOrgProfile,
  useUpdateOrgProfile,
  useUploadOrgProfileLogo,
} from "../../../lib/api/admin-hooks";
import { ORG_PROFILE_ID } from "../../../lib/config";
import type { OrganizationProfilePayload } from "../../../lib/api/types";

const empty: OrganizationProfilePayload = {
  name: "",
  short_name: "",
  description: "",
  vision: "",
  mission: "",
  history: "",
  address: "",
  email: "",
  phone: "",
  instagram_url: "",
  youtube_url: "",
  website_url: "",
};

export function AdminOrgProfile() {
  const id = ORG_PROFILE_ID;
  const { data: profile } = useOrganizationProfile(id);
  const createM = useCreateOrgProfile();
  const updateM = useUpdateOrgProfile();
  const uploadLogo = useUploadOrgProfileLogo();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<OrganizationProfilePayload>({ ...empty });
  const set = (k: keyof OrganizationProfilePayload, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        short_name: profile.shortName || "",
        description: profile.description || "",
        vision: profile.vision || "",
        mission: profile.mission || "",
        history: profile.history || "",
        address: profile.address || "",
        email: profile.email || "",
        phone: profile.phone || "",
        instagram_url: profile.instagramUrl || "",
        youtube_url: profile.youtubeUrl || "",
        website_url: profile.websiteUrl || "",
      });
    }
  }, [profile]);

  const submit = async () => {
    if (id) await updateM.mutateAsync({ id, payload: form });
    else await createM.mutateAsync(form);
  };

  const field = (
    key: keyof OrganizationProfilePayload,
    label: string,
    textarea = false
  ) => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {textarea ? (
        <Textarea value={form[key] || ""} onChange={(e) => set(key, e.target.value)} />
      ) : (
        <Input value={form[key] || ""} onChange={(e) => set(key, e.target.value)} />
      )}
    </div>
  );

  return (
    <div className="max-w-2xl">
      <PageHeader title="Profil Organisasi" description="Identitas & kontak resmi KMH" />

      {!id && (
        <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Belum ada ID profil terkonfigurasi. Menyimpan akan <b>membuat</b> profil baru.
          Setelah dibuat, set <code>VITE_ORG_PROFILE_ID</code> dengan ID profil agar bisa
          diperbarui & mengunggah logo.
        </div>
      )}

      {id && (
        <div className="flex items-center gap-3 mb-6">
          {profile?.logo?.url ? (
            <img src={profile.logo.url} alt="logo" className="w-16 h-16 rounded-lg object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-neutral-200" />
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploadLogo.isPending}
            onClick={() => fileRef.current?.click()}
          >
            <ImageUp size={15} /> {uploadLogo.isPending ? "Mengunggah..." : "Ganti Logo"}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadLogo.mutate({ id, file });
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field("name", "Nama")}
        {field("short_name", "Nama Singkat")}
        <div className="sm:col-span-2">{field("description", "Deskripsi", true)}</div>
        <div className="sm:col-span-2">{field("vision", "Visi", true)}</div>
        <div className="sm:col-span-2">{field("mission", "Misi", true)}</div>
        <div className="sm:col-span-2">{field("history", "Sejarah", true)}</div>
        <div className="sm:col-span-2">{field("address", "Alamat", true)}</div>
        {field("email", "Email")}
        {field("phone", "Telepon")}
        {field("instagram_url", "Instagram URL")}
        {field("youtube_url", "YouTube URL")}
        {field("website_url", "Website URL")}
      </div>

      <div className="mt-6">
        <Button
          onClick={submit}
          disabled={!form.name || !form.short_name || createM.isPending || updateM.isPending}
        >
          <Save size={16} /> Simpan
        </Button>
      </div>
    </div>
  );
}

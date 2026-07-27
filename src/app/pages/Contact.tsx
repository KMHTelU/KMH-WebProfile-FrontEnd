import { useState } from "react";
import { Instagram, Mail, MapPin, Phone, Send, Youtube } from "lucide-react";
import { toast } from "sonner";
import { SmartImage } from "../components/common/SmartImage";
import { Reveal } from "../components/common/motion";
import { Seo } from "../components/common/Seo";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useDivisions, useSubmitContactMessage } from "../../lib/api/hooks";
import { parseApiError } from "../../lib/api/client";

const HERO =
  "https://images.unsplash.com/photo-1708578200684-3aa944b73237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920";

export function Contact() {
  const { data: divisions = [] } = useDivisions();
  const submit = useSubmitContactMessage();

  // Form kontak
  const [c, setC] = useState({ name: "", email: "", subject: "", message: "" });
  const setContact = (k: keyof typeof c, v: string) => setC((s) => ({ ...s, [k]: v }));

  // Form join
  const [j, setJ] = useState({
    name: "",
    email: "",
    npm: "",
    semester: "",
    division: "",
    motivation: "",
  });
  const setJoin = (k: keyof typeof j, v: string) => setJ((s) => ({ ...s, [k]: v }));

  const submitContact = async () => {
    try {
      await submit.mutateAsync({
        name: c.name,
        email: c.email,
        subject: c.subject || undefined,
        message: c.message,
      });
      toast.success("Pesan terkirim. Terima kasih!");
      setC({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  };

  const submitJoin = async () => {
    const divName = divisions.find((d) => d.id === j.division)?.name || j.division || "-";
    const message = [
      "== Pendaftaran Anggota (Join KMH) ==",
      `Nama       : ${j.name}`,
      `NIM        : ${j.npm}`,
      `Semester   : ${j.semester}`,
      `Divisi     : ${divName}`,
      "",
      "Motivasi:",
      j.motivation,
    ].join("\n");
    try {
      await submit.mutateAsync({
        name: j.name,
        email: j.email,
        subject: `${divName} — ${j.name}`,
        message,
      });
      toast.success("Pendaftaran terkirim. Kami akan menghubungi kamu!");
      setJ({ name: "", email: "", npm: "", semester: "", division: "", motivation: "" });
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Kontak & Gabung"
        description="Hubungi Keluarga Mahasiswa Hindu Telkom University atau daftar menjadi anggota. Kami terbuka untuk seluruh mahasiswa Hindu Tel-U."
        path="/contact"
      />
      {/* Hero */}
      <section className="relative h-[38vh] min-h-[260px] flex items-center justify-center overflow-hidden">
        <SmartImage
          src={HERO}
          alt="Kontak KMH"
          priority
          wrapperClassName="absolute inset-0 w-full h-full"
          imgClassName="w-full h-full object-cover"
          placeholderClassName="bg-neutral-800"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 z-10" />
        <div className="relative z-20 text-center px-6">
          <div className="text-xs tracking-widest uppercase text-amber-300 mb-3">Kontak & Bergabung</div>
          <h1 className="text-white" style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 700 }}>
            Hubungi & Bergabung dengan KMH
          </h1>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info */}
          <Reveal className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-neutral-900 mb-2" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                Mari Terhubung
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                Punya pertanyaan atau ingin menjadi bagian dari keluarga KMH Telkom University?
                Kirim pesan atau daftar melalui formulir di samping.
              </p>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-500 mt-0.5" />
                <span className="text-neutral-600">Telkom University, Bandung, Jawa Barat</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-amber-500 mt-0.5" />
                <a href="mailto:kmh@student.telkomuniversity.ac.id" className="text-neutral-600 hover:text-amber-700">
                  kmh@student.telkomuniversity.ac.id
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-amber-500 mt-0.5" />
                <span className="text-neutral-600">+62 8xx-xxxx-xxxx</span>
              </div>
            </div>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-amber-50 flex items-center justify-center text-neutral-600 hover:text-amber-600 transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-amber-50 flex items-center justify-center text-neutral-600 hover:text-amber-600 transition-colors" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </Reveal>

          {/* Forms */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
              <Tabs defaultValue="contact">
                <TabsList className="mb-6">
                  <TabsTrigger value="contact">Kontak</TabsTrigger>
                  <TabsTrigger value="join">Gabung (Join)</TabsTrigger>
                </TabsList>

                {/* Kontak */}
                <TabsContent value="contact" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Nama</Label>
                      <Input value={c.name} onChange={(e) => setContact("name", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input type="email" value={c.email} onChange={(e) => setContact("email", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Subjek</Label>
                    <Input value={c.subject} onChange={(e) => setContact("subject", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Pesan</Label>
                    <Textarea
                      className="min-h-[130px]"
                      value={c.message}
                      onChange={(e) => setContact("message", e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={submitContact}
                    disabled={!c.name || !c.email || !c.message || submit.isPending}
                  >
                    <Send size={16} /> {submit.isPending ? "Mengirim..." : "Kirim Pesan"}
                  </Button>
                </TabsContent>

                {/* Join */}
                <TabsContent value="join" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Nama Lengkap</Label>
                      <Input value={j.name} onChange={(e) => setJoin("name", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input type="email" value={j.email} onChange={(e) => setJoin("email", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>NIM</Label>
                      <Input value={j.npm} onChange={(e) => setJoin("npm", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Semester</Label>
                      <Input value={j.semester} onChange={(e) => setJoin("semester", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Divisi Pilihan</Label>
                    <Select value={j.division} onValueChange={(v) => setJoin("division", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih divisi" />
                      </SelectTrigger>
                      <SelectContent>
                        {divisions.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Motivasi</Label>
                    <Textarea
                      className="min-h-[110px]"
                      value={j.motivation}
                      onChange={(e) => setJoin("motivation", e.target.value)}
                      placeholder="Ceritakan kenapa kamu ingin bergabung…"
                    />
                  </div>
                  <Button
                    onClick={submitJoin}
                    disabled={!j.name || !j.email || !j.npm || !j.motivation || submit.isPending}
                  >
                    <Send size={16} /> {submit.isPending ? "Mengirim..." : "Daftar Sekarang"}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FieldLabel } from "../components/FieldLabel";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useBlogCategories, useBlogTags } from "../../../lib/api/hooks";
import {
  useCreateBlogCategory,
  useCreateBlogTag,
  useDeleteBlogCategory,
  useDeleteBlogTag,
  useUpdateBlogCategory,
  useUpdateBlogTag,
} from "../../../lib/api/admin-hooks";
import type { BlogCategory, BlogTag, NameSlugPayload } from "../../../lib/api/types";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type Item = { id: string; name: string | null; slug: string | null };

function NameSlugManager({
  title,
  items,
  isLoading,
  onCreate,
  onUpdate,
  onDelete,
  pending,
}: {
  title: string;
  items: Item[];
  isLoading: boolean;
  onCreate: (p: NameSlugPayload) => Promise<unknown>;
  onUpdate: (id: string, p: NameSlugPayload) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [toDelete, setToDelete] = useState<Item | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setSlug("");
    setSlugTouched(false);
    setOpen(true);
  };
  const openEdit = (it: Item) => {
    setEditing(it);
    setName(it.name || "");
    setSlug(it.slug || "");
    setSlugTouched(true);
    setOpen(true);
  };
  const submit = async () => {
    const payload = { name, slug: slug || slugify(name) };
    if (editing) await onUpdate(editing.id, payload);
    else await onCreate(payload);
    setOpen(false);
  };

  const columns: Column<Item>[] = [
    { key: "name", header: "Nama", cell: (i) => i.name || "—" },
    { key: "slug", header: "Slug", cell: (i) => i.slug || "—" },
    {
      key: "actions",
      header: "",
      className: "text-right w-24",
      cell: (i) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(i)}>
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setToDelete(i)}>
            <Trash2 size={15} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-neutral-700">{title}</h2>
        <Button size="sm" variant="outline" onClick={openCreate}>
          <Plus size={15} /> Tambah
        </Button>
      </div>
      <DataTable columns={columns} rows={items} isLoading={isLoading} rowKey={(i) => i.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${title}` : `${title} Baru`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <FieldLabel required>Nama</FieldLabel>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Slug</FieldLabel>
              <Input
                value={slug}
                placeholder="otomatis dibuat dari nama"
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={submit} disabled={!name || pending}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) await onDelete(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}

export function AdminBlogTaxonomy() {
  const cats = useBlogCategories();
  const tags = useBlogTags();
  const createCat = useCreateBlogCategory();
  const updateCat = useUpdateBlogCategory();
  const deleteCat = useDeleteBlogCategory();
  const createTag = useCreateBlogTag();
  const updateTag = useUpdateBlogTag();
  const deleteTag = useDeleteBlogTag();

  return (
    <div>
      <PageHeader title="Kategori & Tag" description="Taksonomi untuk artikel blog" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NameSlugManager
          title="Kategori"
          items={(cats.data ?? []) as BlogCategory[]}
          isLoading={cats.isLoading}
          onCreate={(p) => createCat.mutateAsync(p)}
          onUpdate={(id, p) => updateCat.mutateAsync({ id, payload: p })}
          onDelete={(id) => deleteCat.mutateAsync(id)}
          pending={createCat.isPending || updateCat.isPending}
        />
        <NameSlugManager
          title="Tag"
          items={(tags.data ?? []) as BlogTag[]}
          isLoading={tags.isLoading}
          onCreate={(p) => createTag.mutateAsync(p)}
          onUpdate={(id, p) => updateTag.mutateAsync({ id, payload: p })}
          onDelete={(id) => deleteTag.mutateAsync(id)}
          pending={createTag.isPending || updateTag.isPending}
        />
      </div>
    </div>
  );
}

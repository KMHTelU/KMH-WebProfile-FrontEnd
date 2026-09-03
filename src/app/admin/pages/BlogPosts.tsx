import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useBlogPosts } from "../../../lib/api/hooks";
import { useDeleteBlogPost } from "../../../lib/api/admin-hooks";
import type { BlogPost } from "../../../lib/api/types";

const statusBadge = (s: string | null) => {
  const v = (s || "").toUpperCase();
  if (v === "PUBLISHED") return <Badge className="bg-emerald-500">Published</Badge>;
  if (v === "ARCHIVED") return <Badge variant="secondary">Archived</Badge>;
  return <Badge className="bg-amber-500">Draft</Badge>;
};

export function AdminBlogPosts() {
  const { data: posts = [], isLoading } = useBlogPosts({ limit: 500 });
  const deleteM = useDeleteBlogPost();
  const navigate = useNavigate();
  const [toDelete, setToDelete] = useState<BlogPost | null>(null);

  const columns: Column<BlogPost>[] = [
    { key: "title", header: "Judul", cell: (p) => p.title || "—" },
    { key: "category", header: "Kategori", cell: (p) => p.categoryName || "—" },
    { key: "status", header: "Status", cell: (p) => statusBadge(p.status) },
    {
      key: "publishedAt",
      header: "Terbit",
      cell: (p) => (p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("id-ID") : "—"),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-24",
      cell: (p) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/blog/${p.id}`)}>
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setToDelete(p)}>
            <Trash2 size={15} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Artikel & berita KMH"
        action={
          <Button asChild>
            <Link to="/admin/blog/new">
              <Plus size={16} /> Artikel Baru
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} rows={posts} isLoading={isLoading} rowKey={(p) => p.id} />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        loading={deleteM.isPending}
        onConfirm={async () => {
          if (toDelete) await deleteM.mutateAsync(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}

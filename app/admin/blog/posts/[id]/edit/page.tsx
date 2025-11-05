import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditBlogPostForm from "./EditBlogPostForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog/posts"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier l'Article</h1>
          <p className="text-sm text-gray-600">Modifiez les informations de l'article</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <EditBlogPostForm postId={parseInt(id)} />
      </div>
    </div>
  );
}

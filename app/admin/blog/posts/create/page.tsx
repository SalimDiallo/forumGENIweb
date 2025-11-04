import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CreateBlogPostForm from "./CreateBlogPostForm";

export default function CreateBlogPostPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Nouvel Article</h1>
          <p className="text-sm text-gray-600">Créez un nouvel article pour votre blog</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <CreateBlogPostForm />
      </div>
    </div>
  );
}

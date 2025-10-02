import { markdownOptions } from "@/utils/mardown";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) {
    return <p className="text-gray-500 italic">Aucun contenu</p>;
  }

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown {...markdownOptions}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
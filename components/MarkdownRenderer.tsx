"use client";
import { markdownOptions } from "@/utils/markdown";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Composants personnalisés pour le rendu des médias et des tableaux
const customComponents = {
  ...markdownOptions.components,
  // Rendu personnalisé pour les images
  img: ({ node, ...props }: any) => (
    <img 
      {...props} 
      className="max-w-full h-auto rounded-lg shadow-md my-4 mx-auto"
      loading="lazy"
      alt={props.alt || "Image"}
    />
  ),
  // Rendu personnalisé pour les vidéos HTML
  video: ({ node, ...props }: any) => (
    <div className="my-6">
      <video 
        {...props} 
        className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
        controls
        preload="metadata"
      />
    </div>
  ),
  // Rendu personnalisé pour les iframes (YouTube)
  iframe: ({ node, ...props }: any) => (
    <div className="my-6 youtube-embed">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          {...props}
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
          allowFullScreen
        />
      </div>
    </div>
  ),
  // Rendu pour les divs avec classe youtube-embed
  div: ({ node, className, children, ...props }: any) => {
    if (className?.includes('youtube-embed')) {
      return (
        <div className="my-6">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            {children}
          </div>
        </div>
      );
    }
    return <div className={className} {...props}>{children}</div>;
  },
  // Rendu personnalisé pour les tableaux Markdown
  table: ({node, ...props}: any) => (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-md table-auto">
        {props.children}
      </table>
    </div>
  ),
  thead: ({ node, ...props }: any) => (
    <thead className="bg-gray-100">{props.children}</thead>
  ),
  tbody: ({ node, ...props }: any) => (
    <tbody>{props.children}</tbody>
  ),
  tr: ({ node, ...props }: any) => (
    <tr className="border-b last:border-b-0">{props.children}</tr>
  ),
  th: ({ node, ...props }: any) => (
    <th className="px-4 py-2 font-semibold bg-gray-50 text-gray-700 border border-gray-200 text-left">{props.children}</th>
  ),
  td: ({ node, ...props }: any) => (
    <td className="px-4 py-2 border border-gray-200">{props.children}</td>
  ),
};

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) {
    return <p className="text-gray-500 italic">Aucun contenu</p>;
  }

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <style jsx>{`
        .youtube-embed iframe {
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        video {
          max-width: 100%;
          height: auto;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid #e5e7eb;
        }
        th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
      `}</style>
      <ReactMarkdown 
        components={customComponents}
        remarkPlugins={markdownOptions.remarkPlugins}
        rehypePlugins={[rehypeRaw, ...(markdownOptions.rehypePlugins || [])]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
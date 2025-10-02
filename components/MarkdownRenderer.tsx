"use client";
import { markdownOptions } from "@/utils/mardown";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Composants personnalisés pour le rendu des médias
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
  }
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
      `}</style>
      <ReactMarkdown 
        components={customComponents}
        remarkPlugins={markdownOptions.remarkPlugins}
        rehypePlugins={markdownOptions.rehypePlugins}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
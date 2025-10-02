import React from 'react';

/**
 * Composants personnalisés pour react-markdown, enrichis pour la gestion des médias et une meilleure expérience.
 * Inspiré de MarkdownRenderer.tsx
 */
export const markdownComponents = {
  // Titres
  h1: ({ node, ...props }: any) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
  h3: ({ node, ...props }: any) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
  // Paragraphe
  p: ({ node, ...props }: any) => <p className="mb-4 leading-relaxed" {...props} />,
  // Listes
  ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
  ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
  li: ({ node, ...props }: any) => <li className="ml-4" {...props} />,
  // Citation
  blockquote: ({ node, ...props }: any) => (
    <blockquote className="border-l-4 border-emerald-500 pl-4 italic my-4" {...props} />
  ),
  // Code
  code: ({ node, inline, className, children, ...props }: any) => {
    if (inline) {
      return (
        <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }
    return (
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  },
  // Tableaux
  table: ({ node, ...props }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200" {...props} />
    </div>
  ),
  th: ({ node, ...props }: any) => (
    <th className="px-4 py-2 bg-gray-50 text-left text-sm font-semibold text-gray-900" {...props} />
  ),
  td: ({ node, ...props }: any) => (
    <td className="px-4 py-2 border-t border-gray-200 text-sm" {...props} />
  ),
  // Liens
  a: ({ node, ...props }: any) => (
    <a className="text-emerald-600 hover:text-emerald-700 underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  // Gras et italique
  strong: ({ node, ...props }: any) => <strong className="font-semibold" {...props} />,
  em: ({ node, ...props }: any) => <em className="italic" {...props} />,
  // Images
  img: ({ node, ...props }: any) => (
    <img
      {...props}
      className="max-w-full h-auto rounded-lg shadow-md my-4 mx-auto"
      loading="lazy"
      alt={props.alt || "Image"}
    />
  ),
  // Vidéos HTML5
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
  // Iframe (YouTube, etc.)
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
  // Div spéciale pour l'intégration YouTube
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
};

/**
 * Options pour react-markdown
 */
export const markdownOptions = {
  components: markdownComponents,
  // Les plugins sont à ajouter dans le composant d'appel si besoin
remarkPlugins: [],
rehypePlugins: [],
};
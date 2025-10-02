import React from 'react';

/**
 * Configuration pour react-markdown
 */
export const markdownComponents = {
  // Personnalisation des composants si nécessaire
  h1: ({ node, ...props }: any) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
  h3: ({ node, ...props }: any) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
  p: ({ node, ...props }: any) => <p className="mb-4 leading-relaxed" {...props} />,
  ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
  ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
  li: ({ node, ...props }: any) => <li className="ml-4" {...props} />,
  blockquote: ({ node, ...props }: any) => (
    <blockquote className="border-l-4 border-emerald-500 pl-4 italic my-4" {...props} />
  ),
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
  a: ({ node, ...props }: any) => (
    <a className="text-emerald-600 hover:text-emerald-700 underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  strong: ({ node, ...props }: any) => <strong className="font-semibold" {...props} />,
  em: ({ node, ...props }: any) => <em className="italic" {...props} />,
};

/**
 * Options pour react-markdown
 */
export const markdownOptions = {
  components: markdownComponents,
};
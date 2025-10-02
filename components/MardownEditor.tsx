"use client";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Edit3, 
  Eye, 
  HelpCircle, 
  Bold, 
  Italic, 
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Image,
  Video,
  Youtube
} from "lucide-react";
import { markdownOptions } from "@/utils/mardown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  rows?: number;
  required?: boolean;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Écrivez votre contenu en Markdown...",
  error,
  label = "Éditeur Markdown",
  rows = 8,
  required = false,
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Fonction pour insérer du texte à la position du curseur
  const insertText = (before: string, after: string = "", defaultText: string = "texte") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || defaultText;

    const newValue = 
      value.substring(0, start) + 
      before + textToInsert + after + 
      value.substring(end);

    onChange(newValue);

    // Remettre le focus et positionner le curseur
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Fonctions de formatage
  const formatBold = () => insertText("**", "**", "texte gras");
  const formatItalic = () => insertText("*", "*", "texte italique");
  const formatUnderline = () => insertText("<u>", "</u>", "texte souligné");
  const formatCode = () => insertText("`", "`", "code");
  
  const formatLink = () => {
    const url = prompt("Entrez l'URL du lien:");
    if (url) {
      insertText("[", `](${url})`, "lien");
    }
  };

  const formatImage = () => {
    const url = prompt("Entrez l'URL de l'image:");
    const alt = prompt("Entrez le texte alternatif (description de l'image):") || "";
    if (url) {
      insertText("![", `](${url})`, alt);
    }
  };

  const formatVideo = () => {
    const url = prompt("Entrez l'URL de la vidéo:");
    if (url) {
      // Pour les vidéos, on utilise une balise HTML personnalisée
      const videoHtml = `\n<video controls width="100%">\n  <source src="${url}" type="video/mp4">\n  Votre navigateur ne supporte pas la lecture de vidéos.\n</video>\n`;
      
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const newValue = value.substring(0, start) + videoHtml + value.substring(start);
      onChange(newValue);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + videoHtml.length, start + videoHtml.length);
      }, 0);
    }
  };

  const formatYouTube = () => {
    const videoId = prompt("Entrez l'ID de la vidéo YouTube (ex: dQw4w9WgXcQ):");
    if (videoId) {
      const youtubeEmbed = `\n<div class="youtube-embed">\n  <iframe \n    width="100%" \n    height="400" \n    src="https://www.youtube.com/embed/${videoId}" \n    frameborder="0" \n    allowfullscreen>\n  </iframe>\n</div>\n`;
      
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const newValue = value.substring(0, start) + youtubeEmbed + value.substring(start);
      onChange(newValue);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + youtubeEmbed.length, start + youtubeEmbed.length);
      }, 0);
    }
  };

  const formatQuote = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newValue = value.substring(0, start) + "> " + value.substring(start);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2);
    }, 0);
  };

  const formatHeading = (level: number) => {
    const hashes = "#".repeat(level);
    insertText(hashes + " ", "", `Titre ${level}`);
  };

  const formatList = (ordered: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const prefix = ordered ? "1. " : "- ";
    const newValue = value.substring(0, start) + prefix + value.substring(start);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const formatHorizontalRule = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newValue = value.substring(0, start) + "\n---\n" + value.substring(start);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 5, start + 5);
    }, 0);
  };

  const markdownHelp = [
    { syntax: "# Titre", description: "Titre principal" },
    { syntax: "## Sous-titre", description: "Sous-titre" },
    { syntax: "**gras**", description: "Texte en gras" },
    { syntax: "*italique*", description: "Texte en italique" },
    { syntax: "`code`", description: "Code en ligne" },
    { syntax: "- élément", description: "Liste à puces" },
    { syntax: "1. élément", description: "Liste numérotée" },
    { syntax: "[lien](url)", description: "Lien hypertexte" },
    { syntax: "![alt](url)", description: "Image" },
    { syntax: "> citation", description: "Bloc de citation" },
    { syntax: "---", description: "Ligne horizontale" },
  ];

  const toolbarButtons = [
    { icon: Bold, label: "Gras", onClick: formatBold, shortcut: "Ctrl+B" },
    { icon: Italic, label: "Italique", onClick: formatItalic, shortcut: "Ctrl+I" },
    { icon: Underline, label: "Souligné", onClick: formatUnderline, shortcut: "Ctrl+U" },
    { icon: Code, label: "Code", onClick: formatCode },
    { icon: Link, label: "Lien", onClick: formatLink, shortcut: "Ctrl+K" },
    { icon: Image, label: "Image", onClick: formatImage },
    { icon: Video, label: "Vidéo", onClick: formatVideo },
    { icon: Youtube, label: "YouTube", onClick: formatYouTube },
    { icon: Heading1, label: "Titre 1", onClick: () => formatHeading(1) },
    { icon: Heading2, label: "Titre 2", onClick: () => formatHeading(2) },
    { icon: Heading3, label: "Titre 3", onClick: () => formatHeading(3) },
    { icon: List, label: "Liste à puces", onClick: () => formatList(false) },
    { icon: ListOrdered, label: "Liste numérotée", onClick: () => formatList(true) },
    { icon: Quote, label: "Citation", onClick: formatQuote },
    { icon: Minus, label: "Ligne horizontale", onClick: formatHorizontalRule },
  ];

  // Gestion des raccourcis clavier
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          formatBold();
          break;
        case 'i':
          e.preventDefault();
          formatItalic();
          break;
        case 'u':
          e.preventDefault();
          formatUnderline();
          break;
        case 'k':
          e.preventDefault();
          formatLink();
          break;
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-900 text-sm transition-colors"
            title="Aide Markdown"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
              !isPreview 
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Éditer
          </button>
          
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
              isPreview 
                ? "bg-blue-100 text-blue-700 border border-blue-200" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Eye className="w-4 h-4" />
            Aperçu
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2">Syntaxe Markdown supportée :</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {markdownHelp.map((item, index) => (
              <div key={index} className="flex flex-col">
                <code className="bg-white px-2 py-1 rounded border font-mono">
                  {item.syntax}
                </code>
                <span className="text-gray-600 mt-1">{item.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isPreview ? (
        <div className="space-y-2">
          {/* Barre d'outils */}
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-300 rounded-t-lg">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={button.onClick}
                className="flex items-center gap-1 px-2 py-1.5 text-gray-700 hover:bg-white hover:text-emerald-600 rounded text-sm transition-colors border border-transparent hover:border-gray-300"
                title={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ''}`}
              >
                <button.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{button.label}</span>
              </button>
            ))}
          </div>

          {/* Zone de texte */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleTextAreaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={rows}
            className="w-full border border-gray-300 border-t-0 rounded-b-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm resize-vertical bg-white"
          />
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Support complet : texte, images, vidéos, YouTube, code, liens</span>
              <span className="hidden md:inline">Raccourcis: Ctrl+B (gras), Ctrl+I (italique), Ctrl+U (souligné)</span>
            </div>
            <span>{value.length} caractères</span>
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg bg-white min-h-[200px] overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Aperçu</span>
          </div>
          <div className="p-4 prose prose-sm max-w-none min-h-[150px]">
            {value ? (
              <ReactMarkdown {...markdownOptions}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">Aucun contenu à prévisualiser</p>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
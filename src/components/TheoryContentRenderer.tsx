import React from 'react';
import {
  Lightbulb,
  AlertTriangle,
  BookmarkCheck,
  Sparkles,
  ChevronRight,
  Calculator,
} from 'lucide-react';

interface TheoryContentRendererProps {
  content: string;
  isKg: boolean;
}

/**
 * Cleanly format math notation like $\mathbb{N}$, $\dots$, $\ge$, etc.
 * to crisp readable unicode text.
 */
function formatMathNotation(text: string): string {
  return text
    .replace(/\$\\mathbb\{N\}\$/g, 'ℕ')
    .replace(/\$\\mathbb\{Z\}\$/g, 'ℤ')
    .replace(/\$\\mathbb\{Q\}\$/g, 'ℚ')
    .replace(/\$\\mathbb\{R\}\$/g, 'ℝ')
    .replace(/\$\\dots\$/g, '...')
    .replace(/\\dots/g, '...')
    .replace(/\$\\le\$/g, '≤')
    .replace(/\$\\ge\$/g, '≥')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\ne/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\cdot/g, '·')
    .replace(/\\pm/g, '±')
    .replace(/\\in/g, '∈')
    .replace(/\\cup/g, '∪')
    .replace(/\\cap/g, '∩')
    .replace(/\\varnothing/g, '∅')
    .replace(/\\iff/g, '⟺')
    .replace(/\\implies/g, '⟹')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\sqrt/g, '√')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\pi/g, 'π')
    .replace(/\\overline\{([^}]+)\}/g, '$1̅')
    .replace(/\$([^\$]+)\$/g, '$1');
}

/**
 * Format inline bold `**text**` and code `` `code` ``
 */
function renderInlineFormatted(text: string) {
  const cleaned = formatMathNotation(text);
  const parts = cleaned.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="text-white font-extrabold tracking-wide">
          {boldText}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeText = part.slice(1, -1);
      return (
        <code
          key={index}
          className="font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-700/50 px-1.5 py-0.5 rounded text-xs mx-0.5"
        >
          {codeText}
        </code>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export const TheoryContentRenderer: React.FC<TheoryContentRendererProps> = ({
  content,
  isKg,
}) => {
  if (!content) {
    return (
      <div className="p-6 text-center text-emerald-200/60 text-sm">
        {isKg ? 'Теориялык мазмун жакында кошулат.' : 'Теоретический материал готовится к публикации.'}
      </div>
    );
  }

  // Split content into major sections by `---` or double line breaks before headers
  const rawSections = content.split(/\n\s*---\s*\n/);

  return (
    <div className="space-y-6">
      {rawSections.map((rawSection, secIdx) => {
        const lines = rawSection.trim().split('\n').filter((l) => l.trim().length > 0);
        if (lines.length === 0) return null;

        // Check if first line is a header: ### or ##
        let headerText = '';
        let headerLevel = 3;
        let contentLines = lines;

        const firstLine = lines[0].trim();
        if (firstLine.startsWith('### ')) {
          headerText = firstLine.replace(/^###\s+/, '');
          headerLevel = 3;
          contentLines = lines.slice(1);
        } else if (firstLine.startsWith('## ')) {
          headerText = firstLine.replace(/^##\s+/, '');
          headerLevel = 2;
          contentLines = lines.slice(1);
        }

        return (
          <div
            key={secIdx}
            className="rounded-2xl sm:rounded-3xl bg-[#041a14] border border-emerald-700/60 p-5 sm:p-7 shadow-xl space-y-4 transition-all"
          >
            {headerText && (
              <div className="pb-3 border-b border-emerald-800/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {secIdx + 1}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                    {renderInlineFormatted(headerText)}
                  </h3>
                </div>
              </div>
            )}

            <div className="space-y-3.5 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {contentLines.map((line, lineIdx) => {
                const trimmed = line.trim();

                // 1. Table row detection (| ... |)
                if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                  if (trimmed.includes('---')) return null; // divider
                  const cells = trimmed
                    .split('|')
                    .map((c) => c.trim())
                    .filter(Boolean);
                  return (
                    <div
                      key={lineIdx}
                      className="grid gap-2 p-2.5 rounded-xl bg-[#02100c] border border-emerald-800/60 text-xs font-mono"
                      style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}
                    >
                      {cells.map((cell, cIdx) => (
                        <div
                          key={cIdx}
                          className="px-2 py-1 bg-black/40 rounded border border-emerald-900/60 text-center text-emerald-200"
                        >
                          {renderInlineFormatted(cell)}
                        </div>
                      ))}
                    </div>
                  );
                }

                // 2. Alert / Trap box (💡 Важно / ЖРТнын негизги тузагы / ⚠️ Внимание)
                const isWarningOrTrap =
                  trimmed.includes('тузак') ||
                  trimmed.includes('ловушка') ||
                  trimmed.includes('Внимание') ||
                  trimmed.includes('Эскертүү') ||
                  trimmed.startsWith('💡') ||
                  trimmed.startsWith('⚠️');

                if (isWarningOrTrap) {
                  return (
                    <div
                      key={lineIdx}
                      className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-inner"
                    >
                      <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1 min-w-0 flex-1 leading-relaxed">
                        {renderInlineFormatted(trimmed.replace(/^(\*|\-|\•)\s+/, ''))}
                      </div>
                    </div>
                  );
                }

                // 3. Example box (Пример / Мисал / 📌)
                const isExample =
                  trimmed.startsWith('* **Пример') ||
                  trimmed.startsWith('* **Мисал') ||
                  trimmed.startsWith('📌') ||
                  trimmed.includes('Мисал:') ||
                  trimmed.includes('Пример:');

                if (isExample) {
                  return (
                    <div
                      key={lineIdx}
                      className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#02120e] border border-emerald-500/40 text-emerald-100 text-xs sm:text-sm flex items-start gap-3"
                    >
                      <BookmarkCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-1 min-w-0 flex-1 leading-relaxed">
                        {renderInlineFormatted(trimmed.replace(/^(\*|\-|\•)\s+/, ''))}
                      </div>
                    </div>
                  );
                }

                // 4. Formula block
                const isFormula =
                  trimmed.startsWith('$$') ||
                  trimmed.startsWith('Формула:') ||
                  trimmed.includes('Формула:') ||
                  trimmed.includes('ФСУ:');

                if (isFormula) {
                  return (
                    <div
                      key={lineIdx}
                      className="p-3 sm:p-4 rounded-xl bg-black/50 border border-emerald-600/50 text-center font-mono text-emerald-300 font-bold text-xs sm:text-sm tracking-wide shadow-inner"
                    >
                      {renderInlineFormatted(trimmed.replace(/^\$\$/g, '').replace(/\$\$$/g, ''))}
                    </div>
                  );
                }

                // 5. Bullet list item (* or • or -)
                if (trimmed.startsWith('* ') || trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
                  const itemContent = trimmed.replace(/^(\*|•|-)\s+/, '');
                  return (
                    <div key={lineIdx} className="flex items-start gap-2.5 pl-1 sm:pl-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                      <div className="min-w-0 flex-1 leading-relaxed">
                        {renderInlineFormatted(itemContent)}
                      </div>
                    </div>
                  );
                }

                // 6. Subheader within section
                if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
                  const subheadText = trimmed.replace(/^#+\s+/, '');
                  return (
                    <h4
                      key={lineIdx}
                      className="text-xs sm:text-sm font-extrabold text-emerald-300 uppercase tracking-wider pt-2 flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{renderInlineFormatted(subheadText)}</span>
                    </h4>
                  );
                }

                // 7. Regular paragraph
                return (
                  <p key={lineIdx} className="leading-relaxed">
                    {renderInlineFormatted(trimmed)}
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

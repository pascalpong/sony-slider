"use client";

interface ContentControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

/**
 * ContentControls component provides navigation buttons
 * for moving between content items.
 */
export default function ContentControls({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: ContentControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`
          px-6 py-3 rounded-full font-semibold text-white transition-all
          ${canGoPrevious
            ? "bg-gray-800 hover:bg-gray-900 active:scale-95"
            : "bg-gray-300 cursor-not-allowed"
          }
        `}
        aria-label="Previous content"
      >
        ← Previous
      </button>
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`
          px-6 py-3 rounded-full font-semibold text-white transition-all
          ${canGoNext
            ? "bg-gray-800 hover:bg-gray-900 active:scale-95"
            : "bg-gray-300 cursor-not-allowed"
          }
        `}
        aria-label="Next content"
      >
        Next →
      </button>
    </div>
  );
}


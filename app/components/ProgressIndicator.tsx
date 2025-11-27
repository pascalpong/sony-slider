"use client";

interface ProgressIndicatorProps {
  currentIndex: number;
  totalItems: number;
  isUnlocked: boolean;
}

/**
 * ProgressIndicator component shows the user's progress through content.
 * Displays "Item X of Y" with a lock/unlock status indicator.
 */
export default function ProgressIndicator({
  currentIndex,
  totalItems,
  isUnlocked,
}: ProgressIndicatorProps) {
  const currentItemNumber = currentIndex + 1;

  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
        <span className="text-sm font-medium text-gray-700">
          Item {currentItemNumber} of {totalItems}
        </span>
        <span className="text-xs">
          {isUnlocked ? (
            <span className="text-green-600 font-semibold">✓ Unlocked</span>
          ) : (
            <span className="text-orange-600 font-semibold">🔒 Locked</span>
          )}
        </span>
      </div>
    </div>
  );
}


"use client";

import { useState, FormEvent } from "react";

interface EmailGateModalProps {
  isOpen: boolean;
  onSubmit: (email: string) => void;
}

/**
 * EmailGateModal component displays a modal overlay that blocks access
 * to more content after the user has viewed 10 items.
 * 
 * How it works:
 * - Shows when isOpen is true
 * - Validates email input (basic HTML5 validation + regex)
 * - Calls onSubmit with the email when form is submitted
 * - Prevents default form submission and validates before calling onSubmit
 */
export default function EmailGateModal({ isOpen, onSubmit }: EmailGateModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const validateEmail = (emailValue: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Submit the email (will be logged to console or stored in state)
    onSubmit(trimmedEmail);
    setEmail(""); // Clear the input after submission
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Unlock More Content
          </h2>
          <p className="text-gray-600">
            You&apos;ve viewed 10 pieces of content. Enter your email to continue browsing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // Clear error when user types
              }}
              placeholder="your.email@example.com"
              className={`
                w-full px-4 py-3 rounded-lg border-2 transition-colors
                ${error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-gray-800 focus:ring-gray-800"
                }
                focus:outline-none focus:ring-2
              `}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 active:scale-95 transition-all"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}


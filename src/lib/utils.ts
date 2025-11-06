import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get initials from a name or email
 * 
 * @param name - Name or email string
 * @param maxLength - Maximum length of initials (default: 2)
 * @returns Initials string (e.g., "John Doe" -> "JD", "john@example.com" -> "JO")
 * 
 * @example
 * ```tsx
 * getInitials("John Doe") // "JD"
 * getInitials("john@example.com") // "JO"
 * getInitials("User") // "U"
 * ```
 */
export function getInitials(name: string, maxLength: number = 2): string {
  if (!name || name.trim() === '') {
    return 'U'
  }

  // If it's an email, extract the part before @
  if (name.includes('@')) {
    const emailPart = name.split('@')[0]
    // Get first letter of each word (if multiple words) or first two letters
    const parts = emailPart.split(/[.\-_]/).filter(Boolean)
    if (parts.length >= 2) {
      return parts
        .slice(0, maxLength)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('')
        .slice(0, maxLength)
    }
    // If single word, take first two characters
    return emailPart.slice(0, maxLength).toUpperCase()
  }

  // For regular names, split by spaces and get first letter of each word
  const parts = name.trim().split(/\s+/).filter(Boolean)
  
  if (parts.length === 1) {
    // Single word: take first character(s)
    return parts[0].slice(0, maxLength).toUpperCase()
  }

  // Multiple words: take first letter of each word
  return parts
    .slice(0, maxLength)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
    .slice(0, maxLength)
}

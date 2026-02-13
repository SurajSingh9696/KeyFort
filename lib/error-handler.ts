import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Centralized error handler for API routes
 * Logs detailed errors in development, returns user-friendly messages to clients
 */

// Development mode check
const isDevelopment = process.env.NODE_ENV === "development";

// User-friendly error messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: "You must be logged in to perform this action",
  FORBIDDEN: "You don't have permission to access this resource",
  NOT_FOUND: "The requested resource was not found",
  VALIDATION_ERROR: "Invalid input provided",
  SERVER_ERROR: "Something went wrong on our end. Please try again later",
  DATABASE_ERROR: "Unable to process your request. Please try again",
  NETWORK_ERROR: "Network error occurred. Please check your connection",
} as const;

interface ErrorContext {
  operation?: string;
  userId?: string;
  resource?: string;
}

/**
 * Sanitize error message to remove sensitive information
 */
function sanitizeErrorMessage(message: string): string {
  // Remove file paths
  message = message.replace(/[A-Z]:\\[^\s]+/gi, "[path]");
  message = message.replace(/\/[^\s]+/gi, "[path]");
  
  // Remove MongoDB ObjectId patterns
  message = message.replace(/ObjectId\([^)]+\)/gi, "ObjectId([id])");
  
  // Remove email addresses
  message = message.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[email]");
  
  return message;
}

/**
 * Log error details (only in development or to external logging service)
 */
function logError(error: unknown, context?: ErrorContext): void {
  if (isDevelopment) {
    console.error("=== API Error ===");
    if (context?.operation) console.error("Operation:", context.operation);
    if (context?.userId) console.error("User ID:", context.userId);
    if (context?.resource) console.error("Resource:", context.resource);
    console.error("Error:", error);
    console.error("=================");
  } else {
    // In production, log only sanitized info
    // In a real app, send to external logging service (Sentry, LogRocket, etc.)
    const errorMessage = error instanceof Error ? sanitizeErrorMessage(error.message) : "Unknown error";
    console.error("[API Error]", {
      operation: context?.operation,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Handle Zod validation errors
 */
function handleZodError(error: z.ZodError): NextResponse {
  if (isDevelopment) {
    // In development, show detailed validation errors
    return NextResponse.json(
      {
        message: ERROR_MESSAGES.VALIDATION_ERROR,
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }
  
  // In production, show generic validation error
  return NextResponse.json(
    { message: ERROR_MESSAGES.VALIDATION_ERROR },
    { status: 400 }
  );
}

/**
 * Handle MongoDB errors
 */
function handleDatabaseError(error: Error): NextResponse {
  const message = error.message.toLowerCase();
  
  // Duplicate key error
  if (message.includes("duplicate key") || message.includes("e11000")) {
    return NextResponse.json(
      { message: "This item already exists" },
      { status: 409 }
    );
  }
  
  // Connection error
  if (message.includes("connection") || message.includes("timeout")) {
    return NextResponse.json(
      { message: ERROR_MESSAGES.NETWORK_ERROR },
      { status: 503 }
    );
  }
  
  // Generic database error
  return NextResponse.json(
    { message: ERROR_MESSAGES.DATABASE_ERROR },
    { status: 500 }
  );
}

/**
 * Main error handler function
 * Returns appropriate NextResponse based on error type
 */
export function handleApiError(
  error: unknown,
  context?: ErrorContext
): NextResponse {
  // Log error with context
  logError(error, context);
  
  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    return handleZodError(error);
  }
  
  // Handle MongoDB/Database errors
  if (error instanceof Error) {
    const errorName = error.constructor.name;
    const errorMessage = error.message.toLowerCase();
    
    if (
      errorName.includes("Mongo") ||
      errorMessage.includes("mongodb") ||
      errorMessage.includes("database")
    ) {
      return handleDatabaseError(error);
    }
    
    // Handle network/fetch errors
    if (
      errorMessage.includes("fetch") ||
      errorMessage.includes("network") ||
      errorName === "TypeError"
    ) {
      return NextResponse.json(
        { message: ERROR_MESSAGES.NETWORK_ERROR },
        { status: 503 }
      );
    }
  }
  
  // Generic server error
  return NextResponse.json(
    { message: ERROR_MESSAGES.SERVER_ERROR },
    { status: 500 }
  );
}

/**
 * Create standardized error responses
 */
export const apiError = {
  unauthorized: () =>
    NextResponse.json({ message: ERROR_MESSAGES.UNAUTHORIZED }, { status: 401 }),
  
  forbidden: () =>
    NextResponse.json({ message: ERROR_MESSAGES.FORBIDDEN }, { status: 403 }),
  
  notFound: (resource?: string) =>
    NextResponse.json(
      { message: resource ? `${resource} not found` : ERROR_MESSAGES.NOT_FOUND },
      { status: 404 }
    ),
  
  badRequest: (message: string) =>
    NextResponse.json({ message }, { status: 400 }),
  
  conflict: (message: string) =>
    NextResponse.json({ message }, { status: 409 }),
};

/**
 * Try-catch wrapper for API route handlers
 */
export async function handleApiRoute<T>(
  handler: () => Promise<T>,
  context?: ErrorContext
): Promise<T | NextResponse> {
  try {
    return await handler();
  } catch (error) {
    return handleApiError(error, context);
  }
}

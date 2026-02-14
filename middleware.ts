import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow the request to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

// Only protect dashboard and specific API routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/vault/:path*",
    "/api/categories/:path*",
    "/api/settings/:path*",
    "/api/activity/:path*",
  ],
};

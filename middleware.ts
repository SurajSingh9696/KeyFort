export { default } from "next-auth/middleware";

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

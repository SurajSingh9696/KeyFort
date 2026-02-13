export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/api/vault/:path*", "/api/categories/:path*"],
};

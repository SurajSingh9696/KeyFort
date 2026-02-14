import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/vault/:path*",
    "/api/categories/:path*",
    "/api/settings/:path*",
    "/api/activity/:path*",
  ],
};

export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/skills/:path*",
    "/projects/:path*",
    "/activity/:path*",
    "/settings/:path*",
    "/api/skills/:path*",
    "/api/projects/:path*",
    "/api/activity/:path*",
    "/api/streak/:path*",
    "/api/github/:path*",
    "/api/settings/:path*",
  ],
};

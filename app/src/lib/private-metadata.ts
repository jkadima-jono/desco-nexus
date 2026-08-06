export const PRIVATE_ROUTE_ROBOTS = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true },
} as const;

export const PRIVATE_ROBOT_PATHS = [
  "/account/", "/admin/", "/api/", "/auth/", "/deals/", "/login", "/mandates/",
  "/match/", "/messages/", "/onboarding/", "/portfolio/", "/saved/", "/signup",
  "/sponsor/", "/submit-project/",
] as const;

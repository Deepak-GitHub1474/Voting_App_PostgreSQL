export const ROUTES = {
  overview: { to: "/", label: "Overview" },
  ballot: { to: "/ballot", label: "Ballot" },
  admin: { to: "/admin", label: "Admin" },
  login: { to: "/login", label: "Login" },
  register: { to: "/register", label: "Register" },
};

export const homeFor = (user) => (user?.isAdmin ? ROUTES.admin : ROUTES.ballot);

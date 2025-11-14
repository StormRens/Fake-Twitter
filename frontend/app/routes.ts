import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";


export default [

    // Public home page
    index("./routes/home.tsx"),

    // All AUTH pages share AuthLayout
    layout("./layout/AuthLayout.tsx", [
        route("/login", "./routes/login.tsx"),
        route("/register", "./routes/register.tsx")
    ]),

    // Main app pages share AppLayout
  layout("./layout/AppLayout.tsx", [
    // "/" => dashboard
    route("/dashboard","./routes/dashboard.tsx"),
    route("/profile","./routes/profile.tsx"),
    //route("/following", "./routes/following.tsx"),
    //route("/settings", "./routes/settings.tsx")
  ]),
    
] satisfies RouteConfig;

import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";


export default [

    // Public home page
    index("./routes/home.tsx"),

    // All AUTH pages share AuthLayout
    layout("./layout/AuthLayout.tsx", [
        route("/login", "./routes/login.tsx"),
        route("/register", "./routes/register.tsx")
    ]),
    
] satisfies RouteConfig;

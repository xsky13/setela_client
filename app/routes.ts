import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/cuenta", "routes/cuenta.tsx"),
    route("/cursos", "routes/courses/index.tsx"),
] satisfies RouteConfig;

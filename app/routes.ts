import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/cuenta", "routes/cuenta.tsx"),
    ...prefix("cursos", [
        index("routes/courses/index.tsx"),
        route(":id", "routes/courses/course.tsx"),
    ]),
] satisfies RouteConfig;

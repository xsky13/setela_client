import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/cuenta", "routes/cuenta.tsx"),
    ...prefix("cursos", [
        index("routes/courses/index.tsx"),
        layout("routes/courses/course/layout.tsx", [
            route(":id", "routes/courses/course/course.tsx"),
            route(":id/participantes", "routes/courses/course/participantes.tsx"),
            route(":id/m/crear", "routes/courses/course/module/create/index.tsx"),

            route(":id/m/:moduleId/editar", "routes/courses/course/module/edit.tsx"),
            route(":id/m/:moduleId/recursos/agregar", "routes/courses/course/module/addResources.tsx"),
        ]),
    ]),
] satisfies RouteConfig;

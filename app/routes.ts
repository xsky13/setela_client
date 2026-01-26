import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/cuenta", "routes/cuenta.tsx"),
    ...prefix("cursos", [
        index("routes/courses/index.tsx"),
        layout("routes/courses/course/layout.tsx", [
            route(":id", "routes/courses/course/course.tsx"),
            route(":id/participantes", "routes/courses/course/participantes.tsx"),


            route(":id/m/crear", "routes/modules/create.tsx"),
            layout("routes/modules/layout.tsx", [
                route(":id/m/:moduleId", "routes/modules/module.tsx"),
                route(":id/m/:moduleId/editar", "routes/modules/edit.tsx"),
                route(":id/m/:moduleId/recursos/modificar", "routes/modules/editResources.tsx"),
            ]),

            layout("routes/assignments/layout.tsx", [
                route(":id/a/:assignmentId", "routes/assignments/assignment.tsx"),
            ]),
        ]),
    ]),
] satisfies RouteConfig;

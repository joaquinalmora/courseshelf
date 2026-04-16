import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("courses/:courseId", "routes/courses.$courseId.tsx"),
] satisfies RouteConfig;

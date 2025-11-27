import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
	route("/contacts/:contactId", "contact.tsx"),
] satisfies RouteConfig;

import { redirect } from "react-router";
import { deleteContact } from "../data";
import type { Route } from "./+types/_app.contacts.$contactId_.destroy";

export async function action({ params }: Route.ActionArgs) {
	await deleteContact(params.contactId);
	return redirect(`/`);
}

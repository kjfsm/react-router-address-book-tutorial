import { useEffect, useState } from "react";
import {
	Form,
	Link,
	NavLink,
	Outlet,
	useNavigation,
	useSubmit,
} from "react-router";
import { getContacts } from "../data";
import type { Route } from "./+types/_app";

export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url);
	const q = url.searchParams.get("q");
	const contacts = await getContacts(q);
	return { contacts, q };
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
	const { contacts, q } = loaderData;
	const navigation = useNavigation();
	const submit = useSubmit();
	// 検索中かどうかを判定する
	// 遷移中、 navigation.location に値が入る。
	// 遷移中かつqを含むときを検索中とみなし、スピナーを表示する
	const searching =
		navigation.location &&
		new URLSearchParams(navigation.location.search).has("q");
	const [query, setQuery] = useState(q || "");

	useEffect(() => {
		setQuery(q || "");
	}, [q]);

	return (
		<>
			<div id="sidebar">
				<h1>
					<Link to="about">React Router Contacts</Link>
				</h1>
				<div>
					<Form
						id="search-form"
						// 変更されるたびにフォームを送信してクエリを更新する
						onChange={(event) => {
							const isFirstSearch = q === null;
							submit(event.currentTarget, {
								replace: !isFirstSearch,
							});
						}}
						role="search"
					>
						<input
							aria-label="Search contacts"
							className={searching ? "loading" : ""}
							onChange={(event) => setQuery(event.target.value)}
							value={query}
							id="q"
							name="q"
							placeholder="Search"
							type="search"
						/>
						<div aria-hidden hidden={!searching} id="search-spinner" />
					</Form>
					<Form method="post">
						<button type="submit">New</button>
					</Form>
				</div>
				<nav>
					{contacts.length ? (
						<ul>
							{contacts.map((contact) => (
								<li key={contact.id}>
									<NavLink
										className={({ isActive, isPending }) =>
											isActive ? "active" : isPending ? "pending" : ""
										}
										to={`contacts/${contact.id}`}
									>
										{contact.first || contact.last ? (
											<>
												{contact.first} {contact.last}
											</>
										) : (
											<i>No Name</i>
										)}
										{contact.favorite ? <span>★</span> : null}
									</NavLink>
								</li>
							))}
						</ul>
					) : (
						<p>
							<i>No contacts</i>
						</p>
					)}
				</nav>
			</div>
			<div
				className={
					navigation.state === "loading" && !searching ? "loading" : ""
				}
				id="detail"
			>
				<Outlet />
			</div>
		</>
	);
}

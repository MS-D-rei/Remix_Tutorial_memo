import { useEffect } from "react";
import type { LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Meta,
  Links,
  Form,
  NavLink,
  Outlet,
  ScrollRestoration,
  Scripts,
  LiveReload,
  useLoaderData,
  useNavigation,
  // useSubmit,
} from "@remix-run/react";

import appStylesHref from "./app.css";
import { createEmptyContact, getContacts } from "./data";

// Every route can export a links function.
// They will be collected and rendered into the <Links /> component.
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

// execute this function when the user click Form button
export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

// This is "Root Route". Typically contains the global layout
export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  // const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  // console.log("navigation: ", navigation);
  // navigation
  // when idle
  // {
  //   formAction: undefined
  //   formData: undefined
  //   formEncType: undefined
  //   formMethod: undefined
  //   json: undefined
  //   location: undefined
  //   state: "idle"
  //   text: undefined
  // }
  // when loading
  // {
  //   formAction: "/"
  //   formData: FormData {}
  //   formEncType: "application/x-www-form-urlencoded"
  //   formMethod: "GET"
  //   json: undefined
  //   location: {pathname: '/', search: '?q=do', hash: '', state: null, key: 'slm0y4a7'}
  //   state: "loading"
  //   text: undefined}
  // }

  // This is for controlling state on back/forward button clicks
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form
              id="search-form"
              role="search"
              // when changes happen in the search field, submit the form automatically
              // I think this is not good because this increases the number of requests
              // onChange={(event) => {
              //  const isFirstSearch = q === null;
              //  submit(event.currentTarget, { replace: !isFirstSearch });
              // }}
            >
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={q || ""}
                placeholder="Search"
                aria-label="Search contacts"
                className={searching ? "searching" : ""}
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
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
                      to={`contacts/${contact.id}`}
                      className={({ isActive, isPending }) =>
                        isActive ? "active" : isPending ? "pending" : ""
                      }
                    >
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No name</i>
                      )}{" "}
                      {contact.favorite ? <span>*</span> : null}
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
          id="detail"
          className={navigation.state === "loading" && !searching ? "loading" : ""}
        >
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

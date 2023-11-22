import type { LinksFunction } from "@remix-run/node";
import {
  Meta,
  Link,
  Links,
  Form,
  Outlet,
  ScrollRestoration,
  Scripts,
  LiveReload,
} from "@remix-run/react";

import appStylesHref from "./app.css";

// Every route can export a links function.
// They will be collected and rendered into the <Links /> component.
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
]

// This is "Root Route". Typically contains the global layout
export default function App() {
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
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            <ul>
              <li>
                <Link to={"/contacts/1"}>Your Name</Link>
              </li>
              <li>
                <Link to={"/contacts/2"}>Your Friend</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div id="detail">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

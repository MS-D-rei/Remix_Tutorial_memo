import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
// import { RouterProvider, createMemoryRouter } from "react-router-dom";
import App from "~/root";
import type { ContactRecord } from "~/data";
import { json } from "@remix-run/node";
import { createRemixStub } from "@remix-run/testing";

afterEach(() => {
  cleanup();
});

describe("root", () => {
  it("renders title", async () => {
    const fakeContacts: ContactRecord[] = [
      {
        id: "john-doe",
        first: "John",
        last: "Doe",
        twitter: "@John-Doe",
        createdAt: Date.now().toString(),
      },
    ];

    // https://reactrouter.com/en/6.20.0/routers/create-memory-router
    // This will fail with:
    // Error: You must render this element inside a <Remix> element
    // const routes = [
    //   {
    //     path: "/",
    //     element: <App />,
    //     loader() {
    //       return json({ contacts: fakeContacts });
    //     },
    //   },
    // ];
    //
    // const router = createMemoryRouter(routes, {
    //   initialIndex: 0,
    //   initialEntries: ["/"],
    // });
    //
    // render(<RouterProvider router={router} />);

    // https://remix.run/docs/en/main/other-api/testing
    const RemixStub = createRemixStub([
      {
        path: "/",
        Component: App,
        loader() {
          return json({ contacts: fakeContacts });
        },
      },
    ]);

    render(<RemixStub />);

    await waitFor(() => screen.getByText("Remix Contacts"));
    screen.debug();
    expect(screen.getByText("Remix Contacts")).toBeInTheDocument();
  });
});

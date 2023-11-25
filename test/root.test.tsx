import { describe, it, expect, afterEach, vi, afterAll } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
// import { RouterProvider, createMemoryRouter } from "react-router-dom";
import App, { loader } from "~/root";
import type { ContactRecord } from "~/data";
import { json } from "@remix-run/node";
import { createRemixStub } from "@remix-run/testing";

import * as dataUtils from "~/data";

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
    // screen.debug();
    expect(screen.getByText("Remix Contacts")).toBeInTheDocument();
  });
});

describe("root loader", async () => {
  afterAll(async () => {
    // vi.restoreAllMocks();
    getContactsSpy.mockRestore();
  });

  const fakeContacts: ContactRecord[] = [
    {
      id: "john-doe",
      first: "John",
      last: "Doe",
      twitter: "@John-Doe",
      createdAt: Date.now().toString(),
    },
    {
      id: "jane-doe",
      first: "Jane",
      last: "Doe",
      twitter: "@Jane-Doe",
      createdAt: Date.now().toString(),
    },
  ];

  const getContactsSpy = vi.spyOn(dataUtils, "getContacts");
  getContactsSpy.mockResolvedValue(fakeContacts);

  const response = await loader();
  it("calls getContacts", async () => {
    expect(getContactsSpy).toHaveBeenCalled();
  });
  it("returns response 200", async () => {
    expect(response.status).toBe(200);
  });
  it("returns contacts as json", async () => {
    expect(await response.json()).toEqual({ contacts: fakeContacts });
  });
});

/* a response content of loader function
_Response [Response] {
  [Symbol(realm)]: { settingsObject: {} },
  [Symbol(state)]: {
    aborted: false,
    rangeRequested: false,
    timingAllowPassed: false,
    requestIncludesCredentials: false,
    type: 'default',
    status: 200,
    timingInfo: null,
    cacheState: '',
    statusText: '',
    headersList: _HeadersList {
      cookies: null,
      [Symbol(headers map)]: [Map],
      [Symbol(headers map sorted)]: null
    },
    urlList: [],
    body: {
      stream: undefined,
      source: '{"contacts":[{"id":"john-doe","first":"John","last":"Doe","twitter":"@John-Doe","createdAt":"1700913014711"},{"id":"jane-doe","first":"Jane","last":"Doe","twitter":"@Jane-Doe","createdAt":"1700913014711"}]}',
      length: 206
    }
  },
  [Symbol(headers)]: _HeadersList {
    cookies: null,
    [Symbol(headers map)]: Map(1) { 'content-type' => [Object] },
    [Symbol(headers map sorted)]: null
  }
*/

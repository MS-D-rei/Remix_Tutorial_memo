import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact, updateContact } from "~/data";

export const action = async ({ params, request, context }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId");

  // console.log("params: ", params);
  // params:  { contactId: 'mttygb6' }
  // console.log("request: ", request);
//   request:  Request {
//   size: 0,
//   follow: 20,
//   compress: true,
//   counter: 0,
//   agent: undefined,
//   highWaterMark: 16384,
//   insecureHTTPParser: false,
//   [Symbol(Body internals)]: {
//     body: ReadableStream {
//       _state: 'readable',
//       _reader: undefined,
//       _storedError: undefined,
//       _disturbed: false,
//       _readableStreamController: [ReadableStreamDefaultController]
//     },
//     type: null,
//     size: null,
//     boundary: null,
//     disturbed: false,
//     error: null
//   },
//   [Symbol(Request internals)]: {
//     method: 'POST',
//     redirect: 'follow',
//     headers: {
//       accept: '*/*',
//       'accept-encoding': 'gzip, deflate, br',
//       'accept-language': 'en-US,en;q=0.9,ja-JP;q=0.8,ja;q=0.7',
//       connection: 'keep-alive',
//       'content-length': '50',
//       'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
//       host: 'localhost:3000',
//       origin: 'http://localhost:3000',
//       referer: 'http://localhost:3000/contacts/mttygb6/edit',
//       'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
//       'sec-ch-ua-mobile': '?0',
//       'sec-ch-ua-platform': '"macOS"',
//       'sec-fetch-dest': 'empty',
//       'sec-fetch-mode': 'cors',
//       'sec-fetch-site': 'same-origin',
//       'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
//     },
//     credentials: 'same-origin',
//     parsedURL: URL {
//       href: 'http://localhost:3000/contacts/mttygb6/edit',
//       origin: 'http://localhost:3000',
//       protocol: 'http:',
//       username: '',
//       password: '',
//       host: 'localhost:3000',
//       hostname: 'localhost',
//       port: '3000',
//       pathname: '/contacts/mttygb6/edit',
//       search: '',
//       searchParams: URLSearchParams {},
//       hash: ''
//     },
//     signal: AbortSignal { aborted: false }
//   }
// }
  // console.log("context: ", context);
  // context: {}

  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  // This console.log shows up in the terminal, not browser console
  // console.log("updates", updates);
  await updateContact(params.contactId, updates);

  return redirect(`/contacts/${params.contactId}`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId");

  // This console.log shows up in the terminal, not browser console
  // console.log("params", params);

  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ contact });
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          type="text"
          name="first"
          defaultValue={contact.first}
          placeholder="First name"
          aria-label="First name"
        />
        <input
          type="text"
          name="last"
          defaultValue={contact.last}
          placeholder="Last name"
          aria-label="Last name"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          defaultValue={contact.twitter}
          placeholder="@jack"
          aria-label="Twitter handle"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
          placeholder="https://exmaple.com/avatar.jpg"
          aria-label="Avatar URL"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea rows={6} name="notes" defaultValue={contact.notes} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </p>
    </Form>
  );
}

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact, updateContact } from "~/data";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId");

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
        <button type="button">Cancel</button>
      </p>
    </Form>
  );
}

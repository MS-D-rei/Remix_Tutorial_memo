## Remix_Tutorial my memo

### `form` and `link` HTML, HTTP specs
HTML `form` and `link` cause navigation in browser.
The diff in request
- `link` only change URL
- `form` also change the request method (`GET` vs `POST`) and the request body (`POST` form data).
The browser will serialize the `form` data automatically and send it to the server as the request body for `POST`, and as `URLSearchParams` for `GET`.

### Remix approach to Data Mutations with `Form`
Remix does the same thing of `form` except for sending the request to the server.
Instead of it, Remix uses client side routing and sends the request to the route's `action` function.

### How Remix revalidate the data on the page
Remix uses `POST` as a hint to automatically revalidate the data on the page after `action` finishes.
Remix serializes the form and making a `fetch` request to our server,
the browser will serialize the form and make a document request.
So, even if disable JavaScript, the whole thing will still work and gets the same UI in the end either way.

### The reason why there is no event.preventDefault() on the cancel button in $contactId.edit.tsx
A `<button type="button">`, while seemingly redundant, is the HTML way of preventing a button from submitting its form.

### Method to interact action function
1. `Form` can be used with action type setting and navigation
```ts
// contacts.$contactId.tsx
// this form navigate to $contactId_.edit.tsx
<Form action="edit">
    <button type="submit">Edit</button>
</Form>
```
```ts
// contacts.$contactId.tsx
// this form navigate to $contactId.destroy.tsx
<Form
    action="destroy"
    method="post"
    onSubmit={(event) => {
        const response = confirm(
            "Please confirm you want to delete this record."
        );
        if (!response) {
            event.preventDefault();
        }
    }}
>
    <button type="submit">Delete</button>
</Form>
```
2. `Fetcher.Form` can be used without navigation (stays the same page)
useful for bookmarks etc.
```ts
// contacts.$contactId.tsx
<fetcher.Form method="post">
  <button
    type="submit"
    aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
    name="favorite"
    value={favorite ? "false" : "true"}
  >
    {favorite ? "★" : "☆"}
  </button>
</fetcher.Form>
```

### Optimistic UI (update UI even the network process has not finished yet)
When click the bookmark button, there is a delay to update button state.
Because, push button => wait for action function executes, and takes time => update UI

Here is the fetcher which has formData property.
When click a button in fetcher.Form, fetcher contains formData
```ts
// contacts.$contactId.tsx
const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;
```
This code makes update immediately after click the button.
Click button => update UI
This means we don't wait for action function execution.
That's why UI looks responsive.

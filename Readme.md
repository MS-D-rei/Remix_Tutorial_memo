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

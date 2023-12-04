import { describe, it, expect, vi } from "vitest";

import * as dataUtils from "~/data";
import { action } from "~/routes/contacts.$contactId.destroy";

describe("contacts.$contactId.destroy", async () => {
  const deleteContactSpy = vi.spyOn(dataUtils, "deleteContact");
  deleteContactSpy.mockResolvedValue(undefined);

  const body = new URLSearchParams({
    first: "John",
  });

  const request: Request = new Request(
    "http://localhost:3000/contacts/john-doe/destroy",
    {
      method: "POST",
      body,
    }
  );

  const response = await action({
    request,
    params: { contactId: "john-doe" },
    context: {},
  });

  it("should call deleteContact with contactId", async () => {
    expect(deleteContactSpy).toHaveBeenCalledWith("john-doe");
  });
  it("return response status 302", async () => {
    expect(response.status).toBe(302);
  });
  it("should return a response with a redirect to '/'", async () => {
    expect(response.headers.get("Location")).toBe("/");
  });
});

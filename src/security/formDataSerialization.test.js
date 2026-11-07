// @vitest-environment node

import FormData from "form-data";

describe("multipart form-data header serialization", () => {
  it("escapes quotes and line breaks in field names", () => {
    const form = new FormData();
    form.append('name"\r\nX-Injected: yes', "synthetic");

    const payload = form.getBuffer().toString();

    expect(payload).toContain('name="name%22%0D%0AX-Injected: yes"');
    expect(payload).not.toContain('\r\nX-Injected: yes\r\n');
  });

  it("escapes quotes and line breaks in filenames", () => {
    const form = new FormData();
    form.append("upload", Buffer.from("synthetic"), {
      filename: 'file"\r\nX-Injected: yes.txt',
    });

    const payload = form.getBuffer().toString();

    expect(payload).toContain('filename="file%22%0D%0AX-Injected: yes.txt"');
    expect(payload).not.toContain('\r\nX-Injected: yes.txt\r\n');
  });
});

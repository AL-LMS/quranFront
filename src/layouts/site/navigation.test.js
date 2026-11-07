import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

const auth = vi.hoisted(() => ({ current: { user: null } }));
vi.mock("../../hooks/useAuth", () => ({ default: () => auth.current }));

afterEach(() => {
  cleanup();
  auth.current = { user: null };
});

describe("RTL mobile navigation keyboard regression", () => {
  it("closes the drawer on Escape and resets the trigger state", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>
    );

    const trigger = screen.getByRole("button", { name: "باز کردن فهرست" });
    act(() => trigger.focus());
    expect(trigger).toHaveFocus();
    fireEvent.click(trigger);

    expect(await screen.findByRole("navigation", { name: "ناوبری موبایل" })).toBeTruthy();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(screen.getByRole("presentation"), { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("navigation", { name: "ناوبری موبایل" })).toBeNull());
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});

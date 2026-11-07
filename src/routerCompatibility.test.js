import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  BrowserRouter,
  Link,
  MemoryRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import PrivateRoutes from "./utils/PrivateRoutes";

const authState = vi.hoisted(() => ({ user: null }));

vi.mock("./hooks/useAuth", () => ({ default: () => authState }));
vi.mock("./layouts/dashboard/Navbar", () => ({ default: () => <div>Dashboard navigation</div> }));
vi.mock("./layouts/dashboard/Sidebar", () => ({ default: () => <div>Dashboard sidebar</div> }));
vi.mock("./components/dashboard/Back", () => ({ default: () => null }));
vi.mock("./pages/site/SendOTP", () => ({ default: () => <div>OTP access boundary</div> }));

function RouteDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  return (
    <div data-testid="route-details">
      {JSON.stringify({ id, query: searchParams.get("return"), path: location.pathname })}
    </div>
  );
}

function NavigationActions() {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate("/check-otp?source=login")}>Continue</button>
      <Link to="/signup">Signup</Link>
    </>
  );
}

afterEach(() => {
  cleanup();
  authState.user = null;
  window.history.replaceState({}, "", "/");
});

describe("React Router declarative compatibility", () => {
  it.each(["/login", "/signup", "/send-otp", "/check-otp", "/confirm-phone"])(
    "matches the existing public auth URL %s on direct BrowserRouter entry",
    (path) => {
      window.history.replaceState({}, "", path);
      render(
        <BrowserRouter>
          <Routes>
            <Route path={path} element={<div data-testid="browser-route">{path}</div>} />
          </Routes>
        </BrowserRouter>
      );

      expect(screen.getByTestId("browser-route").textContent).toBe(path);
    }
  );

  it("preserves dynamic route parameters and query strings", () => {
    render(
      <MemoryRouter initialEntries={["/panel/course/details/course-42?return=%2Fpanel%2Fdashboard"]}>
        <Routes>
          <Route path="/panel/course/details/:id" element={<RouteDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("route-details").textContent).toContain(
      JSON.stringify({ id: "course-42", query: "/panel/dashboard", path: "/panel/course/details/course-42" })
    );
  });

  it("keeps the wildcard Navigate fallback behavior", () => {
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <Routes>
          <Route path="/login" element={<div>Login destination</div>} />
          <Route path="/signup" element={<div>Signup destination</div>} />
          <Route path="/check-otp" element={<div>OTP destination</div>} />
          <Route path="/actions" element={<NavigationActions />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Login destination")).toBeTruthy();
  });

  it("navigates through useNavigate and Link without changing destination semantics", () => {
    render(
      <MemoryRouter initialEntries={["/actions"]}>
        <Routes>
          <Route path="/signup" element={<div>Signup destination</div>} />
          <Route path="/check-otp" element={<div>OTP destination</div>} />
          <Route path="/actions" element={<NavigationActions />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText("OTP destination")).toBeTruthy();
  });

  it("keeps Link navigation to the existing signup route", () => {
    render(
      <MemoryRouter initialEntries={["/actions"]}>
        <Routes>
          <Route path="/signup" element={<div>Signup destination</div>} />
          <Route path="/check-otp" element={<div>OTP destination</div>} />
          <Route path="/actions" element={<NavigationActions />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("link", { name: "Signup" }));
    expect(screen.getByText("Signup destination")).toBeTruthy();
  });

  it.each(["student", "teacher"])("allows the existing %s dashboard principal through Outlet", (role) => {
    authState.user = { role };
    render(
      <MemoryRouter initialEntries={["/panel/dashboard"]}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/panel/dashboard" element={<div>Protected dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected dashboard")).toBeTruthy();
  });

  it("keeps unsupported roles outside the protected Outlet", () => {
    authState.user = { role: "admin" };
    render(
      <MemoryRouter initialEntries={["/panel/dashboard"]}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/panel/dashboard" element={<div>Protected dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("OTP access boundary")).toBeTruthy();
    expect(screen.queryByText("Protected dashboard")).toBeNull();
  });

  it("keeps API-derived identifiers inside the intended application route", () => {
    const unsafeIdentifier = "//outside.example/path";
    render(
      <MemoryRouter>
        <Link to={`/panel/course/details/${unsafeIdentifier}`}>Course</Link>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: "Course" });
    expect(link.getAttribute("href")).toBe(
      "/panel/course/details/outside.example/path"
    );
  });
});

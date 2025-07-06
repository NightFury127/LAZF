// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Increase timeout for all tests
jest.setTimeout(30000);

// Mock next/router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: {},
      asPath: "",
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock next-auth
jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  return {
    __esModule: true,
    ...originalModule,
    signIn: jest.fn(),
    signOut: jest.fn(),
    useSession: jest.fn(() => {
      return { data: null, status: "unauthenticated" };
    }),
  };
});

// Mock nodemailer for server tests
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: "test-message-id" }),
  }),
}));

// Mock node-fetch for server tests
jest.mock("node-fetch", () =>
  jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({}),
  })
);

// Mock crypto for server tests
jest.mock("crypto", () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue("test-token"),
  }),
}));

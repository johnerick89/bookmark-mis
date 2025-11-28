// Mock axios before importing api
jest.mock("axios", () => {
  const mockAxiosInstance = {
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
  };

  return {
    default: {
      create: jest.fn(() => mockAxiosInstance),
    },
    create: jest.fn(() => mockAxiosInstance),
  };
});

import api from "../api";

describe("api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  describe("axios instance configuration", () => {
    it("should create and export axios instance", () => {
      // The api module creates an axios instance during import
      expect(api).toBeDefined();
      expect(typeof api.get).toBe("function");
      expect(typeof api.post).toBe("function");
    });
  });
});

import { vi } from "vitest";

const authContextMock = {
  signed: true,
  user: undefined,
  checkCurrentAuthUser: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  register: vi.fn(),
  isAdmin: false,
  updateUser: vi.fn()
};

export default authContextMock;

/**
 * Mock: next/navigation
 *
 * Provides mock implementations of Next.js App Router navigation hooks.
 */

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockRefresh = jest.fn();

export const useRouter = jest.fn(() => ({
	push: mockPush,
	replace: mockReplace,
	back: mockBack,
	refresh: mockRefresh,
	prefetch: jest.fn(),
	forward: jest.fn(),
}));

export const usePathname = jest.fn(() => "/");
export const useSearchParams = jest.fn(() => new URLSearchParams());
export const useParams = jest.fn(() => ({}));
export const redirect = jest.fn();
export const notFound = jest.fn();

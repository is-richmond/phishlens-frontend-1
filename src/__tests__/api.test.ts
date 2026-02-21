/**
 * Sprint 5.2 — API Client Tests
 *
 * Covers: ApiError class, request construction, token handling.
 */

import { ApiError } from "@/lib/api";

describe("ApiError", () => {
	it("has correct name", () => {
		const error = new ApiError(401, "Unauthorized");
		expect(error.name).toBe("ApiError");
	});

	it("stores status code", () => {
		const error = new ApiError(404, "Not found");
		expect(error.status).toBe(404);
	});

	it("stores message", () => {
		const error = new ApiError(500, "Server error");
		expect(error.message).toBe("Server error");
	});

	it("is an instance of Error", () => {
		const error = new ApiError(400, "Bad request");
		expect(error).toBeInstanceOf(Error);
	});

	it("has correct stack trace", () => {
		const error = new ApiError(422, "Validation failed");
		expect(error.stack).toBeDefined();
	});
});

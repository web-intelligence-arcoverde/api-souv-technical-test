import redis from "../../../config/redis";
import { getCache, invalidateCacheByPattern, setCache } from "../redis.helper";

jest.mock("../../../config/redis", () => ({
	scan: jest.fn(),
	get: jest.fn(),
	set: jest.fn(),
	pipeline: jest.fn(),
}));

describe("Redis Helper", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("invalidateCacheByPattern", () => {
		it("should use SCAN to find and delete keys by pattern", async () => {
			const pattern = "test:*";
			const mockPipeline = {
				del: jest.fn(),
				exec: jest.fn().mockResolvedValue([]),
			};

			(redis.scan as jest.Mock)
				.mockResolvedValueOnce(["10", ["key1", "key2"]])
				.mockResolvedValueOnce(["0", ["key3"]]);

			(redis.pipeline as jest.Mock).mockReturnValue(mockPipeline);

			await invalidateCacheByPattern(pattern);

			expect(redis.scan).toHaveBeenCalledTimes(2);
			expect(redis.scan).toHaveBeenNthCalledWith(
				1,
				"0",
				"MATCH",
				pattern,
				"COUNT",
				100,
			);
			expect(redis.scan).toHaveBeenNthCalledWith(
				2,
				"10",
				"MATCH",
				pattern,
				"COUNT",
				100,
			);

			expect(mockPipeline.del).toHaveBeenCalledTimes(3);
			expect(mockPipeline.del).toHaveBeenCalledWith("key1");
			expect(mockPipeline.del).toHaveBeenCalledWith("key2");
			expect(mockPipeline.del).toHaveBeenCalledWith("key3");
			expect(mockPipeline.exec).toHaveBeenCalledTimes(2);
		});

		it("should not call pipeline if no keys are found", async () => {
			(redis.scan as jest.Mock).mockResolvedValueOnce(["0", []]);

			await invalidateCacheByPattern("pattern");

			expect(redis.pipeline).not.toHaveBeenCalled();
		});
	});

	describe("getCache", () => {
		it("should return parsed value if exists", async () => {
			const value = { foo: "bar" };
			(redis.get as jest.Mock).mockResolvedValue(JSON.stringify(value));

			const result = await getCache("key");

			expect(result).toEqual(value);
		});

		it("should return null if not exists", async () => {
			(redis.get as jest.Mock).mockResolvedValue(null);
			const result = await getCache("key");
			expect(result).toBeNull();
		});

		it("should return null and log error if parse fails", async () => {
			const consoleSpy = jest.spyOn(console, "error").mockImplementation();
			(redis.get as jest.Mock).mockResolvedValue("invalid json");

			const result = await getCache("key");

			expect(result).toBeNull();
			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
		});
	});

	describe("setCache", () => {
		it("should store value with TTL if provided", async () => {
			const value = { foo: "bar" };
			await setCache("key", value, 60);

			expect(redis.set).toHaveBeenCalledWith(
				"key",
				JSON.stringify(value),
				"EX",
				60,
			);
		});

		it("should store value without TTL if not provided", async () => {
			const value = { foo: "bar" };
			await setCache("key", value);

			expect(redis.set).toHaveBeenCalledWith("key", JSON.stringify(value));
		});
	});
});

import redis from "../../../config/redis";
import { RedisCacheProvider } from "../redis.provider";

jest.mock("../../../config/redis", () => ({
	get: jest.fn(),
	set: jest.fn(),
	del: jest.fn(),
	keys: jest.fn(),
}));

describe("RedisCacheProvider", () => {
	let redisProvider: RedisCacheProvider;

	beforeEach(() => {
		redisProvider = new RedisCacheProvider();
		jest.clearAllMocks();
	});

	describe("get", () => {
		it("should return parsed JSON when data exists", async () => {
			const mockData = { name: "test" };
			(redis.get as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

			const result = await redisProvider.get("test-key");

			expect(redis.get).toHaveBeenCalledWith("test-key");
			expect(result).toEqual(mockData);
		});

		it("should return null when data does not exist", async () => {
			(redis.get as jest.Mock).mockResolvedValue(null);

			const result = await redisProvider.get("test-key");

			expect(result).toBeNull();
		});
	});

	describe("set", () => {
		it("should store stringified JSON with expiration", async () => {
			const mockData = { name: "test" };
			const ttl = 100;

			await redisProvider.set("test-key", mockData, ttl);

			expect(redis.set).toHaveBeenCalledWith(
				"test-key",
				JSON.stringify(mockData),
				"EX",
				ttl,
			);
		});
	});

	describe("del", () => {
		it("should delete the key", async () => {
			await redisProvider.del("test-key");
			expect(redis.del).toHaveBeenCalledWith("test-key");
		});
	});

	describe("invalidateByPattern", () => {
		it("should delete all keys matching the pattern", async () => {
			const keys = ["key1", "key2"];
			(redis.keys as jest.Mock).mockResolvedValue(keys);

			await redisProvider.invalidateByPattern("pattern*");

			expect(redis.keys).toHaveBeenCalledWith("pattern*");
			expect(redis.del).toHaveBeenCalledWith(...keys);
		});

		it("should not call del if no keys are found", async () => {
			(redis.keys as jest.Mock).mockResolvedValue([]);

			await redisProvider.invalidateByPattern("pattern*");

			expect(redis.del).not.toHaveBeenCalled();
		});
	});
});

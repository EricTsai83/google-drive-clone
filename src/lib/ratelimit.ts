import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 file upload per day
export const fileUploadRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  /**
   * 如果你要「每天最多 N 次」且希望每個人都是獨立的 24 小時循環，選 Ratelimit.tokenBucket
   * 如果你要「每天最多 N 次」且希望所有人都在同一個時間點重置，選 Ratelimit.slidingWindow
   * 如果你要避免「視窗邊界爆量」問題，Ratelimit.slidingWindow 比 Ratelimit.fixedWindow 好
   */
  limiter: Ratelimit.tokenBucket(
    10, // refillRate: 每 24 小時補充的令牌數
    "24h", // interval: 補充間隔
    10, // maxTokens: 最大令牌數
  ),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

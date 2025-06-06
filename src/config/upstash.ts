import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import {config} from "dotenv";
config();

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "60 s")
});

export default ratelimit;
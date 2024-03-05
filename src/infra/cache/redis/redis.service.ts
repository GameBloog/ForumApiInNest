import { Injectable } from "@nestjs/common"
import { EnvService } from "@/infra/env/env.service"
import { OnModuleDestroy } from "@nestjs/common"
import { Redis } from "ioredis"

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envSerive: EnvService) {
    super({
      host: envSerive.get("REDIS_HOST"),
      port: envSerive.get("REDIS_PORT"),
      db: envSerive.get("REDIS_DB"),
    })
  }

  onModuleDestroy() {
    return this.disconnect()
  }
}

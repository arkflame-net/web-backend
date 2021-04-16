import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { RedisCacheModule } from "../../cache/cache.module";

@Module({
  imports: [RedisCacheModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}

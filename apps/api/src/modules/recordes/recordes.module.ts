import { Module } from "@nestjs/common";
import { RecordesController } from "./recordes.controller";
import { RecordesService } from "./recordes.service";

@Module({
  controllers: [RecordesController],
  providers: [RecordesService],
})
export class RecordesModule {}

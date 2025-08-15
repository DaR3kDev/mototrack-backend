import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { CatalogModule } from './catalog/catalog.module';
import { MotorcycleModule } from './vehicle/motorcycle/motorcycle.module';
import { EngineTypeModule } from './vehicle/engine-type/engine-type.module';
import { CylinderModule } from './vehicle/cylinder/cylinder.module';

@Module({
  imports: [DatabaseModule, UsersModule, CatalogModule, ClientsModule, MotorcycleModule, EngineTypeModule, CylinderModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { CatalogModule } from './catalog/catalog.module';
import { MotorcycleModule } from './vehicle/motorcycle/motorcycle.module';
import { BranchModule } from './branch/branch.module';
import { WorkshopModule } from './workshop/workshop.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    CatalogModule,
    ClientsModule,
    MotorcycleModule,
    BranchModule,
    WorkshopModule,
  ],
})
export class AppModule {}

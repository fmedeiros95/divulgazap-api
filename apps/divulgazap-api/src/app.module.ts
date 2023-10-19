import { Module } from '@nestjs/common';
import { CoreModule } from './core';
import { UsersModule } from './modules/users';
import { WorkspacesModule } from './modules/workspaces';

@Module({
  imports: [CoreModule, UsersModule, WorkspacesModule],
})
export class AppModule {}

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 👈 делает модуль доступным во всем приложении без явного импорта
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 👈 экспортируем, чтобы другие модули могли использовать
})
export class PrismaModule {}

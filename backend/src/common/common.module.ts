import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonLogger } from './winston.logger';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true,
    }),
  ],
  providers: [
    WinstonLogger,
    {
      provide: 'LOG_LEVEL',
      useFactory: (configService: ConfigService) =>
        configService.get<string>('LOG_LEVEL', 'info'),
      inject: [ConfigService],
    },
  ],
  exports: [WinstonLogger],
})
export class CommonModule {}

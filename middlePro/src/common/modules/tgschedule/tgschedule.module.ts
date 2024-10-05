import { Module } from '@nestjs/common';
import { TgscheduleHelper } from './tgschedule.helper';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
    imports: [ScheduleModule.forRoot()], 
    providers:[TgscheduleHelper],
    exports:[TgscheduleHelper]
})
export class TgscheduleModule {}

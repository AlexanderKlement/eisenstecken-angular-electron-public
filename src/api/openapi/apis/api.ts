export * from './default.service';
import { DefaultService } from './default.service';
export * from './health.service';
import { HealthService } from './health.service';
export * from './scheduler.service';
import { SchedulerService } from './scheduler.service';
export const APIS = [DefaultService, HealthService, SchedulerService];

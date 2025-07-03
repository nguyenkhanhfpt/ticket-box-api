import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DEFAULT_QUEUE_NAME } from '@shared/constants';

@Processor(DEFAULT_QUEUE_NAME)
export class QueueProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    console.log('Processing job', job.id, job.name, job.data);

    return true;
  }
}

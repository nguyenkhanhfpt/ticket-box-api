import {
  QueueEventsHost,
  QueueEventsListener,
  OnQueueEvent,
} from '@nestjs/bullmq';
import { DEFAULT_QUEUE_NAME } from '@shared/constants';

@QueueEventsListener(DEFAULT_QUEUE_NAME)
export class QueueListener extends QueueEventsHost {
  @OnQueueEvent('active')
  onActive(job: { jobId: string; prev?: string }) {
    console.log(`Queue listener: Processing job ${job.jobId}...`);
  }

  @OnQueueEvent('completed')
  onCompleted(job: { jobId: string; returnvalue: any }) {
    console.log(`Queue listener: Job ${job.jobId} completed!`);
  }

  @OnQueueEvent('failed')
  onFailed(job: { jobId: string; failedReason: string }) {
    console.log(`Queue listener: Job ${job.jobId} failed!`, job.failedReason);
  }
}

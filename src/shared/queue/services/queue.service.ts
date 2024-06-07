import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { QUEUE_NAME } from '../constants/queue.constant';
import { JobOptions, Queue } from 'bull';

export const DEFAULT_OPTS: JobOptions = {
  attempts: 3,
  removeOnComplete: false,
};
@Injectable()
export class QueueService {
  constructor(@InjectQueue(QUEUE_NAME.AUTH_QUEUE) private _authQueue: Queue) {}

  async addJob({ queueName, processName, payload, otps }) {
    console.log(queueName, processName);
    switch (queueName) {
      case QUEUE_NAME.AUTH_QUEUE:
        try {
          const result = await this._authQueue.add(processName, payload, otps);
          return result;
        } catch (error) {
          console.log(error);
        }
    }
  }
}

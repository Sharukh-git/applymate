
import { Queue } from 'bullmq';
import { connection } from '../config/redis';

const applicationQueue = new Queue('application-processing', { connection });

export default applicationQueue;

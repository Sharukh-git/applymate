import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import applicationQueue from './queues/application.queue';
import express from 'express';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(applicationQueue)],
  serverAdapter,
});

const dashboardApp = express();
dashboardApp.use('/admin/queues', serverAdapter.getRouter());

export default dashboardApp;

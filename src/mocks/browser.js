import { setupWorker } from 'msw/browser';
import {paymentIntentMock} from './paymentIntentMock'; 

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...paymentIntentMock);

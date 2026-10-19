// Nest needs an entry file: it stays thin and delegates to the composition root.
import { bootstrap } from './platform/bootstrap.js';

await bootstrap();

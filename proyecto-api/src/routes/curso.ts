import { Router } from 'express';
// import { randomUUID } from 'node:crypto';
// import { z } from 'zod';

// import { db } from '../database/db.js';

import { requireAuth } from '../middleware/auth.middleware.js';
// import { requirePermission } from '../middleware/permission.middleware.js';

export const cursoRouter = Router();
cursoRouter.use(requireAuth);

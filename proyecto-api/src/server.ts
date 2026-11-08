import 'dotenv/config';

import { app } from './app.js';

const PORT = Number(process.env.PORT ?? 3000);

// 10. Iniciar servidor
app.listen(PORT, "127.0.0.1", () => {
  console.log(`API disponible en http://localhost:${PORT}`);
});

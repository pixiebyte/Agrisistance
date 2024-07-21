import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import axios from 'axios';

import 'express-async-errors';

import notFoundMiddleware from './Middleware/not-found.js';
import errorHandlerMiddleware from './Middleware/error-handler.js';

import routes from './Routes/index.js';


const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({limit : '100mb'}));
app.use(express.urlencoded({limit : '100mb', extended : true }));

// Routes

app.use('/api', routes);


// Error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


// Start the server
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

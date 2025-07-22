import morgan from 'morgan';
import logger from '../lib/logger';

// Create a stream object with a 'write' function that will be used by Morgan
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Create the morgan middleware
const morganMiddleware = morgan(
  // Define message format
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  // Options: in this case, I overwrote the stream and the 'skip' option.
  {
    stream,
    skip: req => {
      // Skip logging for health check requests
      return req.url === '/health';
    },
  }
);

export default morganMiddleware;

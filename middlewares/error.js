import logger from '../helpers/loggers.js';

export default function error(err, req, res, next) {
    logger.error(err.message, { metadata: err });
    res.status(500).json({ message: "Server error: " + err.message });
    res.status(500).send('Something went wrong!');
}

const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR]: ${err.message}`);

    // Handle known errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (err.name === 'NotFoundError') {
        return res.status(404).json({ success: false, message: err.message });
    }

    // Handle generic errors
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;

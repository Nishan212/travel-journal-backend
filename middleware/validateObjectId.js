const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id))
        return res.status(200).json({ error: 'Invalid ID' });

    next();
};

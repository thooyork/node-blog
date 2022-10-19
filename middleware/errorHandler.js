
const errorHandler = (err, req, res, next) => {
    // TODO write errrLog to File ....
    console.error(err.stack);
    res.status(500).send(err.message);
}

module.exports = errorHandler;
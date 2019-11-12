const wait = ms => new Promise(r => setTimeout(r, ms));

const retryOperation = (operation, delay, times) => {
    return new Promise((resolve, reject) => {
        return operation()
            .then(resolve)
            .catch((reason) => {
                if (times - 1 > 0) {
                    return wait(delay)
                        .then(retryOperation.bind(null, operation, delay, times - 1))
                        .then(resolve)
                        .catch(reject);
                }

                return reject(reason);
            });
    });
};

export default retryOperation;

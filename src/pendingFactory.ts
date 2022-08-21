const pendingFactory: any = () => {
    let ready, error;
    const pending = new Promise((resolve, reject) => {
        ready = resolve;
        error = reject;
    });
    return [pending, ready, error];
};

export default pendingFactory;

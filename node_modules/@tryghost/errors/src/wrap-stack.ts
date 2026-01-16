export function wrapStack(err: Error, internalErr: Error) {
    const extraLine = (err.stack?.split(/\n/g) || [])[1];
    const [firstLine, ...rest] = internalErr.stack?.split(/\n/g) || [];
    return [firstLine, extraLine, ...rest].join('\n');
};

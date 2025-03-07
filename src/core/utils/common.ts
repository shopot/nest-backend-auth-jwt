export const safeParseInt = (value: string | undefined, defaultValue: number): number => {
    if (value === undefined) {
        return defaultValue;
    }

    const parsed = parseInt(value, 10);

    return isNaN(parsed) ? defaultValue : parsed;
};

export const isObjectEmpty = (objectName: object): boolean =>
    Object.keys(objectName).length === 0 && objectName.constructor === Object;

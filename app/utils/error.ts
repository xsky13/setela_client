export const getErrors = (error: any) => {
    if (error.response.data.error) return [error.response.data.error];

    if (error.response.data.errors != null && error.response.data.errors != undefined) {
        const errorArray: any[] = [];

        for (const [key, value] of Object.entries(error.response.data.errors)) {
            errorArray.push(value);
        }
        return errorArray;
    }

    return [error.message];
}
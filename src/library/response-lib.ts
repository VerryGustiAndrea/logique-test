
const responseCreated = (data: any, success: any) => {
    if (data.data) {
        data = data;
    }
    success = success;

    return { success, data };
};

const responsePaging = (data:any, success:any) => {
    if (data.data) {
        data = data;
    }
    success = success;
    return { success, data };
}

const responseOk = (data:any, message:string) => {
    if (data.data) {
        data = data;
    }
    let success:any = {};
    success.message = message;
    return { success, data };
}

const responseBadRequest = (data: any, message: string) => {
    if (data.data) {
        data = data;
    }
    let error:any = {};
    error.user_title = "Error";
    error.user_msg = "Bad Request";
    error.message = message;
    return { error, data };
};

export default { responseCreated, responseBadRequest, responseOk, responsePaging };

export type ObjectResponse = {
    error: boolean;
    items: object[] | any;
    message: string;
}

export type ResponseApi = {
    data: ObjectResponse    
}

export type ResponseManualApi = {
    data: ResponseApi
}
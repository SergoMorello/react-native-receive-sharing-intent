export interface IReturnData {
    filePath?: string | null,
    text?: string | null,
    weblink?: string | null,
    mimeType?: string | null,
    contentUri?: string | null,
    fileName?: string | null, 
    extension?: string | null,
}

export type TReceiveSharingCallbackParams = IReturnData & {
	base64?: string;
};

export type TReceiveSharingCallback = (files: TReceiveSharingCallbackParams[]) => void;

export type TReceiveSharingCallbackError = (error: string) => void;

export interface IReceiveSharing{
    getReceivedFiles(handler: TReceiveSharingCallback , errorHandler?: TReceiveSharingCallbackError, protocol?: string ): void,
}

export interface IUtils{
    sortData(data: any): IReturnData | IReturnData[];
}


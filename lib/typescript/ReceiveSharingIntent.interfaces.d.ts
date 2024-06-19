export interface IReturnData {
    filePath?: string | null;
    text?: string | null;
    weblink?: string | null;
    mimeType?: string | null;
    contentUri?: string | null;
    fileName?: string | null;
    extension?: string | null;
}
export declare type TReceiveSharingCallbackParams = IReturnData & {
    base64?: string;
};
export declare type TReceiveSharingCallback = (params: TReceiveSharingCallbackParams) => void;
export declare type TReceiveSharingCallbackError = (error: string) => void;
export interface IReceiveSharing {
    getReceivedFiles(handler: TReceiveSharingCallback, errorHandler: TReceiveSharingCallbackError, protocol: string): void;
}
export interface IUtils {
    sortData(data: any): IReturnData | IReturnData[];
}
//# sourceMappingURL=ReceiveSharingIntent.interfaces.d.ts.map
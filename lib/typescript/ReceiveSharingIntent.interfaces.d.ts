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
    base64: string;
};
export interface IReceiveSharing {
    getReceivedFiles(handler: (params: TReceiveSharingCallbackParams) => void, errorHandler: (error: string) => void, protocol: string): void;
}
export interface IUtils {
    sortData(data: any): any;
}
//# sourceMappingURL=ReceiveSharingIntent.interfaces.d.ts.map
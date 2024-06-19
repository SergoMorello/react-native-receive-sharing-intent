import type { IReceiveSharing, TReceiveSharingCallback } from "./ReceiveSharingIntent.interfaces";
declare class ReceiveSharingModule implements IReceiveSharing {
    private isIos;
    private utils;
    private isClear;
    getReceivedFiles(handler: TReceiveSharingCallback, errorHandler?: (error: string) => void, protocol?: string): void;
    clearReceivedFiles(): void;
    protected getFileNames(handler: Function, errorHandler: Function, url: string): void;
}
export default ReceiveSharingModule;
//# sourceMappingURL=ReceiveSharingIntent.d.ts.map
import type {
	IReceiveSharing,
	IUtils,
	TReceiveSharingCallback
} from "./ReceiveSharingIntent.interfaces";
import { Platform, Linking, AppState, NativeModules } from "react-native";
import  Utils from "./utils";

const { ReceiveSharingIntent } = NativeModules;

class ReceiveSharingModule implements IReceiveSharing {
    private isIos: boolean = Platform.OS === "ios";
    private utils: IUtils = new Utils();
    private isClear: boolean = false;

    getReceivedFiles(handler: TReceiveSharingCallback, errorHandler?: (error: string) => void, protocol: string = "ShareMedia") {

		const handleError = (error: string) => {
			if (typeof errorHandler === 'function') {
				errorHandler(error);
			}
		};

        if(this.isIos){
            Linking.getInitialURL().then((res:any) => {
                if (res && res.startsWith(`${protocol}://dataUrl`) && !this.isClear) {
                    this.getFileNames(handler, handleError, res);
                }
            }).catch(() => { });
            Linking.addEventListener("url", (res:any) => {
                const url = res ? res.url : "";
                if (url.startsWith(`${protocol}://dataUrl`) && !this.isClear) {
                    this.getFileNames(handler, handleError, res.url);
                }
            });
        }else{
            AppState.addEventListener('change', (status: string) => {
                if (status === 'active' && !this.isClear) {
                    this.getFileNames(handler, handleError, "");
                }
              });
           if(!this.isClear) this.getFileNames(handler, handleError, "");
        }
    }

    clearReceivedFiles(){
        this.isClear = true;
    }

    
   protected getFileNames(handler: Function, errorHandler: Function, url: string){
        if(this.isIos){
            ReceiveSharingIntent.getFileNames(url).then((data: any)=>{         
                 let files = this.utils.sortData(data);
                 handler(files);
            }).catch(errorHandler);
        }else{
            ReceiveSharingIntent.getFileNames().then((fileObject: any) => {
                let files = Object.keys(fileObject).map((k) => fileObject[k])
                handler(files);
            }).catch(errorHandler);
        }
    }

    
}

export default ReceiveSharingModule;
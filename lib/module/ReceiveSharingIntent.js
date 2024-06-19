import { Platform, Linking, AppState, NativeModules } from "react-native";
import Utils from "./utils";
const {
  ReceiveSharingIntent
} = NativeModules;
class ReceiveSharingModule {
  isIos = Platform.OS === "ios";
  utils = new Utils();
  isClear = false;
  getReceivedFiles(handler, errorHandler, protocol = "ShareMedia") {
    const handleError = error => {
      if (typeof errorHandler === 'function') {
        errorHandler(error);
      }
    };
    if (this.isIos) {
      Linking.getInitialURL().then(res => {
        if (res && res.startsWith(`${protocol}://dataUrl`) && !this.isClear) {
          this.getFileNames(handler, handleError, res);
        }
      }).catch(() => {});
      Linking.addEventListener("url", res => {
        const url = res ? res.url : "";
        if (url.startsWith(`${protocol}://dataUrl`) && !this.isClear) {
          this.getFileNames(handler, handleError, res.url);
        }
      });
    } else {
      AppState.addEventListener('change', status => {
        if (status === 'active' && !this.isClear) {
          this.getFileNames(handler, handleError, "");
        }
      });
      if (!this.isClear) this.getFileNames(handler, handleError, "");
    }
  }
  clearReceivedFiles() {
    this.isClear = true;
  }
  getFileNames(handler, errorHandler, url) {
    if (this.isIos) {
      ReceiveSharingIntent.getFileNames(url).then(data => {
        let files = this.utils.sortData(data);
        handler(files);
      }).catch(errorHandler);
    } else {
      ReceiveSharingIntent.getFileNames().then(fileObject => {
        let files = Object.keys(fileObject).map(k => fileObject[k]);
        handler(files);
      }).catch(errorHandler);
    }
  }
}
export default ReceiveSharingModule;
//# sourceMappingURL=ReceiveSharingIntent.js.map
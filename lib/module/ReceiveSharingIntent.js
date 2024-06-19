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
    if (this.isIos) {
      Linking.getInitialURL().then(res => {
        if (res && res.startsWith(`${protocol}://dataUrl`) && !this.isClear) {
          this.getFileNames(handler, errorHandler, res);
        }
      }).catch(() => {});
      Linking.addEventListener("url", res => {
        const url = res ? res.url : "";
        if (url.startsWith(`${protocol}://dataUrl`) && !this.isClear) {
          this.getFileNames(handler, errorHandler, res.url);
        }
      });
    } else {
      AppState.addEventListener('change', status => {
        if (status === 'active' && !this.isClear) {
          this.getFileNames(handler, errorHandler, "");
        }
      });
      if (!this.isClear) this.getFileNames(handler, errorHandler, "");
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
      }).catch(e => errorHandler(e));
    } else {
      ReceiveSharingIntent.getFileNames().then(fileObject => {
        let files = Object.keys(fileObject).map(k => fileObject[k]);
        handler(files);
      }).catch(e => errorHandler(e));
    }
  }
}
export default ReceiveSharingModule;
//# sourceMappingURL=ReceiveSharingIntent.js.map
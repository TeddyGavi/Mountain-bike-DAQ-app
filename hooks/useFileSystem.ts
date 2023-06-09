import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { PermissionsAndroid, Platform } from "react-native";

interface FileSystemAPI {
  filesystemPermissions: () => Promise<boolean>;
  saveToFiles: (data: string, filename: string) => Promise<void>;
}

function useFileSystem() {
  const filesystemPermissions = async () => {
    if (Platform.OS === "android") {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.MEDIA_LIBRARY,
        {
          title: "File system Permission",
          message: "app requires filesystem Access",
          buttonPositive: "Ok",
        }
      );

      return status === "granted";
    } else {
      const status = await MediaLibrary.requestPermissionsAsync();
      console.log(status);

      if (!status.granted) {
        console.log("file system denied");
        return;
      } else {
        return status.granted;
      }
    }
  };

  const saveToFiles = async (data: string, filename: string) => {
    const dir = `${FileSystem.documentDirectory}${filename}.txt`;
    await FileSystem.writeAsStringAsync(dir, data, { encoding: "utf8" });
    if (Platform.OS === "ios") {
      // set the Universal Type identifier
      const UTI = "public.item";
      await Sharing.shareAsync(data, { UTI });
    } else {
      try {
        const file = await MediaLibrary.createAssetAsync(data);
        const album = await MediaLibrary.getAlbumAsync("bikeDaq");

        if (album === null) {
          await MediaLibrary.createAlbumAsync("bikeDaq", file, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([file], album, false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return {
    filesystemPermissions,
    saveToFiles,
  };
}

export default useFileSystem;

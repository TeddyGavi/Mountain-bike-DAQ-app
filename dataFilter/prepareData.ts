import useBle from "../hooks/useBle";
import useLocation from "../hooks/useLocation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { sensorData } = useBle();
const { location } = useLocation();

export async function prepareData() {
  const stringData = sensorData.toString();
  const stringify = JSON.stringify(location);
  const first = ["@sensor", stringData];
  const second = ["@location", stringify];

  try {
    await AsyncStorage.setItem("@sensor", stringData);
  } catch (error) {
    console.log(error);
  }

  console.log("done saving to async");
}

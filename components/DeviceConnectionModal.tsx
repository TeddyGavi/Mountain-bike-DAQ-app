import React, { FC, useCallback } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTheme, Text, Title } from "react-native-paper";
import { Device } from "react-native-ble-plx";

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

type DeviceModalProps = {
  devices: Device[];
  visible: boolean;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
  scan: () => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
  const { item, connectToPeripheral, closeModal } = props;
  const theme = useTheme();

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
    closeModal();
  }, [closeModal, connectToPeripheral, item.item]);

  return (
    <TouchableOpacity
      onPress={connectAndCloseModal}
      style={[modalStyle.ctaButton, { backgroundColor: theme.colors.primary }]}
    >
      <Text
        style={[modalStyle.ctaButtonText, { color: theme.colors.onPrimary }]}
      >
        {item.item.name}
      </Text>
    </TouchableOpacity>
  );
};

const DeviceModal: FC<DeviceModalProps> = (props) => {
  const { devices, visible, connectToPeripheral, closeModal, scan } = props;
  const theme = useTheme();

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return (
        <DeviceModalListItem
          item={item}
          connectToPeripheral={connectToPeripheral}
          closeModal={closeModal}
        />
      );
    },
    [closeModal, connectToPeripheral]
  );

  return (
    <Modal
      style={[
        modalStyle.modalContainer,
        { backgroundColor: theme.colors.tertiaryContainer },
      ]}
      animationType="slide"
      transparent={false}
      visible={visible}
    >
      <SafeAreaView
        style={[
          modalStyle.modalTitle,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={modalStyle.modalTitleText}>Devices</Text>
        <FlatList
          contentContainerStyle={modalStyle.modalFlatlistContiner}
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
        <TouchableOpacity
          onPress={scan}
          style={[
            modalStyle.ctaButton,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Text
            style={[
              modalStyle.ctaButtonText,
              { color: theme.colors.onPrimary },
            ]}
          >
            Refresh
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={closeModal}
          style={[
            modalStyle.ctaButton,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Text
            style={[
              modalStyle.ctaButtonText,
              { color: theme.colors.onPrimary },
            ]}
          >
            Close
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    // backgroundColor: "#f2f2f2",
  },
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: "center",
  },
  modalCellOutline: {
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  modalTitle: {
    flex: 1,
    // backgroundColor: "#f2f2f2",
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 20,
    textAlign: "center",
  },
  ctaButton: {
    // backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    // color: "white",
  },
});

export default DeviceModal;

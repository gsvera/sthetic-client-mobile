import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { PLATFORM_TYPE } from "@/constants/Constants";
import {
  modalCustomProps,
  selectOptionType,
  TypesServicesType,
} from "@/constants/GeneralTypes";
import { ButtonGeneralStyle, TextStyle } from "@/constants/StyleComponents";
import { SimpleLineIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type searchModalProps = modalCustomProps & {
  listType: TypesServicesType[];
  handleFilter: (data: any) => void;
  handleClearFilter: (data: any) => void;
};

export const SearchModal = ({
  open,
  handleCloseModal,
  listType,
  handleFilter,
  handleClearFilter,
}: searchModalProps) => {
  const insets = useSafeAreaInsets();
  const [textSearch, setTextSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  const listItemTypeService = useMemo(
    () =>
      listType.length > 0
        ? listType
            .map((item: any) => {
              let checked = false;

              for (let i = 0; i < selectedKeys.length; i++) {
                if (selectedKeys[i] === item?.id) checked = true;
              }

              return {
                key: item?.id,
                value: item?.typeServiceNameEs,
                checked,
              };
            })
            .sort(function (a: any, b: selectOptionType) {
              if (a.checked !== b.checked) {
                return a.checked ? -1 : 1;
              }
              if (a.value) return a.value.localeCompare(b.value);
              return a;
            })
        : [],
    [listType, selectedKeys]
  );

  const handleSelectItem = (id: number) => {
    const keysList = selectedKeys;
    if (keysList.includes(id)) {
      const newKeyList = keysList.filter((item) => item !== id);
      setSelectedKeys(newKeyList);
    } else {
      setSelectedKeys((keys) => [...keys, id]);
    }
  };

  const handleOnPressFilter = () => {
    handleFilter({
      word: textSearch,
      typeService: selectedKeys,
    });
  };

  const handleOnClearFilter = () => {
    setSelectedKeys([]);
    setTextSearch("");
    handleClearFilter({ word: "", typeService: "" });
  };

  return (
    <Modal animationType="fade" transparent={true} visible={open}>
      <View
        style={localStyle.modalSearch}
        onStartShouldSetResponder={() => {
          handleCloseModal();
          return false;
        }}
      >
        <View
          style={{
            ...localStyle.contentModal,
            top: Platform.OS === PLATFORM_TYPE.ANDROID ? 0 : insets.top,
          }}
        >
          <ButtonCloseModal handleOnPress={handleCloseModal} />
          <View style={localStyle.contentFilter}>
            <View>
              <ThemedText style={localStyle.label}>Negocio:</ThemedText>
            </View>
            <View style={localStyle.contentComponent}>
              <TextInput
                placeholder="Buscar"
                style={localStyle.inputSearch}
                value={textSearch}
                onChangeText={setTextSearch}
              />
            </View>
            <View>
              <ThemedText style={localStyle.label}>Tipo servicio:</ThemedText>
            </View>
            <ScrollView style={{ ...localStyle.contentComponent, height: 250 }}>
              {listItemTypeService.map((item) => (
                <TouchableOpacity
                  onPress={() => handleSelectItem(item.key)}
                  key={item.key}
                  style={localStyle.contentElement}
                >
                  <Checkbox value={item.checked} />
                  <ThemedText style={localStyle.listValue}>
                    {"   "}
                    {item.value}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={localStyle.contentBtn}>
              <GeneralButton
                textBtn="Limpiar filtros"
                styleText={TextStyle.fontBoldWhite}
                styleBtn={{
                  ...ButtonGeneralStyle.btnCancelSthetic,
                  ...localStyle.btn,
                }}
                handleOnPress={handleOnClearFilter}
              />
              <GeneralButton
                textBtn="Aplicar filtros"
                styleText={TextStyle.fontBoldWhite}
                styleBtn={{
                  ...ButtonGeneralStyle.btnSaveSthetic,
                  ...localStyle.btn,
                }}
                handleOnPress={handleOnPressFilter}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  modalSearch: {
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // <-- fondo negro con opacidad
    justifyContent: "center",
  },
  contentModal: {
    position: "absolute",
    width: "100%",
    backgroundColor: ThemeColorsSthetic.backgroundLight,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    marginBottom: 5,
    paddingRight: 10,
  },
  inputSearch: {
    borderColor: ThemeColorsSthetic.muted,
    borderWidth: 0.5,
    borderRadius: 20,
    padding: 15,
  },
  contentFilter: {
    paddingHorizontal: 10,
  },
  contentElement: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
  },
  listValue: {
    color: ThemeColorsSthetic.text,
  },
  contentComponent: {
    marginTop: 10,
    marginBottom: 15,
  },
  contentBtn: {
    marginTop: 10,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    width: "48%",
  },
  label: {
    color: ThemeColorsSthetic.textLabels,
    fontWeight: "bold",
  },
});

export default SearchModal;

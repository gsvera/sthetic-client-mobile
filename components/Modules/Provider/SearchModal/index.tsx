import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";
import GeneralButton from "@/components/Shared/GeneralButton";
import StateAndMunicipalitySelect from "@/components/Shared/StateAndMunicipalitySelect";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import {
  DefaultLocationType,
  modalCustomProps,
  selectOptionType,
  TypesServicesType,
} from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  MarginStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { useSessionProvider } from "@/provider/SessionProvider";
import Checkbox from "expo-checkbox";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const { height } = Dimensions.get("window");
  const { storeSessionProvider } = useSessionProvider();
  const [textSearch, setTextSearch] = useState("");
  const [locationSelected, setLocationSelect] = useState<DefaultLocationType>({
    defaultState: "",
    defaultMunicipality: "",
  });
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [clearSelect, setClearSelect] = useState(false);

  useEffect(() => {
    if (storeSessionProvider?.defaultState)
      setLocationSelect((prev) => ({
        ...prev,
        defaultState: storeSessionProvider?.defaultState,
      }));
    if (storeSessionProvider?.defaultMunicipality)
      setLocationSelect((prev) => ({
        ...prev,
        defaultMunicipality: storeSessionProvider?.defaultMunicipality,
      }));
  }, [
    storeSessionProvider?.defaultState,
    storeSessionProvider?.defaultMunicipality,
  ]);

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

  const handleSelectLocation = (data: DefaultLocationType) => {
    setLocationSelect(data);
  };

  const handleOnPressFilter = () => {
    handleFilter({
      word: textSearch,
      typeService: selectedKeys,
      defaultState: locationSelected?.defaultState,
      defaultMunicipality: locationSelected?.defaultMunicipality,
    });
  };

  const handleOnClearFilter = () => {
    setSelectedKeys([]);
    setTextSearch("");
    setClearSelect(true);
    setLocationSelect({
      idState: 0,
      defaultState: "",
      idMunicipality: 0,
      defaultMunicipality: "",
    });
    handleClearFilter({
      word: "",
      typeService: "",
      defaultState: "",
      defaultMunicipality: "",
    });
    setTimeout(() => {
      setClearSelect(false);
    }, 1000);
  };

  return (
    <Modal
      style={{ flex: 1 }}
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={handleCloseModal}
      supportedOrientations={["portrait", "landscape"]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: ThemeColorsSthetic.shadowBackground,
          }}
        >
          <View style={{ ...localStyle.modalSearch }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView style={{ flexGrow: 1 }}>
                <View
                  style={{
                    ...localStyle.contentModal,
                  }}
                >
                  <ButtonCloseModal handleOnPress={handleCloseModal} />
                  <View style={localStyle.contentFilter}>
                    <View style={localStyle.contentComponent}>
                      <ThemedText style={TextStyle.label}>Negocio:</ThemedText>
                      <TextInput
                        placeholder="Ejem: Meredith Aesthetic..."
                        placeholderTextColor={ThemeColorsSthetic.muted}
                        style={localStyle.inputSearch}
                        value={textSearch}
                        onChangeText={setTextSearch}
                      />
                    </View>
                    <View>
                      <StateAndMunicipalitySelect
                        defaultValues={locationSelected}
                        handleSelectData={handleSelectLocation}
                        clearData={clearSelect}
                      />
                    </View>
                    <View style={localStyle.contentScroll}>
                      <ThemedText style={TextStyle.label}>
                        Tipo servicio:
                      </ThemedText>
                      <ScrollView style={localStyle.contentComponent}>
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
                    </View>
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
                        textBtn="Buscar"
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
              </ScrollView>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  modalSearch: {
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    justifyContent: "center",
    marginVertical: "auto",
  },
  contentModal: {
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
    ...MarginStyle.marginT10,
    borderColor: ThemeColorsSthetic.backgroundStrong,
    borderWidth: 0.5,
    borderRadius: 5,
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
    // marginBottom: 15,
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
  contentScroll: {
    ...MarginStyle.marginT10,
    height: 250,
  },
});

export default SearchModal;

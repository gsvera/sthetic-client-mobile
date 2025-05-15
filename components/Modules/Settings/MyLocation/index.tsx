import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";
import { ThemeColorsSthetic } from "@/constants/Colors";
import StateAndMunicipalitySelect from "@/components/Shared/StateAndMunicipalitySelect";

type myLocationProps = {
  idUser: string;
  returnBack: () => void;
};

export const MyLocation = ({ idUser, returnBack }: myLocationProps) => {
  return (
    <View>
      <SubHeaderReturn subtitle="Mi Ubicación" handleReturn={returnBack} />
      <View style={localStyle.contentBody}>
        <ThemedText style={localStyle.textDescription}>
          Estos configuración sirven para realizar busquedas mas precisas cerca
          de su ubicación
        </ThemedText>
        <StateAndMunicipalitySelect idUser={idUser} />
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  contentBody: { width: "auto", padding: 10 },
  textDescription: {
    textAlign: "center",
    marginBottom: 10,
    color: ThemeColorsSthetic.text,
  },
});

export default MyLocation;

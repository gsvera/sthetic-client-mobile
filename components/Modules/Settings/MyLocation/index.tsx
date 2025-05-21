import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { View } from "react-native";
import MyLocationForm from "./MyLocationForm";

type myLocationProps = {
  idUser: string;
  returnBack: () => void;
};

export const MyLocation = ({ idUser, returnBack }: myLocationProps) => {
  return (
    <View>
      <SubHeaderReturn subtitle="Mi Ubicación" handleReturn={returnBack} />
      <MyLocationForm idUser={idUser} />
    </View>
  );
};

export default MyLocation;

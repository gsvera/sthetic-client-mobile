import { ThemedText } from "@/components/ThemedText";
import { TextStyle } from "@/constants/StyleComponents";
import { Platform, View } from "react-native";
import StartRating from "../ModalQualification/StartRating";
import { PLATFORM_TYPE } from "@/constants/Constants";

type globalRatingProps = {
  rating: number;
};

export const GlobalRating = ({ rating }: globalRatingProps) => {
  return (
    <>
      <View style={{ paddingTop: 5 }}>
        <ThemedText
          style={{
            ...TextStyle.fontGoldTitle,
            fontSize: 28,
            paddingTop: Platform.OS === PLATFORM_TYPE.IOS ? 5 : 0,
            marginRight: 10,
          }}
        >
          {rating.toFixed(1)}
        </ThemedText>
      </View>
      <View style={{ height: 30 }}>
        <StartRating rating={rating} sizeStart={22} />
      </View>
    </>
  );
};

export default GlobalRating;

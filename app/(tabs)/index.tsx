import { ThemedText } from "@/components/ThemedText";

import { Container } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    return (
        <SafeAreaView style={Container.container}>
            <ThemedText style={{color: 'black'}}>Bienvenido</ThemedText>
        </SafeAreaView>
    )
}
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function Swap () {


    return (
        <View className="w-full flex items-center align-middle justify-center h-full bg-black">
            <View className="flex border border-white">
                <View>
                    <Text className="text-white text-2xl ">Swap Tokens</Text>
                </View>
                <View className="bg-[#1E1E1E] p-12 rounded-2xl">
                    <Pressable className="p-3  bg-black rounded-2xl ">
                        <View className="flex flex-row items-center gap-4">
                            <Image className="size-12" src={"data:image/png;base64,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"} />
                            <Text className="text-white text-2xl">ETH</Text>
                        </View>
                    </Pressable> 
                                       
                </View>
            </View>
        </View>
    )

}

import { useState, useEffect, useCallback } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useWalletStore } from "@/stores/wallet-store"

interface WatchlistItem {
  address: string
  balance: number | null
  loading: boolean
}

export default function WatchlistScreen() {
  const router = useRouter()
  const favorites = useWalletStore((s) => s.favorites)
  const removeFavorite = useWalletStore((s) => s.removeFavorite)
  const isDevnet = useWalletStore((s) => s.isDevnet)

  const [items, setItems] = useState<WatchlistItem[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const RPC = isDevnet
    ? "https://api.devnet.solana.com"
    : "https://api.mainnet-beta.solana.com"

  const fetchBalances = useCallback(async () => {
    const results = await Promise.all(
      favorites.map(async (address) => {
        try {
          const res = await fetch(RPC, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "getBalance",
              params: [address],
            }),
          })
          const json = await res.json()
          return {
            address,
            balance: (json.result?.value || 0) / 1e9,
            loading: false,
          }
        } catch {
          return { address, balance: null, loading: false }
        }
      })
    )
    setItems(results)
  }, [favorites, RPC])

  useEffect(() => {
    if (favorites.length > 0) {
      setItems(
        favorites.map((a) => ({ address: a, balance: null, loading: true }))
      )
      fetchBalances()
    } else {
      setItems([])
    }
  }, [favorites, fetchBalances])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchBalances()
    setRefreshing(false)
  }

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <SafeAreaView className="flex-1 bg-[#0D0D12]" edges={["top"]}>
        <View className="flex-1 px-6 pt-4">
            <TouchableOpacity className="mb-4" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Text className="text-white text-[32px] font-bold mb-2">
            Watchlist
            </Text>

            <Text className="text-[#6B7280] text-[15px] mb-6">
            {favorites.length} wallet{favorites.length !== 1 ? "s" : ""} ·{" "}
            {isDevnet ? "Devnet" : "Mainnet"}
            </Text>

            {favorites.length === 0 ? (
            <View className="flex-1 justify-center items-center pb-[100px]">
                <Ionicons name="heart-outline" size={64} color="#2A2A35" />

                <Text className="text-white text-[20px] font-semibold mt-4">
                No Wallets Saved
                </Text>

                <Text className="text-[#6B7280] text-[14px] text-center mt-2 px-10">
                Search for a wallet and tap the heart to save it here.
                </Text>
            </View>
            ) : (
            <FlatList
                data={items}
                keyExtractor={(item) => item.address}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#14F195"
                    colors={["#14F195"]}
                />
                }
                renderItem={({ item }) => (
                <TouchableOpacity
                    className="bg-[#16161D] rounded-[14px] border border-[#2A2A35] p-4 mb-[10px] flex-row justify-between items-center"
                    onLongPress={() => {
                    Alert.alert(
                        "Remove from Watchlist?",
                        shortenAddress(item.address),
                        [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Remove",
                            style: "destructive",
                            onPress: () => removeFavorite(item.address),
                        },
                        ]
                    )
                    }}
                >
                    <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-10 h-10 rounded-[10px] bg-[#1E1E28] items-center justify-center">
                        <Ionicons name="wallet" size={20} color="#14F195" />
                    </View>

                    <Text
                        className="text-[#9945FF] text-[14px] font-mono"
                        numberOfLines={1}
                    >
                        {shortenAddress(item.address)}
                    </Text>
                    </View>

                    <View className="items-end">
                    {item.loading ? (
                        <ActivityIndicator size="small" color="#14F195" />
                    ) : item.balance !== null ? (
                        <Text className="text-[#14F195] text-[16px] font-semibold">
                        {item.balance.toFixed(4)} SOL
                        </Text>
                    ) : (
                        <Text className="text-[#EF4444] text-[14px]">
                        Error
                        </Text>
                    )}
                    </View>
                </TouchableOpacity>
                )}
            />
            )}
        </View>
    </SafeAreaView>

  )
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0D0D12",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 15,
    marginBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 40,
  },
  card: {
    backgroundColor: "#16161D",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2A2A35",
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#1E1E28",
    alignItems: "center",
    justifyContent: "center",
  },
  cardAddress: {
    color: "#9945FF",
    fontSize: 14,
    fontFamily: "monospace",
  },
  cardRight: {
    alignItems: "flex-end",
  },
  cardBalance: {
    color: "#14F195",
    fontSize: 16,
    fontWeight: "600",
  },
  cardError: {
    color: "#EF4444",
    fontSize: 14,
  },
})

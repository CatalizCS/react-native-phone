import React from "react";
import { StyleSheet, Text, View, FlatList, ListRenderItem } from "react-native";
import ContactThumbnail from "@/components/ContactThumbnail";
import { NavigationProp } from "@react-navigation/native";
import { useFavorites } from "@/context/FavoritesContext";
import { Contact } from "@/utility/api";

const keyExtractor = ({ phone }: Contact) => phone;

export default function FavoritesScreen({
	navigation,
}: {
	navigation: NavigationProp<any>;
}) {
	const { favorites } = useFavorites();

	const renderFavoriteThumbnail: ListRenderItem<Contact> = ({ item }) => {
		const { name, picture, phone } = item;
		return (
			<ContactThumbnail
				avatar={picture.large}
				onPress={() => navigation.navigate("Profile", { contact: item })}
				name={`${name.first} ${name.last}`}
				phone={phone}
				textColor={"black"}
			/>
		);
	};

	return (
		<View style={styles.container}>
			{favorites.length === 0 ? (
				<Text style={styles.empty}>You have no favorites yet</Text>
			) : (
				<FlatList
					data={favorites}
					keyExtractor={keyExtractor}
					numColumns={3}
					contentContainerStyle={styles.list}
					renderItem={renderFavoriteThumbnail}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		justifyContent: "center",
		flex: 1,
	},
	list: {
		alignItems: "center",
	},
	empty: {
		textAlign: "center",
		fontSize: 18,
	},
});

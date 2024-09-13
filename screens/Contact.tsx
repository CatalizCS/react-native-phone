import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { ContactListItem } from "../components/contactListItem";
import { Contact, fetchContacts } from "../utility/api";

export default function ContactScreen({ navigation }: any) {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const keyExtractor = ({ phone }: { phone: string }) => phone;

	useEffect(() => {
		console.log("Fetching contacts...");
		fetchContacts()
			.then((contacts: Contact[]) => {
				setContacts(contacts);
				setLoading(false);
				setError(false);
			})
			.catch(() => {
				setLoading(false);
				setError(true);
			});
	}, []);

	const contactData = [
		...contacts.map((contact) => ({
			...contact,
			name: {
				...contact.name,
			},
			avatar: contact.picture.medium,
			phone: contact.phone,
		})),
	];


	const renderContact = ({ item }: { item: Contact }) => {
		const { name, picture, phone } = item;

		return (
			<ContactListItem
				name={name ? `${name.title}.${name.first} ${name.last}` : ""} // Fixed name
				avatar={{ uri: picture.medium }}
				phone={phone}
				onPress={() => navigation.navigate("Profile", { contact: item })}
			/>
		);
	};

	if (loading) {
		return <Text>Loading...</Text>;
	}

	if (error) {
		return <Text>Error...</Text>;
	}

	return (
		<View style={styles.container}>
			{loading && <ActivityIndicator color={"blue"} size={"large"} />}
			{error && <Text>Error...</Text>}
			{!loading && !error && (
				<FlatList
					data={contactData}
					renderItem={renderContact}
					keyExtractor={keyExtractor}
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
});

import React, { createContext, useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useColorScheme, View } from "react-native";

import ContactScreen from "../screens/Contact";
import ProfileScreen from "@/screens/Profile";
import FavoritesScreen from "@/screens/Favorites";
import { colors } from "@/utility/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import UserScreen from "@/screens/User";
import OptionsScreen from "@/screens/Options";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const lightTheme = {
	background: "white",
	text: "black",
	primary: "white",
};

const darkTheme = {
	background: "black",
	text: "white",
	primary: "coral",
};

const headerStyle: any = (theme: any) => {
	return {
		headerTintColor: theme.text,
		headerStyle: {
			backgroundColor: theme.primary,
			height: 40,
		},
		headerTitleAlign: "center",
		headerTitleStyle: { fontWeight: "bold", fontSize: 24, height: 50 },
	};
};

const ThemeContext = createContext({
	theme: lightTheme,
	toggleTheme: () => {},
});

const getTabBarIcon = (iconName: string) => {
	return ({ color }: { color: string }) => (
		<MaterialIcons name={iconName} color={color} size={26} />
	);
};

function ContactScreens() {
	const { theme } = useContext(ThemeContext);

	return (
		<Stack.Navigator
			initialRouteName="Contacts"
			screenOptions={headerStyle(theme)}
		>
			<Stack.Screen
				name="Contacts"
				component={ContactScreen}
				options={{ title: "Contacts" }}
			/>
			<Stack.Screen
				name="Profile"
				component={ProfileScreen}
				options={({ route }: { route: any }) => {
					const { contact } = route.params;
					const name = `${contact.name.title} ${contact.name.first} ${contact.name.last}`;
					return {
						title: name,
						headerTintColor: theme.text,
						headerStyle: { backgroundColor: theme.primary },
					};
				}}
			/>
		</Stack.Navigator>
	);
}

function FavoritesScreens() {
	const { theme } = useContext(ThemeContext);

	return (
		<Stack.Navigator
			initialRouteName="Favorites"
			screenOptions={headerStyle(theme)}
		>
			<Stack.Screen
				name="Favorites"
				component={FavoritesScreen}
				options={{ title: "Favorites" }}
			/>
			<Stack.Screen
				name="Profile"
				component={ProfileScreen}
				options={({ route }: { route: any }) => {
					const { contact } = route.params;
					const name = `${contact.name.title} ${contact.name.first} ${contact.name.last}`;
					return {
						title: name,
						headerTintColor: theme.text,
						headerStyle: { backgroundColor: theme.primary },
					};
				}}
			/>
			<Stack.Screen
				name="Options"
				component={OptionsScreen}
				options={{ title: "Options" }}
			/>
		</Stack.Navigator>
	);
}

function UserScreens({ navigation }: any) {
	const { theme } = useContext(ThemeContext);

	return (
		<Stack.Navigator initialRouteName="User" screenOptions={headerStyle(theme)}>
			<Stack.Screen
				name="User"
				component={UserScreen}
				options={{
					headerTitle: "Me",
					headerTintColor: theme.text,
					headerStyle: {
						backgroundColor: theme.primary,
						height: 40,
					},
					headerRight: () => (
						<View
							style={{
								height: 30,
								justifyContent: "center",
								marginRight: 10,
								width: 40,
							}}
						>
							<MaterialIcons
								name="settings"
								size={30}
								style={{
									color: theme.text,
								}}
								onPress={() => {
									navigation.navigate("Options", {
										name: "Options",
										headerTintColor: theme.text,
										headerStyle: {
											backgroundColor: theme.primary,
											height: 40,
										},
										headerTitleAlign: "center",
										headerTitleStyle: {
											fontWeight: "bold",
											fontSize: 24,
										},
									});
								}}
							/>
						</View>
					),
				}}
			/>
			<Stack.Screen
				name="Options"
				component={OptionsScreen}
				options={{
					title: "Options",
					headerTintColor: theme.text,
					headerStyle: {
						backgroundColor: theme.primary,
						height: 50,
					},
					headerTitleAlign: "center",
					headerTitleStyle: { fontWeight: "bold", fontSize: 24, height: 50 },
				}}
			/>
		</Stack.Navigator>
	);
}

export default function AppNavigator({ navigation }: any) {
	const colorScheme = useColorScheme();
	const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
	const theme = isDarkMode ? darkTheme : lightTheme;

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			<NavigationContainer independent={true}>
				<Tab.Navigator
					initialRouteName="ContactsScreens"
					barStyle={{
						backgroundColor: theme.primary,
						height: 65,
						alignContent: "center",
					}}
					labeled={false}
					activeColor={theme.text}
					inactiveColor={colors.gray}
				>
					<Tab.Screen
						name="ContactScreens"
						component={ContactScreens}
						options={{
							tabBarIcon: getTabBarIcon("list"),
						}}
					/>
					<Tab.Screen
						name="FavoritesScreens"
						component={FavoritesScreens}
						options={{
							tabBarIcon: getTabBarIcon("star"),
						}}
					/>
					<Tab.Screen
						name="UserScreen"
						component={UserScreens}
						options={{
							tabBarIcon: getTabBarIcon("person"),
						}}
					/>
				</Tab.Navigator>
			</NavigationContainer>
		</ThemeContext.Provider>
	);
}

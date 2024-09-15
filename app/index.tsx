import React, { createContext, useContext, useState } from "react";
import {
	NavigationContainer,
	useNavigationState,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Dimensions, useColorScheme } from "react-native";
import { Audio } from "expo-av";
import { Platform } from "react-native";

import { FavoritesProvider } from "@/context/FavoritesContext";

import ContactScreen from "@/screens/Contact";
import ProfileScreen from "@/screens/Profile";
import FavoritesScreen from "@/screens/Favorites";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import UserScreen from "@/screens/User";
import OptionsScreen from "@/screens/Options";
import CallScreen from "@/screens/Call";
import SoundContext from "@/context/SoundContext";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const lightTheme = {
	background: "#FFFFFF",
	text: "#333333",
	primary: "#6200EE",
	accent: "#03DAC6",
	secondary: "#018786",
	surface: "#F5F5F5",
	error: "#B00020",
	transparent: "rgba(0,0,0,0)",
};

const darkTheme = {
	background: "#121212",
	text: "#E1E1E1",
	primary: "#BB86FC",
	accent: "#03DAC6",
	secondary: "#03DAC6",
	surface: "#1E1E1E",
	error: "#CF6679",
	transparent: "rgba(0,0,0,0)",
};

const headerStyle: any = (theme: any) => {
	const { width } = Dimensions.get("window");
	return {
		headerTintColor: theme.text,
		headerStyle: {
			backgroundColor: theme.surface,
			height: width > 600 ? 100 : 50,
			shadowColor: "rgba(0,0,0,0.1)",
			shadowOpacity: 0.25,
			shadowOffset: { width: 0, height: 2 },
			shadowRadius: 4,
		},
		headerTitleAlign: "center",
		headerTitleStyle: {
			fontWeight: "bold",
			fontSize: 24,
			color: theme.primary,
		},
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

function UserScreens() {
	const { theme } = useContext(ThemeContext);

	return (
		<Stack.Navigator initialRouteName="User" screenOptions={headerStyle(theme)}>
			<Stack.Screen
				name="User"
				component={UserScreen}
				options={{
					headerTitle: "Me",
					headerStyle: {
						backgroundColor: theme.primary,
						height: 40,
					},
				}}
			/>
			<Stack.Screen
				name="Options"
				component={OptionsScreen}
				options={{
					title: "Options",
					headerTintColor: theme.error,
					headerStyle: {
						backgroundColor: theme.primary,
						height: 40,
					},
					headerTitleAlign: "center",
					headerTitleStyle: { fontWeight: "bold", fontSize: 24, height: 50 },
				}}
			/>
		</Stack.Navigator>
	);
}

function TabNavigator() {
	const { theme } = useContext(ThemeContext);
	const state = useNavigationState((state) => state);
	const isCallActive = state.routes[state.index].name === "Call";

	const getTabBarIcon = (iconName: string, focused: boolean) => {
		return ({ color }: { color: string }) => (
			<MaterialIcons
				name={iconName}
				color={focused ? theme.primary : theme.secondary}
				size={26}
			/>
		);
	};

	return (
		<Tab.Navigator
			initialRouteName="ContactsScreens"
			barStyle={{
				backgroundColor: theme.surface,
				height: 65,
				alignContent: "center",
				display: isCallActive ? "none" : "flex",
			}}
			screenOptions={({ route }) => ({
				tabBarLabel: route.name,
			})}
			labeled={false}
			activeColor={theme.primary}
			inactiveColor={theme.secondary}
		>
			<Tab.Screen
				name="ContactScreens"
				component={ContactScreens}
				options={{
					tabBarIcon: ({ focused, color }) =>
						getTabBarIcon("list", focused)({ color }),
					tabBarColor: theme.surface,
				}}
			/>
			<Tab.Screen
				name="FavoritesScreens"
				component={FavoritesScreens}
				options={{
					tabBarIcon: ({ focused, color }) =>
						getTabBarIcon("star", focused)({ color }),
					tabBarColor: theme.surface,
				}}
			/>
			<Tab.Screen
				name="UserScreen"
				component={UserScreens}
				options={{
					tabBarIcon: ({ focused, color }) =>
						getTabBarIcon("person", focused)({ color }),
					tabBarColor: theme.surface,
				}}
			/>
		</Tab.Navigator>
	);
}
function MainNavigation() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="MainTabs" component={TabNavigator} />
			<Stack.Screen
				name="Call"
				component={CallScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
}

export default function AppNavigator() {
	const colorScheme = useColorScheme();
	const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
	const theme = isDarkMode ? darkTheme : lightTheme;

	React.useEffect(() => {
		SoundContext.getInstance();
	}, []);

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	return (
		<FavoritesProvider>
			<ThemeContext.Provider value={{ theme, toggleTheme }}>
				<NavigationContainer independent={true}>
					<MainNavigation />
				</NavigationContainer>
			</ThemeContext.Provider>
		</FavoritesProvider>
	);
}
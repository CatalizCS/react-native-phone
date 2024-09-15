import SoundContext from "@/context/SoundContext";
import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Vibration,
	Platform,
} from "react-native";
import { Audio } from "expo-av";

export default function CallScreen({ route, navigation }: any) {
	const { callerName, callerNumber, avatar } = route.params;
	const [connecting, setConnecting] = useState(true);
	const [calling, setCalling] = useState(true);
	const [callDuration, setCallDuration] = useState(0);
	const [callEnd, setCallEnd] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const cancel = setTimeout(() => {
			setError(true);
			setTimeout(() => {
				navigation.popToTop();
				navigation.navigate("Contacts");
			}, 3000);
		}, 60000);

		if (Platform.OS === "web") {
			clearTimeout(cancel);
			setCalling(false);
			Vibration.vibrate([500, 500, 500], false);
			const timer = setInterval(() => {
				setCallDuration((prevDuration) => prevDuration + 1);
			}, 1000);
			return () => clearInterval(timer);
		} else {
			const playRingtone = async () => {
				await Audio.requestPermissionsAsync();
				await Audio.setAudioModeAsync({
					staysActiveInBackground: true,
					shouldDuckAndroid: false,
					playThroughEarpieceAndroid: false,
					allowsRecordingIOS: false,
					playsInSilentModeIOS: true,
				});
				const ringtone = await Audio.Sound.createAsync(
					require("../sounds/end.mp3"),
					{
						shouldPlay: true,
					}
				);
				clearTimeout(cancel);
				setConnecting(false);
				Vibration.vibrate([500, 500, 500], false);
				setCalling(false);
				await ringtone.sound?.stopAsync();
				const timer = setInterval(() => {
					setCallDuration((prevDuration) => prevDuration + 1);
				}, 1000);
				return () => clearInterval(timer);
			};
			playRingtone();
		}
	}, []);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	return (
		<View style={styles.container}>
			<View style={styles.callerInfo}>
				<Image source={{ uri: avatar }} style={styles.callerImage} />
				<Text style={styles.callerName}>{callerName}</Text>
				<Text style={styles.callerNumber}>{callerNumber}</Text>
				{error && <Text style={styles.callDuration}>No money left :(</Text>}
				{!error && connecting && (
					<Text style={styles.callDuration}>Connecting...</Text>
				)}
				{!error && calling && !connecting && (
					<Text style={styles.callDuration}>Calling...</Text>
				)}
				{!error && !connecting && !calling && (
					<Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
				)}
				{!error && !connecting && callEnd && (
					<Text style={styles.callDuration}>Call Ended</Text>
				)}
			</View>

			<View style={styles.actionButtons}>
				<TouchableOpacity style={styles.actionButton}>
					<Image
						source={{ uri: "https://img.icons8.com/ios/452/video-call.png" }}
						style={{ width: 50, height: 50, tintColor: "white" }}
					/>
					<Text style={styles.buttonText}>Video</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton}>
					<Image
						source={{ uri: "https://img.icons8.com/ios/452/microphone.png" }}
						style={{ width: 50, height: 50, tintColor: "white" }}
					/>
					<Text style={styles.buttonText}>Mute</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton}>
					<Image
						source={{
							uri: "https://img.icons8.com/ios/452/high-volume--v1.png",
						}}
						style={{ width: 50, height: 50, tintColor: "white" }}
					/>
					<Text style={styles.buttonText}>Speaker</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity
				style={styles.endCallButton}
				onPress={() => {
					setCallEnd(true);
					if (Platform.OS === "web") {
						Vibration.vibrate([500, 500, 500], false);
						setTimeout(() => {
							navigation.popToTop();
							navigation.navigate("Contacts");
						}, 5000);
					} else {
						const playEndtone = async () => {
							await Audio.requestPermissionsAsync();
							await Audio.setAudioModeAsync({
								staysActiveInBackground: true,
								shouldDuckAndroid: false,
								playThroughEarpieceAndroid: false,
								allowsRecordingIOS: false,
								playsInSilentModeIOS: true,
							});
							const endtone = await Audio.Sound.createAsync(
								require("../sounds/end.mp3"),
								{
									shouldPlay: true,
								}
							);
							await endtone.sound?.unloadAsync();
							setTimeout(() => {
								navigation.popToTop();
								navigation.navigate("Contacts");
							}, 2000);
						};

						playEndtone();
					}
				}}
			>
				<Text style={styles.endCallText}>End Call</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0d1117",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 50,
	},
	callerInfo: {
		alignItems: "center",
	},
	callerImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 20,
	},
	callerName: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#c9d1d9",
		marginBottom: 10,
	},
	callerNumber: {
		fontSize: 18,
		color: "#8b949e",
		marginBottom: 10,
	},
	callDuration: {
		fontSize: 16,
		color: "#8b949e",
	},
	actionButtons: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
	},
	actionButton: {
		alignItems: "center",
	},
	buttonText: {
		color: "#f0f6fc",
		marginTop: 5,
	},
	endCallButton: {
		backgroundColor: "#da3633",
		paddingVertical: 15,
		paddingHorizontal: 30,
		borderRadius: 30,
	},
	endCallText: {
		color: "#f0f6fc",
		fontSize: 18,
		fontWeight: "bold",
	},
});

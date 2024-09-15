import { Audio } from "expo-av";
import { Platform } from "react-native";

export default class SoundContext {
	private ringtone: Audio.Sound | undefined;
	private endtone: Audio.Sound | undefined;
	private static instance: SoundContext | null = null;

	private constructor() {
		// Initialization logic, like loading sounds
		this.load();
	}

	public static getInstance(): SoundContext {
		if (!SoundContext.instance) {
			SoundContext.instance = new SoundContext();
		}
		return SoundContext.instance;
	}

	private async load() {
		if (Platform.OS === "web") {
			// Web audio loading using HTMLAudioElement
			console.log("Ohno, web audio loading not implemented yet :(");
		} else {
			await Audio.requestPermissionsAsync();
			await Audio.setAudioModeAsync({
				staysActiveInBackground: true,
				shouldDuckAndroid: false, 
				playThroughEarpieceAndroid: false,
				allowsRecordingIOS: false,
				playsInSilentModeIOS: true,
			});

			// Native (iOS/Android) audio loading using expo-av
			const ringtoneResult = await Audio.Sound.createAsync(
				require("../sounds/ring.mp3"),
				{ shouldPlay: false }
			);
			this.ringtone = ringtoneResult.sound;

			const endtoneResult = await Audio.Sound.createAsync(
				require("../sounds/end.mp3"),
				{ shouldPlay: false }
			);
			this.endtone = endtoneResult.sound;

			console.log("Sounds loaded for mobile");
		}
	}

	public getRingtone() {
		return this.ringtone;
	}

	public getEndtone() {
		return this.endtone;
	}
}

import React, { createContext, useState, useContext, ReactNode } from "react";
import { Contact } from "@/utility/api";

interface FavoritesContextType {
	favorites: Contact[];
	addFavorite: (contact: Contact) => void;
	removeFavorite: (phone: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
	undefined
);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [favorites, setFavorites] = useState<Contact[]>([]);

	const addFavorite = (contact: Contact) => {
		setFavorites((prevFavorites) => [...prevFavorites, contact]);
	};

	const removeFavorite = (phone: string) => {
		setFavorites((prevFavorites) =>
			prevFavorites.filter((c) => c.phone !== phone)
		);
	};

	return (
		<FavoritesContext.Provider
			value={{ favorites, addFavorite, removeFavorite }}
		>
			{children}
		</FavoritesContext.Provider>
	);
};

export const useFavorites = () => {
	const context = useContext(FavoritesContext);
	if (context === undefined) {
		throw new Error("useFavorites must be used within a FavoritesProvider");
	}
	return context;
};

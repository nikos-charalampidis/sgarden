import { create } from "zustand";
import { persist } from "zustand/middleware";

export default create(persist(
	(setState) => ({
		user: {},
		setUser: (user) => setState({ user }),
		defaultPageSize: 5,
		setDefaultPageSize: (defaultPageSize) => setState({ defaultPageSize }),
		darkMode: false,
		toggleDarkMode: () => setState((state) => ({ darkMode: !state.darkMode })),
		favorites: [],
		toggleFavorite: (path) => setState((state) => ({
			favorites: state.favorites.includes(path)
				? state.favorites.filter((p) => p !== path)
				: [...state.favorites, path]
		})),
	}),
	{
		name: "sgarden",
	},
));

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
	}),
	{
		name: "sgarden",
	},
));

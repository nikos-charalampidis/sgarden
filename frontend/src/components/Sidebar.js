import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Menu, MenuItem, Typography } from "@mui/material";
import Image from "mui-image";
import { ExpandMore } from "@mui/icons-material";

import Accordion from "./Accordion.js";

import { jwt } from "../utils/index.js";
import useGlobalState from "../use-global-state.js";

const useStyles = makeStyles((theme) => ({
	sidebar: {
		height: "100%",
		position: "absolute",
		backgroundColor: theme.palette.secondary.main,
		color: "white",
		overflow: "auto",
	},
}));

const ButtonWithText = ({ text, icon, more, handler, testId }) => (
	<span key={text}>
		{!more
		&& (
			<Button key={text} data-testid={testId} sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", padding: "8px 40px 8px 16px" }} onClick={(event) => handler(event)}>
				{icon && (<Image src={icon} alt={text} fit="contain" width="25px" />)}
				<Typography align="center" color="white.main" fontSize="medium" ml={1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
					{text}
					{more && <ExpandMore />}
				</Typography>
			</Button>
		)}
		{more
		&& (
			<Accordion
				key={text}
				title={(
					<Grid item sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
						<Image src={icon} alt={text} fit="contain" width="25px" />
						<Typography align="center" color="white.main" fontSize="medium" ml={1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
							{text}
						</Typography>
					</Grid>
				)}
				content={(
					<Grid container flexDirection="column" width="100%">
						{more.map((el) => (
							<Button key={el.title} color="white" onClick={el.handler}>
								<Typography sx={{ textTransform: "capitalize" }}>{el.title}</Typography>
							</Button>
						))}
					</Grid>
				)}
				alwaysExpanded={false}
				titleBackground="transparent"
				expandIconColor="white"
			/>
		)}
	</span>
);

const ButtonSimple = ({ text, icon, handler, ind }) => (
	<Button key={text} sx={{ minWidth: "30px!important", padding: "0px", marginTop: (ind === 0) ? "0px" : "10px" }} onClick={(event) => handler(event)}>
		<Image src={icon} alt={text} fit="contain" width="30px" />
	</Button>
);

const Sidebar = ({ isSmall: sidebarIsSmall }) => {
	const [isSmall, setIsSmall] = useState(false);
	const navigate = useNavigate();
	const classes = useStyles();

	const { favorites } = useGlobalState();

	const isAdmin = jwt.isAdmin();

	useEffect(() => setIsSmall(sidebarIsSmall), [sidebarIsSmall]);

	const buttons = [
		...(isAdmin ? [{
			text: "Users",
			path: "/users",
			handler: () => {
				navigate("/users");
			},
		}] : []),
		{
			text: "Overview",
			path: "/dashboard",
			handler: () => {
				navigate("/dashboard");
			},
		},
		{
			text: "Analytics",
			path: "/dashboard1",
			handler: () => {
				navigate("/dashboard1");
			},
		},
		{
			text: "Insights",
			path: "/dashboard2",
			handler: () => {
				navigate("/dashboard2");
			},
		},
	];

	return (
		<div className={classes.sidebar} style={{ width: (isSmall) ? "50px" : "200px", padding: (isSmall) ? "20px 5px" : "20px 5px", textAlign: "center" }}>
			{!isSmall && favorites.length > 0 && (
				<div data-testid="sidebar-favorites-section">
					<Typography variant="overline" color="white.main" display="block" align="left" sx={{ pl: 2, mt: 2, mb: 1, opacity: 0.7 }}>
						Favorites
					</Typography>
					{favorites.map((favPath) => {
						const btn = buttons.find((b) => b.path === favPath);
						return btn ? (
							<ButtonWithText
								key={"fav-" + btn.text}
								icon={btn.icon}
								text={btn.text}
								handler={btn.handler}
								more={btn.more}
								testId={"sidebar-favorite" + favPath.replace("/", "-")}
							/>
						) : null;
					})}
				</div>
			)}
			{!isSmall && buttons.map((button) => (
				<ButtonWithText
					key={button.text}
					icon={button.icon}
					text={button.text}
					handler={button.handler}
					more={button.more}
				/>
			))}
			{isSmall && buttons.map((button, ind) => (
				<ButtonSimple
					key={button.text}
					icon={button.icon}
					text={button.text}
					handler={button.handler}
					more={button.more}
					ind={ind}
				/>
			))}
		</div>
	);
};

export default Sidebar;

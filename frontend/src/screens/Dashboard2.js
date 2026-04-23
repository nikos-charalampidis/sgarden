import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import exportCsv from "../utils/export-csv.js";
import Dropdown from "../components/Dropdown.js";
import Card from "../components/Card.js";
import Plot from "../components/Plot.js";

import { getData } from "../api/index.js";

const availableRegions = ["Thessaloniki", "Athens", "Patras"];

const Dashboard = () => {
    const [selectedRegion, setSelectedRegion] = useState("Thessaloniki");
    const [data, setData] = useState({ quarterlySalesDistribution: {}, budgetVsActual: {}, timePlot: {} });

    useEffect(() => {
        getData().then((tempData) => {
            const { success, quarterlySalesDistribution, budgetVsActual, timePlot } = tempData;

            if (success) {
                setData({ quarterlySalesDistribution, budgetVsActual, timePlot });
            }
        });
    }, [selectedRegion]);

    return (
        <Grid container py={2} flexDirection="column">
            <Typography variant="h4" gutterBottom color="white.main">
                Insights
            </Typography>

            <Grid item style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px" }}>
                <Typography variant="body1" style={{ marginRight: "10px" }} color="white.main">Region:</Typography>
                <Dropdown
                    items={availableRegions.map((region) => ({ value: region, text: region }))}
                    value={selectedRegion}
                    onChange={(event) => setSelectedRegion(event.target.value)}
                />
            </Grid>

            <Grid container spacing={2}>
                <Grid item sm={12} md={6}>
                    <Card
                        title="Quarterly Sales Distribution"
                        onExport={() => exportCsv("quarterly-sales-distribution", [
                            { y: data?.quarterlySalesDistribution?.Q1, title: "Q1" },
                            { y: data?.quarterlySalesDistribution?.Q2, title: "Q2" },
                            { y: data?.quarterlySalesDistribution?.Q3, title: "Q3" },
                        ])}
                        exportTestId="export-csv-quarterly-sales"
                    >
                        <Plot
                            data={[
                                {
                                    title: "Q1",
                                    y: data?.quarterlySalesDistribution?.Q1,
                                    type: "box",
                                    color: "primary",
                                },
                                {
                                    title: "Q2",
                                    y: data?.quarterlySalesDistribution?.Q2,
                                    type: "box",
                                    color: "secondary",
                                },
                                {
                                    title: "Q3",
                                    y: data?.quarterlySalesDistribution?.Q3,
                                    type: "box",
                                    color: "third",
                                },
                            ]}
                            showLegend={false}
                            displayBar={false}
                            height="300px"
                            marginBottom="40"
                        />
                    </Card>
                </Grid>
                <Grid item sm={12} md={6}>
                    <Card
                        title="Budget vs Actual Spending"
                        onExport={() => exportCsv("budget-vs-actual", [
                            { x: ["January", "February", "March", "April", "May", "June"], y: Object.values(data?.budgetVsActual || {}).map((m) => m.budget), title: "Budget" },
                            { x: ["January", "February", "March", "April", "May", "June"], y: Object.values(data?.budgetVsActual || {}).map((m) => m.actual), title: "Actual" },
                            { x: ["January", "February", "March", "April", "May", "June"], y: Object.values(data?.budgetVsActual || {}).map((m) => m.forecast), title: "Forecast" },
                        ])}
                        exportTestId="export-csv-budget-vs-actual"
                    >
                        <Plot
                            data={[
                                {
                                    x: ["January", "February", "March", "April", "May", "June"],
                                    y: Object.values(data?.budgetVsActual).map(month => month.budget),
                                    type: "bar",
                                    color: "primary",
                                    title: "Budget",
                                },
                                {
                                    x: ["January", "February", "March", "April", "May", "June"],
                                    y: Object.values(data?.budgetVsActual).map(month => month.actual),
                                    type: "bar",
                                    color: "secondary",
                                    title: "Actual",
                                },
                                {
                                    x: ["January", "February", "March", "April", "May", "June"],
                                    y: Object.values(data?.budgetVsActual).map(month => month.forecast),
                                    type: "bar",
                                    color: "third",
                                    title: "Forecast",
                                },
                            ]}
                            showLegend={true}
                            displayBar={false}
                            height="300px"
                            marginBottom="40"
                        />
                    </Card>
                </Grid>
                <Grid item sm={12}>
                    <Card
                        title="Performance Over Time"
                        onExport={() => exportCsv("performance-over-time", [
                            { x: Array.from({ length: 20 }, (_, i) => i + 1), y: data?.timePlot?.projected, title: "Projected" },
                            { x: Array.from({ length: 20 }, (_, i) => i + 1), y: data?.timePlot?.actual, title: "Actual" },
                            { x: Array.from({ length: 20 }, (_, i) => i + 1), y: data?.timePlot?.historicalAvg, title: "Historical Avg" },
                        ])}
                        exportTestId="export-csv-performance"
                    >
                        <Plot
                            data={[
                                {
                                    title: "Projected",
                                    x: Array.from({ length: 20 }, (_, i) => i + 1),
                                    y: data?.timePlot?.projected,
                                    type: "line",
                                    color: "primary",
                                },
                                {
                                    title: "Actual",
                                    x: Array.from({ length: 20 }, (_, i) => i + 1),
                                    y: data?.timePlot?.actual,
                                    type: "line",
                                    color: "secondary",
                                },
                                {
                                    title: "Historical Avg",
                                    x: Array.from({ length: 20 }, (_, i) => i + 1),
                                    y: data?.timePlot?.historicalAvg,
                                    type: "line",
                                    color: "third",
                                },
                            ]}
                            showLegend={true}
                            displayBar={false}
                            height="300px"
                            marginBottom="40"
                        />
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;

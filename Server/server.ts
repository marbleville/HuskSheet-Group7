import express from "express";
const app = express();
const PORT: Number = 3000;

app.get("/api/v1/register", (req, res) => {
	res.sendStatus(401);
});

app.get("/api/v1/getPublishers", (req, res) => {
	res.sendStatus(401);
});

app.post("/api/v1/createSheet", (req, res) => {
	res.sendStatus(401);
});

app.post("/api/v1/getSheets", (req, res) => {
	res.sendStatus(401);
});

app.post("/api/v1/deleteSheet", (req, res) => {
	res.sendStatus(401);
});

app.post("/api/v1/getUpdatesForSubscription", (req, res) => {
	res.sendStatus(401);
});

app.post("/api/v1/getUpdatesForPublished", (req, res) => {
	res.sendStatus(401);
});

app.post("/api/v1/updatePublished", (req, res) => {
	res.sendStatus(401);
});

app.post("/api/v1/updateSubscription", (req, res) => {
	res.sendStatus(401);
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

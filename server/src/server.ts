import app from "./app";
const PORT: Number = 3000;

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}/`);
});

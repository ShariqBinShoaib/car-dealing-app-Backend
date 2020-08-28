const express = require("express");
const app = express();
// const config = require("config");

// if (!config.get("jwtPrivateKey")) {
//   console.error("FATAL ERROR: jwtPrivateKey is not defined.");
//   process.exit(1);
// }

app.get("/test", (req, res) => {
  res.send("Hello World");
});

require("./startup/db")();
require("./startup/routes")(app);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}...`));

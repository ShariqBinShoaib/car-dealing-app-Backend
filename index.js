const express = require("express");
const app = express();

app.get("/test", (req, res) => {
  res.send("Hello World");
});

require("./startup/db")();
require("./startup/routes")(app);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is running on port ${port}...`));

const { app } = require('./server.js');
const busiConfig = require("./app/config/business.config.js");

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.\nAPI documentation: http://${busiConfig.DOMAIN}:${PORT}/api-docs`);
});
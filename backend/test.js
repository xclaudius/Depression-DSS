const bcrypt = require("bcryptjs");

bcrypt.compare('Olumide', '$2b$10$R05BK78e.aySeTeHfRDBmeFbXNVAm/0AkqsdYwlNs/cPWXTH9irji').then(res => console.log(res))
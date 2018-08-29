module.exports = {
    name: "medasAPI",
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || "http://localhost:3000",
    db:{
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password : process.env.DB_PSW || '',
        port : process.env.DB_PORT || 3306, //port mysql
        // database:process.env.DB_NAME || 'eclinic_samc'
        database:process.env.DB_NAME || 'qqs'
    }
}
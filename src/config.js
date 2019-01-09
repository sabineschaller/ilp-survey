const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'
const ILP_SERVER = process.env.ILP_SERVER || 'ilpsurvey.localtunnel.me'
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'test'

module.exports = {
    PORT,
    HOST,
    ILP_SERVER,
    AUTH_TOKEN
}
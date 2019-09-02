const request = require('request')
const forecast = (lat,long,callback) => {
    const url = 'https://api.darksky.net/forecast/ada3d0daf48ae2f577e17dadd6a11f5a/'+lat+','+long+'?units=si'
    request({url, json:true}, (error,{body}) => {
        if (error) {
            callback('Unable to connect to Weather Services!!')
        } else if(body.error) {
            callback('Unable to find the location!!')
        } else {
            callback(undefined,{
                summary:body.daily.data[0].summary,
                temp:body.currently.temperature,
                precip:body.currently.precipProbability
            })
        }
    })
}

module.exports = forecast
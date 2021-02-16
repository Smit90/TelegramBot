const Promise = require('bluebird')
var TelegramBot = require('node-telegram-bot-api');
var request = require('request')
require('dotenv').config()


const Weather_key = process.env.WEATHER_API_KEY
const Movie_key = process.env.MOVIE_API_KEY
const Bot_token = process.env.TELEGRAM_BOT_TOKEN

Promise.config({
    cancellation: true
})
var token = Bot_token;
// Setup polling way
var bot = new TelegramBot(token, { polling: true });

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];
    bot.sendMessage(fromId, resp);
});

bot.onText(/\/movie (.+)/, function (msg, match) {
    var movie = match[1];
    var fromId = msg.from.id;
    request(`http://www.omdbapi.com/?apikey=${Movie_key}&t=${movie}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            bot.sendMessage(fromId, 'Looking for ' + movie + '', { parse_mode: 'MarkdownV2' })
                .then(function (msg) {
                    var res = JSON.parse(body)

                    bot.sendPhoto(fromId, res.Poster, { caption: '\nTitle: ' + res.Title + '\nYear: ' + res.Year + '\nRated: ' + res.Rated + '\nReleased: ' + res.Released })
                })
        }
    })
});
bot.onText(/\/weather (.+)/, function (msg, match) {
    var weather = match[1];
    var fromId = msg.from.id;
    request(`https://api.weatherapi.com/v1/current.json?key=${Weather_key}&q=${weather}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            bot.sendMessage(fromId, 'Currant Status of ' + weather + '', { parse_mode: 'MarkdownV2' })
                .then(function (msg) {
                    var res = JSON.parse(body)
                    const city_name = res.location.name
                    const state_name = res.location.region
                    const country_name = res.location.country
                    const local_time = res.location.localtime
                    const temp_c = parseInt(res.current.temp_c)
                    const temp_f = parseInt(res.current.temp_f)
                    const condition_text = res.current.condition.text
                    const humidity = res.current.humidity
                    const wind_kph = parseFloat(res.current.wind_kph)
                    const cloud = parseInt(res.current.cloud)
                    const icon = res.current.condition.icon.replace('//', '')
                    bot.sendPhoto(fromId, icon, { caption: `${city_name} | ${state_name} | ${country_name} \nLocal Time: ${local_time} \nTemp: ${temp_c}°C | ${temp_f}°F \nCondition: ${condition_text} | Humidity: ${humidity} \nWind Speed: ${wind_kph} | Cloud: ${cloud}` })
                })
        }
    })
});


bot.on('message', (msg) => {
    var Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(msg.chat.id, "Hello dear " + msg.from.first_name + ' ' + msg.from.last_name);
    }
    var bye = "bye";
    if (msg.text.toString().toLowerCase().includes(bye)) {
        bot.sendMessage(msg.chat.id, "Hope to see you around again , Bye");
    }
    var robot = "are you a robot?";
    if (msg.text.toString().toLocaleLowerCase().includes(robot)) {
        bot.sendMessage(msg.chat.id, "Yes I'm robot but not in that way!");
    }
    var location = "location";
    if (msg.text.toLocaleLowerCase().indexOf(location) === 0) {
        bot.sendLocation(msg.chat.id, 21.1777104, 72.8430127);
        bot.sendMessage(msg.chat.id, "Here is the point");

    }
    var Help = 'help'
    if (msg.text.toLocaleLowerCase().indexOf(Help) === 0) {
        bot.sendMessage(msg.chat.id, "Welcome", {
            "reply_markup": {
                "keyboard": [["hi", "computer"], ["Location"], ["Bye"]]
            }
        });
    }
    var Gtu = 'send me gtu syllabus'
    if (msg.text.toLocaleLowerCase().indexOf(Gtu) === 0) {
        bot.sendMessage(msg.chat.id, "Here it is, Select your department", {
            "reply_markup": {
                "keyboard": [["computer", "Chemical", "Robotics"], ["Civil", "Electircal", "IT"]]
            }
        });
    }
    var computer = 'computer'
    if (msg.text.toLocaleLowerCase().indexOf(computer) === 0) {
        bot.sendMessage(msg.chat.id, "choose your sem", {
            "reply_markup": {
                "keyboard": [["1", "2", "3"],["4", "5", "6"],["7", "8", "9"]]
            }
        });
    }
    var eight = '8'
    if (msg.text.toLocaleLowerCase().indexOf(eight) === 0) {
        bot.sendMessage(msg.chat.id, "List of subjects", {
            "reply_markup": {
                "keyboard": [["AI"],["Python Programming"],["Project (Pahse II)"]]
            }
        });
    }

});




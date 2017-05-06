var Twit = require('twit')
var fs = require('fs')
var csvparse = require('csv-parse')
var rita = require('rita')

var inputText = 'I went to the car. The car went to the grocery store. Saif went bowling behind the store.'


var bot = new Twit({
    consumer_key: process.env.LEARNINGBOT_CONSUMER_KEY,
    consumer_secret: process.env.LEARNINGBOT_CONSUMER_SECRET,
    access_token: process.env.LEARNINGBOT_ACCESS_TOKEN,
    access_token_secret: process.env.LEARNINGBOT_ACCESS_TOKEN_SECRET,
    timeout_ms: 1000*6
})


// var markov = new rita.RiMarkov(3)
// markov.loadText(inputText)
// var sentences = markov.generateSentences(1)
// console.log(markov.getProbabilities('went'))

var filePath = './tweets.csv'

var tweetData = fs.createReadStream(filePath)
    .pipe(csvparse({delimiter: ','}))
    .on('data', (row) => {
        inputText = inputText + ' ' + cleanText(row[3])
    })
    .on('end', () => {
        var markov = new rita.RiMarkov(3)
        markov.loadText(inputText)
        var sentence = markov.generateSentences(1)
        console.log(sentence)
    })

    function hasNoStopwords(token) {
        var stopwords = [ '@', 'http', 'RT']
        return stopwords.every(sw => {
            return !token.includes(sw)
        })
    }

    function cleanText(text) {
        return rita.RiTa.tokenize(text, ' ')
            .filter(hasNoStopwords)
            .join(' ')
            .trim()
    }
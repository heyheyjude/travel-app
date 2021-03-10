const {Schema, model} = require('mongoose')

const countySchema = new Schema({
    countryCode: {type : String, required: true, unique: true},
    langData:[
        {
            lang: {type : String, required: true},
            countryName: {type: String, required: false},
            shortText: {type: String, required: false},
            capitalName: {type: String, required: false}
        }
    ]

}, {collection : "countries"})

const countryLangSchema = new Schema({
    lang: {type : String, required: true},
    countryCode: {type : String, required: true},
    countryName: {type: String, required: false},
    description: {type: String, required: false},
    capitalName: {type: String, required: false}
}, {collection : "langcountries"})

module.exports = {
    Country: model('Country', countySchema),
    LangCountry: model('LangCountry', countryLangSchema)
}
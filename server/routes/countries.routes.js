const {Router} = require('express')
const router = Router()
const {Country, Showplace} = require('../models/Country')
const {Types, Schema} = require('mongoose')

const langSet = ["EN", "RU", "FR"]

const langDummy = {
    countryName: "",
    shortText: "",
    capitalName: "",
    video: "",
    description: "",
    currency: "",
}

router.post(
    '/add',
    async (req, res) => {
        let {
            countryCode
        } = req.body
        countryCode = countryCode.toUpperCase()
        try {
            const countryCheck = await Country.findOne({countryCode})
            if (countryCheck) {
                res.status(400).json({message: "We already have this country"})
            }
            const countryEmptyBase = {
                countryCode,
                langData: []
            }
            for (let i = 0; i < langSet.length; i++) {
                countryEmptyBase.langData.push({
                    ...langDummy,
                    lang: langSet[i]
                })
            }

            await Country.create(countryEmptyBase, e => e)
            res.status(201).json({message: "Country was successfully added"})
        } catch (e) {
            res.status(500).json({message: "We got error", e})
        }
    }
)

router.post(
    '/showplace',
    async (req, res) => {
        const {
            showplaces
        } = req.body
        try {
            console.log(showplaces)

            const requestStack = []
            showplaces.forEach(place => {
                if (place.key === "remove") {
                    requestStack.push({
                        deleteOne: {
                            filter: {_id: new Types.ObjectId(place._id)},
                        }
                    })
                } else if (place.index >= 0) {
                    delete place.index
                    requestStack.push({
                        insertOne: {
                            document: place
                        }
                    })
                } else {
                    console.log("-----PLACE--------")
                    console.log(place)
                    console.log("---------------------------------------------")
                    place._id = Types.ObjectId(place._id)
                    for(let i=0; i<place.langData.length; i++){
                        place.langData[i]._id = Types.ObjectId(place._id)
                    }
                    requestStack.push({
                        updateOne: {
                            filter: {countryCode: 'FR'},
                            update: {place}
                        }
                    })
                }


            })
            const dd = await Showplace.findOne({_id: Types.ObjectId(showplaces[0]._id)})
            console.log("-----RESPONSE--------")
            console.log(dd)
            const ud = await Showplace.updateOne({_id: Types.ObjectId(showplaces[0]._id)},showplaces[0])
            console.log("-----UPDATE RESPONSE--------")
            console.log(ud)
            const rd = await Showplace.bulkWrite(requestStack)
            console.log("-----BULK RESPONSE-------")
            console.log(rd)
            res.status(201).json({message: "Showplace was successfully updated"})
        } catch (e) {
            res.status(500).json({message: "We got error", e})
        }
    })

router.post(
    '/update',
    async (req, res) => {
        const {
            countryData
        } = req.body
        try {
            await Country.findOneAndUpdate({countryCode: countryData.countryCode}, countryData)
            res.status(201).json({message: "Country was successfully update"})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "We got error", e})
        }
    }
)

router.post(
    '/get',
    async (req, res) => {
        const {
            countryCode,
            lang,
            key //all, showplaces
        } = req.body
        try {
            let countrySet = {
                langs: langSet,
                showplaces: []
            }
            if (countryCode) {
                countrySet.countries = await Country.findOne({countryCode})
                if (key === "showplaces") {
                    countrySet.showplaces = await Showplace.find({countryCode})
                }
            } else if(key === "showplaces"){
                countrySet.showplaces = await Showplace.find({})
            } else {
                countrySet.countries = await Country.find({})
                if (key === "all") {
                    countrySet.showplaces = await Showplace.find({})
                }
            }
            res.json(countrySet)
        } catch (e) {
            res.status(500).json({message: "Something wrong", e})
        }
    }
)

router.post(
    '/remove',
    async (req, res) => {
        try {
            const {
                countryCode
            } = req.body

            if (countryCode) {
                await Country.findOneAndDelete({countryCode})
                res.status(201).json({message: "Country removed"})
            }
        } catch (e) {
        }
    }
)


module.exports = router
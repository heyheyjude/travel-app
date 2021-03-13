import React, {useContext, useEffect, useState} from 'react'
import Select from "./Blocks/Select";
import SelectCountry from "./Blocks/SelectCountry";
import useForm from "../../hooks/useForm";
import ShowplaceRepeater from "./Blocks/ShowplaceRepeater/ShowplaceRepeater";
import {AppContext} from "../../context/AppContext";
import Button from "../Buttons/Button";
import classesCss from "../../pages/styles/AdminPage.module.scss";


const ShowplaceAddForm = ({showplaces, codes, sendHandler}) => {

    const {langSet} = useContext(AppContext)

    const [form, setForm] = useState({
        countryCode: codes.length > 0 ? codes[0] : '',
        lang: Object.keys(langSet)[0],
    })
    const [localShowplaces, setLocalShowplaces] = useState({
        full: showplaces,
        updateStack: [],
        updatesCounter: 0
    })

    const updateForm = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }


    const addHandler = () => {
        const showplacesFull = [...localShowplaces.full]
        const showplacesUpdateStack = [...localShowplaces.updateStack]
        const localCounter = localShowplaces.updatesCounter + 1;
        const showplaceDummy = {
            index: localCounter,
            countryCode: form.countryCode,
            langData: []
        }
        for (let lang in langSet) {
            if (langSet.hasOwnProperty(lang))
                showplaceDummy.langData.push({lang})
        }
        showplacesFull.unshift(showplaceDummy)
        showplacesUpdateStack.push({index: localCounter})
        setLocalShowplaces({
            full: showplacesFull,
            updateStack: showplacesUpdateStack,
            updatesCounter: localCounter
        })
    }

    const removeHandler = showplace => {
        const showplacesFull = [...localShowplaces.full]
        const updateStack = [...localShowplaces.updateStack]
        const indexToRemove = showplacesFull.indexOf(showplace)
        if (showplace.index) {
            const indexToRemoveFromStack = updateStack.findIndex((stackShowplace) => {
                return showplace.index === stackShowplace.index
            })
            updateStack.splice(indexToRemoveFromStack, 1)
        } else if (showplace._id) {
            const indexToRemoveFromStack = updateStack.findIndex((stackShowplace) => {
                return showplace._id === stackShowplace._id
            })
            if (indexToRemoveFromStack > -1) {
                updateStack.splice(indexToRemoveFromStack, 1)
            }
            updateStack.push({_id: showplace._id, key: "remove"})
        }
        showplacesFull.splice(indexToRemove, 1)

        setLocalShowplaces({
            full: showplacesFull,
            updateStack: updateStack,
            updatesCounter: localShowplaces.updatesCounter
        })
    }

    const updateStackHandler = (showplace) => {
        const updateStack = [...localShowplaces.updateStack]

        const showplaceInUpdateStack = updateStack.findIndex((checkShowplace) => {
            return checkShowplace._id ? showplace._id === checkShowplace._id :
                checkShowplace.index? checkShowplace.index === showplace.index : false
        })
        if (showplaceInUpdateStack === -1) {
            showplace.index ? updateStack.push({index: showplace.index}) : updateStack.push({_id: showplace._id})
        }
        return updateStack
    }

    const onChangeHandler = (event) => {
        const showplacesFull = [...localShowplaces.full]

        const currentShowplace = showplacesFull.find((showplace) => {
            return showplace.index === Number(event.target.dataset.index) || showplace._id === event.target.dataset.index
        })

        if (event.target.dataset.key === "lang") {
            const langIndex = currentShowplace.langData.findIndex((lang) => {
                return lang.lang === form.lang
            })
            currentShowplace.langData[langIndex][event.target.name] = event.target.value
        } else {
            currentShowplace[event.target.name] = event.target.value
        }

        const updateStack = updateStackHandler(currentShowplace)
        setLocalShowplaces({
            full: showplacesFull,
            updateStack: updateStack,
            updatesCounter: localShowplaces.updatesCounter
        })
    }

    const sendHandlerWrap = () => {
        sendHandler(localShowplaces.full, localShowplaces.updateStack)
        setLocalShowplaces({...localShowplaces, updateStack: []})
    }

    const getCurrentShowplaces = () => {
        if(localShowplaces.full){
            return localShowplaces.full.filter((showplace) => {
                return showplace.countryCode === form.countryCode
            })
        }
        return []
    }

    useEffect(() => {
        setForm({...form, countryCode: codes[0]})
    }, [codes])

    return (
        <div>
            <Button
                onClick={sendHandlerWrap}
                label={"Update"}
                className={[classesCss.SignUpButton, classesCss.FormButton].join(" ")}
            />
            <Select
                label={"Language"}
                name="lang"
                onChange={updateForm}
                value={form.lang}
                options={langSet}
            />
            <SelectCountry
                value={form.countryCode || codes[0]}
                onChange={updateForm}
                codes={codes}
            />
            <ShowplaceRepeater
                showplaces={getCurrentShowplaces()}
                addHandler={addHandler}
                onChange={onChangeHandler}
                removeHandler={removeHandler}
                currentLang={form.lang}
            />
        </div>
    )
}


export default ShowplaceAddForm
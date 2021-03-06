import React, {useContext, useEffect, useState} from 'react'
import ImageUploading from 'react-images-uploading';
import classesCss from './styles/AuthPage.module.scss'
import Input from "../components/Forms/Input/Input";
import {AppContext} from "../context/AppContext";
import Axios from 'axios'
import {withRouter} from 'react-router-dom';

const UserPage = ({updateSearch}) => {
    const auth = useContext(AppContext)
    const [image, setImage] = useState(null);
    const [name, setName] = useState(auth.userData.name || "");
    const [message, setMessage] = useState('')

    const onChangeImage = (image) => {
        setImage(image);
    };

    const onChangeName = (event) => {
        setName(event.target.value);
    };


    const onSendHandler = async () => {
        const formData = new FormData();
        formData.append('image',image[0].file);
        formData.append('name', name);
        formData.append('id',auth.userId);
        const newData = await Axios.post('/api/user/upd', formData)
        const updData = {name: newData?.data?.name}
        if(newData?.data?.image) updData.image = newData.data.image
        if(newData?.data?.message) setMessage(newData.data.message)
        auth.updateData(updData)
    }


    useEffect(() => {
        updateSearch({exists: false});
    }, []);


    return (
        <div className={classesCss.UserPage}>
            <Input
                value={name}
                name={"name"}
                className={classesCss.NameInput}
                label={"Your Name:"}
                autoComplete={"off"}
                onChange={onChangeName}
            />
            <ImageUploading
                value={image}
                onChange={onChangeImage}
                maxNumber={1}
                dataURLKey="data_url"
            >
                {({
                      imageList,
                      onImageUpload,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps,
                  }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                        {
                            !imageList.length > 0 ?
                                <button
                                    className={classesCss.ImageLoadButton}
                                    style={isDragging ? {color: 'red'} : undefined}
                                    onClick={onImageUpload}
                                    {...dragProps}
                                >
                                    Click or Drop here
                                </button> : null
                        }

                        &nbsp;
                        {imageList.map((image, index) => (
                            <div key={index} className="image-item">
                                <img src={image['data_url']} alt="" width="100"/>
                                <div className="image-item__btn-wrapper">
                                    <button
                                        onClick={() => {
                                            onImageUpdate(index)
                                        }}
                                        className={classesCss.ImageHandler}>
                                        Update
                                    </button>
                                    <button
                                        onClick={() => {
                                            onImageRemove(index)
                                        }}
                                        className={classesCss.ImageHandler}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ImageUploading>
            <button
                onClick={onSendHandler}
                className={classesCss.SaveButton}>
                Save
            </button>
            <br/>
            {message}

        </div>
    )
}

export default withRouter(UserPage)
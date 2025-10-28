import React from 'react';
import Image from 'next/image';

const Avatar = ({ data, placeHolder, name, customClass, height, width, noPrevClass, NameWithRound }) => {
    const [imageError, setImageError] = React.useState(false);
    
    return (
        <>
            {
                data?.original_url && !imageError ?
                    <div className={`${!noPrevClass ? 'user-profile' : ""} ${customClass ? customClass : ""}`}>
                        <Image 
                            src={data?.original_url} 
                            className={customClass ? customClass : ""} 
                            height={height || 50} 
                            width={width || 50} 
                            alt={name?.name || ""} 
                            unoptimized={true}
                            onError={() => setImageError(true)}
                        />
                    </div>
                    : placeHolder ?
                        <div className={`user-profile user-round ${customClass ? customClass : ""}`}>
                            <Image 
                                src={placeHolder} 
                                height={height || 50} 
                                width={width || 50} 
                                alt={name?.name || ""} 
                                unoptimized={true}
                            />
                        </div>
                        : NameWithRound ?
                            <div className='user-round'> <h4>{name?.name?.charAt(0).toString().toUpperCase()}</h4></div> :
                            <h4>{name?.name?.charAt(0).toString().toUpperCase()}</h4>
            }
        </>
    )
}

export default Avatar
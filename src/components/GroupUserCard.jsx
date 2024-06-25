import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import { useSelector } from 'react-redux';

const GroupUserCard = ({ user, onClose, setUserInGroup=[], userInGroup=[] }) => {
    const [isChecked, setIsChecked] = useState(false);
    const currentUser = useSelector(state => state.user)

    const handleCheckboxChange = () => {
        if(currentUser._id == user._id){
            setIsChecked(true)
        } else{
            setIsChecked(!isChecked);
            if (!isChecked) {
                // console.log(user?._id);
                setUserInGroup([...userInGroup, user]);
            } else{
                setUserInGroup(userInGroup.filter((u) => u._id !== user._id));
            }
        }
    };

    useEffect(() => {
        if(!userInGroup.includes(currentUser))
            setUserInGroup([...userInGroup, currentUser])
    },[userInGroup])

    return (
        <>
            <div className='flex items-center justify-between gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border hover:border-primary rounded cursor-pointer'>
                <div className='flex items-center gap-3 p-2 lg:p-4'>
                    <div>
                        <Avatar
                            width={50}
                            height={50}
                            name={user?.name}
                            userId={user?._id}
                            imageUrl={user?.profile_pic}
                        />
                    </div>
                    <div>
                        <div className='font-semibold text-ellipsis line-clamp-1'>
                            {user?.name}
                        </div>
                        <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
                    </div>

                </div>
                <input
                    type="checkbox"
                    id={user?._id}
                    className='custom-checkbox'
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
            </div>
        </>
    )
}

export default GroupUserCard

import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import Loading from './Loading';
// import UserSearchCard from './UserSearchCard';
import GroupUserCard from './GroupUserCard.jsx'
import toast from 'react-hot-toast'
import axios from 'axios';
import { IoClose } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';

const CreateGroup = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [userInGroup, setUserInGroup] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupAvatar, setGroupAvatar] = useState("");

  const user = useSelector(state => state.user)
  const socketConnection = useSelector(state => state?.user?.socketConnection)

  const handleSearchUser = async () => {
    const URL = `/api/search-user`
    try {
      setLoading(true)
      const response = await axios.post(URL, {
        search: search
      })
      setLoading(false)

      setSearchUser(response.data.data)

    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const createGroupHandler = async () => {

    if (userInGroup.length < 3) {
      toast.error('A group must have atleast 3 users')
      return
    }
    if (groupName.trim() == "") {
      toast.error('Please enter a group name')
      return
    }
    // console.log("user : ", user);

    console.log("members :", userInGroup)
    console.log("groupAvatar :", groupAvatar)
    console.log("groupName :", groupName)
    console.log("admin :", user._id)

    const formData = new FormData()
    formData.append('name', groupName)
    formData.append('profile_pic', groupAvatar)
    formData.append('admin', user._id)
    formData.append('members', userInGroup.map(user => user._id))

    const response = await axios.post(`/api/create-group`, formData)
    console.log(response.data)
    if (response.data.success) {
      toast.success('Group created successfully')
      if(socketConnection){
        socketConnection.emit('sidebar-group', (user._id))
      }
      onClose()
    }
  }

  const handleRemoveUser = (userId) => {
    console.log("user with ", userId, " removed from group");
    setUserInGroup(userInGroup.filter((user) => user._id !== userId));

  }

  const handleClearUploadPhoto = () => {
    setGroupAvatar("")
  }

  useEffect(() => {
    handleSearchUser()
  }, [search])

  useEffect(() => {
    // remove userInGroup from searchUser
    // const filtered = searchUser.filter((user) => !userInGroup.includes(user))
    // setFilteredUsers(filtered)
    console.log(userInGroup)
    const filtered = searchUser.filter(searchUserItem =>
      !userInGroup.some(groupUserItem => groupUserItem._id === searchUserItem._id)
    );
    setFilteredUsers(filtered)

  }, [userInGroup, searchUser, search]);

  // console.log("searchUser", searchUser)
  return (
    <div className=' w-screen h-screen fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10 '>
      <div className='h-screen w-2/5 max-md:w-4/5 max-sm:w-full mx-auto mt-10 overflow-y-scroll' >
        {/**input search user */}
        <div className='bg-white rounded h-14 overflow-x-hidden flex '>
          <input
            type='text'
            placeholder='Search user by name, email....'
            className='w-full outline-none py-1 h-full px-4'
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className='h-14 w-14 flex justify-center items-center'>
            <IoSearchOutline size={25} />
          </div>
        </div>


        {/**display search user */}
        <div className='bg-white mt-2 w-full p-4 rounded'>
          <div className='min-h-16'>
            <h1 className='text-center text-secondary font-semibold'>Create Group</h1>
            {
              userInGroup.map((user, index) => {
                // console.log(user);
                return (
                  <>
                    <div key={index} className='flex justify-between items-center mb-2'>
                      <div className='flex items-center'>
                        <img src={user.profile_pic} alt={user.name} className='w-10 h-
                                                10 rounded-full mr-2' />
                        <span>{user.name}</span>
                      </div>
                      <IoCloseOutline size={20} onClick={() => handleRemoveUser(user._id)} />
                    </div>
                  </>
                )
              })
            }
          </div>


          {/**no user found */}
          {
            searchUser.length === 0 && !loading && (
              <p className='text-center text-slate-500'>no user found!</p>
            )
          }


          {
            loading && (
              <p><Loading /></p>
            )
          }


          {
            searchUser.length !== 0 && !loading && (
              filteredUsers.map((user, index) => {
                return (
                  <GroupUserCard userInGroup={userInGroup} setUserInGroup={setUserInGroup} key={user._id} user={user} onClose={onClose} />
                )
              })
            )
          }


          <label htmlFor='groupAvatar'>Photo :
            <div className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
              <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                {
                  groupAvatar?.name ? groupAvatar?.name : "Upload profile photo"
                }
              </p>
              {
                groupAvatar?.name && (
                  <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
                    <IoClose />
                  </button>
                )
              }
            </div>
          </label>


          <div className='h-12 mt-10 flex justify-evenly' >
            <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value
            )} placeholder='Group Name...' className='w-full h-10 pl-2 pr-
                        10 text-sm text-gray-700 outline-none' />
            <input
              type="file"
              id='groupAvatar'
              className='hidden'
              onInput={(e) => {
                setGroupAvatar(e.target.files[0]);
              }} />
            <button
              className='h-full text-center rounded-xl bg-primary/50 hover:bg-primary px-5 '
              onClick={createGroupHandler}
            >Create Group</button>
          </div>


        </div>
      </div>


      <div className='absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white' onClick={onClose}>
        <button>
          <IoClose />
        </button>
      </div>
    </div>
  )
}

export default CreateGroup

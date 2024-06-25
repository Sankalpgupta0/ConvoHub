import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [profile_pic, setProfile_pic] = useState('')
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    // console.log(e.target);
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const URL = `/api/register`

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('profile_pic', profile_pic)
    try {
      const response = await axios.post(URL, formData)
      console.log("response", response)

      toast.success(response.data.message)

      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
        })
        setProfile_pic('')
        navigate('/email')

      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
    console.log('data', data)
  }
  const handleClearUploadPhoto = () => {
    setProfile_pic('')
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
        <h3>Welcome to ConvoHub!</h3>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name :</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='enter your name'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email :</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='enter your email'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password :</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='enter your password'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='profile_pic'>Photo :

              <div className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
                <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                  {
                    profile_pic?.name ? profile_pic?.name : "Upload profile photo"
                  }
                </p>
                {
                  profile_pic?.name && (
                    <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
                      <IoClose />
                    </button>
                  )
                }

              </div>

            </label>

            <input
              type='file'
              id='profile_pic'
              name='profile_pic'
              className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
              onInput={(e) => {
                setProfile_pic(e.target.files[0]);
              }}
            />
          </div>


          <button
            className='bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
          >
            Register
          </button>

        </form>

        <p className='my-3 text-center'>Already have account ? <Link to={"/email"} className='hover:text-primary font-semibold'>Login</Link></p>
      </div>
    </div>
  )
}

export default RegisterPage

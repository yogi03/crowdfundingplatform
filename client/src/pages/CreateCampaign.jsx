import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { Loader } from '../components';
import { checkIfImage, compressImage, uploadImageToImgBB } from '../utils';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        alert('File is too large! Please select an image under 5MB.');
        e.target.value = '';
        return;
      }
      setIsLoading(true);
      try {
        const base64Image = await compressImage(file, 500, 0.7);
        const imageUrl = await uploadImageToImgBB(base64Image);
        setForm({ ...form, image: imageUrl });
        setIsLoading(false);
      } catch (error) {
        console.error("Error compressing or uploading image:", error);
        alert('Error uploading image to cloud. Please try another one.');
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        try {
          await createCampaign({ ...form, target: ethers.parseUnits(form.target, 18) })
          setIsLoading(false);
          navigate('/');
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      } else {
        alert('Please provide a valid image URL');
        setForm({ ...form, image: '' });
      }
    })
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <div className="flex-1 flex flex-col">
            <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">Your Name *</span>
            <input 
              required
              value={form.name}
              onChange={(e) => handleFormFieldChange('name', e)}
              type="text"
              placeholder="John Doe"
              className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">Campaign Title *</span>
            <input 
              required
              value={form.title}
              onChange={(e) => handleFormFieldChange('title', e)}
              type="text"
              placeholder="Write a title"
              className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">Story *</span>
          <textarea 
            required
            value={form.description}
            onChange={(e) => handleFormFieldChange('description', e)}
            rows={10}
            placeholder="Write your story"
            className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
          />
        </div>

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src="https://img.icons8.com/ios-filled/50/ffffff/money-bag.png" alt="money" className="w-[40px] h-[40px] object-contain"/>
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <div className="flex-1 flex flex-col">
            <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">Goal (ETH) *</span>
            <input 
              required
              value={form.target}
              onChange={(e) => handleFormFieldChange('target', e)}
              type="step"
              step="0.1"
              placeholder="ETH 0.50"
              className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">End Date *</span>
            <input 
              required
              value={form.deadline}
              onChange={(e) => handleFormFieldChange('deadline', e)}
              type="date"
              placeholder="End Date"
              className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">Campaign image *</span>
          <input 
            required={!form.image}
            onChange={handleImageChange}
            type="file"
            accept="image/*"
            className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#4b5264] text-[14px] rounded-[10px] sm:min-w-[300px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8c6dfd] file:text-white hover:file:bg-[#6c4be0]"
          />
          {form.image && (
            <img 
              src={form.image} 
              alt="preview" 
              className="mt-4 w-[250px] h-[150px] object-cover rounded-[10px]"
            />
          )}
        </div>

        <div className="flex justify-center items-center mt-[40px]">
            <button
                type="submit"
                className="font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-10 rounded-[10px] bg-[#1dc071]"
            >
                Submit new campaign
            </button>
        </div>
      </form>
    </div>
  )
}

export default CreateCampaign

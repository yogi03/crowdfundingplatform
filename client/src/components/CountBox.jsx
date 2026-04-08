import React from "react";

const CountBox = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center w-[150px]">
      <h4 className="font-epilogue font-bold text-[30px] dark:text-white text-gray-900 p-3 dark:bg-[#1c1c24] bg-white border border-gray-200 dark:border-gray-700 rounded-t-[10px] w-full text-center truncate">
        {value}
      </h4>
      <p className="font-epilogue font-normal text-[16px] dark:text-[#808191] text-gray-600 dark:bg-[#28282e] bg-gray-100 px-3 py-2 w-full rouned-b-[10px] text-center">
        {title}
      </p>
    </div>
  );
};

export default CountBox;

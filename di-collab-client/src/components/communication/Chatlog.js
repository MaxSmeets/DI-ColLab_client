import React from "react";

function Chatlog() {
  const text = [
    "Hello",
    "World",
    "How",
    "Are",
    "You",
    "Doing",
    "Today?",
    "I",
    "Am",
    "Doing",
    "Great!",
  ];
  return (
    <div className='h-72'>
      <div className='overflow-y-scroll h-full'>
        {text.map((item, index) => {
          return (
            <div key={index} className='flex flex-row'>
              <div className='bg-gray-200 rounded-lg p-2 m-2'>
                <p>{item}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Chatlog;

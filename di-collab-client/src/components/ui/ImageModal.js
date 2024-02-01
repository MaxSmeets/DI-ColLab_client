import React from "react";
import { useRoom } from "../../providers/RoomProvider";

function ImageModal({ imageSrc }) {
  const { modalOpen, setModalOpen } = useRoom();

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setModalOpen]);

  if (!modalOpen) return null;

  return (
    <div className='fixed inset-0 z-40 flex items-center justify-center bg-black cursor-default bg-opacity-70'>
      <button
        className='absolute top-0 right-0 z-50 mt-4 mr-4 text-3xl leading-none text-white'
        onClick={() => setModalOpen(false)}
      >
        &times;
      </button>
      <div className='relative p-4 overflow-hidden rounded shadow-lg hover:bg-logoBackdrop bg-primary'>
        <img
          src={imageSrc}
          alt='Modal'
          className='w-auto max-h-[90vh] mx-auto'
        />
      </div>
    </div>
  );
}

export default ImageModal;

import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

function UploadedItem({ item, onRemove, onItemSelect }) {
  if (!item || !item.name) {
    return null;
  }

  const handleRemoveClick = () => {
    onRemove(item);
  };

  const handleItemClick = () => {
    onItemSelect(item);
  };

  return (
    <div className="h-40 relative overflow-hidden shadow-md mr-4 mb-4 rounded-lg">
      {item.type.startsWith("image") && (
        <img
          src={URL.createObjectURL(item)}
          alt=""
          className="object-cover w-full h-full cursor-pointer"
          onClick={handleItemClick}
        />
      )}
      <button
        onClick={handleRemoveClick}
        className="absolute top-2 right-2 bg-red-600 rounded-full p-1 hover:text-gray-200"
      >
        <FaTimes />
      </button>
    </div>
  );
}

UploadedItem.propTypes = {
  item: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  onItemSelect: PropTypes.func.isRequired,
};

export default UploadedItem;

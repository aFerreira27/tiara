import React from 'react';

interface AddProductFormProps {
  onClose: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onClose }) => {
  return (
    <div>
      <h2>Add Product Form Placeholder</h2>
      {/* Add form elements here later */}
      {/* You can use onClose to close the overlay from within the form if needed */}
    </div>
  );
};

export default AddProductForm;
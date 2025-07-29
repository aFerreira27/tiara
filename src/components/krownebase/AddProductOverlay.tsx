'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import AddProductForm from './AddProductForm';
import { Product } from '../../../types/product'; // Import the Product type

interface AddProductOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: Product) => Promise<void>; // Add the onAddProduct prop
}

interface UploadStatus {
  loading: boolean;
  success: boolean;
  error: string | null;
  recordsProcessed?: number;
}

export default function AddProductOverlay({ isOpen, onClose, onAddProduct }: AddProductOverlayProps) {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    loading: false,
    success: false,
    error: null,
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus({ loading: true, success: false, error: null });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'File upload failed.');
      }

      const result = await response.json();
      setUploadStatus({ loading: false, success: true, error: null, recordsProcessed: result.recordsProcessed });

      // Optionally, refresh the product list after successful upload
      // This might involve calling a prop function passed from the parent component

    } catch (error: unknown) {
      console.error('Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setUploadStatus({ loading: false, success: false, error: errorMessage });
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Add New Product
                </Dialog.Title>
                <div className="mt-2">
                  <AddProductForm onAddProduct={onAddProduct} /> {/* Pass onAddProduct to the form */}
                </div>

                <div className="mt-4">
                  <label htmlFor="file-upload" className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                    <DocumentArrowUpIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    Upload CSV
                  </label>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileUpload} accept=".csv" />

                  {uploadStatus.loading && <p className="text-blue-600 text-center mt-2">Uploading...</p>}
                  {uploadStatus.success && <p className="text-green-600 text-center mt-2">Upload successful! {uploadStatus.recordsProcessed} records processed.</p>}
                  {uploadStatus.error && <p className="text-red-600 text-center mt-2">Error: {uploadStatus.error}</p>}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
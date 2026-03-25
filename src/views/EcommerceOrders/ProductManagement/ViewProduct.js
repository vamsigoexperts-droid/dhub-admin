import React, { useState } from 'react';

export default function CategoryBannerPage() {
  const [images, setImages] = useState([]);

  // Handle file input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([
      ...images,
      ...files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  // Remove an image
  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  // Back button handler
  const handleBack = () => {
    window.location.href = '/advertisments/categorybanners';
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'Poppins, sans-serif' }}>
      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{
          marginBottom: '16px',
          padding: '8px 12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          background: 'white',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 16 }}>←</span> Back
      </button>

      <div
        style={{
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '16px',
          borderRadius: '8px',
          background: 'white',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
          Create Category Banners
        </h2>

        {/* Image Preview Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          {images.map((imgObj, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '75%',
                border: '1px solid #ddd',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <img
                src={imgObj.url}
                alt={`banner-${index}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <button
                onClick={() => removeImage(index)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'white',
                  borderRadius: '50%',
                  border: 'none',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* File Input */}
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          accept="image/*"
          style={{ marginBottom: '16px' }}
        />

        {/* Bottom Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <button
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            Add Another Banner
          </button>
          <button
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '4px',
              background: '#3b82f6',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Create Banner
          </button>
        </div>
      </div>
    </div>
  );
}

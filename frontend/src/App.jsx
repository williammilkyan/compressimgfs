import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [data, setData] = useState([]);
  
  const handleImageChange = (event) => {
    const files = event.target.files;
    const imagesArray = Array.from(files);

    setSelectedImages((prevSelectedImages) => [...prevSelectedImages, ...imagesArray]);
  };

  useEffect(() => {

    const timer = setTimeout(() => {
      axios.get('http://localhost:3000/').then(res => {
        console.log(res.data);
        setData(res.data);
      }).catch(err => console.log(err));
      }, 3000); 

    // Cleanup the timer if the component unmounts before the delay
    return () => clearTimeout(timer);
  }, [data]);

  const handleUpload = () => {
    const formdata = new FormData();
    for(let i = 0; i < selectedImages.length; i++) {
      formdata.append(`images[${i}]`, selectedImages[i]);
    }
    axios.post('http://localhost:3000/compressImage', formdata)
        .then(res => {
            if(res.data.Status === "Success") {
                console.log("Successed");
            } else {              
                console.log('fail');
            }
        })
        .catch(err => console.log(err));
        setSelectedImages([]);
  };
  const removeImage = (index) => {
    setSelectedImages((prevSelectedImages) => {
      
      const updatedImages = [...prevSelectedImages];
      console.log(updatedImages);
      updatedImages.splice(index, 1);
      console.log(updatedImages);
      return updatedImages;
    });
  }

  const handleClearImages = async () => {
    try {
      const response = await axios.delete('http://localhost:3000/clear-images');
      if (response.status === 200) {
        console.log('Images cleared successfully.');
      } else {
        console.error('Failed to clear images from server.');
      }
    } catch (error) {
      console.error('Error clearing images:', error);
    }
  };

  const removeDBImage = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/delete-image/${id}`);
      if (response.status === 200) {
        console.log('Images cleared successfully.');
      } else {
        console.error('Failed to delete image from server.');
      }
    } catch (error) {
      console.error('Error clearing images:', error);
    }
  }
 

  return (
    <div className="App">
      <h1>Please Select the Images</h1>
      <input type="file" accept="image/*" multiple onChange={handleImageChange} />
      <div className="image-preview">
        {selectedImages.map((image, index) => (
        <div key={index} className="image-item">
          <img key={index} src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
          <button className="remove-button"
          onClick={() => removeImage(index)}>X</button>
          </div>
        ))}
      </div>
      {selectedImages.length > 0 && (
        <button onClick={handleUpload}>Compress and Upload to Server</button>
      )}
      <br />
      <h1>Images In DataBase:</h1>
      <button onClick={handleClearImages}>Clear</button> 
      <div>     
        {data.length > 0 && (data.map((image, index) => (
          <div key={index} className="image-item">
          <img key={index} src={`http://localhost:3000/${image.Compressed_image}`} alt={`Preview ${index}`} />
          <button className="remove-button"
          onClick={() => removeDBImage(image.id)}>X</button>
          </div>)))}
      </div>
    </div>
  );
}

export default App;

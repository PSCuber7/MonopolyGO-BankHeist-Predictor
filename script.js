const upload = document.getElementById('image-upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const uploadedImage = document.getElementById('uploadedImage'); // Optional preview image

upload.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Optional image preview
  const reader = new FileReader();
  reader.onload = function (e) {
    uploadedImage.src = e.target.result;
  };
  reader.readAsDataURL(file);

  const img = new Image();
  img.onload = async () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://monopolygo-bankheist-predictor.onrender.com', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Prediction failed');

      const result = await response.json();
      highlightTiles(result.opened, 'green');
      highlightTiles(result.predicted, 'yellow');
    } catch (err) {
      console.error('Error during prediction:', err);
      alert('Failed to get prediction. Please try again.');
    }
  };

  img.src = URL.createObjectURL(file);
});

function highlightTiles(indices, color) {
  const tileW = canvas.width / 4;
  const tileH = canvas.height / 3;

  indices.forEach(index => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.strokeRect(col * tileW, row * tileH, tileW, tileH);
  });
}

const upload = document.getElementById('image-upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status-message');

upload.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = async () => {
      // Set the canvas size to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Show status message
      status.textContent = 'Analyzing image...';

      const formData = new FormData();
      formData.append('image', file);

      try {
        // Send the image to the backend
        const response = await fetch('https://monopolygo-bankheist-predictor.onrender.com/detect', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Prediction failed');

        const result = await response.json();
        status.textContent = 'Prediction complete!';

        // Highlight opened tiles in green
        highlightTiles(result.opened, 'green');
        // Highlight predicted tiles in yellow
        highlightTiles(result.predicted, 'yellow');
      } catch (err) {
        console.error('Error during prediction:', err);
        status.textContent = 'Failed to analyze image. Please try again.';
      }
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

// Function to highlight tiles on the canvas
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

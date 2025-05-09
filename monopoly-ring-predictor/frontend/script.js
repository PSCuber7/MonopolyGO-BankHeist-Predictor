const upload = document.getElementById('image-upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

upload.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = async () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://your-backend-url.onrender.com/detect', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    highlightTiles(result.opened, 'green');
    highlightTiles(result.predicted, 'yellow');
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

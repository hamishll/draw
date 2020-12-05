var canvas = document.querySelector('canvas');
var input = document.querySelector('input');
var svg = document.querySelector('svg');
var imgPreview;
var POSTERIZE_LEVELS = 2;
var WIDTH = 256;

input.addEventListener('change', loadImage);

function loadImage(event) {
  var files = event.target.files;
  if (!files.length) {
    return;
  }
  
  var img = readFile(files[0], processFile);
}

function readFile(file, callback) {
  var reader = new FileReader();
  reader.onload = callback;
  reader.readAsDataURL(file);
}

function processFile(event) {
  if (imgPreview) {
    imgPreview.parentNode.removeChild(imgPreview);
  }
  imgPreview = new Image();
  imgPreview.src = event.target.result;
  canvas.parentNode.insertBefore(imgPreview, canvas);
  
  imgPreview.onload = processImage;
}

function processImage(event) {
  var width = imgPreview.width;
  var height = imgPreview.height;
  canvas.width = WIDTH;
  canvas.height = (WIDTH / imgPreview.width) * imgPreview.height;
  
  var ctx = canvas.getContext('2d');
  ctx.drawImage(imgPreview, 0, 0, canvas.width, canvas.height);
  var imgData = ctx.getImageData(0, 0, width, height);
  
  ctx.putImageData(posterize(imgData, POSTERIZE_LEVELS), 0, 0);
  makeSVG(canvas);
}

/*function posterize(imgData, levels) {
  var i = 0;
  var h, s, l;
  while (i < imgData.data.length) {
    
  }
  return imgData;
}*/

function posterize(imgData, levels) {
  var numLevels = parseInt(levels,10)||1;
  var data = imgData.data;

  numLevels = Math.max(2,Math.min(256,numLevels));

  var numAreas = 256 / numLevels;
  var numValues = 255 / (numLevels-1);

  var rect = imgData;
  var w = rect.width;
  var h = rect.height;
  var w4 = w*4;
  var y = h;
  do {
    var offsetY = (y-1)*w4;
    var x = w;
    do {
      var offset = offsetY + (x-1)*4;

      var r = numValues * ((data[offset] / numAreas)>>0);
      var g = numValues * ((data[offset+1] / numAreas)>>0);
      var b = numValues * ((data[offset+2] / numAreas)>>0);

      if (r > 255) r = 255;
      if (g > 255) g = 255;
      if (b > 255) b = 255;

      data[offset] = r;
      data[offset+1] = g;
      data[offset+2] = b;

    } while (--x);
  } while (--y);
  return imgData;
}

/**function makeSVG(canvas) {
  var ctx = canvas.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  var data = ctx.getImageData(0, 0, w, h).data;
  svg.setAttribute('viewBox', '0 0 ' + (WIDTH*10) + ' ' + (h*10));
  var frag = document.createDocumentFragment();
  var colorDict = {};
  
  for (var wi = 0; wi < w; wi++) {
    for (var hi = 0; hi < h; hi++) {
      var el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      var offset = (w*hi + wi) * 4; 
      if (whiteOrTransparent(data, offset)) continue;
      var color = rgbToHex( data[offset], data[offset+1], data[offset+2]);
      el.setAttribute('x', wi*10 + 1);
      el.setAttribute('y', hi*10 + 1);
      el.setAttribute('width', '8');
      el.setAttribute('height', '8');
      el.setAttribute('fill', color);
      text.innerHTML = '1';
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('x', wi*10 + 5);
      text.setAttribute('y', hi*10 + 7);
      text.setAttribute('fill', '#ffffff');
      text.setAttribute('font-size', '6');
      text.setAttribute('font-family', 'Helvetica,Arial,sans-serif')
      frag.appendChild(el);
      frag.appendChild(text);
      
      if (color in colorDict) {
        colorDict[color]++;
      } else {
        colorDict[color] = 1;
      }
    }
  }
  svg.appendChild(frag);
  alert(JSON.stringify(colorDict))
}**/

function whiteOrTransparent(data, offset) {
  if (data[offset+3] === 0) return true;
  if (data[offset] + data[offset+1] + data[offset+2] === (255*3)) return true;
  return false;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
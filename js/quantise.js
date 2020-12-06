// GLOBALS

var canvas = document.querySelector('canvas');
var input = document.querySelector('input');
var svg = document.querySelector('svg');
var imgPreview;
var POSTERIZE_LEVELS = 2;
var WIDTH = 256;

// File management

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
  
  var q = new RgbQuant(opts);
  // analyze histograms
  q.sample(imgData);
  // build palette
  var pal = q.palette();
  // reduce images
  var outA = q.reduce(imgData);

  ctx.putImageData(img, 0, 0);
  makeSVG(canvas);
}

// options with defaults (not required)
var opts = {
    colors: 256,             // desired palette size
    method: 2,               // histogram method, 2: min-population threshold within subregions; 1: global top-population
    boxSize: [64,64],        // subregion dims (if method = 2)
    boxPxls: 2,              // min-population threshold (if method = 2)
    initColors: 4096,        // # of top-occurring colors  to start with (if method = 1)
    minHueCols: 0,           // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
    dithKern: null,          // dithering kernel name, see available kernels in docs below
    dithDelta: 0,            // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
    dithSerp: false,         // enable serpentine pattern dithering
    palette: [],             // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
    reIndex: false,          // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
    useCache: true,          // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
    cacheFreq: 10,           // min color occurance count needed to qualify for caching
    colorDist: "euclidean",  // method used to determine color distance, can also be "manhattan"
};


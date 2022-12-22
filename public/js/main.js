////////////////////////
/// Planet Stuff!
///////////////////////

let homeCoordinates = [-71.6714, 41.9152];
let abroadCoordinates = [14.418540, 50.073658];

// Generate the coordinates for a heart!
const heartScale = 0.15;

let heartData = [];
let x, y, t;
for (let i = 0; i < 350; i++) {
  t = i * 0.3;
  x = 16 * Math.pow(Math.sin(t), 3);
  y = 9 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
  heartData[i] = [x * heartScale, y * heartScale];
}

// Build our interpolator to move the heart along!
let geoInterpolator = d3.geo.interpolate(homeCoordinates, abroadCoordinates);

let heartInterp = 0;
let delta = 0.003;

// Custom plugin to move our heart on a line between our coordinates!
planetaryjs.plugins.heart = function() {

  const drawLine = function (planet, context) {
    context.strokeStyle = "rgba(" + 200 + "," + 0 + "," + 200 + "," + 0.45 + ")";

    let lineFeature = {
      type: 'Feature',
      geometry: {type: 'LineString', coordinates: [homeCoordinates, abroadCoordinates]}
    }
    context.beginPath();
    planet.path.context(context)(lineFeature);
    context.stroke();
  };

  const drawHeart = function (planet, context) {
    context.strokeStyle = "rgba(" + 255 + "," + 0 + "," + 255 + "," + 0.45 + ")";
    let coords = geoInterpolator(heartInterp);
    let newCoords = heartData.map(u => [u[0] + coords[0], u[1] + coords[1]]);

    let heartFeature = {type: 'Feature', geometry: {type: 'LineString', coordinates: newCoords}}

    context.beginPath();
    planet.path.context(context)(heartFeature);
    context.stroke();

    if (heartInterp > 1) {
      delta = -0.003;
    } else if (heartInterp < 0) {
      delta = 0.003;
    }

    heartInterp += delta;
  };

  return function (planet) {
    planet.onDraw(function() {
      planet.withSavedContext(function(context) {
        drawLine(planet, context);
        drawHeart(planet, context);
      });
    });
  };
};


const globe = planetaryjs.planet();

globe.loadPlugin(autorotate(5));

globe.loadPlugin(planetaryjs.plugins.earth({
  topojson: { file:   '/world.json' },
  oceans:   { fill:   '#3e91ad' },
  land:     { fill:   '#64a88c' },
  borders:  { stroke: '#548554' }
}));

globe.loadPlugin(lakes({
  fill: '#569fc2'
}));

globe.loadPlugin(planetaryjs.plugins.heart());

// Set up the globe's initial scale, offset, and rotation.
globe.projection.translate([500, 500]).scale(400).rotate([0, -10, 0]);


var canvas = document.getElementById('rotatingGlobe');

globe.draw(canvas);

function autorotate(degPerSec) {
  return function(planet) {
    let lastTick = null;
    let paused = false;
    planet.plugins.autorotate = {
      pause:  function() { paused = true;  },
      resume: function() { paused = false; }
    };

    planet.onDraw(function() {
      if (paused || !lastTick) {
        lastTick = new Date();
      } else {
        const now = new Date();
        const delta = now - lastTick;
        const rotation = planet.projection.rotate();
        rotation[0] += degPerSec * delta / 1000;
        $('#wrapper').css('background-position-x', rotation[0])
        if (rotation[0] >= 180) rotation[0] -= 360;
        planet.projection.rotate(rotation);
        lastTick = now;
      }
    });
  };
}

function lakes(options) {
  options = options || {};
  let lakes = null;

  return function(planet) {
    planet.onInit(function() {
      const world = planet.plugins.topojson.world;
      lakes = topojson.feature(world, world.objects.ne_110m_lakes);
    });

    planet.onDraw(function() {
      planet.withSavedContext(function(context) {
        context.beginPath();
        planet.path.context(context)(lakes);
        context.fillStyle = options.fill || 'black';
        context.fill();
      });
    });
  };
}

function pausePlay() {

  const resume = document.getElementById('animation');
  const resumeOn = resume.classList.contains("fa-play");

  if (resumeOn) {
    resume.classList.remove("fa-play");
    resume.classList.add("fa-pause");
    globe.plugins.autorotate.resume();
  }
  else {
    resume.classList.remove("fa-pause");
    resume.classList.add("fa-play");
    globe.plugins.autorotate.pause();

  }
}

function refreshAt(hours, minutes, seconds) {
  var now = new Date();
  var then = new Date();

  if(now.getHours() > hours ||
      (now.getHours() == hours && now.getMinutes() > minutes) ||
      now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
    then.setDate(now.getDate() + 1);
  }
  then.setHours(hours);
  then.setMinutes(minutes);
  then.setSeconds(seconds);

  var timeout = (then.getTime() - now.getTime());
  setTimeout(function() { window.location.reload(true); }, timeout);
}

$(document).ready(function() {
  refreshAt(6,1,0);
});


//create map
var map = new esri.Map("mapDiv",{
  basemap: "hybrid",
  center: [-6.25, 53.35],
  zoom: 12
});

//change to street map
map.setBasemap("streets");

//change to community topo map
map.setBasemap("topo");
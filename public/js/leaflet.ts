import { LatLngExpression } from 'leaflet';
declare const L: any;

export const displayMap = function (locations: any) {
  const customIcon = L.icon({
    iconUrl: '../img/pin.png',
    iconSize: [20, 25], // Set the size of your icon
    iconAnchor: [10, 25], // Set the anchor point of your icon
    popupAnchor: [0, -25], // Set the popup anchor point, if needed
  });

  const map = L.map('map', {
    center: [34.111745, -118.113491],
    zoomControl: false,
    dragging: false,
  });

  L.tileLayer(
    'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}',
    {
      attribution:
        '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: 'png',
    }
  ).addTo(map);

  const points = locations.map((loc: any) => {
    const point = [loc.coordinates[1], loc.coordinates[0]] as LatLngExpression;

    L.marker(point, { icon: customIcon })
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        autoClose: false,
      })
      .openPopup();
    return point;
  });

  const bounds = L.latLngBounds(points).pad(0.2);
  map.fitBounds(bounds);

  map.scrollWheelZoom.disable();
};

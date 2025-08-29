let parcelLayer;
let mapInitialized = false;
let map;

function initMap() {
  if (mapInitialized) return;

  map = L.map('map').setView([-0.78, 37.03], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const wfsUrl = "http://localhost:8080/geoserver/Municipality/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Municipality:murangaparcels&outputFormat=application/json";

  fetch(wfsUrl)
    .then(response => {
      if (!response.ok) throw new Error(`GeoServer response error: ${response.statusText}`);
      return response.json();
    })
    .then(data => {
      if (!data.features || data.features.length === 0) {
        console.warn("No features returned from GeoServer.");
        return;
      }

      console.log(`✅ Loaded ${data.features.length} parcels`);

      parcelLayer = L.geoJSON(data, {
        style: {
          color: '#ff7800',
          weight: 2,
          opacity: 0.7
        },
        onEachFeature: function (feature, layer) {
          const props = feature.properties;
          let popupContent = `
            <strong>id:</strong> ${props.id || "N/A"}<br>
            <strong>Parcel ID:</strong> ${props.Parcel_ID || "N/A"}<br>
            <strong>Plot Name:</strong> ${props.plot_name || "N/A"}<br>
            <strong>Owner:</strong> ${props.Ownername || "N/A"}<br>
            <strong>Land Use:</strong> ${props.land_use || "N/A"}<br>
            <strong>Tenure:</strong> ${props.tenure || "N/A"}<br>
            <strong>SubCounty:</strong> ${props.SubCounty || "N/A"}<br>
            <strong>Ward:</strong> ${props.Ward || "N/A"}<br>
            <strong>Parcel Area (m²):</strong> ${props.ParcelArea ? props.ParcelArea.toFixed(2) : "N/A"}<br>
            <strong>Comments:</strong> ${props.comments || "None"}
          `;
          layer.bindPopup(popupContent);
        }
      }).addTo(map);

      map.fitBounds(parcelLayer.getBounds());

      // 🔍 Multi-field search using a custom filter function
      const searchControl = new L.Control.Search({
        layer: parcelLayer,
        propertyName: 'Parcel_ID', // default, overridden by custom filter
        marker: false,
        moveToLocation: function (latlng, title, map) {
          map.setView(latlng, 17);
        },
        filterData: function (text, records) {
          const filtered = {};
          for (let key in records) {
            const props = records[key].feature.properties;
            const match = (
              (props.Parcel_ID && props.Parcel_ID.toString().toLowerCase().includes(text.toLowerCase())) ||
              (props.Ownername && props.Ownername.toLowerCase().includes(text.toLowerCase())) ||
              (props.id && props.id.toString().toLowerCase().includes(text.toLowerCase()))
            );
            if (match) filtered[key] = records[key];
          }
          return filtered;
        }
      });

      map.addControl(searchControl);
    });

  mapInitialized = true;
}

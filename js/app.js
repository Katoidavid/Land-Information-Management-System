let highlightedLayer = null; // store the currently highlighted parcel

function searchParcel() {
  const searchValue = document.getElementById("searchBox").value.trim().toLowerCase();
  const searchType = document.getElementById("searchType").value;
  const infoDiv = document.getElementById("parcel-info");

  if (!searchValue) {
    infoDiv.innerHTML = "⚠️ Please enter a value to search.";
    return;
  }

  if (!parcelLayer) {
    infoDiv.innerHTML = "⚠️ Parcel layer not loaded yet.";
    return;
  }

  let found = false;

  // Clear previous highlight
  if (highlightedLayer) {
    parcelLayer.resetStyle(highlightedLayer);
    highlightedLayer = null;
  }

  parcelLayer.eachLayer(layer => {
    const props = layer.feature.properties;

    const matches =
      (searchType === "parcel_id" && props.Parcel_ID?.toString().toLowerCase() === searchValue) ||
      (searchType === "owner" && props.Ownername?.toLowerCase().includes(searchValue)) ||
      (searchType === "id" && props.id?.toString().toLowerCase() === searchValue);

    if (matches && !found) {
      const bounds = layer.getBounds();
      map.fitBounds(bounds, { maxZoom: 18, padding: [20, 20] }); // Zoom and stay zoomed

      layer.openPopup();

      // Highlight this layer
      layer.setStyle({
        color: 'blue',
        weight: 4,
        fillOpacity: 0.4
      });

      highlightedLayer = layer;

      // Show parcel info
      infoDiv.innerHTML = `
        <strong>id:</strong> ${props.id || "N/A"}<br>
        <strong>Parcel ID:</strong> ${props.Parcel_ID || "N/A"}<br>
        <strong>Plot Name:</strong> ${props.plot_name || "N/A"}<br>
        <strong>Owner:</strong> ${props.Ownername || "N/A"}<br>
        <strong>Land Use:</strong> ${props.land_use || "N/A"}<br>
        <strong>Area (m²):</strong> ${props.ParcelArea ? props.ParcelArea.toFixed(2) : "N/A"}<br>
        <strong>Tenure:</strong> ${props.tenure || "N/A"}<br>
        <strong>SubCounty:</strong> ${props.SubCounty || "N/A"}<br>
        <strong>Ward:</strong> ${props.Ward || "N/A"}<br>
        <strong>Comments:</strong> ${props.comments || "None"}
      `;

      found = true;
    }
  });

  if (!found) {
    infoDiv.innerHTML = `❌ No parcel found matching "<strong>${searchValue}</strong>" for selected type.`;
  }
}

(function() {
    const lat = document.querySelector('#lat').value || 10.3838411;
    const lng = document.querySelector('#lat').value || -75.4803048;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;

    // Utilizar provider y geocoder
    const geocoderService = L.esri.Geocoding.geocodeService();

    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Agregar el pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa);

    //Deterctar el movimiento del pin
    marker.on('moveend', function(e) {
        marker = e.target;
        const posicion = marker.getLatLng();
        //Centrar automaticamente
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));
        
        //Obtener la información de las calles al soltar el pin
        geocoderService.reverse().latlng(posicion, 13).run(function(error, resultado) {
            //console.log(resultado);
            marker.bindPopup(resultado.address.LongLabel).openPopup();

            //Llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';

        });
    });

})()
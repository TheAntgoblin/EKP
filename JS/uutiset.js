function zoomCard(cardPath) {
    const zoom_object = document.getElementById("cardZoom");
    const zoom_image = document.getElementById("zoomImage");

    zoom_image.src = `Images/Cards/${cardPath}.png`;
    zoom_object.classList.add("show");
    zoom_object.onclick = () => zoom_object.classList.remove("show");
}
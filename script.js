// script.js

const API_KEY = "AgCkhh7gJzO3QWuLeddPxXacOmCoLIYs8996V2wY";
const API_URL = "https://api.nasa.gov/planetary/apod";

const dateInput = document.getElementById("apod-date");
const apodContainer = document.getElementById("apod-container");
const loadingSkeleton = document.getElementById("loading-skeleton");
const interactiveBg = document.getElementById('interactive-bg');
const errorMessageContainer = document.getElementById('error-message-container');

const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("max", today);

const fetchApod = async (date) => {
    loadingSkeleton.style.display = 'block';
    apodContainer.style.display = 'none';
    errorMessageContainer.style.display = 'none';
    apodContainer.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}&date=${date}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("No APOD found for the selected date. Please try another date.");
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        renderApod(data);
    } catch (error) {
        console.error("Error fetching APOD:", error);
        errorMessageContainer.innerHTML = `<p class="error-message">${error.message || "Failed to load data. Please try again."}</p>`;
        errorMessageContainer.style.display = 'block';
    } finally {
        loadingSkeleton.style.display = 'none';
    }
};

const renderApod = (apodData) => {
    apodContainer.style.display = 'block';
    errorMessageContainer.style.display = 'none';

    const apodCard = document.createElement("div");
    apodCard.classList.add("apod-card");

    const title = document.createElement("h2");
    title.classList.add("apod-title");
    title.textContent = apodData.title;

    const date = document.createElement("p");
    date.classList.add("apod-date");
    date.textContent = apodData.date;

    const mediaContainer = document.createElement("div");
    mediaContainer.classList.add("apod-media-container");
    if (apodData.media_type === "video") {
        const videoFrame = document.createElement("iframe");
        videoFrame.src = apodData.url;
        videoFrame.title = "APOD Video";
        videoFrame.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
        videoFrame.setAttribute("allowfullscreen", "");
        mediaContainer.appendChild(videoFrame);
    } else {
        const image = document.createElement("img");
        image.src = apodData.url;
        image.alt = apodData.title;
        image.classList.add("apod-image");
        image.loading = "lazy";
        mediaContainer.appendChild(image);
    }
    
    const explanation = document.createElement("p");
    explanation.classList.add("apod-explanation");
    explanation.textContent = apodData.explanation;

    if (apodData.copyright) {
        const copyright = document.createElement("p");
        copyright.classList.add("apod-copyright");
        copyright.innerHTML = `&copy; ${apodData.copyright}`;
        apodCard.appendChild(copyright);
    }

    apodCard.appendChild(title);
    apodCard.appendChild(date);
    apodCard.appendChild(mediaContainer);
    apodCard.appendChild(explanation);
    if (apodData.copyright) {
        const copyright = document.createElement("p");
        copyright.classList.add("apod-copyright");
        copyright.innerHTML = `&copy; ${apodData.copyright}`;
        apodCard.appendChild(copyright);
    }
    
    const shareContainer = document.createElement("div");
    shareContainer.classList.add("share-container");
    const shareButton = document.createElement("button");
    shareButton.id = "share-button";
    shareButton.textContent = "Share this APOD";
    shareContainer.appendChild(shareButton);

    apodContainer.appendChild(apodCard);
    apodContainer.appendChild(shareContainer);

    setTimeout(() => apodCard.classList.add('show'), 10);

    shareButton.addEventListener("click", () => {
        if (navigator.share) {
            navigator.share({
                title: apodData.title,
                text: apodData.explanation,
                url: apodData.url,
            })
            .catch(console.error);
        } else {
            alert("Sharing is not supported on this browser. You can copy the URL manually.");
        }
    });
};

dateInput.addEventListener("change", (event) => {
    const selectedDate = event.target.value;
    if (selectedDate) {
        fetchApod(selectedDate);
    }
});

const initialDate = today;
dateInput.value = initialDate;
fetchApod(initialDate);

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const posX = (mouseX / window.innerWidth) * 100;
    const posY = (mouseY / window.innerHeight) * 100;

    interactiveBg.style.setProperty('--x', `${posX}%`);
    interactiveBg.style.setProperty('--y', `${posY}%`);
});
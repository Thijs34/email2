document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('tutorialVideo');
    const links = document.querySelectorAll('nav a, #startButton');

    function pauseVideo() {
        if (!video.paused) {
            video.pause();
            video.currentTime = 0;
        }
    }

    links.forEach(link => {
        link.addEventListener('click', pauseVideo);
    });
});
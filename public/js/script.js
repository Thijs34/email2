//alet message to show I am using openAI
document.addEventListener('DOMContentLoaded', function () {
    function showAlert(event) {
        if (!localStorage.getItem('alertAccepted')) {
            if (!confirm("This service uses OpenAI (ChatGPT) to generate emails. If you are not comfortable with it, do not proceed.")) {
                event.preventDefault();
            } else {
                localStorage.setItem('alertAccepted', 'true');
            }
        }
    }
//Hide section and show them for smooth transition between pages
    const startButtons = document.querySelectorAll('#startButton');
    const chatSection = document.getElementById('chatSection');
    const homeSection = document.getElementById('home');
    const portfolio = document.getElementById('portfolio');
    const homeLink = document.getElementById('homeLink');
    const tutorialLink = document.getElementById('tutorialLink');
    const tutorialSection = document.getElementById('tutorialSection');
    const emailGeneratorLink = document.querySelector('nav menu li a[href="#chatSection"]');

    startButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            showAlert(event);
            if (!event.defaultPrevented) {
                homeSection.classList.add('hide');
                chatSection.classList.add('show');
                homeSection.classList.remove('show');
                chatSection.classList.remove('hide');
                tutorialSection.classList.add('hide');
                tutorialSection.classList.remove('show');
            }
        });
    });

    portfolio.addEventListener('click', function () {
        homeSection.classList.add('show');
        chatSection.classList.add('hide');
        homeSection.classList.remove('hide');
        chatSection.classList.remove('show');
        tutorialSection.classList.add('hide');
        tutorialSection.classList.remove('show');
    });

    homeLink.addEventListener('click', function () {
        homeSection.classList.add('show');
        chatSection.classList.add('hide');
        homeSection.classList.remove('hide');
        chatSection.classList.remove('show');
        tutorialSection.classList.add('hide');
        tutorialSection.classList.remove('show');
    });

    tutorialLink.addEventListener('click', function () {
        homeSection.classList.add('hide');
        chatSection.classList.add('hide');
        homeSection.classList.remove('show');
        chatSection.classList.remove('show');
        tutorialSection.classList.add('show');
        tutorialSection.classList.remove('hide');
    });

    emailGeneratorLink.addEventListener('click', function (event) {
        showAlert(event);
        if (!event.defaultPrevented) {
            homeSection.classList.add('hide');
            chatSection.classList.add('show');
            homeSection.classList.remove('show');
            chatSection.classList.remove('hide');
            tutorialSection.classList.add('hide');
            tutorialSection.classList.remove('show');
        } else {
            event.preventDefault();
        }
    });
});
//change the navigation color so you can see on what page you are on
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("homeLink").classList.add("active");

    function handleNavClick(event) {
        if (event.defaultPrevented) {
            return;
        }
        
        document.querySelectorAll('.navbar-nav a').forEach(link => {
            link.classList.remove("active");
        });

        event.currentTarget.classList.add("active");
    }

    document.querySelectorAll('.navbar-nav a').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    function handleStartButtonClick(event) {
        event.preventDefault();
        document.querySelector('a[href="#chatSection"]').click();
        document.getElementById("chatSection").scrollIntoView({ behavior: 'smooth' });
    }

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', handleStartButtonClick);
    });

    function handlePortfolioClick(event) {
        document.querySelectorAll('.navbar-nav a').forEach(link => {
            link.classList.remove("active");
        });

        document.getElementById("homeLink").classList.add("active");
        document.getElementById("home").scrollIntoView({ behavior: 'smooth' });
    }

    document.querySelector('.portfolio a').addEventListener('click', handlePortfolioClick);
});

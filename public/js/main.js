document.addEventListener('DOMContentLoaded', (event) => {
    // Select essential DOM elements
    const sendButton = document.querySelector('.send-btn'); // Button to send messages
    const messageInput = document.getElementById('messageInput'); // Input field for user messages
    const chatBody = document.getElementById('chatBody'); // Container for chat messages
    const emailButton = document.getElementById('emailButton'); // Button to send email
    const languageSelect = document.getElementById('languageSelect'); // Dropdown for language selection
    const toneSelection = document.getElementById('toneSelection'); // Container for tone selection options
    const selectToneButton = document.getElementById('selectToneButton'); // Button to confirm tone selection
    const resetButton = document.querySelector('.attach-btn'); // Button to reset the chat

    // State variables to store user inputs and selections
    let currentStep = 'userEmail'; // Current step in the message flow
    let userEmail = ''; // User's email
    let userName = ''; // User's name
    let recipientEmails = ''; // Recipient's email(s)
    let recipientName = ''; // Recipient's name
    let promptMessage = ''; // Message prompt provided by the user
    let currentLanguage = 'en'; // Current selected language
    let selectedTone = 'formal'; // Selected tone for the email
    let errorDisplayed = false; // Flag to prevent multiple error messages
    let generatedEmail = ''; // Generated email content
    let currentMessage = ''; // To store the current message input

    const messageSound = new Audio('../audio/messege.mp3'); // Sound to play for new messages

    // Translations for different languages
    const translations = {
        'en': {
            'enterEmail': "Welcome! Please enter your email to start the chat.",
            'enterUserName': "Please enter your name.",
            'enterRecipientEmail': "Please enter the recipient's email(s) separated by spaces.",
            'enterRecipientName': "Please enter the recipient's name or press Enter to leave it empty.",
            'enterPrompt': "Now, give some general information about the email content.",
            'selectTone': "Please select the tone of the email (Informal or Formal).",
            'errorResponse': "Error: Could not get a response.",
            'writeEmail': "write me an email about the following and give me an appropriate subject: ",
            'emptyError': "This field cannot be empty. Please provide the required information.",
            'unknownRecipient': "unknown, use sir/madam",
            'selectToneButton': "Select button",
            'sendEmail': "Send Email",
            'endMessage': "Click 'Use Email' to use the email or type another prompt.",
            'informal': "Informal",
            'formal': "Formal",
            'myName': "my name",
            'recipientName': "recipient's name",
            'tone': "tone"
        },
        'nl': {
            'enterEmail': "Welkom! Voer uw e-mailadres in om de chat te starten.",
            'enterUserName': "Voer uw naam in.",
            'enterRecipientEmail': "Voer het e-mailadres van de ontvanger(s) in, gescheiden door spaties.",
            'enterRecipientName': "Voer de naam van de ontvanger in of druk op Enter om het leeg te laten.",
            'enterPrompt': "Geef wat algemene informatie over de email inhoud.",
            'selectTone': "Selecteer de toon van de e-mail (Informeel of Formeel).",
            'errorResponse': "Fout: Kon geen antwoord krijgen.",
            'writeEmail': "schrijf me een e-mail over het volgende en geef me een fatsoenlijk onderwerp: ",
            'emptyError': "Dit veld mag niet leeg zijn. Geef de vereiste informatie.",
            'unknownRecipient': "onbekend, gebruik meneer/mevrouw",
            'selectToneButton': "Selecteer Knop",
            'sendEmail': "E-mail Verzenden",
            'endMessage': "Klik op 'E-mail Verzenden' om de e-mail te gebruiken of typ een andere prompt.",
            'informal': "Informeel",
            'formal': "Formeel",
            'myName': "mijn naam",
            'recipientName': "naam van de ontvanger",
            'tone': "toon"
        }
    };

    // Set the initial language based on saved preferences
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    languageSelect.value = savedLanguage;
    currentLanguage = savedLanguage;
    switchLanguage(savedLanguage);

    // Event listeners for user interactions
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    emailButton.addEventListener('click', sendEmail);
    selectToneButton.addEventListener('click', selectTone);
    resetButton.addEventListener('click', resetChat);

    languageSelect.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('selectedLanguage', selectedLanguage);
        switchLanguage(selectedLanguage);
        resetChat();
    });

    // Function to handle sending a message
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (currentStep !== 'recipientName' && !messageText) {
            if (!errorDisplayed) {
                appendMessage('received', getTranslation('emptyError'), 'emptyError');
                errorDisplayed = true;
            }
            return;
        }

        appendMessage('sent', messageText, currentStep);
        messageInput.value = '';
        errorDisplayed = false;

        if (currentStep === 'userEmail') {
            userEmail = messageText;
            appendMessage('received', getTranslation('enterUserName'), 'enterUserName');
            currentStep = 'userName';
        } else if (currentStep === 'userName') {
            userName = messageText;
            appendMessage('received', getTranslation('enterRecipientEmail'), 'enterRecipientEmail');
            currentStep = 'recipientEmail';
        } else if (currentStep === 'recipientEmail') {
            recipientEmails = messageText;
            appendMessage('received', getTranslation('enterRecipientName'), 'enterRecipientName');
            currentStep = 'recipientName';
        } else if (currentStep === 'recipientName') {
            recipientName = messageText || getTranslation('unknownRecipient');
            appendMessage('received', getTranslation('enterPrompt'), 'enterPrompt');
            currentStep = 'prompt';
        } else if (currentStep === 'prompt') {
            promptMessage = messageText;
            toneSelection.style.display = 'block';
            messageInput.disabled = true;
            appendMessage('received', getTranslation('selectTone'), 'selectTone');
            currentStep = 'toneSelection';
        }
    }

    // Function to handle tone selection
    function selectTone() {
        selectedTone = document.getElementById('toneSelect').value;
        toneSelection.style.display = 'none';
        messageInput.disabled = false;
        currentStep = 'emailPrompt';
        generatePrompt();
    }

    // Function to append messages to the chat body
    function appendMessage(type, text, key = null) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(`message-${type}`);

        const messageContainer = document.createElement('div');
        messageContainer.classList.add(type === 'sent' ? 'message-container-send' : 'message-container', 'pre-wrap');
        messageContainer.innerHTML = `<p ${key ? `data-key="${key}"` : ''}>${text}</p>`;

        if (type === 'sent') {
            const editIcon = document.createElement('i');
            editIcon.classList.add('fa-solid', 'fa-pen-to-square', 'edit-icon');
            editIcon.addEventListener('click', () => editMessage(messageElement, text, key));
            messageContainer.appendChild(editIcon);
        }

        messageElement.appendChild(messageContainer);

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-message-container');
        imageContainer.innerHTML = `<img src="${type === 'sent' ? 'https://i.postimg.cc/sDBrsyq9/blank-profile-picture-973460-1280.png' : 'https://i.postimg.cc/K4h2xvWq/febd01b7-4a4e-4bfe-960c-2e6915971f5c.jpg'}" class="rounded-circle user-image-message">`;

        if (type === 'sent') {
            messageElement.appendChild(imageContainer);
        } else {
            messageElement.insertBefore(imageContainer, messageElement.firstChild);
        }

        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;

        messageSound.play();
    }

    // Function to handle message editing
    function editMessage(messageElement, oldText, key) {
        const newText = prompt('Edit your message:', oldText);
        if (newText !== null && newText.trim() !== '') {
            const messageContainer = messageElement.querySelector('.message-container-send');
            if (messageContainer) {
                messageContainer.querySelector('p').textContent = newText.trim();
                updateVariable(key, newText.trim());
            }
        }
    }

    // Function to update state variables based on the key
    function updateVariable(key, newText) {
        if (key === 'userEmail') {
            userEmail = newText;
        } else if (key === 'userName') {
            userName = newText;
        } else if (key === 'recipientEmail') {
            recipientEmails = newText;
        } else if (key === 'recipientName') {
            recipientName = newText;
        } else if (key === 'prompt') {
            promptMessage = newText;
        }
    }

    // Function to send a prompt to the server and handle the response
    async function sendPrompt(promptText) {
        try {
            const response = await fetch('/api/chat', {  // Change to '/api/chat'
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: promptText }),
            });
    
            const data = await response.json();
            console.log('AI response:', data.reply);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Function to generate the final prompt for the server based on user inputs
    function generatePrompt() {
        const writeEmailText = getTranslation('writeEmail');
        const myNameText = getTranslation('myName');
        const recipientNameText = getTranslation('recipientName');
        const toneText = getTranslation('tone');
        const promptText = `${writeEmailText} ${myNameText}: ${userName} (only use it for the email end), ${recipientNameText}: ${recipientName}, ${toneText}: ${selectedTone}. ${promptMessage}`;
        sendPrompt(promptText);
    }

    // Function to send the generated email using mailto link
    function sendEmail() {
        let chatResponse = generatedEmail;

        let subject = "Chat Response";
        const subjectMatch = chatResponse.match(/^(Subject|Onderwerp): (.+)$/m);
        if (subjectMatch) {
            subject = subjectMatch[2];
            chatResponse = chatResponse.replace(subjectMatch[0], '').trim();
        }

        const body = chatResponse;

        const recipientEmailsFormatted = recipientEmails.split(' ').join(';');
        const mailtoLink = `mailto:${recipientEmailsFormatted}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&cc=${encodeURIComponent(userEmail)}`;
        window.location.href = mailtoLink;
    }

    // Function to switch the language of the UI and update translations
    function switchLanguage(language) {
        const elements = document.querySelectorAll('[data-en]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${language}`);
            if (text) {
                element.textContent = text;
            }
        });
        currentLanguage = language;
        updateDynamicText(language);
    }

    // Function to get the translation for a specific key based on the current language
    function getTranslation(key) {
        return translations[currentLanguage][key];
    }

    // Function to update the text content of elements based on dynamic translations
    function updateDynamicText(language) {
        const dynamicTextElements = document.querySelectorAll('[data-key]');
        dynamicTextElements.forEach(element => {
            const key = element.getAttribute('data-key');
            if (key) {
                element.textContent = translations[language][key];
            }
        });

        selectToneButton.textContent = translations[language]['selectToneButton'];
        emailButton.textContent = translations[language]['sendEmail'];
    }

    // Function to reset the chat to the initial state
    function resetChat() {
        chatBody.innerHTML = '';
        currentStep = 'userEmail';
        userEmail = '';
        userName = '';
        recipientEmails = '';
        recipientName = '';
        promptMessage = '';
        selectedTone = 'formal';
        messageInput.value = '';
        messageInput.disabled = false;
        toneSelection.style.display = 'none';
        emailButton.style.display = 'none';
        errorDisplayed = false;
        appendMessage('received', getTranslation('enterEmail'), 'enterEmail');
    }
});

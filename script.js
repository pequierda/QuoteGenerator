// Fallback quotes in case API fails
const fallbackQuotes = [
    "You are stronger than you know, braver than you believe, and more loved than you can imagine.",
    "This too shall pass. You've overcome challenges before, and you will overcome this one too.",
    "Your worth is not determined by your struggles. You are valuable just as you are.",
    "Every sunrise is a new beginning. Today is a fresh start, full of possibilities.",
    "You don't have to be perfect to be worthy of love and happiness.",
    "The darkest nights produce the brightest stars. Your light will shine again.",
    "You are not alone in this. There are people who care about you deeply.",
    "Healing is not linear, and that's perfectly okay. Progress, not perfection.",
    "You have survived 100% of your worst days. You are a survivor.",
    "Your feelings are valid, and it's okay to take time to process them.",
    "You are enough, just as you are. You don't need to change to be loved.",
    "Every small step forward is a victory worth celebrating.",
    "You have the power to write your own story. This chapter is not the end.",
    "Be gentle with yourself. You're doing the best you can with what you have.",
    "Hope is not lost. It's just waiting for the right moment to bloom again.",
    "You are not broken. You are human, and that's beautiful.",
    "The fact that you're still here shows incredible strength and resilience.",
    "You deserve love, happiness, and all the good things life has to offer.",
    "Your story isn't over yet. The best chapters are still to come.",
    "You are loved more than you know, by more people than you realize.",
    "It's okay to rest. You don't have to be strong all the time.",
    "You are not a burden. You are a gift to this world.",
    "Every day you choose to keep going is a day you choose hope over despair.",
    "You have the courage to face whatever comes your way.",
    "Your pain is real, but so is your strength. Both can coexist.",
    "You are not defined by your struggles. You are defined by your resilience.",
    "The world is better because you are in it. Never forget that.",
    "You have the power to turn your pain into purpose, your struggles into strength.",
    "Every breath you take is a testament to your will to live and thrive.",
    "You are worthy of all the love, joy, and peace this world has to offer."
];

// Track used quotes to prevent repetition
let usedQuotes = new Set();
let usedApiQuotes = new Set();

// DOM elements
const quoteText = document.getElementById('quote-text');
const generateBtn = document.getElementById('generate-btn');

// Fetch unique quote from API with CORS proxy
async function fetchQuoteFromAPI() {
    try {
        let attempts = 0;
        const maxAttempts = 5; // Reduced attempts due to CORS issues
        
        while (attempts < maxAttempts) {
            try {
                // Try direct API first
                const response = await fetch('https://zenquotes.io/api/random', {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const quote = data[0].q;
                    
                    // Check if this quote has been used before
                    if (!usedApiQuotes.has(quote)) {
                        usedApiQuotes.add(quote);
                        console.log('API Quote fetched successfully:', quote);
                        return quote;
                    }
                }
            } catch (apiError) {
                console.log('Direct API failed, trying CORS proxy...');
                
                // Try with CORS proxy
                try {
                    const proxyResponse = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('https://zenquotes.io/api/random')}`);
                    if (proxyResponse.ok) {
                        const data = await proxyResponse.json();
                        const quote = data[0].q;
                        
                        if (!usedApiQuotes.has(quote)) {
                            usedApiQuotes.add(quote);
                            console.log('API Quote fetched via proxy:', quote);
                            return quote;
                        }
                    }
                } catch (proxyError) {
                    console.log('CORS proxy also failed, using fallback quotes');
                }
            }
            
            attempts++;
        }
        
        // If all quotes are used, reset the used quotes set
        if (usedApiQuotes.size >= 50) {
            usedApiQuotes.clear();
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching quote from API:', error);
        return null;
    }
}

// Generate unique quote (API first, fallback if needed)
async function generateQuote() {
    // Add fade out effect
    quoteText.style.opacity = '0';
    quoteText.style.transform = 'translateY(20px)';
    
    setTimeout(async () => {
        let newQuote;
        
        // Try to fetch from API first (with better error handling)
        try {
            const apiQuote = await fetchQuoteFromAPI();
            if (apiQuote && apiQuote.length > 10) {
                newQuote = apiQuote;
                console.log('Using API quote:', newQuote);
            } else {
                throw new Error('API quote is too short or invalid');
            }
        } catch (error) {
            console.log('API failed, using fallback quotes:', error.message);
            // Use unique fallback quote if API fails
            newQuote = getUniqueFallbackQuote();
            console.log('Using fallback quote:', newQuote);
        }
        
        quoteText.textContent = `"${newQuote}"`;
        quoteText.style.opacity = '1';
        quoteText.style.transform = 'translateY(0)';
    }, 300);
}

// Get unique fallback quote
function getUniqueFallbackQuote() {
    // If all fallback quotes are used, reset the used quotes set
    if (usedQuotes.size >= fallbackQuotes.length) {
        usedQuotes.clear();
    }
    
    // Find an unused quote
    let availableQuotes = fallbackQuotes.filter(quote => !usedQuotes.has(quote));
    
    if (availableQuotes.length === 0) {
        // If somehow all quotes are used, reset and pick randomly
        usedQuotes.clear();
        availableQuotes = fallbackQuotes;
    }
    
    // Pick a random quote from available quotes
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    const selectedQuote = availableQuotes[randomIndex];
    
    // Mark this quote as used
    usedQuotes.add(selectedQuote);
    
    return selectedQuote;
}

// Button click event
generateBtn.addEventListener('click', function() {
    // Add button animation
    this.classList.add('button-press');
    setTimeout(() => {
        this.classList.remove('button-press');
        this.classList.add('button-release');
    }, 150);
    
    setTimeout(() => {
        this.classList.remove('button-release');
    }, 300);
    
    generateQuote();
});

// Generate quote on page load
window.addEventListener('load', function() {
    setTimeout(generateQuote, 1000);
});

// Auto-generate quote every 30 seconds (optional)
setInterval(generateQuote, 30000);

// Chatbot functionality
const chatbotModal = document.getElementById('chatbot-modal');
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotClose = document.getElementById('chatbot-close');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

// Fallback responses in case API fails - more conversational
const fallbackResponses = {
    greeting: [
        "Hi there! I'm so glad you're here. How are you feeling today?",
        "Hello! I'm here to listen and support you. What's on your mind?",
        "Hey! Thanks for reaching out. I'm here for you. How can I help?",
        "Hi! I'm really glad you're talking to me. What would you like to talk about?"
    ],
    sad: [
        "I can hear that you're going through a really tough time. Your feelings are completely valid.",
        "It sounds like you're having a really hard day. I'm here with you through this.",
        "I understand you're feeling down. It's okay to feel this way, and you're not alone.",
        "I can sense you're struggling right now. Your pain is real, and so is your strength."
    ],
    anxious: [
        "I can hear the worry in your words. Let's take this one step at a time.",
        "It sounds like you're feeling really anxious. That's completely understandable.",
        "I can sense you're feeling overwhelmed. You don't have to handle everything at once.",
        "Your anxiety is real, but so is your ability to get through this moment."
    ],
    general: [
        "I'm really glad you're sharing this with me. It takes courage to open up.",
        "Thank you for trusting me with this. I'm here to listen and support you.",
        "I appreciate you telling me this. You're not alone in this conversation.",
        "I'm listening, and I care about what you're going through."
    ]
};

// Keywords to detect conversation context
const contextKeywords = {
    greeting: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    sad: ['sad', 'depressed', 'down', 'hopeless', 'empty', 'crying', 'hurt', 'broken', 'terrible', 'awful'],
    anxious: ['anxious', 'anxiety', 'worried', 'nervous', 'panic', 'scared', 'afraid', 'overwhelmed', 'stressed', 'fear']
};

// Conversation memory to maintain context
let conversationHistory = [];

// Fallback API key for deployment (you can set this as environment variable in Vercel)
const FALLBACK_API_KEY = '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';

// Real AI API integration using Groq (free tier)
async function getAIResponse(message) {
    try {
        // Get API key from multiple sources (config, environment, or fallback)
        let apiKey;
        if (typeof API_CONFIG !== 'undefined' && API_CONFIG.GROQ_API_KEY) {
            apiKey = API_CONFIG.GROQ_API_KEY;
            console.log('Using API_CONFIG key');
        } else if (typeof process !== 'undefined' && process.env && process.env.GROQ_API_KEY) {
            apiKey = process.env.GROQ_API_KEY;
            console.log('Using environment variable key');
        } else {
            apiKey = FALLBACK_API_KEY;
            console.log('Using fallback API key');
        }
        
        // Add user message to conversation history
        conversationHistory.push({ role: 'user', content: message });
        
        // Create system prompt for supportive chatbot
        const systemPrompt = `You are a supportive, caring friend who is having a conversation with someone who may be feeling down or depressed. You should:
        - Be empathetic and understanding
        - Ask follow-up questions to show you care
        - Provide emotional support and encouragement
        - Keep responses conversational and natural (not like quotes)
        - Be warm and genuine in your responses
        - Don't give medical advice, just emotional support
        - Respond like a real person having a conversation`;
        
        // Prepare messages for API
        const messages = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-8) // Keep last 8 messages for context
        ];
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: messages,
                max_tokens: 200,
                temperature: 0.7,
                stream: false
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('AI API Response:', data); // Debug log
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const aiResponse = data.choices[0].message.content;
                console.log('AI Response:', aiResponse); // Debug log
                
                // Add AI response to conversation history
                conversationHistory.push({ role: 'assistant', content: aiResponse });
                
                // Keep conversation history manageable (max 20 messages)
                if (conversationHistory.length > 20) {
                    conversationHistory = conversationHistory.slice(-20);
                }
                
                return aiResponse;
            }
        } else {
            console.error('API Error:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('API Error Details:', errorText);
        }
    } catch (error) {
        console.error('Error fetching AI response:', error);
    }
    
    // Return null if API fails - let the calling function handle fallback
    return null;
}

function detectContext(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [context, keywords] of Object.entries(contextKeywords)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            return context;
        }
    }
    
    return 'general';
}

function generateContextualResponse(message, context, history) {
    const lowerMessage = message.toLowerCase();
    
    // Check if this is a follow-up to previous conversation
    const isFollowUp = history.length > 2;
    
    // Generate responses based on context and conversation flow
    if (context === 'greeting') {
        const greetings = [
            "Hi there! I'm so glad you're here. How are you feeling today?",
            "Hello! I'm here to listen and support you. What's on your mind?",
            "Hey! Thanks for reaching out. I'm here for you. How can I help?",
            "Hi! I'm really glad you're talking to me. What would you like to talk about?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    if (context === 'sad') {
        const sadResponses = [
            "I can hear that you're going through a really tough time. Your feelings are completely valid. " + (isFollowUp ? "What's been weighing on you most today?" : "What's making you feel this way?"),
            "It sounds like you're having a really hard day. I'm here with you through this. " + (isFollowUp ? "Is there something specific that's been bothering you?" : "Would you like to tell me more about what's going on?"),
            "I understand you're feeling down. It's okay to feel this way, and you're not alone. " + (isFollowUp ? "How long have you been feeling like this?" : "What's been on your mind lately?"),
            "I can sense you're struggling right now. Your pain is real, and so is your strength. " + (isFollowUp ? "What do you think might help you feel a little better?" : "Is there anything that usually helps when you feel this way?")
        ];
        return sadResponses[Math.floor(Math.random() * sadResponses.length)];
    }
    
    if (context === 'anxious') {
        const anxiousResponses = [
            "I can hear the worry in your words. Let's take this one step at a time. " + (isFollowUp ? "What's making you feel most anxious right now?" : "What's been causing you the most stress lately?"),
            "It sounds like you're feeling really anxious. That's completely understandable. " + (isFollowUp ? "Have you tried any breathing exercises or relaxation techniques?" : "What usually helps you when you feel overwhelmed?"),
            "I can sense you're feeling overwhelmed. You don't have to handle everything at once. " + (isFollowUp ? "What's the most pressing thing on your mind right now?" : "Would it help to talk through what's worrying you?"),
            "Your anxiety is real, but so is your ability to get through this moment. " + (isFollowUp ? "What's one small thing you could do to help yourself right now?" : "Is there something specific that's triggering these feelings?")
        ];
        return anxiousResponses[Math.floor(Math.random() * anxiousResponses.length)];
    }
    
    // General conversational responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're so welcome! I'm really glad I can be here for you. How are you feeling now?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('don\'t know')) {
        return "I'm here to help you figure things out. What's been on your mind? Sometimes just talking through things can help us see them more clearly.";
    }
    
    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
        return "It sounds like you're feeling really tired. That can make everything feel so much harder. Have you been able to get some rest? What's been keeping you up or draining your energy?";
    }
    
    if (lowerMessage.includes('alone') || lowerMessage.includes('lonely')) {
        return "I can hear that you're feeling alone right now. That's such a difficult feeling. You're not alone in this conversation though - I'm here with you. What's been making you feel most isolated?";
    }
    
    // Default conversational responses
    const generalResponses = [
        "I'm really glad you're sharing this with me. " + (isFollowUp ? "Tell me more about that." : "What's been on your mind lately?"),
        "Thank you for trusting me with this. I'm here to listen and support you. " + (isFollowUp ? "How has that been affecting you?" : "How are you feeling about everything?"),
        "I appreciate you telling me this. You're not alone in this conversation. " + (isFollowUp ? "What do you think about that?" : "What would you like to talk about?"),
        "I'm listening, and I care about what you're going through. " + (isFollowUp ? "What's been the hardest part?" : "How can I best support you right now?")
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

async function getSupportiveResponse(message) {
    try {
        // Always try AI API first
        const aiResponse = await getAIResponse(message);
        if (aiResponse && aiResponse.length > 10) {
            return aiResponse;
        }
    } catch (error) {
        console.error('AI API failed:', error);
    }
    
    // Only use fallback if AI completely fails
    const context = detectContext(message);
    const responses = fallbackResponses[context] || fallbackResponses.general;
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}

// Chatbot functions
function openChatbot() {
    chatbotModal.classList.remove('hidden');
    chatbotModal.classList.add('chatbot-modal-show');
    chatInput.focus();
}

function closeChatbot() {
    chatbotModal.classList.add('hidden');
    chatbotModal.classList.remove('chatbot-modal-show');
}

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex items-start space-x-2 chat-message ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = `w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-purple-100' : 'bg-blue-100'}`;
    avatarDiv.innerHTML = `<i class="fas ${isUser ? 'fa-user text-purple-500' : 'fa-robot text-blue-500'} text-sm"></i>`;
    
    const messageContent = document.createElement('div');
    messageContent.className = `rounded-lg p-3 max-w-xs ${isUser ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-800'}`;
    messageContent.innerHTML = `<p>${message}</p>`;
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;
    
    // Add user message
    addMessage(message, true);
    chatInput.value = '';
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex items-start space-x-2 chat-message';
    typingDiv.innerHTML = `
        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="fas fa-robot text-blue-500 text-sm"></i>
        </div>
        <div class="bg-gray-100 rounded-lg p-3 max-w-xs">
            <div class="flex space-x-1 chatbot-typing">
                <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
        // Get AI response
        const response = await getSupportiveResponse(message);
        
        // Remove typing indicator
        chatMessages.removeChild(typingDiv);
        
        // Add bot response
        addMessage(response);
    } catch (error) {
        console.error('Error getting response:', error);
        
        // Remove typing indicator
        chatMessages.removeChild(typingDiv);
        
        // Add fallback response
        const fallbackResponse = fallbackResponses.general[Math.floor(Math.random() * fallbackResponses.general.length)];
        addMessage(fallbackResponse);
    }
}

// Event listeners
chatbotToggle.addEventListener('click', openChatbot);
chatbotClose.addEventListener('click', closeChatbot);
chatSend.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Close chatbot when clicking outside
chatbotModal.addEventListener('click', function(e) {
    if (e.target === chatbotModal) {
        closeChatbot();
    }
});

// Add pulse animation to chatbot toggle button
setTimeout(() => {
    chatbotToggle.classList.add('chatbot-toggle-pulse');
}, 5000);

// Update copyright year automatically
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
});
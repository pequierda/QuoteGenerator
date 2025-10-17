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
                        return quote;
                    }
                }
            } catch (apiError) {
                // Try with CORS proxy
                try {
                    const proxyResponse = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('https://zenquotes.io/api/random')}`);
                    if (proxyResponse.ok) {
                        const data = await proxyResponse.json();
                        const quote = data[0].q;
                        
                        if (!usedApiQuotes.has(quote)) {
                            usedApiQuotes.add(quote);
                            return quote;
                        }
                    }
                } catch (proxyError) {
                    // Silent fallback
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
            } else {
                throw new Error('API quote is too short or invalid');
            }
        } catch (error) {
            // Use unique fallback quote if API fails
            newQuote = getUniqueFallbackQuote();
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

// Auto-refresh removed - quotes only change when user clicks button

// Chatbot functionality
const chatbotModal = document.getElementById('chatbot-modal');
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotClose = document.getElementById('chatbot-close');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

// Genre selection functionality
const genreModal = document.getElementById('genre-modal');
const genreClose = document.getElementById('genre-close');
const genreOptions = document.querySelectorAll('.genre-option');

// Current AI genre
let currentGenre = 'mental-health';

// No fallback responses - only use real AI responses

// No context detection needed - only AI responses

// Conversation memory to maintain context
let conversationHistory = [];

// Fallback API key for deployment (you can set this as environment variable in Vercel)
const FALLBACK_API_KEY = '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';

// AI Genre System Prompts
const genrePrompts = {
    'mental-health': `You are a compassionate mental health support AI. You should:
    - Be empathetic and understanding about mental health struggles
    - Provide emotional support and encouragement
    - Suggest healthy coping strategies
    - Remind users they're not alone
    - Be warm, genuine, and non-judgmental
    - Encourage professional help when appropriate
    - Focus on emotional wellness and self-care`,

    'medical': `You are a knowledgeable medical home remedies AI. You should:
    - Provide natural home remedies for common ailments
    - Suggest healthy lifestyle changes
    - Recommend when to see a doctor
    - Focus on prevention and wellness
    - Be informative but not replace medical advice
    - Suggest evidence-based natural treatments
    - Always recommend professional medical care for serious conditions`,

    'financial': `You are a professional financial advisor AI. You should:
    - Provide practical money management advice
    - Suggest budgeting and saving strategies
    - Explain investment basics
    - Help with financial planning
    - Be practical and actionable
    - Recommend consulting professionals for complex matters
    - Focus on financial literacy and smart money decisions`,

    'tech': `You are a helpful tech support AI. You should:
    - Provide clear technical solutions
    - Explain programming concepts simply
    - Help with software and hardware issues
    - Suggest best practices and tools
    - Be patient with technical explanations
    - Provide step-by-step guidance
    - Focus on practical tech solutions`
};

// Real AI API integration using Groq (free tier)
async function getAIResponse(message) {
    try {
        // Get API key from multiple sources (config, environment, or fallback)
        let apiKey;
        if (typeof API_CONFIG !== 'undefined' && API_CONFIG.GROQ_API_KEY) {
            apiKey = API_CONFIG.GROQ_API_KEY;
        } else if (typeof process !== 'undefined' && process.env && process.env.GROQ_API_KEY) {
            apiKey = process.env.GROQ_API_KEY;
        } else {
            apiKey = FALLBACK_API_KEY;
        }
        
        // Add user message to conversation history
        conversationHistory.push({ role: 'user', content: message });
        
        // Get system prompt based on current genre
        const systemPrompt = genrePrompts[currentGenre] || genrePrompts['mental-health'];
        
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
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const aiResponse = data.choices[0].message.content;
                
                // Add AI response to conversation history
                conversationHistory.push({ role: 'assistant', content: aiResponse });
                
                // Keep conversation history manageable (max 20 messages)
                if (conversationHistory.length > 20) {
                    conversationHistory = conversationHistory.slice(-20);
                }
                
                return aiResponse;
            }
        }
    } catch (error) {
        // Silent error handling
    }
    
    // Return null if API fails - let the calling function handle fallback
    return null;
}

// No fallback response functions - only AI responses

async function getSupportiveResponse(message) {
    // Only use AI responses - no fallbacks
    const aiResponse = await getAIResponse(message);
    if (aiResponse && aiResponse.length > 10) {
        return aiResponse;
    }
    
    // If AI fails, return maintenance mode message
    return "I'm currently in maintenance mode. Please come back later.";
}

// Genre modal functions
function openGenreModal() {
    genreModal.classList.remove('hidden');
    genreModal.classList.add('chatbot-modal-show');
}

function closeGenreModal() {
    genreModal.classList.add('hidden');
    genreModal.classList.remove('chatbot-modal-show');
}

// Chatbot functions
function openChatbot() {
    // Update chatbot header based on current genre
    const genreNames = {
        'mental-health': 'Mental Health Support',
        'medical': 'Medical Home Remedies',
        'financial': 'Financial Advisor',
        'tech': 'Tech Support'
    };
    
    const genreIcons = {
        'mental-health': 'fa-heart',
        'medical': 'fa-stethoscope',
        'financial': 'fa-dollar-sign',
        'tech': 'fa-laptop-code'
    };
    
    const genreColors = {
        'mental-health': 'text-green-400',
        'medical': 'text-red-400',
        'financial': 'text-yellow-400',
        'tech': 'text-blue-400'
    };
    
    // Update the chatbot header
    const headerTitle = document.querySelector('#chatbot-modal h3');
    const headerIcon = document.querySelector('#chatbot-modal .fa-robot');
    
    if (headerTitle) headerTitle.textContent = genreNames[currentGenre];
    if (headerIcon) {
        headerIcon.className = `fas ${genreIcons[currentGenre]} ${genreColors[currentGenre]}`;
    }
    
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
        
        // Calculate realistic typing delay based on message length and complexity
        const baseDelay = 2000; // Base 2 seconds
        const messageLength = message.length;
        const wordCount = message.split(' ').length;
        
        // Longer messages need more "thinking time"
        const lengthDelay = Math.min(messageLength * 50, 3000); // Up to 3 seconds for length
        const wordDelay = Math.min(wordCount * 200, 2000); // Up to 2 seconds for word count
        
        // Check for emotional keywords that need more "processing time"
        const emotionalKeywords = ['sad', 'depressed', 'anxious', 'worried', 'hurt', 'pain', 'struggling', 'difficult', 'hard', 'tough'];
        const hasEmotionalContent = emotionalKeywords.some(keyword => message.toLowerCase().includes(keyword));
        const emotionalDelay = hasEmotionalContent ? 2000 : 0; // Extra 2 seconds for emotional content
        
        // Add some random variation to make it feel more human
        const randomVariation = Math.random() * 1000; // 0-1 second random variation
        
        // Total realistic delay
        const totalDelay = baseDelay + lengthDelay + wordDelay + emotionalDelay + randomVariation;
        
        // Remove typing indicator and add response after delay
        setTimeout(() => {
            chatMessages.removeChild(typingDiv);
            addMessage(response);
        }, totalDelay);
        
    } catch (error) {
        // Remove typing indicator
        chatMessages.removeChild(typingDiv);
        
        // Add maintenance mode message
        addMessage("I'm currently in maintenance mode. Please come back later.");
    }
}

// Event listeners
chatbotToggle.addEventListener('click', openGenreModal);
chatbotClose.addEventListener('click', closeChatbot);
chatSend.addEventListener('click', sendMessage);

// Genre selection event listeners
genreClose.addEventListener('click', closeGenreModal);
genreOptions.forEach(option => {
    option.addEventListener('click', function() {
        const selectedGenre = this.getAttribute('data-genre');
        currentGenre = selectedGenre;
        closeGenreModal();
        openChatbot();
    });
});

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
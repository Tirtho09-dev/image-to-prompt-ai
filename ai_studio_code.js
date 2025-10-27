async function callGeminiAPI(prompt) {
    const API_KEY = "AIzaSyCWeKXv8kdaEqMnyLrzkN-_UvAW_oAKNJo"; // আপনার API কী এখানে দিন
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// উদাহরণ ব্যবহার
document.getElementById('sendButton').addEventListener('click', async () => {
    const userPrompt = document.getElementById('userInput').value;
    const modelResponse = await callGeminiAPI(userPrompt);
    document.getElementById('outputArea').innerText = modelResponse;
});
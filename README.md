<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/19km9ueiGDiLEE87rqo-Jv_1BGEhM0kzA

## Run Locally

**Prerequisites:**
- Node.js
- PHP 8.1+
- Composer

1. **Install Frontend Dependencies:**
   `npm install`

2. **Install Backend Dependencies:**
   `cd api && composer install && cd ..`

3. **Set Environment Variables:**
   Create a `.env.local` file in the root and add your Gemini API key:
   `GEMINI_API_KEY=your_api_key_here`

4. **Run the Application:**
   - In one terminal, run the PHP backend server:
     `php -S localhost:8000 -t .`
   - In a second terminal, run the Vite frontend dev server:
     `npm run dev`

Your application will be available at `http://localhost:3000`.

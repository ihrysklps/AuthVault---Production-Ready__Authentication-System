export function generateOTP(){
    return Math.floor(100000 + Math.random()*900000).toString();
}
export function getOTPHtml(otp){
  return `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
      }

      .container {
        max-width: 500px;
        margin: auto;
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      h2 {
        color: #333;
      }

      .otp {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        letter-spacing: 4px;
        margin: 20px 0;
      }

      p {
        color: #666;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Your OTP Code</h2>
      <p class="otp">${otp}</p>
      <p>Please use this code to verify your email address.</p>
      <p>This OTP will expire in 10 minutes.</p>
    </div>
  </body>
  </html> `;
}

"""
Отправка кода подтверждения на email пользователя для регистрации/входа в MR CAT.
Генерирует 6-значный код, сохраняет в БД и отправляет письмо через SMTP.
"""
import json
import os
import random
import smtplib
import string
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import psycopg2


def handler(event: dict, context) -> dict:
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    email = (body.get("email") or "").strip().lower()

    if not email or "@" not in email:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Некорректный email"}),
        }

    code = "".join(random.choices(string.digits, k=6))
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute(
        "DELETE FROM mrcat_email_codes WHERE email = %s",
        (email,)
    )
    cur.execute(
        "INSERT INTO mrcat_email_codes (email, code, expires_at) VALUES (%s, %s, %s)",
        (email, code, expires_at)
    )
    conn.commit()
    cur.close()
    conn.close()

    _send_email(email, code)

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"ok": True, "message": "Код отправлен на " + email}),
    }


def _send_email(to_email: str, code: str):
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ["SMTP_USER"]
    smtp_pass = os.environ["SMTP_PASS"]

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"🐱 Ваш код MR CAT: {code}"
    msg["From"] = f"MR CAT <{smtp_user}>"
    msg["To"] = to_email

    html = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0E1117;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0E1117;padding:40px 0;">
        <tr><td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#161B26;border-radius:24px;overflow:hidden;border:1px solid rgba(255,107,26,0.2);">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#FF6B1A,#FF4500);padding:32px;text-align:center;">
                <div style="font-size:48px;margin-bottom:8px;">🐱</div>
                <h1 style="color:white;margin:0;font-size:28px;font-weight:900;letter-spacing:-0.5px;">MR CAT</h1>
                <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px;">Защищённый мессенджер</p>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:40px 40px 32px;">
                <h2 style="color:white;font-size:20px;font-weight:700;margin:0 0 12px;">Код подтверждения</h2>
                <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 28px;line-height:1.6;">
                  Для входа в MR CAT введите этот код в приложении.<br>
                  Код действителен <strong style="color:rgba(255,255,255,0.8);">10 минут</strong>.
                </p>
                <!-- Code block -->
                <div style="background:rgba(255,107,26,0.1);border:2px solid rgba(255,107,26,0.3);border-radius:16px;padding:24px;text-align:center;margin-bottom:28px;">
                  <span style="font-size:42px;font-weight:900;color:#FF6B1A;letter-spacing:12px;font-family:monospace;">{code}</span>
                </div>
                <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;line-height:1.5;">
                  Если вы не запрашивали код — просто проигнорируйте это письмо.<br>
                  🔒 Все сообщения защищены сквозным шифрованием E2E.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
                <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0;">
                  © 2026 MR CAT · Без рекламы · Open Protocol
                </p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
    """

    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.ehlo()
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, to_email, msg.as_string())

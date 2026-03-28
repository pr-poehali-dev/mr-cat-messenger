"""
Проверка кода подтверждения email для входа в MR CAT.
Сверяет код с БД, проверяет срок действия, возвращает токен сессии.
"""
import json
import os
import secrets
from datetime import datetime

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
    code = (body.get("code") or "").strip()

    if not email or not code:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Email и код обязательны"}),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute(
        "SELECT code, expires_at FROM mrcat_email_codes WHERE email = %s ORDER BY created_at DESC LIMIT 1",
        (email,)
    )
    row = cur.fetchone()

    if not row:
        cur.close()
        conn.close()
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Код не найден. Запросите новый."}),
        }

    db_code, expires_at = row

    if datetime.utcnow() > expires_at:
        cur.execute("DELETE FROM mrcat_email_codes WHERE email = %s", (email,))
        conn.commit()
        cur.close()
        conn.close()
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Код истёк. Запросите новый."}),
        }

    if code != db_code:
        cur.close()
        conn.close()
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Неверный код"}),
        }

    cur.execute("DELETE FROM mrcat_email_codes WHERE email = %s", (email,))

    cur.execute("SELECT id, name, nickname FROM mrcat_users WHERE email = %s", (email,))
    user_row = cur.fetchone()

    is_new = user_row is None
    if is_new:
        cur.execute(
            "INSERT INTO mrcat_users (email) VALUES (%s) RETURNING id",
            (email,)
        )
        user_id = cur.fetchone()[0]
        name = ""
        nickname = ""
    else:
        user_id, name, nickname = user_row

    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({
            "ok": True,
            "is_new": is_new,
            "user_id": user_id,
            "name": name or "",
            "nickname": nickname or "",
        }),
    }

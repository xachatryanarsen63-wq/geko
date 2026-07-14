# Forkick Backend

Django REST API for the Forkick football apparel storefront.

## Stack

- Django 5
- Django REST Framework
- Simple JWT (authentication)
- django-cors-headers

## Setup

```bash
cd back
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

API base URL: `http://127.0.0.1:8000/api/`

## API Endpoints

### Auth (JWT)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | No | Create account |
| POST | `/api/auth/login/` | No | Get access + refresh tokens |
| POST | `/api/auth/refresh/` | No | Refresh access token |
| GET | `/api/auth/me/` | Yes | Current user profile |

**Register body:**
```json
{
  "username": "player1",
  "email": "player@example.com",
  "password": "securepass",
  "password_confirm": "securepass"
}
```

**Login body:**
```json
{
  "username": "player1",
  "password": "securepass"
}
```

**Login response:**
```json
{
  "access": "<jwt-access-token>",
  "refresh": "<jwt-refresh-token>"
}
```

Use `Authorization: Bearer <access>` for protected routes.

### Catalog (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories/` | All categories |
| GET | `/api/products/` | Products (filters: `?category=`, `?badge=`, `?featured=true`, `?best_seller=true`) |
| GET | `/api/products/hero/` | Hero product |
| GET | `/api/products/<slug>/` | Product detail |
| GET | `/api/testimonials/` | Player reviews |
| POST | `/api/newsletter/` | Subscribe `{"email": "..."}` |

### Cart (authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/` | View cart |
| DELETE | `/api/cart/` | Clear cart |
| POST | `/api/cart/add/` | Add item `{"product_id": 1, "size": "M", "color": "Forest", "quantity": 1}` |
| PATCH | `/api/cart/items/<id>/` | Update quantity `{"quantity": 2}` |
| DELETE | `/api/cart/items/<id>/` | Remove item |

### Wishlist (authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist/` | List wishlist |
| POST | `/api/wishlist/` | Add `{"product_id": 1}` |
| DELETE | `/api/wishlist/<product_id>/` | Remove |

## CORS

Default allowed origins include Live Server (`:5500`) and `:3000`. Override via `.env`:

```
CORS_ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

## Admin

```bash
python manage.py createsuperuser
```

Admin panel: `http://127.0.0.1:8000/admin/`

# 👤 User Management API

Sistem backend untuk manajemen user menggunakan **Express.js**, **PostgreSQL**, dan **Cloudinary**. Mendukung fitur register, login, upload avatar, dan update profil dengan autentikasi JWT.

---

## 🚀 Fitur

- Register dan login user
- Upload avatar ke Cloudinary
- Update profil dengan validasi
- Proteksi endpoint dengan JWT
- Dokumentasi API via Postman

---

## ⚙️ Instalasi

```bash
git clone https://github.com/nindya/user-management-api.git
cd user-management-api
npm install

📸 Contoh Upload Avatar
Endpoint: POST/api/users/avatar
• 	Body: form-data
• 	Key: file → Type:  file → Value: download.jpg
• 	Response: 
{
  "message": "Avatar uploaded successfully",
  "avatar": "https://res.cloudinary.com/degfrwbyi/image/upload/v1760785390/avatars/download.jpg"
}

🧰 Tools yang Digunakan
•   Express.js
• 	PostgreSQL + DBeaver
• 	JWT (jsonwebtoken)
• 	Cloudinary
• 	Postman
• 	bcryptjs
• 	dotenv

👩‍💻 Author
Nindya Sekartaji
Mahasiswa Sistem Informasi – Universitas Negeri Surabaya
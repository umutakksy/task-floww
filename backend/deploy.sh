#!/bin/bash

# Task-Floww Backend Deployment Script
# Bu script GitHub'dan kodları çeker, Docker imajını derler ve sistemi yeniden başlatır.

echo "------------------------------------------"
echo "🚀 Task-Floww Deployment Başlatılıyor..."
echo "------------------------------------------"

# 1. GitHub'dan en güncel kodları çek
echo "📥 Git pull yapılıyor..."
git pull origin main

# 2. Servisleri durdur
echo "🛑 Eski servisler durduruluyor..."
docker-compose down

# 3. Docker imajını sıfırdan derle ve ayağa kaldır
# --build bayrağı ile Dockerfile içindeki multi-stage build tetiklenir
echo "🏗️ Docker build ve up işlemi başlatılıyor..."
docker-compose up -d --build

# 4. Kullanılmayan eski imajları temizle (Yer kazanmak için)
echo "🧹 Sistem temizleniyor..."
docker image prune -f

echo "------------------------------------------"
echo "✅ Dağıtım başarıyla tamamlandı!"
echo "🌐 Backend: https://task-floww.seedhr.com.tr"
echo "📜 Logları izlemek için: docker-compose logs -f backend"
echo "------------------------------------------"

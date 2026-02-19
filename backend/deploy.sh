#!/bin/bash
# Task-Floww Deployment Script

echo "🚀 Sunucu dağıtımı başlatılıyor..."

# 1. Eski konteynerleri durdur ve temizle
echo "🛑 Eski servisler durduruluyor..."
docker-compose down

# 2. Docker imajını oluştur ve servisleri başlat
echo "🏗️ Yeni imaj derleniyor ve servisler ayağa kaldırılıyor..."
docker-compose up -d --build

# 3. Gereksiz imajları temizle (isteğe bağlı, sunucuda yer açar)
echo "🧹 Sistem temizliği yapılıyor..."
docker image prune -f

echo "✅ Dağıtım başarıyla tamamlandı!"
echo "📜 Logları izlemek için: docker-compose logs -f backend"

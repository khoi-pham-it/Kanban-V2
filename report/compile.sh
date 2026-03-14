#!/bin/bash

echo "🧹 Đang dọn dẹp file tạm..."
rm -f *.aux *.log *.toc *.out chapters/*.aux

echo "🚀 Compile lần 1 (Tạo cấu trúc)..."
# Tắt interaction=nonstopmode để nếu có lỗi thì dừng lại cho bạn xem ngay
xelatex -halt-on-error main.tex > /dev/null

echo "🔄 Compile lần 2 (Cập nhật Mục lục & Tọa độ TikZ)..."
xelatex -halt-on-error main.tex > /dev/null

echo "✨ Compile lần 3 (Hoàn thiện)..."
xelatex -halt-on-error main.tex

echo "✅ Đã xong! Mở file main.pdf để kiểm tra."

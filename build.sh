#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "========================================="
echo "Building Sahayak (Frontend + Backend)..."
echo "========================================="

# 1. Install frontend dependencies and build React bundle
echo "--> Building React Frontend..."
npm --prefix frontend install
npm --prefix frontend run build

# 2. Install backend Python dependencies
echo "--> Installing Python Backend Requirements..."
pip install -r backend/requirements.txt

echo "========================================="
echo "Sahayak Build Completed Successfully!"
echo "========================================="

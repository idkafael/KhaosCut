#!/bin/bash
# Script de build para copiar arquivos do frontend
echo "Copying frontend files..."
cp -r frontend/* . || true
echo "Build complete"


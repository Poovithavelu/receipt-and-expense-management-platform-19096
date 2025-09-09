#!/bin/bash
cd /home/kavia/workspace/code-generation/receipt-and-expense-management-platform-19096/receipt_processing_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


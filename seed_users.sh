#!/bin/bash
set -e

echo "=== Seeding harmonyhub-users table ==="

/home/sophiemabel78/Harmony_Marketing_Hub/aws/dist/aws dynamodb put-item \
  --table-name harmonyhub-users \
  --item '{ "id": {"S": "1"}, "email": {"S": "jsmith@example.com"}, "name": {"S": "J Smith"}, "password": {"S": "password"} }' || true

echo "=== Seeding completed successfully ==="


#!/bin/bash

# FEST Backend API Test Script
# This script tests all the API endpoints

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default to localhost, can be overridden with environment variable
API_URL=${API_URL:-"http://localhost:3001/api"}

echo -e "${YELLOW}Testing FEST Backend API${NC}"
echo -e "API URL: $API_URL"
echo "================================"

# Test 1: Health Check
echo -e "\n${YELLOW}Test 1: Health Check${NC}"
response=$(curl -s "$API_URL/health")
echo "Response: $response"

if [[ $response == *"ok"* ]]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
    exit 1
fi

# Test 2: Get All Members
echo -e "\n${YELLOW}Test 2: Get All Members${NC}"
response=$(curl -s "$API_URL/members")
echo "Response: ${response:0:200}..." # Print first 200 chars

if [[ $response == *"Rajesh Kumar"* ]]; then
    echo -e "${GREEN}✓ Get members passed${NC}"
else
    echo -e "${RED}✗ Get members failed${NC}"
    exit 1
fi

# Test 3: Get Member by ID
echo -e "\n${YELLOW}Test 3: Get Member by ID${NC}"
response=$(curl -s "$API_URL/members/1")
echo "Response: ${response:0:200}..."

if [[ $response == *"Rajesh Kumar"* ]]; then
    echo -e "${GREEN}✓ Get member by ID passed${NC}"
else
    echo -e "${RED}✗ Get member by ID failed${NC}"
    exit 1
fi

# Test 4: Login
echo -e "\n${YELLOW}Test 4: Admin Login${NC}"
response=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"password":"admin123"}')
echo "Response: $response"

if [[ $response == *"success"* ]]; then
    echo -e "${GREEN}✓ Login passed${NC}"
    TOKEN="admin123"
else
    echo -e "${RED}✗ Login failed${NC}"
    exit 1
fi

# Test 5: Verify Token
echo -e "\n${YELLOW}Test 5: Verify Token${NC}"
response=$(curl -s "$API_URL/auth/verify" \
    -H "Authorization: Bearer $TOKEN")
echo "Response: $response"

if [[ $response == *"isAdmin"* ]]; then
    echo -e "${GREEN}✓ Token verification passed${NC}"
else
    echo -e "${RED}✗ Token verification failed${NC}"
    exit 1
fi

# Test 6: Create Member (Admin)
echo -e "\n${YELLOW}Test 6: Create Member${NC}"
response=$(curl -s -X POST "$API_URL/members" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "name": "Test User",
        "role": "Tester",
        "bio": "Testing the API",
        "joinYear": 2024,
        "email": "test@example.com",
        "phone": "+91 0000000000"
    }')
echo "Response: ${response:0:200}..."

if [[ $response == *"Test User"* ]]; then
    echo -e "${GREEN}✓ Create member passed${NC}"
    # Extract ID for next tests
    MEMBER_ID=$(echo $response | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    echo "Created member ID: $MEMBER_ID"
else
    echo -e "${RED}✗ Create member failed${NC}"
    exit 1
fi

# Test 7: Update Member (Admin)
echo -e "\n${YELLOW}Test 7: Update Member${NC}"
response=$(curl -s -X PUT "$API_URL/members/$MEMBER_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "name": "Updated Test User",
        "role": "Senior Tester"
    }')
echo "Response: ${response:0:200}..."

if [[ $response == *"Updated Test User"* ]]; then
    echo -e "${GREEN}✓ Update member passed${NC}"
else
    echo -e "${RED}✗ Update member failed${NC}"
    exit 1
fi

# Test 8: Delete Member (Admin)
echo -e "\n${YELLOW}Test 8: Delete Member${NC}"
response=$(curl -s -X DELETE "$API_URL/members/$MEMBER_ID" \
    -H "Authorization: Bearer $TOKEN")
echo "Response: $response"

if [[ $response == *"success"* ]]; then
    echo -e "${GREEN}✓ Delete member passed${NC}"
else
    echo -e "${RED}✗ Delete member failed${NC}"
    exit 1
fi

# Test 9: Unauthorized Access
echo -e "\n${YELLOW}Test 9: Unauthorized Access (should fail)${NC}"
response=$(curl -s -X POST "$API_URL/members" \
    -H "Content-Type: application/json" \
    -d '{"name":"Unauthorized","role":"Hacker","joinYear":2024}')
echo "Response: $response"

if [[ $response == *"Unauthorized"* ]]; then
    echo -e "${GREEN}✓ Unauthorized access blocked correctly${NC}"
else
    echo -e "${RED}✗ Unauthorized access test failed${NC}"
    exit 1
fi

# Test 10: Invalid Login
echo -e "\n${YELLOW}Test 10: Invalid Login (should fail)${NC}"
response=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"password":"wrongpassword"}')
echo "Response: $response"

if [[ $response == *"Invalid"* ]]; then
    echo -e "${GREEN}✓ Invalid login blocked correctly${NC}"
else
    echo -e "${RED}✗ Invalid login test failed${NC}"
    exit 1
fi

# Summary
echo -e "\n================================"
echo -e "${GREEN}All tests passed! ✓${NC}"
echo -e "================================\n"

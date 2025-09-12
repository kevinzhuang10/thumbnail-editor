#!/bin/bash

# Supabase MCP Setup Script
# This script helps configure the Supabase MCP server for Claude Code

set -e

echo "🚀 Setting up Supabase MCP Server for Claude Code..."

# Check if we're in a project with .mcp.json
if [ ! -f ".mcp.json" ]; then
    echo "❌ Error: .mcp.json not found. This should be run from your project root."
    exit 1
fi

# Function to get user input with a default
get_input() {
    local prompt="$1"
    local default="$2"
    local result

    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " result
        result="${result:-$default}"
    else
        read -p "$prompt: " result
    fi
    
    echo "$result"
}

echo ""
echo "📋 You'll need these from your Supabase project:"
echo "   1. Project Reference ID (from Project Settings > General)"
echo "   2. Access Token (from Account > Access Tokens)"
echo ""

# Get project ref
PROJECT_REF=$(get_input "Enter your Supabase Project Reference ID")

# Get access token
ACCESS_TOKEN=$(get_input "Enter your Supabase Access Token")

if [ -z "$PROJECT_REF" ] || [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Error: Both Project Reference ID and Access Token are required."
    exit 1
fi

# Update .mcp.json
echo "🔧 Updating .mcp.json with your credentials..."
sed -i '' "s/<project-ref>/$PROJECT_REF/g" .mcp.json
sed -i '' "s/<access-token>/$ACCESS_TOKEN/g" .mcp.json

# Update .env.local if it exists
if [ -f ".env.local" ]; then
    echo "🔧 Updating .env.local with access token..."
    if grep -q "SUPABASE_ACCESS_TOKEN" .env.local; then
        sed -i '' "s/SUPABASE_ACCESS_TOKEN=.*/SUPABASE_ACCESS_TOKEN=$ACCESS_TOKEN/g" .env.local
    else
        echo "SUPABASE_ACCESS_TOKEN=$ACCESS_TOKEN" >> .env.local
    fi
fi

echo ""
echo "✅ Supabase MCP Server configured successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Restart Claude Code for the MCP server to take effect"
echo "2. Look for mcp__ prefixed tools in Claude Code"
echo "3. Use tools like mcp__supabase__query_database, mcp__supabase__list_tables, etc."
echo ""
echo "🔧 Available MCP tools will include:"
echo "   - Database queries and schema inspection"
echo "   - Table and column management"
echo "   - Row data operations"
echo "   - Real-time subscriptions"
echo ""
echo "🚀 MCP Server is ready! Restart Claude Code to start using it."
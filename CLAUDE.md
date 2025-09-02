# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension called "Maps" (フォームに自動入力する拡張) that provides form auto-fill functionality. The extension displays an alert when enabled.

## Architecture

The extension follows standard Chrome extension architecture with Manifest V3:

- **manifest.json**: Extension configuration with permissions for storage and content scripts for all URLs
- **content.js**: Content script that checks storage and shows an alert when the extension is enabled 
- **popup.html**: Simple UI with a checkbox to enable/disable the extension
- **popup.js**: Popup logic that manages the enabled/disabled state using Chrome storage sync API
- **icons/**: Extension icons directory

## Key Components

- Storage management uses `chrome.storage.sync` for cross-device synchronization
- Content script injection occurs on all URLs (`<all_urls>`)
- Toggle state persistence across browser sessions
- Japanese language support (UI text in Japanese)

## Development Notes

- No build process or package.json - this is a vanilla JavaScript Chrome extension
- No testing framework or linting tools configured
- Extension can be loaded directly in Chrome developer mode
- Storage operations are asynchronous and use Chrome extension APIs
# API Integration Guide

This document provides technical details about the APIs used in the Casper Era Tracker application.

## Data Sources

The application uses two primary data sources:

1.  **CSPR.cloud API**: For historical switch block data, which is used to calculate era timing and future era predictions.
2.  **CSPR.live API**: For real-time network state, including the current active era and the latest block height.

## API Endpoints

### CSPR.cloud API

-   **Endpoint**: `https://api.cspr.cloud/blocks`
-   **Method**: `GET`
-   **Parameters**:
    -   `is_switch_block=true`
    -   `order_by=block_height`
    -   `order_direction=desc`
    -   `limit=1`
-   **Authentication**: `Authorization: Bearer YOUR_API_KEY`

### CSPR.live API

-   **Endpoint**: `https://api.mainnet.cspr.live/network-state`
-   **Method**: `GET`
-   **Authentication**: None required

## Backend API Proxy

The Flask backend provides a proxy to these APIs to avoid CORS issues and protect the CSPR.cloud API key.

-   **Endpoint**: `/api/era-info`
-   **Method**: `GET`
-   **Response**: A JSON object containing combined data from both APIs.

## Cache Mechanism

The backend uses a 1-minute cache to minimize API calls and improve performance. The cache is automatically refreshed when it expires.




---

[Back to README](../README.md)


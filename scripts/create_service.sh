#!/bin/sh
SERVICE_NAME=$1
# Create a new service
3scale-cli services create --service $SERVICE_NAME --serviceName $SERVICE_NAME

#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$SCRIPT_DIR"
SERVICE_NAME="porto-backend"
SERVICE_FILE="$SERVICE_NAME.service"

echo "setting up porto backend as systemd service..."
echo "backend directory: $BACKEND_DIR"

if [ "$EUID" -ne 0 ]; then
    echo "this script must be run as root (use sudo)"
    exit 1
fi

if [ ! -f "$BACKEND_DIR/$SERVICE_FILE" ]; then
    echo "error: $SERVICE_FILE not found in $BACKEND_DIR"
    exit 1
fi

echo "creating service user if not exists..."
if ! id "porto" &>/dev/null; then
    useradd --system --no-create-home --shell /bin/false porto
    echo "created system user: porto"
else
    echo "user porto already exists"
fi

echo "setting up directory permissions..."
chown -R porto:porto "$BACKEND_DIR"
chmod -R 755 "$BACKEND_DIR"

if [ -f "$BACKEND_DIR/.env" ]; then
    chmod 600 "$BACKEND_DIR/.env"
    chown porto:porto "$BACKEND_DIR/.env"
    echo "secured .env file permissions"
fi

echo "creating systemd service file..."
sed "s|/path/to/your/porto/backend|$BACKEND_DIR|g" "$BACKEND_DIR/$SERVICE_FILE" > "/etc/systemd/system/$SERVICE_FILE"
sed -i "s|User=www-data|User=porto|g" "/etc/systemd/system/$SERVICE_FILE"
sed -i "s|Group=www-data|Group=porto|g" "/etc/systemd/system/$SERVICE_FILE"

echo "reloading systemd daemon..."
systemctl daemon-reload

echo "enabling service to start on boot..."
systemctl enable "$SERVICE_NAME"

echo "starting service..."
systemctl start "$SERVICE_NAME"

sleep 2

echo "checking service status..."
systemctl status "$SERVICE_NAME" --no-pager

echo ""
echo "service setup complete!"
echo ""
echo "useful commands:"
echo "  sudo systemctl status $SERVICE_NAME     - check service status"
echo "  sudo systemctl restart $SERVICE_NAME    - restart service"
echo "  sudo systemctl stop $SERVICE_NAME       - stop service"
echo "  sudo systemctl start $SERVICE_NAME      - start service"
echo "  sudo journalctl -u $SERVICE_NAME -f     - view live logs"
echo "  sudo journalctl -u $SERVICE_NAME        - view all logs"
echo ""
echo "service should be running on http://localhost:3501"
echo "test with: curl http://localhost:3501/health" 
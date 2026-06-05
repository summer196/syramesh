#!/usr/bin/env python3
"""
MineWeb Server
Run: python3 server.py
Then open: http://localhost:8080
"""
import http.server
import socketserver
import os

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Allow SharedArrayBuffer (needed for some WebGL features)
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        super().end_headers()

    def log_message(self, format, *args):
        print(f"[MineWeb] {self.address_string()} - {format % args}")

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"""
╔══════════════════════════════════════╗
║         MineWeb Server               ║
╠══════════════════════════════════════╣
║  URL: http://localhost:{PORT}           ║
║  Press Ctrl+C to stop                ║
╚══════════════════════════════════════╝
        """)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[MineWeb] Server stopped.")

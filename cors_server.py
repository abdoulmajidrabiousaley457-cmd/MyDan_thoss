import http.server, socketserver, os
os.chdir('/home/user/flutter_app/build/web')
class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('X-Frame-Options', 'ALLOWALL')
        self.send_header('Content-Security-Policy', 'frame-ancestors *')
        super().end_headers()
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('0.0.0.0', 5060), CORSRequestHandler) as httpd:
    httpd.serve_forever()

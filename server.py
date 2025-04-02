import http.server
import socketserver
import webbrowser

PORT = 8000
url = f"http://localhost:{PORT}"

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at {url}")
    webbrowser.open(url)
    httpd.serve_forever()
